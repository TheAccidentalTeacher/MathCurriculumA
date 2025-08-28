# Railway Deployment Checklist

## ✅ Pre-Deployment Setup (Completed)
- [x] `.env` configured for Railway (local development only)
- [x] `.env.example` created to document required variables
- [x] `railway.toml` updated with Prisma generation in build command
- [x] Prisma client generation working locally

## 🚀 Railway Deployment Steps

### 1. Connect GitHub Repository to Railway
1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Connect your GitHub account if needed
5. Select `TheAccidentalTeacher/MathCurriculumA` repository

### 2. Add PostgreSQL Database
1. In your Railway project, click "Add Service"
2. Select "Database" → "PostgreSQL"
3. Railway will automatically create a PostgreSQL instance
4. The `DATABASE_URL` environment variable will be auto-generated

### 3. Configure Environment Variables (Auto-configured)
Railway will automatically set:
- `DATABASE_URL` - PostgreSQL connection string (from database service)
- `NODE_ENV` - Set to "production" in railway.toml
- `PORT` - Railway sets this automatically

### 4. Deploy
1. Railway will automatically deploy when you push to GitHub
2. First deployment will:
   - Install npm dependencies
   - Generate Prisma client
   - Build Next.js app
   - Start the application

### 5. Run Database Migrations (Post-Deploy)
After first successful deployment:
1. Go to Railway Dashboard → Your Project → Database service
2. Open "Query" tab or connect via CLI
3. Run Prisma migrations: `npx prisma migrate deploy`

## 🔧 Troubleshooting

### If Build Fails
- Check Railway logs in Dashboard → Deployments tab
- Ensure all dependencies are in `package.json`
- Verify Prisma schema is valid

### If Database Connection Fails
- Verify PostgreSQL service is running
- Check DATABASE_URL environment variable exists
- Ensure Prisma client is generated during build

### If App Doesn't Start
- Check start command in railway.toml: `npm start`
- Verify Next.js build completed successfully
- Check application logs for errors

## 📝 Next Steps After Deployment
1. Test the deployed application
2. Run PDF extraction script to populate database
3. Configure domain name (optional)
4. Set up monitoring/analytics
