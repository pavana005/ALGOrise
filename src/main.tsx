import { ClerkProvider } from '@clerk/react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { ErrorBoundary } from './components/common/ErrorBoundary.tsx';

const rawKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const PUBLISHABLE_KEY = typeof rawKey === 'string' ? rawKey.trim() : '';
const isClerkConfigured = Boolean(
  PUBLISHABLE_KEY &&
  !PUBLISHABLE_KEY.startsWith('pk_test_your_') &&
  PUBLISHABLE_KEY.startsWith('pk_')
);

const container = document.getElementById('root');
if (!container) {
  throw new Error('Failed to find root element with id "root"');
}

const root = createRoot(container);

if (isClerkConfigured) {
  root.render(
    <StrictMode>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </ClerkProvider>
    </StrictMode>
  );
} else {
  root.render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>
  );
}