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
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   ├── admin/
│   │   │   ├── page.tsx
│   │   │   └── elections/
│   │   │       ├── new/page.tsx
│   │   │       └── [id]/
│   │   │           ├── page.tsx
│   │   │           └── results/page.tsx
│   │   ├── vote/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   └── results/
│   │       ├── page.tsx
│   │       └── [id]/page.tsx
│   ├── components/
│   │   ├── auth/ProtectedRoute.tsx
│   │   ├── admin/
│   │   │   ├── ElectionList.tsx
│   │   │   ├── CreateElectionForm.tsx
│   │   │   ├── AddPositionForm.tsx
│   │   │   ├── AddCandidateForm.tsx
│   │   │   └── ElectionStatus.tsx
│   │   ├── voter/VotingCard.tsx
│   │   └── common/
│   │       ├── Header.tsx
│   │       ├── LoadingSpinner.tsx
│   │       ├── ErrorMessage.tsx
│   │       └── SuccessMessage.tsx
│   ├── lib/
│   │   ├── supabase.ts
│   │   ├── auth.ts
│   │   └── utils.ts
│   ├── types/index.ts
│   ├── hooks/useAuth.ts
│   └── styles/globals.css
├── supabase/schema.sql
├── public/
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
├── .env.example
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

## API Routes

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Elections (Admin)
- `POST /api/elections` - Create election
- `GET /api/elections` - List elections
- `PATCH /api/elections/:id` - Update election
- `POST /api/elections/:id/positions` - Add position
- `POST /api/elections/:id/positions/:posId/candidates` - Add candidate
- `PATCH /api/elections/:id/status` - Update election status

### Voting (Student)
- `GET /api/elections/:id` - Get election details
- `POST /api/elections/:id/vote` - Submit vote
- `GET /api/elections/:id/results` - Get results

## Deployment

### Deploy to Cloudflare Pages

1. Connect your GitHub repository
2. Build command: `npm run build`
3. Build output: `.next`
4. Environment variables in Cloudflare dashboard

### Deploy to Vercel

1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect Next.js configuration
3. Add environment variables in Vercel dashboard
4. Deploy

## Security Features

- ✅ User authentication via Supabase
- ✅ One vote per student enforcement (database constraints)
- ✅ Vote encryption
- ✅ Audit logging
- ✅ Admin role verification
- ✅ Election state validation
- ✅ Rate limiting on vote submission
- ✅ Voter privacy (no personal data in vote records)
- ✅ Role-based access control (RBAC)
- ✅ Row-level security (RLS) in database

## Usage

### Admin Workflow
1. Create account as admin
2. Login with admin credentials
3. Create election
4. Add positions and candidates
5. Register eligible voters
6. Open voting
7. Monitor voting progress
8. Close voting
9. View results

### Voter Workflow
1. Create account as student
2. Login with student credentials
3. View available elections
4. View candidates per position
5. Cast votes
6. Receive confirmation
7. View results after voting closes

## Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

## Troubleshooting

### Authentication Issues
- Ensure Supabase URL and keys are correct
- Check that user email is confirmed in Supabase
- Verify CORS settings in Supabase dashboard

### Database Issues
- Ensure schema is properly initialized
- Check that RLS policies are enabled
- Verify database migrations are up to date

### Voting Issues
- Ensure user is marked as eligible voter
- Check election status is "ongoing"
- Verify current time is within voting window

## License

MIT License - See LICENSE file for details

## Support

For issues or questions, please create an issue on GitHub or contact the development team.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Authors

- Damas Ntuluanta - Initial work

## Acknowledgments

- Supabase for backend infrastructure
- Next.js for the React framework
- Tailwind CSS for styling
- Recharts for data visualization
