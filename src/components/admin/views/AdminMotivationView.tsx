import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Play,
  X,
  Search,
  CheckCircle2,
  Sliders,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { adminCmsService, type MotivationTriggerConfig } from '../../../services/adminCmsService';
import { adminContentService } from '../../../services/adminContentService';
import { triggerMotivationPopup } from '../../common/MotivationPopup';
import type { MotivationCategory, PersonalityLevel, MotivationMessage } from '../../../data/motivationData';

const ALL_CATEGORIES: MotivationCategory[] = [
  'LOGIN',
  'IDLE',
  'IDLE_ON_PROBLEM',
  'TAB_RETURN',
  'STUCK_ON_PROBLEM',
  'FAILED_ATTEMPTS',
  'COMPILE_ERROR',
  'RUNTIME_ERROR',
  'TIME_LIMIT_EXCEEDED',
  'PROBLEM_SOLVED',
  'ACCEPTED',
  'FAST_SOLVE',
  'MANY_HINTS',
  'REPEATED_RUNS',
  'REPEATED_EDITS',
  'STREAK',
  'BROKEN_STREAK',
  'PROBLEM_BROWSING',
  'SPEEDRUN_BROWSING',
  'LONG_SESSION',
  'RETURNING_USER',
  'FIRST_PROBLEM',
  'FIRST_ACCEPTED',
  'POINTS',
  'LEARNING',
  'LESSON_COMPLETE',
  'VISUALIZER',
  'RANDOM_CHAOS',
  'BINARY_SEARCH',
  'RECURSION',
  'DYNAMIC_PROGRAMMING',
  'BFS',
  'DFS',
  'SLIDING_WINDOW',
  'HASH_MAP',
  'TWO_POINTERS',
  'STACK',
  'QUEUE',
  'GRAPH',
  'SORTING',
  'TREES'
];

export const AdminMotivationView: React.FC = () => {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState<'messages' | 'triggers'>('messages');

  // Popup messages
  const [messages, setMessages] = useState<MotivationMessage[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [personalityFilter, setPersonalityFilter] = useState<string>('all');

  // Triggers
  const [triggers, setTriggers] = useState<MotivationTriggerConfig[]>(() => adminCmsService.getMotivations());

  // Editing & Preview states
  const [editingMessage, setEditingMessage] = useState<Partial<MotivationMessage> | null>(null);
  const [previewMessage, setPreviewMessage] = useState<MotivationMessage | null>(null);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const fetchMessages = async () => {
    setIsLoadingMessages(true);
    try {
      const data = await adminContentService.getPopupsAsync(token);
      if (Array.isArray(data) && data.length > 0) {
        setMessages(data);
      }
    } catch (err) {
      console.error('Error fetching popups:', err);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [token]);

  const showNotice = (msg: string) => {
    setStatusMsg(msg);
    setTimeout(() => setStatusMsg(null), 3000);
  };

  // Trigger toggle
  const toggleTriggerStatus = (triggerId: string) => {
    const item = triggers.find(m => m.triggerId === triggerId);
    if (item) {
      const updated = { ...item, enabled: !item.enabled };
      adminCmsService.updateMotivation(token, updated);
      setTriggers(adminCmsService.getMotivations());
      showNotice(`Toggled trigger "${item.title}" status to ${updated.enabled ? 'Enabled' : 'Disabled'}.`);
    }
  };

  // CRUD for Messages
  const handleSaveMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMessage?.template) return;

    try {
      const payload: MotivationMessage = {
        id: editingMessage.id || `popup-custom-${Date.now()}`,
        category: (editingMessage.category as MotivationCategory) || 'RANDOM_CHAOS',
        personality: (editingMessage.personality as PersonalityLevel) || 'funny',
        badgeTitle: editingMessage.badgeTitle || 'Algorise Sarcasm AI',
        badgeVariant: (editingMessage.badgeVariant as any) || 'blue',
        template: editingMessage.template.trim()
      };

      await adminContentService.savePopupAsync(token, payload);
      await fetchMessages();
      setEditingMessage(null);
      showNotice(`Motivation popup message saved successfully.`);
    } catch (err: any) {
      alert(err?.message || 'Failed to save popup message');
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this motivation message?')) return;
    try {
      await adminContentService.deletePopupAsync(token, id);
      await fetchMessages();
      showNotice('Motivation popup message deleted.');
    } catch (err: any) {
      alert(err?.message || 'Failed to delete message');
    }
  };

  const handleTestPopup = (msg: MotivationMessage) => {
    triggerMotivationPopup(msg.category, true);
    showNotice(`Dispatched live test popup for category: ${msg.category}`);
  };

  const filteredMessages = messages.filter((m) => {
    const matchesSearch =
      !searchQuery ||
      m.template.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.badgeTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === 'all' || m.category === categoryFilter;
    const matchesPersonality = personalityFilter === 'all' || m.personality === personalityFilter;

    return matchesSearch && matchesCategory && matchesPersonality;
  });

  const getVariantColor = (v: string) => {
    switch (v) {
      case 'pink': return '#ec4899';
      case 'amber': return '#f59e0b';
      case 'purple': return '#a855f7';
      case 'green': return '#10b981';
      default: return '#38bdf8';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Banner */}
      <div
        className="card"
        style={{
          padding: '18px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'var(--bg-surface)',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: '8px',
              backgroundColor: 'rgba(236, 72, 153, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ec4899'
            }}
          >
            <Sparkles style={{ width: 20, height: 20 }} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                Motivation & Contextual Popups Engine
              </h3>
              <span
                style={{
                  fontSize: '0.72rem',
                  padding: '2px 8px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(16, 185, 129, 0.15)',
                  color: '#10b981',
                  fontWeight: 600
                }}
              >
                {messages.length} Active Jokes in Pool
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0, marginTop: '2px' }}>
              Manage full humorous message inventory, CS student sarcasm, live triggers, and cooldown timers.
            </p>
          </div>
        </div>

        {/* Tab switcher */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className={`btn btn-sm ${activeTab === 'messages' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveTab('messages')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Sparkles style={{ width: 14, height: 14 }} />
            <span>Messages Pool ({messages.length})</span>
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'triggers' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveTab('triggers')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Sliders style={{ width: 14, height: 14 }} />
            <span>Triggers & Cooldowns ({triggers.length})</span>
          </button>
        </div>
      </div>

      {statusMsg && (
        <div
          style={{
            padding: '12px 16px',
            backgroundColor: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: 'var(--radius-md)',
            color: '#10b981',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <CheckCircle2 style={{ width: 16, height: 16 }} />
          <span>{statusMsg}</span>
        </div>
      )}

      {/* MESSAGES TAB */}
      {activeTab === 'messages' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Action and Filter Controls */}
          <div
            className="card"
            style={{
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', flex: 1 }}>
              {/* Search */}
              <div style={{ position: 'relative', minWidth: '220px', flex: '1 1 200px' }}>
                <Search style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Search joke text, badges..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-field"
                  style={{ width: '100%', paddingLeft: '32px', fontSize: '0.82rem' }}
                />
              </div>

              {/* Category filter */}
              <select
                className="select-field"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                style={{ fontSize: '0.82rem', padding: '6px 12px' }}
              >
                <option value="all">All Categories ({ALL_CATEGORIES.length})</option>
                {ALL_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              {/* Personality filter */}
              <select
                className="select-field"
                value={personalityFilter}
                onChange={(e) => setPersonalityFilter(e.target.value)}
                style={{ fontSize: '0.82rem', padding: '6px 12px' }}
              >
                <option value="all">All Personalities</option>
                <option value="funny">Funny</option>
                <option value="sarcastic">Sarcastic</option>
                <option value="playful">Playful</option>
                <option value="cs_chaos">CS Chaos</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={fetchMessages}
                disabled={isLoadingMessages}
                className="btn btn-outline btn-sm"
                title="Refresh messages"
              >
                <RefreshCw style={{ width: 13, height: 13, animation: isLoadingMessages ? 'spin 1s linear infinite' : 'none' }} />
              </button>

              <button
                onClick={() =>
                  setEditingMessage({
                    category: 'FAILED_ATTEMPTS',
                    personality: 'sarcastic',
                    badgeTitle: 'Compiler Whisperer',
                    badgeVariant: 'amber',
                    template: 'At this point you are not debugging. You are negotiating with the compiler.'
                  })
                }
                className="btn btn-primary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Plus style={{ width: 14, height: 14 }} />
                <span>Add Popup Message</span>
              </button>
            </div>
          </div>

          {/* Messages Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
              gap: '14px'
            }}
          >
            {filteredMessages.map((msg) => {
              const accentColor = getVariantColor(msg.badgeVariant);
              return (
                <div
                  key={msg.id}
                  className="card"
                  style={{
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '12px',
                    border: '1px solid var(--border-subtle)',
                    transition: 'border-color 0.2s'
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.borderColor = accentColor)}
                  onMouseOut={(e) => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '10px',
                          backgroundColor: `${accentColor}15`,
                          color: accentColor,
                          border: `1px solid ${accentColor}40`
                        }}
                      >
                        {msg.badgeTitle}
                      </span>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                          {msg.personality}
                        </span>
                      </div>
                    </div>

                    <p
                      style={{
                        fontSize: '0.86rem',
                        color: 'var(--text-primary)',
                        margin: 0,
                        lineHeight: 1.5,
                        fontStyle: 'italic'
                      }}
                    >
                      "{msg.template}"
                    </p>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingTop: '10px',
                      borderTop: '1px solid var(--border-subtle)',
                      fontSize: '0.74rem'
                    }}
                  >
                    <span
                      style={{
                        padding: '2px 6px',
                        backgroundColor: 'var(--bg-root)',
                        borderRadius: '4px',
                        color: 'var(--text-secondary)',
                        fontFamily: 'var(--font-mono)'
                      }}
                    >
                      {msg.category}
                    </span>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <button
                        onClick={() => handleTestPopup(msg)}
                        className="btn btn-outline btn-sm"
                        style={{ padding: '3px 8px', color: '#10b981' }}
                        title="Trigger live in app"
                      >
                        <Play style={{ width: 11, height: 11 }} />
                      </button>
                      <button
                        onClick={() => setPreviewMessage(msg)}
                        className="btn btn-outline btn-sm"
                        style={{ padding: '3px 8px' }}
                        title="Preview"
                      >
                        <Eye style={{ width: 11, height: 11 }} />
                      </button>
                      <button
                        onClick={() => setEditingMessage(msg)}
                        className="btn btn-outline btn-sm"
                        style={{ padding: '3px 8px' }}
                        title="Edit"
                      >
                        <Edit2 style={{ width: 11, height: 11 }} />
                      </button>
                      <button
                        onClick={() => handleDeleteMessage(msg.id)}
                        className="btn btn-outline btn-sm"
                        style={{ padding: '3px 8px', color: '#f87171' }}
                        title="Delete"
                      >
                        <Trash2 style={{ width: 11, height: 11 }} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredMessages.length === 0 && (
            <div className="card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              No motivation messages matched the selected filters.
            </div>
          )}
        </div>
      )}

      {/* TRIGGERS & COOLDOWNS TAB */}
      {activeTab === 'triggers' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '14px' }}>
          {triggers.map((trig) => (
            <div
              key={trig.triggerId}
              className="card"
              style={{
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                border: trig.enabled ? '1px solid var(--border-subtle)' : '1px dashed var(--border-subtle)',
                opacity: trig.enabled ? 1 : 0.65
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent-primary)' }}>
                  {trig.triggerId.toUpperCase()}
                </span>
                <button
                  className={`btn btn-sm ${trig.enabled ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => toggleTriggerStatus(trig.triggerId)}
                  style={{ fontSize: '0.72rem', padding: '2px 8px' }}
                >
                  {trig.enabled ? 'Enabled' : 'Disabled'}
                </button>
              </div>

              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                  {trig.title}
                </h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0, marginTop: '2px' }}>
                  {trig.description || `Trigger category: ${trig.category} (Ragebait level ${trig.ragebaitLevel})`}
                </p>
              </div>

              <div style={{ padding: '10px', backgroundColor: 'var(--bg-root)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', fontSize: '0.8rem', color: 'var(--text-primary)', lineHeight: '1.4' }}>
                💬 "{trig.templateMessage || trig.defaultMessage}"
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <span>Category: <strong>{trig.category}</strong></span>
                <span>Cooldown: <strong>{trig.cooldownSeconds}s</strong></span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit / Create Modal */}
      {editingMessage && (
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
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                {editingMessage.id ? 'Edit Motivation Popup' : 'Add New Motivation Popup'}
              </h3>
              <button
                onClick={() => setEditingMessage(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X style={{ width: 18, height: 18 }} />
              </button>
            </div>

            <form onSubmit={handleSaveMessage} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Message Template / Joke Text
                </label>
                <textarea
                  rows={3}
                  required
                  className="select-field"
                  style={{ fontFamily: 'sans-serif', resize: 'vertical' }}
                  value={editingMessage.template || ''}
                  onChange={(e) => setEditingMessage({ ...editingMessage, template: e.target.value })}
                />
              </div>

              <div className="grid-2" style={{ gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    Trigger Category
                  </label>
                  <select
                    className="select-field"
                    value={editingMessage.category || 'FAILED_ATTEMPTS'}
                    onChange={(e) => setEditingMessage({ ...editingMessage, category: e.target.value as any })}
                  >
                    {ALL_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    Personality Style
                  </label>
                  <select
                    className="select-field"
                    value={editingMessage.personality || 'funny'}
                    onChange={(e) => setEditingMessage({ ...editingMessage, personality: e.target.value as any })}
                  >
                    <option value="funny">Funny</option>
                    <option value="sarcastic">Sarcastic</option>
                    <option value="playful">Playful</option>
                    <option value="cs_chaos">CS Chaos</option>
                  </select>
                </div>
              </div>

              <div className="grid-2" style={{ gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    Badge Title
                  </label>
                  <input
                    type="text"
                    required
                    className="select-field"
                    value={editingMessage.badgeTitle || ''}
                    onChange={(e) => setEditingMessage({ ...editingMessage, badgeTitle: e.target.value })}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    Badge Color Accent
                  </label>
                  <select
                    className="select-field"
                    value={editingMessage.badgeVariant || 'blue'}
                    onChange={(e) => setEditingMessage({ ...editingMessage, badgeVariant: e.target.value as any })}
                  >
                    <option value="blue">Blue</option>
                    <option value="pink">Pink</option>
                    <option value="amber">Amber</option>
                    <option value="purple">Purple</option>
                    <option value="green">Green</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
                <button type="button" onClick={() => setEditingMessage(null)} className="btn btn-outline btn-sm">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  Save Popup
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewMessage && (
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
              maxWidth: '440px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              border: `2px solid ${getVariantColor(previewMessage.badgeVariant)}`,
              boxShadow: `0 10px 30px ${getVariantColor(previewMessage.badgeVariant)}25`
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '3px 10px',
                    borderRadius: '12px',
                    backgroundColor: `${getVariantColor(previewMessage.badgeVariant)}20`,
                    color: getVariantColor(previewMessage.badgeVariant),
                    border: `1px solid ${getVariantColor(previewMessage.badgeVariant)}40`
                  }}
                >
                  {previewMessage.badgeTitle}
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  ({previewMessage.personality})
                </span>
              </div>
              <button onClick={() => setPreviewMessage(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X style={{ width: 18, height: 18 }} />
              </button>
            </div>

            <div style={{ fontSize: '1rem', color: 'var(--text-primary)', lineHeight: 1.5, fontWeight: 500 }}>
              "{previewMessage.template}"
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                Target: {previewMessage.category}
              </span>
              <button
                onClick={() => {
                  handleTestPopup(previewMessage);
                  setPreviewMessage(null);
                }}
                className="btn btn-primary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Play style={{ width: 12, height: 12 }} />
                <span>Test Live Popup</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
