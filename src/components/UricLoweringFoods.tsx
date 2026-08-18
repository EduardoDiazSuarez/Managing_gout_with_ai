import React, { useState, FormEvent } from 'react';
import { Leaf, Plus, Check, Trash2, Info, Sparkles, AlertCircle, BookOpen, Utensils, Heart, Calendar } from 'lucide-react';
import { NaturalFood } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

interface UricLoweringFoodsProps {
  naturalFoods: NaturalFood[];
  onAddNaturalFood: (food: Omit<NaturalFood, 'id' | 'takenDates'>) => void;
  onToggleFoodTaken: (id: string, dateStr: string) => void;
  onDeleteNaturalFood: (id: string) => void;
}

export default function UricLoweringFoods({
  naturalFoods,
  onAddNaturalFood,
  onToggleFoodTaken,
  onDeleteNaturalFood,
}: UricLoweringFoodsProps) {
  const { language, t } = useLanguage();
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [servingSize, setServingSize] = useState('');
  const [frequency, setFrequency] = useState<'Daily' | 'During Active Flares' | 'Occasional Maintenance'>('Daily');
  const [category, setCategory] = useState<'Fruit' | 'Vegetable' | 'Beverage' | 'Dairy' | 'Herbal/Seasoning' | 'Other'>('Fruit');
  const [mechanism, setMechanism] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedStrains, setSelectedStrains] = useState<string[]>([]);

  const todayStr = new Date().toISOString().split('T')[0];

  const handleToggleStrain = (id: string) => {
    setSelectedStrains((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const getYogurtVerdict = () => {
    if (selectedStrains.length === 0) {
      return {
        status: 'idle',
        title: language === 'zh' ? '等待选择菌株进行评估' : language === 'es' ? 'Auditoría en Espera' : 'Audit Awaiting Input',
        text: language === 'zh' ? '请勾选酸奶包装配料表上标注的益生菌菌株，以进行临床嘌呤与肾脏负荷评估。' : language === 'es' ? 'Selecciona las cepas probióticas en el empaque de tu yogur para auditar la carga renal.' : 'Select the probiotic strains listed on your yogurt packaging to run a clinical purine-loading audit.',
        colorClass: 'text-slate-400 border-slate-800 bg-slate-900/50',
        badgeClass: 'bg-slate-800 text-slate-400'
      };
    }

    const hasAvoidStrains = selectedStrains.some((s) => {
      const strain = PROBIOTIC_STRAINS.find((ps) => ps.id === s);
      return strain && strain.type === 'avoid';
    });

    if (hasAvoidStrains) {
      return {
        status: 'avoid',
        title: language === 'zh' ? '🔴 增加肾脏负荷（需避开）' : language === 'es' ? '🔴 Carga Renal Elevada (Evitar)' : '🔴 Renal-Loading (Avoid)',
        text: language === 'zh' ? '警告：该产品含有干酪乳杆菌 (L. casei) 或副干酪乳杆菌 (L. paracasei)，临床研究提示可能干扰肾小管尿酸排泄，增加肾脏滤过负荷。' : language === 'es' ? 'Advertencia: Contiene cepas (L. casei o L. paracasei) que pueden aumentar la carga de filtración en los riñones.' : 'Warning: This product contains strain markers (L. casei or L. paracasei) which are shown to place excess filtration load on kidneys, potentially increasing cumulative serum uric acid.',
        colorClass: 'text-rose-400 border-rose-900/40 bg-rose-950/20',
        badgeClass: 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
      };
    }

    return {
      status: 'safe',
      title: language === 'zh' ? '🟢 痛风安全菌种酸奶' : language === 'es' ? '🟢 Yogur Seguro para Gota' : '🟢 Gout-Safe Starter Yogurt',
      text: language === 'zh' ? '审核通过：仅含安全有益的基础发酵菌种（保加利亚乳杆菌、嗜热链球菌等），有助代谢嘌呤、改善肠道并促进肾脏尿酸清除。请选择低脂且无添加果糖/白糖的产品。' : language === 'es' ? 'Aprobado: Solo contiene cultivos seguros que metabolizan purinas y favorecen la eliminación de ácido úrico. Asegúrate de que sea desnatado y sin azúcar.' : 'Approved: Contains only safe, beneficial starter cultures that metabolize purines, aid digestion, and support renal clearing of uric acid. Ensure it is low-fat and has no added fructose or sugar.',
      colorClass: 'text-emerald-400 border-emerald-900/40 bg-emerald-950/20',
      badgeClass: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
    };
  };

  const verdict = getYogurtVerdict();


  // Raw educational foods database
  const SUPERFOODS_REFERENCE = language === 'zh' ? [
    {
      name: '新鲜芹菜原汁',
      category: 'Vegetable' as const,
      servingSize: '240ml~350ml 无糖鲜榨芹菜汁',
      frequency: 'Daily' as const,
      mechanism: '温和天然植物利尿成分，增加肾脏水负荷排泄量，加速关节末梢微小尿酸结晶冲刷。',
      notes: '富含木犀草素(Luteolin)，细胞实验显示其可抑制关节组织NF-kB关节炎炎症通路。',
    },
    {
      name: '无糖纯柠檬汁',
      category: 'Beverage' as const,
      servingSize: '1~2汤匙（约15-30毫升）鲜榨纯汁加水',
      frequency: 'Daily' as const,
      mechanism: '提供丰富维生素C与天然柠檬酸，有助于碱化尿液pH值，促进尿酸盐微结晶溶解。',
      notes: '避免加糖或高果糖糖浆，可在清晨空腹温水冲服。',
    },
    {
      name: '传统无糖原味低脂酸奶',
      category: 'Dairy' as const,
      servingSize: '1盒（约150克）',
      frequency: 'Daily' as const,
      mechanism: '低脂乳蛋白促进肾脏尿酸排泄。特定发酵菌株（保加利亚乳杆菌、嗜热链球菌等）在肠道内辅助分解食物嘌呤。',
      notes: '选择配料干净、无添加糖的传统酸奶；避开以干酪乳杆菌为主的发酵乳。',
    },
    {
      name: '纯可可粉 / 85%+ 特纯黑巧克力',
      category: 'Other' as const,
      servingSize: '1-2汤匙纯粉 或 30克85%+黑巧',
      frequency: 'Daily' as const,
      mechanism: '富含多酚类超强抗氧化剂，减轻尿酸沉积在关节处引发的炎性细胞因子级联反应。',
      notes: '必须确保无添加果糖，因高果糖会剧烈加速ATP降解合成尿酸。',
    },
    {
      name: '蒸烤红薯 / 甜薯',
      category: 'Vegetable' as const,
      servingSize: '1个中等大小（约150克）',
      frequency: 'Daily' as const,
      mechanism: '碱性优质碳水化合物，富含维生素C与高钾元素，天然促进肾脏排酸。',
      notes: '营养密集的健康主食，完美替代精制白面包或重油重糖主食。',
    },
    {
      name: '熟黑芝麻 / 纯芝麻粒',
      category: 'Other' as const,
      servingSize: '1~2汤匙（约15克）',
      frequency: 'Daily' as const,
      mechanism: '低嘌呤优质脂肪，富含芝麻素(Sesamin)，有助于降低发炎组织的氧化应激与水肿。',
      notes: '可撒在沙拉或红薯泥上食用，提供有益不饱和脂肪酸与镁元素。',
    },
    {
      name: '姜黄生姜热饮',
      category: 'Herbal/Seasoning' as const,
      servingSize: '1杯热茶 或 30ml浓缩液',
      frequency: 'During Active Flares' as const,
      mechanism: '天然抑制COX-2环氧化酶与促炎细胞因子，缓解红肿热痛。',
      notes: '急性微晶沉积发作期的天然辅助舒缓饮品，建议加入少许黑胡椒粉以提升姜黄素吸收率。',
    },
    {
      name: '新鲜黄瓜',
      category: 'Vegetable' as const,
      servingSize: '1根中等黄瓜（切片）',
      frequency: 'Daily' as const,
      mechanism: '含水量高达95%的天然弱碱性蔬菜，辅助补水排酸，低热量低升糖。',
      notes: '适合作为下午加餐或代餐配菜。',
    },
    {
      name: '足量纯净温水',
      category: 'Beverage' as const,
      servingSize: '每次250ml，每日8-10次',
      frequency: 'Daily' as const,
      mechanism: '防止尿液过分浓缩，维持尿酸在水溶液中的溶解度，杜绝结晶析出。',
      notes: '最基础也最被临床强力证实的排酸手段。保持尿液清亮或极浅黄色为佳。',
    },
  ] : language === 'es' ? [
    {
      name: 'Zumo de Apio Fresco',
      category: 'Vegetable' as const,
      servingSize: '240ml a 350ml de zumo sin azúcar',
      frequency: 'Daily' as const,
      mechanism: 'Actúa como diurético natural suave optimizando el volumen renal y el lavado de microcristales.',
      notes: 'Contiene luteolina, que según estudios amortigua las vías inflamatorias NF-kB articulares.',
    },
    {
      name: 'Zumo de Limón Puro',
      category: 'Beverage' as const,
      servingSize: '1 a 2 cucharadas (15-30ml) recién exprimido',
      frequency: 'Daily' as const,
      mechanism: 'Aporta vitamina C y ácido cítrico orgánico que alcalinizan la orina y disuelven uratos.',
      notes: 'El zumo sin endulzar evita la descomposición de ATP por fructosa mientras apoya el filtrado renal.',
    },
    {
      name: 'Yogur Tradicional Desnatado',
      category: 'Dairy' as const,
      servingSize: '1 tarrina (aprox 150g)',
      frequency: 'Daily' as const,
      mechanism: 'Las proteínas lácteas apoyan la eliminación renal. Los cultivos iniciadores ayudan a metabolizar purinas.',
      notes: 'Elige fermentos tradicionales sin azúcar; evita L. casei / L. paracasei.',
    },
    {
      name: 'Cacao Puro sin Azúcar',
      category: 'Other' as const,
      servingSize: '1-2 cucharadas de polvo o 30g chocolate 85%+',
      frequency: 'Daily' as const,
      mechanism: 'Rico en polifenoles que contrarrestan las citocinas inflamatorias en articulaciones.',
      notes: 'Asegúrate de que sea 100% sin azúcar; la fructosa eleva el ácido úrico.',
    },
    {
      name: 'Batata Asada',
      category: 'Vegetable' as const,
      servingSize: '1 batata mediana asada (aprox 150g)',
      frequency: 'Daily' as const,
      mechanism: 'Carbohidrato alcalinizante rico en vitamina C y potasio; favorece la excreción renal de urato.',
      notes: 'Excelente reemplazo para panes blancos o almidones refinados.',
    },
    {
      name: 'Semillas de Sésamo',
      category: 'Other' as const,
      servingSize: '1 a 2 cucharadas (aprox 15g)',
      frequency: 'Daily' as const,
      mechanism: 'Alimento bajo en purinas rico en sesamina, que reduce el estrés oxidativo en tejidos inflamados.',
      notes: 'Espolvorear en ensaladas; aporta magnesio y grasas saludables para la movilidad articular.',
    },
    {
      name: 'Elixir de Cúrcuma y Jengibre',
      category: 'Herbal/Seasoning' as const,
      servingSize: '1 taza de té caliente o 30ml de infusión',
      frequency: 'During Active Flares' as const,
      mechanism: 'Inhibe la enzima COX-2 y reduce la hinchazón por citocinas inflamatorias.',
      notes: 'Sustituto natural de soporte durante brotes de dolor. Tomar con una pizca de pimienta negra.',
    },
    {
      name: 'Pepino Hidratante',
      category: 'Vegetable' as const,
      servingSize: '1 pepino mediano en rodajas',
      frequency: 'Daily' as const,
      mechanism: 'Estructura alcalina con 95% de agua pura que ayuda a disolver precipitados de urato.',
      notes: 'Ideal como merienda de bajo índice glucémico que apoya la filtración renal.',
    },
    {
      name: 'Agua Pura de Bebida',
      category: 'Beverage' as const,
      servingSize: '250ml (1 vaso) - 8 a 10 veces al día',
      frequency: 'Daily' as const,
      mechanism: 'Evita que los riñones concentren la orina en exceso, manteniendo el ácido úrico disuelto.',
      notes: 'El método más comprobado. Mantén la orina clara o amarillo pálido.',
    },
  ] : [
    {
      name: 'Fresh Organic Celery Juice',
      category: 'Vegetable' as const,
      servingSize: '8oz to 12oz unsweetened juice',
      frequency: 'Daily' as const,
      mechanism: 'Acts as a mild natural botanical diuretic that optimizes renal water volume, driving joint-clearing crystalline flushing.',
      notes: 'Also containing luteolin, cell studies indicate it dampens inflammatory NF-kB arthritis pathways in joints.',
    },
    {
      name: 'Unsweetened Lemon Juice',
      category: 'Beverage' as const,
      servingSize: '1 to 2 tablespoons (approx. 15-30ml) fresh squeezed',
      frequency: 'Daily' as const,
      mechanism: 'Pure lemon juice provides abundant Vitamin C and organic citric acid to raise urine pH and help dissolve solid uric precipitates (Healthline Medically Reviewed)',
      notes: 'Unsweetened fresh juice avoids fructose-induced ATP breakdowns while supporting excellent uric filtration in kidneys.',
    },
    {
      name: 'Plain Traditional Yogurt (Low-Fat)',
      category: 'Dairy' as const,
      servingSize: '1 individual pot (approx 150g)',
      frequency: 'Daily' as const,
      mechanism: 'Low-fat plain traditional yogurt proteins support renal clearance. Starter cultures (L. bulgaricus, S. thermophilus, B. lactis, L. acidophilus) help metabolize purines. Avoid products where L. casei or L. paracasei are primary cultures or those with added sugars.',
      notes: 'Choose unsweetened, low-fat traditional starters and inspect labels for strain lists; avoid L. casei / L. paracasei.',
    },
    {
      name: 'Organic Unsweetened Cacao',
      category: 'Other' as const,
      servingSize: '1-2 tbsp pure powder or 1oz dark chocolate (85%+)',
      frequency: 'Daily' as const,
      mechanism: 'Packed with polyphenols and high-potency antioxidants that counteract inflammatory cytokine loops inside uric-lodged joints (PubMed).',
      notes: 'Ensure it is completely sugar-free or unsweetened, as fructose triggers ATP breakdown and elevates systemic uric acid numbers.',
    },
    {
      name: 'Roasted Batatas (Sweet Potatoes)',
      category: 'Vegetable' as const,
      servingSize: '1 medium baked sweet potato (approx 150g)',
      frequency: 'Daily' as const,
      mechanism: 'Highly alkaline carbohydrate source rich in Vitamin C and potassium. Vitamin C acts as a natural uricosuric, boosting renal urate excretion.',
      notes: 'An outstanding, nutrient-dense replacement for white breads or heavy refined starches (Mayo Clinic).',
    },
    {
      name: 'Organic Sesame Seeds',
      category: 'Other' as const,
      servingSize: '1 to 2 tablespoons (approx. 15g)',
      frequency: 'Daily' as const,
      mechanism: 'Low-purine food rich in organic sesamin—a lignan known to suppress oxidative stress and chronic fluid swelling in inflamed tissues (PubMed, 2024).',
      notes: 'Sprinkle on salads or mashed roasted batatas. Contain healthy fats and magnesium that support joint mobility.',
    },
    {
      name: 'Organic Turmeric & Ginger Elixir',
      category: 'Herbal/Seasoning' as const,
      servingSize: '1 mug hot tea or 1oz concentrated extract shot',
      frequency: 'During Active Flares' as const,
      mechanism: 'Blocks cyclooxygenase (COX-2) and highly suppresses inflammatory cytokine swelling in sore foot joints.',
      notes: 'Ideal substitute for NSAIDs during painful microcrystal swelling stages. Best taken with a pinch of black pepper.',
    },
    {
      name: 'Hydrating Cucumbers',
      category: 'Vegetable' as const,
      servingSize: '1 medium cucumber (sliced)',
      frequency: 'Daily' as const,
      mechanism: 'High-alkaline structure pairing 95% pure water volume helps flush solid uric acid precipitates and hydrate joints.',
      notes: 'Eat as a afternoon snack. Low glycemic index supports metabolic wellness and kidney filtration efficiency.',
    },
    {
      name: 'Pure Drinking Water (Flushing)',
      category: 'Beverage' as const,
      servingSize: '250ml (1 glass) - repeated 10x daily',
      frequency: 'Daily' as const,
      mechanism: 'Crucial to prevent kidneys from over-concentrating urine, keeping uric acid fully dissolved so it cannot crystallize.',
      notes: 'The simplest, most scientifically proven method. Keep urine light-straw or clear for total joint defense.',
    },
  ];

  const handleAddSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !servingSize.trim()) return;

    onAddNaturalFood({
      name: name.trim(),
      servingSize: servingSize.trim(),
      frequency,
      category,
      mechanism: mechanism.trim() || undefined,
      notes: notes.trim() || undefined,
    });

    setName('');
    setServingSize('');
    setMechanism('');
    setNotes('');
    setShowAddForm(false);
  };

  const handleApplySuperfoodPreset = (preset: typeof SUPERFOODS_REFERENCE[0]) => {
    setName(preset.name);
    setCategory(preset.category);
    setServingSize(preset.servingSize);
    setFrequency(preset.frequency);
    setMechanism(preset.mechanism);
    setNotes(preset.notes);
  };

  // Group default listed reference foods so user can quick-add them
  const isFoodTracked = (nameStr: string) => {
    return naturalFoods.some((f) => f.name.toLowerCase() === nameStr.toLowerCase());
  };

  return (
    <div className="space-y-6" id="uric_lowering_foods_container">
      {/* Educational Header Banner */}
      <div className="bg-gradient-to-r from-emerald-600/10 to-teal-600/5 rounded-3xl p-6 border border-emerald-500/10 flex flex-col md:flex-row md:items-center gap-6 justify-between">
        <div className="space-y-2">
          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold font-mono px-2.5 py-1 rounded-full uppercase tracking-wider block w-fit">
            {language === 'zh' ? '临床文献认证食疗' : language === 'es' ? 'Soluciones Clínicamente Documentadas' : 'Clinically Documented Solutions'}
          </span>
          <h1 className="font-sans font-bold text-2xl text-slate-800 flex items-center gap-2">
            <Leaf className="text-emerald-500 animate-pulse" size={24} />
            {language === 'zh' ? '降尿酸天然超级食物' : language === 'es' ? 'Superalimentos para Reducir Ácido Úrico' : 'Uric Acid-Lowering Superfoods'}
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
            {language === 'zh'
              ? '用安全、天然的植物性超级食物取代加工食品。这些天然成分能促进尿酸排泄、抑制关节红肿反应，并提供高浓度抗氧化防护。'
              : language === 'es'
              ? 'Reemplaza los ultraprocesados con superalimentos vegetales seguros. Estos ingredientes naturales promueven la excreción de urato y bloquean la inflamación articular.'
              : 'Replace processed remedies with safe, organic, plant-powered superfoods. These organic ingredients trigger uric excretion, block joint-swelling reactions, and supply high antioxidants.'}
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-5 py-3 rounded-xl transition shadow-md shadow-emerald-900/10 flex items-center justify-center gap-1.5 self-start cursor-pointer transition-all hover:scale-105"
          id="btn_toggle_add_food_form"
        >
          <Plus size={15} />
          {showAddForm
            ? (language === 'zh' ? '关闭表单' : language === 'es' ? 'Cancelar' : 'Cancel Form')
            : (language === 'zh' ? '添加自选食物' : language === 'es' ? 'Registrar Alimento' : 'Register Custom Food')}
        </button>
      </div>

      {/* Register Custom Food Form (Collapsible) */}
      {showAddForm && (
        <form
          onSubmit={handleAddSubmit}
          className="bg-white p-6 border border-slate-100 shadow-xs rounded-3xl animate-in fade-in slide-in-from-top-3 duration-200"
          id="add_natural_food_form"
        >
          <div className="flex items-center gap-2 pb-4 mb-4 border-b border-slate-50">
            <Sparkles className="text-emerald-500" size={18} />
            <h3 className="font-sans font-bold text-sm text-slate-700">
              {language === 'zh' ? '添加食物至日常追踪清单' : language === 'es' ? 'Añadir Alimento al Plan de Seguimiento' : 'Add Foods to Tracked Diet'}
            </h3>
          </div>

          <div className="mb-4">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2">
              {language === 'zh' ? '点击精选预设超级食物一键填入：' : language === 'es' ? 'Selecciona Superalimentos Predefinidos:' : 'Select Curated Superfood Presets to Auto-fill:'}
            </span>
            <div className="flex flex-wrap gap-2">
              {SUPERFOODS_REFERENCE.map((preset) => (
                <button
                  type="button"
                  key={preset.name}
                  onClick={() => handleApplySuperfoodPreset(preset)}
                  disabled={isFoodTracked(preset.name)}
                  className={`text-xs py-1.5 px-3 rounded-xl border transition text-left cursor-pointer flex items-center gap-1.5 ${
                    isFoodTracked(preset.name)
                      ? 'bg-slate-50 border-slate-100 text-slate-300 pointer-events-none'
                      : 'bg-white hover:bg-emerald-50 border-slate-200 text-slate-700 hover:border-emerald-300 hover:text-emerald-700 font-medium'
                  }`}
                >
                  {isFoodTracked(preset.name) ? '✓' : '+'} {preset.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1.5">
                {language === 'zh' ? '食物名称 *' : language === 'es' ? 'Nombre del Alimento *' : 'Superfood Name *'}
              </label>
              <input
                type="text"
                required
                placeholder={language === 'zh' ? '例如：酸樱桃浓缩汁' : language === 'es' ? 'ej. Concentrado de Cereza Ácida' : 'e.g. Tart Cherry Concentrate'}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-100 focus:bg-white focus:border-emerald-500 transition"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1.5">
                {language === 'zh' ? '建议每日份量 *' : language === 'es' ? 'Porción Diaria Sugerida *' : 'Suggested Daily Serving *'}
              </label>
              <input
                type="text"
                required
                placeholder={language === 'zh' ? '例如：1大杯、1碗、2汤匙' : language === 'es' ? 'ej. 1 vaso, 1 taza, 2 cucharadas' : 'e.g. 1 tall glass, 1 cup, 2 tbsp'}
                value={servingSize}
                onChange={(e) => setServingSize(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-100 focus:bg-white focus:border-emerald-500 transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1.5">
                {language === 'zh' ? '食物类别' : language === 'es' ? 'Categoría' : 'Food Category'}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-100 focus:bg-white focus:border-emerald-500 transition"
              >
                <option value="Fruit">{language === 'zh' ? '水果 / 浆果' : language === 'es' ? 'Fruta / Bayas' : 'Fruit / Berries'}</option>
                <option value="Vegetable">{language === 'zh' ? '蔬菜 / 绿叶菜' : language === 'es' ? 'Verdura / Vegetal' : 'Vegetable / Green'}</option>
                <option value="Beverage">{language === 'zh' ? '饮品 / 纯果汁' : language === 'es' ? 'Bebida / Zumo' : 'Beverage / Juice'}</option>
                <option value="Dairy">{language === 'zh' ? '乳制品益生菌' : language === 'es' ? 'Lácteo Probiótico' : 'Dairy Probiotic'}</option>
                <option value="Herbal/Seasoning">{language === 'zh' ? '草本 / 活性香料' : language === 'es' ? 'Hierba / Especia' : 'Herbal / Active Spice'}</option>
                <option value="Other">{language === 'zh' ? '其他有益食物' : language === 'es' ? 'Otros Beneficiosos' : 'Other Beneficial'}</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-bold text-slate-500 block mb-1.5">
                {language === 'zh' ? '建议食用频次' : language === 'es' ? 'Frecuencia Objetivo' : 'Target Frequency'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Daily', 'During Active Flares', 'Occasional Maintenance'] as const).map((freq) => (
                  <button
                    type="button"
                    key={freq}
                    onClick={() => setFrequency(freq)}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold transition cursor-pointer text-center ${
                      frequency === freq
                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {freq === 'Daily'
                      ? (language === 'zh' ? '每日坚持' : language === 'es' ? 'Diario' : 'Daily')
                      : freq === 'During Active Flares'
                      ? (language === 'zh' ? '急性发作期' : language === 'es' ? 'En Brote Activo' : 'Active Flare Use')
                      : (language === 'zh' ? '日常维持' : language === 'es' ? 'Mantenimiento' : 'Occasional Maintenance')}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label className="text-xs font-bold text-slate-500 block mb-1.5">
              {language === 'zh' ? '降尿酸科学机制说明' : language === 'es' ? 'Mecanismo Científico (Cómo reduce el ácido úrico)' : 'Scientific Mechanism (How it helps lower Uric Acid)'}
            </label>
            <input
              type="text"
              placeholder={language === 'zh' ? '例如：抑制黄嘌呤氧化酶合成，显著促进尿液排酸...' : language === 'es' ? 'ej. Inhibe la síntesis de xantina oxidasa, aumenta la eliminación urinaria...' : 'e.g. Inhibits xanthine oxidase synthesis, highly increases urinary clearings...'}
              value={mechanism}
              onChange={(e) => setMechanism(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-100 focus:bg-white focus:border-emerald-500 transition"
            />
          </div>

          <div className="mb-5">
            <label className="text-xs font-bold text-slate-500 block mb-1.5">
              {language === 'zh' ? '食用提示 / 个人备忘' : language === 'es' ? 'Pautas de Uso / Recordatorio Personal' : 'Usage Guidelines / Personal Reminder'}
            </label>
            <textarea
              placeholder={language === 'zh' ? '例如：清晨空腹鲜榨温水冲服...' : language === 'es' ? 'ej. Exprimir fresco en ayunas por la mañana...' : 'e.g. Squeeze fresh first thing in sensory morning on active empty stomach'}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-100 focus:bg-white focus:border-emerald-500 transition resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm py-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 hover:shadow-md hover:shadow-emerald-950/10"
          >
            <Check size={16} /> {language === 'zh' ? '保存至超级食物追踪清单' : language === 'es' ? 'Guardar Superalimento en la Lista' : 'Save Superfood to Watchlist'}
          </button>
        </form>
      )}

      {/* Main Split Layout: Left Is Checklist, Right Is Scientific Resource Directory */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Col: Daily Checkoff Journal (60% equivalent) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs relative">
            <div className="flex items-center justify-between mb-5 border-b border-slate-50 pb-4">
              <div>
                <h2 className="font-sans font-bold text-base text-slate-800 flex items-center gap-2">
                  <Utensils className="text-emerald-500" size={18} />
                  {language === 'zh' ? '我的超级食物摄入打卡清单' : language === 'es' ? 'Mi Registro Diario de Superalimentos' : 'My Superfoods Intake Checklist'}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {language === 'zh' ? '勾选今日已摄入项，培养防御性饮食好习惯' : language === 'es' ? 'Marca los alimentos consumidos hoy para registrar tus hábitos' : 'Check off items consumed today to log defensive eating habits'}
                </p>
              </div>
              <span className="text-[10px] bg-slate-100 border border-slate-200 font-bold font-mono px-2 py-0.5 rounded-md text-slate-600">
                {language === 'zh' ? '日期' : language === 'es' ? 'FECHA' : 'DATE'}: {todayStr}
              </span>
            </div>

            {naturalFoods.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-2xl flex flex-col items-center justify-center max-w-md mx-auto">
                <Leaf className="text-slate-300 stroke-1 mb-2 animate-bounce" size={40} />
                <h4 className="text-xs font-bold text-slate-600">
                  {language === 'zh' ? '尚未追踪任何超级食物' : language === 'es' ? 'No hay superalimentos registrados aún' : 'No tracked superfoods yet'}
                </h4>
                <p className="text-[11px] text-slate-400 mt-1 text-center max-w-xs leading-relaxed px-4">
                  {language === 'zh'
                    ? '使用上方预设模板或自定义食物进行添加。持续摄入天然排酸降酸食材，为关节构筑长效防线！'
                    : language === 'es'
                    ? 'Registra algunos alimentos usando las plantillas o tus propios criterios. ¡El seguimiento refuerza la defensa articular!'
                    : 'Register some foods using the templates or your own diet criteria above. Tracking natural uric acid cleansers reinforces clean joint defense!'}
                </p>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="mt-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold text-[11px] px-3.5 py-2 rounded-lg transition"
                >
                  {language === 'zh' ? '打开预设清单' : language === 'es' ? 'Abrir Plantillas Rápidas' : 'Quick Launch Presets Window'}
                </button>
              </div>
            ) : (
              <div className="space-y-3" id="superfoods_checklist_list">
                {naturalFoods.map((food) => {
                  const isTakenToday = food.takenDates.includes(todayStr);
                  
                  // Compute streak count
                  const lastDaysStreak = computeStreak(food.takenDates);
                  
                  return (
                    <div
                      key={food.id}
                      className={`p-4 rounded-2xl border transition-all flex items-start gap-3 justify-between ${
                        isTakenToday
                          ? 'border-emerald-100 bg-emerald-50/10'
                          : 'border-slate-100 bg-white hover:border-slate-200'
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="text-sm font-bold text-slate-800 truncate">{food.name}</h4>
                          <span className="text-[9px] font-bold font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                            {food.servingSize}
                          </span>
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-100">
                            {food.category}
                          </span>
                        </div>

                        {food.mechanism && (
                          <p className="text-[11px] text-slate-500 mt-1 lines-clamp-2 leading-relaxed">
                            <span className="font-semibold text-slate-700">{language === 'zh' ? '作用：' : language === 'es' ? 'Acción:' : 'Action:'}</span> {food.mechanism}
                          </p>
                        )}

                        <div className="mt-2 flex items-center gap-3 text-[10px] text-slate-400">
                          {food.frequency && (
                            <span>
                              🎯 {language === 'zh' ? '频次：' : 'Freq: '}<span className="font-semibold text-slate-600">{food.frequency}</span>
                            </span>
                          )}
                          {lastDaysStreak > 0 && (
                            <span className="text-orange-600 font-semibold flex items-center gap-0.5">
                              🔥 {language === 'zh' ? `连续打卡：${lastDaysStreak} 天` : language === 'es' ? `Racha: ${lastDaysStreak} ${lastDaysStreak === 1 ? 'día' : 'días'}` : `Streak: ${lastDaysStreak} ${lastDaysStreak === 1 ? 'day' : 'days'}`}
                            </span>
                          )}
                          {food.notes && (
                            <span className="italic overflow-hidden text-ellipsis truncate block">
                              📝 {food.notes}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 self-center shrink-0">
                        <button
                          onClick={() => onToggleFoodTaken(food.id, todayStr)}
                          className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold select-none cursor-pointer transition ${
                            isTakenToday
                              ? 'bg-emerald-600 text-white shadow-xs hover:bg-emerald-500'
                              : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800'
                          }`}
                          id={`btn_log_consume_${food.id}`}
                        >
                          <Check size={13} className={isTakenToday ? 'stroke-[3px]' : ''} />
                          {isTakenToday
                            ? (language === 'zh' ? '今日已打卡' : language === 'es' ? 'Consumido' : 'Consumed')
                            : (language === 'zh' ? '打卡食用' : language === 'es' ? 'Registrar' : 'Log Daily')}
                        </button>
                        
                        <button
                          onClick={() => {
                            if (confirm(language === 'zh' ? '确定要从追踪清单中移除此食物吗？' : language === 'es' ? '¿Seguro que deseas eliminar este superalimento?' : 'Are you sure you want to delete this tracked superfood?')) {
                              onDeleteNaturalFood(food.id);
                            }
                          }}
                          className="text-slate-300 hover:text-rose-500 p-2 rounded-lg hover:bg-slate-50 transition cursor-pointer"
                          title={language === 'zh' ? '删除食物' : language === 'es' ? 'Eliminar alimento' : 'Remove superfood tracker'}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Science Resource Directory (40% equivalent) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 text-slate-100 rounded-3xl p-6 border border-slate-800 shadow-sm">
            <h2 className="font-sans font-bold text-base text-white flex items-center gap-2 mb-4">
              <BookOpen className="text-emerald-400" size={18} />
              {language === 'zh' ? '弱碱化与酶抑制食疗科学原理解析' : language === 'es' ? 'La Ciencia de Alimentos Alcalinos e Inhibidores' : 'The Science of Alkaline & Inhibitor Foods'}
            </h2>

            <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
              <div className="bg-slate-800/50 p-3 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-emerald-400 uppercase font-bold text-[9px] tracking-wider block">
                  {language === 'zh' ? '黄嘌呤氧化酶抑制剂' : 'Xanthine Oxidase Inhibitors'}
                </span>
                <p>
                  {language === 'zh'
                    ? '特定天然化合物（如酸樱桃中的花青素、黑咖啡中的绿原酸多酚）能靶向结合肝脏中的黄嘌呤氧化酶（催化嘌呤生成尿酸的核心酶），温和减缓体内尿酸合成速率。'
                    : language === 'es'
                    ? 'Compuestos como las antocianinas de las cerezas ácidas o polifenoles del café interactúan con la xantina oxidasa hepática, reduciendo la velocidad de síntesis de ácido úrico.'
                    : 'Certain natural compounds, notably anthocyanins in Montmorency cherries and chlorogenic polyphenols in black coffee, physically interact with xanthine oxidase, the primary liver enzyme that converts purines into uric acid. By reducing active synthesis speed, they emulate a gentle, pharmacological lock on uric spikes.'}
                </p>
              </div>

              <div className="bg-slate-800/50 p-3 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-blue-400 uppercase font-bold text-[9px] tracking-wider block">
                  {language === 'zh' ? '体液碱化与结晶溶解' : 'Alkalization & Crystal Dissolution'}
                </span>
                <p>
                  {language === 'zh'
                    ? '尿酸溶解度对体液pH极度敏感。在强酸性环境（pH < 5.5）下，尿酸极易结晶并沉积在远端关节（如大脚趾）。摄入有机柠檬汁（代谢后呈碱性）和充足纯水可提高尿液pH值，促进结晶溶解排出。'
                    : language === 'es'
                    ? 'La solubilidad del ácido úrico depende del pH. En medios ácidos (pH < 5.5), los cristales precipitan fácilmente en dedos y pies. El zumo de limón y el agua alcalinizan y ayudan a disolverlos.'
                    : 'Uric acid solubility is immensely sensible to body fluid pH. In highly acidic environments (pH < 5.5), sodium urate crystals shape and lodge freely in slow-flow joint areas, like the toes. Consuming alkaline-forming elements such as organic lemon juice or high water volume hydrates the system and boosts pH, promoting natural crystal dissolution.'}
                </p>
              </div>

              <div className="bg-slate-800/50 p-3 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-teal-400 uppercase font-bold text-[9px] tracking-wider block">
                  {language === 'zh' ? '促进肾脏排泄（促尿酸排泄因子）' : 'Renal Elimination (Uricosurics)'}
                </span>
                <p>
                  {language === 'zh'
                    ? '富含天然维生素C（如柑橘、草莓）和低脂乳蛋白的食物能刺激肾小球滤过率，减少肾小管对尿酸的重吸收，加速尿酸随尿液排出体外。'
                    : language === 'es'
                    ? 'Alimentos ricos en vitamina C natural y proteínas lácteas estimulan las nefronas renales, reduciendo la reabsorción tubular y acelerando la eliminación de uratos.'
                    : 'Superfoods containing rich natural Vitamin C (such as strawberries and high-grade citrus fruits) and milk-derived proteins stimulate the kidney nephrons. This enhances filtration efficiency and diminishes renal tubule absorption, accelerating the physical disposal of excess uric acid in our urine output.'}
                </p>
              </div>

              <div className="flex items-start gap-2 bg-emerald-900/20 p-3.5 rounded-2xl border border-emerald-500/20 text-emerald-300 text-[11px]">
                <Info size={14} className="shrink-0 mt-0.5 text-emerald-400" />
                <span>
                  <strong>{language === 'zh' ? '温馨提示：' : language === 'es' ? 'Consejo: ' : 'Tip: '}</strong>
                  {language === 'zh'
                    ? '保持平稳摄入量，切忌一次性暴饮暴食所谓“降酸神物”（如一口气饮用大量浓缩柠檬汁），过快波动的血尿酸可能诱发溶晶痛。循序渐进才是正道！'
                    : language === 'es'
                    ? 'Mantén un consumo constante y moderado. Las fluctuaciones bruscas de ácido úrico pueden desprender cristales de forma abrupta y provocar brotes.'
                    : 'Maintain a stable intake volume. Drastic diet fluctuations might alter localized blood chemistry too rapidly, which can trigger crystals to shed from bone tissue and spark flares. Keep routines moderate and consistent!'}
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Probiotic Yogurt Strain Checker */}
          <div className="bg-slate-900 text-slate-100 rounded-3xl p-6 border border-slate-800 shadow-sm space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <span className="bg-violet-900/30 text-violet-300 text-[9px] font-bold font-mono px-2.5 py-1 rounded-full border border-violet-500/20 uppercase tracking-wider block w-fit mb-1.5">
                {language === 'zh' ? '酸奶益生菌专研' : language === 'es' ? 'Experto en Yogur Clínico' : 'Clinical Yogurt Expert'}
              </span>
              <h3 className="font-sans font-bold text-sm text-white flex items-center gap-2">
                <Leaf className="text-emerald-400" size={16} />
                {language === 'zh' ? '酸奶菌株嘌呤安全性审计' : language === 'es' ? 'Auditor de Cepas Probióticas' : 'Probiotic Strain Auditor'}
              </h3>
              <p className="text-[11px] text-slate-400 mt-1">
                {language === 'zh'
                  ? '选择包装上的菌种，分析其对肾脏负荷及嘌呤代谢的真实影响。'
                  : language === 'es'
                  ? 'Selecciona las cepas del envase para auditar la carga renal y la seguridad.'
                  : 'Select the strains listed on your yogurt packaging to audit renal-loading and purine safety.'}
              </p>
            </div>

            {/* Strains selection grid */}
            <div className="space-y-2">
              {PROBIOTIC_STRAINS.map((strain) => {
                const isSelected = selectedStrains.includes(strain.id);
                return (
                  <button
                    key={strain.id}
                    type="button"
                    onClick={() => handleToggleStrain(strain.id)}
                    className={`w-full p-2.5 rounded-xl border text-left transition select-none flex gap-2 items-start cursor-pointer ${
                      isSelected
                        ? strain.type === 'safe'
                          ? 'bg-emerald-950/20 border-emerald-700/60 text-emerald-300'
                          : 'bg-rose-950/20 border-rose-700/60 text-rose-300'
                        : 'bg-slate-800/40 border-slate-800 hover:bg-slate-800/80 text-slate-300'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-md flex items-center justify-center shrink-0 border mt-0.5 ${
                      isSelected
                        ? strain.type === 'safe'
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'bg-rose-600 border-rose-600 text-white'
                        : 'bg-slate-900 border-slate-700 text-transparent'
                    }`}>
                      {isSelected && <Check size={10} className="stroke-[3px]" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <span className="font-mono text-[11px] font-bold italic">{strain.name}</span>
                        <span className={`text-[8px] uppercase tracking-wider font-extrabold px-1.5 py-0.2 rounded ${
                          strain.type === 'safe' 
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-900/50' 
                            : 'bg-rose-950 text-rose-400 border border-rose-900/50'
                        }`}>
                          {strain.type === 'safe' ? (language === 'zh' ? '推荐' : 'safe') : (language === 'zh' ? '避开' : 'avoid')}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1 leading-normal">
                        {language === 'zh' ? strain.descZh : language === 'es' ? strain.descEs : strain.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Verdict Display */}
            <div className={`p-4 rounded-2xl border transition-all ${verdict.colorClass}`}>
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs">{verdict.title}</h4>
                {verdict.status !== 'idle' && (
                  <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full ${verdict.badgeClass}`}>
                    {verdict.status === 'safe'
                      ? (language === 'zh' ? '痛风安全认证' : language === 'es' ? 'Aprobado Gota' : 'Gout-Approved')
                      : (language === 'zh' ? '高肾脏负荷' : language === 'es' ? 'Carga Renal Alta' : 'High Renal Load')}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-300 mt-1.5 leading-relaxed">{verdict.text}</p>
            </div>

            {/* Add to checklist shortcut */}
            {verdict.status === 'safe' && (
              <button
                type="button"
                onClick={() => {
                  const yogurtName = language === 'zh' ? '传统无糖原味低脂酸奶' : language === 'es' ? 'Yogur Tradicional Desnatado' : 'Plain Traditional Yogurt (Low-Fat)';
                  if (isFoodTracked(yogurtName)) {
                    alert(language === 'zh' ? '传统酸奶已在您的追踪清单中！' : language === 'es' ? '¡El yogur ya está en tu lista de seguimiento!' : 'Plain Traditional Yogurt (Low-Fat) is already in your superfoods watchlist!');
                    return;
                  }
                  onAddNaturalFood({
                    name: yogurtName,
                    servingSize: language === 'zh' ? '1盒（约150克）' : language === 'es' ? '1 tarrina (aprox 150g)' : '1 individual pot (approx 150g)',
                    category: 'Dairy',
                    frequency: 'Daily',
                    mechanism: language === 'zh' ? '低脂乳蛋白促进肾脏尿酸清除，安全发酵菌群在消化道辅助代谢食物嘌呤。' : 'Low-fat plain traditional yogurt proteins support renal clearance. Starter cultures help metabolize dietary purines in the GI tract.',
                    notes: language === 'zh' ? '菌种审核通过：安全发酵菌株。' : 'Probiotic strain audit completed: Verified safe.'
                  });
                }}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Plus size={13} /> {language === 'zh' ? '将痛风安全酸奶加入追踪清单' : language === 'es' ? 'Añadir Yogur Seguro a la Lista' : 'Add Gout-Safe Yogurt to Watchlist'}
              </button>
            )}
          </div>
        </div>

      </div>

      {/* Medical Disclaimer Banner */}
      <div className="bg-slate-50 border border-slate-200/60 p-4.5 rounded-3xl flex items-start gap-3 mt-6">
        <AlertCircle className="text-slate-400 shrink-0 mt-0.5" size={18} />
        <div className="text-xs text-slate-500 leading-normal">
          <strong className="text-slate-700 font-bold block mb-1 font-sans">
            {language === 'zh' ? '⚖️ 临床辅助支持免责声明' : language === 'es' ? '⚖️ Aviso de Atención Médica de Apoyo' : '⚖️ Clinical Supportive Care Disclaimer'}
          </strong>
          {language === 'zh'
            ? '本应用提供基于临床文献（Mayo Clinic、Healthline同行评审医学资料）的辅助生活方式与营养记录指南。食疗支持无法替代专科医疗诊断、风湿免疫科医生面诊及处方降尿酸药物（如别嘌醇、非布司他、秋水仙碱等）。若有任何急性痛风发作或用药疑问，请务必遵从执业医师指导。'
            : language === 'es'
            ? 'Esta aplicación proporciona pautas de atención de apoyo y registros nutricionales basados en evidencia (Mayo Clinic, revisiones médicas de Healthline). No reemplaza el tratamiento médico primario ni los medicamentos recetados (como Alopurinol o Colchicina). Consulta siempre a tu médico.'
            : 'This application provides supportive care guidelines, water targets, and evidence-based nutritional logs (Mayo Clinic, Healthline Medically Reviewed). This guidance is supportive and cannot replace primary medical treatment, clinical rheumatological examinations, or prescribed medications (such as Allopurinol or Colchicine). Always seek the advice of a qualified healthcare provider regarding any rheumatological condition or pharmacological plan.'}
        </div>
      </div>

    </div>
  );
}

// Simple helper to compute consecutive daily streaks
function computeStreak(dates: string[]): number {
  if (!dates || dates.length === 0) return 0;
  
  // Sort descending
  const sorted = [...new Set(dates)].sort((a,b) => new Date(b).getTime() - new Date(a).getTime());
  
  const today = new Date();
  today.setHours(0,0,0,0);
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  let currentWordStr = today.toISOString().split('T')[0];
  let yesterWordStr = yesterday.toISOString().split('T')[0];
  
  // If today isn't logged and yesterday isn't logged, streak is broken, but if yesterday was logged we can count from it
  if (!sorted.includes(currentWordStr) && !sorted.includes(yesterWordStr)) {
    return 0;
  }
  
  let count = 0;
  let cursor = sorted.includes(currentWordStr) ? today : yesterday;
  
  while (true) {
    const checkStr = cursor.toISOString().split('T')[0];
    if (sorted.includes(checkStr)) {
      count++;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }
  
  return count;
}

const PROBIOTIC_STRAINS = [
  {
    id: 'bulgaricus',
    name: 'Lactobacillus bulgaricus',
    type: 'safe' as const,
    desc: 'Approved classical starter. Establishes healthy gut flora and reduces purine metabolite absorption (PubMed, 2024).',
    descEs: 'Cultivo clásico aprobado. Establece flora intestinal sana y reduce la absorción de purinas.',
    descZh: '官方认证经典发酵原种。建立健康肠道菌群，减少消化道嘌呤吸收。',
  },
  {
    id: 'thermophilus',
    name: 'Streptococcus thermophilus',
    type: 'safe' as const,
    desc: 'Approved co-starter. Breaks down lactose and assists in lowering localized joint inflammatory markers.',
    descEs: 'Co-cultivo aprobado. Descompone la lactosa y ayuda a reducir marcadores inflamatorios articulares.',
    descZh: '推荐发酵共生菌株。高效分解乳糖，辅助降低关节炎症反应。',
  },
  {
    id: 'lactis',
    name: 'Bifidobacterium lactis',
    type: 'safe' as const,
    desc: 'Approved probiotic. Actively metabolizes dietary nucleosides and purines in the GI tract before absorption (PubMed).',
    descEs: 'Probiótico aprobado. Metaboliza nucleósidos y purinas dietéticas en el tracto digestivo antes de su absorción.',
    descZh: '有益双歧杆菌。在消化道吸收前主动分解核苷与膳食嘌呤。',
  },
  {
    id: 'acidophilus',
    name: 'Lactobacillus acidophilus',
    type: 'safe' as const,
    desc: 'Approved probiotic. Maintains low pH in intestines, shielding gut integrity and nutrient clearance.',
    descEs: 'Probiótico aprobado. Mantiene el pH intestinal óptimo, protegiendo la barrera intestinal.',
    descZh: '嗜酸乳杆菌。维持肠道微酸健康环境，保护肠道屏障完整性。',
  },
  {
    id: 'casei',
    name: 'Lactobacillus casei',
    type: 'avoid' as const,
    desc: 'AVOID / RENAL RISK: May interfere with organic anion transporters (OAT) in renal tubules, raising renal load (Healthline Medically Reviewed).',
    descEs: 'EVITAR / RIESGO RENAL: Puede interferir con transportadores en túbulos renales, aumentando la carga renal.',
    descZh: '避开 / 肾负荷风险：可能干扰肾小管有机阴离子转运体(OAT)，增加肾脏代谢负荷。',
  },
  {
    id: 'paracasei',
    name: 'Lactobacillus paracasei',
    type: 'avoid' as const,
    desc: 'AVOID / RENAL RISK: Can negatively alter purine clearance kinetics, placing high filtration demand on kidneys.',
    descEs: 'EVITAR / RIESGO RENAL: Puede alterar la cinética de eliminación de purinas, sobrecargando los riñones.',
    descZh: '避开 / 肾负荷风险：可能改变嘌呤清除动力学，增加肾脏滤过负担。',
  }
];

