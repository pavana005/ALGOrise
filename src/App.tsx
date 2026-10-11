import { AppShell } from './components/layout/AppShell';
import { ProgressProvider } from './context/ProgressContext';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ClerkSessionBridge } from './components/common/ClerkSessionBridge';

const rawClerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const isClerkConfigured = Boolean(
  typeof rawClerkKey === 'string' &&
  rawClerkKey.trim() !== '' &&
  !rawClerkKey.startsWith('pk_test_your_') &&
  rawClerkKey.startsWith('pk_')
);

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <LanguageProvider>
          <ProgressProvider>
            {isClerkConfigured && <ClerkSessionBridge />}
            <AppShell />
          </ProgressProvider>
        </LanguageProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
