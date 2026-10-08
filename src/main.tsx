import { ClerkProvider } from '@clerk/react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { ErrorBoundary } from './components/common/ErrorBoundary.tsx';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const container = document.getElementById('root');
if (!container) {
  throw new Error('Failed to find root element with id "root"');
}

const root = createRoot(container);

if (PUBLISHABLE_KEY && PUBLISHABLE_KEY.trim() !== '') {
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
  console.warn('Missing VITE_CLERK_PUBLISHABLE_KEY in environment variables. Rendering application without ClerkProvider wrapper.');
  root.render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>
  );
}