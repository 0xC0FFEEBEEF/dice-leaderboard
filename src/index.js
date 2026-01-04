// In-memory leaderboard storage (for production, consider using Cloudflare KV or D1)
let leaderboard = [
  { name: "Gandalf the Grey", diceCount: 127, lastUpdated: new Date().toISOString() },
  { name: "Aragorn", diceCount: 89, lastUpdated: new Date().toISOString() },
  { name: "Legolas", diceCount: 76, lastUpdated: new Date().toISOString() },
  { name: "Gimli", diceCount: 64, lastUpdated: new Date().toISOString() },
  { name: "Frodo", diceCount: 42, lastUpdated: new Date().toISOString() }
];

// HTML Template for the website
const HTML_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>The Dice King - DND Dice Leaderboard</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Georgia', serif;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
            color: #e4e4e4;
            min-height: 100vh;
            padding: 20px;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
        }

        header {
            text-align: center;
            padding: 40px 20px;
            background: rgba(0, 0, 0, 0.3);
            border-radius: 20px;
            margin-bottom: 40px;
            border: 2px solid #d4af37;
            box-shadow: 0 10px 40px rgba(212, 175, 55, 0.3);
        }

        h1 {
            font-size: 3.5em;
            color: #d4af37;
            text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.8);
            margin-bottom: 10px;
            font-weight: bold;
            letter-spacing: 2px;
        }

        .subtitle {
            font-size: 1.3em;
            color: #c0c0c0;
            font-style: italic;
            margin-top: 10px;
        }

        .crown {
            font-size: 2em;
            animation: float 3s ease-in-out infinite;
        }

        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
        }

        .leaderboard {
            background: rgba(0, 0, 0, 0.4);
            border-radius: 15px;
            padding: 30px;
            border: 2px solid #d4af37;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
        }

        .leaderboard-header {
            display: grid;
            grid-template-columns: 80px 1fr 150px 200px;
            padding: 15px 20px;
            background: rgba(212, 175, 55, 0.2);
            border-radius: 10px;
            margin-bottom: 20px;
            font-weight: bold;
            font-size: 1.1em;
            color: #d4af37;
        }

        .player-row {
            display: grid;
            grid-template-columns: 80px 1fr 150px 200px;
            padding: 20px;
            background: rgba(255, 255, 255, 0.05);
            margin-bottom: 15px;
            border-radius: 10px;
            transition: all 0.3s ease;
            border: 2px solid transparent;
            align-items: center;
        }

        .player-row:hover {
            background: rgba(212, 175, 55, 0.1);
            border-color: #d4af37;
            transform: translateX(10px);
        }

        .rank {
            font-size: 2em;
            font-weight: bold;
            color: #d4af37;
        }

        .rank-1 { color: #FFD700; text-shadow: 0 0 10px #FFD700; }
        .rank-2 { color: #C0C0C0; text-shadow: 0 0 10px #C0C0C0; }
        .rank-3 { color: #CD7F32; text-shadow: 0 0 10px #CD7F32; }

        .player-name {
            font-size: 1.3em;
            font-weight: bold;
        }

        .dice-count {
            font-size: 1.5em;
            color: #4ecdc4;
            font-weight: bold;
        }

        .dice-icon {
            margin-right: 8px;
        }

        .last-updated {
            color: #888;
            font-size: 0.9em;
        }

        .add-section {
            margin-top: 40px;
            padding: 30px;
            background: rgba(0, 0, 0, 0.4);
            border-radius: 15px;
            border: 2px solid #4ecdc4;
        }

        .add-section h2 {
            color: #4ecdc4;
            margin-bottom: 20px;
            font-size: 2em;
        }

        .form-group {
            margin-bottom: 20px;
        }

        .form-group label {
            display: block;
            margin-bottom: 8px;
            color: #d4af37;
            font-weight: bold;
        }

        .form-group input {
            width: 100%;
            padding: 12px;
            border-radius: 8px;
            border: 2px solid #d4af37;
            background: rgba(255, 255, 255, 0.1);
            color: #fff;
            font-size: 1.1em;
        }

        .form-group input:focus {
            outline: none;
            border-color: #4ecdc4;
            box-shadow: 0 0 10px rgba(78, 205, 196, 0.5);
        }

        .btn {
            padding: 15px 40px;
            background: linear-gradient(135deg, #d4af37 0%, #f4d03f 100%);
            color: #1a1a2e;
            border: none;
            border-radius: 8px;
            font-size: 1.2em;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
            text-transform: uppercase;
        }

        .btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 20px rgba(212, 175, 55, 0.4);
        }

        .message {
            margin-top: 20px;
            padding: 15px;
            border-radius: 8px;
            display: none;
        }

        .message.success {
            background: rgba(78, 205, 196, 0.2);
            border: 2px solid #4ecdc4;
            color: #4ecdc4;
        }

        .message.error {
            background: rgba(255, 71, 87, 0.2);
            border: 2px solid #ff4757;
            color: #ff4757;
        }

        @media (max-width: 768px) {
            h1 { font-size: 2em; }
            .leaderboard-header, .player-row {
                grid-template-columns: 60px 1fr 100px;
            }
            .last-updated { display: none; }
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <div class="crown">👑</div>
            <h1>🎲 The Dice King 🎲</h1>
            <p class="subtitle">May the Most Hoarding Dragon Win</p>
        </header>

        <div class="leaderboard">
            <div class="leaderboard-header">
                <div>Rank</div>
                <div>Player</div>
                <div>Dice Count</div>
                <div>Last Updated</div>
            </div>
            <div id="leaderboard-content">
                <!-- Players will be inserted here -->
            </div>
        </div>

        <div class="add-section">
            <h2>⚔️ Update Your Dice Count</h2>
            <form id="updateForm">
                <div class="form-group">
                    <label for="playerName">Player Name</label>
                    <input type="text" id="playerName" name="playerName" required placeholder="Enter your name">
                </div>
                <div class="form-group">
                    <label for="diceCount">Dice Count</label>
                    <input type="number" id="diceCount" name="diceCount" required placeholder="How many dice do you own?" min="0">
                </div>
                <button type="submit" class="btn">Update Count</button>
            </form>
            <div id="message" class="message"></div>
        </div>
    </div>

    <script>
        // Fetch and display leaderboard
        async function loadLeaderboard() {
            try {
                const response = await fetch('/api/leaderboard');
                const data = await response.json();
                displayLeaderboard(data);
            } catch (error) {
                console.error('Error loading leaderboard:', error);
            }
        }

        function displayLeaderboard(players) {
            const container = document.getElementById('leaderboard-content');
            container.innerHTML = players.map((player, index) => {
                const rank = index + 1;
                const rankClass = \`rank-\${rank}\`;
                const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : '';
                const date = new Date(player.lastUpdated).toLocaleDateString();
                
                return \`
                    <div class="player-row">
                        <div class="rank \${rank <= 3 ? rankClass : ''}">\${medal || rank}</div>
                        <div class="player-name">\${escapeHtml(player.name)}</div>
                        <div class="dice-count"><span class="dice-icon">🎲</span>\${player.diceCount}</div>
                        <div class="last-updated">\${date}</div>
                    </div>
                \`;
            }).join('');
        }

        function escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }

        function showMessage(text, type) {
            const messageEl = document.getElementById('message');
            messageEl.textContent = text;
            messageEl.className = \`message \${type}\`;
            messageEl.style.display = 'block';
            setTimeout(() => {
                messageEl.style.display = 'none';
            }, 5000);
        }

        // Handle form submission
        document.getElementById('updateForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(e.target);
            const data = {
                name: formData.get('playerName'),
                diceCount: parseInt(formData.get('diceCount'))
            };

            try {
                const response = await fetch('/api/update', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.json();
                
                if (response.ok) {
                    showMessage('Dice count updated successfully! 🎲', 'success');
                    loadLeaderboard();
                    e.target.reset();
                } else {
                    showMessage(result.error || 'Failed to update dice count', 'error');
                }
            } catch (error) {
                showMessage('Error updating dice count. Please try again.', 'error');
                console.error('Error:', error);
            }
        });

        // Load leaderboard on page load
        loadLeaderboard();
    </script>
</body>
</html>
`;

// Helper function to handle CORS
function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

// API Handlers
async function handleGetLeaderboard() {
  // Sort by dice count descending
  const sortedLeaderboard = [...leaderboard].sort((a, b) => b.diceCount - a.diceCount);
  
  return new Response(JSON.stringify(sortedLeaderboard), {
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders()
    }
  });
}

async function handleUpdateDiceCount(request) {
  try {
    const data = await request.json();
    const { name, diceCount } = data;

    // Validation
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return new Response(JSON.stringify({ error: 'Invalid player name' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders()
        }
      });
    }

    if (typeof diceCount !== 'number' || diceCount < 0) {
      return new Response(JSON.stringify({ error: 'Invalid dice count' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders()
        }
      });
    }

    // Find existing player or create new entry
    const existingPlayerIndex = leaderboard.findIndex(
      p => p.name.toLowerCase() === name.trim().toLowerCase()
    );

    if (existingPlayerIndex !== -1) {
      leaderboard[existingPlayerIndex].diceCount = diceCount;
      leaderboard[existingPlayerIndex].lastUpdated = new Date().toISOString();
    } else {
      leaderboard.push({
        name: name.trim(),
        diceCount: diceCount,
        lastUpdated: new Date().toISOString()
      });
    }

    return new Response(JSON.stringify({ success: true, message: 'Dice count updated' }), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders()
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Invalid request data' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders()
      }
    });
  }
}

// Main request handler
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: corsHeaders()
      });
    }

    // API Routes
    if (path === '/api/leaderboard' && request.method === 'GET') {
      return handleGetLeaderboard();
    }

    if (path === '/api/update' && request.method === 'POST') {
      return handleUpdateDiceCount(request);
    }

    // Serve HTML for all other routes
    return new Response(HTML_TEMPLATE, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8'
      }
    });
  }
};
