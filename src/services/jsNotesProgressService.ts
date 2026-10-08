export type TopicStatus = 'not_started' | 'in_progress' | 'completed';

export interface ProgressSummary {
  completedCount: number;
  inProgressCount: number;
  totalCount: number;
  percentage: number;
}

const STORAGE_PROGRESS_PREFIX = 'algorise_js_notes_progress_v1_';
const STORAGE_LAST_TOPIC_PREFIX = 'algorise_js_notes_last_topic_v1_';

class JSNotesProgressService {
  private getKey(userId: string, prefix: string): string {
    const safeUser = userId || 'guest';
    return `${prefix}${safeUser}`;
  }

  getUserProgress(userId: string): Record<string, TopicStatus> {
    try {
      const raw = localStorage.getItem(this.getKey(userId, STORAGE_PROGRESS_PREFIX));
      if (!raw) return {};
      return JSON.parse(raw);
    } catch {
      return {};
    }
  }

  getTopicStatus(userId: string, topicId: string): TopicStatus {
    const progress = this.getUserProgress(userId);
    return progress[topicId] || 'not_started';
  }

  setTopicStatus(userId: string, topicId: string, status: TopicStatus): Record<string, TopicStatus> {
    const progress = this.getUserProgress(userId);
    progress[topicId] = status;
    try {
      localStorage.setItem(this.getKey(userId, STORAGE_PROGRESS_PREFIX), JSON.stringify(progress));
    } catch (e) {
      console.error('Failed to save JavaScript notes progress', e);
    }
    return progress;
  }

  toggleTopicCompleted(userId: string, topicId: string): { newStatus: TopicStatus; progress: Record<string, TopicStatus> } {
    const current = this.getTopicStatus(userId, topicId);
    const newStatus: TopicStatus = current === 'completed' ? 'in_progress' : 'completed';
    const progress = this.setTopicStatus(userId, topicId, newStatus);
    return { newStatus, progress };
  }

  getLastOpenedTopic(userId: string): string | null {
    try {
      return localStorage.getItem(this.getKey(userId, STORAGE_LAST_TOPIC_PREFIX));
    } catch {
      return null;
    }
  }

  setLastOpenedTopic(userId: string, topicId: string): void {
    try {
      localStorage.setItem(this.getKey(userId, STORAGE_LAST_TOPIC_PREFIX), topicId);
    } catch (e) {
      console.error('Failed to save last opened JavaScript topic', e);
    }
  }

  getProgressStats(userId: string, totalTopicIds: string[]): ProgressSummary {
    const progress = this.getUserProgress(userId);
    let completedCount = 0;
    let inProgressCount = 0;

    totalTopicIds.forEach((id) => {
      const status = progress[id];
      if (status === 'completed') {
        completedCount++;
      } else if (status === 'in_progress') {
        inProgressCount++;
      }
    });

    const totalCount = totalTopicIds.length || 1;
    const percentage = Math.round((completedCount / totalCount) * 100);

    return {
      completedCount,
      inProgressCount,
      totalCount: totalTopicIds.length,
      percentage
    };
  }
}

export const jsNotesProgressService = new JSNotesProgressService();
