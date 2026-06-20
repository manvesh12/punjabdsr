const fs = require('fs');
const cssFile = 'apps/web/public/legacy/css/reference-home.css';

let css = fs.readFileSync(cssFile, 'utf8');

if (!css.includes('/* Mobile fixes for DSR Report Home Page */')) {
  css += `
/* Mobile fixes for DSR Report Home Page */
@media (max-width: 768px) {
  .intro-text {
    font-size: 2.2rem !important;
    white-space: normal !important;
    line-height: 1.2;
    text-align: center;
    padding: 0 10px;
  }
  .intro-logo-img {
    width: 100px !important;
    height: 100px !important;
    margin-bottom: 10px;
  }
  .intro-branding {
    flex-direction: column !important;
    gap: 0 !important;
    width: 100% !important;
  }
  .hero-title {
    font-size: 2.2rem !important;
    line-height: 1.2 !important;
  }
  .hero-logo-img {
    width: 140px !important;
    height: 140px !important;
  }
  .hero-description {
    font-size: 1rem !important;
    padding: 0 10px;
  }
}
`;
  fs.writeFileSync(cssFile, css);
  console.log('Mobile fixes applied to reference-home.css');
} else {
  console.log('Mobile fixes already applied.');
}
