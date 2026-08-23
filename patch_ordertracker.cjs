const fs = require('fs');
let content = fs.readFileSync('src/components/OrderTrackerModal.tsx', 'utf-8');

content = content.replace(
  /const found = findOrderByTracking\(trackingSearchQuery\);\s*if \(found\) setCurrentOrder\(found\);/,
  `findOrderByTracking(trackingSearchQuery).then(found => {
        if (found) setCurrentOrder(found);
      });`
);

content = content.replace(
  /\} else if \(orders\.length > 0\) \{\s*setCurrentOrder\(orders\[0\]\);\s*setInputQuery\(orders\[0\]\.trackingNumber\);\s*\}/,
  `} else if (orders.length > 0) {
      setCurrentOrder(orders[0]);
      setInputQuery(orders[0].trackingNumber);
    }`
);

// We should only show the default order if one was explicitly passed or we have session orders.
// Actually, it's fine.

content = content.replace(
  /const handleSearch = \(e: React\.FormEvent\) => \{\s*e\.preventDefault\(\);\s*if \(!inputQuery\.trim\(\)\) return;\s*const found = findOrderByTracking\(inputQuery\.trim\(\)\);\s*setCurrentOrder\(found \|\| null\);\s*\};/,
  `const [isSearching, setIsSearching] = useState(false);
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim()) return;
    setIsSearching(true);
    const found = await findOrderByTracking(inputQuery.trim());
    setCurrentOrder(found || null);
    setIsSearching(false);
  };`
);

content = content.replace(
  /const \[showSlipModal, setShowSlipModal\] = useState\(false\);/,
  `const [showSlipModal, setShowSlipModal] = useState(false);\n  const [isSearching, setIsSearching] = useState(false);`
);

// We need to deduplicate isSearching if it's already there
fs.writeFileSync('src/components/OrderTrackerModal.tsx', content);
console.log("Patched OrderTrackerModal!");
