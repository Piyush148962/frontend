// paste this entire file (overwrite existing ChatWindow.js)
import React, { useState, useEffect, useRef } from 'react';
import { mockInventory } from '../data/mockInventory';
import { useApp } from '../context/AppContext';
import ProductModal from './common/ProductModal';
import { v4 as uuidv4 } from 'uuid';
import { motion } from 'framer-motion';

export default function ChatWindow({ user }) {
  const [messages, setMessages] = useState([
    { id: uuidv4(), from: "agent", text: `Hi ${user.name}! I’m your personal shopping assistant. Tell me about the occasion.`, at: new Date().toISOString() }
  ]);
  const [input, setInput] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [typing, setTyping] = useState(false);
  const [modalItem, setModalItem] = useState(null);
  const { addToCart, reserveItem, pushToast } = useApp();
  const scrollRef = useRef(null);

  useEffect(() => {
    const handler = (e) => sendMessage(e.detail);
    window.addEventListener('quick-prompt', handler);
    return () => window.removeEventListener('quick-prompt', handler);
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, recommendations, typing]);

  function scrollToBottom(){
    if(scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }

  function pushMessage(from, text){
    setMessages(m => [...m, { id: uuidv4(), from, text, at: new Date().toISOString() }]);
  }

  async function sendMessage(text) {
    if(!text) return;
    pushMessage('user', text);
    setInput('');
    setTyping(true);

    await delay(600);
    // improved quick intent detection
    const txt = text.toLowerCase();
    if(txt.includes('wedding') || txt.includes('beach')){
      pushMessage('agent','Lovely — I’ll find linen dresses & matching shoes.');
      await delay(400);
      const recs = matchInventory(txt);
      setRecommendations(recs);
      pushMessage('agent', `I found ${recs.length} picks — showing them below.`);
    } else if(txt.includes('reserve')){
      // if user says reserve, pick first recommended
      if(recommendations.length){
        reserveItem(recommendations[0]);
        pushMessage('agent', `Reserved ${recommendations[0].title} in Trial Room 2.`);
      } else {
        pushMessage('agent','Which item would you like to reserve? (You can pick from suggestions)');
      }
    } else {
      pushMessage('agent','Can you share the occasion, preferred color or size?');
    }

    setTyping(false);
  }

  function matchInventory(txt){
    const recs = mockInventory.filter(item => {
      if(txt.includes('linen') && item.tags?.includes('linen')) return true;
      if(txt.includes('beach') && item.tags?.includes('beach')) return true;
      return item.tags?.includes('dress') || item.tags?.includes('casual');
    });
    return recs.length ? recs.slice(0,4) : mockInventory.slice(0,3);
  }

  function handleReserve(item){
    reserveItem(item);
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', height: '520px' }}>
      <div ref={scrollRef} style={{ flex: 1, overflowY:'auto', padding: 12 }} className="chat-scroll">
        {messages.map(m => (
          <div key={m.id} style={{ display:'flex', marginBottom: 12, alignItems:'flex-end', justifyContent: m.from==='user' ? 'flex-end' : 'flex-start' }}>
            {m.from !== 'user' && <div style={{ width:36, height:36, borderRadius:999, background:'#fde68a', display:'flex', alignItems:'center', justifyContent:'center', marginRight:8, fontWeight:700 }}>{m.from[0].toUpperCase()}</div>}
            <motion.div initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.18 }} style={{
              maxWidth: '78%',
              padding: '10px 12px',
              borderRadius: 12,
              background: m.from==='user' ? 'linear-gradient(90deg,#0ea5e9,#06b6d4)' : '#fff',
              color: m.from==='user' ? '#fff' : '#0f172a',
              boxShadow: '0 4px 12px rgba(2,6,23,0.06)'
            }}>
              <div style={{ fontSize: 14, lineHeight: 1.4 }}>{m.text}</div>
              <div style={{ fontSize: 11, color: m.from==='user' ? 'rgba(255,255,255,0.85)' : '#9ca3af', marginTop:8 }}>{new Date(m.at).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</div>
            </motion.div>
            {m.from === 'user' && <div style={{ width:36, height:36, borderRadius:999, background:'#c7f9ff', display:'flex', alignItems:'center', justifyContent:'center', marginLeft:8 }}>U</div>}
          </div>
        ))}

        {typing && (
          <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom: 8 }}>
            <div style={{ width:36, height:36, borderRadius:999, background:'#fde68a', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700 }}>A</div>
            <div style={{ background: '#fff', padding: '8px 12px', borderRadius: 12, boxShadow:'0 6px 18px rgba(2,6,23,0.06)' }}>
              <div style={{ display:'flex', gap:6 }}>
                <div style={{ width:6, height:6, borderRadius:6, background:'#cbd5e1', animation: 'blink 1.3s linear infinite' }} />
                <div style={{ width:6, height:6, borderRadius:6, background:'#cbd5e1', animation: 'blink 1.3s linear .2s infinite' }} />
                <div style={{ width:6, height:6, borderRadius:6, background:'#cbd5e1', animation: 'blink 1.3s linear .4s infinite' }} />
              </div>
            </div>
          </div>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div style={{ marginTop: 12, display:'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap:12 }}>
            {recommendations.map(r => (
              <div key={r.id} className="card" style={{ padding:10 }}>
                <img src={r.image} style={{ width:'100%', height:160, objectFit:'cover', borderRadius:10 }} alt={r.title} />
                <div style={{ marginTop:8, fontWeight:700 }}>{r.title}</div>
                <div style={{ color:'#6b7280', marginTop:4 }}>{r.subtitle}</div>
                <div style={{ display:'flex', gap:8, marginTop:10 }}>
                  <button onClick={()=>setModalItem(r)} className="btn-ghost" style={{ flex:1 }}>View</button>
                  <button onClick={()=>addToCart(r)} className="btn-primary" style={{ flex:1 }}>Add</button>
                  <button onClick={()=>handleReserve(r)} className="btn-ghost" style={{ flex:1 }}>Reserve</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ padding: 12, borderTop: '1px solid #e6e9ef', display:'flex', gap:8 }}>
        <input value={input} onChange={(e)=>setInput(e.target.value)} placeholder="Type: I have a beach wedding next week" onKeyDown={(e)=> e.key==='Enter' && sendMessage(input)} style={{ flex:1, padding:12, borderRadius:12, border:'1px solid #e6e9ef' }} />
        <button className="btn-primary" onClick={()=>sendMessage(input)}>Send</button>
      </div>

      {modalItem && <ProductModal item={modalItem} onClose={()=>setModalItem(null)} />}
    </div>
  );
}

function delay(ms){ return new Promise(res => setTimeout(res, ms)); }
