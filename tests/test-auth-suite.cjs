const http = require('http');

const PORT = 5173;

function request(options, body) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: 'localhost',
        port: PORT,
        ...options
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          try {
            const parsed = data ? JSON.parse(data) : {};
            resolve({ status: res.statusCode, headers: res.headers, data: parsed, raw: data });
          } catch (e) {
            resolve({ status: res.statusCode, headers: res.headers, data, raw: data });
          }
        });
      }
    );
    req.on('error', reject);
    if (body) {
      req.write(typeof body === 'string' ? body : JSON.stringify(body));
    }
    req.end();
  });
}

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

async function runTests() {
  console.log('====================================================');
  console.log('  STARTING ALGORISE COMPLETE AUTHENTICATION TEST SUITE');
  console.log('====================================================\n');

  // 1. Unauthenticated API access protection
  const noAuthAdmin = await request({ path: '/api/admin/stats', method: 'GET' });
  assert(noAuthAdmin.status === 401, 'Unauthenticated access to /api/admin/stats returns 401', `Got: ${noAuthAdmin.status}`);

  const noAuthProgress = await request({ path: '/api/user/progress', method: 'GET' });
  assert(noAuthProgress.status === 401, 'Unauthenticated access to /api/user/progress returns 401', `Got: ${noAuthProgress.status}`);

  const noAuthMe = await request({ path: '/api/auth/me', method: 'GET' });
  assert(noAuthMe.status === 401, 'Unauthenticated access to /api/auth/me returns 401', `Got: ${noAuthMe.status}`);

  // 2. Login error validations
  const emptyLogin = await request({ path: '/api/auth/login', method: 'POST', headers: { 'Content-Type': 'application/json' } }, {});
  assert(emptyLogin.status === 400, 'Login with missing fields returns 400', `Got: ${emptyLogin.status}`);

  const missingPass = await request({ path: '/api/auth/login', method: 'POST', headers: { 'Content-Type': 'application/json' } }, { emailOrUsername: 'admin@algorise.io' });
  assert(missingPass.status === 400, 'Login with missing password returns 400', `Got: ${missingPass.status}`);

  const notFoundLogin = await request({ path: '/api/auth/login', method: 'POST', headers: { 'Content-Type': 'application/json' } }, { emailOrUsername: 'unknown_user_9999', password: 'password123' });
  assert(notFoundLogin.status === 404, 'Login with non-existent account returns 404 Account Not Found', `Got: ${notFoundLogin.status}`);

  const wrongPassLogin = await request({ path: '/api/auth/login', method: 'POST', headers: { 'Content-Type': 'application/json' } }, { emailOrUsername: 'demo@algorise.io', password: 'wrongpassword' });
  assert(wrongPassLogin.status === 401, 'Login with incorrect password returns 401 Incorrect Password', `Got: ${wrongPassLogin.status}`);

  // 3. Successful authentication
  const demoLogin = await request({ path: '/api/auth/login', method: 'POST', headers: { 'Content-Type': 'application/json' } }, { emailOrUsername: 'alexrivera', password: 'password123' });
  assert(demoLogin.status === 200, 'Demo user login succeeds with 200 OK', `Got: ${demoLogin.status}`);
  assert(demoLogin.data.token && demoLogin.data.token.startsWith('alg_token_'), 'Demo user receives valid session token', `Token: ${demoLogin.data.token}`);
  assert(!demoLogin.data.user.password, 'User password hash is sanitized and NOT exposed in login response');
  const demoToken = demoLogin.data.token;

  const adminLogin = await request({ path: '/api/auth/login', method: 'POST', headers: { 'Content-Type': 'application/json' } }, { emailOrUsername: 'Pav005', password: 'Secret_._05' });
  assert(adminLogin.status === 200, 'Admin login succeeds with 200 OK', `Got: ${adminLogin.status}`);
  assert(adminLogin.data.user.role === 'admin', 'Admin user role is verified as admin');
  const adminToken = adminLogin.data.token;

  // 4. Role Authorization: normal user cannot call admin APIs
  const userAccessAdmin = await request({ path: '/api/admin/stats', method: 'GET', headers: { 'Authorization': `Bearer ${demoToken}` } });
  assert(userAccessAdmin.status === 403, 'Normal user calling /api/admin/stats returns 403 Forbidden', `Got: ${userAccessAdmin.status}`);

  const adminAccessAdmin = await request({ path: '/api/admin/stats', method: 'GET', headers: { 'Authorization': `Bearer ${adminToken}` } });
  assert(adminAccessAdmin.status === 200, 'Admin user calling /api/admin/stats returns 200 OK', `Got: ${adminAccessAdmin.status}`);

  // 5. GUEST MODE TESTING
  const guestRes = await request({ path: '/api/auth/guest', method: 'POST', headers: { 'Content-Type': 'application/json' } });
  assert(guestRes.status === 200, 'Guest mode creation returns 200 OK', `Got: ${guestRes.status}`);
  assert(guestRes.data.isGuest === true, 'Guest response includes isGuest: true flag');
  assert(guestRes.data.token && guestRes.data.token.startsWith('alg_guest_'), 'Guest session token is issued');
  const guestToken = guestRes.data.token;
  const guestId = guestRes.data.user.id;

  // Verify guest user cannot access admin APIs
  const guestAccessAdmin = await request({ path: '/api/admin/stats', method: 'GET', headers: { 'Authorization': `Bearer ${guestToken}` } });
  assert(guestAccessAdmin.status === 403, 'Guest user calling /api/admin/stats returns 403 Forbidden', `Got: ${guestAccessAdmin.status}`);

  // Verify guest progress is NOT persisted on server
  const guestProgressGet = await request({ path: '/api/user/progress', method: 'GET', headers: { 'Authorization': `Bearer ${guestToken}` } });
  assert(guestProgressGet.status === 200 && guestProgressGet.data.isGuest === true && guestProgressGet.data.progress === null, 'Guest get /api/user/progress returns isGuest: true, progress: null');

  const guestProgressPost = await request({
    path: '/api/user/progress',
    method: 'POST',
    headers: { 'Authorization': `Bearer ${guestToken}`, 'Content-Type': 'application/json' }
  }, { solvedProblemIds: ['two-sum', 'reverse-linked-list'], streak: 5 });
  assert(guestProgressPost.status === 200 && guestProgressPost.data.saved === false, 'Guest post /api/user/progress returns saved: false and DOES NOT save to database');

  // Verify guest was NEVER inserted into db.users
  const allUsersCheck = await request({ path: '/api/admin/users', method: 'GET', headers: { 'Authorization': `Bearer ${adminToken}` } });
  const guestInDb = (allUsersCheck.data || []).some(u => u.id === guestId);
  assert(!guestInDb, 'Guest user is NOT added to permanent db.users database');

  // 6. User Signup validation
  const testUserEmail = `test_${Date.now()}@testdomain.com`;
  const testUserName = `testuser_${Date.now().toString(36)}`;
  
  const shortPassSignup = await request({ path: '/api/auth/signup', method: 'POST', headers: { 'Content-Type': 'application/json' } }, {
    name: 'Test Candidate',
    username: testUserName,
    email: testUserEmail,
    password: '123'
  });
  assert(shortPassSignup.status === 400, 'Signup with password < 6 chars returns 400', `Got: ${shortPassSignup.status}`);

  const validSignup = await request({ path: '/api/auth/signup', method: 'POST', headers: { 'Content-Type': 'application/json' } }, {
    name: 'Test Candidate',
    username: testUserName,
    email: testUserEmail,
    password: 'securePassword123'
  });
  assert(validSignup.status === 201, 'Valid signup creates new account with 201 Created', `Got: ${validSignup.status}`);
  assert(validSignup.data.token, 'Signup response returns session token');
  assert(!validSignup.data.user.password, 'Signup response does NOT leak password hash');
  const newUserToken = validSignup.data.token;
  const newUserId = validSignup.data.user.id;

  // Duplicate email check
  const duplicateSignup = await request({ path: '/api/auth/signup', method: 'POST', headers: { 'Content-Type': 'application/json' } }, {
    name: 'Another User',
    username: `${testUserName}_2`,
    email: testUserEmail,
    password: 'securePassword123'
  });
  assert(duplicateSignup.status === 400, 'Signup with already registered email returns 400', `Got: ${duplicateSignup.status}`);

  // 7. Authenticated User Progress Persistence
  const userProgressPost = await request({
    path: '/api/user/progress',
    method: 'POST',
    headers: { 'Authorization': `Bearer ${newUserToken}`, 'Content-Type': 'application/json' }
  }, { solvedProblemIds: ['two-sum', 'valid-parentheses'], streak: 3, activityCount: 2 });
  assert(userProgressPost.status === 200 && userProgressPost.data.saved === true, 'Authenticated user progress is saved with saved: true');

  const userProgressGet = await request({
    path: '/api/user/progress',
    method: 'GET',
    headers: { 'Authorization': `Bearer ${newUserToken}` }
  });
  assert(
    userProgressGet.status === 200 &&
    userProgressGet.data.progress &&
    Array.isArray(userProgressGet.data.progress.solvedProblemIds) &&
    userProgressGet.data.progress.solvedProblemIds.includes('two-sum'),
    'Authenticated user retrieves real persisted progress from database'
  );

  // 8. Forgot & Reset Password
  const forgotRes = await request({
    path: '/api/auth/forgot-password',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, { emailOrUsername: testUserEmail });
  assert(forgotRes.status === 200 && forgotRes.data.resetToken, 'Forgot password generates valid reset token');
  const resetToken = forgotRes.data.resetToken;

  const resetRes = await request({
    path: '/api/auth/reset-password',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, { resetToken, newPassword: 'newBrandPassword999' });
  assert(resetRes.status === 200, 'Reset password updates account password with 200 OK');

  // Verify login with new password works
  const newPassLogin = await request({
    path: '/api/auth/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, { emailOrUsername: testUserEmail, password: 'newBrandPassword999' });
  assert(newPassLogin.status === 200, 'Login with new updated password succeeds with 200 OK');

  // Verify old password fails
  const oldPassLogin = await request({
    path: '/api/auth/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, { emailOrUsername: testUserEmail, password: 'securePassword123' });
  assert(oldPassLogin.status === 401, 'Login with old password now returns 401');

  // 9. Session / Logout
  const activeToken = newPassLogin.data.token;
  const meBeforeLogout = await request({ path: '/api/auth/me', method: 'GET', headers: { 'Authorization': `Bearer ${activeToken}` } });
  assert(meBeforeLogout.status === 200, '/api/auth/me returns active session');

  const logoutRes = await request({ path: '/api/auth/logout', method: 'POST', headers: { 'Authorization': `Bearer ${activeToken}` } });
  assert(logoutRes.status === 200, 'Logout succeeds with 200 OK');

  const meAfterLogout = await request({ path: '/api/auth/me', method: 'GET', headers: { 'Authorization': `Bearer ${activeToken}` } });
  assert(meAfterLogout.status === 401, '/api/auth/me returns 401 after logout');

  console.log('\n====================================================');
  console.log(`  AUTHENTICATION TEST SUITE SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
