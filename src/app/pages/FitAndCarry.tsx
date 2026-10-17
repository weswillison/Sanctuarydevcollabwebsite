import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, ArrowRight, Check, Loader2, Printer, RotateCcw } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { useSEO } from '@/app/hooks/useSEO';
import { newResponseId, requestReport, saveFollowup, saveLead, saveResponse } from '@/app/lib/exerciseStore';
import {
  AXES,
  COPY,
  DEEP_DIVES,
  EXERCISE_SLUG,
  EXERCISE_VERSION,
  QUADRANTS,
  QUESTIONS,
  type Axis,
  type DeepDiveId,
  type QuadrantId,
} from '@/app/exercises/fit-and-carry/content';
import { neighborQuadrant, score, type Answer, type Answers, type Results } from '@/app/exercises/fit-and-carry/scoring';

// ---------------------------------------------------------------------------
// Session state, kept in sessionStorage so a refresh doesn't lose progress.

type Stage = 'intro' | 'questions' | 'results';

interface Lead {
  name: string;
  church: string;
  role: string;
  email: string;
  consent: boolean;
  conversation: boolean;
}

interface SessionState {
  stage: Stage;
  index: number;
  answers: Answers;
  /** Per question: true if answers display 3→0 instead of 0→3. */
  flips: Record<number, boolean>;
  responseId: string;
  saved: boolean;
  lead: Lead | null;
  deepDives: Partial<Record<DeepDiveId, Record<string, string>>>;
  savedDeepDives: DeepDiveId[];
  council: string;
}

const STORAGE_KEY = 'sdc:fit-and-carry';

function freshState(): SessionState {
  // Hidden scores: answers run healthy-first or struggling-first at random per
  // question, so position never gives the score away.
  const flips: Record<number, boolean> = {};
  for (const q of QUESTIONS) flips[q.id] = Math.random() < 0.5;
  return {
    stage: 'intro',
    index: 0,
    answers: {},
    flips,
    responseId: newResponseId(),
    saved: false,
    lead: null,
    deepDives: {},
    savedDeepDives: [],
    council: '',
  };
}

function loadState(): SessionState {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) return { ...freshState(), ...JSON.parse(raw) };
  } catch {
    /* storage unavailable */
  }
  return freshState();
}

function compactResults(r: Results) {
  return {
    fit: r.fit,
    carry: r.carry,
    quadrant: r.quadrant,
    nearFit: r.nearFit,
    nearCarry: r.nearCarry,
    flagged: r.flagged.map((d) => d.driver.id),
  };
}

// ---------------------------------------------------------------------------

export function FitAndCarry() {
  useSEO({ title: COPY.seoTitle, description: COPY.seoDescription });

  const [state, setState] = useState<SessionState>(loadState);
  const update = (patch: Partial<SessionState>) => setState((s) => ({ ...s, ...patch }));

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage unavailable */
    }
  }, [state]);

  const topRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [state.stage]);

  const restart = () => {
    setState({ ...freshState(), stage: 'intro' });
  };

  return (
    <div ref={topRef} className="fc-page py-10 md:py-14 px-4">
      <PrintStyles />
      <div className="max-w-3xl mx-auto">
        {state.stage === 'intro' && <Intro onStart={() => update({ stage: 'questions', index: 0 })} />}
        {state.stage === 'questions' && <Questions state={state} setState={setState} />}
        {state.stage === 'results' && <ResultsView state={state} setState={setState} onRestart={restart} />}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Intro

function Intro({ onStart }: { onStart: () => void }) {
  return (
    <div className="text-center">
      <p className="text-sm uppercase tracking-widest text-secondary mb-3">{COPY.kicker}</p>
      <h1 className="text-4xl md:text-5xl mb-8">{COPY.title}</h1>

      <div className="grid sm:grid-cols-2 gap-4 mb-10 text-left">
        {(['fit', 'carry'] as Axis[]).map((axis) => (
          <Card key={axis} className="p-6 gap-2">
            <p className="text-sm text-muted-foreground">{AXES[axis].part}</p>
            <h2 className="text-2xl">{AXES[axis].name}</h2>
            <p className="font-serif italic text-muted-foreground">{AXES[axis].question}</p>
          </Card>
        ))}
      </div>

      <div className="space-y-4 text-lg leading-relaxed max-w-2xl mx-auto text-left mb-10">
        {COPY.intro.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>

      <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground h-12 px-8 text-base" onClick={onStart}>
        {COPY.start} <ArrowRight className="ml-1" />
      </Button>
      <p className="text-sm text-muted-foreground mt-4">{COPY.introMeta}</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Questions, one per screen

function Questions({
  state,
  setState,
}: {
  state: SessionState;
  setState: React.Dispatch<React.SetStateAction<SessionState>>;
}) {
  const q = QUESTIONS[state.index];
  const current = state.answers[q.id];
  const isLast = state.index === QUESTIONS.length - 1;
  const advanceTimer = useRef<number | null>(null);

  useEffect(() => () => {
    if (advanceTimer.current) window.clearTimeout(advanceTimer.current);
  }, []);

  const finish = (answers: Answers) => {
    const results = score(answers);
    setState((s) => ({ ...s, answers, stage: 'results' }));
    if (!state.saved) {
      saveResponse({
        id: state.responseId,
        exercise: EXERCISE_SLUG,
        version: EXERCISE_VERSION,
        answers,
        results: compactResults(results),
      })
        .then(() => setState((s) => ({ ...s, saved: true })))
        .catch((e) => console.error(e));
    }
  };

  const choose = (value: Answer) => {
    const answers = { ...state.answers, [q.id]: value };
    setState((s) => ({ ...s, answers }));
    if (advanceTimer.current) window.clearTimeout(advanceTimer.current);
    if (!isLast) {
      advanceTimer.current = window.setTimeout(() => {
        setState((s) => ({ ...s, index: Math.min(s.index + 1, QUESTIONS.length - 1) }));
      }, 280);
    }
  };

  const go = (delta: number) => setState((s) => ({ ...s, index: Math.max(0, Math.min(QUESTIONS.length - 1, s.index + delta)) }));

  const order = state.flips[q.id] ? [3, 2, 1, 0] : [0, 1, 2, 3];
  const axis = AXES[q.axis];
  const answeredCount = Object.keys(state.answers).length;
  const progress = (answeredCount / QUESTIONS.length) * 100;

  return (
    <div>
      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>
            {axis.part}: <span className="text-foreground font-medium">{axis.name}</span>
          </span>
          <span>
            {state.index + 1} / {QUESTIONS.length}
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
          <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
        <p className="font-serif italic text-muted-foreground mt-3">{axis.question}</p>
      </div>

      <Card className="p-6 md:p-8 gap-6">
        <h2 className="text-2xl md:text-[1.7rem] leading-snug">{q.text}</h2>

        <div className="grid gap-3" role="radiogroup" aria-label={q.text}>
          {order.map((value) => {
            const selected = current === value;
            return (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => choose(value as Answer)}
                className={`text-left rounded-lg border px-4 py-3.5 flex items-center gap-3 transition-colors ${
                  selected
                    ? 'border-primary bg-primary/10 ring-2 ring-primary/30'
                    : 'border-border bg-background hover:border-primary/50 hover:bg-muted/50'
                }`}
              >
                <span
                  className={`shrink-0 size-5 rounded-full border-2 flex items-center justify-center ${
                    selected ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground/40'
                  }`}
                >
                  {selected && <Check className="size-3" strokeWidth={3} />}
                </span>
                <span className="font-normal">{q.answers[value]}</span>
              </button>
            );
          })}

          {q.allowUnknown && (
            <button
              type="button"
              role="radio"
              aria-checked={current === 'unknown'}
              onClick={() => choose('unknown')}
              className={`text-left rounded-lg border border-dashed px-4 py-3 flex items-center gap-3 text-muted-foreground transition-colors ${
                current === 'unknown' ? 'border-secondary bg-muted text-foreground' : 'border-muted-foreground/40 hover:bg-muted/50'
              }`}
            >
              <span
                className={`shrink-0 size-5 rounded-full border-2 border-dashed flex items-center justify-center ${
                  current === 'unknown' ? 'border-secondary bg-secondary text-white border-solid' : 'border-muted-foreground/40'
                }`}
              >
                {current === 'unknown' && <Check className="size-3" strokeWidth={3} />}
              </span>
              <span className="font-normal">{COPY.unknown}</span>
            </button>
          )}
        </div>
      </Card>

      <div className="flex justify-between items-center mt-6">
        <Button variant="ghost" onClick={() => go(-1)} disabled={state.index === 0} className="hover:bg-muted hover:text-foreground">
          <ArrowLeft /> {COPY.back}
        </Button>
        {isLast ? (
          <Button
            size="lg"
            className="bg-accent hover:bg-accent/90 text-accent-foreground"
            disabled={answeredCount < QUESTIONS.length}
            onClick={() => finish(state.answers)}
          >
            {COPY.seeResults} <ArrowRight />
          </Button>
        ) : (
          <Button variant="outline" onClick={() => go(1)} disabled={current === undefined} className="hover:bg-muted hover:text-foreground">
            {COPY.next} <ArrowRight />
          </Button>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Results

function ResultsView({
  state,
  setState,
  onRestart,
}: {
  state: SessionState;
  setState: React.Dispatch<React.SetStateAction<SessionState>>;
  onRestart: () => void;
}) {
  const results = useMemo(() => score(state.answers), [state.answers]);
  const quadrant = QUADRANTS[results.quadrant];
  const neighbor = neighborQuadrant(results);
  const unlocked = state.lead !== null;

  return (
    <div className="space-y-12">
      {/* Print-only heading */}
      <div className="hidden print:block">
        <h1 className="text-2xl">{COPY.printHeading}</h1>
        {state.lead && (
          <p className="text-sm">
            {state.lead.name}, {state.lead.church} · {new Date().toLocaleDateString()}
          </p>
        )}
      </div>

      {/* Step 1: quadrant */}
      <section>
        <p className="text-sm uppercase tracking-widest text-secondary mb-3 text-center print:hidden">{COPY.resultsKicker}</p>
        <div className="grid md:grid-cols-[300px_1fr] gap-8 items-center">
          <div>
            <QuadrantGrid fit={results.fit.score} carry={results.carry.score} active={results.quadrant} />
            <div className="grid grid-cols-2 gap-3 max-w-[300px] mx-auto mt-3">
              {(['fit', 'carry'] as Axis[]).map((axis) => (
                <div key={axis} className="rounded-lg border border-border bg-card px-4 py-3 text-center">
                  <p className="text-sm text-muted-foreground">{AXES[axis].name}</p>
                  <p className="font-serif text-3xl leading-tight">
                    {formatScore(results[axis].score)} <span className="text-base text-muted-foreground">{COPY.scoreOutOf}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl mb-2">{quadrant.name}</h1>
            <p className="font-serif italic text-xl text-primary mb-4">{quadrant.question}</p>
            <p className="text-lg leading-relaxed">{quadrant.description}</p>
            {neighbor && (
              <p className="mt-4 text-muted-foreground border-l-4 border-accent/60 pl-3">
                {COPY.nearLine(QUADRANTS[neighbor].name)}{' '}
                <span className="italic">{QUADRANTS[neighbor].question}</span>
              </p>
            )}
          </div>
        </div>
      </section>

      {!unlocked ? (
        <LeadGate state={state} setState={setState} results={results} />
      ) : (
        <>
          <DriversSection results={results} />
          <DeepDivesSection results={results} state={state} setState={setState} />
          <NameQuestions results={results} state={state} setState={setState} />
          <AnswersForPrint state={state} />
          <CompareSection onRestart={onRestart} />
        </>
      )}

      {/* Closing call to action */}
      <Card className="p-8 gap-3 bg-primary text-primary-foreground border-0 text-center print:hidden">
        <h2 className="text-2xl">{COPY.ctaTitle}</h2>
        <p className="text-primary-foreground/90 max-w-xl mx-auto">{COPY.ctaBody}</p>
        <div>
          <Link to="/contact">
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground mt-2">
              {COPY.ctaButton} <ArrowRight />
            </Button>
          </Link>
        </div>
      </Card>

      <p className="hidden print:block text-xs text-center">{COPY.printFooter}</p>
    </div>
  );
}

function formatScore(n: number) {
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
}

function QuadrantGrid({ fit, carry, active }: { fit: number; carry: number; active: QuadrantId }) {
  const S = 260;
  const pad = 30;
  const x = pad + (carry / 30) * S;
  const y = pad + S - (fit / 30) * S;
  const half = S / 2;
  const cells: { id: QuadrantId; x: number; y: number }[] = [
    { id: 'share', x: pad, y: pad },
    { id: 'steward', x: pad + half, y: pad },
    { id: 'transform', x: pad, y: pad + half },
    { id: 'repurpose', x: pad + half, y: pad + half },
  ];
  return (
    <svg viewBox={`0 0 ${S + pad + 10} ${S + pad + 30}`} className="w-full max-w-[300px] mx-auto" role="img" aria-label={`Your dot sits in ${QUADRANTS[active].name}`}>
      {cells.map((c) => (
        <g key={c.id}>
          <rect
            x={c.x}
            y={c.y}
            width={half}
            height={half}
            fill={c.id === active ? 'var(--primary)' : 'var(--card)'}
            fillOpacity={c.id === active ? 0.14 : 1}
            stroke="var(--border)"
          />
          <text
            x={c.x + half / 2}
            y={c.y + half / 2}
            textAnchor="middle"
            dominantBaseline="middle"
            fontFamily="var(--font-serif)"
            fontSize="15"
            fontWeight={c.id === active ? 600 : 400}
            fill={c.id === active ? 'var(--primary)' : 'var(--muted-foreground)'}
          >
            {QUADRANTS[c.id].name}
          </text>
        </g>
      ))}
      <rect x={pad} y={pad} width={S} height={S} fill="none" stroke="var(--foreground)" strokeOpacity="0.5" />
      {/* Axis labels: Fit up the side, Carry along the bottom */}
      <text x={pad - 10} y={pad + half} textAnchor="middle" fontSize="12" fill="var(--muted-foreground)" transform={`rotate(-90 ${pad - 10} ${pad + half})`}>
        {COPY.gridFitLabel} →
      </text>
      <text x={pad + half} y={pad + S + 20} textAnchor="middle" fontSize="12" fill="var(--muted-foreground)">
        {COPY.gridCarryLabel} →
      </text>
      <circle cx={x} cy={y} r="14" fill="var(--accent)" fillOpacity="0.25" />
      <circle cx={x} cy={y} r="7" fill="var(--accent)" stroke="white" strokeWidth="2" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Lead capture

function LeadGate({
  state,
  setState,
  results,
}: {
  state: SessionState;
  setState: React.Dispatch<React.SetStateAction<SessionState>>;
  results: Results;
}) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Lead>({ defaultValues: { name: '', church: '', role: '', email: '', consent: false, conversation: false } });

  const onSubmit = async (lead: Lead) => {
    setStatus('loading');
    try {
      // Make sure the response row exists before the lead that references it.
      if (!state.saved) {
        await saveResponse({
          id: state.responseId,
          exercise: EXERCISE_SLUG,
          version: EXERCISE_VERSION,
          answers: state.answers,
          results: compactResults(results),
        }).catch((e) => {
          // A duplicate id means the earlier save actually landed; anything else is a real failure.
          if (!String(e).includes('409') && !String(e).includes('23505')) throw e;
        });
      }
      await saveLead({
        response_id: state.responseId,
        exercise: EXERCISE_SLUG,
        name: lead.name.trim(),
        church: lead.church.trim(),
        role: lead.role.trim() || null,
        email: lead.email.trim(),
        consent_updates: lead.consent,
        wants_conversation: lead.conversation,
      });
      setState((s) => ({ ...s, saved: true, lead }));
      // Email the PDF report in the background; the page doesn't wait on it.
      requestReport(state.responseId).catch((e) => console.error(e));
    } catch (e) {
      console.error(e);
      setStatus('error');
    }
  };

  return (
    <Card className="p-6 md:p-8 gap-5 print:hidden">
      <div>
        <h2 className="text-2xl mb-2">{COPY.gateTitle}</h2>
        <p className="text-muted-foreground">{COPY.gateBody}</p>
      </div>
      {status === 'error' && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">{COPY.gateError}</div>}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <div className="grid md:grid-cols-2 gap-5">
          <Field id="name" label={`${COPY.gateName} *`} error={errors.name?.message}>
            <Input id="name" autoComplete="name" {...register('name', { required: 'Please enter your name' })} aria-invalid={!!errors.name} />
          </Field>
          <Field id="church" label={`${COPY.gateChurch} *`} error={errors.church?.message}>
            <Input id="church" autoComplete="organization" {...register('church', { required: 'Please enter your church' })} aria-invalid={!!errors.church} />
          </Field>
          <Field id="email" label={`${COPY.gateEmail} *`} error={errors.email?.message}>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              {...register('email', {
                required: 'Please enter your email',
                pattern: { value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/, message: 'Please enter a valid email address' },
              })}
              aria-invalid={!!errors.email}
            />
          </Field>
          <Field id="role" label={COPY.gateRole}>
            <Input id="role" autoComplete="organization-title" {...register('role')} />
          </Field>
        </div>
        <label className="flex items-start gap-3 text-base font-normal cursor-pointer">
          <input type="checkbox" className="mt-1.5 size-4 accent-[var(--primary)]" {...register('consent')} />
          <span>{COPY.gateConsent}</span>
        </label>
        <label className="flex items-start gap-3 text-base font-normal cursor-pointer">
          <input type="checkbox" className="mt-1.5 size-4 accent-[var(--primary)]" {...register('conversation')} />
          <span>{COPY.gateConversation}</span>
        </label>
        <p className="text-sm text-muted-foreground">{COPY.gatePrivacy}</p>
        <Button type="submit" size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground" disabled={status === 'loading'}>
          {status === 'loading' ? <Loader2 className="animate-spin" /> : null}
          {COPY.gateSubmit}
        </Button>
      </form>
    </Card>
  );
}

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Drivers

function DriversSection({ results }: { results: Results }) {
  const groups: { axis: Axis; label: string; note: string }[] = [
    { axis: 'fit', label: COPY.fitDriversLabel, note: COPY.fitDriversNote },
    { axis: 'carry', label: COPY.carryDriversLabel, note: COPY.carryDriversNote },
  ];
  return (
    <section className="fc-break-avoid">
      <h2 className="text-3xl mb-2">{COPY.driversTitle}</h2>
      <p className="text-lg mb-1">{COPY.driversLead}</p>
      <p className="text-muted-foreground mb-6">{results.flagged.length ? COPY.driversFlaggedNote : COPY.driversNone}</p>
      <div className="grid md:grid-cols-2 gap-6">
        {groups.map((g) => (
          <div key={g.axis}>
            <h3 className="text-xl">{g.label}</h3>
            <p className="text-sm text-muted-foreground mb-3">{g.note}</p>
            <div className="space-y-2">
              {results.drivers
                .filter((d) => d.driver.axis === g.axis)
                .map(({ driver, flagged }) => (
                  <div
                    key={driver.id}
                    className={`rounded-lg border p-4 flex gap-3 ${flagged ? 'border-accent bg-accent/10' : 'border-border bg-card opacity-70'}`}
                  >
                    <span
                      className={`shrink-0 mt-0.5 size-5 rounded border-2 flex items-center justify-center ${
                        flagged ? 'bg-accent border-accent text-accent-foreground' : 'border-muted-foreground/40'
                      }`}
                      aria-label={flagged ? 'Flagged' : 'Not flagged'}
                    >
                      {flagged && <Check className="size-3" strokeWidth={3} />}
                    </span>
                    <div>
                      <p className="font-medium">{driver.name}</p>
                      <p className="text-sm">{driver.summary}</p>
                      <p className="text-sm font-serif italic text-primary mt-1">{driver.question}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Deep dives, offered for flagged drivers that have one

function DeepDivesSection({
  results,
  state,
  setState,
}: {
  results: Results;
  state: SessionState;
  setState: React.Dispatch<React.SetStateAction<SessionState>>;
}) {
  const dives = results.flagged.map((d) => d.driver.deepDive).filter((d): d is DeepDiveId => Boolean(d));
  if (!dives.length) return null;

  const setCell = (dive: DeepDiveId, row: string, value: string) => {
    setState((s) => {
      const data = { ...(s.deepDives[dive] ?? {}), [row]: value };
      const complete = DEEP_DIVES[dive].rows.every((r) => data[r]);
      let savedDeepDives = s.savedDeepDives;
      if (complete && !s.savedDeepDives.includes(dive)) {
        savedDeepDives = [...s.savedDeepDives, dive];
        saveFollowup({ response_id: s.responseId, exercise: EXERCISE_SLUG, kind: `deep-dive:${dive}`, data }).catch((e) => console.error(e));
      }
      return { ...s, deepDives: { ...s.deepDives, [dive]: data }, savedDeepDives };
    });
  };

  const anyAnswered = dives.some((id) => Object.keys(state.deepDives[id] ?? {}).length > 0);

  return (
    <section className={anyAnswered ? '' : 'print:hidden'}>
      <h2 className="text-3xl mb-2">{COPY.deepDivesTitle}</h2>
      <p className="text-muted-foreground mb-6">{COPY.deepDivesLead}</p>
      <div className="space-y-6">
        {dives.map((id) => {
          const dive = DEEP_DIVES[id];
          const data = state.deepDives[id] ?? {};
          return (
            <Card key={id} className={`p-6 gap-4 fc-break-avoid ${Object.keys(data).length ? '' : 'print:hidden'}`}>
              <div>
                <h3 className="text-xl">{dive.title}</h3>
                <p className="text-muted-foreground">{dive.prompt}</p>
              </div>
              <div className="space-y-4">
                {dive.rows.map((row) => (
                  <fieldset key={row}>
                    <legend className="font-medium mb-2">{row}</legend>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {dive.scale.map((option) => {
                        const selected = data[row] === option;
                        return (
                          <button
                            key={option}
                            type="button"
                            onClick={() => setCell(id, row, option)}
                            aria-pressed={selected}
                            className={`text-left text-sm rounded-md border px-3 py-2 transition-colors ${
                              selected ? 'border-primary bg-primary/10 ring-1 ring-primary/30' : 'border-border hover:bg-muted/50 print:hidden'
                            }`}
                          >
                            {option}
                          </button>
                        );
                      })}
                    </div>
                  </fieldset>
                ))}
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Name your questions

function NameQuestions({
  results,
  state,
  setState,
}: {
  results: Results;
  state: SessionState;
  setState: React.Dispatch<React.SetStateAction<SessionState>>;
}) {
  const lastSaved = useRef(state.council);
  const [main, another] = results.flagged;
  const rows = [
    { label: COPY.ourQuadrantQ, value: QUADRANTS[results.quadrant].question },
    main && { label: COPY.ourMainDriverQ, value: main.driver.question },
    another && { label: COPY.anotherDriverQ, value: another.driver.question },
  ].filter(Boolean) as { label: string; value: string }[];

  const saveCouncil = () => {
    const text = state.council.trim();
    if (!text || text === lastSaved.current) return;
    lastSaved.current = text;
    saveFollowup({ response_id: state.responseId, exercise: EXERCISE_SLUG, kind: 'reflection:council-question', data: { text } }).catch((e) =>
      console.error(e),
    );
  };

  return (
    <section className="fc-break-avoid">
      <h2 className="text-3xl mb-2">{COPY.questionsTitle}</h2>
      <p className="text-muted-foreground mb-6">{COPY.questionsLead}</p>
      <div className="space-y-4">
        {rows.map((r) => (
          <div key={r.label} className="border-b border-border pb-3">
            <p className="text-sm text-muted-foreground">{r.label}</p>
            <p className="font-serif italic text-xl text-primary">{r.value}</p>
          </div>
        ))}
        <div className="space-y-2 pt-2">
          <Label htmlFor="council">{COPY.councilQ}</Label>
          <Textarea
            id="council"
            rows={3}
            placeholder={COPY.councilPlaceholder}
            value={state.council}
            onChange={(e) => setState((s) => ({ ...s, council: e.target.value }))}
            onBlur={saveCouncil}
            className="print:hidden"
          />
          <p className="hidden print:block font-serif italic text-xl min-h-16 border-b border-foreground">{state.council}</p>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Answers list, shown only in print so teams can compare offline

function AnswersForPrint({ state }: { state: SessionState }) {
  return (
    <section className="hidden print:block fc-page-break">
      <h2 className="text-xl mb-3">{COPY.printAnswersTitle}</h2>
      {(['fit', 'carry'] as Axis[]).map((axis) => (
        <div key={axis} className="mb-4">
          <h3 className="text-base mb-1">
            {AXES[axis].part}: {AXES[axis].name}
          </h3>
          <ol className="text-[11px] leading-snug space-y-1">
            {QUESTIONS.filter((q) => q.axis === axis).map((q) => {
              const a = state.answers[q.id];
              return (
                <li key={q.id} className="grid grid-cols-[1.5rem_1fr_1fr] gap-2">
                  <span>{q.id}.</span>
                  <span>{q.text}</span>
                  <span className="font-medium">{a === 'unknown' ? COPY.unknown : a !== undefined ? q.answers[a] : ''}</span>
                </li>
              );
            })}
          </ol>
        </div>
      ))}
    </section>
  );
}

// ---------------------------------------------------------------------------
// Compare with your team

function CompareSection({ onRestart }: { onRestart: () => void }) {
  return (
    <section className="print:hidden">
      <Card className="p-6 md:p-8 gap-4 bg-muted/60">
        <h2 className="text-2xl">{COPY.compareTitle}</h2>
        <ol className="list-decimal pl-5 space-y-2">
          {COPY.compareSteps.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
        <div className="flex flex-wrap gap-3 pt-2">
          <Button size="lg" onClick={() => window.print()}>
            <Printer /> {COPY.print}
          </Button>
          <Button size="lg" variant="outline" onClick={onRestart} className="hover:bg-muted hover:text-foreground">
            <RotateCcw /> {COPY.restart}
          </Button>
        </div>
      </Card>
    </section>
  );
}

// ---------------------------------------------------------------------------

function PrintStyles() {
  return (
    <style>{`
      @media print {
        @page { size: letter; margin: 0.5in; }
        nav, footer, .fixed { display: none !important; }
        body { background: white !important; }
        .fc-page { padding: 0 !important; }
        .fc-page [data-slot="card"] { box-shadow: none; }
        .fc-break-avoid { break-inside: avoid; }
        .fc-page-break { break-before: page; }
        .fc-page .space-y-12 > * + * { margin-top: 1.5rem; }
        * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      }
    `}</style>
  );
}
