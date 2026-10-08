import React from 'react';
import {
  Home,
  BookOpen,
  Code2,
  Eye,
  ShieldAlert,
  HelpCircle,
  BarChart3,
  FileText,
  Settings,
  Briefcase,
  Shield,
  LogOut
} from 'lucide-react';
import { Logo } from '../common/Logo';
import { useAuth } from '../../context/AuthContext';

import { adminCmsService } from '../../services/adminCmsService';

export type TabType = 
  | 'home' 
  | 'learn' 
  | 'problems' 
  | 'problem_detail'
  | 'compiler'
  | 'crimelab'
  | 'visualizer' 
  | 'interview'
  | 'job_roles'
  | 'notes'
  | 'progress' 
  | 'settings'
  | 'feedback'
  | 'admin';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isMobileOpen,
  onCloseMobile
}) => {
  const { user, logout } = useAuth();
  const [navConfig, setNavConfig] = React.useState(() => adminCmsService.getNavigationItems());

  React.useEffect(() => {
    let isMounted = true;
    adminCmsService.getNavigationItemsAsync(null).then((items) => {
      if (isMounted && items && items.length > 0) {
        setNavConfig(items);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const baseNavItems = [
    { id: 'home', label: 'Home', icon: Home, colorClass: 'nav-icon-home' },
    { id: 'learn', label: 'Flow of Learning', icon: BookOpen, colorClass: 'nav-icon-learn' },
    { id: 'problems', label: 'Problems', icon: Code2, colorClass: 'nav-icon-problems' },
    { id: 'crimelab', label: 'Crime Lab', icon: ShieldAlert, colorClass: 'nav-icon-crimelab' },
    { id: 'visualizer', label: 'Visualizer', icon: Eye, colorClass: 'nav-icon-visualizer' },
    { id: 'interview', label: 'Interview Questions', icon: HelpCircle, colorClass: 'nav-icon-interview' },
    { id: 'job_roles', label: 'Job Roles', icon: Briefcase, colorClass: 'nav-icon-progress' },
    { id: 'notes', label: 'Notes', icon: FileText, colorClass: 'nav-icon-learn' },
    { id: 'progress', label: 'Progress', icon: BarChart3, colorClass: 'nav-icon-progress' },
    { id: 'settings', label: 'Settings', icon: Settings, colorClass: 'nav-icon-settings' }
  ];

  // Filter out disabled sections for regular users
  const navItems = baseNavItems.filter(item => {
    if (item.id === 'settings') return true;
    if (user?.role === 'admin') return true;
    const cmsItem = navConfig.find(c => c.id === item.id);
    return cmsItem ? cmsItem.enabled !== false : true;
  });

  // Dynamically include Admin Panel link for authorized admins
  if (user?.role === 'admin') {
    navItems.push({
      id: 'admin',
      label: 'Admin Control Panel',
      icon: Shield,
      colorClass: 'nav-icon-settings'
    });
  }

  const handleSelect = (tab: TabType) => {
    setActiveTab(tab);
    if (onCloseMobile) onCloseMobile();
  };

  const handleLogout = () => {
    if (onCloseMobile) onCloseMobile();
    logout();
  };

  return (
    <aside className={`app-sidebar ${isMobileOpen ? 'mobile-drawer-sidebar' : ''}`}>
      <div className="sidebar-logo-area" style={{ cursor: 'pointer' }} onClick={() => handleSelect('home')}>
        <Logo size="md" variant="full" showTagline />
      </div>

      <ul className="nav-list" role="navigation" aria-label="Main Navigation">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id || (activeTab === 'problem_detail' && item.id === 'problems');
          return (
            <li key={item.id}>
              <button
                type="button"
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => handleSelect(item.id as TabType)}
                aria-current={isActive ? 'page' : undefined}
                style={item.id === 'admin' ? { color: '#a855f7', fontWeight: 700 } : {}}
              >
                <Icon className={`nav-icon ${item.colorClass}`} />
                <span>{item.label}</span>
              </button>
            </li>
          );
        })}
      </ul>

      {user && (
        <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border-subtle)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, color: user.isGuest ? '#eab308' : 'var(--text-secondary)' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: user.isGuest ? '#eab308' : 'var(--easy-color)', display: 'inline-block' }}></span>
              {user.isGuest ? 'Guest Session' : user.role === 'admin' ? 'Administrator' : 'Authenticated User'}
            </div>
          </div>

          <div style={{ fontSize: '0.78rem', color: 'var(--text-primary)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {user.isGuest ? user.username : user.name}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: '12px' }}>
            {user.isGuest ? 'Temporary Guest Mode' : user.email}
          </div>

          <button
            onClick={handleLogout}
            className="btn btn-outline btn-sm"
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              fontSize: '0.78rem',
              padding: '6px 12px',
              color: 'var(--text-secondary)'
            }}
          >
            <LogOut style={{ width: 14, height: 14 }} />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </aside>
  );
};
