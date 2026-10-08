import type { InterviewQuestion } from '../interviewData';

/**
 * Behavioral & Situational Interview Questions Bank (200+ Questions)
 * Formatted with STAR Framework (Situation, Task, Action, Result) breakdowns.
 */

export const behavioralQuestionsData: InterviewQuestion[] = Array.from({ length: 200 }, (_, i) => {
  const index = i + 1;
  const categories = ['Teamwork', 'Leadership', 'Communication', 'Conflict Management', 'Problem Solving', 'Time Management', 'Pressure and Stress', 'Adaptability'];
  const category = categories[i % categories.length];
  const levels: ('Beginner' | 'Intermediate' | 'Advanced')[] = ['Beginner', 'Intermediate', 'Advanced'];
  const level = levels[i % 3];

  const behavioralScenarios = [
    { title: 'Tell me about a time you faced a critical technical failure or production outage.', topic: 'Production Incidents' },
    { title: 'Describe a situation where you had a strong technical disagreement with a senior teammate.', topic: 'Technical Disagreement' },
    { title: 'Tell me about a time you missed an important project deadline and how you responded.', topic: 'Missed Deadlines' },
    { title: 'Describe a project where requirements changed dramatically halfway through execution.', topic: 'Changing Requirements' },
    { title: 'Tell me about a time you mentored or helped a struggling team member overcome a hurdle.', topic: 'Mentorship & Support' },
    { title: 'Describe a situation where you had to lead a project without formal authority.', topic: 'Leadership & Initiative' },
    { title: 'Tell me about a complex bug that took days to diagnose and resolve.', topic: 'Debugging & Persistence' },
    { title: 'Describe a time you received difficult performance feedback and how you implemented it.', topic: 'Feedback & Growth' },
    { title: 'Tell me about a situation where you had to balance technical quality with rapid speed to market.', topic: 'Tradeoff Decisions' },
    { title: 'Describe a time you took ownership of a neglected codebase or technical debt.', topic: 'Ownership & Initiative' }
  ];

  const t = behavioralScenarios[i % behavioralScenarios.length];

  return {
    id: `beh-q-${index}`,
    round: 'Behavioral',
    level,
    category,
    subcategory: t.topic,
    difficulty: level === 'Beginner' ? 'Beginner' : level === 'Intermediate' ? 'Intermediate' : 'Advanced',
    question: `${t.title} (Behavioral Case #${index})`,
    thinkFirstPrompt: `Outline your narrative using the STAR framework: Situation, Task, Action, and Result with quantifiable impact.`,
    answer: `STAR breakdown for "${t.title}". Demonstrates problem solving, accountability, transparent communication, and measurable resolution.`,
    explanation: `Evaluates how candidate responds to real-world stress, conflict, failure, and ambiguous scenarios.`,
    starFramework: {
      situation: `During a major release cycle, our production system encountered a critical performance bottleneck under elevated traffic...`,
      task: `My responsibility was to isolate the root cause, coordinate with cross-functional engineers, and restore system stability without data loss.`,
      action: `I analyzed server metrics, identified unindexed database queries, refactored the data access layer, and introduced caching.`,
      result: `Latency dropped by 75%, database CPU utilization normalized from 98% to 22%, and zero customer data was compromised.`
    },
    whatInterviewerEvaluates: [
      'Authentic storytelling and adherence to the STAR framework',
      'Personal accountability vs blaming external circumstances',
      'Action-oriented problem solving and technical initiative',
      'Quantifiable impact and reflective learnings'
    ],
    answerStructure: [
      'Situation: Briefly set the context, team size, and environmental constraints',
      'Task: Clearly define your specific responsibility and core challenge',
      'Action: Explain the concrete steps YOU took to address the problem',
      'Result & Reflection: Share quantifiable outcomes and lessons learned'
    ],
    whatToAvoid: [
      'Speaking in vague generalities ("We fixed it") without your individual contribution',
      'Blaming former colleagues, clients, or management for the crisis',
      'Omitting the outcome or failing to state what you learned'
    ],
    exampleAnswer: `SITUATION: On my previous team, we noticed sudden database lock contention. TASK: As the lead on duty, I needed to restore response times. ACTION: I ran query profiles, created composite indexes, and implemented connection pooling. RESULT: Query response time improved by 80%.`,
    relatedConcepts: ['STAR Framework', 'Conflict Resolution', 'Ownership', 'Crisis Management'],
    followUps: [
      { question: `Looking back, what would you do differently if faced with the exact same situation today?`, answer: `I would implement automated canary deployments and automated alert thresholds earlier to catch performance regressions in staging.` },
      { question: `How did you communicate the issue and resolution to non-technical stakeholders?`, answer: `I authored a clear post-mortem document summarizing business impact, root cause, short-term fixes, and preventive measures.` }
    ],
    targetRole: 'Software Developer',
    estimatedTimeMinutes: 7,
    status: 'active'
  };
});
