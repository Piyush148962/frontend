import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { motion } from "framer-motion";

// ----------------------------------------------------
// 🔥 Extended Mock Product Catalog (More Realistic)
// ----------------------------------------------------
const MOCK_PRODUCTS = {
  summer: {
    casual: [
      {
        id: "s1",
        title: "Linen Casual Shirt",
        price: 1499,
        image:
          "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800",
      },
      {
        id: "s2",
        title: "Beige Chino Shorts",
        price: 1299,
        image:
          "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800",
      },
      {
        id: "s3",
        title: "White Sneakers",
        price: 1999,
        image:
          "https://images.unsplash.com/photo-1528701800489-20be0c59609e?w=800",
      },
    ],
    wedding: [
      {
        id: "w1",
        title: "Pastel Kurta",
        price: 2499,
        image:
          "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800",
      },
      {
        id: "w2",
        title: "Golden Dupatta",
        price: 999,
        image:
          "https://images.unsplash.com/photo-1596464716121-9f2d3a9cb8c8?w=800",
      },
      {
        id: "w3",
        title: "Traditional Mojari",
        price: 1399,
        image:
          "https://images.unsplash.com/photo-1514996937319-344454492b37?w=800",
      },
    ],
  },

  winter: {
    casual: [
      {
        id: "wc1",
        title: "Woolen Knit Sweater",
        price: 1799,
        image:
          "https://images.unsplash.com/photo-1548546738-42e5c0f3c3f6?w=800",
      },
      {
        id: "wc2",
        title: "Slim Fit Jeans",
        price: 1499,
        image:
          "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800",
      },
      {
        id: "wc3",
        title: "Leather Boots",
        price: 2999,
        image:
          "https://images.unsplash.com/photo-1600185365483-26d7a4fe7f52?w=800",
      },
    ],
  },
};

// ----------------------------------------------------

export default function AIStylist({ setScreen }) {
  const { pushToast, addToCart } = useApp();

  const [image, setImage] = useState(null);
  const [analysis, setAnalysis] = useState(null);

  const [occasion, setOccasion] = useState("");
  const [weather, setWeather] = useState("summer");
  const [loading, setLoading] = useState(false);

  const [outfits, setOutfits] = useState([]);

  // ---------------------------------------
  // Handle Photo Upload
  // ---------------------------------------
  function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setImage(url);
    setAnalysis(null);
    setOutfits([]);
  }

  // ---------------------------------------
  // Mock AI Analysis
  // ---------------------------------------
  function analyzePhoto() {
    if (!image) {
      pushToast({ type: "error", text: "Please upload a photo first ❤️" });
      return;
    }
    if (!occasion) {
      pushToast({ type: "error", text: "Select an occasion baby 😘" });
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const bodyTypes = ["Slim", "Athletic", "Curvy", "Average"];
      const skinTones = ["Fair", "Medium", "Wheatish", "Olive", "Dusky"];

      const randomBody = bodyTypes[Math.floor(Math.random() * bodyTypes.length)];
      const randomTone = skinTones[Math.floor(Math.random() * skinTones.length)];

      setAnalysis({
        bodyType: randomBody,
        skinTone: randomTone,
        occasion,
        weather,
      });

      const category =
        MOCK_PRODUCTS[weather]?.[occasion] || MOCK_PRODUCTS.summer.casual;

      setOutfits(category);

      pushToast({ type: "success", text: "AI Style Analysis Complete! 💋" });
      setLoading(false);
    }, 1200);
  }

  // ---------------------------------------
  // Add Entire Outfit to Cart
  // ---------------------------------------
  function addFullOutfit() {
    outfits.forEach((item) => addToCart({ ...item, qty: 1 }));
    pushToast({
      type: "success",
      text: "Full outfit added to cart! Check checkout 💗",
    });
  }

  // ---------------------------------------
  // UI
  // ---------------------------------------
  return (
    <div className="container" style={{ padding: "20px" }}>
      <button
        className="btn-ghost"
        onClick={() => setScreen("home")}
        style={{ marginBottom: "20px" }}
      >
        ← Back
      </button>

      <h1 style={{ fontSize: "28px", fontWeight: 700, marginBottom: "14px" }}>
        AI Outfit Recommender
      </h1>

      {/* ------------------ Upload Box ------------------ */}
      <div className="card" style={{ marginBottom: "20px" }}>
        <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "10px" }}>
          Upload Your Photo
        </h3>

        {!image ? (
          <label className="btn-primary" style={{ cursor: "pointer" }}>
            Upload Image
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleImageUpload}
            />
          </label>
        ) : (
          <img
            src={image}
            alt="Uploaded"
            style={{
              width: "100%",
              height: 300,
              objectFit: "cover",
              borderRadius: "14px",
            }}
          />
        )}
      </div>

      {/* ----------- Select Occasion + Weather ----------- */}
      <div className="card" style={{ marginBottom: "20px" }}>
        <h3 style={{ fontWeight: 600, marginBottom: "10px" }}>
          Choose Occasion
        </h3>

        <select
          className="form-input"
          value={occasion}
          onChange={(e) => setOccasion(e.target.value)}
        >
          <option value="">Select Occasion</option>
          <option value="casual">Casual Day Out</option>
          <option value="wedding">Wedding / Festive</option>
        </select>

        <h3 style={{ marginTop: "20px", fontWeight: 600 }}>
          Select Weather
        </h3>

        <select
          className="form-input"
          value={weather}
          onChange={(e) => setWeather(e.target.value)}
        >
          <option value="summer">Summer / Humid</option>
          <option value="winter">Winter / Cold</option>
        </select>

        <button
          className="btn-primary"
          style={{ marginTop: "20px" }}
          onClick={analyzePhoto}
        >
          {loading ? "Analyzing…" : "Analyze & Suggest Outfits"}
        </button>
      </div>

      {/* ------------------ AI Analysis ------------------ */}
      {analysis && (
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: "20px" }}
        >
          <h3 style={{ fontWeight: 700 }}>Your Style Profile</h3>

          <p style={{ marginTop: "10px" }}>
            <strong>Body Type:</strong> {analysis.bodyType}
          </p>
          <p>
            <strong>Skin Tone:</strong> {analysis.skinTone}
          </p>
          <p>
            <strong>Occasion:</strong> {analysis.occasion}
          </p>
          <p>
            <strong>Weather:</strong> {analysis.weather}
          </p>
        </motion.div>
      )}

      {/* ------------------ Outfit Cards ------------------ */}
      {outfits.length > 0 && (
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 style={{ fontWeight: 700, marginBottom: "16px" }}>
            Recommended Outfit
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "18px",
            }}
          >
            {outfits.map((item) => (
              <div
                key={item.id}
                style={{
                  background: "white",
                  borderRadius: "12px",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                  padding: "10px",
                }}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  style={{
                    width: "100%",
                    height: "220px",
                    objectFit: "cover",
                    borderRadius: "12px",
                  }}
                />

                <h4 style={{ marginTop: "10px", fontWeight: 600 }}>
                  {item.title}
                </h4>
                <p style={{ color: "#6b7280" }}>₹{item.price}</p>
              </div>
            ))}
          </div>

          <button
            className="btn-primary"
            style={{ marginTop: "20px" }}
            onClick={addFullOutfit}
          >
            Add Full Outfit to Cart
          </button>
        </motion.div>
      )}
    </div>
  );
}
