import React from 'react';
import { 
  BookOpen, 
  Code2, 
  Eye, 
  ShieldAlert, 
  HelpCircle, 
  ArrowRight,
  Compass,
  Zap
} from 'lucide-react';
import type { TabType } from '../components/layout/Sidebar';
import { useAuth } from '../context/AuthContext';

interface HomePageProps {
  onNavigateTab: (tab: TabType, extraId?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigateTab }) => {
  const { user } = useAuth();
  const displayName = user?.name || user?.username || 'Learner';

  const mainFeatures: Array<{
    id: TabType;
    title: string;
    tag: string;
    description: string;
    icon: typeof BookOpen;
    accent: string;
  }> = [
    {
      id: 'learn',
      title: 'Learn DSA',
      tag: 'Structured Roadmap',
      description: 'Follow step-by-step conceptual stages from programming foundations to graphs and dynamic programming.',
      icon: BookOpen,
      accent: '#6366F1'
    },
    {
      id: 'problems',
      title: 'Solve Problems',
      tag: 'Real Code Execution',
      description: 'Practice progressive 3-level coding challenges with real stdin/stdout execution, hints, and automated judging.',
      icon: Code2,
      accent: '#38BDF8'
    },
    {
      id: 'visualizer',
      title: 'Visualize Algorithms',
      tag: 'Interactive Engine',
      description: 'Watch algorithms execute frame-by-frame across sorting, searching, binary trees, recursion, and graph BFS/DFS.',
      icon: Eye,
      accent: '#10B981'
    },
    {
      id: 'interview',
      title: 'Practice Interviews',
      tag: 'Tech Question Bank',
      description: 'Prepare with curated technical, HR, behavioral, system design, and role-specific mock interview questions.',
      icon: HelpCircle,
      accent: '#F59E0B'
    },
    {
      id: 'crimelab',
      title: 'Crime Lab',
      tag: 'Forensic Debugging',
      description: 'Investigate broken code incidents, audit logs, and test evidence to identify and fix algorithmic bugs.',
      icon: ShieldAlert,
      accent: '#EF4444'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1000px', margin: '0 auto', width: '100%', paddingBottom: '24px' }}>
      
      {/* 1. WELCOME SECTION */}
      <section 
        className="card" 
        style={{ 
          padding: '28px 24px', 
          borderRadius: '14px',
          border: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--bg-surface)',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px'
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>
            Welcome back, {displayName}
          </h1>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', margin: '6px 0 0 0', lineHeight: 1.5 }}>
            Pick up where you left off and sharpen your problem-solving skills today.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', paddingTop: '4px' }}>
          <button
            type="button"
            onClick={() => onNavigateTab('learn')}
            className="btn btn-primary"
            style={{
              padding: '9px 20px',
              fontSize: '0.88rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span>Continue Learning</span>
            <ArrowRight style={{ width: 15, height: 15 }} />
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab('problems')}
            className="btn btn-outline"
            style={{
              padding: '9px 18px',
              fontSize: '0.88rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: 'var(--text-primary)',
              borderColor: 'var(--border-medium)',
              backgroundColor: 'var(--bg-card)'
            }}
          >
            <Code2 style={{ width: 15, height: 15, color: 'var(--accent-primary)' }} />
            <span>Solve a Problem</span>
          </button>
        </div>
      </section>

      {/* 2. ABOUT ALGORISE */}
      <section
        className="card"
        style={{
          padding: '22px 24px',
          borderRadius: '14px',
          border: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--bg-surface)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Compass style={{ width: 18, height: 18, color: 'var(--accent-primary)' }} />
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            About Algorise
          </h2>
        </div>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
          Algorise is an interactive platform built to help you master Data Structures and Algorithms, practice real coding challenges, and build deep intuition for technical interviews. Rather than relying on rote memorization, Algorise combines step-by-step concept roadmaps, algorithm visualizers, forensic bug analysis, and realistic interview practice.
        </p>
      </section>

      {/* 3. WHAT YOU CAN DO */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            What You Can Do
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
            Explore the core features designed to accelerate your technical growth.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
          {mainFeatures.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.id}
                onClick={() => onNavigateTab(feat.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onNavigateTab(feat.id);
                  }
                }}
                className="card feature-card"
                style={{
                  padding: '18px 20px',
                  borderRadius: '12px',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-surface)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '12px'
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        backgroundColor: `${feat.accent}18`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: feat.accent
                      }}
                    >
                      <Icon style={{ width: 18, height: 18 }} />
                    </div>
                    <span
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        color: feat.accent,
                        backgroundColor: `${feat.accent}14`,
                        padding: '2px 8px',
                        borderRadius: '4px'
                      }}
                    >
                      {feat.tag}
                    </span>
                  </div>

                  <div>
                    <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 4px 0' }}>
                      {feat.title}
                    </h3>
                    <p style={{ fontSize: '0.81rem', color: 'var(--text-secondary)', lineHeight: 1.45, margin: 0 }}>
                      {feat.description}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent-primary)', marginTop: '2px' }}>
                  <span>Open</span>
                  <ArrowRight style={{ width: 13, height: 13 }} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. LEARNING PATH */}
      <section
        className="card"
        style={{
          padding: '22px 24px',
          borderRadius: '14px',
          border: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--bg-surface)',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Zap style={{ width: 16, height: 16, color: 'var(--accent-primary)' }} />
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              Learning Path
            </h2>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
            A structured visual progression from initial concepts to complete mastery.
          </p>
        </div>

        <div 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '8px',
            padding: '12px 16px',
            backgroundColor: 'var(--bg-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '10px'
          }}
        >
          {['Learn', 'Understand', 'Visualize', 'Practice', 'Solve', 'Master'].map((step, idx, arr) => (
            <React.Fragment key={step}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  backgroundColor: 'var(--bg-surface)'
                }}
              >
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    color: 'var(--accent-primary)',
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(99, 102, 241, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {idx + 1}
                </span>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {step}
                </span>
              </div>
              {idx < arr.length - 1 && (
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 700 }}>
                  →
                </span>
              )}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* 5. START LEARNING */}
      <section
        className="card"
        style={{
          padding: '24px',
          borderRadius: '14px',
          border: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--bg-surface)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            Start Learning
          </h3>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
            Ready to begin? Choose your preferred starting point and start building momentum.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            onClick={() => onNavigateTab('learn')}
            className="btn btn-primary btn-sm"
            style={{ padding: '8px 18px', fontWeight: 700 }}
          >
            Start Learning
          </button>
          <button
            type="button"
            onClick={() => onNavigateTab('problems')}
            className="btn btn-outline btn-sm"
            style={{ padding: '8px 18px', fontWeight: 600, backgroundColor: 'var(--bg-card)' }}
          >
            Solve Problems
          </button>
        </div>
      </section>
    </div>
  );
};
