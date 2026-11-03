import { randomUUID } from 'crypto';
import type {
    ISessionStore,
    SessionData,
} from '../../domain/iRepositories/ISessionStore.js';
import { getRedisClient } from '../../application/utils/ConnectRedis.js';
import type { RedisClientType } from 'redis';

export class RedisSessionStore implements ISessionStore {
    private ttlSeconds: number;

    constructor(ttlSeconds = 60 * 60) {
        this.ttlSeconds = ttlSeconds;
    }

    private key(sessionId: string): string {
        return `session:${sessionId}`;
    }

    private getClient(): RedisClientType {
        const client = getRedisClient();

        if (!client || !client.isOpen) {
            throw new Error('Redis client is not connected');
        }

        return client;
    }

    async createSession(
        userId: string,
        role: string,
        email: string
    ): Promise<string> {
        const sid = randomUUID();

        const sessionData: SessionData = {
            userId,
            email,
            role,
            createdAt: new Date().toISOString(),
        };
        const client = this.getClient();
        await client.setEx(
            this.key(sid),
            this.ttlSeconds,
            JSON.stringify(sessionData)
        );
        return sid;
    }

    async deleteSession(sessionId: string): Promise<void> {
        const client = this.getClient();
        await client.del(this.key(sessionId));
    }

    async getSession(sessionId: string): Promise<SessionData | null> {
        const client = this.getClient();
        const raw = await client.get(this.key(sessionId));
        if (!raw) {
            return null;
        }
        const sessionData: SessionData = JSON.parse(raw);
        return sessionData;
    }
}
