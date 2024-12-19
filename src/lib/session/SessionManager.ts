import { Session } from '@supabase/supabase-js';
import { supabase } from '../supabaseClient';

export class SessionManager {
  private static instance: SessionManager;
  private session: Session | null = null;
  private refreshTimer: NodeJS.Timeout | null = null;
  private listeners: Set<(session: Session | null) => void> = new Set();

  private constructor() {
    this.initialize();
  }

  static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager();
    }
    return SessionManager.instance;
  }

  private async initialize() {
    // Get initial session
    const { data: { session } } = await supabase.auth.getSession();
    this.setSession(session);

    // Listen for auth changes
    supabase.auth.onAuthStateChange((_event, session) => {
      this.setSession(session);
    });
  }

  private setSession(session: Session | null) {
    this.session = session;
    this.setupRefreshTimer();
    this.notifyListeners();
  }

  private setupRefreshTimer() {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
    }

    if (this.session) {
      const expiresIn = new Date(this.session.expires_at!).getTime() - Date.now();
      const refreshBuffer = 60000; // 1 minute before expiry

      this.refreshTimer = setTimeout(
        () => this.refreshSession(),
        expiresIn - refreshBuffer
      );
    }
  }

  private async refreshSession() {
    try {
      const { data: { session }, error } = await supabase.auth.refreshSession();
      if (error) throw error;
      this.setSession(session);
    } catch (error) {
      console.error('Failed to refresh session:', error);
      this.setSession(null);
    }
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.session));
  }

  public getSession(): Session | null {
    return this.session;
  }

  public subscribe(listener: (session: Session | null) => void): () => void {
    this.listeners.add(listener);
    listener(this.session);

    return () => {
      this.listeners.delete(listener);
    };
  }

  public async invalidate() {
    await supabase.auth.signOut();
    this.setSession(null);
  }

  public isAuthenticated(): boolean {
    return !!this.session;
  }

  public getAccessToken(): string | null {
    return this.session?.access_token ?? null;
  }
}

export const useSession = () => {
  const sessionManager = SessionManager.getInstance();
  return {
    getSession: () => sessionManager.getSession(),
    subscribe: sessionManager.subscribe.bind(sessionManager),
    invalidate: sessionManager.invalidate.bind(sessionManager),
    isAuthenticated: sessionManager.isAuthenticated.bind(sessionManager),
    getAccessToken: sessionManager.getAccessToken.bind(sessionManager),
  };
}; 