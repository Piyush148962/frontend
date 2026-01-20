// src/pages/LoyaltyWallet.js
import React, { useEffect, useState } from "react";
import { useApp } from "../context/AppContext";

const TIERS = [
  { name: "Bronze", min: 0 },
  { name: "Silver", min: 500 },
  { name: "Gold", min: 1500 }
];

export default function LoyaltyWallet({ setScreen }) {
  const { pushToast, user, addToCart } = useApp();
  const [points, setPoints] = useState(user?.loyaltyPoints || 0);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('loyalty_history') || "[]");
    setHistory(stored);
  }, []);

  useEffect(() => {
    localStorage.setItem('loyalty_history', JSON.stringify(history));
  }, [history]);

  function earnPoints(n, reason="Manual credit"){
    setPoints(p => p + n);
    const tx = { id: Date.now(), type: 'earn', points: n, reason, at: new Date().toISOString() };
    setHistory(h => [tx, ...h]);
    pushToast({ type: 'success', text: `Earned ${n} points` });
  }

  function redeemPoints(n){
    if(points < n){ pushToast({ type:'error', text: 'Not enough points' }); return; }
    setPoints(p => p - n);
    const tx = { id: Date.now(), type: 'redeem', points: -n, reason: 'Redemption', at: new Date().toISOString() };
    setHistory(h => [tx, ...h]);
    pushToast({ type: 'success', text: `Redeemed ${n} points` });
    // as demo, add a free item to cart
    addToCart({ id: `free-${Date.now()}`, title: "Loyalty Freebie", price: 0, image: "https://picsum.photos/seed/free/200/200", qty: 1 });
  }

  function currentTier(){
    let t = TIERS[0];
    for(const tier of TIERS) if(points >= tier.min) t = tier;
    return t.name;
  }

  return (
    <div className="container" style={{ padding: 20 }}>
      <button className="btn-ghost" onClick={() => setScreen("home")}>← Back</button>
      <h1>Loyalty Wallet</h1>

      <div className="card" style={{ marginTop: 12 }}>
        <div style={{ fontSize: 28, fontWeight: 800 }}>{points} pts</div>
        <div style={{ color: "#6b7280", marginTop: 6 }}>Tier: <strong>{currentTier()}</strong></div>

        <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
          <button className="btn-primary" onClick={() => earnPoints(100, "Demo Earn")}>Earn 100 pts</button>
          <button className="btn-ghost" onClick={() => redeemPoints(150)}>Redeem 150 pts</button>
        </div>
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        <h3>Transaction History</h3>
        {history.length === 0 ? <div style={{ color: '#6b7280' }}>No history yet</div> : (
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {history.map(tx => (
              <div key={tx.id} style={{ padding:8, borderRadius:8, background:'rgba(0,0,0,0.03)' }}>
                <div style={{ fontWeight:700 }}>{tx.type === 'earn' ? 'Earned' : 'Redeemed'} {Math.abs(tx.points)} pts</div>
                <div style={{ color:'#6b7280', fontSize:13 }}>{tx.reason} • {new Date(tx.at).toLocaleString()}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
