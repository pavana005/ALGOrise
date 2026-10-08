import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { ShieldAlert, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ALGOrise Error Boundary Caught Exception:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div 
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            minHeight: '100vh',
            backgroundColor: 'var(--bg-page)',
            color: 'var(--text-primary)',
            padding: '24px',
            fontFamily: 'Inter, sans-serif'
          }}
        >
          <div 
            style={{ 
              maxWidth: '520px', 
              width: '100%', 
              backgroundColor: 'var(--bg-surface)', 
              border: '1px solid #334155',
              borderRadius: '16px',
              padding: '32px',
              textAlign: 'center',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)'
            }}
          >
            <div style={{ display: 'inline-flex', padding: '16px', backgroundColor: 'rgba(236, 72, 153, 0.12)', borderRadius: '12px', marginBottom: '16px' }}>
              <ShieldAlert style={{ width: 32, height: 32, color: '#EC4899' }} />
            </div>

            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '8px' }}>
              Something went wrong
            </h2>

            <p style={{ fontSize: '0.9rem', color: '#94A3B8', marginBottom: '20px', lineHeight: '1.5' }}>
              ALGOrise encountered a component rendering exception. The Error Boundary caught the issue to prevent a blank white screen.
            </p>

            {this.state.error && (
              <pre 
                style={{ 
                  textAlign: 'left',
                  padding: '12px',
                  backgroundColor: '#0D1117',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '0.8rem',
                  color: '#F472B6',
                  marginBottom: '20px',
                  overflowX: 'auto'
                }}
              >
                {this.state.error.toString()}
              </pre>
            )}

            <button
              onClick={() => window.location.reload()}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                backgroundColor: '#3B82F6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer'
              }}
            >
              <RotateCcw style={{ width: 16, height: 16 }} />
              <span>Reload Website</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
