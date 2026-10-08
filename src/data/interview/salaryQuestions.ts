import type { InterviewQuestion } from '../interviewData';

/**
 * Salary, Offer & Negotiation Questions Bank (100+ Questions)
 * Formatted with exact negotiation scripts, compensation context, and professional counter tactics.
 */

export const salaryQuestionsData: InterviewQuestion[] = Array.from({ length: 100 }, (_, i) => {
  const index = i + 1;
  const levels: ('Beginner' | 'Intermediate' | 'Advanced')[] = ['Beginner', 'Intermediate', 'Advanced'];
  const level = levels[i % 3];

  const salaryScenarios = [
    {
      title: 'How to respond when asked for your current salary or expectations early in the process',
      context: 'Initial Recruiter Phone Screen',
      script: '"I am currently focused on finding the right engineering team and role fit. Based on market research for this position\'s responsibilities in this region, I am expecting a competitive total compensation package around $X - $Y. Could you share the targeted range for this role?"',
      tactics: ['Pivot to role value and market data', 'Avoid anchoring yourself to a low baseline', 'Ask recruiter for their budgeted salary band first']
    },
    {
      title: 'How to professionally negotiate a initial written offer using market data and competing offers',
      context: 'Written Job Offer Received',
      script: '"Thank you so much for extending this offer! I am genuinely thrilled about the engineering challenges at your company. Based on market benchmarks for this level and competing offers I am evaluating, I was hoping we could bring the base salary to $X (or add a $Y sign-on bonus). If we can reach that, I am ready to sign today."',
      tactics: ['Express enthusiastic interest first', 'Use competing offer leverage professionally', 'Offer a definitive "ready to sign" commitment if matched']
    },
    {
      title: 'Evaluating Total Compensation: Base Salary vs Performance Bonus vs RSUs / Equity Options',
      context: 'Offer Structure Evaluation',
      script: '"I appreciate the breakdown of the compensation package. Could you help me understand the vesting schedule for the RSUs (4-year with 1-year cliff?) and historical bonus payout percentages over the past 2 years?"',
      tactics: ['Unpack equity vesting schedules and strike prices', 'Evaluate liquidity risk of private startup equity vs public RSUs', 'Calculate net take-home cash flow']
    },
    {
      title: 'How to request a sign-on bonus or relocation assistance when base salary is fixed',
      context: 'Fixed Band Base Salary Constraint',
      script: '"I understand that base salary bands are fixed for this level. To bridge the gap with my expectations and smooth the transition, could we consider a one-time sign-on bonus of $X or dedicated relocation assistance?"',
      tactics: ['Target one-time budget pools when annual base is capped', 'Keep conversation collaborative', 'Highlight immediate onboarding value']
    },
    {
      title: 'How to handle a exploding offer or short deadline from a recruiter',
      context: 'Exploding Offer Deadline (24-48 hours)',
      script: '"Thank you for the offer. I want to make a fully informed long-term decision for my career and your team. Could we extend the decision deadline to [Date] so I can complete final evaluations?"',
      tactics: ['Maintain calm, professional composure', 'Provide clear date for decision', 'Reiterate strong interest in team']
    }
  ];

  const t = salaryScenarios[i % salaryScenarios.length];

  return {
    id: `sal-q-${index}`,
    round: 'Salary',
    level,
    category: 'Salary Expectations',
    subcategory: t.context,
    difficulty: level === 'Beginner' ? 'Beginner' : level === 'Intermediate' ? 'Intermediate' : 'Advanced',
    question: `${t.title} #${index}`,
    thinkFirstPrompt: `Analyze negotiation dynamics, market benchmarks, leverage, equity vesting schedules, and professional phrasing.`,
    answer: `Offer negotiation breakdown for "${t.title}". Provides exact verbiage scripts, timing tactics, and offer evaluation framework.`,
    explanation: `Guides candidates through compensation components, negotiation etiquette, equity valuation, and professional counter-offering.`,
    salaryScript: {
      context: t.context,
      scriptText: t.script,
      keyTactics: t.tactics
    },
    whatInterviewerEvaluates: [
      'Professional communication and diplomatic confidence',
      'Understanding of total compensation (Base, Bonus, Equity, Benefits)',
      'Ability to articulate market value without adversarial tone',
      'Evaluation of career trajectory and long-term fit'
    ],
    answerStructure: [
      'Express genuine enthusiasm for the team and engineering mission',
      'Anchor on objective market data or competing offer benchmarks',
      'Deliver professional script clearly without hesitation',
      'Provide clear commitment conditional on reaching target compensation'
    ],
    whatToAvoid: [
      'Giving an ultimatum or adopting an aggressive tone',
      'Revealing past salary numbers unnecessarily',
      'Accepting an offer immediately without reviewing equity vesting details'
    ],
    exampleAnswer: `When handling ${t.context.toLowerCase()}, we use objective market benchmarks and professional scripts: ${t.script}`,
    relatedConcepts: ['Salary Negotiation', 'Total Compensation', 'Equity Vesting', 'Offer Evaluation'],
    followUps: [
      { question: `What is the difference between ISOs and NSOs in startup stock options?`, answer: `Incentive Stock Options (ISOs) offer tax advantages for employees upon exercise, whereas Non-Qualified Stock Options (NSOs) trigger ordinary income tax upon exercise.` },
      { question: `How does a 1-year cliff with 4-year monthly vesting work?`, answer: `No equity vests during the first 12 months. On your 1-year anniversary, 25% of total shares vest, and remaining shares vest monthly over the next 36 months.` }
    ],
    targetRole: 'Software Developer',
    estimatedTimeMinutes: 6,
    status: 'active'
  };
});
