const fs = require('fs');

let content = fs.readFileSync('src/context/StoreContext.tsx', 'utf-8');

// 1. addProduct
content = content.replace(
  /setProducts\(\(prev\) => \[newProduct, \.\.\.prev\]\);/,
  `setProducts((prev) => [newProduct, ...prev]);\n    if (isAdminLoggedIn) { setDoc(doc(db, 'products', newId), newProduct).catch(console.error); }`
);

// 2. updateProduct
content = content.replace(
  /setProducts\(\(prev\) =>\s*prev\.map\(\(p\) => \(p\.id === id \? \{ \.\.\.p, \.\.\.updatedFields \} : p\)\)\s*\);/,
  `setProducts((prev) =>\n      prev.map((p) => (p.id === id ? { ...p, ...updatedFields } : p))\n    );\n    if (isAdminLoggedIn) { setDoc(doc(db, 'products', id), updatedFields, { merge: true }).catch(console.error); }`
);

// 3. deleteProduct
content = content.replace(
  /setProducts\(\(prev\) => prev\.filter\(\(p\) => p\.id !== id\)\);/,
  `setProducts((prev) => prev.filter((p) => p.id !== id));\n    if (isAdminLoggedIn) { deleteDoc(doc(db, 'products', id)).catch(console.error); }`
);

// 4. updateInventory
content = content.replace(
  /const updateInventory = \(productId: string, size: JerseySize, newCount: number\) => \{\s*setProducts\(\(prev\) =>\s*prev\.map\(\(p\) => \{\s*if \(p\.id === productId\) \{\s*return \{\s*\.\.\.p,\s*inventory: \{\s*\.\.\.p\.inventory,\s*\[size\]: Math\.max\(0, newCount\),\s*\},\s*\};\s*\}\s*return p;\s*\}\)\s*\);\s*\};/,
  `const updateInventory = (productId: string, size: JerseySize, newCount: number) => {
    setProducts((prev) => {
      const updated = prev.map((p) => {
        if (p.id === productId) {
          const newP = {
            ...p,
            inventory: {
              ...p.inventory,
              [size]: Math.max(0, newCount),
            },
          };
          if (isAdminLoggedIn) {
            setDoc(doc(db, 'products', productId), newP, { merge: true }).catch(console.error);
          }
          return newP;
        }
        return p;
      });
      return updated;
    });
  };`
);

// 5. createOrder (update products inventory and save order)
content = content.replace(
  /orderData\.items\.forEach\(\(item\) => \{\s*if \(item\.productId\) \{\s*const prodIdx = updated\.findIndex\(\(p\) => p\.id === item\.productId\);\s*if \(prodIdx > -1\) \{\s*const currentStock = updated\[prodIdx\]\.inventory\[item\.size\] \|\| 0;\s*const newStock = Math\.max\(0, currentStock - item\.quantity\);\s*updated\[prodIdx\] = \{\s*\.\.\.updated\[prodIdx\],\s*inventory: \{\s*\.\.\.updated\[prodIdx\]\.inventory,\s*\[item\.size\]: newStock,\s*\},\s*\};\s*\}\s*\}\s*\}\);/,
  `orderData.items.forEach((item) => {
        if (item.productId) {
          const prodIdx = updated.findIndex((p) => p.id === item.productId);
          if (prodIdx > -1) {
            const currentStock = updated[prodIdx].inventory[item.size] || 0;
            const newStock = Math.max(0, currentStock - item.quantity);
            const newP = {
              ...updated[prodIdx],
              inventory: {
                ...updated[prodIdx].inventory,
                [item.size]: newStock,
              },
            };
            updated[prodIdx] = newP;
            setDoc(doc(db, 'products', item.productId), newP, { merge: true }).catch(console.error);
          }
        }
      });`
);

// createOrder save to db
content = content.replace(
  /setOrders\(\(prev\) => \[newOrder, \.\.\.prev\]\);\s*clearCart\(\);\s*return newOrder;/,
  `setOrders((prev) => [newOrder, ...prev]);
    setDoc(doc(db, 'orders', newOrder.id), newOrder).catch(console.error);
    clearCart();
    return newOrder;`
);

// 6. updateOrderStatus
content = content.replace(
  /return \{\s*\.\.\.order,\s*status: newStatus,\s*timeline: \[newEvent, \.\.\.order\.timeline\],\s*\};/,
  `const newOrder = {
            ...order,
            status: newStatus,
            timeline: [newEvent, ...order.timeline],
          };
          if (isAdminLoggedIn) {
            setDoc(doc(db, 'orders', orderId), newOrder, { merge: true }).catch(console.error);
          }
          return newOrder;`
);

fs.writeFileSync('src/context/StoreContext.tsx', content);
console.log("Patched successfully!");
