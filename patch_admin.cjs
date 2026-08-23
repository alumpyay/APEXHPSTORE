const fs = require('fs');
let content = fs.readFileSync('src/components/AdminPortal.tsx', 'utf-8');

const toolbarRegex = /\(\['Customization & Printing', 'Quality Check', 'Dispatched', 'In Transit', 'Out for Delivery', 'Delivered'\] as OrderStatus\[\]\)\.map\(st => \(/;

const newToolbar = `(['Pending Payment Verification', 'Order Placed', 'Customization & Printing', 'Quality Check', 'Dispatched', 'In Transit', 'Out for Delivery', 'Delivered', 'Cancelled'] as OrderStatus[]).map(st => (`;

content = content.replace(toolbarRegex, newToolbar);

content = content.replace(
  /order\.status === st\n\s*\? 'bg-amber-400 text-zinc-950 font-black'\n\s*: 'bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700'/,
  `order.status === st
                                  ? (st === 'Cancelled' ? 'bg-red-500 text-white font-black' : 'bg-amber-400 text-zinc-950 font-black')
                                  : (st === 'Cancelled' ? 'bg-red-950 text-red-400 hover:bg-red-900 hover:text-white' : 'bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700')`
);

content = content.replace(
  /\{st\}/g,
  `{st === 'Pending Payment Verification' ? 'Pending' : st === 'Order Placed' ? 'Confirm Payment' : st}`
);

fs.writeFileSync('src/components/AdminPortal.tsx', content);
console.log("Patched AdminPortal Toolbar");
