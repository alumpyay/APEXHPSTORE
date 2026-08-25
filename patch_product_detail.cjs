const fs = require('fs');

let content = fs.readFileSync('src/components/ProductDetailModal.tsx', 'utf-8');

// We need to add isAdminLoggedIn to useStore()
content = content.replace(
  /const \{\s*selectedProduct,\s*setSelectedProduct,\s*formatPrice,\s*addToCart,\s*toggleWishlist,\s*isInWishlist,\s*setIsCartOpen,\s*setEditingProduct\s*\} = useStore\(\);/g,
  `const { 
    selectedProduct, 
    setSelectedProduct, 
    formatPrice, 
    addToCart, 
    toggleWishlist, 
    isInWishlist, 
    setIsCartOpen,
    setEditingProduct,
    isAdminLoggedIn
  } = useStore();`
);

// Fabric Edit button
content = content.replace(
  /<button\s*type="button"\s*onClick=\{\(\) => \{\s*const prodToEdit = selectedProduct;\s*setSelectedProduct\(null\);\s*setEditingProduct\(prodToEdit\);\s*\}\}\s*className="flex items-center gap-1 text-\[10px\] font-bold text-zinc-400 hover:text-amber-400 bg-zinc-900 hover:bg-zinc-800 px-2 py-0\.5 rounded-md border border-zinc-800 transition-colors"\s*title="Fabric & Specs ပြင်ဆင်ရန်"\s*>\s*<Edit3 className="w-3 h-3 text-amber-400" \/>\s*<span>Edit \(ပြင်မည်\)<\/span>\s*<\/button>/g,
  `{isAdminLoggedIn && (
                  <button
                    type="button"
                    onClick={() => {
                      const prodToEdit = selectedProduct;
                      setSelectedProduct(null);
                      setEditingProduct(prodToEdit);
                    }}
                    className="flex items-center gap-1 text-[10px] font-bold text-zinc-400 hover:text-amber-400 bg-zinc-900 hover:bg-zinc-800 px-2 py-0.5 rounded-md border border-zinc-800 transition-colors"
                    title="Fabric & Specs ပြင်ဆင်ရန်"
                  >
                    <Edit3 className="w-3 h-3 text-amber-400" />
                    <span>Edit (ပြင်မည်)</span>
                  </button>
                  )}`
);

// Title/Price/Stock Edit button
content = content.replace(
  /<button\s*onClick=\{\(\) => \{\s*const prodToEdit = selectedProduct;\s*setSelectedProduct\(null\);\s*setEditingProduct\(prodToEdit\);\s*\}\}\s*className="shrink-0 flex items-center gap-1 bg-amber-400\/10 hover:bg-amber-400 text-amber-400 hover:text-zinc-950 px-2\.5 py-1\.5 rounded-lg border border-amber-400\/30 text-xs font-bold transition-all cursor-pointer"\s*title="Edit photos, title, price, and stock"\s*>\s*<Edit3 className="w-3\.5 h-3\.5" \/>\s*<span>Edit \(ပြင်မည်\)<\/span>\s*<\/button>/g,
  `{isAdminLoggedIn && (
                  <button
                    onClick={() => {
                      const prodToEdit = selectedProduct;
                      setSelectedProduct(null);
                      setEditingProduct(prodToEdit);
                    }}
                    className="shrink-0 flex items-center gap-1 bg-amber-400/10 hover:bg-amber-400 text-amber-400 hover:text-zinc-950 px-2.5 py-1.5 rounded-lg border border-amber-400/30 text-xs font-bold transition-all cursor-pointer"
                    title="Edit photos, title, price, and stock"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit (ပြင်မည်)</span>
                  </button>
                  )}`
);

fs.writeFileSync('src/components/ProductDetailModal.tsx', content);
console.log('Patched ProductDetailModal.tsx');
