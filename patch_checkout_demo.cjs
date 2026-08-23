const fs = require('fs');
let content = fs.readFileSync('src/components/CheckoutModal.tsx', 'utf-8');

const regex = /\{\/\* Quick Demo Slip Helper \*\/\}[\s\S]*?\{\/\* Customer Phone or TxID input \*\/\}/;
content = content.replace(regex, "{/* Customer Phone or TxID input */}");

fs.writeFileSync('src/components/CheckoutModal.tsx', content);
console.log("Patched CheckoutModal");
