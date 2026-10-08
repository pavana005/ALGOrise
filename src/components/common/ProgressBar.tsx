import React from 'react';

interface ProgressBarProps {
  progress: number; // 0 to 100
  variant?: 'primary' | 'easy' | 'medium' | 'hard';
  height?: number;
  showPercentage?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  variant = 'primary',
  height = 8,
  showPercentage = false
}) => {
  const clamped = Math.min(100, Math.max(0, progress));
  
  const getFillClass = () => {
    switch (variant) {
      case 'easy': return 'progress-fill-easy';
      case 'medium': return 'progress-fill-medium';
      case 'hard': return 'progress-fill-hard';
      default: return 'progress-fill';
    }
  };

  return (
    <div style={{ width: '100%' }}>
      {showPercentage && (
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px', color: 'var(--text-secondary)' }}>
          <span>Progress</span>
          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{clamped}%</span>
        </div>
      )}
      <div className="progress-container" style={{ height }}>
        <div className={`progress-fill ${getFillClass()}`} style={{ width: `${clamped}%` }} />
      </div>
    </div>
  );
};
