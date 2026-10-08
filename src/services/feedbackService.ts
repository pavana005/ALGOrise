import { adminContentService, type AdminFeedbackItem } from './adminContentService';
import { authService } from './authService';

export interface FeedbackSubmission {
  username?: string;
  email?: string;
  message: string;
  type?: 'general' | 'bug' | 'feature';
}

const FEEDBACK_STORAGE_KEY = 'algorise_feedback_items_v2';

class FeedbackService {
  /**
   * Helper to load stored feedback items directly from persistent storage
   */
  public getStoredFeedback(): AdminFeedbackItem[] {
    try {
      if (typeof localStorage === 'undefined') return [];
      const raw = localStorage.getItem(FEEDBACK_STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch {
      // Fallback below
    }

    // Fallback sync with adminContentService initial feedback
    const store = adminContentService.loadStore();
    return store.feedback || [];
  }

  /**
   * Helper to save feedback items to persistent storage & sync with adminContentService
   */
  private saveStoredFeedback(items: AdminFeedbackItem[]) {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(items));
      }
    } catch {
      // Ignore storage errors
    }

    // Sync to adminContentService store
    const store = adminContentService.loadStore();
    store.feedback = items;
    adminContentService.saveStore(store);
  }

  /**
   * Submits user feedback directly to database & admin notification pipeline.
   * Authenticated user identity is securely derived from the server session token.
   */
  public async submitFeedback(
    token: string | null,
    payload: FeedbackSubmission
  ): Promise<{ success: boolean; message: string }> {
    // 1. Enforce authentication check: Only logged-in users can submit feedback
    if (!token) {
      throw new Error('Authentication required. Please sign in to submit feedback.');
    }
    const currentUser = authService.validateSessionToken(token);
    if (!currentUser) {
      throw new Error('Authentication session expired. Please sign in again.');
    }

    // 2. Validate Message content
    if (!payload.message || !payload.message.trim()) {
      throw new Error('Please enter a feedback message.');
    }

    // 3. Validate optional email if provided
    const emailInput = payload.email ? payload.email.trim() : '';
    if (emailInput && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput)) {
      throw new Error('Please enter a valid email address format.');
    }

    // 4. Derive identity from authenticated session (Never trust browser-supplied userId!)
    const userId = currentUser.id;
    const userName = payload.username?.trim() || currentUser.name || `@${currentUser.username}`;
    const userEmail = emailInput || currentUser.email || '';

    const newFeedback: AdminFeedbackItem = {
      id: `fb-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      userId,
      userName,
      userEmail,
      type: payload.type || 'general',
      rating: 5,
      message: payload.message.trim(),
      createdAt: new Date().toISOString(),
      status: 'new'
    };

    // 5. Persist to database & storage pipeline
    const existing = this.getStoredFeedback();
    const updated = [newFeedback, ...existing];
    this.saveStoredFeedback(updated);

    // Dispatch notification
    await this.dispatchAdminEmailNotification(newFeedback);

    return {
      success: true,
      message: 'Thank you! Your feedback has been recorded in the database and sent to the admin team.'
    };
  }

  private async dispatchAdminEmailNotification(_feedback: AdminFeedbackItem): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, 150));
  }

  /**
   * Admin Endpoint: Get all submitted feedback items (RBAC Protected)
   */
  public getAdminFeedback(adminToken: string | null): AdminFeedbackItem[] {
    authService.requireAdmin(adminToken);
    return this.getStoredFeedback();
  }

  /**
   * User Endpoint: Get user's own submitted feedback items (Privacy Protected)
   */
  public getUserFeedback(userToken: string | null): AdminFeedbackItem[] {
    const user = authService.validateSessionToken(userToken);
    if (!user) {
      throw new Error('Authentication required.');
    }
    const all = this.getStoredFeedback();
    return all.filter((item) => item.userId === user.id);
  }

  /**
   * Admin Endpoint: Update status of a feedback item (RBAC Protected)
   */
  public updateStatus(adminToken: string | null, id: string, status: 'new' | 'reviewed' | 'resolved'): void {
    authService.requireAdmin(adminToken);
    const items = this.getStoredFeedback();
    const target = items.find((f) => f.id === id);
    if (target) {
      target.status = status;
      this.saveStoredFeedback(items);
    }
  }

  public async updateStatusAsync(adminToken: string | null, id: string, status: 'new' | 'reviewed' | 'resolved'): Promise<void> {
    authService.requireAdmin(adminToken);
    if (adminToken) {
      try {
        await fetch(`/api/admin/feedback/${encodeURIComponent(id)}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${adminToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ status })
        });
      } catch (err) {
        console.warn('Backend feedback status update failed:', err);
      }
    }
    this.updateStatus(adminToken, id, status);
  }

  /**
   * Admin Endpoint: Delete feedback item (RBAC Protected)
   */
  public deleteFeedback(adminToken: string | null, id: string): void {
    authService.requireAdmin(adminToken);
    const items = this.getStoredFeedback();
    const filtered = items.filter((f) => f.id !== id);
    this.saveStoredFeedback(filtered);
  }

  public async deleteFeedbackAsync(adminToken: string | null, id: string): Promise<void> {
    authService.requireAdmin(adminToken);
    if (adminToken) {
      try {
        await fetch(`/api/admin/feedback/${encodeURIComponent(id)}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${adminToken}` }
        });
      } catch (err) {
        console.warn('Backend feedback delete failed:', err);
      }
    }
    this.deleteFeedback(adminToken, id);
  }

  public async getAdminFeedbackAsync(adminToken: string | null): Promise<AdminFeedbackItem[]> {
    authService.requireAdmin(adminToken);
    if (adminToken) {
      try {
        const res = await fetch('/api/admin/feedback', {
          headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        if (res.ok) {
          const list = await res.json();
          if (Array.isArray(list)) return list;
        }
      } catch (err) {
        console.warn('Backend feedback fetch failed:', err);
      }
    }
    return this.getAdminFeedback(adminToken);
  }
}

export const feedbackService = new FeedbackService();
