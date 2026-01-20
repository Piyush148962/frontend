import React, { useState } from "react";
import { motion } from "framer-motion";

const TRYON_TOPS = [
  {
    name: "Blue Denim Jacket",
    image:
      "https://i.imgur.com/1fkXjGf.png", // Transparent PNG
  },
  {
    name: "White Hoodie",
    image:
      "https://i.imgur.com/xlS0E6D.png",
  },
];

export default function TryOnAR({ setScreen }) {
  const [photo, setPhoto] = useState(null);
  const [overlay, setOverlay] = useState(null);

  function upload(e) {
    const file = e.target.files[0];
    if (file) setPhoto(URL.createObjectURL(file));
  }

  return (
    <div className="container" style={{ padding: 20 }}>
      <button className="btn-ghost" onClick={() => setScreen("home")}>
        ← Back
      </button>

      <h1>AR Try-On</h1>

      <div className="card" style={{ marginBottom: 20 }}>
        {!photo ? (
          <label className="btn-primary">
            Upload Photo
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={upload}
            />
          </label>
        ) : (
          <div style={{ position: "relative" }}>
            <img
              src={photo}
              alt="Uploaded"
              style={{
                width: "100%",
                borderRadius: 12,
              }}
            />

            {overlay && (
              <motion.img
                src={overlay}
                alt="overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  position: "absolute",
                  top: "20%",
                  left: "30%",
                  width: "40%",
                }}
              />
            )}
          </div>
        )}
      </div>

      {photo && (
        <div className="card">
          <h3>Try These Tops</h3>

          {TRYON_TOPS.map((t) => (
            <button
              key={t.name}
              className="btn-primary"
              style={{ marginTop: 10 }}
              onClick={() => setOverlay(t.image)}
            >
              Try {t.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
