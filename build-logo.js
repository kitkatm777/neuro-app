const fs = require('fs');
const path = require('path');

const b64 = 'data:image/png;base64,' + fs.readFileSync(path.join(__dirname, 'images/DOGLOGO.png')).toString('base64');

// ── Icon only (circle badge) — used in topbar ──────────────
const icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180" role="img" aria-label="Riley logo">
  <defs>
    <filter id="makeGold" color-interpolation-filters="sRGB" x="0%" y="0%" width="100%" height="100%">
      <feComponentTransfer result="inverted">
        <feFuncR type="linear" slope="-1" intercept="1"/>
        <feFuncG type="linear" slope="-1" intercept="1"/>
        <feFuncB type="linear" slope="-1" intercept="1"/>
      </feComponentTransfer>
      <feColorMatrix type="matrix" result="alphaFromLuma"
        values="0 0 0 0 0.933
                0 0 0 0 0.627
                0 0 0 0 0.094
                0.2126 0.7152 0.0722 0 0"/>
      <feFlood flood-color="#E8A018" result="goldFlood"/>
      <feComposite in="goldFlood" in2="alphaFromLuma" operator="in"/>
    </filter>
    <clipPath id="c"><circle cx="90" cy="90" r="85"/></clipPath>
  </defs>
  <circle cx="90" cy="90" r="90" fill="#1a5c38"/>
  <circle cx="90" cy="90" r="85" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="2"/>
  <image href="${b64}" x="5" y="10" width="170" height="160"
         clip-path="url(#c)" filter="url(#makeGold)"/>
</svg>`;

// ── Full horizontal lockup — for standalone use ────────────
const fullLogo = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 180" role="img" aria-label="Riley — Your Daily Life Hub">
  <defs>
    <filter id="makeGold" color-interpolation-filters="sRGB" x="0%" y="0%" width="100%" height="100%">
      <feComponentTransfer result="inverted">
        <feFuncR type="linear" slope="-1" intercept="1"/>
        <feFuncG type="linear" slope="-1" intercept="1"/>
        <feFuncB type="linear" slope="-1" intercept="1"/>
      </feComponentTransfer>
      <feColorMatrix type="matrix" result="alphaFromLuma"
        values="0 0 0 0 0.933
                0 0 0 0 0.627
                0 0 0 0 0.094
                0.2126 0.7152 0.0722 0 0"/>
      <feFlood flood-color="#E8A018" result="goldFlood"/>
      <feComposite in="goldFlood" in2="alphaFromLuma" operator="in"/>
    </filter>
    <filter id="shadow" x="-8%" y="-8%" width="116%" height="116%">
      <feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#00000030"/>
    </filter>
    <clipPath id="c2"><circle cx="90" cy="90" r="83"/></clipPath>
  </defs>
  <circle cx="90" cy="90" r="88" fill="#1a5c38" filter="url(#shadow)"/>
  <circle cx="90" cy="90" r="83" fill="none" stroke="rgba(255,255,255,0.13)" stroke-width="2"/>
  <image href="${b64}" x="7" y="10" width="166" height="160"
         clip-path="url(#c2)" filter="url(#makeGold)"/>
  <text x="198" y="88"
        font-family="'Atkinson Hyperlegible', 'Segoe UI', Arial, sans-serif"
        font-size="80" font-weight="700" fill="#1a5c38" letter-spacing="-2">Riley</text>
  <text x="202" y="118"
        font-family="'Atkinson Hyperlegible', 'Segoe UI', Arial, sans-serif"
        font-size="20" font-weight="400" fill="#557055" letter-spacing="0.8">Your Daily Life Hub</text>
  <rect x="202" y="127" width="270" height="3.5" rx="1.75" fill="#c8e6ce"/>
</svg>`;

fs.writeFileSync(path.join(__dirname, 'images/riley-icon.svg'),  icon,     'utf8');
fs.writeFileSync(path.join(__dirname, 'images/riley-logo.svg'),  fullLogo, 'utf8');
console.log('riley-icon.svg: ' + Math.round(icon.length/1024) + 'KB');
console.log('riley-logo.svg: ' + Math.round(fullLogo.length/1024) + 'KB');
