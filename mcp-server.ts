import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

// Load environment variables for local testing
dotenv.config();

// Ensure GEMINI_API_KEY is available
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Initialize the Google GenAI Client
const aiClient = GEMINI_API_KEY ? new GoogleGenAI({ apiKey: GEMINI_API_KEY }) : null;

// Initialize MCP Server
const server = new Server(
  {
    name: "gemi-coach-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Virtual Gout Care Database State (tracks in-memory logs for the current session)
const mcpDatabase = {
  hydration: { amount: 0, target: 2500 },
  uricAcidHistory: [] as { date: string; value: number }[],
  activeFlares: [] as { id: string; severity: number; location: string; date: string; notes?: string }[],
  loggedFoods: [] as { name: string; servingSize?: string; frequency?: string; timestamp: string }[],
  exerciseHistory: [] as { type: string; hours: number; date: string }[],
  sleepHistory: [] as { hours: number; quality: string; date: string }[],
};

// Guardrail keywords to ensure answers remain focused on gout, rheumatology, and associated diagnostics
const isGoutRelated = (text: string): boolean => {
  const query = text.toLowerCase();
  const goutKeywords = [
    "gout", "uric", "acid", "flare", "joint", "toe", "ankle", "knee", "purine",
    "hydration", "water", "kidney", "renal", "inflammation", "rheumatologist", "gemi", "coach",
    "cherry", "cherries", "lemon", "yogurt", "batata", "sweet potato", "beer", "seafood",
    "alcohol", "meat", "fructose", "allopurinol", "colchicine", "indomethacin", "symptom", "pain",
    "exercise", "sleep", "recovery", "diet", "nutrition", "drink"
  ];
  return goutKeywords.some((keyword) => query.includes(keyword));
};

// System Instruction Chat that enforces clinical guidance and decision-making engine
const SYSTEM_INSTRUCTION_MCP = `You are Gemi Coach, an empathetic expert rheumatologist assistant and Gout Care Coach. Provide evidence-backed guidance (PubMed, Mayo Clinic, Healthline). DO NOT perform any remote side-effects.

CRITICAL DECISION-MAKING ENGINE (YOUR SKILL DETERMINATION RULE):
You must analyze the user's message to determine if it is a logging request (requiring a toolCall) or a research/informational request (requiring ONLY a written answer):

1. WHEN TO USE TOOL CALLS (LOGGING / ACTION):
- Use 'log-water' ONLY when the user explicitly states they have drunk water or want to record/log water intake (e.g., "I just had a glass of water", "log 400ml water", "drank water").
- Use 'add-natural-food' ONLY when the user explicitly states they ate a food, want to track/add a food to their list, or check it off (e.g., "I ate some lemon", "add yogurt to my list", "log sweet potato").
- Use 'log-ua' ONLY when they want to record a specific uric acid level reading.
- Use 'add-flare' ONLY when they want to report/log a new gout flare up.
- Use 'resolve-flare' ONLY when they want to mark a flare as resolved.
- Use 'add-exercise' / 'add-sleep' ONLY when they explicitly ask to log physical activity or sleep hours.
- If they ask for any of the above logging actions, you MUST include the corresponding toolCall in the 'toolCalls' array.

2. WHEN TO GENERATE A WRITTEN ANSWER ONLY (RESEARCH / ADVICE):
- If the user asks questions about whether a food is good or bad (e.g. "Is yogurt good for gout?", "Why are sweet potatoes recommended?"), or asks for research, medical studies, diet plans, home remedies, or science explanations.
- DO NOT log a button or trigger 'add-natural-food' / 'log-water' for these questions!
- Instead, perform research conceptually and provide an empathetic, evidence-backed, structured written explanation in the 'text' response.
- In this case, the 'toolCalls' array MUST be empty [].

Be concise, clear, and professional.`;

// Define tools supported by Gemi Coach
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "ask_gemi_coach",
        description: "Inquire Gemi Coach regarding gout flare-ups, joint pain, recommended low-purine foods, hydration targets, and rheumatology metrics.",
        inputSchema: {
          type: "object",
          properties: {
            message: {
              type: "string",
              description: "The user query or description of symptoms / diet query."
            }
          },
          required: ["message"]
        }
      },
      {
        name: "log_water",
        description: "Log water consumption in ml (helps dilute uric acid and prevent painful kidney stone or joint crystallization).",
        inputSchema: {
          type: "object",
          properties: {
            amount: {
              type: "number",
              description: "Volume of water in ml (e.g., 250, 500, 750)."
            }
          },
          required: ["amount"]
        }
      },
      {
        name: "add_natural_food",
        description: "Add a natural clinical food (lemon, yogurt, batata) or dietary supplement to the gout monitoring list.",
        inputSchema: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "Name of the food item or supplement."
            },
            servingSize: {
              type: "string",
              description: "The portion size consumed (e.g., '1 medium lemon', '150g greek yogurt')."
            },
            frequency: {
              type: "string",
              description: "E.g., 'Daily', 'Weekly'."
            }
          },
          required: ["name"]
        }
      },
      {
        name: "log_uric_acid",
        description: "Log a specific uric acid (UA) level test result in mg/dL (target is usually below 6.0 mg/dL).",
        inputSchema: {
          type: "object",
          properties: {
            value: {
              type: "number",
              description: "Uric acid reading in mg/dL."
            }
          },
          required: ["value"]
        }
      },
      {
        name: "add_flare",
        description: "Log a painful gout flare-up onset with location and severity.",
        inputSchema: {
          type: "object",
          properties: {
            severity: {
              type: "number",
              description: "Pain scale ranking from 1 (mild) to 10 (excruciating)."
            },
            location: {
              type: "string",
              description: "Affected joint (e.g., 'Big Toe', 'Ankle', 'Knee')."
            },
            notes: {
              type: "string",
              description: "Any triggers or auxiliary comments (e.g., 'Ate steak last night')."
            }
          },
          required: ["severity", "location"]
        }
      },
      {
        name: "resolve_flare",
        description: "Mark the active gout flare-up as resolved/cleared.",
        inputSchema: {
          type: "object",
          properties: {},
          required: []
        }
      }
    ]
  };
});

// Implement execution handler for tool requests
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  const timestamp = new Date().toLocaleDateString();

  // Redirect to stderr for debugging (stdout is exclusively used by the protocol stream)
  console.error(`[MCP Tool Request] Executing tool '${name}' with arguments:`, args);

  try {
    switch (name) {
      case "ask_gemi_coach": {
        const message = String((args as any)?.message || "").trim();
        if (!message) {
          return {
            content: [{ type: "text", text: "Please enter a non-empty query for Gemi Coach." }],
          };
        }

        // Apply strict guardrails to ensure topics are relevant to Gout Care
        if (!isGoutRelated(message)) {
          return {
            content: [{
              type: "text",
              text: "As Gemi Coach, your expert rheumatology and Gout Coach, I focus on assisting with gout management, hydration targets, uric acid diagnostics, and flare-up relief. To ensure your health journey stays on track, please ask a question related to gout care, purines, joint wellness, or clinical diets!"
            }],
          };
        }

        if (!aiClient) {
          return {
            content: [{
              type: "text",
              text: "Gemi Coach Client is offline. GEMINI_API_KEY environment variable is not configured. Please supply a valid key in your environment to run conversational AI diagnostics."
            }],
          };
        }

        // Generate response using structured JSON output mimicking the production server
        const response = await aiClient.models.generateContent({
          model: "gemini-3.5-flash",
          contents: [{ role: "user", parts: [{ text: message }] }],
          config: {
            systemInstruction: SYSTEM_INSTRUCTION_MCP,
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                text: {
                  type: Type.STRING,
                  description: "Empathetic, evidence-backed clinical guidance for gout care."
                },
                toolCalls: {
                  type: Type.ARRAY,
                  description: "Recommended logging tool calls if the user reported any biometrics or logs.",
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      args: { type: Type.OBJECT }
                    },
                    required: ["name", "args"]
                  }
                }
              },
              required: ["text", "toolCalls"]
            }
          }
        });

        const parsed = JSON.parse(response.text || "{}");
        let aiText = parsed.text || "I apologize, I could not synthesize a proper structured response.";
        const proposedCalls = parsed.toolCalls || [];

        if (proposedCalls.length > 0) {
          aiText += `\n\n📌 *Proposed Skills Detected*: Gemi Coach recommends calling the following tools: ${proposedCalls.map((c: any) => `'${c.name}'`).join(", ")}`;
        }

        return {
          content: [{ type: "text", text: aiText }],
        };
      }

      case "log_water": {
        const amount = Number((args as any)?.amount || 250);
        mcpDatabase.hydration.amount += amount;
        return {
          content: [{
            type: "text",
            text: `💧 Successfully logged +${amount}ml water. Current hydration is ${mcpDatabase.hydration.amount}ml / ${mcpDatabase.hydration.target}ml.`
          }],
        };
      }

      case "add_natural_food": {
        const foodName = String((args as any)?.name || "").trim();
        const servingSize = String((args as any)?.servingSize || "1 serving");
        const frequency = String((args as any)?.frequency || "Daily");

        if (!foodName) {
          return { content: [{ type: "text", text: "Error: Food name is required." }] };
        }

        mcpDatabase.loggedFoods.push({ name: foodName, servingSize, frequency, timestamp });
        return {
          content: [{
            type: "text",
            text: `🥗 Successfully tracked '${foodName}' in Gemi watch list. Details: ${servingSize} (${frequency}).`
          }],
        };
      }

      case "log_uric_acid": {
        const val = Number((args as any)?.value);
        if (isNaN(val)) {
          return { content: [{ type: "text", text: "Error: A numeric Uric Acid value is required." }] };
        }

        mcpDatabase.uricAcidHistory.push({ date: timestamp, value: val });
        const targetAdvice = val < 6.0 
          ? "Excellent! This is below the general clinical target threshold of 6.0 mg/dL." 
          : "Heads up: This is elevated. Diluting your serum with extra hydration and adhering to low-purine ingredients is advised.";

        return {
          content: [{
            type: "text",
            text: `📈 Recorded Uric Acid Reading: ${val} mg/dL on ${timestamp}. ${targetAdvice}`
          }],
        };
      }

      case "add_flare": {
        const severity = Number((args as any)?.severity || 5);
        const location = String((args as any)?.location || "Joint");
        const notes = (args as any)?.notes;

        mcpDatabase.activeFlares.push({
          id: `flare-${Date.now()}`,
          severity,
          location,
          date: timestamp,
          notes,
        });

        return {
          content: [{
            type: "text",
            text: `⚠️ Logged active Gout Flare-Up: Severity ${severity}/10 located at the ${location}. Recommended: Elevate joint, apply a cold compress, avoid all high-purine catalysts, and consult your rheumatologist.`
          }],
        };
      }

      case "resolve_flare": {
        mcpDatabase.activeFlares = [];
        return {
          content: [{
            type: "text",
            text: `✅ Marked active gout flare-ups as fully resolved! Keep up with your hydration routine to maintain a low crystallization risk.`
          }],
        };
      }

      default:
        throw new Error(`Tool '${name}' not found.`);
    }
  } catch (error: any) {
    console.error(`[MCP Error] Tool '${name}' failed:`, error);
    return {
      content: [{ type: "text", text: `Failure: ${error.message}` }],
      isError: true,
    };
  }
});

// Run server using STDIO transport protocol
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("🟢 Gemi Coach Gout Assistant MCP Server successfully running on STDIO transport.");
}

main().catch((error) => {
  console.error("🔴 Fatal error initializing Gemi Coach MCP Server:", error);
  process.exit(1);
});
