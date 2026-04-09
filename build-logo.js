const fs = require('fs');
const path = require('path');

const b64 = 'data:image/png;base64,' + fs.readFileSync(path.join(__dirname, 'images/DOGLOGO.png')).toString('base64');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 180" role="img" aria-label="Riley — Your Daily Life Hub">
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
    <filter id="badgeShadow" x="-8%" y="-8%" width="116%" height="116%">
      <feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#00000030"/>
    </filter>
    <clipPath id="badgeClip">
      <circle cx="90" cy="90" r="83"/>
    </clipPath>
  </defs>

  <!-- Green circle badge -->
  <circle cx="90" cy="90" r="88" fill="#1a5c38" filter="url(#badgeShadow)"/>
  <circle cx="90" cy="90" r="83" fill="none" stroke="rgba(255,255,255,0.13)" stroke-width="2"/>

  <!-- Dog image — white bg removed, colorized gold -->
  <image href="${b64}" x="5" y="8" width="170" height="164"
         clip-path="url(#badgeClip)" filter="url(#makeGold)"/>

  <!-- Wordmark -->
  <text x="202" y="86"
        font-family="'Atkinson Hyperlegible', 'Segoe UI', Arial, sans-serif"
        font-size="74" font-weight="700" fill="#1a5c38" letter-spacing="-1.5">Riley</text>

  <!-- Tagline -->
  <text x="206" y="116"
        font-family="'Atkinson Hyperlegible', 'Segoe UI', Arial, sans-serif"
        font-size="19" font-weight="400" fill="#557055" letter-spacing="0.6">Your Daily Life Hub</text>

  <!-- Green underline -->
  <rect x="206" y="125" width="300" height="3.5" rx="1.75" fill="#c8e6ce"/>

  <!-- Paw print flourish -->
  <g transform="translate(468,100)" opacity="0.3" fill="#1a5c38">
    <ellipse cx="0"  cy="0"  rx="5.5" ry="6"/>
    <ellipse cx="-9" cy="-7" rx="3.5" ry="3"/>
    <ellipse cx="0"  cy="-9" rx="3.5" ry="3"/>
    <ellipse cx="9"  cy="-7" rx="3.5" ry="3"/>
  </g>
</svg>`;

fs.writeFileSync(path.join(__dirname, 'images/riley-logo.svg'), svg, 'utf8');
console.log('riley-logo.svg written — ' + Math.round(svg.length / 1024) + 'KB');
