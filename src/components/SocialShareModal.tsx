import React, { useState } from 'react';
import { 
  X, 
  Share2, 
  Download, 
  Copy, 
  Check, 
  Sparkles, 
  ExternalLink,
  MessageCircle,
  Twitter,
  Facebook,
  Instagram
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const SocialShareModal: React.FC = () => {
  const { shareModalData, setShareModalData } = useStore();
  const [copiedLink, setCopiedLink] = useState(false);

  if (!shareModalData) return null;

  const shareUrl = window.location.href;
  const shareText = `Check out this ${shareModalData.customName || 'Fan'} #${shareModalData.customNumber || '10'} kit from Apex Jerseys Co.! 🔥⚽🎮`;

  const handleCopy = () => {
    navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleDownload = () => {
    if (!shareModalData.imageUrl) return;
    const link = document.createElement('a');
    link.href = shareModalData.imageUrl;
    link.download = `apex-custom-jersey-${shareModalData.customName || 'fan'}.png`;
    link.click();
  };

  const shareToTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const shareToWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`, '_blank');
  };

  const shareToFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        id="social-share-modal"
        className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl text-white flex flex-col text-left"
      >
        {/* Header */}
        <div className="bg-zinc-900/90 px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-400 text-zinc-950 flex items-center justify-center font-bold">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-black tracking-tight text-white font-mono uppercase">
                Fan Showcase & Share
              </h2>
              <span className="text-[10px] text-zinc-400">Export high-res kit card for social feeds</span>
            </div>
          </div>

          <button
            onClick={() => setShareModalData(null)}
            className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Card Visual Preview */}
          <div className="relative bg-gradient-to-br from-zinc-900 via-zinc-900 to-amber-950/40 p-4 rounded-2xl border border-zinc-700/80 shadow-2xl overflow-hidden text-center space-y-3">
            <div className="flex justify-between items-center text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider">
              <span>★ APEX PRO COLLECTION</span>
              <span>2024/25 SPEC</span>
            </div>

            {shareModalData.imageUrl ? (
              <div className="w-48 h-56 mx-auto rounded-xl overflow-hidden bg-zinc-950 border border-zinc-800 flex items-center justify-center shadow-inner">
                <img
                  src={shareModalData.imageUrl}
                  alt="Custom Jersey"
                  className="w-full h-full object-contain p-2"
                />
              </div>
            ) : (
              <div className="w-40 h-48 mx-auto bg-zinc-950 rounded-xl flex items-center justify-center border border-zinc-800 text-3xl font-mono font-black text-amber-400">
                #{shareModalData.customNumber}
              </div>
            )}

            <div>
              <h3 className="text-base font-black text-white font-mono tracking-wide">
                {shareModalData.customName} #{shareModalData.customNumber}
              </h3>
              <p className="text-[11px] text-zinc-400">Personalized Custom Fan Edition</p>
            </div>
          </div>

          {/* Share Action Buttons */}
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={shareToTwitter}
                className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-zinc-200 transition-colors"
              >
                <Twitter className="w-4 h-4 text-sky-400 mb-1" />
                <span>X / Twitter</span>
              </button>

              <button
                onClick={shareToWhatsApp}
                className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-zinc-200 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400 mb-1" />
                <span>WhatsApp</span>
              </button>

              <button
                onClick={shareToFacebook}
                className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-zinc-200 transition-colors"
              >
                <Facebook className="w-4 h-4 text-blue-500 mb-1" />
                <span>Facebook</span>
              </button>
            </div>

            {/* Download HD Card */}
            {shareModalData.imageUrl && (
              <button
                onClick={handleDownload}
                className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs py-3 rounded-xl border border-zinc-700 flex items-center justify-center gap-2 transition-colors"
              >
                <Download className="w-4 h-4 text-amber-400" />
                <span>Download High-Res PNG Image</span>
              </button>
            )}

            {/* Copy Link Button */}
            <button
              onClick={handleCopy}
              className="w-full bg-amber-400 hover:bg-amber-300 text-zinc-950 font-black text-xs py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedLink ? 'Link Copied to Clipboard!' : 'Copy Share Link'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
