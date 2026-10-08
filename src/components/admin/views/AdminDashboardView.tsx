import React, { useState, useEffect } from 'react';
import { adminContentService } from '../../../services/adminContentService';
import { adminCmsService, type NavigationItemCms } from '../../../services/adminCmsService';
import { useAuth } from '../../../context/AuthContext';
import {
  Users,
  UserCheck,
  Code2,
  BookOpen,
  HelpCircle,
  ShieldAlert,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  Zap,
  ArrowUpRight,
  RefreshCw,
  Sliders,
  CheckCircle2,
  XCircle,
  Loader2
} from 'lucide-react';
import type { AdminSectionType } from '../AdminLayout';

interface AdminDashboardViewProps {
  onNavigateSection: (sec: AdminSectionType) => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({ onNavigateSection }) => {
  const { token } = useAuth();
  const [stats, setStats] = useState<any>(() => adminContentService.getDashboardStats(token));
  const [isLoading, setIsLoading] = useState(false);
  const [navSections, setNavSections] = useState<NavigationItemCms[]>(() => adminCmsService.getNavigationItems());
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const [liveStats, liveNav] = await Promise.all([
        adminContentService.getDashboardStatsAsync(token),
        adminCmsService.getNavigationItemsAsync(token)
      ]);
      setStats(liveStats);
      if (liveNav && liveNav.length > 0) {
        setNavSections(liveNav);
      }
    } catch (err) {
      console.error('Error fetching admin live stats:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [token]);

  const handleToggleSection = async (sectionId: string) => {
    setTogglingId(sectionId);
    try {
      const updated = navSections.map(n => n.id === sectionId ? { ...n, enabled: !n.enabled } : n);
      const saved = await adminCmsService.updateNavigationItemsAsync(token, updated);
      setNavSections(saved);
    } catch (err) {
      console.error('Failed to toggle section status:', err);
    } finally {
      setTogglingId(null);
    }
  };

  const metricCards = [
    {
      label: 'Total Users',
      value: stats.totalUsers ?? 0,
      subtext: `${stats.activeAdmins ?? 1} Administrator account(s)`,
      icon: Users,
      color: '#6366f1',
      section: 'users' as AdminSectionType
    },
    {
      label: 'Active Users',
      value: stats.activeUsers ?? stats.totalUsers ?? 0,
      subtext: 'Verified active user accounts',
      icon: UserCheck,
      color: '#10b981',
      section: 'users' as AdminSectionType
    },
    {
      label: 'Problems',
      value: stats.totalProblems ?? 0,
      subtext: `${stats.questions3000 ?? 0} Rating 3000+ Level Questions`,
      icon: Code2,
      color: '#38bdf8',
      section: 'problems' as AdminSectionType
    },
    {
      label: 'Lessons',
      value: stats.curriculumTopics ?? stats.totalLessons ?? 12,
      subtext: 'Curriculum & Flow of Learning modules',
      icon: BookOpen,
      color: '#ec4899',
      section: 'curriculum' as AdminSectionType
    },
    {
      label: 'Interview Questions',
      value: stats.totalInterviewQuestions ?? stats.totalInterviews ?? 0,
      subtext: 'Tech company interview questions bank',
      icon: HelpCircle,
      color: '#f59e0b',
      section: 'interview_jobs' as AdminSectionType
    },
    {
      label: 'Crime Lab Cases',
      value: stats.crimeLabCases ?? stats.totalCrimeLabCases ?? 100,
      subtext: 'Interactive forensic bug cases',
      icon: ShieldAlert,
      color: '#ef4444',
      section: 'crimelab' as AdminSectionType
    },
    {
      label: 'Feedback',
      value: stats.totalFeedback ?? 0,
      subtext: `${stats.newFeedback ?? 0} New pending review`,
      icon: MessageSquare,
      color: '#a855f7',
      section: 'feedback_settings' as AdminSectionType
    },
    {
      label: 'Popup Messages',
      value: stats.totalPopups ?? 102,
      subtext: 'Contextual & humorous CS popups',
      icon: Sparkles,
      color: '#06b6d4',
      section: 'motivation' as AdminSectionType
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Telemetry & System Status Header */}
      <div
        className="card"
        style={{
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: '#10b981',
              boxShadow: '0 0 10px #10b981'
            }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Live Platform Database Telemetry
              </span>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  padding: '2px 8px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(16, 185, 129, 0.15)',
                  color: '#10b981'
                }}
              >
                {stats.systemStatus || 'Operational'}
              </span>
            </div>
            <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', margin: 0, marginTop: '2px' }}>
              Server-backed real-time metrics across all Algorise website modules.
            </p>
          </div>
        </div>

        <button
          onClick={fetchStats}
          disabled={isLoading}
          className="btn btn-outline btn-sm"
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <RefreshCw
            style={{
              width: 13,
              height: 13,
              animation: isLoading ? 'spin 1s linear infinite' : 'none'
            }}
          />
          <span>{isLoading ? 'Syncing...' : 'Sync Database Stats'}</span>
        </button>
      </div>

      {/* Metric Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px'
        }}
      >
        {metricCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="card"
              onClick={() => onNavigateSection(card.section)}
              style={{
                padding: '18px 20px',
                cursor: 'pointer',
                transition: 'transform 0.2s, border-color 0.2s',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '12px'
              }}
              onMouseOver={(e) => (e.currentTarget.style.borderColor = card.color)}
              onMouseOut={(e) => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                  {card.label}
                </span>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '8px',
                    backgroundColor: `${card.color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: card.color
                  }}
                >
                  <Icon style={{ width: 16, height: 16 }} />
                </div>
              </div>

              <div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {card.value}
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>{card.subtext}</span>
                  <ArrowUpRight style={{ width: 14, height: 14, opacity: 0.7 }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Website Sections & Access Control Table */}
      <div
        className="card"
        style={{
          padding: '20px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          backgroundColor: 'var(--bg-surface)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sliders style={{ width: 18, height: 18, color: 'var(--accent-primary)' }} />
              <h3 style={{ fontSize: '1.02rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                Website Sections & Access Control
              </h3>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
              Enable or temporarily disable individual user-facing sections across Algorise in real-time.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigateSection('navigation')}
            className="btn btn-outline btn-sm"
            style={{ fontSize: '0.78rem', padding: '6px 14px' }}
          >
            Manage Section Order & Labels
          </button>
        </div>

        <div style={{ overflowX: 'auto', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-elevated)', borderBottom: '1px solid var(--border-subtle)', textAlign: 'left', color: 'var(--text-muted)' }}>
                <th style={{ padding: '10px 16px', fontWeight: 700 }}>Section</th>
                <th style={{ padding: '10px 16px', fontWeight: 700 }}>Route ID</th>
                <th style={{ padding: '10px 16px', fontWeight: 700 }}>Status</th>
                <th style={{ padding: '10px 16px', fontWeight: 700, textAlign: 'right' }}>Toggle Action</th>
              </tr>
            </thead>
            <tbody>
              {navSections.map((sec) => {
                const isEnabled = sec.enabled !== false;
                const isToggling = togglingId === sec.id;
                return (
                  <tr
                    key={sec.id}
                    style={{
                      borderBottom: '1px solid var(--border-subtle)',
                      transition: 'background-color 0.15s ease'
                    }}
                  >
                    <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {sec.label}
                    </td>
                    <td style={{ padding: '12px 16px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                      /{sec.id}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          padding: '3px 10px',
                          borderRadius: '12px',
                          fontSize: '0.74rem',
                          fontWeight: 700,
                          backgroundColor: isEnabled ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                          color: isEnabled ? '#10b981' : '#ef4444'
                        }}
                      >
                        {isEnabled ? <CheckCircle2 style={{ width: 12, height: 12 }} /> : <XCircle style={{ width: 12, height: 12 }} />}
                        {isEnabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <button
                        type="button"
                        disabled={isToggling}
                        onClick={() => handleToggleSection(sec.id)}
                        className={`btn btn-sm ${isEnabled ? 'btn-outline' : 'btn-primary'}`}
                        style={{
                          padding: '4px 12px',
                          fontSize: '0.76rem',
                          minWidth: '85px',
                          fontWeight: 600
                        }}
                      >
                        {isToggling ? (
                          <Loader2 style={{ width: 13, height: 13, animation: 'spin 1s linear infinite' }} />
                        ) : isEnabled ? (
                          'Disable'
                        ) : (
                          'Enable'
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Overview Summary Banner */}
      <div
        className="card"
        style={{
          padding: '20px 24px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-primary)', fontWeight: 700, fontSize: '0.9rem' }}>
            <ShieldCheck style={{ width: 18, height: 18 }} />
            <span>Real-time Content Synchronization</span>
          </div>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
            Any modifications made to Problems, 3000+ Questions, Curriculum topics, Crime Lab cases, or Tech News immediately update the live platform views for all authenticated users.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8', fontWeight: 700, fontSize: '0.9rem' }}>
            <Zap style={{ width: 18, height: 18 }} />
            <span>Strict Role-Based Access Control</span>
          </div>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
            All admin mutation endpoints check session tokens on the backend (`authService.requireAdmin`). Non-admin accounts attempting unauthorized modifications are blocked automatically.
          </p>
        </div>
      </div>
    </div>
  );
};
