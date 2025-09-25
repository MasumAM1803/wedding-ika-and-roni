import { getStorageStatus } from '../lib/storage.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    try {
      const storageStatus = getStorageStatus();
      
      // Check environment variables
      const envCheck = {
        UPSTASH_REDIS_REST_URL: !!process.env.UPSTASH_REDIS_REST_URL,
        UPSTASH_REDIS_REST_TOKEN: !!process.env.UPSTASH_REDIS_REST_TOKEN,
        KV_REST_API_URL: !!process.env.KV_REST_API_URL,
        KV_REST_API_TOKEN: !!process.env.KV_REST_API_TOKEN,
      };
      
      res.status(200).json({
        success: true,
        timestamp: new Date().toISOString(),
        storage: storageStatus,
        environment: envCheck,
        message: `Using ${storageStatus.status} storage`,
        recommendations: getRecommendations(storageStatus, envCheck)
      });
    } catch (error) {
      console.error('Status check error:', error);
      res.status(500).json({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

function getRecommendations(storageStatus, envCheck) {
  const recommendations = [];
  
  if (storageStatus.status === 'memory') {
    recommendations.push('⚠️ Using in-memory storage - data will not persist between requests');
    recommendations.push('💡 Set up Upstash Redis or Vercel KV for persistent storage');
  }
  
  if (!envCheck.UPSTASH_REDIS_REST_URL && !envCheck.KV_REST_API_URL) {
    recommendations.push('🔧 No persistent storage configured');
    recommendations.push('📝 Add UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN to Vercel environment variables');
  }
  
  if (storageStatus.upstash) {
    recommendations.push('✅ Upstash Redis configured - data will persist');
  }
  
  if (storageStatus.vercelKV) {
    recommendations.push('✅ Vercel KV configured - data will persist');
  }
  
  return recommendations;
}
