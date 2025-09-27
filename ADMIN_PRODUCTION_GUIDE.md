# Admin Dashboard Production Testing Guide

## Overview
This guide helps you verify that the admin dashboard is working correctly on Vercel production with database integration.

## Prerequisites
1. Deploy the latest changes to Vercel
2. Ensure environment variables are set in Vercel dashboard:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`

## Testing Steps

### 1. Test Database Connectivity
```bash
curl https://your-domain.vercel.app/api/test-admin-production
```
This will show:
- Environment variables status
- API endpoints status
- Database connectivity

### 2. Test Admin Data Access
```bash
curl https://your-domain.vercel.app/api/test-admin-data
```
This will show:
- Guests data from database
- Wishes data from database
- Data structure and counts

### 3. Test Individual APIs
```bash
# Test guests API
curl https://your-domain.vercel.app/api/guests

# Test wishes API
curl https://your-domain.vercel.app/api/wishes
```

### 4. Access Admin Dashboard
1. Go to `https://your-domain.vercel.app/admin`
2. Login with credentials:
   - Username: `admin`
   - Password: `weddingInvitationNumber1`
3. Verify that guest data loads from database
4. Test guest operations:
   - Add new guest
   - Edit existing guest
   - Delete guest
   - Upload guests file

## Expected Behavior

### ✅ Working Correctly
- Admin dashboard loads guest data from database
- All guest operations work (add, edit, delete)
- Data persists across page refreshes
- Real-time updates when data changes

### ❌ Common Issues
- **Empty guest list**: Check if database has data
- **API errors**: Check environment variables
- **CORS errors**: Check API endpoint configuration
- **Authentication issues**: Check localStorage in browser

## Troubleshooting

### If Admin Shows No Data
1. Check database has data:
   ```bash
   curl https://your-domain.vercel.app/api/guests
   ```

2. Check environment variables:
   ```bash
   curl https://your-domain.vercel.app/api/test-admin-production
   ```

3. Check browser console for errors

### If API Calls Fail
1. Verify Vercel environment variables are set
2. Check Vercel function logs
3. Ensure API routes are properly configured in vercel.json

### If Data Doesn't Persist
1. Check database write permissions
2. Verify storage functions are working
3. Check for JSON parsing errors

## Environment Variables Required
Make sure these are set in your Vercel project settings:
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

## API Endpoints Used by Admin
- `GET /api/guests` - Fetch all guests
- `POST /api/guests` - Add new guest
- `PUT /api/guests/:id` - Update guest
- `DELETE /api/guests/:id` - Delete guest
- `POST /api/guests/bulk` - Bulk upload guests
- `GET /api/wishes` - Fetch all wishes
- `POST /api/wishes` - Add new wish
- `PUT /api/wishes` - Update wish
- `DELETE /api/wishes` - Delete wish

## Success Indicators
- Admin dashboard loads without errors
- Guest list shows data from database
- All CRUD operations work correctly
- Data persists after page refresh
- No console errors in browser


