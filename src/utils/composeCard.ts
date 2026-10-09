/**
 * Canvas Card Composer for AWSnap Collectible Avatar Card
 * Generates the full 900 x 1200 px collectible card with:
 * - Flat #161D26 dark grid background
 * - Bold purple pixel-font heading (Player Name)
 * - Purple stepped pixel frame with rectangular protrusions (top, bottom, sides)
 * - Centered 8-bit Minecraft character portrait
 * - 4 stat labels in two columns (purple pixel typography)
 * - AWSnap by AWS SBG NMIET footer
 */

import { CardStats } from './avatarGenerator';

export interface CardData {
  playerName: string;
  avatarImageDataUrl: string;
  stats: CardStats;
}

/**
 * Draws the geometric stepped pixel border with rectangular protrusions
 * at top, bottom, and sides.
 */
function drawSteppedPixelFrame(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  innerSize: number
) {
  ctx.save();
  const half = innerSize / 2;
  const borderWidth = 18;
  const tabThickness = 16;
  const tabWidth = innerSize * 0.38;

  // Outer boundary
  const ox = cx - half - borderWidth;
  const oy = cy - half - borderWidth;
  const ow = innerSize + borderWidth * 2;
  const oh = innerSize + borderWidth * 2;

  // 1. Draw outer stepped shadow layer (Deep Purple #4A154B / #581C87)
  ctx.fillStyle = '#4C1D95';
  ctx.fillRect(ox - 4, oy - 4, ow + 8, oh + 8);

  // Protrusions in shadow
  ctx.fillRect(cx - tabWidth / 2 - 4, oy - tabThickness - 4, tabWidth + 8, tabThickness + 6); // Top tab
  ctx.fillRect(cx - tabWidth / 2 - 4, oy + oh - 2, tabWidth + 8, tabThickness + 6); // Bottom tab
  ctx.fillRect(ox - tabThickness - 4, cy - tabWidth / 2 - 4, tabThickness + 6, tabWidth + 8); // Left tab
  ctx.fillRect(ox + ow - 2, cy - tabWidth / 2 - 4, tabThickness + 6, tabWidth + 8); // Right tab

  // 2. Main Outer Purple Frame (#7E22CE / #6B21A8)
  ctx.fillStyle = '#6B21A8';
  ctx.fillRect(ox, oy, ow, oh);

  // Main protrusions (#6B21A8)
  ctx.fillRect(cx - tabWidth / 2, oy - tabThickness, tabWidth, tabThickness + 2);
  ctx.fillRect(cx - tabWidth / 2, oy + oh - 2, tabWidth, tabThickness + 2);
  ctx.fillRect(ox - tabThickness, cy - tabWidth / 2, tabThickness + 2, tabWidth);
  ctx.fillRect(ox + ow - 2, cy - tabWidth / 2, tabThickness + 2, tabWidth);

  // 3. Highlight Stepped Pixel Inset (#A855F7 and #C084FC)
  const step = 8;
  ctx.fillStyle = '#A855F7';
  // Outer border highlights
  ctx.fillRect(ox + step, oy + step, ow - step * 2, oh - step * 2);

  // Stepped corner notches (pixel art stepped teeth at 4 corners)
  const cornerSize = 24;
  ctx.fillStyle = '#4C1D95';
  ctx.fillRect(ox, oy, cornerSize, cornerSize);
  ctx.fillRect(ox + ow - cornerSize, oy, cornerSize, cornerSize);
  ctx.fillRect(ox, oy + oh - cornerSize, cornerSize, cornerSize);
  ctx.fillRect(ox + ow - cornerSize, oy + oh - cornerSize, cornerSize, cornerSize);

  // Secondary stepped pixel teeth
  ctx.fillStyle = '#C084FC';
  // Top & bottom center tab accents
  ctx.fillRect(cx - tabWidth / 2 + 12, oy - tabThickness + 4, tabWidth - 24, 6);
  ctx.fillRect(cx - tabWidth / 2 + 12, oy + oh + tabThickness - 10, tabWidth - 24, 6);
  // Left & right center tab accents
  ctx.fillRect(ox - tabThickness + 4, cy - tabWidth / 2 + 12, 6, tabWidth - 24);
  ctx.fillRect(ox + ow + tabThickness - 10, cy - tabWidth / 2 + 12, 6, tabWidth - 24);

  // Inner frame bevel
  ctx.fillStyle = '#3B0764';
  ctx.fillRect(cx - half - 4, cy - half - 4, innerSize + 8, innerSize + 8);

  ctx.restore();
}

/**
 * Renders the entire collectible card onto a high-resolution 900x1200 canvas
 */
export async function composeCardToCanvas(
  data: CardData,
  width = 900,
  height = 1200
): Promise<HTMLCanvasElement> {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context unavailable');

  // 1. Mandatory Background: Flat #161D26 (NO GRADIENTS)
  ctx.fillStyle = '#161D26';
  ctx.fillRect(0, 0, width, height);

  // 2. Subtle technical fine-line grid across the card
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.035)';
  ctx.lineWidth = 1.5;
  const gridSize = 32;

  ctx.beginPath();
  for (let x = 0; x <= width; x += gridSize) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
  }
  for (let y = 0; y <= height; y += gridSize) {
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
  }
  ctx.stroke();

  // Subtle card border
  ctx.strokeStyle = '#362F4B';
  ctx.lineWidth = 3;
  ctx.strokeRect(12, 12, width - 24, height - 24);

  // Ensure fonts are loaded
  try {
    await document.fonts.load('bold 36px "Press Start 2P"');
    await document.fonts.load('20px "Press Start 2P"');
  } catch (e) {
    console.warn('Font loading fallback used');
  }

  // 3. Top Heading: Chosen Player Name in Bold Purple Pixel Font
  const displayName = (data.playerName.trim() || 'PIXEL PLAYER').toUpperCase();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Outer text shadow for retro pop
  ctx.font = 'bold 36px "Press Start 2P", monospace';
  ctx.fillStyle = '#4C1D95';
  ctx.fillText(displayName, width / 2 + 3, 110 + 3);

  ctx.fillStyle = '#A855F7';
  ctx.fillText(displayName, width / 2, 110);

  // 4. Central Avatar & Purple Stepped Pixel Border
  const avatarCenterY = 475;
  const avatarSize = 480;

  // Draw stepped geometric purple frame
  drawSteppedPixelFrame(ctx, width / 2, avatarCenterY, avatarSize);

  // Draw Avatar Image inside the central cutout
  const avatarImg = new Image();
  avatarImg.crossOrigin = 'anonymous';
  await new Promise<void>((resolve, reject) => {
    avatarImg.onload = () => resolve();
    avatarImg.onerror = () => reject(new Error('Failed to load avatar image'));
    avatarImg.src = data.avatarImageDataUrl;
  });

  ctx.save();
  // Pixelated rendering to guarantee crisp square pixel clusters
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(
    avatarImg,
    width / 2 - avatarSize / 2,
    avatarCenterY - avatarSize / 2,
    avatarSize,
    avatarSize
  );
  ctx.restore();

  // 5. Four Stats Section below Avatar in a Compact Two-Column Layout
  // Left column:
  // - Rizz Level — 10/10
  // - Flag Status — Green?
  // Right column:
  // - Aura Points — 1000+
  // - Social Battery — LOW
  const statsTopY = 820;
  const leftColX = 140;
  const rightColX = 520;
  const lineSpacing = 70;

  ctx.font = '18px "Press Start 2P", monospace';
  ctx.textBaseline = 'top';

  const stats = data.stats || {
    rizzLevel: '10/10',
    flagStatus: 'Green?',
    auraPoints: '1000+',
    socialBattery: 'LOW',
  };

  // Helper to draw a stat entry with retro purple palette
  const drawStat = (label: string, value: string, x: number, y: number) => {
    // Stat background bar
    ctx.fillStyle = 'rgba(168, 85, 247, 0.08)';
    ctx.fillRect(x - 14, y - 8, 320, 48);
    ctx.strokeStyle = '#4C1D95';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x - 14, y - 8, 320, 48);

    // Label text
    ctx.textAlign = 'left';
    ctx.fillStyle = '#C084FC';
    ctx.fillText(`${label} -`, x, y);

    // Value text
    ctx.fillStyle = '#F5F3FF';
    ctx.fillText(value, x, y + 22);
  };

  // Left Column
  drawStat('Rizz Level', stats.rizzLevel || '10/10', leftColX, statsTopY);
  drawStat('Flag Status', stats.flagStatus || 'Green?', leftColX, statsTopY + lineSpacing);

  // Right Column
  drawStat('Aura Points', stats.auraPoints || '1000+', rightColX, statsTopY);
  drawStat('Social Battery', stats.socialBattery || 'LOW', rightColX, statsTopY + lineSpacing);

  // 6. Bottom Footer: AWSnap by AWS SBG NMIET
  const footerY = 1080;
  ctx.textAlign = 'center';

  // "AWSnap" in bold purple pixel font
  ctx.font = 'bold 38px "Press Start 2P", monospace';
  ctx.fillStyle = '#4C1D95';
  ctx.fillText('AWSnap', width / 2 + 2, footerY + 2);
  ctx.fillStyle = '#A855F7';
  ctx.fillText('AWSnap', width / 2, footerY);

  // "by AWS SBG NMIET" in smaller clean text
  ctx.font = '600 20px "Space Grotesk", sans-serif';
  ctx.fillStyle = '#B8AECF';
  ctx.fillText('by AWS SBG NMIET', width / 2, footerY + 45);

  return canvas;
}

/**
 * Triggers browser download of the composed card as a high-resolution PNG
 */
export async function downloadComposedCardPng(
  data: CardData,
  fileName = 'awsnap-avatar.png'
): Promise<void> {
  const canvas = await composeCardToCanvas(data, 900, 1200);
  const dataUrl = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
