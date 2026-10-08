import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import type { IncomingMessage, ServerResponse } from 'http';
import { problemsData } from '../data/problemsData';
import { dsaRoadmapStages } from '../data/curriculumData';
import { crimeLabQuestionsData } from '../data/crimeLabData';
import { interviewQuestionsData } from '../data/interviewData';
import { jobRolesData } from '../data/jobRolesData';
import { motivationMessages } from '../data/motivationData';
import { verifiedResourcesData } from '../data/resourcesData';
import { codeExecutionService } from '../services/codeExecutionService';

export interface ServerUser {
  id: string;
  name: string;
  username: string;
  email: string;
  password?: string;
  role: 'admin' | 'user';
  status: 'active' | 'disabled';
  authProvider: 'email' | 'google' | 'guest';
  createdAt: string;
  dailyQuestionGoal?: number;
  lastLoginAt?: number;
  isGuest?: boolean;
  avatar?: string;
  solvedProblems?: string[];
  streak?: number;
  rating?: number;
  activityCount?: number;
  learningPathProgress?: number;
  privacySettings?: {
    profileVisibility: 'public' | 'private';
    activityVisibility: 'public' | 'private';
    progressVisibility: 'public' | 'private';
  };
  securityLog?: Array<{
    id: string;
    event: string;
    timestamp: number;
    details: string;
    ipAddress?: string;
  }>;
}

export interface ServerAuditLog {
  id: string;
  timestamp: string;
  adminUserId: string;
  adminUsername: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'ENABLE' | 'DISABLE' | 'RESET' | 'REORDER';
  targetSection: string;
  targetId: string;
  details: string;
}

export interface ServerSavedAnswer {
  id: string;
  userId: string;
  activityType: 'interview' | 'learning_quiz' | 'learning_reflection' | 'crimelab' | 'quiz' | 'other';
  activityTitle: string;
  questionId: string;
  questionTitle: string;
  questionContext?: string;
  answer: string;
  targetTab: 'interview' | 'learn' | 'crimelab' | 'problems' | 'notes';
  targetId?: string;
  metadata?: Record<string, any>;
  createdAt: number;
  updatedAt: number;
}

export interface ServerDatabase {
  users: ServerUser[];
  sessions: Record<string, { token: string; user: ServerUser; expiresAt: number; createdAt: number }>;
  auditLogs: ServerAuditLog[];
  problems: any[];
  problemOverrides: Record<string, any>;
  curriculum: any[];
  crimeLab: any[];
  interviews: any[];
  jobRoles: any[];
  motivationPopups: any[];
  feedback: any[];
  homeContent: any;
  websiteContent: any;
  navigation: any[];
  visualizerCategories: any[];
  notes?: any[];
  resources?: any[];
  userProgress: Record<string, any>;
  userAnswers?: Record<string, ServerSavedAnswer[]>;
  resetTokens?: Record<string, { userId: string; expiresAt: number }>;
  settings: {
    siteTitle: string;
    tagline: string;
    maintenanceMode: boolean;
    allowRegistrations: boolean;
    enableMotivationPopups: boolean;
    defaultEditorFont: string;
    maxDailyGoalLimit: number;
  };
}

const DB_FILE_PATH = process.env.DB_FILE_PATH || process.env.DATABASE_PATH || path.resolve(process.cwd(), 'src', 'data', 'server-db.json');

// Initialize database in memory and on disk
let dbCache: ServerDatabase | null = null;

function getInitialDatabase(): ServerDatabase {
  const initialUsers: ServerUser[] = [
    {
      id: 'user-admin-001',
      name: 'ALGOrise Admin',
      username: 'pav005',
      email: 'admin@algorise.io',
      password: process.env.ADMIN_PASSWORD || 'Secret_._05',
      role: 'admin',
      status: 'active',
      authProvider: 'email',
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      dailyQuestionGoal: 5,
      privacySettings: { profileVisibility: 'public', activityVisibility: 'public', progressVisibility: 'public' },
      securityLog: [
        { id: 'sec-1', event: 'Account Initialized', timestamp: Date.now() - 30 * 24 * 60 * 60 * 1000, details: 'Admin account created', ipAddress: '127.0.0.1' }
      ]
    },
    {
      id: 'user-demo-001',
      name: 'Alex Rivera',
      username: 'alexrivera',
      email: 'demo@algorise.io',
      password: 'password123',
      role: 'user',
      status: 'active',
      authProvider: 'email',
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      dailyQuestionGoal: 5,
      privacySettings: { profileVisibility: 'public', activityVisibility: 'public', progressVisibility: 'public' },
      securityLog: [
        { id: 'sec-2', event: 'Account Initialized', timestamp: Date.now() - 15 * 24 * 60 * 60 * 1000, details: 'User account created', ipAddress: '127.0.0.1' }
      ]
    }
  ];

  return {
    users: initialUsers,
    sessions: {},
    auditLogs: [
      {
        id: 'audit-init-1',
        timestamp: new Date().toISOString(),
        adminUserId: 'user-admin-001',
        adminUsername: 'pav005',
        action: 'CREATE',
        targetSection: 'System',
        targetId: 'admin-panel',
        details: 'Central Admin Control Panel initialized with server-side RBAC security.'
      }
    ],
    problems: (problemsData || []).map((p: any, idx: number) => ({
      id: p.id,
      displayNumber: p.problemNumber || idx + 1,
      title: p.title,
      difficulty: p.difficulty,
      topic: p.topic,
      pattern: p.pattern,
      acceptance: p.acceptanceRate || '65.4%',
      is3000Level: idx % 4 === 0,
      status: 'published',
      description: p.description,
      solutionCode: p.codeTemplates?.python || 'class Solution:\n    def solve(self):\n        pass',
      hints: p.hints || [
        'Hint 1: Analyze problem inputs and identify optimal data structures.',
        'Hint 2: Avoid quadratic nested loops by maintaining state invariants.',
        'Hint 3: Traverse data linearly in a single pass to achieve optimal runtime bounds.'
      ],
      explanation: `Algorithmic approach and walkthrough for ${p.title}. Optimal time complexity is achieved using standard algorithmic patterns.`
    })),
    problemOverrides: {},
    curriculum: (dsaRoadmapStages || []).map((c: any) => ({
      ...c,
      status: 'active'
    })),
    crimeLab: (crimeLabQuestionsData || []).map((c: any) => ({
      ...c,
      status: 'active'
    })),
    interviews: (interviewQuestionsData || []).map((iq: any) => ({
      ...iq,
      status: 'active'
    })),
    jobRoles: (jobRolesData || []).map((jr: any) => ({
      ...jr,
      status: 'active'
    })),
    motivationPopups: (motivationMessages || []).map((m: any) => ({
      ...m,
      enabled: true
    })),
    feedback: [
      {
        id: 'fb-1',
        userId: 'user-demo-001',
        username: 'alexrivera',
        category: 'feature',
        message: 'The visualizer step-by-step trace mode is incredible for interview prep!',
        createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
        status: 'reviewed'
      },
      {
        id: 'fb-2',
        userId: 'user-demo-001',
        username: 'alexrivera',
        category: 'bug',
        message: 'Found minor typo in Binary Search monospaced space complexity breakdown.',
        createdAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
        status: 'new'
      }
    ],
    homeContent: {
      welcomeTitle: 'Master Computer Science & Software Engineering',
      welcomeSubtitle: 'Interactive DSA visualizers, production code compiler, forensic crime lab, and AI mock interviews.',
      aboutContent: 'Algorise is an interactive Computer Science learning engine built for software engineering candidates, computer science students, and interview prep learners.',
      dailyGoalOptions: [3, 5, 10, 15],
      learningRecommendationsTitle: 'Recommended Next Steps',
      emptyStateMessage: 'No activity recorded yet. Start solving problems to track progress!'
    },
    websiteContent: {
      siteTitle: 'Algorise — Algorithmic Learning Platform',
      footerText: '© 2026 Algorise Computer Science Learning Platform. Built for developers.',
      problemsPageHeading: 'Data Structures & Algorithms Problem Collection',
      learnPageHeading: 'Structured Flow of Learning Roadmap',
      crimeLabHeading: 'Cybersecurity & Technical Forensic Crime Lab',
      visualizerHeading: 'Algorithm & Data Structure Visualizer',
      interviewHeading: 'AI Mock Interview & Technical Question Bank',
      jobRolesHeading: 'Software Engineering Career Roles & Skill Pathways'
    },
    navigation: [
      { id: 'home', label: 'Home', enabled: true, order: 1 },
      { id: 'learn', label: 'Flow of Learning', enabled: true, order: 2 },
      { id: 'problems', label: 'Problems', enabled: true, order: 3 },
      { id: 'crimelab', label: 'Crime Lab', enabled: true, order: 4 },
      { id: 'visualizer', label: 'Visualizer', enabled: true, order: 5 },
      { id: 'interview', label: 'Mock Interview', enabled: true, order: 6 },
      { id: 'job_roles', label: 'Job Roles', enabled: true, order: 7 },
      { id: 'notes', label: 'Notes', enabled: true, order: 8 },
      { id: 'progress', label: 'Progress', enabled: true, order: 9 }
    ],
    visualizerCategories: [
      { id: 'SEARCHING', name: 'Searching', count: 8, enabled: true },
      { id: 'SORTING', name: 'Sorting', count: 14, enabled: true },
      { id: 'ARRAYS', name: 'Arrays', count: 3, enabled: true },
      { id: 'STRINGS', name: 'Strings', count: 2, enabled: true },
      { id: 'LINKED_LISTS', name: 'Linked Lists', count: 2, enabled: true },
      { id: 'STACKS_QUEUES', name: 'Stacks & Queues', count: 2, enabled: true },
      { id: 'TREES_BST', name: 'Trees & BST', count: 4, enabled: true },
      { id: 'GRAPHS', name: 'Graphs (BFS/DFS)', count: 2, enabled: true },
      { id: 'RECURSION_BACKTRACKING', name: 'Recursion Call Stack', count: 2, enabled: true },
      { id: 'HEAPS', name: 'Heaps & Heapify', count: 1, enabled: true },
      { id: 'DYNAMIC_PROGRAMMING', name: 'Dynamic Programming', count: 2, enabled: true }
    ],
    notes: [
      {
        id: 'note-1',
        title: 'Mastering Dynamic Programming Patterns',
        topic: 'Dynamic Programming',
        author: 'ALGOrise Staff',
        updatedAt: '2026-09-19',
        status: 'published'
      },
      {
        id: 'note-2',
        title: 'Graph Traversals (BFS vs DFS Cheatsheet)',
        topic: 'Graphs',
        author: 'ALGOrise Staff',
        updatedAt: '2026-09-15',
        status: 'published'
      }
    ],
    resources: (verifiedResourcesData || []).slice(0, 20).map((r: any, idx: number) => ({
      id: r.id || `res-${idx + 1}`,
      title: r.title || 'Introduction to Algorithms (CLRS)',
      category: r.category || 'Books',
      type: r.badge || 'PDF Guide',
      link: r.url || 'https://algorise.io/resources',
      status: 'active'
    })),
    userProgress: {
      'user-demo-001': {
        solvedProblemIds: ['two-sum', 'valid-anagram'],
        attemptedProblemIds: ['reverse-linked-list', 'merge-intervals'],
        streak: 3,
        completedStages: ['programming-foundations', 'arrays-strings'],
        activityLog: [
          { id: 'act-1', title: 'Two Sum', subtitle: 'Arrays & Hashing · Easy', timestamp: Date.now() - 48 * 3600 * 1000, type: 'solved' },
          { id: 'act-2', title: 'Valid Anagram', subtitle: 'Hash Table · Easy', timestamp: Date.now() - 24 * 3600 * 1000, type: 'solved' }
        ]
      }
    },
    userAnswers: {},
    settings: {
      siteTitle: 'ALGOrise - Data Structures & Algorithms',
      tagline: 'Master DSA & System Design for Tech Careers',
      maintenanceMode: false,
      allowRegistrations: true,
      enableMotivationPopups: true,
      defaultEditorFont: '14px',
      maxDailyGoalLimit: 20
    }
  };
}

// Temporary in-memory store for guest user answers and sessions (never persisted to disk or permanent db)
const guestTempAnswers: Record<string, ServerSavedAnswer[]> = {};
const guestSessions: Record<string, { token: string; user: ServerUser; expiresAt: number; createdAt: number }> = {};

export function loadDatabase(): ServerDatabase {
  if (dbCache) return dbCache;

  try {
    const defaultSeedPath = path.resolve(process.cwd(), 'src', 'data', 'server-db.json');
    let dbPathToLoad = '';

    if (fs.existsSync(DB_FILE_PATH)) {
      dbPathToLoad = DB_FILE_PATH;
    } else if (fs.existsSync(defaultSeedPath)) {
      // Seed newly mounted persistent volume disk from default repository database
      try {
        const dir = path.dirname(DB_FILE_PATH);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        fs.copyFileSync(defaultSeedPath, DB_FILE_PATH);
        dbPathToLoad = DB_FILE_PATH;
        console.log(`[Admin Server] Successfully seeded database from repository into persistent volume at: ${DB_FILE_PATH}`);
      } catch (seedErr) {
        console.warn('[Admin Server] Could not seed database file to persistent path, falling back to repository file:', seedErr);
        dbPathToLoad = defaultSeedPath;
      }
    }

    if (dbPathToLoad && fs.existsSync(dbPathToLoad)) {
      const content = fs.readFileSync(dbPathToLoad, 'utf-8');
      dbCache = JSON.parse(content);

      // Support ADMIN_PASSWORD environment variable override
      if (dbCache && Array.isArray(dbCache.users)) {
        const adminUsers = dbCache.users.filter(u => u.role === 'admin' || u.id === 'user-admin-001' || u.username === 'pav005');
        adminUsers.forEach(admin => {
          if (process.env.ADMIN_PASSWORD) {
            admin.password = process.env.ADMIN_PASSWORD;
          } else if (admin.password === '$ENV_ADMIN_PASSWORD' || !admin.password) {
            admin.password = 'Secret_._05';
          }
        });
      }

      let needsSave = false;
      if (!dbCache!.userAnswers) {
        dbCache!.userAnswers = {};
        needsSave = true;
      }
      if (!dbCache!.notes) {
        dbCache!.notes = [
          {
            id: 'note-1',
            title: 'Mastering Dynamic Programming Patterns',
            topic: 'Dynamic Programming',
            author: 'ALGOrise Staff',
            updatedAt: '2026-09-19',
            status: 'published'
          },
          {
            id: 'note-2',
            title: 'Graph Traversals (BFS vs DFS Cheatsheet)',
            topic: 'Graphs',
            author: 'ALGOrise Staff',
            updatedAt: '2026-09-15',
            status: 'published'
          }
        ];
        needsSave = true;
      }
      if (!dbCache!.resources) {
        dbCache!.resources = (verifiedResourcesData || []).slice(0, 20).map((r: any, idx: number) => ({
          id: r.id || `res-${idx + 1}`,
          title: r.title || 'Introduction to Algorithms (CLRS)',
          category: r.category || 'Books',
          type: r.badge || 'PDF Guide',
          link: r.url || 'https://algorise.io/resources',
          status: 'active'
        }));
        needsSave = true;
      }
      if (needsSave) {
        saveDatabase(dbCache!);
      }
      return dbCache!;
    }
  } catch (err) {
    console.error('[Admin Server] Error loading database from disk, creating fresh DB:', err);
  }

  dbCache = getInitialDatabase();
  saveDatabase(dbCache);
  return dbCache;
}

export function saveDatabase(db: ServerDatabase): void {
  try {
    dbCache = db;
    const dir = path.dirname(DB_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('[Admin Server] Error saving database to disk:', err);
  }
}

// Security: Strip secrets from user objects sent to client
export function sanitizeUser(u: ServerUser): Omit<ServerUser, 'password'> {
  const { password: _, ...safe } = u;
  return safe;
}

// Password Hashing and Verification
export function hashPassword(password: string): string {
  const salt = 'algorise_salt_sec_2026';
  return crypto.createHash('sha256').update(password + salt).digest('hex');
}

export function verifyPassword(inputPassword: string, storedPassword?: string): boolean {
  if (!storedPassword) return false;
  if (storedPassword === '$ENV_ADMIN_PASSWORD') {
    const envPass = process.env.ADMIN_PASSWORD || 'Secret_._05';
    return inputPassword === envPass || hashPassword(inputPassword) === hashPassword(envPass);
  }
  if (storedPassword === inputPassword) return true;
  return storedPassword === hashPassword(inputPassword);
}

// User Authentication Verification (For all authenticated & guest users)
export function authenticateUser(req: IncomingMessage): {
  authenticated: boolean;
  status: number;
  error?: string;
  user?: ServerUser;
  isGuest?: boolean;
} {
  const db = loadDatabase();
  const authHeader = req.headers['authorization'] || '';
  let token = '';

  if (authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7).trim();
  }

  // Fallback to cookie
  if (!token && req.headers['cookie']) {
    const cookies = req.headers['cookie'].split(';');
    for (const c of cookies) {
      const [key, val] = c.trim().split('=');
      if (key === 'algorise_session_token' || key === 'algorise_guest_token') {
        token = val;
        break;
      }
    }
  }

  if (!token) {
    return { authenticated: false, status: 401, error: 'Unauthorized: Authentication token is required.' };
  }

  const session = db.sessions[token] || guestSessions[token];
  if (!session) {
    return { authenticated: false, status: 401, error: 'Unauthorized: Session is invalid or has expired.' };
  }

  if (session.expiresAt && Date.now() > session.expiresAt) {
    if (guestSessions[token]) {
      delete guestSessions[token];
    }
    if (db.sessions[token]) {
      delete db.sessions[token];
      saveDatabase(db);
    }
    return { authenticated: false, status: 401, error: 'Unauthorized: Session has expired. Please sign in again.' };
  }

  if (session.user.status === 'disabled') {
    return { authenticated: false, status: 403, error: 'Access Denied: Your account has been deactivated by an administrator.' };
  }

  return {
    authenticated: true,
    status: 200,
    user: session.user,
    isGuest: !!session.user.isGuest
  };
}

// Backend Authorization Verification for Admins
export function authenticateAdmin(req: IncomingMessage): {
  authorized: boolean;
  status: number;
  error?: string;
  adminUser?: ServerUser;
} {
  const auth = authenticateUser(req);
  if (!auth.authenticated) {
    return { authorized: false, status: auth.status, error: auth.error };
  }
  if (auth.isGuest || auth.user?.role !== 'admin') {
    return { authorized: false, status: 403, error: 'Access Denied: Admin authorization required. Normal users cannot access admin APIs.' };
  }
  return { authorized: true, status: 200, adminUser: auth.user };
}

function parseJsonBody<T>(req: IncomingMessage): Promise<T> {
  if ((req as any).body && typeof (req as any).body === 'object') {
    return Promise.resolve((req as any).body as T);
  }
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk: any) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : ({} as T));
      } catch (err) {
        reject(new Error('Invalid JSON payload.'));
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res: ServerResponse, status: number, data: any): void {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.end(JSON.stringify(data));
}

// Log audit action into database
export function logServerAudit(
  adminUser: ServerUser,
  action: ServerAuditLog['action'],
  targetSection: string,
  targetId: string,
  details: string
): void {
  const db = loadDatabase();
  const newEntry: ServerAuditLog = {
    id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toISOString(),
    adminUserId: adminUser.id,
    adminUsername: adminUser.username,
    action,
    targetSection,
    targetId,
    details
  };
  db.auditLogs.unshift(newEntry);
  if (db.auditLogs.length > 500) {
    db.auditLogs = db.auditLogs.slice(0, 500);
  }
  saveDatabase(db);
}

// Main Connect / Vite Middleware Handler
export async function adminApiMiddleware(
  req: IncomingMessage,
  res: ServerResponse,
  next: () => void
): Promise<void> {
  const rawUrl = (req as any).originalUrl || req.url || '';
  const parsedUrl = new URL(rawUrl.startsWith('http') ? rawUrl : `http://localhost:5173${rawUrl.startsWith('/') ? '' : '/'}${rawUrl}`);
  const pathname = parsedUrl.pathname;

  // Only handle /api/ routes
  if (!pathname.startsWith('/api/')) {
    return next();
  }

  // Handle CORS Preflight
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.end();
    return;
  }

  const db = loadDatabase();

  try {
    // -------------------------------------------------------------------------
    // 1. PUBLIC AUTH: /api/auth/login
    // -------------------------------------------------------------------------
    if (pathname === '/api/auth/login' && req.method === 'POST') {
      const { emailOrUsername, password } = await parseJsonBody<{ emailOrUsername?: string; password?: string }>(req);
      const cleanInput = (emailOrUsername || '').trim();
      const cleanPass = (password || '').trim();

      if (!cleanInput && !cleanPass) {
        return sendJson(res, 400, { error: 'Please enter your username/email and password.' });
      }
      if (!cleanInput) {
        return sendJson(res, 400, { error: 'Please enter your username or email address.' });
      }
      if (!cleanPass) {
        return sendJson(res, 400, { error: 'Please enter your password.' });
      }

      const lowerInput = cleanInput.toLowerCase();
      const user = db.users.find(u => 
        u.email.toLowerCase() === lowerInput || 
        u.username.toLowerCase() === lowerInput
      );

      if (!user) {
        return sendJson(res, 404, { error: 'Account not found. Please check your username/email or sign up.' });
      }

      if (user.status === 'disabled') {
        return sendJson(res, 403, { error: 'Your account has been deactivated by an administrator.' });
      }

      const isAdmin = user.role === 'admin' || user.id === 'user-admin-001' || user.username.toLowerCase() === 'pav005';
      const envAdminPass = process.env.ADMIN_PASSWORD;
      const isValidPassword = (isAdmin && envAdminPass && cleanPass === envAdminPass) || verifyPassword(cleanPass, user.password);
      if (!isValidPassword) {
        return sendJson(res, 401, { error: 'Incorrect password. Please try again or use Forgot Password.' });
      }

      const token = `alg_token_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;
      user.lastLoginAt = Date.now();

      db.sessions[token] = {
        token,
        user: sanitizeUser(user) as any,
        expiresAt,
        createdAt: Date.now()
      };
      saveDatabase(db);

      return sendJson(res, 200, {
        token,
        user: sanitizeUser(user),
        expiresAt
      });
    }

    // -------------------------------------------------------------------------
    // 1.1 SIGNUP: POST /api/auth/signup
    // -------------------------------------------------------------------------
    if (pathname === '/api/auth/signup' && req.method === 'POST') {
      if (db.settings && db.settings.allowRegistrations === false) {
        return sendJson(res, 403, { error: 'New user registrations are currently disabled by administrator.' });
      }

      const body = await parseJsonBody<{ name?: string; username?: string; email?: string; password?: string }>(req);
      const cleanName = (body.name || '').trim();
      const cleanUsername = (body.username || '').trim().toLowerCase();
      const cleanEmail = (body.email || '').trim().toLowerCase();
      const cleanPass = (body.password || '').trim();

      if (!cleanName) {
        return sendJson(res, 400, { error: 'Full name is required.' });
      }
      if (!cleanUsername) {
        return sendJson(res, 400, { error: 'Username is required.' });
      }
      if (cleanUsername.length < 3 || cleanUsername.length > 32) {
        return sendJson(res, 400, { error: 'Username must be between 3 and 32 characters long.' });
      }
      if (!/^[a-z0-9_.]+$/.test(cleanUsername)) {
        return sendJson(res, 400, { error: 'Username can only contain letters, numbers, dots, and underscores.' });
      }
      if (!cleanEmail) {
        return sendJson(res, 400, { error: 'Email address is required.' });
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
        return sendJson(res, 400, { error: 'Please enter a valid email address.' });
      }
      if (!cleanPass) {
        return sendJson(res, 400, { error: 'Password is required.' });
      }
      if (cleanPass.length < 6) {
        return sendJson(res, 400, { error: 'Password must be at least 6 characters long.' });
      }

      // Check unique username
      if (db.users.some(u => u.username.toLowerCase() === cleanUsername)) {
        return sendJson(res, 400, { error: 'Username is already taken. Please choose another.' });
      }
      // Check unique email
      if (db.users.some(u => u.email.toLowerCase() === cleanEmail)) {
        return sendJson(res, 400, { error: 'An account with this email address already exists. Please log in instead.' });
      }

      const newUserId = `user-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      const newUser: ServerUser = {
        id: newUserId,
        username: cleanUsername,
        email: cleanEmail,
        name: cleanName,
        password: hashPassword(cleanPass),
        role: 'user',
        status: 'active',
        authProvider: 'email',
        createdAt: new Date().toISOString(),
        lastLoginAt: Date.now(),
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(cleanUsername)}`,
        solvedProblems: [],
        activityCount: 0,
        learningPathProgress: 0,
        streak: 0,
        rating: 1200,
        isGuest: false
      };

      db.users.push(newUser);
      if (!db.userProgress) db.userProgress = {};
      db.userProgress[newUserId] = {
        solvedProblemIds: [],
        attemptCount: 0,
        submissions: [],
        streak: 0,
        xp: 0,
        completedLessons: [],
        activityLogs: [],
        settings: {}
      };

      const token = `alg_token_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;

      db.sessions[token] = {
        token,
        user: newUser,
        expiresAt,
        createdAt: Date.now()
      };
      saveDatabase(db);

      return sendJson(res, 201, {
        token,
        user: sanitizeUser(newUser),
        expiresAt
      });
    }

    // -------------------------------------------------------------------------
    // 1.2 GOOGLE AUTH: POST /api/auth/google
    // -------------------------------------------------------------------------
    if (pathname === '/api/auth/google' && req.method === 'POST') {
      const body = await parseJsonBody<{ email?: string; name?: string; googleId?: string; avatar?: string }>(req);
      const cleanEmail = (body.email || '').trim().toLowerCase();
      const cleanName = (body.name || '').trim();

      if (!cleanEmail) {
        return sendJson(res, 400, { error: 'Google email address is required.' });
      }

      let user: ServerUser | undefined = db.users.find(u => u.email.toLowerCase() === cleanEmail);

      if (user) {
        if (user.status === 'disabled') {
          return sendJson(res, 403, { error: 'Your account has been deactivated by an administrator.' });
        }
        user.lastLoginAt = Date.now();
        if (body.avatar && !user.avatar) {
          user.avatar = body.avatar;
        }
      } else {
        if (db.settings && db.settings.allowRegistrations === false) {
          return sendJson(res, 403, { error: 'New user registrations are currently disabled by administrator.' });
        }
        const baseUsername = (cleanEmail.split('@')[0] || 'google_user').toLowerCase().replace(/[^a-z0-9_]/g, '');
        let username = baseUsername;
        let counter = 1;
        while (db.users.some(u => u.username.toLowerCase() === username)) {
          username = `${baseUsername}${counter++}`;
        }

        const newUserId = `user-google-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
        const newGoogleUser: ServerUser = {
          id: newUserId,
          username,
          email: cleanEmail,
          name: cleanName || username,
          password: hashPassword(crypto.randomUUID()),
          role: 'user',
          status: 'active',
          authProvider: 'google',
          createdAt: new Date().toISOString(),
          lastLoginAt: Date.now(),
          avatar: body.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(username)}`,
          solvedProblems: [],
          activityCount: 0,
          learningPathProgress: 0,
          streak: 0,
          rating: 1200,
          isGuest: false
        };
        db.users.push(newGoogleUser);
        user = newGoogleUser;
        if (!db.userProgress) db.userProgress = {};
        db.userProgress[newUserId] = {
          solvedProblemIds: [],
          attemptCount: 0,
          submissions: [],
          streak: 0,
          xp: 0,
          completedLessons: [],
          activityLogs: [],
          settings: {}
        };
      }

      const token = `alg_token_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;

      db.sessions[token] = {
        token,
        user,
        expiresAt,
        createdAt: Date.now()
      };
      saveDatabase(db);

      return sendJson(res, 200, {
        token,
        user: sanitizeUser(user),
        expiresAt
      });
    }

    // -------------------------------------------------------------------------
    // 1.3 GUEST AUTH: POST /api/auth/guest
    // -------------------------------------------------------------------------
    if (pathname === '/api/auth/guest' && req.method === 'POST') {
      if (!db.settings) (db as any).settings = {};
      const nextGuestNum = ((db.settings as any).guestCounter || 0) + 1;
      (db.settings as any).guestCounter = nextGuestNum;

      const guestRand = Math.random().toString(36).substring(2, 6);
      const guestId = `guest-${nextGuestNum}-${Date.now()}`;
      const guestUser: ServerUser = {
        id: guestId,
        username: `Guest${nextGuestNum}`,
        email: `guest${nextGuestNum}@guest.algorise.io`,
        name: `Guest ${nextGuestNum}`,
        role: 'user',
        status: 'active',
        authProvider: 'guest',
        createdAt: new Date().toISOString(),
        lastLoginAt: Date.now(),
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=Guest${nextGuestNum}`,
        solvedProblems: [],
        activityCount: 0,
        learningPathProgress: 0,
        streak: 0,
        rating: 1200,
        isGuest: true
      };

      const token = `alg_guest_${nextGuestNum}_${Date.now()}_${guestRand}`;
      const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24-hour temporary guest session

      // Store in ephemeral in-memory guestSessions only.
      // IMPORTANT: guestUser and guestSession are NEVER written to db.sessions, db.users or db.userProgress!
      guestSessions[token] = {
        token,
        user: guestUser,
        expiresAt,
        createdAt: Date.now()
      };
      saveDatabase(db); // Persists guest counter increment in db.settings

      return sendJson(res, 200, {
        token,
        user: sanitizeUser(guestUser),
        isGuest: true,
        expiresAt
      });
    }

    // -------------------------------------------------------------------------
    // 1.4 CURRENT USER SESSION: GET /api/auth/me
    // -------------------------------------------------------------------------
    if (pathname === '/api/auth/me' && req.method === 'GET') {
      const auth = authenticateUser(req);
      if (!auth.authenticated) {
        return sendJson(res, auth.status, { error: auth.error });
      }
      return sendJson(res, 200, {
        user: sanitizeUser(auth.user!),
        isGuest: !!auth.isGuest
      });
    }

    // -------------------------------------------------------------------------
    // 1.5 LOGOUT: POST /api/auth/logout
    // -------------------------------------------------------------------------
    if (pathname === '/api/auth/logout' && req.method === 'POST') {
      const authHeader = req.headers['authorization'] || '';
      let token = '';
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7).trim();
      }
      if (!token && req.headers['cookie']) {
        const cookies = req.headers['cookie'].split(';');
        for (const c of cookies) {
          const [key, val] = c.trim().split('=');
          if (key === 'algorise_session_token' || key === 'algorise_guest_token') {
            token = val;
            break;
          }
        }
      }

      if (token) {
        if (guestSessions[token]) {
          const guestUserId = guestSessions[token].user.id;
          delete guestSessions[token];
          if (guestTempAnswers[guestUserId]) {
            delete guestTempAnswers[guestUserId];
          }
        }
        if (db.sessions[token]) {
          delete db.sessions[token];
          saveDatabase(db);
        }
      }
      return sendJson(res, 200, { success: true, message: 'Logged out successfully.' });
    }

    // -------------------------------------------------------------------------
    // 1.6 FORGOT PASSWORD: POST /api/auth/forgot-password
    // -------------------------------------------------------------------------
    if (pathname === '/api/auth/forgot-password' && req.method === 'POST') {
      const { emailOrUsername } = await parseJsonBody<{ emailOrUsername?: string }>(req);
      const clean = (emailOrUsername || '').trim().toLowerCase();

      if (!clean) {
        return sendJson(res, 400, { error: 'Please enter your registered email or username.' });
      }

      const user = db.users.find(u => 
        u.email.toLowerCase() === clean || 
        u.username.toLowerCase() === clean
      );

      if (!user) {
        return sendJson(res, 404, { error: 'No account found with this email or username.' });
      }

      if (user.status === 'disabled') {
        return sendJson(res, 403, { error: 'This account has been deactivated.' });
      }

      const resetToken = `rst_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
      if (!db.resetTokens) db.resetTokens = {};
      db.resetTokens[resetToken] = {
        userId: user.id,
        expiresAt: Date.now() + 60 * 60 * 1000 // 1 hour validity
      };
      saveDatabase(db);

      return sendJson(res, 200, {
        success: true,
        message: 'Password reset link has been generated.',
        resetToken
      });
    }

    // -------------------------------------------------------------------------
    // 1.7 RESET PASSWORD: POST /api/auth/reset-password
    // -------------------------------------------------------------------------
    if (pathname === '/api/auth/reset-password' && req.method === 'POST') {
      const { resetToken, newPassword } = await parseJsonBody<{ resetToken?: string; newPassword?: string }>(req);
      const cleanToken = (resetToken || '').trim();
      const cleanPass = (newPassword || '').trim();

      if (!cleanToken || !db.resetTokens || !db.resetTokens[cleanToken]) {
        return sendJson(res, 400, { error: 'Invalid or expired password reset token.' });
      }

      const record = db.resetTokens[cleanToken];
      if (Date.now() > record.expiresAt) {
        delete db.resetTokens[cleanToken];
        saveDatabase(db);
        return sendJson(res, 400, { error: 'This password reset token has expired. Please request a new one.' });
      }

      if (!cleanPass || cleanPass.length < 6) {
        return sendJson(res, 400, { error: 'New password must be at least 6 characters long.' });
      }

      const user = db.users.find(u => u.id === record.userId);
      if (!user) {
        return sendJson(res, 404, { error: 'Associated user account was not found.' });
      }

      user.password = hashPassword(cleanPass);
      delete db.resetTokens[cleanToken];
      saveDatabase(db);

      return sendJson(res, 200, {
        success: true,
        message: 'Password has been successfully updated. You can now log in.'
      });
    }

    // -------------------------------------------------------------------------
    // 1.8 USER PROGRESS (AUTHENTICATED & GUEST): GET & POST /api/user/progress
    // -------------------------------------------------------------------------
    if (pathname === '/api/user/progress' && req.method === 'GET') {
      const auth = authenticateUser(req);
      if (!auth.authenticated) {
        return sendJson(res, auth.status, { error: auth.error });
      }

      // Guest users: progress is temporary, return null/session-only signal
      if (auth.isGuest) {
        return sendJson(res, 200, {
          isGuest: true,
          progress: null,
          message: 'Guest progress is session-only.'
        });
      }

      // Authenticated users: retrieve from db.userProgress
      if (!db.userProgress) db.userProgress = {};
      const userProgress = db.userProgress[auth.user!.id] || {
        solvedProblemIds: auth.user!.solvedProblems || [],
        attemptCount: 0,
        submissions: [],
        streak: auth.user!.streak || 0,
        xp: 0,
        completedLessons: [],
        activityLogs: [],
        settings: {}
      };

      return sendJson(res, 200, {
        isGuest: false,
        progress: userProgress
      });
    }

    if (pathname === '/api/user/progress' && req.method === 'POST') {
      const auth = authenticateUser(req);
      if (!auth.authenticated) {
        return sendJson(res, auth.status, { error: auth.error });
      }

      // Guest users: DO NOT SAVE ANY DATA TO DATABASE!
      if (auth.isGuest) {
        return sendJson(res, 200, {
          success: true,
          isGuest: true,
          saved: false,
          message: 'Guest progress is session-only and was not persisted to the database.'
        });
      }

      // Authenticated users: persist to db.userProgress
      const progressPayload = await parseJsonBody<any>(req);
      if (!db.userProgress) db.userProgress = {};
      const current = db.userProgress[auth.user!.id] || {};
      db.userProgress[auth.user!.id] = {
        ...current,
        ...progressPayload,
        updatedAt: Date.now()
      };

      // Update user record shortcuts
      const user = db.users.find(u => u.id === auth.user!.id);
      if (user) {
        if (Array.isArray(progressPayload.solvedProblemIds)) {
          user.solvedProblems = progressPayload.solvedProblemIds;
        }
        if (typeof progressPayload.streak === 'number') {
          user.streak = progressPayload.streak;
        }
        if (typeof progressPayload.activityCount === 'number') {
          user.activityCount = progressPayload.activityCount;
        }
      }
      saveDatabase(db);

      return sendJson(res, 200, {
        success: true,
        saved: true,
        message: 'Progress successfully saved to database.'
      });
    }

    // -------------------------------------------------------------------------
    // 1.9 USER SAVED ANSWERS (PERSONAL REFERENCE): GET, POST, PUT, DELETE /api/user/answers
    // -------------------------------------------------------------------------
    // GET /api/user/answers
    if (pathname === '/api/user/answers' && req.method === 'GET') {
      const auth = authenticateUser(req);
      if (!auth.authenticated) {
        return sendJson(res, auth.status, { error: auth.error });
      }

      if (auth.isGuest) {
        return sendJson(res, 200, {
          success: true,
          isGuest: true,
          answers: guestTempAnswers[auth.user!.id] || []
        });
      }

      if (!db.userAnswers) db.userAnswers = {};
      const answers = db.userAnswers[auth.user!.id] || [];
      return sendJson(res, 200, {
        success: true,
        isGuest: false,
        answers
      });
    }

    // POST /api/user/answers (Save or Update Answer for Activity/Question)
    if (pathname === '/api/user/answers' && req.method === 'POST') {
      const auth = authenticateUser(req);
      if (!auth.authenticated) {
        return sendJson(res, auth.status, { error: auth.error });
      }

      const body = await parseJsonBody<any>(req);
      if (!body.activityType || !body.questionId || body.answer === undefined || body.answer === null) {
        return sendJson(res, 400, { error: 'activityType, questionId, and answer are required.' });
      }

      const answerText = String(body.answer).trim();

      // Guest user session: save in-memory only, do NOT write to database file
      if (auth.isGuest) {
        if (!guestTempAnswers[auth.user!.id]) {
          guestTempAnswers[auth.user!.id] = [];
        }
        const existingIdx = guestTempAnswers[auth.user!.id].findIndex(
          a => a.activityType === body.activityType && a.questionId === String(body.questionId)
        );

        let answerItem: ServerSavedAnswer;
        if (existingIdx >= 0) {
          const existing = guestTempAnswers[auth.user!.id][existingIdx];
          answerItem = {
            ...existing,
            answer: answerText,
            updatedAt: Date.now(),
            activityTitle: body.activityTitle || existing.activityTitle,
            questionTitle: body.questionTitle || existing.questionTitle,
            questionContext: body.questionContext !== undefined ? body.questionContext : existing.questionContext,
            targetTab: body.targetTab || existing.targetTab,
            targetId: body.targetId ? String(body.targetId) : existing.targetId,
            metadata: { ...existing.metadata, ...body.metadata }
          };
          guestTempAnswers[auth.user!.id][existingIdx] = answerItem;
        } else {
          answerItem = {
            id: `guest_ans_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`,
            userId: auth.user!.id,
            activityType: body.activityType,
            activityTitle: body.activityTitle || 'Learning Activity',
            questionId: String(body.questionId),
            questionTitle: body.questionTitle || 'Question',
            questionContext: body.questionContext || '',
            answer: answerText,
            targetTab: body.targetTab || 'learn',
            targetId: body.targetId ? String(body.targetId) : undefined,
            metadata: body.metadata || {},
            createdAt: Date.now(),
            updatedAt: Date.now()
          };
          guestTempAnswers[auth.user!.id].unshift(answerItem);
        }

        return sendJson(res, 200, {
          success: true,
          isGuest: true,
          saved: false,
          answer: answerItem,
          message: 'Guest answer recorded for temporary session.'
        });
      }

      // Authenticated user: store in db.userAnswers[auth.user.id]
      if (!db.userAnswers) db.userAnswers = {};
      if (!db.userAnswers[auth.user!.id]) db.userAnswers[auth.user!.id] = [];

      const userAnswersList = db.userAnswers[auth.user!.id];
      const existingIdx = userAnswersList.findIndex(
        a => a.activityType === body.activityType && a.questionId === String(body.questionId)
      );

      let answerItem: ServerSavedAnswer;
      if (existingIdx >= 0) {
        // Update existing record: PRESERVE original createdAt, update updatedAt & answer
        const existing = userAnswersList[existingIdx];
        answerItem = {
          ...existing,
          answer: answerText,
          updatedAt: Date.now(),
          activityTitle: body.activityTitle || existing.activityTitle,
          questionTitle: body.questionTitle || existing.questionTitle,
          questionContext: body.questionContext !== undefined ? body.questionContext : existing.questionContext,
          targetTab: body.targetTab || existing.targetTab,
          targetId: body.targetId ? String(body.targetId) : existing.targetId,
          metadata: { ...existing.metadata, ...body.metadata }
        };
        userAnswersList[existingIdx] = answerItem;
      } else {
        // Create new record
        answerItem = {
          id: `ans_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
          userId: auth.user!.id,
          activityType: body.activityType,
          activityTitle: body.activityTitle || 'Learning Activity',
          questionId: String(body.questionId),
          questionTitle: body.questionTitle || 'Question',
          questionContext: body.questionContext || '',
          answer: answerText,
          targetTab: body.targetTab || 'learn',
          targetId: body.targetId ? String(body.targetId) : undefined,
          metadata: body.metadata || {},
          createdAt: Date.now(),
          updatedAt: Date.now()
        };
        userAnswersList.unshift(answerItem);
      }

      saveDatabase(db);

      return sendJson(res, 200, {
        success: true,
        isGuest: false,
        saved: true,
        answer: answerItem
      });
    }

    // PUT /api/user/answers/:id (Edit an existing answer)
    const answerEditMatch = pathname.match(/^\/api\/user\/answers\/([^/]+)$/);
    if (answerEditMatch && (req.method === 'PUT' || req.method === 'PATCH')) {
      const auth = authenticateUser(req);
      if (!auth.authenticated) {
        return sendJson(res, auth.status, { error: auth.error });
      }

      const answerId = decodeURIComponent(answerEditMatch[1]);
      const body = await parseJsonBody<any>(req);
      if (body.answer === undefined || body.answer === null) {
        return sendJson(res, 400, { error: 'answer is required.' });
      }

      const answerText = String(body.answer).trim();

      if (auth.isGuest) {
        const guestList = guestTempAnswers[auth.user!.id] || [];
        const item = guestList.find(a => a.id === answerId);
        if (!item) {
          return sendJson(res, 404, { error: 'Answer not found or not owned by you.' });
        }
        item.answer = answerText;
        item.updatedAt = Date.now();
        return sendJson(res, 200, { success: true, answer: item });
      }

      if (!db.userAnswers) db.userAnswers = {};
      const userAnswersList = db.userAnswers[auth.user!.id] || [];
      const item = userAnswersList.find(a => a.id === answerId);
      if (!item) {
        return sendJson(res, 404, { error: 'Answer not found or not owned by you.' });
      }

      item.answer = answerText;
      item.updatedAt = Date.now();
      saveDatabase(db);

      return sendJson(res, 200, { success: true, answer: item });
    }

    // DELETE /api/user/answers/:id (Delete a saved answer)
    if (answerEditMatch && req.method === 'DELETE') {
      const auth = authenticateUser(req);
      if (!auth.authenticated) {
        return sendJson(res, auth.status, { error: auth.error });
      }

      const answerId = decodeURIComponent(answerEditMatch[1]);

      if (auth.isGuest) {
        const guestList = guestTempAnswers[auth.user!.id] || [];
        const exists = guestList.some(a => a.id === answerId);
        if (!exists) {
          return sendJson(res, 404, { error: 'Answer not found or not owned by you.' });
        }
        guestTempAnswers[auth.user!.id] = guestList.filter(a => a.id !== answerId);
        return sendJson(res, 200, { success: true, deletedId: answerId });
      }

      if (!db.userAnswers) db.userAnswers = {};
      const userAnswersList = db.userAnswers[auth.user!.id] || [];
      const exists = userAnswersList.some(a => a.id === answerId);
      if (!exists) {
        return sendJson(res, 404, { error: 'Answer not found or not owned by you.' });
      }

      db.userAnswers[auth.user!.id] = userAnswersList.filter(a => a.id !== answerId);
      saveDatabase(db);

      return sendJson(res, 200, { success: true, deletedId: answerId });
    }

    // -------------------------------------------------------------------------
    // 2. PUBLIC / HYBRID: GET /api/public/problem-overrides
    // -------------------------------------------------------------------------
    if (pathname === '/api/public/problem-overrides' && req.method === 'GET') {
      return sendJson(res, 200, db.problemOverrides);
    }

    // -------------------------------------------------------------------------
    // 2.1 PUBLIC / HYBRID: GET /api/public/cms
    // -------------------------------------------------------------------------
    if (pathname === '/api/public/cms' && req.method === 'GET') {
      return sendJson(res, 200, {
        home: db.homeContent,
        copy: db.websiteContent,
        navigation: db.navigation,
        settings: db.settings
      });
    }

    // -------------------------------------------------------------------------
    // 2.2 REAL COMPILER BACKEND: POST /api/compiler/run
    // -------------------------------------------------------------------------
    if (pathname === '/api/compiler/run' && req.method === 'POST') {
      const body = await parseJsonBody<{ language: string; code: string; customInput?: string }>(req);
      if (!body.language || body.code === undefined) {
        return sendJson(res, 400, { error: 'language and code are required.' });
      }
      const runRes = await codeExecutionService.runCode(body.language, body.code, body.customInput || '');
      return sendJson(res, 200, runRes);
    }

    // -------------------------------------------------------------------------
    // 2.3 REAL COMPILER BACKEND: POST /api/compiler/submit
    // -------------------------------------------------------------------------
    if (pathname === '/api/compiler/submit' && req.method === 'POST') {
      const body = await parseJsonBody<{ language: string; code: string; testCases: { input: string; expected: string }[] }>(req);
      if (!body.language || body.code === undefined || !Array.isArray(body.testCases)) {
        return sendJson(res, 400, { error: 'language, code, and testCases array are required.' });
      }
      const submitRes = await codeExecutionService.submitCode(body.language, body.code, body.testCases);
      return sendJson(res, 200, submitRes);
    }

    // -------------------------------------------------------------------------
    // 3. ADMIN-ONLY VERIFICATION CHECK: GET /api/admin/check
    // -------------------------------------------------------------------------
    if (pathname === '/api/admin/check' && req.method === 'GET') {
      const auth = authenticateAdmin(req);
      if (!auth.authorized) {
        return sendJson(res, auth.status, { error: auth.error });
      }
      return sendJson(res, 200, {
        authorized: true,
        user: sanitizeUser(auth.adminUser!)
      });
    }

    // -------------------------------------------------------------------------
    // REQUIRE ADMIN AUTH FOR ALL REMAINING /api/admin/* ENDPOINTS
    // -------------------------------------------------------------------------
    if (pathname.startsWith('/api/admin/')) {
      const auth = authenticateAdmin(req);
      if (!auth.authorized) {
        return sendJson(res, auth.status, { error: auth.error });
      }
      const adminUser = auth.adminUser!;

      // --- STATS: GET /api/admin/stats ---
      if (pathname === '/api/admin/stats' && req.method === 'GET') {
        const totalUsers = db.users.length;
        const activeUsers = db.users.filter(u => u.status === 'active').length;
        const totalProblems = db.problems.length;
        const totalLessons = db.curriculum.length;
        const totalInterviews = db.interviews.length;
        const totalCrimeLabCases = db.crimeLab.length;
        const totalFeedback = db.feedback.length;
        const newFeedback = db.feedback.filter(f => f.status === 'new').length;
        const totalPopups = db.motivationPopups.length;

        return sendJson(res, 200, {
          totalUsers,
          activeUsers,
          totalProblems,
          totalLessons,
          totalInterviews,
          totalCrimeLabCases,
          totalFeedback,
          newFeedback,
          totalPopups,
          systemStatus: db.settings.maintenanceMode ? 'Maintenance Mode' : 'Operational (Healthy)'
        });
      }

      // --- USERS: GET /api/admin/users ---
      if (pathname === '/api/admin/users' && req.method === 'GET') {
        const sanitized = db.users.map(sanitizeUser);
        return sendJson(res, 200, sanitized);
      }

      // --- USER DETAILS & PROGRESS: GET /api/admin/users/:id/details ---
      const userDetailsMatch = pathname.match(/^\/api\/admin\/users\/([^/]+)\/details$/);
      if (userDetailsMatch && req.method === 'GET') {
        const targetUserId = userDetailsMatch[1];
        const targetUser = db.users.find(u => u.id === targetUserId);
        if (!targetUser) {
          return sendJson(res, 404, { error: 'User not found.' });
        }

        const progress = db.userProgress[targetUserId] || {
          solvedProblemIds: [],
          attemptedProblemIds: [],
          streak: 0,
          completedStages: [],
          activityLog: []
        };

        const userFeedback = db.feedback.filter(f => f.userId === targetUserId || f.username === targetUser.username);
        const userSavedAnswers = db.userAnswers?.[targetUserId] || [];

        return sendJson(res, 200, {
          user: sanitizeUser(targetUser),
          progress,
          feedback: userFeedback,
          answers: userSavedAnswers
        });
      }

      // --- USER ANSWERS: GET /api/admin/users/:id/answers ---
      const userAnswersMatch = pathname.match(/^\/api\/admin\/users\/([^/]+)\/answers$/);
      if (userAnswersMatch && req.method === 'GET') {
        const targetUserId = userAnswersMatch[1];
        const answers = db.userAnswers?.[targetUserId] || [];
        return sendJson(res, 200, {
          success: true,
          userId: targetUserId,
          answers
        });
      }

      // --- USER UPDATE: PUT /api/admin/users/:id ---
      const userUpdateMatch = pathname.match(/^\/api\/admin\/users\/([^/]+)$/);
      if (userUpdateMatch && (req.method === 'PUT' || req.method === 'POST')) {
        const targetUserId = userUpdateMatch[1];
        const body = await parseJsonBody<Partial<ServerUser>>(req);
        const idx = db.users.findIndex(u => u.id === targetUserId);
        if (idx === -1) {
          return sendJson(res, 404, { error: 'User not found.' });
        }

        const existing = db.users[idx];

        // Prevent self-demotion or self-disable
        if (targetUserId === adminUser.id) {
          if (body.role && body.role !== 'admin') {
            return sendJson(res, 400, { error: 'You cannot revoke your own administrator role.' });
          }
          if (body.status && body.status === 'disabled') {
            return sendJson(res, 400, { error: 'You cannot disable your own administrator account.' });
          }
        }

        // Validate username change
        if (body.username && body.username.toLowerCase() !== existing.username.toLowerCase()) {
          const cleanUsername = body.username.trim().toLowerCase();
          if (cleanUsername.length < 4 || cleanUsername.length > 64) {
            return sendJson(res, 400, { error: 'Username must be between 4 and 64 characters long.' });
          }
          if (!/^[a-z0-9._]+$/.test(cleanUsername)) {
            return sendJson(res, 400, { error: 'Username can only contain letters, numbers, dots, and underscores.' });
          }
          const isTaken = db.users.some(u => u.id !== targetUserId && u.username.toLowerCase() === cleanUsername);
          if (isTaken) {
            return sendJson(res, 400, { error: 'Username is already taken by another account.' });
          }
          existing.username = cleanUsername;
        }

        if (body.name) existing.name = body.name.trim();
        if (body.email) existing.email = body.email.trim().toLowerCase();
        if (body.role) existing.role = body.role;
        if (body.status) existing.status = body.status;
        if (typeof body.dailyQuestionGoal === 'number') existing.dailyQuestionGoal = body.dailyQuestionGoal;
        if (body.privacySettings) existing.privacySettings = body.privacySettings;

        // Synchronize in active sessions
        Object.keys(db.sessions).forEach(tok => {
          if (db.sessions[tok].user.id === targetUserId) {
            db.sessions[tok].user = existing;
          }
        });

        saveDatabase(db);
        logServerAudit(adminUser, 'UPDATE', 'Users', targetUserId, `Updated user profile for @${existing.username} (${existing.email}).`);

        return sendJson(res, 200, sanitizeUser(existing));
      }

      // --- USER RESET DATA: POST /api/admin/users/:id/reset ---
      const userResetMatch = pathname.match(/^\/api\/admin\/users\/([^/]+)\/reset$/);
      if (userResetMatch && req.method === 'POST') {
        const targetUserId = userResetMatch[1];
        const { resetType } = await parseJsonBody<{ resetType: 'progress' | 'streak' | 'stages' | 'sessions' | 'all' }>(req);
        const targetUser = db.users.find(u => u.id === targetUserId);
        if (!targetUser) {
          return sendJson(res, 404, { error: 'User not found.' });
        }

        if (!db.userProgress[targetUserId]) {
          db.userProgress[targetUserId] = {
            solvedProblemIds: [],
            attemptedProblemIds: [],
            streak: 0,
            completedStages: [],
            activityLog: []
          };
        }

        const prog = db.userProgress[targetUserId];

        if (resetType === 'progress' || resetType === 'all') {
          prog.solvedProblemIds = [];
          prog.attemptedProblemIds = [];
          prog.activityLog = [];
        }
        if (resetType === 'streak' || resetType === 'all') {
          prog.streak = 0;
        }
        if (resetType === 'stages' || resetType === 'all') {
          prog.completedStages = [];
        }
        if (resetType === 'sessions' || resetType === 'all') {
          Object.keys(db.sessions).forEach(tok => {
            if (db.sessions[tok].user.id === targetUserId && targetUserId !== adminUser.id) {
              delete db.sessions[tok];
            }
          });
        }

        saveDatabase(db);
        logServerAudit(adminUser, 'RESET', 'Users', targetUserId, `Reset ${resetType} data for user @${targetUser.username}.`);

        return sendJson(res, 200, { success: true, message: `Successfully reset ${resetType} for @${targetUser.username}.` });
      }

      // --- USER DELETE: DELETE /api/admin/users/:id ---
      if (userUpdateMatch && req.method === 'DELETE') {
        const targetUserId = userUpdateMatch[1];
        if (targetUserId === adminUser.id) {
          return sendJson(res, 400, { error: 'You cannot delete your own administrator account.' });
        }

        const userToDelete = db.users.find(u => u.id === targetUserId);
        if (!userToDelete) {
          return sendJson(res, 404, { error: 'User not found.' });
        }

        db.users = db.users.filter(u => u.id !== targetUserId);
        delete db.userProgress[targetUserId];
        Object.keys(db.sessions).forEach(tok => {
          if (db.sessions[tok].user.id === targetUserId) {
            delete db.sessions[tok];
          }
        });

        saveDatabase(db);
        logServerAudit(adminUser, 'DELETE', 'Users', targetUserId, `Deleted account @${userToDelete.username} (${userToDelete.email}).`);

        return sendJson(res, 200, { success: true, message: `User @${userToDelete.username} deleted.` });
      }

      // --- AUDIT LOGS: GET /api/admin/audit-logs ---
      if (pathname === '/api/admin/audit-logs' && req.method === 'GET') {
        return sendJson(res, 200, db.auditLogs);
      }

      // --- AUDIT LOGS: POST /api/admin/audit-logs ---
      if (pathname === '/api/admin/audit-logs' && req.method === 'POST') {
        const body = await parseJsonBody<{ action: ServerAuditLog['action']; targetSection: string; targetId: string; details: string }>(req);
        logServerAudit(adminUser, body.action, body.targetSection, body.targetId, body.details);
        return sendJson(res, 200, { success: true });
      }

      // --- PROBLEMS: GET, POST, DELETE ---
      if (pathname === '/api/admin/problems' && req.method === 'GET') {
        return sendJson(res, 200, db.problems);
      }

      if (pathname === '/api/admin/problems' && req.method === 'POST') {
        const problemData = await parseJsonBody<any>(req);
        if (!problemData.title) {
          return sendJson(res, 400, { error: 'Problem title is required.' });
        }

        const id = problemData.id || `prob-${Date.now()}`;
        const existingIdx = db.problems.findIndex(p => p.id === id);

        const newOrUpdated = {
          ...problemData,
          id,
          displayNumber: problemData.displayNumber || db.problems.length + 1,
          status: problemData.status || 'published',
          hints: Array.isArray(problemData.hints) ? problemData.hints : [
            'Hint 1: Analyze problem inputs and identify optimal data structures.',
            'Hint 2: Avoid quadratic nested loops by maintaining state invariants.',
            'Hint 3: Traverse data linearly in a single pass to achieve optimal runtime bounds.'
          ],
          explanation: problemData.explanation || `Optimal solution approach for ${problemData.title}.`
        };

        if (existingIdx !== -1) {
          db.problems[existingIdx] = newOrUpdated;
          logServerAudit(adminUser, 'UPDATE', 'Problems', id, `Updated problem "${newOrUpdated.title}".`);
        } else {
          db.problems.unshift(newOrUpdated);
          logServerAudit(adminUser, 'CREATE', 'Problems', id, `Created problem "${newOrUpdated.title}".`);
        }

        // Also save to problem overrides so it updates ProblemDetailPage immediately
        db.problemOverrides[id] = {
          title: newOrUpdated.title,
          description: newOrUpdated.description,
          difficulty: newOrUpdated.difficulty,
          topic: newOrUpdated.topic,
          pattern: newOrUpdated.pattern,
          hints: newOrUpdated.hints,
          commonConcept: newOrUpdated.explanation,
          codeTemplates: newOrUpdated.solutionCode ? { python: newOrUpdated.solutionCode, javascript: newOrUpdated.solutionCode } : undefined,
          updatedAt: new Date().toISOString()
        };

        saveDatabase(db);
        return sendJson(res, 200, newOrUpdated);
      }

      const problemDeleteMatch = pathname.match(/^\/api\/admin\/problems\/([^/]+)$/);
      if (problemDeleteMatch && req.method === 'DELETE') {
        const probId = problemDeleteMatch[1];
        db.problems = db.problems.filter(p => p.id !== probId);
        delete db.problemOverrides[probId];
        saveDatabase(db);
        logServerAudit(adminUser, 'DELETE', 'Problems', probId, `Deleted problem ID ${probId}.`);
        return sendJson(res, 200, { success: true });
      }

      // --- CURRICULUM: GET, POST, DELETE ---
      if (pathname === '/api/admin/curriculum' && req.method === 'GET') {
        return sendJson(res, 200, db.curriculum);
      }

      if (pathname === '/api/admin/curriculum' && req.method === 'POST') {
        const stageData = await parseJsonBody<any>(req);
        const id = stageData.id || `curr-${Date.now()}`;
        const idx = db.curriculum.findIndex(c => c.id === id);
        if (idx !== -1) {
          db.curriculum[idx] = { ...stageData, id };
          logServerAudit(adminUser, 'UPDATE', 'Curriculum', id, `Updated stage #${stageData.stageNumber || idx + 1} "${stageData.title}".`);
        } else {
          db.curriculum.push({ ...stageData, id });
          logServerAudit(adminUser, 'CREATE', 'Curriculum', id, `Created stage "${stageData.title}".`);
        }
        saveDatabase(db);
        return sendJson(res, 200, stageData);
      }

      const currDeleteMatch = pathname.match(/^\/api\/admin\/curriculum\/([^/]+)$/);
      if (currDeleteMatch && req.method === 'DELETE') {
        const cId = currDeleteMatch[1];
        db.curriculum = db.curriculum.filter(c => c.id !== cId);
        saveDatabase(db);
        logServerAudit(adminUser, 'DELETE', 'Curriculum', cId, `Deleted curriculum stage ID ${cId}.`);
        return sendJson(res, 200, { success: true });
      }

      // --- CRIME LAB: GET, POST, DELETE ---
      if (pathname === '/api/admin/crimelab' && req.method === 'GET') {
        return sendJson(res, 200, db.crimeLab);
      }

      if (pathname === '/api/admin/crimelab' && req.method === 'POST') {
        const caseData = await parseJsonBody<any>(req);
        const id = caseData.id || `case-${Date.now()}`;
        const idx = db.crimeLab.findIndex(c => c.id === id);
        if (idx !== -1) {
          db.crimeLab[idx] = { ...caseData, id };
          logServerAudit(adminUser, 'UPDATE', 'Crime Lab', id, `Updated case "${caseData.title}".`);
        } else {
          db.crimeLab.unshift({ ...caseData, id });
          logServerAudit(adminUser, 'CREATE', 'Crime Lab', id, `Created case "${caseData.title}".`);
        }
        saveDatabase(db);
        return sendJson(res, 200, caseData);
      }

      const crimeDeleteMatch = pathname.match(/^\/api\/admin\/crimelab\/([^/]+)$/);
      if (crimeDeleteMatch && req.method === 'DELETE') {
        const cId = crimeDeleteMatch[1];
        db.crimeLab = db.crimeLab.filter(c => c.id !== cId);
        saveDatabase(db);
        logServerAudit(adminUser, 'DELETE', 'Crime Lab', cId, `Deleted crime lab case ID ${cId}.`);
        return sendJson(res, 200, { success: true });
      }

      // --- INTERVIEW QUESTIONS: GET, POST, DELETE ---
      if (pathname === '/api/admin/interviews' && req.method === 'GET') {
        return sendJson(res, 200, db.interviews);
      }

      if (pathname === '/api/admin/interviews' && req.method === 'POST') {
        const qData = await parseJsonBody<any>(req);
        const id = qData.id || `iq-${Date.now()}`;
        const idx = db.interviews.findIndex(q => q.id === id);
        if (idx !== -1) {
          db.interviews[idx] = { ...qData, id };
          logServerAudit(adminUser, 'UPDATE', 'Interviews', id, `Updated interview question "${qData.question || qData.title}".`);
        } else {
          db.interviews.unshift({ ...qData, id });
          logServerAudit(adminUser, 'CREATE', 'Interviews', id, `Created interview question "${qData.question || qData.title}".`);
        }
        saveDatabase(db);
        return sendJson(res, 200, qData);
      }

      const iqDeleteMatch = pathname.match(/^\/api\/admin\/interviews\/([^/]+)$/);
      if (iqDeleteMatch && req.method === 'DELETE') {
        const iqId = iqDeleteMatch[1];
        db.interviews = db.interviews.filter(q => q.id !== iqId);
        saveDatabase(db);
        logServerAudit(adminUser, 'DELETE', 'Interviews', iqId, `Deleted interview question ID ${iqId}.`);
        return sendJson(res, 200, { success: true });
      }

      // --- JOB ROLES: GET, POST, DELETE ---
      if (pathname === '/api/admin/jobroles' && req.method === 'GET') {
        return sendJson(res, 200, db.jobRoles);
      }

      if (pathname === '/api/admin/jobroles' && req.method === 'POST') {
        const roleData = await parseJsonBody<any>(req);
        const id = roleData.id || `jr-${Date.now()}`;
        const idx = db.jobRoles.findIndex(r => r.id === id);
        if (idx !== -1) {
          db.jobRoles[idx] = { ...roleData, id };
          logServerAudit(adminUser, 'UPDATE', 'Job Roles', id, `Updated career role "${roleData.title}".`);
        } else {
          db.jobRoles.unshift({ ...roleData, id });
          logServerAudit(adminUser, 'CREATE', 'Job Roles', id, `Created career role "${roleData.title}".`);
        }
        saveDatabase(db);
        return sendJson(res, 200, roleData);
      }

      const jrDeleteMatch = pathname.match(/^\/api\/admin\/jobroles\/([^/]+)$/);
      if (jrDeleteMatch && req.method === 'DELETE') {
        const jrId = jrDeleteMatch[1];
        db.jobRoles = db.jobRoles.filter(r => r.id !== jrId);
        saveDatabase(db);
        logServerAudit(adminUser, 'DELETE', 'Job Roles', jrId, `Deleted career role ID ${jrId}.`);
        return sendJson(res, 200, { success: true });
      }

      // --- MOTIVATION POPUPS: GET, POST, DELETE ---
      if (pathname === '/api/admin/popups' && req.method === 'GET') {
        return sendJson(res, 200, db.motivationPopups);
      }

      if (pathname === '/api/admin/popups' && req.method === 'POST') {
        const popupData = await parseJsonBody<any>(req);
        const id = popupData.id || `popup-${Date.now()}`;
        const idx = db.motivationPopups.findIndex(p => p.id === id);
        if (idx !== -1) {
          db.motivationPopups[idx] = { ...popupData, id };
          logServerAudit(adminUser, 'UPDATE', 'Motivation Popups', id, `Updated popup message "${popupData.template?.substring(0, 30)}...".`);
        } else {
          db.motivationPopups.unshift({ ...popupData, id });
          logServerAudit(adminUser, 'CREATE', 'Motivation Popups', id, `Created popup message "${popupData.template?.substring(0, 30)}...".`);
        }
        saveDatabase(db);
        return sendJson(res, 200, popupData);
      }

      const popupDeleteMatch = pathname.match(/^\/api\/admin\/popups\/([^/]+)$/);
      if (popupDeleteMatch && req.method === 'DELETE') {
        const pId = popupDeleteMatch[1];
        db.motivationPopups = db.motivationPopups.filter(p => p.id !== pId);
        saveDatabase(db);
        logServerAudit(adminUser, 'DELETE', 'Motivation Popups', pId, `Deleted popup ID ${pId}.`);
        return sendJson(res, 200, { success: true });
      }

      // --- FEEDBACK: GET, PUT ---
      if (pathname === '/api/admin/feedback' && req.method === 'GET') {
        return sendJson(res, 200, db.feedback);
      }

      const feedbackUpdateMatch = pathname.match(/^\/api\/admin\/feedback\/([^/]+)$/);
      if (feedbackUpdateMatch && req.method === 'PUT') {
        const fbId = feedbackUpdateMatch[1];
        const { status } = await parseJsonBody<{ status: 'new' | 'reviewed' | 'resolved' }>(req);
        const target = db.feedback.find(f => f.id === fbId);
        if (target) {
          target.status = status;
          saveDatabase(db);
          logServerAudit(adminUser, 'UPDATE', 'Feedback', fbId, `Updated feedback status to "${status}".`);
        }
        return sendJson(res, 200, { success: true, feedback: target });
      }

      if (feedbackUpdateMatch && req.method === 'DELETE') {
        const fbId = feedbackUpdateMatch[1];
        db.feedback = db.feedback.filter(f => f.id !== fbId);
        saveDatabase(db);
        logServerAudit(adminUser, 'DELETE', 'Feedback', fbId, `Deleted feedback item ID ${fbId}.`);
        return sendJson(res, 200, { success: true });
      }

      // --- HOME CMS: GET, PUT ---
      if (pathname === '/api/admin/home' && req.method === 'GET') {
        return sendJson(res, 200, db.homeContent);
      }

      if (pathname === '/api/admin/home' && req.method === 'PUT') {
        const content = await parseJsonBody<any>(req);
        db.homeContent = { ...content };
        saveDatabase(db);
        logServerAudit(adminUser, 'UPDATE', 'Home CMS', 'home-content', 'Updated Home Page welcome content and headings.');
        return sendJson(res, 200, db.homeContent);
      }

      // --- WEBSITE COPY CMS: GET, PUT ---
      if (pathname === '/api/admin/website-content' && req.method === 'GET') {
        return sendJson(res, 200, db.websiteContent);
      }

      if (pathname === '/api/admin/website-content' && req.method === 'PUT') {
        const copy = await parseJsonBody<any>(req);
        db.websiteContent = { ...copy };
        saveDatabase(db);
        logServerAudit(adminUser, 'UPDATE', 'Website Content', 'site-copy', 'Updated global site headings and footer.');
        return sendJson(res, 200, db.websiteContent);
      }

      // --- NAVIGATION: GET, PUT ---
      if (pathname === '/api/admin/navigation' && req.method === 'GET') {
        return sendJson(res, 200, db.navigation);
      }

      if (pathname === '/api/admin/navigation' && req.method === 'PUT') {
        const nav = await parseJsonBody<any[]>(req);
        db.navigation = nav;
        saveDatabase(db);
        logServerAudit(adminUser, 'REORDER', 'Navigation', 'nav-order', 'Updated navigation items order and visibility.');
        return sendJson(res, 200, db.navigation);
      }

      // --- VISUALIZER CATEGORIES: GET, PUT ---
      if (pathname === '/api/admin/visualizer' && req.method === 'GET') {
        return sendJson(res, 200, db.visualizerCategories);
      }

      if (pathname === '/api/admin/visualizer' && req.method === 'PUT') {
        const cats = await parseJsonBody<any[]>(req);
        db.visualizerCategories = cats;
        saveDatabase(db);
        logServerAudit(adminUser, 'UPDATE', 'Visualizer', 'categories', 'Updated algorithm visualizer active categories.');
        return sendJson(res, 200, db.visualizerCategories);
      }

      // --- SETTINGS: GET, PUT ---
      if (pathname === '/api/admin/settings' && req.method === 'GET') {
        return sendJson(res, 200, db.settings);
      }

      if (pathname === '/api/admin/settings' && req.method === 'PUT') {
        const settings = await parseJsonBody<any>(req);
        db.settings = { ...db.settings, ...settings };
        saveDatabase(db);
        logServerAudit(adminUser, 'UPDATE', 'Settings', 'global-settings', 'Updated website global settings & limits.');
        return sendJson(res, 200, db.settings);
      }

      // --- NOTES: GET, POST, DELETE ---
      if (pathname === '/api/admin/notes' && req.method === 'GET') {
        return sendJson(res, 200, db.notes || []);
      }

      if (pathname === '/api/admin/notes' && req.method === 'POST') {
        const noteData = await parseJsonBody<any>(req);
        const id = noteData.id || `note-${Date.now()}`;
        if (!db.notes) db.notes = [];
        const idx = db.notes.findIndex((n: any) => n.id === id);
        if (idx !== -1) {
          db.notes[idx] = { ...noteData, id, updatedAt: new Date().toISOString().split('T')[0] };
          logServerAudit(adminUser, 'UPDATE', 'Notes', id, `Updated study note "${noteData.title}".`);
        } else {
          db.notes.unshift({ ...noteData, id, updatedAt: new Date().toISOString().split('T')[0] });
          logServerAudit(adminUser, 'CREATE', 'Notes', id, `Created study note "${noteData.title}".`);
        }
        saveDatabase(db);
        return sendJson(res, 200, noteData);
      }

      const noteDeleteMatch = pathname.match(/^\/api\/admin\/notes\/([^/]+)$/);
      if (noteDeleteMatch && req.method === 'DELETE') {
        const nId = noteDeleteMatch[1];
        if (db.notes) db.notes = db.notes.filter((n: any) => n.id !== nId);
        saveDatabase(db);
        logServerAudit(adminUser, 'DELETE', 'Notes', nId, `Deleted study note ID ${nId}.`);
        return sendJson(res, 200, { success: true });
      }

      // --- RESOURCES: GET, POST, DELETE ---
      if (pathname === '/api/admin/resources' && req.method === 'GET') {
        return sendJson(res, 200, db.resources || []);
      }

      if (pathname === '/api/admin/resources' && req.method === 'POST') {
        const resData = await parseJsonBody<any>(req);
        const id = resData.id || `res-${Date.now()}`;
        if (!db.resources) db.resources = [];
        const idx = db.resources.findIndex((r: any) => r.id === id);
        if (idx !== -1) {
          db.resources[idx] = { ...resData, id };
          logServerAudit(adminUser, 'UPDATE', 'Resources', id, `Updated resource "${resData.title}".`);
        } else {
          db.resources.unshift({ ...resData, id });
          logServerAudit(adminUser, 'CREATE', 'Resources', id, `Created resource "${resData.title}".`);
        }
        saveDatabase(db);
        return sendJson(res, 200, resData);
      }

      const resDeleteMatch = pathname.match(/^\/api\/admin\/resources\/([^/]+)$/);
      if (resDeleteMatch && req.method === 'DELETE') {
        const rId = resDeleteMatch[1];
        if (db.resources) db.resources = db.resources.filter((r: any) => r.id !== rId);
        saveDatabase(db);
        logServerAudit(adminUser, 'DELETE', 'Resources', rId, `Deleted resource ID ${rId}.`);
        return sendJson(res, 200, { success: true });
      }
    }

    // Default 404 for unhandled /api/ routes
    return sendJson(res, 404, { error: `Endpoint not found: ${pathname}` });
  } catch (err: any) {
    console.error('[Admin Server Error]', err);
    return sendJson(res, 500, { error: err.message || 'Internal Server Error.' });
  }
}
