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
      const prompt = `You are a master 8-bit retro pixel art character designer for the AWSnap photo booth at AWS Student Builders Guild NMIET.
Analyze this visitor webcam photo and create an authentic, personalized 8-bit pixel art character avatar profile inspired by high-quality retro game and anime pixel art portraits.

Examine the person in the photo and extract their visual characteristics so they get a UNIQUE, NON-GENERIC pixel art portrait matching their real look:

1. Archetype / Vibe: Choose the best matching style from:
   ["retro_hoodie", "anime_pixel", "minecraft_scenic", "aesthetic_bob", "curly_retro"]

2. Skin tone:
   - skinTone: accurate base skin hex (e.g. #FCD0B4, #F5C29B, #D49B72, #99603B, #5C3A21, etc.)
   - skinShade: darker contour/shadow hex for jaw and neck
   - skinHighlight: subtle lighter highlight hex for forehead/nose
   - hasBlush: true if rosy cheeks or freckles visible

3. Hair:
   - hairStyle: one of [
       "messy_bun_clip",      // top bun with loose side strands and hair clip (like anime pixel art)
       "minecraft_wavy",      // textured wavy layered hair
       "curly_volume",        // voluminous curly hair with defined curl clusters
       "messy_anime_layers",  // layered parted anime bangs framing face
       "bob_straight_bangs",  // classic sleek bob cut with straight bangs
       "long_wavy_flow",      // long flowing hair over shoulders
       "short_textured_fade", // clean modern fade/crop
       "spiky_anime",         // textured spiky locks
       "side_swept"           // side-parted clean sweep
     ]
   - hairColor: accurate base hex
   - hairHighlight: lighter strand highlight hex
   - hairShadow: deeper shadow hex
   - hasHairClip: boolean (true if hair clip or accessory visible)

4. Eyeglasses:
   - hasGlasses: boolean (true if wearing eyeglasses or sunglasses)
   - glassesStyle: "round_wire" | "thick_rectangular" | "oval_rimless" | "sunglasses" | "none"
   - glassesColor: hex code (e.g. #161D26, #8D5524, #A855F7, etc.)

5. Facial Hair:
   - hasFacialHair: boolean (true if beard, mustache or stubble)
   - facialHairStyle: "full_beard_mustache" | "goatee" | "stubble" | "none"
   - beardColor: hex code

6. Eyes & Expression:
   - eyeColor: hex code
   - eyeStyle: "anime_sparkle" | "warm_friendly" | "cool_relaxed" | "squinting_smile"
   - expression: "smile" | "grin" | "calm" | "confident" | "cute_smirk"

7. Clothing:
   - clothingType: "hoodie_drawstrings" | "sweater_necklace" | "zipper_polo" | "graphic_tee" | "jacket_over_shirt"
   - clothingPrimary: dominant color of their shirt/top (hex code)
   - clothingSecondary: accent color for drawstrings/collar/zipper (hex code)
   - clothingDetail: "swoosh" | "chain" | "zipper" | "drawstrings" | "none"

8. Accessories:
   - hasEarrings: boolean (true if earrings visible)
   - hasNecklace: boolean (true if necklace visible)

9. Background:
   - backgroundStyle: "sunflower_field" | "pastel_sky_blue" | "aesthetic_purple" | "warm_cream_studio" | "clean_white_minimal"
   - backgroundColor: hex code

10. Event Stats:
   - rizzLevel: e.g. "10/10", "11/10", "Over 9000", "100%", "Certified", "W Rizz"
   - flagStatus: e.g. "Green?", "Super Green", "All Green", "Clean Green", "Green Flag"
   - auraPoints: e.g. "1000+", "5000+", "9999+", "+Infinity", "10,000+"
   - socialBattery: e.g. "LOW", "CHARGING", "42%", "REBOOTING", "FULL"
   - characterDescription: one-sentence fun character title

Respond strictly with valid JSON without markdown fences.`;
      const candidateModels = ["gemini-2.5-flash", "gemini-3.8-flash", "gemini-flash-latest"];
      let responseText = "";
      for (const modelName of candidateModels) {
        try {
          const response = await ai.models.generateContent({
            model: modelName,
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
          if (response && response.text) {
            responseText = response.text.trim();
            break;
          }
        } catch (mErr) {
          console.warn(`Model ${modelName} call failed, trying next:`, mErr?.message || mErr);
        }
      }
      let cleanJson = responseText;
      if (cleanJson.startsWith("```json")) {
        cleanJson = cleanJson.replace(/^```json\s*/, "").replace(/\s*```$/, "");
      } else if (cleanJson.startsWith("```")) {
        cleanJson = cleanJson.replace(/^```\s*/, "").replace(/\s*```$/, "");
      }
      let parsedData = {};
      try {
        if (cleanJson) {
          parsedData = JSON.parse(cleanJson);
        }
      } catch (parseErr) {
        console.warn("Failed to parse Gemini response as JSON:", responseText);
      }
      return res.json({
        success: true,
        traits: {
          archetype: parsedData.archetype || "retro_hoodie",
          skinTone: parsedData.skinTone || "#E0AA8B",
          skinShade: parsedData.skinShade || "#C58F6E",
          skinHighlight: parsedData.skinHighlight || "#FADBC7",
          hasBlush: Boolean(parsedData.hasBlush),
          hairStyle: parsedData.hairStyle || "curly_volume",
          hairColor: parsedData.hairColor || "#3C2817",
          hairHighlight: parsedData.hairHighlight || "#5A3D22",
          hairShadow: parsedData.hairShadow || "#26190E",
          hasHairClip: Boolean(parsedData.hasHairClip),
          eyeColor: parsedData.eyeColor || "#2B4A6F",
          eyeStyle: parsedData.eyeStyle || "warm_friendly",
          hasGlasses: Boolean(parsedData.hasGlasses),
          glassesStyle: parsedData.glassesStyle || (parsedData.hasGlasses ? "thick_rectangular" : "none"),
          glassesColor: parsedData.glassesColor || "#161D26",
          hasFacialHair: Boolean(parsedData.hasFacialHair || parsedData.hasBeard),
          facialHairStyle: parsedData.facialHairStyle || (parsedData.hasBeard ? "full_beard_mustache" : "none"),
          beardColor: parsedData.beardColor || parsedData.hairColor || "#3C2817",
          clothingType: parsedData.clothingType || "hoodie_drawstrings",
          clothingPrimary: parsedData.clothingPrimary || "#2E7D32",
          clothingSecondary: parsedData.clothingSecondary || "#D32F2F",
          clothingDetail: parsedData.clothingDetail || "drawstrings",
          hasEarrings: Boolean(parsedData.hasEarrings),
          hasNecklace: Boolean(parsedData.hasNecklace),
          backgroundStyle: parsedData.backgroundStyle || "pastel_sky_blue",
          backgroundColor: parsedData.backgroundColor || "#88BEE8",
          expression: parsedData.expression || "smile"
        },
        stats: {
          rizzLevel: parsedData.stats?.rizzLevel || "10/10",
          flagStatus: parsedData.stats?.flagStatus || "Green?",
          auraPoints: parsedData.stats?.auraPoints || "1000+",
          socialBattery: parsedData.stats?.socialBattery || "LOW"
        },
        characterDescription: parsedData.characterDescription || "AWS Student Builder 8-bit Avatar"
      });
    } catch (err) {
      console.error("Error generating avatar:", err);
      return res.status(500).json({
        error: err.message || "Avatar generation failed",
        fallbackTraits: {
          archetype: "retro_hoodie",
          skinTone: "#E0AA8B",
          skinShade: "#C58F6E",
          skinHighlight: "#FADBC7",
          hasBlush: true,
          hairStyle: "curly_volume",
          hairColor: "#3C2817",
          hairHighlight: "#5A3D22",
          hairShadow: "#26190E",
          hasHairClip: false,
          eyeColor: "#2B4A6F",
          eyeStyle: "warm_friendly",
          hasGlasses: true,
          glassesStyle: "thick_rectangular",
          glassesColor: "#161D26",
          hasFacialHair: false,
          facialHairStyle: "none",
          beardColor: "#3C2817",
          clothingType: "hoodie_drawstrings",
          clothingPrimary: "#2E7D32",
          clothingSecondary: "#D32F2F",
          clothingDetail: "drawstrings",
          hasEarrings: false,
          hasNecklace: false,
          backgroundStyle: "pastel_sky_blue",
          backgroundColor: "#88BEE8",
          expression: "smile",
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
