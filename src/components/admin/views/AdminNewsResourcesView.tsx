import React, { useState, useEffect } from 'react';
import { adminContentService } from '../../../services/adminContentService';
import type { AdminResource } from '../../../services/adminContentService';
import { useAuth } from '../../../context/AuthContext';
import { Plus, Edit2, Trash2, X, ExternalLink, BookOpen, Loader2 } from 'lucide-react';

interface AdminNewsResourcesViewProps {
  searchQuery: string;
  onShowDevNotice: (msg: string) => void;
}

export const AdminNewsResourcesView: React.FC<AdminNewsResourcesViewProps> = ({ searchQuery, onShowDevNotice }) => {
  const { token } = useAuth();
  const [resources, setResources] = useState<AdminResource[]>(() => adminContentService.getResources(token));
  const [editingRes, setEditingRes] = useState<Partial<AdminResource> | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const refreshData = () => {
    adminContentService.getResourcesAsync(token).then((data) => {
      if (data) setResources(data);
    });
  };

  useEffect(() => {
    refreshData();
  }, [token]);

  const handleSaveResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRes?.title) return;
    setIsSaving(true);
    try {
      await adminContentService.saveResourceAsync(token, editingRes);
      refreshData();
      setEditingRes(null);
      onShowDevNotice('Learning Resource saved.');
    } catch (err: any) {
      onShowDevNotice(`Failed to save resource: ${err.message || 'Error'}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteResource = async (id: string, title: string) => {
    if (!confirm(`Delete resource "${title}"?`)) return;
    try {
      await adminContentService.deleteResourceAsync(token, id);
      refreshData();
      onShowDevNotice('Resource deleted.');
    } catch (err: any) {
      onShowDevNotice(`Failed to delete resource: ${err.message || 'Error'}`);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BookOpen style={{ width: 18, height: 18, color: 'var(--accent-primary)' }} />
          <span>Curated Learning Resources ({resources.length})</span>
        </h3>

        <button onClick={() => setEditingRes({ title: '', category: 'Books', type: 'Guide', link: 'https://algorise.io', status: 'active' })} className="btn btn-primary btn-sm">
          <Plus style={{ width: 14, height: 14 }} />
          <span>Add Study Resource</span>
        </button>
      </div>

      <div className="card" style={{ padding: '20px' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', textAlign: 'left', color: 'var(--text-muted)' }}>
                <th style={{ padding: '10px 12px' }}>Resource Title</th>
                <th style={{ padding: '10px 12px' }}>Category</th>
                <th style={{ padding: '10px 12px' }}>Type</th>
                <th style={{ padding: '10px 12px' }}>Link</th>
                <th style={{ padding: '10px 12px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {resources
                .filter((r) => r.title.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((r) => (
                  <tr key={r.id} style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }}>
                    <td style={{ padding: '12px', fontWeight: 600 }}>{r.title}</td>
                    <td style={{ padding: '12px', color: 'var(--accent-primary)', fontWeight: 600 }}>{r.category}</td>
                    <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>{r.type}</td>
                    <td style={{ padding: '12px', color: '#38bdf8' }}>
                      <a href={r.link} target="_blank" rel="noreferrer" style={{ color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span>URL</span>
                        <ExternalLink style={{ width: 12, height: 12 }} />
                      </a>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                        <button onClick={() => setEditingRes(r)} className="btn btn-outline btn-sm" style={{ padding: '4px 8px' }}>
                          <Edit2 style={{ width: 12, height: 12 }} />
                        </button>
                        <button onClick={() => handleDeleteResource(r.id, r.title)} className="btn btn-outline btn-sm" style={{ padding: '4px 8px', color: '#f87171', borderColor: 'rgba(239, 68, 68, 0.3)' }}>
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

      {/* Edit Resource Modal */}
      {editingRes && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(4px)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div className="card" style={{ width: '100%', maxWidth: '520px', padding: '28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                Edit Learning Resource
              </h3>
              <button onClick={() => setEditingRes(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X style={{ width: 20, height: 20 }} />
              </button>
            </div>
            <form onSubmit={handleSaveResource} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <input type="text" placeholder="Resource Title" required className="select-field" value={editingRes.title || ''} onChange={(e) => setEditingRes({ ...editingRes, title: e.target.value })} />
              <div className="grid-2" style={{ gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <input type="text" placeholder="Category" required className="select-field" value={editingRes.category || ''} onChange={(e) => setEditingRes({ ...editingRes, category: e.target.value })} />
                <input type="text" placeholder="Type (e.g. PDF Guide)" required className="select-field" value={editingRes.type || ''} onChange={(e) => setEditingRes({ ...editingRes, type: e.target.value })} />
              </div>
              <input type="url" placeholder="Resource Link URL" required className="select-field" value={editingRes.link || ''} onChange={(e) => setEditingRes({ ...editingRes, link: e.target.value })} />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => setEditingRes(null)} className="btn btn-outline btn-sm">Cancel</button>
                <button type="submit" disabled={isSaving} className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {isSaving && <Loader2 style={{ width: 14, height: 14, animation: 'spin 1s linear infinite' }} />}
                  <span>{isSaving ? 'Saving...' : 'Save Resource'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
