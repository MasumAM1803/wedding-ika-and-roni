import { Redis } from '@upstash/redis'

// Initialize Redis with fallback to in-memory storage
let redis;
let redisType = 'none';

// Simple in-memory fallback storage for when Redis is not available
let inMemoryStorage = {};

try {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN
    });
    redisType = 'upstash';
    console.log('✅ Using Upstash Redis');
  } else {
    redisType = 'memory';
    console.log('⚠️  Using in-memory storage (Redis not configured)');
    console.log('   To use persistent storage, set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN');
  }
} catch (error) {
  console.error('❌ Failed to initialize Redis, using in-memory storage:', error.message);
  redisType = 'memory';
}

export { redis, redisType }

export async function getJson(key, fallback = null) {
  try {
    if (redisType === 'upstash' && redis) {
      console.log(`Getting key: ${key} from Redis`);
      const val = await redis.get(key);
      console.log(`Got value for ${key}:`, val ? 'exists' : 'null');
      return val ? JSON.parse(val) : fallback;
    } else if (redisType === 'memory') {
      console.log(`Getting key: ${key} from memory`);
      const val = inMemoryStorage[key];
      console.log(`Got value for ${key}:`, val ? 'exists' : 'null');
      return val ? JSON.parse(val) : fallback;
    } else {
      console.error('No storage configured, returning fallback');
      return fallback;
    }
  } catch (e) {
    console.error(`${redisType} read error:`, e.message);
    return fallback;
  }
}

export async function setJson(key, obj) {
  try {
    if (redisType === 'upstash' && redis) {
      console.log(`Setting key: ${key} in Redis`);
      await redis.set(key, JSON.stringify(obj));
      console.log(`Successfully set key: ${key} in Redis`);
    } else if (redisType === 'memory') {
      console.log(`Setting key: ${key} in memory`);
      inMemoryStorage[key] = JSON.stringify(obj);
      console.log(`Successfully set key: ${key} in memory`);
    } else {
      throw new Error('No storage configured');
    }
    return true;
  } catch (e) {
    console.error(`${redisType} write error:`, e.message);
    throw e;
  }
}