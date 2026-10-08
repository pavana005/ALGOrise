import React, { useState } from 'react';
import { Logo } from '../common/Logo';
import { MessageSquare, Heart } from 'lucide-react';
import type { TabType } from './Sidebar';

interface FooterProps {
  onNavigateTab?: (tab: TabType, extraId?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateTab }) => {
  const [isBtnHovered, setIsBtnHovered] = useState(false);
  const [isBtnFocused, setIsBtnFocused] = useState(false);

  return (
    <footer 
      className="app-footer"
      style={{
        marginTop: 'auto',
        padding: '14px 24px',
        backgroundColor: 'var(--bg-header)',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '14px',
        transition: 'background-color 0.3s ease, border-color 0.3s ease'
      }}
    >
      <Logo size="sm" variant="full" />

      {/* Made with Love info */}
      <div 
        style={{ 
          fontSize: '0.8125rem', 
          fontWeight: 500, 
          color: 'var(--text-secondary)', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '5px' 
        }}
      >
        <span>Made with</span>
        <Heart style={{ width: 14, height: 14, color: '#EC4899', fill: '#EC4899' }} />
        <span>by Pav! for Computer Science Learners</span>
      </div>

      {/* Compact Feedback Button & Copyright */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        {onNavigateTab && (
          <button
            onClick={() => onNavigateTab('settings', 'feedback')}
            onMouseEnter={() => setIsBtnHovered(true)}
            onMouseLeave={() => setIsBtnHovered(false)}
            onFocus={() => setIsBtnFocused(true)}
            onBlur={() => setIsBtnFocused(false)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '8px',
              background: (isBtnHovered || isBtnFocused)
                ? 'linear-gradient(135deg, rgba(236, 72, 153, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%)'
                : 'var(--bg-elevated)',
              border: (isBtnHovered || isBtnFocused)
                ? '1px solid rgba(236, 72, 153, 0.5)'
                : '1px solid var(--border-subtle)',
              color: (isBtnHovered || isBtnFocused) ? 'var(--accent-primary)' : 'var(--text-secondary)',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease-in-out',
              minHeight: '34px',
              boxShadow: (isBtnHovered || isBtnFocused) ? '0 2px 10px rgba(236, 72, 153, 0.25)' : 'none',
              transform: isBtnHovered ? 'translateY(-1px)' : 'none',
              outline: isBtnFocused ? '2px solid var(--accent-primary)' : 'none',
              outlineOffset: '2px',
              userSelect: 'none'
            }}
            title="Send Feedback"
          >
            <MessageSquare style={{ width: 14, height: 14, color: 'var(--accent-primary)' }} />
            <span>Feedback</span>
          </button>
        )}

        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          © {new Date().getFullYear()} ALGOrise
        </div>
      </div>
    </footer>
  );
};
