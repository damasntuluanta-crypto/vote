# Secondary School Vote Management System

A secure, modern voting system for secondary schools built with Next.js, Supabase, and Cloudflare.

## Features

- 🔐 Secure authentication system
- 🗳️ One vote per eligible student enforcement
- 📊 Real-time vote counting and results
- 👨‍💼 Admin dashboard for election management
- 📋 Candidate registration system
- 🎯 Position-based voting
- 🔒 Voter privacy protection
- 📈 Results visualization
- 🛡️ Vote validation and security

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Hosting**: Cloudflare Pages
- **Charts**: Recharts for result visualization
- **Notifications**: React Hot Toast

## Project Structure

```
vote/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── login/
│   │   ├── admin/
│   │   ├── vote/
│   │   └── results/
│   ├── components/
│   │   ├── auth/
│   │   ├── admin/
│   │   ├── voter/
│   │   ├── common/
│   │   └── results/
│   ├── lib/
│   │   ├── supabase.ts
│   │   ├── auth.ts
│   │   └── utils.ts
│   ├── types/
│   │   └── index.ts
│   ├── hooks/
│   │   └── useAuth.ts
│   └── styles/
│       └── globals.css
├── public/
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.js
└── README.md
```

## Setup Instructions

### 1. Clone Repository
```bash
git clone https://github.com/damasntuluanta-crypto/vote.git
cd vote
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Supabase

1. Create a Supabase project at https://supabase.com
2. Run the SQL schema (see `supabase/schema.sql`)
3. Copy your project URL and API keys
4. Create `.env.local` file:

```
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key
```

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Database Schema

See `supabase/schema.sql` for complete database structure

### Main Tables
- `users` - Student/admin accounts
- `elections` - Election events
- `positions` - Election positions
- `candidates` - Candidate information
- `votes` - Vote records
- `audit_logs` - Security audit trail

## Deployment

### Deploy to Cloudflare Pages

1. Connect your GitHub repository
2. Build command: `npm run build`
3. Build output: `.next`
4. Environment variables in Cloudflare dashboard

## Security Features

- ✅ User authentication via Supabase
- ✅ One vote per student enforcement (database constraints)
- ✅ Vote encryption
- ✅ Audit logging
- ✅ Admin role verification
- ✅ Election state validation
- ✅ Rate limiting on vote submission
- ✅ Voter privacy (no personal data in vote records)

## Usage

### Admin Workflow
1. Login with admin credentials
2. Create election
3. Add positions
4. Register candidates
5. Register eligible voters
6. Open voting
7. Monitor voting progress
8. Close voting
9. View results

### Voter Workflow
1. Login with student ID
2. View available elections
3. View candidates per position
4. Cast votes
5. Receive confirmation
6. View results after voting closes

## License

MIT License - See LICENSE file

## Support

For issues or questions, contact the development team.
