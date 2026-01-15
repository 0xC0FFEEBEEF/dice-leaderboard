const SESSION_COOKIE = "dice_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

// HTML Template for the website
const HTML_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>The Dice King - DND Dice Leaderboard</title>
    <style>
        :root {
            color-scheme: dark;
            --bg-primary: #0b0f1c;
            --bg-secondary: #131a2b;
            --panel: rgba(19, 26, 43, 0.8);
            --panel-soft: rgba(11, 15, 28, 0.7);
            --accent-gold: #f7c948;
            --accent-teal: #4ecdc4;
            --accent-purple: #8b5cf6;
            --text-main: #e6eaf2;
            --text-muted: #a3acc2;
            --border-soft: rgba(247, 201, 72, 0.3);
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
            background: radial-gradient(circle at top, #1c2544 0%, #0b0f1c 45%, #06070d 100%);
            color: var(--text-main);
            min-height: 100vh;
        }

        a {
            color: inherit;
            text-decoration: none;
        }

        .page {
            max-width: 1200px;
            margin: 0 auto;
            padding: 24px 20px 80px;
        }

        .nav {
            position: sticky;
            top: 16px;
            z-index: 10;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 16px 24px;
            background: rgba(11, 15, 28, 0.8);
            border-radius: 18px;
            border: 1px solid rgba(255, 255, 255, 0.08);
            backdrop-filter: blur(12px);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.35);
            margin-bottom: 40px;
        }

        .nav-brand {
            display: flex;
            align-items: center;
            gap: 12px;
            font-weight: 700;
            letter-spacing: 0.5px;
        }

        .nav-links {
            display: flex;
            align-items: center;
            gap: 16px;
            font-size: 0.95em;
        }

        .nav-link {
            padding: 10px 16px;
            border-radius: 999px;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid transparent;
            transition: all 0.25s ease;
        }

        .nav-link:hover {
            border-color: var(--border-soft);
            background: rgba(247, 201, 72, 0.08);
            color: var(--accent-gold);
        }

        .nav-link.external {
            background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(78, 205, 196, 0.15));
            border: 1px solid rgba(139, 92, 246, 0.4);
        }

        header {
            padding: 40px;
            border-radius: 26px;
            background: linear-gradient(145deg, rgba(19, 26, 43, 0.9), rgba(11, 15, 28, 0.95));
            border: 1px solid rgba(247, 201, 72, 0.2);
            box-shadow: 0 30px 60px rgba(0, 0, 0, 0.4);
            text-align: left;
            display: grid;
            gap: 16px;
            margin-bottom: 40px;
        }

        .hero-title {
            font-size: clamp(2rem, 3vw, 3.2rem);
            color: var(--accent-gold);
            letter-spacing: 1px;
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .hero-subtitle {
            font-size: 1.1rem;
            color: var(--text-muted);
            max-width: 640px;
        }

        .hero-actions {
            display: flex;
            flex-wrap: wrap;
            gap: 16px;
        }

        .button {
            padding: 12px 24px;
            border-radius: 12px;
            border: 1px solid transparent;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            cursor: pointer;
            transition: all 0.25s ease;
        }

        .button.primary {
            background: linear-gradient(135deg, #f7c948 0%, #f59f0b 100%);
            color: #120c05;
        }

        .button.secondary {
            background: rgba(78, 205, 196, 0.2);
            color: var(--accent-teal);
            border-color: rgba(78, 205, 196, 0.6);
        }

        .button:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 24px rgba(0, 0, 0, 0.35);
        }

        .section {
            margin-top: 40px;
        }

        .auth-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
            gap: 20px;
        }

        .auth-card {
            padding: 24px;
            border-radius: 18px;
            background: rgba(19, 26, 43, 0.85);
            border: 1px solid rgba(255, 255, 255, 0.08);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            display: grid;
            gap: 16px;
        }

        .auth-card h3 {
            font-size: 1.3rem;
            color: var(--accent-gold);
        }

        .auth-card p {
            color: var(--text-muted);
            font-size: 0.95rem;
        }

        .auth-status {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 8px 12px;
            border-radius: 999px;
            background: rgba(78, 205, 196, 0.2);
            border: 1px solid rgba(78, 205, 196, 0.4);
            color: var(--accent-teal);
            font-weight: 600;
            font-size: 0.9rem;
        }

        .muted {
            color: var(--text-muted);
        }

        .section-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 20px;
        }

        .section-title {
            font-size: 1.6rem;
            color: var(--text-main);
        }

        .section-subtitle {
            color: var(--text-muted);
        }

        .top-three {
            display: grid;
            gap: 20px;
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        }

        .top-card {
            padding: 24px;
            border-radius: 18px;
            background: var(--panel);
            border: 1px solid rgba(255, 255, 255, 0.08);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            display: grid;
            gap: 12px;
            position: relative;
            overflow: hidden;
        }

        .top-card::after {
            content: "";
            position: absolute;
            inset: 0;
            background: radial-gradient(circle at top right, rgba(247, 201, 72, 0.2), transparent 60%);
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        .top-card:hover::after {
            opacity: 1;
        }

        .top-rank {
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--accent-gold);
        }

        .top-name {
            font-size: 1.2rem;
            font-weight: 600;
        }

        .top-dice {
            font-size: 1.4rem;
            color: var(--accent-teal);
            font-weight: 600;
        }

        .top-updated {
            font-size: 0.85rem;
            color: var(--text-muted);
        }

        .leaderboard {
            background: var(--panel-soft);
            border-radius: 20px;
            padding: 30px;
            border: 1px solid rgba(247, 201, 72, 0.2);
            box-shadow: 0 30px 50px rgba(0, 0, 0, 0.35);
        }

        .leaderboard-header {
            display: grid;
            grid-template-columns: 70px 1fr 140px 180px;
            padding: 12px 18px;
            background: rgba(247, 201, 72, 0.15);
            border-radius: 12px;
            margin-bottom: 16px;
            font-weight: 600;
            font-size: 0.95rem;
            color: var(--accent-gold);
        }

        .player-row {
            display: grid;
            grid-template-columns: 70px 1fr 140px 180px;
            padding: 16px 18px;
            background: rgba(255, 255, 255, 0.04);
            margin-bottom: 12px;
            border-radius: 12px;
            transition: all 0.25s ease;
            border: 1px solid transparent;
            align-items: center;
        }

        .player-row:hover {
            border-color: rgba(247, 201, 72, 0.4);
            background: rgba(247, 201, 72, 0.08);
            transform: translateX(6px);
        }

        .rank {
            font-size: 1.6rem;
            font-weight: 700;
            color: var(--accent-gold);
        }

        .rank-1 { color: #FFD700; text-shadow: 0 0 10px #FFD700; }
        .rank-2 { color: #C0C0C0; text-shadow: 0 0 10px #C0C0C0; }
        .rank-3 { color: #CD7F32; text-shadow: 0 0 10px #CD7F32; }

        .player-name {
            font-size: 1.1rem;
            font-weight: 600;
        }

        .dice-count {
            font-size: 1.3rem;
            color: var(--accent-teal);
            font-weight: 600;
        }

        .last-updated {
            color: var(--text-muted);
            font-size: 0.9rem;
        }

        .add-section {
            margin-top: 30px;
            padding: 28px;
            background: rgba(11, 15, 28, 0.8);
            border-radius: 18px;
            border: 1px solid rgba(78, 205, 196, 0.4);
        }

        .add-section h2 {
            color: var(--accent-teal);
            margin-bottom: 16px;
            font-size: 1.5rem;
        }

        .form-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 16px;
        }

        .form-group {
            display: grid;
            gap: 8px;
        }

        .form-group label {
            color: var(--text-muted);
            font-weight: 600;
            font-size: 0.95rem;
        }

        .form-group input {
            width: 100%;
            padding: 12px;
            border-radius: 12px;
            border: 1px solid rgba(247, 201, 72, 0.4);
            background: rgba(255, 255, 255, 0.06);
            color: var(--text-main);
            font-size: 1rem;
        }

        .form-group input:focus {
            outline: none;
            border-color: var(--accent-teal);
            box-shadow: 0 0 12px rgba(78, 205, 196, 0.3);
        }

        .btn {
            padding: 12px 28px;
            background: linear-gradient(135deg, #f7c948 0%, #f59f0b 100%);
            color: #120c05;
            border: none;
            border-radius: 12px;
            font-size: 1rem;
            font-weight: 700;
            cursor: pointer;
            text-transform: uppercase;
            transition: all 0.25s ease;
            justify-self: start;
        }

        .btn.secondary {
            background: rgba(139, 92, 246, 0.2);
            border: 1px solid rgba(139, 92, 246, 0.6);
            color: #d9c8ff;
        }

        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(247, 201, 72, 0.35);
        }

        .message {
            margin-top: 16px;
            padding: 12px 16px;
            border-radius: 10px;
            display: none;
            font-weight: 600;
        }

        .message.success {
            background: rgba(78, 205, 196, 0.2);
            border: 1px solid #4ecdc4;
            color: #4ecdc4;
        }

        .message.error {
            background: rgba(255, 71, 87, 0.2);
            border: 1px solid #ff4757;
            color: #ff4757;
        }

        .footer-note {
            margin-top: 30px;
            color: var(--text-muted);
            font-size: 0.9rem;
            text-align: center;
        }

        @media (max-width: 900px) {
            .leaderboard-header, .player-row {
                grid-template-columns: 50px 1fr 120px;
            }
            .last-updated {
                display: none;
            }
        }

        @media (max-width: 700px) {
            .nav {
                flex-direction: column;
                gap: 12px;
                position: static;
            }
            header {
                padding: 28px;
            }
        }
    </style>
</head>
<body>
    <div class="page">
        <nav class="nav">
            <div class="nav-brand">👑 The Dice King</div>
            <div class="nav-links">
                <a class="nav-link" href="#top-three">Top 3</a>
                <a class="nav-link" href="#full-leaderboard">Full Leaderboard</a>
                <a class="nav-link external" href="https://5e.thediceking.net" target="_blank" rel="noreferrer">5e Tools</a>
            </div>
        </nav>

        <header>
            <div class="hero-title">🎲 The Dice King Leaderboard</div>
            <p class="hero-subtitle">
                Track the mightiest hoarders of polyhedral treasure. The main hall showcases the top three dice dragons,
                with the full rankings just one click away.
            </p>
            <div class="hero-actions">
                <a class="button primary" href="#top-three">See the Crowned 3</a>
                <a class="button secondary" href="#full-leaderboard">View Full Board</a>
            </div>
        </header>

        <section id="top-three" class="section">
            <div class="section-header">
                <div>
                    <h2 class="section-title">Crowned Top 3</h2>
                    <p class="section-subtitle">The current champions of the dice vault.</p>
                </div>
            </div>
            <div id="top-three-content" class="top-three">
                <!-- Top three cards will be inserted here -->
            </div>
        </section>

        <section id="account" class="section">
            <div class="section-header">
                <div>
                    <h2 class="section-title">Account Hall</h2>
                    <p class="section-subtitle">Create an account to track your dice bags and edit your count anytime.</p>
                </div>
            </div>
            <div class="auth-grid">
                <div class="auth-card" id="auth-forms">
                    <div>
                        <h3>Create Account</h3>
                        <p>New here? Claim your vault with an email and password.</p>
                    </div>
                    <form id="registerForm" class="form-grid">
                        <div class="form-group">
                            <label for="registerName">Display Name</label>
                            <input type="text" id="registerName" name="displayName" required placeholder="Dice master name">
                        </div>
                        <div class="form-group">
                            <label for="registerEmail">Email</label>
                            <input type="email" id="registerEmail" name="email" required placeholder="you@domain.com">
                        </div>
                        <div class="form-group">
                            <label for="registerPassword">Password</label>
                            <input type="password" id="registerPassword" name="password" required minlength="8" placeholder="At least 8 characters">
                        </div>
                        <button type="submit" class="btn">Create Account</button>
                    </form>
                    <div>
                        <h3>Returning Player</h3>
                        <p>Log in to update your dice bag count.</p>
                    </div>
                    <form id="loginForm" class="form-grid">
                        <div class="form-group">
                            <label for="loginEmail">Email</label>
                            <input type="email" id="loginEmail" name="email" required placeholder="you@domain.com">
                        </div>
                        <div class="form-group">
                            <label for="loginPassword">Password</label>
                            <input type="password" id="loginPassword" name="password" required placeholder="Your password">
                        </div>
                        <button type="submit" class="btn secondary">Log In</button>
                    </form>
                    <div id="auth-message" class="message"></div>
                </div>

                <div class="auth-card auth-status" id="account-panel" hidden>
                    <div class="badge">✅ Logged In</div>
                    <div>
                        <p class="muted">Signed in as</p>
                        <strong id="account-name"></strong>
                        <div class="muted" id="account-email"></div>
                    </div>
                    <div>
                        <p class="muted">Your dice bags</p>
                        <div class="top-dice" id="account-bags">0</div>
                    </div>
                    <button type="button" class="btn secondary" id="logoutButton">Log Out</button>
                    <div id="account-message" class="message"></div>
                </div>
            </div>
        </section>

        <section id="full-leaderboard" class="section">
            <div class="section-header">
                <div>
                    <h2 class="section-title">Full Leaderboard</h2>
                    <p class="section-subtitle">Every contender in the realm.</p>
                </div>
            </div>
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

                <div class="add-section">
                    <h2>⚔️ Update Your Dice Bag Count</h2>
                    <p class="muted">Log in to edit your dice bag tally and climb the board.</p>
                    <form id="updateForm">
                        <div class="form-grid">
                            <div class="form-group">
                                <label for="diceBags">Dice Bags</label>
                                <input type="number" id="diceBags" name="diceBags" required placeholder="How many dice bags do you own?" min="0">
                            </div>
                        </div>
                        <button type="submit" class="btn">Update Bags</button>
                    </form>
                    <div id="message" class="message"></div>
                </div>
            </div>
        </section>

        <p class="footer-note">Forged in the shadows of the dice vault. Roll on.</p>
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
            const topThreeContainer = document.getElementById('top-three-content');
            const leaderboardContainer = document.getElementById('leaderboard-content');
            const topThree = players.slice(0, 3);

            topThreeContainer.innerHTML = topThree.map((player, index) => {
                const rank = index + 1;
                const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉';
                const date = new Date(player.lastUpdated).toLocaleDateString();

                return \`
                    <article class="top-card">
                        <div class="top-rank">\${medal} Rank \${rank}</div>
                        <div class="top-name">\${escapeHtml(player.name)}</div>
                        <div class="top-dice">🎲 \${player.bagCount} bags</div>
                        <div class="top-updated">Updated \${date}</div>
                    </article>
                \`;
            }).join('');

            leaderboardContainer.innerHTML = players.map((player, index) => {
                const rank = index + 1;
                const rankClass = \`rank-\${rank}\`;
                const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : '';
                const date = new Date(player.lastUpdated).toLocaleDateString();

                return \`
                    <div class="player-row">
                        <div class="rank \${rank <= 3 ? rankClass : ''}">\${medal || rank}</div>
                        <div class="player-name">\${escapeHtml(player.name)}</div>
                        <div class="dice-count">🎲 \${player.bagCount}</div>
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

        function showMessage(targetId, text, type) {
            const messageEl = document.getElementById(targetId);
            messageEl.textContent = text;
            messageEl.className = \`message \${type}\`;
            messageEl.style.display = 'block';
            setTimeout(() => {
                messageEl.style.display = 'none';
            }, 5000);
        }

        function setAuthState(user) {
            const authForms = document.getElementById('auth-forms');
            const accountPanel = document.getElementById('account-panel');
            if (user) {
                authForms.hidden = true;
                accountPanel.hidden = false;
                document.getElementById('account-name').textContent = user.displayName;
                document.getElementById('account-email').textContent = user.email;
                document.getElementById('account-bags').textContent = user.bagCount;
                document.getElementById('diceBags').value = user.bagCount;
            } else {
                authForms.hidden = false;
                accountPanel.hidden = true;
            }
        }

        async function loadCurrentUser() {
            try {
                const response = await fetch('/api/me', { credentials: 'include' });
                if (!response.ok) {
                    setAuthState(null);
                    return;
                }
                const user = await response.json();
                setAuthState(user);
            } catch (error) {
                console.error('Error loading user:', error);
                setAuthState(null);
            }
        }

        document.getElementById('registerForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = {
                displayName: formData.get('displayName'),
                email: formData.get('email'),
                password: formData.get('password')
            };

            try {
                const response = await fetch('/api/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                    credentials: 'include'
                });
                const result = await response.json();
                if (!response.ok) {
                    showMessage('auth-message', result.error || 'Registration failed', 'error');
                    return;
                }
                showMessage('auth-message', 'Account created! Welcome to the vault.', 'success');
                setAuthState(result);
                loadLeaderboard();
                e.target.reset();
            } catch (error) {
                showMessage('auth-message', 'Registration error. Please try again.', 'error');
            }
        });

        document.getElementById('loginForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = {
                email: formData.get('email'),
                password: formData.get('password')
            };

            try {
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                    credentials: 'include'
                });
                const result = await response.json();
                if (!response.ok) {
                    showMessage('auth-message', result.error || 'Login failed', 'error');
                    return;
                }
                showMessage('auth-message', 'Logged in successfully!', 'success');
                setAuthState(result);
                loadLeaderboard();
                e.target.reset();
            } catch (error) {
                showMessage('auth-message', 'Login error. Please try again.', 'error');
            }
        });

        document.getElementById('logoutButton').addEventListener('click', async () => {
            try {
                await fetch('/api/logout', { method: 'POST', credentials: 'include' });
                setAuthState(null);
                showMessage('account-message', 'Logged out.', 'success');
            } catch (error) {
                showMessage('account-message', 'Logout failed.', 'error');
            }
        });

        // Handle form submission
        document.getElementById('updateForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(e.target);
            const bagCount = parseInt(formData.get('diceBags'), 10);
            
            if (isNaN(bagCount)) {
                showMessage('message', 'Please enter a valid number', 'error');
                return;
            }
            
            const data = { bagCount };

            try {
                const response = await fetch('/api/update', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data),
                    credentials: 'include'
                });

                const result = await response.json();
                
                if (response.ok) {
                    showMessage('message', 'Dice bag count updated successfully! 🎲', 'success');
                    setAuthState(result);
                    loadLeaderboard();
                } else {
                    showMessage('message', result.error || 'Failed to update dice bag count', 'error');
                }
            } catch (error) {
                showMessage('message', 'Error updating dice bags. Please try again.', 'error');
                console.error('Error:', error);
            }
        });

        // Load leaderboard on page load
        loadLeaderboard();
        loadCurrentUser();
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
function jsonResponse(data, options = {}) {
  return new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders(),
      ...(options.headers || {})
    },
    status: options.status || 200
  });
}

function getCookie(request, name) {
  const cookieHeader = request.headers.get('Cookie') || '';
  const cookies = cookieHeader.split(';').map(cookie => cookie.trim());
  for (const cookie of cookies) {
    const [key, value] = cookie.split('=');
    if (key === name) {
      return decodeURIComponent(value);
    }
  }
  return null;
}

function buildSessionCookie(token) {
  return `${SESSION_COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_TTL_SECONDS}`;
}

function clearSessionCookie() {
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function hashPassword(password, salt) {
  const encoder = new TextEncoder();
  const data = encoder.encode(`${salt}:${password}`);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest))
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('');
}

async function getUser(env, email) {
  return env.DICE_KV.get(`user:${email}`, { type: 'json' });
}

async function saveUser(env, user) {
  await env.DICE_KV.put(`user:${user.email}`, JSON.stringify(user));
}

async function getSessionEmail(env, request) {
  const token = getCookie(request, SESSION_COOKIE);
  if (!token) {
    return null;
  }
  return env.DICE_KV.get(`session:${token}`);
}

async function handleGetLeaderboard(env) {
  const listResult = await env.DICE_KV.list({ prefix: 'user:' });
  const users = await Promise.all(
    listResult.keys.map(key => env.DICE_KV.get(key.name, { type: 'json' }))
  );
  const cleaned = users
    .filter(Boolean)
    .map(user => ({
      name: user.displayName || user.email,
      bagCount: user.bagCount ?? 0,
      lastUpdated: user.lastUpdated || new Date().toISOString()
    }));
  const sortedLeaderboard = cleaned.sort((a, b) => b.bagCount - a.bagCount);
  return jsonResponse(sortedLeaderboard);
}

async function handleRegister(request, env) {
  const data = await request.json();
  const displayName = data.displayName?.trim();
  const email = normalizeEmail(data.email || '');
  const password = data.password || '';

  if (!displayName) {
    return jsonResponse({ error: 'Display name is required.' }, { status: 400 });
  }
  if (!validateEmail(email)) {
    return jsonResponse({ error: 'Valid email is required.' }, { status: 400 });
  }
  if (password.length < 8) {
    return jsonResponse({ error: 'Password must be at least 8 characters.' }, { status: 400 });
  }

  const existing = await getUser(env, email);
  if (existing) {
    return jsonResponse({ error: 'Account already exists.' }, { status: 409 });
  }

  const salt = crypto.randomUUID();
  const passwordHash = await hashPassword(password, salt);
  const user = {
    email,
    displayName,
    salt,
    passwordHash,
    bagCount: 0,
    lastUpdated: new Date().toISOString()
  };

  await saveUser(env, user);
  const sessionToken = crypto.randomUUID();
  await env.DICE_KV.put(`session:${sessionToken}`, email, { expirationTtl: SESSION_TTL_SECONDS });

  return jsonResponse(
    { email: user.email, displayName: user.displayName, bagCount: user.bagCount },
    { headers: { 'Set-Cookie': buildSessionCookie(sessionToken) } }
  );
}

async function handleLogin(request, env) {
  const data = await request.json();
  const email = normalizeEmail(data.email || '');
  const password = data.password || '';

  if (!validateEmail(email) || !password) {
    return jsonResponse({ error: 'Email and password are required.' }, { status: 400 });
  }

  const user = await getUser(env, email);
  if (!user) {
    return jsonResponse({ error: 'Invalid credentials.' }, { status: 401 });
  }

  const passwordHash = await hashPassword(password, user.salt);
  if (passwordHash !== user.passwordHash) {
    return jsonResponse({ error: 'Invalid credentials.' }, { status: 401 });
  }

  const sessionToken = crypto.randomUUID();
  await env.DICE_KV.put(`session:${sessionToken}`, email, { expirationTtl: SESSION_TTL_SECONDS });

  return jsonResponse(
    { email: user.email, displayName: user.displayName, bagCount: user.bagCount },
    { headers: { 'Set-Cookie': buildSessionCookie(sessionToken) } }
  );
}

async function handleLogout(request, env) {
  const token = getCookie(request, SESSION_COOKIE);
  if (token) {
    await env.DICE_KV.delete(`session:${token}`);
  }
  return jsonResponse({ success: true }, { headers: { 'Set-Cookie': clearSessionCookie() } });
}

async function handleGetMe(request, env) {
  const email = await getSessionEmail(env, request);
  if (!email) {
    return jsonResponse({ error: 'Not authenticated.' }, { status: 401 });
  }
  const user = await getUser(env, email);
  if (!user) {
    return jsonResponse({ error: 'Account not found.' }, { status: 404 });
  }
  return jsonResponse({ email: user.email, displayName: user.displayName, bagCount: user.bagCount });
}

async function handleUpdateDiceBags(request, env) {
  const email = await getSessionEmail(env, request);
  if (!email) {
    return jsonResponse({ error: 'Please log in to update your dice bags.' }, { status: 401 });
  }

  const data = await request.json();
  const bagCount = Number(data.bagCount);
  if (!Number.isFinite(bagCount) || bagCount < 0) {
    return jsonResponse({ error: 'Invalid dice bag count.' }, { status: 400 });
  }

  const user = await getUser(env, email);
  if (!user) {
    return jsonResponse({ error: 'Account not found.' }, { status: 404 });
  }

  user.bagCount = bagCount;
  user.lastUpdated = new Date().toISOString();
  await saveUser(env, user);

  return jsonResponse({ email: user.email, displayName: user.displayName, bagCount: user.bagCount });
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
      return handleGetLeaderboard(env);
    }

    if (path === '/api/register' && request.method === 'POST') {
      return handleRegister(request, env);
    }

    if (path === '/api/login' && request.method === 'POST') {
      return handleLogin(request, env);
    }

    if (path === '/api/logout' && request.method === 'POST') {
      return handleLogout(request, env);
    }

    if (path === '/api/me' && request.method === 'GET') {
      return handleGetMe(request, env);
    }

    if (path === '/api/update' && request.method === 'POST') {
      return handleUpdateDiceBags(request, env);
    }

    // Serve HTML for all other routes
    return new Response(HTML_TEMPLATE, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8'
      }
    });
  }
};
