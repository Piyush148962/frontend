// src/utils/ai/colorExtractor.js

export async function extractColors(imageUrl) {
    return new Promise((resolve) => {
      const img = document.createElement("img");
      img.crossOrigin = "anonymous";
      img.src = imageUrl;
  
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
  
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
  
        const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
  
        let colors = {};
        for (let i = 0; i < data.length; i += 16) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const hex = rgbToHex(r, g, b);
          colors[hex] = (colors[hex] || 0) + 1;
        }
  
        const sorted = Object.entries(colors)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map((c) => c[0]);
  
        resolve(sorted);
      };
    });
  };
  
  function rgbToHex(r, g, b) {
    return "#" + [r, g, b]
      .map((x) => x.toString(16).padStart(2, "0"))
      .join("");
  }
  