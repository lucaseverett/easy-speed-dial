import { relativeLuminance } from "random-color-library";

export async function getImageAverageColor(
  imageUrl: string,
  samplePoints: number = 25,
): Promise<number> {
  const img = new Image();
  img.crossOrigin = "anonymous";

  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = imageUrl;
  });

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas context");

  const gridSize = Math.ceil(Math.sqrt(samplePoints));
  canvas.width = gridSize;
  canvas.height = gridSize;
  ctx.drawImage(img, 0, 0, gridSize, gridSize);

  const imageData = ctx.getImageData(0, 0, gridSize, gridSize);
  const data = imageData.data;

  let totalLuminance = 0;

  for (let sample = 0; sample < samplePoints; sample++) {
    const i = Math.floor(sample / gridSize);
    const j = sample % gridSize;

    const pixelIndex = (i * gridSize + j) * 4;
    const r = data[pixelIndex];
    const g = data[pixelIndex + 1];
    const b = data[pixelIndex + 2];

    const luminance = relativeLuminance(`rgb(${r}, ${g}, ${b})`);
    totalLuminance += luminance;
  }

  return totalLuminance / samplePoints;
}
