import React, { useState, FormEvent } from 'react';
import { 
  Search, 
  Sparkles, 
  CheckCircle2, 
  AlertOctagon, 
  HelpCircle, 
  Loader2, 
  RefreshCw, 
  Barcode, 
  Camera, 
  UploadCloud, 
  Check, 
  Flame, 
  Milk, 
  Beer, 
  Droplet, 
  Apple, 
  Sparkle, 
  ArrowRight, 
  CornerDownRight,
  ShieldCheck,
  AlertTriangle,
  ArrowLeft,
  ArrowUpDown,
  Info
} from 'lucide-react';
import { motion } from 'motion/react';
import { STATIC_FOODS_DATABASE } from '../data/foods';
import { FoodItem, AIAnalysisResult, NaturalFood } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

// Helper to match rating selections — exact match only
const matchesRating = (food: FoodItem, sel: string | null) => {
  if (!sel) return false;
  return food.p_rating === sel;
};

// Predefined database of common retail food barcodes for demo and validation
const BARCODE_DATABASE = [
  {
    code: '036000291452',
    name: 'Premium Stout Yeast Brewer\'s Beer Can',
    category: 'Alcoholic Beverages',
    p_rating: 'High' as const,
    mgPer100g: 110,
    why: 'Beer is rich in highly toxic yeast purines. Furthermore, the accompanying alcohol metabolizes to lactic acid, which physically blocks the kidneys from excreting blood uric acid.',
    safetyTips: [
      'Eliminate beer completely during active pain flares.',
      'Always alternate with carbonated mineral water to flush uric salts.',
      'Request organic cherry extract dietary supplements as safely tolerated.'
    ],
    lowPurineAlternatives: [
      'Bubbly Carbonated Water with Cherry Jam',
      'Anti-inflammatory Chill Ginger Tea',
      'Virgin Mocktail with Celery Infusion'
    ]
  },
  {
    code: '049000028904',
    name: 'Sweetened High-Fructose Syrup Energy Soda',
    category: 'Carbonated Sweets',
    p_rating: 'High' as const,
    mgPer100g: 0,
    why: 'Contains zero physical purines, but high-fructose corn syrup forces ATP cell energy exhaustion in the liver. This rapidly triggers AMP conversion to uric acid within 15 minutes.',
    safetyTips: [
      'Eliminate high fructose beverages from your shopping cart.',
      'Favor unsweetened cold herbal teas with squeeze of real lemon.',
      'Keep hydrated with pure fresh water to dilute metabolic reactions.'
    ],
    lowPurineAlternatives: [
      'Stevia Sweetened Iced Green Tea',
      'Fresh Cucumber Mocktail Sparkler',
      'Infused Mint-Lemon Mineral Water'
    ]
  },
  {
    code: '072554110022',
    name: '100% Organic Tart Cherry Anti-Inflammatory Juice',
    category: 'Therapeutic Juices',
    p_rating: 'Safe' as const,
    mgPer100g: 2,
    why: 'Anthocyanins naturally suppress uric acid production, ease inflammation in localized joints, and assist kidneys in carrying away high crystal loads.',
    safetyTips: [
      'Consume 30-60mL daily to support general gout protection.',
      'Ensure there is no added high fructose syrup or crystalline sugars.',
      'Blend with cold spring water to amplify systemic hydration benefits.'
    ],
    lowPurineAlternatives: [
      'Fresh Organic Dark Blueberries',
      'Tart Cherry Extract Gummy Capsules',
      'Celery Seed Brewed Herbal Chaser'
    ]
  },
  {
    code: '012345678901',
    name: 'Grass-Fed Fresh Angus Beef Liver Pack',
    category: 'Organ Meats',
    p_rating: 'High' as const,
    mgPer100g: 350,
    why: 'Contains highly concentrated quantities of hypoxanthine. This molecular purine converts instantly to systemic gout crystals upon absorption.',
    safetyTips: [
      'Strictly avoid beef liver, sweetbreads, kidneys, and pâté.',
      'Derive safe protein from pasture-raised organic eggs or hard cheeses.',
      'Maintain continuous hydration tracking of 3+ Liters daily.'
    ],
    lowPurineAlternatives: [
      'Anti-inflammatory Baked Organic Soy Tofu',
      'Pasture-Raised Boiled Eggs',
      'Almond Butter with High Zinc Minerals'
    ]
  },
  {
    code: '070038312068',
    name: 'Organic Whole Grain Rolled Oats',
    category: 'Grains & Cereals',
    p_rating: 'Moderate' as const,
    mgPer100g: 94,
    why: 'Rich in healthy dietary fiber but contains moderate purine content. Safe when limited, but excessive portions can cause gradual joint stiffness.',
    safetyTips: [
      'Restrict oat-based cereals to twice a week maximum.',
      'Never sweeten with corn syrup; garnish with raw blueberries or ginger.',
      'Boil oats with extra water to keep diet hydration elevated.'
    ],
    lowPurineAlternatives: [
      'Organic Brown-Rice Hot Porridge',
      'Quinoa Seeds with Sliced Almonds',
      'Chia Seeds Infused in Low-Fat Dairy'
    ]
  },
  {
    code: '085239233011',
    name: 'Extra Virgin Cold Pressed Olive Oil Bottle',
    category: 'Oils & Fats',
    p_rating: 'Safe' as const,
    mgPer100g: 0,
    why: 'Abounds in healthy anti-inflammatory monounsaturated fats and antioxidant polyphenols that lubricate joint tissues and reduce soreness.',
    safetyTips: [
      'Use raw over fresh greens instead of frying or boiling.',
      'Keep stored in a cool protective bottle away from thermal stove heating.',
      'Fights inflammatory pathways to preserve localized mobility.'
    ],
    lowPurineAlternatives: [
      'Raw Organic Cold Avocado Oil',
      'Fresh Whole Avocados',
      'Expeller-Pressed Flaxseed Dressing'
    ]
  },
  {
    code: '011110038364',
    name: 'Pure Plain Icelandic High-Protein Skyr Yogurt',
    category: 'Dairy Products',
    p_rating: 'Safe' as const,
    mgPer100g: 3,
    why: 'Highly beneficial low-fat dairy contains natural proteins that actively stimulate the renal excretion of waste uric acid crystals.',
    safetyTips: [
      'Choose non-fat or low-fat dairy to trigger maximum excretion.',
      'Add unsweetened cherry powder to construct a strong gout shield.',
      'Enjoy as a superb alternative to purine-heavy red meats.'
    ],
    lowPurineAlternatives: [
      'Low-Fat Probiotic Plain Kefir Cup',
      'Organic Low-Fat Milk Smoothie',
      'Low-Fat Cottage Cheese with Blueberries'
    ]
  }
];

// Helper to make synthesizer beep sounds in browser
const playScanChime = () => {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(950, audioCtx.currentTime); 
    gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.005, audioCtx.currentTime + 0.12);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 0.12);
  } catch (e) {
    // Fail silently if blocked by browser autoplay rules
  }
};

const playSuccessChime = () => {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    const triggerTone = (freq: number, start: number, length: number) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0.05, start);
      gain.gain.exponentialRampToValueAtTime(0.002, start + length);
      osc.start(start);
      osc.stop(start + length);
    };

    const now = audioCtx.currentTime;
    triggerTone(660, now, 0.1);
    triggerTone(880, now + 0.08, 0.2);
  } catch (e) {
    // Fail silently if blocked
  }
};

interface FoodScannerProps {
  naturalFoods?: NaturalFood[];
  onAddNaturalFood?: (food: Omit<NaturalFood, 'id' | 'takenDates'>) => void;
}

export default function FoodScanner({ naturalFoods = [], onAddNaturalFood }: FoodScannerProps) {
  const { language, t } = useLanguage();
  const [activeConsoleTab, setActiveConsoleTab] = useState<'search' | 'ai' | 'barcode'>('search');

  // Search static list card
  const [searchQuery, setSearchQuery] = useState('');
  const [aiQuery, setAiQuery] = useState('');
  
  // Category detail page state
  const [selectedDetailRating, setSelectedDetailRating] = useState<string | null>(null);
  const [detailSearchQuery, setDetailSearchQuery] = useState('');
  const [selectedDetailCategory, setSelectedDetailCategory] = useState<string>('All');
  const [detailSortBy, setDetailSortBy] = useState<'name' | 'mg' | 'category'>('name');

  // AI analysis state
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<AIAnalysisResult | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  // Barcode scanner states
  const [barcodeQuery, setBarcodeQuery] = useState('');
  const [barcodeLoading, setBarcodeLoading] = useState(false);
  const [barcodeResult, setBarcodeResult] = useState<any | null>(null);
  const [barcodeError, setBarcodeError] = useState<string | null>(null);
  const [isCameraSimulated, setIsCameraSimulated] = useState(false);
  const [detectedCustomCode, setDetectedCustomCode] = useState<string | null>(null);
  const [customFoodInput, setCustomFoodInput] = useState('');

  // Filter static database and deduplicate by normalized name
  const filteredFoods = (() => {
    const results = STATIC_FOODS_DATABASE.filter((food) =>
      food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      food.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const seen = new Set<string>();
    return results.filter((f) => {
      const key = f.name.trim().toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  })();

  const handleAiScan = async (e: FormEvent) => {
    e.preventDefault();
    if (!aiQuery.trim()) return;

    setAiLoading(true);
    setAiError(null);
    setAiResult(null);

    try {
      const response = await fetch('/api/gemini/food-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ foodQuery: aiQuery, language }),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || 'Server error calling dietary model');
      }

      const result = await response.json();
      setAiResult(result);
    } catch (err: any) {
      console.error(err);
      setAiError(err.message || (language === 'es' ? 'Error al completar el análisis de IA.' : 'Failed to complete AI review. Verify API key configuration.'));
    } finally {
      setAiLoading(false);
    }
  };

  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!barcodeQuery.trim()) return;

    setBarcodeLoading(true);
    setBarcodeError(null);
    setBarcodeResult(null);
    setDetectedCustomCode(null);
    setIsCameraSimulated(true);

    playScanChime();

    setTimeout(() => {
      setIsCameraSimulated(false);
      setBarcodeLoading(false);

      const found = BARCODE_DATABASE.find(item => item.code === barcodeQuery.trim());
      if (found) {
        setBarcodeResult(found);
        playSuccessChime();
      } else {
        // Barcode is valid format but not in manual quick database
        // Ask product name to resolve via real AI pipeline!
        setDetectedCustomCode(barcodeQuery.trim());
        setBarcodeResult(null);
      }
    }, 1400);
  };

  const handlePresetCodeScan = (product: typeof BARCODE_DATABASE[0]) => {
    setIsCameraSimulated(true);
    setBarcodeLoading(true);
    setBarcodeError(null);
    setBarcodeResult(null);
    setDetectedCustomCode(null);
    setBarcodeQuery(product.code);

    playScanChime();

    setTimeout(() => {
      setIsCameraSimulated(false);
      setBarcodeLoading(false);
      setBarcodeResult(product);
      playSuccessChime();
    }, 1200);
  };

  const handleCustomBarcodeAiResolve = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customFoodInput.trim() || !detectedCustomCode) return;

    setBarcodeLoading(true);
    setBarcodeError(null);

    try {
      const response = await fetch('/api/gemini/food-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ foodQuery: `${customFoodInput} (EAN Barcode: ${detectedCustomCode})` }),
      });

      if (!response.ok) {
        throw new Error('API server was unable to retrieve properties for the barcode item');
      }

      const result = await response.json();
      
      // Map to same expected safety card layout
      setBarcodeResult({
        name: result.foodName,
        category: 'Scanned Supermarket Grocery',
        p_rating: result.purineRating,
        why: result.ratingExplanation + ' ' + result.uricAcidImpact,
        safetyTips: result.safetyTips,
        lowPurineAlternatives: result.lowPurineAlternatives,
        code: detectedCustomCode
      });
      setDetectedCustomCode(null);
      setCustomFoodInput('');
      playSuccessChime();
    } catch (err: any) {
      console.error(err);
      setBarcodeError(err.message || 'Unable to scan barcode with AI. Confirm internet and API keys.');
    } finally {
      setBarcodeLoading(false);
    }
  };

  const getRatingStyle = (rating: 'Safe' | 'Moderate' | 'High') => {
    switch (rating) {
      case 'Safe':
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          badge: 'bg-emerald-600 text-white',
          text: 'text-emerald-700',
          dot: 'bg-emerald-500',
        };
      case 'Moderate':
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-200',
          badge: 'bg-amber-600 text-white',
          text: 'text-amber-700',
          dot: 'bg-amber-500',
        };
      case 'High':
        return {
          bg: 'bg-rose-50 text-rose-800 border-rose-200',
          badge: 'bg-rose-600 text-white',
          text: 'text-rose-700',
          dot: 'bg-rose-500',
        };
    }
  };

  return (
    <div className="space-y-6" id="food_scanner_root">
      
      {/* Visual Navigation SubTabs */}
      <div className="bg-slate-100 p-1.5 rounded-3xl border border-slate-200/60 grid grid-cols-3 gap-1">
        <button
          onClick={() => setActiveConsoleTab('search')}
          className={`py-3 px-1.5 text-xs font-bold rounded-2xl transition cursor-pointer select-none text-center flex items-center justify-center gap-1.5 ${
            activeConsoleTab === 'search' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-600 hover:bg-white/50'
          }`}
          id="btn_tab_directory"
        >
          <Search size={14} className="text-blue-500" />
          {t('scanner.tabs.directory', 'Purine Index')}
        </button>
        <button
          onClick={() => setActiveConsoleTab('ai')}
          className={`py-3 px-1.5 text-xs font-bold rounded-2xl transition cursor-pointer select-none text-center flex items-center justify-center gap-1.5 ${
            activeConsoleTab === 'ai' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-600 hover:bg-white/50'
          }`}
          id="btn_tab_gout_ai"
        >
          <Sparkles size={14} className="text-violet-500" />
          {t('scanner.tabs.gemiAnalyst', 'Gemi Analyst')}
        </button>
        <button
          onClick={() => setActiveConsoleTab('barcode')}
          className={`py-3 px-1.5 text-xs font-bold rounded-2xl transition cursor-pointer select-none text-center flex items-center justify-center gap-1.5 ${
            activeConsoleTab === 'barcode' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-600 hover:bg-white/50'
          }`}
          id="btn_tab_barcode"
        >
          <Barcode size={14} className="text-emerald-500" />
          {t('scanner.tabs.barcode', 'Barcode Scanner')}
        </button>
      </div>

      {/* VIEW 1: MANUAL DIRECTORY SEARCH OR RATING DETAIL PAGE */}
      {activeConsoleTab === 'search' && (
        selectedDetailRating ? (
          // RATING LEVEL DETAIL PAGE
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm animate-in fade-in duration-200" id="purine_detail_page">
            {/* Header / Back Navigation */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
              <button
                onClick={() => {
                  setSelectedDetailRating(null);
                  setDetailSearchQuery('');
                  setSelectedDetailCategory('All');
                }}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors select-none cursor-pointer self-start bg-slate-50 hover:bg-slate-100 px-3 py-2 rounded-xl border border-slate-200"
                id="btn_back_to_purine_index"
              >
                <ArrowLeft size={14} /> {language === 'zh' ? '返回索引目录' : language === 'es' ? 'Volver al Directorio' : 'Back to Directory'}
              </button>

              <span className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider">
                {language === 'zh' ? '循证医学饮食指南' : language === 'es' ? 'Guía Dietética Basada en Evidencia' : 'Evidence-Based Diet Guide'}
              </span>
            </div>

            {/* Dynamic Category Content Headers */}
            {selectedDetailRating === 'Safe' && (
              <div className="bg-gradient-to-r from-emerald-600/10 to-teal-500/5 border border-emerald-500/10 rounded-2xl p-5 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <h2 className="font-sans font-bold text-lg text-emerald-800">
                    {language === 'zh' ? '安全 / 低嘌呤食物' : language === 'es' ? 'Alimentos Seguros / Bajos en Purinas' : 'Safe / Low Purine Foods'}
                  </h2>
                </div>
                <p className="text-xs text-emerald-705 leading-relaxed">
                  {language === 'zh'
                    ? '这些食物经过临床验证，有助于肾脏清除尿酸、碱化尿液或天然抑制尿酸合成。可每日放心食用，协助将血尿酸维持在 6.0 mg/dL 达标线以下（Mayo Clinic、PubMed）。'
                    : language === 'es'
                    ? 'Estos alimentos están respaldados clínicamente para favorecer la excreción renal, alcalinizar la orina o inhibir la síntesis de ácido úrico. Son seguros a diario (Mayo Clinic).'
                    : 'These foods are clinically documented to support renal clearance, raise urine pH, or naturally inhibit uric acid synthesis. They are safe to consume daily and help maintain therapeutic uric acid targets under 6.0 mg/dL (Mayo Clinic, Healthline Medically Reviewed).'}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-4 text-[11px] text-emerald-850">
                  <div className="bg-white/80 border border-emerald-100/55 p-2.5 rounded-xl">
                    <strong>💧 {language === 'zh' ? '充足稀释冲刷:' : language === 'es' ? 'Hidratación Diluyente:' : 'Dilutive Flushing:'}</strong> {language === 'zh' ? '每日8-12杯纯水保持尿酸溶解排泄 (Cleveland Clinic)' : language === 'es' ? '8-12 vasos de agua disuelven el urato (Cleveland Clinic)' : '8-12 glasses of water keeps urate dissolved (Cleveland Clinic).'}
                  </div>
                  <div className="bg-white/80 border border-emerald-100/55 p-2.5 rounded-xl">
                    <strong>🍒 {language === 'zh' ? '天然黄嘌呤氧化酶抑制:' : language === 'es' ? 'Inhibidores de XO:' : 'Natural XO Inhibitors:'}</strong> {language === 'zh' ? '樱桃花青素阻断肝脏嘌呤氧化 (PubMed)' : language === 'es' ? 'Las antocianinas de las cerezas bloquean purinas (PubMed)' : 'Anthocyanins in cherries block liver purine breakdown (PubMed).'}
                  </div>
                  <div className="bg-white/80 border border-emerald-100/55 p-2.5 rounded-xl">
                    <strong>🥛 {language === 'zh' ? '肾脏排酸促进:' : language === 'es' ? 'Excreción Renal:' : 'Renal Excretion:'}</strong> {language === 'zh' ? '低脂乳品酪蛋白促使肾脏主动排出尿酸 (Healthline)' : language === 'es' ? 'La caseína en lácteos desnatados promueve la depuración' : 'Casein in low-fat dairy actively promotes renal clearance (Healthline).'}
                  </div>
                </div>
              </div>
            )}


            {selectedDetailRating === 'Moderate' && (
              <div className="bg-gradient-to-r from-amber-600/10 to-orange-500/5 border border-amber-500/10 rounded-2xl p-5 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <h2 className="font-sans font-bold text-lg text-amber-800">
                    {language === 'zh' ? '中等嘌呤食物' : language === 'es' ? 'Alimentos con Purinas Moderadas' : 'Moderate Purine Foods'}
                  </h2>
                </div>
                <p className="text-xs text-amber-705 leading-relaxed">
                  {language === 'zh'
                    ? '含有中等嘌呤（50-150mg/100g）。白肉鱼类（鳕鱼、罗非鱼、大比目鱼）及去皮禽肉在严格控制份量（通常单次少于100g）下可适量食用。植物性嘌呤（菠菜、燕麦、豆类、蘑菇）在临床上未显示与痛风发作正相关，可放心食用（PubMed, NEJM）。'
                    : language === 'es'
                    ? 'Contiene purinas moderadas (50-150mg/100g). Pescados blancos y aves magras son seguros en porciones controladas (<100g). Las purinas vegetales (espinacas, legumbres) no aumentan el riesgo de brotes (PubMed, NEJM).'
                    : 'Contains moderate levels of purines (50-150mg/100g). White fish (cod, tilapia, halibut) and lean poultry are safe in disciplined, limited portion sizes (typically under 100g). Crucially, plant-derived purines (spinach, oatmeal, legumes, mushrooms) do not show clinical correlation to gout flares and are safe to consume (PubMed, The New England Journal of Medicine).'}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-4 text-[11px] text-amber-850">
                  <div className="bg-white/80 border border-amber-100/55 p-2.5 rounded-xl">
                    <strong>🐟 {language === 'zh' ? '白肉鱼与禽肉:' : language === 'es' ? 'Pescado Blanco y Aves:' : 'White Fish & Poultry:'}</strong> {language === 'zh' ? '优质白肉鱼与鸡肉适量食用 (<100g)' : language === 'es' ? 'Pescado blanco y pollo en porciones controladas (<100g)' : 'Lean white fish and chicken in modest portions (<100g).'}
                  </div>
                  <div className="bg-white/80 border border-amber-100/55 p-2.5 rounded-xl">
                    <strong>🌱 {language === 'zh' ? '植物性嘌呤:' : language === 'es' ? 'Purinas Vegetales:' : 'Plant Purines:'}</strong> {language === 'zh' ? '菠菜与豆类不会增加发作风险' : language === 'es' ? 'Verduras como espinacas no elevan el riesgo' : 'Veggies like spinach and lentils do not raise flare risk.'}
                  </div>
                  <div className="bg-white/80 border border-amber-100/55 p-2.5 rounded-xl">
                    <strong>💧 {language === 'zh' ? '伴随饮水:' : language === 'es' ? 'Acompañar con Agua:' : 'Hydrate Companion:'}</strong> {language === 'zh' ? '摄入动物蛋白时多饮水稀释' : language === 'es' ? 'Beber más agua al consumir proteínas animales' : 'Drink extra water when consuming moderate animal proteins.'}
                  </div>
                </div>
              </div>
            )}


            {selectedDetailRating === 'High' && (
              <div className="bg-gradient-to-r from-rose-600/10 to-red-500/5 border border-rose-500/10 rounded-2xl p-5 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                  <h2 className="font-sans font-bold text-lg text-rose-800">
                    {language === 'zh' ? '高嘌呤食物（严格避免）' : language === 'es' ? 'Alimentos Altos en Purinas (Evitar Estrictamente)' : 'High Purine Foods (Strict Avoidance)'}
                  </h2>
                </div>
                <p className="text-xs text-rose-705 leading-relaxed">
                  {language === 'zh'
                    ? '具有高嘌呤密度（120-600mg+/100g）或代谢不良效应（酒精、高果糖浆），会迅速诱发高尿酸血症与痛风急性发作。红肉（牛肉、猪肉）、动物内脏、啤酒和甲壳贝类在发作期必须严格禁食（Mayo Clinic, PubMed）。'
                    : language === 'es'
                    ? 'Tienen alta densidad de purinas (120-600mg+/100g) o efectos metabólicos perjudiciales (alcohol, jarabe de maíz). Carnes rojas, vísceras, cerveza y mariscos deben evitarse rigurosamente durante los brotes (Mayo Clinic, PubMed).'
                    : 'These foods carry high purine density (120-600mg+/100g) or metabolic side-effects (alcohol, high fructose) that rapidly trigger hyperuricemia. Red meats (beef, pork), organ meats, beer, and shellfish should be avoided strictly during active pain flares and limited stringently during maintenance (Mayo Clinic, PubMed).'}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-4 text-[11px] text-rose-850">
                  <div className="bg-white/80 border border-rose-100/55 p-2.5 rounded-xl">
                    <strong>🥩 {language === 'zh' ? '牛羊肉与内脏:' : language === 'es' ? 'Carnes Rojas y Vísceras:' : 'Beef, Pork & Organs:'}</strong> {language === 'zh' ? '红肉与动物内脏代谢产生大量尿酸结晶' : language === 'es' ? 'Generan una carga masiva de cristales de urato' : 'Red meats and organ cuts break down into heavy uric crystal loads.'}
                  </div>
                  <div className="bg-white/80 border border-rose-100/55 p-2.5 rounded-xl">
                    <strong>🍺 {language === 'zh' ? '啤酒与烈酒:' : language === 'es' ? 'Cerveza y Licores:' : 'Beer & Spirits:'}</strong> {language === 'zh' ? '酵母嘌呤与乙醇阻碍肾排泄，严格禁饮' : language === 'es' ? 'Las purinas de levadura y el alcohol bloquean la excreción renal' : 'Yeast purines and alcohol block renal excretion. Avoid completely.'}
                  </div>
                  <div className="bg-white/80 border border-rose-100/55 p-2.5 rounded-xl">
                    <strong>🥤 {language === 'zh' ? '果葡糖浆 (HFCS):' : language === 'es' ? 'Fructosa (JMAF):' : 'Fructose (HFCS):'}</strong> {language === 'zh' ? '果糖消耗细胞ATP迅速升高血液尿酸' : language === 'es' ? 'La fructosa agota el ATP celular elevando el ácido úrico' : 'Fructose triggers rapid cellular ATP depletion, raising uric acid.'}
                  </div>
                </div>
              </div>
            )}

            {/* Filters Bar: Search and Category Selection */}
            <div className="space-y-4 mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="text"
                  placeholder={language === 'zh' ? `在 ${selectedDetailRating} 嘌呤食物中搜索...` : language === 'es' ? `Buscar en alimentos ${selectedDetailRating}...` : `Search in ${selectedDetailRating} purine items...`}
                  value={detailSearchQuery}
                  onChange={(e) => setDetailSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition font-medium text-slate-700"
                />
              </div>

              {/* Category selector pills */}
              <div className="flex flex-wrap gap-1.5 items-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 mr-1.5">
                  {language === 'zh' ? '分类筛选:' : language === 'es' ? 'Categoría:' : 'Filter Category:'}
                </span>
                {[
                  { key: 'All', label: language === 'zh' ? '全部' : language === 'es' ? 'Todos' : 'All' },
                  { key: 'Seafood', label: language === 'zh' ? '水产海鲜' : language === 'es' ? 'Mariscos/Pescados' : 'Seafood' },
                  { key: 'Meats', label: language === 'zh' ? '肉类' : language === 'es' ? 'Carnes' : 'Meats' },
                  { key: 'Beverages', label: language === 'zh' ? '饮品' : language === 'es' ? 'Bebidas' : 'Beverages' },
                  { key: 'Vegetables', label: language === 'zh' ? '蔬菜' : language === 'es' ? 'Verduras' : 'Vegetables' },
                  { key: 'Dairy', label: language === 'zh' ? '乳制品' : language === 'es' ? 'Lácteos' : 'Dairy' },
                  { key: 'Grains', label: language === 'zh' ? '谷物' : language === 'es' ? 'Granos' : 'Grains' },
                  { key: 'Fruits', label: language === 'zh' ? '水果' : language === 'es' ? 'Frutas' : 'Fruits' },
                  { key: 'Other', label: language === 'zh' ? '其他' : language === 'es' ? 'Otros' : 'Other' },
                ].map(({ key: cat, label }) => {
                  // Check if there are items in this category for the current rating
                  const count = STATIC_FOODS_DATABASE.filter(f => matchesRating(f, selectedDetailRating) && (cat === 'All' || f.category === cat)).length;
                  if (count === 0 && cat !== 'All') return null;

                  const isSelected = selectedDetailCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedDetailCategory(cat)}
                      className={`text-[10px] px-3 py-1.5 rounded-xl border font-bold transition select-none cursor-pointer ${
                        isSelected
                          ? 'bg-slate-800 border-slate-800 text-white shadow-xs'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {label} ({count})
                    </button>
                  );
                })}
              </div>

              {/* Sorting Bar */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span>
                  {language === 'zh' 
                    ? `显示 ${STATIC_FOODS_DATABASE.filter(f => matchesRating(f, selectedDetailRating) && (selectedDetailCategory === 'All' || f.category === selectedDetailCategory) && f.name.toLowerCase().includes(detailSearchQuery.toLowerCase())).length} 项食物`
                    : language === 'es'
                    ? `Mostrando ${STATIC_FOODS_DATABASE.filter(f => matchesRating(f, selectedDetailRating) && (selectedDetailCategory === 'All' || f.category === selectedDetailCategory) && f.name.toLowerCase().includes(detailSearchQuery.toLowerCase())).length} alimentos`
                    : `Showing ${STATIC_FOODS_DATABASE.filter(f => matchesRating(f, selectedDetailRating) && (selectedDetailCategory === 'All' || f.category === selectedDetailCategory) && f.name.toLowerCase().includes(detailSearchQuery.toLowerCase())).length} items`}
                </span>
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-0.5">
                    <ArrowUpDown size={10} /> {language === 'zh' ? '排序:' : language === 'es' ? 'Ordenar:' : 'Sort By:'}
                  </span>
                  <select
                    value={detailSortBy}
                    onChange={(e) => setDetailSortBy(e.target.value as any)}
                    className="bg-transparent border-0 font-bold text-slate-600 focus:outline-hidden focus:ring-0 p-0 cursor-pointer text-[11px]"
                  >
                    <option value="name">{language === 'zh' ? '首字母名称' : language === 'es' ? 'Alfabético' : 'Alphabetical'}</option>
                    <option value="mg">{language === 'zh' ? '嘌呤含量 (mg)' : language === 'es' ? 'Nivel Purinas (mg)' : 'Purine Level (mg)'}</option>
                    <option value="category">{language === 'zh' ? '类别' : language === 'es' ? 'Categoría' : 'Category'}</option>
                  </select>
                </div>
              </div>
            </div>

            {/* FOOD CARDS LIST */}
            <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
              {(() => {
                let list = STATIC_FOODS_DATABASE.filter(f => matchesRating(f, selectedDetailRating));
                
                if (selectedDetailCategory !== 'All') {
                  list = list.filter(f => f.category === selectedDetailCategory);
                }

                if (detailSearchQuery.trim()) {
                  list = list.filter(f => 
                    f.name.toLowerCase().includes(detailSearchQuery.toLowerCase()) || 
                    f.why.toLowerCase().includes(detailSearchQuery.toLowerCase())
                  );
                }

                // Sort
                list = [...list].sort((a, b) => {
                  if (detailSortBy === 'name') {
                    return a.name.localeCompare(b.name);
                  }
                  if (detailSortBy === 'category') {
                    return a.category.localeCompare(b.category);
                  }
                  if (detailSortBy === 'mg') {
                    const getVal = (item: FoodItem) => {
                      const str = item.mgPer100g || '';
                      if (str.includes('Under')) return 5;
                      if (str.includes('N/A') || str === '') return 0;
                      const matches = str.match(/\d+/g);
                      if (matches && matches.length > 0) {
                        return Math.max(...matches.map(Number));
                      }
                      return 0;
                    };
                    return getVal(b) - getVal(a); // High to low
                  }
                  return 0;
                });

                if (list.length === 0) {
                  return (
                    <div className="text-center py-10 text-slate-400">
                      {language === 'zh'
                        ? '在此分级中未找到匹配的食物。请尝试其他搜索词或分类筛选。'
                        : language === 'es'
                        ? 'No se encontraron alimentos coincidentes en este nivel. Intente con otra búsqueda.'
                        : 'No matching foods found in this level. Try a different search query or category filter.'}
                    </div>
                  );
                }

                return list.map((food) => {
                  const isSafe = food.p_rating === 'Safe';
                  const isTracked = isSafe && naturalFoods.some(nf => nf.name.toLowerCase() === food.name.toLowerCase());
                  
                  return (
                    <div
                      key={food.name}
                      className="p-4 rounded-2xl border transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50/30 hover:bg-slate-50/80 border-slate-100 hover:border-slate-200"
                    >
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-bold text-slate-800 text-sm">{food.name}</h4>
                          <span className="text-[9px] font-bold font-mono px-2 py-0.5 bg-white border border-slate-200 text-slate-500 rounded-md">
                            {food.category}
                          </span>
                          {food.mgPer100g && (
                            <span className="text-[10px] text-slate-400 font-mono font-bold bg-white/70 px-1.5 py-0.5 border border-slate-250/70 rounded-md">
                              {food.mgPer100g} / 100g
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed font-sans">{food.why}</p>
                      </div>

                      {/* Right Hand Actions */}
                      <div className="shrink-0 self-end md:self-center">
                        {isSafe ? (
                          onAddNaturalFood && (
                            <button
                              type="button"
                              onClick={() => {
                                if (isTracked) return;
                                
                                const mapCategory = (cat: string): 'Fruit' | 'Vegetable' | 'Beverage' | 'Dairy' | 'Herbal/Seasoning' | 'Other' => {
                                  if (cat === 'Beverages') return 'Beverage';
                                  if (cat === 'Vegetables') return 'Vegetable';
                                  if (cat === 'Fruits') return 'Fruit';
                                  if (cat === 'Dairy') return 'Dairy';
                                  return 'Other';
                                };

                                onAddNaturalFood({
                                  name: food.name,
                                  servingSize: food.name === 'Water' ? '250ml (1 glass)' : '1 portion (approx 100g)',
                                  category: mapCategory(food.category),
                                  frequency: 'Daily',
                                  mechanism: food.why,
                                  notes: 'Added from Safe Purine Foods detail page.'
                                });
                              }}
                              disabled={isTracked}
                              className={`text-[10px] font-bold px-3 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer ${
                                isTracked
                                  ? 'bg-slate-100 border border-slate-200 text-slate-450 pointer-events-none'
                                  : 'bg-emerald-600 hover:bg-emerald-700 text-white hover:shadow-sm'
                              }`}
                            >
                              <Check size={11} className={isTracked ? 'stroke-[2.5px]' : ''} />
                              {isTracked
                                ? (language === 'zh' ? '已在观察清单' : language === 'es' ? 'En Seguimiento' : 'Watchlisted')
                                : (language === 'zh' ? '记录摄入' : language === 'es' ? 'Registrar Ingesta' : 'Track Intake')}
                            </button>
                          )
                        ) : food.p_rating === 'High' ? (
                          <span className="text-[10px] font-bold px-2.5 py-1.5 bg-rose-50 border border-rose-100 text-rose-700 rounded-xl flex items-center gap-1">
                            <AlertTriangle size={11} className="text-rose-500" /> {language === 'zh' ? '高发作风险' : language === 'es' ? 'Alto Riesgo de Brote' : 'High Flare Risk'}
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2.5 py-1.5 bg-amber-50 border border-amber-100 text-amber-700 rounded-xl flex items-center gap-1">
                            <Info size={11} className="text-amber-500" /> {language === 'zh' ? '需控制分量' : language === 'es' ? 'Control de Porción' : 'Portion Control'}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
            
            {/* Disclaimer in Detail Page */}
            <div className="bg-slate-50 border border-slate-200/60 p-4 rounded-2xl flex items-start gap-2.5 mt-5">
              <Info className="text-slate-400 shrink-0 mt-0.5" size={14} />
              <div className="text-[10px] text-slate-550 leading-normal font-sans">
                ⚖️ <strong>{language === 'zh' ? '饮食支持声明：' : language === 'es' ? 'Aviso de Soporte Dietético:' : 'Dietary Support Disclaimer:'}</strong> {language === 'zh' ? '分量与临床机制源自公开发表的医学文献。营养调理为辅助手段，不能替代医生开具的处方痛风药物（如别嘌醇）。' : language === 'es' ? 'Las porciones y mecanismos provienen de fuentes clínicas públicas. El seguimiento nutricional es complementario y no sustituye terapias médicas (ej. Alopurinol).' : 'Portions and clinical mechanisms are derived from public clinical resources. Nutritional tracking is supportive and cannot replace doctor-prescribed gout therapies (e.g. Allopurinol).'}
              </div>
            </div>
          </div>
        ) : (
          // MAIN PURINE DIRECTORY VIEW
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm animate-in fade-in duration-200">
            <div className="mb-4">
              <h2 className="font-sans font-semibold text-lg text-slate-800 flex items-center gap-2">
                <Search className="text-blue-500" size={20} />
                {language === 'zh' ? '即时食物嘌呤索引目录' : language === 'es' ? 'Directorio Instantáneo de Purinas' : 'Instant Purine Directory'}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {language === 'zh' ? '检索常见食物类别以了解嘌呤含量、代谢机制与痛风风险' : language === 'es' ? 'Busque categorías de alimentos para consultar contenido de purinas y nivel de riesgo' : 'Search common food categories to investigate purine content and risk weight'}
              </p>
            </div>

            <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder={language === 'zh' ? '搜索车厘子、牛肝、三文鱼、饮用水、咖啡...' : language === 'es' ? 'Buscar cerezas, hígado, salmón, agua, café...' : 'Search cherries, beef liver, salmon, water, coffee...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition font-medium text-slate-700"
                id="food_search_input"
              />
            </div>

            {searchQuery && (
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-50 pr-1 space-y-2 mt-2">
                {filteredFoods.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-xs text-slate-500">
                      {language === 'zh' ? '离线数据库中未找到匹配项。' : language === 'es' ? 'Sin coincidencias en la base de datos local.' : 'No matching items in offline database.'}
                    </p>
                    <button
                      onClick={() => {
                        setAiQuery(searchQuery);
                        setActiveConsoleTab('ai');
                        setSearchQuery('');
                      }}
                      className="mt-2 inline-flex items-center gap-1.5 text-xs text-blue-600 font-semibold hover:underline cursor-pointer"
                    >
                      <Sparkles size={14} /> {language === 'zh' ? `使用 Gemi AI 深度分析 “${searchQuery}”` : language === 'es' ? `Analizar “${searchQuery}” con Gemi AI` : `Analyze “${searchQuery}” with Gemi AI instead`}
                    </button>
                  </div>
                ) : (
                  filteredFoods.map((food) => {
                    const styles = getRatingStyle(food.p_rating);
                    return (
                      <div key={food.name} className="py-3 flex flex-col sm:flex-row justify-between items-start gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-semibold text-sm text-slate-800">{food.name}</span>
                            <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-medium">
                              {food.category}
                            </span>
                            {food.mgPer100g && (
                              <span className="text-[10px] text-slate-400 font-mono">
                                ({food.mgPer100g} / 100g)
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 mt-1">{food.why}</p>
                        </div>

                        <div className={`px-3 py-1 rounded-full text-xs font-bold border ${styles.bg} self-start shrink-0`}>
                          {language === 'zh' ? '嘌呤等级: ' : language === 'es' ? 'Purina: ' : 'Purine: '}{food.p_rating}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {!searchQuery && (
              <div className="mt-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2.5">
                  {language === 'zh' ? '核心饮食分级（点击查看完整清单）' : language === 'es' ? 'Niveles Dietéticos Clave (Clic para ver lista)' : 'Key Dietary Levels (Click to view detailed lists)'}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Safe (Low) Card */}
                  <button
                    type="button"
                    onClick={() => setSelectedDetailRating('Safe')}
                    className="bg-emerald-50/30 hover:bg-emerald-50/60 border border-emerald-150 hover:border-emerald-355 p-4 rounded-2xl text-left cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xs group flex flex-col justify-between"
                  >
                    <div>
                      <span className="font-bold text-emerald-850 flex items-center gap-1.5 text-xs">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        {language === 'zh' ? '安全（低嘌呤）' : language === 'es' ? 'Seguro (Bajo)' : 'Safe (Low)'}
                      </span>
                      <p className="text-slate-600 mt-1.5 text-[11px] leading-relaxed">
                        {language === 'zh' ? '车厘子、纯净水、鸡蛋、糙米、低脂奶制品。鼓励每日摄入，协助肾脏排泄尿酸。' : language === 'es' ? 'Cerezas, agua, huevos, arroz integral, lácteos desnatados. Recomendado a diario.' : 'Cherries, water, eggs, brown rice, low-fat dairy. Encouraged daily to support kidney clearing mechanisms.'}
                      </p>
                    </div>
                    <span className="text-[10px] text-emerald-600 font-bold mt-3.5 inline-flex items-center gap-1 group-hover:underline">
                      {language === 'zh' ? `查看清单 (${STATIC_FOODS_DATABASE.filter(f => f.p_rating === 'Safe').length} 种食物)` : language === 'es' ? `Ver Lista (${STATIC_FOODS_DATABASE.filter(f => f.p_rating === 'Safe').length} alimentos)` : `View List (${STATIC_FOODS_DATABASE.filter(f => f.p_rating === 'Safe').length} foods)`} <ArrowRight size={10} />
                    </span>
                  </button>


                  {/* Moderate Card */}
                  <button
                    type="button"
                    onClick={() => setSelectedDetailRating('Moderate')}
                    className="bg-amber-50/30 hover:bg-amber-50/60 border border-amber-150 hover:border-amber-355 p-4 rounded-2xl text-left cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xs group flex flex-col justify-between"
                  >
                    <div>
                      <span className="font-bold text-amber-850 flex items-center gap-1.5 text-xs">
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        {language === 'zh' ? '适量（中嘌呤）' : language === 'es' ? 'Moderado' : 'Moderate'}
                      </span>
                      <p className="text-slate-600 mt-1.5 text-[11px] leading-relaxed">
                        {language === 'zh' ? '白肉鱼、鸡胸肉、燕麦、菠菜、三文鱼、豆类。适量控制食用份量（<100g）并配合大量饮水。' : language === 'es' ? 'Pescado blanco, pollo, avena, espinaca, salmón, legumbres. Consumir en porciones moderadas.' : 'White fish, chicken, oatmeal, spinach, salmon, legumes. Consume in controlled portion sizes (<100g) with ample water.'}
                      </p>
                    </div>
                    <span className="text-[10px] text-amber-600 font-bold mt-3.5 inline-flex items-center gap-1 group-hover:underline">
                      {language === 'zh' ? `查看清单 (${STATIC_FOODS_DATABASE.filter(f => f.p_rating === 'Moderate').length} 种食物)` : language === 'es' ? `Ver Lista (${STATIC_FOODS_DATABASE.filter(f => f.p_rating === 'Moderate').length} alimentos)` : `View List (${STATIC_FOODS_DATABASE.filter(f => f.p_rating === 'Moderate').length} foods)`} <ArrowRight size={10} />
                    </span>
                  </button>


                  {/* High Card */}
                  <button
                    type="button"
                    onClick={() => setSelectedDetailRating('High')}
                    className="bg-rose-50/30 hover:bg-rose-50/60 border border-rose-150 hover:border-rose-355 p-4 rounded-2xl text-left cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xs group flex flex-col justify-between"
                  >
                    <div>
                      <span className="font-bold text-rose-850 flex items-center gap-1.5 text-xs">
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                        {language === 'zh' ? '高嘌呤（严格避免）' : language === 'es' ? 'Alto (Evitar)' : 'High (Avoid)'}
                      </span>
                      <p className="text-slate-600 mt-1.5 text-[11px] leading-relaxed">
                        {language === 'zh' ? '牛肉、猪肉、啤酒、动物内脏、虾蟹贝类、含果糖甜饮料。极易诱发急性痛风发作，严格禁忌。' : language === 'es' ? 'Carne de res, cerdo, cerveza, vísceras, camarones, refrescos azucarados. Pueden provocar brotes agudos.' : 'Beef, pork, beer, organ meats, shrimp, sweetbreads, sugary sodas. Can trigger sudden acute flare outbreaks. Avoid strictly.'}
                      </p>
                    </div>
                    <span className="text-[10px] text-rose-600 font-bold mt-3.5 inline-flex items-center gap-1 group-hover:underline">
                      {language === 'zh' ? `查看清单 (${STATIC_FOODS_DATABASE.filter(f => f.p_rating === 'High').length} 种食物)` : language === 'es' ? `Ver Lista (${STATIC_FOODS_DATABASE.filter(f => f.p_rating === 'High').length} alimentos)` : `View List (${STATIC_FOODS_DATABASE.filter(f => f.p_rating === 'High').length} foods)`} <ArrowRight size={10} />
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )
      )}

      {/* VIEW 2: AI MEAL GOUT DIET ANALYST */}
      {activeConsoleTab === 'ai' && (
        <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden animate-in fade-in duration-200">
          <div className="absolute top-0 right-0 w-44 h-44 bg-blue-500/10 rounded-full blur-3xl -mr-12 -mt-12 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-violet-500/10 rounded-full blur-2xl -ml-6 -mb-6 pointer-events-none" />

          <div className="relative mb-5 flex items-start justify-between">
            <div>
              <h2 className="font-sans font-semibold text-lg text-white flex items-center gap-2">
                <Sparkles className="text-blue-400 fill-blue-400/10" size={20} />
                {language === 'zh' ? 'AI 痛风饮食深度分析师' : language === 'es' ? 'Analista Dietético de Gota IA' : 'AI Gout Diet Analyst'}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {language === 'zh' ? '输入复合菜肴、鸡尾酒、外卖或餐厅食谱，计算安全级别与低嘌呤替代方案' : language === 'es' ? 'Consulte sobre platos complejos, cócteles o recetas para calcular alternativas seguras' : 'Ask about complex dishes, cocktails, or restaurant recipes to compute safe alternatives'}
              </p>
            </div>
            <span className="text-[9px] uppercase font-bold tracking-widest bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded-full">
              {language === 'zh' ? '由 Gemi 强力驱动' : language === 'es' ? 'Desarrollado por Gemi' : 'Powered by Gemi'}
            </span>
          </div>

          <form onSubmit={handleAiScan} className="relative z-10 space-y-3" id="ai_food_custom_form">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                required
                placeholder={language === 'zh' ? '例如：芝士焗龙虾、威士忌酸、意式香肠披萨、培根蛋面...' : language === 'es' ? 'ej. Langosta Thermidor, Whisky sour, Pizza de pepperoni...' : 'e.g. Lobster thermidor, Whisky sour, Pepperoni pizza, Spaghetti Carbonara...'}
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                disabled={aiLoading}
                className="flex-1 px-4 py-3.5 bg-slate-800 border border-slate-700 rounded-2xl text-sm placeholder:text-slate-500 text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition"
                id="ai_food_query_input"
              />
              <button
                type="submit"
                disabled={aiLoading || !aiQuery.trim()}
                className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800/50 disabled:text-slate-500 text-white font-semibold text-sm px-5 py-3.5 rounded-2xl transition duration-150 cursor-pointer shrink-0 shadow-lg shadow-blue-900/30 flex items-center justify-center gap-2"
                id="btn_ai_audit"
              >
                {aiLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={16} /> {language === 'zh' ? '解析中...' : language === 'es' ? 'Analizando...' : 'Parsing...'}
                  </>
                ) : (
                  <>
                    <Sparkles size={16} /> {language === 'zh' ? '智能审查' : language === 'es' ? 'Auditar Ingesta' : 'Audit Intake'}
                  </>
                )}
              </button>
            </div>
          </form>

          {aiLoading && (
            <div className="mt-8 p-6 bg-slate-850 border border-slate-850/80 rounded-2xl flex flex-col items-center justify-center text-center animate-pulse">
              <Sparkles className="text-blue-400 animate-spin mb-3 stroke-1" size={32} />
              <h4 className="text-sm font-semibold text-slate-200">
                {language === 'zh' ? '正在分析分子级嘌呤图谱...' : language === 'es' ? 'Analizando perfiles moleculares de purinas...' : 'Analyzing molecular purine profiles...'}
              </h4>
              <p className="text-xs text-slate-400 mt-1 max-w-sm leading-normal">
                {language === 'zh' ? '交叉比对代谢风湿病学研究以估算血液尿酸生成速率与排泄影响。' : language === 'es' ? 'Cruzando estudios de reumatología metabólica para estimar la síntesis de ácido úrico.' : 'Cross-referencing metabolic rheumatology studies to estimate blood uric acid synthesis speed.'}
              </p>
            </div>
          )}

          {aiError && (
            <div className="mt-4 p-4 bg-rose-950/40 border border-rose-900/50 text-rose-200 rounded-2xl text-xs flex gap-2">
              <AlertOctagon className="text-rose-400 shrink-0" size={16} />
              <div>
                <span className="font-bold">{language === 'zh' ? '分析受阻:' : language === 'es' ? 'Análisis Bloqueado:' : 'Analysis Blocked:'}</span>
                <p className="mt-1 opacity-90">{aiError}</p>
              </div>
            </div>
          )}

          {aiResult && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-5 bg-slate-850 border border-slate-800 rounded-2xl space-y-4 text-slate-300"
              id="ai_analysis_result"
            >
              <div className="flex items-center justify-between border-b border-slate-850 pb-3 flex-wrap gap-2">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                    {language === 'zh' ? 'AI 审查报告' : language === 'es' ? 'Resultado de Revisión IA' : 'AI Review output'}
                  </span>
                  <h3 className="font-semibold text-sm text-white mt-0.5">{aiResult.foodName}</h3>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold border ${etRatingStyles(aiResult.purineRating)}`}>
                  {language === 'zh' ? '嘌呤级别: ' : language === 'es' ? 'Nivel de Purina: ' : 'Purine Level: '}{aiResult.purineRating}
                </div>
              </div>

              <div className="text-xs space-y-2.5">
                <div>
                  <span className="font-bold text-slate-200 block">🔬 {language === 'zh' ? '嘌呤细分机制:' : language === 'es' ? 'Desglose de Purinas:' : 'Purine Breakdown:'}</span>
                  <p className="mt-1 leading-relaxed text-slate-400">{aiResult.ratingExplanation}</p>
                </div>

                <div>
                  <span className="font-bold text-slate-200 block">🩸 {language === 'zh' ? '生理尿酸影响:' : language === 'es' ? 'Impacto Fisiológico en Ácido Úrico:' : 'Physiological Uric Acid Impact:'}</span>
                  <p className="mt-1 leading-relaxed text-slate-400">{aiResult.uricAcidImpact}</p>
                </div>
              </div>

              <div className="border-t border-slate-800 pt-3.5">
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block mb-2">
                  {language === 'zh' ? '安全指引与摄入限制' : language === 'es' ? 'Guía de Seguridad y Límites' : 'Safety guidance & limits'}
                </span>
                <ul className="space-y-1.5 list-none pl-0">
                  {aiResult.safetyTips.map((tip, idx) => (
                    <li key={idx} className="text-xs text-slate-450 flex items-start gap-2">
                      <span className="text-blue-500 font-bold shrink-0 mt-0.5">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-slate-800 pt-3.5">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block mb-2">
                  {language === 'zh' ? '安全的低嘌呤替代品' : language === 'es' ? 'Alternativas Bajas en Purinas Seguras' : 'Safe Low-Purine Alternatives'}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {aiResult.lowPurineAlternatives.map((alt, idx) => (
                    <div key={idx} className="bg-slate-900 border border-slate-800/80 p-2.5 rounded-xl text-center text-xs font-semibold text-emerald-400">
                      {alt}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* VIEW 3: BARCODE LASER SCANNER (NEW EXCITING FEATURE) */}
      {activeConsoleTab === 'barcode' && (
        <div className="space-y-6 animate-in fade-in duration-200" id="barcode_laser_scanner_div">
          
          {/* Main layout grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Hand: Interactive Scanning Viewport Mockup (5 Columns) */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="bg-slate-950 border-4 border-slate-800 rounded-[32px] p-5 w-full max-w-[340px] shadow-xl relative overflow-hidden text-white flex flex-col items-center justify-between min-h-[390px]">
                
                {/* Upper Status Line */}
                <div className="w-full flex justify-between items-center text-[10px] uppercase font-bold tracking-widest text-slate-500/85 mb-2.5">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
                    <span>{language === 'zh' ? '光学扫描节点: 运行中' : language === 'es' ? 'Sensor Óptico: Activo' : 'Optical Node: Active'}</span>
                  </div>
                  <span className="font-mono text-slate-400">UPC-A / EAN</span>
                </div>

                {/* Laser scan window */}
                <div className="w-full flex-1 bg-slate-900/60 rounded-2xl relative flex flex-col items-center justify-center border border-slate-800 p-4 overflow-hidden h-44">
                  
                  {/* Scanner Grid Mesh Decorative */}
                  <div className="absolute inset-0 opacity-15" style={{
                    backgroundImage: 'radial-gradient(circle, #4f46e5 1px, transparent 1px)',
                    backgroundSize: '16px 16px'
                  }} />

                  {/* Horizontal Glowing Red Laser Beam Swipe line */}
                  <div 
                    className="absolute left-0 w-full h-1 bg-red-500 shadow-md shadow-red-500/80 transition-all z-20"
                    style={{
                      animation: isCameraSimulated ? 'laser-swipe 1s infinite linear' : 'laser-swipe 3s infinite linear',
                      top: '30%'
                    }}
                  />

                  {isCameraSimulated ? (
                    <div className="text-center relative z-10 space-y-2">
                      <Loader2 className="animate-spin text-emerald-400 mx-auto mb-1 stroke-2" size={24} />
                      <p className="text-xs font-mono font-bold text-emerald-300">
                        {language === 'zh' ? '正在解码条形码图谱...' : language === 'es' ? 'DECODIFICANDO CÓDIGO UPC...' : 'DECODING UPC PATTERN...'}
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono tracking-tighter">
                        {language === 'zh' ? '解析光谱对比度值' : language === 'es' ? 'Analizando valores de contraste' : 'Parsing spectral contrast values'}
                      </p>
                    </div>
                  ) : (
                    <div className="text-center relative z-10 space-y-3 p-2">
                      <Barcode className="text-slate-400 mx-auto" size={40} />
                      <p className="text-[11px] font-bold text-slate-300">
                        {language === 'zh' ? '将商品条码对准扫描镜头' : language === 'es' ? 'Apunte el código de barras al lente' : 'Aim camera packaging at lens'}
                      </p>
                      <div className="flex justify-center gap-1.5 flex-wrap">
                        <span className="text-[9px] uppercase font-extrabold px-1.5 py-0.5 bg-slate-800/85 border border-slate-750/70 text-slate-400 rounded-md">8-EAN</span>
                        <span className="text-[9px] uppercase font-extrabold px-1.5 py-0.5 bg-slate-800/85 border border-slate-750/70 text-slate-400 rounded-md">12-UPC</span>
                      </div>
                    </div>
                  )}

                  {/* Corner Reticle Frames */}
                  <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-indigo-500" />
                  <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-indigo-500" />
                  <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-indigo-500" />
                  <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-indigo-500" />
                </div>

                {/* Direct Manual Barcode Field */}
                <form onSubmit={handleBarcodeSubmit} className="w-full mt-4 space-y-2">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder={language === 'zh' ? '手动输入 UPC-A 条码数字...' : language === 'es' ? 'Ingresar código UPC-A manual...' : 'Enter UPC-A number manually...'}
                      value={barcodeQuery}
                      onChange={(e) => setBarcodeQuery(e.target.value.replace(/\D/g, ''))}
                      maxLength={14}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 text-xs text-white rounded-xl placeholder:text-slate-600 focus:outline-hidden focus:ring-1 focus:ring-emerald-500 font-mono font-semibold"
                      id="input_barcode_manual"
                    />
                    <button
                      type="submit"
                      disabled={barcodeLoading || !barcodeQuery}
                      className="absolute right-1 top-1/2 -translate-y-1/2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white rounded-lg p-1.5 transition text-xs font-bold cursor-pointer"
                    >
                      <ArrowRight size={12} className="text-emerald-400" />
                    </button>
                  </div>
                </form>

              </div>

              {/* Tips block */}
              <div className="mt-4 text-center max-w-xs">
                <p className="text-[10px] text-slate-400 leading-normal">
                  {language === 'zh'
                    ? '提示：点击右侧任意预设商品可即时模拟硬件条形码激光扫描。或直接手动键入数字。'
                    : language === 'es'
                    ? 'Consejo: Seleccione cualquiera de los preajustes a la derecha para simular el escaneo láser.'
                    : 'Pro-Tip: Select any of the grocery presets on the right to simulate a real hardware scan trigger. Or key in details.'}
                </p>
              </div>
            </div>

            {/* Right Hand: Interactive Grocery Targets & Results (7 Columns) */}
            <div className="lg:col-span-7 space-y-4">
              
              {/* Box 1: Scan Targets (Quick simulation clickable list) */}
              <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-3 flex items-center gap-1.5">
                  <Camera size={13} className="text-emerald-500" />
                  {language === 'zh' ? '预设零售商品条码（点击直接模拟扫描）' : language === 'es' ? 'Preajustes de Código de Barras (Clic para Escanear)' : 'Barcode Grocery Presets (Click to Scan)'}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {BARCODE_DATABASE.map((item) => (
                    <button
                      key={item.code}
                      onClick={() => handlePresetCodeScan(item)}
                      className="p-2.5 rounded-xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/10 text-left text-xs transition cursor-pointer flex items-center gap-2"
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        item.p_rating === 'Safe' ? 'bg-emerald-100 text-emerald-700' :
                        item.p_rating === 'Moderate' ? 'bg-amber-100 text-amber-700' :
                        'bg-rose-100 text-rose-700'
                      }`}>
                        {item.category.includes('Beverage') || item.category.includes('Juice') ? <Beer size={14} /> :
                         item.category.includes('Dairy') ? <Milk size={14} /> :
                         item.category.includes('Sweets') ? <Droplet size={14} /> : <Apple size={14} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-800 truncate">{item.name}</p>
                        <span className="text-[9px] font-mono text-slate-400">{item.code} ({item.category})</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Interactive Unknown Barcode Resolver Form */}
              {detectedCustomCode && (
                <div className="bg-emerald-950 text-white rounded-3xl p-5 border border-emerald-800/80 shadow-md animate-in slide-in-from-top-3 duration-200">
                  <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Sparkle size={13} className="animate-spin text-emerald-300" />
                    {language === 'zh' ? `识别到新条码: ${detectedCustomCode}` : language === 'es' ? `Nuevo Código Detectado: ${detectedCustomCode}` : `New Barcode Resolved: ${detectedCustomCode}`}
                  </h4>
                  <p className="text-[11px] text-emerald-100/90 leading-normal mb-3">
                    {language === 'zh'
                      ? '已成功扫描该条码，但离线预设库暂未收录。请输入食物或菜品名称，以便 Gemi 解析其嘌呤分子图谱：'
                      : language === 'es'
                      ? 'Escaneamos el código pero no está en la base local. Ingrese el nombre del alimento para que Gemi lo analice:'
                      : 'We scanned the barcode but did not find this exact retail batch offline. To help Gemi parse its molecular profile, what is the food product or dish name?'}
                  </p>

                  <form onSubmit={handleCustomBarcodeAiResolve} className="space-y-3" id="custom_barcode_ai_form">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        required
                        placeholder={language === 'zh' ? '例如：龙虾浓汤、无糖姜汁汽水、盐焗花生...' : language === 'es' ? 'ej. Sopa de langosta, Ginger ale, Maní salado...' : 'e.g. Lobster Bisque soup, Diet Ginger Ale, Salted Peanuts...'}
                        value={customFoodInput}
                        onChange={(e) => setCustomFoodInput(e.target.value)}
                        className="flex-1 px-3 py-2 bg-emerald-900 border border-emerald-800 placeholder:text-emerald-300/40 text-white rounded-xl text-xs focus:ring-1 focus:ring-emerald-300 focus:outline-hidden"
                      />
                      <button
                        type="submit"
                        disabled={barcodeLoading || !customFoodInput.trim()}
                        className="bg-white hover:bg-slate-100 text-emerald-950 font-bold text-xs px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-1"
                      >
                        {barcodeLoading ? (
                          <Loader2 size={13} className="animate-spin" />
                        ) : (language === 'zh' ? '智能分析' : language === 'es' ? 'Auditar Alimento' : 'Audit Item')}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Error output */}
              {barcodeError && (
                <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-xs text-rose-800 flex gap-2">
                  <AlertOctagon className="text-rose-600 shrink-0" size={16} />
                  <div>
                    <span className="font-bold">{language === 'zh' ? '扫描错误:' : language === 'es' ? 'Error de Escaneo:' : 'Scan Error:'}</span>
                    <p className="mt-0.5">{barcodeError}</p>
                  </div>
                </div>
              )}

              {/* Section: Scan result display card */}
              {barcodeResult && (
                <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-4 animate-in fade-in" id="card_scanned_details">
                  <div className="flex items-center justify-between border-b border-rose-50 pb-3 flex-wrap gap-2">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-mono">
                        {language === 'zh' ? `已扫描 EAN/UPC 条码: ${barcodeResult.code}` : language === 'es' ? `CÓDIGO EAN/UPC ESCANEADO: ${barcodeResult.code}` : `SCANNED EAN/UPC CODE: ${barcodeResult.code}`}
                      </span>
                      <h4 className="font-bold text-sm text-slate-800 mt-1 flex items-center gap-1.5">
                        <Check className="text-emerald-500" size={16} />
                        {barcodeResult.name}
                      </h4>
                    </div>

                    <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold border flex items-center gap-1 ${
                      barcodeResult.p_rating === 'Safe' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                      barcodeResult.p_rating === 'Moderate' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                      'bg-rose-50 text-rose-700 border-rose-100'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        barcodeResult.p_rating === 'Safe' ? 'bg-emerald-500' :
                        barcodeResult.p_rating === 'Moderate' ? 'bg-amber-500' : 'bg-rose-500'
                      }`} />
                      {language === 'zh' ? '嘌呤评级: ' : language === 'es' ? 'Nivel: ' : 'purine rating: '}{barcodeResult.p_rating}
                    </div>
                  </div>

                  <div className="text-xs space-y-3">
                    <div className="bg-slate-50/70 p-3.5 rounded-2xl text-slate-700 border border-slate-100/50">
                      <span className="font-bold text-slate-900 flex items-center gap-1 mb-1 text-[11px]">
                        <HelpCircle className="text-slate-400" size={14} />
                        {language === 'zh' ? '分子分解机制:' : language === 'es' ? 'Desglose Molecular:' : 'Molecular Breakdown:'}
                      </span>
                      <p className="leading-relaxed text-slate-600 font-sans">{barcodeResult.why}</p>
                      {barcodeResult.mgPer100g !== undefined && barcodeResult.mgPer100g > 0 && (
                        <p className="mt-1.5 text-[10px] font-mono text-slate-400 font-bold">
                          {language === 'zh' ? `嘌呤浓度: 每 100g 份量含 ${barcodeResult.mgPer100g}mg` : language === 'es' ? `Concentración de Purinas: ${barcodeResult.mgPer100g}mg por 100g` : `Purine Concentration: ${barcodeResult.mgPer100g}mg per 100g serving`}
                        </p>
                      )}
                    </div>

                    {/* Specific Safety tips */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        {language === 'zh' ? '痛风安全指引' : language === 'es' ? 'Guía de Seguridad para la Gota' : 'Gout Safety Guidance'}
                      </span>
                      <ul className="space-y-1.5 pl-0">
                        {barcodeResult.safetyTips && barcodeResult.safetyTips.map((tip: string, idx: number) => (
                          <li key={idx} className="text-xs text-slate-600 flex items-start gap-1.5">
                            <ShieldCheck className="text-emerald-500 shrink-0 mt-0.5" size={14} />
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Low purine alternatives */}
                    <div className="space-y-2 pt-2 border-t border-slate-50">
                      <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">
                        {language === 'zh' ? '推荐的低嘌呤安全替代品' : language === 'es' ? 'Reemplazos Bajos en Purinas Recomendados' : 'Recommended Low-Purine Replacements'}
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {barcodeResult.lowPurineAlternatives && barcodeResult.lowPurineAlternatives.map((alt: string, idx: number) => (
                          <div key={idx} className="p-2.5 bg-emerald-50/50 border border-emerald-100 text-center text-[11px] font-bold text-emerald-800 rounded-xl">
                            {alt}
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      )}

      {/* Medical Disclaimer Banner */}
      <div className="bg-slate-50 border border-slate-200/60 p-4 rounded-2xl flex items-start gap-3 mt-6">
        <AlertTriangle className="text-slate-400 shrink-0 mt-0.5" size={16} />
        <div className="text-[11px] text-slate-500 leading-normal font-sans">
          <strong className="text-slate-700 font-bold block mb-0.5 font-sans">
            ⚖️ {language === 'zh' ? '医学验证与临床安全警示' : language === 'es' ? 'Aviso de Verificación Médica y Seguridad Clínica' : 'Medical Verification & Clinical Safety Warning'}
          </strong>
          {language === 'zh'
            ? '所有扫描的食物索引和 AI 分析输出仅供教育参考，属于辅助膳食管理。提供的嘌呤水平和建议不能替代首诊风湿病学诊断、临床建议或处方药物治疗（如别嘌醇）。请遵医嘱进行健康管理。'
            : language === 'es'
            ? 'Todos los índices de alimentos escaneados y análisis de IA son solo para orientación educativa. Los niveles de purinas y sugerencias no sustituyen diagnósticos médicos ni tratamientos prescritos (como Alopurinol).'
            : 'All scanned food indexes and AI analysis outputs are for educational guidance only and represent supportive dietary care. The purine levels and suggestions provided cannot replace primary rheumatological diagnostics, clinical advice, or prescribed pharmaceutical treatments (such as Allopurinol). Observe strain labels closely for probiotics and seek a doctor\'s review.'}
        </div>
      </div>

      {/* Embedded Global CSS Keyframe Animations for Laser scanline effect */}
      <style>{`
        @keyframes laser-swipe {
          0% { top: 4%; }
          50% { top: 94%; }
          100% { top: 4%; }
        }
      `}</style>

    </div>
  );
}

// Inline rating helper for success result
function etRatingStyles(rating: 'Safe' | 'Moderate' | 'High') {
  switch (rating) {
    case 'Safe':
      return 'bg-emerald-950/40 border-emerald-900/50 text-emerald-400';
    case 'Moderate':
      return 'bg-amber-950/40 border-amber-900/50 text-amber-400';
    case 'High':
      return 'bg-rose-950/40 border-rose-900/50 text-rose-400';
  }
}
