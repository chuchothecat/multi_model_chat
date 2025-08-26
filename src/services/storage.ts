import { ConversationSession, Message } from '../types';

const SESSIONS_KEY = 'multi-llm-sessions';
const CURRENT_SESSION_KEY = 'current-session-id';

export class StorageService {
  static getAllSessions(): ConversationSession[] {
    const sessionsJson = localStorage.getItem(SESSIONS_KEY);
    if (!sessionsJson) return [];
    
    const sessions = JSON.parse(sessionsJson);
    return sessions.map((session: any) => ({
      ...session,
      createdAt: new Date(session.createdAt),
      updatedAt: new Date(session.updatedAt),
      messages: session.messages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }))
    }));
  }

  static getSession(id: string): ConversationSession | null {
    const sessions = this.getAllSessions();
    return sessions.find(session => session.id === id) || null;
  }

  static saveSession(session: ConversationSession): void {
    const sessions = this.getAllSessions();
    const existingIndex = sessions.findIndex(s => s.id === session.id);
    
    if (existingIndex >= 0) {
      sessions[existingIndex] = session;
    } else {
      sessions.push(session);
    }
    
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  }

  static deleteSession(id: string): void {
    const sessions = this.getAllSessions();
    const filtered = sessions.filter(session => session.id !== id);
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(filtered));
  }

  static getCurrentSessionId(): string | null {
    return localStorage.getItem(CURRENT_SESSION_KEY);
  }

  static setCurrentSessionId(id: string): void {
    localStorage.setItem(CURRENT_SESSION_KEY, id);
  }

  static clearCurrentSessionId(): void {
    localStorage.removeItem(CURRENT_SESSION_KEY);
  }
}