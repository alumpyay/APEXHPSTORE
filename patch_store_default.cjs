const fs = require('fs');
let content = fs.readFileSync('src/context/StoreContext.tsx', 'utf-8');
content = content.replace(
  /footerCopyright: '\u00A9 2026 Apex Jerseys Co\. All rights reserved\. Built with precision for athletic fans worldwide\.',/,
  `footerCopyright: '© 2026 Apex Jerseys Co. All rights reserved. Built with precision for athletic fans worldwide.',
  tiktokLink: '',
  viberLink: '',
  telegramLink: '',`
);
fs.writeFileSync('src/context/StoreContext.tsx', content);
console.log("Patched StoreContext defaultSiteContent");
