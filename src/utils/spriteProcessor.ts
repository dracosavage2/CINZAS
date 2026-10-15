// Sprite Processor: Removes background (pure black or pure white) and generates transparent canvases
export interface ProcessedSprites {
  bossIdle: HTMLCanvasElement | null;
  bossWalkFrames: HTMLCanvasElement[];
  bossAttack: HTMLCanvasElement | null;
  playerIdle: HTMLCanvasElement | null;
}

// Helper to remove solid background (black or white)
export function removeBackground(
  img: HTMLImageElement,
  bgType: 'black' | 'white'
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth || img.width;
  canvas.height = img.naturalHeight || img.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  ctx.drawImage(img, 0, 0);
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const d = imgData.data;

  for (let i = 0; i < d.length; i += 4) {
    const r = d[i];
    const g = d[i + 1];
    const b = d[i + 2];

    if (bgType === 'black') {
      // Threshold for solid black background
      const maxVal = Math.max(r, g, b);
      if (maxVal < 22) {
        d[i + 3] = 0; // completely transparent
      } else if (maxVal < 40) {
        // Soft edge antialiasing
        d[i + 3] = Math.round(((maxVal - 22) / 18) * 255);
      }
    } else if (bgType === 'white') {
      // Threshold for solid white background
      const minVal = Math.min(r, g, b);
      if (minVal > 235) {
        d[i + 3] = 0; // completely transparent
      } else if (minVal > 215) {
        // Soft edge antialiasing
        d[i + 3] = Math.round(((235 - minVal) / 20) * 255);
      }
    }
  }

  ctx.putImageData(imgData, 0, 0);
  return canvas;
}

// Slice sprite sheet into individual animation frame canvases
export function sliceSpriteSheet(
  sheetCanvas: HTMLCanvasElement,
  cols: number,
  rows: number
): HTMLCanvasElement[] {
  const frames: HTMLCanvasElement[] = [];
  const frameW = Math.floor(sheetCanvas.width / cols);
  const frameH = Math.floor(sheetCanvas.height / rows);

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const fCanvas = document.createElement('canvas');
      fCanvas.width = frameW;
      fCanvas.height = frameH;
      const fCtx = fCanvas.getContext('2d');
      if (fCtx) {
        fCtx.drawImage(
          sheetCanvas,
          c * frameW,
          r * frameH,
          frameW,
          frameH,
          0,
          0,
          frameW,
          frameH
        );
        frames.push(fCanvas);
      }
    }
  }

  return frames;
}
