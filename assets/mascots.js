/*
 * Animated mascots (inline SVG with SMIL animation).
 * script.js inserts them and pauses them when the viewer prefers reduced motion.
 */
window.MASCOTS = {
  jukebox: `
<svg viewBox="0 0 240 320" role="img" aria-label="A jukebox playing a record">
  <g>
    <g>
      <ellipse cx="0" cy="0" rx="5" ry="3.6" fill="#B07415" transform="rotate(-20)"/>
      <rect x="3.6" y="-18" width="1.6" height="18" fill="#B07415"/>
      <animateTransform attributeName="transform" type="translate" values="70 70; 60 20" dur="3s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0;1;0" dur="3s" repeatCount="indefinite"/>
    </g>
    <g>
      <ellipse cx="0" cy="0" rx="5" ry="3.6" fill="#B07415" transform="rotate(-20)"/>
      <rect x="3.6" y="-18" width="1.6" height="18" fill="#B07415"/>
      <animateTransform attributeName="transform" type="translate" values="170 64; 184 14" dur="3.4s" begin="1.2s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0;1;0" dur="3.4s" begin="1.2s" repeatCount="indefinite"/>
    </g>
  </g>
  <path d="M20 312 V140 A100 100 0 0 1 220 140 V312 Z" fill="#6B3E1F" stroke="#C9A24A" stroke-width="6"/>
  <path d="M44 300 V144 A76 76 0 0 1 196 144 V300 Z" fill="#2A1A10"/>
  <path d="M52 144 A68 68 0 0 1 188 144" fill="none" stroke-width="5" stroke-linecap="round" stroke="#F2B544">
    <animate attributeName="stroke" values="#F2B544;#E8664A;#F7E3A8;#F2B544" dur="4s" repeatCount="indefinite"/>
  </path>
  <rect x="26" y="140" width="14" height="164" rx="7" fill="#F2B544">
    <animate attributeName="fill" values="#F2B544;#E8664A;#F2B544" dur="3s" repeatCount="indefinite"/>
  </rect>
  <rect x="200" y="140" width="14" height="164" rx="7" fill="#E8664A">
    <animate attributeName="fill" values="#E8664A;#F2B544;#E8664A" dur="3s" repeatCount="indefinite"/>
  </rect>
  <circle cx="33" cy="296" r="3.5" fill="#FFF6DD"><animate attributeName="cy" values="296;148" dur="2.2s" repeatCount="indefinite"/></circle>
  <circle cx="33" cy="296" r="2.5" fill="#FFF6DD"><animate attributeName="cy" values="296;148" dur="2.2s" begin="0.8s" repeatCount="indefinite"/></circle>
  <circle cx="207" cy="296" r="3" fill="#FFF6DD"><animate attributeName="cy" values="296;148" dur="2.6s" begin="0.4s" repeatCount="indefinite"/></circle>
  <circle cx="207" cy="296" r="2.5" fill="#FFF6DD"><animate attributeName="cy" values="296;148" dur="2.6s" begin="1.5s" repeatCount="indefinite"/></circle>
  <rect x="62" y="118" width="116" height="88" rx="10" fill="#F3E7CC"/>
  <g>
    <circle cx="120" cy="164" r="34" fill="#141010"/>
    <circle cx="120" cy="164" r="27" fill="none" stroke="#3A3330"/>
    <circle cx="120" cy="164" r="20" fill="none" stroke="#3A3330"/>
    <circle cx="120" cy="164" r="10" fill="#B8322A"/>
    <rect x="118" y="155" width="4" height="4" fill="#F3E7CC"/>
    <animateTransform attributeName="transform" type="rotate" from="0 120 164" to="360 120 164" dur="2.4s" repeatCount="indefinite"/>
  </g>
  <circle cx="120" cy="164" r="2" fill="#F3E7CC"/>
  <path d="M168 126 L150 150" stroke="#8A6A2E" stroke-width="3" stroke-linecap="round"/>
  <circle cx="168" cy="126" r="4" fill="#C9A24A"/>
  <g fill="#F3E7CC">
    <rect x="64" y="216" width="16" height="9" rx="2"/>
    <rect x="84" y="216" width="16" height="9" rx="2"/>
    <rect x="104" y="216" width="16" height="9" rx="2" fill="#F2B544"><animate attributeName="fill" values="#F2B544;#F3E7CC;#F2B544" dur="1.2s" repeatCount="indefinite"/></rect>
    <rect x="124" y="216" width="16" height="9" rx="2"/>
    <rect x="144" y="216" width="16" height="9" rx="2"/>
    <rect x="164" y="216" width="12" height="9" rx="2"/>
  </g>
  <rect x="62" y="236" width="116" height="58" rx="8" fill="#4A2C17"/>
  <g stroke="#C9A24A" stroke-width="2">
    <line x1="76" y1="242" x2="76" y2="288"/><line x1="90" y1="242" x2="90" y2="288"/>
    <line x1="104" y1="242" x2="104" y2="288"/><line x1="118" y1="242" x2="118" y2="288"/>
    <line x1="132" y1="242" x2="132" y2="288"/><line x1="146" y1="242" x2="146" y2="288"/>
    <line x1="160" y1="242" x2="160" y2="288"/>
  </g>
  <rect x="10" y="304" width="220" height="14" rx="4" fill="#C9A24A"/>
</svg>`,

  mic: `
<svg viewBox="0 0 240 320" role="img" aria-label="A vibrating microphone sending out sound waves">
  <defs>
    <pattern id="micmesh" width="7" height="7" patternUnits="userSpaceOnUse">
      <path d="M0 0 L7 7 M7 0 L0 7" stroke="#8E8798" stroke-width="1"/>
    </pattern>
  </defs>
  <circle cx="120" cy="88" r="50" fill="none" stroke="#C2456B" stroke-width="3">
    <animate attributeName="r" values="50;112" dur="1.8s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="0.8;0" dur="1.8s" repeatCount="indefinite"/>
  </circle>
  <circle cx="120" cy="88" r="50" fill="none" stroke="#F2B544" stroke-width="3">
    <animate attributeName="r" values="50;112" dur="1.8s" begin="0.6s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="0.8;0" dur="1.8s" begin="0.6s" repeatCount="indefinite"/>
  </circle>
  <circle cx="120" cy="88" r="50" fill="none" stroke="#C2456B" stroke-width="2">
    <animate attributeName="r" values="50;112" dur="1.8s" begin="1.2s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="0.6;0" dur="1.8s" begin="1.2s" repeatCount="indefinite"/>
  </circle>
  <g fill="#F2B544">
    <path d="M36 52 l4 10 l10 4 l-10 4 l-4 10 l-4 -10 l-10 -4 l10 -4 Z"><animate attributeName="opacity" values="0;1;0" dur="1.6s" repeatCount="indefinite"/></path>
    <path d="M196 30 l3 8 l8 3 l-8 3 l-3 8 l-3 -8 l-8 -3 l8 -3 Z"><animate attributeName="opacity" values="1;0;1" dur="1.4s" repeatCount="indefinite"/></path>
  </g>
  <line x1="120" y1="252" x2="120" y2="296" stroke="#3B302A" stroke-width="6"/>
  <ellipse cx="120" cy="300" rx="52" ry="10" fill="#3B302A"/>
  <g>
    <animateTransform attributeName="transform" type="translate" values="0 0; -2 1; 2 -1; -1 -2; 2 2; 0 0" dur="0.28s" repeatCount="indefinite"/>
    <rect x="78" y="28" width="84" height="112" rx="42" fill="#E9E5EF"/>
    <rect x="78" y="28" width="84" height="112" rx="42" fill="url(#micmesh)" stroke="#6E6678" stroke-width="3"/>
    <path d="M92 44 Q100 36 110 34" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round" fill="none" opacity="0.8"/>
    <rect x="74" y="126" width="92" height="20" rx="5" fill="#F2B544"/>
    <rect x="74" y="133" width="92" height="5" fill="#C2456B"/>
    <path d="M90 146 L150 146 L138 254 L102 254 Z" fill="#3B302A"/>
    <rect x="113" y="172" width="14" height="26" rx="4" fill="#C2456B"/>
    <circle cx="120" cy="214" r="3" fill="#F2B544"><animate attributeName="opacity" values="1;0.2;1" dur="0.9s" repeatCount="indefinite"/></circle>
  </g>
</svg>`,

  robot: `
<svg viewBox="0 0 240 320" role="img" aria-label="A robot DJ with blinking eyes playing two turntables">
  <line x1="120" y1="22" x2="120" y2="50" stroke="#B8A99A" stroke-width="4"/>
  <circle cx="120" cy="18" r="8" fill="#5FD3DB">
    <animate attributeName="fill" values="#5FD3DB;#E08A3C;#5FD3DB" dur="1s" repeatCount="indefinite"/>
    <animate attributeName="r" values="7;10;7" dur="0.8s" repeatCount="indefinite"/>
  </circle>
  <path d="M44 108 A76 76 0 0 1 196 108" fill="none" stroke="#E08A3C" stroke-width="10"/>
  <rect x="50" y="50" width="140" height="112" rx="28" fill="#4A403A" stroke="#5FD3DB" stroke-width="3"/>
  <rect x="32" y="84" width="24" height="54" rx="9" fill="#E08A3C"/>
  <rect x="184" y="84" width="24" height="54" rx="9" fill="#E08A3C"/>
  <rect x="68" y="76" width="104" height="44" rx="22" fill="#2A221D"/>
  <g data-eyes>
    <ellipse cx="100" cy="98" rx="9" ry="9" fill="#5FD3DB"><animate attributeName="ry" values="9;9;1;9;9" keyTimes="0;0.45;0.5;0.55;1" dur="3.2s" repeatCount="indefinite"/></ellipse>
    <ellipse cx="140" cy="98" rx="9" ry="9" fill="#5FD3DB"><animate attributeName="ry" values="9;9;1;9;9" keyTimes="0;0.45;0.5;0.55;1" dur="3.2s" repeatCount="indefinite"/></ellipse>
  </g>
  <g fill="#5FD3DB">
    <rect x="96" y="134" width="6" height="12" rx="2"><animate attributeName="height" values="4;14;6;12;4" dur="0.6s" repeatCount="indefinite"/></rect>
    <rect x="106" y="134" width="6" height="12" rx="2"><animate attributeName="height" values="12;4;14;6;12" dur="0.6s" repeatCount="indefinite"/></rect>
    <rect x="116" y="134" width="6" height="12" rx="2" fill="#E08A3C"><animate attributeName="height" values="6;14;4;10;6" dur="0.6s" repeatCount="indefinite"/></rect>
    <rect x="126" y="134" width="6" height="12" rx="2"><animate attributeName="height" values="14;6;12;4;14" dur="0.6s" repeatCount="indefinite"/></rect>
    <rect x="136" y="134" width="6" height="12" rx="2"><animate attributeName="height" values="4;10;14;6;4" dur="0.6s" repeatCount="indefinite"/></rect>
  </g>
  <rect x="104" y="162" width="32" height="12" fill="#6E6058"/>
  <rect x="84" y="172" width="72" height="36" rx="10" fill="#6E6058" stroke="#E08A3C" stroke-width="2"/>
  <path d="M86 186 L58 218" stroke="#B8A99A" stroke-width="6" stroke-linecap="round"/>
  <path d="M154 186 L182 218" stroke="#B8A99A" stroke-width="6" stroke-linecap="round"/>
  <rect x="16" y="208" width="208" height="64" rx="12" fill="#5A4C44" stroke="#E08A3C" stroke-width="2"/>
  <g>
    <circle cx="70" cy="240" r="24" fill="#2A221D" stroke="#5FD3DB" stroke-width="2"/>
    <line x1="70" y1="218" x2="70" y2="230" stroke="#5FD3DB" stroke-width="3"/>
    <animateTransform attributeName="transform" type="rotate" from="0 70 240" to="360 70 240" dur="1.6s" repeatCount="indefinite"/>
  </g>
  <g>
    <circle cx="170" cy="240" r="24" fill="#2A221D" stroke="#E08A3C" stroke-width="2"/>
    <line x1="170" y1="218" x2="170" y2="230" stroke="#E08A3C" stroke-width="3"/>
    <animateTransform attributeName="transform" type="rotate" from="0 170 240" to="-360 170 240" dur="1.6s" repeatCount="indefinite"/>
  </g>
  <rect x="106" y="236" width="28" height="6" rx="3" fill="#6E6058"/>
  <rect x="112" y="232" width="8" height="14" rx="2" fill="#FFF4E6"><animate attributeName="x" values="108;124;108" dur="2s" repeatCount="indefinite"/></rect>
  <g fill="#5FD3DB">
    <rect x="40" y="300" width="14" height="10" rx="2"><animate attributeName="height" values="6;18;10;6" dur="0.8s" repeatCount="indefinite"/><animate attributeName="y" values="304;292;300;304" dur="0.8s" repeatCount="indefinite"/></rect>
    <rect x="62" y="300" width="14" height="10" rx="2" fill="#E08A3C"><animate attributeName="height" values="18;6;14;18" dur="0.8s" repeatCount="indefinite"/><animate attributeName="y" values="292;304;296;292" dur="0.8s" repeatCount="indefinite"/></rect>
    <rect x="84" y="300" width="14" height="10" rx="2"><animate attributeName="height" values="10;20;6;10" dur="0.8s" repeatCount="indefinite"/><animate attributeName="y" values="300;290;304;300" dur="0.8s" repeatCount="indefinite"/></rect>
    <rect x="106" y="300" width="14" height="10" rx="2" fill="#E08A3C"><animate attributeName="height" values="20;10;16;20" dur="0.8s" repeatCount="indefinite"/><animate attributeName="y" values="290;300;294;290" dur="0.8s" repeatCount="indefinite"/></rect>
    <rect x="128" y="300" width="14" height="10" rx="2"><animate attributeName="height" values="6;16;20;6" dur="0.8s" repeatCount="indefinite"/><animate attributeName="y" values="304;294;290;304" dur="0.8s" repeatCount="indefinite"/></rect>
    <rect x="150" y="300" width="14" height="10" rx="2" fill="#E08A3C"><animate attributeName="height" values="14;6;18;14" dur="0.8s" repeatCount="indefinite"/><animate attributeName="y" values="296;304;292;296" dur="0.8s" repeatCount="indefinite"/></rect>
    <rect x="172" y="300" width="14" height="10" rx="2"><animate attributeName="height" values="10;18;6;10" dur="0.8s" repeatCount="indefinite"/><animate attributeName="y" values="300;292;304;300" dur="0.8s" repeatCount="indefinite"/></rect>
    <rect x="194" y="300" width="14" height="10" rx="2" fill="#E08A3C"><animate attributeName="height" values="16;8;12;16" dur="0.8s" repeatCount="indefinite"/><animate attributeName="y" values="294;302;298;294" dur="0.8s" repeatCount="indefinite"/></rect>
  </g>
</svg>`
};
