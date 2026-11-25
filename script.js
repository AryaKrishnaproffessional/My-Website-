/*
 * Arya's Arcade: Arya Krishna's portfolio, laid out as retro arcade levels.
 * A small hash router renders each page from assets/projects.js.
 * Routes: #home, #software, #data-science, #ai, #now-playing
 */
(function () {
  'use strict';

  const GH = 'https://github.com/AryaKrishnaproffessional/';
  const LINKEDIN = 'https://www.linkedin.com/in/arya-krishna-085937321/';
  const PROJECTS = window.PROJECTS || [];
  const MASCOTS = window.MASCOTS || {};
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const GENRES = {
    software: {
      route: 'software', level: 1, name: 'Software projects', label: 'Software', scene: 'maze', color: '#FFD23F',
      intro: 'Software engineering in Python, Java, SQL and JavaScript. Every path through the maze has a purpose.',
      card: 'projects in Python, Java, SQL and JavaScript.'
    },
    data: {
      route: 'data-science', level: 2, name: 'Data science projects', label: 'Data science', scene: 'space', color: '#4DE1FF',
      intro: 'Data science and machine learning: forecasting, computer vision and deep learning, newest first.',
      card: 'projects in forecasting, computer vision and deep learning.'
    },
    ai: {
      route: 'ai', level: 3, name: 'AI projects', label: 'AI', scene: 'climb', color: '#FF6B4A',
      intro: 'Chatbots, language models and bots that make decisions. The final climb.',
      card: 'projects: a chatbot, an LLM challenge and a trading bot.'
    }
  };
  const SOON_COLOR = '#FF4FD8';
  const fmtMonth = new Intl.DateTimeFormat(undefined, { month: 'long', timeZone: 'UTC' });
  const fmtMonthYear = new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric', timeZone: 'UTC' });
  const toDate = (ym) => new Date(Date.UTC(Number(ym.slice(0, 4)), Number(ym.slice(5, 7)) - 1, 1));

  const main = document.getElementById('main');
  const aside = document.querySelector('.timeline');

  /* Helpers */
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const isCurrent = (p) => p.current === true;
  // Current projects with no public code yet get the "Soon to roll!" stamp.
  const isSoon = (p) => isCurrent(p) && (p.status === 'private' || p.status === 'empty');
  const listNames = (arr) => {
    const names = arr.map((p) => esc(p.title));
    return names.length < 2 ? names.join('') : names.slice(0, -1).join(', ') + ' and ' + names[names.length - 1];
  };
  const monthName = (ym) => fmtMonth.format(toDate(ym));
  const monthYear = (ym) => fmtMonthYear.format(toDate(ym));
  const newestFirst = (a, b) => b.created.localeCompare(a.created);
  const genreKeyForRoute = (route) => Object.keys(GENRES).find((k) => GENRES[k].route === route);
  const screen = (name) => '<div class="screen">' + (MASCOTS[name] || '') + '</div>';

  function statusText(p) {
    if (p.status === 'progress') return 'in progress';
    if (p.status === 'private') return 'private';
    if (p.status === 'empty') return 'first commit pending';
    return p.meta;
  }

  function projectCard(p) {
    let link = '<a class="card-link" href="' + GH + esc(p.repo) + '" target="_blank" rel="noopener">View ' + esc(p.title) + ' on GitHub</a>';
    if (p.status === 'private' && p.contact) {
      link = '<p class="private-note">This project is private. If you want to know more about it, ' +
        '<a href="' + LINKEDIN + '" target="_blank" rel="noopener">contact me on LinkedIn</a>.</p>';
    } else if (p.status === 'private') {
      link = '<span class="private-note">Private repo for now</span>';
    }
    return '<article class="card panel">' +
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
    const current = PROJECTS.filter(isCurrent);
    const hidden = current.filter(isSoon);
    const playing = 'Right now I’m working on ' + listNames(current) + '.' +
      (hidden.length ? ' ' + listNames(hidden) + (hidden.length === 1 ? ' stays under wraps until it’s ready.' : ' stay under wraps until they’re ready.') : '');
    const levelCards = Object.keys(GENRES).map((key) => {
      const g = GENRES[key];
      return '<a class="level-card panel" data-genre="' + key + '" href="#' + g.route + '">' +
        screen(g.scene) +
        '<span class="level-tag">LEVEL ' + g.level + '</span>' +
        '<h2>' + g.name + '</h2>' +
        '<p>' + count(key) + ' ' + g.card + '</p>' +
        '<span class="start">START LEVEL ' + g.level + '</span>' +
        '</a>';
    }).join('');

    return '<section class="home-intro">' +
        '<p class="press-start">PLAYER 1 PRESS START</p>' +
        '<h1>Arya’s Arcade</h1>' +
        '<p class="lead">My GitHub projects as an arcade: three levels of software, data science and AI, plus a bonus stage for what I’m building now.</p>' +
        '<p class="about">I study the Bachelor of Data Science Advanced (Honours) at Monash University, and I love using data for research and to help businesses grow. Away from the keyboard you’ll find me on the tennis court, at the gym, or a few moves ahead in a game of chess.</p>' +
      '</section>' +
      '<section class="section" aria-labelledby="select-level">' +
        '<h2 class="section-title" id="select-level">SELECT A LEVEL</h2>' +
        '<div class="levels">' + levelCards + '</div>' +
      '</section>' +
      '<section class="bonus-band panel" aria-labelledby="bonus-title">' +
        screen('coin') +
        '<div><span class="level-tag" style="color: var(--bonus)">BONUS STAGE</span>' +
        '<h2 class="section-title" id="bonus-title">Current projects</h2>' +
        '<p>' + playing + '</p></div>' +
        '<a class="button" href="#now-playing">PLAY BONUS</a>' +
      '</section>';
  }

  function renderGenre(key) {
    const g = GENRES[key];
    const list = PROJECTS.filter((p) => p.genre === key).sort(newestFirst);
    return '<section class="intro">' +
        screen(g.scene) +
        '<div class="intro-text"><span class="level-tag">LEVEL ' + g.level + ' OF 3</span><h1>' + g.name + '</h1><p>' + g.intro + '</p></div>' +
      '</section>' +
      '<section class="grid" aria-label="' + g.label + ' projects">' + list.map(projectCard).join('') + '</section>';
  }

  function renderNowPlaying() {
    const current = PROJECTS.filter(isCurrent).sort(newestFirst);
    const live = current.filter((p) => !isSoon(p));
    const soon = current.filter(isSoon);
    const liveCards = live.map((p) => {
      const g = GENRES[p.genre];
      return '<article class="card panel live-card">' +
        '<span class="player-dot" aria-hidden="true" style="background:' + g.color + '"></span>' +
        '<div><h3>' + esc(p.title) + '</h3>' +
        '<span class="meta">Level ' + g.level + ', ' + g.label + ', last updated ' + esc(p.pushed || monthYear(p.created)) + '</span>' +
        '<a class="card-link" href="' + GH + esc(p.repo) + '" target="_blank" rel="noopener">View ' + esc(p.title) + ' on GitHub</a></div>' +
        '</article>';
    }).join('');
    const soonCards = soon.map((p) => {
      const note = p.status === 'private'
        ? 'Private, started ' + monthYear(p.created)
        : 'Public, first commit pending';
      return '<article class="card panel soon-card">' +
        '<span class="stamp">Soon to roll!</span>' +
        '<h3>' + esc(p.title) + '</h3>' +
        '<p class="desc">' + esc(p.desc) + '</p>' +
        '<span class="private-note">' + note + '</span>' +
        '</article>';
    }).join('');

    return '<section class="intro">' +
        screen('coin') +
        '<div class="intro-text"><span class="level-tag">BONUS STAGE</span>' +
        '<h1>Current projects</h1>' +
        '<p>What I’m working on right now: ' + listNames(current) + '.</p>' +
      '</div></section>' +
      (live.length ? '<section class="section"><h2 class="section-title">IN PROGRESS</h2><div class="grid">' + liveCards + '</div></section>' : '') +
      (soon.length ? '<section class="section"><h2 class="section-title">COMING SOON</h2><div class="grid">' + soonCards + '</div></section>' : '');
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
    const legend = Object.keys(GENRES).map((k) => '<li><span style="background:' + GENRES[k].color + '"></span>Level ' + GENRES[k].level + ': ' + GENRES[k].label + '</li>').join('') +
      '<li><span style="background:' + SOON_COLOR + '"></span>Bonus: coming soon</li>';

    aside.innerHTML = '<h2 id="timeline-title">PLAY HISTORY</h2>' +
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
    main.querySelectorAll('.screen svg').forEach((svg) => {
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

  /* Router */
  const TITLES = { home: 'Arya’s Arcade', software: 'Software projects', 'data-science': 'Data science projects', ai: 'AI projects', 'now-playing': 'Current projects' };

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

    document.title = name === 'home' ? 'Arya Krishna · Arya’s Arcade' : TITLES[name] + ' · Arya Krishna';
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
