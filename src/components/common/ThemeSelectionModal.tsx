import React, { useState } from 'react';
import { Sun, Moon, Sparkles, Check, ArrowRight } from 'lucide-react';
import { useTheme, type Theme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

export const ThemeSelectionModal: React.FC = () => {
  const { theme, isThemePromptOpen, confirmThemeSelection } = useTheme();
  const { user } = useAuth();
  const [selectedTheme, setSelectedTheme] = useState<Theme>(theme || 'light');

  if (!isThemePromptOpen) return null;

  const handleSelect = (choice: Theme) => {
    setSelectedTheme(choice);
    // Real-time preview update as user clicks each option
    document.documentElement.setAttribute('data-theme', choice);
    if (document.body) {
      document.body.setAttribute('data-theme', choice);
    }
  };

  const handleConfirm = () => {
    if (user?.id) {
      try {
        localStorage.setItem(`algorise_theme_configured_${user.id}`, 'true');
        localStorage.setItem(`algorise_theme_preference_${user.id}`, selectedTheme);
      } catch {}
    }
    confirmThemeSelection(selectedTheme);
  };

  const themeOptions: Array<{
    id: Theme;
    title: string;
    tag: string;
    desc: string;
    icon: typeof Sun;
    accentColor: string;
    previewBg: string;
    previewCard: string;
    previewBorder: string;
    previewText: string;
  }> = [
    {
      id: 'light',
      title: 'Light Mode',
      tag: 'Default · Crisp & Clear',
      desc: 'Bright daylight aesthetic with crisp contrast, clean borders, and optimal daylight readability.',
      icon: Sun,
      accentColor: '#2563EB',
      previewBg: '#F8FAFC',
      previewCard: '#FFFFFF',
      previewBorder: '#E2E8F0',
      previewText: '#0F172A'
    },
    {
      id: 'dark',
      title: 'Dark Mode',
      tag: 'Midnight · High Focus',
      desc: 'Deep obsidian palette engineered to eliminate glare and reduce eye fatigue during late-night study.',
      icon: Moon,
      accentColor: '#38BDF8',
      previewBg: '#0B0F17',
      previewCard: '#131C2E',
      previewBorder: '#1E293B',
      previewText: '#F8FAFC'
    },
    {
      id: 'cute',
      title: 'Cute Mode',
      tag: 'Pastel · Cozy Vibe',
      desc: 'Soft strawberry milk & lavender pastel aesthetics designed for a friendly, cheerful coding session.',
      icon: Sparkles,
      accentColor: '#EC4899',
      previewBg: '#FFF4F8',
      previewCard: '#FFFFFF',
      previewBorder: '#FBCFE8',
      previewText: '#831843'
    }
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="theme-modal-title"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(8px)',
        animation: 'fadeIn 0.2s ease-out'
      }}
    >
      <div
        className="modal-content"
        style={{
          width: '100%',
          maxWidth: '580px',
          backgroundColor: 'var(--bg-card)',
          borderRadius: '16px',
          border: '1px solid var(--border-medium)',
          boxShadow: 'var(--shadow-lg)',
          padding: '28px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          animation: 'slideUp 0.25s ease-out'
        }}
      >
        {/* Header Header */}
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
            }}
          >
            <Sparkles style={{ width: 22, height: 22 }} />
          </div>
          <div>
            <h2
              id="theme-modal-title"
              style={{
                fontSize: '1.25rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                letterSpacing: '-0.01em',
                margin: 0
              }}
            >
              Choose Your Theme Preference
            </h2>
            <p
              style={{
                fontSize: '0.82rem',
                color: 'var(--text-secondary)',
                marginTop: '4px',
                marginBottom: 0,
                lineHeight: 1.45
              }}
            >
              Welcome to ALGOrise! Select your preferred visual appearance. You can change this anytime from the top navigation or settings.
            </p>
          </div>
        </div>

        {/* 3 Theme Choice Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
          {themeOptions.map((opt) => {
            const isSelected = selectedTheme === opt.id;
            const Icon = opt.icon;

            return (
              <div
                key={opt.id}
                onClick={() => handleSelect(opt.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSelect(opt.id);
                  }
                }}
                style={{
                  position: 'relative',
                  padding: '16px 14px',
                  borderRadius: '12px',
                  border: `2px solid ${isSelected ? opt.accentColor : 'var(--border-subtle)'}`,
                  backgroundColor: isSelected ? 'var(--bg-elevated)' : 'var(--bg-surface)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  transition: 'all 0.2s ease',
                  boxShadow: isSelected ? `0 0 0 1px ${opt.accentColor}, var(--shadow-md)` : 'var(--shadow-sm)'
                }}
              >
                {/* Selected Checkmark Badge */}
                {isSelected && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      backgroundColor: opt.accentColor,
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Check style={{ width: 13, height: 13, strokeWidth: 3 }} />
                  </div>
                )}

                {/* Mini Preview Box */}
                <div
                  style={{
                    height: '56px',
                    borderRadius: '8px',
                    backgroundColor: opt.previewBg,
                    border: `1px solid ${opt.previewBorder}`,
                    padding: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: opt.accentColor }} />
                    <div style={{ width: '38px', height: '6px', borderRadius: '3px', backgroundColor: opt.previewBorder }} />
                  </div>
                  <div
                    style={{
                      backgroundColor: opt.previewCard,
                      border: `1px solid ${opt.previewBorder}`,
                      borderRadius: '4px',
                      padding: '4px 6px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <div style={{ width: '16px', height: '4px', borderRadius: '2px', backgroundColor: opt.accentColor }} />
                    <div style={{ width: '28px', height: '4px', borderRadius: '2px', backgroundColor: opt.previewBorder }} />
                  </div>
                </div>

                {/* Card Title & Icon */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                    <Icon style={{ width: 16, height: 16, color: opt.accentColor }} />
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {opt.title}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 600, color: opt.accentColor, marginBottom: '6px' }}>
                    {opt.tag}
                  </div>
                  <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.35 }}>
                    {opt.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            paddingTop: '6px'
          }}
        >
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Selected: <strong style={{ color: 'var(--text-primary)', textTransform: 'capitalize' }}>{selectedTheme} Mode</strong>
          </div>
          <button
            type="button"
            onClick={handleConfirm}
            className="btn btn-primary"
            style={{
              padding: '10px 22px',
              fontSize: '0.88rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer'
            }}
          >
            <span>Continue with {selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1)} Mode</span>
            <ArrowRight style={{ width: 16, height: 16 }} />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(14px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
};
