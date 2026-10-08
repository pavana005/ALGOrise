import React, { useState, useEffect } from 'react';
import { authService, type User } from '../../../services/authService';
import { useAuth } from '../../../context/AuthContext';
import { problemsData } from '../../../data/problemsData';
import {
  Shield,
  UserCheck,
  UserX,
  Trash2,
  Edit2,
  Eye,
  RotateCcw,
  Search,
  Flame,
  User as UserIcon,
  Lock,
  RefreshCw,
  X,
  AlertTriangle,
  Check
} from 'lucide-react';
import { Badge } from '../../common/Badge';

interface AdminUsersViewProps {
  searchQuery: string;
  onShowDevNotice: (msg: string) => void;
}

export const AdminUsersView: React.FC<AdminUsersViewProps> = ({ searchQuery: externalSearch, onShowDevNotice }) => {
  const { token, user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>(() => authService.getAllUsers(token));
  const [internalSearch, setInternalSearch] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'admin' | 'user'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'disabled'>('all');
  const [filterProvider, setFilterProvider] = useState<'all' | 'email' | 'google'>('all');

  // Modals state
  const [inspectingUser, setInspectingUser] = useState<User | null>(null);
  const [inspectDetails, setInspectDetails] = useState<{ progress: any; feedback: any[] } | null>(null);
  const [inspectTab, setInspectTab] = useState<'account' | 'progress' | 'feedback'>('account');
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editFormData, setEditFormData] = useState<{
    name: string;
    username: string;
    email: string;
    role: 'admin' | 'user';
    status: 'active' | 'disabled';
    dailyQuestionGoal: number;
    profileVisibility: 'public' | 'private';
    activityVisibility: 'public' | 'private';
    progressVisibility: 'public' | 'private';
  }>({
    name: '',
    username: '',
    email: '',
    role: 'user',
    status: 'active',
    dailyQuestionGoal: 5,
    profileVisibility: 'public',
    activityVisibility: 'public',
    progressVisibility: 'public'
  });
  const [editError, setEditError] = useState<string | null>(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  const [resettingUser, setResettingUser] = useState<User | null>(null);
  const [resetType, setResetType] = useState<'progress' | 'streak' | 'stages' | 'sessions' | 'all'>('progress');
  const [isResetting, setIsResetting] = useState(false);

  // Sync users from backend API
  const refreshUsers = async () => {
    try {
      const data = await authService.getAllUsersAsync(token);
      setUsers(data);
    } catch {
      setUsers(authService.getAllUsers(token));
    }
  };

  useEffect(() => {
    refreshUsers();
  }, [token]);

  // Load deep user progress & feedback details on inspect
  const handleOpenInspect = async (user: User) => {
    setInspectingUser(user);
    setInspectTab('account');
    setIsLoadingDetails(true);
    try {
      const details = await authService.getUserDetailsAsync(token, user.id);
      setInspectDetails({
        progress: details.progress,
        feedback: details.feedback
      });
    } catch {
      setInspectDetails({
        progress: { solvedProblemIds: [], attemptedProblemIds: [], streak: 0, completedStages: [], activityLog: [] },
        feedback: []
      });
    } finally {
      setIsLoadingDetails(false);
    }
  };

  // Open Edit User modal
  const handleOpenEdit = (user: User) => {
    setEditingUser(user);
    setEditError(null);
    setEditFormData({
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
      status: user.status,
      dailyQuestionGoal: user.dailyQuestionGoal ?? 5,
      profileVisibility: user.privacySettings?.profileVisibility || 'public',
      activityVisibility: user.privacySettings?.activityVisibility || 'public',
      progressVisibility: user.privacySettings?.progressVisibility || 'public'
    });
  };

  // Submit Edit User
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setEditError(null);
    setIsSavingEdit(true);

    try {
      await authService.updateUserDataAsync(token, editingUser.id, {
        name: editFormData.name,
        username: editFormData.username,
        email: editFormData.email,
        role: editFormData.role,
        status: editFormData.status,
        dailyQuestionGoal: Number(editFormData.dailyQuestionGoal),
        privacySettings: {
          profileVisibility: editFormData.profileVisibility,
          activityVisibility: editFormData.activityVisibility,
          progressVisibility: editFormData.progressVisibility
        }
      });

      await refreshUsers();
      onShowDevNotice(`User @${editFormData.username} profile updated successfully.`);
      setEditingUser(null);
    } catch (err: any) {
      setEditError(err.message || 'Failed to update user profile.');
    } finally {
      setIsSavingEdit(false);
    }
  };

  // Submit Reset User Data
  const handleConfirmReset = async () => {
    if (!resettingUser) return;
    setIsResetting(true);

    try {
      const res = await authService.resetUserDataAsync(token, resettingUser.id, resetType);
      onShowDevNotice(res.message || `Reset ${resetType} for @${resettingUser.username}`);
      setResettingUser(null);
      if (inspectingUser?.id === resettingUser.id) {
        handleOpenInspect(resettingUser);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to reset user data');
    } finally {
      setIsResetting(false);
    }
  };

  // Quick Status Toggle
  const handleStatusToggle = async (user: User) => {
    if (user.id === currentUser?.id) {
      alert('You cannot deactivate your own administrator account.');
      return;
    }
    const nextStatus = user.status === 'active' ? 'disabled' : 'active';
    try {
      await authService.updateUserDataAsync(token, user.id, { status: nextStatus });
      await refreshUsers();
      onShowDevNotice(`Account status for ${user.name} set to ${nextStatus.toUpperCase()}`);
    } catch (err: any) {
      alert(err.message || 'Failed to change user status');
    }
  };

  // Delete User
  const handleDeleteUser = async (user: User) => {
    if (user.id === currentUser?.id) {
      alert('You cannot delete your own administrator account.');
      return;
    }
    if (!confirm(`Are you sure you want to permanently delete user @${user.username} (${user.email})? This action cannot be undone.`)) {
      return;
    }
    try {
      await authService.deleteUserAsync(token, user.id);
      await refreshUsers();
      onShowDevNotice(`Permanently deleted user @${user.username}`);
    } catch (err: any) {
      alert(err.message || 'Failed to delete user');
    }
  };

  // Combined Search Query
  const effectiveSearch = (internalSearch || externalSearch || '').toLowerCase().trim();

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      !effectiveSearch ||
      u.name.toLowerCase().includes(effectiveSearch) ||
      u.username.toLowerCase().includes(effectiveSearch) ||
      u.email.toLowerCase().includes(effectiveSearch);

    const matchesRole = filterRole === 'all' || u.role === filterRole;
    const matchesStatus = filterStatus === 'all' || u.status === filterStatus;
    const matchesProvider = filterProvider === 'all' || u.authProvider === filterProvider;

    return matchesSearch && matchesRole && matchesStatus && matchesProvider;
  });

  const totalUsersCount = users.length;
  const activeUsersCount = users.filter(u => u.status === 'active').length;
  const disabledUsersCount = users.filter(u => u.status === 'disabled').length;
  const adminUsersCount = users.filter(u => u.role === 'admin').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* 1. STATS OVERVIEW CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
        <div className="card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: 40, height: 40, borderRadius: '10px', backgroundColor: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)' }}>
            <UserIcon style={{ width: 20, height: 20 }} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Total Registered</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>{totalUsersCount}</div>
          </div>
        </div>

        <div className="card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: 40, height: 40, borderRadius: '10px', backgroundColor: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
            <UserCheck style={{ width: 20, height: 20 }} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Active Accounts</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#10b981' }}>{activeUsersCount}</div>
          </div>
        </div>

        <div className="card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: 40, height: 40, borderRadius: '10px', backgroundColor: 'rgba(239, 68, 68, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}>
            <UserX style={{ width: 20, height: 20 }} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Disabled Accounts</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ef4444' }}>{disabledUsersCount}</div>
          </div>
        </div>

        <div className="card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: 40, height: 40, borderRadius: '10px', backgroundColor: 'rgba(168, 85, 247, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a855f7' }}>
            <Shield style={{ width: 20, height: 20 }} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Administrators</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#a855f7' }}>{adminUsersCount}</div>
          </div>
        </div>
      </div>

      {/* 2. SEARCH & FILTER TOOLBAR */}
      <div className="card" style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              User Directory & Account Controls
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0, marginTop: '2px' }}>
              Inspect user learning progress, edit profile details, manage statuses, or reset account data.
            </p>
          </div>

          <button
            onClick={refreshUsers}
            className="btn btn-outline btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem' }}
          >
            <RefreshCw style={{ width: 13, height: 13 }} />
            <span>Refresh Users</span>
          </button>
        </div>

        {/* Filter Controls */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          <div className="search-input-wrapper" style={{ flex: '1 1 260px', maxWidth: '380px' }}>
            <Search className="search-icon" style={{ width: 14, height: 14 }} />
            <input
              type="text"
              className="input-field"
              placeholder="Search by name, @username, or email..."
              value={internalSearch}
              onChange={(e) => setInternalSearch(e.target.value)}
              style={{ padding: '6px 12px 6px 32px', fontSize: '0.82rem' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {/* Role Filter */}
            <select
              className="select-field"
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value as any)}
              style={{ fontSize: '0.78rem', padding: '5px 10px' }}
            >
              <option value="all">All Roles</option>
              <option value="admin">Administrators</option>
              <option value="user">Standard Users</option>
            </select>

            {/* Status Filter */}
            <select
              className="select-field"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              style={{ fontSize: '0.78rem', padding: '5px 10px' }}
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="disabled">Disabled Only</option>
            </select>

            {/* Provider Filter */}
            <select
              className="select-field"
              value={filterProvider}
              onChange={(e) => setFilterProvider(e.target.value as any)}
              style={{ fontSize: '0.78rem', padding: '5px 10px' }}
            >
              <option value="all">All Providers</option>
              <option value="email">Email</option>
              <option value="google">Google</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. USERS TABLE */}
      <div className="card" style={{ padding: '16px' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', textAlign: 'left', color: 'var(--text-muted)' }}>
                <th style={{ padding: '10px 12px' }}>User</th>
                <th style={{ padding: '10px 12px' }}>Email</th>
                <th style={{ padding: '10px 12px' }}>Role</th>
                <th style={{ padding: '10px 12px' }}>Status</th>
                <th style={{ padding: '10px 12px' }}>Provider</th>
                <th style={{ padding: '10px 12px' }}>Joined Date</th>
                <th style={{ padding: '10px 12px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No users matching criteria found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isSelf = u.id === currentUser?.id;
                  return (
                    <tr
                      key={u.id}
                      style={{
                        borderBottom: '1px solid var(--border-subtle)',
                        backgroundColor: isSelf ? 'rgba(99, 102, 241, 0.04)' : undefined
                      }}
                    >
                      <td style={{ padding: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div
                            style={{
                              width: 34,
                              height: 34,
                              borderRadius: '50%',
                              backgroundColor: u.role === 'admin' ? 'var(--accent-primary)' : 'var(--bg-base)',
                              border: '1px solid var(--border-subtle)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 700,
                              fontSize: '0.85rem',
                              color: u.role === 'admin' ? '#fff' : 'var(--text-primary)',
                              flexShrink: 0
                            }}
                          >
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span>{u.name}</span>
                              {isSelf && (
                                <span style={{ fontSize: '0.7rem', padding: '1px 6px', borderRadius: '4px', backgroundColor: 'rgba(99, 102, 241, 0.2)', color: 'var(--accent-primary)', fontWeight: 700 }}>
                                  You
                                </span>
                              )}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              @{u.username}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>
                        {u.email}
                      </td>

                      <td style={{ padding: '12px' }}>
                        <Badge variant={u.role === 'admin' ? 'purple' : 'blue'}>
                          {u.role.toUpperCase()}
                        </Badge>
                      </td>

                      <td style={{ padding: '12px' }}>
                        <span
                          style={{
                            padding: '3px 8px',
                            borderRadius: '12px',
                            fontSize: '0.725rem',
                            fontWeight: 700,
                            backgroundColor: u.status === 'active' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                            color: u.status === 'active' ? '#10b981' : '#ef4444'
                          }}
                        >
                          {u.status === 'active' ? '● Active' : '○ Disabled'}
                        </span>
                      </td>

                      <td style={{ padding: '12px', textTransform: 'capitalize', color: 'var(--text-secondary)' }}>
                        {u.authProvider}
                      </td>

                      <td style={{ padding: '12px', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                        {new Date(u.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>

                      <td style={{ padding: '12px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                          <button
                            onClick={() => handleOpenInspect(u)}
                            className="btn btn-outline btn-sm"
                            style={{ padding: '4px 8px' }}
                            title="Inspect User Profile & Learning Progress"
                          >
                            <Eye style={{ width: 13, height: 13 }} />
                          </button>

                          <button
                            onClick={() => handleOpenEdit(u)}
                            className="btn btn-outline btn-sm"
                            style={{ padding: '4px 8px', color: 'var(--accent-primary)', borderColor: 'rgba(99, 102, 241, 0.4)' }}
                            title="Edit User Profile"
                          >
                            <Edit2 style={{ width: 13, height: 13 }} />
                          </button>

                          <button
                            onClick={() => setResettingUser(u)}
                            className="btn btn-outline btn-sm"
                            style={{ padding: '4px 8px', color: '#f59e0b', borderColor: 'rgba(245, 158, 11, 0.4)' }}
                            title="Reset Account Data (Progress, Streak, Sessions)"
                          >
                            <RotateCcw style={{ width: 13, height: 13 }} />
                          </button>

                          <button
                            onClick={() => handleStatusToggle(u)}
                            disabled={isSelf}
                            className="btn btn-outline btn-sm"
                            style={{ padding: '4px 8px', opacity: isSelf ? 0.4 : 1 }}
                            title={u.status === 'active' ? 'Deactivate User Account' : 'Activate User Account'}
                          >
                            {u.status === 'active' ? <UserX style={{ width: 13, height: 13, color: '#ef4444' }} /> : <UserCheck style={{ width: 13, height: 13, color: '#10b981' }} />}
                          </button>

                          <button
                            onClick={() => handleDeleteUser(u)}
                            disabled={isSelf}
                            className="btn btn-outline btn-sm"
                            style={{ padding: '4px 8px', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)', opacity: isSelf ? 0.4 : 1 }}
                            title="Delete User Account"
                          >
                            <Trash2 style={{ width: 13, height: 13 }} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. MODAL: INSPECT USER PROFILE & PROGRESS */}
      {inspectingUser && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(4px)',
            zIndex: 1100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
        >
          <div
            className="card"
            style={{
              width: '100%',
              maxWidth: '720px',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', backgroundColor: inspectingUser.role === 'admin' ? 'var(--accent-primary)' : 'var(--bg-base)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', fontWeight: 800, color: inspectingUser.role === 'admin' ? '#fff' : 'var(--text-primary)' }}>
                  {inspectingUser.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                    {inspectingUser.name}
                  </h3>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    @{inspectingUser.username} · {inspectingUser.email}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setInspectingUser(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
              >
                <X style={{ width: 20, height: 20 }} />
              </button>
            </div>

            {/* Modal Tab Selector */}
            <div style={{ display: 'flex', gap: '6px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
              <button
                className={`btn btn-sm ${inspectTab === 'account' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setInspectTab('account')}
                style={{ fontSize: '0.78rem', padding: '4px 12px' }}
              >
                Account Information
              </button>
              <button
                className={`btn btn-sm ${inspectTab === 'progress' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setInspectTab('progress')}
                style={{ fontSize: '0.78rem', padding: '4px 12px' }}
              >
                Learning & Progress
              </button>
              <button
                className={`btn btn-sm ${inspectTab === 'feedback' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setInspectTab('feedback')}
                style={{ fontSize: '0.78rem', padding: '4px 12px' }}
              >
                Submitted Feedback ({inspectDetails?.feedback?.length || 0})
              </button>
            </div>

            {isLoadingDetails ? (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                Loading user profile & progress metrics...
              </div>
            ) : (
              <>
                {/* TAB 1: ACCOUNT INFORMATION */}
                {inspectTab === 'account' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                      <div style={{ padding: '10px 12px', backgroundColor: 'var(--bg-base)', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Account ID</div>
                        <div style={{ fontSize: '0.8rem', fontFamily: 'monospace', color: 'var(--text-primary)', marginTop: '2px' }}>{inspectingUser.id}</div>
                      </div>

                      <div style={{ padding: '10px 12px', backgroundColor: 'var(--bg-base)', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Role & Privileges</div>
                        <div style={{ marginTop: '2px' }}>
                          <Badge variant={inspectingUser.role === 'admin' ? 'purple' : 'blue'}>{inspectingUser.role.toUpperCase()}</Badge>
                        </div>
                      </div>

                      <div style={{ padding: '10px 12px', backgroundColor: 'var(--bg-base)', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Account Status</div>
                        <div style={{ fontSize: '0.825rem', fontWeight: 700, color: inspectingUser.status === 'active' ? '#10b981' : '#ef4444', marginTop: '2px' }}>
                          {inspectingUser.status === 'active' ? 'Active' : 'Disabled'}
                        </div>
                      </div>

                      <div style={{ padding: '10px 12px', backgroundColor: 'var(--bg-base)', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Daily Goal</div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
                          {inspectingUser.dailyQuestionGoal || 5} Questions/day
                        </div>
                      </div>

                      <div style={{ padding: '10px 12px', backgroundColor: 'var(--bg-base)', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Registration Date</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-primary)', marginTop: '2px' }}>
                          {new Date(inspectingUser.createdAt).toLocaleString()}
                        </div>
                      </div>

                      <div style={{ padding: '10px 12px', backgroundColor: 'var(--bg-base)', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Last Login</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-primary)', marginTop: '2px' }}>
                          {inspectingUser.lastLoginAt ? new Date(inspectingUser.lastLoginAt).toLocaleString() : 'Never logged in'}
                        </div>
                      </div>
                    </div>

                    {/* Privacy Settings Breakdown */}
                    <div style={{ padding: '12px', backgroundColor: 'var(--bg-base)', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>Privacy Invariants:</div>
                      <div style={{ display: 'flex', gap: '16px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                        <span>Profile: <strong>{inspectingUser.privacySettings?.profileVisibility || 'public'}</strong></span>
                        <span>Activity: <strong>{inspectingUser.privacySettings?.activityVisibility || 'public'}</strong></span>
                        <span>Progress: <strong>{inspectingUser.privacySettings?.progressVisibility || 'public'}</strong></span>
                      </div>
                    </div>

                    {/* Security Notice: No secrets exposed */}
                    <div style={{ padding: '10px 12px', backgroundColor: 'rgba(59, 130, 246, 0.08)', borderRadius: '6px', border: '1px solid rgba(59, 130, 246, 0.25)', fontSize: '0.75rem', color: 'var(--accent-blue)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Lock style={{ width: 14, height: 14 }} />
                      <span>Security Guard: Passwords, salt hashes, and token keys are securely hidden from admin view.</span>
                    </div>
                  </div>
                )}

                {/* TAB 2: LEARNING & PROGRESS */}
                {inspectTab === 'progress' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {/* Stat Badges */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
                      <div style={{ padding: '10px 12px', backgroundColor: 'var(--bg-base)', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Solved Problems</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#10b981', marginTop: '2px' }}>
                          {inspectDetails?.progress?.solvedProblemIds?.length || 0}
                        </div>
                      </div>

                      <div style={{ padding: '10px 12px', backgroundColor: 'var(--bg-base)', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Attempted Problems</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-blue)', marginTop: '2px' }}>
                          {inspectDetails?.progress?.attemptedProblemIds?.length || 0}
                        </div>
                      </div>

                      <div style={{ padding: '10px 12px', backgroundColor: 'var(--bg-base)', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Active Day Streak</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f59e0b', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Flame style={{ width: 16, height: 16, color: '#f59e0b' }} />
                          <span>{inspectDetails?.progress?.streak || 0} Days</span>
                        </div>
                      </div>

                      <div style={{ padding: '10px 12px', backgroundColor: 'var(--bg-base)', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Curriculum Stages</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#a855f7', marginTop: '2px' }}>
                          {inspectDetails?.progress?.completedStages?.length || 0} Done
                        </div>
                      </div>
                    </div>

                    {/* Solved Problems List */}
                    <div>
                      <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                        Solved Problems:
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', maxHeight: '120px', overflowY: 'auto', padding: '6px', backgroundColor: 'var(--bg-base)', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                        {(inspectDetails?.progress?.solvedProblemIds || []).length === 0 ? (
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', padding: '4px' }}>No problems solved yet.</span>
                        ) : (
                          inspectDetails?.progress?.solvedProblemIds.map((pid: string) => {
                            const found = problemsData.find(p => p.id === pid);
                            return (
                              <span key={pid} style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '4px', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)', fontWeight: 600 }}>
                                ✓ {found?.title || pid}
                              </span>
                            );
                          })
                        )}
                      </div>
                    </div>

                    {/* Activity Log */}
                    <div>
                      <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                        Recent Activity Log:
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '180px', overflowY: 'auto' }}>
                        {(inspectDetails?.progress?.activityLog || []).length === 0 ? (
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', padding: '12px', textAlign: 'center', backgroundColor: 'var(--bg-base)', borderRadius: '6px' }}>
                            No activity logged yet.
                          </div>
                        ) : (
                          inspectDetails?.progress?.activityLog.map((act: any, idx: number) => (
                            <div key={idx} style={{ padding: '8px 10px', backgroundColor: 'var(--bg-base)', borderRadius: '6px', border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem' }}>
                              <div>
                                <strong style={{ color: 'var(--text-primary)' }}>{act.title}</strong>
                                <span style={{ color: 'var(--text-muted)', marginLeft: '6px' }}>{act.subtitle}</span>
                              </div>
                              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                                {new Date(act.timestamp).toLocaleDateString()}
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 3: USER SUBMITTED FEEDBACK */}
                {inspectTab === 'feedback' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {(inspectDetails?.feedback || []).length === 0 ? (
                      <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)', backgroundColor: 'var(--bg-base)', borderRadius: '6px' }}>
                        No feedback submitted by this user.
                      </div>
                    ) : (
                      inspectDetails?.feedback.map((fb: any) => (
                        <div key={fb.id} style={{ padding: '12px 14px', backgroundColor: 'var(--bg-base)', borderRadius: '6px', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Badge variant={fb.category === 'bug' ? 'hard' : fb.category === 'feature' ? 'easy' : 'blue'}>
                              {fb.category.toUpperCase()}
                            </Badge>
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                              {new Date(fb.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.82rem', color: 'var(--text-primary)' }}>
                            "{fb.message}"
                          </div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                            Status: <strong style={{ textTransform: 'capitalize' }}>{fb.status}</strong>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </>
            )}

            {/* Modal Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '12px', marginTop: '4px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => {
                    const u = inspectingUser;
                    setInspectingUser(null);
                    handleOpenEdit(u);
                  }}
                  className="btn btn-primary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem' }}
                >
                  <Edit2 style={{ width: 13, height: 13 }} />
                  <span>Edit Profile</span>
                </button>

                <button
                  onClick={() => {
                    const u = inspectingUser;
                    setInspectingUser(null);
                    setResettingUser(u);
                  }}
                  className="btn btn-outline btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#f59e0b', borderColor: 'rgba(245, 158, 11, 0.4)' }}
                >
                  <RotateCcw style={{ width: 13, height: 13 }} />
                  <span>Reset Data</span>
                </button>
              </div>

              <button
                onClick={() => setInspectingUser(null)}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.75rem' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. MODAL: EDIT USER PROFILE */}
      {editingUser && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(4px)',
            zIndex: 1100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
        >
          <div
            className="card"
            style={{
              width: '100%',
              maxWidth: '560px',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                Edit User Profile: @{editingUser.username}
              </h3>
              <button
                onClick={() => setEditingUser(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X style={{ width: 20, height: 20 }} />
              </button>
            </div>

            {editError && (
              <div style={{ padding: '10px 12px', backgroundColor: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '6px', color: '#ef4444', fontSize: '0.8rem' }}>
                ⚠️ {editError}
              </div>
            )}

            <form onSubmit={handleSaveEdit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Full Name</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  style={{ padding: '6px 10px', fontSize: '0.82rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Username (@)</label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    value={editFormData.username}
                    onChange={(e) => setEditFormData({ ...editFormData, username: e.target.value })}
                    style={{ padding: '6px 10px', fontSize: '0.82rem' }}
                  />
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>4-64 chars: a-z, 0-9, dots, underscores</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Email Address</label>
                  <input
                    type="email"
                    required
                    className="input-field"
                    value={editFormData.email}
                    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                    style={{ padding: '6px 10px', fontSize: '0.82rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Account Role</label>
                  <select
                    className="select-field"
                    value={editFormData.role}
                    disabled={editingUser.id === currentUser?.id}
                    onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value as any })}
                    style={{ padding: '6px 10px', fontSize: '0.82rem' }}
                  >
                    <option value="user">Standard User</option>
                    <option value="admin">Administrator</option>
                  </select>
                  {editingUser.id === currentUser?.id && (
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Cannot demote your own account.</span>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Account Status</label>
                  <select
                    className="select-field"
                    value={editFormData.status}
                    disabled={editingUser.id === currentUser?.id}
                    onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value as any })}
                    style={{ padding: '6px 10px', fontSize: '0.82rem' }}
                  >
                    <option value="active">Active</option>
                    <option value="disabled">Disabled / Deactivated</option>
                  </select>
                  {editingUser.id === currentUser?.id && (
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Cannot deactivate your own account.</span>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Daily Question Goal</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  className="input-field"
                  value={editFormData.dailyQuestionGoal}
                  onChange={(e) => setEditFormData({ ...editFormData, dailyQuestionGoal: parseInt(e.target.value, 10) || 5 })}
                  style={{ padding: '6px 10px', fontSize: '0.82rem' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', padding: '10px', backgroundColor: 'var(--bg-base)', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>Privacy Visibility Controls</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  <div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Profile:</span>
                    <select
                      className="select-field"
                      value={editFormData.profileVisibility}
                      onChange={(e) => setEditFormData({ ...editFormData, profileVisibility: e.target.value as any })}
                      style={{ fontSize: '0.75rem', padding: '4px 6px', marginTop: '2px', width: '100%' }}
                    >
                      <option value="public">Public</option>
                      <option value="private">Private</option>
                    </select>
                  </div>

                  <div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Activity:</span>
                    <select
                      className="select-field"
                      value={editFormData.activityVisibility}
                      onChange={(e) => setEditFormData({ ...editFormData, activityVisibility: e.target.value as any })}
                      style={{ fontSize: '0.75rem', padding: '4px 6px', marginTop: '2px', width: '100%' }}
                    >
                      <option value="public">Public</option>
                      <option value="private">Private</option>
                    </select>
                  </div>

                  <div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Progress:</span>
                    <select
                      className="select-field"
                      value={editFormData.progressVisibility}
                      onChange={(e) => setEditFormData({ ...editFormData, progressVisibility: e.target.value as any })}
                      style={{ fontSize: '0.75rem', padding: '4px 6px', marginTop: '2px', width: '100%' }}
                    >
                      <option value="public">Public</option>
                      <option value="private">Private</option>
                    </select>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="btn btn-outline btn-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingEdit}
                  className="btn btn-primary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Check style={{ width: 13, height: 13 }} />
                  <span>{isSavingEdit ? 'Saving Changes...' : 'Save Profile Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. MODAL: RESET USER DATA */}
      {resettingUser && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(4px)',
            zIndex: 1100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
        >
          <div
            className="card"
            style={{
              width: '100%',
              maxWidth: '500px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertTriangle style={{ width: 18, height: 18, color: '#f59e0b' }} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                  Reset User Data: @{resettingUser.username}
                </h3>
              </div>
              <button
                onClick={() => setResettingUser(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X style={{ width: 18, height: 18 }} />
              </button>
            </div>

            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0 }}>
              Select which account dataset to reset for this user. This updates the database immediately.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { id: 'progress', label: 'Reset Problem Progress', desc: 'Clears all solved and attempted problem records and logs.' },
                { id: 'streak', label: 'Reset Day Streak', desc: 'Resets consecutive daily problem streak back to 0.' },
                { id: 'stages', label: 'Reset Flow of Learning Stages', desc: 'Clears completed curriculum stages back to initial baseline.' },
                { id: 'sessions', label: 'Revoke Active Sessions', desc: 'Terminates all active login sessions, forcing the user to sign in again.' },
                { id: 'all', label: 'Full Reset (All Data)', desc: 'Clears all progress, streaks, roadmap stages, and remote sessions.' }
              ].map(opt => (
                <label
                  key={opt.id}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '6px',
                    border: `1px solid ${resetType === opt.id ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                    backgroundColor: resetType === opt.id ? 'rgba(99, 102, 241, 0.08)' : 'var(--bg-base)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    cursor: 'pointer'
                  }}
                >
                  <input
                    type="radio"
                    name="resetTypeOption"
                    value={opt.id}
                    checked={resetType === opt.id}
                    onChange={() => setResetType(opt.id as any)}
                    style={{ marginTop: '2px' }}
                  />
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {opt.label}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {opt.desc}
                    </div>
                  </div>
                </label>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
              <button
                type="button"
                onClick={() => setResettingUser(null)}
                className="btn btn-outline btn-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReset}
                disabled={isResetting}
                className="btn btn-primary btn-sm"
                style={{ backgroundColor: '#f59e0b', borderColor: '#f59e0b', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <RotateCcw style={{ width: 13, height: 13 }} />
                <span>{isResetting ? 'Resetting...' : 'Confirm Reset'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
