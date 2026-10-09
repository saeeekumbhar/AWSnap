import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Initialize Gemini client with mandatory User-Agent
const geminiApiKey = process.env.GEMINI_API_KEY;
const ai = geminiApiKey
  ? new GoogleGenAI({
      apiKey: geminiApiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  // Accept up to 15MB for webcam base64 payloads
  app.use(express.json({ limit: '15mb' }));

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      hasApiKey: !!geminiApiKey,
      timestamp: Date.now(),
    });
  });

  // Avatar generation endpoint
  app.post('/api/generate-avatar', async (req, res) => {
    try {
      const { imageBase64, playerName } = req.body;

      if (!imageBase64) {
        return res.status(400).json({ error: 'Missing imageBase64 payload' });
      }

      // Extract raw base64 data and mime type
      const matches = imageBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      let mimeType = 'image/jpeg';
      let cleanBase64 = imageBase64;

      if (matches && matches.length === 3) {
        mimeType = matches[1];
        cleanBase64 = matches[2];
      }

      if (!ai) {
        console.warn('Gemini API key not configured, falling back to default Minecraft character profile.');
        return res.json({
          success: true,
          traits: {
            skinTone: '#E0AA8B',
            hairColor: '#4A2E1B',
            hairStyle: 'short',
            eyeColor: '#2B4A6F',
            hasGlasses: false,
            glassesColor: '#161D26',
            hasBeard: false,
            beardColor: '#4A2E1B',
            clothingPrimary: '#FF9900',
            clothingSecondary: '#6B21A8',
            clothingStyle: 'hoodie',
            expression: 'confident',
          },
          stats: {
            rizzLevel: '10/10',
            flagStatus: 'Green?',
            auraPoints: '1000+',
            socialBattery: 'LOW',
          },
          characterDescription: 'AWS Student Builder ready for production deployment.',
        });
      }

      console.log(`[AWSnap API] Received avatar generation request (${cleanBase64.length} chars)`);

      // Call Gemini Vision to analyze the visitor's photo with structured JSON
      const prompt = `Analyze this real photograph of a person taken at the AWSnap event photo booth.
Your task is to accurately extract their real visual features so we can generate an authentic, personalized 8-bit retro pixel art avatar portrait that truly looks like THEM.

CRITICAL INSTRUCTIONS:
1. GENDER & PRESENTATION:
   - Carefully determine if the person presents as female or male.
   - For a female, set isFemale: true and gender: "female".
   - For a male, set isFemale: false and gender: "male".
   - Feminine avatars will get delicate facial features, anime eye lashes, soft lips, and authentic female hair/outfit options.

2. REAL CLOTHING & OUTFIT (LOOK CAREFULLY AT WHAT THEY ARE ACTUALLY WEARING):
   - clothingType: Identify what they are wearing:
       "tshirt" (crewneck/v-neck t-shirt)
       "hoodie" (hoodie / sweatshirt with hood and drawstrings)
       "sweater" (knit sweater / turtleneck)
       "collared_shirt" (formal or casual button-up shirt with collar)
       "jacket_tee" (jacket or denim over a t-shirt)
       "tank_top" (sleeveless top / tank)
       "zipper_polo" (polo with zipper or collar)
   - clothingPrimary: Sample the EXACT dominant hex color of their top/shirt from the photo! (Do not default to green or orange. If they wear black, use #1A1A1A. If white, #F3F4F6. If navy, #1E293B. If beige, #D4C3B3. If red, #DC2626, etc.)
   - clothingSecondary: Accent color (collar, drawstrings, buttons, undershirt, or trim) sampled from the photo.
   - clothingDetail: "drawstrings" | "swoosh" | "chain" | "zipper" | "buttons" | "none".

3. HAIR STYLE & COLOR:
   - Look at their hair length, cut, and texture:
       "long_straight" (long hair cascading down shoulders)
       "long_wavy" (long flowing wavy hair past shoulders)
       "messy_bun_clip" (high top bun with loose side strands & clip)
       "bob_straight_bangs" (sleek bob with straight forehead bangs)
       "ponytail" (high ponytail with front bangs)
       "curly_volume" (voluminous curls / afro / ringlets)
       "messy_anime_layers" (textured layered bangs)
       "minecraft_wavy" (wavy textured short/medium hair)
       "short_crop_fade" (clean modern short crop / fade)
       "buzzcut" (buzzcut or very short)
       "side_part" (classic neat side part)
   - hairColor: EXACT hex color sampled from their hair.
   - hairHighlight: lighter strand highlight hex.
   - hairShadow: deeper shadow hex.
   - hasHairClip: true if hair clip / pin / barrette is visible.

4. SKIN TONE:
   - skinTone: Sample the true base skin tone hex directly from their face (e.g. #FCD0B4, #F5C29B, #E0AA8B, #C68642, #8D5524, #5C3836).
   - skinShade: slightly darker contour/shadow tone hex.
   - skinHighlight: subtle lighter highlight hex.
   - hasBlush: true if rosy cheeks, makeup, or freckles.

5. EYEGLASSES:
   - hasGlasses: true if wearing glasses or sunglasses.
   - glassesStyle: "round_wire" | "thick_rectangular" | "oval_rimless" | "sunglasses" | "none".
   - glassesColor: frame hex color.

6. FACIAL HAIR:
   - hasFacialHair: true ONLY if beard, mustache, or stubble is visible (usually false for females).
   - facialHairStyle: "full_beard" | "mustache" | "stubble" | "none".
   - beardColor: beard hex color.

7. ACCESSORIES & DETAILS:
   - hasEarrings: true if earrings or studs visible on ears.
   - hasNecklace: true if necklace or chain visible on neck.

8. EXPRESSION & EYES:
   - expression: "smile" | "grin" | "calm" | "cute_smirk".
   - eyeColor: eye iris hex color.
   - eyeStyle: for females usually "anime_sparkle" or "warm_friendly"; for males "warm_friendly", "cool_relaxed", or "squinting_smile".

9. BACKGROUND HARMONY:
   - backgroundStyle: "sunflower_field" | "pastel_sky_blue" | "aesthetic_purple" | "warm_cream_studio" | "clean_white_minimal" | "soft_pink_pastel" | "cyber_mint".
   - backgroundColor: hex color that complements their clothing and skin.

10. STATS:
   - rizzLevel, flagStatus, auraPoints, socialBattery (creative, fun AWS builder stats).

Return valid JSON with these fields.`;

      const candidateModels = ['gemini-2.5-flash', 'gemini-3.8-flash', 'gemini-flash-latest'];
      let parsedData: any = null;

      for (const modelName of candidateModels) {
        try {
          console.log(`[AWSnap API] Querying Gemini model: ${modelName}`);
          const response = await ai.models.generateContent({
            model: modelName,
            contents: [
              {
                role: 'user',
                parts: [
                  {
                    inlineData: {
                      mimeType: mimeType,
                      data: cleanBase64,
                    },
                  },
                  {
                    text: prompt,
                  },
                ],
              },
            ],
            config: {
              responseMimeType: 'application/json',
            },
          });

          if (response && response.text) {
            const raw = response.text.trim();
            console.log(`[AWSnap API] Response from ${modelName}:`, raw.slice(0, 200));
            parsedData = JSON.parse(raw);
            break;
          }
        } catch (mErr: any) {
          console.warn(`[AWSnap API] Model ${modelName} call failed, trying next:`, mErr?.message || mErr);
        }
      }

      if (!parsedData) {
        console.warn('[AWSnap API] Vision parsing returned no data, using intelligent fallback');
        parsedData = {};
      }

      const isFemale = Boolean(parsedData.isFemale || parsedData.gender === 'female');
      const detectedTraits = {
        gender: isFemale ? 'female' : 'male',
        isFemale,
        archetype: parsedData.archetype || (isFemale ? 'anime_pixel' : 'retro_hoodie'),
        skinTone: parsedData.skinTone || (isFemale ? '#FCD0B4' : '#E0AA8B'),
        skinShade: parsedData.skinShade || (isFemale ? '#E8B69A' : '#C58F6E'),
        skinHighlight: parsedData.skinHighlight || (isFemale ? '#FEE6D6' : '#FADBC7'),
        hasBlush: parsedData.hasBlush !== undefined ? Boolean(parsedData.hasBlush) : isFemale,
        hairStyle: parsedData.hairStyle || (isFemale ? 'long_straight' : 'short_crop_fade'),
        hairColor: parsedData.hairColor || '#2C1B10',
        hairHighlight: parsedData.hairHighlight || '#4A3222',
        hairShadow: parsedData.hairShadow || '#1A0E08',
        hasHairClip: Boolean(parsedData.hasHairClip),
        eyeColor: parsedData.eyeColor || '#2B4A6F',
        eyeStyle: parsedData.eyeStyle || (isFemale ? 'anime_sparkle' : 'warm_friendly'),
        hasGlasses: Boolean(parsedData.hasGlasses),
        glassesStyle: parsedData.glassesStyle || (parsedData.hasGlasses ? (isFemale ? 'round_wire' : 'thick_rectangular') : 'none'),
        glassesColor: parsedData.glassesColor || '#161D26',
        hasFacialHair: !isFemale && Boolean(parsedData.hasFacialHair),
        facialHairStyle: !isFemale && parsedData.facialHairStyle ? parsedData.facialHairStyle : 'none',
        beardColor: parsedData.beardColor || parsedData.hairColor || '#2C1B10',
        clothingType: parsedData.clothingType || (isFemale ? 'tshirt' : 'hoodie'),
        clothingPrimary: parsedData.clothingPrimary || (isFemale ? '#374151' : '#1E293B'),
        clothingSecondary: parsedData.clothingSecondary || '#9CA3AF',
        clothingDetail: parsedData.clothingDetail || 'none',
        hasEarrings: parsedData.hasEarrings !== undefined ? Boolean(parsedData.hasEarrings) : isFemale,
        hasNecklace: Boolean(parsedData.hasNecklace),
        backgroundStyle: parsedData.backgroundStyle || (isFemale ? 'aesthetic_purple' : 'pastel_sky_blue'),
        backgroundColor: parsedData.backgroundColor || (isFemale ? '#6A567A' : '#88BEE8'),
        expression: parsedData.expression || 'smile',
      };

      console.log(`[AWSnap API] Extracted character traits for ${playerName}:`, {
        gender: detectedTraits.gender,
        hairStyle: detectedTraits.hairStyle,
        clothingType: detectedTraits.clothingType,
        clothingPrimary: detectedTraits.clothingPrimary,
        hasGlasses: detectedTraits.hasGlasses,
      });

      // Return the detected characteristics and stats
      return res.json({
        success: true,
        traits: detectedTraits,
        stats: {
          rizzLevel: parsedData.stats?.rizzLevel || '10/10',
          flagStatus: parsedData.stats?.flagStatus || 'Green?',
          auraPoints: parsedData.stats?.auraPoints || '1000+',
          socialBattery: parsedData.stats?.socialBattery || 'LOW',
        },
        characterDescription: parsedData.characterDescription || 'Personalized AWSnap 8-bit Avatar',
      });
    } catch (err: any) {
      console.error('[AWSnap API] Unhandled error generating avatar:', err);
      return res.status(500).json({
        error: err.message || 'Avatar generation failed',
        fallbackTraits: {
          archetype: 'retro_hoodie',
          skinTone: '#E0AA8B',
          skinShade: '#C58F6E',
          skinHighlight: '#FADBC7',
          hasBlush: true,
          hairStyle: 'curly_volume',
          hairColor: '#3C2817',
          hairHighlight: '#5A3D22',
          hairShadow: '#26190E',
          hasHairClip: false,
          eyeColor: '#2B4A6F',
          eyeStyle: 'warm_friendly',
          hasGlasses: true,
          glassesStyle: 'thick_rectangular',
          glassesColor: '#161D26',
          hasFacialHair: false,
          facialHairStyle: 'none',
          beardColor: '#3C2817',
          clothingType: 'hoodie_drawstrings',
          clothingPrimary: '#2E7D32',
          clothingSecondary: '#D32F2F',
          clothingDetail: 'drawstrings',
          hasEarrings: false,
          hasNecklace: false,
          backgroundStyle: 'pastel_sky_blue',
          backgroundColor: '#88BEE8',
          expression: 'smile',
          stats: {
            rizzLevel: '10/10',
            flagStatus: 'Green?',
            auraPoints: '1000+',
            socialBattery: 'LOW',
          },
        },
      });
    }
  });

  // Setup Vite in development or serve static in production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AWSnap server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
