// src/components/kiosk/Scanner.js
import React, { useEffect, useRef, useState } from 'react';
import { decodeImageData } from '../../utils/qrUtils';

export default function Scanner({ onDetected, onError, style = {} }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [scanning, setScanning] = useState(false);
  const [supported, setSupported] = useState({ barcode: false });

  useEffect(() => {
    // detect BarcodeDetector support
    const hasBarcodeDetector = typeof window.BarcodeDetector !== 'undefined';
    setSupported({ barcode: !!hasBarcodeDetector });

    async function start() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setScanning(true);
        requestAnimationFrame(tick);
      } catch (err) {
        console.error('camera error', err);
        onError && onError(err);
      }
    }

    start();

    return () => {
      setScanning(false);
      const s = videoRef.current?.srcObject;
      if (s && s.getTracks) s.getTracks().forEach(t => t.stop());
    };
    // eslint-disable-next-line
  }, []);

  async function tick() {
    if (!scanning) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || video.readyState !== 4) {
      requestAnimationFrame(tick);
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Try BarcodeDetector first (fast)
    if (window.BarcodeDetector) {
      try {
        if (!window._barcodeDetector) {
          // common formats
          window._barcodeDetector = new window.BarcodeDetector({ formats: ['qr_code', 'code_128', 'ean_13', 'ean_8'] });
        }
        const detections = await window._barcodeDetector.detect(canvas);
        if (detections && detections.length) {
          const code = detections[0].rawValue;
          onDetected && onDetected(code);
          return;
        }
      } catch (err) {
        // fall back to jsQR
      }
    }

    // jsQR fallback
    try {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const decoded = decodeImageData(imageData);
      if (decoded) {
        onDetected && onDetected(decoded);
        return;
      }
    } catch (e) {
      // ignore
    }

    requestAnimationFrame(tick);
  }

  return (
    <div style={{ position: 'relative', ...style }}>
      <video ref={videoRef} style={{ width: '100%', height: 'auto', borderRadius: 12 }} muted playsInline />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <div style={{ position: 'absolute', left: 12, top: 12, background: 'rgba(0,0,0,0.45)', color: 'white', padding: '6px 10px', borderRadius: 8 }}>
        Camera Scanner
      </div>
    </div>
  );
}
