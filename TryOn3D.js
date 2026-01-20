// src/pages/TryOn3D.js
import React, { useState } from "react";
import { useApp } from "../context/AppContext";

const MANNEQUIN_FRAMES = [
  // using picsum seeds to imitate frames — in real app would use actual 3D renders
  "https://picsum.photos/seed/man1/400/700",
  "https://picsum.photos/seed/man2/400/700",
  "https://picsum.photos/seed/man3/400/700",
  "https://picsum.photos/seed/man4/400/700",
];

const OVERLAYS = [
  { id: "o1", name: "Denim Jacket Overlay", url: "https://i.imgur.com/1fkXjGf.png" },
  { id: "o2", name: "Hoodie Overlay", url: "https://i.imgur.com/xlS0E6D.png" }
];

export default function TryOn3D({ setScreen }) {
  const { addToCart, pushToast } = useApp();
  const [frameIndex, setFrameIndex] = useState(0);
  const [overlay, setOverlay] = useState(null);

  function rotate(delta){
    setFrameIndex(i => {
      const next = (i + delta + MANNEQUIN_FRAMES.length) % MANNEQUIN_FRAMES.length;
      return next;
    });
  }

  function addOverlayToCart(){
    if(!overlay){ pushToast({type:'error', text:'Pick an overlay first'}); return; }
    addToCart({ id: `3d-${overlay.id}`, title: overlay.name, price: 1799, image: overlay.url, qty:1 });
    pushToast({ type: 'success', text: overlay.name + ' added to cart' });
  }

  return (
    <div className="container" style={{ padding: 20 }}>
      <button className="btn-ghost" onClick={() => setScreen("home")}>← Back</button>
      <h1>3D Mannequin Try-On (Mock)</h1>

      <div style={{ display: "flex", gap: 20, marginTop: 12, flexWrap: "wrap" }}>
        <div className="card" style={{ flex: "1 1 420px", textAlign: "center" }}>
          <div style={{ position: "relative", display: "inline-block" }}>
            <img src={MANNEQUIN_FRAMES[frameIndex]} alt="mannequin" style={{ width: 320, height: 560, objectFit: "cover", borderRadius: 12 }} />
            {overlay && <img src={overlay.url} alt="overlay" style={{ position: "absolute", left: "50%", top: "18%", transform: "translateX(-50%)", width: 200, pointerEvents: "none" }} />}
          </div>

          <div style={{ marginTop: 12, display: "flex", gap: 8, justifyContent: "center" }}>
            <button className="btn-ghost" onClick={() => rotate(-1)}>◀</button>
            <button className="btn-ghost" onClick={() => rotate(1)}>▶</button>
          </div>

          <button className="btn-primary" style={{ marginTop: 12 }} onClick={addOverlayToCart}>Add Selected Item to Cart</button>
        </div>

        <div className="card" style={{ flex: "1 1 300px" }}>
          <h4>Overlays</h4>
          <div style={{ display: "flex", gap: 12, flexDirection: "column" }}>
            {OVERLAYS.map(o => (
              <div key={o.id} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <img src={o.url} alt={o.name} style={{ width: 80, height: 80, objectFit: "contain", background: "#fff", borderRadius: 8 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700 }}>{o.name}</div>
                  <div style={{ color: "#6b7280" }}>Mock overlay</div>
                </div>
                <button className="btn-ghost" onClick={() => setOverlay(o)}>Try</button>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
