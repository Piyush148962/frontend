import React from 'react';

export default function Header({ setScreen }) {
  return (
    <header style={{
      background: "#0f172a",
      color: "white",
      padding: "15px"
    }}>
      <div className="container" style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <h1 style={{ fontSize: "20px", fontWeight: 600 }}>Agentic AI — Retail Sales Agent</h1>

        <nav style={{ display: "flex", gap: "20px" }}>
          <button onClick={() => setScreen("home")} style={navBtn}>Home</button>
          <button onClick={() => setScreen("kiosk")} style={navBtn}>Kiosk</button>
          <button onClick={() => setScreen("demo")} style={navBtn}>Demo Script</button>
        </nav>
      </div>
    </header>
  );
}

const navBtn = {
  background: "transparent",
  border: "none",
  color: "white",
  fontSize: "14px",
  cursor: "pointer"
};
