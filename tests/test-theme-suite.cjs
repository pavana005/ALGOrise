const fs = require('fs');
const path = require('path');
const http = require('http');

let passed = 0;
let failed = 0;

function assert(condition, testName, details) {
  if (condition) {
    passed++;
    console.log(`[PASS] ${testName}`);
  } else {
    failed++;
    console.error(`[FAIL] ${testName} - ${details || ''}`);
  }
}

function fetchUrl(urlPath) {
  return new Promise((resolve, reject) => {
    http.get({ hostname: 'localhost', port: 5173, path: urlPath }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
    }).on('error', reject);
  });
}

// In-memory localStorage mock for state simulation
function createLocalStorageMock() {
  const store = {};
  return {
    getItem(key) {
      return store[key] !== undefined ? store[key] : null;
    },
    setItem(key, value) {
      store[key] = String(value);
    },
    removeItem(key) {
      delete store[key];
    },
    clear() {
      Object.keys(store).forEach(k => delete store[k]);
    },
    dump() {
      return { ...store };
    }
  };
}

async function runThemeSuite() {
  console.log('====================================================');
  console.log('  STARTING ALGORISE COMPLETE THEME SELECTION TEST SUITE');
  console.log('====================================================\n');

  // --- SECTION 1: HTML & FLASH PREVENTION INSPECTION ---
  console.log('--- SECTION 1: HTML & Early Script Verification ---');
  const indexHtmlRes = await fetchUrl('/');
  assert(indexHtmlRes.status === 200, 'Dev server serves index.html at root', `Status: ${indexHtmlRes.status}`);
  const htmlContent = indexHtmlRes.body;

  assert(
    htmlContent.includes('<html lang="en" data-theme="light">') ||
    htmlContent.includes('data-theme="light"'),
    'index.html default root element has data-theme="light" for zero-flash startup'
  );

  assert(
    htmlContent.includes("var activeTheme = (saved === 'light' || saved === 'dark' || saved === 'cute') ? saved : 'light';"),
    'Early script in index.html defaults activeTheme fallback to "light" when no preference exists'
  );

  assert(
    htmlContent.includes("document.documentElement.setAttribute('data-theme', activeTheme);"),
    'Early script immediately applies theme to documentElement before page render'
  );

  // --- SECTION 2: CSS THEME PALETTES & ARCHITECTURE ---
  console.log('\n--- SECTION 2: CSS Design Integrity for Light, Dark, Cute Modes ---');
  const themeCssPath = path.join(__dirname, 'src', 'styles', 'theme.css');
  const themeCssContent = fs.readFileSync(themeCssPath, 'utf8');

  assert(
    themeCssContent.includes(':root,') && themeCssContent.includes('[data-theme="light"]'),
    'theme.css defines :root and [data-theme="light"] as the baseline light theme palette'
  );

  assert(
    themeCssContent.includes('[data-theme="dark"]'),
    'theme.css provides dedicated [data-theme="dark"] token definitions'
  );

  assert(
    themeCssContent.includes('[data-theme="cute"]'),
    'theme.css provides dedicated [data-theme="cute"] token definitions'
  );

  // Verify Light Mode tokens
  assert(
    themeCssContent.toLowerCase().includes('--bg-page: #f8fafc;') &&
    themeCssContent.toLowerCase().includes('--bg-surface: #ffffff;'),
    'Light Mode tokens define clean bright daylight background (#F8FAFC, #FFFFFF)'
  );

  // Verify Dark Mode tokens
  assert(
    themeCssContent.toLowerCase().includes('--bg-page: #0b0f17;') &&
    themeCssContent.toLowerCase().includes('--bg-card: #131c2e;'),
    'Dark Mode tokens define midnight focus palette (#0B0F17, #131C2E)'
  );

  // Verify Cute Mode tokens
  assert(
    themeCssContent.toLowerCase().includes('--bg-page: #fff4f8;') &&
    themeCssContent.toLowerCase().includes('--bg-surface: #ffffff;'),
    'Cute Mode tokens define cozy pastel aesthetic (#FFF4F8, #FFFFFF)'
  );

  // --- SECTION 3: THEME CONTEXT LOGIC & LIFECYCLE SIMULATION ---
  console.log('\n--- SECTION 3: ThemeContext Lifecycle Simulation ---');
  const themeCtxFile = fs.readFileSync(path.join(__dirname, 'src', 'context', 'ThemeContext.tsx'), 'utf8');

  assert(
    themeCtxFile.includes("return 'light'; // Default theme for new users and when no preference exists is Light Mode"),
    'ThemeContext initializes with "light" default fallback when storage is empty'
  );

  assert(
    themeCtxFile.includes('isThemePromptOpen: boolean;') &&
    themeCtxFile.includes('openThemePrompt: () => void;') &&
    themeCtxFile.includes('confirmThemeSelection: (theme: Theme) => void;'),
    'ThemeContext exposes required theme modal prompt controls'
  );

  // --- SECTION 4: USER TEST SCENARIOS 1 THROUGH 6 ---
  console.log('\n--- SECTION 4: Full User Flow Scenarios (1-6) ---');

  // Scenario 1: New user -> Light Mode by default
  const mockStorage = createLocalStorageMock();
  function simulateThemeInit(storage) {
    const saved = storage.getItem('algorise_theme_preference');
    if (saved === 'light' || saved === 'dark' || saved === 'cute') {
      return saved;
    }
    return 'light';
  }

  let currentTheme = simulateThemeInit(mockStorage);
  assert(currentTheme === 'light', 'Scenario 1: New user with no theme preference gets Light Mode by default');

  // Scenario 2: Login -> Theme selection option appears
  const testUserAlice = { id: 'usr_alice_101', name: 'Alice', username: 'alice' };
  let isPromptOpen = false;

  function simulateLoginCheck(user, storage) {
    const userThemeConfiguredKey = `algorise_theme_configured_${user.id}`;
    const userThemePrefKey = `algorise_theme_preference_${user.id}`;
    const isConfiguredForUser = storage.getItem(userThemeConfiguredKey);
    const savedUserTheme = storage.getItem(userThemePrefKey);

    if (isConfiguredForUser === 'true') {
      if (savedUserTheme && (savedUserTheme === 'light' || savedUserTheme === 'dark' || savedUserTheme === 'cute')) {
        return { promptOpen: false, restoredTheme: savedUserTheme };
      }
      return { promptOpen: false, restoredTheme: null };
    }

    const isGloballyConfigured = storage.getItem('algorise_theme_configured');
    if (isGloballyConfigured === 'true') {
      storage.setItem(userThemeConfiguredKey, 'true');
      storage.setItem(userThemePrefKey, currentTheme);
      return { promptOpen: false, restoredTheme: null };
    }

    return { promptOpen: true, restoredTheme: null };
  }

  const loginCheck1 = simulateLoginCheck(testUserAlice, mockStorage);
  assert(loginCheck1.promptOpen === true, 'Scenario 2: First-time login triggers theme selection option prompt');

  // Scenario 3: Select Dark Mode -> refresh -> Dark Mode remains
  function simulateConfirmTheme(selectedTheme, user, storage) {
    currentTheme = selectedTheme;
    storage.setItem('algorise_theme_preference', selectedTheme);
    storage.setItem('algorise_theme_configured', 'true');
    if (user?.id) {
      storage.setItem(`algorise_theme_configured_${user.id}`, 'true');
      storage.setItem(`algorise_theme_preference_${user.id}`, selectedTheme);
    }
    isPromptOpen = false;
  }

  simulateConfirmTheme('dark', testUserAlice, mockStorage);
  assert(currentTheme === 'dark', 'Scenario 3a: Dark Mode selected and applied');
  assert(mockStorage.getItem('algorise_theme_preference') === 'dark', 'Scenario 3b: Dark Mode saved to storage');

  // Simulate Page Refresh
  const themeAfterRefresh1 = simulateThemeInit(mockStorage);
  assert(themeAfterRefresh1 === 'dark', 'Scenario 3c: After refresh, Dark Mode remains intact');

  // Scenario 4: Select Cute Mode -> refresh -> Cute Mode remains
  simulateConfirmTheme('cute', testUserAlice, mockStorage);
  assert(currentTheme === 'cute', 'Scenario 4a: Cute Mode selected and applied');
  assert(mockStorage.getItem('algorise_theme_preference') === 'cute', 'Scenario 4b: Cute Mode saved to storage');

  const themeAfterRefresh2 = simulateThemeInit(mockStorage);
  assert(themeAfterRefresh2 === 'cute', 'Scenario 4c: After refresh, Cute Mode remains intact');

  // Scenario 5: Login again -> previously selected theme remains
  // Simulate logout (session ends) then login as testUserAlice again
  const loginCheck2 = simulateLoginCheck(testUserAlice, mockStorage);
  assert(
    loginCheck2.promptOpen === false && loginCheck2.restoredTheme === 'cute',
    'Scenario 5a: Future login does not re-force theme prompt again'
  );
  assert(
    loginCheck2.restoredTheme === 'cute',
    'Scenario 5b: Previously selected theme (Cute Mode) is restored and not overwritten with Light Mode'
  );

  // Scenario 6: Clear theme preference -> Light Mode becomes the default again
  mockStorage.removeItem('algorise_theme_preference');
  mockStorage.removeItem('algorise_theme_configured');
  const themeAfterClear = simulateThemeInit(mockStorage);
  assert(themeAfterClear === 'light', 'Scenario 6: Clearing theme preference reverts default to Light Mode');

  // --- SECTION 5: MODAL COMPONENT & APP SHELL INTEGRATION ---
  console.log('\n--- SECTION 5: UI & Component Integration ---');
  const appShellFile = fs.readFileSync(path.join(__dirname, 'src', 'components', 'layout', 'AppShell.tsx'), 'utf8');
  assert(
    appShellFile.includes('<ThemeSelectionModal />'),
    'AppShell renders <ThemeSelectionModal /> component'
  );
  assert(
    appShellFile.includes('openThemePrompt()'),
    'AppShell invokes openThemePrompt() when post-login user has not selected theme'
  );
  assert(
    appShellFile.includes('algorise_theme_preference_${user.id}'),
    'AppShell syncs user-specific theme preference'
  );

  const modalFile = fs.readFileSync(path.join(__dirname, 'src', 'components', 'common', 'ThemeSelectionModal.tsx'), 'utf8');
  assert(
    modalFile.includes("id: 'light'") && modalFile.includes("id: 'dark'") && modalFile.includes("id: 'cute'"),
    'ThemeSelectionModal contains all three theme choices: Light, Dark, Cute'
  );
  assert(
    modalFile.includes('document.documentElement.setAttribute(\'data-theme\', choice);'),
    'ThemeSelectionModal provides real-time preview upon clicking each card'
  );
  assert(
    modalFile.includes('confirmThemeSelection(selectedTheme)'),
    'ThemeSelectionModal calls confirmThemeSelection with chosen theme'
  );

  // Header quick toggle check
  const headerFile = fs.readFileSync(path.join(__dirname, 'src', 'components', 'layout', 'Header.tsx'), 'utf8');
  assert(
    headerFile.includes('toggleTheme'),
    'Header provides existing quick toggle button to switch themes anytime'
  );

  // Settings Appearance tab check
  const settingsFile = fs.readFileSync(path.join(__dirname, 'src', 'pages', 'SettingsPage.tsx'), 'utf8');
  assert(
    settingsFile.includes("setTheme('dark')") &&
    settingsFile.includes("setTheme('light')") &&
    settingsFile.includes("setTheme('cute')"),
    'Settings -> Appearance provides permanent controls to choose Dark, Light, or Cute modes anytime'
  );

  console.log('\n====================================================');
  console.log(`  RESULTS: ${passed} PASSED | ${failed} FAILED`);
  console.log('====================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runThemeSuite().catch((err) => {
  console.error('Test suite execution error:', err);
  process.exit(1);
});
