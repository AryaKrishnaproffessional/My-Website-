/*
 * Level scenes: small animated pixel-art arcade screens (inline SVG + SMIL).
 * All sprites are original. script.js inserts them and pauses them when motion is off.
 *
 *   maze  - Level 1 (software): a little robot eats dots while bugs patrol the maze
 *   space - Level 2 (data science): a ship fires at a formation of chart-shaped aliens
 *   climb - Level 3 (AI): a robot climbs girders to a rogue AI chip; data cubes roll down
 *   coin  - Bonus stage (current projects): a spinning coin
 */
(function () {
  'use strict';

  // Turn a pixel grid ("X" = filled) into SVG rects at (x, y), one unit per pixel.
  function pixels(rows, colour) {
    let rects = '';
    rows.forEach((row, y) => {
      for (let x = 0; x < row.length; x++) {
        if (row[x] === 'X') rects += '<rect x="' + x + '" y="' + y + '" width="1" height="1"/>';
      }
    });
    return '<g fill="' + colour + '">' + rects + '</g>';
  }

  const SPRITES = {
    bitOpen:  ['.XXXXX.', 'XX.X.XX', 'XXXXXXX', 'XX.....', 'XXXXXXX', '.X...X.', 'XX...XX'],
    bitShut:  ['.XXXXX.', 'XX.X.XX', 'XXXXXXX', 'XXXXXXX', 'XXXXXXX', '.X...X.', 'XX...XX'],
    bug:      ['X.....X', '.X.X.X.', 'XXXXXXX', 'X.XXX.X', 'XXXXXXX', 'X.X.X.X'],
    barAlien: ['......XX', '...XX.XX', 'XX.XX.XX', 'XX.XX.XX', 'XXXXXXXX', 'X.XXXX.X', '.X....X.'],
    dotAlien: ['..X..X..', '.XXXXXX.', 'XX.XX.XX', 'XXXXXXXX', '.X.XX.X.', 'X......X'],
    ship:     ['....X....', '...XXX...', '...XXX...', '.X.XXX.X.', 'XXXXXXXXX', 'XX.X.X.XX'],
    climber:  ['..XX..', '.XXXX.', '.X..X.', '.XXXX.', 'XXXXXX', 'X.XX.X', '.X..X.', '.X..X.'],
    coin:     ['..XXXX..', '.XX..XX.', 'XX.XX.XX', 'XX.XX.XX', 'XX.XX.XX', 'XX.XX.XX', '.XX..XX.', '..XXXX..']
  };

  const at = (x, y, scale, inner) => '<g transform="translate(' + x + ' ' + y + ') scale(' + scale + ')">' + inner + '</g>';
  const svg = (label, body) => '<svg viewBox="0 0 160 120" role="img" aria-label="' + label + '" shape-rendering="crispEdges">' +
    '<rect width="160" height="120" fill="#05051A"/>' + body + '</svg>';

  /* ---------- Level 1: maze ---------- */
  function maze() {
    const wall = 'fill="none" stroke="#3B5BFF" stroke-width="3"';
    let body = '<rect x="4" y="4" width="152" height="112" rx="6" ' + wall + '/>' +
      '<rect x="22" y="24" width="50" height="22" rx="4" ' + wall + '/>' +
      '<rect x="88" y="24" width="50" height="22" rx="4" ' + wall + '/>' +
      '<rect x="22" y="74" width="116" height="20" rx="4" ' + wall + '/>';

    // Dots along the middle corridor disappear as the robot passes them.
    const startX = 6, endX = 146, dur = 4;
    for (let x = 18; x <= 142; x += 14) {
      const t = Math.min(0.98, Math.max(0.01, (x - startX - 6) / (endX - startX)));
      body += '<rect x="' + (x - 1.5) + '" y="58.5" width="3" height="3" fill="#FFD9A0">' +
        '<animate attributeName="opacity" values="1;1;0;0" keyTimes="0;' + t.toFixed(3) + ';' + (t + 0.01).toFixed(3) + ';1" dur="' + dur + 's" repeatCount="indefinite"/></rect>';
    }
    // Power pellets in the corners blink.
    [[12, 12], [146, 12], [12, 106], [146, 106]].forEach(([x, y]) => {
      body += '<rect x="' + (x - 2.5) + '" y="' + (y - 2.5) + '" width="5" height="5" fill="#FFD9A0">' +
        '<animate attributeName="opacity" values="1;0.2;1" dur="0.8s" repeatCount="indefinite"/></rect>';
    });

    // The robot "Bit" chomps along the corridor.
    body += '<g><animateTransform attributeName="transform" type="translate" values="' + startX + ' 54.5; ' + endX + ' 54.5" dur="' + dur + 's" repeatCount="indefinite"/>' +
      '<g transform="scale(1.5)">' +
        '<g>' + pixels(SPRITES.bitOpen, '#FFD23F') + '<animate attributeName="opacity" values="1;0" dur="0.3s" calcMode="discrete" repeatCount="indefinite"/></g>' +
        '<g opacity="0">' + pixels(SPRITES.bitShut, '#FFD23F') + '<animate attributeName="opacity" values="0;1" dur="0.3s" calcMode="discrete" repeatCount="indefinite"/></g>' +
      '</g></g>';

    // Two bugs patrol the top and bottom corridors.
    body += '<g><animateTransform attributeName="transform" type="translate" values="132 9; 20 9; 132 9" dur="5s" repeatCount="indefinite"/>' +
      at(0, 0, 1.4, pixels(SPRITES.bug, '#FF5A6E')) + '</g>';
    body += '<g><animateTransform attributeName="transform" type="translate" values="20 100; 132 100; 20 100" dur="6s" repeatCount="indefinite"/>' +
      at(0, 0, 1.4, pixels(SPRITES.bug, '#57E389')) + '</g>';
    return svg('Level 1 maze: a little robot eats dots while bugs patrol', body);
  }

  /* ---------- Level 2: space ---------- */
  function space() {
    let body = '';
    [[14, 70], [40, 96], [70, 64], [118, 92], [146, 58], [98, 10], [28, 8]].forEach(([x, y], i) => {
      body += '<rect x="' + x + '" y="' + y + '" width="1.5" height="1.5" fill="#FFFFFF">' +
        '<animate attributeName="opacity" values="1;0.2;1" dur="' + (1.2 + i * 0.3).toFixed(1) + 's" repeatCount="indefinite"/></rect>';
    });

    let formation = '';
    [22, 48, 74, 100, 126].forEach((x, i) => {
      formation += at(x, 16, 1.6, pixels(SPRITES.barAlien, '#4DE1FF'));
      const alien = at(x, 36, 1.6, pixels(SPRITES.dotAlien, '#FF4FD8'));
      formation += i === 2
        ? '<g>' + alien + '<animate attributeName="opacity" values="1;1;0;0;1" keyTimes="0;0.55;0.6;0.9;1" dur="3s" repeatCount="indefinite"/></g>'
        : alien;
    });
    body += '<g><animateTransform attributeName="transform" type="translate" calcMode="discrete" ' +
      'values="-8 0;-4 0;0 0;4 0;8 0;4 0;0 0;-4 0" dur="3.2s" repeatCount="indefinite"/>' + formation + '</g>';

    // The ship slides along the bottom, firing as it goes.
    body += '<g><animateTransform attributeName="transform" type="translate" values="22 98; 124 98; 22 98" dur="5s" repeatCount="indefinite"/>' +
      '<rect x="6.5" y="-6" width="1.5" height="5" fill="#FFD23F">' +
        '<animate attributeName="y" values="-6;-80" dur="0.7s" repeatCount="indefinite"/>' +
        '<animate attributeName="opacity" values="1;1;0" keyTimes="0;0.9;1" dur="0.7s" repeatCount="indefinite"/></rect>' +
      at(0, 0, 1.6, pixels(SPRITES.ship, '#F3F1FF')) + '</g>';
    return svg('Level 2 space: a ship fires at a formation of chart-shaped aliens', body);
  }

  /* ---------- Level 3: climb ---------- */
  function climb() {
    const girder = (x1, y1, x2, y2) =>
      '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="#FF6B4A" stroke-width="4"/>' +
      '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="#05051A" stroke-width="1.2" stroke-dasharray="1.5 5"/>';
    const ladder = (x, yTop, yBottom) => {
      let rungs = '';
      for (let y = yTop + 3; y < yBottom; y += 4) rungs += '<line x1="' + (x - 3) + '" y1="' + y + '" x2="' + (x + 3) + '" y2="' + y + '"/>';
      return '<g stroke="#FFB000" stroke-width="1.2"><line x1="' + (x - 3) + '" y1="' + yTop + '" x2="' + (x - 3) + '" y2="' + yBottom + '"/>' +
        '<line x1="' + (x + 3) + '" y1="' + yTop + '" x2="' + (x + 3) + '" y2="' + yBottom + '"/>' + rungs + '</g>';
    };

    let body = ladder(130, 81, 105) + ladder(30, 47, 77) + ladder(120, 22, 43) +
      girder(6, 110, 154, 104) + girder(6, 76, 154, 82) + girder(6, 48, 154, 42) + girder(96, 22, 154, 22);

    // The rogue AI chip waits at the top.
    body += '<g><rect x="128" y="5" width="22" height="15" fill="#2B2B55" stroke="#4DE1FF" stroke-width="1"/>' +
      '<g stroke="#4DE1FF" stroke-width="1">' +
        '<line x1="132" y1="2" x2="132" y2="5"/><line x1="139" y1="2" x2="139" y2="5"/><line x1="146" y1="2" x2="146" y2="5"/>' +
      '</g>' +
      '<rect x="133" y="9" width="4" height="3" fill="#FF5A6E"><animate attributeName="fill" values="#FF5A6E;#FFD23F;#FF5A6E" dur="1s" repeatCount="indefinite"/></rect>' +
      '<rect x="141" y="9" width="4" height="3" fill="#FF5A6E"><animate attributeName="fill" values="#FF5A6E;#FFD23F;#FF5A6E" dur="1s" repeatCount="indefinite"/></rect>' +
      '<rect x="135" y="15" width="8" height="1.5" fill="#4DE1FF"/></g>';

    // Data cubes roll down the girders.
    const cube = (begin) => '<g><animateTransform attributeName="transform" type="translate" ' +
      'values="140 36; 10 42; 10 70; 140 76; 140 98; 10 104; 10 104" keyTimes="0;0.28;0.34;0.62;0.68;0.97;1" dur="7s" begin="' + begin + 's" repeatCount="indefinite"/>' +
      '<g><animateTransform attributeName="transform" type="rotate" values="0 3 3;-360 3 3" dur="0.8s" repeatCount="indefinite"/>' +
      '<rect width="6" height="6" fill="#57E389"/><rect x="2" y="1" width="2" height="4" fill="#05051A"/></g></g>';
    body += cube(0) + cube(-3.5);

    // The robot climbs from the bottom to the top.
    body += '<g><animateTransform attributeName="transform" type="translate" ' +
      'values="14 98; 124 94; 124 70; 24 66; 24 36; 114 32; 114 11; 114 11" keyTimes="0;0.3;0.42;0.65;0.75;0.9;0.98;1" dur="10s" repeatCount="indefinite"/>' +
      at(0, 0, 1.4, pixels(SPRITES.climber, '#F3F1FF')) + '</g>';
    return svg('Level 3 climb: a robot climbs girders towards a rogue AI chip while data cubes roll down', body);
  }

  /* ---------- Bonus stage: coin ---------- */
  function coin() {
    const body = '<g transform="translate(80 50)"><g>' +
      '<animateTransform attributeName="transform" type="scale" values="1 1;0.15 1;1 1" dur="1.4s" repeatCount="indefinite"/>' +
      at(-16, -16, 4, pixels(SPRITES.coin, '#FFD23F')) + '</g></g>' +
      '<text x="80" y="100" text-anchor="middle" font-family="\'Press Start 2P\', monospace" font-size="9" fill="#FF4FD8">INSERT COIN' +
      '<animate attributeName="opacity" values="1;1;0" dur="1.2s" calcMode="discrete" repeatCount="indefinite"/></text>';
    return svg('Bonus stage: a spinning coin above the words insert coin', body);
  }

  window.MASCOTS = { maze: maze(), space: space(), climb: climb(), coin: coin() };
})();
