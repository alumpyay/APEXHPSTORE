import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Check, 
  RotateCcw, 
  Type, 
  Layout, 
  MessageSquare,
  Globe
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { SiteContent } from '../types';

export const SiteContentEditModal: React.FC = () => {
  const { 
    isSiteContentModalOpen, 
    setIsSiteContentModalOpen, 
    siteContent, 
    updateSiteContent,
    resetSiteContent,
    isAdminLoggedIn
  } = useStore();

  const [formData, setFormData] = useState<SiteContent>(siteContent);
  const [savedToast, setSavedToast] = useState(false);

  useEffect(() => {
    if (isSiteContentModalOpen) {
      setFormData(siteContent);
      setSavedToast(false);
    }
  }, [isSiteContentModalOpen, siteContent]);

  if (!isSiteContentModalOpen || !isAdminLoggedIn) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteContent(formData);
    setSavedToast(true);
    setTimeout(() => {
      setSavedToast(false);
      setIsSiteContentModalOpen(false);
    }, 600);
  };

  const handleReset = () => {
    if (window.confirm('Reset all site texts to original defaults?')) {
      resetSiteContent();
      setIsSiteContentModalOpen(false);
    }
  };

  return (
    <div 
      id="site-content-modal-overlay"
      className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto"
      onClick={() => setIsSiteContentModalOpen(false)}
    >
      <div 
        id="site-content-modal-container"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl bg-zinc-950 border border-zinc-800 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden text-left my-auto max-h-[90vh] flex flex-col"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/80 bg-zinc-900/60 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <Type className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white">
                Website Text & Banner Editor (စာသားများ ပြင်ဆင်ရန်)
              </h2>
              <p className="text-xs text-zinc-400">
                Manually edit titles, top announcement bar, slogans, and footer details
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsSiteContentModalOpen(false)}
            className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSave} className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
          
          {/* Section 1: Top Announcement Bar */}
          <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-2xl space-y-3">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Top Announcement Bar (အပေါ်ဆုံးဘား စာသား)
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2 space-y-1">
                <label className="text-[11px] font-bold text-zinc-300">Banner Announcement Text</label>
                <input
                  type="text"
                  value={formData.topBannerText}
                  onChange={(e) => setFormData({ ...formData, topBannerText: e.target.value })}
                  placeholder="MLBB ESPORTS & FOOTBALL KITS • 4K SUBLIMATION JERSEY COLLECTION"
                  className="w-full bg-zinc-900 border border-zinc-700 text-white text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-zinc-300">Promo Code Badge</label>
                <input
                  type="text"
                  value={formData.topBannerCode}
                  onChange={(e) => setFormData({ ...formData, topBannerCode: e.target.value })}
                  placeholder="Code: APEXPRO"
                  className="w-full bg-zinc-900 border border-zinc-700 text-white text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Hero Header & 360 Showcase Titles */}
          <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-2xl space-y-3">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <Layout className="w-4 h-4" /> Hero Banner & Titles (ပင်မခေါင်းစဉ်များ)
            </h3>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-zinc-300">Hero Flame Badge Text</label>
                <input
                  type="text"
                  value={formData.heroFlameBadge}
                  onChange={(e) => setFormData({ ...formData, heroFlameBadge: e.target.value })}
                  placeholder="MLBB Esports & Football Pro Match Drops"
                  className="w-full bg-zinc-900 border border-zinc-700 text-white text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-zinc-300">Hero Main Title (ပင်မခေါင်းစဉ်ကြီး)</label>
                <input
                  type="text"
                  value={formData.heroTitle}
                  onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
                  placeholder="PRO ESPORTS & FOOTBALL JERSEYS"
                  className="w-full bg-zinc-900 border border-zinc-700 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-zinc-300">Showcase 360° Badge Label</label>
                <input
                  type="text"
                  value={formData.showcaseBadge}
                  onChange={(e) => setFormData({ ...formData, showcaseBadge: e.target.value })}
                  placeholder="360° PRO SHOWCASE"
                  className="w-full bg-zinc-900 border border-zinc-700 text-white text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Catalogue Section */}
          <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-2xl space-y-3">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <MessageSquare className="w-4 h-4" /> Catalogue Headings (ကုန်ပစ္စည်းကဏ္ဍ ခေါင်းစဉ်)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-zinc-300">Catalogue Heading</label>
                <input
                  type="text"
                  value={formData.catalogHeading}
                  onChange={(e) => setFormData({ ...formData, catalogHeading: e.target.value })}
                  placeholder="AUTHENTIC JERSEY CATALOGUE"
                  className="w-full bg-zinc-900 border border-zinc-700 text-white text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-zinc-300">Catalogue Subtitle</label>
                <input
                  type="text"
                  value={formData.catalogSubtitle}
                  onChange={(e) => setFormData({ ...formData, catalogSubtitle: e.target.value })}
                  placeholder="Filtered by authentic player editions, club teams, and match day kits"
                  className="w-full bg-zinc-900 border border-zinc-700 text-white text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Footer Info */}
          <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-2xl space-y-3">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <Globe className="w-4 h-4" /> Footer Details (အောက်ခြေ ဖော်ပြချက်များ)
            </h3>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-zinc-300">About Store Text</label>
                <textarea
                  rows={2}
                  value={formData.footerAbout}
                  onChange={(e) => setFormData({ ...formData, footerAbout: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-700 text-white text-xs px-3.5 py-2 rounded-xl focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-zinc-300">Copyright Text</label>
                <input
                  type="text"
                  value={formData.footerCopyright}
                  onChange={(e) => setFormData({ ...formData, footerCopyright: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-700 text-white text-xs px-3.5 py-2 rounded-xl focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>

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


          {/* Actions */}
          <div className="pt-3 border-t border-zinc-800 flex items-center justify-between gap-3 sticky bottom-0 bg-zinc-950 py-2">
            <button
              type="button"
              onClick={handleReset}
              className="text-zinc-500 hover:text-zinc-300 text-xs flex items-center gap-1.5 px-3 py-2 rounded-xl transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsSiteContentModalOpen(false)}
                className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-bold px-4 py-2.5 rounded-xl border border-zinc-800 transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="bg-amber-400 hover:bg-amber-300 text-zinc-950 font-black text-xs px-6 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-amber-400/20 cursor-pointer"
              >
                {savedToast ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Save Site Texts (သိမ်းဆည်းမည်)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
