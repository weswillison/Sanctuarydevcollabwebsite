// Builds the Fit and Carry PDF report. Runtime-agnostic: runs in the Supabase
// edge function (Deno) and in Node for local testing.
import { PDFDocument, PDFFont, PDFPage, StandardFonts, degrees, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { AXES, COPY, DRIVERS, QUADRANTS, QUESTIONS, type QuadrantId } from './content.ts';

export type Answer = 0 | 1 | 2 | 3 | 'unknown';

/** Brand font files (IBM Plex, as on sanctuarydc.org). TTF, OTF or WOFF bytes. */
export interface BrandFonts {
  sans: Uint8Array;
  sansBold: Uint8Array;
  serif: Uint8Array;
  serifBold: Uint8Array;
  serifItalic: Uint8Array;
}

export interface ReportInput {
  name: string;
  church: string;
  date: Date;
  answers: Record<string, Answer>;
  results: {
    fit: { score: number };
    carry: { score: number };
    quadrant: QuadrantId;
    nearFit?: boolean;
    nearCarry?: boolean;
    flagged: string[];
  };
}

// Site palette
const MOSS = rgb(0x4a / 255, 0x5a / 255, 0x3a / 255);
const LEAF = rgb(0x8f / 255, 0xb3 / 255, 0x5a / 255);
const INK = rgb(0x2d / 255, 0x1b / 255, 0x0e / 255);
const MUTED = rgb(0x6b / 255, 0x5d / 255, 0x4f / 255);
const RULE = rgb(0.86, 0.84, 0.8);
const SHADE: Record<QuadrantId, ReturnType<typeof rgb>> = {
  transform: rgb(0xf1 / 255, 0xf5 / 255, 0xea / 255),
  share: rgb(0xdf / 255, 0xe9 / 255, 0xcf / 255),
  repurpose: rgb(0xdf / 255, 0xe9 / 255, 0xcf / 255),
  steward: rgb(0xb9 / 255, 0xd0 / 255, 0x8f / 255),
};

const W = 612;
const H = 792;
const M = 54;

/** Standard PDF fonts only cover Latin-1-ish text; swap or drop anything else. */
function latin1(s: string): string {
  return s
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—]/g, '-')
    .replace(/…/g, '...')
    .replace(/[^\x20-\x7E -ÿ]/g, '?');
}

function fmt(n: number) {
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
}

export async function buildReport(input: ReportInput, brand?: BrandFonts): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  doc.setTitle('Fit and Carry results');
  doc.setAuthor('Sanctuary Development Collaborative');

  // Brand fonts when available; the built-in PDF fonts as a fallback.
  let f: { serif: PDFFont; serifBold: PDFFont; serifItalic: PDFFont; sans: PDFFont; sansBold: PDFFont };
  if (brand) {
    doc.registerFontkit(fontkit);
    f = {
      serif: await doc.embedFont(brand.serif, { subset: true }),
      serifBold: await doc.embedFont(brand.serifBold, { subset: true }),
      serifItalic: await doc.embedFont(brand.serifItalic, { subset: true }),
      sans: await doc.embedFont(brand.sans, { subset: true }),
      sansBold: await doc.embedFont(brand.sansBold, { subset: true }),
    };
  } else {
    f = {
      serif: await doc.embedFont(StandardFonts.TimesRoman),
      serifBold: await doc.embedFont(StandardFonts.TimesRomanBold),
      serifItalic: await doc.embedFont(StandardFonts.TimesRomanItalic),
      sans: await doc.embedFont(StandardFonts.Helvetica),
      sansBold: await doc.embedFont(StandardFonts.HelveticaBold),
    };
  }
  const clean = (s: string) => (brand ? s.replace(/[\u0000-\u001F]/g, ' ') : latin1(s));
  const arrow = brand ? '\u2192' : '->';

  let page: PDFPage = doc.addPage([W, H]);
  let y = H - M;

  const newPage = () => {
    page = doc.addPage([W, H]);
    y = H - M;
  };
  const ensure = (needed: number) => {
    if (y - needed < M + 24) newPage();
  };

  function wrap(text: string, font: PDFFont, size: number, width: number): string[] {
    const words = clean(text).split(/\s+/);
    const lines: string[] = [];
    let line = '';
    for (const w of words) {
      const test = line ? `${line} ${w}` : w;
      if (font.widthOfTextAtSize(test, size) > width && line) {
        lines.push(line);
        line = w;
      } else line = test;
    }
    if (line) lines.push(line);
    return lines;
  }

  function text(
    s: string,
    opts: { font?: PDFFont; size?: number; color?: ReturnType<typeof rgb>; x?: number; width?: number; leading?: number; after?: number } = {},
  ) {
    const font = opts.font ?? f.sans;
    const size = opts.size ?? 10.5;
    const x = opts.x ?? M;
    const width = opts.width ?? W - M - x;
    const leading = opts.leading ?? size * 1.38;
    for (const line of wrap(s, font, size, width)) {
      ensure(leading);
      y -= leading;
      page.drawText(line, { x, y: y + (leading - size) * 0.35, size, font, color: opts.color ?? INK });
    }
    y -= opts.after ?? 0;
  }

  function heading(s: string) {
    ensure(60);
    y -= 14;
    text(s, { font: f.serifBold, size: 17, color: INK, after: 6 });
  }

  function rule() {
    y -= 6;
    page.drawLine({ start: { x: M, y }, end: { x: W - M, y }, thickness: 0.6, color: RULE });
    y -= 6;
  }

  const r = input.results;
  const quadrant = QUADRANTS[r.quadrant];

  // ---- Header
  text('SANCTUARY DEVELOPMENT COLLABORATIVE', { font: f.sansBold, size: 8.5, color: MOSS, after: 4 });
  text(COPY.printHeading, { font: f.serifBold, size: 26, after: 2 });
  text(
    `Prepared for ${input.name}, ${input.church} · ${input.date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`,
    { size: 10, color: MUTED, after: 10 },
  );
  rule();

  // ---- Grid (left) and quadrant (right)
  const gridTop = y - 8;
  const G = 190;
  const gx = M + 14;
  const gy = gridTop - G;
  const half = G / 2;
  const cells: { id: QuadrantId; x: number; y: number }[] = [
    { id: 'share', x: gx, y: gy + half },
    { id: 'steward', x: gx + half, y: gy + half },
    { id: 'transform', x: gx, y: gy },
    { id: 'repurpose', x: gx + half, y: gy },
  ];
  for (const c of cells) {
    page.drawRectangle({ x: c.x, y: c.y, width: half, height: half, color: SHADE[c.id], borderColor: rgb(1, 1, 1), borderWidth: 1 });
    const name = QUADRANTS[c.id].name;
    const font = c.id === r.quadrant ? f.serifBold : f.serif;
    page.drawText(name, { x: c.x + 8, y: c.y + 8, size: 11, font, color: c.id === r.quadrant ? MOSS : MUTED });
  }
  page.drawRectangle({ x: gx, y: gy, width: G, height: G, borderColor: MOSS, borderWidth: 0.8, opacity: 0 });
  // Axis labels
  page.drawText(`${AXES.fit.name} ${arrow}`, { x: gx - 6, y: gy + half - 12, size: 8, font: f.sans, color: MUTED, rotate: degrees(90) });
  page.drawText(`${AXES.carry.name} ${arrow}`, { x: gx + half - 14, y: gy - 13, size: 8, font: f.sans, color: MUTED });
  // Dot
  const dx = gx + (r.carry.score / 30) * G;
  const dy = gy + (r.fit.score / 30) * G;
  page.drawCircle({ x: dx, y: dy, size: 9, color: rgb(1, 1, 1) });
  page.drawCircle({ x: dx, y: dy, size: 6, color: MOSS });

  // Right column
  const rx = gx + G + 30;
  const rw = W - M - rx;
  y = gridTop + 4;
  text(quadrant.name, { font: f.serifBold, size: 24, x: rx, width: rw, after: 0 });
  text(quadrant.question, { font: f.serifItalic, size: 13, color: MOSS, x: rx, width: rw, after: 6 });
  text(quadrant.description, { size: 10.5, x: rx, width: rw, after: 8 });
  text(`${AXES.fit.name} ${fmt(r.fit.score)} ${COPY.scoreOutOf}  \u00B7  ${AXES.carry.name} ${fmt(r.carry.score)} ${COPY.scoreOutOf}`, {
    font: f.sansBold,
    size: 11,
    x: rx,
    width: rw,
    after: 4,
  });
  if (r.nearFit || r.nearCarry) {
    const near = r.nearFit && (!r.nearCarry || Math.abs(r.fit.score - 15) <= Math.abs(r.carry.score - 15));
    const fit = near ? (r.fit.score >= 15 ? 14 : 15) : r.fit.score;
    const carry = near ? r.carry.score : r.carry.score >= 15 ? 14 : 15;
    const other: QuadrantId = fit >= 15 ? (carry >= 15 ? 'steward' : 'share') : carry >= 15 ? 'repurpose' : 'transform';
    text(`${COPY.nearLine(QUADRANTS[other].name)} ${QUADRANTS[other].question}`, { size: 9.5, color: MUTED, x: rx, width: rw });
  }
  y = Math.min(y, gy - 26);

  // ---- Drivers overview
  heading(COPY.driversTitle);
  text(COPY.driversLead, { size: 10.5, after: 2 });
  text(r.flagged.length ? COPY.driversFlaggedNote : COPY.driversNone, { size: 9.5, color: MUTED, after: 6 });
  for (const axis of ['fit', 'carry'] as const) {
    ensure(40);
    text(axis === 'fit' ? COPY.fitDriversLabel : COPY.carryDriversLabel, { font: f.sansBold, size: 10, color: MOSS, after: 2 });
    for (const d of DRIVERS.filter((d) => d.axis === axis)) {
      const on = r.flagged.includes(d.id);
      ensure(30);
      const boxY = y - 13;
      page.drawRectangle({ x: M, y: boxY, width: 9, height: 9, color: on ? LEAF : rgb(1, 1, 1), borderColor: on ? MOSS : MUTED, borderWidth: 0.8 });
      if (on) page.drawText('x', { x: M + 2, y: boxY + 1.6, size: 8, font: f.sansBold, color: INK });
      text(`${d.name}: ${d.summary}`, { font: on ? f.sansBold : f.sans, size: 10, x: M + 16, color: on ? INK : MUTED });
      text(d.question, { font: f.serifItalic, size: 10, x: M + 16, color: on ? MOSS : MUTED, after: 3 });
    }
    y -= 4;
  }

  // ---- Walking through the drivers
  newPage();
  heading('Walking through your drivers');
  const flagged = r.flagged.map((id) => DRIVERS.find((d) => d.id === id)).filter(Boolean) as typeof DRIVERS;
  if (!flagged.length) {
    text(COPY.driversNone, { after: 6 });
  }
  for (const d of flagged) {
    ensure(80);
    text(d.name, { font: f.serifBold, size: 14, after: 0 });
    text(d.question, { font: f.serifItalic, size: 12, color: MOSS, after: 2 });
    text(d.summary, { size: 10.5, after: 4 });
    text('What you told us:', { font: f.sansBold, size: 9, color: MUTED, after: 1 });
    for (const qid of d.questions) {
      const q = QUESTIONS.find((q) => q.id === qid)!;
      const a = input.answers[String(qid)];
      const answer = a === 'unknown' ? COPY.unknown : a === undefined ? '' : q.answers[a];
      text(`${qid}. ${q.text}`, { size: 9, x: M + 10, color: MUTED, leading: 11.5 });
      text(answer, { font: f.sansBold, size: 9, x: M + 22, leading: 11.5, after: 2.5 });
    }
    rule();
  }

  // ---- Name your questions
  heading(COPY.questionsTitle);
  text(COPY.questionsLead, { size: 10, color: MUTED, after: 4 });
  const rows: [string, string][] = [[COPY.ourQuadrantQ, quadrant.question]];
  if (flagged[0]) rows.push([COPY.ourMainDriverQ, flagged[0].question]);
  if (flagged[1]) rows.push([COPY.anotherDriverQ, flagged[1].question]);
  for (const [label, q] of rows) {
    text(label, { size: 9, color: MUTED });
    text(q, { font: f.serifItalic, size: 13, color: MOSS, after: 4 });
  }
  text(COPY.councilQ, { size: 9, color: MUTED, after: 22 });
  page.drawLine({ start: { x: M, y }, end: { x: W - M, y }, thickness: 0.6, color: INK });
  y -= 22;
  page.drawLine({ start: { x: M, y }, end: { x: W - M, y }, thickness: 0.6, color: INK });
  y -= 8;

  // ---- Compare with your team
  heading(COPY.compareTitle);
  COPY.compareSteps.forEach((s, i) => text(`${i + 1}.  ${s}`, { size: 10.5, after: 2 }));

  // ---- All answers
  newPage();
  heading(COPY.printAnswersTitle);
  for (const axis of ['fit', 'carry'] as const) {
    text(`${AXES[axis].part}: ${AXES[axis].name}`, { font: f.sansBold, size: 10.5, color: MOSS, after: 2 });
    for (const q of QUESTIONS.filter((q) => q.axis === axis)) {
      const a = input.answers[String(q.id)];
      const answer = a === 'unknown' ? COPY.unknown : a === undefined ? '' : q.answers[a];
      ensure(26);
      text(`${q.id}. ${q.text}`, { size: 9, color: MUTED, leading: 11.5 });
      text(answer, { font: f.sansBold, size: 9, x: M + 14, leading: 11.5, after: 2.5 });
    }
    y -= 6;
  }

  // ---- Footers
  const pages = doc.getPages();
  pages.forEach((p, i) => {
    p.drawText(clean(COPY.printFooter), { x: M, y: 30, size: 8, font: f.sans, color: MUTED });
    const label = `${i + 1} / ${pages.length}`;
    p.drawText(label, { x: W - M - f.sans.widthOfTextAtSize(label, 8), y: 30, size: 8, font: f.sans, color: MUTED });
  });

  return await doc.save();
}
