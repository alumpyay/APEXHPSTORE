const fs = require('fs');
const content = fs.readFileSync('src/context/StoreContext.tsx', 'utf-8');
const regex = /if \(totalTownshipsSaved < totalTownshipsNew\) \{/;
const replacement = `if (totalTownshipsSaved < totalTownshipsNew || (reg[0] && reg[0].townships[0] && reg[0].townships[0].wepoztFeeMMK === undefined)) {`;
fs.writeFileSync('src/context/StoreContext.tsx', content.replace(regex, replacement));
console.log("Patched StoreContext.tsx");
