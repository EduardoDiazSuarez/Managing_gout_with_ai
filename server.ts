import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with recommended user agent settings and process environment
const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Health Endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", aiEnabled: !!ai });
});

// Gout Food Purine Analysis Endpoint
app.post("/api/gemini/food-analysis", async (req, res) => {
  if (!ai) {
    return res.status(500).json({
      error: "Gemini API key is not configured. Please add GEMINI_API_KEY to your project Secrets.",
    });
  }

  const { foodQuery } = req.body;
  if (!foodQuery || typeof foodQuery !== 'string' || foodQuery.trim().length === 0) {
    return res.status(400).json({ error: "Missing foodQuery parameter" });
  }

  try {
    const prompt = `Analyze the food or meal or ingredients given: "${foodQuery}". Rate its purine content, explain its uric acid impact on gout patients, supply safety tips and list safe low-purine alternatives.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an expert clinical dietician specializing in rheumatology and gout disease management. Provide accurate, evidence-based nutrition advice for gout prevention, identifying purine rich components and providing helpful guides. Strictly stick to natural remedies, supplements (like Tart Cherry, Celery extract, Bromelain), hydration, and lifestyle advice. Avoid recommending pharmaceutical medications like Allopurinol or Colchicine. Crucial yogurt rule: For any yogurt/probotic product, always check and analyze the probiotic strains. Plain traditional starters (Lactobacillus bulgaricus, Streptococcus thermophilus, Bifidobacterium lactis, and Lactobacillus acidophilus) are safe and help digest purines. Advise patients to strictly avoid strains like Lactobacillus casei or Lactobacillus paracasei because they can increase cumulative renal load.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["foodName", "purineRating", "ratingExplanation", "uricAcidImpact", "safetyTips", "lowPurineAlternatives"],
          properties: {
            foodName: {
              type: Type.STRING,
              description: "The name of the food or meal analyzed.",
            },
            purineRating: {
              type: Type.STRING,
              description: "Must be exactly one of: 'Safe' (low purine), 'Moderate' (medium purine), or 'High' (high purine, avoid).",
            },
            ratingExplanation: {
              type: Type.STRING,
              description: "Explain why this food got this status, noting specific high-purine ingredients or components like high fructose corn syrup, beer, seafood, yeast, or red meat.",
            },
            uricAcidImpact: {
              type: Type.STRING,
              description: "Describe the physiological outcome on uric acid levels (e.g. rapid conversion to uric acid, triggers local inflammation, slows down kidney excretion).",
            },
            safetyTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Provide exactly three highly practical tips for gout sufferers eating or replacing this food.",
            },
            lowPurineAlternatives: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Provide exactly three delicious, low-purine alternatives that can safely satisfy this craving or serve as healthy substitutes.",
            },
          },
        },
      },
    });

    const jsonText = response.text;
    if (!jsonText) {
      throw new Error("Unable to extract response text from Gemini API.");
    }

    const analyzedData = JSON.parse(jsonText.trim());
    return res.json(analyzedData);
  } catch (error: any) {
    console.error("Gemini food analysis error:", error);
    return res.status(500).json({
      error: "Failed to analyze food. " + (error instanceof Error ? error.message : String(error)),
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    
    // Express v4 asset fallback
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
