import { authService } from './authService';
import { problemsData, type Problem } from '../data/problemsData';
import { crimeLabQuestionsData, type CrimeLabCase } from '../data/crimeLabData';
import { dsaRoadmapStages, type RoadmapStage } from '../data/curriculumData';
import { interviewQuestionsData, type InterviewQuestion } from '../data/interviewData';
import { jobRolesData, type JobRole } from '../data/jobRolesData';

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  adminUserId: string;
  adminUsername: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'ENABLE' | 'DISABLE' | 'REORDER';
  targetSection: string;
  targetId: string;
  details: string;
}

export interface HomeCmsContent {
  welcomeTitle: string;
  welcomeSubtitle: string;
  aboutContent: string;
  dailyGoalOptions: number[];
  learningRecommendationsTitle: string;
  emptyStateMessage: string;
}

export interface WebsiteContentCopy {
  siteTitle: string;
  footerText: string;
  problemsPageHeading: string;
  learnPageHeading: string;
  crimeLabHeading: string;
  visualizerHeading: string;
  interviewHeading: string;
  jobRolesHeading: string;
}

export interface NavigationItemCms {
  id: string;
  label: string;
  enabled: boolean;
  order: number;
}

export interface MotivationTriggerConfig {
  triggerId: string;
  title: string;
  category: string;
  ragebaitLevel: number;
  cooldownSeconds: number;
  enabled: boolean;
  templateMessage: string;
  description?: string;
  defaultMessage?: string;
}

export interface FeedbackItem {
  id: string;
  userId?: string;
  username?: string;
  category: 'bug' | 'feature' | 'content' | 'other';
  message: string;
  rating?: number;
  createdAt: string;
  status: 'new' | 'reviewed' | 'resolved';
}

const CMS_STORAGE_KEY = 'algorise_admin_cms_v2';
const AUDIT_LOG_KEY = 'algorise_admin_audit_log_v2';
const FEEDBACK_STORAGE_KEY = 'algorise_feedback_items_v2';

class AdminCmsService {
  private cmsData: {
    home: HomeCmsContent;
    copy: WebsiteContentCopy;
    nav: NavigationItemCms[];
    problems: Problem[];
    curriculum: RoadmapStage[];
    crimeLab: CrimeLabCase[];
    interviews: InterviewQuestion[];
    jobRoles: JobRole[];
    motivations: MotivationTriggerConfig[];
    disabledSections: Record<string, boolean>;
  };

  constructor() {
    this.cmsData = this.loadCmsData();
  }

  private loadCmsData() {
    try {
      const raw = localStorage.getItem(CMS_STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch {
      // Fallback to default initial datasets
    }

    return {
      home: {
        welcomeTitle: 'Master Computer Science & Software Engineering',
        welcomeSubtitle: 'Interactive DSA visualizers, production code compiler, forensic crime lab, and AI mock interviews.',
        aboutContent: 'Algorise is an interactive Computer Science learning engine built for software engineering candidates, computer science students, and interview prep learners.',
        dailyGoalOptions: [3, 5, 10, 15],
        learningRecommendationsTitle: 'Recommended Next Steps',
        emptyStateMessage: 'No activity recorded yet. Start solving problems to track progress!'
      },
      copy: {
        siteTitle: 'Algorise — Algorithmic Learning Platform',
        footerText: '© 2026 Algorise Computer Science Learning Platform. Built for developers.',
        problemsPageHeading: 'Data Structures & Algorithms Problem Collection',
        learnPageHeading: 'Structured Flow of Learning Roadmap',
        crimeLabHeading: 'Cybersecurity & Technical Forensic Crime Lab',
        visualizerHeading: 'Algorithm & Data Structure Visualizer',
        interviewHeading: 'AI Mock Interview & Technical Question Bank',
        jobRolesHeading: 'Software Engineering Career Roles & Skill Pathways'
      },
      nav: [
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
      problems: [...problemsData],
      curriculum: [...dsaRoadmapStages],
      crimeLab: [...crimeLabQuestionsData],
      interviews: [...interviewQuestionsData],
      jobRoles: [...jobRolesData],
      motivations: [
        { triggerId: 'LOGIN', title: 'Login Teasing', category: 'LOGIN', ragebaitLevel: 2, cooldownSeconds: 300, enabled: true, templateMessage: 'welcome back {username}! your algorithms missed you.' },
        { triggerId: 'STUCK_ON_PROBLEM', title: 'Stuck on Problem', category: 'STUCK_ON_PROBLEM', ragebaitLevel: 4, cooldownSeconds: 120, enabled: true, templateMessage: 'still stuck on {algorithm}? maybe try paper and pencil!' },
        { triggerId: 'BROKEN_STREAK', title: 'Streak Lost Notice', category: 'BROKEN_STREAK', ragebaitLevel: 5, cooldownSeconds: 60, enabled: true, templateMessage: 'you lost your {streak} day streak! zero progress today.' }
      ],
      disabledSections: {}
    };
  }

  private saveCmsData() {
    try {
      localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(this.cmsData));
    } catch {
      // Ignore storage errors
    }
  }

  // --- AUDIT LOGS ---
  public logAudit(token: string | null, action: AuditLogEntry['action'], targetSection: string, targetId: string, details: string) {
    const adminUser = authService.validateSessionToken(token);
    const entry: AuditLogEntry = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      adminUserId: adminUser?.id || 'admin',
      adminUsername: adminUser?.username || 'admin',
      action,
      targetSection,
      targetId,
      details
    };

    const logs = this.getAuditLogs();
    logs.unshift(entry);
    try {
      localStorage.setItem(AUDIT_LOG_KEY, JSON.stringify(logs.slice(0, 200)));
    } catch {
      // Ignore
    }
  }

  public getAuditLogs(): AuditLogEntry[] {
    try {
      const raw = localStorage.getItem(AUDIT_LOG_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  // --- HOME CMS ---
  public getHomeContent(): HomeCmsContent {
    return this.cmsData.home;
  }

  public async getHomeContentAsync(token: string | null): Promise<HomeCmsContent> {
    if (token) {
      try {
        const res = await fetch('/api/admin/home', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (data && data.welcomeTitle) {
            this.cmsData.home = data;
            this.saveCmsData();
            return data;
          }
        }
      } catch (err) {
        console.warn('Backend get home failed:', err);
      }
    }
    return this.getHomeContent();
  }

  public updateHomeContent(token: string | null, content: HomeCmsContent): HomeCmsContent {
    authService.requireAdmin(token);
    this.cmsData.home = { ...content };
    this.saveCmsData();
    this.logAudit(token, 'UPDATE', 'Home CMS', 'home-config', 'Updated Home Page welcome titles, subtitle, and about text.');
    return this.cmsData.home;
  }

  public async updateHomeContentAsync(token: string | null, content: HomeCmsContent): Promise<HomeCmsContent> {
    authService.requireAdmin(token);
    if (token) {
      try {
        const res = await fetch('/api/admin/home', {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(content)
        });
        if (res.ok) {
          const saved = await res.json();
          this.cmsData.home = saved;
          this.saveCmsData();
          return saved;
        }
      } catch (err) {
        console.warn('Backend update home failed:', err);
      }
    }
    return this.updateHomeContent(token, content);
  }

  // --- WEBSITE COPY CMS ---
  public getWebsiteCopy(): WebsiteContentCopy {
    return this.cmsData.copy;
  }

  public async getWebsiteCopyAsync(token: string | null): Promise<WebsiteContentCopy> {
    if (token) {
      try {
        const res = await fetch('/api/admin/website-content', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (data && data.siteTitle) {
            this.cmsData.copy = data;
            this.saveCmsData();
            return data;
          }
        }
      } catch (err) {
        console.warn('Backend get website copy failed:', err);
      }
    }
    return this.getWebsiteCopy();
  }

  public updateWebsiteCopy(token: string | null, copy: WebsiteContentCopy): WebsiteContentCopy {
    authService.requireAdmin(token);
    this.cmsData.copy = { ...copy };
    this.saveCmsData();
    this.logAudit(token, 'UPDATE', 'Website Copy CMS', 'site-copy', 'Updated site titles and section headings.');
    return this.cmsData.copy;
  }

  public async updateWebsiteCopyAsync(token: string | null, copy: WebsiteContentCopy): Promise<WebsiteContentCopy> {
    authService.requireAdmin(token);
    if (token) {
      try {
        const res = await fetch('/api/admin/website-content', {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(copy)
        });
        if (res.ok) {
          const saved = await res.json();
          this.cmsData.copy = saved;
          this.saveCmsData();
          return saved;
        }
      } catch (err) {
        console.warn('Backend update website copy failed:', err);
      }
    }
    return this.updateWebsiteCopy(token, copy);
  }

  // --- NAVIGATION STRUCTURE CMS ---
  public getNavigationItems(): NavigationItemCms[] {
    return this.cmsData.nav.sort((a, b) => a.order - b.order);
  }

  public async getNavigationItemsAsync(token: string | null): Promise<NavigationItemCms[]> {
    if (token) {
      try {
        const res = await fetch('/api/admin/navigation', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            this.cmsData.nav = data;
            this.saveCmsData();
            return data.sort((a: any, b: any) => a.order - b.order);
          }
        }
      } catch (err) {
        console.warn('Backend get navigation failed:', err);
      }
    }
    return this.getNavigationItems();
  }

  public updateNavigationItems(token: string | null, items: NavigationItemCms[]): NavigationItemCms[] {
    authService.requireAdmin(token);
    this.cmsData.nav = items;
    this.saveCmsData();
    this.logAudit(token, 'REORDER', 'Navigation CMS', 'nav-order', 'Reordered and updated navigation tab visibility.');
    return this.getNavigationItems();
  }

  public async updateNavigationItemsAsync(token: string | null, items: NavigationItemCms[]): Promise<NavigationItemCms[]> {
    authService.requireAdmin(token);
    if (token) {
      try {
        const res = await fetch('/api/admin/navigation', {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(items)
        });
        if (res.ok) {
          const saved = await res.json();
          this.cmsData.nav = saved;
          this.saveCmsData();
          return saved;
        }
      } catch (err) {
        console.warn('Backend update navigation failed:', err);
      }
    }
    return this.updateNavigationItems(token, items);
  }

  // --- VISUALIZER CATEGORIES CMS ---
  public async getVisualizerCategoriesAsync(token: string | null): Promise<any[]> {
    if (token) {
      try {
        const res = await fetch('/api/admin/visualizer', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) return data;
        }
      } catch (err) {
        console.warn('Backend get visualizer categories failed:', err);
      }
    }
    return [];
  }

  public async updateVisualizerCategoriesAsync(token: string | null, categories: any[]): Promise<any[]> {
    authService.requireAdmin(token);
    if (token) {
      try {
        const res = await fetch('/api/admin/visualizer', {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(categories)
        });
        if (res.ok) {
          return await res.json();
        }
      } catch (err) {
        console.warn('Backend update visualizer categories failed:', err);
      }
    }
    return categories;
  }

  // --- PROBLEMS CMS ---
  public getProblems(): Problem[] {
    return this.cmsData.problems;
  }

  public saveProblem(token: string | null, problem: Problem): Problem {
    authService.requireAdmin(token);
    const existingIdx = this.cmsData.problems.findIndex(p => p.id === problem.id);
    if (existingIdx !== -1) {
      this.cmsData.problems[existingIdx] = problem;
      this.logAudit(token, 'UPDATE', 'Problems CMS', problem.id, `Updated problem "${problem.title}".`);
    } else {
      this.cmsData.problems.unshift(problem);
      this.logAudit(token, 'CREATE', 'Problems CMS', problem.id, `Created new problem "${problem.title}".`);
    }
    this.saveCmsData();
    return problem;
  }

  public deleteProblem(token: string | null, problemId: string): void {
    authService.requireAdmin(token);
    this.cmsData.problems = this.cmsData.problems.filter(p => p.id !== problemId);
    this.saveCmsData();
    this.logAudit(token, 'DELETE', 'Problems CMS', problemId, `Deleted problem ID ${problemId}.`);
  }

  // --- CURRICULUM CMS ---
  public getCurriculum(): RoadmapStage[] {
    return this.cmsData.curriculum;
  }

  public saveCurriculumStage(token: string | null, stage: RoadmapStage): RoadmapStage {
    authService.requireAdmin(token);
    const existingIdx = this.cmsData.curriculum.findIndex(c => c.id === stage.id);
    if (existingIdx !== -1) {
      this.cmsData.curriculum[existingIdx] = stage;
      this.logAudit(token, 'UPDATE', 'Flow of Learning CMS', stage.id, `Updated stage #${stage.stageNumber} "${stage.title}".`);
    } else {
      this.cmsData.curriculum.push(stage);
      this.logAudit(token, 'CREATE', 'Flow of Learning CMS', stage.id, `Created stage #${stage.stageNumber} "${stage.title}".`);
    }
    this.saveCmsData();
    return stage;
  }

  // --- INTERVIEW QUESTIONS CMS ---
  public getInterviewQuestions(): InterviewQuestion[] {
    return this.cmsData.interviews;
  }

  public saveInterviewQuestion(token: string | null, q: InterviewQuestion): InterviewQuestion {
    authService.requireAdmin(token);
    const idx = this.cmsData.interviews.findIndex(item => item.id === q.id);
    if (idx !== -1) {
      this.cmsData.interviews[idx] = q;
      this.logAudit(token, 'UPDATE', 'Interview Questions CMS', q.id, `Updated interview question "${q.question}".`);
    } else {
      this.cmsData.interviews.unshift(q);
      this.logAudit(token, 'CREATE', 'Interview Questions CMS', q.id, `Created interview question "${q.question}".`);
    }
    this.saveCmsData();
    return q;
  }

  public deleteInterviewQuestion(token: string | null, id: string): void {
    authService.requireAdmin(token);
    this.cmsData.interviews = this.cmsData.interviews.filter(q => q.id !== id);
    this.saveCmsData();
    this.logAudit(token, 'DELETE', 'Interview Questions CMS', id, `Deleted interview question ID ${id}.`);
  }

  // --- JOB ROLES CMS ---
  public getJobRoles(): JobRole[] {
    return this.cmsData.jobRoles;
  }

  public saveJobRole(token: string | null, role: JobRole): JobRole {
    authService.requireAdmin(token);
    const idx = this.cmsData.jobRoles.findIndex(r => r.id === role.id);
    if (idx !== -1) {
      this.cmsData.jobRoles[idx] = role;
      this.logAudit(token, 'UPDATE', 'Job Roles CMS', role.id, `Updated job role "${role.title}".`);
    } else {
      this.cmsData.jobRoles.unshift(role);
      this.logAudit(token, 'CREATE', 'Job Roles CMS', role.id, `Created job role "${role.title}".`);
    }
    this.saveCmsData();
    return role;
  }

  // --- MOTIVATION POPUPS CMS ---
  public getMotivations(): MotivationTriggerConfig[] {
    return this.cmsData.motivations;
  }

  public updateMotivation(token: string | null, config: MotivationTriggerConfig): MotivationTriggerConfig {
    authService.requireAdmin(token);
    const idx = this.cmsData.motivations.findIndex(m => m.triggerId === config.triggerId);
    if (idx !== -1) {
      this.cmsData.motivations[idx] = config;
    } else {
      this.cmsData.motivations.push(config);
    }
    this.saveCmsData();
    this.logAudit(token, 'UPDATE', 'Motivation Popups CMS', config.triggerId, `Updated trigger "${config.title}".`);
    return config;
  }

  // --- FEEDBACK MANAGEMENT ---
  public getFeedbacks(): FeedbackItem[] {
    try {
      const raw = localStorage.getItem(FEEDBACK_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [
        {
          id: 'fb-1',
          username: 'alexrivera',
          category: 'feature',
          message: 'Can we add Graph Visualizer with BFS/DFS step traversal?',
          createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
          status: 'resolved'
        },
        {
          id: 'fb-2',
          username: 'pav005',
          category: 'content',
          message: '3000+ Level DP questions have great explanations! Add more test cases for Hard tier.',
          createdAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
          status: 'new'
        }
      ];
    } catch {
      return [];
    }
  }

  public updateFeedbackStatus(token: string | null, feedbackId: string, status: FeedbackItem['status']): void {
    authService.requireAdmin(token);
    const items = this.getFeedbacks();
    const target = items.find(f => f.id === feedbackId);
    if (target) {
      target.status = status;
      try {
        localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(items));
      } catch {
        // Ignore
      }
      this.logAudit(token, 'UPDATE', 'User Feedback CMS', feedbackId, `Updated feedback status to "${status}".`);
    }
  }

  // --- GLOBAL ADMIN SEARCH ---
  public globalAdminSearch(query: string) {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const results: { category: string; id: string; title: string; subtitle: string; linkTab: string }[] = [];

    // Search Problems
    this.cmsData.problems.forEach(p => {
      if (p.title.toLowerCase().includes(q) || p.topic.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)) {
        results.push({ category: 'Problems', id: p.id, title: p.title, subtitle: `Topic: ${p.topic} (${p.difficulty})`, linkTab: 'problems' });
      }
    });

    // Search Curriculum Lessons
    this.cmsData.curriculum.forEach(stage => {
      if (stage.title.toLowerCase().includes(q) || stage.whatToLearn.toLowerCase().includes(q)) {
        results.push({ category: 'Flow of Learning', id: stage.id, title: `Stage ${stage.stageNumber}: ${stage.title}`, subtitle: stage.whatToLearn, linkTab: 'curriculum' });
      }
    });

    // Search Crime Lab Cases
    this.cmsData.crimeLab.forEach(c => {
      if (c.title.toLowerCase().includes(q) || c.category.toLowerCase().includes(q) || c.problemStatement.toLowerCase().includes(q)) {
        results.push({ category: 'Crime Lab', id: c.id, title: c.title, subtitle: `Category: ${c.category} (${c.difficulty})`, linkTab: 'crimelab' });
      }
    });

    // Search Interview Questions
    this.cmsData.interviews.forEach(iq => {
      if (iq.question.toLowerCase().includes(q) || iq.category.toLowerCase().includes(q) || iq.answer.toLowerCase().includes(q)) {
        results.push({ category: 'Interview Questions', id: iq.id, title: iq.question, subtitle: `Category: ${iq.category} (${iq.difficulty})`, linkTab: 'interview_jobs' });
      }
    });

    return results;
  }
}

export const adminCmsService = new AdminCmsService();
