/**
 * 8-Bit Retro Pixel Art Character Avatar Generator
 * Inspired by authentic retro game and anime pixel art portraits.
 * Renders on a crisp 48x48 pixel matrix scaled up with razor-sharp pixels.
 */

export interface AvatarTraits {
  gender?: 'female' | 'male';
  isFemale?: boolean;
  faceShape?: 'oval' | 'round' | 'square' | 'heart' | 'angular';
  archetype?: 'retro_hoodie' | 'anime_pixel' | 'minecraft_scenic' | 'aesthetic_bob' | 'curly_retro';
  skinTone: string;
  skinShade?: string;
  skinHighlight?: string;
  hasBlush?: boolean;
  hairStyle: string;
  hairColor: string;
  hairHighlight?: string;
  hairShadow?: string;
  hasHairClip?: boolean;
  hairClipColor?: string;
  eyeColor: string;
  eyeStyle?: string;
  hasGlasses: boolean;
  glassesStyle?: string;
  glassesColor: string;
  hasFacialHair?: boolean;
  facialHairStyle?: string;
  hasBeard?: boolean;
  beardColor?: string;
  clothingType?: string;
  clothingPrimary: string;
  clothingSecondary: string;
  clothingDetail?: string;
  clothingStyle?: string; // legacy compatibility
  hasEarrings?: boolean;
  hasNecklace?: boolean;
  backgroundStyle?: string;
  backgroundColor?: string;
  expression: string;
}

export interface CardStats {
  rizzLevel: string;
  flagStatus: string;
  auraPoints: string;
  socialBattery: string;
}

export const DEFAULT_TRAITS: AvatarTraits = {
  gender: 'female',
  isFemale: true,
  archetype: 'anime_pixel',
  skinTone: '#FCD0B4',
  skinShade: '#E8B69A',
  skinHighlight: '#FEE6D6',
  hasBlush: true,
  hairStyle: 'long_straight',
  hairColor: '#2C1B10',
  hairHighlight: '#4A3222',
  hairShadow: '#1A0E08',
  hasHairClip: false,
  eyeColor: '#2B4A6F',
  eyeStyle: 'anime_sparkle',
  hasGlasses: false,
  glassesStyle: 'none',
  glassesColor: '#161D26',
  hasFacialHair: false,
  facialHairStyle: 'none',
  beardColor: '#2C1B10',
  clothingType: 'tshirt',
  clothingPrimary: '#374151',
  clothingSecondary: '#9CA3AF',
  clothingDetail: 'none',
  clothingStyle: 'tshirt',
  hasEarrings: true,
  hasNecklace: false,
  backgroundStyle: 'aesthetic_purple',
  backgroundColor: '#6A567A',
  expression: 'smile',
};

export const DEFAULT_STATS: CardStats = {
  rizzLevel: '10/10',
  flagStatus: 'Green?',
  auraPoints: '1000+',
  socialBattery: 'LOW',
};

// Color shading helper
export function adjustBrightness(hex: string, percent: number): string {
  let cleanHex = (hex || '#888888').replace('#', '');
  if (cleanHex.length === 3) {
    cleanHex = cleanHex
      .split('')
      .map((c) => c + c)
      .join('');
  }
  const num = parseInt(cleanHex, 16) || 0;
  let r = (num >> 16) + Math.round(255 * (percent / 100));
  let g = ((num >> 8) & 0x00ff) + Math.round(255 * (percent / 100));
  let b = (num & 0x0000ff) + Math.round(255 * (percent / 100));

  r = Math.min(255, Math.max(0, r));
  g = Math.min(255, Math.max(0, g));
  b = Math.min(255, Math.max(0, b));

  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

/**
 * Draws the background scenery or studio wash on a 48x48 pixel grid
 */
function renderBackground(ctx: CanvasRenderingContext2D, traits: AvatarTraits, size: number) {
  const bgStyle = traits.backgroundStyle || 'pastel_sky_blue';

  if (bgStyle === 'sunflower_field' || traits.archetype === 'minecraft_scenic') {
    // 1. Blue sky
    ctx.fillStyle = '#72A4D2';
    ctx.fillRect(0, 0, size, 20);

    // Pixel Clouds
    ctx.fillStyle = '#E8EEF5';
    ctx.fillRect(2, 4, 12, 3);
    ctx.fillRect(5, 2, 7, 2);
    ctx.fillRect(4, 7, 8, 1);
    ctx.fillRect(28, 6, 16, 3);
    ctx.fillRect(32, 4, 9, 2);

    // Far hills
    ctx.fillStyle = '#5A7D2C';
    ctx.fillRect(0, 18, size, 4);

    // Sunflowers in field
    ctx.fillStyle = '#486E20';
    ctx.fillRect(0, 22, size, size - 22);

    const drawSunflower = (cx: number, cy: number) => {
      ctx.fillStyle = '#3E611E';
      ctx.fillRect(cx, cy + 2, 1, 6);
      ctx.fillStyle = '#F5C22D';
      ctx.fillRect(cx - 2, cy - 1, 5, 4);
      ctx.fillRect(cx - 1, cy - 2, 3, 6);
      ctx.fillStyle = '#E0AB1E';
      ctx.fillRect(cx - 2, cy, 1, 2);
      ctx.fillRect(cx + 2, cy, 1, 2);
      ctx.fillStyle = '#4E3114';
      ctx.fillRect(cx - 1, cy, 3, 2);
    };

    drawSunflower(3, 19);
    drawSunflower(9, 23);
    drawSunflower(38, 19);
    drawSunflower(44, 23);
    drawSunflower(1, 31);
    drawSunflower(45, 33);
  } else if (bgStyle === 'aesthetic_purple' || traits.archetype === 'anime_pixel') {
    ctx.fillStyle = traits.backgroundColor || '#604D6E';
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = adjustBrightness(traits.backgroundColor || '#604D6E', -12);
    ctx.fillRect(0, size - 14, size, 14);
  } else if (bgStyle === 'warm_cream_studio' || traits.archetype === 'aesthetic_bob') {
    ctx.fillStyle = '#F2E8D8';
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = '#EBE1D0';
    for (let x = 0; x < size; x += 4) {
      ctx.fillRect(x, 0, 1, size);
    }
  } else if (bgStyle === 'soft_pink_pastel') {
    ctx.fillStyle = '#FCE7F3';
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = '#FBCFE8';
    ctx.fillRect(0, size - 12, size, 12);
  } else if (bgStyle === 'clean_white_minimal') {
    ctx.fillStyle = '#FAFAFA';
    ctx.fillRect(0, 0, size, size);
  } else {
    // Pastel sky blue default
    ctx.fillStyle = traits.backgroundColor || '#88BEE8';
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = adjustBrightness(traits.backgroundColor || '#88BEE8', 12);
    ctx.fillRect(0, 0, size, 8);
  }
}

/**
 * Draws torso and clothing matching the real outfit
 */
function renderTorso(ctx: CanvasRenderingContext2D, traits: AvatarTraits, size: number) {
  const isFemale = Boolean(traits.isFemale || traits.gender === 'female');
  const primary = traits.clothingPrimary || (isFemale ? '#374151' : '#1E293B');
  const primaryDark = adjustBrightness(primary, -18);
  const primaryLight = adjustBrightness(primary, 15);
  const secondary = traits.clothingSecondary || '#D32F2F';
  const type = traits.clothingType || (isFemale ? 'tshirt' : 'hoodie');

  // Feminine shoulders are slightly narrower (margin 9-10 vs 7-8)
  const baseMargin = isFemale ? 9 : 7;

  // Base clothing body
  ctx.fillStyle = primary;
  for (let y = 31; y < size; y++) {
    const margin = y < 35 ? Math.max(baseMargin + 1, 38 - y) : baseMargin;
    ctx.fillRect(margin, y, size - margin * 2, 1);
  }

  // Shadow sides
  ctx.fillStyle = primaryDark;
  for (let y = 33; y < size; y++) {
    ctx.fillRect(baseMargin, y, 2, 1);
    ctx.fillRect(size - baseMargin - 2, y, 2, 1);
  }

  // Shoulder highlight seam
  ctx.fillStyle = primaryLight;
  ctx.fillRect(baseMargin + 2, 32, 7, 1);
  ctx.fillRect(size - baseMargin - 9, 32, 7, 1);

  if (type === 'tshirt') {
    // Crewneck or Scoopneck T-shirt
    ctx.fillStyle = isFemale ? primaryDark : adjustBrightness(primary, -25);
    ctx.fillRect(isFemale ? 18 : 19, 31, isFemale ? 12 : 10, isFemale ? 4 : 2);
    // Neck opening showing skin
    const skinTone = traits.skinTone || '#E0AA8B';
    ctx.fillStyle = adjustBrightness(skinTone, -8);
    ctx.fillRect(isFemale ? 19 : 20, 31, isFemale ? 10 : 8, isFemale ? 3 : 2);

    // Collar trim
    ctx.fillStyle = secondary || primaryLight;
    ctx.fillRect(isFemale ? 18 : 19, 30, isFemale ? 12 : 10, 1);
  } else if (type === 'sweater' || type === 'sweater_necklace' || traits.hasNecklace) {
    // Ribbed knit sweater
    ctx.fillStyle = primaryDark;
    ctx.fillRect(17, 31, 14, 3);
    ctx.fillStyle = primaryLight;
    for (let x = 18; x <= 29; x += 2) {
      ctx.fillRect(x, 31, 1, 3);
    }

    // Silver chain necklace
    if (traits.hasNecklace || isFemale) {
      ctx.fillStyle = '#E5E7EB';
      ctx.fillRect(20, 34, 1, 2);
      ctx.fillRect(27, 34, 1, 2);
      ctx.fillRect(21, 36, 1, 2);
      ctx.fillRect(26, 36, 1, 2);
      ctx.fillRect(22, 38, 2, 1);
      ctx.fillRect(24, 38, 2, 1);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(23, 39, 2, 2);
    }
  } else if (type === 'collared_shirt') {
    // Formal / Casual Button-up collared shirt
    ctx.fillStyle = primaryLight;
    // Left collar flap
    ctx.fillRect(17, 31, 4, 4);
    ctx.fillRect(19, 35, 2, 1);
    // Right collar flap
    ctx.fillRect(27, 31, 4, 4);
    ctx.fillRect(27, 35, 2, 1);
    // Button placket
    ctx.fillStyle = primaryDark;
    ctx.fillRect(23, 34, 2, 13);
    // White pearl buttons
    ctx.fillStyle = '#F3F4F6';
    ctx.fillRect(23, 36, 2, 1);
    ctx.fillRect(23, 39, 2, 1);
    ctx.fillRect(23, 42, 2, 1);
    ctx.fillRect(23, 45, 2, 1);
  } else if (type === 'tank_top') {
    // Sleeveless top showing shoulders
    const skinTone = traits.skinTone || '#E0AA8B';
    ctx.fillStyle = skinTone;
    // Exposed shoulders
    ctx.fillRect(baseMargin, 31, 4, 4);
    ctx.fillRect(size - baseMargin - 4, 31, 4, 4);
    // Low scoop neck
    ctx.fillRect(17, 31, 14, 5);
  } else if (type === 'zipper_polo') {
    // Collar flaps
    ctx.fillStyle = primaryLight;
    ctx.fillRect(18, 31, 4, 3);
    ctx.fillRect(26, 31, 4, 3);
    // Center zipper
    ctx.fillStyle = '#9CA3AF';
    ctx.fillRect(23, 34, 2, 9);
    ctx.fillStyle = '#E5E7EB';
    ctx.fillRect(22, 36, 4, 3);
    ctx.fillStyle = '#1F2937';
    ctx.fillRect(23, 37, 2, 1);
  } else {
    // Hoodie with drawstrings
    ctx.fillStyle = primaryDark;
    ctx.fillRect(16, 31, 5, 4);
    ctx.fillRect(27, 31, 5, 4);

    // Drawstrings
    ctx.fillStyle = secondary;
    ctx.fillRect(20, 35, 1, 8);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(20, 43, 1, 2);

    ctx.fillStyle = secondary;
    ctx.fillRect(27, 35, 1, 8);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(27, 43, 1, 2);

    if (traits.clothingDetail === 'swoosh' || traits.archetype === 'minecraft_scenic') {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(19, 39, 4, 1);
      ctx.fillRect(21, 38, 6, 1);
      ctx.fillStyle = '#DC2626';
      ctx.fillRect(22, 39, 6, 1);
      ctx.fillStyle = '#2563EB';
      ctx.fillRect(24, 40, 5, 1);
    }
  }
}

/**
 * Draws head, neck, face oval, and delicate feminine/masculine contours
 */
function renderHead(ctx: CanvasRenderingContext2D, traits: AvatarTraits) {
  const isFemale = Boolean(traits.isFemale || traits.gender === 'female');
  const skin = traits.skinTone || (isFemale ? '#FCD0B4' : '#E0AA8B');
  const skinDark = traits.skinShade || adjustBrightness(skin, -16);
  const skinHighlight = traits.skinHighlight || adjustBrightness(skin, 12);

  // Neck
  ctx.fillStyle = skinDark;
  ctx.fillRect(isFemale ? 21 : 20, 25, isFemale ? 6 : 8, 4);
  ctx.fillStyle = skin;
  ctx.fillRect(isFemale ? 21 : 21, 27, isFemale ? 6 : 6, 5);

  // Face Shape and Jawline (Identity Preservation)
  ctx.fillStyle = skin;
  const isSquare = traits.faceShape === 'square' || traits.faceShape === 'angular';
  const isRound = traits.faceShape === 'round';
  const isHeart = traits.faceShape === 'heart';

  for (let y = 12; y <= 27; y++) {
    let startX = 14;
    let endX = 33;

    if (y < 14) {
      startX = isSquare ? 15 : 16;
      endX = isSquare ? 32 : 31;
    } else if (y >= 25) {
      const taper = y - 24;
      if (isSquare) {
        startX = 14 + taper;
        endX = 33 - taper;
      } else if (isRound) {
        startX = 15 + taper * 2;
        endX = 32 - taper * 2;
      } else if (isHeart) {
        startX = 15 + taper * 3;
        endX = 32 - taper * 3;
      } else {
        startX = isFemale ? 15 + taper * 2 : 14 + taper * 2;
        endX = isFemale ? 32 - taper * 2 : 33 - taper * 2;
      }
    }

    ctx.fillRect(startX, y, endX - startX + 1, 1);
  }

  // Forehead highlight
  ctx.fillStyle = skinHighlight;
  ctx.fillRect(20, 14, 8, 2);

  // Rosy cheeks / blush (enhanced for females)
  if (traits.hasBlush || isFemale) {
    ctx.fillStyle = isFemale ? 'rgba(251, 113, 133, 0.45)' : 'rgba(239, 68, 68, 0.3)';
    ctx.fillRect(16, 22, 3, 2);
    ctx.fillRect(29, 22, 3, 2);
  }

  // Ears
  ctx.fillStyle = skin;
  ctx.fillRect(12, 19, 2, 5);
  ctx.fillRect(34, 19, 2, 5);

  // Earrings
  if (traits.hasEarrings || isFemale) {
    ctx.fillStyle = '#E5E7EB';
    ctx.fillRect(12, 24, 1, 2);
    ctx.fillRect(35, 24, 1, 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(12, 26, 1, 1);
    ctx.fillRect(35, 26, 1, 1);
  }
}

/**
 * Draws eyes, eyebrows, lips, and facial hair
 */
function renderFeatures(ctx: CanvasRenderingContext2D, traits: AvatarTraits) {
  const isFemale = Boolean(traits.isFemale || traits.gender === 'female');
  const eyeColor = traits.eyeColor || '#2B4A6F';
  const skinDark = traits.skinShade || adjustBrightness(traits.skinTone || '#E0AA8B', -16);
  const hairColor = traits.hairColor || '#3C2817';
  const beardColor = traits.beardColor || hairColor;

  // Eyebrows
  ctx.fillStyle = adjustBrightness(hairColor, -12);
  if (isFemale) {
    // Elegant arched feminine eyebrows
    ctx.fillRect(16, 17, 4, 1);
    ctx.fillRect(18, 16, 3, 1);
    ctx.fillRect(27, 16, 3, 1);
    ctx.fillRect(28, 17, 4, 1);
  } else {
    ctx.fillRect(16, 17, 5, 1);
    ctx.fillRect(27, 17, 5, 1);
  }

  // Nose contour
  ctx.fillStyle = skinDark;
  ctx.fillRect(23, 22, 2, 2);

  // Eyes
  if (!isFemale && traits.eyeStyle === 'squinting_smile') {
    ctx.fillStyle = '#26180E';
    ctx.fillRect(17, 20, 4, 1);
    ctx.fillRect(18, 19, 2, 1);
    ctx.fillRect(27, 20, 4, 1);
    ctx.fillRect(28, 19, 2, 1);
  } else {
    // Left eye (x: 16..21, y: 18..21)
    if (isFemale) {
      // Feminine anime eye with winged eyelash flick!
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(16, 18, 5, 1);
      ctx.fillRect(15, 18, 1, 1); // outer lash flick!
    } else {
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(16, 18, 5, 1);
    }
    // Sclera whites
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(16, 19, 5, 3);
    // Iris
    ctx.fillStyle = eyeColor;
    ctx.fillRect(18, 19, 2, 3);
    // Pupil
    ctx.fillStyle = '#090D16';
    ctx.fillRect(18, 20, 2, 1);
    // Specular catchlight highlight
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(18, 19, 1, 1);

    // Right eye (x: 27..32, y: 18..21)
    if (isFemale) {
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(27, 18, 5, 1);
      ctx.fillRect(32, 18, 1, 1); // outer lash flick!
    } else {
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(27, 18, 5, 1);
    }
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(27, 19, 5, 3);
    ctx.fillStyle = eyeColor;
    ctx.fillRect(28, 19, 2, 3);
    ctx.fillStyle = '#090D16';
    ctx.fillRect(28, 20, 2, 1);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(28, 19, 1, 1);
  }

  // Lips / Mouth
  if (isFemale) {
    // Beautiful soft pink/rose anime lips with gloss shine
    ctx.fillStyle = '#F472B6';
    ctx.fillRect(22, 25, 4, 1);
    ctx.fillStyle = '#EC4899';
    ctx.fillRect(22, 26, 4, 1);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(24, 26, 1, 1); // gloss reflection
  } else if (traits.expression === 'smile' || traits.expression === 'grin') {
    ctx.fillStyle = '#991B1B';
    ctx.fillRect(21, 25, 6, 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(22, 25, 4, 1);
  } else {
    ctx.fillStyle = '#4A2810';
    ctx.fillRect(22, 25, 4, 1);
  }

  // Facial Hair (males only)
  if (!isFemale && (traits.hasFacialHair || traits.hasBeard)) {
    ctx.fillStyle = beardColor;
    ctx.fillRect(20, 23, 8, 2);
    ctx.fillRect(21, 22, 6, 1);
    ctx.fillRect(16, 25, 3, 2);
    ctx.fillRect(29, 25, 3, 2);
    ctx.fillRect(18, 26, 12, 2);
    ctx.fillRect(20, 27, 8, 2);
  }
}

/**
 * Draws eyeglasses
 */
function renderGlasses(ctx: CanvasRenderingContext2D, traits: AvatarTraits) {
  if (!traits.hasGlasses) return;

  const gColor = traits.glassesColor || '#161D26';
  const gStyle = traits.glassesStyle || (traits.isFemale ? 'round_wire' : 'thick_rectangular');

  ctx.fillStyle = gColor;

  if (gStyle === 'thick_rectangular') {
    ctx.fillRect(15, 18, 7, 1);
    ctx.fillRect(15, 22, 7, 1);
    ctx.fillRect(15, 19, 1, 3);
    ctx.fillRect(21, 19, 1, 3);

    ctx.fillRect(26, 18, 7, 1);
    ctx.fillRect(26, 22, 7, 1);
    ctx.fillRect(26, 19, 1, 3);
    ctx.fillRect(32, 19, 1, 3);

    ctx.fillRect(22, 19, 4, 1);
    ctx.fillRect(13, 19, 2, 1);
    ctx.fillRect(33, 19, 2, 1);
  } else {
    // Round wireframe glasses (Inspo 1, 4, 5)
    ctx.fillRect(16, 17, 5, 1);
    ctx.fillRect(16, 23, 5, 1);
    ctx.fillRect(15, 18, 1, 5);
    ctx.fillRect(21, 18, 1, 5);

    ctx.fillRect(27, 17, 5, 1);
    ctx.fillRect(27, 23, 5, 1);
    ctx.fillRect(26, 18, 1, 5);
    ctx.fillRect(32, 18, 1, 5);

    ctx.fillRect(22, 19, 4, 1);
    ctx.fillRect(13, 19, 2, 1);
    ctx.fillRect(33, 19, 2, 1);

    // Lens glare reflection
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.fillRect(16, 18, 2, 1);
    ctx.fillRect(27, 18, 2, 1);
  }
}

/**
 * Draws authentic female and male hairstyles
 */
function renderHair(ctx: CanvasRenderingContext2D, traits: AvatarTraits) {
  const isFemale = Boolean(traits.isFemale || traits.gender === 'female');
  const hair = traits.hairColor || '#2C1B10';
  const hairLight = traits.hairHighlight || adjustBrightness(hair, 18);
  const hairDark = traits.hairShadow || adjustBrightness(hair, -18);
  const style = traits.hairStyle || (isFemale ? 'long_straight' : 'curly_volume');

  if (style === 'long_straight') {
    // Long straight hair cascading down BOTH shoulders past the chest (FEMALE)
    ctx.fillStyle = hair;
    // Top volume
    ctx.fillRect(13, 5, 22, 9);
    ctx.fillRect(11, 9, 26, 10);
    // Parting and bangs
    ctx.fillRect(15, 11, 18, 4);

    // Left cascade down shoulder
    ctx.fillRect(10, 14, 5, 28);
    ctx.fillRect(11, 42, 3, 2);
    // Right cascade down shoulder
    ctx.fillRect(33, 14, 5, 28);
    ctx.fillRect(34, 42, 3, 2);

    // Highlight strands
    ctx.fillStyle = hairLight;
    ctx.fillRect(16, 7, 16, 2);
    ctx.fillRect(11, 18, 1, 20);
    ctx.fillRect(36, 18, 1, 20);

    // Shadow depth
    ctx.fillStyle = hairDark;
    ctx.fillRect(14, 19, 1, 22);
    ctx.fillRect(33, 19, 1, 22);
  } else if (style === 'long_wavy') {
    // Flowing long wavy hair cascading down shoulders
    ctx.fillStyle = hair;
    ctx.fillRect(12, 4, 24, 10);
    ctx.fillRect(10, 8, 28, 12);

    // Cascading waves left
    for (let y = 14; y <= 42; y += 4) {
      ctx.fillRect(9, y, 6, 3);
      ctx.fillRect(10, y + 2, 5, 2);
    }
    // Cascading waves right
    for (let y = 14; y <= 42; y += 4) {
      ctx.fillRect(33, y, 6, 3);
      ctx.fillRect(33, y + 2, 5, 2);
    }

    ctx.fillStyle = hairLight;
    ctx.fillRect(15, 6, 18, 2);
  } else if (style === 'ponytail') {
    // High sleek ponytail with bangs
    ctx.fillStyle = hair;
    ctx.fillRect(13, 5, 22, 9);
    ctx.fillRect(12, 10, 24, 6);
    // Bangs
    ctx.fillRect(16, 12, 16, 3);
    // High ponytail swooping to the side
    ctx.fillRect(32, 6, 7, 15);
    ctx.fillRect(35, 18, 5, 8);
    // Hair tie
    ctx.fillStyle = '#EC4899';
    ctx.fillRect(32, 6, 2, 3);
    // Highlight
    ctx.fillStyle = hairLight;
    ctx.fillRect(16, 7, 15, 2);
  } else if (style === 'messy_bun_clip') {
    // Top Bun (Inspo 1)
    ctx.fillStyle = hair;
    ctx.fillRect(19, 4, 10, 7);
    ctx.fillRect(17, 6, 14, 5);
    // Messy tufts radiating from bun
    ctx.fillRect(16, 3, 3, 4);
    ctx.fillRect(22, 2, 4, 3);
    ctx.fillRect(29, 3, 3, 4);
    // Bun highlight & shadow
    ctx.fillStyle = hairLight;
    ctx.fillRect(20, 5, 8, 2);
    ctx.fillStyle = hairDark;
    ctx.fillRect(19, 9, 10, 2);

    // Side hair framing cheeks down to jaw
    ctx.fillStyle = hair;
    ctx.fillRect(13, 12, 4, 15);
    ctx.fillRect(31, 12, 4, 15);
    ctx.fillRect(14, 27, 2, 2);
    ctx.fillRect(32, 27, 2, 2);
    ctx.fillRect(16, 10, 16, 4);

    // Hair Clip
    ctx.fillStyle = '#111827';
    ctx.fillRect(31, 13, 4, 1);
    ctx.fillRect(32, 15, 3, 1);
  } else if (style === 'bob_straight_bangs') {
    // Sleek Bob with straight bangs (Inspo 5)
    ctx.fillStyle = hair;
    ctx.fillRect(13, 5, 22, 8);
    ctx.fillRect(11, 10, 26, 16);
    // Straight fringe bangs across forehead
    ctx.fillRect(16, 13, 16, 4);
    ctx.fillStyle = hairDark;
    ctx.fillRect(19, 16, 1, 2);
    ctx.fillRect(24, 16, 1, 2);
    ctx.fillRect(28, 16, 1, 2);
    ctx.fillStyle = hairLight;
    ctx.fillRect(15, 7, 18, 2);
    ctx.fillStyle = hairDark;
    ctx.fillRect(11, 23, 4, 4);
    ctx.fillRect(33, 23, 4, 4);
  } else if (style === 'messy_anime_layers') {
    // Layered anime bangs (Inspo 4)
    ctx.fillStyle = hair;
    ctx.fillRect(12, 4, 24, 10);
    ctx.fillRect(10, 10, 28, 12);
    ctx.fillRect(17, 12, 5, 5);
    ctx.fillRect(26, 12, 5, 5);
    ctx.fillRect(22, 10, 4, 3);
    ctx.fillStyle = hairLight;
    ctx.fillRect(14, 6, 20, 2);
    ctx.fillRect(18, 13, 2, 3);
  } else if (style === 'minecraft_wavy') {
    // Textured wavy layered hair (Inspo 2)
    ctx.fillStyle = hair;
    ctx.fillRect(13, 6, 22, 8);
    ctx.fillRect(14, 12, 4, 3);
    ctx.fillRect(19, 12, 5, 4);
    ctx.fillRect(25, 12, 4, 4);
    ctx.fillRect(30, 12, 4, 3);
    ctx.fillRect(12, 14, 3, 7);
    ctx.fillRect(33, 14, 3, 7);
    ctx.fillStyle = hairLight;
    ctx.fillRect(15, 7, 7, 2);
    ctx.fillRect(25, 7, 7, 2);
    ctx.fillStyle = hairDark;
    ctx.fillRect(14, 10, 20, 2);
  } else if (style === 'short_crop_fade' || style === 'buzzcut') {
    // Clean modern short crop / fade
    ctx.fillStyle = hair;
    ctx.fillRect(14, 6, 20, 7);
    ctx.fillRect(15, 12, 18, 3);
    ctx.fillStyle = hairDark;
    ctx.fillRect(13, 12, 2, 6);
    ctx.fillRect(33, 12, 2, 6);
    ctx.fillStyle = hairLight;
    ctx.fillRect(16, 7, 16, 2);
  } else {
    // Voluminous curly hair (Inspo 3)
    ctx.fillStyle = hair;
    ctx.fillRect(12, 4, 24, 11);
    ctx.fillRect(10, 8, 28, 11);
    ctx.fillRect(14, 2, 5, 3);
    ctx.fillRect(21, 2, 6, 3);
    ctx.fillRect(29, 2, 5, 3);
    ctx.fillRect(14, 13, 4, 3);
    ctx.fillRect(19, 13, 5, 4);
    ctx.fillRect(25, 13, 5, 4);
    ctx.fillRect(31, 13, 3, 3);
    ctx.fillStyle = hairLight;
    ctx.fillRect(15, 3, 3, 1);
    ctx.fillRect(23, 3, 3, 1);
    ctx.fillRect(30, 3, 3, 1);
    ctx.fillRect(15, 7, 4, 2);
    ctx.fillRect(23, 7, 5, 2);
    ctx.fillRect(30, 7, 4, 2);
  }
}

/**
 * Main Entry Point: Renders the rich retro pixel art avatar
 * on an authentic 48x48 pixel grid, scaled up to targetSize (default 512px)
 */
export function generateRetroPixelAvatar(
  traits: AvatarTraits,
  targetSize = 512,
  includeBackground = true
): string {
  const PIXEL_GRID = 48;
  const canvas = document.createElement('canvas');
  canvas.width = PIXEL_GRID;
  canvas.height = PIXEL_GRID;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  ctx.imageSmoothingEnabled = false;

  // 1. Background
  if (includeBackground) {
    renderBackground(ctx, traits, PIXEL_GRID);
  } else {
    ctx.clearRect(0, 0, PIXEL_GRID, PIXEL_GRID);
  }

  // 2. Torso & Clothing
  renderTorso(ctx, traits, PIXEL_GRID);

  // 3. Head & Skin
  renderHead(ctx, traits);

  // 4. Facial Features
  renderFeatures(ctx, traits);

  // 5. Eyeglasses
  renderGlasses(ctx, traits);

  // 6. Hair
  renderHair(ctx, traits);

  // Scale up cleanly to high-resolution targetSize (512x512)
  const exportCanvas = document.createElement('canvas');
  exportCanvas.width = targetSize;
  exportCanvas.height = targetSize;
  const exportCtx = exportCanvas.getContext('2d');
  if (!exportCtx) return canvas.toDataURL('image/png');

  exportCtx.imageSmoothingEnabled = false;
  exportCtx.drawImage(canvas, 0, 0, targetSize, targetSize);

  return exportCanvas.toDataURL('image/png');
}

// Backward-compatible alias
export const generateMinecraftAvatar = generateRetroPixelAvatar;
