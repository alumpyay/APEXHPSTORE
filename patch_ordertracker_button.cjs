const fs = require('fs');
let content = fs.readFileSync('src/components/OrderTrackerModal.tsx', 'utf-8');

content = content.replace(
  /className="bg-amber-400 hover:bg-amber-300 text-zinc-950 font-black text-xs px-5 py-3 rounded-xl transition-colors shrink-0"\s*>\s*Track Package\s*<\/button>/,
  `disabled={isSearching}
              className="bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-zinc-950 font-black text-xs px-5 py-3 rounded-xl transition-colors shrink-0"
            >
              {isSearching ? 'Searching...' : 'Track Package'}
            </button>`
);

fs.writeFileSync('src/components/OrderTrackerModal.tsx', content);
console.log("Patched track button!");
