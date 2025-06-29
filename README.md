# Updated at 06/19/2025 21:45:55

# Social Media AI Manager

## Secure Management of API Keys and Secrets

All sensitive credentials (API keys, secrets, OAuth client IDs/secrets, database URLs) must be managed via environment variables. Never hardcode secrets in the codebase or commit them to version control.

### Required Environment Variables
- `DATABASE_URL`: Database connection string
- `NEXTAUTH_SECRET`: NextAuth session secret
- `OPENAI_API_KEY`: OpenAI integration
- `ANTHROPIC_API_KEY`: Anthropic integration
- `FACEBOOK_CLIENT_ID` / `FACEBOOK_CLIENT_SECRET`: Facebook API
- `TWITTER_CLIENT_ID` / `TWITTER_CLIENT_SECRET`: Twitter API
- `LINKEDIN_CLIENT_ID` / `LINKEDIN_CLIENT_SECRET`: LinkedIn API

See [docs/SECRETS.md](docs/SECRETS.md) for full details and best practices.

## Setup

## CI/CD

This project uses GitHub Actions for continuous integration and deployment. On every push or pull request to `master` or `main`, the following steps run:
- Lint
- Build
- (Optional) Test
- Deploy to Vercel (if secrets are set)

See `.github/workflows/ci-cd.yml` for details.

### Required GitHub Secrets for Deployment
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

## Monitoring & Logging

- **Error Logging:**
  - Uses a logger utility (`lib/logger.ts`).
  - In production, integrate with Sentry or another error monitoring service.
  - In development, logs errors to the console.
- **Uptime Monitoring:**
  - Use Vercel analytics or an external service (UptimeRobot, Better Uptime, etc.) for endpoint monitoring.

### Sentry Integration (Recommended)
1. Install Sentry: `pnpm add @sentry/nextjs`
2. Run: `npx @sentry/wizard -i nextjs`
3. Add your Sentry DSN to your `.env` and Vercel/production environment.
4. Replace the TODO in `lib/logger.ts` with Sentry integration code.
