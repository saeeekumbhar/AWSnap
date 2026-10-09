/**
 * 8-Bit Minecraft-Style Avatar Generator
 * Renders authentic blocky human character sprites with crisp square pixel clusters
 */

export interface AvatarTraits {
  skinTone: string;
  hairColor: string;
  hairStyle: string; // 'short' | 'parted' | 'spiky' | 'curly' | 'wavy' | 'long' | 'bun' | 'buzzcut' | 'bald';
  eyeColor: string;
  hasGlasses: boolean;
  glassesColor: string;
  hasBeard: boolean;
  beardColor: string;
  clothingPrimary: string;
  clothingSecondary: string;
  clothingStyle: string; // 'tshirt' | 'hoodie' | 'jacket' | 'shirt' | 'sweater';
  expression: string;
}

export interface CardStats {
  rizzLevel: string;
  flagStatus: string;
  auraPoints: string;
  socialBattery: string;
}

export const DEFAULT_TRAITS: AvatarTraits = {
  skinTone: '#E0AA8B',
  hairColor: '#3C2817',
  hairStyle: 'short',
  eyeColor: '#2B4A6F',
  hasGlasses: false,
  glassesColor: '#161D26',
  hasBeard: false,
  beardColor: '#3C2817',
  clothingPrimary: '#FF9900',
  clothingSecondary: '#6B21A8',
  clothingStyle: 'hoodie',
  expression: 'confident',
};

export const DEFAULT_STATS: CardStats = {
  rizzLevel: '10/10',
  flagStatus: 'Green?',
  auraPoints: '1000+',
  socialBattery: 'LOW',
};

// Color manipulation helpers for Minecraft-style pixel depth & shading
function adjustBrightness(hex: string, percent: number): string {
  let cleanHex = hex.replace('#', '');
  if (cleanHex.length === 3) {
    cleanHex = cleanHex
      .split('')
      .map((c) => c + c)
      .join('');
  }
  const num = parseInt(cleanHex, 16);
  let r = (num >> 16) + Math.round(255 * (percent / 100));
  let g = ((num >> 8) & 0x00ff) + Math.round(255 * (percent / 100));
  let b = (num & 0x0000ff) + Math.round(255 * (percent / 100));

  r = Math.min(255, Math.max(0, r));
  g = Math.min(255, Math.max(0, g));
  b = Math.min(255, Math.max(0, b));

  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

/**
 * Generates a Minecraft character sprite on an exact 32x32 pixel grid
 * and renders it scaled up cleanly to targetSize (default 512px)
 */
export function generateMinecraftAvatar(
  traits: AvatarTraits,
  targetSize = 512,
  includeBackground = true
): string {
  const GRID_SIZE = 32;
  const canvas = document.createElement('canvas');
  canvas.width = GRID_SIZE;
  canvas.height = GRID_SIZE;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Palette shading variants
  const skin = traits.skinTone || '#E0AA8B';
  const skinLight = adjustBrightness(skin, 10);
  const skinDark = adjustBrightness(skin, -12);
  const skinShadow = adjustBrightness(skin, -22);

  const hair = traits.hairColor || '#3C2817';
  const hairLight = adjustBrightness(hair, 15);
  const hairDark = adjustBrightness(hair, -15);
  const hairDeep = adjustBrightness(hair, -28);

  const cloth1 = traits.clothingPrimary || '#FF9900';
  const cloth1Light = adjustBrightness(cloth1, 14);
  const cloth1Dark = adjustBrightness(cloth1, -16);

  const cloth2 = traits.clothingSecondary || '#6B21A8';
  const cloth2Light = adjustBrightness(cloth2, 14);
  const cloth2Dark = adjustBrightness(cloth2, -16);

  const eye = traits.eyeColor || '#2B4A6F';
  const eyeLight = adjustBrightness(eye, 20);

  // Background
  if (includeBackground) {
    ctx.fillStyle = '#161D26';
    ctx.fillRect(0, 0, GRID_SIZE, GRID_SIZE);

    // Subtle technical grid accent in background
    ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
    for (let x = 0; x < GRID_SIZE; x += 4) {
      ctx.fillRect(x, 0, 1, GRID_SIZE);
    }
    for (let y = 0; y < GRID_SIZE; y += 4) {
      ctx.fillRect(0, y, GRID_SIZE, 1);
    }
  } else {
    ctx.clearRect(0, 0, GRID_SIZE, GRID_SIZE);
  }

  // --- 1. TORSO & SHOULDERS (y: 19 to 31) ---
  // Torso x: 10 to 21 (12 px wide), Shoulders/Arms x: 6 to 9 and 22 to 25 (4 px each)
  // Left arm
  for (let y = 19; y <= 31; y++) {
    for (let x = 6; x <= 9; x++) {
      const isOuter = x === 6 || y === 19;
      ctx.fillStyle = isOuter ? cloth1Light : cloth1;
      if (x === 9) ctx.fillStyle = cloth1Dark; // arm seam shadow
      ctx.fillRect(x, y, 1, 1);
    }
  }

  // Right arm
  for (let y = 19; y <= 31; y++) {
    for (let x = 22; x <= 25; x++) {
      const isInner = x === 22;
      const isEdge = x === 25;
      ctx.fillStyle = isInner ? cloth1Dark : isEdge ? cloth1Dark : cloth1;
      ctx.fillRect(x, y, 1, 1);
    }
  }

  // Central Torso
  for (let y = 19; y <= 31; y++) {
    for (let x = 10; x <= 21; x++) {
      ctx.fillStyle = cloth1;
      // Dappled pixel texture
      if ((x + y) % 3 === 0) ctx.fillStyle = cloth1Light;
      if (x === 10 || x === 21) ctx.fillStyle = cloth1Dark;
      ctx.fillRect(x, y, 1, 1);
    }
  }

  // Clothing Styling details
  if (traits.clothingStyle === 'hoodie' || traits.clothingStyle === 'jacket') {
    // Center zipper or AWS motif
    for (let y = 21; y <= 31; y++) {
      ctx.fillStyle = cloth2;
      ctx.fillRect(15, y, 2, 1);
    }
    // Hoodie pocket / AWS builder patch
    for (let y = 27; y <= 29; y++) {
      for (let x = 12; x <= 19; x++) {
        ctx.fillStyle = (x === 15 || x === 16) ? cloth2Light : cloth2;
        ctx.fillRect(x, y, 1, 1);
      }
    }
    // Collar / hood trim
    ctx.fillStyle = cloth2Dark;
    ctx.fillRect(13, 19, 6, 2);
  } else {
    // T-shirt neckline (skin visible at top center)
    ctx.fillStyle = skinDark;
    ctx.fillRect(14, 19, 4, 1);
    ctx.fillStyle = skin;
    ctx.fillRect(15, 20, 2, 1);
    // Chest emblem / AWS graphic
    ctx.fillStyle = cloth2;
    ctx.fillRect(14, 23, 4, 2);
    ctx.fillStyle = '#FF9900';
    ctx.fillRect(15, 24, 2, 1);
  }

  // --- 2. HEAD BASE (y: 5 to 18, x: 9 to 22 -> 14x14 block) ---
  // Minecraft head: 14x14 frontal face with 3D block shading
  for (let y = 5; y <= 18; y++) {
    for (let x = 9; x <= 22; x++) {
      let c = skin;
      // Subtle pixel skin texture variation
      if ((x * 3 + y * 7) % 5 === 0) c = skinLight;
      if (y === 18) c = skinDark; // chin shadow
      if (x === 9 || x === 22) c = skinDark; // side shadows
      ctx.fillStyle = c;
      ctx.fillRect(x, y, 1, 1);
    }
  }

  // Neck shadow on collar
  ctx.fillStyle = skinShadow;
  ctx.fillRect(13, 18, 6, 1);

  // --- 3. EYES & NOSE ---
  // Left eye at x: 11-12, y: 12-13
  // Right eye at x: 19-20, y: 12-13
  // White of eyes
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(11, 12, 1, 2);
  ctx.fillRect(20, 12, 1, 2);

  // Iris / Pupil
  ctx.fillStyle = eye;
  ctx.fillRect(12, 12, 1, 2);
  ctx.fillRect(19, 12, 1, 2);

  // Pupil highlight
  ctx.fillStyle = eyeLight;
  ctx.fillRect(12, 12, 1, 1);
  ctx.fillRect(19, 12, 1, 1);

  // Eyebrows
  ctx.fillStyle = hairDark;
  ctx.fillRect(11, 10, 3, 1);
  ctx.fillRect(18, 10, 3, 1);

  // Nose (1 pixel subtle shadow)
  ctx.fillStyle = skinDark;
  ctx.fillRect(15, 14, 2, 1);

  // Mouth / Expression
  const expr = traits.expression || 'confident';
  if (expr === 'smile' || expr === 'grin') {
    ctx.fillStyle = adjustBrightness(skin, -30);
    ctx.fillRect(14, 16, 4, 1);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(15, 16, 2, 1);
    // Smile upturn
    ctx.fillStyle = adjustBrightness(skin, -30);
    ctx.fillRect(13, 15, 1, 1);
    ctx.fillRect(18, 15, 1, 1);
  } else {
    // Confident / neutral smirk
    ctx.fillStyle = adjustBrightness(skin, -25);
    ctx.fillRect(14, 16, 4, 1);
  }

  // --- 4. BEARD / FACIAL HAIR (if present) ---
  if (traits.hasBeard) {
    const beard = traits.beardColor || hair;
    const beardDark = adjustBrightness(beard, -15);
    // Goatee / full beard jaw
    ctx.fillStyle = beard;
    ctx.fillRect(13, 17, 6, 2);
    ctx.fillRect(14, 15, 4, 1); // mustache
    ctx.fillStyle = beardDark;
    ctx.fillRect(9, 16, 2, 3); // sideburn to jaw
    ctx.fillRect(21, 16, 2, 3);
  }

  // --- 5. HAIR LAYER (Minecraft 3D hair helmet) ---
  const style = traits.hairStyle || 'short';
  if (style !== 'bald') {
    // Top head crown (y: 4 to 8)
    for (let y = 4; y <= 7; y++) {
      for (let x = 8; x <= 23; x++) {
        let c = hair;
        if (y === 4) c = hairLight; // top highlight
        if ((x + y * 2) % 4 === 0) c = hairLight;
        if ((x * 2 + y) % 5 === 0) c = hairDark;
        ctx.fillStyle = c;
        ctx.fillRect(x, y, 1, 1);
      }
    }

    // Sideburns
    for (let y = 8; y <= 14; y++) {
      ctx.fillStyle = hair;
      ctx.fillRect(8, y, 2, 1);
      ctx.fillStyle = hairDark;
      ctx.fillRect(22, y, 2, 1);
    }

    // Hairstyle specific bangs & volume
    if (style === 'spiky') {
      // Spikes on top
      ctx.fillStyle = hairLight;
      ctx.fillRect(10, 3, 2, 1);
      ctx.fillRect(14, 3, 3, 1);
      ctx.fillRect(19, 3, 2, 1);
      // Forehead bangs
      ctx.fillStyle = hairDark;
      ctx.fillRect(11, 8, 3, 2);
      ctx.fillRect(16, 8, 4, 2);
    } else if (style === 'curly' || style === 'wavy') {
      // Clustered curls
      ctx.fillStyle = hairLight;
      ctx.fillRect(9, 3, 3, 2);
      ctx.fillRect(13, 3, 3, 2);
      ctx.fillRect(17, 3, 3, 2);
      ctx.fillRect(21, 3, 2, 2);
      // Curly forehead fringe
      ctx.fillStyle = hair;
      ctx.fillRect(10, 8, 2, 2);
      ctx.fillRect(13, 8, 3, 1);
      ctx.fillRect(17, 8, 3, 2);
      ctx.fillRect(21, 8, 2, 2);
    } else if (style === 'long') {
      // Long locks descending over shoulders
      for (let y = 8; y <= 21; y++) {
        ctx.fillStyle = hair;
        ctx.fillRect(7, y, 3, 1);
        ctx.fillStyle = hairDark;
        ctx.fillRect(22, y, 3, 1);
      }
      // Forehead sweep
      ctx.fillStyle = hair;
      ctx.fillRect(11, 8, 10, 1);
      ctx.fillRect(12, 9, 8, 1);
    } else if (style === 'bun') {
      // Top knot bun
      ctx.fillStyle = hairLight;
      ctx.fillRect(13, 1, 6, 3);
      ctx.fillStyle = hairDark;
      ctx.fillRect(14, 0, 4, 1);
      // Clean bangs
      ctx.fillStyle = hair;
      ctx.fillRect(10, 8, 12, 1);
    } else if (style === 'parted') {
      // Side part sweep
      ctx.fillStyle = hair;
      ctx.fillRect(10, 8, 8, 2);
      ctx.fillRect(18, 8, 4, 1);
    } else {
      // Classic short Minecraft Steve/Alex bangs
      ctx.fillStyle = hair;
      ctx.fillRect(10, 8, 12, 1);
      ctx.fillRect(10, 9, 3, 1);
      ctx.fillRect(19, 9, 3, 1);
    }
  }

  // --- 6. GLASSES (if present) ---
  if (traits.hasGlasses) {
    const gColor = traits.glassesColor || '#0F172A';
    const gLight = adjustBrightness(gColor, 35);
    // Left rim (around eye at 11-12)
    ctx.fillStyle = gColor;
    ctx.fillRect(10, 11, 4, 1); // top
    ctx.fillRect(10, 14, 4, 1); // bottom
    ctx.fillRect(10, 12, 1, 2); // left edge
    ctx.fillRect(13, 12, 1, 2); // right edge

    // Right rim (around eye at 19-20)
    ctx.fillRect(18, 11, 4, 1);
    ctx.fillRect(18, 14, 4, 1);
    ctx.fillRect(18, 12, 1, 2);
    ctx.fillRect(21, 12, 1, 2);

    // Nose bridge
    ctx.fillRect(14, 12, 4, 1);

    // Temples (sides going into hair)
    ctx.fillRect(8, 12, 2, 1);
    ctx.fillRect(22, 12, 2, 1);

    // Lens glare reflection
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.fillRect(11, 12, 1, 1);
    ctx.fillRect(19, 12, 1, 1);
  }

  // --- 7. SCALE UP TO TARGET RESOLUTION WITH CRISP PIXELS ---
  const exportCanvas = document.createElement('canvas');
  exportCanvas.width = targetSize;
  exportCanvas.height = targetSize;
  const exportCtx = exportCanvas.getContext('2d');
  if (!exportCtx) return canvas.toDataURL('image/png');

  exportCtx.imageSmoothingEnabled = false;
  exportCtx.drawImage(canvas, 0, 0, targetSize, targetSize);

  return exportCanvas.toDataURL('image/png');
}
