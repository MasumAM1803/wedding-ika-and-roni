// Enhanced storage with multiple fallback options
let inMemoryStorage = {};

// For Vercel serverless, we'll use a hybrid approach
// This will work better than pure in-memory storage
export async function getJson(key, fallback = null) {
  try {
    console.log(`Getting key: ${key}`);
    
    // Option 1: Try Upstash Redis if configured
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
        console.error('Upstash Redis error, trying Vercel KV:', redisError.message);
      }
    }
    
    // Option 2: Try Vercel KV if configured
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      try {
        const { kv } = await import('@vercel/kv');
        console.log(`Getting key: ${key} from Vercel KV`);
        const val = await kv.get(key);
        console.log(`Got value for ${key}:`, val ? 'exists' : 'null');
        return val ? JSON.parse(val) : fallback;
      } catch (kvError) {
        console.error('Vercel KV error, falling back to memory:', kvError.message);
      }
    }
    
    // Option 3: Fallback to in-memory storage
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
    console.log(`Setting key: ${key}`);
    
    // Option 1: Try Upstash Redis if configured
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
        console.error('Upstash Redis error, trying Vercel KV:', redisError.message);
      }
    }
    
    // Option 2: Try Vercel KV if configured
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      try {
        const { kv } = await import('@vercel/kv');
        console.log(`Setting key: ${key} in Vercel KV`);
        await kv.set(key, JSON.stringify(obj));
        console.log(`Successfully set key: ${key} in Vercel KV`);
        return true;
      } catch (kvError) {
        console.error('Vercel KV error, falling back to memory:', kvError.message);
      }
    }
    
    // Option 3: Fallback to in-memory storage
    console.log(`Setting key: ${key} in memory storage`);
    inMemoryStorage[key] = JSON.stringify(obj);
    console.log(`Successfully set key: ${key} in memory storage`);
    return true;
    
  } catch (e) {
    console.error('Storage write error:', e.message);
    throw e;
  }
}

// Helper function to check storage status
export function getStorageStatus() {
  const hasUpstash = !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
  const hasVercelKV = !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
  
  return {
    upstash: hasUpstash,
    vercelKV: hasVercelKV,
    fallback: 'memory',
    status: hasUpstash ? 'upstash' : hasVercelKV ? 'vercel-kv' : 'memory'
  };
}
