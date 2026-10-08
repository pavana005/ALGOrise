import React, { useState, useEffect } from 'react';
import { adminContentService } from '../../../services/adminContentService';
import type { AdminFeedbackItem, AdminWebsiteSettings } from '../../../services/adminContentService';
import { feedbackService } from '../../../services/feedbackService';
import { useAuth } from '../../../context/AuthContext';
import { Save, Search, Trash2, MessageSquare, RefreshCw, Loader2 } from 'lucide-react';

interface AdminFeedbackSettingsViewProps {
  onShowDevNotice: (msg: string) => void;
}

export const AdminFeedbackSettingsView: React.FC<AdminFeedbackSettingsViewProps> = ({ onShowDevNotice }) => {
  const { token } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState<'feedback' | 'popups' | 'settings'>('feedback');

  const [feedback, setFeedback] = useState<AdminFeedbackItem[]>(() => {
    try {
      return feedbackService.getAdminFeedback(token);
    } catch {
      return adminContentService.getFeedback(token);
    }
  });
  const [popups, setPopups] = useState<any[]>(() => adminContentService.loadStore().popups);
  const [settings, setSettings] = useState<AdminWebsiteSettings>(() => adminContentService.getSettings(token));
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'reviewed' | 'resolved'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'general' | 'bug' | 'feature'>('all');

  const [newPopupText, setNewPopupText] = useState('');
  const [newPopupCategory, setNewPopupCategory] = useState('debugging');

  const refreshFeedback = () => {
    feedbackService.getAdminFeedbackAsync(token).then((data) => {
      if (data) setFeedback(data);
    }).catch(() => {
      setFeedback(adminContentService.getFeedback(token));
    });
  };

  useEffect(() => {
    refreshFeedback();
    adminContentService.getSettingsAsync(token).then((s) => {
      if (s) setSettings(s);
    });
  }, [token]);

  const handleFeedbackStatus = async (id: string, status: 'new' | 'reviewed' | 'resolved') => {
    try {
      await feedbackService.updateStatusAsync(token, id, status);
      refreshFeedback();
      onShowDevNotice(`Feedback status updated to ${status}.`);
    } catch (err: any) {
      onShowDevNotice(`Failed to update feedback: ${err.message || 'Error'}`);
    }
  };

  const handleDeleteFeedback = async (id: string) => {
    if (!confirm('Are you sure you want to delete this feedback?')) return;
    try {
      await feedbackService.deleteFeedbackAsync(token, id);
      refreshFeedback();
      onShowDevNotice('Feedback message deleted.');
    } catch (err: any) {
      onShowDevNotice(`Failed to delete feedback: ${err.message || 'Error'}`);
    }
  };

  const filteredFeedback = feedback.filter((item) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = 
      !q ||
      item.userName.toLowerCase().includes(q) ||
      (item.userEmail && item.userEmail.toLowerCase().includes(q)) ||
      item.message.toLowerCase().includes(q) ||
      item.type.toLowerCase().includes(q);
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleAddPopup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPopupText.trim()) return;
    const store = adminContentService.loadStore();
    store.popups.unshift({
      id: `popup-${Date.now()}`,
      category: newPopupCategory,
      text: newPopupText.trim(),
      status: 'active'
    });
    adminContentService.saveStore(store);
    setPopups(store.popups);
    setNewPopupText('');
    onShowDevNotice('New motivation popup message added.');
  };

  const handleDeletePopup = (id: string) => {
    const store = adminContentService.loadStore();
    store.popups = store.popups.filter((p: any) => p.id !== id);
    adminContentService.saveStore(store);
    setPopups(store.popups);
    onShowDevNotice('Motivation popup removed.');
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    try {
      const updated = await adminContentService.updateSettingsAsync(token, settings);
      setSettings(updated);
      onShowDevNotice('Global website settings saved successfully.');
    } catch (err: any) {
      onShowDevNotice(`Failed to save settings: ${err.message || 'Error'}`);
    } finally {
      setIsSavingSettings(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Sub tabs */}
      <div className="card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          onClick={() => setActiveSubTab('feedback')}
          style={{
            padding: '6px 14px',
            borderRadius: '6px',
            fontSize: '0.82rem',
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer',
            backgroundColor: activeSubTab === 'feedback' ? 'var(--accent-primary)' : 'rgba(30, 41, 59, 0.5)',
            color: activeSubTab === 'feedback' ? '#fff' : 'var(--text-secondary)'
          }}
        >
          User Feedback Inbox ({feedback.length})
        </button>
        <button
          onClick={() => setActiveSubTab('popups')}
          style={{
            padding: '6px 14px',
            borderRadius: '6px',
            fontSize: '0.82rem',
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer',
            backgroundColor: activeSubTab === 'popups' ? 'var(--accent-primary)' : 'rgba(30, 41, 59, 0.5)',
            color: activeSubTab === 'popups' ? '#fff' : 'var(--text-secondary)'
          }}
        >
          Motivation Popups Manager ({popups.length})
        </button>
        <button
          onClick={() => setActiveSubTab('settings')}
          style={{
            padding: '6px 14px',
            borderRadius: '6px',
            fontSize: '0.82rem',
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer',
            backgroundColor: activeSubTab === 'settings' ? 'var(--accent-primary)' : 'rgba(30, 41, 59, 0.5)',
            color: activeSubTab === 'settings' ? '#fff' : 'var(--text-secondary)'
          }}
        >
          Website Global Settings
        </button>
      </div>

      {activeSubTab === 'feedback' && (
        <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MessageSquare style={{ width: 18, height: 18, color: 'var(--accent-primary)' }} />
              <span>User Feedback & Bug Reports Inbox</span>
            </h3>

            {/* Search & Filter Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative' }}>
                <Search style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Search user, email, message..."
                  className="input-field"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ padding: '4px 8px 4px 30px', fontSize: '0.78rem', width: '200px' }}
                />
              </div>

              <select
                className="select-field"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                style={{ fontSize: '0.78rem', padding: '4px 8px' }}
              >
                <option value="all">All Statuses</option>
                <option value="new">New / Unread</option>
                <option value="reviewed">Reviewed</option>
                <option value="resolved">Resolved</option>
              </select>

              <select
                className="select-field"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as any)}
                style={{ fontSize: '0.78rem', padding: '4px 8px' }}
              >
                <option value="all">All Types</option>
                <option value="general">💬 General</option>
                <option value="bug">🐛 Bug Report</option>
                <option value="feature">✨ Feature</option>
              </select>

              <button
                className="btn btn-outline btn-sm"
                onClick={refreshFeedback}
                style={{ padding: '4px 10px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                title="Re-fetch feedback list from database"
              >
                <RefreshCw style={{ width: 13, height: 13 }} />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredFeedback.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                No feedback items found matching filters.
              </div>
            ) : (
              filteredFeedback.map((item) => (
                <div
                  key={item.id}
                  style={{
                    padding: '16px',
                    backgroundColor: 'var(--bg-base)',
                    border: `1px solid ${item.status === 'new' ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                    borderRadius: '10px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: '16px'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {item.userName}
                      </span>
                      {item.userId && (
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                          [{item.userId}]
                        </span>
                      )}
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {item.userEmail ? `(${item.userEmail})` : '(No email provided)'}
                      </span>
                      <span
                        style={{
                          padding: '2px 8px',
                          borderRadius: '10px',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          backgroundColor: item.type === 'bug' ? 'rgba(239, 68, 68, 0.15)' : item.type === 'feature' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(99, 102, 241, 0.15)',
                          color: item.type === 'bug' ? '#f87171' : item.type === 'feature' ? '#10b981' : 'var(--accent-primary)'
                        }}
                      >
                        {item.type.toUpperCase()}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '8px 0 4px 0', lineHeight: 1.5 }}>
                      "{item.message}"
                    </p>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                      Submitted: {new Date(item.createdAt).toLocaleString()}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <select
                      className="select-field"
                      value={item.status}
                      onChange={(e) => handleFeedbackStatus(item.id, e.target.value as any)}
                      style={{ fontSize: '0.78rem', padding: '4px 8px' }}
                    >
                      <option value="new">New (Unread)</option>
                      <option value="reviewed">Reviewed</option>
                      <option value="resolved">Resolved</option>
                    </select>

                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => handleDeleteFeedback(item.id)}
                      style={{ padding: '4px 8px', color: '#f87171', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                      title="Delete feedback message"
                    >
                      <Trash2 style={{ width: 14, height: 14 }} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeSubTab === 'popups' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="card" style={{ padding: '20px' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0, marginBottom: '12px' }}>
              Add Funny/Sarcastic Motivation Message
            </h4>
            <form onSubmit={handleAddPopup} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <select
                className="select-field"
                value={newPopupCategory}
                onChange={(e) => setNewPopupCategory(e.target.value)}
                style={{ width: '160px', fontSize: '0.82rem' }}
              >
                <option value="debugging">Debugging</option>
                <option value="procrastination">Procrastination</option>
                <option value="wrong_answer">Wrong Answer</option>
                <option value="long_session">Long Session</option>
                <option value="stuck">Stuck</option>
                <option value="random">Random Chaos</option>
              </select>

              <input
                type="text"
                required
                placeholder="Enter funny popup quote..."
                className="select-field"
                style={{ flex: 1, minWidth: '240px', fontSize: '0.82rem' }}
                value={newPopupText}
                onChange={(e) => setNewPopupText(e.target.value)}
              />

              <button type="submit" className="btn btn-primary btn-sm">
                Add Popup Quote
              </button>
            </form>
          </div>

          <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {popups.map((p, idx) => (
              <div key={p.id || idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', backgroundColor: 'var(--bg-base)', borderRadius: '8px', border: '1px solid var(--border-subtle)', fontSize: '0.84rem' }}>
                <div>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase', marginRight: '10px' }}>
                    [{p.category}]
                  </span>
                  <span style={{ color: 'var(--text-primary)' }}>"{p.text}"</span>
                </div>
                <button onClick={() => handleDeletePopup(p.id)} className="btn btn-outline btn-sm" style={{ padding: '2px 6px', color: '#f87171', borderColor: 'rgba(239, 68, 68, 0.3)' }}>
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSubTab === 'settings' && (
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0, marginBottom: '16px' }}>
            Global Website Platform Configuration
          </h3>
          <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '600px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Platform Title</label>
              <input
                type="text"
                className="select-field"
                value={settings.siteTitle}
                onChange={(e) => setSettings({ ...settings, siteTitle: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Tagline</label>
              <input
                type="text"
                className="select-field"
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', backgroundColor: 'var(--bg-base)', borderRadius: '8px' }}>
              <input
                type="checkbox"
                id="maintenanceChk"
                checked={settings.maintenanceMode}
                onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
              />
              <label htmlFor="maintenanceChk" style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 600, cursor: 'pointer' }}>
                Enable Site-wide Maintenance Mode
              </label>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', backgroundColor: 'var(--bg-base)', borderRadius: '8px' }}>
              <input
                type="checkbox"
                id="allowRegsChk"
                checked={settings.allowRegistrations}
                onChange={(e) => setSettings({ ...settings, allowRegistrations: e.target.checked })}
              />
              <label htmlFor="allowRegsChk" style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 600, cursor: 'pointer' }}>
                Allow New User Registrations
              </label>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', backgroundColor: 'var(--bg-base)', borderRadius: '8px' }}>
              <input
                type="checkbox"
                id="enablePopupsChk"
                checked={settings.enableMotivationPopups}
                onChange={(e) => setSettings({ ...settings, enableMotivationPopups: e.target.checked })}
              />
              <label htmlFor="enablePopupsChk" style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 600, cursor: 'pointer' }}>
                Enable Study Motivation Popups System
              </label>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
              <button type="submit" disabled={isSavingSettings} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {isSavingSettings ? <Loader2 style={{ width: 16, height: 16, animation: 'spin 1s linear infinite' }} /> : <Save style={{ width: 16, height: 16 }} />}
                <span>{isSavingSettings ? 'Saving...' : 'Save Global Settings'}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
