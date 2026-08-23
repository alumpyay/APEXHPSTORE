const fs = require('fs');
let content = fs.readFileSync('src/components/OrderTrackerModal.tsx', 'utf-8');

content = content.replace(
  /const getStepIndex = \(status: OrderStatus\) => \{\s*const idx = steps\.indexOf\(status\);\s*return idx === -1 \? 0 : idx;\s*\};/,
  `const getStepIndex = (status: OrderStatus) => {
    if (status === 'Pending Payment Verification' || status === 'Cancelled') return -1;
    const idx = steps.indexOf(status);
    return idx === -1 ? -1 : idx;
  };`
);

content = content.replace(
  /Status: <\/span>\n\s*<span className="text-lg font-black text-white uppercase">\n\s*\{currentOrder\.status\}\n\s*<\/span>/,
  `Status: </span>
                    <span className={\`text-lg font-black uppercase \${currentOrder.status === 'Cancelled' ? 'text-red-500' : currentOrder.status === 'Pending Payment Verification' ? 'text-amber-400' : 'text-white'}\`}>
                      {currentOrder.status}
                    </span>`
);

fs.writeFileSync('src/components/OrderTrackerModal.tsx', content);
console.log("Patched OrderTrackerModal");
