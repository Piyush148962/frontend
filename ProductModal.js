import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';

export default function ProductModal({ item, onClose }){
  const { addToCart } = useApp();
  if(!item) return null;

  return (
    <div style={overlayStyle} onClick={onClose}>
      <motion.div layout className="card" onClick={e=>e.stopPropagation()} style={{ maxWidth: 900, margin: '36px auto' }}>
        <div style={{ display: 'flex', gap: 18 }}>
          <img src={item.image} alt={item.title} style={{ width: 320, height: 320, objectFit: 'cover', borderRadius: 12 }} />
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: 22, marginBottom: 6 }}>{item.title}</h3>
            <p style={{ color: '#6b7280' }}>{item.subtitle}</p>
            <div style={{ marginTop: 12, fontWeight: 700, fontSize: 18 }}>₹{item.price}</div>

            <div style={{ marginTop: 18, display: 'flex', gap: 8 }}>
              <button className="btn-primary" onClick={()=>{ addToCart(item); onClose(); }}>Add to cart</button>
              <button onClick={()=>{ onClose(); }} className="btn-ghost">Close</button>
            </div>

            <div style={{ marginTop: 18, color:'#374151', fontSize: 14 }}>
              <strong>Details:</strong>
              <p>{item.description || 'Premium fabric. Lightweight and breathable. Perfect for summer and beach occasions.'}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

const overlayStyle = {
  position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
  background: 'rgba(9,10,11,0.35)', zIndex: 10000
};
