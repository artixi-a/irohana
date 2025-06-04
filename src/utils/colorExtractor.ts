export interface Color {
  rgb: string;
  hex: string;
  count: number;
}

export const extractDominantColors = (imageUrl: string): Promise<Color[]> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return resolve([]);

      // Resize for performance
      const maxSize = 150;
      let { width, height } = img;
      
      if (width > height) {
        if (width > maxSize) {
          height = (height * maxSize) / width;
          width = maxSize;
        }
      } else {
        if (height > maxSize) {
          width = (width * maxSize) / height;
          height = maxSize;
        }
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      const imageData = ctx.getImageData(0, 0, width, height);
      const colors = extractColors(imageData);
      resolve(colors);
    };

    img.src = imageUrl;
  });
};

const extractColors = (imageData: ImageData): Color[] => {
  const colorMap = new Map<string, number>();
  const data = imageData.data;

  // Sample every 4th pixel for performance
  for (let i = 0; i < data.length; i += 16) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const alpha = data[i + 3];

    // Skip transparent pixels
    if (alpha < 128) continue;

    // Quantize colors to reduce noise
    const qR = Math.round(r / 8) * 8;
    const qG = Math.round(g / 8) * 8;
    const qB = Math.round(b / 8) * 8;

    const rgb = `rgb(${qR}, ${qG}, ${qB})`;
    colorMap.set(rgb, (colorMap.get(rgb) || 0) + 1);
  }

  // Convert to array and sort by frequency
  const colors = Array.from(colorMap.entries())
    .map(([rgb, count]) => {
      const [r, g, b] = rgb.match(/\d+/g)!.map(Number);
      const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
      return { rgb, hex, count };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 10); // Top 10 colors

  return colors;
};