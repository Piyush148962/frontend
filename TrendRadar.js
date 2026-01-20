import React from "react";
import { motion } from "framer-motion";

const TRENDS = [
  { name: "Oversized Shirts", score: 92 },
  { name: "Beige Chinos", score: 88 },
  { name: "Pastel Kurtas", score: 94 },
  { name: "White Sneakers", score: 96 },
];

export default function TrendRadar({ setScreen }) {
  return (
    <div className="container" style={{ padding: 20 }}>
      <button className="btn-ghost" onClick={() => setScreen("home")}>
        ← Back
      </button>

      <h1>Trend Radar</h1>

      <div className="card">
        {TRENDS.map((t) => (
          <motion.div
            key={t.name}
            initial={{ width: 0 }}
            animate={{ width: `${t.score}%` }}
            transition={{ duration: 1 }}
            style={{
              background: "#0ea5e9",
              marginBottom: 12,
              padding: 10,
              borderRadius: 10,
              color: "white",
            }}
          >
            {t.name} — {t.score}%
          </motion.div>
        ))}
      </div>
    </div>
  );
}
