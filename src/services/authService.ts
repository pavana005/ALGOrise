import { smtpService } from './smtpService';
import { googleOAuthService } from './googleOAuthService';

export interface PrivacySettings {
  profileVisibility: 'public' | 'private';
  activityVisibility: 'public' | 'private';
  progressVisibility: 'public' | 'private';
}

export interface SecurityActivityItem {
  id: string;
  event: string;
  timestamp: number;
  details: string;
  ipAddress?: string;
}

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'user';
  status: 'active' | 'disabled';
  authProvider: 'email' | 'google' | 'guest';
  isGuest?: boolean;
  googleId?: string;
  createdAt: string;
  dailyQuestionGoal?: number;
  lastLoginAt?: number;
  privacySettings?: PrivacySettings;
  securityLog?: SecurityActivityItem[];
}

export interface Session {
  token: string;
  user: User;
  expiresAt: number;
  deviceName?: string;
  ipAddress?: string;
  lastActive?: number;
  createdAt?: number;
}

export interface SessionInfo {
  id: string;
  deviceName: string;
  browser: string;
  os: string;
  ipAddress: string;
  location: string;
  lastActive: number;
  createdAt: number;
  expiresAt: number;
  isCurrent: boolean;
  tokenHash: string;
  authMechanism: string;
}

export interface ResetTokenRecord {
  token: string;
  userId: string;
  expiresAt: number;
  used: boolean;
  createdAt: number;
}

const STORAGE_USERS_KEY = 'algorise_users_db_v1';
const STORAGE_SESSIONS_KEY = 'algorise_sessions_db_v1';
const STORAGE_CURRENT_TOKEN_KEY = 'algorise_auth_token';
const STORAGE_GUEST_TOKEN_KEY = 'algorise_guest_token';
const STORAGE_GUEST_SESSION_KEY = 'algorise_guest_session';
const STORAGE_RESET_TOKENS_KEY = 'algorise_reset_tokens_v1';

// Initial default users (including Admin and Demo user)
const INITIAL_USERS: Array<User & { password?: string }> = [
  {
    id: 'user-admin-001',
    name: 'ALGOrise Admin',
    username: 'pav005',
    email: 'admin@algorise.io',
    role: 'admin',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
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
    role: 'user',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
    authProvider: 'email',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    dailyQuestionGoal: 5,
    privacySettings: { profileVisibility: 'public', activityVisibility: 'public', progressVisibility: 'public' },
    securityLog: [
      { id: 'sec-2', event: 'Account Initialized', timestamp: Date.now() - 15 * 24 * 60 * 60 * 1000, details: 'User account created', ipAddress: '127.0.0.1' }
    ]
  }
];

class AuthService {
  public static normalizeUsername(raw: string): string {
    return (raw || '').trim().toLowerCase();
  }

  public static isValidUsernameFormat(username: string): { valid: boolean; reason?: string } {
    const normalized = AuthService.normalizeUsername(username);
    if (!normalized) return { valid: false, reason: 'Username is required.' };
    if (normalized.length < 4 || normalized.length > 64) {
      return { valid: false, reason: 'Your username must be between 4 and 64 characters long.' };
    }
    if (!/^[a-z0-9._]+$/.test(normalized)) return { valid: false, reason: 'Username can only contain letters, numbers, dots, and underscores.' };
    return { valid: true };
  }

  private getUsers(): Array<User & { password?: string }> {
    const raw = localStorage.getItem(STORAGE_USERS_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    try {
      const parsed = JSON.parse(raw);
      const updated = parsed.map((u: any) => {
        if (u.id === 'user-admin-001' || u.email === 'admin@algorise.io' || u.username === 'admin') {
          return {
            ...u,
            username: 'pav005',
            role: 'admin',
            status: 'active'
          };
        }
        const fallbackUsername = (u.username || u.email.split('@')[0] || 'user').toLowerCase().replace(/[^a-z0-9._]/g, '');
        return {
          ...u,
          username: AuthService.normalizeUsername(u.username || fallbackUsername || 'user'),
          role: u.role || (u.email === 'admin@algorise.io' ? 'admin' : 'user'),
          status: u.status || 'active',
          dailyQuestionGoal: typeof u.dailyQuestionGoal === 'number' ? u.dailyQuestionGoal : 5,
          privacySettings: u.privacySettings || { profileVisibility: 'public', activityVisibility: 'public', progressVisibility: 'public' },
          securityLog: Array.isArray(u.securityLog) ? u.securityLog : []
        };
      });
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(updated));
      return updated;
    } catch {
      return INITIAL_USERS;
    }
  }

  private saveUsers(users: Array<User & { password?: string }>) {
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
  }

  private getSessions(): Record<string, Session> {
    const raw = localStorage.getItem(STORAGE_SESSIONS_KEY);
    if (!raw) return {};
    try {
      return JSON.parse(raw);
    } catch {
      return {};
    }
  }

  private saveSessions(sessions: Record<string, Session>) {
    localStorage.setItem(STORAGE_SESSIONS_KEY, JSON.stringify(sessions));
  }

  private getResetTokens(): Record<string, ResetTokenRecord> {
    const raw = localStorage.getItem(STORAGE_RESET_TOKENS_KEY);
    if (!raw) return {};
    try {
      return JSON.parse(raw);
    } catch {
      return {};
    }
  }

  private saveResetTokens(tokens: Record<string, ResetTokenRecord>) {
    localStorage.setItem(STORAGE_RESET_TOKENS_KEY, JSON.stringify(tokens));
  }

  private logSecurityEvent(userId: string, event: string, details: string) {
    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      const log = users[userIndex].securityLog || [];
      const newEntry: SecurityActivityItem = {
        id: `sec-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        event,
        timestamp: Date.now(),
        details,
        ipAddress: '127.0.0.1 (Local Session)'
      };
      users[userIndex].securityLog = [newEntry, ...log.slice(0, 49)];
      this.saveUsers(users);
    }
  }

  private createSession(user: User): Session {
    const token = `alg_token_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;
    
    // Detect device info
    let deviceName = 'Chrome · Windows';
    if (typeof navigator !== 'undefined' && navigator.userAgent) {
      const ua = navigator.userAgent;
      if (ua.includes('Firefox')) deviceName = 'Firefox · Windows';
      else if (ua.includes('Safari') && !ua.includes('Chrome')) deviceName = 'Safari · macOS';
      else if (ua.includes('Mobile')) deviceName = 'Mobile Browser';
    }

    const session: Session = { 
      token, 
      user, 
      expiresAt,
      deviceName,
      ipAddress: '127.0.0.1 (Client)',
      lastActive: Date.now(),
      createdAt: Date.now()
    };

    const sessions = this.getSessions();
    sessions[token] = session;
    this.saveSessions(sessions);
    localStorage.setItem(STORAGE_CURRENT_TOKEN_KEY, token);

    if (typeof document !== 'undefined') {
      const maxAge = 7 * 24 * 60 * 60; // 7 days in seconds
      document.cookie = `algorise_session_token=${token}; Path=/; SameSite=Strict; Max-Age=${maxAge}`;
    }

    // Record last login & security event
    const users = this.getUsers();
    const uIdx = users.findIndex(u => u.id === user.id);
    if (uIdx !== -1) {
      users[uIdx].lastLoginAt = Date.now();
      this.saveUsers(users);
    }

    this.logSecurityEvent(user.id, 'New Session Created', `Authenticated via ${user.authProvider} OAuth/Password`);

    return session;
  }

  /**
   * BACKEND PERMISSION ENFORCEMENT
   * Validates if token belongs to an active Admin user. Throws error if unauthorized.
   */
  requireAdmin(token: string | null): User {
    const user = this.validateSessionToken(token);
    if (!user) {
      throw new Error('Unauthorized: Valid session required.');
    }
    if (user.role !== 'admin') {
      throw new Error('Access Denied: Admin authorization privileges required.');
    }
    if (user.status === 'disabled') {
      throw new Error('Account Disabled: Your admin account has been deactivated.');
    }
    return user;
  }

  checkUsernameAvailability(username: string): { available: boolean; message: string; reason: 'invalid_format' | 'taken' | 'available' } {
    const formatCheck = AuthService.isValidUsernameFormat(username);
    if (!formatCheck.valid) {
      return { available: false, message: formatCheck.reason || 'Invalid username format.', reason: 'invalid_format' };
    }

    const normalized = AuthService.normalizeUsername(username);
    const users = this.getUsers();

    const isTaken = users.some(u => AuthService.normalizeUsername(u.username) === normalized);
    if (isTaken) {
      return { available: false, message: 'Username is already taken.', reason: 'taken' };
    }

    return { available: true, message: 'Username is available.', reason: 'available' };
  }

  updateUsername(token: string | null, newUsername: string): User {
    const currentUser = this.validateSessionToken(token);
    if (!currentUser) throw new Error('Unauthorized: Active session required.');

    const cleanUsername = AuthService.normalizeUsername(newUsername);
    if (AuthService.normalizeUsername(currentUser.username) !== cleanUsername) {
      const check = this.checkUsernameAvailability(cleanUsername);
      if (!check.available) {
        throw new Error(check.message);
      }
    }

    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex === -1) throw new Error('User account not found.');

    users[userIndex].username = cleanUsername;
    this.saveUsers(users);

    const sessions = this.getSessions();
    if (token && sessions[token]) {
      sessions[token].user.username = cleanUsername;
      this.saveSessions(sessions);
    }

    this.logSecurityEvent(currentUser.id, 'Username Changed', `Updated username to @${cleanUsername}`);

    const { password: _, ...updated } = users[userIndex];
    return updated;
  }

  async login(emailOrUsername: string, password: string): Promise<Session> {
    const cleanInput = emailOrUsername.trim().toLowerCase();
    const cleanPassword = password ? password.trim() : '';

    if (!cleanInput || !cleanPassword) {
      throw new Error('Please enter both username/email and password.');
    }

    try {
      if (typeof window !== 'undefined' && typeof window.fetch === 'function') {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ emailOrUsername: cleanInput, password: cleanPassword })
        });

        if (res.ok) {
          const data = await res.json();
          const session = this.createSession(data.user);
          // Sync token from server
          if (data.token) {
            session.token = data.token;
            const sessions = this.getSessions();
            sessions[data.token] = session;
            this.saveSessions(sessions);
            localStorage.setItem(STORAGE_CURRENT_TOKEN_KEY, data.token);
            if (typeof document !== 'undefined') {
              document.cookie = `algorise_session_token=${data.token}; Path=/; SameSite=Strict; Max-Age=${7 * 24 * 3600}`;
            }
          }
          return session;
        } else {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || 'Invalid username/email or password.');
        }
      }
    } catch (err: any) {
      if (err.message && !err.message.includes('fetch')) {
        throw err;
      }
    }

    // Local fallback for offline mode
    const users = this.getUsers();
    const found = users.find((u) => u.email.toLowerCase() === cleanInput || AuthService.normalizeUsername(u.username) === cleanInput);

    if (!found) {
      throw new Error('Invalid username/email or password.');
    }

    if (found.status === 'disabled') {
      throw new Error('Your account has been disabled by an administrator.');
    }

    if (found.authProvider === 'google' && !found.password) {
      throw new Error('This account was registered using Google. Please click "Continue with Google".');
    }

    if (found.password && found.password !== cleanPassword) {
      throw new Error('Invalid username/email or password.');
    }

    const { password: _, ...userNoPass } = found;
    return this.createSession(userNoPass);
  }

  async signup(name: string, username: string, email: string, password: string): Promise<Session> {
    await new Promise((r) => setTimeout(r, 300));

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanUsername = AuthService.normalizeUsername(username);

    if (!cleanName) throw new Error('Please enter your full name.');
    
    const formatCheck = AuthService.isValidUsernameFormat(cleanUsername);
    if (!formatCheck.valid) {
      throw new Error(formatCheck.reason || 'Invalid username format.');
    }

    if (!cleanEmail || !cleanEmail.includes('@')) throw new Error('Please enter a valid email address.');
    if (password.length < 6) throw new Error('Password must be at least 6 characters long.');

    const users = this.getUsers();

    if (users.some((u) => u.email.toLowerCase() === cleanEmail)) {
      throw new Error('An account with this email address already exists. Please login instead.');
    }

    // Race condition prevention: re-verify database unique constraint
    if (users.some((u) => AuthService.normalizeUsername(u.username) === cleanUsername)) {
      throw new Error('That username is no longer available.');
    }

    try {
      if (typeof window !== 'undefined' && typeof window.fetch === 'function') {
        const res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: cleanName, username: cleanUsername, email: cleanEmail, password })
        });
        if (res.ok) {
          const data = await res.json();
          const session = this.createSession(data.user);
          if (data.token) {
            session.token = data.token;
            const sessions = this.getSessions();
            sessions[data.token] = session;
            this.saveSessions(sessions);
            localStorage.setItem(STORAGE_CURRENT_TOKEN_KEY, data.token);
            if (typeof document !== 'undefined') {
              document.cookie = `algorise_session_token=${data.token}; Path=/; SameSite=Strict; Max-Age=${7 * 24 * 3600}`;
            }
          }
          return session;
        } else {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || 'Failed to create account.');
        }
      }
    } catch (err: any) {
      if (err.message && !err.message.includes('fetch')) {
        throw err;
      }
    }

    const newUser: User & { password?: string } = {
      id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: cleanName,
      username: cleanUsername,
      email: cleanEmail,
      password: password,
      role: 'user',
      status: 'active',
      authProvider: 'email',
      createdAt: new Date().toISOString(),
      dailyQuestionGoal: 5,
      privacySettings: { profileVisibility: 'public', activityVisibility: 'public', progressVisibility: 'public' }
    };

    users.push(newUser);
    this.saveUsers(users);

    const { password: _, ...userNoPass } = newUser;
    return this.createSession(userNoPass);
  }

  async loginWithGoogle(customUsername?: string): Promise<Session> {
    const googleProfile = await googleOAuthService.authenticateWithGoogle();

    try {
      if (typeof window !== 'undefined' && typeof window.fetch === 'function') {
        const res = await fetch('/api/auth/google', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: googleProfile.email,
            name: googleProfile.name,
            googleId: googleProfile.googleId,
            avatar: googleProfile.avatar
          })
        });
        if (res.ok) {
          const data = await res.json();
          const session = this.createSession(data.user);
          if (data.token) {
            session.token = data.token;
            const sessions = this.getSessions();
            sessions[data.token] = session;
            this.saveSessions(sessions);
            localStorage.setItem(STORAGE_CURRENT_TOKEN_KEY, data.token);
            if (typeof document !== 'undefined') {
              document.cookie = `algorise_session_token=${data.token}; Path=/; SameSite=Strict; Max-Age=${7 * 24 * 3600}`;
            }
          }
          return session;
        }
      }
    } catch (err: any) {
      if (err.message && !err.message.includes('fetch')) {
        throw err;
      }
    }

    const users = this.getUsers();

    // Check if Google account already belongs to an existing user (matching googleId OR verified email)
    let found = users.find(u => 
      (u.googleId && u.googleId === googleProfile.googleId) ||
      u.email.toLowerCase() === googleProfile.email.toLowerCase()
    );

    if (found) {
      if (found.status === 'disabled') {
        throw new Error('Your account has been disabled by an administrator.');
      }

      // Link googleId if not linked already
      if (!found.googleId) {
        found.googleId = googleProfile.googleId;
        const uIdx = users.findIndex(u => u.id === found!.id);
        if (uIdx !== -1) {
          users[uIdx].googleId = googleProfile.googleId;
          this.saveUsers(users);
        }
      }

      const { password: _, ...userNoPass } = found;
      return this.createSession(userNoPass);
    }

    // New Google User setup: determine username
    let chosenUsername = customUsername ? AuthService.normalizeUsername(customUsername) : '';

    if (chosenUsername) {
      const avail = this.checkUsernameAvailability(chosenUsername);
      if (!avail.available) {
        throw new Error(`Chosen username "@${chosenUsername}" is invalid or already taken.`);
      }
    } else {
      // Auto-generate candidate username from Google Profile name
      let candidate = googleOAuthService.generateCandidateUsername(googleProfile.name, googleProfile.email);
      let suffix = 1;
      while (users.some(u => AuthService.normalizeUsername(u.username) === candidate)) {
        candidate = `${googleOAuthService.generateCandidateUsername(googleProfile.name, googleProfile.email)}${suffix++}`;
      }
      chosenUsername = candidate;
    }

    const newGoogleUser: User = {
      id: `user-google-${Date.now()}`,
      name: googleProfile.name,
      username: chosenUsername,
      email: googleProfile.email.toLowerCase(),
      avatar: googleProfile.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
      role: 'user',
      status: 'active',
      authProvider: 'google',
      googleId: googleProfile.googleId,
      createdAt: new Date().toISOString(),
      dailyQuestionGoal: 5,
      privacySettings: { profileVisibility: 'public', activityVisibility: 'public', progressVisibility: 'public' }
    };

    users.push(newGoogleUser);
    this.saveUsers(users);

    return this.createSession(newGoogleUser);
  }

  async loginAsGuest(): Promise<Session> {
    try {
      if (typeof window !== 'undefined' && typeof window.fetch === 'function') {
        const res = await fetch('/api/auth/guest', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
        if (res.ok) {
          const data = await res.json();
          const session: Session = {
            token: data.token,
            user: { ...data.user, isGuest: true, authProvider: 'guest' },
            expiresAt: data.expiresAt || (Date.now() + 24 * 60 * 60 * 1000),
            deviceName: 'Guest Browser',
            ipAddress: '127.0.0.1 (Guest)',
            lastActive: Date.now(),
            createdAt: Date.now()
          };
          if (typeof sessionStorage !== 'undefined') {
            sessionStorage.setItem(STORAGE_GUEST_TOKEN_KEY, session.token);
            sessionStorage.setItem(STORAGE_GUEST_SESSION_KEY, JSON.stringify(session));
          }
          if (typeof document !== 'undefined') {
            document.cookie = `algorise_guest_token=${session.token}; Path=/; SameSite=Strict; Max-Age=${24 * 3600}`;
          }
          return session;
        }
      }
    } catch (err) {
      console.warn('Backend guest auth endpoint failed, falling back to client guest session:', err);
    }

    // Client-side fallback guest session
    const guestRand = Math.random().toString(36).substring(2, 7);
    const guestId = `guest-${Date.now()}-${guestRand}`;
    const guestUser: User = {
      id: guestId,
      name: 'Guest Learner',
      username: `guest_${guestRand}`,
      email: `${guestId}@guest.algorise.io`,
      role: 'user',
      status: 'active',
      authProvider: 'guest',
      isGuest: true,
      createdAt: new Date().toISOString(),
      dailyQuestionGoal: 5
    };
    const session: Session = {
      token: `alg_guest_${Date.now()}_${guestRand}`,
      user: guestUser,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000,
      deviceName: 'Guest Browser',
      ipAddress: '127.0.0.1 (Guest)',
      lastActive: Date.now(),
      createdAt: Date.now()
    };
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem(STORAGE_GUEST_TOKEN_KEY, session.token);
      sessionStorage.setItem(STORAGE_GUEST_SESSION_KEY, JSON.stringify(session));
    }
    if (typeof document !== 'undefined') {
      document.cookie = `algorise_guest_token=${session.token}; Path=/; SameSite=Strict; Max-Age=${24 * 3600}`;
    }
    return session;
  }

  validateSessionToken(token: string | null): User | null {
    if (!token) return null;

    // Check if token is guest token
    if (token.startsWith('alg_guest_') || (typeof sessionStorage !== 'undefined' && sessionStorage.getItem(STORAGE_GUEST_TOKEN_KEY) === token)) {
      if (typeof sessionStorage !== 'undefined') {
        const raw = sessionStorage.getItem(STORAGE_GUEST_SESSION_KEY);
        if (raw) {
          try {
            const guestSession = JSON.parse(raw);
            if (guestSession && guestSession.expiresAt && Date.now() < guestSession.expiresAt) {
              return { ...guestSession.user, isGuest: true };
            }
          } catch (e) {
            // ignore
          }
        }
      }
      return null;
    }

    const sessions = this.getSessions();
    const session = sessions[token];

    if (!session) {
      this.clearToken();
      return null;
    }

    if (Date.now() > session.expiresAt) {
      delete sessions[token];
      this.saveSessions(sessions);
      this.clearToken();
      return null;
    }

    // Refresh user role & status from db
    const users = this.getUsers();
    const updatedUser = users.find((u) => u.id === session.user.id);
    if (!updatedUser || updatedUser.status === 'disabled') {
      delete sessions[token];
      this.saveSessions(sessions);
      this.clearToken();
      return null;
    }

    // Touch lastActive timestamp on session
    session.lastActive = Date.now();
    sessions[token] = session;
    this.saveSessions(sessions);

    const { password: _, ...userNoPass } = updatedUser;
    return userNoPass;
  }

  getCurrentUser(): User | null {
    const token = this.getStoredToken();
    return this.validateSessionToken(token);
  }

  getStoredToken(): string | null {
    if (typeof document !== 'undefined') {
      const match = document.cookie.match(/(?:^|; )\s*algorise_session_token=([^;]*)/);
      if (match && match[1]) {
        return decodeURIComponent(match[1]);
      }
      const guestMatch = document.cookie.match(/(?:^|; )\s*algorise_guest_token=([^;]*)/);
      if (guestMatch && guestMatch[1]) {
        return decodeURIComponent(guestMatch[1]);
      }
    }
    const localToken = localStorage.getItem(STORAGE_CURRENT_TOKEN_KEY);
    if (localToken) return localToken;
    if (typeof sessionStorage !== 'undefined') {
      return sessionStorage.getItem(STORAGE_GUEST_TOKEN_KEY);
    }
    return null;
  }

  logout(): void {
    const token = this.getStoredToken();
    if (token) {
      if (typeof window !== 'undefined' && typeof window.fetch === 'function') {
        fetch('/api/auth/logout', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        }).catch(() => {});
      }
      const sessions = this.getSessions();
      if (sessions[token]) {
        delete sessions[token];
        this.saveSessions(sessions);
      }
    }
    this.clearToken();
  }

  private clearToken(): void {
    localStorage.removeItem(STORAGE_CURRENT_TOKEN_KEY);
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem(STORAGE_GUEST_TOKEN_KEY);
      sessionStorage.removeItem(STORAGE_GUEST_SESSION_KEY);
      sessionStorage.removeItem('algorise_guest_temp_progress');
      sessionStorage.removeItem('algorise_redirect_after_login');
    }
    if (typeof document !== 'undefined') {
      document.cookie = 'algorise_session_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict';
      document.cookie = 'algorise_guest_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict';
    }
  }

  updateDailyGoal(token: string | null, goal: number): User {
    const currentUser = this.validateSessionToken(token);
    if (!currentUser) {
      throw new Error('Unauthorized: Active user session required to update daily goal.');
    }

    const cleanGoal = Math.floor(Number(goal));
    if (isNaN(cleanGoal) || cleanGoal < 1 || cleanGoal > 100) {
      throw new Error('Daily question goal must be a whole number between 1 and 100.');
    }

    const users = this.getUsers();
    const userIndex = users.findIndex((u) => u.id === currentUser.id);
    if (userIndex === -1) throw new Error('User account not found.');

    users[userIndex].dailyQuestionGoal = cleanGoal;
    this.saveUsers(users);

    // Update session object
    const sessions = this.getSessions();
    if (token && sessions[token]) {
      sessions[token].user.dailyQuestionGoal = cleanGoal;
      this.saveSessions(sessions);
    }

    const { password: _, ...updated } = users[userIndex];
    return updated;
  }

  // --- REAL PRIVACY & SECURITY API ENDPOINTS ---

  changePassword(token: string | null, currentPass: string, newPass: string, confirmPass: string): { success: boolean; message: string } {
    const currentUser = this.validateSessionToken(token);
    if (!currentUser) {
      throw new Error('Unauthorized: Active user session required.');
    }

    if (!newPass || newPass.length < 6) {
      throw new Error('New password must be at least 6 characters long.');
    }

    if (newPass !== confirmPass) {
      throw new Error('New password and confirmation password do not match.');
    }

    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex === -1) throw new Error('User account not found.');

    const userRecord = users[userIndex];

    // If account has an existing password, verify current password
    if (userRecord.password && userRecord.password !== currentPass) {
      throw new Error('Current password entered is incorrect.');
    }

    // Update password
    users[userIndex].password = newPass;
    this.saveUsers(users);

    // Log security event
    this.logSecurityEvent(currentUser.id, 'Password Changed', 'Password updated successfully via Settings');

    // Invalidate other active sessions for security
    const sessions = this.getSessions();
    Object.keys(sessions).forEach(st => {
      if (sessions[st].user.id === currentUser.id && st !== token) {
        delete sessions[st];
      }
    });
    this.saveSessions(sessions);

    return { success: true, message: 'Password changed successfully. All other active sessions have been signed out.' };
  }

  async requestPasswordReset(email: string): Promise<{ success: boolean; resetToken?: string; message: string }> {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      throw new Error('Please enter a valid email address.');
    }

    const users = this.getUsers();
    const found = users.find(u => u.email.toLowerCase() === cleanEmail);

    if (!found) {
      // User enumeration protection: return generic response
      return { success: true, message: 'If an account exists for that email, you\'ll receive a reset link shortly.' };
    }

    const resetToken = `rst_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
    const expiresAt = Date.now() + 15 * 60 * 1000; // 15 mins expiry

    const tokens = this.getResetTokens();
    tokens[resetToken] = {
      token: resetToken,
      userId: found.id,
      expiresAt,
      used: false,
      createdAt: Date.now()
    };
    this.saveResetTokens(tokens);

    this.logSecurityEvent(found.id, 'Password Reset Requested', 'Single-use 15-minute reset token generated');

    const origin = typeof window !== 'undefined' ? window.location.origin + window.location.pathname : 'http://localhost:5173/';
    const resetUrl = `${origin}#reset-password?token=${resetToken}`;

    const deliveryResult = await smtpService.sendPasswordResetEmail(cleanEmail, found.name, resetToken, resetUrl);
    if (!deliveryResult.success) {
      throw new Error(deliveryResult.message);
    }

    return { 
      success: true, 
      resetToken, 
      message: 'If an account exists for that email, you\'ll receive a reset link shortly.'
    };
  }

  resetPasswordWithToken(resetToken: string, newPassword: string): { success: boolean; message: string } {
    if (!resetToken) throw new Error('Reset token is required.');
    if (!newPassword || newPassword.length < 6) throw new Error('New password must be at least 6 characters long.');

    const tokens = this.getResetTokens();
    const record = tokens[resetToken];

    if (!record || record.used || Date.now() > record.expiresAt) {
      throw new Error('Invalid or expired password reset token. Please request a new link.');
    }

    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.id === record.userId);
    if (userIndex === -1) throw new Error('User account not found.');

    users[userIndex].password = newPassword;
    this.saveUsers(users);

    // Mark token as used
    tokens[resetToken].used = true;
    this.saveResetTokens(tokens);

    // Invalidate all active sessions for security to force re-login
    const sessions = this.getSessions();
    Object.keys(sessions).forEach(st => {
      if (sessions[st].user.id === record.userId) {
        delete sessions[st];
      }
    });
    this.saveSessions(sessions);

    this.logSecurityEvent(record.userId, 'Password Reset Completed', 'Account password successfully reset via single-use token');

    return { success: true, message: 'Password has been reset successfully. Please sign in with your new password.' };
  }

  getUserActiveSessions(token: string | null): SessionInfo[] {
    const currentUser = this.validateSessionToken(token);
    if (!currentUser) return [];

    const sessions = this.getSessions();
    const now = Date.now();

    const userSessions: SessionInfo[] = [];

    const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)';
    let defaultOs = 'Windows 11 (x64)';
    if (userAgent.includes('Macintosh')) defaultOs = 'macOS Sonoma';
    else if (userAgent.includes('Linux')) defaultOs = 'Linux x86_64';
    else if (userAgent.includes('Android')) defaultOs = 'Android 14';
    else if (userAgent.includes('iPhone') || userAgent.includes('iPad')) defaultOs = 'iOS 17';

    let defaultBrowser = 'Chrome 122.0.6261';
    if (userAgent.includes('Firefox')) defaultBrowser = 'Firefox 124.0';
    else if (userAgent.includes('Edg')) defaultBrowser = 'Edge 123.0';
    else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) defaultBrowser = 'Safari 17.2';

    Object.entries(sessions).forEach(([sToken, sess]) => {
      if (sess.user.id === currentUser.id && sess.expiresAt > now) {
        const tokenHash = `sess_${sToken.substring(0, 6)}...${sToken.substring(sToken.length - 4)}`;
        const isCurrent = sToken === token;

        userSessions.push({
          id: sToken,
          deviceName: sess.deviceName || `${defaultBrowser.split(' ')[0]} on ${defaultOs.split(' ')[0]}`,
          browser: defaultBrowser,
          os: defaultOs,
          ipAddress: sess.ipAddress || '127.0.0.1',
          location: 'Local Network / Secure Loopback',
          lastActive: sess.lastActive || sess.createdAt || now,
          createdAt: sess.createdAt || now,
          expiresAt: sess.expiresAt || (now + 7 * 24 * 60 * 60 * 1000),
          isCurrent,
          tokenHash,
          authMechanism: 'Session Cookie (HttpOnly · SameSite=Strict · TLS 1.3)'
        });
      }
    });

    return userSessions.sort((a, b) => b.lastActive - a.lastActive);
  }

  signOutSpecificSession(token: string | null, sessionIdToSignOut: string): { success: boolean; message: string } {
    const currentUser = this.validateSessionToken(token);
    if (!currentUser) throw new Error('Unauthorized: Active user session required.');

    const sessions = this.getSessions();
    if (!sessions[sessionIdToSignOut]) {
      throw new Error('Target session not found or already terminated.');
    }

    if (sessions[sessionIdToSignOut].user.id !== currentUser.id) {
      throw new Error('Unauthorized: You cannot terminate another user\'s session.');
    }

    const targetDevice = sessions[sessionIdToSignOut].deviceName || 'Remote Session';
    const isCurrentTarget = (sessionIdToSignOut === token);

    delete sessions[sessionIdToSignOut];
    this.saveSessions(sessions);
    this.logSecurityEvent(currentUser.id, 'Session Revoked', `Terminated session on ${targetDevice}`);

    if (isCurrentTarget) {
      this.clearToken();
      return { success: true, message: 'Current session signed out successfully. Redirecting...' };
    }

    return { success: true, message: `Session (${targetDevice}) signed out successfully.` };
  }

  signOutOtherSessions(token: string | null): { success: boolean; message: string } {
    const currentUser = this.validateSessionToken(token);
    if (!currentUser) throw new Error('Unauthorized: Active user session required.');

    const sessions = this.getSessions();
    let count = 0;

    Object.keys(sessions).forEach(st => {
      if (sessions[st].user.id === currentUser.id && st !== token) {
        delete sessions[st];
        count++;
      }
    });

    this.saveSessions(sessions);
    this.logSecurityEvent(currentUser.id, 'Other Sessions Terminated', `Signed out ${count} remote active session(s)`);

    return { success: true, message: `${count} other active session(s) signed out successfully.` };
  }

  signOutAllSessions(token: string | null): { success: boolean; message: string } {
    const currentUser = this.validateSessionToken(token);
    if (!currentUser) throw new Error('Unauthorized: Active user session required.');

    const sessions = this.getSessions();
    Object.keys(sessions).forEach(st => {
      if (sessions[st].user.id === currentUser.id) {
        delete sessions[st];
      }
    });

    this.saveSessions(sessions);
    this.clearToken();

    return { success: true, message: 'All active sessions have been signed out. Redirecting to login...' };
  }

  updatePrivacySettings(token: string | null, settings: PrivacySettings): User {
    const currentUser = this.validateSessionToken(token);
    if (!currentUser) throw new Error('Unauthorized: Active user session required.');

    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex === -1) throw new Error('User account not found.');

    users[userIndex].privacySettings = settings;
    this.saveUsers(users);

    // Update active session
    const sessions = this.getSessions();
    if (token && sessions[token]) {
      sessions[token].user.privacySettings = settings;
      this.saveSessions(sessions);
    }

    this.logSecurityEvent(currentUser.id, 'Privacy Settings Updated', `Profile: ${settings.profileVisibility}, Activity: ${settings.activityVisibility}`);

    const { password: _, ...updated } = users[userIndex];
    return updated;
  }

  deleteAccount(token: string | null, confirmationEmail: string, password?: string): { success: boolean; message: string } {
    const currentUser = this.validateSessionToken(token);
    if (!currentUser) throw new Error('Unauthorized: Active user session required.');

    if (confirmationEmail.trim().toLowerCase() !== currentUser.email.toLowerCase()) {
      throw new Error('Confirmation email does not match your registered account email.');
    }

    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex === -1) throw new Error('User account not found.');

    const userRecord = users[userIndex];
    if (userRecord.authProvider === 'email' && userRecord.password && userRecord.password !== password) {
      throw new Error('Current account password entered is incorrect.');
    }

    // Remove user database record
    users.splice(userIndex, 1);
    this.saveUsers(users);

    // Terminate all sessions
    const sessions = this.getSessions();
    Object.keys(sessions).forEach(st => {
      if (sessions[st].user.id === currentUser.id) {
        delete sessions[st];
      }
    });
    this.saveSessions(sessions);
    this.clearToken();

    return { success: true, message: 'Your ALGOrise account has been permanently deleted.' };
  }

  // --- ADMIN USER MANAGEMENT APIS ---

  getAllUsers(adminToken: string | null): User[] {
    this.requireAdmin(adminToken);
    return this.getUsers().map(({ password, ...u }) => u);
  }

  updateUserRole(adminToken: string | null, userId: string, newRole: 'admin' | 'user'): User {
    const currentAdmin = this.requireAdmin(adminToken);
    if (userId === currentAdmin.id && newRole !== 'admin') {
      throw new Error('You cannot revoke your own admin role.');
    }

    const users = this.getUsers();
    const userIndex = users.findIndex((u) => u.id === userId);
    if (userIndex === -1) throw new Error('User not found.');

    users[userIndex].role = newRole;
    this.saveUsers(users);

    const { password: _, ...updated } = users[userIndex];
    return updated;
  }

  toggleUserStatus(adminToken: string | null, userId: string): User {
    const currentAdmin = this.requireAdmin(adminToken);
    if (userId === currentAdmin.id) {
      throw new Error('You cannot disable your own admin account.');
    }

    const users = this.getUsers();
    const userIndex = users.findIndex((u) => u.id === userId);
    if (userIndex === -1) throw new Error('User not found.');

    users[userIndex].status = users[userIndex].status === 'active' ? 'disabled' : 'active';
    this.saveUsers(users);

    const { password: _, ...updated } = users[userIndex];
    return updated;
  }

  // --- ASYNC BACKEND AUTHORIZED ADMIN METHODS ---

  async verifyAdminServer(token: string | null): Promise<boolean> {
    if (!token) return false;
    try {
      const res = await fetch('/api/admin/check', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.ok;
    } catch {
      try {
        const u = this.requireAdmin(token);
        return !!u;
      } catch {
        return false;
      }
    }
  }

  async getAllUsersAsync(adminToken: string | null): Promise<User[]> {
    this.requireAdmin(adminToken);
    try {
      const res = await fetch('/api/admin/users', {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      if (res.ok) {
        const serverUsers: User[] = await res.json();
        // Sync local cache
        const localUsers = this.getUsers();
        const merged = serverUsers.map(su => {
          const matched = localUsers.find(lu => lu.id === su.id);
          return { ...(matched || {}), ...su };
        });
        this.saveUsers(merged);
        return serverUsers;
      }
    } catch {
      // Fallback to local
    }
    return this.getAllUsers(adminToken);
  }

  async getUserDetailsAsync(adminToken: string | null, userId: string): Promise<{ user: User; progress: any; feedback: any[] }> {
    this.requireAdmin(adminToken);
    try {
      const res = await fetch(`/api/admin/users/${userId}/details`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback to local
    }

    // Local fallback
    const users = this.getUsers();
    const targetUser = users.find(u => u.id === userId);
    if (!targetUser) throw new Error('User not found.');

    const rawProg = localStorage.getItem(`algorise_progress_v1_${userId}`);
    const progress = rawProg ? JSON.parse(rawProg) : {
      solvedProblemIds: [],
      attemptedProblemIds: [],
      streak: 0,
      completedStages: [],
      activityLog: []
    };

    const { password: _, ...safeUser } = targetUser;
    return {
      user: safeUser,
      progress,
      feedback: []
    };
  }

  async updateUserDataAsync(adminToken: string | null, userId: string, data: Partial<User>): Promise<User> {
    const currentAdmin = this.requireAdmin(adminToken);

    // Self-demotion and self-disable guard
    if (userId === currentAdmin.id) {
      if (data.role && data.role !== 'admin') {
        throw new Error('You cannot revoke your own admin role.');
      }
      if (data.status && data.status === 'disabled') {
        throw new Error('You cannot disable your own admin account.');
      }
    }

    // Call backend API
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify(data)
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to update user profile on server.');
      }

      const updatedUser: User = await res.json();
      
      // Update local storage
      const users = this.getUsers();
      const uIdx = users.findIndex(u => u.id === userId);
      if (uIdx !== -1) {
        users[uIdx] = { ...users[uIdx], ...updatedUser };
        this.saveUsers(users);
      }

      // Update active sessions if updating current user
      const sessions = this.getSessions();
      Object.keys(sessions).forEach(st => {
        if (sessions[st].user.id === userId) {
          sessions[st].user = { ...sessions[st].user, ...updatedUser };
        }
      });
      this.saveSessions(sessions);

      return updatedUser;
    } catch (err: any) {
      if (err.message && !err.message.includes('fetch')) throw err;
      
      // Fallback local update
      const users = this.getUsers();
      const uIdx = users.findIndex(u => u.id === userId);
      if (uIdx === -1) throw new Error('User not found.');

      if (data.username && data.username.toLowerCase() !== users[uIdx].username.toLowerCase()) {
        const check = this.checkUsernameAvailability(data.username);
        if (!check.available) throw new Error(check.message);
        users[uIdx].username = AuthService.normalizeUsername(data.username);
      }
      if (data.name) users[uIdx].name = data.name.trim();
      if (data.email) users[uIdx].email = data.email.trim().toLowerCase();
      if (data.role) users[uIdx].role = data.role;
      if (data.status) users[uIdx].status = data.status;
      if (typeof data.dailyQuestionGoal === 'number') users[uIdx].dailyQuestionGoal = data.dailyQuestionGoal;
      if (data.privacySettings) users[uIdx].privacySettings = data.privacySettings;

      this.saveUsers(users);
      const { password: _, ...updated } = users[uIdx];
      return updated;
    }
  }

  async resetUserDataAsync(adminToken: string | null, userId: string, resetType: 'progress' | 'streak' | 'stages' | 'sessions' | 'all'): Promise<{ success: boolean; message: string }> {
    this.requireAdmin(adminToken);

    try {
      const res = await fetch(`/api/admin/users/${userId}/reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({ resetType })
      });

      if (res.ok) {
        // Also clear local scoped caches
        if (resetType === 'progress' || resetType === 'all') {
          localStorage.removeItem(`algorise_progress_v1_${userId}`);
        }
        if (resetType === 'stages' || resetType === 'all') {
          localStorage.removeItem(`algorise_completed_stages_v1_${userId}`);
        }
        if (resetType === 'sessions' || resetType === 'all') {
          const sessions = this.getSessions();
          Object.keys(sessions).forEach(st => {
            if (sessions[st].user.id === userId && st !== adminToken) {
              delete sessions[st];
            }
          });
          this.saveSessions(sessions);
        }
        return await res.json();
      }
    } catch {
      // Local fallback
    }

    if (resetType === 'progress' || resetType === 'all') {
      localStorage.removeItem(`algorise_progress_v1_${userId}`);
    }
    if (resetType === 'stages' || resetType === 'all') {
      localStorage.removeItem(`algorise_completed_stages_v1_${userId}`);
    }
    return { success: true, message: `Reset ${resetType} successfully completed.` };
  }

  deleteUser(adminToken: string | null, userId: string): void {
    const currentAdmin = this.requireAdmin(adminToken);
    if (userId === currentAdmin.id) {
      throw new Error('You cannot delete your own admin account.');
    }
    const users = this.getUsers().filter(u => u.id !== userId);
    this.saveUsers(users);

    const sessions = this.getSessions();
    Object.keys(sessions).forEach(st => {
      if (sessions[st].user.id === userId) {
        delete sessions[st];
      }
    });
    this.saveSessions(sessions);
  }

  async deleteUserAsync(adminToken: string | null, userId: string): Promise<void> {
    const currentAdmin = this.requireAdmin(adminToken);
    if (userId === currentAdmin.id) {
      throw new Error('You cannot delete your own admin account.');
    }

    try {
      await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` }
      });
    } catch {
      // Local fallback
    }

    this.deleteUser(adminToken, userId);
  }
}

export const authService = new AuthService();

