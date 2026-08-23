const fs = require('fs');

const content = fs.readFileSync('src/context/StoreContext.tsx', 'utf-8');

const regex = /export const StoreProvider: React\.FC<\{ children: React\.ReactNode \}> = \(\{ children \}\) => \{([\s\S]*?)const \[cart, setCart\] = useState<CartItem\[\]>\(\(\) => \{/m;

const replacement = `export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Firebase loaded states
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [siteContent, setSiteContent] = useState<SiteContent>(defaultSiteContent);
  const [paymentAccounts, setPaymentAccounts] = useState<PaymentAccount[]>(INITIAL_PAYMENT_ACCOUNTS);
  const [deliveryRegions, setDeliveryRegions] = useState<MyanmarRegion[]>(MYANMAR_DELIVERY_REGIONS);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setIsAdminLoggedIn(!!user);
    });
    
    const unsubscribeProducts = onSnapshot(collection(db, 'products'), (snapshot) => {
      if (snapshot.empty && !isAdminLoggedIn) {
         setProducts(INITIAL_PRODUCTS); // fallback to initial if db empty
      } else if (!snapshot.empty) {
         const p: Product[] = [];
         snapshot.forEach(d => p.push(d.data() as Product));
         setProducts(p);
      }
    });

    return () => {
      unsubscribeAuth();
      unsubscribeProducts();
    };
  }, [isAdminLoggedIn]);

  useEffect(() => {
    let unsubOrders = () => {};
    let unsubPayment = () => {};
    let unsubDelivery = () => {};
    let unsubSite = () => {};

    if (isAdminLoggedIn) {
      unsubOrders = onSnapshot(collection(db, 'orders'), (snapshot) => {
        const o: Order[] = [];
        snapshot.forEach(d => o.push(d.data() as Order));
        // sort by newest
        setOrders(o.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      });
    }

    unsubSite = onSnapshot(doc(db, 'site_content', 'main'), (docSnap) => {
      if (docSnap.exists()) {
        setSiteContent({ ...defaultSiteContent, ...docSnap.data() as SiteContent });
      }
    });

    unsubPayment = onSnapshot(doc(db, 'payment_accounts', 'main'), (docSnap) => {
      if (docSnap.exists()) {
        setPaymentAccounts(docSnap.data().accounts as PaymentAccount[]);
      }
    });

    unsubDelivery = onSnapshot(doc(db, 'delivery_rates', 'main'), (docSnap) => {
      if (docSnap.exists()) {
        setDeliveryRegions(docSnap.data().regions as MyanmarRegion[]);
      }
    });

    return () => {
      unsubOrders();
      unsubSite();
      unsubPayment();
      unsubDelivery();
    }
  }, [isAdminLoggedIn]);

  const [cart, setCart] = useState<CartItem[]>(() => {
`;

if (regex.test(content)) {
  const newContent = content.replace(regex, replacement);
  fs.writeFileSync('src/context/StoreContext.tsx', newContent);
  console.log("Success");
} else {
  console.log("Failed to match regex");
}
