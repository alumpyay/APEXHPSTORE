const fs = require('fs');

let content = fs.readFileSync('src/components/HeroBanner.tsx', 'utf-8');

const target = `<button
                  onClick={() => {
                    if (activeKit) {
                      setEditingProduct(activeKit);
                    }
                  }}
                  className="bg-zinc-900 hover:bg-zinc-800 text-amber-400 border border-amber-400/30 px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer"
                  title="Edit this jersey image and details (ပုံ/စာ ပြင်မည်)"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit Kit (ပြင်မည်)</span>
                </button>`;

const replacement = `{isAdminLoggedIn && (
                <button
                  onClick={() => {
                    if (activeKit) {
                      setEditingProduct(activeKit);
                    }
                  }}
                  className="bg-zinc-900 hover:bg-zinc-800 text-amber-400 border border-amber-400/30 px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer"
                  title="Edit this jersey image and details (ပုံ/စာ ပြင်မည်)"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit Kit (ပြင်မည်)</span>
                </button>
                )}`;

if (content.includes(target)) {
  content = content.replace(target, replacement);
  fs.writeFileSync('src/components/HeroBanner.tsx', content);
  console.log('Patched HeroBanner.tsx successfully.');
} else {
  console.log('Target string not found in HeroBanner.tsx. Let me try regex.');
  // fallback if exact match fails due to indentation
  const regex = /<button\s*onClick=\{\(\) => \{\s*if \(activeKit\) \{\s*setEditingProduct\(activeKit\);\s*\}\s*\}\}\s*className="bg-zinc-900 hover:bg-zinc-800 text-amber-400 border border-amber-400\/30 px-3\.5 py-2\.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1\.5 transition-all cursor-pointer"\s*title="Edit this jersey image and details \(ပုံ\/စာ ပြင်မည်\)"\s*>\s*<Edit3 className="w-4 h-4" \/>\s*<span>Edit Kit \(ပြင်မည်\)<\/span>\s*<\/button>/g;
  content = content.replace(regex, replacement);
  fs.writeFileSync('src/components/HeroBanner.tsx', content);
  console.log('Patched HeroBanner.tsx with regex.');
}
