import { FoodItem } from '../types';

export const STATIC_FOODS_DATABASE: FoodItem[] = [
  // High Purine - AVOID
  {
    name: "Beer",
    p_rating: "High",
    mgPer100g: "150-300mg",
    category: "Beverages",
    why: "Beer is doubly dangerous. It is high in yeast purines and alcohol, which slows down the kidneys from excreting uric acid, leading to rapid accumulation."
  },
  {
    name: "Beef Liver",
    p_rating: "High",
    mgPer100g: "440-550mg",
    category: "Meats",
    why: "Organ meats are the absolute highest sources of purines. Unfit for gout diets; can easily trigger acute strikes."
  },
  {
    name: "Sardines",
    p_rating: "High",
    mgPer100g: "350-480mg",
    category: "Seafood",
    why: "Very concentrated animal purines. Small oily fish should be avoided during gout treatment and flares."
  },
  {
    name: "Shrimp",
    p_rating: "High",
    mgPer100g: "150-200mg",
    category: "Seafood",
    why: "Shellfish contains high amounts of purines that digest into uric acid. Avoid during active flare-ups."
  },
  {
    name: "High Fructose Corn Syrup Soda",
    p_rating: "High",
    mgPer100g: "N/A",
    category: "Beverages",
    why: "Fructose triggers cellular ATP breakdown into uric acid within minutes. Carbonated sugary sodas are key contributors to uric acid spikes."
  },
  {
    name: "Sweetbreads (Pancreas/Thymus)",
    p_rating: "High",
    mgPer100g: "600mg+",
    category: "Meats",
    why: "Extreme concentrations of organic purines. Highly inflammatory for joints."
  },
  {
    name: "Mussels & Scallops",
    p_rating: "High",
    mgPer100g: "110-180mg",
    category: "Seafood",
    why: "Seafood shellfish contains dense purine loads. Restrict strictly to lower systemic risks."
  },

  // Moderate Purine - MODERATE
  {
    name: "Salmon",
    p_rating: "Moderate",
    mgPer100g: "110-130mg",
    category: "Seafood",
    why: "While containing moderate purines, it provides excellent anti-inflammatory Omega-3 fatty acids. Eat in small, disciplined portions (under 100g)."
  },
  {
    name: "Beef Roast or Steak",
    p_rating: "Moderate",
    mgPer100g: "110-120mg",
    category: "Meats",
    why: "Red meat has moderate to high purines. Limit portion frequency. Accompany with generous water intake."
  },
  {
    name: "Chicken Breast",
    p_rating: "Moderate",
    mgPer100g: "110-115mg",
    category: "Meats",
    why: "A safer alternative to red meat or organ meats, chicken still contains moderate levels of purines. Restrict portion sizes."
  },
  {
    name: "Spinach",
    p_rating: "Moderate",
    mgPer100g: "50-70mg",
    category: "Vegetables",
    why: "High botanical purines, but clinical studies confirm vegetable-derived purines DO NOT increase the risk of gout or trigger flare-ups. Safe to consume."
  },
  {
    name: "Oatmeal",
    p_rating: "Moderate",
    mgPer100g: "90-100mg",
    category: "Grains",
    why: "Contains moderate purines and rich dietary fiber. Excellent for cardiovascular health, safe in balanced portions."
  },
  {
    name: "Lentils",
    p_rating: "Moderate",
    mgPer100g: "110-120mg",
    category: "Grains",
    why: "Rich in plant protein and moderate purines. Safe substitute for heavy meats, and does not exhibit gout flare correlations."
  },
  {
    name: "Pork Chop",
    p_rating: "Moderate",
    mgPer100g: "100-115mg",
    category: "Meats",
    why: "White pork meat contains moderate purines. Limit intake, especially the fatty cuts."
  },

  // Low Purine - SAFE
  {
    name: "Tart Cherries",
    p_rating: "Safe",
    mgPer100g: "Under 5mg",
    category: "Fruits",
    why: "Superfood for gout! Cherries contain anthocyanins which lower serum uric acid levels, decrease inflammation, and clinically reduce gout flare risk by 35%."
  },
  {
    name: "Water",
    p_rating: "Safe",
    mgPer100g: "0mg",
    category: "Beverages",
    why: "The absolute best remedy. Drinking 8-12 glasses of water a day aids the kidneys in flushing excess uric acid and preventing crystal formation."
  },
  {
    name: "Plain Traditional Yogurt (Low-Fat)",
    p_rating: "Safe",
    mgPer100g: "Under 10mg",
    category: "Dairy",
    why: "Low-fat plain traditional yogurt contains proteins (casein and lactalbumin) that support renal excretion of uric acid. Starter cultures (Lactobacillus bulgaricus, Streptococcus thermophilus, Bifidobacterium lactis, Lactobacillus acidophilus) help metabolize purines. Avoid yogurts listing L. casei or L. paracasei or those with added sugars."
  },
  {
    name: "Unsweetened Cacao (Dark Chocolate)",
    p_rating: "Safe",
    mgPer100g: "Under 10mg",
    category: "Other",
    why: "Pure cacao is exceptionally rich in antioxidant polyphenols that have strong anti-inflammatory properties, helpful in relieving joint irritation. Keep it sugar-free, as fructose triggers uric acid production (PubMed)."
  },
  {
    name: "Roasted Batatas (Sweet Potatoes)",
    p_rating: "Safe",
    mgPer100g: "Under 15mg",
    category: "Vegetables",
    why: "Sweet potatoes are highly nutritious, low-purine complex carbohydrates packed with Vitamin C, potassium, and beta-carotene. Vitamin C is a natural uricosuric that assists kidneys in clearing excess uric acid (Mayo Clinic)."
  },
  {
    name: "Organic Sesame Seeds",
    p_rating: "Safe",
    mgPer100g: "60-70mg",
    category: "Other",
    why: "Sesame seeds are low-purine and contain sesamin, an bioactive lignan shown to lower oxidative stress and dampen joint inflammation. They are also packed with magnesium, which supports muscle relaxation (PubMed, 2024)."
  },
  {
    name: "Skim Milk",
    p_rating: "Safe",
    mgPer100g: "Under 5mg",
    category: "Dairy",
    why: "Highly recommended. Promotes rapid uric acid disposal by the kidneys and provides hydrated calcium."
  },
  {
    name: "Cucumbers",
    p_rating: "Safe",
    mgPer100g: "7mg",
    category: "Vegetables",
    why: "Extremely hydrating (95% water) and highly alkaline, helping flush excess uric acid deposits out of joints."
  },
  {
    name: "Eggs",
    p_rating: "Safe",
    mgPer100g: "0mg",
    category: "Dairy",
    why: "Virtually zero purines. An excellent, protein-rich meat substitute that is completely safe for gout diets."
  },
  {
    name: "Blueberries & Strawberries",
    p_rating: "Safe",
    mgPer100g: "Under 10mg",
    category: "Fruits",
    why: "Rich in Vitamin C and antioxidants. Vitamin C acts as a natural uricosuric agent, prompting renal uric acid clearance."
  },
  {
    name: "Brown Rice",
    p_rating: "Safe",
    mgPer100g: "30-40mg",
    category: "Grains",
    why: "Completely safe carbohydrate source. High fiber helps manage glycemic spikes, which is beneficial for metabolic health."
  },
  {
    name: "Celery",
    p_rating: "Safe",
    mgPer100g: "10-15mg",
    category: "Vegetables",
    why: "Celery contains compounds that act as natural diuretics, helping clear uric acid crystals and reducing overall inflammation."
  },
  {
    name: "Black Coffee",
    p_rating: "Safe",
    mgPer100g: "Under 5mg",
    category: "Beverages",
    why: "Moderate coffee intake is associated with reduced uric acid levels because coffee polyphenols help block xanthine oxidase enzymes."
  }
];
