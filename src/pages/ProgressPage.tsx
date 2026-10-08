import React, { useMemo } from 'react';
import { 
  CheckCircle2, 
  Flame, 
  Award, 
  Calendar,
  Layers,
  Code2,
  Target
} from 'lucide-react';
import { problemsData } from '../data/problemsData';
import { useProgress } from '../context/ProgressContext';
import { useAuth } from '../context/AuthContext';
import { Badge } from '../components/common/Badge';
import { ProgressBar } from '../components/common/ProgressBar';
import type { TabType } from '../components/layout/Sidebar';

interface ProgressPageProps {
  onNavigateTab?: (tab: TabType, extraId?: string) => void;
}

export const ProgressPage: React.FC<ProgressPageProps> = ({ onNavigateTab }) => {
  const { user } = useAuth();
  const { 
    solvedProblemIds, 
    attemptedProblemIds, 
    currentStreak, 
    activityLog,
    dailyQuestionGoal,
    todaySolvedCount
  } = useProgress();

  const dailyGoalPercentage = Math.min(100, Math.round((todaySolvedCount / dailyQuestionGoal) * 100));
  const remainingToday = Math.max(0, dailyQuestionGoal - todaySolvedCount);

  // Real Easy, Medium, Hard Breakdown Calculation
  const stats = useMemo(() => {
    const solvedArray = Array.from(solvedProblemIds);
    const attemptedArray = Array.from(attemptedProblemIds);

    const l1Solved = solvedArray.filter(id => {
      const p = problemsData.find(prob => prob.id === id);
      return id.endsWith('-lvl1') || (p && p.difficulty === 'Easy');
    }).length;
    const l2Solved = solvedArray.filter(id => {
      const p = problemsData.find(prob => prob.id === id);
      return id.endsWith('-lvl2') || (p && p.difficulty === 'Medium');
    }).length;
    const l3Solved = solvedArray.filter(id => {
      const p = problemsData.find(prob => prob.id === id);
      return id.endsWith('-lvl3') || (p && p.difficulty === 'Hard');
    }).length;
    const baseSolved = solvedArray.length;
    const totalSolved = solvedArray.length;

    const l1Attempted = attemptedArray.filter(id => {
      const p = problemsData.find(prob => prob.id === id);
      return id.endsWith('-lvl1') || (p && p.difficulty === 'Easy');
    }).length;
    const l2Attempted = attemptedArray.filter(id => {
      const p = problemsData.find(prob => prob.id === id);
      return id.endsWith('-lvl2') || (p && p.difficulty === 'Medium');
    }).length;
    const l3Attempted = attemptedArray.filter(id => {
      const p = problemsData.find(prob => prob.id === id);
      return id.endsWith('-lvl3') || (p && p.difficulty === 'Hard');
    }).length;
    const baseAttempted = attemptedArray.length;
    const totalAttempted = attemptedArray.length;

    // Unique topics breakdown
    const topicMap: Record<string, { total: number; solved: number }> = {};
    for (const p of problemsData) {
      const topic = p.topic || 'General DSA';
      if (!topicMap[topic]) {
        topicMap[topic] = { total: 0, solved: 0 };
      }
      topicMap[topic].total += 1;
      if (solvedProblemIds.has(p.id)) {
        topicMap[topic].solved += 1;
      }
    }

    const topicProgress = Object.entries(topicMap).map(([name, data]) => ({
      name,
      total: data.total,
      solved: data.solved,
      percentage: data.total > 0 ? Math.round((data.solved / data.total) * 100) : 0
    })).sort((a, b) => b.solved - a.solved);

    const baseProblems = problemsData.filter(p => !p.id.endsWith('-lvl1') && !p.id.endsWith('-lvl2') && !p.id.endsWith('-lvl3'));
    let masteredCount = 0;
    for (const bp of baseProblems) {
      if (solvedProblemIds.has(bp.id) || solvedProblemIds.has(`${bp.id}-lvl1`)) {
        masteredCount += 1;
      }
    }

    return {
      totalSolved,
      l1Solved,
      l2Solved,
      l3Solved,
      baseSolved,
      totalAttempted,
      l1Attempted,
      l2Attempted,
      l3Attempted,
      baseAttempted,
      topicProgress,
      masteredCount,
      totalBaseTopics: baseProblems.length
    };
  }, [solvedProblemIds, attemptedProblemIds]);

  const formatRelativeTime = (timeMs: number): string => {
    try {
      const diffSeconds = Math.floor((Date.now() - timeMs) / 1000);
      if (diffSeconds < 45) return 'Just now';
      const diffMins = Math.floor(diffSeconds / 60);
      if (diffMins < 60) return `${diffMins}m ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays}d ago`;
    } catch {
      return 'Recently';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 className="page-title" style={{ margin: 0 }}>Real Learning Analytics & Progress</h2>
            {user?.username && (
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-primary)', backgroundColor: 'var(--bg-elevated)', padding: '2px 10px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                @{user.username}
              </span>
            )}
          </div>
          <p className="page-subtitle" style={{ marginTop: '2px' }}>
            Real-time tracking for Level 1, Level 2, and Level 3 problem submissions, streak persistence, and topic mastery.
          </p>
        </div>

        <Badge variant="green">
          <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', backgroundColor: '#10B981' }} />
          <span>Real-time Live Metrics</span>
        </Badge>
      </div>

      {/* DAILY QUESTION GOAL PROGRESS CARD */}
      <div 
        className="card"
        style={{
          padding: '14px 18px',
          backgroundColor: 'var(--bg-surface)',
          borderColor: todaySolvedCount >= dailyQuestionGoal ? 'rgba(16, 185, 129, 0.4)' : 'var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: '240px' }}>
          <div style={{ padding: '8px 12px', borderRadius: '8px', backgroundColor: 'rgba(59, 130, 246, 0.12)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--accent-primary)', textTransform: 'uppercase', fontWeight: 800 }}>Target</span>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>{dailyQuestionGoal}</span>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Daily Questions Goal: <span style={{ color: 'var(--accent-primary)' }}>{todaySolvedCount} / {dailyQuestionGoal}</span>
              </div>
              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: todaySolvedCount >= dailyQuestionGoal ? '#10B981' : 'var(--text-muted)' }}>
                {dailyGoalPercentage}%
              </span>
            </div>
            <ProgressBar progress={dailyGoalPercentage} variant={todaySolvedCount >= dailyQuestionGoal ? 'easy' : 'primary'} />
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              {todaySolvedCount >= dailyQuestionGoal
                ? '🎉 Daily goal completed for today!'
                : `${remainingToday} more ${remainingToday === 1 ? 'question' : 'questions'} to reach today's target.`}
            </div>
          </div>
        </div>

        <button
          className="btn btn-outline btn-sm"
          onClick={() => onNavigateTab && onNavigateTab('settings')}
          style={{ fontSize: '0.78rem' }}
        >
          Change Daily Goal
        </button>
      </div>

      {/* 4 STATS OVERVIEW CARDS */}
      <div className="grid-4">
        {/* Problems Solved Card */}
        <div className="card" style={{ borderColor: 'var(--color-green-border)', padding: '12px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '8px', backgroundColor: 'var(--color-green-subtle)', borderRadius: 'var(--radius-sm)' }}>
              <CheckCircle2 style={{ width: 20, height: 20, color: 'var(--color-green)' }} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-green)', fontWeight: 600 }}>Problems Solved</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {stats.totalSolved} <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-muted)' }}>/ 4,080</span>
              </div>
            </div>
          </div>
          <div style={{ marginTop: '8px', paddingTop: '6px', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: '4px', flexWrap: 'wrap', fontSize: '0.7rem' }}>
            <Badge variant="easy">L1: {stats.l1Solved}</Badge>
            <Badge variant="medium">L2: {stats.l2Solved}</Badge>
            <Badge variant="hard">L3: {stats.l3Solved}</Badge>
          </div>
        </div>

        {/* Problems Attempted Card */}
        <div className="card" style={{ borderColor: 'var(--color-blue-border)', padding: '12px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '8px', backgroundColor: 'var(--color-blue-subtle)', borderRadius: 'var(--radius-sm)' }}>
              <Code2 style={{ width: 20, height: 20, color: 'var(--color-blue)' }} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-blue)', fontWeight: 600 }}>Problems Attempted</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {stats.totalAttempted}
              </div>
            </div>
          </div>
          <div style={{ marginTop: '8px', paddingTop: '6px', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: '4px', flexWrap: 'wrap', fontSize: '0.7rem' }}>
            <Badge variant="blue">L1: {stats.l1Attempted}</Badge>
            <Badge variant="blue">L2: {stats.l2Attempted}</Badge>
            <Badge variant="blue">L3: {stats.l3Attempted}</Badge>
          </div>
        </div>

        {/* Current Streak Card */}
        <div className="card" style={{ borderColor: 'var(--color-amber-border)', padding: '12px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '8px', backgroundColor: 'var(--color-amber-subtle)', borderRadius: 'var(--radius-sm)' }}>
              <Flame style={{ width: 20, height: 20, color: 'var(--color-amber)' }} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-amber)', fontWeight: 600 }}>Current Streak</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-amber)' }}>
                {currentStreak} {currentStreak === 1 ? 'Day' : 'Days'}
              </div>
            </div>
          </div>
          <div style={{ marginTop: '8px', paddingTop: '6px', borderTop: '1px solid var(--border-subtle)', fontSize: '0.725rem', color: 'var(--text-muted)' }}>
            {currentStreak > 0 ? 'Active learning streak maintained today!' : 'Solve a problem today to start your streak'}
          </div>
        </div>

        {/* Pattern Mastery Card */}
        <div className="card" style={{ borderColor: 'var(--color-purple-border)', padding: '12px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '8px', backgroundColor: 'var(--color-purple-subtle)', borderRadius: 'var(--radius-sm)' }}>
              <Award style={{ width: 20, height: 20, color: 'var(--color-purple)' }} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-purple)', fontWeight: 600 }}>3-Level Mastery</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-purple)' }}>
                {stats.masteredCount} <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-muted)' }}>/ {stats.totalBaseTopics} Topics</span>
              </div>
            </div>
          </div>
          <div style={{ marginTop: '8px', paddingTop: '6px', borderTop: '1px solid var(--border-subtle)', fontSize: '0.725rem', color: 'var(--text-muted)' }}>
            Topics with all 3 Levels (L1, L2, L3) solved
          </div>
        </div>
      </div>

      {/* LEVEL 1, LEVEL 2, LEVEL 3 REAL TRACKING SUMMARY */}
      <div 
        className="card"
        style={{
          padding: '14px 16px',
          background: 'var(--bg-surface)',
          borderColor: 'var(--border-medium)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers style={{ width: 16, height: 16, color: 'var(--primary)' }} />
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              DSA Progression Level Metrics
            </h3>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Track real progress across Level 1 Beginner, Level 2 Intermediate, and Level 3 Advanced
          </span>
        </div>

        <div className="grid-3">
          {/* Level 1 Beginner */}
          <div style={{ padding: '10px 12px', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(16, 185, 129, 0.08)', border: '1px solid var(--color-green-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <Badge variant="easy">Level 1 — Beginner</Badge>
              <strong style={{ fontSize: '0.85rem', color: 'var(--easy-color)' }}>{stats.l1Solved} Solved</strong>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '0 0 8px 0' }}>
              Core fundamentals & single-pass pattern understanding.
            </p>
            <ProgressBar progress={Math.min(100, Math.round((stats.l1Solved / 1020) * 100))} variant="easy" />
          </div>

          {/* Level 2 Intermediate */}
          <div style={{ padding: '10px 12px', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(245, 158, 11, 0.08)', border: '1px solid var(--color-amber-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <Badge variant="medium">Level 2 — Intermediate</Badge>
              <strong style={{ fontSize: '0.85rem', color: 'var(--medium-color)' }}>{stats.l2Solved} Solved</strong>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '0 0 8px 0' }}>
              Multi-variable logic & intermediate pattern variations.
            </p>
            <ProgressBar progress={Math.min(100, Math.round((stats.l2Solved / 1020) * 100))} variant="medium" />
          </div>

          {/* Level 3 Advanced */}
          <div style={{ padding: '10px 12px', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(236, 72, 153, 0.08)', border: '1px solid var(--color-coral-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <Badge variant="hard">Level 3 — Advanced</Badge>
              <strong style={{ fontSize: '0.85rem', color: 'var(--hard-color)' }}>{stats.l3Solved} Solved</strong>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '0 0 8px 0' }}>
              High-dimensional search & extreme bounds optimization.
            </p>
            <ProgressBar progress={Math.min(100, Math.round((stats.l3Solved / 1020) * 100))} variant="hard" />
          </div>
        </div>
      </div>

      {/* REAL TOPIC PROGRESS BREAKDOWN & ACTIVITY TIMELINE */}
      <div className="grid-2">
        {/* Real Topic Progress */}
        <div className="card" style={{ padding: '12px 14px' }}>
          <h3 className="section-title" style={{ marginBottom: '10px', fontSize: '0.9rem' }}>
            <Target style={{ width: 15, height: 15, color: 'var(--primary)' }} />
            <span>Topic Completion Progress</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '320px', overflowY: 'auto' }}>
            {stats.topicProgress.slice(0, 10).map((tp, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.775rem', marginBottom: '3px' }}>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{tp.name}</span>
                  <span style={{ color: 'var(--text-secondary)' }}>{tp.solved} / {tp.total} ({tp.percentage}%)</span>
                </div>
                <ProgressBar progress={tp.percentage} />
              </div>
            ))}
          </div>
        </div>

        {/* Real Activity Timeline Feed */}
        <div className="card" style={{ padding: '12px 14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <h3 className="section-title" style={{ margin: 0, fontSize: '0.9rem' }}>
              <Calendar style={{ width: 15, height: 15, color: 'var(--color-cyan)' }} />
              <span>Real Activity Timeline</span>
            </h3>
            <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
              {activityLog.length} Events Recorded
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '320px', overflowY: 'auto' }}>
            {activityLog.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                No problem submissions or learning activities recorded yet.
                <br />
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => onNavigateTab && onNavigateTab('problems')}
                  style={{ marginTop: '10px' }}
                >
                  Start Solving Problems
                </button>
              </div>
            ) : (
              activityLog.slice(0, 15).map((item) => (
                <div 
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 10px',
                    backgroundColor: 'var(--bg-surface)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-subtle)',
                    gap: '8px'
                  }}
                >
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.8rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: '0.725rem', color: 'var(--text-secondary)' }}>
                      {item.subtitle}
                    </div>
                  </div>
                  <Badge variant={item.type === 'solved' ? 'easy' : item.type === 'attempted' ? 'medium' : 'blue'}>
                    {formatRelativeTime(item.timestamp)}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

    </div>
  );
};
