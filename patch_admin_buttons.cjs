const fs = require('fs');

function patchFile(file, regex, replacement) {
  let content = fs.readFileSync(file, 'utf-8');
  content = content.replace(regex, replacement);
  fs.writeFileSync(file, content);
  console.log(`Patched ${file}`);
}

// 1. Footer.tsx
patchFile('src/components/Footer.tsx',
  /<button\s+onClick=\{\(\) => setIsSiteContentModalOpen\(true\)\}\s+className="ml-2 text-zinc-500 hover:text-amber-400 p-1 flex items-center gap-1 transition-colors"\s+title="Edit Footer & Site Texts \(စာပြင်ရန်\)"\s*>\s*<Edit3 className="w-3\.5 h-3\.5" \/>\s*<span className="text-\[10px\]">Edit Texts<\/span>\s*<\/button>/g,
  `{isAdminLoggedIn && (
              <button
                onClick={() => setIsSiteContentModalOpen(true)}
                className="ml-2 text-zinc-500 hover:text-amber-400 p-1 flex items-center gap-1 transition-colors"
                title="Edit Footer & Site Texts (စာပြင်ရန်)"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span className="text-[10px]">Edit Texts</span>
              </button>
              )}`
);

// 2. HeroBanner.tsx
patchFile('src/components/HeroBanner.tsx',
  /<button\s+onClick=\{\(\) => setIsSiteContentModalOpen\(true\)\}\s+className="ml-2 p-1 hover:bg-amber-400\/20 rounded-md text-amber-300 transition-colors"\s+title="Edit texts \(စာသားပြင်ရန်\)"\s*>\s*<Edit3 className="w-3 h-3" \/>\s*<\/button>/g,
  `{isAdminLoggedIn && (
            <button
              onClick={() => setIsSiteContentModalOpen(true)}
              className="ml-2 p-1 hover:bg-amber-400/20 rounded-md text-amber-300 transition-colors"
              title="Edit texts (စာသားပြင်ရန်)"
            >
              <Edit3 className="w-3 h-3" />
            </button>
            )}`
);

// 3. CatalogSection.tsx
patchFile('src/components/CatalogSection.tsx',
  /<button\s+onClick=\{\(\) => setIsSiteContentModalOpen\(true\)\}\s+className="ml-2 p-1 hover:bg-amber-400\/20 text-amber-300 rounded text-\[10px\] font-bold flex items-center gap-1 transition-colors"\s+title="Edit Section Headings \(ခေါင်းစဉ်ပြင်ရန်\)"\s*>\s*<Edit3 className="w-3 h-3" \/>\s*<span>Edit Title<\/span>\s*<\/button>/g,
  `{isAdminLoggedIn && (
            <button
              onClick={() => setIsSiteContentModalOpen(true)}
              className="ml-2 p-1 hover:bg-amber-400/20 text-amber-300 rounded text-[10px] font-bold flex items-center gap-1 transition-colors"
              title="Edit Section Headings (ခေါင်းစဉ်ပြင်ရန်)"
            >
              <Edit3 className="w-3 h-3" />
              <span>Edit Title</span>
            </button>
            )}`
);

// 4. Also SiteContentEditModal.tsx should only render if isAdminLoggedIn, but maybe we can just import isAdminLoggedIn from StoreContext and add it to the check.
patchFile('src/components/SiteContentEditModal.tsx',
  /const \{ \s*isSiteContentModalOpen,\s*setIsSiteContentModalOpen,\s*siteContent,\s*updateSiteContent,\s*resetSiteContent\s*\} = useStore\(\);/g,
  `const { 
    isSiteContentModalOpen, 
    setIsSiteContentModalOpen, 
    siteContent, 
    updateSiteContent,
    resetSiteContent,
    isAdminLoggedIn
  } = useStore();`
);

patchFile('src/components/SiteContentEditModal.tsx',
  /if \(!isSiteContentModalOpen\) return null;/g,
  `if (!isSiteContentModalOpen || !isAdminLoggedIn) return null;`
);

