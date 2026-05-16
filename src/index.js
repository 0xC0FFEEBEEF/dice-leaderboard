const SESSION_COOKIE = "dice_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;
const PBKDF2_ITERATIONS = 210000;

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
  <meta name="theme-color" content="#101318">
  <meta name="description" content="A production-ready D&D dice bag leaderboard for tabletop groups.">
  <title>The Dice King | Dice Bag Leaderboard</title>
  <style>
    :root {
      color-scheme: light;
      --bg: #f3f0e8;
      --surface: #fbfaf6;
      --surface-2: #eee9dd;
      --ink: #171a21;
      --muted: #606875;
      --border: #d6d0c3;
      --border-strong: #b9ad9d;
      --accent: #8a5a1f;
      --accent-dark: #5f3c12;
      --danger: #9f2d20;
      --success: #227447;
      --focus: rgba(138, 90, 31, 0.22);
      --shadow: 0 18px 46px rgba(22, 24, 29, 0.08);
      --radius: 8px;
    }

    * { box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body {
      margin: 0;
      min-height: 100vh;
      background:
        linear-gradient(90deg, rgba(23, 26, 33, 0.035) 1px, transparent 1px),
        linear-gradient(rgba(23, 26, 33, 0.03) 1px, transparent 1px),
        var(--bg);
      background-size: 48px 48px;
      color: var(--ink);
      font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      line-height: 1.5;
    }

    a { color: inherit; text-decoration: none; }
    button, input { font: inherit; }
    button { cursor: pointer; }
    .visually-hidden {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }

    .page {
      width: min(1160px, calc(100% - 32px));
      margin: 0 auto;
      padding: 24px 0 56px;
    }

    .site-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 24px;
      padding: 14px 0 20px;
      border-bottom: 1px solid var(--border);
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
      font-weight: 800;
      letter-spacing: -0.02em;
    }

    .brand-mark {
      display: grid;
      place-items: center;
      width: 34px;
      height: 34px;
      border: 2px solid var(--ink);
      transform: rotate(45deg);
      background: var(--surface);
    }

    .brand-mark span {
      transform: rotate(-45deg);
      font-size: 0.78rem;
      letter-spacing: 0;
    }

    .nav {
      display: flex;
      flex-wrap: wrap;
      gap: 18px;
      justify-content: flex-end;
      color: var(--muted);
      font-size: 0.94rem;
      font-weight: 650;
    }

    .nav a {
      border-bottom: 1px solid transparent;
    }

    .nav a:hover,
    .nav a:focus-visible {
      color: var(--ink);
      border-bottom-color: var(--accent);
      outline: none;
    }

    .intro {
      display: grid;
      grid-template-columns: minmax(0, 1fr) 360px;
      gap: 32px;
      padding: 56px 0 40px;
      align-items: end;
    }

    .eyebrow {
      margin: 0 0 12px;
      color: var(--accent-dark);
      font-size: 0.78rem;
      font-weight: 800;
      letter-spacing: 0.16em;
      text-transform: uppercase;
    }

    h1 {
      max-width: 780px;
      margin: 0;
      font-family: Georgia, "Times New Roman", serif;
      font-size: clamp(3rem, 8vw, 6.2rem);
      line-height: 0.92;
      letter-spacing: -0.075em;
    }

    .intro p {
      max-width: 650px;
      margin: 22px 0 0;
      color: var(--muted);
      font-size: clamp(1rem, 1.6vw, 1.18rem);
    }

    .summary-panel {
      border-top: 3px solid var(--ink);
      background: rgba(251, 250, 246, 0.74);
      box-shadow: var(--shadow);
    }

    .summary-row {
      display: grid;
      grid-template-columns: 88px 1fr;
      gap: 16px;
      padding: 18px 0;
      border-bottom: 1px solid var(--border);
    }

    .summary-row:last-child { border-bottom: 0; }
    .summary-row strong { font-size: 1.85rem; line-height: 1; }
    .summary-row span { color: var(--muted); font-size: 0.92rem; }

    .section-head {
      display: flex;
      align-items: end;
      justify-content: space-between;
      gap: 20px;
      margin: 0 0 18px;
      padding-top: 22px;
      border-top: 1px solid var(--border);
    }

    h2 {
      margin: 0;
      font-family: Georgia, "Times New Roman", serif;
      font-size: clamp(1.9rem, 3.8vw, 3rem);
      line-height: 1;
      letter-spacing: -0.055em;
    }

    .section-head p {
      margin: 8px 0 0;
      color: var(--muted);
    }

    .button,
    .secondary-button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 42px;
      padding: 10px 16px;
      border: 1px solid var(--ink);
      border-radius: 4px;
      font-weight: 750;
      transition: background 160ms ease, color 160ms ease, border-color 160ms ease;
    }

    .button {
      background: var(--ink);
      color: var(--surface);
    }

    .button:hover,
    .button:focus-visible {
      background: var(--accent-dark);
      border-color: var(--accent-dark);
      outline: none;
    }

    .secondary-button {
      background: transparent;
      color: var(--ink);
    }

    .secondary-button:hover,
    .secondary-button:focus-visible {
      background: var(--surface-2);
      outline: none;
    }

    .podium {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      border: 1px solid var(--border-strong);
      background: var(--surface);
    }

    .podium-item {
      min-height: 210px;
      padding: 22px;
      border-right: 1px solid var(--border);
    }

    .podium-item:last-child { border-right: 0; }
    .rank-label {
      display: flex;
      justify-content: space-between;
      gap: 10px;
      color: var(--accent-dark);
      font-size: 0.78rem;
      font-weight: 850;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }
    .podium-name {
      margin-top: 42px;
      font-family: Georgia, "Times New Roman", serif;
      font-size: clamp(1.7rem, 3vw, 2.35rem);
      line-height: 1;
      letter-spacing: -0.055em;
      overflow-wrap: anywhere;
    }
    .podium-count { margin-top: 14px; font-size: 1.05rem; font-weight: 800; }
    .podium-meta { margin-top: 10px; color: var(--muted); font-size: 0.9rem; }

    .workspace {
      display: grid;
      grid-template-columns: minmax(0, 1fr) 344px;
      gap: 28px;
      align-items: start;
    }

    .board,
    .side-panel {
      border: 1px solid var(--border-strong);
      background: var(--surface);
      box-shadow: var(--shadow);
    }

    .toolbar {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px;
      border-bottom: 1px solid var(--border);
    }

    .search,
    input {
      width: 100%;
      min-height: 42px;
      padding: 9px 11px;
      border: 1px solid var(--border-strong);
      border-radius: 4px;
      background: #fffefb;
      color: var(--ink);
    }

    .search:focus,
    input:focus {
      border-color: var(--accent);
      box-shadow: 0 0 0 4px var(--focus);
      outline: none;
    }

    .count-label {
      white-space: nowrap;
      color: var(--muted);
      font-size: 0.9rem;
      font-weight: 700;
    }

    .table {
      width: 100%;
      border-collapse: collapse;
    }

    .table th,
    .table td {
      padding: 15px 14px;
      border-bottom: 1px solid var(--border);
      text-align: left;
      vertical-align: top;
    }

    .table th {
      background: var(--surface-2);
      color: var(--muted);
      font-size: 0.74rem;
      font-weight: 850;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }

    .table tr:last-child td { border-bottom: 0; }
    .table td:first-child,
    .table th:first-child { width: 78px; }
    .rank { font-weight: 850; color: var(--accent-dark); }
    .player-name { font-weight: 800; overflow-wrap: anywhere; }
    .tier { margin-top: 2px; color: var(--muted); font-size: 0.88rem; }
    .bags { font-weight: 850; }
    .date { color: var(--muted); font-size: 0.9rem; }
    .empty-state { margin: 0; padding: 18px; color: var(--muted); }
    .hidden { display: none !important; }

    .side-stack {
      display: grid;
      gap: 18px;
      position: sticky;
      top: 18px;
    }

    .side-panel { padding: 18px; }
    .side-panel h3 {
      margin: 0;
      font-family: Georgia, "Times New Roman", serif;
      font-size: 1.5rem;
      letter-spacing: -0.04em;
    }
    .side-panel p { margin: 7px 0 16px; color: var(--muted); font-size: 0.95rem; }

    .form { display: grid; gap: 12px; }
    .field { display: grid; gap: 6px; }
    label { color: var(--muted); font-size: 0.84rem; font-weight: 750; }
    .form-divider {
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      gap: 10px;
      align-items: center;
      margin: 12px 0;
      color: var(--muted);
      font-size: 0.75rem;
      font-weight: 850;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }
    .form-divider::before,
    .form-divider::after { content: ""; height: 1px; background: var(--border); }

    .profile {
      display: grid;
      gap: 14px;
    }
    .profile-label {
      color: var(--accent-dark);
      font-size: 0.75rem;
      font-weight: 850;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }
    .profile-name { font-size: 1.25rem; font-weight: 850; overflow-wrap: anywhere; }
    .profile-email { color: var(--muted); overflow-wrap: anywhere; }
    .profile-count {
      padding-top: 14px;
      border-top: 1px solid var(--border);
    }
    .profile-count strong { display: block; font-size: 2rem; line-height: 1; }
    .profile-count span { color: var(--muted); }

    .message {
      display: none;
      margin-top: 12px;
      padding: 10px 12px;
      border-left: 3px solid var(--border-strong);
      background: var(--surface-2);
      color: var(--muted);
      font-weight: 700;
      font-size: 0.92rem;
    }
    .message.info { display: block; border-left-color: var(--accent); }
    .message.success { display: block; border-left-color: var(--success); color: var(--success); }
    .message.error { display: block; border-left-color: var(--danger); color: var(--danger); }

    .tiers {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      border: 1px solid var(--border-strong);
      background: var(--surface);
    }
    .tier-block {
      padding: 18px;
      border-right: 1px solid var(--border);
    }
    .tier-block:last-child { border-right: 0; }
    .tier-block strong { display: block; font-size: 1.05rem; }
    .tier-block span { display: block; margin-top: 5px; color: var(--muted); font-size: 0.9rem; }

    footer {
      margin-top: 44px;
      padding-top: 18px;
      border-top: 1px solid var(--border);
      color: var(--muted);
      font-size: 0.9rem;
    }

    @media (max-width: 920px) {
      .intro,
      .workspace { grid-template-columns: 1fr; }
      .summary-panel { max-width: 520px; }
      .side-stack { position: static; }
      .tiers { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .tier-block:nth-child(2) { border-right: 0; }
      .tier-block:nth-child(-n+2) { border-bottom: 1px solid var(--border); }
    }

    @media (max-width: 700px) {
      .page { width: min(100% - 24px, 1160px); padding-top: 12px; }
      .site-header { align-items: flex-start; flex-direction: column; }
      .nav { justify-content: flex-start; gap: 12px 16px; }
      .intro { padding: 38px 0 30px; }
      .summary-row { grid-template-columns: 72px 1fr; }
      .podium { grid-template-columns: 1fr; }
      .podium-item { min-height: auto; border-right: 0; border-bottom: 1px solid var(--border); }
      .podium-item:last-child { border-bottom: 0; }
      .toolbar { align-items: stretch; flex-direction: column; }
      .table thead { display: none; }
      .table,
      .table tbody,
      .table tr,
      .table td { display: block; width: 100%; }
      .table tr { border-bottom: 1px solid var(--border); }
      .table tr:last-child { border-bottom: 0; }
      .table td { border-bottom: 0; padding: 6px 14px; }
      .table td:first-child { padding-top: 14px; }
      .table td:last-child { padding-bottom: 14px; }
      .tiers { grid-template-columns: 1fr; }
      .tier-block,
      .tier-block:nth-child(2) { border-right: 0; border-bottom: 1px solid var(--border); }
      .tier-block:last-child { border-bottom: 0; }
    }
  </style>
</head>
<body>
  <div class="page">
    <header class="site-header">
      <a href="#top" class="brand" aria-label="The Dice King home">
        <span class="brand-mark" aria-hidden="true"><span>D20</span></span>
        <span>The Dice King</span>
      </a>
      <nav class="nav" aria-label="Primary navigation">
        <a href="#champions">Champions</a>
        <a href="#leaderboard">Leaderboard</a>
        <a href="#account">Account</a>
        <a href="#tiers">Rank tiers</a>
        <a href="https://5e.thediceking.net" target="_blank" rel="noreferrer">5e tools</a>
      </nav>
    </header>

    <main id="top">
      <section class="intro" aria-labelledby="page-title">
        <div>
          <p class="eyebrow">Dice bag collection ledger</p>
          <h1 id="page-title">Track the table without the spectacle.</h1>
          <p>A clean leaderboard for D&D groups that need accounts, persistent counts, and rankings that are easy to read at the table.</p>
        </div>
        <aside class="summary-panel" aria-label="Leaderboard summary">
          <div class="summary-row"><strong id="statPlayers">0</strong><span>registered players</span></div>
          <div class="summary-row"><strong id="statBags">0</strong><span>dice bags tracked</span></div>
          <div class="summary-row"><strong id="statLeader">—</strong><span>current leader</span></div>
        </aside>
      </section>

      <section id="champions" aria-labelledby="champions-title">
        <div class="section-head">
          <div>
            <p class="eyebrow">Current podium</p>
            <h2 id="champions-title">Top three collectors</h2>
            <p>The highest verified dice bag counts in the ledger.</p>
          </div>
          <button class="secondary-button" type="button" id="refreshButton">Refresh</button>
        </div>
        <div class="podium" id="podium"></div>
      </section>

      <section id="leaderboard" aria-labelledby="leaderboard-title">
        <div class="section-head">
          <div>
            <p class="eyebrow">Full board</p>
            <h2 id="leaderboard-title">Leaderboard</h2>
            <p>Search by player, position, or rank tier.</p>
          </div>
        </div>

        <div class="workspace">
          <div class="board">
            <div class="toolbar">
              <label class="visually-hidden" for="searchPlayers">Search leaderboard</label>
              <input class="search" type="search" id="searchPlayers" placeholder="Search leaderboard">
              <span class="count-label" id="resultCount" aria-live="polite">0 players</span>
            </div>
            <table class="table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Player</th>
                  <th>Bags</th>
                  <th>Updated</th>
                </tr>
              </thead>
              <tbody id="leaderboardBody"></tbody>
            </table>
            <p class="empty-state hidden" id="emptyResults">No entries match that search.</p>
          </div>

          <aside class="side-stack" id="account" aria-label="Account controls">
            <section class="side-panel">
              <div id="signedOutPanel">
                <h3>Account</h3>
                <p>Create an account or sign in to update your dice bag count.</p>
                <form class="form" id="registerForm">
                  <div class="field">
                    <label for="registerName">Display name</label>
                    <input type="text" id="registerName" name="displayName" autocomplete="nickname" maxlength="48" required>
                  </div>
                  <div class="field">
                    <label for="registerEmail">Email</label>
                    <input type="email" id="registerEmail" name="email" autocomplete="email" required>
                  </div>
                  <div class="field">
                    <label for="registerPassword">Password</label>
                    <input type="password" id="registerPassword" name="password" autocomplete="new-password" minlength="8" required>
                  </div>
                  <button class="button" type="submit">Create account</button>
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
                  <button class="secondary-button" type="submit">Sign in</button>
                </form>
              </div>

              <div class="profile hidden" id="signedInPanel">
                <div>
                  <div class="profile-label">Signed in</div>
                  <div class="profile-name" id="profileName"></div>
                  <div class="profile-email" id="profileEmail"></div>
                </div>
                <div class="profile-count"><strong id="profileBags">0</strong><span>dice bags</span></div>
                <button class="secondary-button" type="button" id="logoutButton">Sign out</button>
              </div>
              <div class="message" id="authMessage" role="status"></div>
            </section>

            <section class="side-panel">
              <h3>Update count</h3>
              <p>Enter the current number of dice bags you own.</p>
              <form class="form" id="updateForm">
                <div class="field">
                  <label for="bagCount">Dice bags</label>
                  <input type="number" id="bagCount" name="bagCount" min="0" max="100000" step="1" inputmode="numeric" required>
                </div>
                <button class="button" type="submit">Save count</button>
              </form>
              <div class="message" id="updateMessage" role="status"></div>
            </section>
          </aside>
        </div>
      </section>

      <section id="tiers" aria-labelledby="tiers-title">
        <div class="section-head">
          <div>
            <p class="eyebrow">Rank tiers</p>
            <h2 id="tiers-title">Collection labels</h2>
            <p>Simple labels keep the board scannable without turning it into a badge wall.</p>
          </div>
        </div>
        <div class="tiers">
          <div class="tier-block"><strong>Initiate</strong><span>0–4 bags</span></div>
          <div class="tier-block"><strong>Adventurer</strong><span>5–9 bags</span></div>
          <div class="tier-block"><strong>Dice Dragon</strong><span>10–19 bags</span></div>
          <div class="tier-block"><strong>Dice Monarch</strong><span>20+ bags</span></div>
        </div>
      </section>
    </main>

    <footer>Built for quick updates, clear standings, and persistent Cloudflare KV storage.</footer>
  </div>

  <script>
    var state = { players: [], currentUser: null, query: "" };
    var podium = document.getElementById("podium");
    var leaderboardBody = document.getElementById("leaderboardBody");
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

    function appendCell(row, text, className) {
      var cell = document.createElement("td");
      if (className) cell.className = className;
      cell.textContent = text;
      row.appendChild(cell);
      return cell;
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
      [0, 1, 2].forEach(function(index) {
        var player = players[index];
        var item = document.createElement("article");
        item.className = "podium-item";
        var label = document.createElement("div");
        label.className = "rank-label";
        var rank = document.createElement("span");
        rank.textContent = "Rank " + (index + 1);
        var tier = document.createElement("span");
        tier.textContent = player ? tierFor(player.bagCount) : "Open";
        label.appendChild(rank);
        label.appendChild(tier);
        item.appendChild(label);

        var name = document.createElement("div");
        name.className = "podium-name";
        name.textContent = player ? player.name : "Open position";
        item.appendChild(name);

        var count = document.createElement("div");
        count.className = "podium-count";
        count.textContent = player ? player.bagCount + " dice bags" : "No entry yet";
        item.appendChild(count);

        var meta = document.createElement("div");
        meta.className = "podium-meta";
        meta.textContent = player ? "Updated " + formatDate(player.lastUpdated) : "Create an account to claim this slot.";
        item.appendChild(meta);
        podium.appendChild(item);
      });
    }

    function renderLeaderboard() {
      var query = state.query.trim().toLowerCase();
      var filtered = state.players.filter(function(player, index) {
        var tier = tierFor(player.bagCount).toLowerCase();
        return !query || player.name.toLowerCase().includes(query) || tier.includes(query) || String(index + 1) === query;
      });

      leaderboardBody.textContent = "";
      resultCount.textContent = filtered.length + (filtered.length === 1 ? " player" : " players");
      emptyResults.classList.toggle("hidden", filtered.length > 0);

      filtered.forEach(function(player) {
        var rank = state.players.indexOf(player) + 1;
        var row = document.createElement("tr");
        appendCell(row, String(rank), "rank");
        var playerCell = appendCell(row, "", "");
        var name = document.createElement("div");
        name.className = "player-name";
        name.textContent = player.name;
        var tier = document.createElement("div");
        tier.className = "tier";
        tier.textContent = tierFor(player.bagCount);
        playerCell.appendChild(name);
        playerCell.appendChild(tier);
        appendCell(row, player.bagCount + " bags", "bags");
        appendCell(row, formatDate(player.lastUpdated), "date");
        leaderboardBody.appendChild(row);
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
      state.players = await api("/api/leaderboard");
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
      setMessage(updateMessage, "Refreshing leaderboard...", "info");
      loadLeaderboard()
        .then(function() { setMessage(updateMessage, "Leaderboard refreshed.", "success"); })
        .catch(function(error) { setMessage(updateMessage, error.message, "error"); });
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
        setMessage(authMessage, "Account created.", "success");
        return loadLeaderboard();
      }).catch(function(error) { setMessage(authMessage, error.message, "error"); });
    });

    document.getElementById("loginForm").addEventListener("submit", function(event) {
      event.preventDefault();
      var form = new FormData(event.currentTarget);
      setMessage(authMessage, "Signing in...", "info");
      api("/api/login", {
        method: "POST",
        body: JSON.stringify({ email: form.get("email"), password: form.get("password") })
      }).then(function(user) {
        state.currentUser = user;
        event.currentTarget.reset();
        setMessage(authMessage, "Signed in.", "success");
        renderAccount();
      }).catch(function(error) { setMessage(authMessage, error.message, "error"); });
    });

    document.getElementById("logoutButton").addEventListener("click", function() {
      api("/api/logout", { method: "POST" }).then(function() {
        state.currentUser = null;
        setMessage(authMessage, "Signed out.", "success");
        renderAccount();
      }).catch(function(error) { setMessage(authMessage, error.message, "error"); });
    });

    document.getElementById("updateForm").addEventListener("submit", function(event) {
      event.preventDefault();
      var value = Number(new FormData(event.currentTarget).get("bagCount"));
      setMessage(updateMessage, "Saving count...", "info");
      api("/api/update", { method: "POST", body: JSON.stringify({ bagCount: value }) })
        .then(function(user) {
          state.currentUser = user;
          setMessage(updateMessage, "Count saved.", "success");
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

function securityHeaders() {
  return {
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
  };
}

function jsonResponse(data, options = {}) {
  return new Response(JSON.stringify(data), {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
      ...securityHeaders(),
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

function buildSessionCookie(request, token) {
  const secure = new URL(request.url).protocol === 'https:' ? '; Secure' : '';
  return `${SESSION_COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_TTL_SECONDS}${secure}`;
}

function clearSessionCookie(request) {
  const secure = new URL(request.url).protocol === 'https:' ? '; Secure' : '';
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure}`;
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

function bytesToHex(bytes) {
  return Array.from(new Uint8Array(bytes))
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('');
}

async function hashPassword(password, salt) {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  );
  const bits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      hash: 'SHA-256',
      salt: encoder.encode(salt),
      iterations: PBKDF2_ITERATIONS
    },
    keyMaterial,
    256
  );
  return bytesToHex(bits);
}

async function hashPasswordLegacy(password, salt) {
  const encoder = new TextEncoder();
  const data = encoder.encode(`${salt}:${password}`);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return bytesToHex(digest);
}

async function verifyPassword(user, password) {
  if (user.passwordAlgorithm === 'pbkdf2-sha256') {
    return (await hashPassword(password, user.salt)) === user.passwordHash;
  }
  return (await hashPasswordLegacy(password, user.salt)) === user.passwordHash;
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
  const users = [];
  let cursor;
  do {
    const result = await env.DICE_KV.list({ prefix: 'user:', cursor });
    const page = await Promise.all(result.keys.map(key => env.DICE_KV.get(key.name, { type: 'json' })));
    users.push(...page);
    cursor = result.list_complete ? undefined : result.cursor;
  } while (cursor);
  return users;
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
    passwordAlgorithm: 'pbkdf2-sha256',
    bagCount: 0,
    lastUpdated: new Date().toISOString()
  };

  await saveUser(env, user);
  const sessionToken = crypto.randomUUID();
  await env.DICE_KV.put(`session:${sessionToken}`, email, { expirationTtl: SESSION_TTL_SECONDS });

  return jsonResponse(publicUser(user), { headers: { 'Set-Cookie': buildSessionCookie(request, sessionToken) } });
}

async function handleLogin(request, env) {
  const data = await request.json();
  const email = normalizeEmail(data.email || '');
  const password = data.password || '';

  if (!validateEmail(email) || !password) {
    return jsonResponse({ error: 'Email and password are required.' }, { status: 400 });
  }

  const user = await getUser(env, email);
  if (!user || !(await verifyPassword(user, password))) {
    return jsonResponse({ error: 'Invalid credentials.' }, { status: 401 });
  }

  if (user.passwordAlgorithm !== 'pbkdf2-sha256') {
    user.passwordHash = await hashPassword(password, user.salt);
    user.passwordAlgorithm = 'pbkdf2-sha256';
    await saveUser(env, user);
  }

  const sessionToken = crypto.randomUUID();
  await env.DICE_KV.put(`session:${sessionToken}`, email, { expirationTtl: SESSION_TTL_SECONDS });

  return jsonResponse(publicUser(user), { headers: { 'Set-Cookie': buildSessionCookie(request, sessionToken) } });
}

async function handleLogout(request, env) {
  requireKv(env);
  const token = getCookie(request, SESSION_COOKIE);
  if (token) {
    await env.DICE_KV.delete(`session:${decodeURIComponent(token)}`);
  }
  return jsonResponse({ success: true }, { headers: { 'Set-Cookie': clearSessionCookie(request) } });
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
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store',
        ...securityHeaders()
      }
    });
  }
};
