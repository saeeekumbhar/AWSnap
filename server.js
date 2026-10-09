// server.ts
import express from "express";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
dotenv.config();
var __dirname = path.dirname(fileURLToPath(import.meta.url));
var geminiApiKey = process.env.GEMINI_API_KEY;
var ai = geminiApiKey ? new GoogleGenAI({
  apiKey: geminiApiKey,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build"
    }
  }
}) : null;
async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3e3;
  app.use(express.json({ limit: "15mb" }));
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      hasApiKey: !!geminiApiKey,
      timestamp: Date.now()
    });
  });
  app.post("/api/generate-avatar", async (req, res) => {
    try {
      const { imageBase64, playerName } = req.body;
      if (!imageBase64) {
        return res.status(400).json({ error: "Missing imageBase64 payload" });
      }
      const matches = imageBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      let mimeType = "image/jpeg";
      let cleanBase64 = imageBase64;
      if (matches && matches.length === 3) {
        mimeType = matches[1];
        cleanBase64 = matches[2];
      }
      if (!ai) {
        console.warn("Gemini API key not configured, falling back to default Minecraft character profile.");
        return res.json({
          success: true,
          traits: {
            skinTone: "#E0AA8B",
            hairColor: "#4A2E1B",
            hairStyle: "short",
            eyeColor: "#2B4A6F",
            hasGlasses: false,
            glassesColor: "#161D26",
            hasBeard: false,
            beardColor: "#4A2E1B",
            clothingPrimary: "#FF9900",
            clothingSecondary: "#6B21A8",
            clothingStyle: "hoodie",
            expression: "confident"
          },
          stats: {
            rizzLevel: "10/10",
            flagStatus: "Green?",
            auraPoints: "1000+",
            socialBattery: "LOW"
          },
          characterDescription: "AWS Student Builder ready for production deployment."
        });
      }
      const prompt = `Analyze this webcam photograph of a person. You are generating an authentic Minecraft-style 8-bit character avatar for them at the AWS Student Builders Guild NMIET photo booth.

Examine the person in the photo and extract their visual characteristics so they can be turned into a blocky Minecraft human character:
1. Skin tone: closest hex code (e.g. #FCD0B4, #E0AA8B, #C68642, #8D5524, #5C3836)
2. Hair color: closest hex code (e.g. #2C221E, #4A3728, #B58150, #E6BE8A, #A52A2A, #808080)
3. Hair style: one of ["short", "parted", "spiky", "curly", "wavy", "long", "bun", "buzzcut", "bald"]
4. Eye color: closest hex code (e.g. #3B2F2F, #3D5A80, #588157, #6B4E71, #2B2B2B)
5. Glasses: boolean (true if wearing eyeglasses or sunglasses)
6. Glasses color: hex code if present, else "#000000"
7. Facial hair: boolean (true if beard, mustache or goatee present)
8. Beard color: hex code if present
9. Clothing primary color: dominant color of their shirt/jacket/top (hex code)
10. Clothing secondary color: accent or secondary clothing color (hex code)
11. Clothing style: one of ["tshirt", "hoodie", "jacket", "shirt", "sweater"]
12. Expression: one of ["smile", "grin", "neutral", "confident"]

Also generate 4 fun AWS community event card stats:
- rizzLevel: usually "10/10", "11/10", "Over 9000", or "100%"
- flagStatus: usually "Green?", "Super Green", "All Green", or "Certified Green"
- auraPoints: usually "1000+", "5000+", "9999+", or "+Infinity"
- socialBattery: usually "LOW", "CHARGING", "42%", or "REBOOTING"

Respond strictly with valid JSON without markdown fences. Format:
{
  "skinTone": "#hex",
  "hairColor": "#hex",
  "hairStyle": "string",
  "eyeColor": "#hex",
  "hasGlasses": false,
  "glassesColor": "#hex",
  "hasBeard": false,
  "beardColor": "#hex",
  "clothingPrimary": "#hex",
  "clothingSecondary": "#hex",
  "clothingStyle": "string",
  "expression": "string",
  "stats": {
    "rizzLevel": "10/10",
    "flagStatus": "Green?",
    "auraPoints": "1000+",
    "socialBattery": "LOW"
  },
  "characterDescription": "string"
}`;
      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: [
          {
            role: "user",
            parts: [
              {
                inlineData: {
                  mimeType,
                  data: cleanBase64
                }
              },
              {
                text: prompt
              }
            ]
          }
        ]
      });
      const responseText = response.text ? response.text.trim() : "";
      let cleanJson = responseText;
      if (cleanJson.startsWith("```json")) {
        cleanJson = cleanJson.replace(/^```json\s*/, "").replace(/\s*```$/, "");
      } else if (cleanJson.startsWith("```")) {
        cleanJson = cleanJson.replace(/^```\s*/, "").replace(/\s*```$/, "");
      }
      let parsedData;
      try {
        parsedData = JSON.parse(cleanJson);
      } catch (parseErr) {
        console.warn("Failed to parse Gemini response as JSON:", responseText);
        parsedData = {
          skinTone: "#E0AA8B",
          hairColor: "#4A2E1B",
          hairStyle: "short",
          eyeColor: "#2B4A6F",
          hasGlasses: false,
          glassesColor: "#161D26",
          hasBeard: false,
          beardColor: "#4A2E1B",
          clothingPrimary: "#FF9900",
          clothingSecondary: "#6B21A8",
          clothingStyle: "hoodie",
          expression: "confident",
          stats: {
            rizzLevel: "10/10",
            flagStatus: "Green?",
            auraPoints: "1000+",
            socialBattery: "LOW"
          },
          characterDescription: "AWS Student Builder Minecraft Avatar"
        };
      }
      return res.json({
        success: true,
        traits: {
          skinTone: parsedData.skinTone || "#E0AA8B",
          hairColor: parsedData.hairColor || "#4A2E1B",
          hairStyle: parsedData.hairStyle || "short",
          eyeColor: parsedData.eyeColor || "#2B4A6F",
          hasGlasses: Boolean(parsedData.hasGlasses),
          glassesColor: parsedData.glassesColor || "#161D26",
          hasBeard: Boolean(parsedData.hasBeard),
          beardColor: parsedData.beardColor || parsedData.hairColor || "#4A2E1B",
          clothingPrimary: parsedData.clothingPrimary || "#FF9900",
          clothingSecondary: parsedData.clothingSecondary || "#6B21A8",
          clothingStyle: parsedData.clothingStyle || "hoodie",
          expression: parsedData.expression || "confident"
        },
        stats: {
          rizzLevel: parsedData.stats?.rizzLevel || "10/10",
          flagStatus: parsedData.stats?.flagStatus || "Green?",
          auraPoints: parsedData.stats?.auraPoints || "1000+",
          socialBattery: parsedData.stats?.socialBattery || "LOW"
        },
        characterDescription: parsedData.characterDescription || "Reconstructed Minecraft 8-bit Character"
      });
    } catch (err) {
      console.error("Error generating avatar:", err);
      return res.status(500).json({
        error: err.message || "Avatar generation failed",
        fallbackTraits: {
          skinTone: "#E0AA8B",
          hairColor: "#4A2E1B",
          hairStyle: "short",
          eyeColor: "#2B4A6F",
          hasGlasses: false,
          glassesColor: "#161D26",
          hasBeard: false,
          beardColor: "#4A2E1B",
          clothingPrimary: "#FF9900",
          clothingSecondary: "#6B21A8",
          clothingStyle: "hoodie",
          expression: "confident",
          stats: {
            rizzLevel: "10/10",
            flagStatus: "Green?",
            auraPoints: "1000+",
            socialBattery: "LOW"
          }
        }
      });
    }
  });
  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.resolve(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(__dirname, "dist", "index.html"));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AWSnap server running at http://0.0.0.0:${PORT}`);
  });
}
startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
