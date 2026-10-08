import { authService } from './authService';
import { problemsData } from '../data/problemsData';
import { dsaRoadmapStages } from '../data/curriculumData';
import { crimeLabQuestionsData } from '../data/crimeLabData';
import { interviewQuestionsData } from '../data/interviewData';
import { jobRolesData } from '../data/jobRolesData';
import { verifiedResourcesData } from '../data/resourcesData';
import { motivationMessages } from '../data/motivationData';

export interface AdminProblem {
  id: string;
  displayNumber: number;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topic: string;
  pattern: string;
  acceptance: string;
  is3000Level: boolean;
  status: 'published' | 'draft' | 'disabled';
  description: string;
  solutionCode?: string;
  hints?: string[];
  explanation?: string;
}

export interface AdminCurriculumTopic {
  id: string;
  title: string;
  description: string;
  lessonsCount: number;
  difficulty: string;
  estimatedHours: number;
  status: 'active' | 'draft';
}

export interface AdminCrimeLabCase {
  id: string;
  title: string;
  crimeType: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'active' | 'archived';
  description: string;
}

export interface AdminInterviewQuestion {
  id: string;
  company: string;
  role: string;
  question: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topic: string;
  status: 'active' | 'archived';
}

export interface AdminJobRole {
  id: string;
  title: string;
  category: string;
  salaryRange: string;
  demandLevel: 'High' | 'Very High' | 'Moderate';
  description: string;
  status: 'active' | 'draft';
}

export interface AdminResource {
  id: string;
  title: string;
  category: string;
  type: string;
  link: string;
  status: 'active' | 'archived';
}

export interface AdminNote {
  id: string;
  title: string;
  topic: string;
  author: string;
  updatedAt: string;
  status: 'published' | 'draft';
}

export interface AdminFeedbackItem {
  id: string;
  userId?: string;
  userName: string;
  userEmail: string;
  type: 'bug' | 'feature' | 'general';
  rating: number;
  message: string;
  createdAt: string;
  status: 'new' | 'reviewed' | 'resolved';
}

export interface AdminWebsiteSettings {
  siteTitle: string;
  tagline: string;
  maintenanceMode: boolean;
  allowRegistrations: boolean;
  enableMotivationPopups: boolean;
  defaultEditorFont: string;
  maxDailyGoalLimit: number;
}

const STORAGE_KEY = 'algorise_admin_content_store_v1';

class AdminContentService {
  public loadStore() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initialStore = this.createInitialStore();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialStore));
      return initialStore;
    }
    try {
      return JSON.parse(raw);
    } catch {
      const initialStore = this.createInitialStore();
      return initialStore;
    }
  }

  public saveStore(store: any) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  }

  private createInitialStore() {
    const problems: AdminProblem[] = (problemsData || []).slice(0, 50).map((p: any, idx: number) => ({
      id: p.id || `prob-${idx + 1}`,
      displayNumber: p.problemNumber || idx + 1,
      title: p.title || 'Untitled Problem',
      difficulty: p.difficulty || 'Easy',
      topic: p.topic || 'Arrays & Hashing',
      pattern: p.pattern || 'Two Pointers',
      acceptance: p.acceptanceRate || '65.4%',
      is3000Level: idx % 4 === 0,
      status: 'published',
      description: p.description || 'Problem statement details.',
      solutionCode: p.codeTemplates?.python || 'def solve(): pass'
    }));

    const curriculum: AdminCurriculumTopic[] = (dsaRoadmapStages || []).map((c: any, idx: number) => ({
      id: c.id || `curr-${idx + 1}`,
      title: c.title || 'DSA Topic',
      description: c.whatToLearn || 'Topic introduction',
      lessonsCount: c.keyTopics?.length || 6,
      difficulty: idx > 6 ? 'Advanced' : idx > 3 ? 'Intermediate' : 'Beginner',
      estimatedHours: 4 + idx,
      status: 'active'
    }));

    const crimeLab: AdminCrimeLabCase[] = (crimeLabQuestionsData || []).slice(0, 20).map((caseItem: any, idx: number) => ({
      id: caseItem.id || `case-${idx + 1}`,
      title: caseItem.title || 'Forensic Bug Case',
      crimeType: caseItem.topic || 'Memory Leak',
      severity: idx % 3 === 0 ? 'Critical' : 'High',
      status: 'active',
      description: caseItem.problemExplanation || 'Vulnerability investigation scenario'
    }));

    const interviewQuestions: AdminInterviewQuestion[] = (interviewQuestionsData || []).map((iq: any, idx: number) => ({
      id: iq.id || `iq-${idx + 1}`,
      company: iq.company || 'Meta / Google / Amazon',
      role: iq.targetRole || 'Software Developer',
      question: iq.question || iq.title || 'Interview question topic',
      difficulty: iq.level === 'Advanced' ? 'Hard' : iq.level === 'Intermediate' ? 'Medium' : 'Easy',
      topic: iq.category || iq.round || 'Technical',
      status: 'active'
    }));

    const jobRoles: AdminJobRole[] = (jobRolesData || []).map((jr: any, idx: number) => ({
      id: jr.id || `jr-${idx + 1}`,
      title: jr.title || 'Frontend Architect',
      category: jr.category || 'Engineering',
      salaryRange: jr.salaryUsd || '$140k - $210k',
      demandLevel: jr.marketDemand === 'High' ? 'High' : 'Very High',
      description: jr.summary || 'Role responsibilities and DSA requirements',
      status: 'active'
    }));

    const resources: AdminResource[] = (verifiedResourcesData || []).slice(0, 20).map((r: any, idx: number) => ({
      id: r.id || `res-${idx + 1}`,
      title: r.title || 'Introduction to Algorithms (CLRS)',
      category: r.category || 'Books',
      type: r.badge || 'PDF Guide',
      link: r.url || 'https://algorise.io/resources',
      status: 'active'
    }));

    const notes: AdminNote[] = [
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

    const feedback: AdminFeedbackItem[] = [
      {
        id: 'fb-1',
        userName: 'Elena Rostova',
        userEmail: 'elena@dev.org',
        type: 'feature',
        rating: 5,
        message: 'The visualizer step-by-step trace mode is incredible for interview prep!',
        createdAt: '2026-09-19T14:20:00Z',
        status: 'reviewed'
      },
      {
        id: 'fb-2',
        userName: 'Marcus Vance',
        userEmail: 'marcus@code.io',
        type: 'bug',
        rating: 4,
        message: 'Found minor typo in Binary Search monospaced space complexity breakdown.',
        createdAt: '2026-09-20T09:15:00Z',
        status: 'new'
      }
    ];

    const popups = (motivationMessages || []).slice(0, 15).map((p: any, idx: number) => ({
      id: p.id || `popup-${idx + 1}`,
      category: p.category || 'debugging',
      text: p.message || 'Keep coding!',
      status: 'active'
    }));

    const settings: AdminWebsiteSettings = {
      siteTitle: 'ALGOrise - Data Structures & Algorithms',
      tagline: 'Master DSA & System Design for Tech Careers',
      maintenanceMode: false,
      allowRegistrations: true,
      enableMotivationPopups: true,
      defaultEditorFont: '14px',
      maxDailyGoalLimit: 20
    };

    return {
      problems,
      curriculum,
      crimeLab,
      interviewQuestions,
      jobRoles,
      resources,
      notes,
      feedback,
      popups,
      settings
    };
  }

  // --- DASHBOARD METRICS ---
  getDashboardStats(adminToken: string | null) {
    authService.requireAdmin(adminToken);
    const store = this.loadStore();
    const users = authService.getAllUsers(adminToken);

    const totalProblems = store.problems.length;
    const questions3000 = store.problems.filter((p: AdminProblem) => p.is3000Level).length;

    return {
      totalUsers: users.length,
      activeUsers: users.filter((u) => u.status === 'active').length,
      activeAdmins: users.filter((u) => u.role === 'admin').length,
      totalProblems,
      questions3000,
      totalInterviewQuestions: store.interviewQuestions.length,
      totalJobRoles: store.jobRoles.length,
      activeResources: (store.resources || []).filter((r: AdminResource) => r.status === 'active').length,
      pendingFeedback: store.feedback.filter((f: AdminFeedbackItem) => f.status === 'new').length,
      totalFeedback: store.feedback.length,
      newFeedback: store.feedback.filter((f: AdminFeedbackItem) => f.status === 'new').length,
      totalPopups: store.popups.length,
      crimeLabCases: store.crimeLab.length,
      curriculumTopics: store.curriculum.length,
      systemStatus: store.settings.maintenanceMode ? 'Maintenance Mode' : 'Operational (Healthy)'
    };
  }

  async getDashboardStatsAsync(adminToken: string | null) {
    if (adminToken) {
      try {
        const res = await fetch('/api/admin/stats', {
          headers: {
            'Authorization': `Bearer ${adminToken}`,
            'Content-Type': 'application/json'
          }
        });
        if (res.ok) {
          const data = await res.json();
          return {
            totalUsers: data.totalUsers ?? 0,
            activeUsers: data.activeUsers ?? 0,
            activeAdmins: data.activeAdmins ?? 1,
            totalProblems: data.totalProblems ?? 0,
            questions3000: data.questions3000 ?? 0,
            totalInterviewQuestions: data.totalInterviews ?? data.totalInterviewQuestions ?? 0,
            totalJobRoles: data.totalJobRoles ?? 12,
            activeResources: data.activeResources ?? 18,
            pendingFeedback: data.newFeedback ?? 0,
            totalFeedback: data.totalFeedback ?? 0,
            newFeedback: data.newFeedback ?? 0,
            totalPopups: data.totalPopups ?? data.totalPopupMessages ?? 0,
            crimeLabCases: data.totalCrimeLabCases ?? 100,
            curriculumTopics: data.totalLessons ?? 12,
            systemStatus: data.systemStatus ?? 'Operational (Healthy)'
          };
        }
      } catch (err) {
        console.warn('Backend /api/admin/stats failed, using fallback:', err);
      }
    }
    return this.getDashboardStats(adminToken);
  }

  // --- PROBLEMS & 3000+ LEVEL QUESTIONS CRUD ---
  getProblems(adminToken: string | null): AdminProblem[] {
    authService.requireAdmin(adminToken);
    return this.loadStore().problems;
  }

  saveProblem(adminToken: string | null, problem: Partial<AdminProblem>): AdminProblem {
    authService.requireAdmin(adminToken);
    const store = this.loadStore();

    if (problem.id) {
      const idx = store.problems.findIndex((p: AdminProblem) => p.id === problem.id);
      if (idx !== -1) {
        store.problems[idx] = { ...store.problems[idx], ...problem };
        this.saveStore(store);
        return store.problems[idx];
      }
    }

    const newProblem: AdminProblem = {
      id: `prob-${Date.now()}`,
      displayNumber: store.problems.length + 1,
      title: problem.title || 'New Algorithm Problem',
      difficulty: problem.difficulty || 'Easy',
      topic: problem.topic || 'Arrays & Hashing',
      pattern: problem.pattern || 'Two Pointers',
      acceptance: problem.acceptance || '70.0%',
      is3000Level: !!problem.is3000Level,
      status: problem.status || 'published',
      description: problem.description || 'Problem statement and constraints.',
      solutionCode: problem.solutionCode || 'def solve(): pass'
    };

    store.problems.unshift(newProblem);
    this.saveStore(store);
    return newProblem;
  }

  deleteProblem(adminToken: string | null, id: string): void {
    authService.requireAdmin(adminToken);
    const store = this.loadStore();
    store.problems = store.problems.filter((p: AdminProblem) => p.id !== id);
    this.saveStore(store);
  }

  async getProblemsAsync(adminToken: string | null): Promise<AdminProblem[]> {
    authService.requireAdmin(adminToken);
    if (adminToken) {
      try {
        const res = await fetch('/api/admin/problems', {
          headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        if (res.ok) {
          const list = await res.json();
          if (Array.isArray(list) && list.length > 0) {
            return list;
          }
        }
      } catch (err) {
        console.warn('Backend /api/admin/problems failed, using fallback:', err);
      }
    }
    return this.getProblems(adminToken);
  }

  async saveProblemAsync(adminToken: string | null, problem: Partial<AdminProblem>): Promise<AdminProblem> {
    authService.requireAdmin(adminToken);
    let serverSaved: AdminProblem | null = null;
    if (adminToken) {
      try {
        const res = await fetch('/api/admin/problems', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${adminToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(problem)
        });
        if (res.ok) {
          serverSaved = await res.json();
        }
      } catch (err) {
        console.warn('Backend save problem failed, updating local store:', err);
      }
    }
    const localSaved = this.saveProblem(adminToken, problem);
    return serverSaved || localSaved;
  }

  async deleteProblemAsync(adminToken: string | null, id: string): Promise<void> {
    authService.requireAdmin(adminToken);
    if (adminToken) {
      try {
        await fetch(`/api/admin/problems/${encodeURIComponent(id)}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${adminToken}` }
        });
      } catch (err) {
        console.warn('Backend delete problem failed:', err);
      }
    }
    this.deleteProblem(adminToken, id);
  }

  async getPopupsAsync(adminToken: string | null): Promise<any[]> {
    authService.requireAdmin(adminToken);
    if (adminToken) {
      try {
        const res = await fetch('/api/admin/popups', {
          headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        if (res.ok) {
          return await res.json();
        }
      } catch (err) {
        console.warn('Backend /api/admin/popups failed, using fallback:', err);
      }
    }
    return this.loadStore().popups || [];
  }

  async savePopupAsync(adminToken: string | null, popup: any): Promise<any> {
    authService.requireAdmin(adminToken);
    if (adminToken) {
      try {
        const res = await fetch('/api/admin/popups', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${adminToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(popup)
        });
        if (res.ok) {
          return await res.json();
        }
      } catch (err) {
        console.warn('Backend save popup failed:', err);
      }
    }
    const store = this.loadStore();
    const idx = store.popups.findIndex((p: any) => p.id === popup.id);
    if (idx !== -1) {
      store.popups[idx] = { ...store.popups[idx], ...popup };
    } else {
      store.popups.unshift({ ...popup, id: popup.id || `popup-${Date.now()}` });
    }
    this.saveStore(store);
    return popup;
  }

  async deletePopupAsync(adminToken: string | null, id: string): Promise<void> {
    authService.requireAdmin(adminToken);
    if (adminToken) {
      try {
        await fetch(`/api/admin/popups/${encodeURIComponent(id)}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${adminToken}` }
        });
      } catch (err) {
        console.warn('Backend delete popup failed:', err);
      }
    }
    const store = this.loadStore();
    store.popups = store.popups.filter((p: any) => p.id !== id);
    this.saveStore(store);
  }

  async getAuditLogsAsync(adminToken: string | null): Promise<any[]> {
    authService.requireAdmin(adminToken);
    if (adminToken) {
      try {
        const res = await fetch('/api/admin/audit-logs', {
          headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        if (res.ok) {
          return await res.json();
        }
      } catch (err) {
        console.warn('Backend audit logs failed:', err);
      }
    }
    return [];
  }

  // --- CURRICULUM CRUD ---
  getCurriculum(adminToken: string | null): AdminCurriculumTopic[] {
    authService.requireAdmin(adminToken);
    return this.loadStore().curriculum;
  }

  saveCurriculumTopic(adminToken: string | null, topic: Partial<AdminCurriculumTopic>): AdminCurriculumTopic {
    authService.requireAdmin(adminToken);
    const store = this.loadStore();

    if (topic.id) {
      const idx = store.curriculum.findIndex((c: AdminCurriculumTopic) => c.id === topic.id);
      if (idx !== -1) {
        store.curriculum[idx] = { ...store.curriculum[idx], ...topic };
        this.saveStore(store);
        return store.curriculum[idx];
      }
    }

    const newTopic: AdminCurriculumTopic = {
      id: `curr-${Date.now()}`,
      title: topic.title || 'New DSA Module',
      description: topic.description || 'Module overview and concepts',
      lessonsCount: topic.lessonsCount || 6,
      difficulty: topic.difficulty || 'Intermediate',
      estimatedHours: topic.estimatedHours || 4,
      status: 'active'
    };

    store.curriculum.push(newTopic);
    this.saveStore(store);
    return newTopic;
  }

  deleteCurriculumTopic(adminToken: string | null, id: string): void {
    authService.requireAdmin(adminToken);
    const store = this.loadStore();
    store.curriculum = store.curriculum.filter((c: AdminCurriculumTopic) => c.id !== id);
    this.saveStore(store);
  }

  async getCurriculumAsync(adminToken: string | null): Promise<AdminCurriculumTopic[]> {
    authService.requireAdmin(adminToken);
    if (adminToken) {
      try {
        const res = await fetch('/api/admin/curriculum', {
          headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        if (res.ok) {
          const list = await res.json();
          if (Array.isArray(list) && list.length > 0) return list;
        }
      } catch (err) {
        console.warn('Backend curriculum failed:', err);
      }
    }
    return this.getCurriculum(adminToken);
  }

  async saveCurriculumTopicAsync(adminToken: string | null, topic: Partial<AdminCurriculumTopic>): Promise<AdminCurriculumTopic> {
    authService.requireAdmin(adminToken);
    if (adminToken) {
      try {
        const res = await fetch('/api/admin/curriculum', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${adminToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(topic)
        });
        if (res.ok) {
          return await res.json();
        }
      } catch (err) {
        console.warn('Backend save curriculum failed:', err);
      }
    }
    return this.saveCurriculumTopic(adminToken, topic);
  }

  async deleteCurriculumTopicAsync(adminToken: string | null, id: string): Promise<void> {
    authService.requireAdmin(adminToken);
    if (adminToken) {
      try {
        await fetch(`/api/admin/curriculum/${encodeURIComponent(id)}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${adminToken}` }
        });
      } catch (err) {
        console.warn('Backend delete curriculum failed:', err);
      }
    }
    this.deleteCurriculumTopic(adminToken, id);
  }

  // --- CRIME LAB CRUD ASYNC ---
  async getCrimeLabAsync(adminToken: string | null): Promise<any[]> {
    authService.requireAdmin(adminToken);
    if (adminToken) {
      try {
        const res = await fetch('/api/admin/crimelab', {
          headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        if (res.ok) {
          return await res.json();
        }
      } catch (err) {
        console.warn('Backend crimelab failed:', err);
      }
    }
    return this.loadStore().crimeLab || [];
  }

  async saveCrimeLabCaseAsync(adminToken: string | null, caseData: any): Promise<any> {
    authService.requireAdmin(adminToken);
    if (adminToken) {
      try {
        const res = await fetch('/api/admin/crimelab', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${adminToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(caseData)
        });
        if (res.ok) {
          return await res.json();
        }
      } catch (err) {
        console.warn('Backend save crimelab failed:', err);
      }
    }
    return caseData;
  }

  async deleteCrimeLabCaseAsync(adminToken: string | null, id: string): Promise<void> {
    authService.requireAdmin(adminToken);
    if (adminToken) {
      try {
        await fetch(`/api/admin/crimelab/${encodeURIComponent(id)}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${adminToken}` }
        });
      } catch (err) {
        console.warn('Backend delete crimelab failed:', err);
      }
    }
  }

  // --- INTERVIEW & JOB ROLES CRUD ASYNC ---
  async getInterviewsAsync(adminToken: string | null): Promise<any[]> {
    authService.requireAdmin(adminToken);
    if (adminToken) {
      try {
        const res = await fetch('/api/admin/interviews', {
          headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        if (res.ok) {
          return await res.json();
        }
      } catch (err) {
        console.warn('Backend interviews failed:', err);
      }
    }
    return this.loadStore().interviewQuestions || [];
  }

  async saveInterviewAsync(adminToken: string | null, qData: any): Promise<any> {
    authService.requireAdmin(adminToken);
    if (adminToken) {
      try {
        const res = await fetch('/api/admin/interviews', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${adminToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(qData)
        });
        if (res.ok) {
          return await res.json();
        }
      } catch (err) {
        console.warn('Backend save interview failed:', err);
      }
    }
    return qData;
  }

  async deleteInterviewAsync(adminToken: string | null, id: string): Promise<void> {
    authService.requireAdmin(adminToken);
    if (adminToken) {
      try {
        await fetch(`/api/admin/interviews/${encodeURIComponent(id)}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${adminToken}` }
        });
      } catch (err) {
        console.warn('Backend delete interview failed:', err);
      }
    }
  }

  async getJobRolesAsync(adminToken: string | null): Promise<any[]> {
    authService.requireAdmin(adminToken);
    if (adminToken) {
      try {
        const res = await fetch('/api/admin/jobroles', {
          headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        if (res.ok) {
          return await res.json();
        }
      } catch (err) {
        console.warn('Backend job roles failed:', err);
      }
    }
    return this.loadStore().jobRoles || [];
  }

  async saveJobRoleAsync(adminToken: string | null, roleData: any): Promise<any> {
    authService.requireAdmin(adminToken);
    if (adminToken) {
      try {
        const res = await fetch('/api/admin/jobroles', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${adminToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(roleData)
        });
        if (res.ok) {
          return await res.json();
        }
      } catch (err) {
        console.warn('Backend save job role failed:', err);
      }
    }
    return roleData;
  }

  async deleteJobRoleAsync(adminToken: string | null, id: string): Promise<void> {
    authService.requireAdmin(adminToken);
    if (adminToken) {
      try {
        await fetch(`/api/admin/jobroles/${encodeURIComponent(id)}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${adminToken}` }
        });
      } catch (err) {
        console.warn('Backend delete job role failed:', err);
      }
    }
  }

  // --- RESOURCES CRUD ---
  getResources(adminToken: string | null): AdminResource[] {
    authService.requireAdmin(adminToken);
    return this.loadStore().resources;
  }

  saveResource(adminToken: string | null, resource: Partial<AdminResource>): AdminResource {
    authService.requireAdmin(adminToken);
    const store = this.loadStore();

    if (resource.id) {
      const idx = store.resources.findIndex((r: AdminResource) => r.id === resource.id);
      if (idx !== -1) {
        store.resources[idx] = { ...store.resources[idx], ...resource };
        this.saveStore(store);
        return store.resources[idx];
      }
    }

    const newRes: AdminResource = {
      id: `res-${Date.now()}`,
      title: resource.title || 'New Study Resource',
      category: resource.category || 'Guides',
      type: resource.type || 'Documentation',
      link: resource.link || 'https://algorise.io',
      status: 'active'
    };

    store.resources.push(newRes);
    this.saveStore(store);
    return newRes;
  }

  deleteResource(adminToken: string | null, id: string): void {
    authService.requireAdmin(adminToken);
    const store = this.loadStore();
    store.resources = store.resources.filter((r: AdminResource) => r.id !== id);
    this.saveStore(store);
  }

  async getResourcesAsync(adminToken: string | null): Promise<AdminResource[]> {
    authService.requireAdmin(adminToken);
    if (adminToken) {
      try {
        const res = await fetch('/api/admin/resources', {
          headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        if (res.ok) {
          const list = await res.json();
          if (Array.isArray(list) && list.length > 0) return list;
        }
      } catch (err) {
        console.warn('Backend resources failed:', err);
      }
    }
    return this.getResources(adminToken);
  }

  async saveResourceAsync(adminToken: string | null, resource: Partial<AdminResource>): Promise<AdminResource> {
    authService.requireAdmin(adminToken);
    if (adminToken) {
      try {
        const res = await fetch('/api/admin/resources', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${adminToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(resource)
        });
        if (res.ok) {
          return await res.json();
        }
      } catch (err) {
        console.warn('Backend save resource failed:', err);
      }
    }
    return this.saveResource(adminToken, resource);
  }

  async deleteResourceAsync(adminToken: string | null, id: string): Promise<void> {
    authService.requireAdmin(adminToken);
    if (adminToken) {
      try {
        await fetch(`/api/admin/resources/${encodeURIComponent(id)}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${adminToken}` }
        });
      } catch (err) {
        console.warn('Backend delete resource failed:', err);
      }
    }
    this.deleteResource(adminToken, id);
  }

  // --- NOTES CRUD ASYNC ---
  getNotes(adminToken: string | null): AdminNote[] {
    authService.requireAdmin(adminToken);
    return this.loadStore().notes || [];
  }

  saveNote(adminToken: string | null, note: Partial<AdminNote>): AdminNote {
    authService.requireAdmin(adminToken);
    const store = this.loadStore();
    if (!store.notes) store.notes = [];

    if (note.id) {
      const idx = store.notes.findIndex((n: AdminNote) => n.id === note.id);
      if (idx !== -1) {
        store.notes[idx] = { ...store.notes[idx], ...note, updatedAt: new Date().toISOString().split('T')[0] };
        this.saveStore(store);
        return store.notes[idx];
      }
    }

    const newNote: AdminNote = {
      id: `note-${Date.now()}`,
      title: note.title || 'New Study Note',
      topic: note.topic || 'Algorithms',
      author: note.author || 'ALGOrise Staff',
      updatedAt: new Date().toISOString().split('T')[0],
      status: note.status || 'published'
    };

    store.notes.unshift(newNote);
    this.saveStore(store);
    return newNote;
  }

  deleteNote(adminToken: string | null, id: string): void {
    authService.requireAdmin(adminToken);
    const store = this.loadStore();
    if (store.notes) {
      store.notes = store.notes.filter((n: AdminNote) => n.id !== id);
      this.saveStore(store);
    }
  }

  async getNotesAsync(adminToken: string | null): Promise<AdminNote[]> {
    authService.requireAdmin(adminToken);
    if (adminToken) {
      try {
        const res = await fetch('/api/admin/notes', {
          headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        if (res.ok) {
          const list = await res.json();
          if (Array.isArray(list) && list.length > 0) return list;
        }
      } catch (err) {
        console.warn('Backend notes failed:', err);
      }
    }
    return this.getNotes(adminToken);
  }

  async saveNoteAsync(adminToken: string | null, note: Partial<AdminNote>): Promise<AdminNote> {
    authService.requireAdmin(adminToken);
    if (adminToken) {
      try {
        const res = await fetch('/api/admin/notes', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${adminToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(note)
        });
        if (res.ok) {
          return await res.json();
        }
      } catch (err) {
        console.warn('Backend save note failed:', err);
      }
    }
    return this.saveNote(adminToken, note);
  }

  async deleteNoteAsync(adminToken: string | null, id: string): Promise<void> {
    authService.requireAdmin(adminToken);
    if (adminToken) {
      try {
        await fetch(`/api/admin/notes/${encodeURIComponent(id)}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${adminToken}` }
        });
      } catch (err) {
        console.warn('Backend delete note failed:', err);
      }
    }
    this.deleteNote(adminToken, id);
  }

  // --- FEEDBACK & SETTINGS ---
  getFeedback(adminToken: string | null): AdminFeedbackItem[] {
    authService.requireAdmin(adminToken);
    return this.loadStore().feedback;
  }

  updateFeedbackStatus(adminToken: string | null, id: string, status: 'new' | 'reviewed' | 'resolved'): void {
    authService.requireAdmin(adminToken);
    const store = this.loadStore();
    const item = store.feedback.find((f: AdminFeedbackItem) => f.id === id);
    if (item) {
      item.status = status;
      this.saveStore(store);
    }
  }

  getSettings(adminToken: string | null): AdminWebsiteSettings {
    authService.requireAdmin(adminToken);
    return this.loadStore().settings;
  }

  async getSettingsAsync(adminToken: string | null): Promise<AdminWebsiteSettings> {
    authService.requireAdmin(adminToken);
    if (adminToken) {
      try {
        const res = await fetch('/api/admin/settings', {
          headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        if (res.ok) {
          const settings = await res.json();
          if (settings && settings.siteTitle) {
            const store = this.loadStore();
            store.settings = settings;
            this.saveStore(store);
            return settings;
          }
        }
      } catch (err) {
        console.warn('Backend get settings failed:', err);
      }
    }
    return this.getSettings(adminToken);
  }

  updateSettings(adminToken: string | null, settings: Partial<AdminWebsiteSettings>): AdminWebsiteSettings {
    authService.requireAdmin(adminToken);
    const store = this.loadStore();
    store.settings = { ...store.settings, ...settings };
    this.saveStore(store);
    return store.settings;
  }

  async updateSettingsAsync(adminToken: string | null, settings: Partial<AdminWebsiteSettings>): Promise<AdminWebsiteSettings> {
    authService.requireAdmin(adminToken);
    if (adminToken) {
      try {
        const res = await fetch('/api/admin/settings', {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${adminToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(settings)
        });
        if (res.ok) {
          const updated = await res.json();
          const store = this.loadStore();
          store.settings = updated;
          this.saveStore(store);
          return updated;
        }
      } catch (err) {
        console.warn('Backend update settings failed:', err);
      }
    }
    return this.updateSettings(adminToken, settings);
  }

  // --- PUBLIC UNPROTECTED GETTERS FOR REAL-TIME USER-FACING SYNCHRONIZATION ---
  public getPublicStore() {
    return this.loadStore();
  }

  public getPublicProblemOverride(problemId: string) {
    const store = this.loadStore();
    if (store.problemOverrides?.[problemId]) {
      return store.problemOverrides[problemId];
    }
    // Match base ID or problem number if exact ID not found
    const baseId = problemId.replace(/-lvl[123]$/, '');
    if (store.problemOverrides?.[baseId]) {
      return store.problemOverrides[baseId];
    }
    const foundProb = store.problems?.find((p: AdminProblem) => p.id === problemId || p.id === baseId || problemId.startsWith(p.id));
    if (foundProb) {
      return {
        title: foundProb.title,
        description: foundProb.description,
        difficulty: foundProb.difficulty,
        topic: foundProb.topic,
        pattern: foundProb.pattern,
        codeTemplates: foundProb.solutionCode ? { python: foundProb.solutionCode, javascript: foundProb.solutionCode } : undefined
      };
    }
    return null;
  }

  public saveProblemDetailOverride(adminToken: string | null, problemId: string, overrideData: any) {
    authService.requireAdmin(adminToken);
    const store = this.loadStore();
    if (!store.problemOverrides) {
      store.problemOverrides = {};
    }

    const baseId = problemId.replace(/-lvl[123]$/, '');
    const keysToUpdate = Array.from(new Set([problemId, baseId, `${baseId}-lvl1`, `${baseId}-lvl2`, `${baseId}-lvl3`]));

    keysToUpdate.forEach(k => {
      store.problemOverrides[k] = {
        ...(store.problemOverrides[k] || {}),
        ...overrideData,
        updatedAt: new Date().toISOString()
      };
    });

    // Also update main problems list item if matched
    const probIdx = store.problems.findIndex((p: AdminProblem) => p.id === problemId || p.id === baseId);
    if (probIdx !== -1) {
      if (overrideData.title) store.problems[probIdx].title = overrideData.title;
      if (overrideData.description) store.problems[probIdx].description = overrideData.description;
      if (overrideData.difficulty) store.problems[probIdx].difficulty = overrideData.difficulty;
    }

    this.saveStore(store);
    return store.problemOverrides[problemId];
  }
}

export const adminContentService = new AdminContentService();
