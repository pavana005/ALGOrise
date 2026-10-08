import React, { useState, useEffect } from 'react';
import { adminCmsService, type HomeCmsContent } from '../../../services/adminCmsService';
import { useAuth } from '../../../context/AuthContext';
import { Home as HomeIcon, Save, Eye, EyeOff, CheckCircle2, Loader2 } from 'lucide-react';

export const AdminHomeView: React.FC = () => {
  const { token } = useAuth();
  const [content, setContent] = useState<HomeCmsContent>(() => adminCmsService.getHomeContent());
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let isMounted = true;
    adminCmsService.getHomeContentAsync(token).then((data) => {
      if (isMounted && data) {
        setContent(data);
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
      const updated = await adminCmsService.updateHomeContentAsync(token, content);
      setContent(updated);
      setStatusMsg('Home Page CMS content saved successfully! Changes are live across the website.');
      setTimeout(() => setStatusMsg(null), 3500);
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
          <HomeIcon style={{ width: 20, height: 20, color: 'var(--accent-primary)' }} />
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Home Page CMS & Text Content Control</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
              Manage welcome headers, about section text, learning recommendation headings, and empty state messages.
            </p>
          </div>
        </div>

        <button
          className="btn btn-outline btn-sm"
          onClick={() => setIsPreviewMode(!isPreviewMode)}
        >
          {isPreviewMode ? <EyeOff style={{ width: 14, height: 14 }} /> : <Eye style={{ width: 14, height: 14 }} />}
          <span>{isPreviewMode ? 'Edit Mode' : 'Live User Preview'}</span>
        </button>
      </div>

      {statusMsg && (
        <div style={{ padding: '12px 16px', backgroundColor: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: 'var(--radius-md)', color: '#10b981', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 style={{ width: 16, height: 16 }} />
          <span>{statusMsg}</span>
        </div>
      )}

      {isPreviewMode ? (
        <div className="card" style={{ padding: '24px', backgroundColor: 'var(--bg-card)', border: '2px dashed var(--accent-primary)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase' }}>Live Home Page Preview</span>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>{content.welcomeTitle}</h1>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', margin: 0 }}>{content.welcomeSubtitle}</p>
          <div style={{ padding: '16px', backgroundColor: 'var(--bg-root)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>About Algorise</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>{content.aboutContent}</p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSave} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '20px' }}>
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>
              Welcome Banner Title
            </label>
            <input
              type="text"
              className="input-field"
              style={{ width: '100%' }}
              value={content.welcomeTitle}
              onChange={(e) => setContent({ ...content, welcomeTitle: e.target.value })}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>
              Welcome Banner Subtitle & Tagline
            </label>
            <textarea
              className="input-field"
              style={{ width: '100%', minHeight: '60px', fontFamily: 'inherit' }}
              value={content.welcomeSubtitle}
              onChange={(e) => setContent({ ...content, welcomeSubtitle: e.target.value })}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>
              About Algorise Section Text
            </label>
            <textarea
              className="input-field"
              style={{ width: '100%', minHeight: '90px', fontFamily: 'inherit' }}
              value={content.aboutContent}
              onChange={(e) => setContent({ ...content, aboutContent: e.target.value })}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>
              Learning Recommendations Section Heading
            </label>
            <input
              type="text"
              className="input-field"
              style={{ width: '100%' }}
              value={content.learningRecommendationsTitle}
              onChange={(e) => setContent({ ...content, learningRecommendationsTitle: e.target.value })}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>
              Empty State Message
            </label>
            <input
              type="text"
              className="input-field"
              style={{ width: '100%' }}
              value={content.emptyStateMessage}
              onChange={(e) => setContent({ ...content, emptyStateMessage: e.target.value })}
            />
          </div>

          <button type="submit" disabled={isSaving} className="btn btn-primary" style={{ width: 'fit-content', gap: '6px', marginTop: '8px' }}>
            {isSaving ? <Loader2 style={{ width: 16, height: 16, animation: 'spin 1s linear infinite' }} /> : <Save style={{ width: 16, height: 16 }} />}
            <span>{isSaving ? 'Saving Changes...' : 'Save Home CMS Settings'}</span>
          </button>
        </form>
      )}
    </div>
  );
};
