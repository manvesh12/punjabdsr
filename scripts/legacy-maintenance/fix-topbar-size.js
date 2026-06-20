const fs = require('fs');
const cssFile = 'apps/web/public/legacy/css/mobile-overrides.css';

let css = fs.readFileSync(cssFile, 'utf8');

if (!css.includes('/* Hide bulky topbar elements on mobile */')) {
  css += `
/* Hide bulky topbar elements on mobile */
@media (max-width: 900px) {
  .dash-global-topbar .dash-switcher-bar,
  .dash-global-topbar .dash-gov-utility-strip,
  .dash-global-topbar .dash-menu-links,
  .dash-global-topbar .dash-menu-search {
    display: none !important;
  }

  .dash-global-topbar {
    max-height: none !important;
    height: auto !important;
    padding-bottom: 10px !important;
  }
  
  body:not(.view-dashboard-active) .app-workspace,
  .app-workspace {
    padding-top: 130px !important; /* Adjust padding since topbar is now much smaller */
  }
}
`;
  fs.writeFileSync(cssFile, css);
  console.log('Mobile topbar size fixed.');
} else {
  console.log('Already fixed.');
}
