import React, { useState } from 'react';
import { SymptomLog } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

interface Props {
  symptoms: SymptomLog[];
  onAddSymptom: (log: Omit<SymptomLog, 'id'>) => void;
  onDeleteSymptom: (id: string) => void;
}

export default function Symptoms({ symptoms, onAddSymptom, onDeleteSymptom }: Props) {
  const { language, t } = useLanguage();
  const [text, setText] = useState('');
  const [severity, setSeverity] = useState(3);
  const today = new Date().toISOString().split('T')[0];

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onAddSymptom({ date: today, symptom: text.trim(), severity, notes: '' });
    setText('');
    setSeverity(3);
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs">
      <h3 className="font-semibold text-lg mb-3">
        {language === 'zh' ? '关节症状日记' : language === 'es' ? 'Diario de Síntomas' : 'Symptoms Journal'}
      </h3>
      <div className="text-xs text-slate-500 mb-4 space-y-2">
        <div>
          {language === 'zh'
            ? '典型症状：突发剧烈关节疼痛（常始于大脚趾关节）、红肿发亮、皮温升高、触痛极敏锐且活动受限。'
            : language === 'es'
            ? 'Síntomas típicos: dolor articular repentino e intenso (comúnmente en el dedo gordo), hinchazón, calor local, enrojecimiento y movilidad reducida.'
            : 'Typical symptoms: sudden, intense joint pain (often the big toe), swelling, warmth, redness, and reduced range of motion. Attacks often peak quickly and may last 1–2 weeks if untreated.'}
        </div>
        <div>
          {language === 'zh'
            ? '常见受累部位：大脚趾第一跖趾关节、足背、踝关节、膝关节、手腕及指间关节；慢性期可形成痛风石。'
            : language === 'es'
            ? 'Zonas comunes: dedo gordo del pie (podagra), tobillos, rodillas, muñecas, dedos.'
            : 'Common sites: big toe (podagra), ankles, knees, wrists, fingers; long-standing disease can form tophi (hard lumps).'}
        </div>
        <div>
          {language === 'zh'
            ? '警惕危险信号：若伴随高热不退或全身中毒症状，需紧急就医以排查化脓性关节炎感染。'
            : language === 'es'
            ? 'Signos de alarma: fiebre alta o dolor extremo que no cede requieren atención médica urgente.'
            : 'Red flags: high fever, worsening pain despite treatment, or systemic illness—seek urgent medical care (possible joint infection).'}
        </div>
        <div>
          {language === 'zh'
            ? '建议记录内容：发作时间、具体部位、疼痛等级 (1–10)、持续时长以及可能的诱因（高嘌呤餐、饮酒、脱水、受凉等）。'
            : language === 'es'
            ? 'Qué registrar: hora de inicio, localización, nivel de dolor (1–10), duración y posibles factores desencadenantes (comidas copiosas, alcohol, deshidratación).'
            : 'What to record: onset/time, location, severity (1–10), duration, possible triggers (food, alcohol, dehydration, injury), medications taken and response.'}
        </div>
        <div className="text-[11px] text-slate-400">
          {language === 'zh' ? '信息来源: NHS, Healthline 医学审阅' : language === 'es' ? 'Fuentes: NHS, Healthline.' : 'Sources: NHS, Healthline.'}
        </div>
      </div>

      <form onSubmit={submit} className="flex gap-2 items-center mb-4">
        <input
          className="flex-1 border rounded-xl px-3 py-2 text-sm"
          placeholder={language === 'zh' ? '描述症状 (例如：左脚大脚趾剧烈跳痛)' : language === 'es' ? 'Describe el síntoma (ej. Dedo gordo palpitante)' : 'Describe symptom (e.g., Left big toe throbbing)'}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <select value={severity} onChange={(e) => setSeverity(Number(e.target.value))} className="border rounded-xl px-2 py-2 text-sm">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n}>
              {language === 'zh' ? `疼痛等级 ${n}` : language === 'es' ? `Dolor ${n}` : `Pain ${n}`}
            </option>
          ))}
        </select>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold cursor-pointer hover:bg-blue-700 transition">
          {language === 'zh' ? '添加' : language === 'es' ? 'Añadir' : 'Add'}
        </button>
      </form>

      <div className="space-y-3">
        {symptoms.length === 0 ? (
          <div className="text-xs text-slate-400">
            {language === 'zh' ? '暂无症状记录。' : language === 'es' ? 'No hay síntomas registrados aún.' : 'No symptoms recorded yet.'}
          </div>
        ) : (
          symptoms.map((s) => (
            <div key={s.id} className="flex items-start justify-between p-3 rounded-2xl border bg-slate-50">
              <div>
                <div className="text-sm font-semibold">{s.symptom}</div>
                <div className="text-[11px] text-slate-500">
                  {s.date} • {language === 'zh' ? '疼痛指数' : language === 'es' ? 'Gravedad' : 'Severity'} {s.severity}/10
                </div>
                {s.notes && <div className="text-[11px] mt-1 text-slate-600">{s.notes}</div>}
              </div>
              <div className="flex flex-col items-end gap-2">
                <button onClick={() => onDeleteSymptom(s.id)} className="text-xs text-rose-600 hover:text-rose-800 cursor-pointer">
                  {language === 'zh' ? '删除' : language === 'es' ? 'Eliminar' : 'Delete'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

}

