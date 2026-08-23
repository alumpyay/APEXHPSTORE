import React, { useState } from 'react';
import {
  Phone,
  Send, 
  Check, 
  Mail, 
  Lock,
  Globe,
  Edit3
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { useStore } from '../context/StoreContext';

export const Footer: React.FC = () => {
  const { 
    setIsOrderTrackerOpen, 
    setIsAdminPortalOpen,
    isAdminLoggedIn,
    siteContent,
    setIsSiteContentModalOpen
  } = useStore();

  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
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
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 3000);
      setNewsletterEmail('');
    }
  };

  return (
    <footer className="bg-zinc-950 border-t border-zinc-800 text-zinc-400 text-xs">
      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 text-left">
          
          {/* Brand Col */}
          <div className="md:col-span-4 space-y-4">
            <BrandLogo size="md" />

            <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
              {siteContent?.footerAbout || 'The premier esports apparel & authentic jersey collection. Offering MLBB Pro League match jerseys, football kits, and high-precision 4K sublimation designs.'}
            </p>

            
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

            {/* Currency indicator in footer */}
            <div className="flex items-center gap-2 pt-1">
              <Globe className="w-3.5 h-3.5 text-zinc-400" />
              <span className="text-xs text-zinc-400">Store Currency:</span>
              <span className="text-xs font-bold text-amber-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                MMK (Ks)
              </span>
              <button
                onClick={() => setIsSiteContentModalOpen(true)}
                className="ml-2 text-zinc-500 hover:text-amber-400 p-1 flex items-center gap-1 transition-colors"
                title="Edit Footer & Site Texts (စာပြင်ရန်)"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span className="text-[10px]">Edit Texts</span>
              </button>
            </div>
          </div>

          {/* Collections */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">Collections</h4>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => window.scrollTo({ top: 400, behavior: 'smooth' })} className="hover:text-amber-400 transition-colors">🎮 MLBB Pro League Kits</button></li>
              <li><button onClick={() => window.scrollTo({ top: 400, behavior: 'smooth' })} className="hover:text-amber-400 transition-colors">⚽ Football Kits</button></li>
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div className="md:col-span-5 space-y-3">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">VIP Kit Drop Notifications</h4>
            <p className="text-xs text-zinc-400">Receive instant alerts for limited edition anniversary kits and player signings.</p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email..."
                  className="flex-1 bg-zinc-900 border border-zinc-800 text-white text-xs px-3 py-2.5 rounded-xl focus:outline-none focus:border-amber-400"
                />
                <button
                  type="submit"
                  className="bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs px-4 py-2.5 rounded-xl transition-colors shrink-0"
                >
                  Join
                </button>
              </div>
              {subscribed && (
                <div className="text-emerald-400 text-[11px] flex items-center gap-1 font-semibold">
                  <Check className="w-3.5 h-3.5" /> Subscribed! 15% discount code applied to your bag.
                </div>
              )}
            </form>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 mt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500">
          <div>
            <span onClick={handleAdminSecretClick} className="cursor-default selection:bg-transparent">© 2026 Apex Jerseys Co. All rights reserved. Built with precision for athletic fans worldwide.</span>
          </div>
          <div className="flex items-center gap-4">
            {isAdminLoggedIn && (
              <>
                <button onClick={() => setIsAdminPortalOpen(true)} className="hover:text-zinc-300 transition-colors flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Backend Console
                </button>
                <span>•</span>
              </>
            )}
            <button onClick={() => setIsOrderTrackerOpen(true)} className="hover:text-zinc-300 transition-colors">
              GPS Shipment Radar
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
