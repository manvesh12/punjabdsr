const fs = require('fs');
const file = 'apps/web/public/legacy/js/portal.bundle.js';
let content = fs.readFileSync(file, 'utf8');

const target = `    if (typeof loadReviewerNoteForView === 'function') {
      loadReviewerNoteForView(id, titles[id] || id);
    }
  }`;

const replacement = `    if (typeof loadReviewerNoteForView === 'function') {
      loadReviewerNoteForView(id, titles[id] || id);
    }
    
    // Force re-translation of newly loaded view DOM elements if language is not English
    if (typeof currentPortalLanguage !== 'undefined' && currentPortalLanguage !== 'en') {
      setTimeout(() => {
        const combo = document.querySelector('.goog-te-combo');
        if (combo) {
          // Re-trigger the change event so Google Translate catches the new innerHTML
          combo.value = currentPortalLanguage;
          combo.dispatchEvent(new Event('change'));
        }
      }, 300);
    }
  }`;

if (content.includes(target)) {
    fs.writeFileSync(file, content.replace(target, replacement));
    console.log('Successfully replaced end of showView to trigger Google Translate');
} else {
    console.log('Target string not found');
}
