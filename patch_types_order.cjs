const fs = require('fs');
let content = fs.readFileSync('src/types.ts', 'utf-8');

content = content.replace(
  /export type OrderStatus = 'Order Placed' \| 'Customization & Printing' \| 'Quality Check' \| 'Dispatched' \| 'In Transit' \| 'Out for Delivery' \| 'Delivered';/,
  "export type OrderStatus = 'Pending Payment Verification' | 'Order Placed' | 'Customization & Printing' | 'Quality Check' | 'Dispatched' | 'In Transit' | 'Out for Delivery' | 'Delivered' | 'Cancelled';"
);

fs.writeFileSync('src/types.ts', content);
console.log("Patched types.ts OrderStatus");
