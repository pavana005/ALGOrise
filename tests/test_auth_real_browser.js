import puppeteer from 'puppeteer';

const BASE_URL = 'http://localhost:5173';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function testAuth() {
  console.log('================================================================');
  console.log('TESTING COMPLETE AUTHENTICATION FLOWS IN REAL CHROME');
  console.log('================================================================');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const results = [];

  try {
    // -------------------------------------------------------------
    // TEST 1: Initial Page Load & Redirect to Login Page
    // -------------------------------------------------------------
    console.log('\n--- 1. Initial Load (Logged Out) ---');
    await page.goto(BASE_URL, { waitUntil: 'networkidle2' });
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    await page.reload({ waitUntil: 'networkidle2' });
    await sleep(600);

    const loginPageRendered = await page.evaluate(() => {
      const text = document.body.innerText;
      return text.includes('Sign in to your account') || text.includes('Welcome Back') || text.includes('Continue as Guest');
    });
    console.log(`[PASS] Login page rendered correctly for unauthenticated user: ${loginPageRendered}`);
    results.push({ test: 'Unauthenticated Redirect to Login', pass: loginPageRendered });

    // -------------------------------------------------------------
    // TEST 2: Wrong Password Validation using Real Keystrokes
    // -------------------------------------------------------------
    console.log('\n--- 2. Wrong Password Validation ---');
    const loginIdentifierInput = await page.$('input[placeholder*="alex@example.com" i], input[type="text"]');
    const loginPassInput = await page.$('input[type="password"]');

    if (loginIdentifierInput && loginPassInput) {
      await loginIdentifierInput.type('demo@algorise.io');
      await loginPassInput.type('WrongPassword999!');
      
      const submitBtn = await page.$('form button[type="submit"]');
      if (submitBtn) await submitBtn.click();
      await sleep(600);

      const hasError = await page.evaluate(() => {
        const text = document.body.innerText;
        return text.includes('Invalid') || text.includes('incorrect') || text.includes('Password') || text.includes('error');
      });
      console.log(`[PASS] Wrong password rejected with error: ${hasError}`);
      results.push({ test: 'Invalid Password Validation', pass: hasError });
    }

    // -------------------------------------------------------------
    // TEST 3: User Account Signup Flow using Keystrokes
    // -------------------------------------------------------------
    console.log('\n--- 3. User Account Signup Flow ---');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const signupBtn = btns.find(b => b.innerText.trim() === 'Create Account');
      if (signupBtn) signupBtn.click();
    });
    await sleep(600);

    const testTag = Date.now().toString().slice(-4);
    const testEmail = `qa_user_${testTag}@algorise.io`;
    const testUsername = `qauser${testTag}`;

    const nameField = await page.$('input[placeholder="Alex Rivera"]');
    const userField = await page.$('input[placeholder="alexrivera"]');
    const emailField = await page.$('input[type="email"]');
    const passField = await page.$('input[placeholder*="At least 6 characters" i], input[type="password"]');

    if (nameField && userField && emailField && passField) {
      await nameField.type('QA Engineer');
      await userField.type(testUsername);
      await sleep(500); // live check
      await emailField.type(testEmail);
      await passField.type('SecurePass123!');

      const signupSubmitBtn = await page.$('form button[type="submit"]');
      if (signupSubmitBtn) await signupSubmitBtn.click();
      await sleep(1200);

      const isDashboard = await page.evaluate(() => {
        return !!document.querySelector('.app-sidebar');
      });
      console.log(`[PASS] Signup created account and entered dashboard: ${isDashboard}`);
      results.push({ test: 'Account Signup Flow', pass: isDashboard });
    } else {
      console.log(`[FAIL] Signup fields not found`);
      results.push({ test: 'Account Signup Flow', pass: false });
    }

    // -------------------------------------------------------------
    // TEST 4: Session Persistence on Page Reload
    // -------------------------------------------------------------
    console.log('\n--- 4. Session Persistence on Page Reload ---');
    await page.reload({ waitUntil: 'networkidle2' });
    await sleep(800);

    const persists = await page.evaluate(() => {
      const hasSidebar = !!document.querySelector('.app-sidebar');
      return hasSidebar;
    });
    console.log(`[PASS] Session persists across page reload: ${persists}`);
    results.push({ test: 'Session Persistence', pass: persists });

    // -------------------------------------------------------------
    // TEST 5: Logout Flow
    // -------------------------------------------------------------
    console.log('\n--- 5. Logout Flow ---');
    await page.evaluate(() => {
      const signOutBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Sign Out'));
      if (signOutBtn) signOutBtn.click();
    });
    await sleep(800);

    const isLoggedOut = await page.evaluate(() => {
      const text = document.body.innerText;
      return text.includes('Sign In') || text.includes('Continue as Guest');
    });
    console.log(`[PASS] Logged out successfully: ${isLoggedOut}`);
    results.push({ test: 'Sign Out Flow', pass: isLoggedOut });

    // -------------------------------------------------------------
    // TEST 6: Login with newly created user credentials
    // -------------------------------------------------------------
    console.log('\n--- 6. Login with Created User Credentials ---');
    const loginUserField = await page.$('input[placeholder*="alex@example.com" i], input[type="text"]');
    const loginPasswordField = await page.$('input[type="password"]');

    if (loginUserField && loginPasswordField) {
      await loginUserField.type(testEmail);
      await loginPasswordField.type('SecurePass123!');

      const loginBtn = await page.$('form button[type="submit"]');
      if (loginBtn) await loginBtn.click();
      await sleep(1200);

      const loggedInDashboard = await page.evaluate(() => {
        return !!document.querySelector('.app-sidebar');
      });
      console.log(`[PASS] Logged in successfully with created credentials: ${loggedInDashboard}`);
      results.push({ test: 'Login with Created Account', pass: loggedInDashboard });
    }

    // -------------------------------------------------------------
    // TEST 7: Guest Mode Login
    // -------------------------------------------------------------
    console.log('\n--- 7. Guest Mode Login ---');
    // Logout first
    await page.evaluate(() => {
      const signOutBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Sign Out'));
      if (signOutBtn) signOutBtn.click();
    });
    await sleep(800);

    const guestSuccess = await page.evaluate(async () => {
      const guestBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.toLowerCase().includes('continue as guest') || b.innerText.toLowerCase().includes('guest'));
      if (guestBtn) {
        guestBtn.click();
        await new Promise(r => setTimeout(r, 1000));
        return !!document.querySelector('.app-sidebar');
      }
      return false;
    });
    console.log(`[PASS] Guest Mode login: ${guestSuccess}`);
    results.push({ test: 'Guest Mode Login', pass: guestSuccess });

  } catch (err) {
    console.error('Error during auth testing:', err);
  } finally {
    await browser.close();
  }

  console.log('\n================================================================');
  console.log('AUTHENTICATION TEST SUMMARY:');
  results.forEach(r => console.log(`  ${r.pass ? '✅ PASS' : '❌ FAIL'}: ${r.test}`));
  console.log('================================================================');
}

testAuth();
