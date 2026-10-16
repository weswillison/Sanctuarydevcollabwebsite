import { DRIVERS, QUESTIONS, type Axis, type Driver, type QuadrantId } from './content';

/** Answer value per question id: 0-3, or 'unknown'. */
export type Answer = 0 | 1 | 2 | 3 | 'unknown';
export type Answers = Record<number, Answer>;

export const LINE = 15;
export const NEAR_LOW = 12;
export const NEAR_HIGH = 18;

export interface AxisScore {
  points: number;
  answered: number;
  /** points / answered * 10, out of 30. */
  score: number;
}

export interface DriverResult {
  driver: Driver;
  lowCount: number;
  flagged: boolean;
  /** Average of answered questions, used to rank flagged drivers. */
  average: number;
}

export interface Results {
  fit: AxisScore;
  carry: AxisScore;
  quadrant: QuadrantId;
  nearFit: boolean;
  nearCarry: boolean;
  drivers: DriverResult[];
  /** Flagged drivers, most severe first. */
  flagged: DriverResult[];
}

function axisScore(answers: Answers, axis: Axis): AxisScore {
  let points = 0;
  let answered = 0;
  for (const q of QUESTIONS) {
    if (q.axis !== axis) continue;
    const a = answers[q.id];
    if (a === undefined || a === 'unknown') continue;
    points += a;
    answered += 1;
  }
  const score = answered === 0 ? 0 : Math.round((points / answered) * 10 * 10) / 10;
  return { points, answered, score };
}

export function quadrantFor(fit: number, carry: number): QuadrantId {
  const highFit = fit >= LINE;
  const highCarry = carry >= LINE;
  if (highFit && highCarry) return 'steward';
  if (highFit) return 'share';
  if (highCarry) return 'repurpose';
  return 'transform';
}

/** The quadrant across the nearest line, for the near-line note. */
export function neighborQuadrant(r: Results): QuadrantId | null {
  if (!r.nearFit && !r.nearCarry) return null;
  const fitGap = Math.abs(r.fit.score - LINE);
  const carryGap = Math.abs(r.carry.score - LINE);
  const flipFit = r.nearFit && (!r.nearCarry || fitGap <= carryGap);
  const fit = flipFit ? (r.fit.score >= LINE ? LINE - 1 : LINE) : r.fit.score;
  const carry = flipFit ? r.carry.score : r.carry.score >= LINE ? LINE - 1 : LINE;
  return quadrantFor(fit, carry);
}

export function score(answers: Answers): Results {
  const fit = axisScore(answers, 'fit');
  const carry = axisScore(answers, 'carry');

  const drivers: DriverResult[] = DRIVERS.map((driver) => {
    let lowCount = 0;
    let sum = 0;
    let n = 0;
    for (const id of driver.questions) {
      const a = answers[id];
      if (a === 0 || a === 1) lowCount += 1;
      if (typeof a === 'number') {
        sum += a;
        n += 1;
      }
    }
    // Same rule as the paper key: half or more of the driver's questions scored 0 or 1.
    const flagged = lowCount * 2 >= driver.questions.length;
    return { driver, lowCount, flagged, average: n ? sum / n : 3 };
  });

  const flagged = drivers
    .filter((d) => d.flagged)
    .sort((a, b) => a.average - b.average || b.lowCount - a.lowCount);

  return {
    fit,
    carry,
    quadrant: quadrantFor(fit.score, carry.score),
    nearFit: fit.score >= NEAR_LOW && fit.score <= NEAR_HIGH,
    nearCarry: carry.score >= NEAR_LOW && carry.score <= NEAR_HIGH,
    drivers,
    flagged,
  };
}
