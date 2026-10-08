// test-admin-suite.cjs
// Automated verification suite for Algorise Admin Panel & Server RBAC

const http = require('http');

function request(options, data) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        let parsed = null;
        try { parsed = JSON.parse(body); } catch(e) { parsed = body; }
        resolve({ status: res.statusCode, headers: res.headers, body: parsed });
      });
    });
    req.on('error', reject);
    if (data) {
      req.write(typeof data === 'string' ? data : JSON.stringify(data));
    }
    req.end();
  });
}

async function runTests() {
  console.log('================================================================');
  console.log('  ALGORISE ADMIN PANEL & SERVER RBAC AUTOMATED TEST SUITE');
  console.log('================================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  try {
    // -------------------------------------------------------------
    // Test 1: Unauthenticated request to admin APIs -> 401
    // -------------------------------------------------------------
    console.log('[1] Testing Unauthenticated Access to Admin APIs...');
    const unauthCheck = await request({
      hostname: 'localhost',
      port: 5173,
      path: '/api/admin/check',
      method: 'GET'
    });
    assert(unauthCheck.status === 401, `Unauthenticated /api/admin/check returns 401 (got ${unauthCheck.status})`);

    const unauthStats = await request({
      hostname: 'localhost',
      port: 5173,
      path: '/api/admin/stats',
      method: 'GET'
    });
    assert(unauthStats.status === 401, `Unauthenticated /api/admin/stats returns 401 (got ${unauthStats.status})`);

    // -------------------------------------------------------------
    // Test 2: Normal user login
    // -------------------------------------------------------------
    console.log('\n[2] Logging in as Normal User (alexrivera)...');
    const userLogin = await request({
      hostname: 'localhost',
      port: 5173,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { emailOrUsername: 'alexrivera', password: 'password123' });

    assert(userLogin.status === 200, `Normal user login succeeds (status ${userLogin.status})`);
    assert(userLogin.body.user && userLogin.body.user.role === 'user', `User role is 'user'`);
    assert(!userLogin.body.user.password, `Password is sanitized and not returned in payload`);
    const normalUserToken = userLogin.body.token;

    // -------------------------------------------------------------
    // Test 3: Normal user attempting admin access -> 403 Forbidden
    // -------------------------------------------------------------
    console.log('\n[3] Testing Normal User Calling Admin APIs (Server-Side RBAC Enforcement)...');
    const userAdminCheck = await request({
      hostname: 'localhost',
      port: 5173,
      path: '/api/admin/check',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${normalUserToken}` }
    });
    assert(userAdminCheck.status === 403, `Normal user calling /api/admin/check receives 403 Forbidden (got ${userAdminCheck.status})`);

    const userAdminStats = await request({
      hostname: 'localhost',
      port: 5173,
      path: '/api/admin/stats',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${normalUserToken}` }
    });
    assert(userAdminStats.status === 403, `Normal user calling /api/admin/stats receives 403 Forbidden (got ${userAdminStats.status})`);

    const userAdminUsers = await request({
      hostname: 'localhost',
      port: 5173,
      path: '/api/admin/users',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${normalUserToken}` }
    });
    assert(userAdminUsers.status === 403, `Normal user calling /api/admin/users receives 403 Forbidden (got ${userAdminUsers.status})`);

    const userProblemMutation = await request({
      hostname: 'localhost',
      port: 5173,
      path: '/api/admin/problems',
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${normalUserToken}`,
        'Content-Type': 'application/json'
      }
    }, { title: 'Malicious Problem' });
    assert(userProblemMutation.status === 403, `Normal user calling POST /api/admin/problems receives 403 Forbidden (got ${userProblemMutation.status})`);

    // -------------------------------------------------------------
    // Test 4: Admin login (pav005)
    // -------------------------------------------------------------
    console.log('\n[4] Logging in as Administrator (pav005)...');
    // Test wrong password rejected
    const wrongAdminLogin = await request({
      hostname: 'localhost',
      port: 5173,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { emailOrUsername: 'pav005', password: 'wrongpassword' });
    assert(wrongAdminLogin.status === 401, `Admin login with wrong password correctly returns 401 (got ${wrongAdminLogin.status})`);

    const adminLogin = await request({
      hostname: 'localhost',
      port: 5173,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { emailOrUsername: 'pav005', password: 'Secret_._05' });

    assert(adminLogin.status === 200, `Admin login with correct password succeeds (status ${adminLogin.status})`);
    assert(adminLogin.body.user && adminLogin.body.user.role === 'admin', `User role is 'admin'`);
    assert(!adminLogin.body.user.password, `Admin password is stripped`);
    const adminToken = adminLogin.body.token;

    // -------------------------------------------------------------
    // Test 5: Admin verification and statistics (Req 1 & 9)
    // -------------------------------------------------------------
    console.log('\n[5] Verifying Admin Check & Live Statistics...');
    const adminCheck = await request({
      hostname: 'localhost',
      port: 5173,
      path: '/api/admin/check',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    assert(adminCheck.status === 200 && adminCheck.body.authorized === true, `Admin /api/admin/check authorized = true`);

    const adminStats = await request({
      hostname: 'localhost',
      port: 5173,
      path: '/api/admin/stats',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    assert(adminStats.status === 200, `Admin /api/admin/stats returns 200`);
    const stats = adminStats.body;
    assert(typeof stats.totalUsers === 'number' && stats.totalUsers >= 2, `Real stat: totalUsers = ${stats.totalUsers}`);
    assert(typeof stats.activeUsers === 'number' && stats.activeUsers >= 1, `Real stat: activeUsers = ${stats.activeUsers}`);
    assert(typeof stats.totalProblems === 'number' && stats.totalProblems > 0, `Real stat: totalProblems = ${stats.totalProblems}`);
    assert(typeof stats.totalLessons === 'number' && stats.totalLessons > 0, `Real stat: totalLessons = ${stats.totalLessons}`);
    assert(typeof stats.totalInterviews === 'number' && stats.totalInterviews > 0, `Real stat: totalInterviews = ${stats.totalInterviews}`);
    assert(typeof stats.totalCrimeLabCases === 'number' && stats.totalCrimeLabCases > 0, `Real stat: totalCrimeLabCases = ${stats.totalCrimeLabCases}`);
    assert(typeof stats.totalFeedback === 'number', `Real stat: totalFeedback = ${stats.totalFeedback}`);
    assert(typeof stats.totalPopups === 'number' && stats.totalPopups > 0, `Real stat: totalPopups = ${stats.totalPopups}`);

    // -------------------------------------------------------------
    // Test 6: User Management (Req 3 & 4)
    // -------------------------------------------------------------
    console.log('\n[6] Testing User Management (View, Details, Edit, Reset)...');
    const usersList = await request({
      hostname: 'localhost',
      port: 5173,
      path: '/api/admin/users',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    assert(usersList.status === 200 && Array.isArray(usersList.body), `Fetched user list (${usersList.body.length} users)`);
    // Verify no password hashes are exposed
    const exposedPasswords = usersList.body.some(u => u.password || u.passwordHash);
    assert(!exposedPasswords, `Security check: No passwords or password hashes exposed in users list`);

    // Inspect user details
    const userDetails = await request({
      hostname: 'localhost',
      port: 5173,
      path: '/api/admin/users/user-demo-001/details',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    assert(userDetails.status === 200, `Fetched user details and progress for user-demo-001`);
    assert(userDetails.body.progress !== undefined, `User progress structure returned`);

    // Edit user profile
    const updatedGoal = 8;
    const updateRes = await request({
      hostname: 'localhost',
      port: 5173,
      path: '/api/admin/users/user-demo-001',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      }
    }, {
      name: 'Alex Rivera (Verified)',
      dailyQuestionGoal: updatedGoal
    });
    assert(updateRes.status === 200, `Admin successfully edited user profile`);
    assert(updateRes.body.name === 'Alex Rivera (Verified)', `Updated name persists: ${updateRes.body.name}`);
    assert(updateRes.body.dailyQuestionGoal === updatedGoal, `Updated goal persists: ${updateRes.body.dailyQuestionGoal}`);

    // Reset user streak
    const resetRes = await request({
      hostname: 'localhost',
      port: 5173,
      path: '/api/admin/users/user-demo-001/reset',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      }
    }, { resetType: 'streak' });
    assert(resetRes.status === 200 && resetRes.body.success, `Admin reset user streak successfully`);

    // -------------------------------------------------------------
    // Test 7: Problem Editing with Hints & Explanations (Req 2 & 5)
    // -------------------------------------------------------------
    console.log('\n[7] Testing Problem Editing with Hints & Editorial Walkthrough...');
    const testProb = {
      id: 'two-sum',
      title: 'Two Sum (Mastery Edition)',
      difficulty: 'Easy',
      topic: 'Arrays & Hashing',
      pattern: 'Two Pointers / Hash Map',
      description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
      solutionCode: 'class Solution:\n    def twoSum(self, nums, target):\n        seen = {}\n        for i, n in enumerate(nums):\n            if target - n in seen: return [seen[target - n], i]\n            seen[n] = i\n        return []',
      hints: [
        'Hint 1: Can we trade space for time using an O(1) hash map lookup?',
        'Hint 2: For each element x, compute complement = target - x.',
        'Hint 3: Maintain single-pass hash map to achieve optimal O(N) time and O(N) space.'
      ],
      explanation: 'Optimal linear pass using hash map tracking visited elements.'
    };

    const saveProbRes = await request({
      hostname: 'localhost',
      port: 5173,
      path: '/api/admin/problems',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      }
    }, testProb);
    assert(saveProbRes.status === 200, `Problem saved to backend`);
    assert(saveProbRes.body.hints && saveProbRes.body.hints.length === 3, `3 Hints persisted`);

    // Public override check: verify ProblemDetailPage sees the updated override
    const overrides = await request({
      hostname: 'localhost',
      port: 5173,
      path: '/api/public/problem-overrides',
      method: 'GET'
    });
    assert(overrides.status === 200 && overrides.body['two-sum'] !== undefined, `Problem override is available publicly at /api/public/problem-overrides`);
    assert(overrides.body['two-sum'].title === 'Two Sum (Mastery Edition)', `Public override title matches saved title`);

    // -------------------------------------------------------------
    // Test 8: Motivation Popups CRUD (Req 2 & 5)
    // -------------------------------------------------------------
    console.log('\n[8] Testing Motivation Popups CRUD...');
    const newPopup = {
      id: 'test-popup-joke-001',
      category: 'DYNAMIC_PROGRAMMING',
      personality: 'sarcastic',
      badgeTitle: 'DP Therapist',
      badgeVariant: 'purple',
      template: 'Congratulations, you remembered something from 3 lines ago. That is basically Dynamic Programming.'
    };

    const savePopupRes = await request({
      hostname: 'localhost',
      port: 5173,
      path: '/api/admin/popups',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      }
    }, newPopup);
    assert(savePopupRes.status === 200, `Created new motivation popup`);

    const getPopups = await request({
      hostname: 'localhost',
      port: 5173,
      path: '/api/admin/popups',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    assert(getPopups.status === 200 && Array.isArray(getPopups.body), `Fetched popups list (${getPopups.body.length} popups)`);
    assert(getPopups.body.some(p => p.id === 'test-popup-joke-001'), `Newly created popup found in popups list`);

    // -------------------------------------------------------------
    // Test 9: Feedback Management (Req 2 & 5)
    // -------------------------------------------------------------
    console.log('\n[9] Testing Feedback Management...');
    const feedbackList = await request({
      hostname: 'localhost',
      port: 5173,
      path: '/api/admin/feedback',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    assert(feedbackList.status === 200 && Array.isArray(feedbackList.body), `Fetched feedback list`);

    const updateFbRes = await request({
      hostname: 'localhost',
      port: 5173,
      path: '/api/admin/feedback/fb-2',
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      }
    }, { status: 'reviewed' });
    assert(updateFbRes.status === 200 && updateFbRes.body.success, `Updated feedback status to reviewed`);

    // -------------------------------------------------------------
    // Test 10: Audit Log Verification (Req 8)
    // -------------------------------------------------------------
    console.log('\n[10] Testing Audit Log...');
    const auditLogsRes = await request({
      hostname: 'localhost',
      port: 5173,
      path: '/api/admin/audit-logs',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    assert(auditLogsRes.status === 200 && Array.isArray(auditLogsRes.body), `Audit logs returned (${auditLogsRes.body.length} entries)`);
    const logs = auditLogsRes.body;
    assert(logs.some(l => l.action === 'UPDATE' && l.targetSection === 'Users'), `Audit log recorded User profile update`);
    assert(logs.some(l => l.action === 'RESET' && l.targetSection === 'Users'), `Audit log recorded User streak reset`);
    assert(logs.some(l => l.targetSection === 'Problems'), `Audit log recorded Problem mutation`);
    // -------------------------------------------------------------
    // Test 11: Public CMS Endpoint Verification (Req 2)
    // -------------------------------------------------------------
    console.log('\n[11] Testing Public CMS Endpoint (/api/public/cms)...');
    const publicCms = await request({
      hostname: 'localhost',
      port: 5173,
      path: '/api/public/cms',
      method: 'GET'
    });
    assert(publicCms.status === 200, `Public CMS returns 200 without authentication`);
    assert(publicCms.body.home && publicCms.body.home.welcomeTitle, `Home content present in public CMS`);
    assert(publicCms.body.copy && publicCms.body.copy.siteTitle, `Copy content present in public CMS`);
    assert(Array.isArray(publicCms.body.navigation), `Navigation items present in public CMS`);

    // -------------------------------------------------------------
    // Test 12: Home Page CMS Update & Persistence (Req 2 & 5)
    // -------------------------------------------------------------
    console.log('\n[12] Testing Home Page CMS Update...');
    const homeUpdate = await request({
      hostname: 'localhost',
      port: 5173,
      path: '/api/admin/home',
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      }
    }, {
      welcomeTitle: 'Master Computer Science & Algorithms (Updated)',
      welcomeSubtitle: 'Updated subtitle test',
      aboutContent: 'Updated about text test',
      dailyGoalOptions: [3, 5, 10],
      learningRecommendationsTitle: 'Recommended',
      emptyStateMessage: 'No activity yet'
    });
    assert(homeUpdate.status === 200, `Home CMS updated successfully`);
    assert(homeUpdate.body.welcomeTitle.includes('(Updated)'), `Updated welcome title persisted`);

    // -------------------------------------------------------------
    // Test 13: Website Content Copy CMS (Req 2 & 5)
    // -------------------------------------------------------------
    console.log('\n[13] Testing Website Content Copy CMS...');
    const copyUpdate = await request({
      hostname: 'localhost',
      port: 5173,
      path: '/api/admin/website-content',
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      }
    }, {
      siteTitle: 'Algorise — Verified Enterprise Learning Platform',
      footerText: '© 2026 Algorise. All rights reserved.',
      problemsPageHeading: 'Problems Explorer',
      learnPageHeading: 'Learning Flow',
      crimeLabHeading: 'Forensic Lab',
      visualizerHeading: 'Algorithms Visualizer',
      interviewHeading: 'Technical Interviews',
      jobRolesHeading: 'Career Pathways'
    });
    assert(copyUpdate.status === 200, `Website copy updated successfully`);
    assert(copyUpdate.body.siteTitle.includes('Enterprise'), `Updated site title persisted`);

    // -------------------------------------------------------------
    // Test 14: Navigation CMS Reordering & Visibility (Req 2 & 5)
    // -------------------------------------------------------------
    console.log('\n[14] Testing Navigation CMS Reordering & Visibility...');
    const navGet = await request({
      hostname: 'localhost',
      port: 5173,
      path: '/api/admin/navigation',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    assert(navGet.status === 200 && Array.isArray(navGet.body), `Fetched navigation items (${navGet.body.length} items)`);

    const navUpdate = await request({
      hostname: 'localhost',
      port: 5173,
      path: '/api/admin/navigation',
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      }
    }, navGet.body);
    assert(navUpdate.status === 200, `Navigation update succeeded`);

    // -------------------------------------------------------------
    // Test 15: Visualizer Categories CMS (Req 2 & 5)
    // -------------------------------------------------------------
    console.log('\n[15] Testing Visualizer Categories CMS...');
    const vizGet = await request({
      hostname: 'localhost',
      port: 5173,
      path: '/api/admin/visualizer',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    assert(vizGet.status === 200 && Array.isArray(vizGet.body), `Fetched visualizer categories (${vizGet.body.length} categories)`);

    // -------------------------------------------------------------
    // Test 16: Website Settings & Maintenance Mode (Req 2 & 5)
    // -------------------------------------------------------------
    console.log('\n[16] Testing Website Settings Management...');
    const settingsGet = await request({
      hostname: 'localhost',
      port: 5173,
      path: '/api/admin/settings',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    assert(settingsGet.status === 200, `Fetched website settings`);

    const settingsUpdate = await request({
      hostname: 'localhost',
      port: 5173,
      path: '/api/admin/settings',
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      }
    }, { ...settingsGet.body, maxDailyGoalLimit: 25 });
    assert(settingsUpdate.status === 200, `Updated website settings successfully`);
    assert(settingsUpdate.body.maxDailyGoalLimit === 25, `Persisted maxDailyGoalLimit = 25`);

    // -------------------------------------------------------------
    // Test 17: Notes & Knowledge Base CRUD (Req 2 & 5)
    // -------------------------------------------------------------
    console.log('\n[17] Testing Study Notes CRUD...');
    const newNote = {
      id: 'test-note-101',
      title: 'Trie Data Structure & Autocomplete',
      topic: 'Trees & Tries',
      author: 'Admin Team',
      status: 'published'
    };
    const createNoteRes = await request({
      hostname: 'localhost',
      port: 5173,
      path: '/api/admin/notes',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      }
    }, newNote);
    assert(createNoteRes.status === 200, `Created new study note`);

    const getNotesRes = await request({
      hostname: 'localhost',
      port: 5173,
      path: '/api/admin/notes',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    assert(getNotesRes.status === 200 && Array.isArray(getNotesRes.body), `Fetched notes list (${getNotesRes.body.length} notes)`);
    assert(getNotesRes.body.some(n => n.id === 'test-note-101'), `Created note found in notes list`);

    const deleteNoteRes = await request({
      hostname: 'localhost',
      port: 5173,
      path: '/api/admin/notes/test-note-101',
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    assert(deleteNoteRes.status === 200, `Deleted test study note`);

    // -------------------------------------------------------------
    // Test 18: Resources Management CRUD (Req 2 & 5)
    // -------------------------------------------------------------
    console.log('\n[18] Testing Resources CRUD...');
    const newResItem = {
      id: 'test-res-201',
      title: 'Berkeley CS61B: Data Structures',
      category: 'DSA & Algorithms',
      type: 'University Course',
      link: 'https://sp21.datastructur.es/',
      status: 'active'
    };
    const createResResp = await request({
      hostname: 'localhost',
      port: 5173,
      path: '/api/admin/resources',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      }
    }, newResItem);
    assert(createResResp.status === 200, `Created new resource`);

    const getResResp = await request({
      hostname: 'localhost',
      port: 5173,
      path: '/api/admin/resources',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    assert(getResResp.status === 200 && Array.isArray(getResResp.body), `Fetched resources list (${getResResp.body.length} items)`);
    assert(getResResp.body.some(r => r.id === 'test-res-201'), `Created resource found in resources list`);

    const deleteResResp = await request({
      hostname: 'localhost',
      port: 5173,
      path: '/api/admin/resources/test-res-201',
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    assert(deleteResResp.status === 200, `Deleted test resource`);

    // -------------------------------------------------------------
    // Test 19: Feedback Deletion (Req 2 & 5)
    // -------------------------------------------------------------
    console.log('\n[19] Testing Feedback Deletion...');
    // Create temporary feedback item to delete
    const tempFbId = `temp-fb-${Date.now()}`;
    const dbPath = require('path').resolve(process.cwd(), 'src/data/server-db.json');
    const dbFile = JSON.parse(require('fs').readFileSync(dbPath, 'utf8'));
    dbFile.feedback.push({
      id: tempFbId,
      userId: 'user-demo-001',
      userName: 'alexrivera',
      message: 'Test message for deletion',
      createdAt: new Date().toISOString(),
      status: 'new'
    });
    require('fs').writeFileSync(dbPath, JSON.stringify(dbFile, null, 2));

    const deleteFbRes = await request({
      hostname: 'localhost',
      port: 5173,
      path: `/api/admin/feedback/${tempFbId}`,
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    assert(deleteFbRes.status === 200, `Feedback item deleted successfully via API`);

    console.log('\n================================================================');
    console.log(`  RESULTS: ${passed} PASSED, ${failed} FAILED`);
    console.log('================================================================\n');

    if (failed > 0) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  } catch (err) {
    console.error('Test suite error:', err);
    process.exit(1);
  }
}

runTests();
