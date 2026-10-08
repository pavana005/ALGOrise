import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import type { User, Session, PrivacySettings, SessionInfo } from '../services/authService';
import { triggerMotivationPopup } from '../components/common/MotivationPopup';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  isLoading: boolean;
  login: (emailOrUsername: string, password: string) => Promise<Session>;
  signup: (name: string, username: string, email: string, password: string) => Promise<Session>;
  loginWithGoogle: (customUsername?: string) => Promise<Session>;
  loginAsGuest: () => Promise<Session>;
  checkUsernameAvailability: (username: string) => { available: boolean; message: string; reason: 'invalid_format' | 'taken' | 'available' };
  updateUsername: (newUsername: string) => User;
  logout: () => void;
  updateDailyQuestionGoal: (goal: number) => User;
  changePassword: (currentPass: string, newPass: string, confirmPass: string) => { success: boolean; message: string };
  requestPasswordReset: (email: string) => Promise<{ success: boolean; resetToken?: string; message: string }>;
  resetPasswordWithToken: (resetToken: string, newPassword: string) => { success: boolean; message: string };
  getUserActiveSessions: () => SessionInfo[];
  signOutSpecificSession: (sessionId: string) => { success: boolean; message: string };
  signOutOtherSessions: () => { success: boolean; message: string };
  signOutAllSessions: () => { success: boolean; message: string };
  updatePrivacySettings: (settings: PrivacySettings) => User;
  deleteAccount: (confirmationEmail: string, password?: string) => { success: boolean; message: string };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshUserSession = async () => {
    const storedToken = authService.getStoredToken();
    if (!storedToken) {
      setUser(null);
      setToken(null);
      return;
    }

    try {
      if (typeof window !== 'undefined' && typeof window.fetch === 'function') {
        const res = await fetch('/api/auth/me', {
          headers: { 'Authorization': `Bearer ${storedToken}` }
        });
        if (res.ok) {
          const data = await res.json();
          setUser({ ...data.user, isGuest: !!data.isGuest });
          setToken(storedToken);
          return;
        } else if (res.status === 401 || res.status === 403) {
          authService.logout();
          setUser(null);
          setToken(null);
          return;
        }
      }
    } catch {
      // offline fallback
    }

    const validUser = authService.validateSessionToken(storedToken);
    setUser(validUser);
    setToken(validUser ? storedToken : null);
  };

  useEffect(() => {
    // Validate session on boot / page refresh
    refreshUserSession().finally(() => {
      setIsLoading(false);
    });
  }, []);

  const login = async (emailOrUsername: string, password: string): Promise<Session> => {
    setIsLoading(true);
    try {
      const session = await authService.login(emailOrUsername, password);
      setUser(session.user);
      setToken(session.token);
      setTimeout(() => {
        triggerMotivationPopup('LOGIN', true, { username: session.user.name });
      }, 1000);
      return session;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, username: string, email: string, password: string): Promise<Session> => {
    setIsLoading(true);
    try {
      const session = await authService.signup(name, username, email, password);
      setUser(session.user);
      setToken(session.token);
      setTimeout(() => {
        triggerMotivationPopup('LOGIN', true, { username: session.user.name });
      }, 1000);
      return session;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async (customUsername?: string): Promise<Session> => {
    setIsLoading(true);
    try {
      const session = await authService.loginWithGoogle(customUsername);
      setUser(session.user);
      setToken(session.token);
      setTimeout(() => {
        triggerMotivationPopup('LOGIN', true, { username: session.user.name });
      }, 1000);
      return session;
    } finally {
      setIsLoading(false);
    }
  };

  const loginAsGuest = async (): Promise<Session> => {
    setIsLoading(true);
    try {
      const session = await authService.loginAsGuest();
      setUser(session.user);
      setToken(session.token);
      setTimeout(() => {
        triggerMotivationPopup('LOGIN', true, { username: 'Guest' });
      }, 1000);
      return session;
    } finally {
      setIsLoading(false);
    }
  };

  const checkUsernameAvailability = (username: string) => {
    return authService.checkUsernameAvailability(username);
  };

  const updateUsername = (newUsername: string): User => {
    const updatedUser = authService.updateUsername(token, newUsername);
    setUser(updatedUser);
    return updatedUser;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
  };

  const updateDailyQuestionGoal = (goal: number): User => {
    const updatedUser = authService.updateDailyGoal(token, goal);
    setUser(updatedUser);
    return updatedUser;
  };

  const changePassword = (currentPass: string, newPass: string, confirmPass: string) => {
    const result = authService.changePassword(token, currentPass, newPass, confirmPass);
    refreshUserSession();
    return result;
  };

  const requestPasswordReset = async (email: string) => {
    return await authService.requestPasswordReset(email);
  };

  const resetPasswordWithToken = (resetToken: string, newPassword: string) => {
    const result = authService.resetPasswordWithToken(resetToken, newPassword);
    refreshUserSession();
    return result;
  };

  const getUserActiveSessions = (): SessionInfo[] => {
    return authService.getUserActiveSessions(token);
  };

  const signOutSpecificSession = (sessionId: string) => {
    const result = authService.signOutSpecificSession(token, sessionId);
    refreshUserSession();
    return result;
  };

  const signOutOtherSessions = () => {
    const result = authService.signOutOtherSessions(token);
    refreshUserSession();
    return result;
  };

  const signOutAllSessions = () => {
    const result = authService.signOutAllSessions(token);
    setUser(null);
    setToken(null);
    return result;
  };

  const updatePrivacySettings = (settings: PrivacySettings): User => {
    const updatedUser = authService.updatePrivacySettings(token, settings);
    setUser(updatedUser);
    return updatedUser;
  };

  const deleteAccount = (confirmationEmail: string, password?: string) => {
    const result = authService.deleteAccount(token, confirmationEmail, password);
    setUser(null);
    setToken(null);
    return result;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isGuest: !!user?.isGuest,
        isLoading,
        login,
        signup,
        loginWithGoogle,
        loginAsGuest,
        checkUsernameAvailability,
        updateUsername,
        logout,
        updateDailyQuestionGoal,
        changePassword,
        requestPasswordReset,
        resetPasswordWithToken,
        getUserActiveSessions,
        signOutSpecificSession,
        signOutOtherSessions,
        signOutAllSessions,
        updatePrivacySettings,
        deleteAccount
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
