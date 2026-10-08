import React from 'react';

export type LogoVariation = 'v1' | 'v2' | 'v3';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'full' | 'icon';
  showTagline?: boolean;
  className?: string;
  variation?: LogoVariation;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  variant = 'full',
  showTagline = false,
  className = '',
  variation = 'v1'
}) => {
  const iconSizes = {
    sm: 24,
    md: 32,
    lg: 44
  };

  const textSizes = {
    sm: '1.05rem',
    md: '1.35rem',
    lg: '1.8rem'
  };

  const currentSize = iconSizes[size];

  return (
    <div 
      className={`algorise-logo-wrapper ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: size === 'sm' ? '8px' : '10px',
        userSelect: 'none',
        textDecoration: 'none'
      }}
    >
      {/* Sleek Minimalist Abstract 'A' Vector Icon */}
      <svg
        width={currentSize}
        height={currentSize}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0, filter: 'drop-shadow(0 2px 10px rgba(59, 130, 246, 0.4))' }}
      >
        <defs>
          <linearGradient id="algoBluePink" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="50%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#EC4899" />
          </linearGradient>

          <linearGradient id="algoPinkBlue" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#EC4899" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>

          <linearGradient id="algoGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#EC4899" stopOpacity="0.3" />
          </linearGradient>
        </defs>

        {/* VARIATION 1: Graph Node Matrix (Connected Graph Nodes forming 'A') */}
        {variation === 'v1' && (
          <g>
            {/* Background glowing graph path */}
            <path
              d="M20 5 L7 33 H33 Z"
              fill="rgba(15, 23, 42, 0.6)"
              stroke="url(#algoBluePink)"
              strokeWidth="2.2"
              strokeLinejoin="round"
            />
            
            {/* Crossbar & Inner Node Graph Connectivity */}
            <path d="M12 22 H28" stroke="url(#algoBluePink)" strokeWidth="2" strokeLinecap="round" />
            <path d="M20 5 L20 16 M12 22 L20 16 M28 22 L20 16" stroke="url(#algoPinkBlue)" strokeWidth="1.6" strokeDasharray="2 2" />
            <path d="M7 33 L20 22 L33 33" stroke="#8B5CF6" strokeWidth="1.5" />

            {/* Glowing Graph Nodes representing Data Structure Vertices */}
            <circle cx="20" cy="5" r="3" fill="#3B82F6" stroke="#FFFFFF" strokeWidth="1" />
            <circle cx="7" cy="33" r="2.8" fill="#3B82F6" />
            <circle cx="33" cy="33" r="2.8" fill="#EC4899" />
            <circle cx="12" cy="22" r="2.5" fill="#8B5CF6" />
            <circle cx="28" cy="22" r="2.5" fill="#EC4899" />
            <circle cx="20" cy="16" r="2.2" fill="#FFFFFF" />
            <circle cx="20" cy="22" r="2.2" fill="#38BDF8" />
          </g>
        )}

        {/* VARIATION 2: Cyber Shield Node (Hexagonal Shield with Inner Node 'A') */}
        {variation === 'v2' && (
          <g>
            <path
              d="M20 3L35 11.5V28.5L20 37L5 28.5V11.5L20 3Z"
              fill="rgba(15, 23, 42, 0.85)"
              stroke="url(#algoBluePink)"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <path
              d="M20 9L29 27H24.5L20 18L15.5 27H11L20 9Z"
              fill="url(#algoBluePink)"
            />
            <circle cx="20" cy="9" r="2.5" fill="#38BDF8" />
            <circle cx="15.5" cy="27" r="2" fill="#8B5CF6" />
            <circle cx="24.5" cy="27" r="2" fill="#EC4899" />
            <circle cx="20" cy="18" r="2" fill="#FFFFFF" />
            <path d="M16 22H24" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" />
          </g>
        )}

        {/* VARIATION 3: Minimal Circuit Apex (Precision Circuit Lines & Endpoints) */}
        {variation === 'v3' && (
          <g>
            <path d="M6 34 L20 6 L34 34" stroke="url(#algoBluePink)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M11 23 H29" stroke="url(#algoPinkBlue)" strokeWidth="2.5" strokeLinecap="round" />
            
            <circle cx="20" cy="6" r="3.2" fill="#3B82F6" stroke="#FFFFFF" strokeWidth="1" />
            <circle cx="6" cy="34" r="2.8" fill="#38BDF8" />
            <circle cx="34" cy="34" r="2.8" fill="#EC4899" />
            <circle cx="11" cy="23" r="2.4" fill="#8B5CF6" />
            <circle cx="29" cy="23" r="2.4" fill="#EC4899" />
          </g>
        )}
      </svg>

      {/* Clean Typography Wordmark */}
      {variant === 'full' && (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', lineHeight: 1.1 }}>
          <div style={{ fontSize: textSizes[size], fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
            ALGO<span style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 50%, #EC4899 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>rise</span>
          </div>
          {showTagline && (
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 500, letterSpacing: '0.02em' }}>
              DSA finally makes sense.
            </span>
          )}
        </div>
      )}
    </div>
  );
};
