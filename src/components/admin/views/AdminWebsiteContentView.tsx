import React, { useState, useEffect } from 'react';
import { FileText, Save, Loader2 } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { adminCmsService, type WebsiteContentCopy } from '../../../services/adminCmsService';

export const AdminWebsiteContentView: React.FC = () => {
  const { token } = useAuth();
  const [copy, setCopy] = useState<WebsiteContentCopy>(() => adminCmsService.getWebsiteCopy());
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let isMounted = true;
    adminCmsService.getWebsiteCopyAsync(token).then((data) => {
      if (isMounted && data) {
        setCopy(data);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [token]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const updated = await adminCmsService.updateWebsiteCopyAsync(token, copy);
      setCopy(updated);
      setStatusMsg('Website Content Copy settings updated & saved successfully!');
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
          <FileText style={{ width: 20, height: 20, color: 'var(--accent-primary)' }} />
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Website Global Content Copy & Headings CMS</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
              Edit section headings, page titles, footer copyrights, button labels, and empty state messaging.
            </p>
          </div>
        </div>
      </div>

      {statusMsg && (
        <div style={{ padding: '12px 16px', backgroundColor: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: 'var(--radius-md)', color: '#10b981', fontSize: '0.85rem' }}>
          ✅ {statusMsg}
        </div>
      )}

      <form onSubmit={handleSave} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '20px' }}>
        <div>
          <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>
            Site Brand Title
          </label>
          <input
            type="text"
            className="input-field"
            style={{ width: '100%' }}
            value={copy.siteTitle}
            onChange={(e) => setCopy({ ...copy, siteTitle: e.target.value })}
          />
        </div>

        <div>
          <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>
            Footer Copyright Text
          </label>
          <input
            type="text"
            className="input-field"
            style={{ width: '100%' }}
            value={copy.footerText}
            onChange={(e) => setCopy({ ...copy, footerText: e.target.value })}
          />
        </div>

        <div>
          <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>
            Problems Page Heading
          </label>
          <input
            type="text"
            className="input-field"
            style={{ width: '100%' }}
            value={copy.problemsPageHeading}
            onChange={(e) => setCopy({ ...copy, problemsPageHeading: e.target.value })}
          />
        </div>

        <div>
          <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>
            Flow of Learning Page Heading
          </label>
          <input
            type="text"
            className="input-field"
            style={{ width: '100%' }}
            value={copy.learnPageHeading}
            onChange={(e) => setCopy({ ...copy, learnPageHeading: e.target.value })}
          />
        </div>

        <div>
          <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>
            Crime Lab Page Heading
          </label>
          <input
            type="text"
            className="input-field"
            style={{ width: '100%' }}
            value={copy.crimeLabHeading}
            onChange={(e) => setCopy({ ...copy, crimeLabHeading: e.target.value })}
          />
        </div>

        <button type="submit" disabled={isSaving} className="btn btn-primary" style={{ width: 'fit-content', gap: '6px', marginTop: '8px' }}>
          {isSaving ? <Loader2 style={{ width: 16, height: 16, animation: 'spin 1s linear infinite' }} /> : <Save style={{ width: 16, height: 16 }} />}
          <span>{isSaving ? 'Saving Changes...' : 'Save Website Content Settings'}</span>
        </button>
      </form>
    </div>
  );
};
