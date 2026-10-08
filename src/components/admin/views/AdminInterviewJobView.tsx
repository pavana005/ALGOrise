import React, { useState } from 'react';
import { adminContentService } from '../../../services/adminContentService';
import type { AdminInterviewQuestion, AdminJobRole } from '../../../services/adminContentService';
import { roundDefinitions } from '../../../data/interviewData';
import type { InterviewRoundType, ProgressionLevel } from '../../../data/interviewData';
import { Plus, Edit2, X, Eye, Trash2 } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

interface AdminInterviewJobViewProps {
  searchQuery: string;
  onShowDevNotice: (msg: string) => void;
}

export const AdminInterviewJobView: React.FC<AdminInterviewJobViewProps> = ({ searchQuery, onShowDevNotice }) => {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState<'interview' | 'jobs'>('interview');
  const store = adminContentService.loadStore();
  const [questions, setQuestions] = useState<AdminInterviewQuestion[]>(store.interviewQuestions);
  const [jobRoles, setJobRoles] = useState<AdminJobRole[]>(store.jobRoles);

  // Filters for Admin View
  const [selectedRoundFilter, setSelectedRoundFilter] = useState<string>('All');

  const [editingQuestion, setEditingQuestion] = useState<Partial<AdminInterviewQuestion & {
    round?: InterviewRoundType;
    level?: ProgressionLevel;
    thinkFirstPrompt?: string;
    answer?: string;
    whatInterviewerEvaluates?: string[];
  }> | null>(null);

  const [previewQuestion, setPreviewQuestion] = useState<any | null>(null);

  const [editingJob, setEditingJob] = useState<Partial<AdminJobRole> | null>(null);

  const refreshData = async () => {
    try {
      const qList = await adminContentService.getInterviewsAsync(token);
      const jList = await adminContentService.getJobRolesAsync(token);
      if (Array.isArray(qList) && qList.length > 0) setQuestions(qList);
      if (Array.isArray(jList) && jList.length > 0) setJobRoles(jList);
    } catch {
      const fresh = adminContentService.loadStore();
      setQuestions(fresh.interviewQuestions);
      setJobRoles(fresh.jobRoles);
    }
  };

  React.useEffect(() => {
    refreshData();
  }, [token]);

  const handleSaveQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQuestion?.question) return;
    const currentStore = adminContentService.loadStore();
    const qPayload: AdminInterviewQuestion = {
      id: editingQuestion.id || `iq-${Date.now()}`,
      company: editingQuestion.company || 'Meta',
      role: editingQuestion.role || 'Software Engineer',
      question: editingQuestion.question,
      difficulty: editingQuestion.difficulty || 'Medium',
      topic: editingQuestion.topic || 'Technical',
      status: 'active'
    };

    if (editingQuestion.id) {
      const idx = currentStore.interviewQuestions.findIndex((q: any) => q.id === editingQuestion.id);
      if (idx !== -1) currentStore.interviewQuestions[idx] = { ...currentStore.interviewQuestions[idx], ...editingQuestion };
    } else {
      currentStore.interviewQuestions.unshift(qPayload);
    }
    adminContentService.saveStore(currentStore);
    try {
      await adminContentService.saveInterviewAsync(token, qPayload);
    } catch {
      // Ignore
    }
    await refreshData();
    setEditingQuestion(null);
    onShowDevNotice('Interview question saved successfully.');
  };

  const handleDeleteQuestion = async (id: string, text: string) => {
    if (!confirm(`Are you sure you want to delete question "${text.substring(0, 40)}..."?`)) return;
    const currentStore = adminContentService.loadStore();
    currentStore.interviewQuestions = currentStore.interviewQuestions.filter((q: any) => q.id !== id);
    adminContentService.saveStore(currentStore);
    try {
      await adminContentService.deleteInterviewAsync(token, id);
    } catch {
      // Ignore
    }
    await refreshData();
    onShowDevNotice('Interview question deleted.');
  };

  const handleSaveJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingJob?.title) return;
    const currentStore = adminContentService.loadStore();
    const rolePayload: AdminJobRole = {
      id: editingJob.id || `jr-${Date.now()}`,
      title: editingJob.title,
      category: editingJob.category || 'Backend Engineering',
      salaryRange: editingJob.salaryRange || '$130k - $190k',
      demandLevel: editingJob.demandLevel || 'High',
      description: editingJob.description || 'Job role description & requirements.',
      status: 'active'
    };

    if (editingJob.id) {
      const idx = currentStore.jobRoles.findIndex((j: any) => j.id === editingJob.id);
      if (idx !== -1) currentStore.jobRoles[idx] = { ...currentStore.jobRoles[idx], ...editingJob };
    } else {
      currentStore.jobRoles.unshift(rolePayload);
    }
    adminContentService.saveStore(currentStore);
    try {
      await adminContentService.saveJobRoleAsync(token, rolePayload);
    } catch {
      // Ignore
    }
    await refreshData();
    setEditingJob(null);
    onShowDevNotice('Job Role saved.');
  };

  const handleDeleteJob = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete job role "${title}"?`)) return;
    const currentStore = adminContentService.loadStore();
    currentStore.jobRoles = currentStore.jobRoles.filter((j: any) => j.id !== id);
    adminContentService.saveStore(currentStore);
    try {
      await adminContentService.deleteJobRoleAsync(token, id);
    } catch {
      // Ignore
    }
    await refreshData();
    onShowDevNotice(`Job role "${title}" deleted.`);
  };

  const filteredQuestionsList = questions.filter(q => {
    const matchSearch = q.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        q.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        q.topic.toLowerCase().includes(searchQuery.toLowerCase());
    const matchRound = selectedRoundFilter === 'All' || q.topic.toLowerCase().includes(selectedRoundFilter.toLowerCase());
    return matchSearch && matchRound;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Sub tabs switcher */}
      <div className="card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setActiveTab('interview')}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              fontSize: '0.82rem',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              backgroundColor: activeTab === 'interview' ? 'var(--accent-primary)' : 'rgba(30, 41, 59, 0.5)',
              color: activeTab === 'interview' ? '#fff' : 'var(--text-secondary)'
            }}
          >
            Interview Question Bank ({questions.length})
          </button>
          <button
            onClick={() => setActiveTab('jobs')}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              fontSize: '0.82rem',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              backgroundColor: activeTab === 'jobs' ? 'var(--accent-primary)' : 'rgba(30, 41, 59, 0.5)',
              color: activeTab === 'jobs' ? '#fff' : 'var(--text-secondary)'
            }}
          >
            Tech Career Job Roles ({jobRoles.length})
          </button>
        </div>

        {activeTab === 'interview' ? (
          <button 
            onClick={() => setEditingQuestion({ company: 'Google', role: 'Software Engineer', question: '', difficulty: 'Medium', topic: 'Technical', round: 'Technical', level: 'Intermediate' })} 
            className="btn btn-primary btn-sm"
          >
            <Plus style={{ width: 14, height: 14 }} />
            <span>Add Interview Question</span>
          </button>
        ) : (
          <button 
            onClick={() => setEditingJob({ title: '', category: 'Software Engineering', salaryRange: '$120k - $180k', demandLevel: 'High', description: '' })} 
            className="btn btn-primary btn-sm"
          >
            <Plus style={{ width: 14, height: 14 }} />
            <span>Add Tech Job Role</span>
          </button>
        )}
      </div>

      {activeTab === 'interview' && (
        <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Admin Toolbar Filters */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Round:</span>
              <select
                value={selectedRoundFilter}
                onChange={(e) => setSelectedRoundFilter(e.target.value)}
                style={{ padding: '6px 10px', borderRadius: '6px', backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)', fontSize: '0.8rem' }}
              >
                <option value="All">All Rounds</option>
                {roundDefinitions.map(r => <option key={r.id} value={r.id}>{r.title}</option>)}
              </select>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', textAlign: 'left', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '10px 12px' }}>Company & Role</th>
                  <th style={{ padding: '10px 12px' }}>Interview Question</th>
                  <th style={{ padding: '10px 12px' }}>Topic & Round</th>
                  <th style={{ padding: '10px 12px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredQuestionsList.map((q) => (
                  <tr key={q.id} style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }}>
                    <td style={{ padding: '12px', fontWeight: 600 }}>
                      <div>{q.company}</div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{q.role}</div>
                    </td>
                    <td style={{ padding: '12px', lineHeight: 1.4 }}>{q.question}</td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ fontWeight: 600 }}>{q.topic}</div>
                      <span style={{ fontSize: '0.72rem', color: q.difficulty === 'Easy' ? '#10b981' : q.difficulty === 'Medium' ? '#f59e0b' : '#f87171' }}>
                        {q.difficulty}
                      </span>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => setPreviewQuestion(q)}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '4px 8px' }}
                          title="Preview Question"
                        >
                          <Eye style={{ width: 14, height: 14 }} />
                        </button>
                        <button
                          onClick={() => setEditingQuestion(q)}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '4px 8px' }}
                          title="Edit Question"
                        >
                          <Edit2 style={{ width: 14, height: 14 }} />
                        </button>
                        <button
                          onClick={() => handleDeleteQuestion(q.id, q.question)}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '4px 8px', color: '#f87171' }}
                          title="Delete Question"
                        >
                          <Trash2 style={{ width: 14, height: 14 }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* JOB ROLES TAB */}
      {activeTab === 'jobs' && (
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', textAlign: 'left', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '10px 12px' }}>Role Title</th>
                  <th style={{ padding: '10px 12px' }}>Category</th>
                  <th style={{ padding: '10px 12px' }}>Salary Range</th>
                  <th style={{ padding: '10px 12px' }}>Market Demand</th>
                  <th style={{ padding: '10px 12px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobRoles.map((j) => (
                  <tr key={j.id} style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }}>
                    <td style={{ padding: '12px', fontWeight: 700 }}>{j.title}</td>
                    <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>{j.category}</td>
                    <td style={{ padding: '12px', fontWeight: 600, color: '#10b981' }}>{j.salaryRange}</td>
                    <td style={{ padding: '12px' }}>{j.demandLevel}</td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                        <button onClick={() => setEditingJob(j)} className="btn btn-secondary btn-sm" style={{ padding: '4px 8px' }} title="Edit Role">
                          <Edit2 style={{ width: 14, height: 14 }} />
                        </button>
                        <button onClick={() => handleDeleteJob(j.id, j.title)} className="btn btn-secondary btn-sm" style={{ padding: '4px 8px', color: '#f87171' }} title="Delete Role">
                          <Trash2 style={{ width: 14, height: 14 }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* EDIT QUESTION MODAL */}
      {editingQuestion && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 20 }}>
          <div className="card" style={{ width: '100%', maxWidth: '600px', padding: '24px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {editingQuestion.id ? 'Edit Interview Question' : 'Add New Interview Question'}
              </h3>
              <button onClick={() => setEditingQuestion(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X style={{ width: 18, height: 18 }} />
              </button>
            </div>

            <form onSubmit={handleSaveQuestion} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Round</label>
                <select
                  value={editingQuestion.topic || 'Technical'}
                  onChange={(e) => setEditingQuestion({ ...editingQuestion, topic: e.target.value })}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)' }}
                >
                  {roundDefinitions.map(r => <option key={r.id} value={r.title}>{r.title}</option>)}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Interview Question</label>
                <textarea
                  rows={3}
                  value={editingQuestion.question || ''}
                  onChange={(e) => setEditingQuestion({ ...editingQuestion, question: e.target.value })}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)' }}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
                <button type="button" onClick={() => setEditingQuestion(null)} className="btn btn-secondary btn-sm">Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm">Save Question</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT JOB MODAL */}
      {editingJob && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 20 }}>
          <div className="card" style={{ width: '100%', maxWidth: '500px', padding: '24px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {editingJob.id ? 'Edit Job Role' : 'Add Tech Job Role'}
              </h3>
              <button onClick={() => setEditingJob(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X style={{ width: 18, height: 18 }} />
              </button>
            </div>

            <form onSubmit={handleSaveJob} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Job Title</label>
                <input
                  type="text"
                  value={editingJob.title || ''}
                  onChange={(e) => setEditingJob({ ...editingJob, title: e.target.value })}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)' }}
                  required
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Salary Range</label>
                  <input
                    type="text"
                    value={editingJob.salaryRange || ''}
                    onChange={(e) => setEditingJob({ ...editingJob, salaryRange: e.target.value })}
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Category</label>
                  <input
                    type="text"
                    value={editingJob.category || ''}
                    onChange={(e) => setEditingJob({ ...editingJob, category: e.target.value })}
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
                <button type="button" onClick={() => setEditingJob(null)} className="btn btn-secondary btn-sm">Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm">Save Job Role</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PREVIEW MODAL */}
      {previewQuestion && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 20 }}>
          <div className="card" style={{ width: '100%', maxWidth: '540px', padding: '24px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', fontWeight: 700 }}>STUDENT PREVIEW</span>
              <button onClick={() => setPreviewQuestion(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X style={{ width: 18, height: 18 }} />
              </button>
            </div>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {previewQuestion.question}
            </h3>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Company: <strong>{previewQuestion.company}</strong> | Role: <strong>{previewQuestion.role}</strong>
            </div>
            <button onClick={() => setPreviewQuestion(null)} className="btn btn-primary btn-sm" style={{ width: 'fit-content' }}>
              Close Preview
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
