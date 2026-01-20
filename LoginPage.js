// src/pages/LoginPage.js
import React, { useState } from "react";
import { useApp } from "../context/AppContext";

export default function LoginPage({ setScreen }) {
  const {
    loginWithGoogle,
    signUpWithEmail,
    signInWithEmailAndPassword,
    loadingUser,
    user,
    pushToast
  } = useApp();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // If already logged in → go home
  if (!loadingUser && user) {
    setScreen("home");
  }

  async function handleLogin() {
    try {
      await signInWithEmailAndPassword(email, password);
      setScreen("home");
    } catch (err) {
      pushToast({ type: "error", text: "Invalid credentials" });
    }
  }

  async function handleSignup() {
    try {
      await signUpWithEmail(email, password);
      await signInWithEmailAndPassword(email, password);
      setScreen("home");
    } catch (err) {
      pushToast({ type: "error", text: "Signup failed" });
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0f172a",
        color: "white",
        padding: 20
      }}
    >
      <div
        style={{
          width: 380,
          background: "rgba(255,255,255,0.06)",
          padding: 28,
          borderRadius: 16,
          backdropFilter: "blur(14px)"
        }}
      >
        <h2 style={{ marginBottom: 20, fontWeight: 700 }}>Login</h2>

        {/* Email */}
        <input
          placeholder="email@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            padding: 12,
            borderRadius: 10,
            marginBottom: 12,
            border: "none"
          }}
        />

        {/* Password */}
        <input
          placeholder="•••••••"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: 12,
            borderRadius: 10,
            marginBottom: 20,
            border: "none"
          }}
        />

        {/* LOGIN */}
        <button
          onClick={handleLogin}
          style={{
            width: "100%",
            padding: 12,
            background: "#0ea5e9",
            border: "none",
            color: "white",
            borderRadius: 10,
            marginBottom: 12,
            fontWeight: 600,
            cursor: "pointer"
          }}
        >
          Login
        </button>

        {/* SIGN UP */}
        <button
          onClick={handleSignup}
          style={{
            width: "100%",
            padding: 12,
            background: "#22c55e",
            border: "none",
            color: "white",
            borderRadius: 10,
            marginBottom: 20,
            fontWeight: 600,
            cursor: "pointer"
          }}
        >
          Create Account
        </button>

        {/* Google */}
        <button
          onClick={async () => {
            await loginWithGoogle();
            setScreen("home");
          }}
          style={{
            width: "100%",
            padding: 12,
            background: "white",
            color: "black",
            borderRadius: 10,
            fontWeight: 600,
            cursor: "pointer"
          }}
        >
          Continue with Google
        </button>
      </div>
    </div>
  );
}
