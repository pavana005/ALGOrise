import React, { useState } from 'react';
import { adminContentService } from '../../../services/adminContentService';
import type { AdminProblem } from '../../../services/adminContentService';
import { useAuth } from '../../../context/AuthContext';
import {
  Plus,
  Edit2,
  Trash2,
  Trophy,
  Eye,
  X
} from 'lucide-react';

interface AdminProblemsViewProps {
  searchQuery: string;
  onShowDevNotice: (msg: string) => void;
}

export const AdminProblemsView: React.FC<AdminProblemsViewProps> = ({ searchQuery, onShowDevNotice }) => {
  const { token } = useAuth();
  const [problems, setProblems] = useState<AdminProblem[]>(() => adminContentService.getProblems(token));

  const [difficultyFilter, setDifficultyFilter] = useState<'all' | 'Easy' | 'Medium' | 'Hard'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | '3000plus' | 'standard'>('all');

  const [editingProblem, setEditingProblem] = useState<Partial<AdminProblem> | null>(null);
  const [previewProblem, setPreviewProblem] = useState<AdminProblem | null>(null);

  const refreshProblems = async () => {
    try {
      const list = await adminContentService.getProblemsAsync(token);
      setProblems(list);
    } catch {
      setProblems(adminContentService.getProblems(token));
    }
  };

  React.useEffect(() => {
    refreshProblems();
  }, [token]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProblem?.title) return;
    try {
      const saved = await adminContentService.saveProblemAsync(token, editingProblem);
      if (saved && saved.id) {
        adminContentService.saveProblemDetailOverride(token, saved.id, {
          title: editingProblem.title,
          description: editingProblem.description,
          difficulty: editingProblem.difficulty,
          topic: editingProblem.topic,
          pattern: editingProblem.pattern,
          hints: editingProblem.hints,
          commonConcept: editingProblem.explanation,
          codeTemplates: editingProblem.solutionCode ? { python: editingProblem.solutionCode, javascript: editingProblem.solutionCode } : undefined
        });
      }
      await refreshProblems();
      setEditingProblem(null);
      onShowDevNotice(`Problem "${editingProblem.title}" saved & synchronized across all difficulty levels.`);
    } catch (err: any) {
      alert(err?.message || 'Failed to save problem');
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete problem "${title}"?`)) return;
    try {
      await adminContentService.deleteProblemAsync(token, id);
      await refreshProblems();
      onShowDevNotice(`Problem "${title}" deleted.`);
    } catch (err: any) {
      alert(err?.message || 'Failed to delete problem');
    }
  };

  const filteredProblems = problems.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.pattern.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDiff = difficultyFilter === 'all' || p.difficulty === difficultyFilter;
    const matchesType =
      typeFilter === 'all' ||
      (typeFilter === '3000plus' && p.is3000Level) ||
      (typeFilter === 'standard' && !p.is3000Level);

    return matchesSearch && matchesDiff && matchesType;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Action Header */}
      <div className="card" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            DSA Problem Set & 3000+ Level Questions
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0, marginTop: '2px' }}>
            Add, edit, organize, or flag rating 3000+ competitive programming questions.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Difficulty filter */}
          <select
            className="select-field"
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value as any)}
            style={{ fontSize: '0.8rem', padding: '6px 12px' }}
          >
            <option value="all">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>

          {/* Type filter */}
          <select
            className="select-field"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
            style={{ fontSize: '0.8rem', padding: '6px 12px' }}
          >
            <option value="all">All Problem Types</option>
            <option value="3000plus">3000+ Level Only</option>
            <option value="standard">Standard Problems</option>
          </select>

          <button
            onClick={() =>
              setEditingProblem({
                title: '',
                difficulty: 'Easy',
                topic: 'Arrays & Hashing',
                pattern: 'Two Pointers',
                acceptance: '75.0%',
                is3000Level: false,
                status: 'published',
                description: 'Enter problem description...',
                solutionCode: 'class Solution:\n    def solve(self):\n        pass'
              })
            }
            className="btn btn-primary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Plus style={{ width: 14, height: 14 }} />
            <span>Add New Problem</span>
          </button>
        </div>
      </div>

      {/* Problems Table */}
      <div className="card" style={{ padding: '20px' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', textAlign: 'left', color: 'var(--text-muted)' }}>
                <th style={{ padding: '10px 12px' }}>#</th>
                <th style={{ padding: '10px 12px' }}>Title</th>
                <th style={{ padding: '10px 12px' }}>Difficulty</th>
                <th style={{ padding: '10px 12px' }}>Topic & Pattern</th>
                <th style={{ padding: '10px 12px' }}>3000+ Level</th>
                <th style={{ padding: '10px 12px' }}>Acceptance</th>
                <th style={{ padding: '10px 12px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProblems.map((p) => (
                <tr key={p.id} style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }}>
                  <td style={{ padding: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>
                    {p.displayNumber}
                  </td>
                  <td style={{ padding: '12px', fontWeight: 600 }}>
                    {p.title}
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span
                      style={{
                        padding: '3px 8px',
                        borderRadius: '12px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        backgroundColor:
                          p.difficulty === 'Easy'
                            ? 'rgba(16, 185, 129, 0.15)'
                            : p.difficulty === 'Medium'
                            ? 'rgba(245, 158, 11, 0.15)'
                            : 'rgba(239, 68, 68, 0.15)',
                        color:
                          p.difficulty === 'Easy'
                            ? '#10b981'
                            : p.difficulty === 'Medium'
                            ? '#f59e0b'
                            : '#f87171'
                      }}
                    >
                      {p.difficulty}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ fontWeight: 600 }}>{p.topic}</div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{p.pattern}</div>
                  </td>
                  <td style={{ padding: '12px' }}>
                    {p.is3000Level ? (
                      <span style={{ padding: '2px 8px', borderRadius: '10px', fontSize: '0.72rem', fontWeight: 700, backgroundColor: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.4)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Trophy style={{ width: 12, height: 12 }} />
                        <span>3000+ Rating</span>
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Standard</span>
                    )}
                  </td>
                  <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>{p.acceptance}</td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                      <button
                        onClick={() => setPreviewProblem(p)}
                        className="btn btn-outline btn-sm"
                        style={{ padding: '4px 8px' }}
                        title="Preview Problem"
                      >
                        <Eye style={{ width: 12, height: 12 }} />
                      </button>
                      <button
                        onClick={() => setEditingProblem(p)}
                        className="btn btn-outline btn-sm"
                        style={{ padding: '4px 8px' }}
                        title="Edit Problem"
                      >
                        <Edit2 style={{ width: 12, height: 12 }} />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id, p.title)}
                        className="btn btn-outline btn-sm"
                        style={{ padding: '4px 8px', color: '#f87171', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                        title="Delete Problem"
                      >
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

      {/* Edit / Add Problem Modal */}
      {editingProblem && (
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
              maxWidth: '640px',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '28px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                {editingProblem.id ? 'Edit DSA Problem' : 'Create New DSA Problem'}
              </h3>
              <button
                onClick={() => setEditingProblem(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X style={{ width: 20, height: 20 }} />
              </button>
            </div>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Problem Title</label>
                <input
                  type="text"
                  required
                  className="select-field"
                  value={editingProblem.title || ''}
                  onChange={(e) => setEditingProblem({ ...editingProblem, title: e.target.value })}
                />
              </div>

              <div className="grid-2" style={{ gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Difficulty</label>
                  <select
                    className="select-field"
                    value={editingProblem.difficulty || 'Easy'}
                    onChange={(e) => setEditingProblem({ ...editingProblem, difficulty: e.target.value as any })}
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Topic Category</label>
                  <input
                    type="text"
                    required
                    className="select-field"
                    value={editingProblem.topic || ''}
                    onChange={(e) => setEditingProblem({ ...editingProblem, topic: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid-2" style={{ gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Algorithmic Pattern</label>
                  <input
                    type="text"
                    required
                    className="select-field"
                    value={editingProblem.pattern || ''}
                    onChange={(e) => setEditingProblem({ ...editingProblem, pattern: e.target.value })}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '24px' }}>
                  <input
                    type="checkbox"
                    id="is3000LevelChk"
                    checked={!!editingProblem.is3000Level}
                    onChange={(e) => setEditingProblem({ ...editingProblem, is3000Level: e.target.checked })}
                  />
                  <label htmlFor="is3000LevelChk" style={{ fontSize: '0.84rem', color: '#f59e0b', fontWeight: 600, cursor: 'pointer' }}>
                    Flag as 3000+ Rating Level
                  </label>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Problem Description</label>
                <textarea
                  rows={4}
                  className="select-field"
                  style={{ fontFamily: 'sans-serif', resize: 'vertical' }}
                  value={editingProblem.description || ''}
                  onChange={(e) => setEditingProblem({ ...editingProblem, description: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Solution Code</label>
                <textarea
                  rows={4}
                  className="select-field"
                  style={{ fontFamily: 'monospace', fontSize: '0.82rem', resize: 'vertical' }}
                  value={editingProblem.solutionCode || ''}
                  onChange={(e) => setEditingProblem({ ...editingProblem, solutionCode: e.target.value })}
                />
              </div>

              {/* Hints Management */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Problem Hints (3 progressive levels)
                </label>
                <input
                  type="text"
                  placeholder="Hint 1: Initial insight or optimal data structure selection..."
                  className="select-field"
                  value={editingProblem.hints?.[0] || ''}
                  onChange={(e) => {
                    const h = [...(editingProblem.hints || ['', '', ''])];
                    h[0] = e.target.value;
                    setEditingProblem({ ...editingProblem, hints: h });
                  }}
                />
                <input
                  type="text"
                  placeholder="Hint 2: Algorithmic strategy, state transition, or invariant..."
                  className="select-field"
                  value={editingProblem.hints?.[1] || ''}
                  onChange={(e) => {
                    const h = [...(editingProblem.hints || ['', '', ''])];
                    h[1] = e.target.value;
                    setEditingProblem({ ...editingProblem, hints: h });
                  }}
                />
                <input
                  type="text"
                  placeholder="Hint 3: Optimal time and space complexity walkthrough..."
                  className="select-field"
                  value={editingProblem.hints?.[2] || ''}
                  onChange={(e) => {
                    const h = [...(editingProblem.hints || ['', '', ''])];
                    h[2] = e.target.value;
                    setEditingProblem({ ...editingProblem, hints: h });
                  }}
                />
              </div>

              {/* Explanation / Editorial */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Problem Explanation / Editorial Walkthrough
                </label>
                <textarea
                  rows={3}
                  className="select-field"
                  style={{ fontFamily: 'sans-serif', resize: 'vertical' }}
                  placeholder="Explain optimal strategy, intuition, invariants, and complexity trade-offs..."
                  value={editingProblem.explanation || ''}
                  onChange={(e) => setEditingProblem({ ...editingProblem, explanation: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
                <button type="button" onClick={() => setEditingProblem(null)} className="btn btn-outline btn-sm">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewProblem && (
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
              maxWidth: '640px',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '28px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                  {previewProblem.displayNumber}. {previewProblem.title}
                </h3>
                {previewProblem.is3000Level && (
                  <span style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: '8px', backgroundColor: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b' }}>
                    3000+ Level
                  </span>
                )}
              </div>
              <button onClick={() => setPreviewProblem(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X style={{ width: 20, height: 20 }} />
              </button>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '6px', backgroundColor: 'var(--bg-root)', color: 'var(--accent-primary)', border: '1px solid var(--border-subtle)' }}>
                {previewProblem.difficulty}
              </span>
              <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '6px', backgroundColor: 'var(--bg-root)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }}>
                {previewProblem.topic}
              </span>
              <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '6px', backgroundColor: 'var(--bg-root)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }}>
                {previewProblem.pattern}
              </span>
            </div>

            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              {previewProblem.description}
            </div>

            {previewProblem.hints && previewProblem.hints.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', padding: '12px', backgroundColor: 'rgba(99, 102, 241, 0.05)', borderRadius: '8px', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-primary)' }}>Hints & Clues</span>
                {previewProblem.hints.map((hint, hIdx) => (
                  <div key={hIdx} style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    💡 <strong>Hint {hIdx + 1}:</strong> {hint}
                  </div>
                ))}
              </div>
            )}

            {previewProblem.explanation && (
              <div style={{ padding: '12px', backgroundColor: 'var(--bg-root)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>
                  Editorial Explanation
                </span>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                  {previewProblem.explanation}
                </p>
              </div>
            )}

            {previewProblem.solutionCode && (
              <pre style={{ padding: '12px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '8px', fontSize: '0.8rem', color: '#38bdf8', overflowX: 'auto', margin: 0 }}>
                {previewProblem.solutionCode}
              </pre>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setPreviewProblem(null)} className="btn btn-outline btn-sm">
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
