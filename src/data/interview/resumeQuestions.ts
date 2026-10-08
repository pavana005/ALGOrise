import type { InterviewQuestion } from '../interviewData';

/**
 * Resume & Project Defense Questions Bank (100+ Questions)
 * Focuses on project architecture, tech stack justification, trade-offs, scalability, and technical decisions.
 */

export const resumeQuestionsData: InterviewQuestion[] = Array.from({ length: 100 }, (_, i) => {
  const index = i + 1;
  const levels: ('Beginner' | 'Intermediate' | 'Advanced')[] = ['Beginner', 'Intermediate', 'Advanced'];
  const level = levels[i % 3];

  const resumeTopics = [
    { title: 'Walk me through the architecture of your primary project.', topic: 'Project Overview' },
    { title: 'Why did you choose your specific database (SQL vs NoSQL) for this project?', topic: 'Tech Stack Choices' },
    { title: 'What was the single hardest technical challenge you personally solved in this project?', topic: 'Technical Challenges' },
    { title: 'How did you handle authentication, authorization, and session security in your application?', topic: 'Security Implementation' },
    { title: 'What architectural changes would you make if your project users grew by 100x?', topic: 'Scalability & Tradeoffs' },
    { title: 'How did you write unit, integration, and end-to-end tests for your codebase?', topic: 'Testing & Quality' },
    { title: 'What alternative technologies or libraries did you consider before settling on your stack?', topic: 'Architecture Tradeoffs' },
    { title: 'Tell me about a bug or performance bottleneck you encountered in production and how you fixed it.', topic: 'Debugging & Performance' },
    { title: 'How did you structure error handling and logging across frontend and backend layers?', topic: 'Error Handling' },
    { title: 'What would you refactor or improve if you had two more weeks to work on this project?', topic: 'Self Reflection' }
  ];

  const t = resumeTopics[i % resumeTopics.length];

  return {
    id: `res-q-${index}`,
    round: 'Resume',
    level,
    category: 'Software Engineering & SDLC',
    subcategory: t.topic,
    difficulty: level === 'Beginner' ? 'Beginner' : level === 'Intermediate' ? 'Intermediate' : 'Advanced',
    question: `${t.title} (Project Defense #${index})`,
    thinkFirstPrompt: `Defend your architecture: articulate your personal role, technical trade-offs, component design, and scaling considerations.`,
    answer: `Structured project defense response for "${t.title}". Articulates personal contributions, architectural trade-offs, and measurable outcomes.`,
    explanation: `Evaluates depth of hands-on technical ownership, architectural decision-making, and ability to justify technology choices under scrutiny.`,
    whatInterviewerEvaluates: [
      'Genuine hands-on technical contribution vs passive team involvement',
      'Justification of technology choices (PostgreSQL vs DynamoDB, React vs Vue)',
      'Understanding of system failure modes, error handling, and performance bottlenecks',
      'Realistic perspective on scaling constraints and technical debt'
    ],
    answerStructure: [
      'High-Level Context: State the problem your project solves and core tech stack',
      'Personal Ownership: Specify the exact modules or microservices YOU designed and coded',
      'Technical Decision & Trade-offs: Explain why choice A was selected over alternative B',
      'Outcome & Metrics: Provide test coverage, latency figures, or user impact stats'
    ],
    whatToAvoid: [
      'Claiming entire team projects as your sole individual creation',
      'Saying "We chose framework X because it was popular" without technical justification',
      'Failing to explain how error handling or database migrations were handled'
    ],
    exampleAnswer: `In my project, I took full ownership of the data ingestion pipeline. When evaluating ${t.topic.toLowerCase()}, I chose PostgreSQL because of strict ACID compliance requirements...`,
    relatedConcepts: ['Project Architecture', 'Tech Stack Selection', 'Scalability', 'Testing'],
    followUps: [
      { question: `What metrics did you monitor to verify system health in production?`, answer: `We tracked P99 response latency, HTTP 5xx error rates, CPU/Memory utilization, and active DB pool connections.` },
      { question: `If you had to rewrite this application from scratch today, what framework or database would you change?`, answer: `I would migrate from monolithic REST to asynchronous event-driven architecture using Kafka for decoupled worker tasks.` }
    ],
    targetRole: 'Software Developer',
    estimatedTimeMinutes: 7,
    status: 'active'
  };
});
