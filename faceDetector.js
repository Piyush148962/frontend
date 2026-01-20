// src/utils/ai/faceDetector.js

export function detectFaceShape(imgUrl) {
    // Mock realistic AI result
    const shapes = ["Oval", "Round", "Square", "Heart"];
    const picked = shapes[Math.floor(Math.random() * shapes.length)];
  
    return {
      shape: picked,
      confidence: (70 + Math.random() * 20).toFixed(1) + "%",
    };
  }
  