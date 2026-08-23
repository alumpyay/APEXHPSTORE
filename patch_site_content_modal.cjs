const fs = require('fs');
let content = fs.readFileSync('src/components/SiteContentEditModal.tsx', 'utf-8');

const socialSection = `
          {/* Section 5: Social Links */}
          <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-2xl space-y-3">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <Globe className="w-4 h-4" /> Social Links (ဆိုရှယ်မီဒီယာ လင့်ခ်များ)
            </h3>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-zinc-300">TikTok Link (URL)</label>
                <input
                  type="text"
                  placeholder="https://tiktok.com/@yourpage"
                  value={formData.tiktokLink || ''}
                  onChange={(e) => setFormData({ ...formData, tiktokLink: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-700 text-white text-xs px-3.5 py-2 rounded-xl focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-zinc-300">Viber Link (URL)</label>
                <input
                  type="text"
                  placeholder="https://viber.click/..."
                  value={formData.viberLink || ''}
                  onChange={(e) => setFormData({ ...formData, viberLink: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-700 text-white text-xs px-3.5 py-2 rounded-xl focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-zinc-300">Telegram Link (URL)</label>
                <input
                  type="text"
                  placeholder="https://t.me/yourchannel"
                  value={formData.telegramLink || ''}
                  onChange={(e) => setFormData({ ...formData, telegramLink: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-700 text-white text-xs px-3.5 py-2 rounded-xl focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>
`;

content = content.replace(
  /<\/div>\s*<\/div>\s*\{\/\* Actions \*\/\}/,
  `</div>\n            </div>\n          </div>\n${socialSection}\n\n          {/* Actions */}`
);

fs.writeFileSync('src/components/SiteContentEditModal.tsx', content);
console.log("Patched SiteContentEditModal.tsx");
