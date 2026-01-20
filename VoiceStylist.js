// src/pages/VoiceStylist.js
import React, { useEffect, useRef, useState } from "react";
import { useApp } from "../context/AppContext";

export default function VoiceStylist({ setScreen }) {
  const { pushToast, addToCart } = useApp();
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      pushToast({ type: "error", text: "SpeechRecognition not supported in this browser." });
      return;
    }

    const r = new SpeechRecognition();
    r.lang = "en-IN";
    r.interimResults = false;
    r.maxAlternatives = 1;
    r.onresult = (ev) => {
      const text = Array.from(ev.results).map(r => r[0].transcript).join(' ');
      setTranscript(text);
      handleCommand(text);
    };
    r.onerror = (e) => {
      pushToast({ type: "error", text: "Voice error: " + (e.error || e.message) });
    };

    recognitionRef.current = r;
    // cleanup not necessary until unmount
    // eslint-disable-next-line
  }, []);

  function speak(text) {
    if (!window.speechSynthesis) return;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-IN";
    u.rate = 1;
    window.speechSynthesis.speak(u);
  }

  function startListening(){
    if(!recognitionRef.current) { pushToast({ type:'error', text:'Speech not supported' }); return; }
    recognitionRef.current.start();
    setListening(true);
    pushToast({ type:'info', text:'Listening...' });
  }

  function stopListening(){
    if(!recognitionRef.current) return;
    recognitionRef.current.stop();
    setListening(false);
    pushToast({ type:'info', text:'Stopped listening' });
  }

  function handleCommand(text) {
    const cmd = text.toLowerCase();
    // simple intent rules
    if (cmd.includes("show") && cmd.includes("dress")) {
      speak("Showing dresses. Added a sample dress to cart for demo.");
      addDemoItemToCart();
      pushToast({ type: "success", text: "Sample dress added to cart" });
    } else if (cmd.includes("add") && cmd.includes("cart")) {
      addDemoItemToCart();
    } else if (cmd.includes("checkout") || cmd.includes("pay")) {
      speak("Simulating checkout. Go to kiosk to complete payment.");
      pushToast({ type: "info", text: "Simulated checkout: open Kiosk to complete" });
    } else {
      speak("Sorry, I didn't get that. Try: add dress to cart, show dress, or checkout.");
      pushToast({ type: "info", text: `Heard: "${text}"` });
    }
  }

  function addDemoItemToCart() {
    const demo = {
      id: `voice-demo-${Date.now()}`,
      title: "Voice Demo Linen Dress",
      price: 1999,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800",
      qty: 1
    };
    addToCart(demo);
  }

  return (
    <div className="container" style={{ padding: 20 }}>
      <button className="btn-ghost" onClick={() => setScreen("home")}>← Back</button>
      <h1>AI Voice Stylist</h1>

      <div className="card" style={{ marginTop: 16 }}>
        <p style={{ color: "#6b7280" }}>Use your voice to control the assistant. Try: "Show me dresses" or "Add dress to cart"</p>

        <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
          <button onClick={listening ? stopListening : startListening} className="btn-primary" style={{ padding: "10px 14px" }}>
            {listening ? "Stop Listening" : "Start Listening"}
          </button>

          <button onClick={() => { speak("Hello! I am your voice stylist. Tell me what you need."); pushToast({type:'info', text:'Spoken greeting sent'}); }} className="btn-ghost">
            Speak (Test)
          </button>
        </div>

        <div style={{ marginTop: 14 }}>
          <strong>Last transcript:</strong>
          <div style={{ marginTop: 8, padding: 10, borderRadius: 8, background: "rgba(0,0,0,0.03)" }}>{transcript || "—"}</div>
        </div>
      </div>
    </div>
  );
}
