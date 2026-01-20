import React from 'react';

export default function RecommendationCard({ item, onReserve }) {
  return (
    <div className="card" style={{ padding: "12px" }}>
      <img
        src={item.image}
        alt={item.title}
        style={{
          width: "100%",
          height: "180px",
          objectFit: "cover",
          borderRadius: "10px"
        }}
      />

      <h3 style={{ marginTop: "10px", fontWeight: 600 }}>{item.title}</h3>
      <p style={{ color: "#6b7280" }}>{item.subtitle}</p>

      <div style={{ marginTop: "10px", fontWeight: 600 }}>₹{item.price}</div>

      <button
        onClick={onReserve}
        style={{
          marginTop: "10px",
          width: "100%",
          padding: "10px",
          borderRadius: "10px",
          background: "#0ea5e9",
          color: "white",
          border: "none",
          cursor: "pointer"
        }}>
        Reserve in Store
      </button>
    </div>
  );
}
