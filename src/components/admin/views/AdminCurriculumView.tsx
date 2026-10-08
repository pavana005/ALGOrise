import React, { useState } from 'react';
import { adminContentService } from '../../../services/adminContentService';
import type { AdminCurriculumTopic } from '../../../services/adminContentService';
import { useAuth } from '../../../context/AuthContext';
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Layers,
  Clock
} from 'lucide-react';

interface AdminCurriculumViewProps {
  searchQuery: string;
  onShowDevNotice: (msg: string) => void;
}

export const AdminCurriculumView: React.FC<AdminCurriculumViewProps> = ({ searchQuery, onShowDevNotice }) => {
  const { token } = useAuth();
  const [topics, setTopics] = useState<AdminCurriculumTopic[]>(() => adminContentService.getCurriculum(token));
  const [editingTopic, setEditingTopic] = useState<Partial<AdminCurriculumTopic> | null>(null);

  const refreshTopics = async () => {
    try {
      const list = await adminContentService.getCurriculumAsync(token);
      setTopics(list);
    } catch {
      setTopics(adminContentService.getCurriculum(token));
    }
  };

  React.useEffect(() => {
    refreshTopics();
  }, [token]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTopic?.title) return;
    try {
      await adminContentService.saveCurriculumTopicAsync(token, editingTopic);
      await refreshTopics();
      setEditingTopic(null);
      onShowDevNotice(`Curriculum topic "${editingTopic.title}" saved.`);
    } catch (err: any) {
      alert(err?.message || 'Failed to save curriculum topic');
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete topic "${title}"?`)) return;
    try {
      await adminContentService.deleteCurriculumTopicAsync(token, id);
      await refreshTopics();
      onShowDevNotice(`Curriculum topic "${title}" deleted.`);
    } catch (err: any) {
      alert(err?.message || 'Failed to delete curriculum topic');
    }
  };

  const filteredTopics = topics.filter(
    (t) =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div className="card" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            DSA Curriculum & Learning Path Manager
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0, marginTop: '2px' }}>
            Structure topics, lesson counts, estimated completion hours, and progression paths.
          </p>
        </div>

        <button
          onClick={() =>
            setEditingTopic({
              title: '',
              description: 'Enter module overview and core algorithmic concepts...',
              lessonsCount: 6,
              difficulty: 'Intermediate',
              estimatedHours: 4,
              status: 'active'
            })
          }
          className="btn btn-primary btn-sm"
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Plus style={{ width: 14, height: 14 }} />
          <span>Add Curriculum Module</span>
        </button>
      </div>

      {/* Curriculum Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
        {filteredTopics.map((topic) => (
          <div key={topic.id} className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: '10px', backgroundColor: 'rgba(99, 102, 241, 0.15)', color: 'var(--accent-primary)' }}>
                  {topic.difficulty}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <button onClick={() => setEditingTopic(topic)} className="btn btn-outline btn-sm" style={{ padding: '4px 8px' }}>
                    <Edit2 style={{ width: 12, height: 12 }} />
                  </button>
                  <button onClick={() => handleDelete(topic.id, topic.title)} className="btn btn-outline btn-sm" style={{ padding: '4px 8px', color: '#f87171', borderColor: 'rgba(239, 68, 68, 0.3)' }}>
                    <Trash2 style={{ width: 12, height: 12 }} />
                  </button>
                </div>
              </div>

              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0, marginBottom: '6px' }}>
                {topic.title}
              </h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                {topic.description}
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.78rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Layers style={{ width: 14, height: 14 }} />
                <span>{topic.lessonsCount} Lessons</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock style={{ width: 14, height: 14 }} />
                <span>{topic.estimatedHours} Hours</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingTopic && (
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
          <div className="card" style={{ width: '100%', maxWidth: '520px', padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                {editingTopic.id ? 'Edit Curriculum Module' : 'Add Curriculum Module'}
              </h3>
              <button onClick={() => setEditingTopic(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X style={{ width: 20, height: 20 }} />
              </button>
            </div>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Module Title</label>
                <input
                  type="text"
                  required
                  className="select-field"
                  value={editingTopic.title || ''}
                  onChange={(e) => setEditingTopic({ ...editingTopic, title: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Description</label>
                <textarea
                  rows={3}
                  className="select-field"
                  value={editingTopic.description || ''}
                  onChange={(e) => setEditingTopic({ ...editingTopic, description: e.target.value })}
                />
              </div>

              <div className="grid-2" style={{ gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Difficulty</label>
                  <select
                    className="select-field"
                    value={editingTopic.difficulty || 'Intermediate'}
                    onChange={(e) => setEditingTopic({ ...editingTopic, difficulty: e.target.value })}
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Lessons</label>
                  <input
                    type="number"
                    required
                    min={1}
                    className="select-field"
                    value={editingTopic.lessonsCount || 6}
                    onChange={(e) => setEditingTopic({ ...editingTopic, lessonsCount: parseInt(e.target.value) || 1 })}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Est. Hours</label>
                  <input
                    type="number"
                    required
                    min={1}
                    className="select-field"
                    value={editingTopic.estimatedHours || 4}
                    onChange={(e) => setEditingTopic({ ...editingTopic, estimatedHours: parseInt(e.target.value) || 1 })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
                <button type="button" onClick={() => setEditingTopic(null)} className="btn btn-outline btn-sm">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  Save Module
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
