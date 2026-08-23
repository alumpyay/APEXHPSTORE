const fs = require('fs');
let content = fs.readFileSync('src/components/CheckoutModal.tsx', 'utf-8');

content = content.replace(
  /paymentReceiptUrl: receiptImage \|\| null,\s*transactionId: formData\.transactionId \|\| null,/,
  `paymentReceiptUrl: receiptImage || undefined,
        transactionId: formData.transactionId || undefined,`
);

fs.writeFileSync('src/components/CheckoutModal.tsx', content);
console.log("Patched!");
