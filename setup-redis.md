# Setup Redis for Wishes API

## Quick Setup Guide

### 1. Create Upstash Redis Database
1. Go to [upstash.com](https://upstash.com)
2. Sign up for free account
3. Create new Redis database
4. Choose a region close to your users
5. Copy the credentials:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`

### 2. Add Environment Variables to Vercel
```bash
# Using Vercel CLI
vercel env add UPSTASH_REDIS_REST_URL
vercel env add UPSTASH_REDIS_REST_TOKEN

# Or through Vercel Dashboard:
# 1. Go to https://vercel.com/dashboard
# 2. Select your project
# 3. Go to Settings → Environment Variables
# 4. Add both variables
```

### 3. Redeploy
```bash
vercel --prod
```

### 4. Test
```bash
# Test POST (should work)
curl -X POST https://wedding-ika-dan-roni.vercel.app/api/wishes \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","message":"Hello","attendance":"present"}'

# Test GET (should return the data)
curl -X GET https://wedding-ika-dan-roni.vercel.app/api/wishes
```

## Alternative: Use Simple API (Temporary)
If you need immediate functionality without Redis setup:
- Use `/api/wishes-simple` endpoint
- Data won't persist between requests
- Good for testing only
