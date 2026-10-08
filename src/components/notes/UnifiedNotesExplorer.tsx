import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  BookOpen,
  CheckCircle2,
  Circle,
  Clock,
  ChevronRight,
  ChevronDown,
  ArrowLeft,
  ArrowRight,
  Code2,
  AlertTriangle,
  Lightbulb,
  Cpu,
  Layers,
  HelpCircle,
  Copy,
  Check,
  Zap,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';
import {
  unifiedNotesService,
  type LanguageId,
  type UnifiedTopicNote
} from '../../services/unifiedNotesService';
import type { TopicStatus } from '../../services/pythonNotesProgressService';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../common/Badge';

interface UnifiedNotesExplorerProps {
  languageId: LanguageId;
  initialTopicId?: string;
  onBackToHome: () => void;
}

export const UnifiedNotesExplorer: React.FC<UnifiedNotesExplorerProps> = ({
  languageId,
  initialTopicId,
  onBackToHome
}) => {
  const { user } = useAuth();
  const userId = user?.id || 'guest';

  // Language Metadata & All Topics
  const langMeta = useMemo(() => unifiedNotesService.getLanguageMeta(languageId), [languageId]);
  const allTopics = useMemo(() => unifiedNotesService.getAllTopicsForLanguage(languageId), [languageId]);

  // Selected Active Topic ID (null = list view, string = reading view)
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(() => {
    if (initialTopicId && allTopics.some((t) => t.id === initialTopicId)) {
      return initialTopicId;
    }
    return null;
  });

  // Filter States
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'All' | TopicStatus>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // UI Sidebar & Collapsible State
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  // User Progress state
  const [userProgress, setUserProgress] = useState<Record<string, TopicStatus>>({});
  const [lastOpenedTopicId, setLastOpenedTopicId] = useState<string | null>(null);

  // Copy code feedback & Question answer state
  const [copiedCodeIndex, setCopiedCodeIndex] = useState<number | null>(null);
  const [showAnswerState, setShowAnswerState] = useState<Record<number, boolean>>({});

  // Sync state on languageId change
  useEffect(() => {
    const lastTopic = unifiedNotesService.getLastOpenedTopic(userId, languageId);
    setLastOpenedTopicId(lastTopic);

    if (initialTopicId && allTopics.some((t) => t.id === initialTopicId)) {
      setSelectedTopicId(initialTopicId);
    }

    // Load progress
    const progress: Record<string, TopicStatus> = {};
    allTopics.forEach((t) => {
      progress[t.id] = unifiedNotesService.getTopicStatus(userId, languageId, t.id);
    });
    setUserProgress(progress);
  }, [languageId, initialTopicId, userId, allTopics]);

  // Select Topic handler
  const handleSelectTopic = (topicId: string) => {
    setSelectedTopicId(topicId);
    unifiedNotesService.setLastOpenedTopic(userId, languageId, topicId);
    setLastOpenedTopicId(topicId);
    setShowAnswerState({});
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Mark as in_progress if currently not_started
    const currentStatus = unifiedNotesService.getTopicStatus(userId, languageId, topicId);
    if (currentStatus === 'not_started') {
      unifiedNotesService.setTopicStatus(userId, languageId, topicId, 'in_progress');
      setUserProgress((prev) => ({ ...prev, [topicId]: 'in_progress' }));
    }

    // Auto expand category of selected topic
    const topic = allTopics.find((t) => t.id === topicId);
    if (topic) {
      setExpandedCategories((prev) => ({ ...prev, [topic.category]: true }));
    }
  };

  // Toggle completion handler
  const handleToggleCompleted = (topicId: string) => {
    unifiedNotesService.toggleTopicCompleted(userId, languageId, topicId);
    const updatedStatus = unifiedNotesService.getTopicStatus(userId, languageId, topicId);
    setUserProgress((prev) => ({ ...prev, [topicId]: updatedStatus }));
  };

  // Filter topics based on Search, Category, Level, Status
  const filteredTopics = useMemo(() => {
    return allTopics.filter((t) => {
      const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory;
      const matchesLevel = selectedLevel === 'All' || t.level === selectedLevel;
      const status = userProgress[t.id] || 'not_started';
      const matchesStatus = selectedStatusFilter === 'All' || status === selectedStatusFilter;

      if (!matchesCategory || !matchesLevel || !matchesStatus) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          t.title.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          t.whatItIs.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [allTopics, selectedCategory, selectedLevel, selectedStatusFilter, searchQuery, userProgress]);

  // Group topics by Category
  const topicsByCategory = useMemo(() => {
    const grouped: Record<string, UnifiedTopicNote[]> = {};
    langMeta.categories.forEach((cat) => {
      grouped[cat] = [];
    });

    filteredTopics.forEach((t) => {
      if (!grouped[t.category]) {
        grouped[t.category] = [];
      }
      grouped[t.category].push(t);
    });

    return grouped;
  }, [filteredTopics, langMeta]);

  // Current active topic note (if selected)
  const currentTopic = useMemo(() => {
    if (!selectedTopicId) return null;
    return allTopics.find((t) => t.id === selectedTopicId) || null;
  }, [selectedTopicId, allTopics]);

  // Prev / Next Topic Calculation following actual curriculum order
  const { prevTopic, nextTopic } = useMemo(() => {
    if (!currentTopic) return { prevTopic: null, nextTopic: null };
    const idx = allTopics.findIndex((t) => t.id === currentTopic.id);
    return {
      prevTopic: idx > 0 ? allTopics[idx - 1] : null,
      nextTopic: idx < allTopics.length - 1 ? allTopics[idx + 1] : null
    };
  }, [currentTopic, allTopics]);

  // Stats calculation
  const progressStats = useMemo(() => {
    return unifiedNotesService.getProgressStats(userId, languageId);
  }, [userId, languageId, userProgress]);

  // Copy code handler
  const handleCopyCode = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeIndex(index);
    setTimeout(() => setCopiedCodeIndex(null), 2000);
  };

  const toggleCategoryExpand = (cat: string) => {
    setExpandedCategories((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  const currentStatus = currentTopic ? userProgress[currentTopic.id] || 'not_started' : 'not_started';
  const lastOpenedTopic = lastOpenedTopicId ? allTopics.find((t) => t.id === lastOpenedTopicId) : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Compact Breadcrumb Navigation Bar */}
      <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        <button
          onClick={onBackToHome}
          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}
        >
          Notes
        </button>
        <span>/</span>
        <button
          onClick={() => setSelectedTopicId(null)}
          style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontWeight: 700, cursor: 'pointer', padding: 0 }}
        >
          {langMeta.name}
        </button>
        {currentTopic && (
          <>
            <span>/</span>
            <span style={{ color: 'var(--text-muted)' }}>{currentTopic.category}</span>
            <span>/</span>
            <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{currentTopic.title}</span>
          </>
        )}
      </div>

      {/* TOP SECTION: Language Overview Header & Continue Learning */}
      <div className="card" style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: 'var(--bg-surface)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <Badge variant={langMeta.badgeVariant}>{langMeta.badge}</Badge>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{allTopics.length} Topics</span>
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              {langMeta.name} Curriculum & Notes
            </h2>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '4px', margin: 0 }}>
              {langMeta.description}
            </p>
          </div>

          {/* Progress Indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', backgroundColor: 'var(--bg-root)', padding: '10px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Progress</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
                {progressStats.completedCount} / {progressStats.totalCount} ({progressStats.percentage}%)
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--bg-root)', borderRadius: '3px', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
          <div
            style={{
              width: `${progressStats.percentage}%`,
              height: '100%',
              backgroundColor: 'var(--accent-primary)',
              transition: 'width 0.3s ease'
            }}
          />
        </div>

        {/* Continue Learning Top Banner */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'rgba(99, 102, 241, 0.08)', padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px dashed rgba(99, 102, 241, 0.3)', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Zap style={{ width: 14, height: 14 }} />
              {lastOpenedTopic ? 'Continue Learning' : 'Start Learning'}
            </span>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', margin: '2px 0 0 0' }}>
              {lastOpenedTopic ? lastOpenedTopic.title : (allTopics[0]?.title || 'Topic 1')}
            </h4>
          </div>

          <button
            onClick={() => handleSelectTopic(lastOpenedTopic ? lastOpenedTopic.id : allTopics[0]?.id || '')}
            className="btn btn-primary btn-sm"
            style={{ fontSize: '0.8rem', padding: '6px 14px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <span>{lastOpenedTopic ? 'Continue →' : 'Start Topic 1 →'}</span>
          </button>
        </div>
      </div>

      {/* COMPACT SEARCH AND FILTERS TOOLBAR */}
      <div 
        className="card" 
        style={{ 
          padding: '14px 18px', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px', 
          flexWrap: 'wrap' 
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'var(--bg-root)', padding: '6px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', flex: 1, minWidth: '220px' }}>
          <Search style={{ width: 15, height: 15, color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder={`Search ${langMeta.name} topics...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ background: 'none', border: 'none', outline: 'none', color: 'var(--text-primary)', width: '100%', fontSize: '0.84rem' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Level:</span>
            <select
              className="select-field"
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              style={{ fontSize: '0.8rem', padding: '4px 8px' }}
            >
              <option value="All">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Status:</span>
            <select
              className="select-field"
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value as any)}
              style={{ fontSize: '0.8rem', padding: '4px 8px' }}
            >
              <option value="All">All Statuses</option>
              <option value="not_started">Not Started (○)</option>
              <option value="in_progress">In Progress (◐)</option>
              <option value="completed">Completed (✓)</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Category:</span>
            <select
              className="select-field"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{ fontSize: '0.8rem', padding: '4px 8px', maxWidth: '180px' }}
            >
              <option value="All">All Categories ({filteredTopics.length})</option>
              {langMeta.categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODE 1: TOPIC LIST VIEW (WHEN NO SPECIFIC TOPIC IS SELECTED)              */}
      {/* ========================================================================= */}
      {selectedTopicId === null && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {langMeta.categories.map((cat) => {
            const categoryTopics = topicsByCategory[cat] || [];
            if (categoryTopics.length === 0 && selectedCategory !== 'All' && selectedCategory !== cat) {
              return null;
            }

            return (
              <div key={cat} className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <BookOpen style={{ width: 16, height: 16, color: 'var(--accent-primary)' }} />
                    <span>{cat}</span>
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {categoryTopics.length} topics
                  </span>
                </div>

                {categoryTopics.length === 0 ? (
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontStyle: 'italic', padding: '8px 0' }}>
                    No topics match your current filter criteria in this category.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {categoryTopics.map((topic) => {
                      const globalIdx = allTopics.findIndex(t => t.id === topic.id) + 1;
                      const status = userProgress[topic.id] || 'not_started';

                      return (
                        <div
                          key={topic.id}
                          className="card card-interactive"
                          onClick={() => handleSelectTopic(topic.id)}
                          style={{
                            padding: '12px 16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '12px',
                            backgroundColor: 'var(--bg-root)',
                            border: status === 'completed' ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid var(--border-subtle)',
                            cursor: 'pointer'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: 0 }}>
                            {/* Sequential Topic Number starting from 1 (NO # or leading zeros) */}
                            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: '0.85rem', color: 'var(--accent-primary)', width: '28px', textAlign: 'right', flexShrink: 0 }}>
                              {globalIdx}
                            </span>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0 }}>
                              <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {topic.title}
                              </h4>
                              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {topic.whatItIs.replace(/\*\*/g, '')}
                              </p>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                            <Badge variant={topic.level === 'Beginner' ? 'easy' : topic.level === 'Intermediate' ? 'medium' : 'hard'}>
                              {topic.level}
                            </Badge>

                            {status === 'completed' ? (
                              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#10b981', fontWeight: 700 }}>
                                <CheckCircle2 style={{ width: 14, height: 14 }} />
                                <span className="hidden sm:inline">Completed</span>
                              </span>
                            ) : status === 'in_progress' ? (
                              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#f59e0b', fontWeight: 700 }}>
                                <Clock style={{ width: 14, height: 14 }} />
                                <span className="hidden sm:inline">In Progress</span>
                              </span>
                            ) : (
                              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                <Circle style={{ width: 14, height: 14 }} />
                                <span className="hidden sm:inline">Not Started</span>
                              </span>
                            )}

                            <ChevronRight style={{ width: 16, height: 16, color: 'var(--text-muted)' }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: TOPIC READING VIEW (WHEN A TOPIC IS OPENED)                       */}
      {/* ========================================================================= */}
      {selectedTopicId !== null && currentTopic && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Mobile Topic Selection Dropdown */}
          <div className="card lg:hidden" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Select Topic:</span>
            <select
              className="select-field"
              value={selectedTopicId}
              onChange={(e) => handleSelectTopic(e.target.value)}
              style={{ fontSize: '0.82rem', flex: 1, maxWidth: '280px' }}
            >
              {allTopics.map((t, idx) => (
                <option key={t.id} value={t.id}>
                  {idx + 1}. {t.title}
                </option>
              ))}
            </select>
          </div>

          <div className="grid-2" style={{ gridTemplateColumns: isSidebarCollapsed ? '1fr' : '300px 1fr', gap: '20px', alignItems: 'start' }}>
            
            {/* Desktop Left Collapsible Sidebar Navigation */}
            {!isSidebarCollapsed && (
              <div className="card hidden lg:flex" style={{ flexDirection: 'column', gap: '14px', padding: '16px', position: 'sticky', top: '16px', maxHeight: 'calc(100vh - 40px)', overflowY: 'auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {langMeta.name} Topics
                  </span>
                  <button
                    onClick={() => setIsSidebarCollapsed(true)}
                    className="btn btn-outline btn-sm"
                    style={{ padding: '2px 6px', fontSize: '0.72rem' }}
                    title="Collapse Sidebar"
                  >
                    <PanelLeftClose style={{ width: 14, height: 14 }} />
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {langMeta.categories.map((cat) => {
                    const categoryTopics = allTopics.filter(t => t.category === cat);
                    if (categoryTopics.length === 0) return null;
                    const isExpanded = expandedCategories[cat] ?? true;

                    return (
                      <div key={cat} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <button
                          onClick={() => toggleCategoryExpand(cat)}
                          style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            background: 'none',
                            border: 'none',
                            color: 'var(--text-secondary)',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            padding: '4px 2px',
                            textAlign: 'left'
                          }}
                        >
                          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{cat}</span>
                          {isExpanded ? <ChevronDown style={{ width: 14, height: 14 }} /> : <ChevronRight style={{ width: 14, height: 14 }} />}
                        </button>

                        {isExpanded && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', paddingLeft: '8px', borderLeft: '2px solid var(--border-subtle)' }}>
                            {categoryTopics.map((topic) => {
                              const globalIdx = allTopics.findIndex(t => t.id === topic.id) + 1;
                              const isSelected = topic.id === selectedTopicId;
                              const status = userProgress[topic.id] || 'not_started';

                              return (
                                <button
                                  key={topic.id}
                                  onClick={() => handleSelectTopic(topic.id)}
                                  style={{
                                    width: '100%',
                                    padding: '6px 8px',
                                    borderRadius: 'var(--radius-sm)',
                                    border: 'none',
                                    backgroundColor: isSelected ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                                    color: isSelected ? 'var(--accent-primary)' : 'var(--text-primary)',
                                    fontWeight: isSelected ? 700 : 500,
                                    fontSize: '0.78rem',
                                    textAlign: 'left',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    gap: '6px'
                                  }}
                                >
                                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {globalIdx}. {topic.title}
                                  </span>

                                  {status === 'completed' && <CheckCircle2 style={{ width: 12, height: 12, color: '#10b981', flexShrink: 0 }} />}
                                  {status === 'in_progress' && <Clock style={{ width: 12, height: 12, color: '#f59e0b', flexShrink: 0 }} />}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Main Reading Area */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Reading Card */}
              <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', backgroundColor: 'var(--bg-surface)' }}>
                
                {/* Topic Header & Status Button */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '6px' }}>
                      {isSidebarCollapsed && (
                        <button
                          onClick={() => setIsSidebarCollapsed(false)}
                          className="btn btn-outline btn-sm hidden lg:flex"
                          style={{ padding: '2px 6px', fontSize: '0.72rem', alignItems: 'center', gap: '4px' }}
                          title="Expand Topics Sidebar"
                        >
                          <PanelLeftOpen style={{ width: 14, height: 14 }} />
                          <span>Show Topics</span>
                        </button>
                      )}
                      <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 700 }}>
                        {currentTopic.category}
                      </span>
                      <Badge variant={currentTopic.level === 'Beginner' ? 'easy' : currentTopic.level === 'Intermediate' ? 'medium' : 'hard'}>
                        {currentTopic.level}
                      </Badge>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Est. 10 min read</span>
                    </div>

                    <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                      {allTopics.findIndex(t => t.id === currentTopic.id) + 1}. {currentTopic.title}
                    </h1>
                  </div>

                  <button
                    onClick={() => handleToggleCompleted(currentTopic.id)}
                    className={`btn btn-sm ${currentStatus === 'completed' ? 'btn-outline' : 'btn-primary'}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '0.8rem',
                      borderColor: currentStatus === 'completed' ? '#10b981' : undefined,
                      color: currentStatus === 'completed' ? '#10b981' : undefined
                    }}
                  >
                    {currentStatus === 'completed' ? (
                      <>
                        <CheckCircle2 style={{ width: 14, height: 14 }} />
                        <span>Completed ✓</span>
                      </>
                    ) : (
                      <>
                        <Circle style={{ width: 14, height: 14 }} />
                        <span>Mark as Completed</span>
                      </>
                    )}
                  </button>
                </div>

                {/* What / Why / How Overview */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
                  <div style={{ padding: '14px', backgroundColor: 'var(--bg-root)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Lightbulb style={{ width: 14, height: 14 }} /> What is it?
                    </span>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-primary)', margin: 0, lineHeight: '1.5' }}>
                      {currentTopic.whatItIs.replace(/\*\*/g, '')}
                    </p>
                  </div>

                  <div style={{ padding: '14px', backgroundColor: 'var(--bg-root)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-secondary)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Zap style={{ width: 14, height: 14 }} /> Why use it?
                    </span>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-primary)', margin: 0, lineHeight: '1.5' }}>
                      {currentTopic.whyUsed}
                    </p>
                  </div>

                  <div style={{ padding: '14px', backgroundColor: 'var(--bg-root)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10b981', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Cpu style={{ width: 14, height: 14 }} /> How does it work?
                    </span>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-primary)', margin: 0, lineHeight: '1.5', whiteSpace: 'pre-line' }}>
                      {currentTopic.howItWorks}
                    </p>
                  </div>
                </div>

                {/* Syntax Code Section */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Code2 style={{ width: 16, height: 16, color: 'var(--accent-primary)' }} />
                    <span>Syntax</span>
                  </h3>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.84rem', color: 'var(--accent-primary)', backgroundColor: 'var(--bg-root)', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', overflowX: 'auto' }}>
                    <code>{currentTopic.syntax}</code>
                  </div>
                </div>

                {/* Code Examples & Line-by-Line Breakdown */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Code2 style={{ width: 16, height: 16, color: 'var(--accent-primary)' }} />
                    <span>Code Example & Line-by-Line Breakdown</span>
                  </h3>

                  {currentTopic.codeExamples.map((ex, idx) => (
                    <div key={idx} style={{ borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', overflow: 'hidden', backgroundColor: 'var(--bg-root)' }}>
                      <div style={{ padding: '8px 14px', backgroundColor: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>{ex.title}</span>
                        <button
                          onClick={() => handleCopyCode(ex.code, idx)}
                          className="btn btn-outline btn-sm"
                          style={{ padding: '2px 8px', fontSize: '0.72rem' }}
                        >
                          {copiedCodeIndex === idx ? (
                            <>
                              <Check style={{ width: 12, height: 12, color: '#10b981' }} />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy style={{ width: 12, height: 12 }} />
                              <span>Copy Code</span>
                            </>
                          )}
                        </button>
                      </div>

                      <pre style={{ margin: 0, padding: '14px', fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--text-primary)', backgroundColor: 'var(--bg-root)', overflowX: 'auto', lineHeight: '1.5' }}>
                        <code>{ex.code}</code>
                      </pre>

                      <div style={{ padding: '12px 14px', backgroundColor: 'var(--bg-surface)', borderTop: '1px solid var(--border-subtle)', fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
                        <strong style={{ color: 'var(--accent-primary)', display: 'block', marginBottom: '4px' }}>Line-by-Line Breakdown:</strong>
                        {ex.explanation}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Important Rules & Common Mistakes */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
                  <div style={{ padding: '14px', backgroundColor: 'var(--bg-root)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <h4 style={{ fontSize: '0.84rem', fontWeight: 700, color: '#10b981', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <CheckCircle2 style={{ width: 15, height: 15 }} />
                      <span>Important Rules</span>
                    </h4>
                    <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {currentTopic.importantRules.map((rule, i) => (
                        <li key={i}>{rule}</li>
                      ))}
                    </ul>
                  </div>

                  <div style={{ padding: '14px', backgroundColor: 'var(--bg-root)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <h4 style={{ fontSize: '0.84rem', fontWeight: 700, color: '#f87171', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <AlertTriangle style={{ width: 15, height: 15 }} />
                      <span>Common Mistakes</span>
                    </h4>
                    <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {currentTopic.commonMistakes.map((mistake, i) => (
                        <li key={i}>{mistake}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Real World Use & Complexity */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
                  <div style={{ padding: '14px', backgroundColor: 'var(--bg-root)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <h4 style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--accent-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Layers style={{ width: 15, height: 15 }} />
                      <span>Real-World Application</span>
                    </h4>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5' }}>
                      {currentTopic.realWorldUse}
                    </p>
                  </div>

                  {(currentTopic.timeComplexity || currentTopic.spaceComplexity) && (
                    <div style={{ padding: '14px', backgroundColor: 'var(--bg-root)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <h4 style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--accent-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Cpu style={{ width: 15, height: 15 }} />
                        <span>Complexity Analysis</span>
                      </h4>
                      <div style={{ display: 'flex', gap: '12px', fontSize: '0.82rem' }}>
                        {currentTopic.timeComplexity && (
                          <div>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', display: 'block' }}>Time</span>
                            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent-primary)' }}>{currentTopic.timeComplexity}</span>
                          </div>
                        )}
                        {currentTopic.spaceComplexity && (
                          <div>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', display: 'block' }}>Space</span>
                            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent-primary)' }}>{currentTopic.spaceComplexity}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Practice Questions */}
                {currentTopic.practiceQuestions && currentTopic.practiceQuestions.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <HelpCircle style={{ width: 16, height: 16, color: 'var(--accent-primary)' }} />
                      <span>Practice Questions</span>
                    </h3>

                    {currentTopic.practiceQuestions.map((q, qIdx) => (
                      <div key={qIdx} style={{ padding: '14px', backgroundColor: 'var(--bg-root)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                          {q.question}
                        </p>
                        <button
                          onClick={() => setShowAnswerState((prev) => ({ ...prev, [qIdx]: !prev[qIdx] }))}
                          className="btn btn-outline btn-sm"
                          style={{ alignSelf: 'flex-start', fontSize: '0.75rem', padding: '4px 8px' }}
                        >
                          {showAnswerState[qIdx] ? 'Hide Solution' : 'Show Solution'}
                        </button>
                        {showAnswerState[qIdx] && (
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: '#10b981', backgroundColor: 'var(--bg-surface)', padding: '10px 12px', borderRadius: '4px', border: '1px solid rgba(16, 185, 129, 0.3)', whiteSpace: 'pre-wrap' }}>
                            {q.answer}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Previous / Next Topic Buttons following actual curriculum order */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px', gap: '12px', flexWrap: 'wrap' }}>
                  {prevTopic ? (
                    <button
                      onClick={() => handleSelectTopic(prevTopic.id)}
                      className="btn btn-outline btn-sm"
                      style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}
                    >
                      <ArrowLeft style={{ width: 14, height: 14 }} />
                      <span>Prev: {prevTopic.title}</span>
                    </button>
                  ) : <div />}

                  {nextTopic ? (
                    <button
                      onClick={() => handleSelectTopic(nextTopic.id)}
                      className="btn btn-primary btn-sm"
                      style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}
                    >
                      <span>Next: {nextTopic.title}</span>
                      <ArrowRight style={{ width: 14, height: 14 }} />
                    </button>
                  ) : <div />}
                </div>

              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
