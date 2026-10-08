import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { LoginPage } from '../../pages/LoginPage';
import { Sidebar } from './Sidebar';
import type { TabType } from './Sidebar';
import { Header } from './Header';
import { MobileDrawer } from './MobileDrawer';
import { HomePage } from '../../pages/HomePage';
import { LearnPage } from '../../pages/LearnPage';
import { ProblemsPage } from '../../pages/ProblemsPage';
import { ProblemDetailPage } from '../../pages/ProblemDetailPage';
import { VisualizerPage } from '../../pages/VisualizerPage';
import { CrimeLabPage } from '../../pages/CrimeLabPage';
import { ProgressPage } from '../../pages/ProgressPage';
import { InterviewPage } from '../../pages/InterviewPage';
import { JobRolesPage } from '../../pages/JobRolesPage';
import { NotesPage } from '../../pages/NotesPage';
import { SettingsPage } from '../../pages/SettingsPage';
import { AdminLayout } from '../admin/AdminLayout';
import { NotificationToast } from '../common/NotificationToast';
import { MotivationPopup, triggerMotivationPopup } from '../common/MotivationPopup';
import { Footer } from './Footer';
import { Logo } from '../common/Logo';
import { useTheme } from '../../context/ThemeContext';
import { ThemeSelectionModal } from '../common/ThemeSelectionModal';
import { ShieldAlert } from 'lucide-react';
import { adminCmsService } from '../../services/adminCmsService';

const getTabFromUrl = (customPath?: string): { tab: TabType; problemId?: string } => {
  const rawPath = (customPath || window.location.pathname).toLowerCase().trim();
  const rawHash = window.location.hash.replace('#', '').toLowerCase().trim();

  const parseRouteStr = (route: string): { tab: TabType; problemId?: string } | null => {
    const clean = route.startsWith('/') ? route.slice(1) : route;
    if (!clean || clean === 'home') return { tab: 'home' };
    if (clean === 'login') return { tab: 'home' };
    if (clean === 'problems' || clean === 'problem') return { tab: 'problems' };
    if (clean.startsWith('problem/')) {
      const parts = clean.split('/');
      return { tab: 'problem_detail', problemId: parts[1] || 'two-sum' };
    }
    if (clean === 'flow-of-learning' || clean === 'learn' || clean === 'learning') return { tab: 'learn' };
    if (clean === 'notes') return { tab: 'notes' };
    if (clean === 'settings') return { tab: 'settings' };
    if (clean === 'feedback') return { tab: 'feedback' };
    if (clean === 'progress') return { tab: 'progress' };
    if (clean === 'crimelab' || clean === 'crime-lab') return { tab: 'crimelab' };
    if (clean === 'visualizer') return { tab: 'visualizer' };
    if (clean === 'interview') return { tab: 'interview' };
    if (clean === 'job-roles' || clean === 'job_roles' || clean === 'roles') return { tab: 'job_roles' };
    if (clean === 'admin') return { tab: 'admin' };
    return null;
  };

  const pathMatch = parseRouteStr(rawPath);
  if (pathMatch) return pathMatch;

  const hashMatch = parseRouteStr(rawHash);
  if (hashMatch) return hashMatch;

  return { tab: 'home' };
};

export const AppShell: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>(() => getTabFromUrl().tab);
  const [selectedProblemId, setSelectedProblemId] = useState<string>(() => getTabFromUrl().problemId || 'two-sum');
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const { theme, setTheme, openThemePrompt } = useTheme();

  const [navConfig, setNavConfig] = useState(() => adminCmsService.getNavigationItems());

  useEffect(() => {
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

  const isTabDisabled = (tab: TabType): boolean => {
    if (tab === 'settings' || tab === 'admin') return false;
    let sectionKey = tab as string;
    if (tab === 'problem_detail' || tab === 'compiler') sectionKey = 'problems';
    const cmsItem = navConfig.find(c => c.id === sectionKey);
    return cmsItem ? cmsItem.enabled === false : false;
  };

  // Theme selection flow:
  // 1. If user already chose a theme, restore it and do not force prompt again.
  // 2. If user hasn't chosen a theme yet, open the theme prompt modal after login.
  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      const userThemeConfiguredKey = `algorise_theme_configured_${user.id}`;
      const userThemePrefKey = `algorise_theme_preference_${user.id}`;
      const isConfiguredForUser = localStorage.getItem(userThemeConfiguredKey);
      const savedUserTheme = localStorage.getItem(userThemePrefKey);

      if (isConfiguredForUser === 'true') {
        // User has already chosen a theme previously.
        // Make sure their chosen theme is restored without overwriting it with Light mode
        if (savedUserTheme && (savedUserTheme === 'light' || savedUserTheme === 'dark' || savedUserTheme === 'cute')) {
          if (theme !== savedUserTheme) {
            setTheme(savedUserTheme);
          }
        }
      } else {
        // Check global configured flag as fallback
        const isGloballyConfigured = localStorage.getItem('algorise_theme_configured');
        if (isGloballyConfigured === 'true') {
          try {
            localStorage.setItem(userThemeConfiguredKey, 'true');
            localStorage.setItem(userThemePrefKey, theme);
          } catch {
            // Ignore
          }
        } else {
          // Unconfigured user: prompt them to choose their preferred theme
          openThemePrompt();
        }
      }
    }
  }, [isLoading, isAuthenticated, user?.id]);

  // Keep user-specific theme preference synchronized whenever theme changes
  useEffect(() => {
    if (user?.id && theme) {
      try {
        localStorage.setItem(`algorise_theme_preference_${user.id}`, theme);
      } catch {
        // Ignore
      }
    }
  }, [theme, user?.id]);

  // Strict route protection: redirect unauthenticated access directly to /login
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const currentPath = window.location.pathname;
      if (currentPath !== '/login') {
        const fullRedirect = currentPath + window.location.search + window.location.hash;
        try {
          sessionStorage.setItem('algorise_redirect_after_login', fullRedirect);
        } catch {
          // ignore
        }
        window.history.replaceState(null, '', '/login');
      }
    } else if (!isLoading && isAuthenticated) {
      if (window.location.pathname === '/login') {
        window.history.replaceState(null, '', '/');
      }
    }
  }, [isLoading, isAuthenticated]);

  useEffect(() => {
    const handleUrlChange = () => {
      const { tab: newTab, problemId: newProblemId } = getTabFromUrl();
      setActiveTab(newTab);
      if (newProblemId) setSelectedProblemId(newProblemId);
    };

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  const handleNavigateTab = (tab: TabType, extraId?: string) => {
    if (tab === 'admin' && user?.role !== 'admin') {
      setToastMessage('Access Denied: Admin authorization required.');
      setActiveTab('home');
      window.history.pushState(null, '', '/');
      return;
    }

    if (tab !== activeTab) {
      if (tab === 'problems') {
        triggerMotivationPopup('PROBLEM_BROWSING', false);
      } else if (tab === 'learn') {
        triggerMotivationPopup('LEARNING', false);
      } else if (tab === 'visualizer') {
        triggerMotivationPopup('VISUALIZER', false);
      } else if (tab === 'interview') {
        triggerMotivationPopup('RANDOM_CHAOS', false);
      }
    }

    setActiveTab(tab);
    const targetProblemId = extraId || selectedProblemId || 'two-sum';
    if (extraId) {
      setSelectedProblemId(extraId);
    }

    let targetPath = '/';
    if (tab === 'home') targetPath = '/';
    else if (tab === 'problems') targetPath = '/problems';
    else if (tab === 'problem_detail') targetPath = `/problem/${targetProblemId}`;
    else if (tab === 'learn') targetPath = '/flow-of-learning';
    else if (tab === 'notes') targetPath = '/notes';
    else if (tab === 'settings') targetPath = '/settings';
    else if (tab === 'feedback') targetPath = '/feedback';
    else if (tab === 'progress') targetPath = '/progress';
    else if (tab === 'crimelab') targetPath = '/crimelab';
    else if (tab === 'visualizer') targetPath = '/visualizer';
    else if (tab === 'interview') targetPath = '/interview';
    else if (tab === 'job_roles') targetPath = '/job-roles';
    else if (tab === 'admin') targetPath = '/admin';

    if (window.location.pathname !== targetPath) {
      window.history.pushState(null, '', targetPath);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginSuccess = () => {
    let savedTarget = '/';
    try {
      savedTarget = sessionStorage.getItem('algorise_redirect_after_login') || '/';
      sessionStorage.removeItem('algorise_redirect_after_login');
    } catch {
      // ignore
    }

    if (savedTarget && savedTarget !== '/login' && savedTarget !== '/') {
      const { tab, problemId } = getTabFromUrl(savedTarget);
      handleNavigateTab(tab, problemId);
    } else {
      handleNavigateTab('home');
    }
  };

  const showDevNotice = (msg: string) => {
    setToastMessage(msg);
  };

  // Loading state during token validation on app refresh
  if (isLoading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'var(--bg-primary)',
          color: 'var(--text-primary)',
          gap: '16px'
        }}
      >
        <Logo size="lg" variant="full" />
        <div
          style={{
            width: '24px',
            height: '24px',
            border: '2px solid var(--border-subtle)',
            borderTopColor: 'var(--accent-primary)',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite'
          }}
        />
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Strict route protection: unauthenticated users only see LoginPage
  if (!isAuthenticated) {
    return <LoginPage onSuccess={handleLoginSuccess} />;
  }

  const renderActivePage = () => {
    // Barrier for disabled sections (non-admin accounts)
    if (user?.role !== 'admin' && isTabDisabled(activeTab)) {
      return (
        <div
          style={{
            minHeight: '60vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 20px',
            textAlign: 'center',
            maxWidth: '560px',
            margin: '0 auto'
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              color: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px'
            }}
          >
            <ShieldAlert size={32} />
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-primary)' }}>
            This section is temporarily unavailable.
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '24px', lineHeight: 1.6 }}>
            This area of the platform is currently undergoing scheduled maintenance or updates by the administrators. Please check back shortly.
          </p>
          <button className="btn btn-primary" onClick={() => handleNavigateTab('home')}>
            Back to Home
          </button>
        </div>
      );
    }

    switch (activeTab) {
      case 'home':
        return <HomePage onNavigateTab={handleNavigateTab} />;
      case 'learn':
        return <LearnPage onNavigateTab={handleNavigateTab} onShowDevNotice={showDevNotice} initialStageId={selectedProblemId} />;
      case 'problems':
        return <ProblemsPage onNavigateTab={handleNavigateTab} />;
      case 'problem_detail':
        return <ProblemDetailPage problemId={selectedProblemId} onNavigateTab={handleNavigateTab} onShowDevNotice={showDevNotice} />;
      case 'compiler':
        return <ProblemDetailPage problemId={selectedProblemId || 'two-sum'} onNavigateTab={handleNavigateTab} onShowDevNotice={showDevNotice} />;
      case 'crimelab':
        return <CrimeLabPage onNavigateTab={handleNavigateTab} initialCaseId={selectedProblemId} />;
      case 'visualizer':
        return <VisualizerPage onShowDevNotice={showDevNotice} onNavigateTab={handleNavigateTab} />;
      case 'interview':
        return <InterviewPage onNavigateTab={handleNavigateTab} initialQuestionId={selectedProblemId} />;
      case 'job_roles':
        return <JobRolesPage onNavigateTab={handleNavigateTab} />;
      case 'notes':
        return <NotesPage />;
      case 'progress':
        return <ProgressPage onNavigateTab={handleNavigateTab} />;
      case 'settings':
        return <SettingsPage onShowDevNotice={showDevNotice} onNavigateTab={handleNavigateTab} initialTab={selectedProblemId === 'feedback' ? 'feedback' : undefined} />;
      case 'feedback':
        return <SettingsPage onShowDevNotice={showDevNotice} onNavigateTab={handleNavigateTab} initialTab="feedback" />;
      case 'admin':
        if (user?.role !== 'admin') {
          return <HomePage onNavigateTab={handleNavigateTab} />;
        }
        return <AdminLayout onShowDevNotice={showDevNotice} />;
      default:
        return <HomePage onNavigateTab={handleNavigateTab} />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={(t) => handleNavigateTab(t)} 
      />

      <MobileDrawer 
        isOpen={isMobileOpen}
        onClose={() => setIsMobileOpen(false)}
        activeTab={activeTab}
        setActiveTab={(t) => handleNavigateTab(t)}
      />

      <div className="main-wrapper" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header 
          activeTab={activeTab}
          isMobileOpen={isMobileOpen}
          onOpenMobileMenu={() => setIsMobileOpen(true)}
          onShowDevNotice={showDevNotice}
          onNavigateTab={handleNavigateTab}
        />

        <main className="main-content" style={{ flex: 1 }}>
          {renderActivePage()}
        </main>

        <Footer onNavigateTab={handleNavigateTab} />
      </div>

      {toastMessage && (
        <NotificationToast 
          message={toastMessage} 
          onClose={() => setToastMessage(null)} 
        />
      )}

      <ThemeSelectionModal />
      <MotivationPopup />
    </div>
  );
};
