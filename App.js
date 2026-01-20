// src/App.js
import React from "react";
import "./App.css";

import Header from "./components/Header";
import ChatWindow from "./components/ChatWindow";
import QuickActions from "./components/QuickActions";

import { sampleUser } from "./data/sampleUser";
import Kiosk from "./pages/Kiosk";
import Demo from "./pages/Demo";
import AIStylist from "./pages/AIStylist";

// Previously added modules
import SmartMirror from "./pages/SmartMirror";
import TryOnAR from "./pages/TryOnAR";
import FashionDNA from "./pages/FashionDNA";
import TrendRadar from "./pages/TrendRadar";
import StyleEmbedding from "./pages/StyleEmbedding";

// Option A new modules
import VoiceStylist from "./pages/VoiceStylist";
import CatalogScraper from "./pages/CatalogScraper";
import TryOn3D from "./pages/TryOn3D";
import LoyaltyWallet from "./pages/LoyaltyWallet";
import CloudSyncSim from "./pages/CloudSyncSim";
import GestureDemo from "./pages/GestureDemo";

// Auth
import LoginPage from "./pages/LoginPage";

import { AppProvider, useApp } from "./context/AppContext";
import CartDrawer from "./components/common/CartDrawer";
import ToastContainer from "./components/ui/ToastContainer";

import { FiShoppingCart } from "react-icons/fi";

function AppShell() {
  const [screen, setScreen] = React.useState("home");
  const [cartOpen, setCartOpen] = React.useState(false);

  const { user, cart, logout, loadingUser } = useApp();

  // -------------------------
  // WAIT FOR FIREBASE STATE
  // -------------------------
  if (loadingUser) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 22,
          fontWeight: 600,
        }}
      >
        Loading user...
      </div>
    );
  }

  // -------------------------
  // NOT LOGGED IN → LOGIN PAGE
  // -------------------------
  if (!user) {
    return <LoginPage setScreen={setScreen} />;
  }

  // -------------------------
  // LOGGED IN → FULL APP
  // -------------------------
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* HEADER */}
      <Header setScreen={setScreen} onOpenCart={() => setCartOpen(true)} />

      {/* HOME SCREEN */}
      {screen === "home" && (
        <main className="container" style={{ padding: "20px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "20px" }}>
            
            {/* LEFT SIDE — CHAT AI */}
            <div className="card">
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <h2 style={{ fontSize: 24, fontWeight: 600 }}>AI Sales Assistant</h2>
                  <p style={{ color: "#6b7280", marginTop: 6 }}>
                    Try: “I have a beach wedding next week”
                  </p>
                </div>

                {/* USER INFO + LOGOUT */}
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: 700 }}>
                    {user.name || user.email}
                  </div>

                  <button
                    className="btn-ghost"
                    style={{ marginTop: 8 }}
                    onClick={logout}
                  >
                    Logout
                  </button>
                </div>
              </div>

              <div style={{ marginTop: 14 }}>
                <ChatWindow user={sampleUser} />
              </div>
            </div>

            {/* RIGHT SIDE — DEMO BUTTONS */}
            <div className="card">
              <h3 style={{ fontSize: 18, fontWeight: 500 }}>Customer</h3>
              <p style={{ fontSize: 14, color: "#6b7280" }}>
                {user.name} — logged in
              </p>

              <QuickActions />

              <div style={{ marginTop: 20 }}>
                <h4
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#6b7280",
                    marginBottom: 8,
                  }}
                >
                  Demo Screens
                </h4>

                {/* Main Demo Buttons */}
                <button onClick={() => setScreen("kiosk")} className="btn-primary" style={{ width: "100%", marginBottom: 10 }}>
                  Open Kiosk Demo
                </button>

                <button onClick={() => setScreen("demo")} className="btn-ghost" style={{ width: "100%", marginBottom: 10 }}>
                  Demo Script
                </button>

                <button
                  onClick={() => setScreen("aiStylist")}
                  className="btn-primary"
                  style={{ width: "100%", marginBottom: 10, background: "#0ea5e9" }}
                >
                  AI Outfit Recommender
                </button>

                <button onClick={() => setScreen("smartMirror")} className="btn-primary" style={{ width: "100%", marginBottom: 10 }}>
                  Smart Mirror
                </button>

                <button onClick={() => setScreen("tryOn")} className="btn-primary" style={{ width: "100%", marginBottom: 10 }}>
                  AR Try-On
                </button>

                <button onClick={() => setScreen("fashionDNA")} className="btn-primary" style={{ width: "100%", marginBottom: 10 }}>
                  Fashion DNA Report
                </button>

                <button onClick={() => setScreen("trendRadar")} className="btn-primary" style={{ width: "100%", marginBottom: 10 }}>
                  Trend Radar
                </button>

                <button onClick={() => setScreen("embedding")} className="btn-primary" style={{ width: "100%", marginBottom: 10 }}>
                  Style Embedding Heatmap
                </button>

                {/* Option A extra modules */}
                <div style={{ marginTop: 12, borderTop: "1px dashed #e6eef6", paddingTop: 12 }}>
                  <button onClick={() => setScreen("voiceStylist")} className="btn-primary" style={{ width: "100%", marginBottom: 8 }}>
                    AI Voice Stylist
                  </button>

                  <button onClick={() => setScreen("catalogScraper")} className="btn-primary" style={{ width: "100%", marginBottom: 8 }}>
                    ABFRL Catalog (Mock)
                  </button>

                  <button onClick={() => setScreen("tryOn3D")} className="btn-primary" style={{ width: "100%", marginBottom: 8 }}>
                    3D Try-On
                  </button>

                  <button onClick={() => setScreen("loyalty")} className="btn-primary" style={{ width: "100%", marginBottom: 8 }}>
                    Loyalty Wallet
                  </button>

                  <button onClick={() => setScreen("cloudSync")} className="btn-primary" style={{ width: "100%", marginBottom: 8 }}>
                    Cloud Sync Sim
                  </button>

                  <button onClick={() => setScreen("gestureDemo")} className="btn-primary" style={{ width: "100%" }}>
                    Gesture Demo
                  </button>
                </div>
              </div>
            </div>

          </div>
        </main>
      )}

      {/* INDIVIDUAL SCREENS */}
      {screen === "kiosk" && <Kiosk setScreen={setScreen} />}
      {screen === "demo" && <Demo setScreen={setScreen} />}
      {screen === "aiStylist" && <AIStylist setScreen={setScreen} />}
      {screen === "smartMirror" && <SmartMirror setScreen={setScreen} />}
      {screen === "tryOn" && <TryOnAR setScreen={setScreen} />}
      {screen === "fashionDNA" && <FashionDNA setScreen={setScreen} />}
      {screen === "trendRadar" && <TrendRadar setScreen={setScreen} />}
      {screen === "embedding" && <StyleEmbedding setScreen={setScreen} />}
      {screen === "voiceStylist" && <VoiceStylist setScreen={setScreen} />}
      {screen === "catalogScraper" && <CatalogScraper setScreen={setScreen} />}
      {screen === "tryOn3D" && <TryOn3D setScreen={setScreen} />}
      {screen === "loyalty" && <LoyaltyWallet setScreen={setScreen} />}
      {screen === "cloudSync" && <CloudSyncSim setScreen={setScreen} />}
      {screen === "gestureDemo" && <GestureDemo setScreen={setScreen} />}

      {/* FOOTER */}
      <footer
        style={{
          marginTop: "auto",
          padding: 10,
          background: "white",
          borderTop: "1px solid #e5e7eb",
          textAlign: "center",
          color: "#6b7280",
          fontSize: 14,
        }}
      >
        Team aditya.23bhi10065 — EY Techathon 6.0
      </footer>

      {/* FLOATING CART */}
      <div style={{ position: "fixed", right: 18, bottom: 18, zIndex: 9999 }}>
        <button
          onClick={() => setCartOpen(true)}
          style={{
            background: "#0f172a",
            color: "white",
            padding: "12px 14px",
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          <FiShoppingCart size={18} />
          <span style={{ marginLeft: 6 }}>{cart.length}</span>
        </button>
      </div>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
