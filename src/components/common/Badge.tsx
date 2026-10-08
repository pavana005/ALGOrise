import React from 'react';

interface BadgeProps {
  variant?: 'easy' | 'medium' | 'hard' | 'blue' | 'neutral' | 'purple' | 'cyan' | 'orange' | 'green' | 'coral' | 'indigo' | 'amber' | 'pink';
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  children,
  className = '',
  style
}) => {
  return (
    <span className={`badge badge-${variant} ${className}`} style={style}>
      {children}
    </span>
  );
};
