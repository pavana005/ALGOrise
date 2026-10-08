import React, { useState, useEffect, useMemo } from 'react';
import { 
  Check, 
  Code2, 
  Eye, 
  CheckCircle2, 
  AlertTriangle, 
  Globe, 
  ArrowRight, 
  Sparkles, 
  Target, 
  ListOrdered, 
  Award, 
  Milestone, 
  Search, 
  Filter, 
  ChevronRight, 
  BookOpen, 
  ChevronDown, 
  ChevronUp, 
  HelpCircle, 
  PenTool
} from 'lucide-react';
import { Badge } from '../components/common/Badge';
import type { TabType } from '../components/layout/Sidebar';
import { dsaRoadmapStages, type RoadmapStage } from '../data/curriculumData';
import { useAuth } from '../context/AuthContext';
import { triggerMotivationPopup } from '../components/common/MotivationPopup';
import { userAnswersService } from '../services/userAnswersService';

interface LearnPageProps {
  onNavigateTab: (tab: TabType, extraId?: string) => void;
  onShowDevNotice?: (msg: string) => void;
  initialStageId?: string;
}

export const LearnPage: React.FC<LearnPageProps> = ({ onNavigateTab, initialStageId }) => {
  const { user } = useAuth();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Completed' | 'Remaining'>('All');
  const [expandedStageId, setExpandedStageId] = useState<string | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [stageReflections, setStageReflections] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem(`algorise_stage_reflections_${user?.id || 'guest'}`);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Track completed roadmap stages in user-scoped localStorage
  const userStorageKey = useMemo(() => {
    return user ? `algorise_completed_roadmap_stages_${user.id}` : 'algorise_completed_roadmap_stages_guest';
  }, [user]);

  const [completedStageIds, setCompletedStageIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(userStorageKey);
      if (saved) return JSON.parse(saved);
      // Migration fallback from legacy key
      const legacy = localStorage.getItem('algorise_completed_roadmap_stages');
      return legacy ? JSON.parse(legacy) : ['programming-foundations', 'arrays-strings'];
    } catch {
      return ['programming-foundations', 'arrays-strings'];
    }
  });

  // Re-sync progress when user changes
  useEffect(() => {
    try {
      const saved = localStorage.getItem(userStorageKey);
      if (saved) {
        setCompletedStageIds(JSON.parse(saved));
      } else {
        setCompletedStageIds(['programming-foundations', 'arrays-strings']);
      }
    } catch {
      setCompletedStageIds(['programming-foundations', 'arrays-strings']);
    }
  }, [userStorageKey]);

  useEffect(() => {
    try {
      localStorage.setItem(userStorageKey, JSON.stringify(completedStageIds));
    } catch {
      // Ignore
    }
  }, [completedStageIds, userStorageKey]);

  useEffect(() => {
    const timer = setTimeout(() => {
      triggerMotivationPopup('LEARNING', false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const toggleStageCompletion = (stageId: string) => {
    setCompletedStageIds(prev => {
      const isDone = prev.includes(stageId);
      const next = isDone ? prev.filter(id => id !== stageId) : [...prev, stageId];
      if (!isDone) {
        triggerMotivationPopup('LESSON_COMPLETE', true);
      }
      return next;
    });
  };

  const scrollToStage = (stageId: string) => {
    const el = document.getElementById(`stage-${stageId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    if (initialStageId) {
      setExpandedStageId(initialStageId);
      setTimeout(() => {
        scrollToStage(initialStageId);
      }, 150);
    }
  }, [initialStageId]);

  const handleSelectQuizAnswer = (stage: RoadmapStage, optIndex: number, optText: string) => {
    setQuizAnswers(prev => ({ ...prev, [stage.id]: optIndex }));
    userAnswersService.saveAnswer({
      activityType: 'learning_quiz',
      activityTitle: `Flow of Learning: ${stage.title}`,
      questionId: `stage-quiz-${stage.id}`,
      questionTitle: `Space Complexity Invariant for ${stage.title}`,
      questionContext: `Stage #${stage.stageNumber} Quick Knowledge Check: Which optimal space complexity invariant applies to ${stage.title}?`,
      answer: optText,
      targetTab: 'learn',
      targetId: stage.id,
      metadata: { stageNumber: stage.stageNumber, optionIndex: optIndex }
    });
  };

  const handleSaveReflection = (stage: RoadmapStage, text: string) => {
    const trimmed = text.trim();
    setStageReflections(prev => {
      const next = { ...prev, [stage.id]: trimmed };
      try {
        localStorage.setItem(`algorise_stage_reflections_${user?.id || 'guest'}`, JSON.stringify(next));
      } catch {
        // Ignore
      }
      return next;
    });

    if (trimmed) {
      userAnswersService.saveAnswer({
        activityType: 'learning_reflection',
        activityTitle: `Stage Reflection: ${stage.title}`,
        questionId: `stage-reflection-${stage.id}`,
        questionTitle: `Key Mental Model & Reflection for ${stage.title}`,
        questionContext: `Stage #${stage.stageNumber}: ${stage.title}`,
        answer: trimmed,
        targetTab: 'learn',
        targetId: stage.id,
        metadata: { stageNumber: stage.stageNumber }
      });
    }
  };

  // Find user's first unfinished stage for "Continue Learning"
  const firstUnfinishedStage = useMemo(() => {
    return dsaRoadmapStages.find(st => !completedStageIds.includes(st.id)) || dsaRoadmapStages[0];
  }, [completedStageIds]);

  const handleContinueLearning = () => {
    if (firstUnfinishedStage) {
      setExpandedStageId(firstUnfinishedStage.id);
      scrollToStage(firstUnfinishedStage.id);
    }
  };

  // Filtered Stages list
  const filteredStages = useMemo(() => {
    return dsaRoadmapStages.filter(stage => {
      // Status Filter
      const isDone = completedStageIds.includes(stage.id);
      if (statusFilter === 'Completed' && !isDone) return false;
      if (statusFilter === 'Remaining' && isDone) return false;

      // Search Filter
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesTitle = stage.title.toLowerCase().includes(q);
        const matchesWhat = stage.whatToLearn.toLowerCase().includes(q);
        const matchesTopics = stage.keyTopics.some(t => t.toLowerCase().includes(q));
        const matchesConcepts = stage.importantConcepts.some(c => c.toLowerCase().includes(q));
        if (!matchesTitle && !matchesWhat && !matchesTopics && !matchesConcepts) {
          return false;
        }
      }

      return true;
    });
  }, [completedStageIds, statusFilter, searchQuery]);

  const totalStages = dsaRoadmapStages.length;
  const completedCount = completedStageIds.length;
  const progressPercentage = Math.round((completedCount / totalStages) * 100);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      
      {/* 1. HERO SECTION & OVERALL ROADMAP MASTERY PROGRESS */}
      <div 
        className="card"
        style={{
          padding: '16px 20px',
          background: 'var(--bg-surface)',
          borderColor: 'var(--color-purple-border)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <Badge variant="purple">Continuous 12-Stage Curriculum</Badge>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {user ? `Learner: ${user.name} (@${user.username})` : 'Guest Mode'}
              </span>
            </div>
            <h1 className="page-title" style={{ fontSize: '1.35rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
              <Milestone style={{ width: 22, height: 22, color: 'var(--primary)' }} />
              <span>ALGOrise Data Structures & Algorithms Roadmap</span>
            </h1>
            <p className="page-subtitle" style={{ fontSize: '0.825rem', marginTop: '4px', color: 'var(--text-secondary)' }}>
              A structured, highly informative, and compact step-by-step master path covering every core DSA domain from absolute foundations to advanced algorithmic strategies.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <button
              className="btn btn-primary btn-sm"
              onClick={handleContinueLearning}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px' }}
            >
              <span>Continue Learning</span>
              <ChevronRight style={{ width: 14, height: 14 }} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'var(--bg-card)', padding: '6px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <Award style={{ width: 18, height: 18, color: 'var(--easy-color)' }} />
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Mastery Status</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {completedCount} / {totalStages} Stages Done
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PROGRESS TRACKER BAR */}
        <div style={{ paddingTop: '10px', borderTop: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.775rem' }}>
            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
              Overall Roadmap Progress: {completedCount} of {totalStages} Stages Mastered ({progressPercentage}%)
            </span>
            <span style={{ color: progressPercentage === 100 ? 'var(--easy-color)' : 'var(--color-cyan)', fontWeight: 700 }}>
              {progressPercentage === 100 ? '🎉 Full DSA Curriculum Mastered!' : `${totalStages - completedCount} stages remaining`}
            </span>
          </div>
          <div className="progress-container" style={{ height: '8px', backgroundColor: 'rgba(0,0,0,0.4)' }}>
            <div className="progress-fill progress-fill-purple" style={{ width: `${progressPercentage}%`, transition: 'width 0.4s ease' }} />
          </div>
        </div>
      </div>

      {/* 2. SEARCH & FILTER TOOLBAR */}
      <div 
        className="card"
        style={{
          padding: '10px 14px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px',
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-subtle)'
        }}
      >
        <div className="search-input-wrapper" style={{ flex: '1 1 240px', maxWidth: '360px' }}>
          <Search className="search-icon" style={{ width: 14, height: 14 }} />
          <input
            type="text"
            className="input-field"
            placeholder="Search roadmap by topic, keyword, concept..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ padding: '5px 10px 5px 32px', fontSize: '0.8rem' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <Filter style={{ width: 14, height: 14, color: 'var(--text-muted)' }} />
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Status:</span>
          {(['All', 'Completed', 'Remaining'] as const).map((st) => (
            <button
              key={st}
              className={`btn btn-sm ${statusFilter === st ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setStatusFilter(st)}
              style={{ padding: '3px 8px', fontSize: '0.75rem' }}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* 3. COMPACT ROADMAP QUICK NAVIGATOR STEPPER */}
      <div 
        className="card"
        style={{
          padding: '10px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          borderColor: 'var(--border-subtle)',
          backgroundColor: 'var(--bg-surface)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ListOrdered style={{ width: 14, height: 14, color: 'var(--primary)' }} />
            Quick Stage Navigator (1 → 12)
          </span>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Click any stage to jump directly</span>
        </div>

        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '6px', paddingRight: '12px', scrollbarWidth: 'auto', WebkitOverflowScrolling: 'touch' }}>
          {dsaRoadmapStages.map((st) => {
            const isDone = completedStageIds.includes(st.id);
            return (
              <button
                key={st.id}
                onClick={() => scrollToStage(st.id)}
                style={{
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-sm)',
                  border: isDone ? '1px solid rgba(16, 185, 129, 0.5)' : '1px solid var(--border-subtle)',
                  backgroundColor: isDone ? 'rgba(16, 185, 129, 0.12)' : 'var(--bg-card)',
                  color: isDone ? 'var(--easy-color)' : 'var(--text-secondary)',
                  fontSize: '0.725rem',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  transition: 'all 0.15s ease'
                }}
              >
                <span>#{st.stageNumber}</span>
                <span>{st.title}</span>
                {isDone && <Check style={{ width: 11, height: 11, strokeWidth: 3 }} />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. CONTINUOUS ROADMAP TIMELINE VIEW */}
      <div style={{ display: 'flex', flexDirection: 'column', position: 'relative', gap: '20px' }}>
        
        {/* Continuous Timeline vertical connector line */}
        <div 
          style={{ 
            position: 'absolute', 
            top: '24px', 
            bottom: '24px', 
            left: '21px', 
            width: '2px', 
            background: 'linear-gradient(to bottom, var(--primary), var(--color-purple), var(--color-cyan))', 
            zIndex: 0,
            opacity: 0.4
          }} 
        />

        {filteredStages.map((stage: RoadmapStage) => {
          const isCompleted = completedStageIds.includes(stage.id);
          const isExpanded = expandedStageId === stage.id;

          return (
            <div 
              key={stage.id} 
              id={`stage-${stage.id}`}
              style={{ 
                display: 'flex', 
                gap: '16px', 
                position: 'relative', 
                zIndex: 1 
              }}
            >
              {/* Timeline Stage Node Number Badge */}
              <div 
                style={{ 
                  flexShrink: 0, 
                  width: '44px', 
                  height: '44px', 
                  borderRadius: '50%', 
                  backgroundColor: isCompleted ? 'var(--easy-color)' : 'var(--bg-card)', 
                  border: isCompleted ? '3px solid #10B981' : '3px solid var(--primary)', 
                  boxShadow: isCompleted ? '0 0 12px rgba(16, 185, 129, 0.4)' : '0 0 10px rgba(59, 130, 246, 0.3)',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  color: '#FFFFFF', 
                  fontWeight: 800, 
                  fontSize: isCompleted ? '0.9rem' : '0.85rem',
                  transition: 'all 0.2s ease',
                  marginTop: '4px'
                }}
              >
                {isCompleted ? <Check style={{ width: 20, height: 20, strokeWidth: 3 }} /> : stage.stageNumber}
              </div>

              {/* Stage Detail Card Container */}
              <div 
                className="card"
                style={{ 
                  flex: 1, 
                  padding: '14px 16px', 
                  borderColor: isCompleted ? 'rgba(16, 185, 129, 0.4)' : 'var(--border-medium)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  backgroundColor: 'var(--bg-card)'
                }}
              >
                {/* STAGE HEADER BAR */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', paddingBottom: '10px', borderBottom: '1px solid var(--border-subtle)' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.725rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Stage {stage.stageNumber} of 12
                      </span>
                      <Badge variant="purple">{stage.recommendedOrder}</Badge>
                      {isCompleted && <Badge variant="easy">✓ Mastered</Badge>}
                    </div>
                    <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
                      {stage.title}
                    </h2>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <button
                      onClick={() => setExpandedStageId(isExpanded ? null : stage.id)}
                      className="btn btn-outline btn-sm"
                      style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                    >
                      <span>{isExpanded ? 'Hide Details' : 'View Lesson Details'}</span>
                      {isExpanded ? <ChevronUp style={{ width: 13, height: 13 }} /> : <ChevronDown style={{ width: 13, height: 13 }} />}
                    </button>

                    {/* Stage Completion Button */}
                    <button
                      onClick={() => toggleStageCompletion(stage.id)}
                      className={`btn btn-sm ${isCompleted ? 'btn-outline' : 'btn-primary'}`}
                      style={{ 
                        padding: '4px 12px', 
                        fontSize: '0.75rem',
                        borderColor: isCompleted ? 'var(--easy-color)' : undefined,
                        color: isCompleted ? 'var(--easy-color)' : undefined
                      }}
                    >
                      <Check style={{ width: 14, height: 14, strokeWidth: 2.5 }} />
                      <span>{isCompleted ? 'Marked Completed' : 'Mark Stage Complete'}</span>
                    </button>
                  </div>
                </div>

                {/* 1. WHAT TO LEARN & WHY IT IS IMPORTANT */}
                <div className="grid-2" style={{ gap: '10px' }}>
                  {/* What to Learn */}
                  <div style={{ padding: '10px 12px', backgroundColor: 'rgba(59, 130, 246, 0.05)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                    <div style={{ fontSize: '0.725rem', fontWeight: 700, color: 'var(--color-blue)', textTransform: 'uppercase', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Target style={{ width: 13, height: 13 }} />
                      <span>What to Learn</span>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-primary)', lineHeight: '1.45', margin: 0 }}>
                      {stage.whatToLearn}
                    </p>
                  </div>

                  {/* Why it is Important */}
                  <div style={{ padding: '10px 12px', backgroundColor: 'rgba(168, 85, 247, 0.05)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(168, 85, 247, 0.2)' }}>
                    <div style={{ fontSize: '0.725rem', fontWeight: 700, color: 'var(--color-purple)', textTransform: 'uppercase', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Sparkles style={{ width: 13, height: 13 }} />
                      <span>Why it is Important</span>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-primary)', lineHeight: '1.45', margin: 0 }}>
                      {stage.whyImportant}
                    </p>
                  </div>
                </div>

                {/* EXPANDED LESSON DETAILS ACCORDION */}
                {isExpanded && (
                  <div style={{ padding: '12px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ fontSize: '0.825rem', fontWeight: 800, color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <BookOpen style={{ width: 15, height: 15 }} />
                      <span>Stage #{stage.stageNumber} Detailed Lesson Breakdown:</span>
                    </div>

                    {/* Important Concepts Detail */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {stage.importantConcepts.map((concept, idx) => (
                        <div key={idx} style={{ padding: '8px 10px', backgroundColor: 'var(--bg-base)', border: '1px solid var(--border-subtle)', borderRadius: '6px', fontSize: '0.78rem', color: 'var(--text-primary)' }}>
                          <strong>Concept #{idx + 1}:</strong> {concept}
                        </div>
                      ))}
                    </div>

                    {/* Interactive Knowledge Quiz Check */}
                    <div style={{ padding: '10px 12px', backgroundColor: 'rgba(59, 130, 246, 0.08)', border: '1px solid rgba(59, 130, 246, 0.25)', borderRadius: '6px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--accent-blue)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <HelpCircle style={{ width: 14, height: 14 }} />
                        <span>Quick Knowledge Check (Stage #{stage.stageNumber}):</span>
                      </div>
                      <p style={{ fontSize: '0.775rem', color: 'var(--text-primary)', margin: 0 }}>
                        Which optimal space complexity invariant applies to {stage.title}?
                      </p>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '4px' }}>
                        {['O(1) Auxiliary Space', 'O(N) Memory Space', 'O(N^2) Space'].map((opt, oIdx) => {
                          const isSelected = quizAnswers[stage.id] === oIdx;
                          return (
                            <button
                              key={oIdx}
                              className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-outline'}`}
                              onClick={() => handleSelectQuizAnswer(stage, oIdx, opt)}
                              style={{ padding: '3px 10px', fontSize: '0.725rem' }}
                            >
                              {isSelected ? '✓ ' : ''}{opt}
                            </button>
                          );
                        })}
                      </div>
                      {quizAnswers[stage.id] !== undefined && (
                        <div style={{ fontSize: '0.725rem', color: '#10B981', fontWeight: 700, marginTop: '2px' }}>
                          ✓ Answer recorded for personal reference!
                        </div>
                      )}
                    </div>

                    {/* Personal Stage Reflection & Mental Model */}
                    <div style={{ padding: '10px 12px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '6px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <PenTool style={{ width: 13, height: 13, color: 'var(--accent-primary)' }} />
                          <span>Personal Mental Model & Reflection:</span>
                        </div>
                        <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Auto-saved for your reference</span>
                      </div>
                      <textarea
                        rows={2}
                        placeholder="Note your personal intuition, edge cases, or mental framework for this stage..."
                        value={stageReflections[stage.id] || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setStageReflections(prev => ({ ...prev, [stage.id]: val }));
                        }}
                        onBlur={(e) => handleSaveReflection(stage, e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px 10px',
                          fontSize: '0.76rem',
                          borderRadius: '6px',
                          backgroundColor: 'var(--bg-card)',
                          border: '1px solid var(--border-subtle)',
                          color: 'var(--text-primary)',
                          outline: 'none',
                          resize: 'vertical'
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* 2. KEY TOPICS & IMPORTANT CONCEPTS */}
                <div className="grid-2" style={{ gap: '10px' }}>
                  {/* Key Topics */}
                  <div style={{ padding: '10px 12px', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '0.725rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.04em' }}>
                      Key Topics:
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                      {stage.keyTopics.map((topic, idx) => (
                        <span 
                          key={idx}
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            padding: '3px 8px',
                            backgroundColor: 'rgba(255, 255, 255, 0.04)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: 'var(--radius-sm)',
                            color: 'var(--text-secondary)'
                          }}
                        >
                          • {topic}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Important Concepts */}
                  <div style={{ padding: '10px 12px', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '0.725rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.04em' }}>
                      Important Concepts:
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {stage.importantConcepts.map((concept, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '0.775rem', color: 'var(--text-secondary)' }}>
                          <CheckCircle2 style={{ width: 13, height: 13, color: 'var(--easy-color)', flexShrink: 0, marginTop: '2px' }} />
                          <span>{concept}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 3. PREREQUISITES, RECOMMENDED ORDER & SUGGESTED NEXT STEP */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px', padding: '8px 12px', backgroundColor: 'rgba(0, 0, 0, 0.2)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                  <div>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      Prerequisites:
                    </span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '2px' }}>
                      {stage.prerequisites.map((pre, pIdx) => {
                        const targetStage = dsaRoadmapStages.find(s => pre.toLowerCase().includes(s.title.toLowerCase()) || pre.includes(String(s.stageNumber)));
                        return (
                          <span 
                            key={pIdx} 
                            onClick={() => targetStage && scrollToStage(targetStage.id)}
                            style={{ 
                              fontSize: '0.725rem', 
                              color: targetStage ? 'var(--accent-blue)' : 'var(--text-primary)', 
                              fontWeight: 600,
                              cursor: targetStage ? 'pointer' : 'default',
                              textDecoration: targetStage ? 'underline' : 'none'
                            }}
                          >
                            {pre}{pIdx < stage.prerequisites.length - 1 ? ',' : ''}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      Recommended Order:
                    </span>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-purple)', fontWeight: 700, marginTop: '2px' }}>
                      {stage.recommendedOrder}
                    </div>
                  </div>

                  <div>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      Suggested Next Step:
                    </span>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-cyan)', fontWeight: 700, marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span>{stage.suggestedNextStep}</span>
                      <ArrowRight style={{ width: 12, height: 12 }} />
                    </div>
                  </div>
                </div>

                {/* 4. OUTCOME CAPABILITY, REAL-WORLD APPLICATIONS & COMMON MISTAKES */}
                <div className="grid-3" style={{ gap: '10px' }}>
                  {/* What User Can Do After Completing */}
                  <div style={{ padding: '10px 12px', backgroundColor: 'rgba(16, 185, 129, 0.05)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                    <div style={{ fontSize: '0.725rem', fontWeight: 700, color: 'var(--easy-color)', textTransform: 'uppercase', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Check style={{ width: 13, height: 13, strokeWidth: 3 }} />
                      <span>After Completing Stage</span>
                    </div>
                    <p style={{ fontSize: '0.775rem', color: 'var(--text-primary)', lineHeight: '1.4', margin: 0 }}>
                      {stage.outcomeCapability}
                    </p>
                  </div>

                  {/* Real-World Applications */}
                  <div style={{ padding: '10px 12px', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '0.725rem', fontWeight: 700, color: 'var(--color-cyan)', textTransform: 'uppercase', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Globe style={{ width: 13, height: 13 }} />
                      <span>Real-World Applications</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      {stage.realWorldApplications.map((app, aIdx) => (
                        <div key={aIdx} style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                          • {app}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Common Mistakes */}
                  <div style={{ padding: '10px 12px', backgroundColor: 'rgba(239, 68, 68, 0.05)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                    <div style={{ fontSize: '0.725rem', fontWeight: 700, color: 'var(--hard-color)', textTransform: 'uppercase', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <AlertTriangle style={{ width: 13, height: 13 }} />
                      <span>Common Mistakes</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      {stage.commonMistakes.map((mistake, mIdx) => (
                        <div key={mIdx} style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                          ⚠️ {mistake}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 5. INTERACTIVE RELATED PROBLEMS & VISUALIZER TOPICS */}
                <div style={{ paddingTop: '8px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                  {/* Related DSA Problems */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.725rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      Related DSA Problems:
                    </span>
                    {stage.relatedProblemIds.map((prob) => (
                      <button
                        key={prob.id}
                        className="btn btn-outline btn-sm"
                        style={{ padding: '3px 8px', fontSize: '0.725rem', borderColor: 'var(--color-purple-border)' }}
                        onClick={() => onNavigateTab('problem_detail', prob.id)}
                      >
                        <Code2 style={{ width: 12, height: 12, color: 'var(--primary)' }} />
                        <span>{prob.title}</span>
                      </button>
                    ))}
                  </div>

                  {/* Related Visualizer Link */}
                  {stage.visualizerTopicTitle && (
                    <button
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '4px 10px', fontSize: '0.725rem', backgroundColor: 'rgba(6, 182, 212, 0.12)', color: 'var(--color-cyan)', border: '1px solid var(--color-cyan-border)' }}
                      onClick={() => onNavigateTab('visualizer')}
                    >
                      <Eye style={{ width: 13, height: 13 }} />
                      <span>{stage.visualizerTopicTitle}</span>
                    </button>
                  )}
                </div>

              </div>
            </div>
          );
        })}

      </div>

      {/* FOOTER ROADMAP CONCLUSION */}
      <div 
        className="card"
        style={{
          padding: '14px 18px',
          textAlign: 'center',
          borderColor: 'var(--border-subtle)',
          backgroundColor: 'var(--bg-surface)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '6px'
        }}
      >
        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          🚀 Ready to test your mastery across all 12 roadmap stages?
        </div>
        <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)', margin: 0, maxWidth: '600px' }}>
          Practice curated coding challenges in Learning Mode or jump into algorithmic visualizers to build deep spatial understanding.
        </p>
        <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => onNavigateTab('problems')}
          >
            <span>Explore Practice Problems</span>
            <ArrowRight style={{ width: 13, height: 13 }} />
          </button>
          <button
            className="btn btn-outline btn-sm"
            onClick={() => onNavigateTab('visualizer')}
          >
            <Eye style={{ width: 13, height: 13 }} />
            <span>Open Algorithm Visualizer</span>
          </button>
        </div>
      </div>

    </div>
  );
};

export default LearnPage;
