/*
 * The Setlist: Arya Krishna's portfolio.
 * A small hash router renders each page from assets/projects.js.
 * Routes: #home, #software, #data-science, #ai, #now-playing
 */
(function () {
  'use strict';

  const GH = 'https://github.com/AryaKrishnaproffessional/';
  const PROJECTS = window.PROJECTS || [];
  const MASCOTS = window.MASCOTS || {};
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const GENRES = {
    software: {
      route: 'software', name: 'Classical', label: 'Software', mascot: 'jukebox', color: '#B07415',
      intro: 'Software engineering projects. Well-structured programs where every part has a job, like a classical score.',
      card: 'software projects in Python, Java, SQL and JavaScript.'
    },
    data: {
      route: 'data-science', name: 'Pop', label: 'Data science', mascot: 'mic', color: '#C2456B',
      intro: 'Data science and machine learning: forecasting, computer vision and deep learning, newest first.',
      card: 'data science and machine learning projects.'
    },
    ai: {
      route: 'ai', name: 'EDM', label: 'AI', mascot: 'robot', color: '#23808C',
      intro: 'AI projects: chatbots, language models and bots that make decisions.',
      card: 'AI projects: a chatbot, an LLM challenge and a trading bot.'
    }
  };
  const SOON_COLOR = '#C0392B';
  const fmtMonth = new Intl.DateTimeFormat(undefined, { month: 'long', timeZone: 'UTC' });
  const fmtMonthYear = new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric', timeZone: 'UTC' });
  const toDate = (ym) => new Date(Date.UTC(Number(ym.slice(0, 4)), Number(ym.slice(5, 7)) - 1, 1));

  const main = document.getElementById('main');
  const aside = document.querySelector('.timeline');

  /* Helpers */
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const isSoon = (p) => p.status === 'private' || p.status === 'empty';
  const monthName = (ym) => fmtMonth.format(toDate(ym));
  const monthYear = (ym) => fmtMonthYear.format(toDate(ym));
  const newestFirst = (a, b) => b.created.localeCompare(a.created);
  const genreKeyForRoute = (route) => Object.keys(GENRES).find((k) => GENRES[k].route === route);
  const mascot = (name) => '<div class="mascot">' + (MASCOTS[name] || '') + '</div>';

  function statusText(p) {
    if (p.status === 'progress') return 'in progress';
    if (p.status === 'private') return 'private';
    if (p.status === 'empty') return 'first commit pending';
    return p.meta;
  }

  function projectCard(p) {
    const link = p.status === 'private'
      ? '<span class="private-note">Private repo for now</span>'
      : '<a class="card-link" href="' + GH + esc(p.repo) + '" target="_blank" rel="noopener">View ' + esc(p.title) + ' on GitHub</a>';
    return '<article class="card">' +
      (isSoon(p) ? '<span class="stamp">Soon to roll!</span>' : '') +
      '<h2>' + esc(p.title) + '</h2>' +
      '<span class="meta">' + monthYear(p.created) + ', ' + esc(statusText(p)) + '</span>' +
      '<p class="desc">' + esc(p.desc) + '</p>' +
      link +
      '</article>';
  }

  /* Pages */
  function renderHome() {
    const count = (g) => PROJECTS.filter((p) => p.genre === g).length;
    const soon = PROJECTS.filter(isSoon).length;
    const playing = PROJECTS.filter((p) => p.status === 'progress').length + soon;
    const genreCards = Object.keys(GENRES).map((key) => {
      const g = GENRES[key];
      return '<a class="genre-card" data-genre="' + key + '" href="#' + g.route + '">' +
        '<div class="art">' + mascot(g.mascot) + '</div>' +
        '<h2>' + g.name + '</h2>' +
        '<p>' + count(key) + ' ' + g.card + '</p>' +
        '<span class="open">Open ' + g.label.toLowerCase() + '</span>' +
        '</a>';
    }).join('');

    return '<section class="home-intro">' +
        '<h1>The Setlist</h1>' +
        '<p class="lead">My GitHub projects, sorted like a record collection. Software plays classical, data science plays pop, and AI plays EDM.</p>' +
        '<p class="about">I study the Bachelor of Data Science Advanced (Honours) at Monash University, and I love using data for research and to help businesses grow. Away from the keyboard you’ll find me on the tennis court, at the gym, or a few moves ahead in a game of chess.</p>' +
      '</section>' +
      '<section class="genres" aria-label="Genres">' + genreCards + '</section>' +
      '<section class="soon-band">' +
        '<div><span class="stamp">Soon to roll!</span>' +
        '<p>' + playing + ' projects are in progress right now. ' + soon + ' of them stay under wraps until they’re ready.</p></div>' +
        '<a class="button" href="#now-playing">See what’s playing</a>' +
      '</section>';
  }

  function renderGenre(key) {
    const g = GENRES[key];
    const list = PROJECTS.filter((p) => p.genre === key).sort(newestFirst);
    return '<section class="intro">' +
        '<div class="mascot-frame">' + mascot(g.mascot) + '</div>' +
        '<div class="intro-text"><h1>' + g.name + '</h1><p>' + g.intro + '</p></div>' +
      '</section>' +
      '<section class="grid" aria-label="' + g.label + ' projects">' + list.map(projectCard).join('') + '</section>';
  }

  function renderNowPlaying() {
    const live = PROJECTS.filter((p) => p.status === 'progress').sort(newestFirst);
    const soon = PROJECTS.filter(isSoon).sort(newestFirst);
    const liveCards = live.map((p) => {
      const g = GENRES[p.genre];
      return '<article class="card live-card">' +
        '<div class="record" aria-hidden="true"><span style="background:' + g.color + '"></span></div>' +
        '<div><h3>' + esc(p.title) + '</h3>' +
        '<span class="meta">' + g.label + ', last updated ' + esc(p.pushed || monthYear(p.created)) + '</span>' +
        '<a class="card-link" href="' + GH + esc(p.repo) + '" target="_blank" rel="noopener">View ' + esc(p.title) + ' on GitHub</a></div>' +
        '</article>';
    }).join('');
    const soonCards = soon.map((p) => {
      const note = p.status === 'private'
        ? 'Private, started ' + monthYear(p.created)
        : 'Public, first commit pending';
      return '<article class="card soon-card">' +
        '<span class="stamp">Soon to roll!</span>' +
        '<h3>' + esc(p.title) + '</h3>' +
        '<p class="desc">' + esc(p.desc) + '</p>' +
        '<span class="private-note">' + note + '</span>' +
        '</article>';
    }).join('');

    return '<section class="intro"><div class="intro-text">' +
        '<h1>Now playing</h1>' +
        '<p>What I’m working on right now. ' + live.length + ' projects are public. The rest are private or just getting started.</p>' +
      '</div></section>' +
      '<section class="section"><h2>In progress</h2><div class="grid">' + liveCards + '</div></section>' +
      '<section class="section"><h2>Coming soon</h2><div class="grid">' + soonCards + '</div></section>';
  }

  /* Timeline sidebar */
  function renderTimeline() {
    const sorted = PROJECTS.slice().sort((a, b) => a.created.localeCompare(b.created));
    const years = {};
    sorted.forEach((p) => { (years[p.created.slice(0, 4)] = years[p.created.slice(0, 4)] || []).push(p); });

    const yearsHtml = Object.keys(years).map((y) => {
      const items = years[y].map((p) => {
        const soon = isSoon(p);
        const color = soon ? SOON_COLOR : GENRES[p.genre].color;
        const href = soon ? '#now-playing' : '#' + GENRES[p.genre].route;
        return '<li><a href="' + href + '">' +
          '<span class="t-rail" aria-hidden="true"><span class="t-dot" style="background:' + color + '"></span></span>' +
          '<span class="t-text"><span class="t-name">' + esc(p.title) + '</span>' +
          '<span class="t-month">' + monthName(p.created) + '</span></span>' +
          '</a></li>';
      }).join('');
      return '<h3 class="year">' + y + '</h3><ol>' + items + '</ol>';
    }).join('');

    const first = sorted[0];
    const legend = Object.keys(GENRES).map((k) => '<li><span style="background:' + GENRES[k].color + '"></span>' + GENRES[k].name + ': ' + GENRES[k].label.toLowerCase() + '</li>').join('') +
      '<li><span style="background:' + SOON_COLOR + '"></span>Coming soon</li>';

    aside.innerHTML = '<h2 id="timeline-title">Project journey</h2>' +
      '<p class="sub">' + PROJECTS.length + ' projects since ' + (first ? monthYear(first.created) : '') + '</p>' +
      yearsHtml +
      '<ul class="legend" aria-label="Colour key">' + legend + '</ul>';
  }

  /* Mascot behaviour */
  const motionToggle = document.querySelector('.motion-toggle');
  let userPaused = false;
  try { userPaused = localStorage.getItem('setlist-paused') === '1'; } catch (e) { /* storage blocked */ }
  const isPaused = () => userPaused || reduceMotion.matches;

  function setUpMascots() {
    const paused = isPaused();
    document.body.classList.toggle('motion-paused', paused);
    main.querySelectorAll('.mascot svg').forEach((svg) => {
      if (!svg.pauseAnimations) return;
      if (paused) svg.pauseAnimations(); else svg.unpauseAnimations();
    });
    if (motionToggle) {
      motionToggle.setAttribute('aria-pressed', String(userPaused));
      motionToggle.textContent = userPaused ? 'Play animations' : 'Pause animations';
    }
  }

  if (motionToggle) {
    motionToggle.addEventListener('click', () => {
      userPaused = !userPaused;
      try { localStorage.setItem('setlist-paused', userPaused ? '1' : '0'); } catch (e) { /* storage blocked */ }
      setUpMascots();
    });
  }

  // The robot DJ's eyes follow the pointer.
  let eyeFrame = 0;
  document.addEventListener('pointermove', (e) => {
    if (isPaused() || eyeFrame) return;
    eyeFrame = requestAnimationFrame(() => {
      eyeFrame = 0;
      main.querySelectorAll('[data-eyes]').forEach((eyes) => {
        const box = eyes.ownerSVGElement.getBoundingClientRect();
        if (!box.width) return;
        const dx = (e.clientX - (box.left + box.width / 2)) / window.innerWidth;
        const dy = (e.clientY - (box.top + box.height * 0.3)) / window.innerHeight;
        const x = Math.max(-12, Math.min(12, dx * 40));
        const y = Math.max(-4, Math.min(4, dy * 16));
        eyes.setAttribute('transform', 'translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ')');
      });
    });
  });

  /* Router */
  const TITLES = { home: 'The Setlist', software: 'Software', 'data-science': 'Data science', ai: 'AI', 'now-playing': 'Now playing' };

  function route(focus) {
    let name = location.hash.replace('#', '') || 'home';
    if (!TITLES[name]) name = 'home';

    const key = genreKeyForRoute(name);
    if (key) {
      main.innerHTML = renderGenre(key);
      document.body.dataset.genre = key;
    } else if (name === 'now-playing') {
      main.innerHTML = renderNowPlaying();
      document.body.dataset.genre = 'soon';
    } else {
      main.innerHTML = renderHome();
      delete document.body.dataset.genre;
    }

    document.title = name === 'home' ? 'Arya Krishna · The Setlist' : TITLES[name] + ' · Arya Krishna';
    document.querySelectorAll('.site-nav a[data-route]').forEach((a) => {
      if (a.dataset.route === name) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
    setUpMascots();

    if (focus) {
      window.scrollTo(0, 0);
      main.focus({ preventScroll: true });
    }
  }

  document.getElementById('year').textContent = new Date().getFullYear();
  renderTimeline();
  route(false);
  window.addEventListener('hashchange', () => route(true));
  reduceMotion.addEventListener('change', () => route(false));
})();
