const fs = require('fs');
let content = fs.readFileSync('src/components/Footer.tsx', 'utf-8');

if (!content.includes('Phone,')) {
  content = content.replace(/import \{/, 'import {\n  Phone,\n  Send,');
}

const socialHTML = `
            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2">
              {siteContent?.tiktokLink && (
                <a href={siteContent.tiktokLink} target="_blank" rel="noopener noreferrer" className="bg-zinc-900 hover:bg-zinc-800 text-white p-2 rounded-lg border border-zinc-800 transition-colors" title="TikTok">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
                </a>
              )}
              {siteContent?.viberLink && (
                <a href={siteContent.viberLink} target="_blank" rel="noopener noreferrer" className="bg-[#7360f2]/10 hover:bg-[#7360f2]/20 text-[#7360f2] p-2 rounded-lg border border-[#7360f2]/30 transition-colors" title="Viber">
                  <Phone className="w-4 h-4" />
                </a>
              )}
              {siteContent?.telegramLink && (
                <a href={siteContent.telegramLink} target="_blank" rel="noopener noreferrer" className="bg-[#0088cc]/10 hover:bg-[#0088cc]/20 text-[#24A1DE] p-2 rounded-lg border border-[#0088cc]/30 transition-colors" title="Telegram">
                  <Send className="w-4 h-4" />
                </a>
              )}
            </div>
`;

content = content.replace(
  /\{\/\* Currency indicator in footer \*\/\}/,
  socialHTML + '\n            {/* Currency indicator in footer */}'
);

fs.writeFileSync('src/components/Footer.tsx', content);
console.log("Patched Footer.tsx");
