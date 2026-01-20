// src/pages/Kiosk.js
// ----------------------
// Modern Kiosk Experience (full file)
// ----------------------

import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import Scanner from "../components/kiosk/Scanner";
import VoiceAssistant from "../components/kiosk/VoiceAssistant";
import PaymentModal from "../components/kiosk/PaymentModal";
import { generateInvoicePDF } from "../components/kiosk/InvoiceGenerator";
import { motion } from "framer-motion";

export default function Kiosk({ setScreen }) {
  const { cart, user, clearCart, pushToast, reservations, placeOrder } = useApp();

  /* -----------------------------
        Billing Calculations
  ------------------------------ */
  const subtotal = cart.reduce((sum, item) => sum + (item.price || 0) * (item.qty || 1), 0);
  const loyaltyUsed = Math.min(150, user?.loyaltyPoints || 0);
  const total = Math.max(0, subtotal - loyaltyUsed);

  /* -----------------------------
         Local UI states
  ------------------------------ */
  const [scannerOpen, setScannerOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [lastScan, setLastScan] = useState(null);
  const [voiceTranscript, setVoiceTranscript] = useState("");
  const [processingPayment, setProcessingPayment] = useState(false);

  /* -----------------------------
        Handle Scanner Results
  ------------------------------ */
  function handleScanDetected(code) {
    setLastScan(code);
    setScannerOpen(false);
    pushToast({ type: "success", text: `Scanned: ${code}` });
  }

  /* -----------------------------
       Payment / Order Flow
  ------------------------------ */

  // Called after the payment modal signals success (simulated)
  async function onPaymentSuccess(paymentDetails = { method: "kiosk-mock" }) {
    if (!user || !user.id) {
      pushToast({ type: "error", text: "Please login before checkout." });
      setPaymentOpen(false);
      return;
    }

    if (!cart || cart.length === 0) {
      pushToast({ type: "error", text: "Cart is empty." });
      setPaymentOpen(false);
      return;
    }

    setProcessingPayment(true);
    pushToast({ type: "info", text: "Finalizing order — please wait..." });

    try {
      // Use placeOrder from AppContext which centralizes Firestore writes, inventory decrement, loyalty update etc.
      const result = await placeOrder({ paymentMethod: paymentDetails.method });

      if (!result || !result.ok) {
        pushToast({ type: "error", text: "Order failed. Please try again." });
        console.error("placeOrder failure:", result);
        setProcessingPayment(false);
        setPaymentOpen(false);
        return;
      }

      // If placeOrder succeeded, result.orderId contains the new order id
      const orderId = result.orderId || `ORD-${Date.now()}`;

      // Generate an invoice PDF for download (best-effort)
      try {
        generateInvoicePDF({
          orderId,
          user,
          items: cart,
          totals: { subtotal, loyalty: loyaltyUsed, total },
        });
      } catch (pdfErr) {
        console.warn("Invoice generation failed:", pdfErr);
      }

      // Ensure local cart is cleared (placeOrder should clear cloud + local, but ensure UI cleared)
      clearCart();

      pushToast({ type: "success", text: `Payment & order complete — ${orderId}` });
      setProcessingPayment(false);
      setPaymentOpen(false);

      // Return to home after a short delay so user sees success toast
      setTimeout(() => setScreen("home"), 700);
    } catch (err) {
      console.error("Checkout error:", err);
      pushToast({ type: "error", text: "Checkout error. Try again." });
      setProcessingPayment(false);
      setPaymentOpen(false);
    }
  }

  /* -----------------------------
        Kiosk Layout Rendering
  ------------------------------ */
  return (
    <div className="container" style={{ padding: "20px" }}>
      <button
        className="btn-ghost"
        style={{ marginBottom: "18px", width: 120 }}
        onClick={() => setScreen("home")}
      >
        ← Back
      </button>

      <h1 style={{ fontSize: "28px", fontWeight: 700, marginBottom: "4px" }}>
        Self-Checkout Kiosk
      </h1>

      <p style={{ color: "#6b7280", marginBottom: "22px" }}>
        {user ? `Hello ${user.name || user.email}, complete your purchase below.` : "Hello guest — login to save your order and earn loyalty points."}
      </p>

      <div
        style={{
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
        }}
      >
        {/* LEFT PANEL — Scanner, Voice, Reservations */}
        <motion.div
          className="card"
          style={{ flex: "1 1 450px", minWidth: 320 }}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ fontSize: "20px", fontWeight: 700, margin: 0 }}>Kiosk Tools</h2>
            <div style={{ color: "#6b7280", fontSize: 13 }}>Tools for fast checkout</div>
          </div>

          {/* Voice Assistant */}
          <div style={{ marginTop: "12px" }}>
            <VoiceAssistant
              onResult={(t) => {
                setVoiceTranscript(t);
                pushToast({ type: "info", text: `Heard: ${t}` });
              }}
            />
          </div>

          {voiceTranscript && (
            <div
              style={{
                marginTop: 12,
                padding: 10,
                borderRadius: 10,
                background: "linear-gradient(90deg, rgba(14,165,233,0.06), rgba(14,165,233,0.03))",
                border: "1px solid rgba(14,165,233,0.06)",
              }}
            >
              <strong>Voice:</strong> {voiceTranscript}
            </div>
          )}

          {/* Scanner Toggle */}
          <div style={{ marginTop: 18 }}>
            <button
              className="btn-primary"
              onClick={() => setScannerOpen((s) => !s)}
              style={{ width: "100%" }}
            >
              {scannerOpen ? "Close Scanner" : "Open QR / Barcode Scanner"}
            </button>
          </div>

          {scannerOpen && (
            <div style={{ marginTop: 12 }}>
              <Scanner onDetected={handleScanDetected} />
            </div>
          )}

          {lastScan && (
            <div
              style={{
                marginTop: 12,
                padding: 10,
                background: "rgba(14,165,233,0.06)",
                borderRadius: 10,
              }}
            >
              Last Scan: <strong>{lastScan}</strong>
            </div>
          )}

          {/* Reservations */}
          <h3 style={{ marginTop: 24, fontSize: 18, fontWeight: 700 }}>Your Reservations</h3>

          {reservations?.length === 0 ? (
            <p style={{ color: "#6b7280", marginTop: 6 }}>No reservations found.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 10 }}>
              {reservations.map((r) => (
                <div
                  key={r.id}
                  style={{
                    padding: 12,
                    borderRadius: 10,
                    background: "rgba(255,255,255,0.6)",
                  }}
                >
                  <strong>{r.item?.title}</strong>
                  <div style={{ color: "#6b7280", fontSize: 14 }}>
                    Reserved on {new Date(r.at).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* RIGHT PANEL — Cart + Billing */}
        <motion.div
          className="card"
          style={{ flex: "1 1 420px", minWidth: 320 }}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ fontSize: "20px", fontWeight: 700, margin: 0 }}>Your Cart</h2>
            <div style={{ color: "#6b7280", fontSize: 13 }}>{cart.length} items</div>
          </div>

          {cart.length === 0 ? (
            <p style={{ marginTop: 10, color: "#6b7280" }}>No items yet. Add from the AI assistant or Catalog.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 14 }}>
              {cart.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    gap: 14,
                    padding: 10,
                    background: "rgba(255,255,255,0.7)",
                    borderRadius: 10,
                    alignItems: "center",
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    style={{
                      width: 70,
                      height: 70,
                      borderRadius: 10,
                      objectFit: "cover",
                    }}
                  />

                  <div style={{ flex: 1 }}>
                    <strong style={{ fontSize: 16 }}>{item.title}</strong>
                    <div style={{ color: "#6b7280", fontSize: 14 }}>{item.qty} × ₹{item.price}</div>
                  </div>

                  <strong>₹{(item.qty || 1) * (item.price || 0)}</strong>
                </div>
              ))}
            </div>
          )}

          {/* Billing Summary */}
          {cart.length > 0 && (
            <>
              <hr style={{ margin: "20px 0", borderColor: "#e5e7eb" }} />

              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ color: "#6b7280" }}>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ color: "#6b7280" }}>Loyalty Applied</span>
                <span>-₹{loyaltyUsed}</span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 18, marginTop: 8 }}>
                <span>Total</span>
                <span>₹{total}</span>
              </div>

              <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
                <button
                  className="btn-primary"
                  onClick={() => setPaymentOpen(true)}
                  style={{ flex: 1 }}
                  disabled={processingPayment}
                >
                  {processingPayment ? "Processing…" : "Proceed to Pay"}
                </button>

                <button
                  className="btn-ghost"
                  onClick={() =>
                    generateInvoicePDF({
                      orderId: `INV-${Date.now()}`,
                      user,
                      items: cart,
                      totals: { subtotal, loyalty: loyaltyUsed, total },
                    })
                  }
                  style={{ width: 160 }}
                >
                  Download Invoice
                </button>
              </div>

              <div style={{ marginTop: 12 }}>
                <small style={{ color: "#6b7280" }}>Tip: Use QR scanner or voice assistant to speed up checkout.</small>
              </div>
            </>
          )}
        </motion.div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        open={paymentOpen}
        amount={total}
        onClose={() => setPaymentOpen(false)}
        onSuccess={(paymentDetails) => onPaymentSuccess(paymentDetails)}
      />
    </div>
  );
}
