import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';

export default function HighPurineDetails() {
  const { language } = useLanguage();

  const cautions = language === 'zh' ? [
    '定义：高嘌呤食物（通常每100克 > 150毫克）或在代谢上急速升高尿酸的物质（如果糖饮料、啤酒）。',
    '临床作用：在发作期应严格禁食，在维持期应极力避免；这些是导致急性痛风复发的最常见诱因。',
    '高风险类别包括：红肉（牛肉、猪肉、野味）、动物内脏、小油性鱼类、部分贝类海鲜、啤酒和浓缩酵母提取物。',
  ] : language === 'es' ? [
    'Definición: Alimentos con alto contenido de purinas (>150 mg/100g) o que elevan metabólicamente el ácido úrico (bebidas con fructosa, cerveza).',
    'Papel clínico: Evitar estrictamente durante brotes activos y limitar al máximo en mantenimiento; son los desencadenantes más comunes.',
    'Categorías de alto riesgo: Carnes rojas (vacuno, cerdo, caza), vísceras, pescados grasos pequeños, mariscos con concha, cerveza y extractos de levadura.',
  ] : [
    'Definition: High-purine foods (>150 mg/100g) or foods that metabolically raise uric acid (e.g., high-fructose beverages).',
    'Clinical role: Typically avoid during active flares and limit during maintenance phases; these items most commonly trigger acute attacks.',
    'Common high-risk categories include red meats (beef, pork, game meats), organ meats, small oily fish, certain shellfish, beer, and concentrated yeast extracts.',
  ];

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs" id="high_purine_details_card">
      <h3 className="font-semibold text-lg mb-2 text-slate-800">
        {language === 'zh' ? '高嘌呤食物 — 严格限制与避食清单' : language === 'es' ? 'Alimentos Altos en Purinas — Evitar o Minimizar' : 'High-Purine Foods — Avoid or Minimize'}
      </h3>
      <p className="text-xs text-slate-500 mb-4 leading-relaxed">
        {language === 'zh'
          ? '高嘌呤食物和代谢性诱发物质是导致急性痛风发作或血尿酸飙升的最主要饮食诱因。在尿酸未达标前应严格限制。'
          : language === 'es'
          ? 'Los alimentos ricos en purinas y metabólicamente activos son los principales desencadenantes de brotes agudos de gota o aumento de urato. Limítalos estrictamente.'
          : 'High-purine foods and metabolically active items are the likeliest dietary triggers for acute gout flares or rising serum urate. Limit these strictly, especially while uric acid remains above goal.'}
      </p>

      <section className="mb-4">
        <h4 className="font-semibold text-sm mb-2 text-slate-700">
          {language === 'zh' ? '为什么必须严格避食' : language === 'es' ? 'Por qué evitarlos' : 'Why to avoid'}
        </h4>
        <ul className="list-disc pl-5 text-[13px] text-slate-600 space-y-2">
          {cautions.map((c, i) => (
            <li key={i}>{c}</li>
          ))}
        </ul>
      </section>

      <section className="mb-4">
        <h4 className="font-semibold text-sm mb-2 text-slate-700">
          {language === 'zh' ? '常见高风险食物示例' : language === 'es' ? 'Ejemplos comunes de alto riesgo' : 'Common high-purine examples'}
        </h4>
        <ul className="list-disc pl-5 text-[13px] text-slate-600 space-y-2">
          {language === 'zh' ? (
            <>
              <li>红肉（牛排、烤牛肉、肉末、猪排、排骨、培根）和野味。</li>
              <li>动物内脏（肝脏、肾脏、胰脏）、凤尾鱼、沙丁鱼、鲱鱼、鲭鱼、贻贝和扇贝。</li>
              <li>啤酒和烈酒 — 严重阻碍肾脏尿酸排泄，并迅速诱发急性高尿酸血症。</li>
              <li>高果糖浆饮料与深加工甜食 — 导致肝脏细胞消耗大量ATP，急剧合成内源性尿酸。</li>
            </>
          ) : language === 'es' ? (
            <>
              <li>Carnes rojas (filete de ternera, asado, carne picada, chuletas de cerdo, costillas, bacon) y carne de caza.</li>
              <li>Vísceras (hígado, riñones), anchoas, sardinas, arenque, caballa, mejillones y vieiras.</li>
              <li>Cerveza y bebidas alcohólicas — bloquean la excreción renal de ácido úrico y elevan el urato rápidamente.</li>
              <li>Bebidas con jarabe de maíz alto en fructosa — provocan degradación rápida de ATP celular generando ácido úrico.</li>
            </>
          ) : (
            <>
              <li>Red meats (beef steak, roast, ground beef, pork chops, ribs, bacon) and game meats (venison).</li>
              <li>Organ meats (liver, kidneys, sweetbreads), anchovies, sardines, herring, mackerel, mussels, and scallops.</li>
              <li>Beer and alcoholic beverages — impair renal uric excretion and can rapidly elevate serum urate.</li>
              <li>High-fructose drinks and processed syrups — trigger hepatic purine synthesis from ATP breakdown.</li>
            </>
          )}
        </ul>
      </section>

      <section className="mb-4">
        <h4 className="font-semibold text-sm mb-2 text-slate-700">
          {language === 'zh' ? '健康替代与烹饪策略' : language === 'es' ? 'Estrategias de cocción y sustitución' : 'Cooking & substitution strategies'}
        </h4>
        <p className="text-[13px] text-slate-600 leading-relaxed">
          {language === 'zh'
            ? '烹饪时倒掉焯肉汤水，避免浓汤。用鸡蛋、豆腐、低脂乳制品或植物蛋白替代高嘌呤牛肉与猪肉。若想吃鱼，选择中低嘌呤的白身鱼（鳕鱼、比目鱼、罗非鱼），并将份量控制在100克以内，避开多脂小鱼。'
            : language === 'es'
            ? 'Desecha los caldos de cocción y evita reducciones. Sustituye la carne de vacuno o cerdo por huevos, tofu o lácteos desnatados. Si deseas pescado, elige pescado blanco moderado (bacalao, fletán) en porciones menores a 100g y evita pescados grasos pequeños.'
            : 'When preparing meals, discard concentrated poaching liquids and avoid long reductions that concentrate purines. Substitute high-purine beef and pork with eggs, tofu, low‑fat dairy, or plant proteins. If craving fish, choose moderate‑purine white fish (cod, halibut, tilapia) and limit portion to <100 g while avoiding oily small fish.'}
        </p>
      </section>

      <section>
        <h4 className="font-semibold text-sm mb-2 text-slate-700">
          {language === 'zh' ? '循证医学说明' : language === 'es' ? 'Evidencia y nota clínica' : 'Evidence & clinical note'}
        </h4>
        <p className="text-[13px] text-slate-600 leading-relaxed">
          {language === 'zh'
            ? '各项临床营养学研究一致表明，高嘌呤食物与痛风急性发作存在极强相关性。制定药物与日常饮食控制方案请遵医嘱。'
            : language === 'es'
            ? 'Las recomendaciones se basan en revisiones de nutrición clínica. Los alimentos con alto contenido de purinas están fuertemente asociados con brotes en estudios observacionales.'
            : 'Recommendations are based on clinical nutrition reviews and consensus guidance. High‑purine items are strongly associated with gout flares in multiple observational and clinical studies — consult your clinician for individualized advice.'}
        </p>
      </section>

      <div className="mt-4 text-xs text-slate-400">
        {language === 'zh' ? '数据来源：PubMed、Mayo Clinic、Cleveland Clinic。具体临床诊疗请咨询风湿专科医生。' : language === 'es' ? 'Fuentes: PubMed, Mayo Clinic, Cleveland Clinic. Consulta con un reumatólogo.' : 'Sources: PubMed, Mayo Clinic, Cleveland Clinic. Discuss clinical treatment with a rheumatologist.'}
      </div>
    </div>
  );
}

