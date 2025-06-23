# Secrets & API Key Management

## Best Practices
- **Never** hardcode secrets in code or commit them to version control.
- Use a `.env` file for local development (add `.env` to `.gitignore`).
- Set secrets in your deployment platform's environment variable settings for production (e.g., Vercel, Docker, CI/CD).
- Rotate secrets regularly and immediately if exposed.
- Only access secrets via `process.env` in server-side code.
- Document all required secrets for developers and ops.

## Required Secrets
- `DATABASE_URL`: Database connection string (e.g., SQLite, PostgreSQL, MySQL)
- `NEXTAUTH_SECRET`: Random string for NextAuth session encryption
- `OPENAI_API_KEY`: OpenAI API key for AI features
- `ANTHROPIC_API_KEY`: Anthropic API key for AI features
- `FACEBOOK_CLIENT_ID` / `FACEBOOK_CLIENT_SECRET`: Facebook OAuth
- `TWITTER_CLIENT_ID` / `TWITTER_CLIENT_SECRET`: Twitter OAuth
- `LINKEDIN_CLIENT_ID` / `LINKEDIN_CLIENT_SECRET`: LinkedIn OAuth

## Local Development
1. Copy `.env.example` to `.env` and fill in your secrets.
2. Never commit `.env` to git.

## Production
- Set all secrets in your cloud provider's environment variable settings.
- Use a secret manager (AWS Secrets Manager, HashiCorp Vault, etc.) for advanced security.

## Startup Checks
- The app will throw a clear error if any required secret is missing at startup.

## Example `.env`
```
DATABASE_URL="sqlite:./dev.db"
NEXTAUTH_SECRET="your-random-secret"
OPENAI_API_KEY="sk-..."
ANTHROPIC_API_KEY="sk-..."
FACEBOOK_CLIENT_ID="..."
FACEBOOK_CLIENT_SECRET="..."
TWITTER_CLIENT_ID="..."
TWITTER_CLIENT_SECRET="..."
LINKEDIN_CLIENT_ID="..."
LINKEDIN_CLIENT_SECRET="..."
``` 