const fs = require('fs');

function replaceInFile(filePath, search, replacement) {
  let content = fs.readFileSync(filePath, 'utf-8');
  content = content.replace(search, replacement);
  fs.writeFileSync(filePath, content);
  console.log(`Replaced in ${filePath}`);
}

replaceInFile('src/components/CheckoutModal.tsx', /useState\('yangon'\)/g, "useState('yangon-region')");
replaceInFile('src/components/CheckoutModal.tsx', /useState\('kamayut'\)/g, "useState('yangon-region-kamayut')");

replaceInFile('src/components/AdminPortal.tsx', /useState<string>\('yangon'\)/g, "useState<string>('yangon-region')");

// We might also have kamayut in AdminPortal.tsx:
replaceInFile('src/components/AdminPortal.tsx', /useState<string>\('kamayut'\)/g, "useState<string>('yangon-region-kamayut')");

