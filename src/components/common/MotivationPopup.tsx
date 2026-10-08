import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  BrainCircuit, 
  Coffee, 
  Bug, 
  Flame, 
  Zap, 
  Sparkles, 
  Award, 
  Clock, 
  Terminal, 
  Eye, 
  BookOpen,
  HelpCircle,
  AlertTriangle
} from 'lucide-react';
import { 
  motivationMessages, 
  formatMotivationMessage 
} from '../../data/motivationData';
import type { 
  MotivationCategory, 
  MotivationMessage, 
  MotivationContext 
} from '../../data/motivationData';
import { Badge } from './Badge';
import { useAuth } from '../../context/AuthContext';
import { useProgress } from '../../context/ProgressContext';

export interface TriggerMotivationDetail {
  category?: MotivationCategory;
  algorithm?: string;
  attempts?: number;
  level?: string | number;
  daysAway?: number;
  force?: boolean;
}

const STORAGE_SHOWN_IDS = 'algorise_shown_popup_ids';
const STORAGE_LAST_VISIT = 'algorise_last_session_visit';
const STORAGE_PREV_STREAK = 'algorise_prev_user_streak';

export const MotivationPopup: React.FC = () => {
  const { user } = useAuth();
  const progress = useProgress();

  const [currentMessageText, setCurrentMessageText] = useState<string>('');
  const [currentMessageObj, setCurrentMessageObj] = useState<MotivationMessage | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const lastShownTimestamp = useRef<number>(0);
  const lastInteractionTimestamp = useRef<number>(Date.now());
  const recentlyShownCategories = useRef<string[]>([]);

  // 45 seconds global cooldown for background / passive triggers
  const COOLDOWN_MS = 45000;

  // Retrieve stored history of shown message IDs across sessions
  const getRecentlyShownIds = (): string[] => {
    try {
      const raw = localStorage.getItem(STORAGE_SHOWN_IDS);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  };

  const saveShownId = (id: string) => {
    try {
      const current = getRecentlyShownIds();
      const updated = [...current.filter(x => x !== id), id].slice(-35); // Keep last 35
      localStorage.setItem(STORAGE_SHOWN_IDS, JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  // Helper to pick a random message with strict anti-repetition
  const pickRandomMessage = (requestedCategory?: MotivationCategory): MotivationMessage => {
    let pool = motivationMessages;

    if (requestedCategory) {
      const filtered = motivationMessages.filter(m => m.category === requestedCategory);
      if (filtered.length > 0) {
        pool = filtered;
      }
    }

    const shownIds = getRecentlyShownIds();
    // Exclude recently shown messages
    let unshown = pool.filter(m => !shownIds.includes(m.id));

    // If all in this category were shown recently, reset pool for this category
    if (unshown.length === 0) {
      unshown = pool;
    }

    // Also avoid picking the exact same category consecutively for background random popups
    if (!requestedCategory && unshown.length > 1) {
      const unshownCat = unshown.filter(m => !recentlyShownCategories.current.slice(-3).includes(m.category));
      if (unshownCat.length > 0) {
        unshown = unshownCat;
      }
    }

    const selected = unshown[Math.floor(Math.random() * unshown.length)] || pool[0];

    // Save history
    saveShownId(selected.id);
    recentlyShownCategories.current = [...recentlyShownCategories.current, selected.category].slice(-6);

    return selected;
  };

  const showPopup = (msg: MotivationMessage, customCtx?: MotivationContext) => {
    // Build context with safe, real application state
    const fullCtx: MotivationContext = {
      username: user?.name && user.name !== 'undefined' ? user.name : 'Coder',
      streak: progress?.currentStreak ?? 1,
      problemsSolved: progress?.solvedProblemIds?.size ?? 0,
      points: (progress?.solvedProblemIds?.size || 0) * 50 || 100,
      algorithm: customCtx?.algorithm && customCtx.algorithm !== 'undefined' ? customCtx.algorithm : 'this problem',
      level: customCtx?.level !== undefined ? customCtx.level : 1,
      attempts: customCtx?.attempts && !isNaN(Number(customCtx.attempts)) ? Number(customCtx.attempts) : 1,
      daysAway: customCtx?.daysAway && !isNaN(Number(customCtx.daysAway)) ? Number(customCtx.daysAway) : 2
    };

    const formattedText = formatMotivationMessage(msg.template, fullCtx);
    setCurrentMessageObj(msg);
    setCurrentMessageText(formattedText);
    setIsVisible(true);
    lastShownTimestamp.current = Date.now();
  };

  const dismissPopup = () => {
    setIsVisible(false);
  };

  // Helper to check if user is actively typing in input / editor
  const isUserTyping = (): boolean => {
    const activeEl = document.activeElement;
    if (!activeEl) return false;
    const tag = activeEl.tagName.toUpperCase();
    if (tag === 'INPUT' || tag === 'TEXTAREA' || activeEl.getAttribute('contenteditable') === 'true') {
      return true;
    }
    if (activeEl.classList && (activeEl.classList.contains('monaco-editor') || activeEl.classList.contains('input-field'))) {
      return true;
    }
    return false;
  };

  const isOnProblemPage = (): boolean => {
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    return path.includes('problem') || hash.includes('problem');
  };

  // 1. Listen for user interactions to track idle state
  useEffect(() => {
    const handleUserActivity = () => {
      lastInteractionTimestamp.current = Date.now();
    };

    window.addEventListener('mousemove', handleUserActivity);
    window.addEventListener('keydown', handleUserActivity);
    window.addEventListener('click', handleUserActivity);
    window.addEventListener('scroll', handleUserActivity);

    return () => {
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
      window.removeEventListener('click', handleUserActivity);
      window.removeEventListener('scroll', handleUserActivity);
    };
  }, []);

  // 2. Custom event listener for motivation triggers
  useEffect(() => {
    const handleCustomTrigger = (event: Event) => {
      const customEvt = event as CustomEvent<TriggerMotivationDetail>;
      const detail = customEvt.detail || {};
      const { category, force, algorithm, attempts, level, daysAway } = detail;

      const now = Date.now();

      // Prevent overlapping popups unless forced
      if (isVisible && !force) {
        return;
      }

      // Enforce 4s minimal spacing even on forced triggers to avoid back-to-back flicker
      if (now - lastShownTimestamp.current < 4000) {
        return;
      }

      if (isUserTyping() && !force) {
        return;
      }

      const msg = pickRandomMessage(category);
      showPopup(msg, { algorithm, attempts, level, daysAway });
    };

    window.addEventListener('algorise_trigger_motivation', handleCustomTrigger);
    return () => {
      window.removeEventListener('algorise_trigger_motivation', handleCustomTrigger);
    };
  }, [user, progress, isVisible]);

  // 3. Tab Return / Visibility Change Listener
  useEffect(() => {
    let hiddenTimestamp = 0;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        hiddenTimestamp = Date.now();
      } else {
        const now = Date.now();
        const awayDuration = hiddenTimestamp > 0 ? now - hiddenTimestamp : 0;
        // Trigger TAB_RETURN if user spent > 15s away from the tab
        if (awayDuration >= 15000 && !isVisible && now - lastShownTimestamp.current >= 15000) {
          const msg = pickRandomMessage('TAB_RETURN');
          showPopup(msg);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isVisible]);

  // 4. Background Periodic Timer for Idle, Long Session & Context Checks (every 25s)
  useEffect(() => {
    const sessionStartTime = Date.now();

    const timer = setInterval(() => {
      const now = Date.now();

      if (isVisible) return;
      if (now - lastShownTimestamp.current < COOLDOWN_MS) return;
      if (isUserTyping()) return;

      const timeSinceLastInteraction = now - lastInteractionTimestamp.current;

      // Check if user is IDLE (> 40 seconds without mouse/keyboard activity)
      if (timeSinceLastInteraction > 40000) {
        const cat = isOnProblemPage() ? 'IDLE_ON_PROBLEM' : 'IDLE';
        const msg = pickRandomMessage(cat);
        showPopup(msg);
        return;
      }

      // Long Session trigger (every 45+ minutes of active study)
      const sessionDuration = now - sessionStartTime;
      if (sessionDuration > 2700000 && Math.random() < 0.5) {
        const msg = pickRandomMessage('LONG_SESSION');
        showPopup(msg);
        return;
      }
    }, 25000);

    return () => clearInterval(timer);
  }, [isVisible]);

  // 5. Initial Mount: Check returning user & streak status
  useEffect(() => {
    const now = Date.now();
    try {
      const lastVisitRaw = localStorage.getItem(STORAGE_LAST_VISIT);
      if (lastVisitRaw) {
        const lastVisit = parseInt(lastVisitRaw, 10);
        const daysAway = Math.floor((now - lastVisit) / (1000 * 60 * 60 * 24));
        if (daysAway >= 3) {
          const timer = setTimeout(() => {
            if (!isVisible) {
              const msg = pickRandomMessage('RETURNING_USER');
              showPopup(msg, { daysAway });
            }
          }, 3500);
          localStorage.setItem(STORAGE_LAST_VISIT, String(now));
          return () => clearTimeout(timer);
        }
      }
      localStorage.setItem(STORAGE_LAST_VISIT, String(now));

      // Check if streak was broken
      const prevStreakRaw = localStorage.getItem(STORAGE_PREV_STREAK);
      if (prevStreakRaw) {
        const prevStreak = parseInt(prevStreakRaw, 10);
        if (prevStreak >= 2 && (progress?.currentStreak ?? 0) === 0) {
          const timer = setTimeout(() => {
            if (!isVisible) {
              const msg = pickRandomMessage('BROKEN_STREAK');
              showPopup(msg);
            }
          }, 5000);
          localStorage.setItem(STORAGE_PREV_STREAK, String(progress?.currentStreak ?? 0));
          return () => clearTimeout(timer);
        }
      }
      if (progress?.currentStreak !== undefined) {
        localStorage.setItem(STORAGE_PREV_STREAK, String(progress.currentStreak));
      }
    } catch {
      // Ignore
    }
  }, [user?.id, progress?.currentStreak]);

  // 6. Auto-hide popup after 9 seconds
  useEffect(() => {
    if (isVisible) {
      const hideTimer = setTimeout(() => {
        setIsVisible(false);
      }, 9000);
      return () => clearTimeout(hideTimer);
    }
  }, [isVisible, currentMessageText]);

  if (!isVisible || !currentMessageObj) {
    return null;
  }

  const getBadgeVariant = (variant: string) => {
    switch (variant) {
      case 'pink': return 'hard' as const;
      case 'green': return 'easy' as const;
      case 'amber': return 'medium' as const;
      case 'purple': return 'purple' as const;
      default: return 'blue' as const;
    }
  };

  const getCategoryIcon = (category: MotivationCategory) => {
    switch (category) {
      case 'FAILED_ATTEMPTS':
      case 'COMPILE_ERROR':
      case 'RUNTIME_ERROR':
        return <Bug style={{ width: 16, height: 16, color: '#EF4444' }} />;
      case 'TIME_LIMIT_EXCEEDED':
        return <Clock style={{ width: 16, height: 16, color: '#F59E0B' }} />;
      case 'ACCEPTED':
      case 'PROBLEM_SOLVED':
      case 'FIRST_ACCEPTED':
        return <Award style={{ width: 16, height: 16, color: '#10B981' }} />;
      case 'FAST_SOLVE':
        return <Zap style={{ width: 16, height: 16, color: '#8B5CF6' }} />;
      case 'SPEEDRUN_BROWSING':
        return <Flame style={{ width: 16, height: 16, color: '#EC4899' }} />;
      case 'MANY_HINTS':
        return <HelpCircle style={{ width: 16, height: 16, color: '#3B82F6' }} />;
      case 'REPEATED_RUNS':
      case 'REPEATED_EDITS':
        return <Terminal style={{ width: 16, height: 16, color: '#EC4899' }} />;
      case 'VISUALIZER':
        return <Eye style={{ width: 16, height: 16, color: '#3B82F6' }} />;
      case 'LEARNING':
      case 'LESSON_COMPLETE':
        return <BookOpen style={{ width: 16, height: 16, color: '#10B981' }} />;
      case 'LONG_SESSION':
        return <Coffee style={{ width: 16, height: 16, color: '#F59E0B' }} />;
      case 'STUCK_ON_PROBLEM':
      case 'IDLE_ON_PROBLEM':
        return <BrainCircuit style={{ width: 16, height: 16, color: '#EC4899' }} />;
      case 'BROKEN_STREAK':
        return <AlertTriangle style={{ width: 16, height: 16, color: '#F59E0B' }} />;
      default:
        return <Sparkles style={{ width: 16, height: 16, color: 'var(--accent-blue)' }} />;
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        maxWidth: '380px',
        width: 'calc(100vw - 48px)',
        pointerEvents: 'auto',
        animation: 'slideUpFade 0.3s ease-out'
      }}
    >
      <div
        className="card"
        style={{
          padding: '12px 14px',
          backgroundColor: 'var(--bg-surface-elevated)',
          border: '1.5px solid var(--accent-blue)',
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.45)',
          borderRadius: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          position: 'relative'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {getCategoryIcon(currentMessageObj.category)}
            <Badge variant={getBadgeVariant(currentMessageObj.badgeVariant)}>
              {currentMessageObj.badgeTitle}
            </Badge>
          </div>

          <button
            onClick={dismissPopup}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '2px',
              display: 'flex',
              alignItems: 'center',
              borderRadius: '4px',
              transition: 'all 0.15s ease'
            }}
            aria-label="Dismiss popup"
          >
            <X style={{ width: 14, height: 14 }} />
          </button>
        </div>

        {/* Message Content */}
        <div style={{ fontSize: '0.84rem', color: 'var(--text-primary)', lineHeight: '1.45', fontWeight: 600 }}>
          {currentMessageText}
        </div>

        {/* Footer Action */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '2px' }}>
          <button
            onClick={dismissPopup}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '0.725rem',
              fontWeight: 600,
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};

// Global helper to trigger popup anywhere in the app
export const triggerMotivationPopup = (
  category?: MotivationCategory,
  force?: boolean,
  extraCtx?: Partial<MotivationContext>
) => {
  window.dispatchEvent(
    new CustomEvent<TriggerMotivationDetail>('algorise_trigger_motivation', {
      detail: {
        category,
        force,
        algorithm: extraCtx?.algorithm,
        attempts: extraCtx?.attempts,
        level: extraCtx?.level,
        daysAway: extraCtx?.daysAway
      }
    })
  );
};
