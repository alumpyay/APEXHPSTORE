const fs = require('fs');
let content = fs.readFileSync('src/components/Footer.tsx', 'utf-8');

// Add click count state to Footer
content = content.replace(
  /const \[subscribed, setSubscribed\] = useState\(false\);/,
  `const [subscribed, setSubscribed] = useState(false);
  const [adminClickCount, setAdminClickCount] = useState(0);

  const handleAdminSecretClick = () => {
    setAdminClickCount(prev => {
      const newCount = prev + 1;
      if (newCount >= 3) {
        setIsAdminPortalOpen(true);
        return 0;
      }
      return newCount;
    });
  };`
);

// Make the copyright text clickable
content = content.replace(
  /© 2026 Apex Jerseys Co\. All rights reserved\. Built with precision for athletic fans worldwide\./,
  `<span onClick={handleAdminSecretClick} className="cursor-default selection:bg-transparent">© 2026 Apex Jerseys Co. All rights reserved. Built with precision for athletic fans worldwide.</span>`
);

// Hide Backend console button if not logged in
// Add isAdminLoggedIn to useStore destructuring
content = content.replace(
  /setIsAdminPortalOpen,\n\s*siteContent/,
  `setIsAdminPortalOpen,
    isAdminLoggedIn,
    siteContent`
);

content = content.replace(
  /<button onClick=\{\(\) => setIsAdminPortalOpen\(true\)\} className="hover:text-zinc-300 transition-colors flex items-center gap-1">\s*<Lock className="w-3 h-3" \/> Backend Console\s*<\/button>\s*<span>•<\/span>/,
  `{isAdminLoggedIn && (
              <>
                <button onClick={() => setIsAdminPortalOpen(true)} className="hover:text-zinc-300 transition-colors flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Backend Console
                </button>
                <span>•</span>
              </>
            )}`
);

fs.writeFileSync('src/components/Footer.tsx', content);
console.log("Patched Footer.tsx");
