// src/components/kiosk/PaymentModal.js
import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function PaymentModal({ open, onClose, amount, onSuccess }) {
  const [method, setMethod] = useState('card');
  const [processing, setProcessing] = useState(false);

  async function handlePay(e) {
    e.preventDefault();
    setProcessing(true);
    // simulate network delay
    await new Promise(r => setTimeout(r, 1200));
    setProcessing(false);
    onSuccess && onSuccess({ success: true, amount });
    onClose();
  }

  if (!open) return null;
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.45)', zIndex:10000 }}>
      <motion.div initial={{ y: 60, opacity:0 }} animate={{ y:0, opacity:1 }} style={{ width: 520, margin:'80px auto', background:'white', borderRadius:12, padding:18 }}>
        <h3 style={{ marginBottom:8 }}>Payment — ₹{amount}</h3>

        <form onSubmit={handlePay}>
          <div style={{ display:'flex', gap:8, marginBottom:12 }}>
            <label style={{ flex:1 }}>
              <input type="radio" name="method" value="card" checked={method==='card'} onChange={()=>setMethod('card')} /> Card
            </label>
            <label style={{ flex:1 }}>
              <input type="radio" name="method" value="upi" checked={method==='upi'} onChange={()=>setMethod('upi')} /> UPI
            </label>
            <label style={{ flex:1 }}>
              <input type="radio" name="method" value="cash" checked={method==='cash'} onChange={()=>setMethod('cash')} /> Cash
            </label>
          </div>

          {method === 'card' && (
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
              <input required placeholder="Card number" />
              <input required placeholder="Expiry MM/YY" />
              <input required placeholder="Name on card" />
              <input required placeholder="CVV" />
            </div>
          )}

          {method === 'upi' && (
            <div>
              <input required placeholder="Enter UPI ID (example: priya@upi)" />
            </div>
          )}

          {method === 'cash' && <div style={{ color:'#6b7280' }}>Collect cash from customer</div>}

          <div style={{ marginTop:12, display:'flex', gap:8 }}>
            <button type="submit" className="btn-primary" disabled={processing}>{processing ? 'Processing...' : 'Pay Now'}</button>
            <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
