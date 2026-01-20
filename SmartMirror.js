import React, { useRef, useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { motion } from "framer-motion";

export default function SmartMirror({ setScreen }) {
  const videoRef = useRef(null);
  const { pushToast, addToCart } = useApp();

  const [scanning, setScanning] = useState(false);
  const [outfits, setOutfits] = useState([]);

  // Start camera automatically
  useEffect(() => {
    async function startCam() {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      videoRef.current.srcObject = stream;
    }
    startCam();
  }, []);

  // Mock AI Scan
  function scanLook() {
    setScanning(true);
    pushToast({ type: "info", text: "Analyzing your look…" });

    setTimeout(() => {
      setScanning(false);

      const suggestions = [
        {
          name: "Beige Overshirt",
          price: 1999,
          image:
            "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800",
        },
        {
          name: "Slim Black Jeans",
          price: 2499,
          image:
            "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800",
        },
      ];

      setOutfits(suggestions);
      pushToast({ type: "success", text: "Smart Mirror Style Ready ❤️" });
    }, 1500);
  }

  function add(item) {
    addToCart({ ...item, qty: 1 });
    pushToast({ type: "success", text: `${item.name} added to cart!` });
  }

  return (
    <div className="container" style={{ padding: 20 }}>
      <button className="btn-ghost" onClick={() => setScreen("home")}>
        ← Back
      </button>

      <h1 style={{ marginBottom: 12 }}>Smart Mirror</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "3fr 2fr",
          gap: 20,
        }}
      >
        {/* Camera Feed */}
        <div className="card">
          <video
            ref={videoRef}
            autoPlay
            style={{
              width: "100%",
              borderRadius: 12,
            }}
          />

          <button
            className="btn-primary"
            style={{ marginTop: 16 }}
            onClick={scanLook}
          >
            {scanning ? "Scanning…" : "Scan My Look"}
          </button>
        </div>

        {/* Suggestions */}
        <motion.div
          className="card"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h3>AI Style Suggestions</h3>

          {outfits.length === 0 ? (
            <p style={{ color: "#6b7280" }}>Scan to get outfit suggestions.</p>
          ) : (
            outfits.map((item) => (
              <div
                key={item.name}
                style={{
                  display: "flex",
                  gap: 12,
                  marginBottom: 16,
                }}
              >
                <img
                  src={item.image}
                  alt=""
                  style={{
                    width: 80,
                    height: 100,
                    objectFit: "cover",
                    borderRadius: 10,
                  }}
                />
                <div>
                  <h4>{item.name}</h4>
                  <p>₹{item.price}</p>
                  <button
                    className="btn-primary"
                    style={{ marginTop: 6 }}
                    onClick={() => add(item)}
                  >
                    Add to cart
                  </button>
                </div>
              </div>
            ))
          )}
        </motion.div>
      </div>
    </div>
  );
}
