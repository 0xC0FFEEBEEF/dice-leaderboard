# 🎲 The Dice King - DND Dice Leaderboard

A sleek, D&D-themed dice collection leaderboard website built with Cloudflare Workers. Track who has the most dice in your gaming group and compete for the title of **The Dice King**!

## 🌟 Features

- **Real-time Leaderboard**: See who's hoarding the most dice
- **Sleek DND Theme**: Beautiful dark theme with gold accents and D&D aesthetics
- **Easy Updates**: Players can update their own dice counts
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Fast & Scalable**: Built on Cloudflare Workers for lightning-fast performance worldwide

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- A [Cloudflare account](https://dash.cloudflare.com/sign-up) (free tier works great!)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/0xC0FFEEBEEF/dice-leaderboard.git
   cd dice-leaderboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run locally**
   ```bash
   npm run dev
   ```
   
   The site will be available at `http://localhost:8787`

4. **Deploy to Cloudflare Workers**
   ```bash
   npm run deploy
   ```

## 📖 Usage

### Viewing the Leaderboard

Simply visit the website at `thediceking.net` (or your deployed URL). The leaderboard automatically displays all players sorted by dice count.

### Updating Your Dice Count

1. Scroll to the "Update Your Dice Count" section
2. Enter your player name
3. Enter your current dice count
4. Click "Update Count"
5. Watch your position on the leaderboard!

## 🛠️ Configuration

### Customizing the Site

- **Edit `src/index.js`** to modify the leaderboard logic, styling, or add features
- **Update `wrangler.toml`** to change the worker name or configuration
- **Modify the initial leaderboard data** in the `leaderboard` array at the top of `src/index.js`

### Adding Persistent Storage

The current implementation uses in-memory storage (data resets when the worker restarts). For production use, consider:

1. **Cloudflare KV**: For simple key-value storage
2. **Cloudflare D1**: For a full SQL database
3. **Durable Objects**: For real-time updates and complex state management

## 🎨 Customization

### Changing Colors

The main theme colors are defined in the CSS:
- Gold/Brass: `#d4af37`
- Teal: `#4ecdc4`
- Dark Blue: `#1a1a2e`, `#16213e`, `#0f3460`

### Adding Features

Some ideas for enhancements:
- Add dice type breakdown (d4, d6, d8, d10, d12, d20)
- Include photos or avatars
- Add achievement badges
- Track dice acquisition history
- Add authentication for secure updates

## 📝 API Endpoints

- **GET `/api/leaderboard`**: Returns the current leaderboard as JSON
- **POST `/api/update`**: Updates a player's dice count
  ```json
  {
    "name": "Player Name",
    "diceCount": 42
  }
  ```

## 🤝 Contributing

Feel free to submit issues, fork the repository, and create pull requests for any improvements!

## 📄 License

MIT License - feel free to use this for your own gaming group!

## 🎲 Roll for Initiative!

May the dice be ever in your favor! 👑