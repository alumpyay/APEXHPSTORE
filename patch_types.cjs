const fs = require('fs');
let content = fs.readFileSync('src/types.ts', 'utf-8');
content = content.replace(
  /footerCopyright: string;/,
  `footerCopyright: string;
  tiktokLink?: string;
  viberLink?: string;
  telegramLink?: string;`
);
fs.writeFileSync('src/types.ts', content);
console.log("Patched types.ts");
