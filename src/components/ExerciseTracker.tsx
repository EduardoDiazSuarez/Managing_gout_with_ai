import React, { useState, FormEvent } from 'react';
import { Plus, Check, Info, Trash2, Calendar, AlertTriangle, Eye } from 'lucide-react';
import { ExerciseLog, FlareLog } from '../types';
import StretchDollIcon from './StretchDollIcon';
import { useLanguage } from '../i18n/LanguageContext';

interface ExerciseTrackerProps {
  exerciseLogs: ExerciseLog[];
  flareLogs: FlareLog[];
  onAddExercise: (log: Omit<ExerciseLog, 'id'>) => void;
  onDeleteExercise: (id: string) => void;
}

export default function ExerciseTracker({
  exerciseLogs,
  flareLogs,
  onAddExercise,
  onDeleteExercise,
}: ExerciseTrackerProps) {
  const { language, t } = useLanguage();
  const [showForm, setShowForm] = useState(false);
  const [activityType, setActivityType] = useState<ExerciseLog['activityType']>('Walking');
  const [duration, setDuration] = useState<string>('');
  const [jointStrain, setJointStrain] = useState<number>(1);
  const [notes, setNotes] = useState('');

  const activeFlare = flareLogs.find((f) => f.status === 'active');
  const isInRemission = !activeFlare;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const parsedDuration = parseInt(duration, 10);
    if (isNaN(parsedDuration) || parsedDuration <= 0) return;

    onAddExercise({
      date: new Date().toISOString().split('T')[0],
      activityType,
      duration: parsedDuration,
      jointStrain,
      remissionPhase: isInRemission,
      notes: notes.trim() || undefined,
    });

    setDuration('');
    setJointStrain(1);
    setNotes('');
    setShowForm(false);
  };

  const getStrainColor = (level: number) => {
    if (level <= 2) return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    if (level <= 5) return 'bg-amber-100 text-amber-800 border-amber-200';
    return 'bg-rose-100 text-rose-800 border-rose-200';
  };

  return (
    <div className="space-y-6" id="exercise_tracker_root">
      
      {/* State Banner depending on whether direct joint inflammation exists */}
      {activeFlare ? (
        <div className="bg-rose-50 border border-rose-200/60 rounded-3xl p-5 flex gap-4 text-rose-900 animate-pulse">
          <AlertTriangle className="text-rose-500 shrink-0 mt-0.5" size={24} />
          <div>
            <h3 className="font-sans font-bold text-sm">
              {language === 'zh' ? '严格关节制动休息期 🛑' : language === 'es' ? 'Fase Estricta de Reposo Articular Activa 🛑' : 'Strict Joint Rest Phase Active 🛑'}
            </h3>
            <p className="text-xs text-rose-700 mt-1 leading-relaxed">
              {language === 'zh'
                ? `您的关节处于急性发作期（${activeFlare.joint}，疼痛等级：${activeFlare.painLevel}/10）。为避免关节软骨遭受微磨损，请避免负重运动或剧烈活动。以水平卧床休息、局部冷敷及大量饮水为主。`
                : language === 'es' 
                ? `Tienes un brote activo registrado en tu articulación (${activeFlare.joint}, Dolor: ${activeFlare.painLevel}/10). Evita ejercicios con carga de peso o movimientos dinámicos para prevenir microabrasiones en el cartílago. Prioriza el reposo horizontal, compresas frías y abundante agua pura.`
                : `An active flare-up is logged on your ${activeFlare.joint} (Pain Level: ${activeFlare.painLevel}/10). To avoid permanent articular cartilage micro-abrasions, avoid any weight-bearing exercises or dynamic range mobility on this site. Prioritize horizontal rest, cold therapy compress, and massive water intake.`}
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-emerald-50/40 border border-emerald-100 rounded-3xl p-5 flex gap-4 text-emerald-900">
          <Info className="text-emerald-600 shrink-0 mt-0.5" size={24} />
          <div>
            <h3 className="font-sans font-bold text-sm">
              {language === 'zh' ? '缓解期代谢循环促进阶段 💫' : language === 'es' ? 'Fase de Remisión y Circulación Metabólica Activa 💫' : 'Remission & Metabolic Circulation Active 💫'}
            </h3>
            <p className="text-xs text-emerald-700 mt-1 leading-relaxed">
              {language === 'zh'
                ? '您的关节目前处于平稳缓解期。持续的低冲击有氧运动（如快走、游泳、动感单车）可促进肾脏血流，帮助身体加速排出末梢关节囊内沉积的微小尿酸结晶。'
                : language === 'es'
                ? 'Tus articulaciones se encuentran tranquilas. El ejercicio cardiovascular sostenido de bajo impacto (caminar, nadar, bicicleta estática) estimula el flujo sanguíneo renal y ayuda a eliminar microcristales de urato.'
                : 'Your systemic joints are currently silent. Sustained low-impact cardiovascular workouts (like swimming, spinning, or brisk walking) are crucial now. Steady pulse increases general renal blood supply, assisting your body in flushing accumulated uric crystals out of distal joint capsules.'}
            </p>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-sans font-semibold text-lg text-slate-800 flex items-center gap-2">
              <StretchDollIcon className="text-indigo-500" size={22} />
              {t('exercise.title', 'Exercise & Low-Impact Mobility')}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {t('exercise.subtitle', 'Gently stimulate metabolic circulation while shielding joints from high-impact stress')}
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-1 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-3.5 py-2 rounded-xl transition cursor-pointer select-none"
            id="btn_toggle_add_exercise"
          >
            <Plus size={14} />
            {showForm ? (language === 'zh' ? '取消' : language === 'es' ? 'Cancelar' : 'Cancel') : (language === 'zh' ? '记录运动' : language === 'es' ? 'Registrar Ejercicio' : 'Log Exercise')}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="mb-6 p-4 bg-slate-50 border border-slate-100 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-200" id="add_exercise_form">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
              {language === 'zh' ? '记录关爱关节的安全运动' : language === 'es' ? 'Registrar Ejercicio Seguro para Articulaciones' : 'Log Joint-Safe Exercise'}
            </h3>

            {activeFlare && (
              <div className="mb-4 bg-amber-50 border border-amber-200 p-3 rounded-xl text-[11px] text-amber-800 font-medium">
                {language === 'zh'
                  ? '⚠️ 注意：您当前有活动性发作。只建议进行无负重床上拉伸或被动上半身轻微活动。'
                  : language === 'es' 
                  ? '⚠️ Precaución: Actualmente tienes un brote activo. Realiza únicamente estiramientos pasivos o ejercicios de tren superior sin carga.' 
                  : '⚠️ Take caution: You currently have an active flare. Only log non-weightbearing bed stretches or upper body passive exercises if deemed appropriate.'}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">
                  {language === 'zh' ? '低冲击活动类型' : language === 'es' ? 'Tipo de Actividad de Bajo Impacto' : 'Low-Impact Activity Type'}
                </label>
                <select
                  value={activityType}
                  onChange={(e) => setActivityType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition"
                >
                  <option value="Walking">{language === 'zh' ? '快走 (缓解期)' : language === 'es' ? 'Caminata Ligera (Fase de remisión)' : 'Brisk Walking (Remission phase)'}</option>
                  <option value="Cycling">{language === 'zh' ? '室内健身单车 / 慢骑' : language === 'es' ? 'Ciclismo Estacionario / Suave' : 'Gentle Spinning / Stationary Cycling'}</option>
                  <option value="Swimming">{language === 'zh' ? '水疗游泳 (关节零压力)' : language === 'es' ? 'Natación Terapéutica (Cero compresión articular)' : 'Hydro-Therapeutic Swimming (Zero joint compression)'}</option>
                  <option value="Stretching/Yoga">{language === 'zh' ? '轻柔瑜伽 / 拉伸活动' : language === 'es' ? 'Yoga Suave / Estiramientos' : 'Gentle Yoga / Range Stretches'}</option>
                  <option value="Flexibility">{language === 'zh' ? '柔韧性与关节活动度训练' : language === 'es' ? 'Sesión de Flexibilidad y Rango' : 'Dedicated Flexibility / Stretching Session'}</option>
                  <option value="Calisthenics">{language === 'zh' ? '低冲击自重健身' : language === 'es' ? 'Calistenia de Bajo Impacto' : 'Low-Impact Calisthenics (Bodyweight)'}</option>
                  <option value="Elliptical">{language === 'zh' ? '椭圆机零冲击' : language === 'es' ? 'Elíptica sin Impacto' : 'Impact-Free Elliptical'}</option>
                  <option value="Other">{language === 'zh' ? '其他无冲击运动' : language === 'es' ? 'Otro Ejercicio sin Impacto' : 'Other Non-Impact Exercise'}</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">
                  {language === 'zh' ? '时长 (分钟)*' : language === 'es' ? 'Duración (minutos)*' : 'Duration (minutes)*'}
                </label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 30"
                  min="1"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition"
                  id="exercise_duration_input"
                />
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-slate-500">
                  {language === 'zh' ? '关节负荷 / 强度等级' : language === 'es' ? 'Nivel de Tensión / Carga Articular' : 'Joint Strain / Load Intensity'}
                </label>
                <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                  {language === 'zh' ? `等级 ${jointStrain}/10` : language === 'es' ? `Nivel ${jointStrain}/10` : `Level ${jointStrain}/10`}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={jointStrain}
                onChange={(e) => setJointStrain(parseInt(e.target.value, 10))}
                className="w-full accent-indigo-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-bold mt-1.5 uppercase">
                <span>{language === 'zh' ? '1 - 零负荷' : language === 'es' ? '1 - Cero Impacto' : '1 - Couch/Zero Impact'}</span>
                <span>{language === 'zh' ? '5 - 中等活动' : language === 'es' ? '5 - Elasticidad Moderada' : '5 - Moderate Elasticity'}</span>
                <span>{language === 'zh' ? '10 - 较强阻力' : language === 'es' ? '10 - Resistencia Fuerte' : '10 - Heavy Resistance'}</span>
              </div>
            </div>

            <div className="mb-4">
              <label className="text-xs font-bold text-slate-500 block mb-1">
                {language === 'zh' ? '运动笔记（关节感受、疲劳度）' : language === 'es' ? 'Notas de la Sesión (sensación articular, fatiga)' : 'Session Notes (Joint sensation, fatigue)'}
              </label>
              <textarea
                rows={2}
                placeholder={language === 'zh' ? '例如：右踝感觉舒适良好，运动全程保持深呼吸。' : language === 'es' ? 'ej. Tobillo derecho sin molestias. Respiración profunda mantenida.' : 'e.g. Rested heels. Left ankle felt pristine. Continued deep metabolic breathing.'}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition"
                id="exercise_notes_input"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-1"
            >
              <Check size={15} /> {language === 'zh' ? '保存运动记录' : language === 'es' ? 'Guardar Actividad Registrada' : 'Save Logged activity'}
            </button>
          </form>
        )}

        {/* Workout history list */}
        {exerciseLogs.length === 0 ? (
          <div className="text-center py-10 border-2 border-dashed border-slate-100 rounded-2xl flex flex-col items-center justify-center">
            <StretchDollIcon className="text-slate-300 stroke-1 mb-2 animate-bounce" size={32} />
            <h4 className="text-xs font-bold text-slate-600">
              {language === 'zh' ? '暂无运动记录' : language === 'es' ? 'No hay ejercicios registrados' : 'No exercises logged'}
            </h4>
            <p className="text-[11px] text-slate-400 mt-1 max-w-xs mx-auto">
              {language === 'zh'
                ? '温和低冲击的运动能有效改善身体代谢并促进尿酸排出。在此记录您的运动足迹。'
                : language === 'es'
                ? 'El ejercicio suave de bajo impacto mejora sustancialmente la eliminación de ácido úrico. Registra tus actividades aquí.'
                : 'Regular low-impact exercise dramatically enhances systemic uric flush. Log your gentle workouts here to retain progress.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3" id="exercise_logs_list">
            {exerciseLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-white hover:border-slate-200/80 transition"
              >
                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-xs font-bold text-slate-800">{log.activityType}</h4>
                    <span className="text-[10px] uppercase font-bold font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {log.duration} {language === 'zh' ? '分钟' : language === 'es' ? 'min' : 'mins'}
                    </span>
                    <span className={`text-[10px] font-bold border px-2 py-0.5 rounded-full ${getStrainColor(log.jointStrain)}`}>
                      {language === 'zh' ? `负荷: ${log.jointStrain}/10` : language === 'es' ? `Tensión: ${log.jointStrain}/10` : `Strain: ${log.jointStrain}/10`}
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      log.remissionPhase ? 'bg-emerald-50 text-emerald-700 border border-emerald-100/50' : 'bg-red-50 text-red-700 border border-red-100/50'
                    }`}>
                      {log.remissionPhase ? (language === 'zh' ? '缓解期' : language === 'es' ? 'Remisión' : 'Remission') : (language === 'zh' ? '发作模式' : language === 'es' ? 'Modo Brote' : 'Flare Mode')}
                    </span>
                  </div>
                  {log.notes && (
                    <p className="text-[11px] text-slate-400 italic mt-1 leading-snug">
                      💡 {log.notes}
                    </p>
                  )}
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-wider">
                    <Calendar size={11} /> {log.date}
                  </div>
                </div>

                <button
                  onClick={() => onDeleteExercise(log.id)}
                  className="text-slate-300 hover:text-rose-500 p-2 rounded-lg hover:bg-slate-50 transition cursor-pointer"
                  title={language === 'zh' ? '删除运动记录' : language === 'es' ? 'Eliminar entrada de ejercicio' : 'Delete exercise entry'}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Guidelines Box */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 shadow-sm space-y-4">
        <h3 className="font-sans font-semibold text-sm text-white flex items-center gap-2">
          <Info size={16} className="text-indigo-400" />
          {language === 'zh' ? '循证运动与关节活动度指导' : language === 'es' ? 'Pautas de Ejercicio y Movilidad Basadas en Evidencia' : 'Evidence-Based Exercise & Mobility Guidance'}
        </h3>

        <p className="text-xs text-slate-300 leading-relaxed">
          {language === 'zh'
            ? '目标：保持心血管健康、适度管理体重、恢复关节活动度与功能力量，并避免加重急性炎症或延长恢复期。'
            : language === 'es'
            ? 'Objetivos: mantener la salud cardiovascular, controlar el peso cuando sea necesario, restaurar el rango articular y evitar acciones que agraven la inflamación aguda.'
            : 'Goals: maintain cardiovascular health, reduce weight when needed, restore joint range and functional strength, and avoid actions that worsen acute inflammation or prolong recovery.'}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="bg-slate-800/60 p-3.5 rounded-2xl border border-slate-700/50">
            <h4 className="text-xs font-bold text-indigo-300 flex items-center gap-1">
              {language === 'zh' ? '运动建议 (缓解期)' : language === 'es' ? 'Recomendaciones (En Remisión)' : 'Recommendations (Remission)'}
            </h4>
            <ul className="text-[11px] text-slate-300 mt-2 list-disc ml-4 space-y-1">
              <li>{language === 'zh' ? '目标每周 ≥150分钟中等强度有氧运动（快走、骑行、游泳）。' : language === 'es' ? 'Meta ≥150 min/semana de actividad aeróbica moderada (caminata enérgica, ciclismo, natación).' : 'Target ≥150 min/week moderate aerobic activity (e.g., brisk walking, cycling, swimming) or 75 min vigorous.'}</li>
              <li>{language === 'zh' ? '每周2次力量练习：自重或轻阻力，注重动作受控。' : language === 'es' ? 'Entrenamiento de fuerza 2×/semana con peso corporal o resistencia ligera.' : 'Strength training 2×/week: bodyweight or light resistance; focus on controlled movement.'}</li>
              <li>{language === 'zh' ? '每周3次柔韧与活动度练习，重点关注脚踝与足趾。' : language === 'es' ? 'Flexibilidad y movilidad 3×/semana con énfasis en tobillo y pie.' : 'Flexibility & mobility 3×/week: dedicated sessions or post-exercise stretching.'}</li>
              <li>{language === 'zh' ? '运动负荷循序渐进（每周增量10–20%），优先选择零冲击方式。' : language === 'es' ? 'Aumenta el volumen gradualmente (10–20% semanal) y prioriza cero impacto si hay molestias frecuentes.' : 'Progress load slowly (10–20% volume increase weekly) and prefer zero-load modes.'}</li>
            </ul>
          </div>

          <div className="bg-slate-800/60 p-3.5 rounded-2xl border border-slate-700/50">
            <h4 className="text-xs font-bold text-indigo-300 flex items-center gap-1">
              {language === 'zh' ? '发作期安全守则' : language === 'es' ? 'Reglas de Seguridad en Brotes' : 'Safety & Flare rules'}
            </h4>
            <ul className="text-[11px] text-slate-300 mt-2 list-disc ml-4 space-y-1">
              <li>{language === 'zh' ? '急性发作期：受累关节严格休息；仅可进行轻度无负重活动度练习。' : language === 'es' ? 'Brote activo: reposo total de la articulación afectada; solo movimientos suaves sin apoyo de peso.' : 'Active flare: rest the affected joint(s); use non‑weightbearing range-of-motion only.'}</li>
              <li>{language === 'zh' ? '切勿过度疲劳训练 — 极度疲劳可能加重全身炎症。' : language === 'es' ? 'Nunca entrenar hasta el agotamiento extremo; la fatiga severa puede empeorar la inflamación sistémica.' : 'Never train to exhaustion — avoid sessions causing pronounced fatigue.'}</li>
              <li>{language === 'zh' ? '关节不稳定或肿胀时，坚决避免高冲击、急转扭转或大负重动作。' : language === 'es' ? 'Evita movimientos de alto impacto o torsión mientras la articulación esté inestable o inflamada.' : 'Avoid high-impact, torsional, or heavy-load movements while joints are unstable or inflamed.'}</li>
              <li>{language === 'zh' ? '充分热身与拉伸、充足补水、穿着支撑力良好的跑鞋，若出现疼痛立即停练。' : language === 'es' ? 'Calienta, hidrátate abundantemente, usa calzado con buen soporte y detente si aparece dolor o hinchazón.' : 'Warm up, cool down, hydrate, wear supportive footwear, and stop if pain or swelling develops.'}</li>
            </ul>
          </div>
        </div>

        <div className="pt-3 text-[10px] text-slate-400">
          {language === 'zh'
            ? '证据来源：减重与痛风临床试验、WHO体力活动指南、ACR 2020、NHS、MedlinePlus、Arthritis Rheumatol 2024。'
            : language === 'es'
            ? 'Fuentes y evidencia: Ensayos de reducción de peso y gota, pautas de la OMS, ACR 2020, NHS, MedlinePlus, Arthritis Rheumatol 2024.'
            : 'Evidence: weight loss RCTs reduce gout burden; WHO physical activity targets apply; ACR/NHS guidance supports joint protection during flares. Sources: WHO, ACR 2020, NHS, MedlinePlus, Arthritis Rheumatol 2024.'}
        </div>
      </div>

    </div>
  );
}
