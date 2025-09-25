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
        console.log(`Value type:`, typeof val);
        
        if (val === null || val === undefined) {
          return fallback;
        }
        
        // Handle both string and object values
        if (typeof val === 'string') {
          return JSON.parse(val);
        } else if (typeof val === 'object') {
          return val;
        } else {
          console.warn(`Unexpected value type for key ${key}:`, typeof val);
          return fallback;
        }
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
        console.log(`Value type:`, typeof val);
        
        if (val === null || val === undefined) {
          return fallback;
        }
        
        // Handle both string and object values
        if (typeof val === 'string') {
          return JSON.parse(val);
        } else if (typeof val === 'object') {
          return val;
        } else {
          console.warn(`Unexpected value type for key ${key}:`, typeof val);
          return fallback;
        }
      } catch (kvError) {
        console.error('Vercel KV error, falling back to memory:', kvError.message);
      }
    }
    
    // Option 3: Fallback to in-memory storage
    console.log(`Getting key: ${key} from memory storage`);
    const val = inMemoryStorage[key];
    console.log(`Got value for ${key}:`, val ? 'exists' : 'null');
    console.log(`Value type:`, typeof val);
    
    if (val === null || val === undefined) {
      return fallback;
    }
    
    // Handle both string and object values
    if (typeof val === 'string') {
      return JSON.parse(val);
    } else if (typeof val === 'object') {
      return val;
    } else {
      console.warn(`Unexpected value type for key ${key}:`, typeof val);
      return fallback;
    }
    
  } catch (e) {
    console.error('Storage read error:', e.message);
    return fallback;
  }
}

export async function setJson(key, obj) {
  try {
    console.log(`Setting key: ${key}`);
    console.log(`Object to store:`, {
      type: typeof obj,
      isArray: Array.isArray(obj),
      keys: obj && typeof obj === 'object' ? Object.keys(obj) : 'N/A',
      wishesCount: obj && obj.wishes ? obj.wishes.length : 'N/A'
    });
    
    // Ensure we're storing a proper object, not a string
    let dataToStore;
    if (typeof obj === 'string') {
      console.log('Object is already a string, parsing first');
      dataToStore = JSON.parse(obj);
    } else {
      dataToStore = obj;
    }
    
    console.log(`Final data to store:`, {
      type: typeof dataToStore,
      isArray: Array.isArray(dataToStore),
      keys: dataToStore && typeof dataToStore === 'object' ? Object.keys(dataToStore) : 'N/A'
    });
    
    // Option 1: Try Upstash Redis if configured
    if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
      try {
        const { Redis } = await import('@upstash/redis');
        const redis = new Redis({
          url: process.env.UPSTASH_REDIS_REST_URL,
          token: process.env.UPSTASH_REDIS_REST_TOKEN
        });
        
        console.log(`Setting key: ${key} in Upstash Redis`);
        await redis.set(key, JSON.stringify(dataToStore));
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
        await kv.set(key, JSON.stringify(dataToStore));
        console.log(`Successfully set key: ${key} in Vercel KV`);
        return true;
      } catch (kvError) {
        console.error('Vercel KV error, falling back to memory:', kvError.message);
      }
    }
    
    // Option 3: Fallback to in-memory storage
    console.log(`Setting key: ${key} in memory storage`);
    inMemoryStorage[key] = JSON.stringify(dataToStore);
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
