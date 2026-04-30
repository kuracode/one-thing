const STORAGE_KEY = 'one_thing_v3';

const quotes = [
  { text: "Even the darkest night will end, and the sun will rise.", author: "Victor Hugo" },
  { text: "You don't have to be positive all the time. It's perfectly okay to feel sad, angry, frustrated, or anxious. Having feelings doesn't make you a negative person. It makes you human.", author: "Lori Deschene" },
  { text: "There is hope, even when your brain tells you there isn't.", author: "John Green" },
  { text: "Start where you are. Use what you have. Do what you can.", author: "Arthur Ashe" },
  { text: "You are allowed to be both a masterpiece and a work in progress simultaneously.", author: "Sophia Bush" },
  { text: "Rest is not idleness.", author: "John Lubbock" },
  { text: "You don't have to earn your rest.", author: "unknown" },
];
const q = quotes[Math.floor(Math.random() * quotes.length)];
document.getElementById('qt').textContent = q.text;
document.getElementById('qa').textContent = "— " + q.author;

const dailyPrompts = [
  "My one thing for today is...",
  "One small step today...",
  "Today I choose to...",
  "Right now, I can...",
  "The one thing I'll do today...",
  "Today, just this one thing...",
  "I'm showing up today by...",
];

function getDayOfYear() {
  const n = new Date();
  return Math.floor((n - new Date(n.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
}
const todayPrompt = dailyPrompts[getDayOfYear() % dailyPrompts.length];

function getSeasonIcon() {
  const m = new Date().getMonth();
  if (m >= 2 && m <= 4) return '🌱';
  if (m >= 5 && m <= 7) return '🌸';
  if (m >= 8 && m <= 10) return '🍂';
  return '🌾';
}

// Gentle day format: "a quiet Tuesday in March"
function gentleDay(ts) {
  const d = new Date(ts);
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const adj = ['quiet', 'gentle', 'soft', 'still', 'slow'];
  const a = adj[d.getDate() % adj.length];
  return `a ${a} ${days[d.getDay()]} in ${months[d.getMonth()]}`;
}

const emptyQuotes = [
  { text: "It is never too late to begin.", author: "George Eliot" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
  { text: "A journey of a thousand miles begins with a single step.", author: "Lao Tzu" },
  { text: "Small deeds done are better than great deeds planned.", author: "Peter Marshall" },
];

// Toned-down, genuinely warm encouragements — no motivational-poster energy
const restMessages = [
  { heading: "today was enough.", body: "Letting something go is not failure. It is knowing yourself. Tomorrow is a fresh, unhurried start." },
  { heading: "that's okay.", body: "Some days the kindest thing you can do is set something down. Rest, and come back when you're ready." },
  { heading: "you showed up.", body: "That matters more than finishing. Tomorrow is yours, completely unmarked." },
  { heading: "be gentle with yourself.", body: "There is no record of this. No score. Just you, resting, and a new day waiting whenever you need it." },
  { heading: "nothing is lost.", body: "The day had its own weight. You carried what you could. That is enough." },
];

const MOCK_WINS = [
  { task: "Replied to that email I'd been avoiding", done: true, ts: Date.now() - 1 * 86400000, mock: true },
  { task: "Made myself a proper meal instead of snacking", done: true, ts: Date.now() - 2 * 86400000, mock: true },
  { task: "Went outside for a 10-minute walk", done: true, ts: Date.now() - 3 * 86400000, mock: true },
  { task: "Called mom back", done: true, ts: Date.now() - 5 * 86400000, mock: true },
  { task: "Washed the dishes", done: true, ts: Date.now() - 6 * 86400000, mock: true },
  { task: "Read one chapter of a book", done: true, ts: Date.now() - 8 * 86400000, mock: true },
  { task: "I showed up today", done: true, ts: Date.now() - 9 * 86400000, mock: true },
  { task: "Tidied the desk", done: true, ts: Date.now() - 11 * 86400000, mock: true },
  { task: "Took a shower and got dressed", done: true, ts: Date.now() - 13 * 86400000, mock: true },
];

function loadState() { try { const r = localStorage.getItem(STORAGE_KEY); return r ? JSON.parse(r) : null; } catch { return null; } }
function saveState(s) { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch {} }
function freshState() { return { task: null, setAt: null, completedAt: null, history: [], showRest: false, restMsgIndex: null }; }
let state = loadState() || freshState();

function silentResetIfExpired() {
  if (state.task && !state.completedAt && state.setAt) {
    if (Date.now() - state.setAt > 24 * 60 * 60 * 1000) {
      // Expired tasks leave no trace — just quietly clear
      state.task = null; state.setAt = null; state.completedAt = null; state.showRest = false;
      saveState(state);
    }
  }
}

function getDisplayWins() {
  const real = state.history.filter(h => h.done);
  const combined = real.length > 0 ? real : MOCK_WINS;
  combined.sort((a, b) => b.ts - a.ts);
  const featured = combined[0];
  const rest = combined.slice(1, 7);
  return [featured, ...rest];
}

function randFrom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function launchConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth; canvas.height = window.innerHeight;
  const colors = ['#4a7c6f', '#8ab5aa', '#c4983a', '#e8c46a', '#f0a07a', '#6aacb8'];
  const pieces = Array.from({ length: 120 }, () => ({
    x: Math.random() * canvas.width,
    y: -20 - Math.random() * 100,
    r: 4 + Math.random() * 6,
    color: colors[Math.floor(Math.random() * colors.length)],
    vx: (Math.random() - 0.5) * 3,
    vy: 2 + Math.random() * 4,
    angle: Math.random() * Math.PI * 2,
    va: (Math.random() - 0.5) * 0.15,
    shape: Math.random() > 0.4 ? 'rect' : 'circle'
  }));
  let frame = 0;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.angle += p.va; p.vy += 0.05;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.angle);
      ctx.fillStyle = p.color; ctx.globalAlpha = Math.max(0, 1 - frame / 200);
      if (p.shape === 'rect') ctx.fillRect(-p.r, -p.r / 2, p.r * 2, p.r);
      else { ctx.beginPath(); ctx.arc(0, 0, p.r, 0, Math.PI * 2); ctx.fill(); }
      ctx.restore();
    });
    frame++;
    if (frame < 220) requestAnimationFrame(draw);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  draw();
}

function switchTab(tab) {
  document.getElementById('tab-today').classList.toggle('active', tab === 'today');
  document.getElementById('tab-wins').classList.toggle('active', tab === 'wins');
  document.getElementById('page-today').classList.toggle('hidden', tab !== 'today');
  document.getElementById('page-wins').classList.toggle('hidden', tab !== 'wins');
  if (tab === 'wins') renderWins();
  if (tab === 'today') render();
}

function renderWins() {
  const root = document.getElementById('wins-area');
  const wins = getDisplayWins();
  const featured = wins[0];
  const rest = wins.slice(1);
  let html = `<div class="wins-letter">`;
  html += `<p class="wins-letter-heading">look what you have carried.</p>`;
  html += `<p class="wins-letter-intro">On each of these days, you chose yourself.<br>That is no small thing.</p>`;
  html += `<div class="wins-entry featured"><p class="wins-entry-sentence featured">on ${gentleDay(featured.ts)}, you — ${escapeHtml(featured.task.toLowerCase().replace(/\.$/, ''))}.</p><p class="wins-entry-day gold">${gentleDay(featured.ts)}</p></div>`;
  rest.forEach(h => {
    html += `<div class="wins-entry"><p class="wins-entry-sentence">on ${gentleDay(h.ts)}, you — ${escapeHtml(h.task.toLowerCase().replace(/\.$/, ''))}.</p><p class="wins-entry-day">${gentleDay(h.ts)}</p></div>`;
  });
  html += `<p class="wins-letter-close">Every single one of those was a day you chose yourself.<br><br>— one thing.</p>`;
  html += `</div>`;
  root.innerHTML = html;
}

function render() {
  silentResetIfExpired();
  const area = document.getElementById('task-area');
  let html = '';

  if (state.showRest) {
    const msg = restMessages[state.restMsgIndex ?? 0];
    html += `<div class="rest-card">
      <div class="rest-icon">🌿</div>
      <p class="rest-heading">${msg.heading}</p>
      <p class="rest-body">${msg.body}</p>
      <button class="set-btn" style="margin-top:0.5rem;" onclick="newDay()">begin tomorrow</button>
    </div>`;
  } else if (!state.task) {
    html += `<div class="card"><div class="input-area">
      <p class="input-prelude">${todayPrompt}</p>
      <textarea id="task-input" rows="2" maxlength="200" placeholder="whatever comes to mind" onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();setTask();}"></textarea>
      <button class="set-btn" onclick="setTask()">set my one thing</button>
      <button class="just-exist-link" onclick="justExist()">or just — I showed up today →</button>
    </div></div>`;
  } else if (state.completedAt) {
    html += `<div class="card"><div class="task-display">
      <p class="task-prelude">today, you did —</p>
      <p class="task-text done">${escapeHtml(state.task)}</p>
      <div class="message-card celebration">you did it. that took courage. 🌱</div>
      <div class="btn-group"><button class="btn-primary" onclick="newDay()">set tomorrow's thing</button></div>
    </div></div>`;
  } else {
    html += `<div class="card"><div class="task-display">
      <p class="task-prelude">${todayPrompt}</p>
      <p class="task-text">${escapeHtml(state.task)}</p>
      <div class="btn-group">
        <button class="btn-primary" onclick="completeTask()">I did it 🌱</button>
        <button class="btn-soft" onclick="letItGo()">let this one go</button>
      </div>
    </div></div>`;
  }

  area.innerHTML = html;
}

function setTask() {
  const val = document.getElementById('task-input').value.trim();
  if (!val) return;
  state.task = val; state.setAt = Date.now(); state.completedAt = null; state.showRest = false; state.restMsgIndex = null;
  saveState(state); render();
}

function justExist() {
  state.task = "I showed up today";
  state.setAt = Date.now();
  state.completedAt = Date.now();
  state.showRest = false;
  state.restMsgIndex = null;
  state.history.push({ task: state.task, done: true, ts: Date.now() });
  saveState(state);
  launchConfetti();
  render();
}

function completeTask() {
  state.completedAt = Date.now();
  state.history.push({ task: state.task, done: true, ts: Date.now() });
  state.showRest = false;
  saveState(state);
  launchConfetti();
  render();
}

function letItGo() {
  const idx = Math.floor(Math.random() * restMessages.length);
  state.task = null; state.setAt = null; state.completedAt = null;
  state.showRest = true; state.restMsgIndex = idx;
  saveState(state);
  render();
}

function newDay() {
  state.task = null; state.setAt = null; state.completedAt = null; state.showRest = false; state.restMsgIndex = null;
  saveState(state); render();
}

render();

// Onboarding
function dismissOnboarding() {
  document.getElementById('onboarding').classList.add('hidden');
  try { localStorage.setItem('one_thing_onboarded', '1'); } catch {}
}
(function initOnboarding() {
  try {
    if (localStorage.getItem('one_thing_onboarded')) {
      document.getElementById('onboarding').classList.add('hidden');
    }
  } catch {}
})();
