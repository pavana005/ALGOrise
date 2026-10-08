import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  Shuffle, 
  Search, 
  Filter, 
  List,
  HelpCircle,
  Award,
  RotateCcw,
  Sparkles,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  ArrowRight,
  AlertTriangle,
  ShieldCheck,
  FileText,
  Clock,
  Terminal,
  FileCode,
  Network,
  Cpu,
  MessageSquare,
  BookOpen,
  Check,
  Code,
  MapPin
} from 'lucide-react';
import { 
  crimeLabTopics, 
  crimeLabQuestionsData, 
  validateCrimeLabCase 
} from '../data/crimeLabData';
import type { 
  CrimeLabCase, 
  EvidenceItem, 
  CrimeLabProgress 
} from '../data/crimeLabData';
import { Badge } from '../components/common/Badge';
import { useAuth } from '../context/AuthContext';
import type { TabType } from '../components/layout/Sidebar';
import { userAnswersService } from '../services/userAnswersService';

export interface CrimeLabPageProps {
  onNavigateTab?: (tab: TabType, extraId?: string) => void;
  initialCaseId?: string;
}

export const CrimeLabPage: React.FC<CrimeLabPageProps> = ({ onNavigateTab, initialCaseId }) => {
  const { user } = useAuth();
  
  // User-scoped progress storage key
  const storageKey = user ? `algorise_crimelab_progress_${user.id}` : 'algorise_crimelab_progress_guest';

  // Navigation mode: 'explorer' (list of cases) vs 'detail' (single case investigation)
  const [viewMode, setViewMode] = useState<'explorer' | 'detail'>(initialCaseId ? 'detail' : 'explorer');

  // Filters & Search for Explorer
  const [selectedTopic, setSelectedTopic] = useState<string>('All Topics');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All Difficulties');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected Active Case File
  const [selectedCaseId, setSelectedCaseId] = useState<string>(
    initialCaseId || crimeLabQuestionsData[0]?.id || 'crime-1'
  );

  useEffect(() => {
    if (initialCaseId) {
      setSelectedCaseId(initialCaseId);
      setViewMode('detail');
    }
  }, [initialCaseId]);

  // Solved cases / Isolated progress history stored in localStorage
  const [progressMap, setProgressMap] = useState<Record<string, CrimeLabProgress>>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Reload progress when user identity or storage key changes
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      setProgressMap(saved ? JSON.parse(saved) : {});
    } catch {
      setProgressMap({});
    }
  }, [storageKey]);

  // Current Active Case Interaction State
  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null);
  const [wrongAnswerIds, setWrongAnswerIds] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [submissionFeedback, setSubmissionFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);
  const [openHintLevels, setOpenHintLevels] = useState<Record<number, boolean>>({});
  const [showExplanation, setShowExplanation] = useState<boolean>(false);

  // Active Crime Lab Case
  const activeCase: CrimeLabCase = 
    crimeLabQuestionsData.find(c => c.id === selectedCaseId) || 
    crimeLabQuestionsData[0];

  const activeIndex = crimeLabQuestionsData.findIndex(c => c.id === activeCase.id);
  const activeProgress = progressMap[activeCase.id];

  // Sync interaction state when selected case changes
  useEffect(() => {
    const existing = progressMap[activeCase.id];
    setSelectedAnswerId(existing?.selectedAnswerId || null);
    setWrongAnswerIds([]);
    setIsSubmitted(!!existing?.completed);
    setSubmissionFeedback(existing?.completed ? {
      isCorrect: !!existing.isCorrect,
      message: existing.isCorrect ? 'Case Solved! Technical forensic audit verdict verified.' : 'Case attempted.'
    } : null);
    setOpenHintLevels({});
    setShowExplanation(!!existing?.completed);
  }, [selectedCaseId, progressMap, activeCase.id]);

  // Save isolated user progress
  const updateCaseProgress = (caseId: string, updater: (prev?: CrimeLabProgress) => CrimeLabProgress) => {
    setProgressMap(prev => {
      const current = prev[caseId] || {
        id: `prog-${caseId}`,
        userId: user?.id || 'guest',
        caseId,
        startedAt: new Date().toISOString(),
        hintsViewed: [],
        attempts: 0,
        completed: false
      };
      const updated = updater(current);
      const nextMap = { ...prev, [caseId]: updated };
      try {
        localStorage.setItem(storageKey, JSON.stringify(nextMap));
      } catch {
        // Ignore storage errors
      }
      return nextMap;
    });
  };

  // Filtered cases list based on search, topic, and difficulty
  const filteredCases = crimeLabQuestionsData.filter(c => {
    if (selectedTopic !== 'All Topics' && c.category !== selectedTopic) {
      return false;
    }
    if (selectedDifficulty !== 'All Difficulties' && c.difficulty !== selectedDifficulty) {
      return false;
    }
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchTitle = c.title.toLowerCase().includes(q);
      const matchProblem = c.problemStatement.toLowerCase().includes(q);
      const matchCategory = c.category.toLowerCase().includes(q);
      const matchNum = c.caseNumber.toString().includes(q);
      if (!matchTitle && !matchProblem && !matchCategory && !matchNum) return false;
    }
    return true;
  });

  const solvedCaseCount = Object.values(progressMap).filter(p => p.completed && p.isCorrect).length;

  const handleOpenDetail = (cId: string) => {
    setSelectedCaseId(cId);
    setViewMode('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    updateCaseProgress(cId, (prev) => ({
      ...prev!,
      startedAt: prev?.startedAt || new Date().toISOString()
    }));
  };

  const handleBackToExplorer = () => {
    setViewMode('explorer');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRandomCase = () => {
    if (filteredCases.length === 0) return;
    const randIdx = Math.floor(Math.random() * filteredCases.length);
    handleOpenDetail(filteredCases[randIdx].id);
  };

  const handleResetProgress = () => {
    if (window.confirm('Are you sure you want to reset your Crime Lab investigation progress history?')) {
      setProgressMap({});
      try {
        localStorage.removeItem(storageKey);
      } catch {
        // Ignore
      }
    }
  };

  const handlePrevCase = () => {
    if (activeIndex > 0) {
      handleOpenDetail(crimeLabQuestionsData[activeIndex - 1].id);
    }
  };

  const handleNextCase = () => {
    if (activeIndex < crimeLabQuestionsData.length - 1) {
      handleOpenDetail(crimeLabQuestionsData[activeIndex + 1].id);
    }
  };

  const toggleHint = (level: number, hintId: string) => {
    setOpenHintLevels(prev => {
      const nextState = { ...prev, [level]: !prev[level] };
      if (nextState[level]) {
        updateCaseProgress(activeCase.id, (p) => {
          const currentHints = p?.hintsViewed || [];
          return {
            ...p!,
            hintsViewed: Array.from(new Set([...currentHints, hintId]))
          };
        });
      }
      return nextState;
    });
  };

  const handleSubmitChoice = () => {
    if (!selectedAnswerId) return;

    const isCorrect = selectedAnswerId === activeCase.correctAnswerId;
    setIsSubmitted(true);

    updateCaseProgress(activeCase.id, (p) => ({
      ...p!,
      selectedAnswerId,
      isCorrect,
      completed: isCorrect ? true : p?.completed || false,
      completedAt: isCorrect ? new Date().toISOString() : p?.completedAt,
      attempts: (p?.attempts || 0) + 1
    }));

    const chosenOption = (activeCase.answerOptions || []).find(o => o.id === selectedAnswerId);
    userAnswersService.saveAnswer({
      activityType: 'crimelab',
      activityTitle: `Crime Lab: Case #${activeCase.caseNumber}`,
      questionId: activeCase.id,
      questionTitle: activeCase.title,
      questionContext: activeCase.problemStatement,
      answer: chosenOption ? `Selected Verdict: ${chosenOption.text}` : (selectedAnswerId || ''),
      targetTab: 'crimelab',
      targetId: activeCase.id,
      metadata: {
        caseNumber: activeCase.caseNumber,
        category: activeCase.category,
        difficulty: activeCase.difficulty,
        isCorrect
      }
    });

    if (isCorrect) {
      setShowExplanation(true);
      setSubmissionFeedback({
        isCorrect: true,
        message: 'Correct Finding! Case Solved. Technical forensic audit verdict verified.'
      });
    } else {
      if (!wrongAnswerIds.includes(selectedAnswerId)) {
        setWrongAnswerIds(prev => [...prev, selectedAnswerId]);
      }
      setSubmissionFeedback({
        isCorrect: false,
        message: 'Incorrect Finding Option. Review the evidence items or unlock hints to re-evaluate the incident.'
      });
    }
  };

  // Evidence Type Icon Helper
  const getEvidenceIcon = (type: EvidenceItem['type']) => {
    switch (type) {
      case 'log': return <Terminal style={{ width: 15, height: 15, color: 'var(--accent-primary)' }} />;
      case 'network': return <Network style={{ width: 15, height: 15, color: 'var(--hard-color)' }} />;
      case 'file': return <FileCode style={{ width: 15, height: 15, color: 'var(--easy-color)' }} />;
      case 'timeline': return <Clock style={{ width: 15, height: 15, color: 'var(--medium-color)' }} />;
      case 'device': return <Cpu style={{ width: 15, height: 15, color: 'var(--accent-secondary)' }} />;
      case 'statement': return <MessageSquare style={{ width: 15, height: 15, color: 'var(--text-muted)' }} />;
      default: return <FileText style={{ width: 15, height: 15, color: 'var(--text-secondary)' }} />;
    }
  };

  // Rank Helper based on solved count
  const getUserRank = (solvedCount: number) => {
    if (solvedCount >= 50) return { rank: 'Chief Cyber Forensic Director', badgeVariant: 'hard' as const };
    if (solvedCount >= 25) return { rank: 'Senior Threat Analyst', badgeVariant: 'hard' as const };
    if (solvedCount >= 10) return { rank: 'Forensic Investigator II', badgeVariant: 'medium' as const };
    if (solvedCount >= 5) return { rank: 'Junior Security Auditor', badgeVariant: 'medium' as const };
    return { rank: 'Apprentice Investigator', badgeVariant: 'blue' as const };
  };

  const userRank = getUserRank(solvedCaseCount);

  // Validate active case structure before displaying
  const validation = validateCrimeLabCase(activeCase);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* ========================================================================= */}
      {/* VIEW 1: CRIME LAB EXPLORER                                               */}
      {/* ========================================================================= */}
      {viewMode === 'explorer' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* HEADER & RANK TRACKER */}
          <div 
            className="card" 
            style={{ 
              background: 'var(--bg-surface)',
              borderColor: 'rgba(236, 72, 153, 0.35)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px',
              boxShadow: '0 8px 24px rgba(236, 72, 153, 0.08)'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <ShieldAlert style={{ width: 22, height: 22, color: 'var(--hard-color)' }} />
                <Badge variant="hard">Cybersecurity & Technical Forensic Crime Lab</Badge>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{crimeLabQuestionsData.length.toLocaleString()} Case Files</span>
              </div>
              <h2 className="page-title" style={{ fontSize: '1.75rem', letterSpacing: '-0.02em' }}>
                Crime Lab Case Files & Evidence Investigation
              </h2>
              <p className="page-subtitle" style={{ fontSize: '0.85rem', marginTop: '4px' }}>
                Inspect technical evidence, review logs & system states, choose the correct audit finding, and unlock detailed security explanations.
              </p>
            </div>

            {/* Crime Lab Progress Metrics */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'right' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end' }}>
                  <Award style={{ width: 16, height: 16, color: 'var(--hard-color)' }} />
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Investigator Rank:</span>
                  <Badge variant={userRank.badgeVariant}>{userRank.rank}</Badge>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 700 }}>
                  Cases Solved: <span style={{ color: 'var(--easy-color)' }}>{solvedCaseCount}</span> / {crimeLabQuestionsData.length} ({((solvedCaseCount / (crimeLabQuestionsData.length || 1)) * 100).toFixed(1)}%)
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={handleRandomCase}
                >
                  <Shuffle style={{ width: 14, height: 14, color: 'var(--hard-color)' }} />
                  <span>Random Case</span>
                </button>

                {solvedCaseCount > 0 && (
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={handleResetProgress}
                    title="Reset Crime Lab Progress"
                  >
                    <RotateCcw style={{ width: 14, height: 14 }} />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* FILTER & SEARCH BAR */}
          <div 
            className="card" 
            style={{ 
              display: 'flex', 
              flexDirection: 'column',
              gap: '14px',
              padding: '16px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: 'var(--bg-root)', padding: '8px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <Search style={{ width: 16, height: 16, color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search Crime Lab case title, vulnerability category, or case number..."
                style={{ background: 'none', border: 'none', outline: 'none', color: 'var(--text-primary)', width: '100%', fontSize: '0.875rem' }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Filter style={{ width: 14, height: 14, color: 'var(--text-muted)' }} />
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Category:</span>
                <select
                  className="select-field"
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                >
                  {crimeLabTopics.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Difficulty:</span>
                <select
                  className="select-field"
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                >
                  {['All Difficulties', 'Beginner', 'Intermediate', 'Advanced'].map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              {/* Interactive Difficulty Pills */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginLeft: 'auto' }}>
                {['All Difficulties', 'Beginner', 'Intermediate', 'Advanced'].map(d => {
                  const isSelected = selectedDifficulty === d;
                  const count = d === 'All Difficulties' 
                    ? crimeLabQuestionsData.length 
                    : crimeLabQuestionsData.filter(c => c.difficulty === d).length;

                  return (
                    <button
                      key={d}
                      onClick={() => setSelectedDifficulty(d)}
                      className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-outline'}`}
                      style={{ fontSize: '0.78rem', borderRadius: '20px', padding: '3px 10px' }}
                    >
                      <span>{d === 'All Difficulties' ? 'All' : d}</span>
                      <span style={{ opacity: 0.8, fontSize: '0.72rem', marginLeft: '4px' }}>({count})</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* CASE FILES GRID */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div className="card" style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <List style={{ width: 16, height: 16, color: 'var(--hard-color)' }} />
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Available Case Files ({filteredCases.length})
                </span>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Solved: {filteredCases.filter(c => progressMap[c.id]?.completed && progressMap[c.id]?.isCorrect).length}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '14px' }}>
              {filteredCases.length === 0 ? (
                <div className="card" style={{ gridColumn: '1 / -1', padding: '32px 16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  No Crime Lab cases match your search or filter selection.
                </div>
              ) : (
                filteredCases.map(c => {
                  const isSolved = !!(progressMap[c.id]?.completed && progressMap[c.id]?.isCorrect);

                  return (
                    <div
                      key={c.id}
                      className="card card-interactive"
                      onClick={() => handleOpenDetail(c.id)}
                      style={{
                        padding: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                        border: isSolved ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid var(--border-subtle)',
                        backgroundColor: 'var(--bg-surface)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {isSolved ? (
                            <Badge variant="easy">Solved ✅</Badge>
                          ) : (
                            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: '0.75rem', color: 'var(--hard-color)' }}>
                              Case {c.caseNumber}
                            </span>
                          )}
                        </div>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <Badge variant="blue">{c.category}</Badge>
                          <Badge variant={c.difficulty === 'Beginner' ? 'easy' : c.difficulty === 'Intermediate' ? 'medium' : 'hard'}>
                            {c.difficulty}
                          </Badge>
                        </div>
                      </div>

                      <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: '1.4' }}>
                        {c.title}
                      </h4>

                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '1.5' }}>
                        {c.summary || c.problemStatement}
                      </p>

                      <div style={{ marginTop: 'auto', paddingTop: '8px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>
                          Inspect Evidence & Case File
                        </span>
                        <ArrowRight style={{ width: 14, height: 14, color: 'var(--primary)' }} />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: CASE INVESTIGATION DETAIL VIEW                                    */}
      {/* ========================================================================= */}
      {viewMode === 'detail' && activeCase && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Top Header Controls */}
          <div 
            className="card" 
            style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              flexWrap: 'wrap', 
              gap: '16px',
              backgroundColor: 'var(--bg-surface-elevated)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <button
                className="btn btn-outline btn-sm"
                onClick={handleBackToExplorer}
              >
                <ArrowLeft style={{ width: 14, height: 14 }} />
                <span>Crime Lab Explorer</span>
              </button>
              
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>/</span>

              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span>Case {activeCase.caseNumber} — {activeCase.title}</span>
                  <Badge variant="blue">{activeCase.category}</Badge>
                  <Badge variant={activeCase.difficulty === 'Beginner' ? 'easy' : activeCase.difficulty === 'Intermediate' ? 'medium' : 'hard'}>
                    {activeCase.difficulty}
                  </Badge>
                  {activeProgress?.completed && activeProgress?.isCorrect && (
                    <Badge variant="easy">Solved ✅</Badge>
                  )}
                </h2>
              </div>
            </div>

            {/* Prev / Next Case Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                className="btn btn-outline btn-sm"
                disabled={activeIndex <= 0}
                onClick={handlePrevCase}
              >
                <ChevronLeft style={{ width: 14, height: 14 }} />
                <span>Prev Case</span>
              </button>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {activeCase.caseNumber} / {crimeLabQuestionsData.length}
              </span>
              <button
                className="btn btn-outline btn-sm"
                disabled={activeIndex >= crimeLabQuestionsData.length - 1}
                onClick={handleNextCase}
              >
                <span>Next Case</span>
                <ChevronRight style={{ width: 14, height: 14 }} />
              </button>
            </div>
          </div>

          {/* Validation Banner if case structure has issues */}
          {!validation.isValid && (
            <div style={{ padding: '12px 16px', backgroundColor: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.4)', borderRadius: 'var(--radius-md)', color: '#f87171', fontSize: '0.84rem' }}>
              ⚠️ Case validation warning: {validation.errors.join(', ')}
            </div>
          )}

          {/* MAIN CASE INVESTIGATION LAYOUT */}
          <div className="grid-2" style={{ gridTemplateColumns: '1.1fr 1fr', gap: '20px', alignItems: 'start' }}>
            
            {/* LEFT COLUMN: Problem Statement, Structured Evidence, Objective & Hints */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* INCIDENT REPORT & PROBLEM STATEMENT */}
              <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--hard-color)', fontWeight: 700, fontSize: '0.95rem' }}>
                    <ShieldAlert style={{ width: 18, height: 18 }} />
                    <span>Case Incident Report & Problem Statement</span>
                  </div>
                  {activeCase.estimatedTime && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      <Clock style={{ width: 13, height: 13 }} />
                      <span>Est. {activeCase.estimatedTime} mins</span>
                    </div>
                  )}
                </div>

                <div 
                  style={{ 
                    fontSize: '0.9rem', 
                    color: 'var(--text-primary)', 
                    lineHeight: '1.6', 
                    whiteSpace: 'pre-line', 
                    padding: '16px', 
                    backgroundColor: 'var(--bg-base)', 
                    borderRadius: 'var(--radius-md)', 
                    border: '1px solid var(--border-subtle)' 
                  }}
                >
                  {activeCase.problemStatement}
                </div>
              </div>

              {/* STRUCTURED EVIDENCE ITEMS */}
              <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                    <FileText style={{ width: 18, height: 18, color: 'var(--accent-primary)' }} />
                    <span>Structured Evidence Items ({activeCase.evidence?.length || 0})</span>
                  </h4>
                </div>

                {(!activeCase.evidence || activeCase.evidence.length === 0) ? (
                  <div style={{ padding: '12px', fontSize: '0.84rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                    No evidence items attached.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {activeCase.evidence.map((evItem) => (
                      <div
                        key={evItem.id}
                        style={{
                          padding: '14px',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--border-subtle)',
                          backgroundColor: 'var(--bg-root)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '6px'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {getEvidenceIcon(evItem.type)}
                            <strong style={{ fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                              {evItem.title}
                            </strong>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            {evItem.importance && (
                              <span style={{
                                fontSize: '0.7rem',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                fontWeight: 700,
                                backgroundColor: evItem.importance === 'high' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(99, 102, 241, 0.15)',
                                color: evItem.importance === 'high' ? '#f87171' : 'var(--accent-primary)'
                              }}>
                                {evItem.importance.toUpperCase()} PRIORITY
                              </span>
                            )}
                            {evItem.source && (
                              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                                Source: {evItem.source}
                              </span>
                            )}
                          </div>
                        </div>

                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--text-secondary)', backgroundColor: 'var(--bg-card)', padding: '10px 12px', borderRadius: '4px', border: '1px solid var(--border-subtle)', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>
                          {evItem.content}
                        </div>

                        {evItem.timestamp && (
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textAlign: 'right' }}>
                            Timestamp: {evItem.timestamp}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* INVESTIGATIVE OBJECTIVE */}
              <div className="card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', backgroundColor: 'rgba(99, 102, 241, 0.06)', border: '1px dashed rgba(99, 102, 241, 0.3)' }}>
                <strong style={{ fontSize: '0.85rem', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ShieldCheck style={{ width: 16, height: 16 }} />
                  <span>Investigative Task Objective:</span>
                </strong>
                <p style={{ fontSize: '0.86rem', color: 'var(--text-primary)', margin: 0, lineHeight: '1.5' }}>
                  {activeCase.objective || activeCase.question}
                </p>
              </div>

              {/* PROGRESSIVE HINTS SYSTEM */}
              <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                    <HelpCircle style={{ width: 18, height: 18, color: 'var(--accent-primary)' }} />
                    <span>Progressive Hints</span>
                  </h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {activeCase.hints?.length || 0} Progressive Hints Available
                  </span>
                </div>

                {(!activeCase.hints || activeCase.hints.length === 0) ? (
                  <div style={{ padding: '12px 14px', backgroundColor: 'var(--bg-root)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                    Hints are being prepared.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {activeCase.hints.map((hintObj) => {
                      const isRevealed = !!openHintLevels[hintObj.level];

                      return (
                        <div 
                          key={hintObj.id} 
                          style={{ 
                            border: isRevealed ? '1px solid var(--border-focus)' : '1px solid var(--border-subtle)', 
                            borderRadius: 'var(--radius-md)', 
                            backgroundColor: isRevealed ? 'var(--bg-surface)' : 'var(--bg-root)',
                            overflow: 'hidden',
                            transition: 'var(--transition-fast)'
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => toggleHint(hintObj.level, hintObj.id)}
                            style={{
                              width: '100%',
                              padding: '10px 14px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              background: isRevealed ? 'var(--bg-hover)' : 'transparent',
                              border: 'none',
                              color: isRevealed ? 'var(--accent-primary)' : 'var(--text-primary)',
                              fontSize: '0.85rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                              textAlign: 'left',
                              minHeight: '40px'
                            }}
                            aria-expanded={isRevealed}
                          >
                            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <Sparkles style={{ width: 15, height: 15, color: isRevealed ? 'var(--accent-primary)' : 'var(--state-warning)' }} />
                              <span>{isRevealed ? `💡 Hide ${hintObj.title || `Hint ${hintObj.level}`}` : `💡 Show ${hintObj.title || `Hint ${hintObj.level}`}`}</span>
                            </span>
                            {isRevealed ? <ChevronUp style={{ width: 16, height: 16 }} /> : <ChevronDown style={{ width: 16, height: 16 }} />}
                          </button>

                          {isRevealed && (
                            <div 
                              style={{ 
                                padding: '12px 16px', 
                                fontSize: '0.85rem', 
                                color: 'var(--text-primary)', 
                                borderTop: '1px solid var(--border-subtle)', 
                                backgroundColor: 'var(--bg-card)',
                                lineHeight: '1.5',
                                animation: 'fadeIn 0.2s ease-out'
                              }}
                            >
                              {hintObj.content}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>

            {/* RIGHT COLUMN: Options Selection, Submission & Reasoning Explanation */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* AUDIT FINDING OPTIONS */}
              <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                    Forensic Audit Finding Options
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    Select the option that correctly identifies or remediates the flaw:
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {activeCase.answerOptions.map((option, idx) => {
                    const isSelected = selectedAnswerId === option.id;
                    const isCorrect = option.id === activeCase.correctAnswerId;
                    const isWrong = wrongAnswerIds.includes(option.id);

                    let border = '1px solid var(--border-subtle)';
                    let bg = 'var(--bg-base)';
                    if (isSubmitted && isSelected && isCorrect) {
                      border = '2px solid #10b981';
                      bg = 'rgba(16, 185, 129, 0.15)';
                    } else if (isWrong) {
                      border = '2px solid #f87171';
                      bg = 'rgba(239, 68, 68, 0.15)';
                    } else if (isSelected) {
                      border = '2px solid var(--accent-primary)';
                      bg = 'rgba(99, 102, 241, 0.15)';
                    }

                    return (
                      <button
                        key={option.id}
                        onClick={() => setSelectedAnswerId(option.id)}
                        style={{
                          padding: '12px 14px',
                          borderRadius: 'var(--radius-md)',
                          border,
                          backgroundColor: bg,
                          color: 'var(--text-primary)',
                          textAlign: 'left',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          fontSize: '0.85rem',
                          transition: 'all 0.2s'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                          <strong style={{ color: 'var(--accent-primary)', flexShrink: 0 }}>
                            Option {['A', 'B', 'C', 'D'][idx]}:
                          </strong>
                          <span>{option.text}</span>
                        </div>
                        {isSubmitted && isSelected && isCorrect && <CheckCircle2 style={{ width: 16, height: 16, color: '#10b981', flexShrink: 0 }} />}
                        {isWrong && <XCircle style={{ width: 16, height: 16, color: '#f87171', flexShrink: 0 }} />}
                      </button>
                    );
                  })}
                </div>

                {/* Submit Choice Button */}
                <button
                  onClick={handleSubmitChoice}
                  disabled={!selectedAnswerId}
                  className="btn btn-primary"
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    padding: '11px 16px',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    opacity: !selectedAnswerId ? 0.5 : 1
                  }}
                >
                  <ShieldCheck style={{ width: 16, height: 16 }} />
                  <span>Submit Audit Verdict</span>
                </button>

                {/* Submission Feedback Message */}
                {submissionFeedback && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '12px 14px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: submissionFeedback.isCorrect ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                      border: `1px solid ${submissionFeedback.isCorrect ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                      color: submissionFeedback.isCorrect ? '#10b981' : '#f87171',
                      fontSize: '0.84rem'
                    }}
                  >
                    {submissionFeedback.isCorrect ? <CheckCircle2 style={{ width: 16, height: 16, flexShrink: 0 }} /> : <AlertTriangle style={{ width: 16, height: 16, flexShrink: 0 }} />}
                    <span>{submissionFeedback.message}</span>
                  </div>
                )}
              </div>

              {/* SOLUTION & REASONING CHAIN EXPLANATION */}
              <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <FileText style={{ width: 16, height: 16, color: 'var(--accent-primary)' }} />
                    <span>Forensic Reasoning Chain & Explanation</span>
                  </h4>

                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => setShowExplanation(!showExplanation)}
                    style={{ fontSize: '0.78rem' }}
                  >
                    {showExplanation ? <EyeOff style={{ width: 14, height: 14 }} /> : <Eye style={{ width: 14, height: 14 }} />}
                    <span>{showExplanation ? 'Hide Explanation' : 'View Explanation'}</span>
                  </button>
                </div>

                {showExplanation ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    
                    {/* Correct Option Highlight */}
                    <div style={{ padding: '12px 14px', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                      <h5 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#10b981', margin: 0, marginBottom: '4px' }}>
                        Correct Verdict: Option {['A', 'B', 'C', 'D'][activeCase.answerOptions.findIndex(o => o.id === activeCase.correctAnswerId)]}
                      </h5>
                      <div style={{ fontSize: '0.84rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                        {activeCase.answerOptions.find(o => o.id === activeCase.correctAnswerId)?.text}
                      </div>
                    </div>

                    {/* Reasoning Chain: Evidence -> Observation -> Reasoning -> Conclusion */}
                    {activeCase.explanation?.evidenceReasoning && activeCase.explanation.evidenceReasoning.length > 0 && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <strong style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Reasoning Chain:</strong>
                        {activeCase.explanation.evidenceReasoning.map((step, sIdx) => (
                          <div key={sIdx} style={{ fontSize: '0.82rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'flex-start', gap: '8px', lineHeight: '1.5' }}>
                            <span style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>•</span>
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Detailed Analysis */}
                    <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
                      <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>Detailed Forensic Analysis:</strong>
                      {activeCase.explanation?.answerReason}
                    </div>

                  </div>
                ) : (
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0, fontStyle: 'italic' }}>
                    Submit your audit choice or click "View Explanation" to unveil the detailed security reasoning chain.
                  </p>
                )}
              </div>

              {/* LEARNING POINTS */}
              {activeCase.learningPoints && activeCase.learningPoints.length > 0 && (
                <div className="card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px', margin: 0 }}>
                    <BookOpen style={{ width: 15, height: 15, color: 'var(--accent-primary)' }} />
                    <span>Key Takeaway Skills:</span>
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {activeCase.learningPoints.map((lp, idx) => (
                      <div key={idx} style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Check style={{ width: 14, height: 14, color: '#10b981' }} />
                        <span>{lp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* RELATED PLATFORM SECTIONS */}
              {onNavigateTab && (
                <div className="card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px', margin: 0 }}>
                    <MapPin style={{ width: 15, height: 15, color: 'var(--accent-primary)' }} />
                    <span>Related Learning Paths:</span>
                  </h4>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => onNavigateTab('problems')}
                      style={{ fontSize: '0.78rem' }}
                    >
                      <Code style={{ width: 14, height: 14 }} />
                      <span>Practice Coding Problems</span>
                    </button>
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => onNavigateTab('learn')}
                      style={{ fontSize: '0.78rem' }}
                    >
                      <BookOpen style={{ width: 14, height: 14 }} />
                      <span>Flow of Learning Roadmap</span>
                    </button>
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>
      )}

    </div>
  );
};
