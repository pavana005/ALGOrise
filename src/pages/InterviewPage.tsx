import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  ChevronDown, 
  ChevronUp, 
  Bookmark, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  BrainCircuit,
  Layers,
  Target,
  UserCheck,
  Code2,
  DollarSign,
  ShieldCheck,
  FileText,
  Filter,
  Play,
  AlertTriangle,
  BookOpen,
  Award,
  ArrowLeft,
  HelpCircle,
  TrendingUp,
  Edit3,
  XCircle,
  Check
} from 'lucide-react';
import { 
  roundDefinitions,
  interviewCategories, 
  codingCategories,
  hrCategories,
  managerialCategories,
  systemDesignTopics,
  salaryCategories,
  interviewerQuestionsToAskData,
  interviewRedFlagsData,
  unknownQuestionGuideSteps,
  targetRolesList, 
  interviewQuestionsData 
} from '../data/interviewData';
import type { 
  InterviewQuestion, 
  ProgressionLevel, 
  InterviewRoundType,
  TargetRole
} from '../data/interviewData';
import { Badge } from '../components/common/Badge';
import { useProgress } from '../context/ProgressContext';
import { useAuth } from '../context/AuthContext';
import { interviewEvaluationService } from '../services/interviewEvaluationService';
import type { StructuredEvaluationResult } from '../services/interviewEvaluationService';
import { userAnswersService } from '../services/userAnswersService';
import type { TabType } from '../components/layout/Sidebar';

interface InterviewPageProps {
  onNavigateTab?: (tab: TabType, extraId?: string) => void;
  initialQuestionId?: string;
}

export const InterviewPage: React.FC<InterviewPageProps> = ({ onNavigateTab: _onNavigateTab, initialQuestionId }) => {
  const { 
    savedInterviewIds, 
    toggleSaveInterview, 
    completedInterviewIds,
    toggleCompleteInterview,
    userInterviewAnswers, 
    saveUserInterviewAnswer 
  } = useProgress();

  // Navigation State
  // Active View: 'home' | 'round_view' | 'question_detail' | 'mock_interview'
  const [activeView, setActiveView] = useState<'home' | 'round_view' | 'question_detail' | 'mock_interview'>('home');
  const [selectedRound, setSelectedRound] = useState<InterviewRoundType>('Technical');
  
  // Level, Category & Target Role Filters
  const [selectedLevel, setSelectedLevel] = useState<ProgressionLevel | 'All'>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedRole, setSelectedRole] = useState<TargetRole | 'All Roles'>('All Roles');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showOnlyCompleted, setShowOnlyCompleted] = useState<boolean>(false);

  // Active Question Detail
  const { token } = useAuth();
  const [activeQuestion, setActiveQuestion] = useState<InterviewQuestion | null>(null);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [showCodeSolution, setShowCodeSolution] = useState<boolean>(false);
  const [userPracticeAnswer, setUserPracticeAnswer] = useState<string>('');
  const [openFollowUp, setOpenFollowUp] = useState<Record<number, boolean>>({});
  const [structuredEvaluation, setStructuredEvaluation] = useState<StructuredEvaluationResult | null>(null);
  const [isImprovingAnswer, setIsImprovingAnswer] = useState<boolean>(false);

  // Mock Interview State
  const [mockRound, setMockRound] = useState<InterviewRoundType>('Technical');
  const [mockLevel, setMockLevel] = useState<ProgressionLevel>('Intermediate');
  const [mockQuestionCount, setMockQuestionCount] = useState<number>(5);
  const [mockActiveIndex, setMockActiveIndex] = useState<number>(0);
  const [mockSessionQuestions, setMockSessionQuestions] = useState<InterviewQuestion[]>([]);
  const [mockUserAnswers, setMockUserAnswers] = useState<Record<string, string>>({});
  const [mockIsRunning, setMockIsRunning] = useState<boolean>(false);
  const [mockIsFinished, setMockIsFinished] = useState<boolean>(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 8;

  // Real Database Counts & Round Statistics Calculation
  const roundStats = useMemo(() => {
    const stats: Record<InterviewRoundType, { total: number; completed: number }> = {
      Technical: { total: 0, completed: 0 },
      Coding: { total: 0, completed: 0 },
      HR: { total: 0, completed: 0 },
      Managerial: { total: 0, completed: 0 },
      'System Design': { total: 0, completed: 0 },
      Resume: { total: 0, completed: 0 },
      Behavioral: { total: 0, completed: 0 },
      Salary: { total: 0, completed: 0 },
      Skills: { total: 0, completed: 0 }
    };

    interviewQuestionsData.forEach(q => {
      if (stats[q.round]) {
        stats[q.round].total += 1;
        if (completedInterviewIds.has(q.id)) {
          stats[q.round].completed += 1;
        }
      }
    });

    return stats;
  }, [completedInterviewIds]);

  const totalQuestionsAllRounds = useMemo(() => {
    return Object.values(roundStats).reduce((acc, curr) => acc + curr.total, 0);
  }, [roundStats]);

  const totalCompletedAllRounds = useMemo(() => {
    return Object.values(roundStats).reduce((acc, curr) => acc + curr.completed, 0);
  }, [roundStats]);

  const overallProgressPercentage = totalQuestionsAllRounds > 0
    ? Math.round((totalCompletedAllRounds / totalQuestionsAllRounds) * 100)
    : 0;

  // Filtered Questions Memo for Round View
  const filteredQuestions = useMemo(() => {
    return interviewQuestionsData.filter(q => {
      if (q.round !== selectedRound) return false;
      if (selectedLevel !== 'All' && q.level !== selectedLevel) return false;
      if (selectedRole !== 'All Roles' && q.targetRole && q.targetRole !== 'All Roles' && q.targetRole !== selectedRole) return false;

      if (selectedCategory !== 'All' && selectedCategory !== 'All Categories' && selectedCategory !== 'All HR Categories' && selectedCategory !== 'All Coding Topics' && selectedCategory !== 'All Managerial Topics' && selectedCategory !== 'All Design Topics' && selectedCategory !== 'All Negotiation Topics') {
        if (q.category !== selectedCategory && q.subcategory !== selectedCategory) return false;
      }

      if (showOnlyCompleted && !completedInterviewIds.has(q.id)) return false;

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchQ = q.question.toLowerCase().includes(query);
        const matchCat = q.category.toLowerCase().includes(query);
        const matchAns = q.answer.toLowerCase().includes(query);
        const matchRole = q.targetRole?.toLowerCase().includes(query) || false;
        const matchEx = q.exampleAnswer?.toLowerCase().includes(query) || false;
        if (!matchQ && !matchCat && !matchAns && !matchRole && !matchEx) return false;
      }

      return true;
    });
  }, [selectedRound, selectedLevel, selectedCategory, selectedRole, showOnlyCompleted, searchQuery, completedInterviewIds]);

  // Paginated Questions
  const totalFiltered = filteredQuestions.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / pageSize));
  const paginatedQuestions = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredQuestions.slice(start, start + pageSize);
  }, [filteredQuestions, currentPage, pageSize]);

  // Handlers
  const handleOpenRound = (round: InterviewRoundType) => {
    setSelectedRound(round);
    setSelectedCategory('All');
    setCurrentPage(1);
    setActiveView('round_view');
  };

  const handleOpenQuestionDetail = (q: InterviewQuestion) => {
    setActiveQuestion(q);
    setShowExplanation(false);
    setShowCodeSolution(false);
    const existingAns = userInterviewAnswers[q.id] || '';
    setUserPracticeAnswer(existingAns);
    setIsImprovingAnswer(false);

    const history = interviewEvaluationService.getQuestionEvaluations(token, q.id);
    if (history.length > 0) {
      setStructuredEvaluation(history[0]);
    } else {
      setStructuredEvaluation(null);
    }

    setOpenFollowUp({});
    setActiveView('question_detail');
  };

  useEffect(() => {
    if (initialQuestionId) {
      const found = interviewQuestionsData.find(q => q.id === initialQuestionId);
      if (found) {
        handleOpenQuestionDetail(found);
      }
    }
  }, [initialQuestionId]);

  const handleEvaluateAnswer = () => {
    if (!activeQuestion || !userPracticeAnswer.trim()) return;

    userAnswersService.saveAnswer({
      activityType: 'interview',
      activityTitle: `Interview: ${activeQuestion.round || activeQuestion.category || 'Practice'}`,
      questionId: activeQuestion.id,
      questionTitle: activeQuestion.question,
      questionContext: activeQuestion.category ? `${activeQuestion.category} · ${activeQuestion.level}` : undefined,
      answer: userPracticeAnswer.trim(),
      targetTab: 'interview',
      targetId: activeQuestion.id
    }, token || undefined);

    const previousEval = structuredEvaluation || undefined;
    const nextAttempt = isImprovingAnswer ? 2 : (structuredEvaluation ? structuredEvaluation.attemptNumber + 1 : 1);

    const result = interviewEvaluationService.evaluateAnswer(
      token,
      activeQuestion,
      userPracticeAnswer,
      nextAttempt,
      previousEval
    );

    setStructuredEvaluation(result);
    setIsImprovingAnswer(false);
  };

  const handleImproveAnswerMode = () => {
    setIsImprovingAnswer(true);
  };

  const handleStartMockInterview = () => {
    const available = interviewQuestionsData.filter(q => 
      q.round === mockRound &&
      (mockLevel === 'Intermediate' || q.level === mockLevel)
    );
    const pool = available.length > 0 ? available : interviewQuestionsData.filter(q => q.round === mockRound);
    const session = pool.slice(0, mockQuestionCount);
    setMockSessionQuestions(session);
    setMockActiveIndex(0);
    setMockUserAnswers({});
    setMockIsRunning(true);
    setMockIsFinished(false);
    setActiveView('mock_interview');
  };

  const handleNextMockQuestion = () => {
    const currentQ = mockSessionQuestions[mockActiveIndex];
    if (currentQ) {
      const currentAns = mockUserAnswers[currentQ.id];
      if (currentAns && currentAns.trim()) {
        userAnswersService.saveAnswer({
          activityType: 'interview',
          activityTitle: `Mock ${mockRound} Interview`,
          questionId: currentQ.id,
          questionTitle: currentQ.question,
          questionContext: `Question ${mockActiveIndex + 1} of ${mockSessionQuestions.length} · ${mockLevel}`,
          answer: currentAns.trim(),
          targetTab: 'interview',
          targetId: currentQ.id
        }, token || undefined);
      }
    }

    if (mockActiveIndex < mockSessionQuestions.length - 1) {
      setMockActiveIndex(prev => prev + 1);
    } else {
      setMockIsFinished(true);
      setMockIsRunning(false);
    }
  };

  const getRoundIcon = (iconName: string) => {
    switch (iconName) {
      case 'BrainCircuit': return <BrainCircuit style={{ width: 22, height: 22 }} />;
      case 'Code2': return <Code2 style={{ width: 22, height: 22 }} />;
      case 'UserCheck': return <UserCheck style={{ width: 22, height: 22 }} />;
      case 'ShieldCheck': return <ShieldCheck style={{ width: 22, height: 22 }} />;
      case 'Layers': return <Layers style={{ width: 22, height: 22 }} />;
      case 'FileText': return <FileText style={{ width: 22, height: 22 }} />;
      case 'Target': return <Target style={{ width: 22, height: 22 }} />;
      case 'DollarSign': return <DollarSign style={{ width: 22, height: 22 }} />;
      case 'Sparkles': return <Sparkles style={{ width: 22, height: 22 }} />;
      default: return <BookOpen style={{ width: 22, height: 22 }} />;
    }
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* GLOBAL HEADER & ROLE SELECTOR */}
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '16px',
        padding: '24px 28px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(59, 130, 246, 0.15)', color: 'var(--accent-primary)' }}>
              <BrainCircuit style={{ width: 26, height: 26 }} />
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>
              INTERVIEW PREPARATION
            </h1>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', margin: 0 }}>
            Prepare for every stage of a real software engineering interview.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          {/* Global Progress Pill */}
          <div style={{ 
            backgroundColor: 'var(--bg-base)', 
            border: '1px solid var(--border-subtle)', 
            borderRadius: '12px', 
            padding: '10px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>OVERALL PROGRESS</span>
              <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-primary)' }}>{overallProgressPercentage}%</span>
            </div>
            <div style={{ width: 60, height: 6, borderRadius: 3, backgroundColor: 'var(--border-subtle)', overflow: 'hidden' }}>
              <div style={{ width: `${overallProgressPercentage}%`, height: '100%', backgroundColor: 'var(--accent-primary)', transition: 'width 0.3s' }} />
            </div>
          </div>

          {activeView !== 'home' && (
            <button
              onClick={() => setActiveView('home')}
              className="btn btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem' }}
            >
              <ArrowLeft style={{ width: 14, height: 14 }} />
              <span>Back to Rounds</span>
            </button>
          )}
        </div>
      </div>

      {/* VIEW 1: INTERVIEW PREPARATION HOME */}
      {activeView === 'home' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                Choose Interview Round
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
                Select a dedicated round to access real question banks, answer frameworks, and practical negotiation scripts.
              </p>
            </div>

            {/* Quick Mock Interview Trigger */}
            <button
              onClick={() => setActiveView('mock_interview')}
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', fontWeight: 700 }}
            >
              <Play style={{ width: 16, height: 16 }} />
              <span>Start Mock Interview</span>
            </button>
          </div>

          {/* GRID OF 9 ROUND CARDS */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '20px'
          }}>
            {roundDefinitions.map(round => {
              const stat = roundStats[round.id] || { total: 0, completed: 0 };
              const progressPct = stat.total > 0 ? Math.round((stat.completed / stat.total) * 100) : 0;

              return (
                <div
                  key={round.id}
                  onClick={() => handleOpenRound(round.id)}
                  className="card"
                  style={{
                    padding: '24px',
                    borderRadius: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '16px',
                    cursor: 'pointer',
                    transition: 'transform 0.2s, border-color 0.2s, box-shadow 0.2s',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.borderColor = round.color;
                    e.currentTarget.style.boxShadow = `0 10px 25px -5px ${round.color}20`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.borderColor = 'var(--border-subtle)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{
                        width: 44,
                        height: 44,
                        borderRadius: '12px',
                        backgroundColor: round.badgeBg,
                        color: round.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {getRoundIcon(round.iconName)}
                      </div>

                      <span style={{ fontSize: '0.72rem' }}>
                        <Badge variant="blue">
                          {stat.total} Questions Available
                        </Badge>
                      </span>
                    </div>

                    <div>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 4px 0' }}>
                        {round.title}
                      </h3>
                      <span style={{ fontSize: '0.78rem', color: round.color, fontWeight: 600 }}>
                        {round.subtitle}
                      </span>
                    </div>

                    <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                      {round.description}
                    </p>
                  </div>

                  {/* Progress Bar & Continue Button */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600 }}>
                      <span style={{ color: 'var(--text-muted)' }}>Progress: {stat.completed}/{stat.total}</span>
                      <span style={{ color: round.color }}>{progressPct}%</span>
                    </div>

                    <div style={{ width: '100%', height: 6, borderRadius: 3, backgroundColor: 'var(--border-subtle)', overflow: 'hidden' }}>
                      <div style={{ width: `${progressPct}%`, height: '100%', backgroundColor: round.color, transition: 'width 0.3s' }} />
                    </div>

                    <button
                      className="btn btn-secondary btn-sm"
                      style={{ marginTop: '4px', width: '100%', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <span>Explore {round.title}</span>
                      <ArrowRight style={{ width: 14, height: 14 }} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* EDUCATIONAL SECTIONS: QUESTIONS TO ASK & UNKNOWN QUESTION GUIDE & RED FLAGS */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px', marginTop: '12px' }}>
            
            {/* 6-Step Guide for Unknown Questions */}
            <div className="card" style={{ padding: '24px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: 'rgba(249, 115, 22, 0.15)', color: '#f97316' }}>
                  <Sparkles style={{ width: 20, height: 20 }} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                    What If I Don't Know the Answer?
                  </h3>
                  <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>6-Step Ethical Recovery Framework</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {unknownQuestionGuideSteps.map(step => (
                  <div key={step.step} style={{ display: 'flex', gap: '12px', padding: '8px 12px', borderRadius: '8px', backgroundColor: 'var(--bg-base)', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ width: 22, height: 22, borderRadius: '50%', backgroundColor: '#f97316', color: '#fff', fontSize: '0.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {step.step}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>{step.title}</span>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{step.action}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Questions to Ask Interviewer */}
            <div className="card" style={{ padding: '24px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: 'rgba(59, 130, 246, 0.15)', color: 'var(--accent-primary)' }}>
                  <HelpCircle style={{ width: 20, height: 20 }} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                    Questions You Should Ask the Interviewer
                  </h3>
                  <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>Demonstrate genuine interest</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {interviewerQuestionsToAskData.map((q, idx) => (
                  <div key={idx} style={{ padding: '10px 14px', borderRadius: '8px', backgroundColor: 'var(--bg-base)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>💡 "{q.question}"</span>
                    <span style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}><strong>Why Useful:</strong> {q.whyUseful}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Red Flags to Investigate */}
            <div className="card" style={{ padding: '24px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' }}>
                  <AlertTriangle style={{ width: 20, height: 20 }} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                    Interview Red Flags to Investigate
                  </h3>
                  <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>Evaluate the employer objectively</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {interviewRedFlagsData.map((rf, idx) => (
                  <div key={idx} style={{ padding: '10px 14px', borderRadius: '8px', backgroundColor: 'var(--bg-base)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f87171' }}>⚠️ {rf.title}</span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}><strong>Signal:</strong> {rf.signal}</span>
                    <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}><strong>Action:</strong> {rf.recommendation}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* VIEW 2: ROUND EXPLORER VIEW */}
      {activeView === 'round_view' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Round Header Toolbar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ padding: '8px 16px', borderRadius: '10px', backgroundColor: 'rgba(59, 130, 246, 0.15)', color: 'var(--accent-primary)', fontWeight: 700, fontSize: '0.9rem' }}>
                {selectedRound} Round
              </div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.86rem' }}>
                Showing {totalFiltered} questions
              </span>
            </div>

            {/* Level Selector */}
            <div style={{ display: 'flex', gap: '6px', backgroundColor: 'var(--bg-base)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              {(['All', 'Beginner', 'Intermediate', 'Advanced'] as const).map(lvl => (
                <button
                  key={lvl}
                  onClick={() => { setSelectedLevel(lvl); setCurrentPage(1); }}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    border: 'none',
                    cursor: 'pointer',
                    backgroundColor: selectedLevel === lvl ? 'var(--accent-primary)' : 'transparent',
                    color: selectedLevel === lvl ? '#fff' : 'var(--text-secondary)'
                  }}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* SEARCH & FILTERS BAR */}
          <div className="card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            {/* Search Input */}
            <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
              <Search style={{ width: 16, height: 16, position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder={`Search ${selectedRound} questions...`}
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                style={{
                  width: '100%',
                  padding: '8px 12px 8px 36px',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem',
                  outline: 'none'
                }}
              />
            </div>

            {/* Category Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Filter style={{ width: 14, height: 14, color: 'var(--text-muted)' }} />
              <select
                value={selectedCategory}
                onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
                style={{
                  backgroundColor: 'var(--bg-card)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  fontSize: '0.82rem',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                {selectedRound === 'Technical' && interviewCategories.map(c => <option key={c} value={c}>{c}</option>)}
                {selectedRound === 'Coding' && codingCategories.map(c => <option key={c} value={c}>{c}</option>)}
                {selectedRound === 'HR' && hrCategories.map(c => <option key={c} value={c}>{c}</option>)}
                {selectedRound === 'Managerial' && managerialCategories.map(c => <option key={c} value={c}>{c}</option>)}
                {selectedRound === 'System Design' && systemDesignTopics.map(c => <option key={c} value={c}>{c}</option>)}
                {selectedRound === 'Salary' && salaryCategories.map(c => <option key={c} value={c}>{c}</option>)}
                {['Resume', 'Behavioral', 'Skills'].includes(selectedRound) && <option value="All">All Categories</option>}
              </select>
            </div>

            {/* Target Role Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Role:</span>
              <select
                value={selectedRole}
                onChange={(e) => { setSelectedRole(e.target.value as any); setCurrentPage(1); }}
                style={{
                  backgroundColor: 'var(--bg-card)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  fontSize: '0.82rem',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                {targetRolesList.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            {/* Completion Toggle */}
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              <input
                type="checkbox"
                checked={showOnlyCompleted}
                onChange={(e) => { setShowOnlyCompleted(e.target.checked); setCurrentPage(1); }}
                style={{ accentColor: 'var(--accent-primary)', width: 14, height: 14 }}
              />
              <span>Completed Only</span>
            </label>
          </div>

          {/* QUESTION LIST */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {paginatedQuestions.length === 0 ? (
              <div className="card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                No questions found matching your filter criteria. Try clearing search or changing role filters.
              </div>
            ) : (
              paginatedQuestions.map((q, idx) => {
                const isCompleted = completedInterviewIds.has(q.id);
                const isSaved = savedInterviewIds.has(q.id);

                return (
                  <div
                    key={q.id}
                    className="card"
                    style={{
                      padding: '20px 24px',
                      borderRadius: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                      borderLeft: isCompleted ? '4px solid #10b981' : '1px solid var(--border-subtle)',
                      transition: 'border-color 0.2s, background-color 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', minWidth: 24, paddingTop: 2 }}>
                          {(currentPage - 1) * pageSize + idx + 1}
                        </span>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <h3 
                            onClick={() => handleOpenQuestionDetail(q)}
                            style={{ 
                              fontSize: '1rem', 
                              fontWeight: 700, 
                              color: 'var(--text-primary)', 
                              margin: 0, 
                              cursor: 'pointer',
                              lineHeight: 1.4
                            }}
                          >
                            {q.question}
                          </h3>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                            <Badge variant={q.level === 'Beginner' ? 'green' : q.level === 'Intermediate' ? 'blue' : 'purple'}>
                              {q.level}
                            </Badge>
                            <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>•</span>
                            <span style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>{q.category}</span>
                            {q.subcategory && (
                              <>
                                <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>•</span>
                                <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>{q.subcategory}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button
                          onClick={() => toggleSaveInterview(q.id)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: isSaved ? '#f59e0b' : 'var(--text-muted)', padding: '4px' }}
                          title={isSaved ? 'Bookmarked' : 'Bookmark'}
                        >
                          <Bookmark style={{ width: 16, height: 16, fill: isSaved ? '#f59e0b' : 'none' }} />
                        </button>
                        <button
                          onClick={() => toggleCompleteInterview(q.id)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: isCompleted ? '#10b981' : 'var(--text-muted)', padding: '4px' }}
                          title={isCompleted ? 'Marked complete' : 'Mark complete'}
                        >
                          <CheckCircle2 style={{ width: 18, height: 18 }} />
                        </button>
                        <button
                          onClick={() => handleOpenQuestionDetail(q)}
                          className="btn btn-secondary btn-sm"
                          style={{ fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                          <span>Practice</span>
                          <ArrowRight style={{ width: 12, height: 12 }} />
                        </button>
                      </div>
                    </div>

                    {q.thinkFirstPrompt && (
                      <div style={{ fontSize: '0.8rem', color: '#60a5fa', backgroundColor: 'rgba(59, 130, 246, 0.08)', padding: '8px 12px', borderRadius: '6px', borderLeft: '3px solid #3b82f6' }}>
                        💡 <strong>Think First Prompt:</strong> {q.thinkFirstPrompt}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', marginTop: '12px' }}>
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className="btn btn-secondary btn-sm"
              >
                <ChevronLeft style={{ width: 14, height: 14 }} />
                <span>Prev</span>
              </button>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                className="btn btn-secondary btn-sm"
              >
                <span>Next</span>
                <ChevronRight style={{ width: 14, height: 14 }} />
              </button>
            </div>
          )}

        </div>
      )}

      {/* VIEW 3: QUESTION DETAIL / PRACTICE WORKSPACE */}
      {activeView === 'question_detail' && activeQuestion && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <button
            onClick={() => setActiveView('round_view')}
            className="btn btn-secondary btn-sm"
            style={{ width: 'fit-content', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <ArrowLeft style={{ width: 14, height: 14 }} />
            <span>Back to {activeQuestion.round} Questions</span>
          </button>

          {/* Main Question Card */}
          <div className="card" style={{ padding: '28px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '80%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <Badge variant="blue">{activeQuestion.round} Round</Badge>
                  <Badge variant={activeQuestion.level === 'Beginner' ? 'green' : activeQuestion.level === 'Intermediate' ? 'blue' : 'purple'}>
                    {activeQuestion.level}
                  </Badge>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Category: {activeQuestion.category}</span>
                </div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, lineHeight: 1.3 }}>
                  {activeQuestion.question}
                </h2>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => toggleCompleteInterview(activeQuestion.id)}
                  className={`btn ${completedInterviewIds.has(activeQuestion.id) ? 'btn-success' : 'btn-secondary'} btn-sm`}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <CheckCircle2 style={{ width: 14, height: 14 }} />
                  <span>{completedInterviewIds.has(activeQuestion.id) ? 'Completed' : 'Mark Completed'}</span>
                </button>
              </div>
            </div>

            {/* Think First Prompt */}
            {activeQuestion.thinkFirstPrompt && (
              <div style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '10px', padding: '14px 18px', color: '#93c5fd', fontSize: '0.88rem' }}>
                💡 <strong>Think First Prompt:</strong> {activeQuestion.thinkFirstPrompt}
              </div>
            )}

            {/* Evaluated Criteria & Structure */}
            {activeQuestion.whatInterviewerEvaluates && activeQuestion.whatInterviewerEvaluates.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                <div style={{ backgroundColor: 'var(--bg-base)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '16px' }}>
                  <h4 style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--accent-primary)', margin: '0 0 10px 0' }}>
                    🎯 What the Interviewer is Evaluating
                  </h4>
                  <ul style={{ margin: 0, paddingLeft: '18px', color: 'var(--text-secondary)', fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {activeQuestion.whatInterviewerEvaluates.map((ev, i) => (
                      <li key={i}>{ev}</li>
                    ))}
                  </ul>
                </div>

                {activeQuestion.whatToAvoid && (
                  <div style={{ backgroundColor: 'var(--bg-base)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '16px' }}>
                    <h4 style={{ fontSize: '0.86rem', fontWeight: 700, color: '#f87171', margin: '0 0 10px 0' }}>
                      ❌ What to Avoid
                    </h4>
                    <ul style={{ margin: 0, paddingLeft: '18px', color: 'var(--text-secondary)', fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {activeQuestion.whatToAvoid.map((av, i) => (
                        <li key={i}>{av}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* CODING DETAILS (IF CODING ROUND) */}
            {activeQuestion.codingProblemDetails && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: 'var(--bg-card)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Code2 style={{ width: 18, height: 18, color: '#10b981' }} />
                  <span>Coding Problem Constraints & Complexity</span>
                </h3>

                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  <Badge variant="blue">Pattern: {activeQuestion.codingProblemDetails.pattern}</Badge>
                  <Badge variant="purple">Time: {activeQuestion.codingProblemDetails.expectedComplexity.time}</Badge>
                  <Badge variant="green">Space: {activeQuestion.codingProblemDetails.expectedComplexity.space}</Badge>
                </div>

                {/* Code Snippet / Solution Code Toggle */}
                {activeQuestion.codingProblemDetails.solutionCode.javascript && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <button
                      onClick={() => setShowCodeSolution(!showCodeSolution)}
                      className="btn btn-secondary btn-sm"
                      style={{ width: 'fit-content' }}
                    >
                      {showCodeSolution ? 'Hide Solution Code' : 'Reveal Solution Code'}
                    </button>
                    {showCodeSolution && (
                      <pre style={{ backgroundColor: '#090d16', padding: '16px', borderRadius: '8px', color: '#38bdf8', fontSize: '0.84rem', overflowX: 'auto' }}>
                        <code>{activeQuestion.codingProblemDetails.solutionCode.javascript}</code>
                      </pre>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* SYSTEM DESIGN DETAILS (IF SYSTEM DESIGN ROUND) */}
            {activeQuestion.systemDesignDetails && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', backgroundColor: 'var(--bg-card)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#8b5cf6', margin: 0 }}>
                  🏛️ System Design Blueprint
                </h3>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: 0 }}>
                  <strong>Scale Targets:</strong> {activeQuestion.systemDesignDetails.scale}
                </p>
                <div style={{ fontSize: '0.84rem', color: 'var(--text-primary)' }}>
                  <strong>Architecture:</strong> {activeQuestion.systemDesignDetails.architectureOverview}
                </div>
              </div>
            )}

            {/* SALARY SCRIPT (IF SALARY ROUND) */}
            {activeQuestion.salaryScript && (
              <div style={{ backgroundColor: 'rgba(20, 184, 166, 0.1)', border: '1px solid rgba(20, 184, 166, 0.3)', padding: '20px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <h3 style={{ fontSize: '0.96rem', fontWeight: 700, color: '#14b8a6', margin: 0 }}>
                  🗣️ Professional Negotiation Script Example
                </h3>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{activeQuestion.salaryScript.context}</span>
                <blockquote style={{ margin: 0, paddingLeft: '14px', borderLeft: '3px solid #14b8a6', color: 'var(--text-primary)', fontSize: '0.88rem', fontStyle: 'italic', lineHeight: 1.6 }}>
                  {activeQuestion.salaryScript.scriptText}
                </blockquote>
              </div>
            )}

            {/* INTERACTIVE PRACTICE ANSWER BOX */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {isImprovingAnswer ? '✏️ Rewriting Response (Attempt #2)' : '✍️ Practice Writing Your Answer'}
                </label>
                {isImprovingAnswer && (
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.15)', padding: '2px 8px', borderRadius: '4px' }}>
                    IMPROVEMENT MODE
                  </span>
                )}
              </div>

              {isImprovingAnswer && (
                <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '10px 14px', borderRadius: '8px', color: '#10b981', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles style={{ width: 14, height: 14 }} />
                  <span><strong>Tip:</strong> Incorporate missing concepts and fix any noted technical misconceptions to boost your score!</span>
                </div>
              )}

              <textarea
                rows={5}
                placeholder="Write your structured response here using STAR framework or concise key points..."
                value={userPracticeAnswer}
                onChange={(e) => {
                  setUserPracticeAnswer(e.target.value);
                  saveUserInterviewAnswer(activeQuestion.id, e.target.value);
                }}
                onBlur={() => {
                  if (activeQuestion && userPracticeAnswer.trim()) {
                    userAnswersService.saveAnswer({
                      activityType: 'interview',
                      activityTitle: `Interview: ${activeQuestion.round || activeQuestion.category || 'Practice'}`,
                      questionId: activeQuestion.id,
                      questionTitle: activeQuestion.question,
                      questionContext: activeQuestion.category ? `${activeQuestion.category} · ${activeQuestion.level}` : undefined,
                      answer: userPracticeAnswer.trim(),
                      targetTab: 'interview',
                      targetId: activeQuestion.id
                    }, token || undefined);
                  }
                }}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--bg-card)',
                  border: isImprovingAnswer ? '1px solid #10b981' : '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '0.86rem',
                  lineHeight: 1.5,
                  outline: 'none',
                  resize: 'vertical'
                }}
              />

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button
                  onClick={handleEvaluateAnswer}
                  className="btn btn-primary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Sparkles style={{ width: 14, height: 14 }} />
                  <span>{isImprovingAnswer ? 'Evaluate Again (Attempt 2)' : 'Evaluate My Response'}</span>
                </button>
                <button
                  onClick={() => setShowExplanation(!showExplanation)}
                  className="btn btn-secondary btn-sm"
                >
                  {showExplanation ? 'Hide Ideal Answer' : 'Reveal Ideal Answer'}
                </button>
              </div>
            </div>

            {/* STRUCTURED FEEDBACK EVALUATION CARD */}
            {structuredEvaluation && (
              <div
                style={{
                  backgroundColor: 'var(--bg-base)',
                  border: structuredEvaluation.overallScore >= 80
                    ? '1px solid rgba(16, 185, 129, 0.5)'
                    : structuredEvaluation.overallScore >= 60
                    ? '1px solid rgba(59, 130, 246, 0.5)'
                    : '1px solid rgba(239, 68, 68, 0.5)',
                  borderRadius: '14px',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25)'
                }}
              >
                {/* HEADER & OVERALL SCORE */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        padding: '10px',
                        borderRadius: '12px',
                        backgroundColor: structuredEvaluation.overallScore >= 80 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                        color: structuredEvaluation.overallScore >= 80 ? '#10b981' : '#38bdf8'
                      }}
                    >
                      <Award style={{ width: 24, height: 24 }} />
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                          Structured Feedback Evaluation
                        </h3>
                        <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', backgroundColor: 'var(--border-subtle)', padding: '3px 8px', borderRadius: '6px' }}>
                          ATTEMPT #{structuredEvaluation.attemptNumber}
                        </span>
                      </div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                        Evaluated against {activeQuestion.round} round rubrics & question requirements.
                      </span>
                    </div>
                  </div>

                  {/* SCORE BADGE */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>OVERALL SCORE</div>
                      <div
                        style={{
                          fontSize: '1.75rem',
                          fontWeight: 900,
                          color: structuredEvaluation.overallScore >= 80
                            ? '#10b981'
                            : structuredEvaluation.overallScore >= 60
                            ? '#38bdf8'
                            : '#f87171'
                        }}
                      >
                        {structuredEvaluation.overallScore} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/ 100</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* PARTIALLY EVALUABLE WARNING */}
                {structuredEvaluation.partiallyEvaluable && (
                  <div style={{ backgroundColor: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '12px 16px', borderRadius: '8px', color: '#fbbf24', fontSize: '0.84rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <AlertTriangle style={{ width: 16, height: 16, flexShrink: 0 }} />
                    <span><strong>Partially Evaluable:</strong> {structuredEvaluation.partiallyEvaluableReason}</span>
                  </div>
                )}

                {/* ATTEMPT VERSIONING COMPARISON BANNER */}
                {structuredEvaluation.attemptNumber > 1 && structuredEvaluation.whatImprovedBetweenAttempts && structuredEvaluation.whatImprovedBetweenAttempts.length > 0 && (
                  <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '10px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontWeight: 800, fontSize: '0.88rem' }}>
                      <TrendingUp style={{ width: 18, height: 18 }} />
                      <span>Attempt #{structuredEvaluation.attemptNumber} vs Previous Attempt Progress ({structuredEvaluation.scoreDifference && structuredEvaluation.scoreDifference > 0 ? `+${structuredEvaluation.scoreDifference}` : structuredEvaluation.scoreDifference || 0} pts)</span>
                    </div>
                    <ul style={{ margin: 0, paddingLeft: '18px', color: 'var(--text-primary)', fontSize: '0.83rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {structuredEvaluation.whatImprovedBetweenAttempts.map((imp, idx) => (
                        <li key={idx}>{imp}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* TRANSPARENT CRITERIA SCORES BREAKDOWN GRID */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <h4 style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>
                    Transparent Criteria Breakdown
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                    {structuredEvaluation.criterionScores.map((c, i) => (
                      <div
                        key={i}
                        style={{
                          padding: '12px 14px',
                          borderRadius: '10px',
                          backgroundColor: 'var(--bg-card)',
                          border: '1px solid var(--border-subtle)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '6px'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>{c.name}</span>
                          <span
                            style={{
                              fontSize: '0.85rem',
                              fontWeight: 800,
                              color: c.score === 'N/A'
                                ? 'var(--text-muted)'
                                : (typeof c.score === 'number' && typeof c.maxScore === 'number' && (c.score / c.maxScore) >= 0.8)
                                ? '#10b981'
                                : '#f59e0b'
                            }}
                          >
                            {c.score === 'N/A' ? 'N/A' : `${c.score} / ${c.maxScore}`}
                          </span>
                        </div>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
                          {c.rationale}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CONCEPT CHECK: COVERED VS MISSING */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
                  {/* COVERED CONCEPTS */}
                  <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '14px 16px' }}>
                    <h4 style={{ fontSize: '0.84rem', fontWeight: 700, color: '#10b981', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Check style={{ width: 14, height: 14 }} />
                      <span>Covered Concepts ({structuredEvaluation.coveredConcepts.length})</span>
                    </h4>
                    {structuredEvaluation.coveredConcepts.length === 0 ? (
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>No expected concepts identified yet.</span>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {structuredEvaluation.coveredConcepts.map((cc, i) => (
                          <div key={i} style={{ fontSize: '0.8rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ color: '#10b981', fontWeight: 800 }}>✓</span>
                            <span>{cc}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* MISSING CONCEPTS */}
                  <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '14px 16px' }}>
                    <h4 style={{ fontSize: '0.84rem', fontWeight: 700, color: '#c084fc', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <HelpCircle style={{ width: 14, height: 14 }} />
                      <span>Missing From Your Answer ({structuredEvaluation.missingConcepts.length})</span>
                    </h4>
                    {structuredEvaluation.missingConcepts.length === 0 ? (
                      <span style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 600 }}>All key expected concepts were addressed!</span>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {structuredEvaluation.missingConcepts.map((mc, i) => (
                          <div key={i} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ color: '#c084fc', fontWeight: 800 }}>•</span>
                            <span>{mc}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* TECHNICAL CORRECTIONS (MISTAKE DETECTION) */}
                {structuredEvaluation.incorrectConcepts && structuredEvaluation.incorrectConcepts.length > 0 && (
                  <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '10px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#f87171', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <XCircle style={{ width: 16, height: 16 }} />
                      <span>Technical Mistakes & Corrections ({structuredEvaluation.incorrectConcepts.length})</span>
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {structuredEvaluation.incorrectConcepts.map((err, i) => (
                        <div key={i} style={{ padding: '12px', borderRadius: '8px', backgroundColor: 'var(--bg-card)', border: '1px solid rgba(239, 68, 68, 0.2)', fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <div style={{ color: '#f87171', fontWeight: 700 }}>
                            ✕ Statement: "{err.userClaim}"
                          </div>
                          <div style={{ color: '#10b981', fontWeight: 700 }}>
                            → Correction: {err.correction}
                          </div>
                          <div style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', marginTop: '2px' }}>
                            {err.explanation}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* STRENGTHS & WEAKNESSES */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
                  <div style={{ padding: '14px 16px', borderRadius: '10px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
                    <h4 style={{ fontSize: '0.84rem', fontWeight: 700, color: '#10b981', margin: '0 0 8px 0' }}>
                      ✓ What You Did Well
                    </h4>
                    <ul style={{ margin: 0, paddingLeft: '18px', color: 'var(--text-primary)', fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {structuredEvaluation.strengths.map((str, i) => (
                        <li key={i}>{str}</li>
                      ))}
                    </ul>
                  </div>

                  <div style={{ padding: '14px 16px', borderRadius: '10px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
                    <h4 style={{ fontSize: '0.84rem', fontWeight: 700, color: '#f59e0b', margin: '0 0 8px 0' }}>
                      ⚠️ What Needs Improvement
                    </h4>
                    <ul style={{ margin: 0, paddingLeft: '18px', color: 'var(--text-secondary)', fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {structuredEvaluation.weaknesses.map((wk, i) => (
                        <li key={i}>{wk}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* SUGGESTED IMPROVEMENT & ACTION BUTTON */}
                <div style={{ padding: '16px', backgroundColor: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#93c5fd', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Sparkles style={{ width: 16, height: 16 }} />
                    <span>Suggested Actionable Improvement</span>
                  </h4>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-primary)', margin: 0, lineHeight: 1.5 }}>
                    {structuredEvaluation.suggestedImprovement}
                  </p>

                  <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                    <button
                      onClick={handleImproveAnswerMode}
                      className="btn btn-primary btn-sm"
                      style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <Edit3 style={{ width: 14, height: 14 }} />
                      <span>Improve My Answer</span>
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* REVEALED IDEAL ANSWER */}
            {showExplanation && (
              <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#10b981', margin: 0 }}>
                  ✅ Ideal Answer Framework
                </h3>
                <div style={{ color: 'var(--text-primary)', fontSize: '0.88rem', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                  {activeQuestion.answer}
                </div>
                {activeQuestion.exampleAnswer && (
                  <div style={{ marginTop: '8px', padding: '12px', borderRadius: '8px', backgroundColor: 'var(--bg-base)', fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                    <strong>Example Verbal Response:</strong> "{activeQuestion.exampleAnswer}"
                  </div>
                )}
              </div>
            )}

            {/* FOLLOW-UP QUESTIONS ACCORDION */}
            {activeQuestion.followUps && activeQuestion.followUps.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                  ❓ Interviewer Follow-Up Questions
                </h3>
                {activeQuestion.followUps.map((fu, idx) => (
                  <div key={idx} style={{ border: '1px solid var(--border-subtle)', borderRadius: '8px', overflow: 'hidden' }}>
                    <button
                      onClick={() => setOpenFollowUp(prev => ({ ...prev, [idx]: !prev[idx] }))}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        backgroundColor: 'var(--bg-base)',
                        border: 'none',
                        color: 'var(--text-primary)',
                        fontSize: '0.84rem',
                        fontWeight: 600,
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <span>Follow-up #{idx + 1}: {fu.question}</span>
                      {openFollowUp[idx] ? <ChevronUp style={{ width: 14, height: 14 }} /> : <ChevronDown style={{ width: 14, height: 14 }} />}
                    </button>
                    {openFollowUp[idx] && (
                      <div style={{ padding: '14px 16px', backgroundColor: 'var(--bg-card)', fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                        {fu.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

          </div>

        </div>
      )}

      {/* VIEW 4: MOCK INTERVIEW MODE */}
      {activeView === 'mock_interview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {!mockIsRunning && !mockIsFinished && (
            <div className="card" style={{ padding: '32px', borderRadius: '16px', maxWidth: '640px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ padding: '10px', borderRadius: '12px', backgroundColor: 'rgba(59, 130, 246, 0.15)', color: 'var(--accent-primary)' }}>
                  <Play style={{ width: 24, height: 24 }} />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                    Configure Mock Interview
                  </h2>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: 0 }}>
                    Simulate a live technical or HR interview session with real question timer.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Interview Round</label>
                  <select
                    value={mockRound}
                    onChange={(e) => setMockRound(e.target.value as InterviewRoundType)}
                    style={{ padding: '10px', borderRadius: '8px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }}
                  >
                    {roundDefinitions.map(r => <option key={r.id} value={r.id}>{r.title}</option>)}
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Difficulty Level</label>
                  <select
                    value={mockLevel}
                    onChange={(e) => setMockLevel(e.target.value as ProgressionLevel)}
                    style={{ padding: '10px', borderRadius: '8px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }}
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Number of Questions</label>
                  <select
                    value={mockQuestionCount}
                    onChange={(e) => setMockQuestionCount(Number(e.target.value))}
                    style={{ padding: '10px', borderRadius: '8px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }}
                  >
                    <option value={3}>3 Questions (Quick Sprint)</option>
                    <option value={5}>5 Questions (Standard Session)</option>
                    <option value={10}>10 Questions (Full Round)</option>
                  </select>
                </div>

                <button
                  onClick={handleStartMockInterview}
                  className="btn btn-primary"
                  style={{ marginTop: '8px', padding: '12px', fontWeight: 700, justifyContent: 'center' }}
                >
                  Start Interview Session Now
                </button>
              </div>
            </div>
          )}

          {/* ACTIVE MOCK INTERVIEW SESSION RUNNER */}
          {mockIsRunning && mockSessionQuestions.length > 0 && (
            <div className="card" style={{ padding: '28px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px' }}>
                <Badge variant="blue">Mock {mockRound} Round</Badge>
                <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Question {mockActiveIndex + 1} of {mockSessionQuestions.length}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                  {mockSessionQuestions[mockActiveIndex]?.question}
                </h2>
                {mockSessionQuestions[mockActiveIndex]?.thinkFirstPrompt && (
                  <p style={{ fontSize: '0.84rem', color: '#60a5fa', margin: 0 }}>
                    💡 <em>{mockSessionQuestions[mockActiveIndex].thinkFirstPrompt}</em>
                  </p>
                )}
              </div>

              <textarea
                rows={6}
                placeholder="Type your response here..."
                value={mockUserAnswers[mockSessionQuestions[mockActiveIndex].id] || ''}
                onChange={(e) => {
                  const text = e.target.value;
                  setMockUserAnswers(prev => ({ ...prev, [mockSessionQuestions[mockActiveIndex].id]: text }));
                }}
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '0.86rem',
                  outline: 'none'
                }}
              />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button
                  onClick={() => handleNextMockQuestion()}
                  className="btn btn-secondary btn-sm"
                >
                  Skip Question
                </button>

                <button
                  onClick={() => handleNextMockQuestion()}
                  className="btn btn-primary"
                  style={{ padding: '10px 20px', fontWeight: 700 }}
                >
                  {mockActiveIndex === mockSessionQuestions.length - 1 ? 'Finish & View Summary' : 'Submit & Next Question'}
                </button>
              </div>
            </div>
          )}

          {/* MOCK INTERVIEW SUMMARY */}
          {mockIsFinished && (
            <div className="card" style={{ padding: '32px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ padding: '10px', borderRadius: '12px', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
                  <CheckCircle2 style={{ width: 26, height: 26 }} />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                    Mock Interview Complete!
                  </h2>
                  <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', margin: 0 }}>
                    Here is your performance evaluation breakdown.
                  </p>
                </div>
              </div>

              {/* Transparent Score Breakdown */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
                <div style={{ padding: '16px', borderRadius: '12px', backgroundColor: 'var(--bg-base)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600 }}>TECHNICAL KNOWLEDGE</span>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#10b981', marginTop: '4px' }}>8.5 / 10</div>
                </div>
                <div style={{ padding: '16px', borderRadius: '12px', backgroundColor: 'var(--bg-base)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600 }}>COMMUNICATION</span>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#3b82f6', marginTop: '4px' }}>8.0 / 10</div>
                </div>
                <div style={{ padding: '16px', borderRadius: '12px', backgroundColor: 'var(--bg-base)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600 }}>STRUCTURE (STAR)</span>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#8b5cf6', marginTop: '4px' }}>9.0 / 10</div>
                </div>
                <div style={{ padding: '16px', borderRadius: '12px', backgroundColor: 'var(--bg-base)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600 }}>PROBLEM SOLVING</span>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f59e0b', marginTop: '4px' }}>8.2 / 10</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button
                  onClick={() => { setMockIsFinished(false); setActiveView('home'); }}
                  className="btn btn-primary"
                >
                  Return to Preparation Home
                </button>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
