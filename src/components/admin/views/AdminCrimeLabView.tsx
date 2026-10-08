import React, { useState } from 'react';
import { 
  crimeLabTopics, 
  crimeLabQuestionsData, 
  validateCrimeLabCase 
} from '../../../data/crimeLabData';
import type { 
  CrimeLabCase 
} from '../../../data/crimeLabData';
import { Plus, Edit2, Trash2, X, Eye } from 'lucide-react';
import { Badge } from '../../common/Badge';

import { useAuth } from '../../../context/AuthContext';
import { adminContentService } from '../../../services/adminContentService';

interface AdminCrimeLabViewProps {
  searchQuery: string;
  onShowDevNotice: (msg: string) => void;
}

export const AdminCrimeLabView: React.FC<AdminCrimeLabViewProps> = ({ searchQuery, onShowDevNotice }) => {
  const { token } = useAuth();
  const [cases, setCases] = useState<CrimeLabCase[]>(() => {
    try {
      const saved = localStorage.getItem('algorise_admin_crimelab_cases_v2');
      return saved ? JSON.parse(saved) : crimeLabQuestionsData;
    } catch {
      return crimeLabQuestionsData;
    }
  });

  const [editingCase, setEditingCase] = useState<Partial<CrimeLabCase> | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const refreshCases = async () => {
    try {
      const list = await adminContentService.getCrimeLabAsync(token);
      if (Array.isArray(list) && list.length > 0) {
        setCases(list);
        localStorage.setItem('algorise_admin_crimelab_cases_v2', JSON.stringify(list));
      }
    } catch {
      // Use fallback
    }
  };

  React.useEffect(() => {
    refreshCases();
  }, [token]);

  const saveCasesToStore = async (updatedCases: CrimeLabCase[], mutatedCase?: CrimeLabCase) => {
    setCases(updatedCases);
    try {
      localStorage.setItem('algorise_admin_crimelab_cases_v2', JSON.stringify(updatedCases));
      if (mutatedCase) {
        await adminContentService.saveCrimeLabCaseAsync(token, mutatedCase);
      }
    } catch {
      // Ignore
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCase) return;

    const validation = validateCrimeLabCase(editingCase);
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return;
    }
    setValidationErrors([]);

    const caseNumber = editingCase.caseNumber || (cases.length + 1);
    const newCase: CrimeLabCase = {
      id: editingCase.id || `crime-${Date.now()}`,
      caseNumber,
      slug: (editingCase.title || 'untitled').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      title: editingCase.title || 'New Crime Lab Case',
      category: editingCase.category || 'Cybersecurity',
      difficulty: (editingCase.difficulty as any) || 'Intermediate',
      summary: editingCase.summary || editingCase.problemStatement?.slice(0, 100) || '',
      problemStatement: editingCase.problemStatement || '',
      objective: editingCase.objective || '',
      evidence: editingCase.evidence || [],
      question: editingCase.question || editingCase.objective || '',
      answerOptions: editingCase.answerOptions || [
        { id: 'opt-a', text: 'Option A' },
        { id: 'opt-b', text: 'Option B' },
        { id: 'opt-c', text: 'Option C' },
        { id: 'opt-d', text: 'Option D' }
      ],
      correctAnswerId: editingCase.correctAnswerId || 'opt-a',
      hints: editingCase.hints || [
        { id: 'h-1', level: 1, title: 'Hint 1: Small Nudge', content: 'Look at the logs.' },
        { id: 'h-2', level: 2, title: 'Hint 2: Direction', content: 'Check permissions.' },
        { id: 'h-3', level: 3, title: 'Hint 3: Reasoning Clue', content: 'Focus on option A.' }
      ],
      explanation: editingCase.explanation || {
        answerReason: 'Selected option correctly resolves the flaw.',
        evidenceReasoning: ['Observed evidence demonstrates security breach.']
      },
      learningPoints: editingCase.learningPoints || ['Evidence analysis'],
      status: (editingCase.status as any) || 'active',
      createdAt: editingCase.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    let updatedList: CrimeLabCase[];
    if (editingCase.id) {
      updatedList = cases.map(c => c.id === editingCase.id ? newCase : c);
    } else {
      updatedList = [newCase, ...cases];
    }

    saveCasesToStore(updatedList, newCase);
    setEditingCase(null);
    setIsPreviewMode(false);
    onShowDevNotice(`Crime Lab Case "${newCase.title}" saved successfully.`);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete case "${title}"?`)) return;
    const updated = cases.filter(c => c.id !== id);
    saveCasesToStore(updated);
    try {
      await adminContentService.deleteCrimeLabCaseAsync(token, id);
    } catch {
      // Ignore
    }
    onShowDevNotice(`Case "${title}" deleted.`);
  };

  const filteredCases = cases.filter(c =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.caseNumber.toString().includes(searchQuery)
  );

  const handleCreateNew = () => {
    setEditingCase({
      caseNumber: cases.length + 1,
      title: '',
      category: 'Web Security',
      difficulty: 'Intermediate',
      summary: '',
      problemStatement: '',
      objective: '',
      evidence: [
        {
          id: 'ev-1',
          type: 'log',
          title: 'Evidence 1: Server Authentication Log',
          content: '02:14 AM - User #1004 requested /api/profile?account_id=1005',
          timestamp: '02:14 AM',
          source: 'Authentication Gateway',
          importance: 'high'
        }
      ],
      question: 'Which vulnerability allowed unauthorized access?',
      answerOptions: [
        { id: 'opt-a', text: 'Insecure Direct Object Reference (IDOR)' },
        { id: 'opt-b', text: 'Cross-Site Request Forgery (CSRF)' },
        { id: 'opt-c', text: 'Server-Side Request Forgery (SSRF)' },
        { id: 'opt-d', text: 'SQL Injection' }
      ],
      correctAnswerId: 'opt-a',
      hints: [
        { id: 'h-1', level: 1, title: 'Hint 1: Small Nudge', content: 'Look at the account_id URL parameter.' },
        { id: 'h-2', level: 2, title: 'Hint 2: Direction', content: 'Does the server check ownership of account_id=1005?' },
        { id: 'h-3', level: 3, title: 'Hint 3: Reasoning Clue', content: 'Unvalidated direct object references allow IDOR.' }
      ],
      explanation: {
        answerReason: 'The server accepts unvalidated account IDs in query parameters.',
        evidenceReasoning: [
          'Evidence 1 confirms user #1004 accessed account #1005 payload directly.',
          'Server trusted client input without ownership validation.'
        ]
      },
      learningPoints: ['Understanding IDOR vulnerabilities', 'Implementing server-side authorization checks'],
      status: 'active'
    });
    setValidationErrors([]);
    setIsPreviewMode(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="card" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            Forensic Crime Lab Case Management ({cases.length} Total Cases)
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0, marginTop: '2px' }}>
            Create, edit, validate, and preview structured Crime Lab investigation scenarios.
          </p>
        </div>

        <button
          onClick={handleCreateNew}
          className="btn btn-primary btn-sm"
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Plus style={{ width: 14, height: 14 }} />
          <span>Add New Forensic Case</span>
        </button>
      </div>

      <div className="card" style={{ padding: '20px' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', textAlign: 'left', color: 'var(--text-muted)' }}>
                <th style={{ padding: '10px 12px' }}>Case #</th>
                <th style={{ padding: '10px 12px' }}>Title</th>
                <th style={{ padding: '10px 12px' }}>Category</th>
                <th style={{ padding: '10px 12px' }}>Difficulty</th>
                <th style={{ padding: '10px 12px' }}>Status</th>
                <th style={{ padding: '10px 12px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCases.map((c) => (
                <tr key={c.id} style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }}>
                  <td style={{ padding: '12px', fontWeight: 700, color: 'var(--hard-color)' }}>{c.caseNumber}</td>
                  <td style={{ padding: '12px', fontWeight: 600 }}>{c.title}</td>
                  <td style={{ padding: '12px', color: 'var(--accent-primary)', fontWeight: 600 }}>{c.category}</td>
                  <td style={{ padding: '12px' }}>
                    <Badge variant={c.difficulty === 'Beginner' || (c.difficulty as any) === 'Easy' ? 'easy' : c.difficulty === 'Intermediate' || (c.difficulty as any) === 'Medium' ? 'medium' : 'hard'}>
                      {c.difficulty}
                    </Badge>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ fontSize: '0.72rem', padding: '2px 6px', borderRadius: '4px', backgroundColor: c.status === 'active' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)', color: c.status === 'active' ? '#10b981' : '#f87171', fontWeight: 700 }}>
                      {c.status.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                      <button onClick={() => { setEditingCase(c); setIsPreviewMode(false); }} className="btn btn-outline btn-sm" style={{ padding: '4px 8px' }}>
                        <Edit2 style={{ width: 12, height: 12 }} />
                      </button>
                      <button onClick={() => handleDelete(c.id, c.title)} className="btn btn-outline btn-sm" style={{ padding: '4px 8px', color: '#f87171', borderColor: 'rgba(239, 68, 68, 0.3)' }}>
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

      {/* EDIT & PREVIEW MODAL */}
      {editingCase && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(4px)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div className="card" style={{ width: '100%', maxWidth: '820px', maxHeight: '90vh', overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                  {editingCase.id ? `Edit Crime Lab Case #${editingCase.caseNumber}` : 'Create New Forensic Crime Lab Case'}
                </h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Configure structured problem statement, evidence items, answer options, hints, and explanations.
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button
                  type="button"
                  className={`btn btn-sm ${isPreviewMode ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setIsPreviewMode(!isPreviewMode)}
                >
                  <Eye style={{ width: 14, height: 14 }} />
                  <span>{isPreviewMode ? 'Back to Editor' : 'Live Preview'}</span>
                </button>

                <button onClick={() => setEditingCase(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                  <X style={{ width: 20, height: 20 }} />
                </button>
              </div>
            </div>

            {/* Validation Error Notices */}
            {validationErrors.length > 0 && (
              <div style={{ padding: '12px 14px', backgroundColor: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.4)', borderRadius: 'var(--radius-md)', color: '#f87171', fontSize: '0.84rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <strong>⚠️ Case Validation Errors (Please fix before saving):</strong>
                {validationErrors.map((err, idx) => (
                  <div key={idx}>• {err}</div>
                ))}
              </div>
            )}

            {/* PREVIEW MODE */}
            {isPreviewMode ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: 'var(--bg-root)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <Badge variant="blue">{editingCase.category || 'Cybersecurity'}</Badge>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>
                  Case {editingCase.caseNumber || 1} — {editingCase.title || 'Untitled Case'}
                </h3>
                
                <div style={{ fontSize: '0.86rem', color: 'var(--text-primary)', whiteSpace: 'pre-line', padding: '12px', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-md)' }}>
                  {editingCase.problemStatement || 'No problem statement.'}
                </div>

                <strong style={{ fontSize: '0.85rem' }}>Objective: {editingCase.objective}</strong>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <strong style={{ fontSize: '0.85rem' }}>Evidence ({editingCase.evidence?.length || 0}):</strong>
                  {editingCase.evidence?.map((ev, i) => (
                    <div key={i} style={{ padding: '8px 12px', backgroundColor: 'var(--bg-surface)', borderRadius: '4px', fontSize: '0.8rem' }}>
                      <strong>{ev.title}:</strong> {ev.content}
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <strong style={{ fontSize: '0.85rem' }}>Answer Options:</strong>
                  {editingCase.answerOptions?.map((opt, i) => (
                    <div key={opt.id} style={{ padding: '8px 12px', borderRadius: '4px', backgroundColor: opt.id === editingCase.correctAnswerId ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-surface)', border: opt.id === editingCase.correctAnswerId ? '1px solid #10b981' : '1px solid var(--border-subtle)', fontSize: '0.82rem' }}>
                      Option {['A', 'B', 'C', 'D'][i]}: {opt.text} {opt.id === editingCase.correctAnswerId && '✅ (Correct Answer)'}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* EDITOR FORM */
              <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="grid-2" style={{ gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Case Title</label>
                    <input type="text" required className="select-field" value={editingCase.title || ''} onChange={(e) => setEditingCase({ ...editingCase, title: e.target.value })} />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Category</label>
                    <select className="select-field" value={editingCase.category || 'Cybersecurity'} onChange={(e) => setEditingCase({ ...editingCase, category: e.target.value })}>
                      {crimeLabTopics.filter(t => t !== 'All Topics').map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid-2" style={{ gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Difficulty</label>
                    <select className="select-field" value={editingCase.difficulty || 'Intermediate'} onChange={(e) => setEditingCase({ ...editingCase, difficulty: e.target.value as any })}>
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Status</label>
                    <select className="select-field" value={editingCase.status || 'active'} onChange={(e) => setEditingCase({ ...editingCase, status: e.target.value as any })}>
                      <option value="active">Active (Published)</option>
                      <option value="draft">Draft</option>
                      <option value="disabled">Disabled</option>
                    </select>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Correct Answer ID</label>
                    <select className="select-field" value={editingCase.correctAnswerId || 'opt-a'} onChange={(e) => setEditingCase({ ...editingCase, correctAnswerId: e.target.value })}>
                      {editingCase.answerOptions?.map((opt, i) => (
                        <option key={opt.id} value={opt.id}>Option {['A', 'B', 'C', 'D'][i]} ({opt.id})</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Problem Statement</label>
                  <textarea rows={4} className="select-field" value={editingCase.problemStatement || ''} onChange={(e) => setEditingCase({ ...editingCase, problemStatement: e.target.value })} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Investigative Objective</label>
                  <input type="text" className="select-field" value={editingCase.objective || ''} onChange={(e) => setEditingCase({ ...editingCase, objective: e.target.value, question: e.target.value })} />
                </div>

                {/* ANSWER OPTIONS A-D */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Answer Options (A, B, C, D)</label>
                  {editingCase.answerOptions?.map((opt, idx) => (
                    <div key={opt.id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-primary)', width: '70px' }}>
                        Option {['A', 'B', 'C', 'D'][idx]}:
                      </span>
                      <input
                        type="text"
                        className="select-field"
                        style={{ flex: 1 }}
                        value={opt.text}
                        onChange={(e) => {
                          const updated = [...(editingCase.answerOptions || [])];
                          updated[idx] = { ...updated[idx], text: e.target.value };
                          setEditingCase({ ...editingCase, answerOptions: updated });
                        }}
                      />
                    </div>
                  ))}
                </div>

                {/* HINTS 1, 2, 3 */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Progressive Hints (Levels 1, 2, 3)</label>
                  {editingCase.hints?.map((hintObj, idx) => (
                    <div key={hintObj.id} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Hint {idx + 1} (Level {hintObj.level}):</span>
                      <input
                        type="text"
                        className="select-field"
                        value={hintObj.content}
                        onChange={(e) => {
                          const updated = [...(editingCase.hints || [])];
                          updated[idx] = { ...updated[idx], content: e.target.value };
                          setEditingCase({ ...editingCase, hints: updated });
                        }}
                      />
                    </div>
                  ))}
                </div>

                {/* EXPLANATION */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Forensic Explanation</label>
                  <textarea rows={3} className="select-field" value={editingCase.explanation?.answerReason || ''} onChange={(e) => setEditingCase({ ...editingCase, explanation: { answerReason: e.target.value, evidenceReasoning: editingCase.explanation?.evidenceReasoning || ['Analyzed forensic logs.'] } })} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
                  <button type="button" onClick={() => setEditingCase(null)} className="btn btn-outline btn-sm">Cancel</button>
                  <button type="submit" className="btn btn-primary btn-sm">Save & Publish Case</button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}
    </div>
  );
};
