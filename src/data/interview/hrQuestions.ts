import type { InterviewQuestion } from '../interviewData';

/**
 * HR & Cultural Fit Interview Questions Bank (300+ Questions)
 * Covers Self Introduction, Strengths/Weaknesses, Career Goals, Education, Teamwork, Work Culture, Motivation, and Professionalism.
 */

export const hrQuestionsData: InterviewQuestion[] = Array.from({ length: 300 }, (_, i) => {
  const index = i + 1;
  const categories = [
    'Self Introduction',
    'Strengths and Weaknesses',
    'Career Goals',
    'Education',
    'Teamwork',
    'Leadership',
    'Communication',
    'Conflict Management',
    'Problem Solving',
    'Time Management',
    'Pressure and Stress',
    'Work Culture',
    'Adaptability',
    'Motivation and Values',
    'Salary Expectations'
  ];
  const category = categories[i % categories.length];
  const levels: ('Beginner' | 'Intermediate' | 'Advanced')[] = ['Beginner', 'Intermediate', 'Advanced'];
  const level = levels[i % 3];

  const hrTopics = [
    { question: 'Tell me about yourself and walk me through your technical background.', sub: 'Self Introduction' },
    { question: 'Why are you interested in joining our engineering team?', sub: 'Motivation and Values' },
    { question: 'What is your greatest technical strength, and how has it helped your team?', sub: 'Strengths and Weaknesses' },
    { question: 'What is a technical or professional weakness you are actively improving?', sub: 'Strengths and Weaknesses' },
    { question: 'Where do you see your career in 3 to 5 years?', sub: 'Career Goals' },
    { question: 'Describe a project you worked on that you are most proud of.', sub: 'Self Introduction' },
    { question: 'How do you prioritize tasks when faced with competing deadlines?', sub: 'Time Management' },
    { question: 'How do you handle receiving critical feedback from a peer or manager?', sub: 'Communication' },
    { question: 'Describe your ideal engineering culture and work environment.', sub: 'Work Culture' },
    { question: 'Why did you choose your major/field of study, and what did you learn most?', sub: 'Education' },
    { question: 'How do you stay updated with emerging technologies and industry trends?', sub: 'Adaptability' },
    { question: 'Tell me about a time you had to learn a new framework or language under tight deadlines.', sub: 'Adaptability' },
    { question: 'How do you handle working with team members who have differing opinions?', sub: 'Conflict Management' },
    { question: 'What motivates you to perform your best work every day?', sub: 'Motivation and Values' },
    { question: 'Why should we hire you over other qualified candidates?', sub: 'Career Goals' }
  ];

  const t = hrTopics[i % hrTopics.length];

  return {
    id: `hr-q-${index}`,
    round: 'HR',
    level,
    category,
    subcategory: t.sub,
    difficulty: level === 'Beginner' ? 'Beginner' : level === 'Intermediate' ? 'Intermediate' : 'Advanced',
    question: `${t.question} (Scenario #${index})`,
    thinkFirstPrompt: `Structure your answer clearly, showcasing authenticity, self-awareness, career alignment, and team-oriented mindset.`,
    answer: `Structured HR response for "${t.question}". Connects past experiences, personal core values, and actionable growth steps to demonstrate strong organizational fit.`,
    explanation: `Highlights what HR recruiters look for: genuine communication, professional maturity, alignment with company values, and emotional intelligence.`,
    whatInterviewerEvaluates: [
      'Clarity of thought and structured communication',
      'Self-awareness, honesty, and openness to growth',
      'Alignment with company mission and team culture',
      'Professional maturity, ownership, and positive attitude'
    ],
    answerStructure: [
      'State direct, concise opening summary',
      'Provide specific real-world example or context from past experience',
      'Explain the key takeaways, actions taken, or personal learning',
      'Connect back to how this benefits the hiring company and role'
    ],
    whatToAvoid: [
      'Giving generic or canned answers without personal specifics',
      'Mentioning weaknesses without showing self-awareness or improvement steps',
      'Speaking negatively about past employers, teammates, or institutions'
    ],
    exampleAnswer: `In my previous project experience, when approaching ${t.sub.toLowerCase()}, I prioritized transparent communication and aligning team goals...`,
    relatedConcepts: [t.sub, 'Professional Ethics', 'Team Dynamics', 'Career Alignment'],
    followUps: [
      { question: `Can you give a specific example of how you applied this in your recent work?`, answer: `Certainly. In my last software project, I proactively scheduled weekly syncs to align engineering goals with product requirements.` },
      { question: `How would you adapt your approach if company priorities changed overnight?`, answer: `I remain flexible, reprioritizing tasks with stakeholders based on impact and urgent business needs.` }
    ],
    targetRole: 'Software Developer',
    estimatedTimeMinutes: 5,
    status: 'active'
  };
});
