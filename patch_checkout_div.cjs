const fs = require('fs');
let content = fs.readFileSync('src/components/CheckoutModal.tsx', 'utf-8');

content = content.replace(
  /\{\/\* Customer Phone or TxID input \*\/\}/,
  `</div>\n\n                  {/* Customer Phone or TxID input */}`
);

fs.writeFileSync('src/components/CheckoutModal.tsx', content);
console.log("Patched CheckoutModal");
