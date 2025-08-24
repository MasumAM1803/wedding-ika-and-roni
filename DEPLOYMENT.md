# Wedding Invitation - Vercel Deployment Guide

## 🚀 Deploy to Vercel

This project is now configured for Vercel deployment with a Node.js API that can write to the `wishes.json` file.

### Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Vercel CLI** (optional): `npm i -g vercel`

### Deployment Steps

#### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push your code to GitHub/GitLab/Bitbucket**
2. **Go to [vercel.com](https://vercel.com) and sign in**
3. **Click "New Project"**
4. **Import your repository**
5. **Configure project settings:**
   - Framework Preset: `Vue.js`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
6. **Click "Deploy"**

#### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts
# - Set up and deploy: Yes
# - Which scope: Select your account
# - Link to existing project: No
# - Project name: wedding-invitation (or your preferred name)
# - Directory: ./ (current directory)
# - Override settings: No
```

### Project Structure

```
├── api/
│   └── wishes.js          # Vercel serverless function
├── src/
│   ├── assets/
│   │   └── data/
│   │       ├── wishes.json        # Wishes data file
│   │       └── wedding-config.json # Wedding configuration
│   └── components/
│       └── invitation/
│           └── wedding/
│               └── fullWidth/
│                   └── wedding-3d-02.vue  # Main component
├── vercel.json            # Vercel configuration
├── package.json           # Project dependencies
└── vite.config.js         # Vite configuration
```

### API Endpoints

- **GET** `/api/wishes` - Retrieve all wishes
- **POST** `/api/wishes` - Add new wish

### How It Works

1. **Frontend**: Vue.js component with form to submit wishes
2. **API**: Vercel serverless function (`/api/wishes`) handles:
   - Reading from `wishes.json`
   - Writing new wishes to `wishes.json`
   - Updating metadata (total count, attendance stats)
3. **Data Persistence**: Wishes are stored in `src/assets/data/wishes.json`

### Environment Variables

No environment variables are required for basic functionality.

### Custom Domain (Optional)

1. Go to your Vercel project dashboard
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Configure DNS records as instructed

### Monitoring & Analytics

- **Vercel Analytics**: Built-in performance monitoring
- **Function Logs**: View API function execution logs in Vercel dashboard
- **Real-time Updates**: See deployment status and logs in real-time

### Troubleshooting

#### Common Issues

1. **Build Failures**
   - Check `package.json` scripts
   - Ensure all dependencies are in `dependencies` (not `devDependencies`)
   - Verify Node.js version compatibility

2. **API Errors**
   - Check function logs in Vercel dashboard
   - Verify file paths in `api/wishes.js`
   - Ensure `wishes.json` has proper write permissions

3. **CORS Issues**
   - API already includes CORS headers
   - If issues persist, check browser console for errors

#### Support

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Vercel Community**: [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)

### Performance Tips

1. **Image Optimization**: Use Vercel's automatic image optimization
2. **Caching**: API responses are cached by default
3. **CDN**: Global CDN for static assets
4. **Edge Functions**: Consider using Edge Functions for better performance

### Security Notes

- API endpoints are publicly accessible
- Consider adding authentication if needed
- File writes are limited to the project directory
- Input validation is implemented in the API

---

🎉 **Your wedding invitation is now ready for deployment on Vercel!**
