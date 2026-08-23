const fs = require('fs');
let content = fs.readFileSync('src/context/StoreContext.tsx', 'utf-8');

content = content.replace(
  /if \(isAdminLoggedIn\) \{\s*setDoc\(doc\(db, 'orders', orderId\), newOrder, \{ merge: true \}\)\.catch\(console\.error\);\s*\}/,
  `if (isAdminLoggedIn) {
            const orderToSave = { ...newOrder };
            Object.keys(orderToSave).forEach(key => {
              if (orderToSave[key as keyof Order] === undefined) {
                delete orderToSave[key as keyof Order];
              }
            });
            setDoc(doc(db, 'orders', orderId), orderToSave, { merge: true }).catch(console.error);
          }`
);

fs.writeFileSync('src/context/StoreContext.tsx', content);
console.log("Patched StoreContext order update");
