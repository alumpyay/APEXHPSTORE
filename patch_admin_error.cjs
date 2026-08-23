const fs = require('fs');
let content = fs.readFileSync('src/components/AdminPortal.tsx', 'utf-8');

content = content.replace(
  /setLoginError\('Authentication failed\. You must be an authorized admin\.'\);/,
  "setLoginError(error?.message ? `Login failed: ${error.message} (Note: If you are on Vercel, you may need to add your Vercel domain to Firebase Auth Authorized Domains)` : 'Authentication failed. You must be an authorized admin.');"
);

fs.writeFileSync('src/components/AdminPortal.tsx', content);
console.log("Patched AdminPortal");
