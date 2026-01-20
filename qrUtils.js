// src/utils/qrUtils.js
import jsQR from 'jsqr';

export function decodeImageData(imageData) {
  // jsQR expects Uint8ClampedArray and width/height
  try {
    const code = jsQR(imageData.data, imageData.width, imageData.height);
    return code ? code.data : null;
  } catch (e) {
    console.error('jsQR decode error', e);
    return null;
  }
}