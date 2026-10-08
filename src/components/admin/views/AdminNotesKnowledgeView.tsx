import React, { useState, useEffect } from 'react';
import { adminContentService } from '../../../services/adminContentService';
import type { AdminNote } from '../../../services/adminContentService';
import { useAuth } from '../../../context/AuthContext';
import { Plus, Edit2, Trash2, X, Loader2 } from 'lucide-react';

interface AdminNotesKnowledgeViewProps {
  searchQuery: string;
  onShowDevNotice: (msg: string) => void;
}

export const AdminNotesKnowledgeView: React.FC<AdminNotesKnowledgeViewProps> = ({ searchQuery, onShowDevNotice }) => {
  const { token } = useAuth();
  const [notes, setNotes] = useState<AdminNote[]>(() => adminContentService.getNotes(token));
  const [editingNote, setEditingNote] = useState<Partial<AdminNote> | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const refreshNotes = () => {
    adminContentService.getNotesAsync(token).then((data) => {
      if (data) setNotes(data);
    });
  };

  useEffect(() => {
    refreshNotes();
  }, [token]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNote?.title) return;
    setIsSaving(true);
    try {
      await adminContentService.saveNoteAsync(token, editingNote);
      refreshNotes();
      setEditingNote(null);
      onShowDevNotice('Study Note / Knowledge Base entry saved.');
    } catch (err: any) {
      onShowDevNotice(`Failed to save note: ${err.message || 'Error'}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete note "${title}"?`)) return;
    try {
      await adminContentService.deleteNoteAsync(token, id);
      refreshNotes();
      onShowDevNotice('Study Note deleted.');
    } catch (err: any) {
      onShowDevNotice(`Failed to delete note: ${err.message || 'Error'}`);
    }
  };

  const filteredNotes = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.topic.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="card" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            Study Notes & CS Knowledge Base Dictionary
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0, marginTop: '2px' }}>
            Publish reference markdown cheatsheets, asymptotic complexity charts, and CS definitions.
          </p>
        </div>

        <button
          onClick={() =>
            setEditingNote({
              title: '',
              topic: 'Data Structures',
              author: 'ALGOrise Staff',
              status: 'published'
            })
          }
          className="btn btn-primary btn-sm"
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Plus style={{ width: 14, height: 14 }} />
          <span>Add Study Note</span>
        </button>
      </div>

      <div className="card" style={{ padding: '20px' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', textAlign: 'left', color: 'var(--text-muted)' }}>
                <th style={{ padding: '10px 12px' }}>Note Title</th>
                <th style={{ padding: '10px 12px' }}>Topic</th>
                <th style={{ padding: '10px 12px' }}>Author</th>
                <th style={{ padding: '10px 12px' }}>Last Updated</th>
                <th style={{ padding: '10px 12px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredNotes.map((n) => (
                <tr key={n.id} style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }}>
                  <td style={{ padding: '12px', fontWeight: 600 }}>{n.title}</td>
                  <td style={{ padding: '12px', color: 'var(--accent-primary)', fontWeight: 600 }}>{n.topic}</td>
                  <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>{n.author}</td>
                  <td style={{ padding: '12px', color: 'var(--text-muted)' }}>{n.updatedAt}</td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                      <button onClick={() => setEditingNote(n)} className="btn btn-outline btn-sm" style={{ padding: '4px 8px' }}>
                        <Edit2 style={{ width: 12, height: 12 }} />
                      </button>
                      <button onClick={() => handleDelete(n.id, n.title)} className="btn btn-outline btn-sm" style={{ padding: '4px 8px', color: '#f87171', borderColor: 'rgba(239, 68, 68, 0.3)' }}>
                        <Trash2 style={{ width: 12, height: 12 }} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editingNote && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(4px)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div className="card" style={{ width: '100%', maxWidth: '520px', padding: '28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                Edit Study Note Entry
              </h3>
              <button onClick={() => setEditingNote(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X style={{ width: 20, height: 20 }} />
              </button>
            </div>
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <input type="text" placeholder="Note Title" required className="select-field" value={editingNote.title || ''} onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })} />
              <div className="grid-2" style={{ gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <input type="text" placeholder="Topic Category" required className="select-field" value={editingNote.topic || ''} onChange={(e) => setEditingNote({ ...editingNote, topic: e.target.value })} />
                <input type="text" placeholder="Author" required className="select-field" value={editingNote.author || ''} onChange={(e) => setEditingNote({ ...editingNote, author: e.target.value })} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => setEditingNote(null)} className="btn btn-outline btn-sm">Cancel</button>
                <button type="submit" disabled={isSaving} className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {isSaving && <Loader2 style={{ width: 14, height: 14, animation: 'spin 1s linear infinite' }} />}
                  <span>{isSaving ? 'Saving...' : 'Save Note'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
