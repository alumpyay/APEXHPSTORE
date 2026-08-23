const fs = require('fs');

let content = fs.readFileSync('src/context/StoreContext.tsx', 'utf-8');

content = content.replace(
  /\} else if \(!isAdminLoggedIn\) \{\s*\/\/ Fallback for initial UI rendering if nothing is in DB yet\s*setProducts\(INITIAL_PRODUCTS\);\s*\}/,
  `} else {
         setProducts(INITIAL_PRODUCTS);
         if (isAdminLoggedIn) {
            // Seed DB with initial products
            INITIAL_PRODUCTS.forEach(prod => {
              setDoc(doc(db, 'products', prod.id), prod).catch(console.error);
            });
         }
      }`
);

fs.writeFileSync('src/context/StoreContext.tsx', content);
console.log("Patched products init!");
