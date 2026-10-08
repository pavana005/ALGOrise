import React, { useState, useEffect } from 'react';
import { List, ArrowUp, ArrowDown, Save, Loader2 } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { adminCmsService, type NavigationItemCms } from '../../../services/adminCmsService';

export const AdminNavigationView: React.FC = () => {
  const { token } = useAuth();
  const [navItems, setNavItems] = useState<NavigationItemCms[]>(() => adminCmsService.getNavigationItems());
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let isMounted = true;
    adminCmsService.getNavigationItemsAsync(token).then((items) => {
      if (isMounted && items && items.length > 0) {
        setNavItems(items);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [token]);

  const moveUp = (idx: number) => {
    if (idx <= 0) return;
    const next = [...navItems];
    const tmp = next[idx];
    next[idx] = next[idx - 1];
    next[idx - 1] = tmp;

    // reindex order
    next.forEach((item, i) => item.order = i + 1);
    setNavItems(next);
  };

  const moveDown = (idx: number) => {
    if (idx >= navItems.length - 1) return;
    const next = [...navItems];
    const tmp = next[idx];
    next[idx] = next[idx + 1];
    next[idx + 1] = tmp;

    // reindex order
    next.forEach((item, i) => item.order = i + 1);
    setNavItems(next);
  };

  const toggleEnabled = (id: string) => {
    setNavItems(prev => prev.map(n => n.id === id ? { ...n, enabled: !n.enabled } : n));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const saved = await adminCmsService.updateNavigationItemsAsync(token, navItems);
      setNavItems(saved);
      setStatusMsg('Navigation bar configuration updated & saved successfully!');
      setTimeout(() => setStatusMsg(null), 3000);
    } catch (err: any) {
      setStatusMsg(`Error saving: ${err.message || 'Failed to save'}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="card" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-surface)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <List style={{ width: 20, height: 20, color: 'var(--accent-primary)' }} />
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Navigation Bar & Section Order Management</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
              Reorder top header and sidebar navigation links, rename labels, or disable specific sections.
            </p>
          </div>
        </div>

        <button disabled={isSaving} className="btn btn-primary btn-sm" onClick={handleSave} style={{ gap: '6px' }}>
          {isSaving ? <Loader2 style={{ width: 14, height: 14, animation: 'spin 1s linear infinite' }} /> : <Save style={{ width: 14, height: 14 }} />}
          <span>{isSaving ? 'Saving...' : 'Save Navigation Settings'}</span>
        </button>
      </div>

      {statusMsg && (
        <div style={{ padding: '12px 16px', backgroundColor: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: 'var(--radius-md)', color: '#10b981', fontSize: '0.85rem' }}>
          ✅ {statusMsg}
        </div>
      )}

      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '16px' }}>
        {navItems.map((item, idx) => (
          <div
            key={item.id}
            style={{
              padding: '12px 16px',
              backgroundColor: 'var(--bg-card)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--accent-primary)', width: '24px' }}>
                #{item.order}
              </span>
              <input
                type="text"
                className="input-field"
                style={{ width: '200px', fontSize: '0.85rem' }}
                value={item.label}
                onChange={(e) => {
                  const val = e.target.value;
                  setNavItems(prev => prev.map(n => n.id === item.id ? { ...n, label: val } : n));
                }}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Route ID: /{item.id}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                disabled={idx === 0}
                onClick={() => moveUp(idx)}
                style={{ padding: '4px 8px' }}
              >
                <ArrowUp style={{ width: 14, height: 14 }} />
              </button>

              <button
                type="button"
                className="btn btn-outline btn-sm"
                disabled={idx === navItems.length - 1}
                onClick={() => moveDown(idx)}
                style={{ padding: '4px 8px' }}
              >
                <ArrowDown style={{ width: 14, height: 14 }} />
              </button>

              <button
                type="button"
                className={`btn btn-sm ${item.enabled ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => toggleEnabled(item.id)}
                style={{
                  fontSize: '0.75rem',
                  padding: '4px 12px',
                  backgroundColor: item.enabled ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                  color: item.enabled ? '#10b981' : '#ef4444',
                  borderColor: item.enabled ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)',
                  fontWeight: 600
                }}
              >
                {item.enabled ? '● Enabled' : '○ Disabled'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
