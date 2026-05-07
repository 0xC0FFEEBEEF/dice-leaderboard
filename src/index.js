const SESSION_COOKIE = "dice_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

const STARTER_LEADERBOARD = [
  { name: "Morrigan Moonfall", bagCount: 18, lastUpdated: "2026-04-18T18:30:00.000Z" },
  { name: "Thistlewick", bagCount: 14, lastUpdated: "2026-04-12T15:20:00.000Z" },
  { name: "Brakk Stonehand", bagCount: 11, lastUpdated: "2026-04-10T21:05:00.000Z" },
  { name: "Nyx Emberveil", bagCount: 8, lastUpdated: "2026-04-02T11:45:00.000Z" }
];

const HTML_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="theme-color" content="#090813">
  <meta name="description" content="The Dice King is a polished D&D dice bag leaderboard for tabletop groups.">
  <title>The Dice King | Dice Bag Leaderboard</title>
  <style>
    :root {
      color-scheme: dark;
      --bg: #070711;
      --bg-2: #10162b;
      --card: rgba(18, 22, 43, 0.78);
      --card-strong: rgba(26, 31, 58, 0.94);
      --gold: #ffd166;
      --gold-2: #ff9f1c;
      --teal: #4ecdc4;
      --violet: #9b5cff;
      --rose: #ff5d8f;
      --green: #7bd88f;
      --ink: #f5f7fb;
      --muted: #aeb7d3;
      --soft: rgba(255, 255, 255, 0.1);
      --ring: rgba(255, 209, 102, 0.42);
      --shadow: 0 24px 70px rgba(0, 0, 0, 0.45);
      --radius-xl: 30px;
      --radius-lg: 22px;
      --radius-md: 16px;
    }

    * { box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body {
      margin: 0;
      min-height: 100vh;
      background:
        radial-gradient(circle at 10% 0%, rgba(155, 92, 255, 0.32), transparent 32rem),
        radial-gradient(circle at 92% 8%, rgba(78, 205, 196, 0.24), transparent 30rem),
        linear-gradient(180deg, #111832 0%, var(--bg) 45%, #050509 100%);
      color: var(--ink);
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      line-height: 1.5;
    }

    body::before {
      content: "";
      position: fixed;
      inset: 0;
      pointer-events: none;
      background-image:
        linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
      background-size: 54px 54px;
      mask-image: linear-gradient(to bottom, #000, transparent 78%);
    }

    a { color: inherit; text-decoration: none; }
    button, input { font: inherit; }
    button { cursor: pointer; }
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0,0,0,0);
      white-space: nowrap;
      border: 0;
    }

    .shell {
      width: min(1180px, calc(100% - 32px));
      margin: 0 auto;
      padding: 22px 0 56px;
    }

    .nav {
      position: sticky;
      top: 16px;
      z-index: 20;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding: 14px;
      border: 1px solid var(--soft);
      border-radius: 999px;
      background: rgba(7, 7, 17, 0.74);
      backdrop-filter: blur(18px);
      box-shadow: var(--shadow);
    }

    .brand {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      padding-left: 8px;
      font-weight: 900;
      letter-spacing: 0.02em;
    }

    .brand-mark {
      display: grid;
      place-items: center;
      width: 42px;
      height: 42px;
      border-radius: 14px;
      background: conic-gradient(from 180deg, var(--gold), var(--teal), var(--violet), var(--gold));
      color: #110a02;
      box-shadow: 0 0 26px rgba(255, 209, 102, 0.35);
    }

    .nav-links { display: flex; flex-wrap: wrap; gap: 8px; justify-content: flex-end; }
    .nav-link {
      padding: 10px 14px;
      border: 1px solid transparent;
      border-radius: 999px;
      color: var(--muted);
      font-weight: 750;
      font-size: 0.92rem;
      transition: 180ms ease;
    }
    .nav-link:hover, .nav-link:focus-visible {
      color: var(--ink);
      border-color: var(--ring);
      background: rgba(255, 209, 102, 0.1);
      outline: none;
    }
    .nav-link.cta { color: #100a02; background: linear-gradient(135deg, var(--gold), var(--gold-2)); }

    .hero {
      position: relative;
      display: grid;
      grid-template-columns: minmax(0, 1.08fr) minmax(300px, 0.92fr);
      gap: 28px;
      margin-top: 44px;
      align-items: stretch;
    }

    .hero-copy, .vault-card, .panel {
      border: 1px solid var(--soft);
      background: linear-gradient(145deg, rgba(23, 28, 54, 0.92), rgba(11, 13, 27, 0.78));
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow);
      overflow: hidden;
    }

    .hero-copy { padding: clamp(28px, 5vw, 58px); position: relative; }
    .eyebrow {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 18px;
      padding: 8px 12px;
      border: 1px solid rgba(78, 205, 196, 0.35);
      border-radius: 999px;
      color: var(--teal);
      background: rgba(78, 205, 196, 0.1);
      font-weight: 800;
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 0.11em;
    }
    h1 {
      max-width: 720px;
      margin: 0;
      font-size: clamp(3rem, 8vw, 6.8rem);
      line-height: 0.88;
      letter-spacing: -0.08em;
    }
    .gradient-text {
      display: block;
      background: linear-gradient(135deg, #fff6d8, var(--gold), #ff7a90 75%);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }
    .hero-subtitle {
      max-width: 650px;
      margin: 24px 0 0;
      color: var(--muted);
      font-size: clamp(1.04rem, 1.9vw, 1.28rem);
    }
    .hero-actions { display: flex; flex-wrap: wrap; gap: 14px; margin-top: 30px; }
    .btn, .ghost-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      min-height: 46px;
      padding: 12px 18px;
      border-radius: 14px;
      border: 1px solid transparent;
      font-weight: 900;
      transition: transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease;
    }
    .btn {
      color: #120b02;
      background: linear-gradient(135deg, var(--gold), var(--gold-2));
      box-shadow: 0 14px 34px rgba(255, 159, 28, 0.22);
    }
    .ghost-btn {
      color: var(--ink);
      background: rgba(255, 255, 255, 0.06);
      border-color: var(--soft);
    }
    .btn:hover, .ghost-btn:hover, .btn:focus-visible, .ghost-btn:focus-visible {
      transform: translateY(-2px);
      border-color: var(--ring);
      box-shadow: 0 18px 40px rgba(0, 0, 0, 0.36);
      outline: none;
    }

    .hero-stats {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 12px;
      margin-top: 34px;
    }
    .stat {
      padding: 16px;
      border: 1px solid var(--soft);
      border-radius: var(--radius-md);
      background: rgba(255, 255, 255, 0.045);
    }
    .stat strong { display: block; font-size: clamp(1.35rem, 3vw, 2.1rem); color: var(--gold); }
    .stat span { color: var(--muted); font-size: 0.9rem; }

    .vault-card { padding: 24px; display: grid; min-height: 100%; }
    .dice-orbit {
      position: relative;
      display: grid;
      place-items: center;
      min-height: 360px;
      border-radius: 24px;
      background:
        radial-gradient(circle, rgba(255, 209, 102, 0.16), transparent 35%),
        radial-gradient(circle at 25% 20%, rgba(78, 205, 196, 0.12), transparent 28%),
        rgba(255,255,255,0.035);
      border: 1px solid var(--soft);
    }
    .d20 {
      width: min(250px, 62vw);
      aspect-ratio: 1;
      display: grid;
      place-items: center;
      clip-path: polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%);
      background: linear-gradient(145deg, var(--gold), #ff7a59 45%, var(--violet));
      color: #120a03;
      font-size: clamp(4rem, 10vw, 6.5rem);
      font-weight: 1000;
      box-shadow: 0 28px 80px rgba(255, 159, 28, 0.26);
      animation: float 6s ease-in-out infinite;
    }
    .spark {
      position: absolute;
      width: 74px;
      height: 74px;
      display: grid;
      place-items: center;
      border-radius: 22px;
      background: rgba(255,255,255,0.08);
      border: 1px solid var(--soft);
      color: var(--gold);
      font-size: 1.8rem;
    }
    .spark.one { top: 34px; left: 34px; transform: rotate(-12deg); }
    .spark.two { right: 38px; top: 92px; color: var(--teal); transform: rotate(14deg); }
    .spark.three { right: 66px; bottom: 38px; color: var(--rose); transform: rotate(-7deg); }
    @keyframes float { 0%,100% { transform: translateY(0) rotate(-4deg); } 50% { transform: translateY(-16px) rotate(4deg); } }

    section { margin-top: 34px; }
    .section-head {
      display: flex;
      align-items: end;
      justify-content: space-between;
      gap: 18px;
      margin-bottom: 16px;
    }
    .section-kicker { color: var(--teal); font-size: 0.8rem; font-weight: 900; letter-spacing: 0.14em; text-transform: uppercase; }
    h2 { margin: 0; font-size: clamp(1.7rem, 3vw, 2.55rem); letter-spacing: -0.04em; }
    .section-head p { margin: 6px 0 0; color: var(--muted); }

    .podium {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 16px;
    }
    .podium-card {
      position: relative;
      min-height: 250px;
      padding: 22px;
      border-radius: var(--radius-lg);
      border: 1px solid var(--soft);
      background: linear-gradient(160deg, rgba(255,255,255,0.1), rgba(255,255,255,0.035));
      overflow: hidden;
    }
    .podium-card::after {
      content: "";
      position: absolute;
      inset: auto -20% -42% -20%;
      height: 170px;
      background: radial-gradient(circle, rgba(255,209,102,0.34), transparent 64%);
      pointer-events: none;
    }
    .podium-rank { color: var(--gold); font-weight: 1000; font-size: 0.92rem; text-transform: uppercase; letter-spacing: 0.12em; }
    .podium-name { margin-top: 28px; font-size: clamp(1.5rem, 2.5vw, 2.2rem); line-height: 1; font-weight: 1000; }
    .podium-count { margin-top: 14px; color: var(--teal); font-size: 1.2rem; font-weight: 900; }
    .podium-updated, .empty-state { margin-top: 16px; color: var(--muted); }

    .grid { display: grid; grid-template-columns: 1fr 380px; gap: 18px; align-items: start; }
    .panel { padding: 20px; border-radius: var(--radius-lg); }
    .toolbar { display: flex; flex-wrap: wrap; gap: 12px; justify-content: space-between; margin-bottom: 14px; }
    .search {
      flex: 1 1 250px;
      width: 100%;
      min-height: 46px;
      padding: 0 14px;
      border-radius: 14px;
      border: 1px solid var(--soft);
      background: rgba(255,255,255,0.06);
      color: var(--ink);
    }
    .search:focus, input:focus { outline: 2px solid var(--ring); outline-offset: 2px; }

    .leaderboard-list { display: grid; gap: 10px; }
    .player-row {
      display: grid;
      grid-template-columns: 74px minmax(0, 1fr) 130px 124px;
      gap: 14px;
      align-items: center;
      padding: 14px;
      border: 1px solid var(--soft);
      border-radius: 18px;
      background: rgba(255,255,255,0.045);
    }
    .rank-badge {
      display: grid;
      place-items: center;
      width: 52px;
      height: 52px;
      border-radius: 16px;
      background: rgba(255, 209, 102, 0.12);
      color: var(--gold);
      font-weight: 1000;
    }
    .player-name { min-width: 0; font-size: 1.08rem; font-weight: 950; overflow-wrap: anywhere; }
    .player-tier { color: var(--muted); font-size: 0.88rem; }
    .bag-count { color: var(--teal); font-weight: 1000; font-size: 1.15rem; }
    .date { color: var(--muted); font-size: 0.86rem; }

    .side-stack { display: grid; gap: 18px; }
    .account-card h3, .update-card h3 { margin: 0; color: var(--gold); font-size: 1.24rem; }
    .account-card p, .update-card p { color: var(--muted); margin: 6px 0 16px; }
    .form { display: grid; gap: 12px; }
    .field { display: grid; gap: 7px; }
    label { color: var(--muted); font-weight: 800; font-size: 0.9rem; }
    input {
      width: 100%;
      min-height: 46px;
      padding: 0 13px;
      border-radius: 14px;
      border: 1px solid var(--soft);
      background: rgba(255,255,255,0.06);
      color: var(--ink);
    }
    .form-divider {
      display: flex;
      align-items: center;
      gap: 12px;
      color: var(--muted);
      font-size: 0.82rem;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      margin: 8px 0;
    }
    .form-divider::before, .form-divider::after { content: ""; flex: 1; height: 1px; background: var(--soft); }
    .message {
      display: none;
      padding: 12px;
      border-radius: 14px;
      border: 1px solid var(--soft);
      font-weight: 800;
    }
    .message.success { display: block; color: var(--green); background: rgba(123, 216, 143, 0.1); border-color: rgba(123, 216, 143, 0.38); }
    .message.error { display: block; color: #ff9aaa; background: rgba(255, 93, 143, 0.1); border-color: rgba(255, 93, 143, 0.4); }
    .message.info { display: block; color: var(--teal); background: rgba(78, 205, 196, 0.09); border-color: rgba(78, 205, 196, 0.35); }
    .hidden { display: none !important; }
    .profile-card {
      display: grid;
      gap: 12px;
      padding: 16px;
      border: 1px solid rgba(78,205,196,0.35);
      border-radius: 18px;
      background: rgba(78,205,196,0.08);
    }
    .profile-name { font-size: 1.3rem; font-weight: 1000; }
    .profile-email { color: var(--muted); overflow-wrap: anywhere; }

    .achievements { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 14px; }
    .achievement {
      padding: 18px;
      border: 1px solid var(--soft);
      border-radius: 20px;
      background: rgba(255,255,255,0.045);
    }
    .achievement-icon { font-size: 1.8rem; }
    .achievement strong { display: block; margin-top: 8px; }
    .achievement span { color: var(--muted); font-size: 0.92rem; }
    footer { margin-top: 42px; color: var(--muted); text-align: center; }

    @media (max-width: 920px) {
      .hero, .grid { grid-template-columns: 1fr; }
      .podium, .achievements { grid-template-columns: 1fr 1fr; }
      .nav { align-items: flex-start; border-radius: 24px; flex-direction: column; }
      .nav-links { justify-content: flex-start; }
    }
    @media (max-width: 640px) {
      .shell { width: min(100% - 22px, 1180px); padding-top: 10px; }
      .hero-stats, .podium, .achievements { grid-template-columns: 1fr; }
      .player-row { grid-template-columns: 56px minmax(0, 1fr); }
      .bag-count, .date { grid-column: 2; }
      .date { margin-top: -10px; }
      .section-head { align-items: start; flex-direction: column; }
    }
  </style>
</head>
<body>
  <div class="shell">
    <nav class="nav" aria-label="Primary navigation">
      <a href="#top" class="brand" aria-label="The Dice King home">
        <span class="brand-mark">🎲</span>
        <span>The Dice King</span>
      </a>
      <div class="nav-links">
        <a class="nav-link" href="#champions">Champions</a>
        <a class="nav-link" href="#leaderboard">Leaderboard</a>
        <a class="nav-link" href="#account">Account</a>
        <a class="nav-link" href="#achievements">Ranks</a>
        <a class="nav-link cta" href="https://5e.thediceking.net" target="_blank" rel="noreferrer">5e Tools ↗</a>
      </div>
    </nav>

    <main id="top">
      <section class="hero" aria-labelledby="hero-title">
        <div class="hero-copy">
          <div class="eyebrow">Live guild scoreboard</div>
          <h1 id="hero-title">Claim the <span class="gradient-text">Dice Crown.</span></h1>
          <p class="hero-subtitle">A complete leaderboard for adventurers who measure glory by dice bags. Create an account, log your hoard, and watch the realm reorder in real time.</p>
          <div class="hero-actions">
            <a class="btn" href="#account">Enter your count</a>
            <a class="ghost-btn" href="#leaderboard">View rankings</a>
          </div>
          <div class="hero-stats" aria-label="Leaderboard totals">
            <div class="stat"><strong id="statPlayers">0</strong><span>registered players</span></div>
            <div class="stat"><strong id="statBags">0</strong><span>dice bags tracked</span></div>
            <div class="stat"><strong id="statLeader">—</strong><span>current ruler</span></div>
          </div>
        </div>
        <aside class="vault-card" aria-label="Dice vault artwork">
          <div class="dice-orbit">
            <div class="spark one">✦</div>
            <div class="spark two">✧</div>
            <div class="spark three">✹</div>
            <div class="d20">20</div>
          </div>
        </aside>
      </section>

      <section id="champions" aria-labelledby="champions-title">
        <div class="section-head">
          <div>
            <div class="section-kicker">Hall of critical hits</div>
            <h2 id="champions-title">Crowned Top Three</h2>
            <p>The strongest hoards are displayed on the royal podium.</p>
          </div>
          <button class="ghost-btn" type="button" id="refreshButton">Refresh board</button>
        </div>
        <div class="podium" id="podium"></div>
      </section>

      <section id="leaderboard" aria-labelledby="leaderboard-title">
        <div class="section-head">
          <div>
            <div class="section-kicker">Full rankings</div>
            <h2 id="leaderboard-title">Every adventurer in the realm</h2>
            <p>Search the roster, check recent updates, and find the next rival to overtake.</p>
          </div>
        </div>
        <div class="grid">
          <div class="panel">
            <div class="toolbar">
              <label class="sr-only" for="searchPlayers">Search players</label>
              <input class="search" type="search" id="searchPlayers" placeholder="Search by player name or rank tier...">
              <span class="ghost-btn" id="resultCount" aria-live="polite">0 players</span>
            </div>
            <div class="leaderboard-list" id="leaderboardList"></div>
            <p class="empty-state hidden" id="emptyResults">No adventurers match that search.</p>
          </div>

          <aside class="side-stack" id="account" aria-label="Account and update controls">
            <div class="panel account-card">
              <div id="signedOutPanel">
                <h3>Create your vault</h3>
                <p>Register once, then your dice bag total becomes editable only while logged in.</p>
                <form class="form" id="registerForm">
                  <div class="field">
                    <label for="registerName">Display name</label>
                    <input type="text" id="registerName" name="displayName" autocomplete="nickname" required placeholder="Eldritch Dice Goblin">
                  </div>
                  <div class="field">
                    <label for="registerEmail">Email</label>
                    <input type="email" id="registerEmail" name="email" autocomplete="email" required placeholder="you@example.com">
                  </div>
                  <div class="field">
                    <label for="registerPassword">Password</label>
                    <input type="password" id="registerPassword" name="password" autocomplete="new-password" minlength="8" required placeholder="8+ characters">
                  </div>
                  <button class="btn" type="submit">Create account</button>
                </form>
                <div class="form-divider">or</div>
                <form class="form" id="loginForm">
                  <div class="field">
                    <label for="loginEmail">Email</label>
                    <input type="email" id="loginEmail" name="email" autocomplete="email" required>
                  </div>
                  <div class="field">
                    <label for="loginPassword">Password</label>
                    <input type="password" id="loginPassword" name="password" autocomplete="current-password" required>
                  </div>
                  <button class="ghost-btn" type="submit">Log in</button>
                </form>
              </div>
              <div class="profile-card hidden" id="signedInPanel">
                <div>
                  <span class="section-kicker">Signed in</span>
                  <div class="profile-name" id="profileName"></div>
                  <div class="profile-email" id="profileEmail"></div>
                </div>
                <div class="stat"><strong id="profileBags">0</strong><span>dice bags in your hoard</span></div>
                <button class="ghost-btn" type="button" id="logoutButton">Log out</button>
              </div>
              <div class="message" id="authMessage" role="status"></div>
            </div>

            <div class="panel update-card">
              <h3>Update your dice bags</h3>
              <p>Set the total number of dice bags you own. Only whole numbers are accepted.</p>
              <form class="form" id="updateForm">
                <div class="field">
                  <label for="bagCount">Dice bags</label>
                  <input type="number" id="bagCount" name="bagCount" min="0" step="1" inputmode="numeric" required placeholder="42">
                </div>
                <button class="btn" type="submit">Save count</button>
              </form>
              <div class="message" id="updateMessage" role="status"></div>
            </div>
          </aside>
        </div>
      </section>

      <section id="achievements" aria-labelledby="achievements-title">
        <div class="section-head">
          <div>
            <div class="section-kicker">Rank tiers</div>
            <h2 id="achievements-title">Know your title</h2>
            <p>Every bag moves you closer to a more legendary label.</p>
          </div>
        </div>
        <div class="achievements">
          <div class="achievement"><div class="achievement-icon">🌱</div><strong>Initiate</strong><span>0–4 bags. The journey begins.</span></div>
          <div class="achievement"><div class="achievement-icon">⚔️</div><strong>Adventurer</strong><span>5–9 bags. Ready for any table.</span></div>
          <div class="achievement"><div class="achievement-icon">🐉</div><strong>Dice Dragon</strong><span>10–19 bags. A hoard worth guarding.</span></div>
          <div class="achievement"><div class="achievement-icon">👑</div><strong>Dice Monarch</strong><span>20+ bags. Royalty of the realm.</span></div>
        </div>
      </section>
    </main>

    <footer>Forged for tabletop goblins, collectors, and crit seekers. Roll on.</footer>
  </div>

  <script>
    var state = { players: [], currentUser: null, query: "" };

    var podium = document.getElementById("podium");
    var leaderboardList = document.getElementById("leaderboardList");
    var searchPlayers = document.getElementById("searchPlayers");
    var resultCount = document.getElementById("resultCount");
    var emptyResults = document.getElementById("emptyResults");
    var statPlayers = document.getElementById("statPlayers");
    var statBags = document.getElementById("statBags");
    var statLeader = document.getElementById("statLeader");
    var authMessage = document.getElementById("authMessage");
    var updateMessage = document.getElementById("updateMessage");
    var signedOutPanel = document.getElementById("signedOutPanel");
    var signedInPanel = document.getElementById("signedInPanel");
    var profileName = document.getElementById("profileName");
    var profileEmail = document.getElementById("profileEmail");
    var profileBags = document.getElementById("profileBags");
    var bagCount = document.getElementById("bagCount");

    function tierFor(count) {
      if (count >= 20) return "Dice Monarch";
      if (count >= 10) return "Dice Dragon";
      if (count >= 5) return "Adventurer";
      return "Initiate";
    }

    function formatDate(value) {
      var date = new Date(value);
      if (Number.isNaN(date.getTime())) return "Unknown";
      return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
    }

    function setMessage(element, text, type) {
      element.textContent = text || "";
      element.className = text ? "message " + (type || "info") : "message";
    }

    function createElement(tag, className, text) {
      var node = document.createElement(tag);
      if (className) node.className = className;
      if (text !== undefined) node.textContent = text;
      return node;
    }

    async function api(path, options) {
      var response = await fetch(path, Object.assign({
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin"
      }, options || {}));
      var data = await response.json();
      if (!response.ok) throw new Error(data.error || "Request failed.");
      return data;
    }

    function renderStats(players) {
      var total = players.reduce(function(sum, player) { return sum + Number(player.bagCount || 0); }, 0);
      statPlayers.textContent = String(players.length);
      statBags.textContent = String(total);
      statLeader.textContent = players[0] ? players[0].name : "—";
    }

    function renderPodium(players) {
      podium.textContent = "";
      if (!players.length) {
        podium.appendChild(createElement("p", "empty-state", "No champions yet. Create the first vault to claim the crown."));
        return;
      }
      [0, 1, 2].forEach(function(index) {
        var player = players[index];
        var card = createElement("article", "podium-card");
        if (!player) {
          card.appendChild(createElement("div", "podium-rank", "Seat " + (index + 1)));
          card.appendChild(createElement("div", "podium-name", "Open throne"));
          card.appendChild(createElement("div", "podium-updated", "A challenger can still claim this place."));
          podium.appendChild(card);
          return;
        }
        var medal = index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉";
        card.appendChild(createElement("div", "podium-rank", medal + " Rank " + (index + 1)));
        card.appendChild(createElement("div", "podium-name", player.name));
        card.appendChild(createElement("div", "podium-count", "🎲 " + player.bagCount + " bags · " + tierFor(player.bagCount)));
        card.appendChild(createElement("div", "podium-updated", "Updated " + formatDate(player.lastUpdated)));
        podium.appendChild(card);
      });
    }

    function renderLeaderboard() {
      var query = state.query.trim().toLowerCase();
      var filtered = state.players.filter(function(player, index) {
        var tier = tierFor(player.bagCount).toLowerCase();
        return !query || player.name.toLowerCase().includes(query) || tier.includes(query) || String(index + 1) === query;
      });

      leaderboardList.textContent = "";
      resultCount.textContent = filtered.length + (filtered.length === 1 ? " player" : " players");
      emptyResults.classList.toggle("hidden", filtered.length > 0);

      filtered.forEach(function(player) {
        var rank = state.players.indexOf(player) + 1;
        var row = createElement("article", "player-row");
        row.appendChild(createElement("div", "rank-badge", rank <= 3 ? ["🥇", "🥈", "🥉"][rank - 1] : "#" + rank));
        var identity = createElement("div");
        identity.appendChild(createElement("div", "player-name", player.name));
        identity.appendChild(createElement("div", "player-tier", tierFor(player.bagCount)));
        row.appendChild(identity);
        row.appendChild(createElement("div", "bag-count", player.bagCount + " bags"));
        row.appendChild(createElement("div", "date", formatDate(player.lastUpdated)));
        leaderboardList.appendChild(row);
      });
    }

    function renderAccount() {
      var user = state.currentUser;
      signedOutPanel.classList.toggle("hidden", Boolean(user));
      signedInPanel.classList.toggle("hidden", !user);
      if (user) {
        profileName.textContent = user.displayName;
        profileEmail.textContent = user.email;
        profileBags.textContent = String(user.bagCount || 0);
        bagCount.value = user.bagCount || 0;
      }
    }

    function renderAll() {
      renderStats(state.players);
      renderPodium(state.players);
      renderLeaderboard();
      renderAccount();
    }

    async function loadLeaderboard() {
      setMessage(updateMessage, "Loading leaderboard...", "info");
      state.players = await api("/api/leaderboard");
      setMessage(updateMessage, "", "info");
      renderAll();
    }

    async function loadMe() {
      try {
        state.currentUser = await api("/api/me");
      } catch (error) {
        state.currentUser = null;
      }
      renderAccount();
    }

    document.getElementById("refreshButton").addEventListener("click", function() {
      loadLeaderboard().catch(function(error) { setMessage(updateMessage, error.message, "error"); });
    });

    searchPlayers.addEventListener("input", function(event) {
      state.query = event.target.value;
      renderLeaderboard();
    });

    document.getElementById("registerForm").addEventListener("submit", function(event) {
      event.preventDefault();
      var form = new FormData(event.currentTarget);
      setMessage(authMessage, "Creating account...", "info");
      api("/api/register", {
        method: "POST",
        body: JSON.stringify({
          displayName: form.get("displayName"),
          email: form.get("email"),
          password: form.get("password")
        })
      }).then(function(user) {
        state.currentUser = user;
        event.currentTarget.reset();
        setMessage(authMessage, "Account created. Your vault is ready.", "success");
        return loadLeaderboard();
      }).catch(function(error) { setMessage(authMessage, error.message, "error"); });
    });

    document.getElementById("loginForm").addEventListener("submit", function(event) {
      event.preventDefault();
      var form = new FormData(event.currentTarget);
      setMessage(authMessage, "Checking credentials...", "info");
      api("/api/login", {
        method: "POST",
        body: JSON.stringify({ email: form.get("email"), password: form.get("password") })
      }).then(function(user) {
        state.currentUser = user;
        event.currentTarget.reset();
        setMessage(authMessage, "Welcome back to the vault.", "success");
        renderAccount();
      }).catch(function(error) { setMessage(authMessage, error.message, "error"); });
    });

    document.getElementById("logoutButton").addEventListener("click", function() {
      api("/api/logout", { method: "POST" }).then(function() {
        state.currentUser = null;
        setMessage(authMessage, "Logged out safely.", "success");
        renderAccount();
      }).catch(function(error) { setMessage(authMessage, error.message, "error"); });
    });

    document.getElementById("updateForm").addEventListener("submit", function(event) {
      event.preventDefault();
      var value = Number(new FormData(event.currentTarget).get("bagCount"));
      setMessage(updateMessage, "Saving your hoard...", "info");
      api("/api/update", { method: "POST", body: JSON.stringify({ bagCount: value }) })
        .then(function(user) {
          state.currentUser = user;
          setMessage(updateMessage, "Dice bag count updated.", "success");
          return loadLeaderboard();
        })
        .catch(function(error) { setMessage(updateMessage, error.message, "error"); });
    });

    Promise.all([loadLeaderboard(), loadMe()]).catch(function(error) {
      setMessage(updateMessage, error.message, "error");
    });
  </script>
</body>
</html>`;

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
}

function jsonResponse(data, options = {}) {
  return new Response(JSON.stringify(data), {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders(),
      ...(options.headers || {})
    }
  });
}

function getCookie(request, name) {
  const cookieHeader = request.headers.get('Cookie') || '';
  return cookieHeader
    .split(';')
    .map(cookie => cookie.trim())
    .find(cookie => cookie.startsWith(`${name}=`))
    ?.split('=')
    .slice(1)
    .join('=');
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

function publicUser(user) {
  return { email: user.email, displayName: user.displayName, bagCount: user.bagCount ?? 0 };
}

async function hashPassword(password, salt) {
  const encoder = new TextEncoder();
  const data = encoder.encode(`${salt}:${password}`);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest))
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('');
}

function requireKv(env) {
  if (!env.DICE_KV) {
    throw new Error('DICE_KV binding is not configured.');
  }
}

async function getUser(env, email) {
  requireKv(env);
  return env.DICE_KV.get(`user:${email}`, { type: 'json' });
}

async function saveUser(env, user) {
  requireKv(env);
  await env.DICE_KV.put(`user:${user.email}`, JSON.stringify(user));
}

async function getSessionEmail(env, request) {
  requireKv(env);
  const token = getCookie(request, SESSION_COOKIE);
  if (!token) return null;
  return env.DICE_KV.get(`session:${decodeURIComponent(token)}`);
}

async function loadUsers(env) {
  requireKv(env);
  const listResult = await env.DICE_KV.list({ prefix: 'user:' });
  return Promise.all(listResult.keys.map(key => env.DICE_KV.get(key.name, { type: 'json' })));
}

function sortLeaderboard(players) {
  return players
    .filter(Boolean)
    .map(player => ({
      name: player.displayName || player.name || player.email || 'Mystery Adventurer',
      bagCount: Math.max(0, Number(player.bagCount ?? 0)),
      lastUpdated: player.lastUpdated || new Date().toISOString()
    }))
    .sort((a, b) => b.bagCount - a.bagCount || a.name.localeCompare(b.name));
}

async function handleGetLeaderboard(env) {
  const users = await loadUsers(env);
  const leaderboard = sortLeaderboard(users);
  return jsonResponse(leaderboard.length ? leaderboard : STARTER_LEADERBOARD);
}

async function handleRegister(request, env) {
  const data = await request.json();
  const displayName = data.displayName?.trim();
  const email = normalizeEmail(data.email || '');
  const password = data.password || '';

  if (!displayName || displayName.length > 48) {
    return jsonResponse({ error: 'Display name is required and must be 48 characters or fewer.' }, { status: 400 });
  }
  if (!validateEmail(email)) {
    return jsonResponse({ error: 'A valid email is required.' }, { status: 400 });
  }
  if (password.length < 8) {
    return jsonResponse({ error: 'Password must be at least 8 characters.' }, { status: 400 });
  }

  const existing = await getUser(env, email);
  if (existing) {
    return jsonResponse({ error: 'An account already exists for that email.' }, { status: 409 });
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

  return jsonResponse(publicUser(user), { headers: { 'Set-Cookie': buildSessionCookie(sessionToken) } });
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

  return jsonResponse(publicUser(user), { headers: { 'Set-Cookie': buildSessionCookie(sessionToken) } });
}

async function handleLogout(request, env) {
  requireKv(env);
  const token = getCookie(request, SESSION_COOKIE);
  if (token) {
    await env.DICE_KV.delete(`session:${decodeURIComponent(token)}`);
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
  return jsonResponse(publicUser(user));
}

async function handleUpdateDiceBags(request, env) {
  const email = await getSessionEmail(env, request);
  if (!email) {
    return jsonResponse({ error: 'Please log in to update your dice bags.' }, { status: 401 });
  }

  const data = await request.json();
  const bagCount = Number(data.bagCount);
  if (!Number.isInteger(bagCount) || bagCount < 0 || bagCount > 100000) {
    return jsonResponse({ error: 'Dice bag count must be a whole number between 0 and 100000.' }, { status: 400 });
  }

  const user = await getUser(env, email);
  if (!user) {
    return jsonResponse({ error: 'Account not found.' }, { status: 404 });
  }

  user.bagCount = bagCount;
  user.lastUpdated = new Date().toISOString();
  await saveUser(env, user);

  return jsonResponse(publicUser(user));
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders() });
    }

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

    return new Response(HTML_TEMPLATE, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });
  }
};
