import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Shuffle, 
  ChevronLeft, 
  ChevronRight
} from 'lucide-react';
import { problemsData } from '../data/problemsData';
import type { Problem } from '../data/problemsData';
import { Badge } from '../components/common/Badge';
import type { TabType } from '../components/layout/Sidebar';
import { triggerMotivationPopup } from '../components/common/MotivationPopup';
import { useProgress } from '../context/ProgressContext';

interface ProblemsPageProps {
  onNavigateTab: (tab: TabType, extraId?: string) => void;
}

export const ProblemsPage: React.FC<ProblemsPageProps> = ({ onNavigateTab }) => {
  const { solvedProblemIds, attemptedProblemIds } = useProgress();

  React.useEffect(() => {
    triggerMotivationPopup('PROBLEM_BROWSING', false);
  }, []);

  const [selectedTopic, setSelectedTopic] = useState<string>('All');
  const [selectedPattern, setSelectedPattern] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 20; // 20 compact single-line rows per page

  const getProblemStatus = React.useCallback((problemId: string): Problem['status'] => {
    if (solvedProblemIds.has(problemId)) return 'Solved';
    if (attemptedProblemIds.has(problemId)) return 'Attempted';
    return 'Unsolved';
  }, [solvedProblemIds, attemptedProblemIds]);

  const topicsList = [
    'All', 'Arrays', 'Strings', 'Searching', 'Sorting', 'Two Pointers', 'Sliding Window',
    'Hashing', 'Linked Lists', 'Stacks', 'Queues', 'Recursion', 'Backtracking',
    'Trees', 'BST', 'Heaps', 'Graphs', 'BFS', 'DFS', 'Greedy',
    'Dynamic Programming', 'Bit Manipulation', 'Prefix Sum', 'Math'
  ];

  const patternsList = [
    'All',
    'Two Pointers',
    'Sliding Window',
    'Fast & Slow Pointers',
    'Hash Map Lookup',
    'Binary Search',
    'Prefix Sum',
    'Monotonic Stack',
    'BFS / DFS Traversal',
    'Dynamic Programming',
    'Greedy Choice',
    'Bitwise Logic'
  ];

  const handleTopicChange = (topic: string) => {
    setSelectedTopic(topic);
    setCurrentPage(1);
  };

  const handlePatternChange = (pattern: string) => {
    setSelectedPattern(pattern);
    setCurrentPage(1);
  };

  const handleDifficultyChange = (diff: string) => {
    setSelectedDifficulty(diff);
    setCurrentPage(1);
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSelectedTopic('All');
    setSelectedPattern('All');
    setSelectedDifficulty('All');
    setSelectedStatus('All');
    setSearchQuery('');
    setCurrentPage(1);
  };

  const handleOpenProblem = (prob: Problem) => {
    onNavigateTab('problem_detail', prob.id);
  };

  const filteredProblems = useMemo(() => {
    return problemsData.filter(problem => {
      // Exclude dummy placeholder problems
      if (problem.examples?.[0]?.input?.includes('sample data')) {
        return false;
      }

      // Topic Filter
      if (selectedTopic !== 'All' && !problem.topic.toLowerCase().includes(selectedTopic.toLowerCase())) {
        return false;
      }

      // Pattern Filter
      if (selectedPattern !== 'All') {
        const pPattern = problem.pattern.toLowerCase();
        const sPattern = selectedPattern.toLowerCase();
        if (!pPattern.includes(sPattern)) {
          return false;
        }
      }

      // Difficulty Filter
      if (selectedDifficulty !== 'All') {
        const sDiff = selectedDifficulty.toLowerCase();
        const pDiff = problem.difficulty.toLowerCase();
        if ((sDiff === 'easy' || sDiff === 'beginner') && pDiff !== 'easy') {
          return false;
        }
        if ((sDiff === 'medium' || sDiff === 'intermediate') && pDiff !== 'medium') {
          return false;
        }
        if ((sDiff === 'hard' || sDiff === 'advanced') && pDiff !== 'hard') {
          return false;
        }
      }

      // Status Filter
      const currentStatus = getProblemStatus(problem.id);
      if (selectedStatus !== 'All' && currentStatus !== selectedStatus) {
        return false;
      }

      // Search Query
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesTitle = problem.title.toLowerCase().includes(q);
        const matchesTopic = problem.topic.toLowerCase().includes(q);
        const matchesPattern = problem.pattern.toLowerCase().includes(q);
        const matchesId = problem.id.toLowerCase().includes(q);
        const matchesNum = problem.problemNumber.toString().includes(q);
        if (!matchesTitle && !matchesTopic && !matchesPattern && !matchesId && !matchesNum) {
          return false;
        }
      }

      return true;
    });
  }, [selectedTopic, selectedPattern, selectedStatus, searchQuery, getProblemStatus]);

  const totalFiltered = filteredProblems.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / pageSize));
  const paginatedProblems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProblems.slice(start, start + pageSize);
  }, [filteredProblems, currentPage, pageSize]);

  const handleRandomProblem = () => {
    if (problemsData.length > 0) {
      const randomIdx = Math.floor(Math.random() * problemsData.length);
      onNavigateTab('problem_detail', problemsData[randomIdx].id);
    }
  };

  const getStatusBadge = (status: Problem['status']) => {
    let variant: 'easy' | 'medium' | 'neutral' = 'neutral';
    if (status === 'Solved') variant = 'easy';
    else if (status === 'Attempted') variant = 'medium';

    return (
      <span style={{ fontSize: '0.675rem', display: 'inline-block' }}>
        <Badge variant={variant} className="status-badge-compact" style={{ fontSize: '0.675rem', padding: '1.5px 6px' } as any}>
          {status}
        </Badge>
      </span>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      
      {/* COMPACT TOP HEADER BAR */}
      <div 
        className="card" 
        style={{ 
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          padding: '12px 18px',
          backgroundColor: 'var(--bg-surface-elevated)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            DSA Problems Explorer
          </h1>
          <Badge variant="blue">{totalFiltered} Problems</Badge>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <button
            className="btn btn-secondary btn-sm"
            style={{ padding: '4px 10px', fontSize: '0.775rem' }}
            onClick={handleRandomProblem}
            title="Pick a random problem"
          >
            <Shuffle style={{ width: 13, height: 13, color: 'var(--primary)' }} />
            <span>Random Problem</span>
          </button>
        </div>
      </div>

      {/* COMPACT FILTER TOOLBAR (Topic, Pattern, Status, Search - DIFFICULTY REMOVED) */}
      <div 
        className="card" 
        style={{ 
          display: 'flex', 
          flexWrap: 'wrap',
          gap: '10px',
          alignItems: 'center', 
          justifyContent: 'space-between',
          padding: '10px 16px',
          backgroundColor: 'var(--bg-card)'
        }}
      >
        {/* SEARCH INPUT */}
        <div className="search-input-wrapper" style={{ flex: '1 1 220px', maxWidth: '320px' }}>
          <Search className="search-icon" style={{ width: 14, height: 14 }} />
          <input
            type="text"
            className="input-field"
            placeholder="Search problems by title, topic, pattern..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            style={{ padding: '4px 10px 4px 32px', fontSize: '0.8rem' }}
          />
        </div>

        {/* FILTER DROPDOWNS */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          
          {/* TOPIC FILTER */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Filter style={{ width: 12, height: 12, color: 'var(--text-muted)' }} />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Topic:</span>
            <select
              className="select-field"
              style={{ padding: '3px 6px', fontSize: '0.775rem' }}
              value={selectedTopic}
              onChange={(e) => handleTopicChange(e.target.value)}
            >
              {topicsList.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* PATTERN FILTER */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Pattern:</span>
            <select
              className="select-field"
              style={{ padding: '3px 6px', fontSize: '0.775rem' }}
              value={selectedPattern}
              onChange={(e) => handlePatternChange(e.target.value)}
            >
              {patternsList.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* DIFFICULTY FILTER */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Difficulty Level:</span>
            <select
              className="select-field"
              style={{ padding: '3px 6px', fontSize: '0.775rem' }}
              value={selectedDifficulty}
              onChange={(e) => handleDifficultyChange(e.target.value)}
            >
              <option value="All">All Difficulties</option>
              <option value="Easy">Easy (Level 1)</option>
              <option value="Medium">Medium (Level 2)</option>
              <option value="Hard">Hard (Level 3)</option>
            </select>
          </div>

          {/* STATUS FILTER */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Status:</span>
            <select
              className="select-field"
              style={{ padding: '3px 6px', fontSize: '0.775rem' }}
              value={selectedStatus}
              onChange={(e) => handleStatusChange(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Solved">Solved</option>
              <option value="Attempted">Attempted</option>
              <option value="Unsolved">Unsolved</option>
            </select>
          </div>

          {/* RESET FILTERS */}
          {(selectedTopic !== 'All' || selectedPattern !== 'All' || selectedDifficulty !== 'All' || selectedStatus !== 'All' || searchQuery !== '') && (
            <button
              className="btn btn-outline btn-sm"
              onClick={resetFilters}
              style={{ padding: '3px 8px', fontSize: '0.725rem' }}
            >
              Reset Filters
            </button>
          )}

        </div>
      </div>

      {/* COMPACT SINGLE-LINE PROBLEMS TABLE */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div 
          style={{ 
            padding: '8px 16px', 
            backgroundColor: 'var(--bg-surface)', 
            borderBottom: '1px solid var(--border-subtle)', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            fontSize: '0.775rem',
            color: 'var(--text-secondary)'
          }}
        >
          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
            {totalFiltered === 0 
              ? '0 Problems Found' 
              : `Showing ${(currentPage - 1) * pageSize + 1}–${Math.min(currentPage * pageSize, totalFiltered)} of ${totalFiltered} Problems`}
          </span>
          {totalFiltered > 0 && (
            <span>
              Page {currentPage} of {totalPages}
            </span>
          )}
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="data-table" style={{ fontSize: '0.825rem', width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <th style={{ width: '80px', padding: '8px 12px', textAlign: 'left', fontSize: '0.725rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Status</th>
                <th style={{ padding: '8px 12px', textAlign: 'left' }}>Problem Title</th>
                <th style={{ width: '140px', padding: '8px 12px', textAlign: 'left' }}>Difficulty Level</th>
                <th style={{ padding: '8px 12px', textAlign: 'left' }}>Topic / Pattern</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProblems.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                    No problems match your selected filters. Try resetting filters.
                  </td>
                </tr>
              ) : (
                paginatedProblems.map((problem) => {
                  const levelBadgeVariant = problem.difficulty === 'Hard' ? 'hard' : problem.difficulty === 'Medium' ? 'medium' : 'easy';
                  const levelLabel = problem.difficulty;

                  return (
                    <tr 
                      key={problem.id}
                      style={{ 
                        cursor: 'pointer',
                        borderBottom: '1px solid var(--border-subtle)',
                        transition: 'var(--transition-fast)'
                      }}
                      onClick={() => handleOpenProblem(problem)}
                    >
                      <td style={{ width: '80px', padding: '8px 12px' }}>
                        {getStatusBadge(getProblemStatus(problem.id))}
                      </td>
                      <td style={{ padding: '8px 12px', fontWeight: 600 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <span style={{ color: 'var(--text-primary)', textDecoration: 'none' }}>
                            {problem.problemNumber} — {problem.title}
                          </span>
                          {problem.commonConcept && (
                            <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', fontWeight: 400 }}>
                              Concept: {problem.commonConcept}
                            </span>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: '8px 12px' }}>
                        <Badge variant={levelBadgeVariant}>{levelLabel}</Badge>
                      </td>
                      <td style={{ padding: '8px 12px' }}>
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                          <Badge variant="neutral">{problem.topic}</Badge>
                          <Badge variant="blue">{problem.pattern}</Badge>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div 
            style={{ 
              padding: '8px 16px', 
              backgroundColor: 'var(--bg-surface)', 
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <button
              className="btn btn-outline btn-sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              style={{ padding: '3px 8px', fontSize: '0.75rem' }}
            >
              <ChevronLeft style={{ width: 13, height: 13 }} />
              <span>Previous</span>
            </button>

            <span style={{ fontSize: '0.775rem', color: 'var(--text-secondary)' }}>
              Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
            </span>

            <button
              className="btn btn-outline btn-sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              style={{ padding: '3px 8px', fontSize: '0.75rem' }}
            >
              <span>Next</span>
              <ChevronRight style={{ width: 13, height: 13 }} />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
