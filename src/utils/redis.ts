import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const redisHost = process.env.REDIS_HOST || "localhost";
const redisPort = parseInt(process.env.REDIS_PORT || "6379", 10);
const redisUsername = process.env.REDIS_USERNAME || undefined;
const redisPassword = process.env.REDIS_PASSWORD || undefined;

const clients: { [db: number]: Redis } = {};

/**
 * Get (or create) a Redis client instance for a specific database number.
 */
export function getRedisClient(db: number = 0): Redis {
	if (!clients[db]) {
		clients[db] = new Redis({
			host: redisHost,
			port: redisPort,
			username: redisUsername,
			password: redisPassword,
			db: db,
		});
	}

	return clients[db];
}

/**
 * Set a key-value pair in a specific Redis database.
 * @param db Redis database number
 * @param key Key to store
 * @param value String value to store
 * @param expirySeconds Optional expiration time in seconds
 */
export async function setRedis(db: number, key: string, value: string, expirySeconds?: number): Promise<string> {
	const client = getRedisClient(db);
	if (expirySeconds) {
		return await client.set(key, value, "EX", expirySeconds);
	}
	return await client.set(key, value);
}

/**
 * Get a value by key from a specific Redis database.
 * @param db Redis database number
 * @param key Key to retrieve
 */
export async function getRedis(db: number, key: string): Promise<string | null> {
	const client = getRedisClient(db);
	return await client.get(key);
}

/**
 * Delete a key from a specific Redis database.
 * @param db Redis database number
 * @param key Key to delete
 */
export async function delRedis(db: number, key: string): Promise<number> {
	const client = getRedisClient(db);
	return await client.del(key);
}
