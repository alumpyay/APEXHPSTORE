import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Upload, 
  Image as ImageIcon, 
  DollarSign, 
  Tag, 
  Layers, 
  ShieldCheck, 
  Trash2, 
  Check, 
  Sparkles, 
  AlertCircle,
  Eye,
  RefreshCw,
  Palette,
  Plus,
  Images,
  Clock,
  Box
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product, JerseySize, SportCategory, JerseyStyle, SizeInventory } from '../types';

export const ProductEditModal: React.FC = () => {
  const { 
    editingProduct, 
    setEditingProduct, 
    updateProduct, 
    addProduct, 
    deleteProduct,
    formatPrice,
    convertPrice
  } = useStore();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const backFileInputRef = useRef<HTMLInputElement>(null);
  const galleryFileInputRef = useRef<HTMLInputElement>(null);

  const isCreatingNew = editingProduct && editingProduct.id === 'new';

  const defaultInventory: SizeInventory = { S: 10, M: 25, L: 20, XL: 10, '2XL': 5, '3XL': 2 };

  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    team: '',
    league: 'MPL Myanmar / M-Series',
    sport: 'MLBB' as SportCategory,
    style: 'Home' as JerseyStyle,
    season: '2024/25',
    baseCost: 20.0,
    price: 49.99,
    originalPrice: 59.99,
    imageFront: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
    imageBack: '',
    galleryImages: [],
    primaryColor: '#F59E0B',
    secondaryColor: '#18181B',
    accentColor: '#FCD34D',
    inventory: { ...defaultInventory },
    stockStatus: 'in-stock',
    preOrderLeadTime: '5-7 Days',
    featured: true,
    isNewDrop: true,
    description: 'Authentic 2024/25 tournament match kit engineered with high-breathability mesh fabric.',
    fabricDetails: ['100% Breathable Micro-Polyester', 'Sublimation Anti-Fade Printing', 'Ergonomic Athletic Fit'],
    tags: ['MLBB', 'Esports', 'Match Kit']
  });

  // Direct MMK Price state for intuitive Myanmar Kyat editing
  const [sellingPriceMMK, setSellingPriceMMK] = useState<number | string>(210000);
  const [originalPriceMMK, setOriginalPriceMMK] = useState<number | string>(250000);
  const [baseCostMMK, setBaseCostMMK] = useState<number | string>(85000);

  // Gallery URL input state
  const [galleryUrlInput, setGalleryUrlInput] = useState('');

  // Fabric & Specs custom editing state
  const [newSpecInput, setNewSpecInput] = useState('');
  const [isBulkEditingSpecs, setIsBulkEditingSpecs] = useState(false);
  const [bulkSpecsText, setBulkSpecsText] = useState('');

  const [activeTab, setActiveTab] = useState<'details' | 'photos' | 'inventory' | 'colors'>('details');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  useEffect(() => {
    if (editingProduct) {
      if (editingProduct.id === 'new') {
        const initialForm: Partial<Product> = {
          name: 'New Custom Jersey 2024/25',
          team: 'Apex Squad',
          league: 'MPL Myanmar / M-Series',
          sport: 'MLBB',
          style: 'Home',
          season: '2024/25',
          baseCost: 20.0,
          price: 49.99,
          originalPrice: 59.99,
          imageFront: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
          imageBack: '',
          galleryImages: [],
          primaryColor: '#F59E0B',
          secondaryColor: '#18181B',
          accentColor: '#FCD34D',
          inventory: { ...defaultInventory },
          stockStatus: 'in-stock',
          preOrderLeadTime: '5-7 Days',
          featured: true,
          isNewDrop: true,
          dropBadgeText: '24/25 DROP',
          discountBadgeText: 'SAVE 19%',
          editionBadgeText: 'World Champion Edition',
          customBadgeText: '',
          showDropBadge: true,
          showDiscountBadge: true,
          showEditionBadge: true,
          description: 'Authentic tournament pro match jersey.',
          fabricDetails: ['100% Breathable Micro-Polyester', 'Sublimation Printing'],
          tags: ['Jersey', '2024/25']
        };
        setFormData(initialForm);
        setSellingPriceMMK(210000);
        setOriginalPriceMMK(250000);
        setBaseCostMMK(85000);
      } else {
        const prodInv = editingProduct.inventory || defaultInventory;
        const normalizedInv: SizeInventory = {
          S: prodInv.S ?? 0,
          M: prodInv.M ?? 0,
          L: prodInv.L ?? 0,
          XL: prodInv.XL ?? 0,
          '2XL': prodInv['2XL'] ?? 0,
          '3XL': prodInv['3XL'] ?? 0,
        };

        const defaultEdition = editingProduct.editionBadgeText ?? (
          editingProduct.style === 'Other' 
            ? 'World Champion Edition' 
            : `${editingProduct.style || 'Home'} Edition`
        );
        const defaultDrop = editingProduct.dropBadgeText ?? (
          editingProduct.isNewDrop ? '24/25 DROP' : (editingProduct.season ? `${editingProduct.season} DROP` : '24/25 DROP')
        );
        const autoPct = editingProduct.originalPrice && editingProduct.originalPrice > editingProduct.price 
          ? Math.round(((editingProduct.originalPrice - editingProduct.price) / editingProduct.originalPrice) * 100)
          : 0;
        const defaultDiscount = editingProduct.discountBadgeText ?? (autoPct > 0 ? `SAVE ${autoPct}%` : '');

        setFormData({
          ...editingProduct,
          galleryImages: editingProduct.galleryImages || [],
          inventory: normalizedInv,
          stockStatus: editingProduct.stockStatus || 'in-stock',
          preOrderLeadTime: editingProduct.preOrderLeadTime || '5-7 Days',
          dropBadgeText: defaultDrop,
          discountBadgeText: defaultDiscount,
          editionBadgeText: defaultEdition,
          customBadgeText: editingProduct.customBadgeText || '',
          showDropBadge: editingProduct.showDropBadge !== false,
          showDiscountBadge: editingProduct.showDiscountBadge !== false,
          showEditionBadge: editingProduct.showEditionBadge !== false,
        });

        // Initialize MMK price values
        const calculatedSellMMK = Math.round((editingProduct.price || 0) * 4200);
        const calculatedOrigMMK = editingProduct.originalPrice ? Math.round(editingProduct.originalPrice * 4200) : '';
        const calculatedCostMMK = editingProduct.baseCost ? Math.round(editingProduct.baseCost * 4200) : 85000;

        setSellingPriceMMK(calculatedSellMMK || 45000);
        setOriginalPriceMMK(calculatedOrigMMK);
        setBaseCostMMK(calculatedCostMMK);
      }
      setSaveSuccess(false);
      setDeleteConfirm(false);
    }
  }, [editingProduct]);

  if (!editingProduct) return null;

  // Helper to extract clean integer digits from any MMK string or input
  const parseMMKInput = (val: string | number | undefined): number => {
    if (val === undefined || val === null || val === '') return 0;
    const cleanStr = String(val).replace(/[^0-9]/g, '');
    return cleanStr ? parseInt(cleanStr, 10) : 0;
  };

  // Handle Selling Price MMK Change (allows free manual typing/backspacing)
  const handleSellingPriceMMKChange = (val: string) => {
    setSellingPriceMMK(val);
    const numVal = parseMMKInput(val);
    setFormData(prev => ({ ...prev, price: numVal > 0 ? numVal / 4200 : 0 }));
  };

  // Handle Original Price MMK Change
  const handleOriginalPriceMMKChange = (val: string) => {
    setOriginalPriceMMK(val);
    const numVal = parseMMKInput(val);
    setFormData(prev => ({ ...prev, originalPrice: numVal > 0 ? numVal / 4200 : undefined }));
  };

  // Handle Base Cost MMK Change
  const handleBaseCostMMKChange = (val: string) => {
    setBaseCostMMK(val);
    const numVal = parseMMKInput(val);
    setFormData(prev => ({ ...prev, baseCost: numVal > 0 ? numVal / 4200 : 0 }));
  };

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height = Math.round((height * MAX_WIDTH) / width);
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = Math.round((width * MAX_HEIGHT) / height);
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', 0.7)); // Compress to 70% quality JPEG
          } else {
            resolve(loadEvent.target?.result as string); // Fallback
          }
        };
        img.src = loadEvent.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  // Handle Front Image Upload (Converts to Base64 data URL)
  const handleFrontImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const base64Url = await compressImage(file);
    setFormData(prev => ({ ...prev, imageFront: base64Url }));
  };

  // Handle Back Image Upload
  const handleBackImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const base64Url = await compressImage(file);
    setFormData(prev => ({ ...prev, imageBack: base64Url }));
  };

  // Handle Additional Gallery Multiple Photos Upload
  const handleGalleryMultipleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const base64Urls = await Promise.all(Array.from(files).map((file) => compressImage(file as File)));
    
    setFormData(prev => ({
      ...prev,
      galleryImages: [...(prev.galleryImages || []), ...base64Urls]
    }));

    // Reset file input so user can upload same filename again if desired
    if (galleryFileInputRef.current) {
      galleryFileInputRef.current.value = '';
    }
  };

  // Add Gallery Image from URL
  const handleAddGalleryUrl = () => {
    if (!galleryUrlInput.trim()) return;
    setFormData(prev => ({
      ...prev,
      galleryImages: [...(prev.galleryImages || []), galleryUrlInput.trim()]
    }));
    setGalleryUrlInput('');
  };

  // Remove single gallery image
  const handleRemoveGalleryImage = (indexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      galleryImages: (prev.galleryImages || []).filter((_, idx) => idx !== indexToRemove)
    }));
  };

  // Fabric & Specs handlers
  const handleAddSpec = (specText?: string) => {
    const textToAdd = (specText !== undefined ? specText : newSpecInput).trim();
    if (!textToAdd) return;
    const currentSpecs = Array.isArray(formData.fabricDetails) ? [...formData.fabricDetails] : [];
    if (!currentSpecs.includes(textToAdd)) {
      setFormData(prev => ({
        ...prev,
        fabricDetails: [...currentSpecs, textToAdd]
      }));
    }
    if (specText === undefined) {
      setNewSpecInput('');
    }
  };

  const handleRemoveSpec = (indexToRemove: number) => {
    const currentSpecs = Array.isArray(formData.fabricDetails) ? [...formData.fabricDetails] : [];
    const updated = currentSpecs.filter((_, idx) => idx !== indexToRemove);
    setFormData(prev => ({
      ...prev,
      fabricDetails: updated
    }));
  };

  const handleUpdateSpec = (index: number, newText: string) => {
    const currentSpecs = Array.isArray(formData.fabricDetails) ? [...formData.fabricDetails] : [];
    currentSpecs[index] = newText;
    setFormData(prev => ({
      ...prev,
      fabricDetails: currentSpecs
    }));
  };

  const handleApplyBulkSpecs = () => {
    const lines = bulkSpecsText
      .split('\n')
      .map(l => l.replace(/^[-*•\d.)\s]+/, '').trim())
      .filter(l => l.length > 0);
    setFormData(prev => ({
      ...prev,
      fabricDetails: lines.length > 0 ? lines : ['100% Breathable Micro-Polyester', 'Sublimation Printing']
    }));
    setIsBulkEditingSpecs(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.team) return;

    const finalSellMMK = parseMMKInput(sellingPriceMMK) || 35000;
    const finalOrigMMK = parseMMKInput(originalPriceMMK);
    const finalCostMMK = parseMMKInput(baseCostMMK) || 18000;

    const finalSellingPrice = finalSellMMK / 4200;
    const finalOrigPrice = finalOrigMMK > 0 ? finalOrigMMK / 4200 : undefined;
    const finalBaseCost = finalCostMMK / 4200;

    const finalInventory: SizeInventory = {
      S: Number(formData.inventory?.S) || 0,
      M: Number(formData.inventory?.M) || 0,
      L: Number(formData.inventory?.L) || 0,
      XL: Number(formData.inventory?.XL) || 0,
      '2XL': Number(formData.inventory?.['2XL']) || 0,
      '3XL': Number(formData.inventory?.['3XL']) || 0,
    };

    if (isCreatingNew) {
      addProduct({
        name: formData.name || 'Custom Jersey',
        team: formData.team || 'Pro Team',
        league: formData.league || 'Tournament Series',
        sport: (formData.sport as SportCategory) || 'MLBB',
        style: (formData.style as JerseyStyle) || 'Home',
        season: formData.season || '2024/25',
        baseCost: finalBaseCost,
        price: finalSellingPrice,
        originalPrice: finalOrigPrice,
        imageFront: formData.imageFront || 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
        imageBack: formData.imageBack,
        galleryImages: formData.galleryImages || [],
        primaryColor: formData.primaryColor || '#F59E0B',
        secondaryColor: formData.secondaryColor || '#18181B',
        accentColor: formData.accentColor || '#FCD34D',
        inventory: finalInventory,
        stockStatus: formData.stockStatus || 'in-stock',
        preOrderLeadTime: formData.preOrderLeadTime || '5-7 Days',
        featured: !!formData.featured,
        isNewDrop: !!formData.isNewDrop,
        dropBadgeText: formData.dropBadgeText,
        discountBadgeText: formData.discountBadgeText,
        editionBadgeText: formData.editionBadgeText,
        customBadgeText: formData.customBadgeText,
        showDropBadge: formData.showDropBadge,
        showDiscountBadge: formData.showDiscountBadge,
        showEditionBadge: formData.showEditionBadge,
        description: formData.description || '',
        fabricDetails: Array.isArray(formData.fabricDetails) ? formData.fabricDetails : ['100% Breathable Polyester'],
        tags: Array.isArray(formData.tags) ? formData.tags : ['Jersey']
      });
    } else if (editingProduct.id) {
      updateProduct(editingProduct.id, {
        name: formData.name,
        team: formData.team,
        league: formData.league,
        sport: formData.sport as SportCategory,
        style: formData.style as JerseyStyle,
        season: formData.season,
        baseCost: finalBaseCost,
        price: finalSellingPrice,
        originalPrice: finalOrigPrice,
        imageFront: formData.imageFront,
        imageBack: formData.imageBack,
        galleryImages: formData.galleryImages || [],
        primaryColor: formData.primaryColor,
        secondaryColor: formData.secondaryColor,
        accentColor: formData.accentColor,
        inventory: finalInventory,
        stockStatus: formData.stockStatus || 'in-stock',
        preOrderLeadTime: formData.preOrderLeadTime || '5-7 Days',
        featured: formData.featured,
        isNewDrop: formData.isNewDrop,
        dropBadgeText: formData.dropBadgeText,
        discountBadgeText: formData.discountBadgeText,
        editionBadgeText: formData.editionBadgeText,
        customBadgeText: formData.customBadgeText,
        showDropBadge: formData.showDropBadge,
        showDiscountBadge: formData.showDiscountBadge,
        showEditionBadge: formData.showEditionBadge,
        description: formData.description,
        fabricDetails: formData.fabricDetails,
        tags: formData.tags
      });
    }

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setEditingProduct(null);
    }, 600);
  };

  const handleDelete = () => {
    if (!editingProduct.id || isCreatingNew) {
      setEditingProduct(null);
      return;
    }
    deleteProduct(editingProduct.id);
    setEditingProduct(null);
  };

  const numSellMMK = parseMMKInput(sellingPriceMMK);
  const numOrigMMK = parseMMKInput(originalPriceMMK);
  const numCostMMK = parseMMKInput(baseCostMMK);
  const profitMMK = numSellMMK - numCostMMK;
  const discountPercent = numOrigMMK > numSellMMK && numOrigMMK > 0 
    ? Math.round(((numOrigMMK - numSellMMK) / numOrigMMK) * 100)
    : 0;

  const totalInventoryUnits = (['S', 'M', 'L', 'XL', '2XL', '3XL'] as JerseySize[])
    .reduce((acc, sz) => acc + (formData.inventory?.[sz] || 0), 0);

  // Render helper for Fabric & Specs customization
  const renderFabricSpecsSection = () => {
    const specsList = Array.isArray(formData.fabricDetails) && formData.fabricDetails.length > 0
      ? formData.fabricDetails
      : ['100% Breathable Micro-Polyester', 'Sublimation Printing'];

    const quickPresets = [
      '100% Breathable Micro-Polyester',
      'Sublimation Anti-Fade Printing',
      'Ergonomic Athletic Fit',
      'Quick-Dry Moisture-Wicking',
      'Ultra-Lightweight Mesh Panels',
      'Silicone Heat-Pressed Club Crest',
      'High Elasticity Ribbed Collar',
      'Machine Washable Anti-Shrink',
      'Official Player Match Quality'
    ];

    return (
      <div className="bg-zinc-900/90 p-4 rounded-2xl border border-zinc-800 space-y-4 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800/80 pb-3">
          <div>
            <h4 className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Fabric & Specs (အထည်သားနှင့် နည်းပညာ အချက်အလက်များ ကိုယ်တိုင်ရေးရန်)</span>
            </h4>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Customer Modal ပေါ်ရှိ ဓာတ်ပုံအောက်တွင် ဖော်ပြမည့် အချက်အလက်များကို စိတ်ကြိုက် ရိုက်ထည့်နိုင်ပါသည်
            </p>
          </div>

          <div className="flex items-center gap-1.5 self-start sm:self-center">
            <button
              type="button"
              onClick={() => {
                if (!isBulkEditingSpecs) {
                  setBulkSpecsText(specsList.join('\n'));
                }
                setIsBulkEditingSpecs(!isBulkEditingSpecs);
              }}
              className="text-[10px] font-bold px-2.5 py-1 rounded-lg border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>{isBulkEditingSpecs ? 'Bullet Mode (တစ်ကြောင်းချင်းစီ)' : 'Bulk Edit (အားလုံးတစ်ပြိုင်နက်)'}</span>
            </button>
          </div>
        </div>

        {isBulkEditingSpecs ? (
          <div className="space-y-2.5 bg-zinc-950 p-3.5 rounded-xl border border-zinc-800">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-zinc-300">
                စာကြောင်းတစ်ကြောင်းချင်းစီ ရိုက်ထည့်ပါ (One spec per line):
              </label>
              <span className="text-[10px] text-zinc-500 font-mono">Lines: {bulkSpecsText.split('\n').filter(Boolean).length}</span>
            </div>
            <textarea
              rows={5}
              value={bulkSpecsText}
              onChange={(e) => setBulkSpecsText(e.target.value)}
              placeholder="100% Breathable Micro-Polyester&#10;Sublimation Printing&#10;Ergonomic Athletic Fit"
              className="w-full bg-zinc-900 border border-zinc-700 text-amber-200 font-mono text-xs p-3 rounded-lg focus:outline-none focus:border-amber-400"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsBulkEditingSpecs(false)}
                className="px-3 py-1.5 bg-zinc-800 text-zinc-300 text-xs rounded-lg hover:bg-zinc-700 font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApplyBulkSpecs}
                className="px-4 py-1.5 bg-amber-400 hover:bg-amber-300 text-zinc-950 text-xs font-bold rounded-lg shadow cursor-pointer"
              >
                Apply Specs (အသုံးပြုမည်)
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {/* List of active specs */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-zinc-400">
                <span>လက်ရှိထည့်သွင်းထားသော စာရင်းများ ({specsList.length}):</span>
                <span className="text-[10px] text-amber-400 font-mono">Real-time Editable</span>
              </div>

              {specsList.map((spec, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-zinc-950 p-1.5 px-2.5 rounded-xl border border-zinc-800/90 group hover:border-zinc-700 transition-colors">
                  <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0"></span>
                  <span className="text-[10px] text-zinc-500 font-mono w-4 shrink-0">#{idx + 1}</span>
                  <input
                    type="text"
                    value={spec}
                    onChange={(e) => handleUpdateSpec(idx, e.target.value)}
                    placeholder="Fabric / Spec Detail"
                    className="flex-1 bg-transparent text-white text-xs font-medium focus:outline-none focus:bg-zinc-900 px-2 py-1 rounded"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveSpec(idx)}
                    className="p-1 text-zinc-500 hover:text-red-400 hover:bg-red-950/40 rounded-md transition-colors cursor-pointer"
                    title="Remove this line (ဖျက်မည်)"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add new spec line */}
            <div className="bg-zinc-950/80 p-2.5 rounded-xl border border-zinc-800 flex items-center gap-2">
              <input
                type="text"
                value={newSpecInput}
                onChange={(e) => setNewSpecInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSpec();
                  }
                }}
                placeholder="စာကြောင်းအသစ် ရိုက်ထည့်ရန် (ဥပမာ 100% Breathable Micro-Polyester)..."
                className="flex-1 bg-zinc-900 border border-zinc-700 text-white text-xs px-3 py-1.5 rounded-lg focus:outline-none focus:border-amber-400 font-medium"
              />
              <button
                type="button"
                onClick={() => handleAddSpec()}
                className="bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 shrink-0 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add (ထည့်မည်)</span>
              </button>
            </div>
          </div>
        )}

        {/* Quick Presets */}
        <div className="pt-2 border-t border-zinc-800/80 space-y-1.5">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
            Quick Presets (တစ်ချက်နှိပ် ရွေးချယ်နိုင်သော စာသားများ):
          </span>
          <div className="flex flex-wrap gap-1.5">
            {quickPresets.map((preset) => {
              const isAlreadyAdded = specsList.includes(preset);
              return (
                <button
                  key={preset}
                  type="button"
                  onClick={() => {
                    if (isAlreadyAdded) {
                      const idx = specsList.indexOf(preset);
                      handleRemoveSpec(idx);
                    } else {
                      handleAddSpec(preset);
                    }
                  }}
                  className={`text-[10px] px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1 cursor-pointer ${
                    isAlreadyAdded
                      ? 'bg-amber-400/20 text-amber-300 border-amber-500/60 font-semibold'
                      : 'bg-zinc-950 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border-zinc-800'
                  }`}
                >
                  <span>{isAlreadyAdded ? '✓' : '+'}</span>
                  <span>{preset}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Preview Box (Customer View Simulation) */}
        <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
            <span className="flex items-center gap-1 text-amber-400">
              <Sparkles className="w-3 h-3" /> Live Customer Modal Preview (ဓာတ်ပုံအောက်တွင် ပေါ်မည့်ပုံစံ)
            </span>
            <span className="text-zinc-500 font-mono">Under Photo Placement</span>
          </div>
          <div className="bg-zinc-900/60 p-3 rounded-lg border border-zinc-800/80">
            <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" /> Fabric & Specs
            </div>
            <ul className="text-xs text-zinc-300 space-y-1 pl-4 list-disc marker:text-amber-400">
              {specsList.map((detail, idx) => (
                <li key={idx} className="leading-relaxed">{detail}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div 
      id="product-edit-modal-overlay"
      className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto"
      onClick={() => setEditingProduct(null)}
    >
      <div 
        id="product-edit-modal-container"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl bg-zinc-950 border border-zinc-800 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden text-left my-auto max-h-[92vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/80 bg-zinc-900/60 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white">
                {isCreatingNew ? '✨ Add New Jersey (ဂျာစီအသစ်ထည့်ရန်)' : '✏️ Manual Product & Photo Editor (ပုံနှင့်စာ ပြင်ဆင်ရန်)'}
              </h2>
              <p className="text-xs text-zinc-400">
                Directly change MMK price, front/back/gallery photos, 3XL stock, and details
              </p>
            </div>
          </div>

          <button
            onClick={() => setEditingProduct(null)}
            className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-zinc-800/80 bg-zinc-900/60 p-2.5 sm:px-6 gap-2 overflow-x-auto no-scrollbar shrink-0 items-center">
          <button
            type="button"
            onClick={() => setActiveTab('details')}
            className={`py-2.5 px-4 text-xs font-bold rounded-xl transition-all whitespace-nowrap flex items-center gap-2 shrink-0 ${
              activeTab === 'details'
                ? 'bg-amber-400 text-zinc-950 shadow-md ring-1 ring-amber-300'
                : 'bg-zinc-950/70 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800'
            }`}
          >
            <span>💰 MMK Pricing & Info (ကျပ်ဈေးနှုန်းနှင့် အမည်)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('photos')}
            className={`py-2.5 px-4 text-xs font-bold rounded-xl transition-all whitespace-nowrap flex items-center gap-2 shrink-0 ${
              activeTab === 'photos'
                ? 'bg-amber-400 text-zinc-950 shadow-md ring-1 ring-amber-300'
                : 'bg-zinc-950/70 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800'
            }`}
          >
            <Images className="w-4 h-4" />
            <span>Photos & Uploads (ဓာတ်ပုံများနှင့် အပိုပုံများ)</span>
            {(formData.galleryImages?.length || 0) > 0 && (
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-black ${
                activeTab === 'photos' ? 'bg-black/20 text-zinc-950' : 'bg-amber-400/20 text-amber-300'
              }`}>
                +{formData.galleryImages?.length}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('inventory')}
            className={`py-2.5 px-4 text-xs font-bold rounded-xl transition-all whitespace-nowrap flex items-center gap-2 shrink-0 ${
              activeTab === 'inventory'
                ? 'bg-amber-400 text-zinc-950 shadow-md ring-1 ring-amber-300'
                : 'bg-zinc-950/70 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800'
            }`}
          >
            <span>📦 Size & Stock (3XL အပါအဝင် ဆိုဒ်လက်ကျန်)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('colors')}
            className={`py-2.5 px-4 text-xs font-bold rounded-xl transition-all whitespace-nowrap flex items-center gap-2 shrink-0 ${
              activeTab === 'colors'
                ? 'bg-amber-400 text-zinc-950 shadow-md ring-1 ring-amber-300'
                : 'bg-zinc-950/70 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Fabric Specs & Colors (အထည်သားနှင့် အရောင်)</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
          
          {/* TAB 1: BASIC INFO & MANUAL MMK PRICING */}
          {activeTab === 'details' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Product Name */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-zinc-300">
                    Jersey Name / Title (ဂျာစီအမည်) <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Burmese Ghouls 2024/25 Heritage Pro Match Kit"
                    className="w-full bg-zinc-900 border border-zinc-800 text-white text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* Team / Club */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-300">
                    Team / Clan / Club (အသင်းအမည်) <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.team || ''}
                    onChange={(e) => setFormData({ ...formData, team: e.target.value })}
                    placeholder="e.g. Burmese Ghouls / Real Madrid"
                    className="w-full bg-zinc-900 border border-zinc-800 text-white text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* League / Subtitle */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-300">
                    League / Subtitle Tag (လိဂ် / ပြိုင်ပွဲအမည်)
                  </label>
                  <input
                    type="text"
                    value={formData.league || ''}
                    onChange={(e) => setFormData({ ...formData, league: e.target.value })}
                    placeholder="e.g. MPL Myanmar / M-Series / La Liga"
                    className="w-full bg-zinc-900 border border-zinc-800 text-white text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* Sport Category */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-300">Sport Category</label>
                  <select
                    value={formData.sport || 'MLBB'}
                    onChange={(e) => setFormData({ ...formData, sport: e.target.value as SportCategory })}
                    className="w-full bg-zinc-900 border border-zinc-800 text-white text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-amber-400"
                  >
                    <option value="MLBB">🎮 Mobile Legends: Bang Bang (MLBB)</option>
                    <option value="Football">⚽ Football (Soccer)</option>
                  </select>
                </div>

                {/* Jersey Style */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-300">Jersey Style</label>
                  <select
                    value={formData.style || 'Home'}
                    onChange={(e) => setFormData({ ...formData, style: e.target.value as JerseyStyle })}
                    className="w-full bg-zinc-900 border border-zinc-800 text-white text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-amber-400"
                  >
                    <option value="Home">Home (အိမ်ကွင်း)</option>
                    <option value="Away">Away (အဝေးကွင်း)</option>
                    <option value="Other">Other (တတိယဂျာစီ / အထူး)</option>
                  </select>
                </div>
              </div>

              {/* Price & Discounts in MMK */}
              <div className="p-4 bg-zinc-900/80 rounded-2xl border border-zinc-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4" /> Pricing & Discounts (မြန်မာကျပ်ငွေဖြင့် စိတ်ကြိုက်ရိုက်ထည့်ရန်)
                  </h3>
                  <span className="text-[11px] text-zinc-400 font-mono">
                    Direct Manual MMK (Ks) Input
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Selling Price in MMK */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-amber-300 flex items-center justify-between">
                      <span>Selling Price (ရောင်းစျေး - ကျပ်) <span className="text-amber-400">*</span></span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        inputMode="numeric"
                        required
                        value={sellingPriceMMK}
                        onChange={(e) => handleSellingPriceMMKChange(e.target.value)}
                        placeholder="ဥပမာ 35000"
                        className="w-full bg-zinc-950 border-2 border-amber-500/70 text-amber-300 text-sm font-mono font-black pl-3.5 pr-16 py-2.5 rounded-xl focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 shadow-inner"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-amber-400 font-bold pointer-events-none select-none bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/30">
                        MMK
                      </span>
                    </div>
                    <div className="text-[11px] text-zinc-300 font-mono flex items-center justify-between pt-0.5">
                      <span className="text-amber-400/90 font-semibold">= Ks {numSellMMK.toLocaleString()} (ကျပ်)</span>
                      <span className="text-zinc-500 text-[10px]">≈ ${(numSellMMK / 4200).toFixed(2)} USD</span>
                    </div>
                  </div>

                  {/* Original Price in MMK (For Sale Discount) */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-300">
                      Original Price (မူရင်းစျေး - ကျပ်)
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        inputMode="numeric"
                        value={originalPriceMMK}
                        onChange={(e) => handleOriginalPriceMMKChange(e.target.value)}
                        placeholder="ဥပမာ 55000"
                        className="w-full bg-zinc-900 border border-zinc-700 text-white text-sm font-mono pl-3.5 pr-16 py-2.5 rounded-xl focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-zinc-400 font-bold pointer-events-none select-none bg-zinc-800 px-2 py-0.5 rounded border border-zinc-700">
                        MMK
                      </span>
                    </div>
                    {discountPercent > 0 ? (
                      <p className="text-[11px] text-rose-400 font-bold font-mono pt-0.5">
                        🏷️ Discount Badge: SAVE {discountPercent}% OFF
                      </p>
                    ) : (
                      <p className="text-[11px] text-zinc-500 font-mono pt-0.5">
                        {numOrigMMK > 0 ? `Ks ${numOrigMMK.toLocaleString()}` : 'Optional (လျှော့ဈေးပြရန်)'}
                      </p>
                    )}
                  </div>

                  {/* Base Cost in MMK */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-300">
                      Production Cost (ကုန်ကျစရိတ် - ကျပ်)
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        inputMode="numeric"
                        value={baseCostMMK}
                        onChange={(e) => handleBaseCostMMKChange(e.target.value)}
                        placeholder="ဥပမာ 18000"
                        className="w-full bg-zinc-900 border border-zinc-700 text-white text-sm font-mono pl-3.5 pr-16 py-2.5 rounded-xl focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-zinc-400 font-bold pointer-events-none select-none bg-zinc-800 px-2 py-0.5 rounded border border-zinc-700">
                        MMK
                      </span>
                    </div>
                    <p className={`text-[11px] font-bold font-mono pt-0.5 ${profitMMK >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      Profit Margin: +Ks {profitMMK.toLocaleString()} MMK
                    </p>
                  </div>
                </div>

                {/* Quick MMK Price Shortcuts */}
                <div className="pt-2 border-t border-zinc-800/80 flex flex-wrap items-center gap-1.5 text-xs">
                  <span className="text-[11px] text-zinc-400 font-medium mr-1">Quick Presets (အမြန်ရွေးရန်):</span>
                  {[25000, 35000, 45000, 60000, 85000, 120000, 210000].map((presetPrice) => (
                    <button
                      key={presetPrice}
                      type="button"
                      onClick={() => handleSellingPriceMMKChange(String(presetPrice))}
                      className="bg-zinc-800 hover:bg-amber-400 hover:text-zinc-950 text-zinc-300 px-2.5 py-1 rounded-lg text-[11px] font-mono transition-colors border border-zinc-700 hover:border-amber-400"
                    >
                      {presetPrice.toLocaleString()} Ks
                    </button>
                  ))}
                </div>
              </div>

              {/* POP-UP BANNERS & BADGES CUSTOMIZATION SECTION (ဘန်နာ/တံဆိပ် စာသားများ ကိုယ်တိုင် စိတ်ကြိုက်ရေးရန်) */}
              <div className="p-4 bg-zinc-900/90 rounded-2xl border border-zinc-800 space-y-4 shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" /> Pop-up Banners & Badges (ဘန်နာ/တံဆိပ် စာသားများ ကိုယ်တိုင်ရေးရန်)
                  </h3>
                  <span className="text-[11px] text-zinc-400 font-mono">
                    Custom Card Badges
                  </span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Product Card ပေါ်တွင် ပေါ်နေသော Pop-up Banner စာသားများ (ဥပမာ <span className="text-amber-400 font-bold">24/25 DROP</span>၊ <span className="text-rose-400 font-bold">SAVE 19%</span> သို့ <span className="text-rose-400 font-bold">SAVE 20%</span>၊ <span className="text-zinc-200 font-bold">World Champion Edition</span>) တို့ကို စိတ်ကြိုက် လွတ်လပ်စွာ ရိုက်ထည့်ပြင်ဆင်နိုင်ပါသည်။
                </p>

                {/* Live Badge Preview Mini-Card */}
                <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                      Live Banner Preview (ကတ်ပေါ်တွင် ပေါ်မည့်ပုံစံ):
                    </span>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {formData.showDropBadge !== false && (formData.dropBadgeText || formData.isNewDrop) && (
                        <span className="bg-amber-400 text-zinc-950 font-black text-[10px] uppercase px-2 py-0.5 rounded shadow-md tracking-wider">
                          {formData.dropBadgeText || '24/25 DROP'}
                        </span>
                      )}
                      {formData.showDiscountBadge !== false && (formData.discountBadgeText || discountPercent > 0) && (
                        <span className="bg-rose-500 text-white font-bold text-[10px] uppercase px-2 py-0.5 rounded shadow-md">
                          {formData.discountBadgeText || `SAVE ${discountPercent}%`}
                        </span>
                      )}
                      {formData.showEditionBadge !== false && (formData.editionBadgeText || formData.style) && (
                        <span className="bg-zinc-900 text-zinc-300 font-mono text-[10px] px-2 py-0.5 rounded border border-zinc-700">
                          {formData.editionBadgeText || `${formData.style || 'Home'} Edition`}
                        </span>
                      )}
                      {formData.customBadgeText && (
                        <span className="bg-purple-600 text-white font-bold text-[10px] uppercase px-2 py-0.5 rounded shadow-md">
                          {formData.customBadgeText}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2.5 py-1 rounded font-mono self-start sm:self-center">
                    ✓ Real-time Sync
                  </span>
                </div>

                {/* 3 Main Badges Controls */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                  {/* 1. Yellow Drop Banner */}
                  <div className="p-3.5 bg-zinc-950 rounded-xl border border-zinc-800/90 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-bold text-amber-400 flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block shadow-sm"></span>
                        <span>1. Drop Banner (အဝါ)</span>
                      </label>
                      <label className="flex items-center gap-1 text-[10px] text-zinc-400 cursor-pointer hover:text-zinc-200">
                        <input
                          type="checkbox"
                          checked={formData.showDropBadge !== false}
                          onChange={(e) => setFormData({ ...formData, showDropBadge: e.target.checked })}
                          className="w-3.5 h-3.5 accent-amber-400 rounded cursor-pointer"
                        />
                        <span>ပြမည်</span>
                      </label>
                    </div>
                    <input
                      type="text"
                      value={formData.dropBadgeText ?? ''}
                      onChange={(e) => setFormData({ ...formData, dropBadgeText: e.target.value })}
                      placeholder="ဥပမာ 24/25 DROP သို့ 24/25"
                      className="w-full bg-zinc-900 border border-zinc-700 text-amber-300 font-mono font-bold text-xs px-2.5 py-2 rounded-lg focus:outline-none focus:border-amber-400"
                    />
                    {/* Quick presets */}
                    <div className="flex flex-wrap gap-1 pt-0.5">
                      {['24/25 DROP', '24/25', 'NEW DROP', 'M6 DROP', 'PRO DROP', 'CHAMPION'].map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setFormData({ ...formData, dropBadgeText: t, showDropBadge: true })}
                          className="text-[9px] bg-zinc-900 hover:bg-amber-400 hover:text-zinc-950 text-zinc-400 px-1.5 py-0.5 rounded border border-zinc-800 transition-colors"
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 2. Pink/Red Discount Banner */}
                  <div className="p-3.5 bg-zinc-950 rounded-xl border border-zinc-800/90 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-bold text-rose-400 flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block shadow-sm"></span>
                        <span>2. Sale Banner (အနီ/ပန်း)</span>
                      </label>
                      <label className="flex items-center gap-1 text-[10px] text-zinc-400 cursor-pointer hover:text-zinc-200">
                        <input
                          type="checkbox"
                          checked={formData.showDiscountBadge !== false}
                          onChange={(e) => setFormData({ ...formData, showDiscountBadge: e.target.checked })}
                          className="w-3.5 h-3.5 accent-rose-500 rounded cursor-pointer"
                        />
                        <span>ပြမည်</span>
                      </label>
                    </div>
                    <input
                      type="text"
                      value={formData.discountBadgeText ?? ''}
                      onChange={(e) => setFormData({ ...formData, discountBadgeText: e.target.value })}
                      placeholder="ဥပမာ SAVE 19% သို့ SAVE 20%"
                      className="w-full bg-zinc-900 border border-zinc-700 text-rose-300 font-mono font-bold text-xs px-2.5 py-2 rounded-lg focus:outline-none focus:border-rose-400"
                    />
                    {/* Quick presets */}
                    <div className="flex flex-wrap gap-1 pt-0.5">
                      {['SAVE 19%', 'SAVE 20%', 'SAVE 15%', 'SAVE 25%', 'HOT SALE', 'SPECIAL 50%'].map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setFormData({ ...formData, discountBadgeText: t, showDiscountBadge: true })}
                          className="text-[9px] bg-zinc-900 hover:bg-rose-500 hover:text-white text-zinc-400 px-1.5 py-0.5 rounded border border-zinc-800 transition-colors"
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 3. Dark Edition Banner */}
                  <div className="p-3.5 bg-zinc-950 rounded-xl border border-zinc-800/90 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-bold text-zinc-300 flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-zinc-600 inline-block shadow-sm"></span>
                        <span>3. Edition Banner (အမည်း/မီးခိုး)</span>
                      </label>
                      <label className="flex items-center gap-1 text-[10px] text-zinc-400 cursor-pointer hover:text-zinc-200">
                        <input
                          type="checkbox"
                          checked={formData.showEditionBadge !== false}
                          onChange={(e) => setFormData({ ...formData, showEditionBadge: e.target.checked })}
                          className="w-3.5 h-3.5 accent-amber-400 rounded cursor-pointer"
                        />
                        <span>ပြမည်</span>
                      </label>
                    </div>
                    <input
                      type="text"
                      value={formData.editionBadgeText ?? ''}
                      onChange={(e) => setFormData({ ...formData, editionBadgeText: e.target.value })}
                      placeholder="ဥပမာ World Champion Edition"
                      className="w-full bg-zinc-900 border border-zinc-700 text-zinc-200 font-mono text-xs px-2.5 py-2 rounded-lg focus:outline-none focus:border-amber-400"
                    />
                    {/* Quick presets */}
                    <div className="flex flex-wrap gap-1 pt-0.5">
                      {['World Champion Edition', 'Heritage Edition', 'Home Edition', 'Away Edition', 'Special Edition', 'Fan Edition'].map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setFormData({ ...formData, editionBadgeText: t, showEditionBadge: true })}
                          className="text-[9px] bg-zinc-900 hover:bg-zinc-700 hover:text-white text-zinc-400 px-1.5 py-0.5 rounded border border-zinc-800 transition-colors"
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Extra 4th Custom Banner & Showcase Toggle */}
                <div className="pt-2 border-t border-zinc-800/80 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                  <div className="sm:col-span-8 flex flex-col sm:flex-row sm:items-center gap-2">
                    <span className="text-[11px] font-bold text-purple-400 whitespace-nowrap flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-purple-500 inline-block"></span>
                      <span>+ Extra Banner (အပိုဆောင်း တံဆိပ်):</span>
                    </span>
                    <input
                      type="text"
                      value={formData.customBadgeText ?? ''}
                      onChange={(e) => setFormData({ ...formData, customBadgeText: e.target.value })}
                      placeholder="ဥပမာ BEST SELLER သို့ LIMITED EDITION"
                      className="flex-1 bg-zinc-950 border border-zinc-800 text-purple-300 font-mono text-xs px-2.5 py-1.5 rounded-lg focus:outline-none focus:border-purple-400"
                    />
                    <div className="flex gap-1">
                      {['BEST SELLER', 'LIMITED', 'AUTHENTIC'].map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setFormData({ ...formData, customBadgeText: t })}
                          className="text-[9px] bg-purple-950/60 hover:bg-purple-900 text-purple-300 px-2 py-1 rounded border border-purple-800"
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="sm:col-span-4">
                    <label className="flex items-center gap-2 p-2 bg-zinc-950 border border-zinc-800 rounded-xl cursor-pointer hover:border-zinc-700">
                      <input
                        type="checkbox"
                        checked={!!formData.featured}
                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                        className="w-4 h-4 accent-amber-400 rounded cursor-pointer"
                      />
                      <span className="text-[11px] font-bold text-zinc-300">Show in 360° Hero Showcase</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* In Stock vs Pre-Order Availability Option */}
              <div className="bg-gradient-to-br from-zinc-900/90 to-zinc-950 p-4 rounded-2xl border border-zinc-800 space-y-3.5 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-amber-400/10 rounded-lg border border-amber-400/20 text-amber-400">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-white uppercase tracking-wider">
                        Stock Availability & Order Status (ပစ္စည်းအသင့်ရှိ / ကြိုတင်မှာယူမှု)
                      </h4>
                      <p className="text-[10px] text-zinc-400">
                        In Stock (ပစ္စည်းအသင့်ရှိ) သို့မဟုတ် Pre-Order (ကြိုတင်မှာယူရန်) ရွေးချယ်နိုင်ပါသည်
                      </p>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                    formData.stockStatus === 'pre-order'
                      ? 'bg-cyan-950 text-cyan-400 border-cyan-700'
                      : 'bg-emerald-950 text-emerald-400 border-emerald-700'
                  }`}>
                    {formData.stockStatus === 'pre-order' ? '🕒 PRE-ORDER MODE' : '🟢 IN STOCK MODE'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Option 1: In Stock */}
                  <div 
                    onClick={() => setFormData({ ...formData, stockStatus: 'in-stock' })}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                      formData.stockStatus !== 'pre-order'
                        ? 'bg-emerald-950/30 border-emerald-500/80 ring-2 ring-emerald-500/20 shadow-md'
                        : 'bg-zinc-950/60 border-zinc-800 hover:border-zinc-700 opacity-60'
                    }`}
                  >
                    <input 
                      type="radio" 
                      name="stockStatusOptionTab1"
                      checked={formData.stockStatus !== 'pre-order'}
                      onChange={() => setFormData({ ...formData, stockStatus: 'in-stock' })}
                      className="mt-0.5 w-4 h-4 accent-emerald-500 cursor-pointer"
                    />
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 font-bold text-xs text-white">
                        <span>🟢 In Stock (ပစ္စည်းအသင့်ရှိ)</span>
                      </div>
                      <p className="text-[10px] text-zinc-400 leading-normal">
                        ဂိုဒေါင်တွင် ပစ္စည်းအသင့်ရှိပြီး ချက်ချင်းပို့ဆောင်ပေးနိုင်သည့် ပစ္စည်းများအတွက်။
                      </p>
                    </div>
                  </div>

                  {/* Option 2: Pre-Order */}
                  <div 
                    onClick={() => setFormData({ ...formData, stockStatus: 'pre-order' })}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                      formData.stockStatus === 'pre-order'
                        ? 'bg-cyan-950/40 border-cyan-400 ring-2 ring-cyan-400/30 shadow-md'
                        : 'bg-zinc-950/60 border-zinc-800 hover:border-zinc-700 opacity-60'
                    }`}
                  >
                    <input 
                      type="radio" 
                      name="stockStatusOptionTab1"
                      checked={formData.stockStatus === 'pre-order'}
                      onChange={() => setFormData({ ...formData, stockStatus: 'pre-order' })}
                      className="mt-0.5 w-4 h-4 accent-cyan-400 cursor-pointer"
                    />
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 font-bold text-xs text-cyan-300">
                        <span>🕒 Pre-Order (ကြိုတင်မှာယူရန်)</span>
                      </div>
                      <p className="text-[10px] text-zinc-400 leading-normal">
                        မှာယူပြီးမှ ထုတ်လုပ်ပေးမည့် ပစ္စည်းများ (ဆိုဒ်အားလုံး မှာယူနိုင်သည်)။
                      </p>
                    </div>
                  </div>
                </div>

                {/* If Pre-Order is selected: Show Lead Time Input */}
                {formData.stockStatus === 'pre-order' && (
                  <div className="bg-cyan-950/30 p-3 rounded-xl border border-cyan-800/60 space-y-2 animate-in fade-in duration-200">
                    <label className="text-[11px] font-bold text-cyan-300 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Pre-Order Lead Time / Delivery Days (မှာယူပြီး ရရှိမည့်ရက်):</span>
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        value={formData.preOrderLeadTime ?? '5-7 Days'}
                        onChange={(e) => setFormData({ ...formData, preOrderLeadTime: e.target.value })}
                        placeholder="ဥပမာ 5-7 Days သို့မဟုတ် 1-2 ပတ်"
                        className="flex-1 bg-zinc-950 border border-cyan-700/80 text-cyan-200 font-mono text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-cyan-400"
                      />
                      <div className="flex flex-wrap gap-1">
                        {['5-7 Days', '7-10 Days', '10-14 Days', '2-3 Weeks', 'Made to Order'].map((preset) => (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => setFormData({ ...formData, preOrderLeadTime: preset })}
                            className={`text-[10px] px-2 py-1 rounded border transition-colors ${
                              formData.preOrderLeadTime === preset
                                ? 'bg-cyan-500 text-zinc-950 font-bold border-cyan-400'
                                : 'bg-zinc-900 hover:bg-zinc-800 text-cyan-300 border-cyan-800/80'
                            }`}
                          >
                            {preset}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* FABRIC & SPECS CUSTOMIZATION (အထည်သားနှင့် နည်းပညာ အချက်အလက်များ ကိုယ်တိုင်ရေးရန်) */}
              {renderFabricSpecsSection()}
            </div>
          )}

          {/* TAB 2: PHOTOS & UPLOADS (FRONT, BACK + ADDITIONAL GALLERY PHOTOS) */}
          {activeTab === 'photos' && (
            <div className="space-y-6">
              
              {/* Front Photo Uploader */}
              <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4" /> 1. Front Photo (ဂျာစီအရှေ့ပုံ) <span className="text-amber-400">*</span>
                  </label>
                  <span className="text-[11px] text-zinc-400">Main Product Photo</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  <div className="md:col-span-4 aspect-4/3 bg-zinc-950 rounded-xl border border-zinc-800 overflow-hidden flex items-center justify-center relative group">
                    {formData.imageFront ? (
                      <img 
                        src={formData.imageFront} 
                        alt="Front Preview" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-zinc-600 text-xs flex flex-col items-center gap-1">
                        <ImageIcon className="w-6 h-6" />
                        <span>No Photo</span>
                      </div>
                    )}
                  </div>

                  <div className="md:col-span-8 space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleFrontImageUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex-1 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-black text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-lg shadow-amber-400/10"
                      >
                        <Upload className="w-4 h-4" />
                        <span>Upload Front Photo (အရှေ့ပုံ ဖိုင်တင်ရန်)</span>
                      </button>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-zinc-400 block">Or Paste Direct Image URL:</label>
                      <input
                        type="url"
                        value={formData.imageFront || ''}
                        onChange={(e) => setFormData({ ...formData, imageFront: e.target.value })}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full bg-zinc-900 border border-zinc-800 text-white text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-amber-400 font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Back Photo */}
              <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-zinc-400" /> 2. Back Photo (ဂျာစီအနောက်ပုံ - Optional)
                  </label>
                  <span className="text-[11px] text-zinc-500">Back view photo</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  <div className="md:col-span-4 aspect-4/3 bg-zinc-950 rounded-xl border border-zinc-800 overflow-hidden flex items-center justify-center relative">
                    {formData.imageBack ? (
                      <>
                        <img 
                          src={formData.imageBack} 
                          alt="Back Preview" 
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, imageBack: '' })}
                          className="absolute top-2 right-2 bg-red-600/80 hover:bg-red-600 text-white p-1 rounded-lg text-xs"
                          title="Remove back photo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    ) : (
                      <div className="text-zinc-600 text-xs flex flex-col items-center gap-1">
                        <ImageIcon className="w-6 h-6" />
                        <span>No Back Photo</span>
                      </div>
                    )}
                  </div>

                  <div className="md:col-span-8 space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="file"
                        ref={backFileInputRef}
                        accept="image/*"
                        onChange={handleBackImageUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => backFileInputRef.current?.click()}
                        className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer border border-zinc-700"
                      >
                        <Upload className="w-4 h-4" />
                        <span>Upload Back Photo (အနောက်ပုံ တင်ရန်)</span>
                      </button>
                    </div>

                    <input
                      type="url"
                      value={formData.imageBack || ''}
                      onChange={(e) => setFormData({ ...formData, imageBack: e.target.value })}
                      placeholder="https://... (Optional Back Image URL)"
                      className="w-full bg-zinc-900 border border-zinc-800 text-white text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-amber-400 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* 3. ADDITIONAL PHOTOS / GALLERY (နောက်ထပ်ပုံများ) */}
              <div className="p-4 bg-zinc-900/80 border-2 border-dashed border-zinc-700 rounded-2xl space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <label className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Images className="w-4 h-4" /> 3. Additional Photos & Angles (နောက်ထပ်ပုံများ / အသေးစိတ်ပုံများ)
                    </label>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      Upload multiple close-ups, fabric texture, sleeve badges, or player model shots
                    </p>
                  </div>

                  {(formData.galleryImages?.length || 0) > 0 && (
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, galleryImages: [] }))}
                      className="text-red-400 hover:text-red-300 text-[11px] font-bold flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-950/40 border border-red-900/40"
                    >
                      <Trash2 className="w-3 h-3" /> Clear All Gallery Photos
                    </button>
                  )}
                </div>

                {/* Gallery Upload Controls */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Multiple file picker */}
                  <div>
                    <input
                      type="file"
                      ref={galleryFileInputRef}
                      accept="image/*"
                      multiple
                      onChange={handleGalleryMultipleUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => galleryFileInputRef.current?.click()}
                      className="w-full bg-zinc-800 hover:bg-zinc-700 text-amber-300 border border-amber-400/40 font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                    >
                      <Upload className="w-4 h-4 text-amber-400" />
                      <span>Upload Multiple Photos (ပုံများစွာ တပြိုင်နက်တင်ရန်)</span>
                    </button>
                  </div>

                  {/* Add URL input */}
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={galleryUrlInput}
                      onChange={(e) => setGalleryUrlInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddGalleryUrl();
                        }
                      }}
                      placeholder="Paste Image URL to add..."
                      className="flex-1 bg-zinc-900 border border-zinc-700 text-white text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-amber-400 font-mono"
                    />
                    <button
                      type="button"
                      onClick={handleAddGalleryUrl}
                      className="bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs px-3.5 py-2 rounded-xl transition-colors shrink-0"
                    >
                      + Add
                    </button>
                  </div>
                </div>

                {/* Uploaded Gallery Photos Preview Grid */}
                {(formData.galleryImages && formData.galleryImages.length > 0) ? (
                  <div className="space-y-2 pt-2 border-t border-zinc-800">
                    <div className="flex items-center justify-between text-xs text-zinc-400">
                      <span>Uploaded Gallery Photos ({formData.galleryImages.length} items):</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {formData.galleryImages.map((imgUrl, index) => (
                        <div 
                          key={index}
                          className="relative aspect-4/3 rounded-xl overflow-hidden bg-zinc-950 border border-zinc-800 group shadow-md"
                        >
                          <img 
                            src={imgUrl} 
                            alt={`Gallery photo ${index + 1}`} 
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-1.5 left-1.5 bg-zinc-950/80 text-amber-400 font-mono font-bold text-[10px] px-1.5 py-0.5 rounded">
                            #{index + 1}
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveGalleryImage(index)}
                            className="absolute top-1.5 right-1.5 bg-red-600 hover:bg-red-500 text-white p-1 rounded-lg transition-colors cursor-pointer shadow-lg"
                            title="Delete this photo"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-zinc-950/60 rounded-xl border border-zinc-800 text-center text-xs text-zinc-500">
                    No additional gallery photos added yet. Click the button above to upload multiple photos at once.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: SIZE & INVENTORY STOCK (INCLUDING 3XL) */}
          {activeTab === 'inventory' && (
            <div className="space-y-4">
              {/* Order Mode Switcher in TAB 3 */}
              <div className="p-4 bg-zinc-950/80 border border-zinc-800 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                      Product Order Mode (ပစ္စည်းရောင်းချမှု ပုံစံ)
                    </h3>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    formData.stockStatus === 'pre-order'
                      ? 'bg-cyan-950 text-cyan-400 border-cyan-700'
                      : 'bg-emerald-950 text-emerald-400 border-emerald-700'
                  }`}>
                    {formData.stockStatus === 'pre-order' ? 'Pre-Order Active' : 'In-Stock Active'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, stockStatus: 'in-stock' })}
                    className={`p-3 rounded-xl border text-left transition-all flex items-center gap-3 ${
                      formData.stockStatus !== 'pre-order'
                        ? 'bg-emerald-950/40 border-emerald-500 ring-1 ring-emerald-500/30'
                        : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 opacity-60'
                    }`}
                  >
                    <span className="text-lg">🟢</span>
                    <div>
                      <div className="font-bold text-xs text-white">In Stock (ပစ္စည်းအသင့်ရှိ)</div>
                      <div className="text-[10px] text-zinc-400">Warehouse stock counts apply directly to customer carts</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, stockStatus: 'pre-order' })}
                    className={`p-3 rounded-xl border text-left transition-all flex items-center gap-3 ${
                      formData.stockStatus === 'pre-order'
                        ? 'bg-cyan-950/50 border-cyan-400 ring-1 ring-cyan-400/40'
                        : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 opacity-60'
                    }`}
                  >
                    <span className="text-lg">🕒</span>
                    <div>
                      <div className="font-bold text-xs text-cyan-300">Pre-Order (ကြိုတင်မှာယူရန်)</div>
                      <div className="text-[10px] text-zinc-400">Customers can order all sizes unlimitedly on-demand</div>
                    </div>
                  </button>
                </div>

                {formData.stockStatus === 'pre-order' && (
                  <div className="pt-2 border-t border-zinc-800 flex flex-col sm:flex-row sm:items-center gap-2">
                    <span className="text-[11px] font-bold text-cyan-300 whitespace-nowrap">
                      Lead Time (ရရှိမည့်ရက်):
                    </span>
                    <input
                      type="text"
                      value={formData.preOrderLeadTime ?? '5-7 Days'}
                      onChange={(e) => setFormData({ ...formData, preOrderLeadTime: e.target.value })}
                      placeholder="e.g. 5-7 Days"
                      className="flex-1 bg-zinc-900 border border-cyan-800 text-cyan-200 font-mono text-xs px-2.5 py-1 rounded-lg"
                    />
                  </div>
                )}
              </div>

              <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                      Available Stock per Size (3XL အပါအဝင် ဆိုဒ်အလိုက် လက်ကျန်အရေအတွက်)
                    </h3>
                    <p className="text-[11px] text-zinc-400">
                      Manage inventory from S to 3XL directly
                    </p>
                  </div>
                  <span className="text-xs text-zinc-300 font-mono font-bold bg-zinc-800 px-3 py-1.5 rounded-lg border border-zinc-700">
                    Total Warehouse: {totalInventoryUnits} units
                  </span>
                </div>

                {/* 6 Sizes Grid (S, M, L, XL, 2XL, 3XL) */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {(['S', 'M', 'L', 'XL', '2XL', '3XL'] as JerseySize[]).map((size) => {
                    const count = formData.inventory?.[size] ?? 0;
                    return (
                      <div key={size} className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 space-y-2 text-center shadow-inner">
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-black text-xs text-amber-400">Size {size}</span>
                          <span className={`text-[10px] font-bold ${count <= 2 ? 'text-rose-400' : 'text-emerald-400'}`}>
                            {count <= 0 ? 'Out' : `${count} left`}
                          </span>
                        </div>

                        {/* Increment / Decrement controls */}
                        <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-700 rounded-lg p-1">
                          <button
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({
                                ...prev,
                                inventory: {
                                  ...defaultInventory,
                                  ...(prev.inventory || {}),
                                  [size]: Math.max(0, count - 1)
                                }
                              }));
                            }}
                            className="w-7 h-7 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded text-sm font-bold flex items-center justify-center transition-colors"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            min="0"
                            value={count}
                            onChange={(e) => {
                              const val = parseInt(e.target.value, 10) || 0;
                              setFormData(prev => ({
                                ...prev,
                                inventory: {
                                  ...defaultInventory,
                                  ...(prev.inventory || {}),
                                  [size]: Math.max(0, val)
                                }
                              }));
                            }}
                            className="w-full text-center bg-transparent text-white font-mono font-black text-sm focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({
                                ...prev,
                                inventory: {
                                  ...defaultInventory,
                                  ...(prev.inventory || {}),
                                  [size]: count + 1
                                }
                              }));
                            }}
                            className="w-7 h-7 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded text-sm font-bold flex items-center justify-center transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Quick Inventory Restock Buttons */}
                <div className="pt-3 border-t border-zinc-800/80 flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-[11px] text-zinc-400 font-medium">Quick Stock Tools:</span>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        inventory: (['S', 'M', 'L', 'XL', '2XL', '3XL'] as JerseySize[]).reduce((acc, sz) => {
                          acc[sz] = ((prev.inventory?.[sz] || 0) + 10);
                          return acc;
                        }, {} as SizeInventory)
                      }));
                    }}
                    className="bg-zinc-800 hover:bg-zinc-700 text-amber-400 font-semibold px-3 py-1.5 rounded-lg transition-colors"
                  >
                    +10 to All Sizes
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        inventory: (['S', 'M', 'L', 'XL', '2XL', '3XL'] as JerseySize[]).reduce((acc, sz) => {
                          acc[sz] = ((prev.inventory?.[sz] || 0) + 5);
                          return acc;
                        }, {} as SizeInventory)
                      }));
                    }}
                    className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    +5 to All Sizes
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        inventory: { S: 20, M: 20, L: 20, XL: 20, '2XL': 20, '3XL': 20 }
                      }));
                    }}
                    className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Set All to 20
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: DESCRIPTION & COLORS */}
          {activeTab === 'colors' && (
            <div className="space-y-4">
              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300">Jersey Description (အသေးစိတ်ဖော်ပြချက်)</label>
                <textarea
                  rows={3}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Official tournament jersey engineered with quick-dry fabric..."
                  className="w-full bg-zinc-900 border border-zinc-800 text-white text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Theme Colors */}
              <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-2xl space-y-3">
                <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Palette className="w-4 h-4" /> Jersey Theme Colors (3D & Glow effects)
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-zinc-400">Primary Color</label>
                    <div className="flex items-center gap-2 bg-zinc-900 p-2 rounded-xl border border-zinc-800">
                      <input
                        type="color"
                        value={formData.primaryColor || '#F59E0B'}
                        onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                        className="w-8 h-8 rounded border-none bg-transparent cursor-pointer"
                      />
                      <span className="text-xs font-mono text-white">{formData.primaryColor}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-zinc-400">Secondary Color</label>
                    <div className="flex items-center gap-2 bg-zinc-900 p-2 rounded-xl border border-zinc-800">
                      <input
                        type="color"
                        value={formData.secondaryColor || '#18181B'}
                        onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                        className="w-8 h-8 rounded border-none bg-transparent cursor-pointer"
                      />
                      <span className="text-xs font-mono text-white">{formData.secondaryColor}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-zinc-400">Accent Glow</label>
                    <div className="flex items-center gap-2 bg-zinc-900 p-2 rounded-xl border border-zinc-800">
                      <input
                        type="color"
                        value={formData.accentColor || '#FCD34D'}
                        onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                        className="w-8 h-8 rounded border-none bg-transparent cursor-pointer"
                      />
                      <span className="text-xs font-mono text-white">{formData.accentColor}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* FABRIC & SPECS CUSTOMIZATION */}
              {renderFabricSpecsSection()}
            </div>
          )}

          {/* Bottom Actions */}
          <div className="pt-4 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-3 sticky bottom-0 bg-zinc-950/95 py-2">
            {!isCreatingNew && (
              <div>
                {deleteConfirm ? (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-colors"
                    >
                      Confirm Delete (သေချာဖျက်မည်)
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteConfirm(false)}
                      className="bg-zinc-800 text-zinc-300 text-xs px-3 py-2 rounded-xl"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setDeleteConfirm(true)}
                    className="text-red-400 hover:text-red-300 text-xs font-bold flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-red-950/30 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Product (ဖျက်မည်)</span>
                  </button>
                )}
              </div>
            )}

            <div className="flex items-center gap-3 ml-auto">
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-bold px-4 py-2.5 rounded-xl border border-zinc-800 transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="bg-amber-400 hover:bg-amber-300 text-zinc-950 font-black text-xs px-6 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-amber-400/20 cursor-pointer"
              >
                {saveSuccess ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Saved! (သိမ်းဆည်းပြီးပါပြီ)</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Save Changes (သိမ်းဆည်းမည်)</span>
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
