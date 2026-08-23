const fs = require('fs');
let content = fs.readFileSync('src/context/StoreContext.tsx', 'utf-8');

content = content.replace(
  /findOrderByTracking: \(trackingNumber: string\) => Order \| undefined;/,
  `findOrderByTracking: (trackingNumber: string) => Promise<Order | undefined>;`
);

content = content.replace(
  /unsubOrders = onSnapshot\(collection\(db, 'orders'\), \(snapshot\) => \{\s*const o: Order\[\] = \[\];\s*snapshot\.forEach\(d => o\.push\(d\.data\(\) as Order\)\);\s*setOrders\(o\.sort\(\(a,b\) => new Date\(b\.createdAt\)\.getTime\(\) - new Date\(a\.createdAt\)\.getTime\(\)\)\);\s*\}\);/,
  `if (isAdminLoggedIn) {
      unsubOrders = onSnapshot(collection(db, 'orders'), (snapshot) => {
        const o: Order[] = [];
        snapshot.forEach(d => o.push(d.data() as Order));
        setOrders(o.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      });
    }`
);

const searchFuncRegex = /const findOrderByTracking = \(trackingNumber: string\): Order \| undefined => \{\s*const cleanQuery = trackingNumber\.trim\(\)\.toUpperCase\(\);\s*return orders\.find\(\s*\(\o\) =>\s*o\.trackingNumber\.toUpperCase\(\) === cleanQuery \|\|\s*o\.id\.toUpperCase\(\) === cleanQuery \|\|\s*o\.customer\.email\.toLowerCase\(\) === cleanQuery\.toLowerCase\(\)\s*\);\s*\};/;

const newSearchFunc = `const findOrderByTracking = async (trackingNumber: string): Promise<Order | undefined> => {
    const cleanQuery = trackingNumber.trim().toUpperCase();
    const cleanEmail = trackingNumber.trim().toLowerCase();
    
    const localFound = orders.find(
      (o) =>
        o.trackingNumber.toUpperCase() === cleanQuery ||
        o.id.toUpperCase() === cleanQuery ||
        o.customer.email.toLowerCase() === cleanEmail
    );

    if (localFound) return localFound;

    try {
      const trackingQuery = query(collection(db, 'orders'), where('trackingNumber', '==', cleanQuery));
      const trackingSnap = await getDocs(trackingQuery);
      if (!trackingSnap.empty) {
        return trackingSnap.docs[0].data() as Order;
      }

      const docRef = doc(db, 'orders', cleanQuery);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data() as Order;
      }
      
      const emailQuery = query(collection(db, 'orders'), where('customer.email', '==', cleanEmail));
      const emailSnap = await getDocs(emailQuery);
      if (!emailSnap.empty) {
        return emailSnap.docs[0].data() as Order;
      }
    } catch (err) {
      console.error("Error finding order in DB:", err);
    }
    return undefined;
  };`;

content = content.replace(searchFuncRegex, newSearchFunc);

fs.writeFileSync('src/context/StoreContext.tsx', content);
console.log("Patched StoreContext!");
