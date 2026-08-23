const fs = require('fs');
let content = fs.readFileSync('src/components/Navbar.tsx', 'utf-8');

// Add isAdminLoggedIn to useStore
content = content.replace(
  /setIsAdminPortalOpen,\n\s*theme,/,
  `setIsAdminPortalOpen,
    isAdminLoggedIn,
    theme,`
);

// Top Banner Edit button
content = content.replace(
  /\{siteContent\?\.topBannerCode && \(\s*<span className="hidden md:inline-block bg-zinc-950 text-amber-400 px-2 py-0\.5 rounded text-\[10px\] uppercase ml-2 font-black">\s*\{siteContent\.topBannerCode\}\s*<\/span>\s*\)\}\s*<button\s*onClick=\{\(\) => setIsSiteContentModalOpen\(true\)\}\s*className="ml-2 p-0\.5 hover:bg-zinc-950\/20 rounded text-zinc-950 font-bold text-\[10px\] flex items-center gap-1 cursor-pointer"\s*title="Edit Site Text & Banner \(စာပြင်ရန်\)"\s*>\s*<Edit3 className="w-3 h-3" \/>\s*<span className="hidden sm:inline">Edit Text<\/span>\s*<\/button>/,
  `{siteContent?.topBannerCode && (
          <span className="hidden md:inline-block bg-zinc-950 text-amber-400 px-2 py-0.5 rounded text-[10px] uppercase ml-2 font-black">
            {siteContent.topBannerCode}
          </span>
        )}
        {isAdminLoggedIn && (
          <button
            onClick={() => setIsSiteContentModalOpen(true)}
            className="ml-2 p-0.5 hover:bg-zinc-950/20 rounded text-zinc-950 font-bold text-[10px] flex items-center gap-1 cursor-pointer"
            title="Edit Site Text & Banner (စာပြင်ရန်)"
          >
            <Edit3 className="w-3 h-3" />
            <span className="hidden sm:inline">Edit Text</span>
          </button>
        )}`
);

// Main Navbar Edit & Admin buttons
content = content.replace(
  /\{\/\* Edit Site Text & Content Button \*\/\}\s*<button\s*id="nav-edit-site-btn"[\s\S]*?Edit Site \(ပြင်ရန်\)<\/span>\s*<\/button>\s*\{\/\* Admin Portal Gateway \*\/\}\s*<button\s*id="nav-admin-portal-btn"[\s\S]*?Admin<\/span>\s*<\/button>/,
  `{/* Edit Site Text & Content Button (Admin Only) */}
            {isAdminLoggedIn && (
              <button
                id="nav-edit-site-btn"
                onClick={() => setIsSiteContentModalOpen(true)}
                title="Edit Website Texts & Images (ဆိုဒ်စာသားများ ပြင်ရန်)"
                className="flex items-center gap-1.5 bg-amber-400/10 hover:bg-amber-400 text-amber-400 hover:text-zinc-950 px-2.5 py-2 rounded-lg border border-amber-400/30 text-xs font-bold transition-all cursor-pointer"
              >
                <Edit3 className="w-4 h-4" />
                <span className="hidden sm:inline text-[11px]">Edit Site (ပြင်ရန်)</span>
              </button>
            )}

            {/* Admin Portal Gateway (Admin Only) */}
            {isAdminLoggedIn && (
              <button
                id="nav-admin-portal-btn"
                onClick={() => setIsAdminPortalOpen(true)}
                title="Backend Store Management"
                className="flex items-center gap-1 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-400 hover:text-amber-400 p-2 rounded-lg border border-zinc-800/80 text-xs transition-colors"
              >
                <ShieldCheck className="w-4 h-4" />
                <span className="hidden md:inline font-bold">Admin</span>
              </button>
            )}`
);

fs.writeFileSync('src/components/Navbar.tsx', content);
console.log("Patched Navbar.tsx");
