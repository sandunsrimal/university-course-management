# Render Deployment Guide

This guide will walk you through deploying your University Course Management System on Render's free platform.

## Prerequisites

1. **GitHub Account**: Your code must be in a GitHub repository
2. **Render Account**: Sign up at [render.com](https://render.com)
3. **Repository**: Make sure your code is pushed to GitHub

## Step 1: Prepare Your Repository

### 1.1 Ensure Required Files Exist
Make sure these files are in your repository:
- `render.yaml` (for automatic deployment)
- `backend/src/main/resources/application-render.properties`
- `frontend/package.json` with build scripts
- `backend/build.gradle` with proper configuration

### 1.2 Update Environment Variables
The `render.yaml` file already includes the necessary environment variables, but you can customize them in the Render dashboard.

## Step 2: Deploy on Render

### Option A: Automatic Deployment (Recommended)

1. **Go to Render Dashboard**
   - Visit [render.com](https://render.com)
   - Sign in to your account

2. **Create New Blueprint Instance**
   - Click "New +" button
   - Select "Blueprint"
   - Connect your GitHub repository
   - Render will automatically detect the `render.yaml` file

3. **Review Configuration**
   - Render will create:
     - MySQL Database
     - Backend Web Service
     - Frontend Web Service
   - Review the settings and click "Apply"

4. **Wait for Deployment**
   - Render will build and deploy all services
   - This may take 5-10 minutes for the first deployment

### Option B: Manual Deployment

#### Step 2.1: Create MySQL Database

1. **Create New Database**
   - Click "New +" → "PostgreSQL" (Render uses PostgreSQL, but we'll configure for MySQL)
   - Name: `university-db`
   - Plan: Free
   - Click "Create Database"

2. **Note Connection Details**
   - Save the connection string, username, and password

#### Step 2.2: Deploy Backend Service

1. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

2. **Configure Service**
   - **Name**: `university-backend`
   - **Environment**: `Java`
   - **Region**: Choose closest to your users
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: Leave empty (root of repository)

3. **Build & Deploy Settings**
   - **Build Command**: `cd backend && ./gradlew build -x test`
   - **Start Command**: `cd backend && java -jar build/libs/*.jar`

4. **Environment Variables**
   ```
   SPRING_PROFILES_ACTIVE=render
   MYSQL_USER=<your-db-user>
   MYSQL_PASSWORD=<your-db-password>
   MYSQL_HOST=<your-db-host>
   MYSQL_PORT=<your-db-port>
   MYSQL_DATABASE=<your-db-name>
   JWT_SECRET=<generate-random-string>
   JWT_EXPIRATION=86400000
   ```

5. **Advanced Settings**
   - **Health Check Path**: `/actuator/health`
   - **Auto-Deploy**: Enabled

6. **Create Service**
   - Click "Create Web Service"

#### Step 2.3: Deploy Frontend Service

1. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

2. **Configure Service**
   - **Name**: `university-frontend`
   - **Environment**: `Node`
   - **Region**: Same as backend
   - **Branch**: `main`

3. **Build & Deploy Settings**
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Start Command**: `cd frontend && npm start`

4. **Environment Variables**
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-service.onrender.com
   ```

5. **Create Service**
   - Click "Create Web Service"

## Step 3: Configure Services

### 3.1 Update Frontend API URL
After the backend is deployed, update the frontend's `NEXT_PUBLIC_API_URL`:
1. Go to your frontend service in Render
2. Navigate to "Environment" tab
3. Update `NEXT_PUBLIC_API_URL` to your backend URL
4. Redeploy the frontend service

### 3.2 Verify Health Checks
- Backend: `https://your-backend.onrender.com/actuator/health`
- Frontend: `https://your-frontend.onrender.com`

## Step 4: Test Your Application

1. **Access Frontend**: Visit your frontend URL
2. **Test Login**: Try logging in with test credentials
3. **Check API**: Verify backend endpoints are working
4. **Database**: Ensure data is being saved/retrieved

## Step 5: Custom Domain (Optional)

1. **Add Custom Domain**
   - Go to your service settings
   - Click "Custom Domains"
   - Add your domain
   - Configure DNS records as instructed

2. **SSL Certificate**
   - Render automatically provides SSL certificates
   - No additional configuration needed

## Troubleshooting

### Common Issues

#### Build Failures
- **Check logs**: Go to service → "Logs" tab
- **Verify dependencies**: Ensure all required files are present
- **Check environment variables**: Verify all required vars are set

#### Database Connection Issues
- **Verify credentials**: Check database connection details
- **Network access**: Ensure database allows connections from your service
- **SSL settings**: Some databases require SSL configuration

#### Frontend Not Loading
- **Check build logs**: Verify frontend build completed successfully
- **API URL**: Ensure `NEXT_PUBLIC_API_URL` is correct
- **CORS issues**: Verify backend CORS configuration

#### Performance Issues
- **Free tier limitations**: Free tier has resource limits
- **Database queries**: Optimize database queries
- **Caching**: Implement caching where appropriate

### Useful Commands

#### Check Service Status
```bash
# Via Render Dashboard
# Go to service → "Events" tab
```

#### View Logs
```bash
# Via Render Dashboard
# Go to service → "Logs" tab
```

#### Restart Service
```bash
# Via Render Dashboard
# Go to service → "Manual Deploy" → "Deploy latest commit"
```

## Monitoring and Maintenance

### 1. Monitor Performance
- Use Render's built-in monitoring
- Check response times and error rates
- Monitor database performance

### 2. Regular Updates
- Keep dependencies updated
- Monitor security patches
- Regular backups (automatic on Render)

### 3. Scaling (When Needed)
- Upgrade from free tier for more resources
- Configure auto-scaling rules
- Optimize application performance

## Cost Optimization

### Free Tier Limits
- **Web Services**: 750 hours/month
- **Databases**: 90 days free trial
- **Bandwidth**: 100GB/month
- **Build minutes**: 500 minutes/month

### Upgrade Considerations
- **Web Services**: $7/month per service
- **Databases**: $7/month
- **Additional bandwidth**: $0.10/GB

## Security Best Practices

1. **Environment Variables**
   - Never commit secrets to Git
   - Use Render's environment variable system
   - Rotate secrets regularly

2. **Database Security**
   - Use strong passwords
   - Enable SSL connections
   - Regular backups

3. **Application Security**
   - Keep dependencies updated
   - Implement proper authentication
   - Use HTTPS (automatic on Render)

## Support

- **Render Documentation**: [docs.render.com](https://docs.render.com)
- **Render Support**: Available in dashboard
- **Community**: Render Discord/forums

## Next Steps

After successful deployment:
1. Set up monitoring and alerts
2. Configure custom domain
3. Implement CI/CD pipeline
4. Set up staging environment
5. Plan for scaling as needed 