const fs = require('fs');

let content = fs.readFileSync('src/context/StoreContext.tsx', 'utf-8');

// We can add a helper at the top or inside the context provider.
// Let's add it right before StoreProvider
content = content.replace(
  /export const StoreProvider: React\.FC<\{ children: React\.ReactNode \}> = \(\{ children \}\) => \{/,
  `const cleanUndefined = (obj: any) => {
  const cleaned = { ...obj };
  Object.keys(cleaned).forEach(key => {
    if (cleaned[key] === undefined) {
      delete cleaned[key];
    }
  });
  return cleaned;
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {`
);

// 207: setDoc(doc(db, 'products', prod.id), prod)
content = content.replace(
  /setDoc\(doc\(db, 'products', prod\.id\), prod\)/g,
  `setDoc(doc(db, 'products', prod.id), cleanUndefined(prod))`
);

// 600: setDoc(doc(db, 'products', item.productId), newP, { merge: true })
content = content.replace(
  /setDoc\(doc\(db, 'products', item\.productId\), newP, \{ merge: true \}\)/g,
  `setDoc(doc(db, 'products', item.productId), cleanUndefined(newP), { merge: true })`
);

// 682: setDoc(doc(db, 'products', newId), newProduct)
content = content.replace(
  /setDoc\(doc\(db, 'products', newId\), newProduct\)/g,
  `setDoc(doc(db, 'products', newId), cleanUndefined(newProduct))`
);

// 689: setDoc(doc(db, 'products', id), updatedFields, { merge: true })
content = content.replace(
  /setDoc\(doc\(db, 'products', id\), updatedFields, \{ merge: true \}\)/g,
  `setDoc(doc(db, 'products', id), cleanUndefined(updatedFields), { merge: true })`
);

// 709: setDoc(doc(db, 'products', productId), newP, { merge: true })
content = content.replace(
  /setDoc\(doc\(db, 'products', productId\), newP, \{ merge: true \}\)/g,
  `setDoc(doc(db, 'products', productId), cleanUndefined(newP), { merge: true })`
);


fs.writeFileSync('src/context/StoreContext.tsx', content);
console.log("Patched products clean!");
