import React, { useState, useEffect } from 'react';
import { Eye } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { adminCmsService } from '../../../services/adminCmsService';

export const AdminVisualizerView: React.FC<{ searchQuery?: string }> = ({ searchQuery = '' }) => {
  const { token } = useAuth();

  const [categories, setCategories] = useState([
    { id: 'SEARCHING', name: 'Searching', count: 8, enabled: true },
    { id: 'SORTING', name: 'Sorting', count: 14, enabled: true },
    { id: 'ARRAYS', name: 'Arrays', count: 3, enabled: true },
    { id: 'STRINGS', name: 'Strings', count: 2, enabled: true },
    { id: 'LINKED_LISTS', name: 'Linked Lists', count: 2, enabled: true },
    { id: 'STACKS_QUEUES', name: 'Stacks & Queues', count: 2, enabled: true },
    { id: 'TREES_BST', name: 'Trees & BST', count: 4, enabled: true },
    { id: 'GRAPHS', name: 'Graphs (BFS/DFS)', count: 2, enabled: true },
    { id: 'RECURSION_BACKTRACKING', name: 'Recursion Call Stack', count: 2, enabled: true },
    { id: 'HEAPS', name: 'Heaps & Heapify', count: 1, enabled: true },
    { id: 'DYNAMIC_PROGRAMMING', name: 'Dynamic Programming', count: 2, enabled: true }
  ]);

  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    adminCmsService.getVisualizerCategoriesAsync(token).then((data) => {
      if (isMounted && data && data.length > 0) {
        setCategories(data);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [token]);

  const toggleCategory = async (id: string) => {
    const updated = categories.map(c => c.id === id ? { ...c, enabled: !c.enabled } : c);
    setCategories(updated);
    try {
      await adminCmsService.updateVisualizerCategoriesAsync(token, updated);
      setStatusMsg(`Updated status for category ${id}.`);
      setTimeout(() => setStatusMsg(null), 2500);
    } catch (err: any) {
      setStatusMsg(`Error saving category status: ${err.message || 'Failed'}`);
    }
  };

  const filtered = categories.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.id.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="card" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-surface)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Eye style={{ width: 20, height: 20, color: 'var(--color-cyan)' }} />
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Algorithm Visualizer CMS & Category Control</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
              Manage active visualization topics, step narration rules, and algorithm complexity data.
            </p>
          </div>
        </div>
      </div>

      {statusMsg && (
        <div style={{ padding: '12px 16px', backgroundColor: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: 'var(--radius-md)', color: '#10b981', fontSize: '0.85rem' }}>
          ✅ {statusMsg}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
        {filtered.map(cat => (
          <div
            key={cat.id}
            className="card"
            style={{
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              border: cat.enabled ? '1px solid var(--border-subtle)' : '1px dashed var(--state-warning)',
              opacity: cat.enabled ? 1 : 0.65
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--color-cyan)' }}>
                {cat.id}
              </span>
              <button
                className={`btn btn-sm ${cat.enabled ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => toggleCategory(cat.id)}
                style={{ fontSize: '0.72rem', padding: '2px 8px' }}
              >
                {cat.enabled ? 'Active' : 'Disabled'}
              </button>
            </div>

            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              {cat.name}
            </h4>

            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
              {cat.count} interactive visualization algorithms configured.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
