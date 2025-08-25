# Vercel Deployment Guide

## 🚀 Deployment Status

Your wedding invitation application has been successfully deployed to Vercel!

**Production URL**: https://wedding-ika-dan-roni-m9e297n90-abduls-projects-09ccbfc5.vercel.app

## 📋 What's Deployed

- ✅ Vue.js frontend with dynamic routing
- ✅ Guest invitation system (`/guest/[slug]`)
- ✅ API endpoints for guests and wishes
- ✅ Responsive design for mobile and desktop
- ✅ Beautiful wedding invitation interface

## 🔧 How to Deploy Updates

### 1. Build the Project
```bash
npm run build
```

### 2. Deploy to Vercel
```bash
vercel --prod
```

### 3. Alternative: Deploy from Git
- Push your changes to GitHub
- Vercel will automatically deploy on push to main branch

## 🌐 Testing the Deployment

### Test Guest Invitations
- **Abdul's invitation**: https://wedding-ika-dan-roni-m9e297n90-abduls-projects-09ccbfc5.vercel.app/guest/abdul
- **Sarah's invitation**: https://wedding-ika-dan-roni-m9e297n90-abduls-projects-09ccbfc5.vercel.app/guest/sarah

### Test API Endpoints
- **Guest API**: https://wedding-ika-dan-roni-m9e297n90-abduls-projects-09ccbfc5.vercel.app/api/guest/abdul
- **Wishes API**: https://wedding-ika-dan-roni-m9e297n90-abduls-projects-09ccbfc5.vercel.app/api/wishes

## 📱 Features Available

### Dynamic Routing
- `/` - Home page with generic invitation
- `/guest/[slug]` - Personalized invitation for specific guest

### Guest Personalization
- Guest name displayed below "Kepada Yth."
- Relationship and invitation message
- Custom styling for guest information

### API Integration
- Guest data fetched from API
- Wishes/RSVP system
- Real-time updates

## 🛠️ Configuration Files

### vercel.json
- Handles client-side routing
- API route configuration
- Proper headers for assets

### API Endpoints
- `api/guest/[slug].js` - Guest information
- `api/wishes.js` - Wishes and RSVP

## 🔄 Updating Guest Data

To add or modify guests:

1. Edit `src/assets/data/guests.json`
2. Add new guest with proper slug
3. Deploy to Vercel
4. New guest will be available at `/guest/[new-slug]`

## 📊 Monitoring

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Analytics**: View visitor statistics
- **Logs**: Monitor API performance
- **Deployments**: Track deployment history

## 🚨 Troubleshooting

### Common Issues
1. **Build Errors**: Check `npm run build` locally first
2. **API Errors**: Verify API endpoints are working
3. **Routing Issues**: Ensure `vercel.json` is properly configured

### Support
- Vercel Documentation: https://vercel.com/docs
- Vue.js Documentation: https://vuejs.org/guide/
- Check Vercel dashboard for deployment logs

## 🎉 Congratulations!

Your wedding invitation application is now live and accessible to guests worldwide! Each guest can receive their personalized invitation link, and the system will automatically display their information.
