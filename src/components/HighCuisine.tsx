import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';

export default function HighCuisine() {
  const { language } = useLanguage();

  const cookingBestPractices = language === 'zh' ? [
    '将肉类高汤与高嘌呤植物原料高汤分锅熬制，严禁合并浓缩。',
    '蛋白质采用快速烹调（快蒸、快烫），出锅时以清亮蔬菜清汤代替浓缩芡汁。',
    '避免长时间大火浓缩酱汁；浓缩高汤应稀释或弃用。',
    '烹饪过程中尽量减少酸化调料的投入；必要时在装盘时淋少许即可。',
    '若怀疑高汤中嘌呤已高度析出，应过滤并弃用焯水原汤。',
    '烹饪前严格去除禽肉外皮、骨髓及贝壳组织。',
    '控制蛋白质单次食用量，并搭配富含维生素C的蔬菜拼盘。',
  ] : language === 'es' ? [
    'Separa los caldos para proteínas animales y vegetales con purinas; no compartas líquidos concentrados.',
    'Usa métodos de cocción corta para proteínas y termina con caldo de verduras diluido en lugar de glaseados reducidos.',
    'Evita reducciones prolongadas; diluye o desecha caldos concentrados.',
    'Minimiza ingredientes ácidos durante la cocción; añade toques ácidos en el emplatado cuando sea necesario.',
    'Cuela y desecha los líquidos de escalfado si se sospecha concentración de purinas.',
    'Retira pieles, huesos y caparazones antes de cocinar.',
    'Sirve porciones moderadas acompañadas de guarniciones ricas en vitamina C.',
  ] : [
    'Separate stocks for animal proteins and high-purine plant ingredients; do not share concentrated liquids.',
    'Use short-cook methods for proteins and finish with diluted vegetable broth rather than reduced glazes.',
    'Avoid prolonged reductions; dilute or discard concentrated stocks.',
    'Minimize acidic ingredients during cooking; add acids at plating when needed.',
    'Strain and discard poaching liquids if purine concentration is suspected.',
    'Trim skins, bones, and shells before cooking.',
    'Serve modest portions and pair with vitamin C–rich sides.',
  ];

  const spicePhGuidance = language === 'zh' ? [
    '原料pH特性：柑橘汁、食醋、西红柿、罗望子及发酵调味品均呈酸性，会降低菜肴pH。',
    '规避强酸技巧：多选用新鲜芳香草本（欧芹、芫荽、罗勒）与温和香料（生姜、姜黄、孜然），替代高酸性混合调味酱。',
    '避免在单次酱汁浓缩中混合多种强酸原料（如漆树粉+醋+罗望子）；如需调味尽量在出锅装盘时微量点缀。',
  ] : language === 'es' ? [
    'pH de ingredientes: Cítricos, vinagres, tomates, tamarindo y condimentos fermentados son ácidos y bajan el pH del plato.',
    'Al evitar acidez: favorece hierbas frescas (perejil, cilantro, albahaca) y aromáticos cálidos (jengibre, cúrcuma, comino) sobre mezclas acidificantes.',
    'Evita combinar múltiples acidificantes en una reducción; añade los toques ácidos en el emplatado cuando sea posible.',
  ] : [
    'Ingredient pH: Citrus, vinegars, tomatoes, tamarind, and fermented condiments are acidic and lower dish pH.',
    'When avoiding acidity: favor fresh herbs (parsley, cilantro, basil) and warm aromatics (ginger, turmeric, cumin) over acidifying spice blends.',
    'Avoid combining multiple acidifiers in one reduction (e.g., sumac + vinegar + tamarind) — this amplifies acidity and can overly concentrate flavors; add acids at plating when possible.',
  ];

  const quickChecklist = language === 'zh' ? [
    '控制并减少酸化成分；优先使用柠檬皮屑而非柠檬原汁。',
    '分锅炖煮高汤，果断丢弃高嘌呤浓缩渣汁。',
    '对肉类进行短时烹调；用新鲜清淡蔬菜汁完成收汁。',
    '采用温和天然鲜味来源（烤蔬菜、稀释蔬菜泥）替代酵母精或浓缩味精。',
    '控制肉类份量并搭配富含维生素C的解毒配菜。',
  ] : language === 'es' ? [
    'Controla y limita ingredientes acidificantes; prefiere ralladura a zumo.',
    'Mantén caldos separados y desecha reducciones concentradas.',
    'Cocina proteínas brevemente; termina con caldos frescos diluidos.',
    'Usa fuentes suaves de umami (verduras asadas, purés diluidos) en lugar de extractos de levadura.',
    'Control de porciones y combinación con guarniciones de vitamina C.',
  ] : [
    'Check and limit acidifying ingredients; prefer zest to juice.',
    'Keep separate stocks and discard concentrated reductions.',
    'Short-cook proteins; finish with fresh diluted broths.',
    'Use mild umami sources (roasted veg, diluted purées) instead of yeast extracts.',
    'Portion control and pair with vitamin C sides.',
  ];

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs" id="high_cuisine_card">
      <h3 className="font-semibold text-lg mb-2 text-slate-800">
        {language === 'zh' ? '低嘌呤高端烹饪指南 (High Cuisine)' : language === 'es' ? 'Mejores Prácticas de Cocina (Alta Cocina)' : 'Cooking Best Practices (High Cuisine)'}
      </h3>
      <p className="text-xs text-slate-500 mb-4 leading-relaxed">
        {language === 'zh'
          ? '主厨级科学烹饪指南：在为高尿酸及痛风人群准备高端美馔时，有效降低嘌呤浓缩并平衡酸碱度。'
          : language === 'es'
          ? 'Guía culinaria enfocada en reducir la concentración de purinas y acidez al preparar platos de alta cocina para personas con hiperuricemia o gota.'
          : 'Focused chef guidance to reduce purine concentration and unwanted acidity when preparing elevated cuisine for patients managing hyperuricemia or gout.'}
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        <section>
          <h4 className="font-semibold text-sm mb-2 text-slate-700">
            {language === 'zh' ? '核心烹饪法则' : language === 'es' ? 'Reglas Fundamentales de Cocina' : 'Core Cooking Rules'}
          </h4>
          <ul className="list-disc pl-5 text-[13px] text-slate-600 space-y-2">
            {cookingBestPractices.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        </section>

        <section>
          <h4 className="font-semibold text-sm mb-2 text-slate-700">
            {language === 'zh' ? '香料与pH酸碱度指导' : language === 'es' ? 'Especias y Guía de pH' : 'Spices & pH Guidance'}
          </h4>
          <ul className="list-disc pl-5 text-[13px] text-slate-600 space-y-2">
            {spicePhGuidance.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </section>

        <section className="md:col-span-2">
          <h4 className="font-semibold text-sm mb-2 text-slate-700">
            {language === 'zh' ? 'pH测定与操作阈值' : language === 'es' ? 'Medición de pH y Umbrales' : 'pH Measurement & Thresholds'}
          </h4>
          <p className="text-[13px] text-slate-600 mb-2 leading-relaxed">
            {language === 'zh'
              ? '通过对烹饪原汁进行简易pH检测，辅助做出稀释或弃汁决策。推荐厨房操作流程与控制阈值：'
              : language === 'es'
              ? 'Usa controles simples de pH en los líquidos de cocción para decidir si diluir o desechar. Flujo de trabajo y umbrales recomendados:'
              : 'Use simple pH checks on cooking liquids to inform dilution/discard decisions. Recommended kitchen workflow and thresholds:'}
          </p>
          <ul className="list-disc pl-5 text-[13px] text-slate-600 space-y-2 mb-4">
            {language === 'zh' ? (
              <>
                <li><strong>工具：</strong>便携式pH精密试纸或经校准的数显pH计。</li>
                <li><strong>测量时机：</strong>小火慢炖后以及任何浓缩收汁步骤后（在最后调酱之前）。</li>
                <li><strong>阈值标准：</strong>当需要减酸时，成品酱汁/高汤pH建议维持在 ≥ 6.0。若检测pH ≤ 5.5，使用新鲜蔬菜清汤进行稀释，或倒掉浓缩汁重新调制。</li>
                <li><strong>校准维护：</strong>若使用数显计，定期使用标准缓冲液校准，并在样品间清洗探头。</li>
                <li><strong>特别说明：</strong>pH阈值基于食品化学原理，属于烹饪操作参考，非临床处方。个体化指导请咨询专业营养师。</li>
              </>
            ) : language === 'es' ? (
              <>
                <li><strong>Herramientas:</strong> Tiras de pH económicas o medidor digital calibrado para uso frecuente.</li>
                <li><strong>Cuándo medir:</strong> Medir caldos tras hervir y de nuevo tras cualquier reducción (antes de terminar la salsa).</li>
                <li><strong>Guía de umbrales:</strong> Buscar un pH final &gt;= 6.0 para minimizar acidez. Si marca &lt;= 5.5, diluir con caldo fresco de verduras o desechar la fracción concentrada.</li>
                <li><strong>Calibración:</strong> Si usas medidor digital, calibra con soluciones estándar y enjuaga sondas entre muestras.</li>
                <li><strong>Aviso:</strong> Los umbrales de pH son directrices culinarias operativas, no una prescripción médica.</li>
              </>
            ) : (
              <>
                <li><strong>Tools:</strong> inexpensive pH test strips for quick checks or a calibrated handheld pH meter for repeated use.</li>
                <li><strong>When to measure:</strong> measure stocks after simmering and again after any reduction step (before finishing the sauce).</li>
                <li><strong>Threshold guidance:</strong> aim for finishing cooking liquids with pH &gt;= 6.0 when minimizing acidity is desired. If a stock or reduction reads &lt;= 5.5, dilute with fresh vegetable broth or discard the concentrated fraction and remake with a lighter stock.</li>
                <li><strong>Calibration & care:</strong> if using a digital meter, calibrate daily with standard buffers and rinse probes between samples to avoid cross-contamination.</li>
                <li><strong>Caveat:</strong> pH thresholds are operational kitchen guidance based on food chemistry principles — not a clinical prescription. Consult a dietitian for patient-specific clinical advice.</li>
              </>
            )}
          </ul>

          <h4 className="font-semibold text-sm mb-2 text-slate-700">
            {language === 'zh' ? '主厨速查清单' : language === 'es' ? 'Lista de Verificación del Chef' : 'Chef Quick Checklist'}
          </h4>
          <ol className="list-decimal pl-5 text-[13px] text-slate-600 space-y-2">
            {quickChecklist.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ol>
        </section>
      </div>

      <div className="mt-4 text-xs text-slate-400">
        {language === 'zh' ? '提示：本指南为科学烹饪技法，不代替执业医师的医疗处方。' : language === 'es' ? 'Nota: Son estrategias culinarias, no asesoramiento médico.' : 'Note: These are culinary strategies, not medical advice.'}
      </div>
    </div>
  );
}

