// src/context/AppContext.js
import React, { createContext, useContext, useState, useEffect } from "react";

import { db } from "../firebase";
import {
  doc,
  setDoc,
  getDoc,
  addDoc,
  collection,
  writeBatch,
  serverTimestamp,
} from "firebase/firestore";

import {
  signInWithGooglePopup,
  signOutFirebase,
  emailSignIn,
  emailSignUp,
  onAuthChange,
} from "../firebase";

const AppContext = createContext();

export function AppProvider({ children }) {
  // ----------------------------------------------------
  // STATE
  // ----------------------------------------------------
  const [theme, setTheme] = useState("light");

  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const [cart, setCart] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [toasts, setToasts] = useState([]);

  // ----------------------------------------------------
  // THEME APPLY
  // ----------------------------------------------------
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  // ----------------------------------------------------
  // SAVE CART TO CLOUD
  // ----------------------------------------------------
  async function saveCartToCloud(cartData, userId) {
    if (!userId) return;
    try {
      await setDoc(doc(db, "carts", userId), {
        items: cartData,
        updatedAt: Date.now(),
      });
    } catch (err) {
      console.error("SAVE CART ERROR:", err);
    }
  }

  // ----------------------------------------------------
  // LOAD CART FROM CLOUD
  // ----------------------------------------------------
  async function loadCartFromCloud(userId) {
    if (!userId) return;

    try {
      const ref = doc(db, "carts", userId);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setCart(snap.data().items || []);
      } else {
        setCart([]);
      }
    } catch (err) {
      console.error("LOAD CART ERROR:", err);
    }
  }

  // ----------------------------------------------------
  // UPDATE LOYALTY BACKEND
  // ----------------------------------------------------
  async function updateLoyaltyBackend(userId, points) {
    if (!userId) return;

    try {
      await setDoc(
        doc(db, "loyalty", userId),
        {
          points,
          tier:
            points > 1000 ? "Gold" : points > 500 ? "Silver" : "Bronze",
          updatedAt: Date.now(),
        },
        { merge: true }
      );

      // update local user object instantly
      setUser((prev) => ({
        ...prev,
        loyaltyPoints: points,
      }));
    } catch (err) {
      console.error("LOYALTY UPDATE ERROR:", err);
    }
  }

  // ----------------------------------------------------
  // FIREBASE AUTH LISTENER (MOST IMPORTANT FIX)
  // ----------------------------------------------------
  useEffect(() => {
    const unsub = onAuthChange(async (fbUser) => {
      if (fbUser) {
        let u = {
          id: fbUser.uid,
          name: fbUser.displayName || fbUser.email?.split("@")[0],
          email: fbUser.email,
          loyaltyPoints: 0,
        };

        // Load loyalty if exists
        try {
          const ref = doc(db, "loyalty", u.id);
          const snap = await getDoc(ref);
          if (snap.exists()) {
            u.loyaltyPoints = snap.data().points || 0;
          }
        } catch (err) {
          console.error("LOYALTY LOAD ERROR:", err);
        }

        setUser(u);

        // Load their cloud cart
        await loadCartFromCloud(u.id);
      } else {
        setUser(null);
        setCart([]); // clear cart on logout
      }

      setLoadingUser(false);
    });

    return () => unsub();
  }, []);

  // ----------------------------------------------------
  // CART FUNCTIONS
  // ----------------------------------------------------
  function addToCart(item, qty = 1) {
    setCart((prev) => {
      const existing = prev.find((p) => p.id === item.id);
      let updated;

      if (existing) {
        updated = prev.map((p) =>
          p.id === item.id ? { ...p, qty: p.qty + qty } : p
        );
      } else {
        updated = [...prev, { ...item, qty }];
      }

      if (user?.id) saveCartToCloud(updated, user.id);

      pushToast({ type: "success", text: `${item.title} added to cart.` });

      return updated;
    });
  }

  function removeFromCart(itemId) {
    setCart((prev) => {
      const updated = prev.filter((p) => p.id !== itemId);
      if (user?.id) saveCartToCloud(updated, user.id);
      return updated;
    });
  }

  function clearCart() {
    setCart([]);
    if (user?.id) saveCartToCloud([], user.id);
  }

  // ----------------------------------------------------
  // RESERVATIONS
  // ----------------------------------------------------
  function reserveItem(item) {
    const res = {
      id: `${Date.now()}`,
      item,
      at: new Date().toISOString(),
    };

    setReservations((prev) => [res, ...prev]);
    pushToast({ type: "success", text: `${item.title} reserved.` });
  }

  // ----------------------------------------------------
  // TOAST SYSTEM
  // ----------------------------------------------------
  function pushToast(toast) {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, ...toast }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4200);
  }

  // ----------------------------------------------------
  // AUTH ACTIONS
  // ----------------------------------------------------
  async function loginWithGoogle() {
    try {
      await signInWithGooglePopup();
    } catch (err) {
      pushToast({ type: "error", text: "Google Sign-In Failed" });
      console.error(err);
    }
  }

  async function signUpWithEmail(email, password) {
    try {
      await emailSignUp(email, password);
    } catch (err) {
      pushToast({ type: "error", text: "Signup Failed" });
      throw err;
    }
  }

  async function signInWithEmailAndPassword(email, password) {
    try {
      await emailSignIn(email, password);
    } catch (err) {
      pushToast({ type: "error", text: "Login Failed" });
      throw err;
    }
  }

  async function logout() {
    try {
      await signOutFirebase();
      setUser(null);
      setCart([]);
    } catch (err) {
      pushToast({ type: "error", text: "Logout Failed" });
    }
  }

  // ----------------------------------------------------
  // PLACE ORDER (KIOSK)
  // ----------------------------------------------------
  async function placeOrder() {
    if (!user) {
      pushToast({ type: "error", text: "Please login first." });
      return { ok: false };
    }

    if (cart.length === 0) {
      pushToast({ type: "error", text: "Cart is empty." });
      return { ok: false };
    }

    try {
      const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);

      const ref = await addDoc(collection(db, "orders"), {
        userId: user.id,
        userName: user.name,
        items: cart,
        subtotal,
        createdAt: serverTimestamp(),
        status: "paid",
      });

      // Earn points
      const earned = Math.floor(subtotal / 100);
      await updateLoyaltyBackend(user.id, user.loyaltyPoints + earned);

      clearCart();

      pushToast({
        type: "success",
        text: `Order placed! Earned ${earned} pts.`,
      });

      return { ok: true, orderId: ref.id };
    } catch (err) {
      console.error(err);
      pushToast({ type: "error", text: "Order failed" });
      return { ok: false };
    }
  }

  // ----------------------------------------------------
  // PROVIDER EXPORT
  // ----------------------------------------------------
  return (
    <AppContext.Provider
      value={{
        theme,
        setTheme,

        user,
        loadingUser,

        cart,
        addToCart,
        removeFromCart,
        clearCart,

        reservations,
        reserveItem,

        toasts,
        pushToast,

        loginWithGoogle,
        signUpWithEmail,
        signInWithEmailAndPassword,
        logout,

        placeOrder,

        updateLoyalty: updateLoyaltyBackend,
        saveCartToCloud,
        loadCartFromCloud,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
