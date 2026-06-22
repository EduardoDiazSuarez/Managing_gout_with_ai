import React from 'react';

export default function HighPurineDetails() {
  const cautions = [
    'Definition: High-purine foods (>150 mg/100g) that rapidly metabolize into uric acid.',
    'Clinical role: Best avoided or strictly limited, especially during active flares or when uric acid is above goal.',
    'Common high-risk items: organ meats, anchovies, sardines, certain shellfish, beer, and yeast extracts.',
  ];

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs">
      <h3 className="font-semibold text-lg mb-2">High-Purine Foods — Avoid or Minimize</h3>
      <p className="text-xs text-slate-500 mb-4">High-purine foods are the most likely dietary triggers for acute gout flares or rising serum urate levels. Limiting these is a core dietary strategy.</p>

      <section className="mb-4">
        <h4 className="font-semibold mb-2">Why to avoid</h4>
        <ul className="list-disc pl-5 text-[13px] text-slate-600 space-y-2">
          {cautions.map((c, i) => (
            <li key={i}>{c}</li>
          ))}
        </ul>
      </section>

      <section className="mb-4">
        <h4 className="font-semibold mb-2">Common high-purine examples</h4>
        <ul className="list-disc pl-5 text-[13px] text-slate-600 space-y-2">
          <li>Organ meats (liver, sweetbreads), anchovies, sardines, mackerel, mussels, and scallops.</li>
          <li>Beer and certain alcoholic beverages — alcohol impairs renal uric excretion and contains fermentable purines.</li>
          <li>Concentrated broths, gravies, and yeast extracts (highly concentrated purine sources).</li>
        </ul>
      </section>

      <section>
        <h4 className="font-semibold mb-2">Practical substitutions</h4>
        <p className="text-[13px] text-slate-600">Replace high-purine proteins with low-purine alternatives (eggs, tofu, low-fat dairy) and favor plant-forward dishes. When cooking, discard concentrated poaching liquids and avoid long reductions that concentrate purines.</p>
      </section>

      <div className="mt-4 text-xs text-slate-500">Sources: PubMed, Mayo Clinic, Cleveland Clinic. Medical decisions should be confirmed with a clinician.</div>
    </div>
  );
}
