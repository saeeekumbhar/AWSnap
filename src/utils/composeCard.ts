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

// 9x9 Grid layout of purple microchip blocks surrounding the center 5x5 image
const CHIP_BLOCKS = [
  // Top teeth (row 0)
  { r: 0, c: 2 }, { r: 0, c: 4 }, { r: 0, c: 6 },
  // Top base row (row 1)
  { r: 1, c: 2 }, { r: 1, c: 3 }, { r: 1, c: 4 }, { r: 1, c: 5 }, { r: 1, c: 6 },

  // Left teeth (col 0)
  { r: 2, c: 0 }, { r: 4, c: 0 }, { r: 6, c: 0 },
  // Left base col (col 1)
  { r: 2, c: 1 }, { r: 3, c: 1 }, { r: 4, c: 1 }, { r: 5, c: 1 }, { r: 6, c: 1 },

  // Right base col (col 7)
  { r: 2, c: 7 }, { r: 3, c: 7 }, { r: 4, c: 7 }, { r: 5, c: 7 }, { r: 6, c: 7 },
  // Right teeth (col 8)
  { r: 2, c: 8 }, { r: 4, c: 8 }, { r: 6, c: 8 },

  // Bottom base row (row 7)
  { r: 7, c: 2 }, { r: 7, c: 3 }, { r: 7, c: 4 }, { r: 7, c: 5 }, { r: 7, c: 6 },
  // Bottom teeth (row 8)
  { r: 8, c: 2 }, { r: 8, c: 4 }, { r: 8, c: 6 },
];

/**
 * Draws the microchip pixel frame with 3 teeth on each side
 */
function drawChipPixelFrame(
  ctx: CanvasRenderingContext2D,
  originX: number,
  originY: number,
  blockSize: number
) {
  ctx.save();
  ctx.fillStyle = '#A855F7';
  ctx.strokeStyle = '#141A23';
  ctx.lineWidth = 2;

  for (const { r, c } of CHIP_BLOCKS) {
    const x = originX + c * blockSize;
    const y = originY + r * blockSize;
    ctx.fillRect(x, y, blockSize, blockSize);
    ctx.strokeRect(x, y, blockSize, blockSize);
  }

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

  // 1. Card Background: Flat #141A23
  ctx.fillStyle = '#141A23';
  ctx.fillRect(0, 0, width, height);

  // 2. Technical fine-line grid across the card matching block grid
  const blockSize = 68;
  const chipOriginX = Math.round((width - 9 * blockSize) / 2); // 144
  const chipOriginY = 200;

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.07)';
  ctx.lineWidth = 1.5;

  ctx.beginPath();
  // Align grid lines with the chip blocks
  for (let x = chipOriginX % blockSize; x <= width; x += blockSize) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
  }
  for (let y = chipOriginY % blockSize; y <= height; y += blockSize) {
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
  }
  ctx.stroke();

  // Subtle card border
  ctx.strokeStyle = '#273244';
  ctx.lineWidth = 3;
  ctx.strokeRect(10, 10, width - 20, height - 20);

  // Ensure fonts are loaded
  try {
    await document.fonts.load('bold 36px "Press Start 2P"');
    await document.fonts.load('28px "Press Start 2P"');
    await document.fonts.load('20px "Press Start 2P"');
    await document.fonts.load('16px "Press Start 2P"');
  } catch (e) {
    console.warn('Font loading fallback used');
  }

  // 3. Top Heading: Chosen Player Name in Centered Purple Pixel Font
  const displayName = data.playerName.trim() || 'Name';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = 'bold 36px "Press Start 2P", monospace';
  ctx.fillStyle = '#A855F7';
  ctx.fillText(displayName, width / 2, 115);

  // 4. Central Avatar & Purple Microchip Pixel Border
  // Draw purple chip blocks
  drawChipPixelFrame(ctx, chipOriginX, chipOriginY, blockSize);

  // Draw Avatar Image inside the central 5x5 cutout
  const photoX = chipOriginX + 2 * blockSize;
  const photoY = chipOriginY + 2 * blockSize;
  const photoSize = 5 * blockSize; // 340px

  const avatarImg = new Image();
  avatarImg.crossOrigin = 'anonymous';
  await new Promise<void>((resolve, reject) => {
    avatarImg.onload = () => resolve();
    avatarImg.onerror = () => reject(new Error('Failed to load avatar image'));
    avatarImg.src = data.avatarImageDataUrl;
  });

  ctx.save();
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(avatarImg, photoX, photoY, photoSize, photoSize);
  ctx.restore();

  // 5. Four Stats Section below Avatar in Two Columns (Pure Pixel Text)
  const statsTopY = 880;
  const leftColX = chipOriginX;
  const rightColX = chipOriginX + 5 * blockSize + 20;
  const lineSpacing = 50;

  ctx.font = '16px "Press Start 2P", monospace';
  ctx.textBaseline = 'top';
  ctx.textAlign = 'left';
  ctx.fillStyle = '#A855F7';

  const stats = data.stats || {
    rizzLevel: '10/10',
    flagStatus: 'Green?',
    auraPoints: '1000+',
    socialBattery: 'LOW',
  };

  // Left Column
  ctx.fillText(`Rizz Level - ${stats.rizzLevel || '10/10'}`, leftColX, statsTopY);
  ctx.fillText(`Flag Status - ${stats.flagStatus || 'Green?'}`, leftColX, statsTopY + lineSpacing);

  // Right Column
  ctx.fillText(`Aura Points - ${stats.auraPoints || '1000+'}`, rightColX, statsTopY);
  ctx.fillText(`Social Battery - ${stats.socialBattery || 'LOW'}`, rightColX, statsTopY + lineSpacing);

  // 6. Bottom Footer: AWSnap by AWS SBG NMIET (Single line, centered)
  const footerY = 1070;
  ctx.textBaseline = 'middle';

  const awsText = 'AWSnap';
  const sbgText = ' by AWS SBG NMIET';

  ctx.font = 'bold 28px "Press Start 2P", monospace';
  const w1 = ctx.measureText(awsText).width;
  ctx.font = '20px "Press Start 2P", monospace';
  const w2 = ctx.measureText(sbgText).width;
  const totalW = w1 + w2;
  const startX = width / 2 - totalW / 2;

  ctx.textAlign = 'left';
  ctx.font = 'bold 28px "Press Start 2P", monospace';
  ctx.fillStyle = '#A855F7';
  ctx.fillText(awsText, startX, footerY);

  ctx.font = '20px "Press Start 2P", monospace';
  ctx.fillText(sbgText, startX + w1, footerY);

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
