const fs = require('fs');
const file = 'apps/web/public/legacy/js/portal.bundle.js';
let content = fs.readFileSync(file, 'utf8');

const regex = /(loadReviewerNoteForView\(id,\s*titles\[id\]\s*\|\|\s*id\);\s*\})/g;

const replacement = `$1
    // Force re-translation of newly loaded view DOM elements if language is not English
    if (typeof currentPortalLanguage !== 'undefined' && currentPortalLanguage !== 'en') {
      setTimeout(() => {
        const combo = document.querySelector('.goog-te-combo');
        if (combo) {
          combo.value = currentPortalLanguage;
          combo.dispatchEvent(new Event('change'));
        }
      }, 400);
    }`;

if (regex.test(content)) {
    fs.writeFileSync(file, content.replace(regex, replacement));
    console.log('Successfully injected Google Translate trigger into showView via regex');
} else {
    console.log('Regex match failed in portal.bundle.js');
}
