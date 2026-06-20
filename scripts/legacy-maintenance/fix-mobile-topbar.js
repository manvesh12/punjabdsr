const fs = require('fs');
const cssFile = 'apps/web/public/legacy/css/mobile-overrides.css';

let css = fs.readFileSync(cssFile, 'utf8');

if (!css.includes('position: absolute !important; /* Make topbar movable */')) {
  css = css.replace(
    '.topbar, .dash-global-topbar {',
    '.topbar, .dash-global-topbar {\n      position: absolute !important; /* Make topbar movable */'
  );
  fs.writeFileSync(cssFile, css);
  console.log('Mobile overrides updated to make topbar absolute (movable).');
} else {
  console.log('Already updated.');
}
