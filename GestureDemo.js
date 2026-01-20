// src/pages/GestureDemo.js
import React, { useState, useEffect, useRef } from "react";
import { useApp } from "../context/AppContext";

export default function GestureDemo({ setScreen }) {
  const { pushToast } = useApp();
  const [lastGesture, setLastGesture] = useState(null);
  const startRef = useRef(null);

  useEffect(() => {
    function onKey(e){
      if(e.key === "ArrowLeft"){ simulate('swipe-left'); }
      if(e.key === "ArrowRight"){ simulate('swipe-right'); }
      if(e.key === "ArrowUp"){ simulate('zoom-in'); }
      if(e.key === "ArrowDown"){ simulate('zoom-out'); }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line
  }, []);

  function simulate(name){
    setLastGesture(name);
    pushToast({ type:'info', text: `Gesture: ${name}` });
  }

  function onPointerDown(e){
    startRef.current = { x: e.clientX, y: e.clientY };
  }
  function onPointerUp(e){
    const s = startRef.current;
    if(!s) return;
    const dx = e.clientX - s.x;
    const dy = e.clientY - s.y;
    if(Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)){
      const g = dx > 0 ? 'swipe-right' : 'swipe-left';
      simulate(g);
    } else if(Math.abs(dy) > 60 && Math.abs(dy) > Math.abs(dx)){
      const g = dy < 0 ? 'swipe-up' : 'swipe-down';
      simulate(g);
    }
    startRef.current = null;
  }

  return (
    <div className="container" style={{ padding: 20 }}>
      <button className="btn-ghost" onClick={() => setScreen("home")}>← Back</button>
      <h1>Gesture Demo (Mock)</h1>

      <div className="card" style={{ marginTop: 12 }}>
        <p style={{ color: '#6b7280' }}>Use keyboard arrows (← → ↑ ↓) or drag inside the box below to simulate gestures.</p>

        <div
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          style={{ marginTop: 12, height: 220, borderRadius: 8, background: 'linear-gradient(90deg,#fff,#f3f4f6)', display: 'flex', alignItems:'center', justifyContent:'center' }}
        >
          <div style={{ textAlign: 'center', color: '#6b7280' }}>
            <div style={{ fontSize: 20, fontWeight: 700 }}>{lastGesture || 'No gesture yet'}</div>
            <div style={{ marginTop: 8 }}>Drag to simulate swipe</div>
          </div>
        </div>

        <div style={{ marginTop: 12, display:'flex', gap:8 }}>
          <button className="btn-primary" onClick={() => simulate('swipe-left')}>Simulate Swipe Left</button>
          <button className="btn-primary" onClick={() => simulate('swipe-right')}>Simulate Swipe Right</button>
          <button className="btn-ghost" onClick={() => simulate('zoom-in')}>Simulate Zoom In</button>
        </div>
      </div>
    </div>
  );
}
