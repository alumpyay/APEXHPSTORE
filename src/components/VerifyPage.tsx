import React, { useEffect, useState } from "react";
import { ShieldCheck, ShieldAlert, Loader2, Fingerprint, ExternalLink, RefreshCcw } from "lucide-react";

export function VerifyPage() {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const picc_data = searchParams.get("picc_data");
    const cmac = searchParams.get("cmac");

    if (!picc_data || !cmac) {
      setResult({ success: false, error: "Missing NFC Tag Data or Parameters" });
      setLoading(false);
      return;
    }

    fetch(`/api/verify?picc_data=${picc_data}&cmac=${cmac}`)
      .then((res) => res.json())
      .then((data) => {
        setResult(data);
        setLoading(false);
      })
      .catch((err) => {
        setResult({ success: false, error: "Failed to connect to verification server" });
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* Premium Background Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-20 pointer-events-none">
        <div className={`absolute inset-0 rounded-full blur-[100px] ${
          loading ? 'bg-amber-500/30' : result?.success ? 'bg-emerald-500/30' : 'bg-rose-500/30'
        } transition-colors duration-1000`}></div>
      </div>

      {loading ? (
        <div className="relative w-full max-w-md flex flex-col items-center justify-center py-20 z-10">
          <div className="relative mb-8">
            <div className="absolute inset-0 rounded-full blur-xl bg-amber-500/20 animate-pulse"></div>
            <Fingerprint className="w-24 h-24 text-amber-500 relative z-10 animate-pulse" strokeWidth={1} />
          </div>
          <h2 className="text-2xl font-oswald tracking-widest uppercase text-zinc-100 mb-3">Authenticating</h2>
          <div className="flex items-center gap-3 bg-zinc-900/80 px-6 py-3 rounded-full border border-zinc-800">
            <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
            <span className="text-zinc-400 text-sm tracking-wide">Verifying DNA Cryptographic Signature...</span>
          </div>
        </div>
      ) : (
        <div className="relative w-full max-w-md z-10 animate-in fade-in zoom-in duration-500">
          {/* Card Outer Glow */}
          <div className={`absolute -inset-0.5 rounded-2xl blur-md opacity-30 ${
            result?.success ? 'bg-emerald-500' : 'bg-rose-500'
          }`}></div>
          
          <div className="relative bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            {/* Top Branding Bar */}
            <div className="flex items-center justify-center p-4 border-b border-zinc-800/80 bg-zinc-900/50">
              <span className="font-oswald tracking-widest uppercase font-bold text-zinc-100 text-lg">
                Apex<span className="text-amber-500">HP</span>
              </span>
            </div>

            {result?.success ? (
              <div className="p-8 flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                  <ShieldCheck className="w-10 h-10 text-emerald-400" strokeWidth={1.5} />
                </div>
                <h1 className="text-3xl font-oswald uppercase tracking-wide text-zinc-100 mb-2">Authentic Product</h1>
                <p className="text-zinc-400 text-sm mb-8 leading-relaxed">
                  This item has been cryptographically verified and is a genuine APEX product.
                </p>
                
                <div className="w-full bg-zinc-900/80 rounded-xl border border-zinc-800 p-5 space-y-4 text-sm text-left">
                  <div className="flex justify-between items-center pb-4 border-b border-zinc-800/80">
                    <span className="text-zinc-500 uppercase tracking-wider text-xs font-semibold">Security Tag UID</span>
                    <span className="font-mono text-zinc-300 tracking-widest">{result.data.uid}</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-zinc-800/80">
                    <span className="text-zinc-500 uppercase tracking-wider text-xs font-semibold">Scan Count</span>
                    <span className="text-zinc-300 font-medium">#{result.data.scanCount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500 uppercase tracking-wider text-xs font-semibold">Verified At</span>
                    <span className="text-zinc-400 font-mono text-xs">
                      {new Date(result.data.verifiedAt).toLocaleString('en-US', { 
                        dateStyle: 'medium', 
                        timeStyle: 'medium' 
                      })}
                    </span>
                  </div>
                </div>
                
                <a 
                  href="/" 
                  className="mt-8 w-full py-4 bg-zinc-100 text-zinc-950 font-bold uppercase tracking-wide rounded-xl flex items-center justify-center gap-2 hover:bg-zinc-200 transition-colors shadow-lg"
                >
                  Enter Official Store <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            ) : (
              <div className="p-8 flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center mb-6 border border-rose-500/20 shadow-[0_0_30px_rgba(244,63,94,0.2)]">
                  <ShieldAlert className="w-10 h-10 text-rose-400" strokeWidth={1.5} />
                </div>
                <h1 className="text-3xl font-oswald uppercase tracking-wide text-zinc-100 mb-2">Verification Failed</h1>
                <p className="text-zinc-400 text-sm mb-8 leading-relaxed">
                  This tag could not be authenticated. It may be a counterfeit or tampered product.
                </p>
                
                <div className="w-full bg-rose-950/30 rounded-xl border border-rose-900/50 p-5 text-sm text-left mb-8 flex flex-col gap-2">
                  <span className="text-rose-500 uppercase tracking-wider text-xs font-bold flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4" /> Security Alert
                  </span>
                  <p className="text-rose-200 opacity-90 leading-relaxed font-mono text-xs">
                    {result?.error || "Invalid cryptography signature."}
                  </p>
                </div>
                
                <button 
                  onClick={() => window.location.reload()} 
                  className="w-full py-4 bg-zinc-900 border border-zinc-800 text-zinc-100 uppercase tracking-wide font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-zinc-800 transition-colors"
                >
                  <RefreshCcw className="w-4 h-4" /> Retry Scan
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
