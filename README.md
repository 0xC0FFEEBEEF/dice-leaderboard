# The Dice King - Dice Bag Leaderboard

A clean, production-ready leaderboard for tracking dice bag collections in a tabletop group. The app is a single Cloudflare Worker that serves the webpage and a JSON API backed by Cloudflare KV.

## What is included

- **Readable, restrained interface** with a ledger-inspired layout, neutral colors, and minimal decoration.
- **Top-three podium and full leaderboard** for quick table checks.
- **Search** by player name, rank, or rank tier.
- **Account flows** for registration, login, logout, and authenticated dice bag updates.
- **Persistent Cloudflare KV storage** for users, sessions, and dice bag totals.
- **Starter leaderboard data** so first-time deployments do not look broken before accounts are created.
- **Server-side validation** for account input and dice bag counts.
- **PBKDF2-SHA256 password hashing** for newly created accounts, with legacy hash migration on login.
- **Baseline security headers** on HTML and JSON responses.

## Quick start

### Prerequisites

- [Node.js](https://nodejs.org/) v16 or newer
- npm
- A Cloudflare account for deployment

### Install and run locally

```bash
npm install
npm run dev
```

The local Worker will be available at `http://localhost:8787`.

### Deploy

```bash
npm run deploy
```

## User flow

1. Review the top-three collectors or the full leaderboard.
2. Create an account with a display name, email, and password.
3. Enter the number of dice bags you own.
4. Search the board to compare your rank with the group.
5. Sign in later to update your count.

## API endpoints

- `GET /api/leaderboard` returns ranked public leaderboard entries.
- `POST /api/register` creates an account and starts a session.
- `POST /api/login` starts a session for an existing account.
- `POST /api/logout` clears the active session.
- `GET /api/me` returns the authenticated user's public profile.
- `POST /api/update` updates the authenticated user's dice bag count.

Example update payload:

```json
{
  "bagCount": 42
}
```

## Configuration

The Worker expects a KV namespace bound as `DICE_KV`. The included `wrangler.toml` already declares that binding for deployment.

Most customization lives in `src/index.js`, including the served HTML, CSS, client-side JavaScript, API handlers, session helpers, and starter leaderboard entries.

## Rank tiers

- **Initiate:** 0-4 bags
- **Adventurer:** 5-9 bags
- **Dice Dragon:** 10-19 bags
- **Dice Monarch:** 20+ bags

## License

MIT License.
