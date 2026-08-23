const fs = require('fs');
let content = fs.readFileSync('src/context/StoreContext.tsx', 'utf-8');

content = content.replace(
  /status: 'Order Placed',/,
  "status: 'Pending Payment Verification',"
);

fs.writeFileSync('src/context/StoreContext.tsx', content);
console.log("Patched StoreContext initial order status");
