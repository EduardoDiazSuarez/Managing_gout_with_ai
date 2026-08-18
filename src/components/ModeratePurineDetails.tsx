import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';

export default function ModeratePurineDetails() {
  const { language } = useLanguage();

  const guidance = language === 'zh' ? [
    '定义：中嘌呤食物（约 50–150毫克/100克）；其对血尿酸影响主要取决于食用分量与烹饪方式。',
    '临床作用：在严格控制份量、搭配低嘌呤蔬菜并保持充足水分的情况下，可以安全摄入。',
    '范例：白身鱼（鳕鱼、大比目鱼、罗非鱼、龙利鱼）、适量三文鱼、去皮鸡胸肉、豆类、蘑菇、燕麦片及豆腐。',
  ] : language === 'es' ? [
    'Definición: Alimentos con niveles moderados de purinas (≈50–150 mg/100g); el riesgo depende de la porción y preparación.',
    'Papel clínico: Seguros cuando se controlan las porciones y se acompañan con guarniciones bajas en purinas e hidratación.',
    'Ejemplos: Pescado blanco (bacalao, fletán, tilapia), salmón (porciones pequeñas), pechuga de pollo, legumbres, champiñones, avena y tofu.',
  ] : [
    'Definition: Foods with moderate purine levels (≈50–150 mg/100g); risk depends on portion and preparation.',
    'Clinical role: Safe when portion‑controlled and paired with low‑purine sides and hydration.',
    'Examples: White fish (cod, halibut, tilapia, flounder), salmon (small portions), chicken breast, legumes, mushrooms, oatmeal, and tofu.',
  ];

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs" id="moderate_purine_details_card">
      <h3 className="font-semibold text-lg mb-2 text-slate-800">
        {language === 'zh' ? '中等嘌呤食物 — 适量慎用与分量管理' : language === 'es' ? 'Alimentos Moderados en Purinas — Consumo con Precaución' : 'Moderate-Purine Foods — Use with Caution'}
      </h3>
      <p className="text-xs text-slate-500 mb-4 leading-relaxed">
        {language === 'zh'
          ? '中等嘌呤食物可纳入均衡饮食中，但需注意单次份量、食用频率及烹调方式，以避免血尿酸水平出现骤升。'
          : language === 'es'
          ? 'Los alimentos moderados en purinas pueden incluirse en dietas equilibradas, pero requieren atención al tamaño de la porción, frecuencia y método de cocción para evitar picos de urato sérico.'
          : 'Moderate-purine items can be included in balanced diets but require attention to portion size, frequency, and cooking method to avoid serum uric acid spikes.'}
      </p>

      <section className="mb-4">
        <h4 className="font-semibold text-sm mb-2 text-slate-700">
          {language === 'zh' ? '核心食用指导' : language === 'es' ? 'Guía práctica' : 'Practical guidance'}
        </h4>
        <ul className="list-disc pl-5 text-[13px] text-slate-600 space-y-2">
          {guidance.map((g, i) => (
            <li key={i}>{g}</li>
          ))}
        </ul>
      </section>

      <section className="mb-4">
        <h4 className="font-semibold text-sm mb-2 text-slate-700">
          {language === 'zh' ? '分量与食用频次参考' : language === 'es' ? 'Ejemplos de porción y frecuencia' : 'Portion & frequency examples'}
        </h4>
        <ul className="list-disc pl-5 text-[13px] text-slate-600 space-y-2">
          {language === 'zh' ? (
            <>
              <li>白身鱼（鳕鱼、罗非鱼、比目鱼）：每次 75–100克；低脂清淡蛋白质，建议清蒸或烘烤。</li>
              <li>深海鱼（三文鱼、金枪鱼）：每周仅1小份（75–100克）；避免油炸，优选清蒸/慢煎。</li>
              <li>去皮鸡胸肉：每次 75–100克；去皮白肉比深色肉或红肉的嘌呤负担明显偏低。</li>
              <li>豆类与豆腐：可作为健康植物蛋白经常食用 — 临床证据表明植物嘌呤极少诱发痛风发作。</li>
            </>
          ) : language === 'es' ? (
            <>
              <li>Pescado blanco (bacalao, tilapia, fletán): Porciones de 75–100 g; proteína magra recomendada al vapor o al horno.</li>
              <li>Pescado azul (salmón, atún): 1 porción pequeña (75–100 g) por semana; preferir a la plancha/vapor antes que frito.</li>
              <li>Pechuga de pollo: Porciones de 75–100 g; sin piel contiene menor carga de purinas que carnes rojas.</li>
              <li>Legumbres y tofu: Incluir con regularidad como proteína vegetal — las purinas vegetales tienen mínima correlación con brotes.</li>
            </>
          ) : (
            <>
              <li>White fish (cod, tilapia, halibut, flounder): 75–100 g portions; lean, low-fat protein option best steamed or baked.</li>
              <li>Fatty fish (salmon, tuna): 1 small serving (75–100 g) once weekly; prefer grilling/steaming over frying.</li>
              <li>Chicken breast: 75–100 g portions; skinless breast has lower purine burden than dark cuts or red meats.</li>
              <li>Legumes & tofu: include regularly as plant protein — plant purines show limited association with flares.</li>
            </>
          )}
        </ul>
      </section>

      <section className="mb-4">
        <h4 className="font-semibold text-sm mb-2 text-slate-700">
          {language === 'zh' ? '烹饪与解毒搭配' : language === 'es' ? 'Consejos de cocción y acompañamiento' : 'Cooking & pairing tips'}
        </h4>
        <p className="text-[13px] text-slate-600 leading-relaxed">
          {language === 'zh'
            ? '避免浓肉汤、老火汤或浓稠肉汁，这些会导致嘌呤高度浓缩。在摄入中嘌呤食物时，搭配富含维生素C的蔬菜（柠檬、彩椒）并大量饮水以助排泄。'
            : language === 'es'
            ? 'Evita caldos concentrados o salsas de carne espesas que concentran purinas. Añade acompañamientos ricos en vitamina C (limón, pimientos) e hidrátate abundantemente.'
            : 'Avoid concentrated broths, long reductions, or gravies that concentrate purines. Add vitamin C–rich sides (lemon, bell peppers) and hydrate well when consuming moderate items.'}
        </p>
      </section>

      <section>
        <h4 className="font-semibold text-sm mb-2 text-slate-700">
          {language === 'zh' ? '循证医学说明' : language === 'es' ? 'Evidencia y notas clínicas' : 'Evidence & notes'}
        </h4>
        <p className="text-[13px] text-slate-600 leading-relaxed">
          {language === 'zh'
            ? '大型流行病学研究证实，植物性嘌呤诱发痛风发作的概率远低于动物性嘌呤。保持适量原则，如有不确定可咨询临床营养师或医生。'
            : language === 'es'
            ? 'Grandes estudios epidemiológicos indican que las purinas vegetales tienen mucho menor riesgo que las animales. Mantén moderación y consulta con un especialista ante dudas.'
            : 'Large epidemiological studies indicate that plant-based purines are less likely to increase gout risk than animal purines. Maintain moderation and consult a clinician if uncertain.'}
        </p>
      </section>

      <div className="mt-4 text-xs text-slate-400">
        {language === 'zh' ? '数据来源：PubMed系统综述、Healthline、Cleveland Clinic。' : language === 'es' ? 'Fuentes: Revisiones sistemáticas de PubMed, Healthline, Cleveland Clinic.' : 'Sources: PubMed systematic reviews, Healthline, Cleveland Clinic.'}
      </div>
    </div>
  );
}

