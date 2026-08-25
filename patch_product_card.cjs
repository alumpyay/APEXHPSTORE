const fs = require('fs');

let content = fs.readFileSync('src/components/ProductCard.tsx', 'utf-8');

// We need to add isAdminLoggedIn to useStore()
content = content.replace(
  /const \{\s*formatPrice,\s*addToCart,\s*toggleWishlist,\s*isInWishlist,\s*setSelectedProduct,\s*setEditingProduct\s*\} = useStore\(\);/g,
  `const { 
    formatPrice, 
    addToCart, 
    toggleWishlist, 
    isInWishlist, 
    setSelectedProduct, 
    setEditingProduct,
    isAdminLoggedIn
  } = useStore();`
);

// We need to wrap the Edit button in {isAdminLoggedIn && ( ... )}
content = content.replace(
  /\{\/\* Quick Edit Button \*\/\}\s*<button\s*id=\{\`card-edit-btn-\$\{product.id\}\`\}\s*onClick=\{\(e\) => \{\s*e.stopPropagation\(\);\s*setEditingProduct\(product\);\s*\}\}\s*title="Edit Photo & Details \(ပုံနှင့် စာပြင်ရန်\)"\s*className="w-8 h-8 rounded-full bg-zinc-900\/90 hover:bg-amber-400 hover:text-zinc-950 backdrop-blur-md border border-zinc-700\/80 flex items-center justify-center text-amber-400 hover:scale-110 transition-all shadow-md"\s*>\s*<Edit3 className="w-3\.5 h-3\.5" \/>\s*<\/button>/g,
  `{/* Quick Edit Button */}
          {isAdminLoggedIn && (
            <button
              id={\`card-edit-btn-\${product.id}\`}
              onClick={(e) => {
                e.stopPropagation();
                setEditingProduct(product);
              }}
              title="Edit Photo & Details (ပုံနှင့် စာပြင်ရန်)"
              className="w-8 h-8 rounded-full bg-zinc-900/90 hover:bg-amber-400 hover:text-zinc-950 backdrop-blur-md border border-zinc-700/80 flex items-center justify-center text-amber-400 hover:scale-110 transition-all shadow-md"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          )}`
);

fs.writeFileSync('src/components/ProductCard.tsx', content);
console.log('Patched ProductCard.tsx');
