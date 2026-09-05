import React, { useEffect, useState } from "react";
import { ShieldCheck, ShieldAlert, Loader2, Fingerprint, ExternalLink, RefreshCcw, User, Lock, CheckCircle2, X } from "lucide-react";

export function VerifyPage() {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<any>(null);

  // Edit Customer Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [invoiceNo, setInvoiceNo] = useState("");
  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    address: ""
  });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const picc_data = searchParams.get("picc_data");
    const cmac = searchParams.get("cmac");

    if (!picc_data || !cmac) {
      setResult({ success: false, error: "Missing NFC Tag Data or Parameters" });
      setLoading(false);
      return;
    }

    fetchVerification(picc_data, cmac);
  }, []);

  const fetchVerification = (picc_data: string, cmac: string) => {
    fetch(`/api/verify?picc_data=${picc_data}&cmac=${cmac}`)
      .then((res) => res.json())
      .then((data) => {
        setResult(data);
        if (data.success && data.data) {
          setFormData({
            customerName: data.data.customerName || "",
            customerPhone: data.data.customerPhone || "",
            address: data.data.address || ""
          });
        }
        setLoading(false);
      })
      .catch((err) => {
        setResult({ success: false, error: "Failed to connect to verification server" });
        setLoading(false);
      });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditError("");
    setEditLoading(true);

    try {
      const res = await fetch("/api/customer/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: result.data.uid,
          invoiceNo,
          updatedData: formData
        })
      });
      const data = await res.json();
      
      if (data.success) {
        setIsModalOpen(false);
        setIsUnlocked(false);
        setInvoiceNo("");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
        
        // Refresh the displayed data
        const searchParams = new URLSearchParams(window.location.search);
        fetchVerification(searchParams.get("picc_data")!, searchParams.get("cmac")!);
      } else {
        setEditError(data.error || "Update failed.");
      }
    } catch (err: any) {
      setEditError(err.message || "Network error.");
    } finally {
      setEditLoading(false);
    }
  };

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
                  <div className="flex justify-between items-center pb-4 border-b border-zinc-800/80">
                    <span className="text-zinc-500 uppercase tracking-wider text-xs font-semibold">Verified At</span>
                    <span className="text-zinc-400 font-mono text-xs">
                      {new Date(result.data.verifiedAt).toLocaleString('en-US', { 
                        dateStyle: 'medium', 
                        timeStyle: 'medium' 
                      })}
                    </span>
                  </div>
                  
                  {/* Customer Information Display */}
                  {result.data.customerName && (
                    <div className="pt-4 border-t border-zinc-800/80 space-y-3">
                      <div className="flex items-center gap-2 text-zinc-500 uppercase tracking-wider text-xs font-semibold mb-2">
                        <User className="w-4 h-4" /> Customer Profile
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-zinc-500 text-xs font-medium">Name</span>
                        <span className="text-zinc-300 font-medium">{result.data.customerName}</span>
                      </div>
                      {result.data.customerPhone && (
                        <div className="flex justify-between items-center">
                          <span className="text-zinc-500 text-xs font-medium">Phone</span>
                          <span className="text-zinc-300 font-medium">{result.data.customerPhone}</span>
                        </div>
                      )}
                      {result.data.address && (
                        <div className="flex flex-col gap-1 mt-2">
                          <span className="text-zinc-500 text-xs font-medium">Address / Notes</span>
                          <span className="text-zinc-400 text-xs leading-relaxed">{result.data.address}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="mt-6 w-full py-3 bg-zinc-900 border border-zinc-800 text-zinc-300 font-medium text-sm rounded-xl flex items-center justify-center gap-2 hover:bg-zinc-800 hover:text-zinc-100 transition-colors"
                >
                  <User className="w-4 h-4" /> Edit Customer Information
                </button>
                
                <a 
                  href="/" 
                  className="mt-4 w-full py-4 bg-zinc-100 text-zinc-950 font-bold uppercase tracking-wide rounded-xl flex items-center justify-center gap-2 hover:bg-zinc-200 transition-colors shadow-lg"
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

      {/* Edit Customer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative">
            <button 
              onClick={() => {
                setIsModalOpen(false);
                setIsUnlocked(false);
                setInvoiceNo("");
                setEditError("");
              }}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="p-6">
              <h2 className="text-xl font-oswald uppercase tracking-wide text-zinc-100 mb-2">
                {isUnlocked ? "Update Information" : "Verify Identity"}
              </h2>
              <p className="text-zinc-400 text-sm mb-6">
                {isUnlocked 
                  ? "Update your customer profile details for this product." 
                  : "Please enter the original invoice number associated with this product to unlock editing."}
              </p>

              {editError && (
                <div className="mb-6 p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg flex items-start gap-2 text-rose-400 text-sm">
                  <ShieldAlert className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{editError}</span>
                </div>
              )}

              {!isUnlocked ? (
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (invoiceNo.trim()) {
                      setIsUnlocked(true);
                      setEditError("");
                    }
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-zinc-500 font-semibold mb-2">Invoice Number</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                      <input 
                        type="text" 
                        required
                        value={invoiceNo}
                        onChange={(e) => setInvoiceNo(e.target.value)}
                        placeholder="e.g. INV-2024-001"
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-zinc-100 focus:outline-none focus:border-amber-500 transition-colors placeholder:text-zinc-700"
                      />
                    </div>
                  </div>
                  <button 
                    type="submit"
                    className="w-full py-3 bg-amber-500 text-amber-950 font-bold uppercase tracking-wide rounded-xl flex items-center justify-center gap-2 hover:bg-amber-400 transition-colors"
                  >
                    Unlock Form
                  </button>
                </form>
              ) : (
                <form onSubmit={handleUpdate} className="space-y-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-zinc-500 font-semibold mb-2">Full Name</label>
                    <input 
                      type="text" 
                      value={formData.customerName}
                      onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                      placeholder="John Doe"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 focus:outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-zinc-500 font-semibold mb-2">Phone Number</label>
                    <input 
                      type="tel" 
                      value={formData.customerPhone}
                      onChange={(e) => setFormData({...formData, customerPhone: e.target.value})}
                      placeholder="+1 (555) 000-0000"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 focus:outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-zinc-500 font-semibold mb-2">Address / Notes</label>
                    <textarea 
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      placeholder="Delivery address or additional notes..."
                      rows={3}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 focus:outline-none focus:border-amber-500 transition-colors resize-none"
                    />
                  </div>
                  <button 
                    type="submit"
                    disabled={editLoading}
                    className="w-full py-3 bg-emerald-500 text-emerald-950 font-bold uppercase tracking-wide rounded-xl flex items-center justify-center gap-2 hover:bg-emerald-400 transition-colors disabled:opacity-50"
                  >
                    {editLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Success Toast */}
      {showToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-6 py-3 rounded-full flex items-center gap-3 shadow-lg shadow-emerald-500/10 backdrop-blur-md">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-medium text-sm">Profile updated successfully</span>
          </div>
        </div>
      )}
    </div>
  );
}
