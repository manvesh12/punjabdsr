const fs = require('fs');
const path = require('path');

function getHtmlFiles(dir) {
  let files = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      files = files.concat(getHtmlFiles(fullPath));
    } else if (item.name.endsWith('.html')) {
      files.push(fullPath);
    }
  }
  return files;
}

const targetRegex = /width:72px; height:72px;/g;
const replacement = `width:96px; height:96px;`;

const baseDir = 'apps/web/public/legacy';
const htmlFiles = getHtmlFiles(baseDir);

let count = 0;
for (const file of htmlFiles) {
  let content = fs.readFileSync(file, 'utf8');
  if (targetRegex.test(content)) {
    fs.writeFileSync(file, content.replace(targetRegex, replacement));
    console.log(`Replaced logo size in ${file}`);
    count++;
  }
}
console.log(`Finished replacing logo size in ${count} files.`);
