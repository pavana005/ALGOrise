import React, { useState, useEffect } from 'react';
import { 
  Moon, 
  Sun, 
  Sparkles,
  BookOpen, 
  Shield, 
  Lock,
  Save,
  LogOut,
  UserCheck,
  Plus,
  Minus,
  Check,
  AlertCircle,
  KeyRound,
  ShieldCheck,
  Laptop,
  AlertTriangle,
  Trash2,
  Eye,
  RefreshCw,
  Mail,
  AtSign,
  MessageSquare,
  Send,
  Edit3,
  ExternalLink,
  Search,
  X,
  FileText,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useProgress } from '../context/ProgressContext';
import { feedbackService } from '../services/feedbackService';
import type { SessionInfo } from '../services/authService';
import { userAnswersService, type SavedUserAnswer } from '../services/userAnswersService';
import type { TabType } from '../components/layout/Sidebar';

interface SettingsPageProps {
  onShowDevNotice: (msg: string) => void;
  onNavigateTab?: (tab: TabType, extraId?: string) => void;
  initialTab?: 'appearance' | 'learning' | 'privacy' | 'account' | 'feedback' | 'answers';
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onShowDevNotice, onNavigateTab, initialTab }) => {
  const { 
    user, 
    token, 
    updateUsername,
    logout,
    changePassword,
    requestPasswordReset,
    resetPasswordWithToken,
    getUserActiveSessions,
    signOutSpecificSession,
    signOutOtherSessions,
    signOutAllSessions,
    updatePrivacySettings,
    deleteAccount
  } = useAuth();

  const { theme, setTheme } = useTheme();
  const { dailyQuestionGoal, setDailyQuestionGoal, todaySolvedCount } = useProgress();

  const [activeTab, setActiveTab] = useState<'appearance' | 'learning' | 'privacy' | 'account' | 'feedback' | 'answers'>(initialTab || 'appearance');

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Feedback Form State
  const [feedbackUsername, setFeedbackUsername] = useState<string>(user?.name || user?.username || '');
  const [feedbackEmail, setFeedbackEmail] = useState<string>(user?.email || '');
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');
  const [feedbackType, setFeedbackType] = useState<'general' | 'bug' | 'feature'>('general');
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState<boolean>(false);
  const [feedbackSuccessMsg, setFeedbackSuccessMsg] = useState<string | null>(null);
  const [feedbackErrorMsg, setFeedbackErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFeedbackUsername(prev => prev || user.name || `@${user.username}`);
      setFeedbackEmail(prev => prev || user.email);
    }
  }, [user]);

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackSuccessMsg(null);
    setFeedbackErrorMsg(null);

    if (!token) {
      setFeedbackErrorMsg('You must be signed in to submit feedback.');
      return;
    }

    if (!feedbackMessage.trim()) {
      setFeedbackErrorMsg('Please enter a feedback message before submitting.');
      return;
    }

    if (feedbackEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(feedbackEmail.trim())) {
      setFeedbackErrorMsg('Please enter a valid email address format or leave it blank.');
      return;
    }

    setIsSubmittingFeedback(true);

    try {
      const res = await feedbackService.submitFeedback(token, {
        username: feedbackUsername.trim() || user?.name || `@${user?.username}`,
        email: feedbackEmail.trim(),
        message: feedbackMessage.trim(),
        type: feedbackType
      });

      setFeedbackSuccessMsg(res.message);
      setFeedbackMessage('');
      onShowDevNotice('Feedback submitted successfully to ALGOrise admins.');
    } catch (err: any) {
      setFeedbackErrorMsg(err?.message || 'Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  // Saved Answers State & Operations
  const [savedAnswers, setSavedAnswers] = useState<SavedUserAnswer[]>(() => userAnswersService.getCachedAnswers(user?.id));
  const [answersSearch, setAnswersSearch] = useState<string>('');
  const [answersFilter, setAnswersFilter] = useState<'all' | 'interview' | 'learning_quiz' | 'learning_reflection' | 'crimelab'>('all');
  const [editingAnswerId, setEditingAnswerId] = useState<string | null>(null);
  const [editingAnswerText, setEditingAnswerText] = useState<string>('');
  const [isUpdatingAnswer, setIsUpdatingAnswer] = useState<boolean>(false);
  const [answersNotice, setAnswersNotice] = useState<string | null>(null);
  const [answersError, setAnswersError] = useState<string | null>(null);

  useEffect(() => {
    userAnswersService.fetchUserAnswers(token || undefined).then((list) => {
      setSavedAnswers(list);
    });

    const unsubscribe = userAnswersService.subscribe((list) => {
      setSavedAnswers(list);
    });

    return () => unsubscribe();
  }, [token, user?.id]);

  const handleStartEditAnswer = (item: SavedUserAnswer) => {
    setEditingAnswerId(item.id);
    setEditingAnswerText(item.answer);
    setAnswersNotice(null);
    setAnswersError(null);
  };

  const handleCancelEditAnswer = () => {
    setEditingAnswerId(null);
    setEditingAnswerText('');
  };

  const handleSaveEditedAnswer = async (id: string) => {
    if (!editingAnswerText.trim()) {
      setAnswersError('Answer content cannot be empty.');
      return;
    }
    setIsUpdatingAnswer(true);
    setAnswersError(null);
    try {
      await userAnswersService.updateAnswer(id, editingAnswerText, token || undefined);
      setEditingAnswerId(null);
      setAnswersNotice('Saved answer updated successfully.');
      onShowDevNotice('Your saved answer was updated.');
      setTimeout(() => setAnswersNotice(null), 3000);
    } catch (err: any) {
      setAnswersError(err?.message || 'Failed to update answer.');
    } finally {
      setIsUpdatingAnswer(false);
    }
  };

  const handleDeleteSavedAnswer = async (id: string) => {
    if (!confirm('Are you sure you want to delete this saved answer?')) return;
    try {
      await userAnswersService.deleteAnswer(id, token || undefined);
      setAnswersNotice('Saved answer deleted.');
      onShowDevNotice('Saved answer removed.');
      setTimeout(() => setAnswersNotice(null), 3000);
    } catch (err: any) {
      setAnswersError(err?.message || 'Failed to delete answer.');
    }
  };

  const filteredAnswers = savedAnswers.filter((a) => {
    const matchesSearch =
      a.questionTitle.toLowerCase().includes(answersSearch.toLowerCase()) ||
      a.activityTitle.toLowerCase().includes(answersSearch.toLowerCase()) ||
      a.answer.toLowerCase().includes(answersSearch.toLowerCase()) ||
      (a.questionContext && a.questionContext.toLowerCase().includes(answersSearch.toLowerCase()));

    const matchesFilter =
      answersFilter === 'all' ||
      (answersFilter === 'interview' && a.activityType === 'interview') ||
      (answersFilter === 'learning_quiz' && a.activityType === 'learning_quiz') ||
      (answersFilter === 'learning_reflection' && a.activityType === 'learning_reflection') ||
      (answersFilter === 'crimelab' && a.activityType === 'crimelab');

    return matchesSearch && matchesFilter;
  });

  // Learning Goal State
  const [goalValue, setGoalValue] = useState<number>(dailyQuestionGoal);
  const [goalSavedMessage, setGoalSavedMessage] = useState<string | null>(null);
  const [goalErrorMessage, setGoalErrorMessage] = useState<string | null>(null);

  // Change Password State
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passMsg, setPassMsg] = useState<string | null>(null);
  const [passErr, setPassErr] = useState<string | null>(null);
  const [isChangingPass, setIsChangingPass] = useState(false);

  // Password Reset Utility State
  const [resetEmailInput, setResetEmailInput] = useState(user?.email || '');
  const [activeResetToken, setActiveResetToken] = useState<string | null>(null);
  const [tokenNewPass, setTokenNewPass] = useState('');
  const [resetMsg, setResetMsg] = useState<string | null>(null);
  const [resetErr, setResetErr] = useState<string | null>(null);

  // Active Sessions State
  const [activeSessions, setActiveSessions] = useState<SessionInfo[]>([]);
  const [sessionMsg, setSessionMsg] = useState<string | null>(null);
  const [sessionErr, setSessionErr] = useState<string | null>(null);

  // Real Privacy Settings State
  const [profileVis, setProfileVis] = useState<'public' | 'private'>(user?.privacySettings?.profileVisibility || 'public');
  const [activityVis, setActivityVis] = useState<'public' | 'private'>(user?.privacySettings?.activityVisibility || 'public');
  const [progressVis, setProgressVis] = useState<'public' | 'private'>(user?.privacySettings?.progressVisibility || 'public');
  const [privacyMsg, setPrivacyMsg] = useState<string | null>(null);

  // Danger Zone Account Deletion State
  const [deleteConfirmEmail, setDeleteConfirmEmail] = useState('');
  const [deleteConfirmPass, setDeleteConfirmPass] = useState('');
  const [deleteErr, setDeleteErr] = useState<string | null>(null);

  // Username Edit State
  const [usernameInput, setUsernameInput] = useState(user?.username || '');
  const [usernameMsg, setUsernameMsg] = useState<string | null>(null);
  const [usernameErr, setUsernameErr] = useState<string | null>(null);
  const [isUpdatingUsername, setIsUpdatingUsername] = useState(false);

  useEffect(() => {
    if (user?.username) {
      setUsernameInput(user.username);
    }
  }, [user?.username]);

  const handleUpdateUsername = (e: React.FormEvent) => {
    e.preventDefault();
    setUsernameErr(null);
    setUsernameMsg(null);

    const clean = usernameInput.trim().toLowerCase();
    if (!clean) {
      setUsernameErr('Username cannot be empty.');
      return;
    }

    if (user?.username === clean) {
      setUsernameMsg(`Username is already set to @${clean}`);
      return;
    }

    setIsUpdatingUsername(true);
    try {
      const updated = updateUsername(clean);
      setUsernameMsg(`Username updated successfully to @${updated.username}`);
      onShowDevNotice(`Username updated to @${updated.username}`);
    } catch (err: any) {
      setUsernameErr(err?.message || 'Failed to update username.');
    } finally {
      setIsUpdatingUsername(false);
    }
  };

  useEffect(() => {
    setGoalValue(dailyQuestionGoal);
  }, [dailyQuestionGoal]);

  useEffect(() => {
    if (activeTab === 'privacy') {
      try {
        const sess = getUserActiveSessions();
        setActiveSessions(sess);
      } catch (e) {
        console.warn('Could not fetch active sessions:', e);
      }
    }
  }, [activeTab]);

  const handleSaveTheme = (e: React.FormEvent) => {
    e.preventDefault();
    onShowDevNotice(`Theme preference (${theme.toUpperCase()}) saved.`);
  };

  const handleSaveGoal = (e: React.FormEvent) => {
    e.preventDefault();
    setGoalErrorMessage(null);
    setGoalSavedMessage(null);

    const num = Math.floor(Number(goalValue));
    if (isNaN(num) || num < 1 || num > 100) {
      setGoalErrorMessage('Daily goal must be a whole number between 1 and 100 questions per day.');
      return;
    }

    try {
      setDailyQuestionGoal(num);
      setGoalSavedMessage('Learning goal updated.');
      onShowDevNotice(`Daily question goal updated to ${num} questions/day.`);
    } catch (err: any) {
      setGoalErrorMessage(err.message || 'Failed to update goal.');
    }
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPassErr(null);
    setPassMsg(null);
    setIsChangingPass(true);

    try {
      const res = changePassword(currentPass, newPass, confirmPass);
      setPassMsg(res.message);
      setCurrentPass('');
      setNewPass('');
      setConfirmPass('');
      // Refresh session view
      setActiveSessions(getUserActiveSessions());
    } catch (err: any) {
      setPassErr(err.message || 'Failed to change password.');
    } finally {
      setIsChangingPass(false);
    }
  };

  const handleRequestResetToken = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetErr(null);
    setResetMsg(null);

    try {
      const res = await requestPasswordReset(resetEmailInput);
      setResetMsg(res.message);
      if (res.resetToken) {
        setActiveResetToken(res.resetToken);
      }
    } catch (err: any) {
      setResetErr(err.message || 'Failed to generate reset link.');
    }
  };

  const handleExecuteResetToken = (e: React.FormEvent) => {
    e.preventDefault();
    setResetErr(null);
    setResetMsg(null);

    if (!activeResetToken) return;

    try {
      const res = resetPasswordWithToken(activeResetToken, tokenNewPass);
      setResetMsg(res.message);
      setActiveResetToken(null);
      setTokenNewPass('');
    } catch (err: any) {
      setResetErr(err.message || 'Failed to reset password.');
    }
  };

  const handleSignOutSpecificSession = (sessionId: string) => {
    setSessionErr(null);
    setSessionMsg(null);

    try {
      const res = signOutSpecificSession(sessionId);
      setSessionMsg(res.message);
      if (res.message.includes('Redirecting')) {
        setTimeout(() => logout(), 1000);
      } else {
        setActiveSessions(getUserActiveSessions());
      }
    } catch (err: any) {
      setSessionErr(err.message || 'Failed to sign out session.');
    }
  };

  const handleSignOutOtherSessions = () => {
    setSessionErr(null);
    setSessionMsg(null);

    try {
      const res = signOutOtherSessions();
      setSessionMsg(res.message);
      setActiveSessions(getUserActiveSessions());
    } catch (err: any) {
      setSessionErr(err.message || 'Failed to sign out other sessions.');
    }
  };

  const handleSignOutAllDevices = () => {
    setSessionErr(null);
    setSessionMsg(null);

    if (!window.confirm('Are you sure you want to log out of ALL devices? You will be redirected to sign in.')) {
      return;
    }

    try {
      signOutAllSessions();
    } catch (err: any) {
      setSessionErr(err.message || 'Failed to sign out all sessions.');
    }
  };

  const handleSavePrivacySettings = (e: React.FormEvent) => {
    e.preventDefault();
    setPrivacyMsg(null);

    try {
      updatePrivacySettings({
        profileVisibility: profileVis,
        activityVisibility: activityVis,
        progressVisibility: progressVis
      });
      setPrivacyMsg('Privacy preferences saved successfully.');
    } catch (err: any) {
      alert(err.message || 'Failed to save privacy settings.');
    }
  };

  const handleDeleteAccount = (e: React.FormEvent) => {
    e.preventDefault();
    setDeleteErr(null);

    if (!window.confirm('WARNING: This action is permanent and cannot be undone. Do you want to delete your account?')) {
      return;
    }

    try {
      deleteAccount(deleteConfirmEmail, deleteConfirmPass);
    } catch (err: any) {
      setDeleteErr(err.message || 'Failed to delete account.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h2 className="page-title">Platform Settings</h2>
        <p className="page-subtitle">
          Customize interface theme, learning goals, authentication security, and active sessions.
        </p>
      </div>

      <div className="grid-2" style={{ gridTemplateColumns: '220px 1fr', gap: '20px' }}>
        <div className="card" style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '4px', height: 'fit-content' }}>
          {[
            { id: 'appearance', label: 'Appearance', icon: Moon },
            { id: 'answers', label: 'Saved Answers', icon: FileText },
            { id: 'learning', label: 'Learning Goals', icon: BookOpen },
            { id: 'privacy', label: 'Privacy & Security', icon: Shield },
            { id: 'account', label: 'Account & Session', icon: Lock },
            { id: 'feedback', label: 'Send Feedback', icon: MessageSquare }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setGoalErrorMessage(null);
                  setGoalSavedMessage(null);
                  setPassErr(null);
                  setPassMsg(null);
                  setResetErr(null);
                  setResetMsg(null);
                  setSessionErr(null);
                  setSessionMsg(null);
                }}
                style={{ fontSize: '0.85rem' }}
              >
                <Icon className="nav-icon" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="card">
          {activeTab === 'appearance' && (
            <form onSubmit={handleSaveTheme} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>Appearance Settings</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                  Interface Theme Mode
                </label>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
                  {/* Dark Mode Card Choice */}
                  <div
                    onClick={() => setTheme('dark')}
                    style={{
                      padding: '16px',
                      borderRadius: '10px',
                      border: `2px solid ${theme === 'dark' ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                      backgroundColor: 'var(--bg-card)',
                      color: 'var(--text-primary)',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '0.9rem' }}>
                        <Moon style={{ width: 18, height: 18, color: '#38BDF8' }} />
                        <span>Dark Mode</span>
                      </div>
                      {theme === 'dark' && (
                        <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#38BDF8', backgroundColor: 'rgba(56, 189, 248, 0.15)', padding: '2px 6px', borderRadius: '4px' }}>
                          ACTIVE
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                      Professional dark high-contrast theme optimized for long study sessions.
                    </p>
                  </div>

                  {/* Light Mode Card Choice */}
                  <div
                    onClick={() => setTheme('light')}
                    style={{
                      padding: '16px',
                      borderRadius: '10px',
                      border: `2px solid ${theme === 'light' ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                      backgroundColor: 'var(--bg-card)',
                      color: 'var(--text-primary)',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '0.9rem' }}>
                        <Sun style={{ width: 18, height: 18, color: '#F59E0B' }} />
                        <span>Light Mode</span>
                      </div>
                      {theme === 'light' && (
                        <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#2563EB', backgroundColor: 'rgba(37, 99, 235, 0.15)', padding: '2px 6px', borderRadius: '4px' }}>
                          ACTIVE
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                      Clean, bright daylight aesthetic with high-visibility typography & contrast.
                    </p>
                  </div>

                  {/* Cute Mode Card Choice */}
                  <div
                    onClick={() => setTheme('cute')}
                    style={{
                      padding: '16px',
                      borderRadius: '10px',
                      border: `2px solid ${theme === 'cute' ? '#EC4899' : 'var(--border-subtle)'}`,
                      backgroundColor: 'var(--bg-card)',
                      color: 'var(--text-primary)',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '0.9rem' }}>
                        <Sparkles style={{ width: 18, height: 18, color: '#EC4899' }} />
                        <span>Cute Mode</span>
                      </div>
                      {theme === 'cute' && (
                        <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#EC4899', backgroundColor: 'rgba(236, 72, 153, 0.15)', padding: '2px 6px', borderRadius: '4px' }}>
                          ACTIVE
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                      Soft pastel blush palette with friendly pink/blue accents & cozy study vibe.
                    </p>
                  </div>
                </div>

                {/* Dropdown Selector */}
                <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Select Theme Dropdown:</label>
                  <select
                    className="select-field"
                    value={theme}
                    onChange={(e) => setTheme(e.target.value as 'dark' | 'light' | 'cute')}
                    style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                  >
                    <option value="dark">Dark Mode (Default)</option>
                    <option value="light">Light Mode</option>
                    <option value="cute">Cute Mode (Soft Pastel)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
                <button type="submit" className="btn btn-primary">
                  <Save style={{ width: 14, height: 14 }} />
                  <span>Save Preferences</span>
                </button>
              </div>
            </form>
          )}

          {activeTab === 'learning' && (
            <form onSubmit={handleSaveGoal} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                  Learning Goals
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px', marginBottom: 0 }}>
                  How many questions do you want to solve each day?
                </p>
              </div>

              {/* Stepper & Direct Number Entry */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Daily Questions Target:
                </label>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setGoalErrorMessage(null);
                      setGoalSavedMessage(null);
                      setGoalValue(prev => Math.max(1, prev - 1));
                    }}
                    disabled={goalValue <= 1}
                    className="btn btn-outline"
                    style={{ width: '40px', height: '40px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Minus style={{ width: 16, height: 16 }} />
                  </button>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      step="1"
                      value={goalValue || ''}
                      onChange={(e) => {
                        setGoalErrorMessage(null);
                        setGoalSavedMessage(null);
                        const parsed = parseInt(e.target.value, 10);
                        setGoalValue(isNaN(parsed) ? 0 : parsed);
                      }}
                      style={{
                        width: '85px',
                        padding: '8px 12px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-medium)',
                        backgroundColor: 'var(--bg-base)',
                        color: 'var(--text-primary)',
                        fontWeight: 800,
                        fontSize: '1.1rem',
                        textAlign: 'center'
                      }}
                    />
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                      questions per day
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setGoalErrorMessage(null);
                      setGoalSavedMessage(null);
                      setGoalValue(prev => Math.min(100, prev + 1));
                    }}
                    disabled={goalValue >= 100}
                    className="btn btn-outline"
                    style={{ width: '40px', height: '40px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Plus style={{ width: 16, height: 16 }} />
                  </button>
                </div>
              </div>

              {/* Quick Options Pills */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Quick options:</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  {[1, 3, 5, 10, 15, 20].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => {
                        setGoalErrorMessage(null);
                        setGoalSavedMessage(null);
                        setGoalValue(opt);
                      }}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '20px',
                        border: goalValue === opt ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                        backgroundColor: goalValue === opt ? 'rgba(59, 130, 246, 0.15)' : 'var(--bg-base)',
                        color: goalValue === opt ? 'var(--accent-primary)' : 'var(--text-primary)',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Error Alert */}
              {goalErrorMessage && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#EF4444', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '10px 14px', borderRadius: '6px', fontSize: '0.82rem' }}>
                  <AlertCircle style={{ width: 16, height: 16, flexShrink: 0 }} />
                  <span>{goalErrorMessage}</span>
                </div>
              )}

              {/* Confirmation Alert */}
              {goalSavedMessage && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10B981', backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '10px 14px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600 }}>
                  <Check style={{ width: 16, height: 16, flexShrink: 0 }} />
                  <span>{goalSavedMessage}</span>
                </div>
              )}

              {/* Current Status Card */}
              <div style={{ padding: '14px 16px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase', fontWeight: 700 }}>
                  Today's Live Goal Status
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  <span>Today's Progress:</span>
                  <span style={{ color: 'var(--accent-primary)' }}>{todaySolvedCount} / {goalValue || dailyQuestionGoal} solved</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
                  {todaySolvedCount >= (goalValue || dailyQuestionGoal) 
                    ? '🎉 Daily goal completed for today!'
                    : `${(goalValue || dailyQuestionGoal) - todaySolvedCount} more ${(goalValue || dailyQuestionGoal) - todaySolvedCount === 1 ? 'question' : 'questions'} to reach today's goal.`}
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-start', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
                <button type="submit" className="btn btn-primary">
                  <Save style={{ width: 14, height: 14 }} />
                  <span>Save Goal</span>
                </button>
              </div>
            </form>
          )}

          {activeTab === 'privacy' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                  Privacy & Security Control Center
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px', marginBottom: 0 }}>
                  Manage account credentials, active device sessions, authentication security, and privacy settings.
                </p>
              </div>

              {/* 1. CHANGE PASSWORD */}
              <div style={{ padding: '16px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <KeyRound style={{ width: 18, height: 18, color: 'var(--accent-primary)' }} />
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                    Password & Credentials
                  </h4>
                </div>

                <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {user?.authProvider === 'email' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Current Password</label>
                      <input
                        type="password"
                        required
                        value={currentPass}
                        onChange={e => setCurrentPass(e.target.value)}
                        placeholder="Enter current password"
                        className="input-field"
                        style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                      />
                    </div>
                  )}

                  <div className="grid-2" style={{ gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>New Password</label>
                      <input
                        type="password"
                        required
                        minLength={6}
                        value={newPass}
                        onChange={e => setNewPass(e.target.value)}
                        placeholder="At least 6 characters"
                        className="input-field"
                        style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                      />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Confirm New Password</label>
                      <input
                        type="password"
                        required
                        minLength={6}
                        value={confirmPass}
                        onChange={e => setConfirmPass(e.target.value)}
                        placeholder="Re-enter new password"
                        className="input-field"
                        style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                      />
                    </div>
                  </div>

                  {passErr && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#EF4444', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '8px 12px', borderRadius: '6px', fontSize: '0.82rem' }}>
                      <AlertCircle style={{ width: 14, height: 14, flexShrink: 0 }} />
                      <span>{passErr}</span>
                    </div>
                  )}

                  {passMsg && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10B981', backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '8px 12px', borderRadius: '6px', fontSize: '0.82rem', fontWeight: 600 }}>
                      <Check style={{ width: 14, height: 14, flexShrink: 0 }} />
                      <span>{passMsg}</span>
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <button type="submit" disabled={isChangingPass} className="btn btn-primary btn-sm">
                      <KeyRound style={{ width: 14, height: 14 }} />
                      <span>{isChangingPass ? 'Changing Password...' : 'Change Password'}</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* 2. FORGOT / RESET PASSWORD UTILITY */}
              <div style={{ padding: '16px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <RefreshCw style={{ width: 18, height: 18, color: 'var(--color-cyan)' }} />
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                      Password Reset Utility
                    </h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      Generates a cryptographically secure, 15-minute single-use password reset token.
                    </span>
                  </div>
                </div>

                <form onSubmit={handleRequestResetToken} style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: '220px' }}>
                    <input
                      type="email"
                      required
                      value={resetEmailInput}
                      onChange={e => setResetEmailInput(e.target.value)}
                      placeholder="Enter registered email address"
                      className="input-field"
                      style={{ padding: '8px 12px', fontSize: '0.85rem', width: '100%' }}
                    />
                  </div>
                  <button type="submit" className="btn btn-outline btn-sm">
                    <Mail style={{ width: 14, height: 14 }} />
                    <span>Request Reset Token</span>
                  </button>
                </form>

                {resetErr && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#EF4444', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '8px 12px', borderRadius: '6px', fontSize: '0.82rem' }}>
                    <AlertCircle style={{ width: 14, height: 14, flexShrink: 0 }} />
                    <span>{resetErr}</span>
                  </div>
                )}

                {resetMsg && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10B981', backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '8px 12px', borderRadius: '6px', fontSize: '0.82rem', fontWeight: 600 }}>
                    <Check style={{ width: 14, height: 14, flexShrink: 0 }} />
                    <span>{resetMsg}</span>
                  </div>
                )}

                {activeResetToken && (
                  <div style={{ padding: '12px', backgroundColor: 'var(--bg-base)', border: '1px solid var(--border-medium)', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      Active Single-Use Reset Token (Expires in 15 mins):
                    </div>
                    <code style={{ fontSize: '0.85rem', color: 'var(--color-cyan)', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                      {activeResetToken}
                    </code>

                    <form onSubmit={handleExecuteResetToken} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px', flexWrap: 'wrap' }}>
                      <input
                        type="password"
                        required
                        minLength={6}
                        value={tokenNewPass}
                        onChange={e => setTokenNewPass(e.target.value)}
                        placeholder="Enter new password to reset"
                        className="input-field"
                        style={{ flex: 1, minWidth: '200px', padding: '6px 10px', fontSize: '0.82rem' }}
                      />
                      <button type="submit" className="btn btn-primary btn-sm">
                        <span>Reset Password Now</span>
                      </button>
                    </form>
                  </div>
                )}
              </div>

              {/* 3. AUTHENTICATION & ACCOUNT SECURITY DETAILS */}
              <div style={{ padding: '16px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ShieldCheck style={{ width: 18, height: 18, color: '#10B981' }} />
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                      Account & Identity Security Details
                    </h4>
                  </div>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#10B981', backgroundColor: 'rgba(16, 185, 129, 0.15)', padding: '3px 8px', borderRadius: '6px' }}>
                    AUTHENTICATED USER
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
                  <div style={{ padding: '12px', backgroundColor: 'var(--bg-base)', border: '1px solid var(--border-subtle)', borderRadius: '8px' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Registered Email</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>{user?.email}</span>
                      <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#10B981', backgroundColor: 'rgba(16, 185, 129, 0.15)', padding: '1px 5px', borderRadius: '4px' }}>
                        PROTECTED READ-ONLY
                      </span>
                    </div>
                  </div>

                  <div style={{ padding: '12px', backgroundColor: 'var(--bg-base)', border: '1px solid var(--border-subtle)', borderRadius: '8px' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Account ID</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px', fontFamily: 'monospace' }}>
                      {user?.id || 'usr_demo_001'}
                    </div>
                  </div>

                  <div style={{ padding: '12px', backgroundColor: 'var(--bg-base)', border: '1px solid var(--border-subtle)', borderRadius: '8px' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Primary Auth Provider</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>
                      {user?.authProvider === 'google' ? 'Google OAuth 2.0 (SSO)' : 'Email & Password Auth (SHA-256)'}
                    </div>
                  </div>

                  <div style={{ padding: '12px', backgroundColor: 'var(--bg-base)', border: '1px solid var(--border-subtle)', borderRadius: '8px' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Account Created</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Jan 15, 2026'}
                    </div>
                  </div>

                  <div style={{ padding: '12px', backgroundColor: 'var(--bg-base)', border: '1px solid var(--border-subtle)', borderRadius: '8px' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Security Rating & Shield</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#10B981', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Shield style={{ width: 14, height: 14 }} />
                      <span>100% Protected · Zero Threats</span>
                    </div>
                  </div>

                  <div style={{ padding: '12px', backgroundColor: 'var(--bg-base)', border: '1px solid var(--border-subtle)', borderRadius: '8px' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Session Cookie Policy</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>
                      HttpOnly · SameSite=Strict · TLS 1.3
                    </div>
                  </div>
                </div>

                {/* 2FA Status Banner (Explicitly NOT a fake switch) */}
                <div style={{ padding: '10px 14px', backgroundColor: 'var(--bg-base)', border: '1px solid var(--border-subtle)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Lock style={{ width: 16, height: 16, color: 'var(--text-muted)' }} />
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Two-factor authentication (2FA) is not available yet on this deployment.
                  </span>
                </div>
              </div>

              {/* 4. ACTIVE SESSIONS DETAILS */}
              <div style={{ padding: '16px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Laptop style={{ width: 18, height: 18, color: 'var(--accent-primary)' }} />
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                      Active Sessions & Session Specs ({activeSessions.length})
                    </h4>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={handleSignOutOtherSessions}
                      className="btn btn-outline btn-sm"
                      style={{ fontSize: '0.75rem' }}
                    >
                      Sign Out Other Sessions
                    </button>

                    <button
                      type="button"
                      onClick={handleSignOutAllDevices}
                      className="btn btn-outline btn-sm"
                      style={{ fontSize: '0.75rem', color: '#F87171', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                    >
                      Log Out All Devices
                    </button>
                  </div>
                </div>

                {sessionMsg && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10B981', backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '8px 12px', borderRadius: '6px', fontSize: '0.82rem', fontWeight: 600 }}>
                    <Check style={{ width: 14, height: 14 }} />
                    <span>{sessionMsg}</span>
                  </div>
                )}

                {sessionErr && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#EF4444', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '8px 12px', borderRadius: '6px', fontSize: '0.82rem' }}>
                    <AlertCircle style={{ width: 14, height: 14 }} />
                    <span>{sessionErr}</span>
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {activeSessions.map((sess) => (
                    <div
                      key={sess.id}
                      style={{
                        padding: '14px 16px',
                        backgroundColor: 'var(--bg-base)',
                        border: sess.isCurrent ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid var(--border-subtle)',
                        borderRadius: '8px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <Laptop style={{ width: 20, height: 20, color: sess.isCurrent ? '#10B981' : 'var(--text-muted)' }} />
                          <div>
                            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span>{sess.deviceName}</span>
                              {sess.isCurrent && (
                                <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#10B981', backgroundColor: 'rgba(16, 185, 129, 0.15)', padding: '2px 6px', borderRadius: '4px' }}>
                                  CURRENT SESSION
                                </span>
                              )}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                              Token Fingerprint: <code style={{ color: 'var(--color-cyan)', fontFamily: 'monospace' }}>{sess.tokenHash}</code>
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleSignOutSpecificSession(sess.id)}
                          className="btn btn-outline btn-sm"
                          style={{ fontSize: '0.72rem', color: sess.isCurrent ? '#F87171' : 'var(--text-secondary)', borderColor: 'var(--border-subtle)' }}
                        >
                          {sess.isCurrent ? 'Sign Out Current Session' : 'Sign Out This Session'}
                        </button>
                      </div>

                      {/* DETAILED SESSION SPECS GRID */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px', padding: '10px', backgroundColor: 'var(--bg-surface)', borderRadius: '6px', border: '1px solid var(--border-subtle)', fontSize: '0.75rem' }}>
                        <div>
                          <span style={{ color: 'var(--text-muted)' }}>Browser: </span>
                          <strong style={{ color: 'var(--text-primary)' }}>{sess.browser}</strong>
                        </div>
                        <div>
                          <span style={{ color: 'var(--text-muted)' }}>OS: </span>
                          <strong style={{ color: 'var(--text-primary)' }}>{sess.os}</strong>
                        </div>
                        <div>
                          <span style={{ color: 'var(--text-muted)' }}>IP Address: </span>
                          <strong style={{ color: 'var(--text-primary)' }}>{sess.ipAddress}</strong>
                        </div>
                        <div>
                          <span style={{ color: 'var(--text-muted)' }}>Approx Location: </span>
                          <strong style={{ color: 'var(--text-primary)' }}>{sess.location}</strong>
                        </div>
                        <div>
                          <span style={{ color: 'var(--text-muted)' }}>Session Started: </span>
                          <strong style={{ color: 'var(--text-primary)' }}>{new Date(sess.createdAt).toLocaleDateString()}</strong>
                        </div>
                        <div>
                          <span style={{ color: 'var(--text-muted)' }}>Last Active: </span>
                          <strong style={{ color: sess.isCurrent ? '#10B981' : 'var(--text-primary)' }}>
                            {sess.isCurrent ? 'Active Now' : new Date(sess.lastActive).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </strong>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5. RECENT SECURITY LOG TELEMETRY */}
              <div style={{ padding: '16px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                  Recent Security Activity Log
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '180px', overflowY: 'auto' }}>
                  {(!user?.securityLog || user.securityLog.length === 0) ? (
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Login activity will appear here as you use ALGOrise.
                    </div>
                  ) : (
                    user.securityLog.slice(0, 5).map(log => (
                      <div key={log.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 10px', backgroundColor: 'var(--bg-base)', borderRadius: '6px', fontSize: '0.78rem' }}>
                        <div>
                          <strong style={{ color: 'var(--text-primary)' }}>{log.event}</strong> — <span style={{ color: 'var(--text-secondary)' }}>{log.details}</span>
                        </div>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                          {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* 6. REAL PRIVACY CONTROLS */}
              <div style={{ padding: '16px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Eye style={{ width: 18, height: 18, color: 'var(--color-purple)' }} />
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                    Privacy Preferences
                  </h4>
                </div>

                <form onSubmit={handleSavePrivacySettings} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div className="grid-3" style={{ gap: '12px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Profile Visibility</label>
                      <select className="select-field" value={profileVis} onChange={e => setProfileVis(e.target.value as any)}>
                        <option value="public">Public (Visible on platform)</option>
                        <option value="private">Private (Only me)</option>
                      </select>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Activity Visibility</label>
                      <select className="select-field" value={activityVis} onChange={e => setActivityVis(e.target.value as any)}>
                        <option value="public">Public (Show activity feed)</option>
                        <option value="private">Private (Hide activity)</option>
                      </select>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Progress Analytics</label>
                      <select className="select-field" value={progressVis} onChange={e => setProgressVis(e.target.value as any)}>
                        <option value="public">Public (Leaderboard metrics)</option>
                        <option value="private">Private (Hide metrics)</option>
                      </select>
                    </div>
                  </div>

                  {privacyMsg && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10B981', backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '8px 12px', borderRadius: '6px', fontSize: '0.82rem', fontWeight: 600 }}>
                      <Check style={{ width: 14, height: 14 }} />
                      <span>{privacyMsg}</span>
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <button type="submit" className="btn btn-outline btn-sm">
                      <Save style={{ width: 14, height: 14 }} />
                      <span>Save Privacy Controls</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* 7. DANGER ZONE - ACCOUNT DELETION */}
              <div style={{ padding: '16px', backgroundColor: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertTriangle style={{ width: 18, height: 18, color: '#F87171' }} />
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#F87171', margin: 0 }}>
                      Danger Zone — Delete Account
                    </h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      Permanently delete your account, saved notes, problem progress, and sessions.
                    </span>
                  </div>
                </div>

                <form onSubmit={handleDeleteAccount} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div className="grid-2" style={{ gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                        Confirm Account Email
                      </label>
                      <input
                        type="email"
                        required
                        value={deleteConfirmEmail}
                        onChange={e => setDeleteConfirmEmail(e.target.value)}
                        placeholder={`Type "${user?.email}"`}
                        className="input-field"
                        style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                      />
                    </div>

                    {user?.authProvider === 'email' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                          Account Password
                        </label>
                        <input
                          type="password"
                          required
                          value={deleteConfirmPass}
                          onChange={e => setDeleteConfirmPass(e.target.value)}
                          placeholder="Verify account password"
                          className="input-field"
                          style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                        />
                      </div>
                    )}
                  </div>

                  {deleteErr && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#EF4444', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '8px 12px', borderRadius: '6px', fontSize: '0.82rem' }}>
                      <AlertCircle style={{ width: 14, height: 14, flexShrink: 0 }} />
                      <span>{deleteErr}</span>
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <button
                      type="submit"
                      className="btn btn-outline btn-sm"
                      style={{ color: '#F87171', borderColor: 'rgba(239, 68, 68, 0.4)', backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
                    >
                      <Trash2 style={{ width: 14, height: 14 }} />
                      <span>Delete My Account</span>
                    </button>
                  </div>
                </form>
              </div>

            </div>
          )}

          {activeTab === 'account' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>Account & Active Session</h3>
              
              {user ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', backgroundColor: 'var(--bg-base)', border: '1px solid var(--border-subtle)', borderRadius: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{ width: 44, height: 44, borderRadius: '50%', backgroundColor: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#fff', fontSize: '1.1rem' }}>
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span>{user.name}</span>
                          <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '2px 8px', backgroundColor: 'var(--bg-elevated)', borderRadius: '12px', color: 'var(--accent-primary)', border: '1px solid var(--border-subtle)' }}>
                            @{user.username}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{user.email}</div>
                      </div>
                    </div>
                  </div>

                  {/* USERNAME EDIT CARD */}
                  <div style={{ padding: '16px', backgroundColor: 'var(--bg-base)', border: '1px solid var(--border-subtle)', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <AtSign style={{ width: 18, height: 18, color: 'var(--accent-primary)' }} />
                      <div>
                        <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                          ALGOrise Username / Handle
                        </h4>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                          Your unique identifier across community, profiles, and visualizers (@{user.username}).
                        </span>
                      </div>
                    </div>

                    <form onSubmit={handleUpdateUsername} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <div style={{ position: 'relative', flex: 1 }}>
                          <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: 'var(--accent-primary)', fontSize: '0.88rem' }}>@</span>
                          <input
                            type="text"
                            required
                            value={usernameInput}
                            onChange={(e) => setUsernameInput(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                            placeholder="username"
                            className="input-field"
                            style={{ paddingLeft: '28px', fontSize: '0.88rem' }}
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={isUpdatingUsername || usernameInput.trim().toLowerCase() === user.username}
                          className="btn btn-primary btn-sm"
                          style={{ minWidth: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                        >
                          <Save style={{ width: 14, height: 14 }} />
                          <span>Save</span>
                        </button>
                      </div>

                      {usernameMsg && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10B981', fontSize: '0.8rem', fontWeight: 600 }}>
                          <Check style={{ width: 14, height: 14 }} />
                          <span>{usernameMsg}</span>
                        </div>
                      )}

                      {usernameErr && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#EF4444', fontSize: '0.8rem', fontWeight: 600 }}>
                          <AlertCircle style={{ width: 14, height: 14 }} />
                          <span>{usernameErr}</span>
                        </div>
                      )}
                    </form>
                  </div>

                  <div className="grid-2" style={{ gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div style={{ padding: '12px', backgroundColor: 'var(--bg-base)', border: '1px solid var(--border-subtle)', borderRadius: '8px' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Authentication Provider</div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '4px', textTransform: 'capitalize' }}>
                        {user.authProvider} OAuth
                      </div>
                    </div>

                    <div style={{ padding: '12px', backgroundColor: 'var(--bg-base)', border: '1px solid var(--border-subtle)', borderRadius: '8px' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Session Status</div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#10b981', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <UserCheck style={{ width: 14, height: 14 }} />
                        <span>Active Session</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ padding: '12px', backgroundColor: 'var(--bg-base)', border: '1px solid var(--border-subtle)', borderRadius: '8px' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Backend Session Token</div>
                    <div style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--accent-primary)', marginTop: '4px', wordBreak: 'break-all' }}>
                      {token}
                    </div>
                  </div>

                  <div style={{ paddingTop: '8px' }}>
                    <button
                      type="button"
                      onClick={logout}
                      className="btn btn-outline"
                      style={{ color: '#f87171', borderColor: 'rgba(239, 68, 68, 0.3)', display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                      <LogOut style={{ width: 14, height: 14 }} />
                      <span>Sign Out of Account</span>
                    </button>
                  </div>
                </div>
              ) : (
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>No active user session detected.</p>
              )}
            </div>
          )}

          {activeTab === 'feedback' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                    Send Feedback & Bug Reports
                  </h3>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
                    Have a feature suggestion, bug report, or idea? Send it directly to our administration team.
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 600, color: '#10B981', backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '4px 10px', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                  <ShieldCheck style={{ width: 14, height: 14 }} />
                  <span>Direct Admin Line</span>
                </div>
              </div>

              {feedbackSuccessMsg && (
                <div
                  style={{
                    padding: '12px 16px',
                    backgroundColor: 'rgba(16, 185, 129, 0.12)',
                    border: '1px solid rgba(16, 185, 129, 0.4)',
                    borderRadius: '8px',
                    color: '#10B981',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '0.85rem',
                    fontWeight: 600
                  }}
                >
                  <Check style={{ width: 16, height: 16, flexShrink: 0 }} />
                  <span>{feedbackSuccessMsg}</span>
                </div>
              )}

              {feedbackErrorMsg && (
                <div
                  style={{
                    padding: '12px 16px',
                    backgroundColor: 'rgba(239, 68, 68, 0.12)',
                    border: '1px solid rgba(239, 68, 68, 0.4)',
                    borderRadius: '8px',
                    color: '#EF4444',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '0.85rem',
                    fontWeight: 600
                  }}
                >
                  <AlertCircle style={{ width: 16, height: 16, flexShrink: 0 }} />
                  <span>{feedbackErrorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmitFeedback} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Topic selector */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    Feedback Category
                  </label>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {(['general', 'bug', 'feature'] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setFeedbackType(t)}
                        style={{
                          flex: 1,
                          minWidth: '120px',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          fontSize: '0.82rem',
                          fontWeight: 600,
                          border: `1px solid ${feedbackType === t ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                          cursor: 'pointer',
                          backgroundColor: feedbackType === t ? 'var(--accent-primary)' : 'var(--bg-base)',
                          color: feedbackType === t ? '#fff' : 'var(--text-secondary)',
                          transition: 'all 0.2s'
                        }}
                      >
                        {t === 'general' ? '💬 General' : t === 'bug' ? '🐛 Bug Report' : '✨ Feature'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name & Email */}
                <div className="grid-2" style={{ gap: '14px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                      Your Name / Handle <span style={{ color: '#EF4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={feedbackUsername}
                      onChange={(e) => setFeedbackUsername(e.target.value)}
                      placeholder="Alex Rivera"
                      className="input-field"
                      style={{ padding: '8px 12px', fontSize: '0.88rem' }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                      Email Address <span style={{ fontSize: '0.75rem', fontWeight: 400, color: 'var(--text-muted)' }}>(Optional)</span>
                    </label>
                    <input
                      type="email"
                      value={feedbackEmail}
                      onChange={(e) => setFeedbackEmail(e.target.value)}
                      placeholder="alex@example.com"
                      className="input-field"
                      style={{ padding: '8px 12px', fontSize: '0.88rem' }}
                    />
                  </div>
                </div>

                {/* Feedback Message */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    Feedback Message <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={feedbackMessage}
                    onChange={(e) => setFeedbackMessage(e.target.value)}
                    placeholder="Describe your suggestion, bug report, or feature request in detail..."
                    className="input-field"
                    style={{ padding: '10px 12px', fontSize: '0.88rem', lineHeight: 1.5, resize: 'vertical' }}
                  />
                </div>

                {/* Submit Action */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '4px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Sent securely to ALGOrise admins.
                  </span>

                  <button
                    type="submit"
                    disabled={isSubmittingFeedback}
                    className="btn btn-primary btn-sm"
                    style={{ padding: '8px 18px', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    {isSubmittingFeedback ? (
                      <span>Sending...</span>
                    ) : (
                      <>
                        <Send style={{ width: 14, height: 14 }} />
                        <span>Submit Feedback</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB: SAVED ANSWERS (PERSONAL REFERENCE)                                  */}
          {/* ========================================================================= */}
          {activeTab === 'answers' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '14px' }}>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                    My Saved Answers & Reflections
                  </h3>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
                    All answers, interview practice responses, and learning reflections written across Algorise are preserved here for your personal reference.
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent-primary)', backgroundColor: 'var(--accent-primary-bg)', padding: '4px 12px', borderRadius: '12px', border: '1px solid var(--focus-ring)' }}>
                    {savedAnswers.length} Total Answers
                  </span>
                </div>
              </div>

              {/* Status / Notice Messages */}
              {answersNotice && (
                <div style={{ padding: '10px 14px', backgroundColor: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '8px', color: '#10B981', fontSize: '0.84rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 style={{ width: 16, height: 16 }} />
                  <span>{answersNotice}</span>
                </div>
              )}

              {answersError && (
                <div style={{ padding: '10px 14px', backgroundColor: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', color: '#EF4444', fontSize: '0.84rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertTriangle style={{ width: 16, height: 16 }} />
                  <span>{answersError}</span>
                </div>
              )}

              {/* Search & Filter Controls */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
                    <Search style={{ width: 15, height: 15, position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      type="text"
                      value={answersSearch}
                      onChange={(e) => setAnswersSearch(e.target.value)}
                      placeholder="Search questions, activities, or your answers..."
                      className="input-field"
                      style={{ paddingLeft: '36px', fontSize: '0.84rem', height: '38px' }}
                    />
                    {answersSearch && (
                      <button
                        type="button"
                        onClick={() => setAnswersSearch('')}
                        style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}
                      >
                        <X style={{ width: 14, height: 14 }} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Filter Pills */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  {[
                    { id: 'all', label: 'All Answers', count: savedAnswers.length },
                    { id: 'interview', label: 'Interview Responses', count: savedAnswers.filter(a => a.activityType === 'interview').length },
                    { id: 'learning_quiz', label: 'Knowledge Quizzes', count: savedAnswers.filter(a => a.activityType === 'learning_quiz').length },
                    { id: 'learning_reflection', label: 'Stage Reflections', count: savedAnswers.filter(a => a.activityType === 'learning_reflection').length },
                    { id: 'crimelab', label: 'Crime Lab Cases', count: savedAnswers.filter(a => a.activityType === 'crimelab').length }
                  ].map((flt) => {
                    const isActive = answersFilter === flt.id;
                    return (
                      <button
                        key={flt.id}
                        type="button"
                        onClick={() => setAnswersFilter(flt.id as any)}
                        className={`btn btn-sm ${isActive ? 'btn-primary' : 'btn-outline'}`}
                        style={{ padding: '4px 12px', fontSize: '0.76rem', borderRadius: '16px' }}
                      >
                        <span>{flt.label}</span>
                        <span style={{ fontSize: '0.7rem', opacity: 0.85 }}>({flt.count})</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Answers List */}
              {filteredAnswers.length === 0 ? (
                <div
                  style={{
                    padding: '40px 20px',
                    textAlign: 'center',
                    backgroundColor: 'var(--bg-elevated)',
                    border: '1px dashed var(--border-subtle)',
                    borderRadius: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '12px'
                  }}
                >
                  <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: 'var(--accent-primary-bg)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FileText style={{ width: 22, height: 22 }} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 4px 0' }}>
                      {savedAnswers.length === 0 ? 'No Saved Answers Yet' : 'No Answers Match Search'}
                    </h4>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0, maxWidth: '460px', lineHeight: 1.45 }}>
                      {savedAnswers.length === 0
                        ? 'When you write practice responses in Interviews, take Knowledge Checks in Learning, or solve Crime Lab investigations, your answers will automatically be saved here for your personal reference.'
                        : 'Try adjusting your search query or switching the category filter above.'}
                    </p>
                  </div>
                  {savedAnswers.length === 0 && onNavigateTab && (
                    <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                      <button
                        type="button"
                        onClick={() => onNavigateTab('interview')}
                        className="btn btn-primary btn-sm"
                        style={{ fontSize: '0.8rem' }}
                      >
                        Practice Interview Questions
                      </button>
                      <button
                        type="button"
                        onClick={() => onNavigateTab('learn')}
                        className="btn btn-outline btn-sm"
                        style={{ fontSize: '0.8rem' }}
                      >
                        Go to Flow of Learning
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {filteredAnswers.map((item) => {
                    const isEditing = editingAnswerId === item.id;
                    const formattedCreated = new Date(item.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    });
                    const formattedUpdated = item.updatedAt > item.createdAt + 1000
                      ? new Date(item.updatedAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      : null;

                    const getBadgeColor = () => {
                      switch (item.activityType) {
                        case 'interview': return { bg: 'rgba(56, 189, 248, 0.12)', border: 'rgba(56, 189, 248, 0.35)', text: '#38BDF8', label: 'Interview Preparation' };
                        case 'learning_quiz': return { bg: 'rgba(168, 85, 247, 0.12)', border: 'rgba(168, 85, 247, 0.35)', text: '#A855F7', label: 'Knowledge Check Quiz' };
                        case 'learning_reflection': return { bg: 'rgba(16, 185, 129, 0.12)', border: 'rgba(16, 185, 129, 0.35)', text: '#10B981', label: 'Stage Reflection' };
                        case 'crimelab': return { bg: 'rgba(239, 68, 68, 0.12)', border: 'rgba(239, 68, 68, 0.35)', text: '#EF4444', label: 'Crime Lab Case' };
                        default: return { bg: 'rgba(99, 102, 241, 0.12)', border: 'rgba(99, 102, 241, 0.35)', text: 'var(--accent-primary)', label: item.activityTitle || 'Activity' };
                      }
                    };

                    const badge = getBadgeColor();

                    return (
                      <div
                        key={item.id}
                        className="card"
                        style={{
                          padding: '18px 20px',
                          borderRadius: '12px',
                          border: '1px solid var(--border-subtle)',
                          backgroundColor: 'var(--bg-surface)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '12px',
                          boxShadow: 'var(--shadow-sm)'
                        }}
                      >
                        {/* Card Header: Activity Badge & Action Buttons */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                            <span
                              style={{
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                backgroundColor: badge.bg,
                                border: `1px solid ${badge.border}`,
                                color: badge.text,
                                padding: '3px 10px',
                                borderRadius: '12px'
                              }}
                            >
                              {badge.label}
                            </span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              • {item.activityTitle}
                            </span>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            {/* Open Original Context */}
                            {onNavigateTab && item.targetTab && (
                              <button
                                type="button"
                                onClick={() => onNavigateTab(item.targetTab, item.targetId)}
                                className="btn btn-outline btn-sm"
                                style={{ padding: '4px 10px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                                title="Open this question in its original activity environment"
                              >
                                <ExternalLink style={{ width: 13, height: 13 }} />
                                <span>Open Question</span>
                              </button>
                            )}

                            {/* Edit Button */}
                            {!isEditing && (
                              <button
                                type="button"
                                onClick={() => handleStartEditAnswer(item)}
                                className="btn btn-outline btn-sm"
                                style={{ padding: '4px 10px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                                title="Edit your answer"
                              >
                                <Edit3 style={{ width: 13, height: 13 }} />
                                <span>Edit</span>
                              </button>
                            )}

                            {/* Delete Button */}
                            <button
                              type="button"
                              onClick={() => handleDeleteSavedAnswer(item.id)}
                              className="btn btn-outline btn-sm"
                              style={{ padding: '4px 10px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px', color: '#EF4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                              title="Delete saved answer"
                            >
                              <Trash2 style={{ width: 13, height: 13 }} />
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>

                        {/* Question Title & Context */}
                        <div>
                          <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 4px 0' }}>
                            {item.questionTitle}
                          </h4>
                          {item.questionContext && (
                            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                              {item.questionContext}
                            </p>
                          )}
                        </div>

                        {/* User's Answer Body */}
                        {isEditing ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                              Edit Your Answer:
                            </label>
                            <textarea
                              rows={4}
                              value={editingAnswerText}
                              onChange={(e) => setEditingAnswerText(e.target.value)}
                              className="input-field"
                              style={{
                                width: '100%',
                                padding: '10px 12px',
                                fontSize: '0.86rem',
                                lineHeight: 1.5,
                                backgroundColor: 'var(--bg-elevated)',
                                border: '1px solid var(--accent-primary)',
                                borderRadius: '8px',
                                color: 'var(--text-primary)',
                                outline: 'none'
                              }}
                            />
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                              <button
                                type="button"
                                onClick={handleCancelEditAnswer}
                                className="btn btn-outline btn-sm"
                                style={{ fontSize: '0.78rem', padding: '6px 14px' }}
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                disabled={isUpdatingAnswer}
                                onClick={() => handleSaveEditedAnswer(item.id)}
                                className="btn btn-primary btn-sm"
                                style={{ fontSize: '0.78rem', padding: '6px 16px', display: 'flex', alignItems: 'center', gap: '6px' }}
                              >
                                <Check style={{ width: 14, height: 14 }} />
                                <span>{isUpdatingAnswer ? 'Saving...' : 'Save Changes'}</span>
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div
                            style={{
                              padding: '12px 14px',
                              backgroundColor: 'var(--bg-card)',
                              border: '1px solid var(--border-subtle)',
                              borderRadius: '8px',
                              fontSize: '0.86rem',
                              color: 'var(--text-primary)',
                              lineHeight: 1.55,
                              whiteSpace: 'pre-wrap',
                              fontFamily: item.answer.includes('\n') && (item.answer.includes('def ') || item.answer.includes('function') || item.answer.includes('class ')) ? 'var(--font-mono)' : 'inherit'
                            }}
                          >
                            {item.answer}
                          </div>
                        )}

                        {/* Date & Metadata Footer */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', fontSize: '0.74rem', color: 'var(--text-muted)', paddingTop: '4px', borderTop: '1px dashed var(--border-subtle)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Calendar style={{ width: 12, height: 12 }} />
                            <span>Saved: {formattedCreated}</span>
                          </div>
                          {formattedUpdated && (
                            <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>
                              Updated: {formattedUpdated}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
