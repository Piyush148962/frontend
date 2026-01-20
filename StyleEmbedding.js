import React from "react";
import { motion } from "framer-motion";

export default function StyleEmbedding({ setScreen }) {
  const mockHeatmap = Array.from({ length: 12 }, () =>
    Array.from({ length: 12 }, () => Math.random())
  );

  return (
    <div className="container" style={{ padding: 20 }}>
      <button className="btn-ghost" onClick={() => setScreen("home")}>
        ← Back
      </button>

      <h1>Style Embedding Heatmap</h1>

      <div className="card" style={{ overflowX: "auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 20px)" }}>
          {mockHeatmap.flat().map((v, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                width: 20,
                height: 20,
                background: `rgba(14,165,233,${v})`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
