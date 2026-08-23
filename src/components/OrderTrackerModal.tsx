import React, { useState, useEffect } from 'react';
import { 
  X, 
  Truck, 
  Search, 
  MapPin, 
  Package, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ShieldCheck, 
  ExternalLink,
  Printer,
  Copy,
  Check,
  Image as ImageIcon
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Order, OrderStatus } from '../types';

export const OrderTrackerModal: React.FC = () => {
  const { 
    isOrderTrackerOpen, 
    setIsOrderTrackerOpen, 
    orders, 
    trackingSearchQuery, 
    setTrackingSearchQuery, 
    findOrderByTracking,
    formatPrice
  } = useStore();

  const [inputQuery, setInputQuery] = useState(trackingSearchQuery || (orders.length > 0 ? orders[0].trackingNumber : ''));
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [copied, setCopied] = useState(false);
  const [showSlipModal, setShowSlipModal] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (trackingSearchQuery) {
      setInputQuery(trackingSearchQuery);
      findOrderByTracking(trackingSearchQuery).then(found => {
        if (found) setCurrentOrder(found);
      });
    } else if (orders.length > 0) {
      setCurrentOrder(orders[0]);
      setInputQuery(orders[0].trackingNumber);
    }
  }, [trackingSearchQuery, orders]);

  if (!isOrderTrackerOpen) return null;

  const handleSearch = async (e: React.FormEvent) => {
    if (!inputQuery.trim()) return;
    setIsSearching(true);
    const found = await findOrderByTracking(inputQuery.trim());
    setCurrentOrder(found || null);
    setIsSearching(false);
  };

  const steps: OrderStatus[] = [
    'Order Placed',
    'Customization & Printing',
    'Quality Check',
    'Dispatched',
    'In Transit',
    'Out for Delivery',
    'Delivered'
  ];

  const getStepIndex = (status: OrderStatus) => {
    if (status === 'Pending Payment Verification' || status === 'Cancelled') return -1;
    const idx = steps.indexOf(status);
    return idx === -1 ? -1 : idx;
  };

  const currentStepIdx = currentOrder ? getStepIndex(currentOrder.status) : 0;

  const copyTracking = () => {
    if (currentOrder) {
      navigator.clipboard.writeText(currentOrder.trackingNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        id="order-tracker-modal"
        className="relative w-full max-w-4xl bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl text-white max-h-[92vh] flex flex-col text-left"
      >
        {/* Header */}
        <div className="bg-zinc-900/90 px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-400 text-zinc-950 flex items-center justify-center font-bold shadow-md shadow-amber-500/20">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black tracking-tight text-white font-mono">
                  LIVE REAL-TIME ORDER & GPS TRACKER
                </h2>
                <span className="inline-flex items-center gap-1 bg-emerald-950 border border-emerald-800 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> Live Radar
                </span>
              </div>
              <p className="text-xs text-zinc-400">Track customization progress, quality checks & carrier transit</p>
            </div>
          </div>

          <button
            onClick={() => setIsOrderTrackerOpen(false)}
            className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Tracking Search Input */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <input
                id="tracker-modal-input"
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Enter Tracking Code (e.g. APX-7821-US) or Customer Email..."
                className="w-full bg-zinc-900 border border-zinc-700 text-white text-xs pl-9 pr-4 py-3 rounded-xl focus:outline-none focus:border-amber-400 font-mono"
              />
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className="bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-zinc-950 font-black text-xs px-5 py-3 rounded-xl transition-colors shrink-0"
            >
              {isSearching ? 'Searching...' : 'Track Package'}
            </button>
          </form>

          {currentOrder ? (
            <div className="space-y-6">
              
              {/* Overview Status Banner */}
              <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-400 font-medium">Tracking Number:</span>
                    <span className="font-mono font-black text-amber-400 text-sm tracking-wider">{currentOrder.trackingNumber}</span>
                    <button onClick={copyTracking} className="text-zinc-500 hover:text-white p-1">
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <Package className="w-5 h-5 text-amber-400" />
                    <span>Status: {currentOrder.status}</span>
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Estimated Delivery by <strong className="text-white">{currentOrder.estimatedDelivery}</strong> via Priority Air
                  </p>
                </div>

                <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800/80 text-xs space-y-1.5 text-zinc-300 min-w-56">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Destination:</span>
                    <span className="font-bold text-white truncate">{currentOrder.customer.city}, {currentOrder.customer.country}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Carrier:</span>
                    <span className="font-bold text-amber-400">Wepozt Express</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500">Payment:</span>
                    <span className="font-semibold text-zinc-200">{currentOrder.paymentMethod}</span>
                  </div>
                  {currentOrder.transactionId && (
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-500">TxID/Sender:</span>
                      <span className="font-mono text-amber-400 font-bold text-[11px]">{currentOrder.transactionId}</span>
                    </div>
                  )}
                  {currentOrder.paymentReceiptUrl && (
                    <div className="pt-1 border-t border-zinc-800 flex justify-end">
                      <button
                        type="button"
                        onClick={() => setShowSlipModal(true)}
                        className="text-[11px] text-amber-400 hover:text-amber-300 font-bold underline flex items-center gap-1 cursor-pointer"
                      >
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>View Payment Slip (ငွေလွှဲပြေစာ ကြည့်ရန်)</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Progress Stepper Visualizer */}
              <div className="bg-zinc-900/60 border border-zinc-800 p-5 rounded-2xl space-y-4">
                <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Fulfillment & Transit Milestones</h4>
                
                <div className="relative">
                  {/* Stepper Line for Desktop */}
                  <div className="hidden md:block absolute top-4 left-4 right-4 h-0.5 bg-zinc-800 z-0">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-500"
                      style={{ width: `${Math.max(0, (currentStepIdx / (steps.length - 1)) * 100)}%` }}
                    />
                  </div>

                  {/* Stepper Nodes */}
                  <div className="grid grid-cols-1 md:grid-cols-7 gap-3 relative z-10">
                    {steps.map((stepName, idx) => {
                      const isCompleted = idx <= currentStepIdx;
                      const isCurrent = idx === currentStepIdx;

                      return (
                        <div key={stepName} className="flex md:flex-col items-center md:text-center gap-3 md:gap-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-all ${
                            isCurrent
                              ? 'bg-amber-400 text-zinc-950 ring-4 ring-amber-400/20 shadow-lg shadow-amber-500/30'
                              : isCompleted
                              ? 'bg-emerald-500 text-white'
                              : 'bg-zinc-800 text-zinc-500'
                          }`}>
                            {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : idx + 1}
                          </div>
                          <div>
                            <div className={`text-[11px] font-bold leading-tight ${isCurrent ? 'text-amber-400' : isCompleted ? 'text-white' : 'text-zinc-500'}`}>
                              {stepName}
                            </div>
                            {isCurrent && (
                              <span className="inline-block text-[9px] bg-amber-400/20 text-amber-300 px-1.5 py-0.2 rounded mt-0.5">
                                Active Step
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Simulated Live GPS Carrier Map Radar */}
              <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 space-y-3 relative overflow-hidden">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-rose-500" /> Carrier Route Checkpoints
                  </span>
                  <span className="font-mono text-zinc-500 text-[11px]">GPS Node: Lat 30.2672° N, Long 97.7431° W</span>
                </div>

                {/* Event Logs Timeline */}
                <div className="space-y-2 pt-2 border-t border-zinc-800">
                  {currentOrder.timeline.map((evt, i) => (
                    <div key={i} className="flex items-start gap-3 text-xs bg-zinc-950/60 p-2.5 rounded-xl border border-zinc-800/80">
                      <div className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <strong className="text-white">{evt.status}</strong>
                          <span className="text-zinc-500 font-mono">{evt.timestamp}</span>
                        </div>
                        <div className="text-zinc-400 text-[11px] mt-0.5 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-amber-400/80" />
                          <span>{evt.location}</span>
                        </div>
                        <p className="text-zinc-300 text-xs mt-1">{evt.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Package Content Breakdown */}
              <div className="bg-zinc-900/40 border border-zinc-800 p-4 rounded-2xl space-y-3">
                <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                  Items in this Shipment ({currentOrder.items.length})
                </h4>

                <div className="divide-y divide-zinc-800/60">
                  {currentOrder.items.map((item, idx) => (
                    <div key={idx} className="py-2.5 first:pt-0 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-14 bg-zinc-900 rounded-lg overflow-hidden shrink-0 border border-zinc-800">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <div className="font-bold text-white">{item.name}</div>
                          <div className="text-[11px] text-zinc-400">
                            Size: <strong className="text-zinc-200">{item.size}</strong> • Qty: {item.quantity}
                          </div>
                          {item.customDetails && (
                            <div className="text-[10px] text-amber-400 font-mono">
                              Custom: {item.customDetails.name} #{item.customDetails.number}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="font-mono font-bold text-white text-right">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-8 text-center space-y-3">
              <AlertCircle className="w-8 h-8 text-amber-400 mx-auto" />
              <h3 className="text-base font-bold text-white">No Order Found for "{inputQuery}"</h3>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                Check that you entered the correct tracking code (e.g. APX-7821-US) or the customer email used during checkout.
              </p>
              <button
                onClick={() => setInputQuery('APX-7821-US')}
                className="bg-zinc-800 hover:bg-zinc-700 text-amber-400 text-xs px-3 py-1.5 rounded-lg font-bold"
              >
                Load Sample Order (APX-7821-US)
              </button>
            </div>
          )}

        </div>

        {/* Modal to view payment receipt photo */}
        {showSlipModal && currentOrder && currentOrder.paymentReceiptUrl && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
            <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 max-w-lg w-full space-y-4 text-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2">
                    <span>Payment Transfer Slip (ငွေလွှဲပြေစာ)</span>
                    <span className="text-amber-400 font-mono">({currentOrder.paymentMethod})</span>
                  </h3>
                  <p className="text-[11px] text-zinc-400">
                    Order: <strong className="text-white font-mono">{currentOrder.trackingNumber}</strong>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowSlipModal(false)}
                  className="w-8 h-8 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 flex items-center justify-center p-2 min-h-64 max-h-[60vh]">
                <img
                  src={currentOrder.paymentReceiptUrl}
                  alt="Payment Transfer Slip"
                  className="max-h-[55vh] w-auto max-w-full object-contain rounded-xl shadow-lg"
                />
              </div>

              <div className="flex items-center justify-between bg-zinc-900 p-3 rounded-xl border border-zinc-800 text-xs">
                <div>
                  <span className="text-zinc-400 block text-[10px] uppercase">Paid Amount</span>
                  <strong className="text-emerald-400 font-mono text-sm">{formatPrice(currentOrder.total)}</strong>
                </div>
                {currentOrder.transactionId && (
                  <div>
                    <span className="text-zinc-400 block text-[10px] uppercase">TxID / Phone</span>
                    <strong className="text-amber-400 font-mono">{currentOrder.transactionId}</strong>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => setShowSlipModal(false)}
                  className="bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
