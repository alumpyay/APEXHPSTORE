const fs = require('fs');
let content = fs.readFileSync('src/context/StoreContext.tsx', 'utf-8');

// Update createOrder
content = content.replace(
  /const randomCode = Math\.floor\(1000 \+ Math\.random\(\) \* 9000\);\s*const trackingNum = \`APX-\$\{randomCode\}-US\`;\s*const orderId = \`ORD-\$\{Date\.now\(\)\.toString\(\)\.slice\(-6\)\}\`;/g,
  `const randomCode = Math.floor(100000 + Math.random() * 900000);
    const trackingNum = \`APX-\${Date.now().toString().slice(-4)}\${randomCode}\`;
    const orderId = trackingNum;`
);

// Update findOrderByTracking
const oldFind = `const findOrderByTracking = async (trackingNumber: string): Promise<Order | undefined> => {
    const cleanQuery = trackingNumber.trim().toUpperCase();
    const cleanEmail = trackingNumber.trim().toLowerCase();

    // 1. Try local state first (instant if already loaded via admin)
    const localFound = orders.find(
      o => 
        o.trackingNumber.toUpperCase() === cleanQuery ||
        o.customer.email.toLowerCase() === cleanEmail ||
        o.id === cleanQuery
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

const newFind = `const findOrderByTracking = async (trackingNumber: string): Promise<Order | undefined> => {
    const cleanQuery = trackingNumber.trim().toUpperCase();
    const cleanEmail = trackingNumber.trim().toLowerCase();

    // 1. Try local state first (instant if already loaded via admin)
    const localFound = orders.find(
      o => 
        o.trackingNumber.toUpperCase() === cleanQuery ||
        o.customer.email.toLowerCase() === cleanEmail ||
        o.id === cleanQuery
    );

    if (localFound) return localFound;

    try {
      // For security, non-admins cannot list orders or query by email.
      // They must use the exact Tracking ID (which is the document ID).
      const docRef = doc(db, 'orders', cleanQuery);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data() as Order;
      }
    } catch (err) {
      console.error("Error finding order in DB:", err);
    }
    return undefined;
  };`;

if (content.includes('const trackingNum = `APX-${randomCode}-US`;')) {
  console.log("Replacing createOrder logic...");
}

content = content.replace(oldFind, newFind);

fs.writeFileSync('src/context/StoreContext.tsx', content);
console.log('StoreContext patched successfully.');
