import { createClient } from 'redis';
import type { RedisClientType } from 'redis';

let client: RedisClientType | null = null;

const connectRedis = async (redisUrl: string): Promise<RedisClientType> => {
    if (client?.isOpen) {
        return client;
    }

    client = createClient({ url: redisUrl });

    client.on('error', (err) => {
        console.error('Redis Client Error', err);
    });

    await client.connect();

    console.log('Connected to Redis');
    return client;
};

const getRedisClient = (): RedisClientType | null => client;

export { connectRedis, getRedisClient };
