import React from 'react';

export default function Demo({ setScreen }) {
  return (
    <div style={{ padding: "20px" }}>
      <button onClick={() => setScreen("home")}>← Back</button>

      <div className="card" style={{ marginTop: "20px" }}>
        <h2>Full Demo Script</h2>

        <ol style={{ marginTop: "10px", lineHeight: "1.8" }}>
          <li>Open Home screen</li>
          <li>Type: “I have a beach wedding next week”</li>
          <li>AI recommends linen dress & wedges</li>
          <li>Reserve item</li>
          <li>Open kiosk screen</li>
          <li>Checkout + loyalty</li>
        </ol>
      </div>
    </div>
  );
}
