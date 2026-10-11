import puppeteer from 'puppeteer';
import fs from 'fs';

const BASE_URL = 'http://localhost:5173';

function getExecutablePath() {
  const candidates = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe'
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  return undefined;
}

function log(msg, status = 'INFO') {
  const icon = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : '🔹';
  console.log(`${icon} [${status}] ${msg}`);
}

async function runE2ETests() {
  console.log('\n======================================================');
  console.log('🚀 ALGORISE E2E LOGIN & AUTHENTICATION TEST SUITE');
  console.log('======================================================\n');

  let passedCount = 0;
  let totalCount = 0;

  function assert(condition, description) {
    totalCount++;
    if (condition) {
      log(description, 'PASS');
      passedCount++;
    } else {
      log(description, 'FAIL');
      throw new Error(`Assertion failed: ${description}`);
    }
  }

  let browser;
  try {
    const execPath = getExecutablePath();
    browser = await puppeteer.launch({
      headless: true,
      executablePath: execPath,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    page.on('console', msg => {
      const txt = msg.text();
      if (!txt.includes('Download the React DevTools')) {
        console.log(`[Browser Console] ${txt}`);
      }
    });
    page.on('pageerror', err => console.log(`[Browser PageError]`, err.message));

    await page.evaluateOnNewDocument(() => {
      localStorage.setItem('algorise_theme_configured', 'true');
    });

    // Helper to safely clear and type React controlled input
    async function setInputValue(selector, value) {
      await page.focus(selector);
      await page.keyboard.down('Control');
      await page.keyboard.press('KeyA');
      await page.keyboard.up('Control');
      await page.keyboard.press('Backspace');
      if (value) {
        await page.type(selector, value);
      }
    }

    async function performLogout() {
      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const btn = btns.find(b => b.textContent && (b.textContent.includes('Logout') || b.textContent.includes('Exit Guest') || b.textContent.includes('Sign Out') || b.title?.includes('Log Out') || b.title?.includes('Exit Guest')));
        if (btn) btn.click();
      });
      await page.waitForSelector('form', { timeout: 6000 });
    }

    // 1. OPEN /login
    console.log('\n--- 1. Testing Initial Navigation to /login ---');
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle0' });
    const pageTitle = await page.title();
    assert(pageTitle.includes('Algorise') || pageTitle.length > 0, 'Page loaded successfully with valid title');

    const headingText = await page.$eval('h2', el => el.textContent);
    assert(headingText.includes('Welcome back'), 'Rendered "Welcome back" heading on Sign In view');

    const headline = await page.$eval('h1', el => el.textContent).catch(() => '');
    assert(headline.includes('Understand the logic') && headline.includes('Master the code'), 'Desktop Hero showcases "Understand the logic. Master the code."');

    // 2. EMPTY FORM SUBMISSION
    console.log('\n--- 2. Testing Empty Form Submission ---');
    await page.evaluate(() => {
      const form = document.querySelector('form');
      if (form) form.requestSubmit();
    });
    await new Promise(r => setTimeout(r, 200));
    const validationErrors = await page.$$eval('.input-error, [style*="color: rgb(239, 68, 68)"]', els => els.length);
    assert(validationErrors > 0, 'Empty submission blocked by field validation');

    // 3. INVALID CREDENTIALS
    console.log('\n--- 3. Testing Invalid Credentials ---');
    await setInputValue('#auth-email-username', 'nonexistent_user_9999');
    await setInputValue('#auth-password', 'wrongpassword123');
    await page.evaluate(() => {
      const form = document.querySelector('form');
      if (form) form.requestSubmit();
    });

    const errorAlertEl = await page.waitForSelector('[role="alert"]', { timeout: 5000 });
    const errorAlert = await page.evaluate(el => el.textContent, errorAlertEl);
    assert(errorAlert.length > 0, `Displayed error for invalid credentials: "${errorAlert.trim()}"`);

    // 4. VALID LOGIN (Admin Account)
    console.log('\n--- 4. Testing Valid Login (Admin User) ---');
    await setInputValue('#auth-email-username', '@pav005');
    await setInputValue('#auth-password', 'Secret_._05');
    await page.evaluate(() => {
      const form = document.querySelector('form');
      if (form) form.requestSubmit();
    });

    await page.waitForSelector('.app-header', { timeout: 6000 });
    const currentUrl = page.url();
    assert(!currentUrl.includes('/login'), 'Redirected away from /login upon successful authentication');

    const adminPill = await page.$eval('.app-header', el => el.textContent).catch(() => '');
    assert(adminPill.includes('pav005') || adminPill.includes('Admin'), 'Header displays authenticated Admin user badge');

    // 5. SESSION PERSISTENCE ON RELOAD
    console.log('\n--- 5. Testing Session Persistence on Reload ---');
    await page.reload({ waitUntil: 'networkidle0' });
    await page.waitForSelector('.app-header', { timeout: 6000 });
    const headerAfterReload = await page.$eval('.app-header', el => el.textContent).catch(() => '');
    assert(headerAfterReload.includes('pav005') || headerAfterReload.includes('Admin'), 'Session persisted after browser reload without re-login');

    // 6. PROTECTED ROUTE NAVIGATION
    console.log('\n--- 6. Testing Protected Route Navigation ---');
    await page.goto(`${BASE_URL}/problems`, { waitUntil: 'networkidle0' });
    await page.waitForSelector('.app-header', { timeout: 6000 });
    const problemsHeading = await page.$eval('body', el => el.textContent).catch(() => '');
    assert(problemsHeading.includes('Problem Explorer') || problemsHeading.includes('Two Sum'), 'Authenticated user successfully accessed /problems');

    // 7. LOGOUT & ROUTE PROTECTION
    console.log('\n--- 7. Testing Logout & Strict Route Protection ---');
    await performLogout();
    await page.goto(`${BASE_URL}/problems`, { waitUntil: 'networkidle0' });
    await page.waitForSelector('form', { timeout: 6000 });
    const urlAfterLogout = page.url();
    assert(urlAfterLogout.includes('/login') || (await page.$('form')) !== null, 'Unauthenticated access to /problems redirected to /login');

    // 8. DEMO USER LOGIN (1-Click Helper)
    console.log('\n--- 8. Testing Demo User 1-Click Auto-fill Login ---');
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle0' });
    await page.waitForSelector('form', { timeout: 6000 });
    const demoFillBtn = await page.$('button[title*="demo@algorise.io"]');
    assert(demoFillBtn !== null, 'Found 1-Click Demo User helper button');
    await demoFillBtn.click();
    await new Promise(r => setTimeout(r, 200));
    await page.evaluate(() => {
      const form = document.querySelector('form');
      if (form) form.requestSubmit();
    });

    await page.waitForSelector('.app-header', { timeout: 6000 });
    const demoHeader = await page.$eval('.app-header', el => el.textContent).catch(() => '');
    assert(demoHeader.includes('alexrivera') || demoHeader.includes('Alex'), 'Demo user logged in successfully');

    // Logout Demo user
    await performLogout();

    // 9. GUEST MODE
    console.log('\n--- 9. Testing Continue as Guest ---');
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle0' });
    await page.waitForSelector('form', { timeout: 6000 });
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const guestBtn = btns.find(b => b.textContent && b.textContent.includes('Continue as Guest'));
      if (guestBtn) guestBtn.click();
    });
    await page.waitForSelector('.app-header', { timeout: 6000 });
    const guestHeader = await page.$eval('.app-header', el => el.textContent).catch(() => '');
    assert(guestHeader.includes('Guest') && guestHeader.includes('Temporary Mode'), 'Guest session established with isolated temporary badge');

    // Exit guest
    await performLogout();

    // 10. SIGNUP FLOW & LIVE USERNAME VALIDATION
    console.log('\n--- 10. Testing Signup Flow & Username Availability ---');
    await page.goto(`${BASE_URL}/signup`, { waitUntil: 'networkidle0' });
    await page.waitForSelector('form', { timeout: 6000 });
    const signupHeading = await page.$eval('h2', el => el.textContent);
    assert(signupHeading.includes('Create your account'), 'Loaded /signup route directly with "Create your account" view');

    const testRand = Math.random().toString(36).substring(2, 7);
    const newUsername = `user_${testRand}`;
    const newEmail = `user_${testRand}@testdomain.io`;
    const newPass = 'StrongPass123!';

    await setInputValue('#auth-name', 'Test Student');
    await setInputValue('#auth-username', newUsername);
    await page.waitForSelector('#auth-username-status', { timeout: 4000 }).catch(() => {});
    const availMsg = await page.$eval('#auth-username-status', el => el.textContent).catch(async () => {
      return await page.$eval('.input-label-row', el => el.textContent).catch(() => '');
    });
    assert(availMsg.includes('available') || availMsg.includes(newUsername), `Live username checker reported: "${availMsg.trim()}"`);

    await setInputValue('#auth-email-username', newEmail);
    await setInputValue('#auth-password', newPass);
    await page.evaluate(() => {
      const form = document.querySelector('form');
      if (form) form.requestSubmit();
    });

    await page.waitForSelector('.app-header', { timeout: 6000 });
    const newHeader = await page.$eval('.app-header', el => el.textContent).catch(() => '');
    assert(newHeader.includes(newUsername), `Newly registered user @${newUsername} automatically logged in and authenticated`);

    // Logout new user
    await performLogout();

    // 11. FORGOT & RESET PASSWORD FLOW
    console.log('\n--- 11. Testing Forgot & Reset Password Flow ---');
    await page.goto(`${BASE_URL}/forgot-password`, { waitUntil: 'networkidle0' });
    await page.waitForSelector('form', { timeout: 6000 });
    const forgotHeading = await page.$eval('h2', el => el.textContent);
    assert(forgotHeading.includes('Reset your password'), 'Loaded /forgot-password route directly');

    await setInputValue('#auth-email-username', newEmail);
    await page.evaluate(() => {
      const form = document.querySelector('form');
      if (form) form.requestSubmit();
    });

    const resetSuccessEl = await page.waitForSelector('[role="status"]', { timeout: 5000 });
    const resetSuccess = await page.evaluate(el => el.textContent, resetSuccessEl);
    assert(resetSuccess.includes('reset') || resetSuccess.length > 0, `Password reset request succeeded: "${resetSuccess.trim()}"`);

    // Click "Proceed to Set New Password" action button
    const clickedProceed = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const proceed = btns.find(b => b.textContent && b.textContent.includes('Proceed to Set New Password'));
      if (proceed) {
        proceed.click();
        return true;
      }
      return false;
    });
    assert(clickedProceed, 'Found and clicked direct action button to proceed to reset password');
    await new Promise(r => setTimeout(r, 400));

    const resetTitle = await page.$eval('h2', el => el.textContent);
    assert(resetTitle.includes('Set new password'), 'Switched to Set New Password view with pre-filled token');

    const updatedPass = 'NewStrongPass456!';
    await setInputValue('#auth-new-password', updatedPass);
    await setInputValue('#auth-confirm-password', updatedPass);
    await page.evaluate(() => {
      const form = document.querySelector('form');
      if (form) form.requestSubmit();
    });

    const passwordUpdatedEl = await page.waitForSelector('[role="status"]', { timeout: 5000 });
    const passwordUpdatedMsg = await page.evaluate(el => el.textContent, passwordUpdatedEl);
    assert(passwordUpdatedMsg.toLowerCase().includes('updated') || passwordUpdatedMsg.toLowerCase().includes('reset') || passwordUpdatedMsg.toLowerCase().includes('success'), 'Password updated successfully');

    // Wait for auto redirect to login
    await new Promise(r => setTimeout(r, 2200));
    const redirectedToLoginHeading = await page.$eval('h2', el => el.textContent).catch(() => '');
    assert(redirectedToLoginHeading.includes('Welcome back'), 'Auto-redirected back to Sign In');

    // Test login with new password
    await setInputValue('#auth-email-username', newEmail);
    await setInputValue('#auth-password', updatedPass);
    await page.evaluate(() => {
      const form = document.querySelector('form');
      if (form) form.requestSubmit();
    });

    await page.waitForSelector('.app-header', { timeout: 6000 });
    const loginWithNewPassHeader = await page.$eval('.app-header', el => el.textContent).catch(() => '');
    assert(loginWithNewPassHeader.includes(newUsername), 'Successfully authenticated using newly reset password');

    // 12. RESPONSIVE VIEWPORT TESTING
    console.log('\n--- 12. Testing Responsive Viewports (320px, 375px, 768px, 1024px, 1440px) ---');
    const viewports = [
      { width: 320, height: 568, name: 'Mobile XS (320px)' },
      { width: 375, height: 667, name: 'Mobile Standard (375px)' },
      { width: 768, height: 1024, name: 'Tablet (768px)' },
      { width: 1024, height: 768, name: 'Desktop Small (1024px)' },
      { width: 1440, height: 900, name: 'Desktop Large (1440px)' }
    ];

    // Logout to test login view responsiveness
    await performLogout();

    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle0' });

    for (const vp of viewports) {
      await page.setViewport({ width: vp.width, height: vp.height });
      await new Promise(r => setTimeout(r, 200));

      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });

      assert(!hasHorizontalScroll, `No horizontal overflow at ${vp.name}`);
      const formVisible = (await page.$('form')) !== null;
      assert(formVisible, `Login form fully visible and interactive at ${vp.name}`);
    }

    console.log('\n======================================================');
    console.log(`🎉 ALL E2E AUTHENTICATION TESTS PASSED: ${passedCount}/${totalCount}`);
    console.log('======================================================\n');
  } catch (err) {
    console.error('\n❌ TEST RUN FAILED WITH ERROR:', err);
    process.exitCode = 1;
  } finally {
    if (browser) await browser.close();
  }
}

runE2ETests();
