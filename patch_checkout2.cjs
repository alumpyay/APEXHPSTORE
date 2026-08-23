const fs = require('fs');
let content = fs.readFileSync('src/context/StoreContext.tsx', 'utf-8');

content = content.replace(
  /setDoc\(doc\(db, 'orders', newOrder\.id\), newOrder\)\.catch\(console\.error\);/,
  `const orderToSave = { ...newOrder };
    Object.keys(orderToSave).forEach(key => {
      if (orderToSave[key as keyof Order] === undefined) {
        delete orderToSave[key as keyof Order];
      }
    });
    setDoc(doc(db, 'orders', newOrder.id), orderToSave).catch(console.error);`
);

fs.writeFileSync('src/context/StoreContext.tsx', content);
console.log("Patched!");
