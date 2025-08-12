# 🚀 Deploy to Vercel

This guide will help you deploy your food delivery app to Vercel.

## 📋 Prerequisites

1. **GitHub Account** - Your code should be in a GitHub repository
2. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)

## 🛠️ Deployment Steps

### Method 1: Deploy via Vercel Dashboard (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with your GitHub account
   - Click "New Project"
   - Import your GitHub repository
   - Select the `food-delivery-app-frontend` folder

3. **Configure Build Settings**
   - **Framework Preset**: Create React App
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
   - **Install Command**: `npm install`

4. **Environment Variables** (if needed)
   - Add any environment variables in the Vercel dashboard
   - For now, no environment variables are required

5. **Deploy**
   - Click "Deploy"
   - Vercel will automatically build and deploy your app

### Method 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   cd food-delivery-app-frontend
   vercel
   ```

4. **Follow the prompts**
   - Link to existing project or create new
   - Confirm build settings
   - Deploy

## 🔧 Configuration Files

### vercel.json
- Handles React Router routing
- Configures build settings
- Sets up caching headers

### package.json
- Contains build scripts
- Lists dependencies
- Configures browserslist

## 🌐 After Deployment

1. **Your app will be available at**: `https://your-project-name.vercel.app`
2. **Custom Domain**: You can add a custom domain in Vercel dashboard
3. **Automatic Deployments**: Every push to main branch will trigger a new deployment

## 🔄 Continuous Deployment

- **Automatic**: Every push to main branch
- **Preview Deployments**: Pull requests get preview URLs
- **Rollback**: Easy rollback to previous versions

## 📱 Features Deployed

✅ **Homepage** - Hero section with search and navigation  
✅ **Explore Page** - Restaurant listings with filters  
✅ **Restaurant Detail** - Menu with advanced filtering  
✅ **Cart System** - Add/remove items with quantity controls  
✅ **Responsive Design** - Works on all devices  
✅ **Dark Theme** - Modern dark UI  
✅ **Search & Filters** - Advanced filtering system  

## 🐛 Troubleshooting

### Build Errors
- Check if all dependencies are in `package.json`
- Ensure TypeScript compilation passes: `npm run build`
- Check for any missing environment variables

### Routing Issues
- The `vercel.json` handles React Router routing
- All routes should work correctly

### Performance
- Static assets are cached for 1 year
- Images are optimized automatically
- Code splitting is handled by React

## 📞 Support

If you encounter any issues:
1. Check Vercel deployment logs
2. Verify build passes locally: `npm run build`
3. Check for TypeScript errors: `npx tsc --noEmit`

---

**Happy Deploying! 🎉**
