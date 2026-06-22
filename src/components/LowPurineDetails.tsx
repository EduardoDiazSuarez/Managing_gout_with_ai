import React from 'react';

export default function LowPurineDetails() {
  const highlights = [
    'Definition: Foods with minimal purine content (<50 mg/100g) that do not meaningfully raise serum urate.',
    'Clinical role: First-line daily staples for gout-friendly meal planning; support uric clearance when paired with hydration and Vitamin C.',
    'Typical examples: cherries, cucumbers, skim milk, eggs, most fruits, brown rice, and low-fat dairy.',
  ];

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs">
      <h3 className="font-semibold text-lg mb-2">Low-Purine Foods — Safe Daily Choices</h3>
      <p className="text-xs text-slate-500 mb-4">Low-purine foods are ideal for everyday meals and maintenance phases. They support kidney clearance and reduce risk of crystal formation.</p>

      <section className="mb-4">
        <h4 className="font-semibold mb-2">Why these matter</h4>
        <ul className="list-disc pl-5 text-[13px] text-slate-600 space-y-2">
          {highlights.map((h, i) => (
            <li key={i}>{h}</li>
          ))}
        </ul>
      </section>

      <section className="mb-4">
        <h4 className="font-semibold mb-2">Recommended examples & portions</h4>
        <ul className="list-disc pl-5 text-[13px] text-slate-600 space-y-2">
          <li>Fresh cherries / berries — 1 cup daily (rich in anthocyanins).</li>
          <li>Skim milk or low-fat yogurt — 150–250 g per serving (supports uricosuria).</li>
          <li>Eggs — 1–2 per day (negligible purine content).</li>
          <li>Brown rice / whole grains — 1 serving (30–50 g cooked carbs).</li>
        </ul>
      </section>

      <section>
        <h4 className="font-semibold mb-2">Clinical notes</h4>
        <p className="text-[13px] text-slate-600">These foods are the backbone of a gout-safe diet. Emphasize portion control, minimize added sugars and high-fructose corn syrup, and stay hydrated. If taking urate-lowering medication, confirm dietary plans with a clinician.</p>
      </section>

      <div className="mt-4 text-xs text-slate-500">Sources: Healthline Medically Reviewed, Mayo Clinic, selected PubMed reviews.</div>
    </div>
  );
}
