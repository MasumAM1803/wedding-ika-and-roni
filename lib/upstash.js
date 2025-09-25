// Simple in-memory storage fallback for when Redis is not available
let inMemoryStorage = {};

export async function getJson(key, fallback = null) {
  try {
    // Try Upstash Redis first if configured
    if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
      try {
        const { Redis } = await import('@upstash/redis');
        const redis = new Redis({
          url: process.env.UPSTASH_REDIS_REST_URL,
          token: process.env.UPSTASH_REDIS_REST_TOKEN
        });
        
        console.log(`Getting key: ${key} from Upstash Redis`);
        const val = await redis.get(key);
        console.log(`Got value for ${key}:`, val ? 'exists' : 'null');
        return val ? JSON.parse(val) : fallback;
      } catch (redisError) {
        console.error('Upstash Redis error, falling back to memory:', redisError.message);
      }
    }
    
    // Fallback to in-memory storage
    console.log(`Getting key: ${key} from memory storage`);
    const val = inMemoryStorage[key];
    console.log(`Got value for ${key}:`, val ? 'exists' : 'null');
    return val ? JSON.parse(val) : fallback;
    
  } catch (e) {
    console.error('Storage read error:', e.message);
    return fallback;
  }
}

export async function setJson(key, obj) {
  try {
    // Try Upstash Redis first if configured
    if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
      try {
        const { Redis } = await import('@upstash/redis');
        const redis = new Redis({
          url: process.env.UPSTASH_REDIS_REST_URL,
          token: process.env.UPSTASH_REDIS_REST_TOKEN
        });
        
        console.log(`Setting key: ${key} in Upstash Redis`);
        await redis.set(key, JSON.stringify(obj));
        console.log(`Successfully set key: ${key} in Upstash Redis`);
        return true;
      } catch (redisError) {
        console.error('Upstash Redis error, falling back to memory:', redisError.message);
      }
    }
    
    // Fallback to in-memory storage
    console.log(`Setting key: ${key} in memory storage`);
    inMemoryStorage[key] = JSON.stringify(obj);
    console.log(`Successfully set key: ${key} in memory storage`);
    return true;
    
  } catch (e) {
    console.error('Storage write error:', e.message);
    throw e;
  }
}