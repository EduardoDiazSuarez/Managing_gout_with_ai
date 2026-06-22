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

// App-Interactive Chat & Skill Execution Endpoint
app.post("/api/gemini/chat", async (req, res) => {
  if (!ai) {
    return res.status(500).json({
      error: "Gemini API key is not configured. Please add GEMINI_API_KEY to your project Secrets.",
    });
  }

  const { message, history } = req.body;
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: "Missing 'message' string parameter." });
  }

  const chatHistory = Array.isArray(history) ? history : [];

  try {
    // Mapping tool/skill declarations
    const logWaterIntakeTool = {
      name: "logWaterIntake",
      description: "Log water consumption (hydration) in milliliters (mL). E.g., user drank 250mL, 500mL, etc.",
      parameters: {
        type: Type.OBJECT,
        properties: {
          amount: {
            type: Type.NUMBER,
            description: "The amount of water drank in mL.",
          },
        },
        required: ["amount"],
      },
    };

    const logUricAcidTool = {
      name: "logUricAcid",
      description: "Log the user's latest clinical Uric Acid test level in mg/dL.",
      parameters: {
        type: Type.OBJECT,
        properties: {
          value: {
            type: Type.NUMBER,
            description: "Uric Acid level in mg/dL, typically between 2.0 and 12.0.",
          },
          notes: {
            type: Type.STRING,
            description: "Optional details such as 'fasting test' or 'lab drawn'.",
          },
        },
        required: ["value"],
      },
    };

    const logFlareUpTool = {
      name: "logFlareUp",
      description: "Log an active gout flare-up attack under different joints.",
      parameters: {
        type: Type.OBJECT,
        properties: {
          joint: {
            type: Type.STRING,
            description: "The joint affected (e.g. 'Left Big Toe', 'Right Knee', 'Wrist').",
          },
          painLevel: {
            type: Type.NUMBER,
            description: "Pain level on a scale from 1 (minor throbbing) to 10 (intense pain).",
          },
          triggers: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Potential triggers, e.g., ['Seafood', 'Alcohol', 'Dehydration', 'Red Meat'].",
          },
          remediesTaken: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Any natural remedies consumed, e.g., ['Tart Cherry', 'Lemon Juice', 'Ice Compress'].",
          },
          notes: {
            type: Type.STRING,
            description: "Any extra notes about the swell, redness, or timing.",
          },
        },
        required: ["joint", "painLevel"],
      },
    };

    const resolveActiveFlareTool = {
      name: "resolveActiveFlare",
      description: "Mark the currently active joint flare-up as completely resolved/healed.",
      parameters: {
        type: Type.OBJECT,
        properties: {},
      },
    };

    const logExerciseTool = {
      name: "logExercise",
      description: "Log a clean, low-impact exercise or stretching session.",
      parameters: {
        type: Type.OBJECT,
        properties: {
          activityType: {
            type: Type.STRING,
            description: "Must be exactly one of: 'Walking', 'Cycling', 'Swimming', 'Stretching/Yoga', 'Elliptical', 'Other'.",
          },
          duration: {
            type: Type.NUMBER,
            description: "Duration of exercise in minutes.",
          },
          jointStrain: {
            type: Type.NUMBER,
            description: "Self-assessed strain on joints from 1 (no strain) to 10 (intense strain).",
          },
          remissionPhase: {
            type: Type.BOOLEAN,
            description: "Setting this to true represents the user's systemic joints are silent. False means flare recovery.",
          },
          notes: {
            type: Type.STRING,
            description: "Any specific notes, e.g. 'Morning spin'.",
          },
        },
        required: ["activityType", "duration", "jointStrain", "remissionPhase"],
      },
    };

    const logSleepTool = {
      name: "logSleep",
      description: "Log night sleep or daytime joint rest logs.",
      parameters: {
        type: Type.OBJECT,
        properties: {
          hours: {
            type: Type.NUMBER,
            description: "Amount of sleep or rest hours.",
          },
          quality: {
            type: Type.STRING,
            description: "Must be exactly one of: 'Excellent', 'Good', 'Fair', 'Poor'.",
          },
          restlessJoints: {
            type: Type.BOOLEAN,
            description: "True if joint pain caused restlessness or woke the patient up. False otherwise.",
          },
          meditationCompleted: {
            type: Type.BOOLEAN,
            description: "True if therapeutic guided breathing/joint decompression was done before bed.",
          },
          notes: {
            type: Type.STRING,
            description: "Optional notes about the sleep quality or comfort.",
          },
        },
        required: ["hours", "quality", "restlessJoints", "meditationCompleted"],
      },
    };

    const addWatchlistFoodTool = {
      name: "addWatchlistFood",
      description: "Add a protective gout-superfood or custom natural remedy to the preventive watchlist.",
      parameters: {
        type: Type.OBJECT,
        properties: {
          name: {
            type: Type.STRING,
            description: "The food or supplement name (e.g. 'Tart Cherry Extract', 'Celery Seeds').",
          },
          servingSize: {
            type: Type.STRING,
            description: "E.g., '1 cup', '500mg capsules', '2 tablespoons (approx. 30ml)'.",
          },
          frequency: {
            type: Type.STRING,
            description: "Must be exactly: 'Daily', 'During Active Flares', 'Occasional Maintenance'.",
          },
          mechanism: {
            type: Type.STRING,
            description: "Scientific explanation of how it influences purine structures or clearances.",
          },
          category: {
            type: Type.STRING,
            description: "Must be exactly: 'Fruit', 'Vegetable', 'Beverage', 'Dairy', 'Herbal/Seasoning', 'Other'.",
          },
          notes: {
            type: Type.STRING,
            description: "Self notes about sourcing or preferences.",
          },
        },
        required: ["name", "servingSize", "frequency", "category"],
      },
    };

    const systemInstruction = `You are "Guru Gouty", the Gout Companion AI Care Coach — an empathetic, scientifically rigorous clinical health coach specializing in rheumatology, natural uric acid clearance, and metabolics.

Your core mission is to help gout sufferers manage high uric acid levels through science-backed, evidence-based lifestyle changes, dietary planning, hydration tracking, and therapeutic rest.

CRITICAL INSTRUCTIONS & DESIGN GUIDELINES:
1. SCIENTIFIC EVIDENCE-BASED CITATIONS:
   Always tag health, nutritional, or molecular purine claims with prestigious medical source labels. Use formats like:
   - *(PubMed, 2024)* or *(PubMed)*
   - *(Healthline Medically Reviewed)* or *(Healthline)*
   - *(Mayo Clinic)* or *(Cleveland Clinic)*
   State limitations clearly; distinguish between observational lifestyle correlations and clinical trials.

2. COMPANION APP SKILLS & FUNCTIONS:
   You are empowered with real-time tools to log data into the user's active journal.
   If the user reports an activity, clinical result, beverage intake, or symptom, you MUST invoke the appropriate tool:
   - "logWaterIntake" for drinking water.
   - "logUricAcid" for clinical lab test readings. Target is <6.0 mg/dL for gout prevention.
   - "logFlareUp" when reporting sudden throbbing joint pain, heat, redness. Scale 1-10.
   - "resolveActiveFlare" when the attack is cleared.
   - "logExercise" for gentle joint-safe cardio or recovery.
   - "logSleep" for rest quality logging.
   - "addWatchlistFood" to add superfoods or herbal aids (e.g. Lemon juice, Tart Cherry, Cacao, Roasted Batata) to their active preventive watch-list.
   When you invoke a tool, ALWAYS simultaneously supply a highly supportive, empathetic, and instructive text response explaining the physiological benefit of what was tracked and confirming the record.

3. PRECISE MEDICAL & NUTRITION PROTOCOLS:
   - HYDRATION: Emphasize 2.5L to 3L daily of pure water to maximize renal filtration and wash crystal blockages out of the body.
   - PROBIOTICS STAMP RULES (PubMed, Healthline): Suggest low-fat traditional plain yogurts with active cultures (L. bulgaricus, S. thermophilus, B. lactis, L. acidophilus) to metabolize systemic purines. Explain that patients must strictly avoid strains named Lactobacillus casei or Lactobacillus paracasei because they increase cumulative renal load and may trigger flares.
   - ACID-BASE OR ALKALINITY: Highlight the benefits of unsweetened lemon juice (Vitamin C + Citric acid to alkalize urine, facilitating crystal dissolution *(Healthline)*), roasted batata (alkaline, rich in potassium & Vitamin C *(Mayo Clinic)*), unsweetened cacao (polyphenols to calm local articular tissues *(PubMed)*).
   - PURINES: Categorize purine loads strictly (e.g., seafood, beer/alcohol, organ meats, yeast extract, high-fructose corn syrup are HIGH purine and must be avoided). Low-fat dairy and eggs are safe and pure low-purine proteins.

4. EMOTIONAL TONE & MEDICAL DISCLAIMER:
   Speak with professional composure, warmth, and absolute clinical precision. Always append at the end of guidance (where appropriate) a gentle reminder that lifestyle tracking is supportive and cannot replace primary rheumatological advice or prescribed medications (e.g., Allopurinol).`;

    const contents = [
      ...chatHistory.map((h: any) => ({
        role: h.role, // "user" or "model"
        parts: [{ text: h.text }]
      })),
      {
        role: "user",
        parts: [{ text: message }]
      }
    ];

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction,
        tools: [
          {
            functionDeclarations: [
              logWaterIntakeTool,
              logUricAcidTool,
              logFlareUpTool,
              resolveActiveFlareTool,
              logExerciseTool,
              logSleepTool,
              addWatchlistFoodTool,
            ],
          },
        ],
      },
    });

    const text = response.text || "";
    const toolCalls = response.functionCalls || [];

    return res.json({ text, toolCalls });
  } catch (error: any) {
    console.error("Gemini chat error:", error);
    return res.status(500).json({
      error: "Guru Gouty is currently compiling research. " + (error instanceof Error ? error.message : String(error)),
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
