import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';

export default function CartDrawer({ open, onClose }){
  const { cart, removeFromCart, clearCart, user, pushToast } = useApp();

  const total = cart.reduce((s,i)=> s + (i.price * i.qty), 0);
  const loyaltyValue = Math.min(user.loyaltyPoints, 150);

  function handleCheckout(){
    pushToast({ type:'success', text: `Checkout done. Saved ₹${loyaltyValue}` });
    clearCart();
    onClose();
  }

  return (
    <>
      {open && <div style={backdrop} onClick={onClose} />}
      <motion.div initial={{ x: '100%' }} animate={{ x: open ? 0 : '100%' }} transition={{ type:'spring' }} style={drawer}>
        <div style={{ padding: 18 }}>
          <h3 style={{ fontSize: 18, marginBottom: 8 }}>Cart</h3>
          <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
            {cart.length === 0 && <div style={{ color:'#6b7280' }}>Your cart is empty.</div>}
            {cart.map(item => (
              <div key={item.id} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: 10 }}>
                <img src={item.image} alt="" style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 8 }} />
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight: 600 }}>{item.title}</div>
                  <div style={{ color:'#6b7280' }}>{item.qty} x ₹{item.price}</div>
                </div>
                <button onClick={()=>removeFromCart(item.id)} style={{ background:'transparent', border:'none', color:'#ef4444' }}>Remove</button>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 12, borderTop:'1px solid #e5e7eb', paddingTop:12 }}>
            <div style={{ display:'flex', justifyContent:'space-between' }}>
              <div style={{ color:'#6b7280' }}>Subtotal</div>
              <div>₹{total}</div>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', marginTop:6 }}>
              <div style={{ color:'#6b7280' }}>Loyalty applied</div>
              <div>-₹{loyaltyValue}</div>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', marginTop:10, fontWeight:700 }}>
              <div>Total</div>
              <div>₹{total - loyaltyValue}</div>
            </div>

            <div style={{ marginTop: 12, display:'flex', gap:8 }}>
              <button className="btn-primary" onClick={handleCheckout}>Checkout</button>
              <button className="btn-ghost" onClick={()=>{ clearCart(); pushToast({type:'info', text:'Cart cleared'}); }}>Clear</button>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}

const drawer = {
  position: 'fixed', right:0, top:0, height: '100vh', width: 380, zIndex: 9998, background: 'white', boxShadow: '-12px 0 40px rgba(2,6,23,0.12)'
};

const backdrop = { position:'fixed', inset:0, background:'rgba(9,10,11,0.25)', zIndex:9997 };
