const fs = require('fs');
let content = fs.readFileSync('src/components/OrderTrackerModal.tsx', 'utf-8');

content = content.replace(
  /style=\{\{\s*width: \`\$\{\(currentStepIdx \/ \(steps\.length - 1\)\) \* 100\}%\`\s*\}\}/,
  "style={{ width: `${Math.max(0, (currentStepIdx / (steps.length - 1)) * 100)}%` }}"
);

fs.writeFileSync('src/components/OrderTrackerModal.tsx', content);
console.log("Patched tracker width");
