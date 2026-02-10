# MoodCompass

AI-powered mood tracking and insights for bipolar disorder management.

## Features

- **Mood Tracking** — Log mood, energy, anxiety, irritability, and sleep with visual charts
- **AI Insights** — Get personalized pattern analysis powered by Claude
- **Guided Journal** — Write journal entries with AI-generated prompts
- **Medication Tracker** — Track medications and log adherence
- **Crisis Support** — Persistent 988 Suicide & Crisis Lifeline banner

## Tech Stack

- [Next.js](https://nextjs.org/) 15 (App Router)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- [Drizzle ORM](https://orm.drizzle.team/) + [Supabase](https://supabase.com/) (PostgreSQL)
- [NextAuth.js](https://authjs.dev/) v5 (Credentials + Google OAuth)
- [Anthropic Claude API](https://docs.anthropic.com/) for AI features
- [Recharts](https://recharts.org/) for data visualization

## Getting Started

### Prerequisites

- Node.js 18+
- A Supabase project (free tier works)
- Anthropic API key (for AI features)

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/mood-compass.git
   cd mood-compass
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the environment file and fill in your values:
   ```bash
   cp .env.example .env.local
   ```

4. Push the database schema:
   ```bash
   npx drizzle-kit push
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/
│   ├── (auth)/          # Sign in / Sign up pages
│   ├── (dashboard)/     # Authenticated app pages
│   │   ├── mood/        # Mood tracking
│   │   ├── journal/     # Journal entries
│   │   ├── medications/ # Medication tracking
│   │   ├── insights/    # AI insights
│   │   └── settings/    # User settings
│   └── api/             # API routes
├── components/          # Reusable UI components
└── lib/                 # Database, auth, utilities
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## Disclaimer

MoodCompass is **not a replacement for professional medical care**. Always consult your healthcare provider about your treatment plan. If you are in crisis, call or text **988** (Suicide & Crisis Lifeline).

## License

This project is licensed under the [AGPL-3.0](LICENSE).
