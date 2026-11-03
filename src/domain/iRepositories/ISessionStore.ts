export interface ISessionStore {
    createSession(userId: string, role: string, email: string): Promise<string>;
    deleteSession(sessionId: string): Promise<void>;
    getSession(sessionId: string): Promise<SessionData | null>;
}

export type SessionData = {
    userId: string;
    role: string;
    email: string;
    createdAt: string;
};
