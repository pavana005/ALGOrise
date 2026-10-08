import { authService } from './authService';

export interface SavedUserAnswer {
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

export type CreateAnswerPayload = Omit<SavedUserAnswer, 'id' | 'userId' | 'createdAt' | 'updatedAt'>;

class UserAnswersService {
  private listeners: Set<(answers: SavedUserAnswer[]) => void> = new Set();
  private memoryCache: Record<string, SavedUserAnswer[]> = {};

  private getStorageKey(userId?: string): string {
    const effectiveId = userId || authService.getCurrentUser()?.id || 'guest';
    return `algorise_saved_answers_${effectiveId}`;
  }

  public getCachedAnswers(userId?: string): SavedUserAnswer[] {
    const effectiveId = userId || authService.getCurrentUser()?.id || 'guest';
    if (this.memoryCache[effectiveId]) {
      return this.memoryCache[effectiveId];
    }

    try {
      const raw = localStorage.getItem(this.getStorageKey(userId));
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          this.memoryCache[effectiveId] = parsed;
          return parsed;
        }
      }
    } catch {
      // Ignore
    }

    return [];
  }

  private setCachedAnswers(answers: SavedUserAnswer[], userId?: string): void {
    const effectiveId = userId || authService.getCurrentUser()?.id || 'guest';
    this.memoryCache[effectiveId] = answers;
    try {
      localStorage.setItem(this.getStorageKey(userId), JSON.stringify(answers));
    } catch {
      // Ignore
    }
    this.notify(answers);
  }

  public subscribe(listener: (answers: SavedUserAnswer[]) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(answers: SavedUserAnswer[]): void {
    this.listeners.forEach((listener) => {
      try {
        listener(answers);
      } catch (err) {
        console.error('Error notifying user answers listener:', err);
      }
    });
  }

  public async fetchUserAnswers(tokenOverride?: string): Promise<SavedUserAnswer[]> {
    const token = tokenOverride || authService.getStoredToken();
    const currentUser = authService.getCurrentUser();
    const userId = currentUser?.id;

    if (!token) {
      return this.getCachedAnswers(userId);
    }

    try {
      const res = await fetch('/api/user/answers', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.answers)) {
          this.setCachedAnswers(data.answers, userId);
          return data.answers;
        }
      }
    } catch (e) {
      console.warn('Could not fetch server answers, using cached fallback:', e);
    }

    return this.getCachedAnswers(userId);
  }

  public async saveAnswer(payload: CreateAnswerPayload, tokenOverride?: string): Promise<SavedUserAnswer> {
    const token = tokenOverride || authService.getStoredToken();
    const currentUser = authService.getCurrentUser();
    const userId = currentUser?.id || 'guest';

    // Optimistic local update
    const currentList = [...this.getCachedAnswers(userId)];
    const existingIdx = currentList.findIndex(
      (a) => a.activityType === payload.activityType && a.questionId === payload.questionId
    );

    let savedItem: SavedUserAnswer;

    if (existingIdx >= 0) {
      const existing = currentList[existingIdx];
      savedItem = {
        ...existing,
        ...payload,
        answer: payload.answer.trim(),
        updatedAt: Date.now()
      };
      currentList[existingIdx] = savedItem;
    } else {
      savedItem = {
        ...payload,
        id: `ans_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        userId,
        answer: payload.answer.trim(),
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      currentList.unshift(savedItem);
    }

    this.setCachedAnswers(currentList, userId);

    // Sync to backend if token available
    if (token) {
      try {
        const res = await fetch('/api/user/answers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          const data = await res.json();
          if (data.answer) {
            // Replace with canonical server-generated entity
            const updated = currentList.map((a) => (a.id === savedItem.id ? data.answer : a));
            this.setCachedAnswers(updated, userId);
            return data.answer;
          }
        }
      } catch (err) {
        console.warn('Background sync of user answer failed, retained local copy:', err);
      }
    }

    return savedItem;
  }

  public async updateAnswer(id: string, newAnswerText: string, tokenOverride?: string): Promise<SavedUserAnswer> {
    const token = tokenOverride || authService.getStoredToken();
    const currentUser = authService.getCurrentUser();
    const userId = currentUser?.id || 'guest';

    const currentList = [...this.getCachedAnswers(userId)];
    const existingIdx = currentList.findIndex((a) => a.id === id);

    if (existingIdx === -1) {
      throw new Error('Saved answer not found.');
    }

    const updatedItem: SavedUserAnswer = {
      ...currentList[existingIdx],
      answer: newAnswerText.trim(),
      updatedAt: Date.now()
    };

    currentList[existingIdx] = updatedItem;
    this.setCachedAnswers(currentList, userId);

    if (token) {
      try {
        const res = await fetch(`/api/user/answers/${encodeURIComponent(id)}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ answer: newAnswerText })
        });

        if (res.ok) {
          const data = await res.json();
          if (data.answer) {
            currentList[existingIdx] = data.answer;
            this.setCachedAnswers(currentList, userId);
            return data.answer;
          }
        }
      } catch (err) {
        console.warn('Failed to sync updated answer to server:', err);
      }
    }

    return updatedItem;
  }

  public async deleteAnswer(id: string, tokenOverride?: string): Promise<boolean> {
    const token = tokenOverride || authService.getStoredToken();
    const currentUser = authService.getCurrentUser();
    const userId = currentUser?.id || 'guest';

    const currentList = this.getCachedAnswers(userId).filter((a) => a.id !== id);
    this.setCachedAnswers(currentList, userId);

    if (token) {
      try {
        const res = await fetch(`/api/user/answers/${encodeURIComponent(id)}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        return res.ok;
      } catch (err) {
        console.warn('Failed to delete answer from server:', err);
      }
    }

    return true;
  }
}

export const userAnswersService = new UserAnswersService();
