# Deployment Guide - Vote Management System

## Pre-Deployment Checklist

- [ ] All environment variables are set in production
- [ ] Database schema has been run in production Supabase
- [ ] Authentication is working correctly
- [ ] Testing completed locally
- [ ] No console errors or warnings
- [ ] Security settings reviewed

## Option 1: Deploy to Vercel (Recommended)

### Step 1: Prepare Repository

```bash
# Make sure everything is committed
git add .
git commit -m "Production ready"
git push origin main
```

### Step 2: Create Vercel Account

1. Go to https://vercel.com
2. Sign up or login with GitHub
3. Authorize Vercel to access your GitHub repositories

### Step 3: Import Project

1. Click "New Project"
2. Select "Import Git Repository"
3. Find `damasntuluanta-crypto/vote`
4. Click "Import"

### Step 4: Configure Project

1. **Project Name**: Leave as default or change to `vote-system`

2. **Environment Variables**: Add these variables
   - `NEXT_PUBLIC_SUPABASE_URL` = Your Supabase URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Your anon public key
   - `SUPABASE_SERVICE_ROLE_KEY` = Your service role key
   - `NEXT_PUBLIC_APP_URL` = Your production URL (e.g., https://vote-system.vercel.app)

3. **Git Configuration**:
   - **Production Branch**: main
   - **Framework**: Next.js (auto-detected)

### Step 5: Deploy

1. Click "Deploy"
2. Wait for build to complete (5-10 minutes)
3. Get your live URL: https://vote-system.vercel.app

### Step 6: Verify Deployment

1. Visit your live URL
2. Test login/signup
3. Create a test election
4. Cast a test vote
5. Check results

## Option 2: Deploy to Cloudflare Pages

### Step 1: Prepare Repository

```bash
git add .
git commit -m "Production ready"
git push origin main
```

### Step 2: Create Cloudflare Account

1. Go to https://cloudflare.com
2. Sign up or login
3. Go to Pages section

### Step 3: Create Pages Project

1. Click "Create a project"
2. Select "Connect to Git"
3. Authorize GitHub
4. Select `damasntuluanta-crypto/vote` repository

### Step 4: Configure Build

1. **Project name**: `vote-system`

2. **Build settings**:
   - **Framework preset**: Next.js
   - **Build command**: `npm run build`
   - **Build output directory**: `.next`
   - **Node.js version**: 18.x or higher

3. **Environment variables**:
   - `NEXT_PUBLIC_SUPABASE_URL` = Your Supabase URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Your anon public key
   - `SUPABASE_SERVICE_ROLE_KEY` = Your service role key
   - `NEXT_PUBLIC_APP_URL` = Your production URL

### Step 5: Deploy

1. Click "Save and Deploy"
2. Wait for build completion
3. Get your live URL

## Option 3: Deploy to Custom Server

### Step 1: Build for Production

```bash
npm run build
```

### Step 2: Upload to Server

```bash
# Package the application
tar -czf vote-system.tar.gz .next node_modules package.json

# Upload to your server
scp vote-system.tar.gz user@your-server.com:/home/user/vote-system/

# SSH into server and extract
ssh user@your-server.com
cd /home/user/vote-system
tar -xzf vote-system.tar.gz
```

### Step 3: Setup Server

```bash
# Create .env file
cat > .env << EOF
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key
NEXT_PUBLIC_APP_URL=https://your-domain.com
NODE_ENV=production
EOF

# Install dependencies
npm install --production

# Start application
npm start
```

### Step 4: Setup Reverse Proxy (Nginx)

```nginx
upstream vote_system {
  server localhost:3000;
}

server {
  listen 80;
  server_name your-domain.com;
  
  location / {
    proxy_pass http://vote_system;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }
}
```

### Step 5: Enable HTTPS

```bash
# Using Let's Encrypt and Certbot
sudo certbot --nginx -d your-domain.com
```

## Production Supabase Setup

### Step 1: Create Production Project

1. Go to Supabase dashboard
2. Create a new project (separate from development)
3. Name it something like `vote-production`
4. Copy the new credentials

### Step 2: Run Schema

1. Go to SQL Editor in production project
2. Run the schema from `supabase/schema.sql`
3. Verify all tables are created

### Step 3: Update RLS Policies

1. Go to Authentication → Policies
2. Verify all RLS policies are enabled
3. Test that policies work correctly

### Step 4: Enable Backups

1. Go to Database → Backups
2. Enable daily automated backups
3. Set backup retention to 30 days

## Security Checklist

- [ ] Never expose `SUPABASE_SERVICE_ROLE_KEY` in client code
- [ ] Enable HTTPS/SSL certificates
- [ ] Set strong database password
- [ ] Enable 2FA on Supabase account
- [ ] Review and enable audit logs
- [ ] Set up rate limiting
- [ ] Configure CORS properly
- [ ] Enable request signing
- [ ] Review RLS policies
- [ ] Enable database backups
- [ ] Monitor for suspicious activity

## Post-Deployment

### Monitor Errors

**Vercel**:
- Go to project dashboard
- Click "Deployments"
- Check logs for any errors

**Cloudflare**:
- Go to Pages project
- Check "Deployments" tab
- Review build logs

### Setup Monitoring

```bash
# Monitor logs
vercel logs [project-url]

# Or check Supabase logs
# Dashboard → Logs
```

### Performance Optimization

1. Enable Vercel Analytics: https://vercel.com/docs/analytics
2. Setup uptime monitoring: https://www.pingdom.com
3. Configure CDN caching
4. Enable compression

## Rollback Plan

If something goes wrong:

**Vercel**:
1. Go to Deployments
2. Click on previous deployment
3. Click "Redeploy"

**Cloudflare**:
1. Go to Deployments
2. Select previous deployment
3. Click "Rollback"

**Manual Server**:
```bash
# Restore from backup
git checkout previous-version
npm run build
npm start
```

## Troubleshooting

### Build Fails
- Check Node.js version (should be 16+)
- Clear npm cache: `npm cache clean --force`
- Reinstall dependencies: `rm -rf node_modules && npm install`

### Database Connection Error
- Verify environment variables are set
- Check Supabase project is active
- Test connection string

### High Memory Usage
- Reduce concurrent connections
- Optimize database queries
- Enable compression

## Support & Documentation

- Vercel Docs: https://vercel.com/docs
- Cloudflare Pages: https://developers.cloudflare.com/pages/
- Next.js Deployment: https://nextjs.org/docs/deployment
- Supabase: https://supabase.com/docs

---

**Your application is now live! 🚀**
