import { Menu, LogOut, Shield, Moon, Sun, Sparkles } from 'lucide-react';
import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/react';
import type { TabType } from './Sidebar';
import { Logo } from '../common/Logo';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

interface HeaderProps {
  activeTab: TabType;
  isMobileOpen?: boolean;
  onOpenMobileMenu: () => void;
  onShowDevNotice: (msg: string) => void;
  onNavigateTab?: (tab: TabType) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  isMobileOpen,
  onOpenMobileMenu,
  onNavigateTab
}) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const getTabTitle = (tab: TabType) => {
    switch (tab) {
      case 'home': return 'Platform Overview';
      case 'learn': return 'Flow of Learning';
      case 'problems': return 'Problem Explorer';
      case 'problem_detail': return 'Problem Solver Environment';
      case 'compiler': return 'Online Code Compiler IDE';
      case 'visualizer': return 'Algorithm Visualizer Engine';
      case 'crimelab': return 'Crime Lab Forensic Investigation';
      case 'progress': return 'Learning Analytics & Progress';
      case 'interview': return 'Interview Question Bank';
      case 'job_roles': return 'Tech Career Job Roles';
      case 'notes': return 'Study Notes';
      case 'feedback': return 'User Feedback Channel';
      case 'settings': return 'Platform Settings';
      case 'admin': return 'System Administration Control Center';
      default: return 'ALGOrise';
    }
  };

  return (
    <header className="app-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 24px' }}>
      {/* Left side: Mobile Menu + ALGOrise Logo + Active Page Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="btn btn-outline btn-sm mobile-menu-toggle"
          id="mobile-menu-btn"
          aria-label="Open navigation menu"
          aria-expanded={isMobileOpen}
          aria-controls="mobile-navigation-drawer"
        >
          <Menu style={{ width: 18, height: 18 }} />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Logo size="sm" variant="icon" />
          <h1 className="header-title" style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.01em', margin: 0 }}>
            {getTabTitle(activeTab)}
          </h1>
        </div>
      </div>

      {/* Right side: Theme Toggle + Clerk Auth Controls & Authenticated User Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Quick Theme Toggle Button */}
        <button
          type="button"
          onClick={toggleTheme}
          className="btn btn-outline btn-sm"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            fontSize: '0.8rem',
            fontWeight: 600,
            color: 'var(--text-primary)',
            borderColor: 'var(--border-medium)',
            backgroundColor: 'var(--bg-surface)'
          }}
          title={`Active Theme: ${theme.toUpperCase()} (Click to toggle theme)`}
          aria-label={`Toggle theme (Current: ${theme})`}
        >
          {theme === 'dark' && <Moon style={{ width: 15, height: 15, color: '#38BDF8' }} />}
          {theme === 'light' && <Sun style={{ width: 15, height: 15, color: '#F59E0B' }} />}
          {theme === 'cute' && <Sparkles style={{ width: 15, height: 15, color: '#EC4899' }} />}
          <span className="header-btn-text" style={{ textTransform: 'capitalize' }}>
            {theme}
          </span>
        </button>
        <Show when="signed-out">
          <SignInButton mode="modal">
            <button
              className="btn btn-outline btn-sm"
              style={{ padding: '6px 14px', fontSize: '0.8rem', fontWeight: 600 }}
            >
              Sign In
            </button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button
              className="btn btn-primary btn-sm"
              style={{ padding: '6px 14px', fontSize: '0.8rem', fontWeight: 600 }}
            >
              Sign Up
            </button>
          </SignUpButton>
        </Show>

        <Show when="signed-in">
          <UserButton showName appearance={{ elements: { userButtonBox: { color: 'var(--text-primary)' } } }} />
        </Show>

        {user && (
          <>
            {/* Guest Mode prominent indicator badge */}
            {user.isGuest && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '4px 12px',
                  backgroundColor: 'rgba(234, 179, 8, 0.12)',
                  border: '1px solid rgba(234, 179, 8, 0.4)',
                  borderRadius: '20px',
                  color: '#EAB308',
                  fontSize: '0.78rem',
                  fontWeight: 700
                }}
              >
                <span>{user.username || 'Guest'}</span>
                <span style={{ fontSize: '0.7rem', opacity: 0.85, fontWeight: 500 }}>(Temporary Mode)</span>
                <button
                  type="button"
                  onClick={logout}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#EAB308',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    textDecoration: 'underline',
                    fontWeight: 700,
                    padding: '0 2px'
                  }}
                  title="Create an account to save your progress"
                >
                  Create Account to Save
                </button>
              </div>
            )}

            {/* Admin shortcut pill if admin */}
            {user.role === 'admin' && activeTab !== 'admin' && (
              <button
                type="button"
                onClick={() => onNavigateTab && onNavigateTab('admin')}
                className="btn btn-sm"
                style={{
                  backgroundColor: 'rgba(99, 102, 241, 0.15)',
                  border: '1px solid rgba(99, 102, 241, 0.4)',
                  color: 'var(--accent-primary)',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Shield style={{ width: 13, height: 13 }} />
                <span className="header-btn-text">Admin</span>
              </button>
            )}

            {/* Logout / Exit Guest Button */}
            <button
              type="button"
              onClick={logout}
              className="btn btn-outline btn-sm"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                fontSize: '0.8rem',
                color: user.isGuest ? '#EAB308' : 'var(--text-secondary)',
                borderColor: user.isGuest ? 'rgba(234, 179, 8, 0.4)' : 'var(--border-subtle)'
              }}
              title={user.isGuest ? 'Exit Guest Session' : 'Log Out Account'}
            >
              <LogOut style={{ width: 14, height: 14 }} />
              <span className="header-btn-text">{user.isGuest ? 'Exit Guest' : 'Logout'}</span>
            </button>
          </>
        )}
      </div>
    </header>
  );
};
