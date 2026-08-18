import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';

export default function LowPurineDetails() {
  const { language } = useLanguage();

  const highlights = language === 'zh' ? [
    '定义：低嘌呤食物（通常每100克 < 50毫克），几乎不会升高血清尿酸。',
    '临床作用：日常维持期与防复发的基础主食，搭配充足水分与维生素C摄入效果更佳。',
    '典型范例：樱桃、黄瓜、脱脂牛奶、鸡蛋、绝大多数水果、糙米、低脂乳制品以及适量坚果/种子。',
  ] : language === 'es' ? [
    'Definición: Alimentos con bajo contenido de purinas (típicamente <50 mg/100g) que rara vez elevan el urato sérico.',
    'Papel clínico: Alimentos básicos diarios para mantenimiento y prevención de brotes, junto con hidratación y vitamina C.',
    'Ejemplos típicos: cerezas, pepinos, leche desnatada, huevos, la mayoría de frutas, arroz integral, lácteos desnatados y frutos secos en porciones moderadas.',
  ] : [
    'Definition: Foods with low purine content (typically <50 mg/100g) that rarely raise serum urate.',
    'Clinical role: Daily staples for maintenance and flare prevention when paired with hydration and vitamin C intake.',
    'Typical examples: cherries, cucumbers, skim milk, eggs, most fruits, brown rice, low‑fat dairy, and many nuts/seeds in small portions.',
  ];

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs" id="low_purine_details_card">
      <h3 className="font-semibold text-lg mb-2 text-slate-800">
        {language === 'zh' ? '低嘌呤食物 — 安全日常之选' : language === 'es' ? 'Alimentos Bajos en Purinas — Opciones Seguras Diarias' : 'Low-Purine Foods — Safe Daily Choices'}
      </h3>
      <p className="text-xs text-slate-500 mb-4 leading-relaxed">
        {language === 'zh'
          ? '低嘌呤食物适合日常饮食和稳定维持期。长期坚持食用有助于促进肾脏尿酸清除，降低晶体沉淀和关节炎发作风险。'
          : language === 'es'
          ? 'Los alimentos bajos en purinas son adecuados para comidas cotidianas y fases de mantenimiento. Favorecen la depuración renal y reducen el riesgo de formación de cristales.'
          : 'Low-purine foods are appropriate for everyday meals and maintenance phases. They support renal clearance and reduce risk of crystal formation when eaten consistently.'}
      </p>

      <section className="mb-4">
        <h4 className="font-semibold text-sm mb-2 text-slate-700">
          {language === 'zh' ? '为什么这些食物重要' : language === 'es' ? 'Por qué son importantes' : 'Why these matter'}
        </h4>
        <ul className="list-disc pl-5 text-[13px] text-slate-600 space-y-2">
          {highlights.map((h, i) => (
            <li key={i}>{h}</li>
          ))}
        </ul>
      </section>

      <section className="mb-4">
        <h4 className="font-semibold text-sm mb-2 text-slate-700">
          {language === 'zh' ? '实用食用建议与分量' : language === 'es' ? 'Sugerencias prácticas de consumo' : 'Practical serving suggestions'}
        </h4>
        <ul className="list-disc pl-5 text-[13px] text-slate-600 space-y-2">
          {language === 'zh' ? (
            <>
              <li>新鲜酸樱桃或浆果 — 每日1杯；若无鲜品可用冷冻樱桃或纯浓缩汁替代。</li>
              <li>低脂酸奶 / 脱脂牛奶 — 每份150–250克；优先选择无额外添加糖的原味产品。</li>
              <li>鸡蛋 — 每天1个，是非常优质安全且嘌呤可忽略不计的蛋白质来源。</li>
              <li>全谷物（糙米、燕麦、藜麦） — 1份（煮熟约30–50克碳水化合物）作为碳水基底。</li>
              <li>坚果与种子 — 1–2汤匙；控制少量以避免卡路里过剩。</li>
            </>
          ) : language === 'es' ? (
            <>
              <li>Cerezas ácidas frescas o frutos rojos — 1 taza al día; usar congeladas si no hay frescas.</li>
              <li>Yogur bajo en grasa / leche desnatada — 150–250 g por porción; elegir opciones sin azúcar añadido.</li>
              <li>Huevos — 1 al día como fuente segura de proteína (purinas insignificantes).</li>
              <li>Cereales integrales (arroz integral, quinua) — 1 porción como base de carbohidratos.</li>
              <li>Frutos secos y semillas — 1–2 cucharadas; mantener porciones moderadas.</li>
            </>
          ) : (
            <>
              <li>Fresh tart cherries or berries — 1 cup daily; use frozen if fresh unavailable.</li>
              <li>Low‑fat yogurt / skim milk — 150–250 g per serving; choose unsweetened options.</li>
              <li>Eggs — 1 per day as a safe protein source (negligible purines).</li>
              <li>Whole grains (brown rice, quinoa) — 1 serving (30–50 g cooked carbs) as carbohydrate base.</li>
              <li>Nuts & seeds — 1–2 tbsp; keep portions small to avoid caloric excess.</li>
            </>
          )}
        </ul>
      </section>

      <section className="mb-4">
        <h4 className="font-semibold text-sm mb-2 text-slate-700">
          {language === 'zh' ? '烹饪与搭配技巧' : language === 'es' ? 'Consejos de preparación y combinación' : 'Preparation & pairing tips'}
        </h4>
        <p className="text-[13px] text-slate-600 leading-relaxed">
          {language === 'zh'
            ? '将低嘌呤主食与富含维生素C的配菜（柠檬、彩椒、草莓）搭配，促进尿酸排泄。避免添加果糖或高果糖玉米糖浆。全天保持规律饮水。'
            : language === 'es'
            ? 'Combina platos principales bajos en purinas con guarniciones ricas en vitamina C (limón, frutos rojos) para apoyar la eliminación de urato. Evita añadir azúcares o jarabes de fructosa. Prioriza la ingesta continua de agua.'
            : 'Pair low‑purine mains with vitamin C–rich sides (lemon, berries) to support uricosuria. Avoid adding sugar or high‑fructose syrups which can negate benefits. Prioritize water intake throughout the day.'}
        </p>
      </section>

      <section>
        <h4 className="font-semibold text-sm mb-2 text-slate-700">
          {language === 'zh' ? '循证医学说明' : language === 'es' ? 'Evidencia y notas clínicas' : 'Evidence & notes'}
        </h4>
        <p className="text-[13px] text-slate-600 leading-relaxed">
          {language === 'zh'
            ? '上述建议基于循证医学指南与权威临床研究（如PubMed文献综述与Mayo Clinic指南）。作为日常维持期营养参考；个性化方案请咨询风湿免疫科医生。'
            : language === 'es'
            ? 'Estas recomendaciones están respaldadas por guías clínicas y estudios primarios (revisiones de PubMed y resúmenes de Mayo Clinic). Úsalas como base de mantenimiento; consulta planes individualizados con un especialista.'
            : 'These recommendations are supported by patient‑facing guidelines and primary studies (e.g., PubMed reviews and Mayo Clinic summaries). Use as maintenance‑phase staples; discuss personalized plans with a clinician.'}
        </p>
      </section>

      <div className="mt-4 text-xs text-slate-400">
        {language === 'zh' ? '数据来源：PubMed、Mayo Clinic、Healthline（医学同行评审）。' : language === 'es' ? 'Fuentes: PubMed, Mayo Clinic, Healthline (revisado médicamente).' : 'Sources: PubMed, Mayo Clinic, Healthline (medically reviewed).'}
      </div>
    </div>
  );
}

