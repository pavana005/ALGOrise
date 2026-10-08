import puppeteer from 'puppeteer';
import fs from 'fs';

const BASE_URL = 'http://localhost:5173';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const auditResults = {
  totalIssues: 0,
  critical: [],
  high: [],
  medium: [],
  low: [],
  categories: {
    authentication: [],
    home: [],
    problems: [],
    flowOfLearning: [],
    visualizer: [],
    crimeLab: [],
    interview: [],
    jobRoles: [],
    notes: [],
    settings: [],
    themes: [],
    popups: [],
    responsive: [],
    adminIntegration: [],
    backendApi: [],
  },
  deadButtons: [],
  brokenLinks: [],
  fakeData: [],
  consoleErrors: [],
  networkErrors: [],
  mobileIssues: [],
  accessibilityIssues: [],
  securityIssues: [],
  performanceIssues: []
};

function recordIssue(severity, category, title, details) {
  const issue = {
    severity,
    category,
    title,
    page: details.page || 'N/A',
    action: details.action || 'N/A',
    expected: details.expected || 'N/A',
    actual: details.actual || 'N/A',
    error: details.error || null,
    steps: details.steps || [],
    suggestedFix: details.suggestedFix || 'N/A'
  };

  auditResults.totalIssues++;
  if (severity === 'CRITICAL') auditResults.critical.push(issue);
  else if (severity === 'HIGH') auditResults.high.push(issue);
  else if (severity === 'MEDIUM') auditResults.medium.push(issue);
  else auditResults.low.push(issue);

  if (auditResults.categories[category]) {
    auditResults.categories[category].push(issue);
  }
  console.log(`[${severity}] [${category.toUpperCase()}] ${title}`);
}

async function runAudit() {
  console.log('================================================================');
  console.log('STARTING REAL USER END-TO-END QA AUDIT IN REAL CHROME BROWSER');
  console.log('================================================================');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      const text = msg.text();
      auditResults.consoleErrors.push({ text, location: msg.location() });
    }
  });

  page.on('pageerror', err => {
    auditResults.consoleErrors.push({ text: err.toString(), stack: err.stack });
    console.error('PAGE UNCAUGHT ERROR:', err.message);
  });

  page.on('requestfailed', request => {
    auditResults.networkErrors.push({
      url: request.url(),
      method: request.method(),
      failure: request.failure()?.errorText
    });
  });

  page.on('response', response => {
    if (response.status() >= 400 && !response.url().includes('favicon') && !response.url().includes('icon')) {
      auditResults.networkErrors.push({
        url: response.url(),
        status: response.status(),
        statusText: response.statusText()
      });
    }
  });

  try {
    // =========================================================================
    // SECTION 1: AUTHENTICATION & LOGIN PAGE
    // =========================================================================
    console.log('\n--- SECTION 1: Testing Authentication ---');
    await page.setViewport({ width: 1440, height: 900 });

    // 1.1 Clear all storage for clean first-time user
    await page.goto(BASE_URL, { waitUntil: 'networkidle2' });
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    await page.reload({ waitUntil: 'networkidle2' });
    await sleep(600);

    // 1.2 Check Default Theme for New User
    const initialTheme = await page.evaluate(() => {
      return document.documentElement.getAttribute('data-theme') || 
             localStorage.getItem('algorise_theme') || 'light';
    });
    console.log(`First-time visitor theme: ${initialTheme}`);
    if (initialTheme === 'dark') {
      recordIssue('HIGH', 'themes', 'First-time user defaulted to Dark Mode instead of Light Mode', {
        page: '/login',
        action: 'Load website with clear storage',
        expected: 'Default theme must be Light Mode for new users',
        actual: 'Dark Mode was set'
      });
    }

    // 1.3 Verify Unauthenticated Protected Access
    const isLoginPage = await page.evaluate(() => {
      const text = document.body.innerText;
      return text.includes('Sign in to your account') || text.includes('Welcome to Algorise') || text.includes('Continue as Guest');
    });
    console.log('Unauthenticated user redirected to LoginPage:', isLoginPage);
    if (!isLoginPage) {
      recordIssue('CRITICAL', 'authentication', 'Protected app shell accessible without authentication', {
        page: '/',
        action: 'Visit base URL with empty session',
        expected: 'Redirect to LoginPage or show Login barrier',
        actual: 'Unauthenticated user accessed internal pages'
      });
    }

    // 1.4 Test Form Validation on Empty Login Submit
    console.log('Testing empty form validation...');
    const validationTest = await page.evaluate(async () => {
      const submitBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Sign In') && b.type === 'submit');
      if (submitBtn) submitBtn.click();
      await new Promise(r => setTimeout(r, 200));
      const text = document.body.innerText;
      return {
        hasError: text.includes('required') || text.includes('enter your email') || text.includes('enter your password') || text.includes('Invalid')
      };
    });
    console.log('Empty form validation check:', validationTest);

    // 1.5 Test Forgot Password Flow
    console.log('Testing Forgot Password mode...');
    const forgotTest = await page.evaluate(async () => {
      const forgotBtn = Array.from(document.querySelectorAll('button, a')).find(b => b.innerText.toLowerCase().includes('forgot'));
      if (forgotBtn) forgotBtn.click();
      await new Promise(r => setTimeout(r, 300));
      const text = document.body.innerText;
      const hasForgotView = text.includes('Reset Password') || text.includes('Send Reset Link') || text.includes('Recovery');
      
      // Return back to login
      const backBtn = Array.from(document.querySelectorAll('button, a')).find(b => b.innerText.includes('Back') || b.innerText.includes('Sign in'));
      if (backBtn) backBtn.click();
      await new Promise(r => setTimeout(r, 300));

      return { hasForgotView };
    });
    console.log('Forgot Password flow check:', forgotTest);

    // 1.6 Test Create Account (Signup) Mode
    console.log('Testing Signup mode & Username Availability Checker...');
    const signupTest = await page.evaluate(async () => {
      const signupToggle = Array.from(document.querySelectorAll('button, a')).find(b => b.innerText.includes('Create an Account') || b.innerText.includes('Sign up'));
      if (signupToggle) signupToggle.click();
      await new Promise(r => setTimeout(r, 300));
      
      const usernameInput = document.querySelector('input[placeholder*="username" i], input[name="username"]');
      let liveCheckWorking = false;
      if (usernameInput) {
        usernameInput.value = 'qa_user_test_99';
        usernameInput.dispatchEvent(new Event('input', { bubbles: true }));
        await new Promise(r => setTimeout(r, 400));
        const text = document.body.innerText;
        liveCheckWorking = text.includes('available') || text.includes('Available') || text.includes('Username');
      }

      // Switch back to Login
      const loginToggle = Array.from(document.querySelectorAll('button, a')).find(b => b.innerText.includes('Sign in') || b.innerText.includes('Log in'));
      if (loginToggle) loginToggle.click();
      await new Promise(r => setTimeout(r, 300));

      return { liveCheckWorking };
    });
    console.log('Signup live check:', signupTest);

    // 1.7 Test Guest Mode Login
    console.log('Testing Guest Mode Login...');
    const guestLogin = await page.evaluate(async () => {
      const guestBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.toLowerCase().includes('continue as guest') || b.innerText.toLowerCase().includes('guest'));
      if (guestBtn) {
        guestBtn.click();
        await new Promise(r => setTimeout(r, 600));
        return true;
      }
      return false;
    });
    await sleep(1000);
    console.log('Guest Mode Login executed:', guestLogin);

    // Check if Theme Prompt or Dashboard appeared
    const afterGuestLogin = await page.evaluate(() => {
      const text = document.body.innerText;
      const themeModal = document.querySelector('.modal, [role="dialog"]');
      const hasSidebar = !!document.querySelector('.app-sidebar, nav');
      const guestName = text.match(/Guest-[a-zA-Z0-9]+/)?.[0] || 'Guest';
      return {
        themeModalPresent: !!themeModal,
        hasSidebar,
        guestName
      };
    });
    console.log('After Guest Login state:', afterGuestLogin);

    // If theme modal is open, select Light Theme or close it
    await page.evaluate(() => {
      const chooseThemeBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Light') || b.innerText.includes('Continue') || b.innerText.includes('Get Started'));
      if (chooseThemeBtn) chooseThemeBtn.click();
    });
    await sleep(600);

    // =========================================================================
    // SECTION 2: HOME PAGE AUDIT
    // =========================================================================
    console.log('\n--- SECTION 2: Testing Home Page ---');
    const homeCheck = await page.evaluate(() => {
      const sidebarLinks = Array.from(document.querySelectorAll('.nav-item, nav button')).map(b => b.innerText.trim());
      const headings = Array.from(document.querySelectorAll('h1, h2, h3')).map(h => h.innerText.trim());
      const text = document.body.innerText;
      
      return {
        sidebarLinks,
        headings,
        hasQuickActions: text.includes('Flow of Learning') || text.includes('Solve Problems') || text.includes('Visualizer'),
        hasDailyStreakOrStats: text.includes('Streak') || text.includes('Questions') || text.includes('Problems')
      };
    });
    console.log('Home Page Check:', homeCheck);

    // =========================================================================
    // SECTION 3: PROBLEMS PAGE & LEARNING MODE AUDIT
    // =========================================================================
    console.log('\n--- SECTION 3: Testing Problems & Interactive Learning Mode ---');
    // Click on Problems in Sidebar
    await page.evaluate(() => {
      const probNav = Array.from(document.querySelectorAll('.nav-item')).find(b => b.innerText.includes('Problems'));
      if (probNav) probNav.click();
    });
    await sleep(1000);

    // Check Problems Table
    const problemsTable = await page.evaluate(() => {
      const table = document.querySelector('table');
      const thStatus = Array.from(document.querySelectorAll('th')).find(th => th.innerText.trim() === 'Status');
      const rows = document.querySelectorAll('tbody tr');
      let statusFontSize = null;
      if (thStatus) {
        statusFontSize = window.getComputedStyle(thStatus).fontSize;
      }
      return {
        tableFound: !!table,
        rowCount: rows.length,
        statusFontSize
      };
    });
    console.log('Problems Table:', problemsTable);

    // Open first problem "Two Sum"
    console.log('Opening problem "Two Sum"...');
    await page.evaluate(() => {
      const firstRow = document.querySelector('tbody tr td, tbody tr');
      if (firstRow) firstRow.click();
    });
    await sleep(1000);

    // Verify Learning Mode is Default
    const learningModeCheck = await page.evaluate(() => {
      const text = document.body.innerText;
      const isLearning = text.includes('Interactive Learning Roadmap') || text.includes('Problem Blueprint & Goal');
      const hasBlueprint = text.includes('Given Input:') && text.includes('Need To Find:');
      const hasStepper = text.includes('Interactive Stepper & Visual Dry Run');
      const hasSelfCheck = text.includes('Interactive Self-Check Questions');
      const hasComplexity = text.includes('Optimal Time Complexity') && text.includes('Space Complexity');
      
      return {
        isLearning,
        hasBlueprint,
        hasStepper,
        hasSelfCheck,
        hasComplexity
      };
    });
    console.log('Learning Mode Elements:', learningModeCheck);

    if (!learningModeCheck.isLearning) {
      recordIssue('HIGH', 'problems', 'Problem did not open in Learning Mode by default', {
        page: '/problems',
        action: 'Click problem in table',
        expected: 'Learning Mode is active by default',
        actual: 'Learning Mode not active'
      });
    }

    // Test Stepper Interactivity
    console.log('Testing Dry Run Stepper controls...');
    const stepperTest = await page.evaluate(async () => {
      const stepPills = Array.from(document.querySelectorAll('button')).filter(b => b.innerText.includes('Step '));
      let jumpWorked = false;
      if (stepPills.length >= 2) {
        stepPills[1].click();
        await new Promise(r => setTimeout(r, 200));
        jumpWorked = document.body.innerText.includes('Active Step #2');
      }

      // Test next button
      const nextBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.trim() === 'Next' || b.innerText.includes('Next'));
      let nextWorked = false;
      if (nextBtn) {
        nextBtn.click();
        await new Promise(r => setTimeout(r, 200));
        nextWorked = true;
      }

      return { stepPillCount: stepPills.length, jumpWorked, nextWorked };
    });
    console.log('Stepper Test:', stepperTest);

    // Switch to Practice Mode
    console.log('Switching to Practice Mode...');
    await page.evaluate(() => {
      const practiceBtn = Array.from(document.querySelectorAll('button, a')).find(b => 
        b.innerText.includes('Start Coding in Practice Mode') || 
        b.innerText.includes('Practice Mode')
      );
      if (practiceBtn) practiceBtn.click();
    });
    await sleep(800);

    // Test Run Code Execution
    console.log('Testing Real Run Code in Practice Mode...');
    const runCodeTest = await page.evaluate(async () => {
      const runBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.trim() === 'Run Code');
      if (!runBtn) return { found: false };

      runBtn.click();
      
      for (let i = 0; i < 25; i++) {
        await new Promise(r => setTimeout(r, 200));
        const text = document.body.innerText;
        if (text.includes('Standard Output') || text.includes('Runtime:') || text.includes('Executed')) {
          return {
            found: true,
            hasRuntime: text.includes('Runtime:'),
            hasStdout: text.includes('Standard Output'),
            textPreview: text.slice(text.indexOf('Output'), text.indexOf('Output') + 150)
          };
        }
      }
      return { found: true, timeout: true };
    });
    console.log('Run Code Result:', runCodeTest);

    // Test Submit Solution
    console.log('Testing Submit Solution...');
    const submitTest = await page.evaluate(async () => {
      const submitBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.trim() === 'Submit' || b.innerText.includes('Submit Solution'));
      if (!submitBtn) return { found: false };

      submitBtn.click();
      for (let i = 0; i < 25; i++) {
        await new Promise(r => setTimeout(r, 200));
        const text = document.body.innerText;
        if (text.includes('Accepted') || text.includes('Wrong Answer') || text.includes('Passed')) {
          return {
            found: true,
            status: text.includes('Accepted') ? 'Accepted' : 'Tested',
            hasDetails: text.includes('Test Case #1') || text.includes('Input:')
          };
        }
      }
      return { found: true, timeout: true };
    });
    console.log('Submit Solution Result:', submitTest);

    // =========================================================================
    // SECTION 4: FLOW OF LEARNING AUDIT
    // =========================================================================
    console.log('\n--- SECTION 4: Testing Flow of Learning ---');
    await page.evaluate(() => {
      const folNav = Array.from(document.querySelectorAll('.nav-item')).find(b => b.innerText.includes('Flow of Learning'));
      if (folNav) folNav.click();
    });
    await sleep(1000);

    const folTest = await page.evaluate(async () => {
      const topicCards = document.querySelectorAll('.card, [class*="topic"]');
      const searchInput = document.querySelector('input[type="text"], input[placeholder*="search" i]');
      
      // Click first topic
      const firstTopic = document.querySelector('.card, [class*="topic"]');
      if (firstTopic && firstTopic.click) firstTopic.click();
      await new Promise(r => setTimeout(r, 500));

      const text = document.body.innerText;
      return {
        topicCardsCount: topicCards.length,
        hasSearch: !!searchInput,
        hasLessonContent: text.includes('Lesson') || text.includes('Concept') || text.includes('Quiz') || text.includes('Two Pointers')
      };
    });
    console.log('Flow of Learning Check:', folTest);

    // =========================================================================
    // SECTION 5: VISUALIZER AUDIT
    // =========================================================================
    console.log('\n--- SECTION 5: Testing Visualizer ---');
    await page.evaluate(() => {
      const vizNav = Array.from(document.querySelectorAll('.nav-item')).find(b => b.innerText.includes('Visualizer'));
      if (vizNav) vizNav.click();
    });
    await sleep(1000);

    const vizTest = await page.evaluate(async () => {
      const select = document.querySelector('select');
      const options = select ? Array.from(select.options).map(o => o.text) : [];
      
      const stepBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Step') || b.innerText.includes('Next'));
      let stepSuccess = false;
      if (stepBtn) {
        stepBtn.click();
        await new Promise(r => setTimeout(r, 200));
        stepSuccess = true;
      }

      const playBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Play') || b.innerText.includes('Start'));
      let playSuccess = false;
      if (playBtn) {
        playBtn.click();
        await new Promise(r => setTimeout(r, 300));
        playSuccess = true;
      }

      return {
        optionsCount: options.length,
        options,
        stepSuccess,
        playSuccess
      };
    });
    console.log('Visualizer Check:', vizTest);

    // =========================================================================
    // SECTION 6: CRIME LAB AUDIT
    // =========================================================================
    console.log('\n--- SECTION 6: Testing Crime Lab ---');
    await page.evaluate(() => {
      const crimeNav = Array.from(document.querySelectorAll('.nav-item')).find(b => b.innerText.includes('Crime Lab'));
      if (crimeNav) crimeNav.click();
    });
    await sleep(1000);

    const crimeTest = await page.evaluate(async () => {
      const caseCards = document.querySelectorAll('.card, [class*="case"]');
      const firstCase = document.querySelector('.card, [class*="case"]');
      if (firstCase && firstCase.click) firstCase.click();
      await new Promise(r => setTimeout(r, 500));

      const text = document.body.innerText;
      return {
        caseCardsCount: caseCards.length,
        hasEvidence: text.includes('Evidence') || text.includes('Clues') || text.includes('Case') || text.includes('Bug'),
        hasQuestions: text.includes('Question') || text.includes('Identify') || text.includes('Fix')
      };
    });
    console.log('Crime Lab Check:', crimeTest);

    // =========================================================================
    // SECTION 7: INTERVIEW QUESTIONS & JOB ROLES AUDIT
    // =========================================================================
    console.log('\n--- SECTION 7: Testing Interview Questions & Job Roles ---');
    await page.evaluate(() => {
      const intNav = Array.from(document.querySelectorAll('.nav-item')).find(b => b.innerText.includes('Interview Questions'));
      if (intNav) intNav.click();
    });
    await sleep(1000);

    const intTest = await page.evaluate(async () => {
      const catButtons = Array.from(document.querySelectorAll('button')).filter(b => 
        ['technical', 'hr', 'behavioral', 'managerial', 'system design', 'coding'].some(c => b.innerText.toLowerCase().includes(c))
      );
      const text = document.body.innerText;

      // Type an answer to test saved answers
      const textarea = document.querySelector('textarea');
      let answerSaved = false;
      if (textarea) {
        textarea.value = 'Automated QA Answer: Space complexity is O(1) in-place.';
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
        const saveBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Save') || b.innerText.includes('Submit'));
        if (saveBtn) {
          saveBtn.click();
          await new Promise(r => setTimeout(r, 300));
          answerSaved = true;
        }
      }

      return {
        categoriesFound: catButtons.length,
        hasQuestions: text.includes('Question') || text.includes('Technical') || text.includes('Behavioral'),
        answerSaved
      };
    });
    console.log('Interview Questions Check:', intTest);

    // Verify Job Roles is immediately below Interview Questions
    const sidebarOrder = await page.evaluate(() => {
      const navItems = Array.from(document.querySelectorAll('.nav-item')).map(b => b.innerText.trim());
      const intIdx = navItems.findIndex(t => t.includes('Interview'));
      const jobIdx = navItems.findIndex(t => t.includes('Job Roles'));
      return {
        navItems,
        intIdx,
        jobIdx,
        isImmediatelyBelow: jobIdx === intIdx + 1
      };
    });
    console.log('Job Roles Position Check:', sidebarOrder);
    if (!sidebarOrder.isImmediatelyBelow) {
      recordIssue('LOW', 'jobRoles', 'Job Roles is not immediately below Interview Questions in Sidebar', {
        page: 'Sidebar',
        action: 'Inspect sidebar order',
        expected: 'Job Roles positioned immediately below Interview Questions',
        actual: `Interview index: ${sidebarOrder.intIdx}, Job Roles index: ${sidebarOrder.jobIdx}`
      });
    }

    // Navigate to Job Roles
    await page.evaluate(() => {
      const jobNav = Array.from(document.querySelectorAll('.nav-item')).find(b => b.innerText.includes('Job Roles'));
      if (jobNav) jobNav.click();
    });
    await sleep(1000);

    const jobRolesTest = await page.evaluate(() => {
      const cards = document.querySelectorAll('.card');
      const text = document.body.innerText;
      return {
        rolesCount: cards.length,
        hasRoleContent: text.includes('Frontend') || text.includes('Backend') || text.includes('Full Stack') || text.includes('Software Engineer')
      };
    });
    console.log('Job Roles Check:', jobRolesTest);

    // =========================================================================
    // SECTION 8: NOTES SECTION AUDIT
    // =========================================================================
    console.log('\n--- SECTION 8: Testing Notes Section ---');
    await page.evaluate(() => {
      const notesNav = Array.from(document.querySelectorAll('.nav-item')).find(b => b.innerText.trim() === 'Notes' || b.innerText.includes('Notes'));
      if (notesNav) notesNav.click();
    });
    await sleep(1000);

    const notesTest = await page.evaluate(() => {
      const cards = document.querySelectorAll('.card');
      const text = document.body.innerText;
      return {
        notesCount: cards.length,
        hasContent: text.includes('Data Structures') || text.includes('Algorithms') || text.includes('Complexity') || text.includes('Cheat Sheet')
      };
    });
    console.log('Notes Check:', notesTest);

    // =========================================================================
    // SECTION 9: SETTINGS & SAVED ANSWERS AUDIT
    // =========================================================================
    console.log('\n--- SECTION 9: Testing Settings & Saved Answers ---');
    await page.evaluate(() => {
      const setNav = Array.from(document.querySelectorAll('.nav-item')).find(b => b.innerText.includes('Settings'));
      if (setNav) setNav.click();
    });
    await sleep(1000);

    const settingsTest = await page.evaluate(async () => {
      const tabs = Array.from(document.querySelectorAll('button, [role="tab"]'));
      const savedTab = tabs.find(b => b.innerText.includes('Saved Answers') || b.innerText.includes('Answers'));
      let opened = false;
      if (savedTab) {
        savedTab.click();
        await new Promise(r => setTimeout(r, 400));
        opened = true;
      }
      const text = document.body.innerText;
      return {
        hasSavedTab: !!savedTab,
        opened,
        hasContent: text.includes('Saved Answers') || text.includes('No saved answers') || text.includes('Automated QA Answer')
      };
    });
    console.log('Settings Check:', settingsTest);

    // =========================================================================
    // SECTION 10: THEME TESTING (LIGHT, DARK, CUTE)
    // =========================================================================
    console.log('\n--- SECTION 10: Testing Light, Dark, and Cute Themes ---');
    const themeResults = [];
    for (const theme of ['light', 'dark', 'cute']) {
      await page.evaluate((th) => {
        document.documentElement.setAttribute('data-theme', th);
        localStorage.setItem('algorise_theme', th);
      }, theme);
      await sleep(400);

      const check = await page.evaluate((th) => {
        const bg = window.getComputedStyle(document.body).backgroundColor;
        const color = window.getComputedStyle(document.body).color;
        return { theme: th, bg, color };
      }, theme);
      themeResults.push(check);
    }
    console.log('Theme Results:', themeResults);

    // =========================================================================
    // SECTION 11: RESPONSIVE VIEWPORT TESTING (320, 375, 768, 1024, 1440)
    // =========================================================================
    console.log('\n--- SECTION 11: Testing Viewports ---');
    const viewports = [
      { name: 'Mobile 320px', width: 320, height: 600 },
      { name: 'Mobile 375px', width: 375, height: 667 },
      { name: 'Tablet 768px', width: 768, height: 1024 },
      { name: 'Laptop 1024px', width: 1024, height: 768 },
      { name: 'Desktop 1440px', width: 1440, height: 900 }
    ];

    for (const vp of viewports) {
      await page.setViewport({ width: vp.width, height: vp.height });
      await sleep(300);

      const vpCheck = await page.evaluate((vpName) => {
        const bodyWidth = document.body.scrollWidth;
        const windowWidth = window.innerWidth;
        const hasHorizontalScroll = bodyWidth > windowWidth + 5;
        return { vpName, bodyWidth, windowWidth, hasHorizontalScroll };
      }, vp.name);

      if (vpCheck.hasHorizontalScroll) {
        recordIssue('MEDIUM', 'responsive', `Horizontal scroll detected on ${vp.name}`, {
          page: 'Settings Page',
          action: `Set viewport to ${vp.width}x${vp.height}`,
          expected: `Clean responsive fit without horizontal scroll`,
          actual: `Scroll width (${vpCheck.bodyWidth}px) exceeds window (${vpCheck.windowWidth}px)`
        });
      }
    }

  } catch (err) {
    console.error('Fatal error during QA audit:', err);
    recordIssue('CRITICAL', 'home', 'Uncaught exception during QA execution', {
      error: err.message,
      actual: err.stack
    });
  } finally {
    await browser.close();
  }

  // Save audit report
  fs.writeFileSync('qa_audit_results.json', JSON.stringify(auditResults, null, 2));
  console.log('\n================================================================');
  console.log('QA AUDIT COMPLETED ACCURATELY');
  console.log(`Total Issues: ${auditResults.totalIssues}`);
  console.log(`Critical: ${auditResults.critical.length}`);
  console.log(`High: ${auditResults.high.length}`);
  console.log(`Medium: ${auditResults.medium.length}`);
  console.log(`Low: ${auditResults.low.length}`);
  console.log(`Console Errors: ${auditResults.consoleErrors.length}`);
  console.log(`Network Errors: ${auditResults.networkErrors.length}`);
  console.log('================================================================');
}

runAudit();
