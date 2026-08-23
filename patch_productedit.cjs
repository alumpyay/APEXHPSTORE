const fs = require('fs');
let content = fs.readFileSync('src/components/ProductEditModal.tsx', 'utf-8');

content = content.replace(
  /Array\.from\(files\)\.map\(file => compressImage\(file\)\)/,
  `Array.from(files).map((file) => compressImage(file as File))`
);

fs.writeFileSync('src/components/ProductEditModal.tsx', content);
console.log("Patched!");
