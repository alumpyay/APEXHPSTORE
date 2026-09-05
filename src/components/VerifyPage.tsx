import React, { useEffect, useState } from "react";

export function VerifyPage() {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const picc_data = searchParams.get("picc_data");
    const cmac = searchParams.get("cmac");

    if (!picc_data || !cmac) {
      setResult({ success: false, error: "NFC Tag အချက်အလက် မစုံလင်ပါ" });
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
        setResult({ success: false, error: "ဆာဗာသို့ ချိတ်ဆက်၍ မရပါ" });
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-slate-600 font-medium">ပစ္စည်းစစ်မှန်ကြောင်း စစ်ဆေးနေပါသည်...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        <div className={`p-6 text-center text-white ${result?.success ? "bg-emerald-600" : "bg-rose-600"}`}>
          <div className="text-5xl mb-2">{result?.success ? "✓" : "✕"}</div>
          <h1 className="text-2xl font-bold">
            {result?.success ? "စစ်မှန်သော ကုန်ပစ္စည်း" : "အတည်မပြုနိုင်ပါ"}
          </h1>
          <p className="text-sm opacity-90 mt-1">APEXHP Authentic Product Protection</p>
        </div>

        <div className="p-6 space-y-4">
          {result?.success ? (
            <>
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-emerald-800 text-sm">
                ဂုဏ်ယူပါသည်၊ ဤကုန်ပစ္စည်းသည် စစ်မှန်ပြီး AES-128 Encryption ဖြင့် အောင်မြင်စွာ အတည်ပြုပြီးဖြစ်ပါသည်။
              </div>
              <div className="divide-y divide-slate-100 text-sm">
                <div className="py-2 flex justify-between">
                  <span className="text-slate-500">Tag UID</span>
                  <span className="font-mono font-medium text-slate-800">{result.data.uid}</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-slate-500">Scan အကြိမ်ရေ</span>
                  <span className="font-medium text-slate-800">{result.data.scanCount} ကြိမ်</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-slate-500">စစ်ဆေးသည့်အချိန်</span>
                  <span className="text-slate-800">{new Date(result.data.verifiedAt).toLocaleTimeString()}</span>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-rose-50 border border-rose-200 rounded-lg p-4 text-rose-700 text-sm">
              <p className="font-semibold mb-1">စစ်ဆေးမှု မအောင်မြင်ပါ</p>
              <p>{result?.error}</p>
            </div>
          )}

          <button 
            onClick={() => window.location.reload()}
            className="w-full mt-4 py-3 bg-slate-900 text-white rounded-xl font-medium shadow hover:bg-slate-800 transition"
          >
            ပြန်လည်စစ်ဆေးမည်
          </button>
        </div>
      </div>
    </div>
  );
}
