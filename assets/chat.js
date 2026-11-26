/*
 * Arya-bot: the arcade chat widget.
 *
 * Talks to your Python backend when window.ARYA_BOT_CONFIG.endpoint is set (see BACKEND.md).
 * Until then it runs in demo mode and answers from assets/projects.js and the profile below.
 *
 * Backend contract (POST <endpoint>, JSON):
 *   request:  { "message": str, "session_id": str, "history": [{ "role": "user"|"assistant", "content": str }] }
 *   response: { "answer": str, "sources"?: [{ "title": str, "url": str }], "suggestions"?: [str] }
 */
(function () {
  'use strict';

  const CONFIG = Object.assign({ endpoint: null, timeoutMs: 30000 }, window.ARYA_BOT_CONFIG || {});
  const PROJECTS = window.PROJECTS || [];
  const GH = 'https://github.com/AryaKrishnaproffessional/';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const motionOff = () => reduceMotion.matches || document.body.classList.contains('motion-paused');

  const PROFILE = {
    study: 'Arya is studying the Bachelor of Data Science Advanced (Honours) at Monash University, with a strong interest in research and in using data to help businesses grow.',
    hobbies: 'Away from the keyboard, Arya plays tennis, trains at the gym and plays chess.',
    contact: [
      { title: 'GitHub', url: 'https://github.com/AryaKrishnaproffessional' },
      { title: 'LinkedIn', url: 'https://www.linkedin.com/in/arya-krishna-085937321/' }
    ]
  };

  /* Question blocks. Colour matches the site's genre accents. */
  const BLOCKS = [
    { q: 'What is Arya studying?', c: 'var(--bot-amber)' },
    { q: 'What AI projects has Arya built?', c: 'var(--bot-teal)' },
    { q: 'Show me the data science work', c: 'var(--bot-rose)' },
    { q: 'What is Arya working on right now?', c: 'var(--bot-red)' },
    { q: 'Which languages and tools does Arya use?', c: 'var(--bot-amber)' },
    { q: 'Tell me about the Game Theory Bot', c: 'var(--bot-rose)' },
    { q: 'What software projects are there?', c: 'var(--bot-amber)' },
    { q: 'How can I contact Arya?', c: 'var(--bot-teal)' },
    { q: 'What does Arya do outside coding?', c: 'var(--bot-rose)' }
  ];
  const BLOCK_COLOURS = ['var(--bot-amber)', 'var(--bot-teal)', 'var(--bot-rose)', 'var(--bot-red)'];

  /* Original pixel sprites ("X" = filled). Music notes, records and tiny robots. */
  const SPRITES = {
    note: ['...XXXX.', '...X..XX', '...X....', '...X....', '.XXX....', 'XXXX....', 'XXXX....', '.XX.....'],
    disc: ['..XXXX..', '.XXXXXX.', 'XXX..XXX', 'XX.XX.XX', 'XX.XX.XX', 'XXX..XXX', '.XXXXXX.', '..XXXX..'],
    bot: ['...XX...', '...XX...', 'XXXXXXXX', 'X.XXXX.X', 'XXXXXXXX', 'XX....XX', '.XXXXXX.', '.X....X.'],
    ship: ['....XXX....', '...XXXXX...', '...XX.XX...', '....XXX....', '.XXXXXXXXX.', 'XXXXXXXXXXX']
  };
  const WAVE = [['note', '#F2B544'], ['bot', '#5FD3DB'], ['disc', '#F07A9A'], ['note', '#5FD3DB'], ['bot', '#F2B544'], ['disc', '#F07A9A']];

  function sprite(rows, colour) {
    const w = rows[0].length, h = rows.length;
    let rects = '';
    rows.forEach((row, y) => {
      for (let x = 0; x < w; x++) if (row[x] === 'X') rects += '<rect x="' + x + '" y="' + y + '" width="1" height="1"/>';
    });
    return '<svg viewBox="0 0 ' + w + ' ' + h + '" fill="' + colour + '" shape-rendering="crispEdges" aria-hidden="true" focusable="false">' + rects + '</svg>';
  }

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* ---------- Build the widget ---------- */
  const launcher = document.createElement('button');
  launcher.type = 'button';
  launcher.className = 'bot-launcher';
  launcher.setAttribute('aria-expanded', 'false');
  launcher.setAttribute('aria-controls', 'bot-panel');
  launcher.innerHTML = sprite(SPRITES.bot, '#5FD3DB') + '<span>Ask Arya-bot</span>';

  const panel = document.createElement('section');
  panel.id = 'bot-panel';
  panel.className = 'bot-panel';
  panel.hidden = true;
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-labelledby', 'bot-title');
  panel.innerHTML =
    '<header class="bot-hud">' +
      '<h2 id="bot-title">ARYA-BOT</h2>' +
      '<span class="bot-status" data-status hidden>BOT OFFLINE</span>' +
      '<span class="bot-score">SCORE <b data-score>0000</b></span>' +
      '<button type="button" class="bot-close" aria-label="Close chat">X</button>' +
    '</header>' +
    '<div class="bot-sky" aria-hidden="true"><div class="bot-wave"></div><div class="bot-wave-label" hidden></div></div>' +
    '<div class="bot-log" role="log" aria-live="polite" aria-label="Conversation"></div>' +
    '<div class="bot-blocks-wrap">' +
      '<p class="bot-blocks-label" id="bot-blocks-label">PICK A BLOCK</p>' +
      '<div class="bot-blocks" role="group" aria-labelledby="bot-blocks-label"></div>' +
    '</div>' +
    '<div class="bot-lane" aria-hidden="true"><div class="bot-ship">' + sprite(SPRITES.ship, '#F2B544') + '</div></div>' +
    '<form class="bot-form" autocomplete="off">' +
      '<label class="sr-only" for="bot-input">Ask a question about Arya</label>' +
      '<input class="bot-input" id="bot-input" name="question" type="text" maxlength="400" spellcheck="true" placeholder="Ask about Arya…">' +
      '<button class="bot-fire" type="submit">FIRE</button>' +
    '</form>';

  document.body.append(launcher, panel);

  const waveEl = panel.querySelector('.bot-wave');
  const waveLabel = panel.querySelector('.bot-wave-label');
  const log = panel.querySelector('.bot-log');
  const blocksEl = panel.querySelector('.bot-blocks');
  const lane = panel.querySelector('.bot-lane');
  const ship = panel.querySelector('.bot-ship');
  const form = panel.querySelector('.bot-form');
  const input = panel.querySelector('.bot-input');
  const fireBtn = panel.querySelector('.bot-fire');
  const scoreEl = panel.querySelector('[data-score]');
  const statusEl = panel.querySelector('[data-status]');
  const OFFLINE_TEXT = 'Bot offline. Arya-bot’s server isn’t running right now, so please try again later.';

  function setOffline(offline) {
    statusEl.hidden = !offline;
  }

  // Ask the backend's /health route whether it's up. "no-cors" means any reply counts as online.
  function checkOnline() {
    const healthUrl = CONFIG.endpoint.replace(/\/chat\/?$/, '/health');
    const ctrl = new AbortController();
    setTimeout(() => ctrl.abort(), 5000);
    return fetch(healthUrl, { mode: 'no-cors', signal: ctrl.signal })
      .then(() => true)
      .catch(() => false);
  }

  /* ---------- State ---------- */
  let score = 0;
  let wave = 1;
  let busy = false;
  let started = false;
  let blockCursor = 0;
  const history = [];
  let sessionId = '';
  try { sessionId = sessionStorage.getItem('arya-bot-session') || ''; } catch (e) { /* storage blocked */ }
  if (!sessionId) {
    sessionId = (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : String(Date.now()) + Math.random().toString(16).slice(2);
    try { sessionStorage.setItem('arya-bot-session', sessionId); } catch (e) { /* storage blocked */ }
  }

  function spawnWave() {
    waveEl.innerHTML = WAVE.map(([name, colour]) => '<span class="bot-invader">' + sprite(SPRITES[name], colour) + '</span>').join('');
  }

  function fillBlocks(list) {
    blocksEl.innerHTML = '';
    let questions = list && list.length ? list.slice(0, 4) : [];
    while (questions.length < 4) {
      questions.push(BLOCKS[blockCursor % BLOCKS.length].q);
      blockCursor++;
    }
    questions.forEach((q, i) => {
      const known = BLOCKS.find((b) => b.q === q);
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'bot-block';
      b.textContent = q;
      b.style.setProperty('--block', known ? known.c : BLOCK_COLOURS[i % BLOCK_COLOURS.length]);
      b.addEventListener('click', () => {
        if (busy) return;
        b.classList.add('is-breaking');
        setTimeout(() => ask(q), motionOff() ? 0 : 200);
      });
      blocksEl.append(b);
    });
  }

  function addMessage(role, text, opts) {
    opts = opts || {};
    const wrap = document.createElement('div');
    wrap.className = 'bot-msg ' + (role === 'user' ? 'from-user' : 'from-bot') + (opts.error ? ' is-error' : '');
    wrap.innerHTML = '<span class="who">' + (role === 'user' ? 'YOU' : 'ARYA-BOT') + '</span><div class="text"></div>';
    log.append(wrap);
    const textEl = wrap.querySelector('.text');

    const finish = () => {
      if (opts.sources && opts.sources.length) {
        const s = document.createElement('div');
        s.className = 'bot-sources';
        s.innerHTML = opts.sources
          .filter((x) => x && x.url && /^https?:\/\//.test(x.url))
          .map((x) => '<a href="' + esc(x.url) + '" target="_blank" rel="noopener">' + esc(x.title || x.url) + '</a>')
          .join('');
        if (s.childElementCount) wrap.append(s);
      }
      log.scrollTop = log.scrollHeight;
    };

    if (role === 'bot' && opts.typewriter && !motionOff()) {
      // Type the answer out; screen readers get the full text at once.
      wrap.setAttribute('aria-label', 'Arya-bot: ' + text);
      textEl.setAttribute('aria-hidden', 'true');
      let i = 0;
      const step = Math.max(2, Math.ceil(text.length / 120));
      const tick = () => {
        i = Math.min(text.length, i + step);
        textEl.textContent = text.slice(0, i);
        log.scrollTop = log.scrollHeight;
        if (i < text.length) setTimeout(tick, 16); else { textEl.removeAttribute('aria-hidden'); wrap.removeAttribute('aria-label'); finish(); }
      };
      tick();
    } else {
      textEl.textContent = text;
      finish();
    }
    log.scrollTop = log.scrollHeight;
    return wrap;
  }

  function showTyping() {
    const t = document.createElement('div');
    t.className = 'bot-msg from-bot';
    t.innerHTML = '<span class="who">ARYA-BOT</span><span class="bot-typing" aria-label="Arya-bot is thinking"><span>.</span><span>.</span><span>.</span></span>';
    log.append(t);
    log.scrollTop = log.scrollHeight;
    return t;
  }

  /* ---------- Arcade effects ---------- */
  function fireAtInvader() {
    const alive = Array.from(waveEl.querySelectorAll('.bot-invader:not(.is-hit):not(.is-gone)'));
    if (!alive.length) return;
    const target = alive[Math.floor(Math.random() * alive.length)];
    const panelBox = panel.getBoundingClientRect();
    const t = target.getBoundingClientRect();
    const laneBox = lane.getBoundingClientRect();
    const x = t.left + t.width / 2 - panelBox.left;

    const hit = () => {
      target.classList.add('is-hit');
      score += 100;
      scoreEl.textContent = String(score).padStart(4, '0');
      setTimeout(() => {
        target.classList.add('is-gone');
        if (!waveEl.querySelector('.bot-invader:not(.is-gone)')) nextWave();
      }, motionOff() ? 0 : 350);
    };

    if (motionOff()) { hit(); return; }

    ship.style.left = (x - (laneBox.left - panelBox.left)) + 'px';
    setTimeout(() => {
      const laser = document.createElement('div');
      laser.className = 'bot-laser';
      laser.style.left = x + 'px';
      laser.style.top = (t.bottom - panelBox.top) + 'px';
      laser.style.height = Math.max(0, laneBox.top - t.bottom + 10) + 'px';
      panel.append(laser);
      setTimeout(() => { laser.remove(); hit(); }, 170);
    }, 190);
  }

  function nextWave() {
    wave++;
    waveLabel.textContent = 'WAVE ' + wave;
    waveLabel.hidden = false;
    setTimeout(() => { waveLabel.hidden = true; spawnWave(); }, 1200);
  }

  /* ---------- Answers ---------- */
  async function askBackend(message) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), CONFIG.timeoutMs);
    try {
      const res = await fetch(CONFIG.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, session_id: sessionId, history: history.slice(-8) }),
        signal: ctrl.signal
      });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();
      if (!data || typeof data.answer !== 'string') throw new Error('Bad response');
      return data;
    } finally {
      clearTimeout(timer);
    }
  }

  // Demo mode: simple keyword matching over the site's own data.
  const monthYear = (ym) => new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric', timeZone: 'UTC' })
    .format(new Date(Date.UTC(+ym.slice(0, 4), +ym.slice(5, 7) - 1, 1)));
  const isSoon = (p) => p.current === true && (p.status === 'private' || p.status === 'empty');
  const srcFor = (p) => (p.status === 'private' ? null : { title: p.title, url: GH + p.repo });
  const line = (p) => '• ' + p.title + ' (' + monthYear(p.created) + (isSoon(p) ? ', soon to roll' : '') + '): ' + p.desc;
  const ALIASES = {
    'game theory': 'Game-Theory-Bot', poker: 'Game-Theory-Bot', rossmann: 'Rossmann-sales', catheter: 'Catheter-Placement',
    facial: 'Facial-Recognition-project', 'face ': 'Facial-Recognition-project', rna: 'RNA-Sequence-Project', uno: 'Uno-Inspired-Card-Game-',
    'card game': 'Uno-Inspired-Card-Game-', 'ride': 'Ride-Booking-Simulation-', database: 'Database-Management', sql: 'Database-Management',
    'job market': 'Job-Market-Analytics-and-Forecasting-Web-Platform-', chatbot: 'AI_chatbot-using-cursor-', cursor: 'AI_chatbot-using-cursor-',
    trading: 'Tradingbettingbot', betting: 'Tradingbettingbot', tuition: 'Tuition_project', tutoring: 'Tuition_project',
    geofinance: 'MCFS_geofinance_project', mcfs: 'MCFS_geofinance_project', namethellm: 'NameTheLLMKaggle', 'name the llm': 'NameTheLLMKaggle',
    website: 'My-Website-', portfolio: 'My-Website-', internship: 'Virtual-Internships-Monash', 'deep learning projects': 'Projects-DeepLearning'
  };

  function demoAnswer(message) {
    const m = ' ' + message.toLowerCase() + ' ';
    const has = (...words) => words.some((w) => m.includes(w));
    const list = (arr, intro) => ({
      answer: intro + '\n' + arr.map(line).join('\n'),
      sources: arr.map(srcFor).filter(Boolean).slice(0, 4)
    });

    for (const key of Object.keys(ALIASES)) {
      if (m.includes(key)) {
        const p = PROJECTS.find((x) => x.repo === ALIASES[key]);
        if (p) {
          const status = p.status === 'private' ? ' It is private for now, so there is no public code yet.'
            : p.status === 'empty' ? ' The repo is set up and waiting for its first commit.'
            : p.status === 'progress' ? ' It is still in progress.' : '';
          return { answer: p.title + ' (' + monthYear(p.created) + ', ' + p.meta + '): ' + p.desc + status, sources: [srcFor(p)].filter(Boolean) };
        }
      }
    }
    if (has('current', 'working on', 'right now', 'in progress', 'lately', 'latest')) {
      return list(PROJECTS.filter((p) => p.current === true), 'Here is what Arya is working on right now:');
    }
    if (has(' ai ', 'artificial', 'llm', 'agent', ' bot')) return list(PROJECTS.filter((p) => p.genre === 'ai'), 'Arya’s AI projects:');
    if (has('data', 'machine learning', ' ml ', 'model', 'deep learning', 'kaggle', 'vision')) return list(PROJECTS.filter((p) => p.genre === 'data'), 'Arya’s data science and machine learning projects:');
    if (has('software', 'engineering', 'java', 'programming', 'app')) return list(PROJECTS.filter((p) => p.genre === 'software'), 'Arya’s software projects:');
    if (has('study', 'studying', 'degree', 'uni', 'monash', 'course', 'education', 'student')) return { answer: PROFILE.study, sources: [] };
    if (has('contact', 'email', 'linkedin', 'reach', 'hire', 'connect', 'github')) {
      return { answer: 'The best ways to reach Arya are LinkedIn and GitHub. Links are below.', sources: PROFILE.contact };
    }
    if (has('hobby', 'hobbies', 'outside', 'tennis', 'gym', 'chess', 'free time', 'fun')) return { answer: PROFILE.hobbies, sources: [] };
    if (has('language', 'tools', 'tech', 'stack', 'python', 'skills')) {
      return { answer: 'Arya mostly works in Python and Jupyter notebooks for data science and AI, plus Java, JavaScript, Oracle SQL and MongoDB for software, and Microsoft Azure for hosting.', sources: [] };
    }
    if (has(' hi ', 'hello', ' hey ', 'g’day', 'gday')) return { answer: 'Hi! Ask me anything about Arya: projects, studies or interests.', sources: [] };
    return { answer: 'I can only answer questions about Arya: projects, studies and interests. Try one of the blocks below.', sources: [] };
  }

  async function ask(question) {
    const q = question.trim();
    if (!q || busy) return;
    busy = true;
    fireBtn.disabled = true;
    blocksEl.querySelectorAll('.bot-block').forEach((b) => { b.disabled = true; });

    addMessage('user', q);
    fireAtInvader();
    const typing = showTyping();

    let data;
    let failed = false;
    try {
      if (CONFIG.endpoint) {
        data = await askBackend(q);
      } else {
        await new Promise((r) => setTimeout(r, motionOff() ? 150 : 600));
        data = demoAnswer(q);
      }
    } catch (err) {
      failed = true;
      data = { answer: OFFLINE_TEXT };
    }
    if (CONFIG.endpoint) setOffline(failed);

    typing.remove();
    addMessage('bot', data.answer, { sources: data.sources, typewriter: true, error: failed });
    // history holds earlier turns only; the current question travels separately as `message`.
    if (!failed) history.push({ role: 'user', content: q }, { role: 'assistant', content: data.answer });

    busy = false;
    fireBtn.disabled = false;
    fillBlocks(Array.isArray(data.suggestions) ? data.suggestions : null);
  }

  /* ---------- Open, close, submit ---------- */
  function open() {
    panel.hidden = false;
    launcher.setAttribute('aria-expanded', 'true');
    if (!started) {
      started = true;
      spawnWave();
      fillBlocks(null);
      addMessage('bot', 'Player one ready! I’m Arya-bot. Ask me about Arya’s projects, studies or interests. Pick a block or type a question, then hit FIRE.');
      if (!CONFIG.endpoint) {
        const note = document.createElement('p');
        note.className = 'bot-mode';
        note.textContent = 'Demo mode: answers come from this site’s project list until the full AI goes live.';
        log.append(note);
      }
    }
    if (CONFIG.endpoint) {
      checkOnline().then((online) => {
        const wasOffline = !statusEl.hidden;
        setOffline(!online);
        if (!online && !wasOffline) addMessage('bot', OFFLINE_TEXT, { error: true });
      });
    }
    input.focus();
  }

  function close() {
    panel.hidden = true;
    launcher.setAttribute('aria-expanded', 'false');
    launcher.focus();
  }

  launcher.addEventListener('click', open);
  panel.querySelector('.bot-close').addEventListener('click', close);
  panel.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const q = input.value;
    if (!q.trim() || busy) return;
    input.value = '';
    ask(q);
  });
})();
