const fs = require('fs');
let content = fs.readFileSync('src/context/StoreContext.tsx', 'utf-8');

content = content.replace(
  /if \(isAdminLoggedIn\) \{\s*unsubOrders = onSnapshot\(collection\(db, 'orders'\), \(snapshot\) => \{\s*const o: Order\[\] = \[\];\s*snapshot\.forEach\(d => o\.push\(d\.data\(\) as Order\)\);\s*\/\/ sort by newest\s*setOrders\(o\.sort\(\(a,b\) => new Date\(b\.createdAt\)\.getTime\(\) - new Date\(a\.createdAt\)\.getTime\(\)\)\);\s*\}\);\s*\}/,
  `unsubOrders = onSnapshot(collection(db, 'orders'), (snapshot) => {
        const o: Order[] = [];
        snapshot.forEach(d => o.push(d.data() as Order));
        setOrders(o.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    });`
);
fs.writeFileSync('src/context/StoreContext.tsx', content);
console.log("Patched!");
