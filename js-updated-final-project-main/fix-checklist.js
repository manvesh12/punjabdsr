const fs = require('fs');
const file = 'apps/web/public/legacy/js/portal.bundle.js';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /const fmOk = !!\(S\.frontMatter && \([\s\S]*?\)\);/,
  `const fmOk = !!(S.frontMatter && (
      (S.frontMatter.title && S.frontMatter.title !== 'District Survey Report for Sand Mining') ||
      (S.frontMatter.district && S.frontMatter.district !== 'Jalandhar') ||
      (S.frontMatter.preface && S.frontMatter.preface.trim().length > 5)
    )) || (S.frontMatterFiles && Object.keys(S.frontMatterFiles).length > 0);`
);

content = content.replace(
  /const chaptersOk = S\.chapters \? Object\.values\(S\.chapters\)[\s\S]*? \: false;/,
  `let chapterCount = S.chapters ? Object.values(S.chapters).filter(c => c && typeof c === 'string' && c.trim() && c.length > 20).length : 0;
    if (S.chapterPDFs) chapterCount += Object.keys(S.chapterPDFs).length;
    const chaptersOk = chapterCount >= 10;`
);

fs.writeFileSync(file, content);
console.log('Successfully replaced renderFinalChecklist logic with regex');
