const fs = require('fs');
let content = fs.readFileSync('firestore.rules', 'utf-8');

content = content.replace(
  /function isAdmin\(\) \{\s*return request\.auth != null;\s*\}/,
  `function isAdmin() {
      return request.auth != null && request.auth.token.email == 'alumpy841@gmail.com';
    }`
);

fs.writeFileSync('firestore.rules', content);
console.log("Patched firestore.rules");
