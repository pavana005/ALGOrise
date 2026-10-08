import React, { useEffect } from 'react';
import { Info, X } from 'lucide-react';

interface NotificationToastProps {
  message: string;
  onClose: () => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({
  message,
  onClose
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4500);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="dev-toast">
      <Info style={{ width: 18, height: 18, color: 'var(--primary)', flexShrink: 0 }} />
      <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-primary)' }}>
        {message}
      </span>
      <button
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--text-muted)',
          cursor: 'pointer',
          padding: 2,
          display: 'flex',
          alignItems: 'center'
        }}
        aria-label="Close notification"
      >
        <X style={{ width: 14, height: 14 }} />
      </button>
    </div>
  );
};
