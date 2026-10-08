import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useAuth } from './AuthContext';
import { authService } from '../services/authService';

export interface ActivityItem {
  id: string;
  title: string;
  subtitle: string;
  timestamp: number;
  type: 'solved' | 'attempted' | 'learning';
}

interface ProgressContextType {
  solvedProblemIds: Set<string>;
  attemptedProblemIds: Set<string>;
  savedInterviewIds: Set<string>;
  completedInterviewIds: Set<string>;
  userInterviewAnswers: Record<string, string>;
  completedMockInterviews: number;
  activityLog: ActivityItem[];
  activityTimestamps: number[];
  currentStreak: number;
  dailyQuestionGoal: number;
  todaySolvedCount: number;
  setDailyQuestionGoal: (goal: number) => void;
  toggleSaveInterview: (id: string) => void;
  toggleCompleteInterview: (id: string) => void;
  saveUserInterviewAnswer: (id: string, text: string) => void;
  incrementMockInterviews: () => void;
  markProblemSolved: (id: string, title?: string) => void;
  markProblemAttempted: (id: string, title?: string) => void;
  recordLearningActivity: (title: string, subtitle: string) => void;
}

const STORAGE_KEY = 'algorise_progress_v1';
const GUEST_TEMP_STORAGE_KEY = 'algorise_guest_temp_progress';

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, updateDailyQuestionGoal } = useAuth();
  const [solvedProblemIds, setSolvedProblemIds] = useState<Set<string>>(new Set());
  const [attemptedProblemIds, setAttemptedProblemIds] = useState<Set<string>>(new Set());
  const [savedInterviewIds, setSavedInterviewIds] = useState<Set<string>>(new Set());
  const [completedInterviewIds, setCompletedInterviewIds] = useState<Set<string>>(new Set());
  const [userInterviewAnswers, setUserInterviewAnswers] = useState<Record<string, string>>({});
  const [completedMockInterviews, setCompletedMockInterviews] = useState<number>(0);
  const [activityLog, setActivityLog] = useState<ActivityItem[]>([]);
  const [activityTimestamps, setActivityTimestamps] = useState<number[]>([]);

  // Daily goal from user profile (default 5 if not set)
  const dailyQuestionGoal = user?.dailyQuestionGoal ?? 5;

  const setDailyQuestionGoal = (goal: number) => {
    updateDailyQuestionGoal(goal);
  };

  // Real calculation of questions solved TODAY (unique problem entries logged today)
  const todaySolvedCount = useMemo(() => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const endOfToday = startOfToday + 24 * 60 * 60 * 1000;

    const uniqueSolvedToday = new Set<string>();

    activityLog.forEach((item) => {
      if (item.type === 'solved' && item.timestamp >= startOfToday && item.timestamp < endOfToday) {
        uniqueSolvedToday.add(item.title);
      }
    });

    return uniqueSolvedToday.size;
  }, [activityLog]);

  // Load progress scoped to current user or temporary guest session
  useEffect(() => {
    if (!user) {
      setSolvedProblemIds(new Set());
      setAttemptedProblemIds(new Set());
      setSavedInterviewIds(new Set());
      setCompletedInterviewIds(new Set());
      setUserInterviewAnswers({});
      setCompletedMockInterviews(0);
      setActivityLog([]);
      setActivityTimestamps([]);
      return;
    }

    // GUEST MODE:
    // Read only from temporary sessionStorage, NEVER from permanent localStorage
    if (user.isGuest) {
      try {
        const tempRaw = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem(GUEST_TEMP_STORAGE_KEY) : null;
        if (tempRaw) {
          const parsed = JSON.parse(tempRaw);
          setSolvedProblemIds(new Set(parsed.solvedProblemIds || []));
          setAttemptedProblemIds(new Set(parsed.attemptedProblemIds || []));
          setSavedInterviewIds(new Set(parsed.savedInterviewIds || []));
          setCompletedInterviewIds(new Set(parsed.completedInterviewIds || []));
          setUserInterviewAnswers(parsed.userInterviewAnswers || {});
          setCompletedMockInterviews(typeof parsed.completedMockInterviews === 'number' ? parsed.completedMockInterviews : 0);
          setActivityLog(Array.isArray(parsed.activityLog) ? parsed.activityLog : []);
          setActivityTimestamps(Array.isArray(parsed.activityTimestamps) ? parsed.activityTimestamps : []);
        } else {
          setSolvedProblemIds(new Set());
          setAttemptedProblemIds(new Set());
          setSavedInterviewIds(new Set());
          setCompletedInterviewIds(new Set());
          setUserInterviewAnswers({});
          setCompletedMockInterviews(0);
          setActivityLog([]);
          setActivityTimestamps([]);
        }
      } catch {
        // ignore
      }
      return;
    }

    // AUTHENTICATED USERS:
    const userStorageKey = `algorise_progress_v1_${user.id}`;

    try {
      let savedRaw = localStorage.getItem(userStorageKey);
      
      // Migration fallback from un-scoped legacy key if user-scoped key doesn't exist yet
      if (!savedRaw) {
        const legacyRaw = localStorage.getItem(STORAGE_KEY);
        if (legacyRaw) {
          savedRaw = legacyRaw;
          localStorage.setItem(userStorageKey, legacyRaw);
        }
      }

      if (savedRaw) {
        const parsed = JSON.parse(savedRaw);
        setSolvedProblemIds(new Set(parsed.solvedProblemIds || []));
        setAttemptedProblemIds(new Set(parsed.attemptedProblemIds || []));
        setSavedInterviewIds(new Set(parsed.savedInterviewIds || []));
        setCompletedInterviewIds(new Set(parsed.completedInterviewIds || []));
        setUserInterviewAnswers(parsed.userInterviewAnswers || {});
        setCompletedMockInterviews(typeof parsed.completedMockInterviews === 'number' ? parsed.completedMockInterviews : 0);
        setActivityLog(Array.isArray(parsed.activityLog) ? parsed.activityLog : []);
        setActivityTimestamps(Array.isArray(parsed.activityTimestamps) ? parsed.activityTimestamps : []);
      } else {
        setSolvedProblemIds(new Set());
        setAttemptedProblemIds(new Set());
        setSavedInterviewIds(new Set());
        setCompletedInterviewIds(new Set());
        setUserInterviewAnswers({});
        setCompletedMockInterviews(0);
        setActivityLog([]);
        setActivityTimestamps([]);
      }

      // Sync latest server progress if online
      const token = authService.getStoredToken();
      if (token) {
        fetch('/api/user/progress', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
          .then(res => res.ok ? res.json() : null)
          .then(data => {
            if (data && !data.isGuest && data.progress) {
              const p = data.progress;
              if (Array.isArray(p.solvedProblemIds) && p.solvedProblemIds.length > 0) {
                setSolvedProblemIds(prev => new Set([...prev, ...p.solvedProblemIds]));
              }
              if (Array.isArray(p.activityLogs) && p.activityLogs.length > 0) {
                setActivityLog(p.activityLogs);
              }
            }
          })
          .catch(() => {});
      }
    } catch (e) {
      console.warn('Could not parse ALGOrise localStorage state:', e);
    }
  }, [user?.id, user?.isGuest]);

  // Save progress to user-scoped storage (sessionStorage for guests, localStorage + DB for authenticated)
  const persistState = (
    newSolved = solvedProblemIds,
    newAttempted = attemptedProblemIds,
    newSaved = savedInterviewIds,
    newCompleted = completedInterviewIds,
    newAnswers = userInterviewAnswers,
    newMocks = completedMockInterviews,
    newLog = activityLog,
    newStamps = activityTimestamps
  ) => {
    if (!user) return;

    // GUEST USERS:
    // Strictly temporary in sessionStorage only. NEVER save to localStorage or database.
    if (user.isGuest) {
      try {
        if (typeof sessionStorage !== 'undefined') {
          sessionStorage.setItem(GUEST_TEMP_STORAGE_KEY, JSON.stringify({
            solvedProblemIds: Array.from(newSolved),
            attemptedProblemIds: Array.from(newAttempted),
            savedInterviewIds: Array.from(newSaved),
            completedInterviewIds: Array.from(newCompleted),
            userInterviewAnswers: newAnswers,
            completedMockInterviews: newMocks,
            activityLog: newLog,
            activityTimestamps: newStamps
          }));
        }
      } catch (e) {
        // ignore
      }
      return;
    }

    // AUTHENTICATED USERS:
    const userStorageKey = `algorise_progress_v1_${user.id}`;
    const payload = {
      solvedProblemIds: Array.from(newSolved),
      attemptedProblemIds: Array.from(newAttempted),
      savedInterviewIds: Array.from(newSaved),
      completedInterviewIds: Array.from(newCompleted),
      userInterviewAnswers: newAnswers,
      completedMockInterviews: newMocks,
      activityLog: newLog,
      activityTimestamps: newStamps
    };

    try {
      localStorage.setItem(userStorageKey, JSON.stringify(payload));
    } catch (e) {
      console.warn('Could not save ALGOrise localStorage state:', e);
    }

    // Sync to backend database for logged-in users
    const token = authService.getStoredToken();
    if (token) {
      fetch('/api/user/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...payload,
          attemptCount: newAttempted.size,
          streak: calculateStreak(newStamps),
          activityCount: newLog.length
        })
      }).catch(err => {
        console.warn('Backend progress sync failed:', err);
      });
    }
  };

  const calculateStreak = (timestamps: number[]): number => {
    if (!timestamps || timestamps.length === 0) return 0;
    const dayMs = 86400000;
    const uniqueDays = Array.from(new Set(timestamps.map(ts => {
      const d = new Date(ts);
      return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    }))).sort((a, b) => b - a);

    if (uniqueDays.length === 0) return 0;

    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
    const newestDay = uniqueDays[0];

    if (todayStart - newestDay > dayMs) {
      return 0;
    }

    let streak = 0;
    let expectedDay = newestDay;

    for (const day of uniqueDays) {
      if (expectedDay - day > dayMs + 1000) {
        break;
      }
      streak++;
      expectedDay = day - dayMs;
    }

    return streak;
  };

  const currentStreak = calculateStreak(activityTimestamps);

  const addTimestamp = (stamps: number[]) => {
    const now = Date.now();
    return [now, ...stamps.slice(0, 499)];
  };

  const toggleSaveInterview = (id: string) => {
    const updated = new Set(savedInterviewIds);
    if (updated.has(id)) {
      updated.delete(id);
    } else {
      updated.add(id);
    }
    setSavedInterviewIds(updated);
    persistState(solvedProblemIds, attemptedProblemIds, updated, completedInterviewIds, userInterviewAnswers, completedMockInterviews, activityLog, activityTimestamps);
  };

  const toggleCompleteInterview = (id: string) => {
    const updated = new Set(completedInterviewIds);
    if (updated.has(id)) {
      updated.delete(id);
    } else {
      updated.add(id);
    }
    setCompletedInterviewIds(updated);
    persistState(solvedProblemIds, attemptedProblemIds, savedInterviewIds, updated, userInterviewAnswers, completedMockInterviews, activityLog, activityTimestamps);
  };

  const saveUserInterviewAnswer = (id: string, text: string) => {
    const updatedAnswers = { ...userInterviewAnswers, [id]: text };
    setUserInterviewAnswers(updatedAnswers);
    persistState(solvedProblemIds, attemptedProblemIds, savedInterviewIds, completedInterviewIds, updatedAnswers, completedMockInterviews, activityLog, activityTimestamps);
  };

  const incrementMockInterviews = () => {
    const nextCount = completedMockInterviews + 1;
    const nextStamps = addTimestamp(activityTimestamps);
    const newLogItem: ActivityItem = {
      id: `act-${Date.now()}`,
      title: 'Completed Mock Technical Interview',
      subtitle: `Mock interview session #${nextCount} finished`,
      timestamp: Date.now(),
      type: 'learning'
    };
    const nextLog = [newLogItem, ...activityLog.slice(0, 49)];

    setCompletedMockInterviews(nextCount);
    setActivityTimestamps(nextStamps);
    setActivityLog(nextLog);
    persistState(solvedProblemIds, attemptedProblemIds, savedInterviewIds, completedInterviewIds, userInterviewAnswers, nextCount, nextLog, nextStamps);
  };

  const markProblemSolved = (id: string, title?: string) => {
    const nextSolved = new Set(solvedProblemIds).add(id);
    const nextStamps = addTimestamp(activityTimestamps);
    const displayTitle = title || `Problem #${id}`;
    
    // Avoid duplicate log entry if already logged recently
    const newLogItem: ActivityItem = {
      id: `act-${Date.now()}`,
      title: `Accepted Solution: ${displayTitle}`,
      subtitle: 'Passed all compiler test cases',
      timestamp: Date.now(),
      type: 'solved'
    };
    const nextLog = [newLogItem, ...activityLog.slice(0, 49)];

    setSolvedProblemIds(nextSolved);
    setActivityTimestamps(nextStamps);
    setActivityLog(nextLog);
    persistState(nextSolved, attemptedProblemIds, savedInterviewIds, completedInterviewIds, userInterviewAnswers, completedMockInterviews, nextLog, nextStamps);
  };

  const markProblemAttempted = (id: string, title?: string) => {
    const nextAttempted = new Set(attemptedProblemIds).add(id);
    const nextStamps = addTimestamp(activityTimestamps);
    const displayTitle = title || `Problem #${id}`;
    
    const newLogItem: ActivityItem = {
      id: `act-${Date.now()}`,
      title: `Attempted Problem: ${displayTitle}`,
      subtitle: 'Compiler execution recorded',
      timestamp: Date.now(),
      type: 'attempted'
    };
    const nextLog = [newLogItem, ...activityLog.slice(0, 49)];

    setAttemptedProblemIds(nextAttempted);
    setActivityTimestamps(nextStamps);
    setActivityLog(nextLog);
    persistState(solvedProblemIds, nextAttempted, savedInterviewIds, completedInterviewIds, userInterviewAnswers, completedMockInterviews, nextLog, nextStamps);
  };

  const recordLearningActivity = (title: string, subtitle: string) => {
    const nextStamps = addTimestamp(activityTimestamps);
    const newLogItem: ActivityItem = {
      id: `act-${Date.now()}`,
      title,
      subtitle,
      timestamp: Date.now(),
      type: 'learning'
    };
    const nextLog = [newLogItem, ...activityLog.slice(0, 49)];

    setActivityTimestamps(nextStamps);
    setActivityLog(nextLog);
    persistState(solvedProblemIds, attemptedProblemIds, savedInterviewIds, completedInterviewIds, userInterviewAnswers, completedMockInterviews, nextLog, nextStamps);
  };

  return (
    <ProgressContext.Provider
      value={{
        solvedProblemIds,
        attemptedProblemIds,
        savedInterviewIds,
        completedInterviewIds,
        userInterviewAnswers,
        completedMockInterviews,
        activityLog,
        activityTimestamps,
        currentStreak,
        dailyQuestionGoal,
        todaySolvedCount,
        setDailyQuestionGoal,
        toggleSaveInterview,
        toggleCompleteInterview,
        saveUserInterviewAnswer,
        incrementMockInterviews,
        markProblemSolved,
        markProblemAttempted,
        recordLearningActivity
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = (): ProgressContextType => {
  const context = useContext(ProgressContext);
  if (!context) {
    return {
      solvedProblemIds: new Set(),
      attemptedProblemIds: new Set(),
      savedInterviewIds: new Set(),
      completedInterviewIds: new Set(),
      userInterviewAnswers: {},
      completedMockInterviews: 0,
      activityLog: [],
      activityTimestamps: [],
      currentStreak: 0,
      dailyQuestionGoal: 5,
      todaySolvedCount: 0,
      setDailyQuestionGoal: () => {},
      toggleSaveInterview: () => {},
      toggleCompleteInterview: () => {},
      saveUserInterviewAnswer: () => {},
      incrementMockInterviews: () => {},
      markProblemSolved: () => {},
      markProblemAttempted: () => {},
      recordLearningActivity: () => {}
    };
  }
  return context;
};

