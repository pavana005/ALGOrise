import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Users,
  Code2,
  BookOpen,
  ShieldAlert,
  HelpCircle,
  FileText,
  Settings,
  Shield,
  Search,
  Home as HomeIcon,
  Eye,
  Sparkles,
  Navigation as NavIcon,
  Globe,
  History,
  Newspaper
} from 'lucide-react';
import { AdminDashboardView } from './views/AdminDashboardView';
import { AdminUsersView } from './views/AdminUsersView';
import { AdminHomeView } from './views/AdminHomeView';
import { AdminProblemsView } from './views/AdminProblemsView';
import { AdminCurriculumView } from './views/AdminCurriculumView';
import { AdminCrimeLabView } from './views/AdminCrimeLabView';
import { AdminVisualizerView } from './views/AdminVisualizerView';
import { AdminInterviewJobView } from './views/AdminInterviewJobView';
import { AdminNewsResourcesView } from './views/AdminNewsResourcesView';
import { AdminNotesKnowledgeView } from './views/AdminNotesKnowledgeView';
import { AdminMotivationView } from './views/AdminMotivationView';
import { AdminFeedbackSettingsView } from './views/AdminFeedbackSettingsView';
import { AdminNavigationView } from './views/AdminNavigationView';
import { AdminWebsiteContentView } from './views/AdminWebsiteContentView';
import { AdminGlobalSearchView } from './views/AdminGlobalSearchView';
import { AdminAuditLogView } from './views/AdminAuditLogView';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';

export type AdminSectionType =
  | 'dashboard'
  | 'users'
  | 'home'
  | 'curriculum'
  | 'problems'
  | 'crimelab'
  | 'visualizer'
  | 'interview_jobs'
  | 'news_resources'
  | 'notes_kb'
  | 'motivation'
  | 'feedback_settings'
  | 'navigation'
  | 'website_content'
  | 'global_search'
  | 'audit_log';

interface AdminLayoutProps {
  onShowDevNotice: (msg: string) => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ onShowDevNotice }) => {
  const { token } = useAuth();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [activeSection, setActiveSection] = useState<AdminSectionType>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let isMounted = true;
    authService.verifyAdminServer(token).then((authorized) => {
      if (isMounted) {
        setIsAuthorized(authorized);
        setIsVerifying(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [token]);

  const adminNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'Users & Roles', icon: Users },
    { id: 'home', label: 'Home CMS', icon: HomeIcon },
    { id: 'curriculum', label: 'Flow of Learning', icon: BookOpen },
    { id: 'problems', label: 'Problems & 3000+', icon: Code2 },
    { id: 'crimelab', label: 'Crime Lab', icon: ShieldAlert },
    { id: 'visualizer', label: 'Visualizer', icon: Eye },
    { id: 'interview_jobs', label: 'Interview & Jobs', icon: HelpCircle },
    { id: 'news_resources', label: 'Resources', icon: Newspaper },
    { id: 'notes_kb', label: 'Notes & KB', icon: FileText },
    { id: 'motivation', label: 'Motivation', icon: Sparkles },
    { id: 'navigation', label: 'Navigation', icon: NavIcon },
    { id: 'website_content', label: 'Site Content', icon: Globe },
    { id: 'global_search', label: 'Global Search', icon: Search },
    { id: 'audit_log', label: 'Audit Log', icon: History },
    { id: 'feedback_settings', label: 'Feedback & Settings', icon: Settings }
  ] as const;

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <AdminDashboardView onNavigateSection={(sec) => setActiveSection(sec)} />;
      case 'users':
        return <AdminUsersView searchQuery={searchQuery} onShowDevNotice={onShowDevNotice} />;
      case 'home':
        return <AdminHomeView />;
      case 'problems':
        return <AdminProblemsView searchQuery={searchQuery} onShowDevNotice={onShowDevNotice} />;
      case 'curriculum':
        return <AdminCurriculumView searchQuery={searchQuery} onShowDevNotice={onShowDevNotice} />;
      case 'crimelab':
        return <AdminCrimeLabView searchQuery={searchQuery} onShowDevNotice={onShowDevNotice} />;
      case 'visualizer':
        return <AdminVisualizerView searchQuery={searchQuery} />;
      case 'interview_jobs':
        return <AdminInterviewJobView searchQuery={searchQuery} onShowDevNotice={onShowDevNotice} />;
      case 'news_resources':
        return <AdminNewsResourcesView searchQuery={searchQuery} onShowDevNotice={onShowDevNotice} />;
      case 'notes_kb':
        return <AdminNotesKnowledgeView searchQuery={searchQuery} onShowDevNotice={onShowDevNotice} />;
      case 'motivation':
        return <AdminMotivationView />;
      case 'navigation':
        return <AdminNavigationView />;
      case 'website_content':
        return <AdminWebsiteContentView />;
      case 'global_search':
        return <AdminGlobalSearchView initialQuery={searchQuery} />;
      case 'audit_log':
        return <AdminAuditLogView />;
      case 'feedback_settings':
        return <AdminFeedbackSettingsView onShowDevNotice={onShowDevNotice} />;
      default:
        return <AdminDashboardView onNavigateSection={(sec) => setActiveSection(sec)} />;
    }
  };

  if (isVerifying) {
    return (
      <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
        <div style={{ width: 28, height: 28, border: '2px solid var(--border-subtle)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
        <span style={{ fontSize: '0.88rem' }}>Verifying administrator authorization with backend server...</span>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="card" style={{ padding: '48px 24px', textAlign: 'center', maxWidth: '520px', margin: '40px auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        <div style={{ width: 56, height: 56, borderRadius: '50%', backgroundColor: 'rgba(239, 68, 68, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}>
          <ShieldAlert style={{ width: 28, height: 28 }} />
        </div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
          Access Denied: Administrator Only
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
          Server-side role-based access control verified that your current session does not possess valid administrator credentials. Admin panel APIs and management interfaces are strictly inaccessible.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Admin Top Control Header */}
      <div
        className="card"
        style={{
          padding: '20px 24px',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: '10px',
              backgroundColor: 'rgba(99, 102, 241, 0.15)',
              border: '1px solid rgba(99, 102, 241, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-primary)'
            }}
          >
            <Shield style={{ width: 22, height: 22 }} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                ALGOrise Central CMS & Administration Panel
              </h2>
              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(16, 185, 129, 0.15)',
                  color: '#10b981',
                  border: '1px solid rgba(16, 185, 129, 0.3)'
                }}
              >
                RBAC Protected
              </span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0, marginTop: '2px' }}>
              Central control center for managing all user-facing content, curriculum, problems, crime lab, site copy, navigation, and settings.
            </p>
          </div>
        </div>

        {/* Global Admin Search Bar */}
        <div style={{ position: 'relative', width: '280px' }}>
          <Search
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: 15,
              height: 15,
              color: 'var(--text-muted)'
            }}
          />
          <input
            type="text"
            placeholder="Search across CMS content..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (e.target.value && activeSection !== 'global_search') {
                setActiveSection('global_search');
              }
            }}
            style={{
              width: '100%',
              padding: '8px 12px 8px 36px',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              color: 'var(--text-primary)',
              fontSize: '0.82rem',
              outline: 'none'
            }}
          />
        </div>
      </div>

      {/* Admin Navigation Pills */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '4px',
          borderBottom: '1px solid var(--border-subtle)'
        }}
      >
        {adminNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id as AdminSectionType)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 14px',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s',
                backgroundColor: isActive ? 'var(--accent-primary)' : 'rgba(30, 41, 59, 0.5)',
                color: isActive ? '#fff' : 'var(--text-secondary)'
              }}
            >
              <Icon style={{ width: 15, height: 15 }} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Admin Section View */}
      <div>{renderActiveSection()}</div>
    </div>
  );
};
