const fs = require('fs');
const path = require('path');

const b64 = 'data:image/png;base64,' + fs.readFileSync(path.join(__dirname, 'images/DOGLOGO.png')).toString('base64');

// Filter: black lines on white PNG → brand green lines on transparent background
// Alpha = inverse of luminance (dark pixel → opaque, white pixel → transparent)
// Color = #1a5c38 (R:0.102, G:0.361, B:0.220)
const greenFilter = `
    <filter id="makeGreen" color-interpolation-filters="sRGB" x="-5%" y="-5%" width="110%" height="110%">
      <feColorMatrix type="matrix"
        values="0      0      0      0  0.102
                0      0      0      0  0.361
                0      0      0      0  0.220
               -0.2126 -0.7152 -0.0722  0  1"/>
    </filter>`;

// ── Icon — just the dog, no circle, green on transparent ───────
const icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" role="img" aria-label="Riley logo">
  <defs>${greenFilter}</defs>
  <image href="${b64}" x="0" y="0" width="200" height="200" filter="url(#makeGreen)"/>
</svg>`;

// ── Full horizontal lockup ─────────────────────────────────────
const fullLogo = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 200" role="img" aria-label="Riley — Your Daily Life Hub">
  <defs>${greenFilter}</defs>

  <!-- White background -->
  <rect width="520" height="200" fill="white" rx="16"/>

  <!-- Dog — green on white, large -->
  <image href="${b64}" x="8" y="0" width="200" height="200" filter="url(#makeGreen)"/>

  <!-- "Riley" wordmark -->
  <text x="224" y="106"
        font-family="'Atkinson Hyperlegible', 'Segoe UI', Arial, sans-serif"
        font-size="88" font-weight="700" fill="#1a5c38" letter-spacing="-2">Riley</text>

  <!-- Tagline -->
  <text x="228" y="138"
        font-family="'Atkinson Hyperlegible', 'Segoe UI', Arial, sans-serif"
        font-size="21" font-weight="400" fill="#557055" letter-spacing="0.8">Your Daily Life Hub</text>

  <!-- Green underline accent -->
  <rect x="228" y="148" width="280" height="4" rx="2" fill="#c8e6ce"/>
</svg>`;

fs.writeFileSync(path.join(__dirname, 'images/riley-icon.svg'),  icon,     'utf8');
fs.writeFileSync(path.join(__dirname, 'images/riley-logo.svg'),  fullLogo, 'utf8');
console.log('riley-icon.svg: ' + Math.round(icon.length/1024)     + 'KB');
console.log('riley-logo.svg: ' + Math.round(fullLogo.length/1024) + 'KB');
