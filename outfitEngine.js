// src/utils/ai/outfitEngine.js

export function generateOutfits({ faceShape, skinTone, weather, colors, occasion }) {
    const catalog = {
      Oval: ["Flowy Dresses", "Structured Blazers", "Slim Fit Shirts"],
      Round: ["V-neck Tops", "Vertical Stripes", "Layered Fits"],
      Square: ["Soft Knitwear", "Oversized Shirts", "Relaxed Pants"],
      Heart: ["Puff Sleeves", "A-line Outfits", "Printed Shirts"],
    };
  
    const toneColors = {
      Fair: ["Pastel Blue", "Blush", "Mint"],
      Medium: ["Olive", "Tan", "Burgundy"],
      Wheatish: ["Teal", "Mustard", "Navy"],
      Olive: ["Charcoal", "Forest Green", "Black"],
      Dusky: ["Maroon", "Gold", "Emerald"],
    };
  
    const weatherWear = {
      Sunny: ["Linen", "Cotton", "Short-Sleeves"],
      Humid: ["Dry-Fit", "Breezy Wear"],
      Winter: ["Jackets", "Woolen Layers", "Sweaters"],
    };
  
    const base = catalog[faceShape] || [];
    const tone = toneColors[skinTone] || [];
    const weatherFit = weatherWear[weather] || [];
  
    // AI combination
    const selected = [
      base[Math.floor(Math.random() * base.length)],
      tone[Math.floor(Math.random() * tone.length)],
      weatherFit[Math.floor(Math.random() * weatherFit.length)],
    ];
  
    // Map these to REAL product images
    const PRODUCT_MAP = [
      {
        name: selected[0],
        image:
          "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800",
        price: 1499,
      },
      {
        name: selected[1],
        image:
          "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=800",
        price: 1299,
      },
      {
        name: selected[2],
        image:
          "https://images.unsplash.com/photo-1528701800489-20be0c59609e?w=800",
        price: 1999,
      },
    ];
  
    return PRODUCT_MAP;
  }
  