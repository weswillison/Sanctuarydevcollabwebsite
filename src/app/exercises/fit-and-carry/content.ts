// Fit and Carry: all copy for the web version lives in this file.
//
// Copy in [square brackets] is a placeholder drafted by Claude for Wes to
// rewrite. Everything else is approved.

export const EXERCISE_SLUG = 'fit-and-carry';
export const EXERCISE_VERSION = '2026-10-print-v4';

export type Axis = 'fit' | 'carry';

export interface Question {
  id: number;
  axis: Axis;
  text: string;
  /** Answers in score order: index 0 scores 0, index 3 scores 3. */
  answers: [string, string, string, string];
  allowUnknown: boolean;
}

export const QUESTIONS: Question[] = [
  { id: 1, axis: 'fit', allowUnknown: false, text: 'Do we ever turn away or limit people, groups, or ministries because we lack space?', answers: ['Often. Space limits our ministry.', 'Sometimes', 'Rarely', 'Never'] },
  { id: 2, axis: 'fit', allowUnknown: false, text: 'If we felt called to start a new ministry tomorrow, is there space for it?', answers: ['No. Something else would have to stop.', 'Only by squeezing other ministries', 'Yes, with some juggling', 'Yes, easily'] },
  { id: 3, axis: 'fit', allowUnknown: false, text: 'How many of our main spaces suit what happens in them?', answers: ['Few or none of them', 'Some of them', 'Most of them', 'All of them. Everything has a place that fits it.'] },
  { id: 4, axis: 'fit', allowUnknown: true, text: 'In a typical week, how many of our rooms are used at least once?', answers: ['Fewer than a quarter', 'A quarter to half', 'Half to three quarters', 'More than three quarters'] },
  { id: 5, axis: 'fit', allowUnknown: true, text: 'How many days a week is the building in regular use?', answers: ['One day, usually Sunday', 'Two or three days', 'Four or five days', 'Six or seven days'] },
  { id: 6, axis: 'fit', allowUnknown: false, text: 'On a typical Sunday, how full is our main worship space?', answers: ['Less than a quarter full', 'A quarter to half full', 'Half to three quarters full', 'More than three quarters full'] },
  { id: 7, axis: 'fit', allowUnknown: true, text: 'Do people beyond our congregation use our space regularly (community groups, partners, tenants)?', answers: ['No one outside our congregation', 'Occasionally, for one-time events', 'A few regular groups', 'Many regular groups or partners'] },
  { id: 8, axis: 'fit', allowUnknown: true, text: 'How many of our members live in the community this building serves?', answers: ['Almost none. Nearly all of us travel in from elsewhere.', 'A few', 'About half or more', 'Nearly all of us are neighbors to this building.'] },
  { id: 9, axis: 'fit', allowUnknown: true, text: 'If we closed tomorrow, would the neighborhood notice?', answers: ["Most neighbors wouldn't know we had been here.", 'A few would notice the building going dark.', 'Neighbors who use our space would miss it.', 'The neighborhood would lose an anchor, and they would tell you so.'] },
  { id: 10, axis: 'fit', allowUnknown: true, text: 'How closely does our congregation reflect the neighborhood around us (age, language, culture, income)?', answers: ['Very little', 'In a few ways', 'In many ways', 'Closely'] },
  { id: 11, axis: 'carry', allowUnknown: true, text: 'What share of our annual budget goes to the building (utilities, insurance, maintenance, building staff, debt)?', answers: ['More than half', '35 to 50 percent', '20 to 35 percent', 'Less than 20 percent'] },
  { id: 12, axis: 'carry', allowUnknown: true, text: 'How do we cover our building costs?', answers: ['We draw down savings or endowment every year to keep the doors open.', 'We break even, but only by putting off repairs.', 'We cover costs, but one bad year would hurt.', 'We cover costs and set money aside for the future.'] },
  { id: 13, axis: 'carry', allowUnknown: true, text: 'Over the last five years, how have building costs changed compared with giving?', answers: ['Costs are rising while giving is falling.', 'Costs are rising faster than giving.', 'They are roughly keeping pace.', 'Giving is outpacing costs.'] },
  { id: 14, axis: 'carry', allowUnknown: true, text: 'What major repairs are coming (roof, structure, heating, windows, masonry)?', answers: ["Major repairs are needed now, and we can't fund them.", 'Major repairs are coming within 5 years, with no plan to fund them.', "We know what's coming and have a partial plan.", "We know what's coming and have a funded plan or reserve."] },
  { id: 15, axis: 'carry', allowUnknown: true, text: 'How long is our list of repairs we have put off?', answers: ['Long, and growing every year', 'Long, but holding steady', 'Short', 'Nothing significant has been put off.'] },
  { id: 16, axis: 'carry', allowUnknown: false, text: "When did a professional last assess the building's condition?", answers: ["Never, or we don't know", 'More than 10 years ago', '5 to 10 years ago', 'Within the last 5 years'] },
  { id: 17, axis: 'carry', allowUnknown: true, text: "Are there code, historic, or environmental requirements we haven't met?", answers: ['We have been cited, or face a requirement we cannot meet.', 'We know of significant unmet requirements.', 'Minor gaps only', 'No known issues'] },
  { id: 18, axis: 'carry', allowUnknown: true, text: 'Can someone using a wheelchair reach our worship space, restrooms, and fellowship space on their own?', answers: ['None of them', 'Some of them', 'All of them, but only with help', 'All of them, independently'] },
  { id: 19, axis: 'carry', allowUnknown: false, text: "How much of our leaders' time and energy goes to the building?", answers: ['Most of it. Ministry gets whatever is left.', 'The building is the main item at most council meetings.', "It takes some time but doesn't crowd out ministry.", 'The building runs mostly in the background.'] },
  { id: 20, axis: 'carry', allowUnknown: true, text: 'Could the people who care for our building keep doing it for another five years?', answers: ["No. They're already past what they can give.", 'Only with more help than we have.', 'Probably, if nothing changes.', 'Yes, easily. The work is well supported.'] },
];

export const AXES: Record<Axis, { name: string; question: string; part: string }> = {
  fit: { name: 'Fit', part: 'Part 1', question: 'Does this building serve the mission we are called to now?' },
  carry: { name: 'Carry', part: 'Part 2', question: 'Can we carry this building without it consuming us?' },
};

export type QuadrantId = 'steward' | 'share' | 'repurpose' | 'transform';

export const QUADRANTS: Record<QuadrantId, { name: string; question: string; description: string }> = {
  steward: {
    name: 'Steward',
    question: 'How can our stability serve others?',
    description: "Your building serves your mission and you can carry it. Now it's time for long-term sustainability planning, and possibly growing into a larger leadership role.",
  },
  share: {
    name: 'Share',
    question: 'Who could carry this with us?',
    description: 'Your building fits your mission, but the weight is more than you can carry alone. Consider finding tenants or co-owners.',
  },
  repurpose: {
    name: 'Repurpose',
    question: 'What could this space become?',
    // Second sentence drafted by Claude and kept on the print version.
    description: 'You can carry your building, but it no longer matches the shape of your ministry. Look for ways to right-size your space, whether by reconfiguring it or opening it to neighbors and partners who need room.',
  },
  transform: {
    name: 'Transform',
    question: 'What does faithfulness look like next?',
    description: "The current arrangement can't continue as it is, and you have significant choices about what comes next.",
  },
};

export type DriverId =
  | 'mission-capacity'
  | 'underutilization'
  | 'community-mismatch'
  | 'financial-drain'
  | 'stone-castle'
  | 'regulatory-burden'
  | 'people-load';

export interface Driver {
  id: DriverId;
  name: string;
  axis: Axis;
  questions: number[];
  summary: string;
  question: string;
  deepDive?: DeepDiveId;
}

export const DRIVERS: Driver[] = [
  { id: 'mission-capacity', name: 'Mission-Capacity', axis: 'fit', questions: [1, 2, 3], summary: 'Our ministry has outgrown the building.', question: 'How do we serve more?', deepDive: 'spaces' },
  { id: 'underutilization', name: 'Underutilization', axis: 'fit', questions: [4, 5, 6, 7], summary: 'Much of the building goes unused.', question: 'What is this building for?' },
  { id: 'community-mismatch', name: 'Community Mismatch', axis: 'fit', questions: [8, 9, 10], summary: 'We have drifted from the place we are planted.', question: 'Are we called here?', deepDive: 'neighborhood' },
  { id: 'financial-drain', name: 'Financial Drain', axis: 'carry', questions: [11, 12, 13], summary: 'The building costs more than we can sustain.', question: 'Can we afford this?' },
  { id: 'stone-castle', name: 'Stone Castle', axis: 'carry', questions: [14, 15, 16], summary: 'The building needs more repair than we can fund.', question: 'Restore or reimagine?' },
  { id: 'regulatory-burden', name: 'Regulatory Burden', axis: 'carry', questions: [17, 18], summary: "Requirements we can't meet are closing in.", question: 'Upgrade or exit?' },
  { id: 'people-load', name: 'People Load', axis: 'carry', questions: [19, 20], summary: 'The building consumes our leaders.', question: 'How can we support the people carrying this?', deepDive: 'caretakers' },
];

export type DeepDiveId = 'spaces' | 'neighborhood' | 'caretakers';

export interface DeepDive {
  id: DeepDiveId;
  title: string;
  prompt: string;
  rows: string[];
  scale: string[];
}

export const DEEP_DIVES: Record<DeepDiveId, DeepDive> = {
  spaces: {
    id: 'spaces',
    title: 'Space by space',
    prompt: 'For each kind of space, how well does it suit the way we use it?',
    rows: ['Worship', 'Fellowship and gathering', 'Education and children', 'Outreach or community', 'Offices and support'],
    scale: ['Suits how we use it', 'Workable with workarounds', 'Fights how we use it', "We don't have this"],
  },
  neighborhood: {
    id: 'neighborhood',
    title: 'Our neighborhood',
    prompt: 'Compared with the neighborhood around the building, how similar is our congregation?',
    rows: ['Age', 'Language', 'Culture and ethnicity', 'Income'],
    scale: ['Similar', 'Somewhat different', 'Very different', "We don't know"],
  },
  caretakers: {
    id: 'caretakers',
    title: 'Caretakers',
    prompt: 'If the person who does the most to keep our building running stepped away tomorrow, what would happen?',
    rows: ['Cleaning and setup', 'Repairs and contractors', 'Grounds and snow', 'Bills and paperwork', 'Scheduling and rentals'],
    scale: [
      'Someone else would pick it up without missing a step.',
      "We'd manage, with some scrambling.",
      'Important things would go undone for a while.',
      "We honestly don't know who would do it.",
    ],
  },
};

export const COPY = {
  seoTitle: 'Fit and Carry',
  seoDescription: 'A short self-diagnostic for church leaders: does your building fit your mission, and can you carry it?',

  // Intro screen
  title: 'Fit and Carry',
  kicker: 'A building diagnostic for church leaders',
  intro: [
    'This is a self-diagnostic tool, not a test. The goal is for you to be honest with yourself and your team, not for us (or anyone) to judge you.',
    'Check one answer for each question. Answer for your church as it actually is today, not as it used to be or how you wish it was. If you don\'t know, check "I don\'t know".',
  ],
  introMeta: '20 questions, about 10 minutes',
  start: 'Begin',

  // Question screens
  unknown: "I don't know",
  back: 'Back',
  next: 'Next',
  seeResults: 'See where you land',

  // Results: quadrant (always shown)
  resultsKicker: 'Where your building sits',
  gridFitLabel: 'Fit',
  gridCarryLabel: 'Carry',
  scoreOutOf: '/ 30',
  nearLine: (other: string) => `You sit close to a line. Read ${other} too.`,

  // Lead capture gate
  gateTitle: 'See what is driving your result',
  gateBody: "Your quadrant names the big question, but there are drivers that will show you how to start answering it. We'll send you a pdf with your results from this diagnostic as well as a walk through your drivers, so you can show this to your team.",
  gateName: 'Your name',
  gateChurch: 'Church',
  gateRole: 'Your role (pastor, council member, property committee…)',
  gateEmail: 'Email address',
  gateConsent: 'Send me occasional updates from Sanctuary Development Collaborative.',
  gateConversation: "I'd be interested in a conversation about what's next for our church.",
  gatePrivacy: 'We will never sell or share your information. Your answers help us understand what churches in our region are facing.',
  gateSubmit: 'Show my drivers',
  gateError: 'Something went wrong saving your information. Please try again.',

  // Results: drivers
  driversTitle: 'Your drivers',
  driversLead: 'Your quadrant names the big question. Your drivers show where to start answering it.',
  driversFlaggedNote: 'Highlighted drivers are the ones that deserve close attention.',
  driversNone: 'None of the drivers stood out strongly. Start with your quadrant question.',
  fitDriversLabel: 'Fit drivers',
  fitDriversNote: 'These explain your Fit score, the side of the grid.',
  carryDriversLabel: 'Carry drivers',
  carryDriversNote: 'These explain your Carry score, the bottom of the grid.',

  // Deep dives
  deepDivesTitle: 'Go a little deeper',
  deepDivesLead: 'Based on your drivers, these follow-up questions may help your team see more clearly.',

  // Name your questions
  questionsTitle: 'Name your questions',
  questionsLead: 'The questions from steps 1 and 2 we most need to think about.',
  ourQuadrantQ: "Our quadrant's question",
  ourMainDriverQ: "Our main driver's question",
  anotherDriverQ: "Another driver's question",
  councilQ: 'The question we are bringing to council',
  councilPlaceholder: 'Write it in your own words',

  // Compare with your team
  compareTitle: 'Compare with your team',
  compareSteps: [
    'Ask each person on your team to take Fit and Carry on their own and print their summary.',
    'Start with any question where your answers are 2 or more points apart.',
    'Agree on a team score, then read what your quadrant and drivers mean.',
  ],
  print: 'Print or save as PDF',
  download: '[Download your results (PDF)]',
  downloading: '[Preparing your PDF…]',
  downloadReady: '[Your results are ready. Download a PDF to keep or share with your team.]',
  restart: 'Start over',

  // Closing call to action
  ctaTitle: 'Want to talk it through?',
  ctaBody: 'We help congregations work out what comes next for their buildings. A first conversation is free.',
  ctaButton: 'Contact us',

  // Print summary
  printHeading: 'Fit and Carry: results',
  printAnswersTitle: 'Your answers',
  printFooter: 'Sanctuary Development Collaborative · sanctuarydc.org/fit-and-carry',
};
