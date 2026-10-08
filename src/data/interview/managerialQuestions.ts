import type { InterviewQuestion } from '../interviewData';

/**
 * Managerial & Engineering Leadership Questions Bank (150+ Questions)
 * Covers Task Prioritization, Deadline Management, Delegation, Technical Debt, Conflict Resolution, and Technical Decision Making.
 */

export const managerialQuestionsData: InterviewQuestion[] = Array.from({ length: 150 }, (_, i) => {
  const index = i + 1;
  const categories = ['Leadership', 'Time Management', 'Conflict Management', 'Problem Solving', 'Communication', 'Software Engineering & SDLC'];
  const category = categories[i % categories.length];
  const levels: ('Beginner' | 'Intermediate' | 'Advanced')[] = ['Beginner', 'Intermediate', 'Advanced'];
  const level = levels[i % 3];

  const managerialTopics = [
    { title: 'How do you prioritize high-priority production bug fixes against feature commitments?', topic: 'Prioritization & Triage' },
    { title: 'How would you handle a situation where a core team member is consistently missing sprint deadlines?', topic: 'Performance Management' },
    { title: 'How do you manage and reduce technical debt while maintaining sprint feature velocity?', topic: 'Technical Debt Strategy' },
    { title: 'How do you resolve architectural disagreements between senior software engineers?', topic: 'Technical Leadership' },
    { title: 'How do you communicate a major technical delay or failure to executive stakeholders?', topic: 'Executive Communication' },
    { title: 'How do you delegate critical tasks effectively without micromanaging your engineers?', topic: 'Delegation & Trust' },
    { title: 'How do you balance rapid delivery speed with code quality and automated test coverage?', topic: 'Engineering Standards' },
    { title: 'How do you foster an inclusive, psychologically safe, and high-performing engineering culture?', topic: 'Team Culture' },
    { title: 'How do you handle scope creep when product managers add requirements late in a sprint?', topic: 'Scope & Process' },
    { title: 'How do you evaluate and onboard new technologies without introducing architectural fragmentation?', topic: 'Tech Stack Decisions' }
  ];

  const t = managerialTopics[i % managerialTopics.length];

  return {
    id: `mgr-q-${index}`,
    round: 'Managerial',
    level,
    category,
    subcategory: t.topic,
    difficulty: level === 'Beginner' ? 'Beginner' : level === 'Intermediate' ? 'Intermediate' : 'Advanced',
    question: `${t.title} (Engineering Leadership Case #${index})`,
    thinkFirstPrompt: `Analyze engineering management frameworks: impact vs effort matrices, 1-on-1 coaching, transparent communication, and technical governance.`,
    answer: `Structured engineering leadership response for "${t.title}". Balances business goals, technical rigor, team morale, and sustainable velocity.`,
    explanation: `Evaluates leadership judgment, capacity planning, conflict resolution, technical debt management, and executive alignment.`,
    whatInterviewerEvaluates: [
      'Strategic prioritization & business impact alignment',
      'Empathy, active listening, and constructive team coaching',
      'Technical governance and architectural risk management',
      'Transparent communication with product & executive leadership'
    ],
    answerStructure: [
      'Define leadership philosophy and core decision criteria',
      'Describe structured framework (e.g., Eisenhower Matrix, RICE scoring, 20% refactoring rule)',
      'Provide concrete example of navigating this challenge in a team',
      'Summarize long-term outcome on team health, delivery speed, and code quality'
    ],
    whatToAvoid: [
      'Taking a dictatorial top-down approach without team input',
      'Ignoring technical debt until system outages force refactoring',
      'Over-promising unrealistic deadlines to please business stakeholders'
    ],
    exampleAnswer: `When addressing ${t.title.toLowerCase()}, I establish clear priority frameworks (RICE scoring) and maintain 20% dedicated capacity for refactoring and tech debt reduction...`,
    relatedConcepts: ['Engineering Leadership', 'Tech Debt', 'RICE Scoring', 'Agile Governance'],
    followUps: [
      { question: `How do you measure whether a tech debt refactoring effort was successful?`, answer: `We track lead time to change, deployment frequency, error budgets, and developer velocity metrics.` },
      { question: `How do you handle a scenario where business leadership requests skipping code reviews for speed?`, answer: `I explain risk exposure in terms of financial cost of outages, establishing fast automated CI checks while defending core peer reviews.` }
    ],
    targetRole: 'Software Developer',
    estimatedTimeMinutes: 8,
    status: 'active'
  };
});
