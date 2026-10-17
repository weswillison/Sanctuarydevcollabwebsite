// Shared storage for interactive exercises on the site (Fit and Carry, and
// whatever comes next). Writes go to Supabase through its REST API, using the
// public anon key. Row Level Security on the tables allows inserts only, so
// the public site can save results but can never read anyone's data back.
//
// Configure in Netlify (Site settings > Environment variables):
//   VITE_SUPABASE_URL       e.g. https://abcd1234.supabase.co
//   VITE_SUPABASE_ANON_KEY  the project's legacy anon key (the long eyJ... JWT)
// If they are missing, saving is skipped and the exercise still works.

// Defaults point at the "Sanctuary DC" Supabase project. Both values are public
// by design (the anon key can only insert, never read); env vars override them.
const DEFAULT_URL = 'https://oatilvkjunrojitukxgm.supabase.co';
const DEFAULT_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9hdGlsdmtqdW5yb2ppdHVreGdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIxNzkzNjMsImV4cCI6MjEwNzc1NTM2M30.QXm6EckWQhT7hDJy8LkENcV56C-YZ73qstIG-cIpYLU';
const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL as string | undefined) || DEFAULT_URL;
const SUPABASE_ANON_KEY = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) || DEFAULT_ANON_KEY;

export const storeEnabled = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

async function insert(table: string, row: Record<string, unknown>): Promise<void> {
  if (!storeEnabled) {
    console.info(`[exerciseStore] Supabase not configured; skipped insert into ${table}.`, row);
    return;
  }
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_ANON_KEY!,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      // Insert-only: we never ask for the row back, so no SELECT permission is needed.
      Prefer: 'return=minimal',
    },
    body: JSON.stringify(row),
  });
  if (!res.ok) {
    throw new Error(`Insert into ${table} failed: ${res.status} ${await res.text()}`);
  }
}

export function newResponseId(): string {
  return crypto.randomUUID();
}

function sourceInfo() {
  const params = new URLSearchParams(window.location.search);
  return {
    path: window.location.pathname,
    referrer: document.referrer || null,
    utm_source: params.get('utm_source'),
    utm_medium: params.get('utm_medium'),
    utm_campaign: params.get('utm_campaign'),
  };
}

/** Anonymous completed response. Saved as soon as someone finishes the questions. */
export function saveResponse(input: {
  id: string;
  exercise: string;
  version: string;
  answers: unknown;
  results: unknown;
}) {
  return insert('exercise_responses', { ...input, source: sourceInfo() });
}

/** Contact details, linked to a response. */
export function saveLead(input: {
  response_id: string;
  exercise: string;
  name: string;
  church: string;
  role: string | null;
  email: string;
  consent_updates: boolean;
  wants_conversation: boolean;
}) {
  return insert('exercise_leads', input);
}

/** Anything added after the main exercise: deep dives, reflections, etc. */
export function saveFollowup(input: {
  response_id: string;
  exercise: string;
  kind: string;
  data: unknown;
}) {
  return insert('exercise_followups', input);
}

/**
 * Ask the server to email the PDF report for a response to the address saved
 * with its lead. The edge function only ever sends to that stored address, and
 * only once, so this is safe to call from the browser.
 */
export async function requestReport(response_id: string): Promise<void> {
  if (!storeEnabled) {
    console.info('[exerciseStore] Supabase not configured; skipped report email.');
    return;
  }
  const res = await fetch(`${SUPABASE_URL}/functions/v1/send-report`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_ANON_KEY!,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ response_id }),
  });
  if (!res.ok) throw new Error(`Report request failed: ${res.status} ${await res.text()}`);
}
