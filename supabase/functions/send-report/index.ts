// send-report: emails the Fit and Carry PDF report after someone submits the
// contact form. Called from the browser with { response_id }.
//
// Safe to expose publicly because it only ever emails the address already
// stored with that response's lead, and only once (report_sent_at).
//
// Secrets (Supabase dashboard > Edge Functions > Secrets):
//   RESEND_API_KEY  from resend.com
//   REPORT_FROM     e.g. "Sanctuary Development Collaborative <hello@sanctuarydc.org>"
//                   (the domain must be verified in Resend)
//   NOTIFY_EMAIL    optional; gets a short note about each new lead
// SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are provided automatically.
//
// Keep content.ts in sync with src/app/exercises/fit-and-carry/content.ts
// (npm run sync:edge).

import { createClient } from 'npm:@supabase/supabase-js@2.45.4';
import { buildReport, type ReportInput } from './report.ts';
import { DRIVERS, QUADRANTS } from './content.ts';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } });

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

function toBase64(bytes: Uint8Array): string {
  let bin = '';
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(bin);
}

async function sendEmail(payload: Record<string, unknown>) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${Deno.env.get('RESEND_API_KEY')}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return json(405, { error: 'POST only' });

  let responseId: string | undefined;
  try {
    ({ response_id: responseId } = await req.json());
  } catch {
    return json(400, { error: 'Invalid JSON' });
  }
  if (!responseId || !/^[0-9a-f-]{36}$/i.test(responseId)) return json(400, { error: 'response_id required' });

  if (!Deno.env.get('RESEND_API_KEY') || !Deno.env.get('REPORT_FROM')) {
    return json(503, { error: 'Email is not configured yet' });
  }

  const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

  const { data: lead, error: leadErr } = await db
    .from('exercise_leads')
    .select('id, name, church, role, email, consent_updates, wants_conversation, report_sent_at, created_at')
    .eq('response_id', responseId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (leadErr) return json(500, { error: leadErr.message });
  if (!lead) return json(404, { error: 'No lead for that response' });
  if (lead.report_sent_at) return json(200, { ok: true, alreadySent: true });

  const { data: response, error: respErr } = await db
    .from('exercise_responses')
    .select('answers, results')
    .eq('id', responseId)
    .single();
  if (respErr || !response) return json(404, { error: 'Response not found' });

  // Claim the send first so double-clicks or retries can't send twice.
  const { data: claimed } = await db
    .from('exercise_leads')
    .update({ report_sent_at: new Date().toISOString() })
    .eq('id', lead.id)
    .is('report_sent_at', null)
    .select('id');
  if (!claimed?.length) return json(200, { ok: true, alreadySent: true });

  const results = response.results as ReportInput['results'];
  const quadrant = QUADRANTS[results.quadrant];

  try {
    const pdf = await buildReport({
      name: lead.name,
      church: lead.church,
      date: new Date(lead.created_at),
      answers: response.answers as ReportInput['answers'],
      results,
    });

    const firstName = esc(lead.name.split(/\s+/)[0] ?? lead.name);
    // Email copy drafted by Claude; edit freely.
    const html = `
      <div style="font-family: Georgia, serif; color: #2d1b0e; max-width: 560px; line-height: 1.55">
        <p>Hi ${firstName},</p>
        <p>Thank you for taking the Fit and Carry diagnostic for ${esc(lead.church)}. Your full results are attached as a PDF,
        including a walk through your drivers, so you can share them with your team.</p>
        <p style="margin: 24px 0; padding: 16px 20px; background: #f1f5ea; border-left: 4px solid #4a5a3a">
          <span style="font-size: 22px; font-weight: bold">${esc(quadrant.name)}</span><br>
          <em style="color: #4a5a3a">${esc(quadrant.question)}</em>
        </p>
        <p>A good next step is to ask a few other leaders to take it on their own, then compare. Start with any question where your answers are 2 or more points apart.</p>
        <p>If you would like to talk through what comes next, just reply to this email.</p>
        <p>Sanctuary Development Collaborative<br><a href="https://sanctuarydc.org" style="color: #4a7326">sanctuarydc.org</a></p>
      </div>`;

    await sendEmail({
      from: Deno.env.get('REPORT_FROM'),
      to: [lead.email],
      reply_to: Deno.env.get('NOTIFY_EMAIL') || undefined,
      subject: `Your Fit and Carry results: ${quadrant.name}`,
      html,
      attachments: [{ filename: 'Fit and Carry results.pdf', content: toBase64(pdf) }],
    });

    const notify = Deno.env.get('NOTIFY_EMAIL');
    if (notify) {
      const flagged = (results.flagged ?? []).map((id) => DRIVERS.find((d) => d.id === id)?.name ?? id).join(', ') || 'none';
      await sendEmail({
        from: Deno.env.get('REPORT_FROM'),
        to: [notify],
        reply_to: lead.email,
        subject: `${lead.wants_conversation ? 'Wants a conversation: ' : 'New Fit and Carry lead: '}${lead.church}`,
        html: `<div style="font-family: sans-serif; line-height: 1.5">
          <p><b>${esc(lead.name)}</b>${lead.role ? `, ${esc(lead.role)}` : ''}<br>${esc(lead.church)}<br>
          <a href="mailto:${esc(lead.email)}">${esc(lead.email)}</a></p>
          <p>Quadrant: <b>${esc(quadrant.name)}</b> (Fit ${results.fit.score}, Carry ${results.carry.score})<br>
          Flagged drivers: ${esc(flagged)}</p>
          <p>Wants a conversation: <b>${lead.wants_conversation ? 'Yes' : 'No'}</b><br>
          Opted in to updates: ${lead.consent_updates ? 'Yes' : 'No'}</p>
          <p>Their PDF report is attached.</p></div>`,
        attachments: [{ filename: `Fit and Carry - ${lead.church}.pdf`, content: toBase64(pdf) }],
      }).catch((e) => console.error('notify failed', e));
    }

    return json(200, { ok: true });
  } catch (e) {
    console.error(e);
    // Release the claim so a retry can try again.
    await db.from('exercise_leads').update({ report_sent_at: null }).eq('id', lead.id);
    return json(502, { error: 'Could not send the report' });
  }
});
