const fs = require('fs');
const path = require('path');

const b64 = 'data:image/png;base64,' + fs.readFileSync(path.join(__dirname, 'images/DOGLOGO.png')).toString('base64');

// ── SVG filter: invert image → white lines on transparent bg ──
// Black line art on white → invert → white lines on black → alpha from luminance → white on transparent
const whiteFilter = `
    <filter id="makeWhite" color-interpolation-filters="sRGB" x="-5%" y="-5%" width="110%" height="110%">
      <!-- Step 1: invert so black lines become white, white bg becomes black -->
      <feComponentTransfer result="inv">
        <feFuncR type="linear" slope="-1" intercept="1"/>
        <feFuncG type="linear" slope="-1" intercept="1"/>
        <feFuncB type="linear" slope="-1" intercept="1"/>
      </feComponentTransfer>
      <!-- Step 2: set RGB=white, alpha=luminance of inverted image (white lines = opaque, black bg = transparent) -->
      <feColorMatrix in="inv" type="matrix"
        values="0 0 0 0 1
                0 0 0 0 1
                0 0 0 0 1
                0.2126 0.7152 0.0722 0 0"/>
    </filter>`;

// ── Icon only (circle badge) ───────────────────────────────────
const icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180" role="img" aria-label="Riley logo">
  <defs>
    ${whiteFilter}
    <clipPath id="c"><circle cx="90" cy="90" r="87"/></clipPath>
  </defs>

  <!-- Deep green circle -->
  <circle cx="90" cy="90" r="90" fill="#1a5c38"/>

  <!-- Subtle inner ring -->
  <circle cx="90" cy="90" r="85" fill="none" stroke="rgba(255,255,255,0.18)" stroke-width="2.5"/>

  <!-- Dog — white on green -->
  <image href="${b64}" x="2" y="6" width="176" height="168"
         clip-path="url(#c)" filter="url(#makeWhite)"/>
</svg>`;

// ── Full horizontal lockup ─────────────────────────────────────
const fullLogo = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 180" role="img" aria-label="Riley — Your Daily Life Hub">
  <defs>
    ${whiteFilter}
    <filter id="shadow" x="-8%" y="-8%" width="116%" height="116%">
      <feDropShadow dx="0" dy="3" stdDeviation="5" flood-color="#00000028"/>
    </filter>
    <clipPath id="c2"><circle cx="90" cy="90" r="86"/></clipPath>
  </defs>

  <!-- Badge -->
  <circle cx="90" cy="90" r="90" fill="#1a5c38" filter="url(#shadow)"/>
  <circle cx="90" cy="90" r="85" fill="none" stroke="rgba(255,255,255,0.18)" stroke-width="2.5"/>

  <!-- Dog white on green -->
  <image href="${b64}" x="2" y="6" width="176" height="168"
         clip-path="url(#c2)" filter="url(#makeWhite)"/>

  <!-- "Riley" wordmark -->
  <text x="198" y="90"
        font-family="'Atkinson Hyperlegible', 'Segoe UI', Arial, sans-serif"
        font-size="80" font-weight="700" fill="#1a5c38" letter-spacing="-2">Riley</text>

  <!-- Tagline -->
  <text x="202" y="120"
        font-family="'Atkinson Hyperlegible', 'Segoe UI', Arial, sans-serif"
        font-size="20" font-weight="400" fill="#557055" letter-spacing="0.8">Your Daily Life Hub</text>

  <!-- Underline accent -->
  <rect x="202" y="129" width="270" height="3.5" rx="1.75" fill="#c8e6ce"/>
</svg>`;

fs.writeFileSync(path.join(__dirname, 'images/riley-icon.svg'),  icon,     'utf8');
fs.writeFileSync(path.join(__dirname, 'images/riley-logo.svg'),  fullLogo, 'utf8');
console.log('riley-icon.svg: ' + Math.round(icon.length/1024)     + 'KB');
console.log('riley-logo.svg: ' + Math.round(fullLogo.length/1024) + 'KB');
