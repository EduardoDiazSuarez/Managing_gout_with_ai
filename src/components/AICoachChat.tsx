import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Send,
  Sparkles,
  Award,
  BookOpen,
  CheckCircle,
  HelpCircle,
  Play,
  RotateCcw,
  Loader,
  Activity,
  Droplet,
  Flame,
  Leaf,
  Moon,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../i18n/LanguageContext';

export interface ProposedForm {
  id: string;
  toolName: string;
  args: any;
  status: 'pending' | 'submitted' | 'cancelled';
  submittedResponse?: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'model' | 'system';
  text: string;
  timestamp: string;
  performedSkill?: string;
  proposedForms?: ProposedForm[];
}

interface AICoachChatProps {
  onExecuteSkill: (name: string, args: any) => string | null;
  activeFlareExists: boolean;
  activeFlareJoint?: string;
}

interface ProposedFormCardProps {
  form: ProposedForm;
  onSubmit: (editedArgs: any) => void;
  onCancel: () => void;
  key?: React.Key;
}

function ProposedFormCard({ form, onSubmit, onCancel }: ProposedFormCardProps) {
  const [formData, setFormData] = useState<any>({ ...form.args });

  useEffect(() => {
    setFormData({ ...form.args });
  }, [form.args]);

  const handleChange = (key: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [key]: value }));
  };

  if (form.status === 'submitted') {
    return (
      <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 mt-3 text-xs text-emerald-800 shadow-sm flex items-start gap-2.5 w-full">
        <CheckCircle size={16} className="text-emerald-500 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold uppercase tracking-wider text-[9px] text-emerald-600 block mb-1">
            Care Record Logged ✓
          </span>
          <p className="font-semibold text-emerald-900 leading-snug">{form.submittedResponse}</p>
        </div>
      </div>
    );
  }

  if (form.status === 'cancelled') {
    return (
      <div className="bg-slate-100 border border-slate-250 rounded-2xl p-3 mt-3 text-xs text-slate-500 flex items-center gap-2 w-full">
        <X size={14} className="text-slate-400" />
        <span className="font-medium italic">Action cancelled by user</span>
      </div>
    );
  }

  const toolCleanName = form.toolName.toLowerCase().replace(/_/g, '-');

  switch (toolCleanName) {
    case 'add-flare':
    case 'log-flare': {
      const joint = formData.joint || formData.location || 'Big Toe';
      const painLevel = Number(formData.painLevel || formData.severity || 5);
      const triggers = formData.triggers || '';
      const remedies = formData.remediesTaken || '';
      const notes = formData.notes || '';

      return (
        <div className="bg-gradient-to-br from-rose-50 to-orange-50 border border-rose-100 rounded-2xl p-4 mt-3 shadow-sm text-xs space-y-3 font-sans w-full" id="form-flare">
          <div className="flex items-center justify-between border-b border-rose-100 pb-2">
            <span className="font-bold text-rose-800 flex items-center gap-1.5 uppercase tracking-wide text-[10px]">
              <Flame size={14} className="text-rose-500 animate-pulse" />
              Gout Flare-Up Journal Form
            </span>
            <span className="bg-rose-100 text-rose-700 text-[9px] font-extrabold px-1.5 py-0.5 rounded-full">
              Patient Input
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Affected Joint</label>
              <input
                type="text"
                value={joint}
                onChange={(e) => handleChange('joint', e.target.value)}
                placeholder="e.g. Left Big Toe, Right Ankle"
                className="w-full bg-white border border-rose-200 focus:border-rose-400 focus:ring-1 focus:ring-rose-300 rounded-xl px-3 py-1.5 outline-none font-semibold text-slate-850 transition"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">
                Pain Severity: <span className="text-rose-600 font-extrabold text-sm">{painLevel}</span>/10
              </label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={painLevel}
                  onChange={(e) => handleChange('painLevel', Number(e.target.value))}
                  className="flex-1 h-1.5 bg-rose-200 rounded-lg appearance-none cursor-pointer accent-rose-600"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Triggers (comma-separated)</label>
              <input
                type="text"
                value={Array.isArray(triggers) ? triggers.join(', ') : triggers}
                onChange={(e) => handleChange('triggers', e.target.value)}
                placeholder="e.g. Seafood, Red Wine, Dehydration"
                className="w-full bg-white border border-rose-200 focus:border-rose-400 focus:ring-1 focus:ring-rose-300 rounded-xl px-3 py-1.5 outline-none font-semibold text-slate-700 transition"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Remedies Taken (comma-separated)</label>
              <input
                type="text"
                value={Array.isArray(remedies) ? remedies.join(', ') : remedies}
                onChange={(e) => handleChange('remediesTaken', e.target.value)}
                placeholder="e.g. Cold Compress, Tart Cherry, Hydration"
                className="w-full bg-white border border-rose-200 focus:border-rose-400 focus:ring-1 focus:ring-rose-300 rounded-xl px-3 py-1.5 outline-none font-semibold text-slate-700 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Clinical Notes & Symptoms Context</label>
            <textarea
              value={notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="Describe your current discomfort, swelling status, or other symptoms..."
              rows={2}
              className="w-full bg-white border border-rose-200 focus:border-rose-400 focus:ring-1 focus:ring-rose-300 rounded-xl px-3 py-1.5 outline-none font-semibold text-slate-700 transition resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-1 border-t border-rose-100">
            <button
              type="button"
              onClick={onCancel}
              className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 font-bold transition select-none cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => onSubmit({
                joint,
                painLevel,
                triggers: typeof triggers === 'string' ? triggers.split(',').map(t => t.trim()).filter(Boolean) : triggers,
                remediesTaken: typeof remedies === 'string' ? remedies.split(',').map(r => r.trim()).filter(Boolean) : remedies,
                notes
              })}
              className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold transition shadow-sm cursor-pointer select-none"
            >
              Log Flare-Up
            </button>
          </div>
        </div>
      );
    }

    case 'add-natural-food':
    case 'log-food': {
      const name = formData.name || '';
      const servingSize = formData.servingSize || '1 portion';
      const category = formData.category || 'Other';
      const frequency = formData.frequency || 'Daily';
      const mechanism = formData.mechanism || '';
      const notes = formData.notes || '';

      return (
        <div className="bg-gradient-to-br from-emerald-50 to-blue-50 border border-emerald-100 rounded-2xl p-4 mt-3 shadow-sm text-xs space-y-3 font-sans w-full" id="form-food">
          <div className="flex items-center justify-between border-b border-emerald-100 pb-2">
            <span className="font-bold text-emerald-800 flex items-center gap-1.5 uppercase tracking-wide text-[10px]">
              <Leaf size={14} className="text-emerald-500 animate-pulse" />
              Add Custom Food Watchlist Form
            </span>
            <span className="bg-emerald-100 text-emerald-700 text-[9px] font-extrabold px-1.5 py-0.5 rounded-full">
              Diet Watchlist
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Food / Supplement Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="e.g. Raw Celery Seeds"
                className="w-full bg-white border border-emerald-200 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300 rounded-xl px-3 py-1.5 outline-none font-semibold text-slate-800 transition"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Serving Size</label>
              <input
                type="text"
                value={servingSize}
                onChange={(e) => handleChange('servingSize', e.target.value)}
                placeholder="e.g. 150g, 2 tablespoons"
                className="w-full bg-white border border-emerald-200 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300 rounded-xl px-3 py-1.5 outline-none font-semibold text-slate-800 transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Food Category</label>
              <select
                value={category}
                onChange={(e) => handleChange('category', e.target.value)}
                className="w-full bg-white border border-emerald-200 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300 rounded-xl px-3 py-1.5 outline-none font-semibold text-slate-800 transition text-[11px]"
              >
                <option value="Fruit">Fruit</option>
                <option value="Vegetable">Vegetable</option>
                <option value="Beverage">Beverage</option>
                <option value="Dairy">Dairy</option>
                <option value="Herbal/Seasoning">Herbal / Seasoning</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Target Frequency</label>
              <select
                value={frequency}
                onChange={(e) => handleChange('frequency', e.target.value)}
                className="w-full bg-white border border-emerald-200 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300 rounded-xl px-3 py-1.5 outline-none font-semibold text-slate-800 transition text-[11px]"
              >
                <option value="Daily">Daily</option>
                <option value="During Active Flares">During Active Flares</option>
                <option value="Occasional Maintenance">Occasional Maintenance</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Uric-Lowering Mechanism / Science Notes</label>
            <input
              type="text"
              value={mechanism}
              onChange={(e) => handleChange('mechanism', e.target.value)}
              placeholder="e.g. Promotes urinary bicarbonate buffer to clear uric acid..."
              className="w-full bg-white border border-emerald-200 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300 rounded-xl px-3 py-1.5 outline-none font-semibold text-slate-700 transition"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Dietitian Cooking Tips & Notes</label>
            <textarea
              value={notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="e.g., Mix into daily salads. Do not boil."
              rows={2}
              className="w-full bg-white border border-emerald-200 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300 rounded-xl px-3 py-1.5 outline-none font-semibold text-slate-700 transition resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-1 border-t border-emerald-100">
            <button
              type="button"
              onClick={onCancel}
              className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 font-bold transition select-none cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => onSubmit({
                name,
                servingSize,
                category,
                frequency,
                mechanism: mechanism || 'Tracked natural dietitian food',
                notes: notes || 'Added via chatbot'
              })}
              className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition shadow-sm cursor-pointer select-none"
            >
              Add to Watchlist
            </button>
          </div>
        </div>
      );
    }

    case 'log-water': {
      const amount = Number(formData.amount || 250);

      return (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-4 mt-3 shadow-sm text-xs space-y-3 font-sans w-full" id="form-water">
          <div className="flex items-center justify-between border-b border-blue-100 pb-2">
            <span className="font-bold text-blue-800 flex items-center gap-1.5 uppercase tracking-wide text-[10px]">
              <Droplet size={14} className="text-blue-500 animate-pulse" />
              Hydration Intake Form
            </span>
            <span className="bg-blue-100 text-blue-700 text-[9px] font-extrabold px-1.5 py-0.5 rounded-full">
              Renal Excretion
            </span>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Water Consumed (ml)</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={amount}
                onChange={(e) => handleChange('amount', Number(e.target.value))}
                min="50"
                max="2000"
                step="50"
                className="w-full bg-white border border-blue-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-300 rounded-xl px-3 py-1.5 outline-none font-semibold text-slate-800 transition"
              />
              <div className="flex gap-1">
                {[250, 500, 750].map((quickVal) => (
                  <button
                    key={quickVal}
                    type="button"
                    onClick={() => handleChange('amount', quickVal)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition ${
                      amount === quickVal
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-blue-600 border-blue-200 hover:bg-blue-50'
                    }`}
                  >
                    {quickVal}ml
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1 border-t border-blue-100">
            <button
              type="button"
              onClick={onCancel}
              className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 font-bold transition select-none cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => onSubmit({ amount })}
              className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition shadow-sm cursor-pointer select-none"
            >
              Log Hydration
            </button>
          </div>
        </div>
      );
    }

    case 'log-ua':
    case 'log-uric-acid': {
      const value = Number(formData.value || formData.uricAcid || 6.0);
      const notes = formData.notes || '';

      return (
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl p-4 mt-3 shadow-sm text-xs space-y-3 font-sans w-full" id="form-ua">
          <div className="flex items-center justify-between border-b border-indigo-100 pb-2">
            <span className="font-bold text-indigo-800 flex items-center gap-1.5 uppercase tracking-wide text-[10px]">
              <Activity size={14} className="text-indigo-500 animate-pulse" />
              Uric Acid Level Form
            </span>
            <span className="bg-indigo-100 text-indigo-700 text-[9px] font-extrabold px-1.5 py-0.5 rounded-full">
              Biometric Entry
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">
                Uric Acid Level (mg/dL) - Target &lt;6.0
              </label>
              <input
                type="number"
                value={value}
                onChange={(e) => handleChange('value', Number(e.target.value))}
                step="0.1"
                min="2.0"
                max="15.0"
                className="w-full bg-white border border-indigo-200 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-300 rounded-xl px-3 py-1.5 outline-none font-semibold text-slate-800 transition"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Notes / Method</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                placeholder="e.g. Fasting morning clinical draw"
                className="w-full bg-white border border-indigo-200 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-300 rounded-xl px-3 py-1.5 outline-none font-semibold text-slate-800 transition"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1 border-t border-indigo-100">
            <button
              type="button"
              onClick={onCancel}
              className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 font-bold transition select-none cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => onSubmit({ value, notes })}
              className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition shadow-sm cursor-pointer select-none"
            >
              Log Uric Acid
            </button>
          </div>
        </div>
      );
    }

    case 'add-exercise':
    case 'log-exercise': {
      const activityType = formData.activityType || 'Walking';
      const duration = Number(formData.duration || 30);
      const jointStrain = Number(formData.jointStrain || 2);
      const remissionPhase = formData.remissionPhase !== false;
      const notes = formData.notes || '';

      return (
        <div className="bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-100 rounded-2xl p-4 mt-3 shadow-sm text-xs space-y-3 font-sans w-full" id="form-exercise">
          <div className="flex items-center justify-between border-b border-cyan-100 pb-2">
            <span className="font-bold text-cyan-800 flex items-center gap-1.5 uppercase tracking-wide text-[10px]">
              <Activity size={14} className="text-cyan-500 animate-pulse" />
              Log Exercise &amp; Mobility Form
            </span>
            <span className="bg-cyan-100 text-cyan-700 text-[9px] font-extrabold px-1.5 py-0.5 rounded-full">
              Mobility Track
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Activity Type</label>
              <select
                value={activityType}
                onChange={(e) => handleChange('activityType', e.target.value)}
                className="w-full bg-white border border-cyan-200 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-300 rounded-xl px-3 py-1.5 outline-none font-semibold text-slate-800 transition text-[11px]"
              >
                <option value="Walking">Walking</option>
                <option value="Cycling">Cycling</option>
                <option value="Swimming">Swimming</option>
                <option value="Stretching/Yoga">Stretching / Yoga</option>
                <option value="Elliptical">Elliptical</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Duration (minutes)</label>
              <input
                type="number"
                value={duration}
                onChange={(e) => handleChange('duration', Number(e.target.value))}
                min="5"
                max="300"
                className="w-full bg-white border border-cyan-200 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-300 rounded-xl px-3 py-1.5 outline-none font-semibold text-slate-800 transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">
                Joint Strain Level: <span className="text-cyan-700 font-extrabold">{jointStrain}</span>/10
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={jointStrain}
                onChange={(e) => handleChange('jointStrain', Number(e.target.value))}
                className="w-full h-1.5 bg-cyan-200 rounded-lg appearance-none cursor-pointer accent-cyan-600"
              />
            </div>

            <div className="flex items-center gap-2 pt-4">
              <input
                type="checkbox"
                id="remissionCheck"
                checked={remissionPhase}
                onChange={(e) => handleChange('remissionPhase', e.target.checked)}
                className="w-4 h-4 rounded border-cyan-200 text-cyan-600 focus:ring-cyan-500"
              />
              <label htmlFor="remissionCheck" className="text-[11px] font-semibold text-slate-600 select-none cursor-pointer">
                In Remission Phase?
              </label>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Mobility Notes</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="e.g. Completed with no joint soreness or pressure"
              className="w-full bg-white border border-cyan-200 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-300 rounded-xl px-3 py-1.5 outline-none font-semibold text-slate-700 transition"
            />
          </div>

          <div className="flex justify-end gap-2 pt-1 border-t border-cyan-100">
            <button
              type="button"
              onClick={onCancel}
              className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 font-bold transition select-none cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => onSubmit({ activityType, duration, jointStrain, remissionPhase, notes })}
              className="px-4 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold transition shadow-sm cursor-pointer select-none"
            >
              Log Exercise
            </button>
          </div>
        </div>
      );
    }

    case 'add-sleep':
    case 'log-sleep': {
      const hours = Number(formData.hours || 8);
      const quality = formData.quality || 'Good';
      const restlessJoints = formData.restlessJoints || false;
      const meditationCompleted = formData.meditationCompleted || false;

      return (
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-100 rounded-2xl p-4 mt-3 shadow-sm text-xs space-y-3 font-sans w-full" id="form-sleep">
          <div className="flex items-center justify-between border-b border-purple-100 pb-2">
            <span className="font-bold text-purple-800 flex items-center gap-1.5 uppercase tracking-wide text-[10px]">
              <Moon size={14} className="text-purple-500 animate-pulse" />
              Log Sleep &amp; Recovery Form
            </span>
            <span className="bg-purple-100 text-purple-700 text-[9px] font-extrabold px-1.5 py-0.5 rounded-full">
              Somatic Recovery
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Hours of Sleep</label>
              <input
                type="number"
                value={hours}
                onChange={(e) => handleChange('hours', Number(e.target.value))}
                min="1"
                max="24"
                step="0.5"
                className="w-full bg-white border border-purple-200 focus:border-purple-400 focus:ring-1 focus:ring-purple-300 rounded-xl px-3 py-1.5 outline-none font-semibold text-slate-800 transition"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Sleep Quality</label>
              <select
                value={quality}
                onChange={(e) => handleChange('quality', e.target.value)}
                className="w-full bg-white border border-purple-200 focus:border-purple-400 focus:ring-1 focus:ring-purple-300 rounded-xl px-3 py-1.5 outline-none font-semibold text-slate-800 transition text-[11px]"
              >
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
                <option value="Poor">Poor</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="restlessCheck"
                checked={restlessJoints}
                onChange={(e) => handleChange('restlessJoints', e.target.checked)}
                className="w-4 h-4 rounded border-purple-200 text-purple-600 focus:ring-purple-500"
              />
              <label htmlFor="restlessCheck" className="text-[11px] font-semibold text-slate-600 select-none cursor-pointer">
                Restless Joints Kept Me Awake
              </label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="meditationCheck"
                checked={meditationCompleted}
                onChange={(e) => handleChange('meditationCompleted', e.target.checked)}
                className="w-4 h-4 rounded border-purple-200 text-purple-600 focus:ring-purple-500"
              />
              <label htmlFor="meditationCheck" className="text-[11px] font-semibold text-slate-600 select-none cursor-pointer">
                Daily Evening Meditation Done
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1 border-t border-purple-100">
            <button
              type="button"
              onClick={onCancel}
              className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 font-bold transition select-none cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => onSubmit({ hours, quality, restlessJoints, meditationCompleted })}
              className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold transition shadow-sm cursor-pointer select-none"
            >
              Log Sleep
            </button>
          </div>
        </div>
      );
    }

    case 'resolve-flare':
    case 'resolve-active-flare': {
      return (
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl p-4 mt-3 shadow-sm text-xs space-y-3 font-sans w-full" id="form-resolve-flare">
          <div className="flex items-center justify-between border-b border-emerald-100 pb-2">
            <span className="font-bold text-emerald-800 flex items-center gap-1.5 uppercase tracking-wide text-[10px]">
              <CheckCircle size={14} className="text-emerald-500 animate-pulse" />
              Resolve Active Gout Flare-Up
            </span>
          </div>
          <p className="font-semibold text-slate-600">
            Are you sure you want to mark the active Gout attack as resolved/fully cleared? Congratulations on achieving remission!
          </p>
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onCancel}
              className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 font-bold transition select-none cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => onSubmit({})}
              className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition shadow-sm cursor-pointer select-none"
            >
              Resolve Flare
            </button>
          </div>
        </div>
      );
    }

    default:
      return null;
  }
}

export default function AICoachChat({
  onExecuteSkill,
  activeFlareExists,
  activeFlareJoint
}: AICoachChatProps) {
  const { language, t } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Microphone state
  const [isListening, setIsListening] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = language === 'es' ? 'es-ES' : 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setApiError(null);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputText(transcript);
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event);
        if (event.error !== 'no-speech') {
          setApiError(language === 'es' ? `Error de reconocimiento del micrófono: ${event.error}` : `Mic recognition error: ${event.error}`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    // Seed welcome message in current language
    const welcomeEn = `Hello! I am **Gemi Coach**, your Gout Companion and AI Care Coach. 🔬

I can digest medical papers *(PubMed)* and cross-reference clinical guidelines *(Mayo Clinic)* to provide information and recommendations. I display read-only guidance from research, expert, and cooking-best-practices skills.

You can ask me questions like:
* "Summarize recent PubMed findings on dietary triggers for gout"
* "Explain best-practice cooking tips to lower purine content"
* "Provide expert guidance on handling white fish and red meat in a gout-friendly diet"

How can I help you today?`;

    const welcomeEs = `¡Hola! Soy **Entrenador Gemi**, tu Compañero de Gota y Guía de Cuidado con IA. 🔬

Puedo resumir estudios médicos *(PubMed)* y consultar guías clínicas *(Mayo Clinic)* para ofrecerte recomendaciones científicas y resolver dudas sobre purinas y hábitos.

Puedes hacerme preguntas como:
* "¿Cuáles son los hallazgos recientes sobre desencadenantes dietéticos de la gota?"
* "Explica las mejores técnicas de cocina para reducir el contenido de purinas"
* "¿Cómo clasificar el pescado blanco y las carnes rojas en una dieta para la gota?"

¿En qué puedo ayudarte hoy?`;

    const welcomeZh = `您好！我是 **Gemi 健康教练**，您的痛风健康管理与 AI 智能顾问。🔬

我可以检索医学文献 *(PubMed)* 并对照临床指南 *(Mayo Clinic)*，为您提供降尿酸及痛风康复相关的专业建议。

您可以向我询问：
* “总结近期 PubMed 关于痛风饮食诱因的研究发现”
* “请介绍降低食物嘌呤含量的烹饪最佳技巧”
* “在痛风饮食中如何科学安排白肉鱼类与红肉的摄入”

今天有什么我可以协助您的吗？`;

    setMessages([
      {
        id: 'welcome',
        role: 'model',
        text: language === 'zh' ? welcomeZh : language === 'es' ? welcomeEs : welcomeEn,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  }, [language]);

  // Scroll to bottom whenever messages list grows
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAnalyzing]);

  // Handle Speech Recognition Trigger
  const toggleListening = () => {
    if (!recognitionRef.current) {
      setApiError(language === 'es' 
        ? "El reconocimiento de voz HTML5 no es compatible con este navegador. Por favor usa Google Chrome o Microsoft Edge."
        : "HTML5 Speech Recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  // Submit Text/Voice command to API
  const handleSubmit = async (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();

    const textToSubmit = customText || inputText;
    if (!textToSubmit.trim() || isAnalyzing) return;

    setInputText('');
    setApiError(null);

    // Stop speech recognition if listening
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
    }

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMessage: ChatMessage = {
      id: 'msg-' + Date.now(),
      role: 'user',
      text: textToSubmit,
      timestamp,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsAnalyzing(true);

    try {
      // Build history for conversational memory (limit to last 6 turns to keep it lean and fast)
      const mappedHistory = messages
        .filter((m) => m.role === 'user' || m.role === 'model')
        .slice(-6)
        .map((m) => ({
          role: m.role,
          text: m.text,
        }));

      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSubmit,
          history: mappedHistory,
          language,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: 'Unknown server error' }));
        throw new Error(errorData.error || `HTTP error ${res.status}`);
      }

      const data = await res.json();
      const botText = data.text || '';
      const toolCalls = data.toolCalls || [];

      const proposedForms: ProposedForm[] = (toolCalls || []).map((call: any, idx: number) => ({
        id: `form-${Date.now()}-${idx}`,
        toolName: call.name,
        args: call.args || {},
        status: 'pending' as const,
      }));

      const botMessage: ChatMessage = {
        id: 'bot-' + Date.now(),
        role: 'model',
        text: botText || (proposedForms.length > 0 ? (language === 'es' ? "Revisa y envía el formulario de registro a continuación:" : "Please review and submit the Gout Care entry form below:") : (language === 'es' ? "¡Entendido!" : "I'm on it!")),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        proposedForms: proposedForms.length > 0 ? proposedForms : undefined,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err: any) {
      console.error('Chat error:', err);
      setApiError(err.message || (language === 'es' ? 'Conexión perdida. Verifica que el servidor esté activo.' : 'Connection lost. Please make sure server is running and API keys are verified.'));
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFormSubmit = (messageId: string, formId: string, editedArgs: any) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id !== messageId) return msg;
        const updatedForms = msg.proposedForms?.map((f) => {
          if (f.id !== formId) return f;
          const outcome = onExecuteSkill(f.toolName, editedArgs);
          return {
            ...f,
            status: 'submitted' as const,
            args: editedArgs,
            submittedResponse: outcome || (language === 'es' ? 'Registro de cuidado guardado con éxito.' : 'Care record logged successfully.'),
          };
        });
        return {
          ...msg,
          proposedForms: updatedForms,
        };
      })
    );
  };

  const handleFormCancel = (messageId: string, formId: string) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id !== messageId) return msg;
        const updatedForms = msg.proposedForms?.map((f) => {
          if (f.id !== formId) return f;
          return {
            ...f,
            status: 'cancelled' as const,
          };
        });
        return {
          ...msg,
          proposedForms: updatedForms,
        };
      })
    );
  };

  const handlePresetClick = (preset: string) => {
    handleSubmit(undefined, preset);
  };

  const PRESETS = language === 'zh' ? [
    { label: '💧 记录饮水250ml', text: '我刚喝了一杯250ml纯水' },
    { label: '📈 记录尿酸值', text: '我今天早晨空腹血尿酸检测值为 5.6 mg/dL。' },
    { label: '😴 记录8小时优质睡眠', text: '记录8小时良好睡眠，夜间无明显关节疼痛，已完成晚间冥想。' },
    { label: '🏃‍♂️ 散步35分钟', text: '记录散步35分钟，关节负重指数2，处于缓解期。' },
    { label: '🚫 大脚趾急性发作', text: '我左脚大脚趾关节剧烈疼痛红肿，疼痛等级8级，疑似海鲜饮食诱发。' },
    { label: '🥛 益生菌菌株审计', text: '分析传统低脂酸奶中含有的保加利亚乳杆菌（Lactobacillus bulgaricus）与嗜热链球菌（Streptococcus thermophilus）菌株对痛风的影响' },
    { label: '🍋 无糖柠檬汁打卡', text: '添加无糖新鲜柠檬汁至饮品分类，打卡频率为每日' },
    { label: '💫 发作已缓解', text: '我的痛风关节肿痛已完全消退！请将当前活动期发作标记为已缓解' },
  ] : language === 'es' ? [
    { label: '💧 Beber 250ml', text: 'Acabo de beber un vaso de 250ml de agua pura' },
    { label: '📈 Nivel Ácido Úrico', text: 'Mi resultado de ácido úrico hoy fue 5.6 mg/dL en ayunas.' },
    { label: '😴 Registrar 8h Sueño', text: 'Registrar 8 horas de sueño profundo, sin dolor articular, meditación completada.' },
    { label: '🏃‍♂️ Caminata 35 min', text: 'Registrar Caminata por 35 minutos, tensión articular 2, en fase de remisión.' },
    { label: '🚫 Brote Dedo Gordo', text: 'Tengo un dolor intenso en el dedo gordo del pie izquierdo, nivel 8, tras comer carne.' },
    { label: '🥛 Auditar Probióticos', text: 'Analiza yogur desnatado con cepas Lactobacillus bulgaricus y Streptococcus thermophilus' },
    { label: '🍋 Jugo de Limón', text: 'Añadir Jugo de Limón en categoría Bebida, frecuencia Diaria' },
    { label: '💫 Brote Resuelto', text: '¡Mi articulación ha sanado! Por favor marca mi brote activo como resuelto' },
  ] : [
    { label: '💧 Drink 250ml', text: 'I just drank a glass of 250ml water' },
    { label: '📈 Log UA Level', text: 'My uric acid test today was 5.6 mg/dL. Fasting draw.' },
    { label: '😴 Log 8h Good Sleep', text: 'Log 8 hours of Good sleep quality, no restless joints, meditation completed.' },
    { label: '🏃‍♂️ Walk 35 mins', text: 'Log Walking for 35 minutes, joint strain was 2, in remission phase.' },
    { label: '🚫 Joint Flare Toe', text: 'I have intense flare up pain in my Left Big Toe, pain level is 8, triggered by seafood' },
    { label: '🥛 Check Probiotics', text: 'Analyze traditional low-fat yogurt with Lactobacillus bulgaricus and Streptococcus thermophilus starters' },
    { label: '🍋 Watch Unsweetened Lemon', text: 'Add Unsweetened Lemon Juice under Beverage category, frequency is Daily' },
    { label: '💫 Flare Cleared', text: 'My joint is healed! Please resolve my active flare' },
  ];


  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-[650px] font-sans" id="ai_voice_coach_panel">
      
      {/* Header Banner */}
      <div className="bg-slate-50 border-b border-slate-100 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/10 relative">
            <Sparkles size={18} className="animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
            </span>
          </div>
          <div>
            <h2 className="font-bold text-slate-900 text-sm flex items-center gap-1.5 leading-tight">
              Gemi Coach
              <span className="bg-emerald-50 text-emerald-700 text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                SANDBOX ACTIVE
              </span>
            </h2>
            <p className="text-[11px] text-slate-400 font-medium">Empathetic Clinical Rheumatology Guide & App Skills Integration</p>
          </div>
        </div>
      </div>

      {/* Main Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-slate-50/20" id="chat_scroll_area">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col max-w-[85%] ${
              msg.role === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
            }`}
          >
            <div
              className={`rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-none shadow-sm'
                  : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none shadow-sm shadow-slate-100/30'
              }`}
            >
              {/* Parse nested bold and bullets inside simple text since we do not have full react-markdown here */}
              <div className="whitespace-pre-wrap select-text selection:bg-indigo-250">
                {msg.text.split('\n').map((line, idx) => {
                  let formatted = line;
                  // Handle simple bold **text**
                  const boldRegex = /\*\*([^*]+)\*\*/g;
                  let match;
                  const parts: React.ReactNode[] = [];
                  let lastIndex = 0;

                  while ((match = boldRegex.exec(line)) !== null) {
                    if (match.index > lastIndex) {
                      parts.push(line.substring(lastIndex, match.index));
                    }
                    parts.push(<strong key={match.index} className="font-bold text-slate-900 text-[12px]">{match[1]}</strong>);
                    lastIndex = boldRegex.lastIndex;
                  }
                  if (lastIndex < line.length) {
                    parts.push(line.substring(lastIndex));
                  }

                  // Fallback to text if no bold matches
                  const content = parts.length > 0 ? parts : line;

                  return (
                    <div key={idx} className={line.startsWith('*') ? 'pl-4 py-0.5' : 'py-0.5'}>
                      {line.startsWith('*') ? (
                        <span className="flex items-start">
                          <span className="mr-1.5 text-indigo-500">•</span>
                          <span>{line.substring(1).trim()}</span>
                        </span>
                      ) : (
                        content
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Proposed Forms inside Gemi Coach Chat bubble */}
            {msg.proposedForms && msg.proposedForms.map((form) => (
              <ProposedFormCard
                key={form.id}
                form={form}
                onSubmit={(editedArgs) => handleFormSubmit(msg.id, form.id, editedArgs)}
                onCancel={() => handleFormCancel(msg.id, form.id)}
              />
            ))}

            {/* If skill was executed, show a glorious confirmation card underneath */}
            {msg.performedSkill && (
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="mt-2 bg-emerald-50 border border-emerald-100 rounded-xl p-3 w-full text-[11px] text-emerald-800 flex items-start gap-2.5 shadow-sm"
              >
                <CheckCircle size={15} className="text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold uppercase tracking-wider text-[9px] text-emerald-600 block mb-0.5">
                    Gout Care Skill Executed ✓
                  </span>
                  <p className="font-medium text-emerald-700 leading-snug">{msg.performedSkill}</p>
                </div>
              </motion.div>
            )}

            <span className="text-[10px] text-slate-400 mt-1 px-1 font-semibold">{msg.timestamp}</span>
          </div>
        ))}

        {/* Loading/Thinking State */}
        {isAnalyzing && (
          <div className="flex flex-col items-start max-w-[85%] mr-auto">
            <div className="bg-white text-slate-800 border border-slate-150 rounded-2xl p-4 shadow-sm flex items-center gap-3">
              <Loader className="text-indigo-600 animate-spin" size={16} />
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-slate-700">
                  {language === 'zh' ? 'Gemi 教练正在检索与分析代谢文献...' : language === 'es' ? 'Entrenador Gemi está analizando...' : 'Gemi Coach is analyzing metabolics...'}
                </p>
                <p className="text-[10px] text-slate-400">
                  {language === 'zh' ? '对照 PubMed 临床研究与排酸数据' : language === 'es' ? 'Consultando estudios de aclaramiento en PubMed' : 'Cross-referencing PubMed clearance studies'}
                </p>
              </div>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Preset Recommendation Chips */}
      <div className="bg-slate-50 border-t border-slate-150/60 p-3 overflow-x-auto whitespace-nowrap scrollbar-none flex gap-2">
        {PRESETS.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handlePresetClick(chip.text)}
            className="inline-flex items-center gap-1.5 bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-slate-600 hover:text-indigo-700 text-[10px] sm:text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm cursor-pointer transition select-none shrink-0"
          >
            <Sparkles size={11} className="text-indigo-400" />
            {chip.label}
          </button>
        ))}
      </div>

      {/* Mic / Form controls */}
      <div className="p-4 border-t border-slate-150 bg-white">
        <form onSubmit={(e) => handleSubmit(e)} className="flex items-center gap-2">
          {/* Voice to text Mic trigger */}
          <button
            type="button"
            onClick={toggleListening}
            className={`h-11 w-11 rounded-xl flex items-center justify-center border text-white transition duration-150 relative cursor-pointer select-none shrink-0 shadow-md ${
              isListening
                ? 'bg-rose-500 border-rose-400 hover:bg-rose-600 animate-pulse ring-4 ring-rose-100'
                : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
            }`}
            title={isListening ? (language === 'zh' ? "正在倾听...再次点击发送" : language === 'es' ? "Escuchando... clic para enviar" : "Listening... click to send") : (language === 'zh' ? "语音输入" : language === 'es' ? "Hablar con Gemi" : "Speak with Gemi Voice Recognition")}
            id="mic_trigger_btn"
          >
            {isListening ? <Mic size={18} className="animate-bounce" /> : <Mic size={18} />}
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={isListening ? (language === 'zh' ? "正在倾听，请说话..." : language === 'es' ? "Escuchando con atención... habla ahora" : "Listening carefully... speak now") : (language === 'zh' ? "向 Gemi 教练提问，或指示其记录饮水、尿酸、发作..." : language === 'es' ? "Pide a Entrenador Gemi registrar o haz preguntas de dieta..." : "Instruct Gemi Coach to log or ask diet questions...")}
            className="flex-1 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white text-xs font-semibold rounded-xl px-4 h-11 outline-none transition"
            id="chat_text_input"
          />

          <button
            type="submit"
            disabled={!inputText.trim() || isAnalyzing}
            className="h-11 w-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center shadow-md shadow-indigo-600/10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition shrink-0"
            id="chat_send_btn"
          >
            <Send size={16} />
          </button>
        </form>

        {apiError && (
          <div className="mt-3 text-[11px] leading-relaxed font-semibold text-rose-600 bg-rose-50 border border-rose-150 rounded-xl p-2.5 flex items-start gap-2 animate-in fade-in zoom-in-95 duration-150">
            <span className="font-bold">⚠️ Warning:</span>
            <span>{apiError}</span>
          </div>
        )}

        {/* Scientific disclaimer badge */}
        <p className="text-[9px] text-slate-400 mt-3 text-center leading-relaxed">
          {language === 'zh'
            ? 'Gemi 教练基于同行评审临床研究（PubMed、PubMed 2024）提供生活方式与营养支持建议，不能替代风湿科专科医师临床诊疗。'
            : language === 'es'
            ? 'Entrenador Gemi analiza estudios revisados por pares (PubMed, PubMed 2024) para orientar pautas, sin sustituir la consulta con un reumatólogo.'
            : 'Gemi Coach parses peer-reviewed studies (PubMed, PubMed 2024) to log guidelines, not replacement values for direct rheumatologist consulting.'}
        </p>
      </div>

    </div>
  );
}
