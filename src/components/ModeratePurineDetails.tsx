import React from 'react';

export default function ModeratePurineDetails() {
  const guidance = [
    'Definition: Foods with moderate purine levels (approximately 50–150 mg/100g).',
    'Clinical role: Consume in moderated portions; prefer plant sources over concentrated animal sources.',
    'Examples: Salmon (small portions), chicken breast, legumes, mushrooms, oatmeal, and tofu.',
  ];

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs">
      <h3 className="font-semibold text-lg mb-2">Moderate-Purine Foods — Use with Caution</h3>
      <p className="text-xs text-slate-500 mb-4">Moderate-purine items can be included in balanced diets but should follow portion and frequency guidelines to avoid serum uric acid excursions.</p>

      <section className="mb-4">
        <h4 className="font-semibold mb-2">Practical guidance</h4>
        <ul className="list-disc pl-5 text-[13px] text-slate-600 space-y-2">
          {guidance.map((g, i) => (
            <li key={i}>{g}</li>
          ))}
        </ul>
      </section>

      <section className="mb-4">
        <h4 className="font-semibold mb-2">Portion & frequency examples</h4>
        <ul className="list-disc pl-5 text-[13px] text-slate-600 space-y-2">
          <li>Fatty fish (salmon, tuna): limit to 1 small serving (75–100 g) once or twice weekly.</li>
          <li>Poultry (chicken): favor breast over dark cuts; keep to 1–2 servings per week for those sensitive to flares.</li>
          <li>Legumes & tofu: plant purines are less likely to trigger gout — serve in moderate portions as protein alternatives.</li>
        </ul>
      </section>

      <section>
        <h4 className="font-semibold mb-2">Clinical notes</h4>
        <p className="text-[13px] text-slate-600">Epidemiological data suggests plant-based moderate purines do not increase gout risk the same way animal purines do. When in doubt, pair moderate-purine meals with Vitamin C–rich sides, ample fluids, and avoid alcohol that same day.</p>
      </section>

      <div className="mt-4 text-xs text-slate-500">Sources: PubMed reviews, Healthline, Cleveland Clinic.</div>
    </div>
  );
}
