const fs = require('fs');

const loginFile = 'apps/web/public/legacy/login.html';
let content = fs.readFileSync(loginFile, 'utf8');

// Add manifest to head if not present
if (!content.includes('manifest.json')) {
  content = content.replace(
    '</head>',
    `  <link rel="manifest" href="manifest.json">\n  <meta name="theme-color" content="#1e293b">\n  <link rel="apple-touch-icon" href="assets/smart-dsr-logo.png">\n</head>`
  );
}

// Add service worker registration script before body close
if (!content.includes('navigator.serviceWorker.register')) {
  content = content.replace(
    '</body>',
    `
  <!-- PWA Service Worker Registration -->
  <script>
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
          .then(registration => {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
          })
          .catch(err => {
            console.log('ServiceWorker registration failed: ', err);
          });
      });
    }
  </script>
</body>`
  );
}

fs.writeFileSync(loginFile, content);
console.log('Successfully injected PWA configuration into login.html');
