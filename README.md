# Partnerz.ai - SaaS Affiliate Network PWA

A modern Progressive Web App (PWA) for connecting SaaS companies with affiliate partners. Built with Next.js, Supabase, and Tailwind CSS.

## Features

- 🔐 **Authentication**: Email/Password and Google OAuth via Supabase
- 👥 **Dual User Flows**: Separate dashboards for SaaS providers and Affiliates
- 📊 **Analytics Dashboard**: Track revenue, partners, conversions, and performance
- 💬 **Real-time Chat**: Communication between SaaS and affiliates
- 🔍 **Marketplace**: Find partners or SaaS programs
- ⚙️ **Settings**: Manage profiles and preferences
- 📱 **PWA Support**: Installable on desktop and mobile
- 🎨 **Premium Dark UI**: Modern gradient design with purple/indigo theme

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Authentication & Database**: Supabase
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI, Lucide Icons
- **PWA**: next-pwa

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase account and project

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd temp-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Set up the database:
- Go to your Supabase project
- Navigate to the SQL Editor
- Run the SQL script from `supabase/schema.sql`

5. Run the development server:
```bash
npm run dev -- --webpack
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
temp-app/
├── src/
│   ├── app/
│   │   ├── saas/          # SaaS provider pages
│   │   ├── affiliate/     # Affiliate pages
│   │   └── layout.tsx     # Root layout
│   ├── components/
│   │   ├── auth/          # Authentication components
│   │   ├── dashboard/     # Dashboard components
│   │   └── ui/            # Reusable UI components
│   ├── context/           # React contexts (Auth)
│   └── lib/               # Utilities and configs
├── supabase/
│   └── schema.sql         # Database schema
└── public/                # Static assets
```

## User Flows

### SaaS Provider Flow
1. Sign up/Login at `/saas/login`
2. Access dashboard at `/saas/dashboard`
3. Find affiliates at `/saas/marketplace`
4. Chat with partners at `/saas/chat`
5. Manage settings at `/saas/settings`

### Affiliate Flow
1. Sign up/Login at `/affiliate/login`
2. Access dashboard at `/affiliate/dashboard`
3. Find SaaS programs at `/affiliate/marketplace`
4. Chat with SaaS providers at `/affiliate/chat`
5. Manage settings at `/affiliate/settings`

## Database Schema

The app uses Supabase with the following main tables:
- `profiles` - User profiles with role (saas/affiliate)
- `saas_companies` - SaaS company details
- `partners` - Affiliate partner details
- `partnerships` - Connections between SaaS and affiliates
- `messages` - Chat messages

All tables have Row Level Security (RLS) enabled.

## Building for Production

```bash
npm run build -- --webpack
npm start
```

## PWA Features

The app is installable as a PWA with:
- Offline support
- App manifest
- Service worker
- Custom icons

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
