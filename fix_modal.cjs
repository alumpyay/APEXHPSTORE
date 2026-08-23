const fs = require('fs');
let content = fs.readFileSync('src/components/SiteContentEditModal.tsx', 'utf-8');

content = content.replace(
  /<\/div>\n            <\/div>\n            <\/div>\n          <\/div>\n\n          \{\/\* Section 5: Social Links \*\/\}/,
  '</div>\n            </div>\n          </div>\n\n          {/* Section 5: Social Links */}'
);

fs.writeFileSync('src/components/SiteContentEditModal.tsx', content);
console.log("Fixed extra div!");
