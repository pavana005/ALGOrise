import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ClerkProvider } from '@clerk/react';
import './index.css';
import App from './App.tsx';
import { ErrorBoundary } from './components/common/ErrorBoundary.tsx';

const rawClerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const clerkPublishableKey = typeof rawClerkKey === 'string' ? rawClerkKey.trim() : '';
const isClerkConfigured = Boolean(
  clerkPublishableKey &&
  !clerkPublishableKey.startsWith('pk_test_your_') &&
  clerkPublishableKey.startsWith('pk_')
);

const container = document.getElementById('root');
if (!container) {
  throw new Error('Failed to find root element with id "root"');
}

const root = createRoot(container);

if (isClerkConfigured) {
  root.render(
    <StrictMode>
      <ClerkProvider publishableKey={clerkPublishableKey} afterSignOutUrl="/">
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