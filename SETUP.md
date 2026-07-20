# Setup Guide - Vote Management System

## Prerequisites

- Node.js 16+ and npm
- Supabase account (free at supabase.com)
- Git

## Step 1: Clone the Repository

```bash
git clone https://github.com/damasntuluanta-crypto/vote.git
cd vote
```

## Step 2: Run Setup Script

### On macOS/Linux:
```bash
chmod +x setup.sh
./setup.sh
```

### On Windows:
```bash
setup.bat
```

### Manual Setup (if scripts don't work):
```bash
cp .env.example .env.local
npm install
```

## Step 3: Create Supabase Project

### 3.1 Create Account
1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with GitHub, Google, or email

### 3.2 Create New Project
1. Click "New project" button
2. Fill in details:
   - **Project Name**: `vote-system` (or your choice)
   - **Database Password**: Use a strong password
   - **Region**: Choose closest to you
3. Wait for initialization (2-3 minutes)

### 3.3 Get Your API Keys
1. In dashboard, click "Project Settings" (gear icon)
2. Go to "API" section
3. Copy these values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role secret** → `SUPABASE_SERVICE_ROLE_KEY`

## Step 4: Initialize Database

### 4.1 Run Schema
1. In Supabase dashboard, go to "SQL Editor"
2. Click "New Query"
3. Open `supabase/schema.sql` from the project folder
4. Copy and paste the entire SQL content
5. Click "Run" button
6. Wait for completion (you should see success messages)

### 4.2 Verify Tables
In Supabase dashboard → "Table Editor", verify these tables exist:
- ✅ users
- ✅ elections
- ✅ positions
- ✅ candidates
- ✅ votes
- ✅ eligible_voters
- ✅ audit_logs

## Step 5: Configure Environment

### 5.1 Update .env.local

Edit `.env.local` and fill in your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

## Step 6: Run Development Server

```bash
npm run dev
```

The app will start at: [http://localhost:3000](http://localhost:3000)

## Step 7: Create Test Accounts

### Admin Account
1. Go to [http://localhost:3000](http://localhost:3000)
2. Click "Create Account"
3. Fill in:
   - **Name**: Admin User
   - **Student ID**: ADMIN001
   - **Email**: admin@school.edu
   - **Password**: SecurePass123
4. Submit
5. **Important**: Go to Supabase → Table Editor → users
6. Update the new user's role to `admin`

### Student Account
1. Click "Create Account"
2. Fill in:
   - **Name**: John Doe
   - **Student ID**: STU001
   - **Email**: student@school.edu
   - **Password**: SecurePass123
3. Submit

## Step 8: Test the Application

### As Admin:
1. Login with admin account
2. Create an election
3. Add positions and candidates
4. Change election status to "Published" then "Ongoing"

### As Student:
1. Logout and login with student account
2. Go to "Vote"
3. Select an election
4. Cast your votes
5. See results

## Deployment

### Deploy to Vercel

1. Push code to GitHub
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. Go to [https://vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your GitHub repository
5. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
6. Click "Deploy"

### Deploy to Cloudflare Pages

1. Push code to GitHub

2. Go to [https://pages.cloudflare.com](https://pages.cloudflare.com)
3. Click "Create a project"
4. Connect your GitHub account
5. Select the repository
6. Build settings:
   - **Framework**: Next.js
   - **Build command**: `npm run build`
   - **Build output directory**: `.next`
7. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
8. Click "Deploy"

## Troubleshooting

### Port 3000 already in use
```bash
# Use different port
npm run dev -- -p 3001
```

### Supabase connection error
- Check that `.env.local` has correct URLs and keys
- Verify Supabase project is active
- Check CORS settings in Supabase dashboard

### Database tables not found
- Go to Supabase SQL Editor
- Re-run the schema from `supabase/schema.sql`
- Check for any SQL errors

### Auth not working
- Confirm user exists in Supabase → Auth → Users
- Check email is verified (if email verification is enabled)
- Clear browser cookies and try again

## Support

For detailed information, see:
- README.md - Project overview
- supabase/schema.sql - Database structure
- src/types/index.ts - TypeScript types

## Next Steps

1. ✅ Setup complete - You have a working voting system!
2. Customize the styling in `src/styles/globals.css`
3. Add your school logo and branding
4. Configure election settings
5. Import eligible voters
6. Go live!

---

**Need Help?**
- Check the README.md
- Review Supabase documentation: https://supabase.com/docs
- Check Next.js documentation: https://nextjs.org/docs
