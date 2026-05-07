# 🎲 The Dice King - Dice Bag Leaderboard

A polished, D&D-themed leaderboard for tracking dice bag collections in a tabletop group. The project is built as a single Cloudflare Worker that serves a responsive web app and JSON API backed by Cloudflare KV.

## ✨ What is included

- **Hero-first landing page** with animated dice artwork, sticky navigation, and high-impact tabletop styling.
- **Live stats** for registered players, total tracked dice bags, and the current leader.
- **Crowned top-three podium** plus a full searchable leaderboard.
- **Account flows** for registration, login, logout, and authenticated dice bag updates.
- **Rank tiers** that label players as Initiate, Adventurer, Dice Dragon, or Dice Monarch.
- **Starter leaderboard data** so new deployments do not look empty before the first account is created.
- **Cloudflare KV persistence** for users, sessions, and dice bag counts.

## 🚀 Quick start

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

## 🧭 User flow

1. Visit the site and review the top-three podium or full rankings.
2. Create an account with a display name, email, and password.
3. Enter the number of dice bags you own.
4. Search the leaderboard to compare your rank with the rest of the table.
5. Log back in later to update your total as your hoard grows.

## 📝 API endpoints

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

## 🛠️ Configuration

The Worker expects a KV namespace bound as `DICE_KV`. The included `wrangler.toml` already declares that binding for deployment.

To customize the page, edit `src/index.js`. The application HTML, CSS, client-side JavaScript, API handlers, session helpers, and starter leaderboard data all live there.

## 🎨 Theme notes

The design uses a dark fantasy palette with gold, teal, violet, and rose accents. Rank tiers currently follow these ranges:

- **Initiate:** 0–4 bags
- **Adventurer:** 5–9 bags
- **Dice Dragon:** 10–19 bags
- **Dice Monarch:** 20+ bags

## 📄 License

MIT License. Roll boldly and guard your dice hoard well.
