import React from 'react';

export default function QuickActions() {
  const examples = [
    "I have a beach wedding next week",
    "Show me beige linen dresses",
    "Reserve my selected dress in store",
    "Apply loyalty and checkout"
  ];

  return (
    <div style={{ marginTop: "20px" }}>
      <h4 style={{ fontSize: "14px", fontWeight: 600, color: "#6b7280" }}>Quick Prompts</h4>

      {examples.map((ex, i) => (
        <button
          key={i}
          onClick={() => window.dispatchEvent(new CustomEvent('quick-prompt', { detail: ex }))}
          style={{
            marginTop: "10px",
            width: "100%",
            padding: "10px",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            textAlign: "left",
            cursor: "pointer"
          }}>
          {ex}
        </button>
      ))}
    </div>
  );
}
