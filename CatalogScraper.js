// src/pages/CatalogScraper.js
import React, { useEffect, useState } from "react";
import { useApp } from "../context/AppContext";

function generateMockCatalog(n = 120) {
  const categories = ["Shirts", "Dresses", "Kurtas", "Shoes", "Jackets", "Jeans"];
  const colors = ["Beige", "Black", "White", "Navy", "Olive", "Maroon"];
  const catalog = [];
  for (let i = 1; i <= n; i++) {
    const cat = categories[i % categories.length];
    const color = colors[i % colors.length];
    catalog.push({
      id: `prod-${i}`,
      title: `${color} ${cat} ${i}`,
      category: cat,
      color,
      price: 799 + (i % 10) * 150,
      image: `https://picsum.photos/seed/prod${i}/400/500`
    });
  }
  return catalog;
}

export default function CatalogScraper({ setScreen }) {
  const { addToCart, pushToast } = useApp();
  const [catalog, setCatalog] = useState([]);
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    const mock = generateMockCatalog(120);
    setCatalog(mock);
    setFiltered(mock);
  }, []);

  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (!q) setFiltered(catalog);
    else setFiltered(catalog.filter(p => p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.color.toLowerCase().includes(q)));
  }, [query, catalog]);

  return (
    <div className="container" style={{ padding: 20 }}>
      <button className="btn-ghost" onClick={() => setScreen("home")}>← Back</button>
      <h1>ABFRL Catalog (Mock Scraper)</h1>

      <div className="card" style={{ marginTop: 12 }}>
        <div style={{ display: "flex", gap: 8 }}>
          <input className="form-input" placeholder="Search title, category, color..." value={query} onChange={e => setQuery(e.target.value)} />
          <button className="btn-primary" onClick={() => pushToast({type:'info', text:`Catalog contains ${catalog.length} items`})}>Info</button>
        </div>

        <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 12 }}>
          {filtered.map(p => (
            <div key={p.id} className="card" style={{ padding: 8 }}>
              <img src={p.image} alt={p.title} style={{ width: "100%", height: 160, objectFit: "cover", borderRadius: 8 }} />
              <div style={{ marginTop: 8, fontWeight: 700 }}>{p.title}</div>
              <div style={{ color: "#6b7280" }}>{p.category} • {p.color}</div>
              <div style={{ fontWeight: 700, marginTop: 6 }}>₹{p.price}</div>
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <button className="btn-primary" onClick={() => { addToCart({...p, qty:1}); pushToast({type:'success', text: p.title + ' added'}); }}>Add</button>
                <button className="btn-ghost" onClick={() => navigator.clipboard?.writeText(p.title) && pushToast({type:'info', text:'Copied title'})}>Copy</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
