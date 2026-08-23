const fs = require('fs');
let content = fs.readFileSync('src/components/Navbar.tsx', 'utf-8');

if (!content.includes('Package')) {
  content = content.replace(/ShoppingBag,/, 'ShoppingBag,\n  Package,');
}

if (!content.includes('setIsOrderTrackerOpen')) {
  content = content.replace(/setIsCartOpen,/, 'setIsCartOpen,\n    setIsOrderTrackerOpen,');
}

const trackButton = `{/* Track Order Button */}
            <button
              id="nav-track-order-btn"
              onClick={() => setIsOrderTrackerOpen(true)}
              title="Track Your Order (အော်ဒါစစ်ရန်)"
              className="flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 text-emerald-400 p-2 rounded-lg border border-zinc-800 text-xs font-semibold transition-colors group cursor-pointer"
            >
              <Package className="w-4 h-4 group-hover:animate-bounce" />
              <span className="hidden xl:inline text-[11px]">Track</span>
            </button>`;

if (!content.includes('nav-track-order-btn')) {
  content = content.replace(/\{\/\* Wishlist Pill \*\/\}/, trackButton + '\n\n            {/* Wishlist Pill */}');
}

fs.writeFileSync('src/components/Navbar.tsx', content);
console.log("Patched Navbar!");
