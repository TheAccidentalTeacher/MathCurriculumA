# Deploy Math Curriculum App to Railway

This guide will help you deploy the Math Curriculum Platform to Railway with PostgreSQL database.

## Prerequisites

1. **GitHub Account** - Your repo: https://github.com/TheAccidentalTeacher/MathCurriculumA
2. **Railway Account** - Sign up at https://railway.app
3. **PDF Files** - Your curriculum PDFs ready for upload

## Step 1: Push Code to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Math Curriculum Platform"

# Add your remote repository
git remote add origin https://github.com/TheAccidentalTeacher/MathCurriculumA.git

# Push to GitHub
git push -u origin main
```

## Step 2: Deploy to Railway

1. **Connect GitHub to Railway**
   - Go to https://railway.app
   - Sign in with GitHub
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose `TheAccidentalTeacher/MathCurriculumA`

2. **Add PostgreSQL Database**
   - In your Railway project dashboard
   - Click "New Service"
   - Select "Database" → "PostgreSQL"
   - Railway will automatically set DATABASE_URL environment variable

3. **Configure Environment Variables**
   - Go to your app service settings
   - Add environment variables:
     ```
     NODE_ENV=production
     NEXT_PUBLIC_APP_URL=https://your-app.railway.app
     ```

4. **Deploy**
   - Railway will automatically deploy when you push to main branch
   - First deployment might take 5-10 minutes

## Step 3: Setup Database Schema

Once deployed, you'll need to run database migrations:

1. **Via Railway CLI** (recommended):
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli

   # Login to Railway
   railway login

   # Link to your project
   railway link

   # Run database migration
   railway run npm run migrate
   ```

2. **Via GitHub Actions** (alternative):
   - Push a commit that triggers the migration script
   - Or use Railway's built-in database migration on deploy

## Step 4: Upload and Extract PDFs

1. **Upload PDFs to your server** (you'll need to implement file upload)
2. **Run extraction script**:
   ```bash
   # Via Railway CLI
   railway run npm run extract
   ```

## Step 5: Access Your App

Your app will be available at: `https://your-project-name.railway.app`

## Features Available

- **📚 Browse Documents** - View all curriculum files
- **🔍 Search Content** - Search across extracted content  
- **⚙️ Database Admin** - Inspect and manage data
- **🚀 Production Ready** - Deployed with Railway's managed PostgreSQL

## Railway Benefits

✅ **Free PostgreSQL** - Up to 1GB database  
✅ **Automatic Deployments** - Deploy on every git push  
✅ **Custom Domain** - Add your own domain later  
✅ **Environment Management** - Easy environment variables  
✅ **Monitoring** - Built-in metrics and logs  
✅ **Scaling** - Automatic scaling as you grow  

## Next Steps

1. **Upload your PDF files** to the deployed app
2. **Run extraction** to populate the database
3. **Test the search and browse functionality**
4. **Add custom domain** if desired
5. **Monitor usage** via Railway dashboard

## Troubleshooting

- **Build fails**: Check the logs in Railway dashboard
- **Database connection issues**: Verify DATABASE_URL is set
- **PDF extraction fails**: Check file upload permissions
- **Search not working**: Ensure database is populated

## Cost Estimates

- **Hobby Plan**: Free tier includes PostgreSQL + app hosting
- **Pro Plan**: $5/month for higher limits if needed
- **Database**: Free 1GB, then $0.25/GB/month

Your math curriculum platform will be fully deployed and accessible to teachers and students worldwide! 🚀
