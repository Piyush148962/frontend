// src/pages/CloudSyncSim.js
import React, { useEffect, useState } from "react";
import { useApp } from "../context/AppContext";

export default function CloudSyncSim({ setScreen }) {
  const { pushToast, addToCart } = useApp();
  const [channelSupported] = useState(typeof window.BroadcastChannel !== 'undefined');
  const [logs, setLogs] = useState([]);
  const bcRef = React.useRef(null);

  useEffect(() => {
    if (!channelSupported) return;
    const bc = new BroadcastChannel('ey-tech-sync');
    bc.onmessage = (ev) => {
      const msg = ev.data;
      setLogs(l => [`Received: ${msg.type} @ ${new Date().toLocaleTimeString()}`, ...l].slice(0,50));
      if (msg.type === 'sync-cart') {
        // in demo we add a sample item
        addToCart({ id: `sync-${Date.now()}`, title: msg.payload?.title || 'Synced Item', price: 499, image: 'https://picsum.photos/seed/sync/200/300', qty: 1 });
        pushToast({ type:'success', text: 'Cart synced from another device' });
      }
    };
    bcRef.current = bc;
    return () => bc.close();
    // eslint-disable-next-line
  }, []);

  function sendSync(){
    const bc = bcRef.current;
    if(!bc) { pushToast({ type:'error', text: 'BroadcastChannel not supported' }); return; }
    const msg = { type: 'sync-cart', payload: { title: 'Cloud-synced Dress' }, at: Date.now() };
    bc.postMessage(msg);
    setLogs(l => [`Sent: sync-cart @ ${new Date().toLocaleTimeString()}` , ...l].slice(0,50));
    pushToast({ type:'success', text: 'Sent sync message to other tabs' });
  }

  return (
    <div className="container" style={{ padding: 20 }}>
      <button className="btn-ghost" onClick={() => setScreen("home")}>← Back</button>
      <h1>Cloud Sync Simulation</h1>

      <div className="card" style={{ marginTop: 12 }}>
        <p style={{ color: '#6b7280' }}>This simulates cloud sync across browser tabs using BroadcastChannel. Open another tab of the app and press Sync.</p>
        <div style={{ display:'flex', gap:8 }}>
          <button className="btn-primary" onClick={sendSync}>Send Sync</button>
          <button className="btn-ghost" onClick={() => addToCart({ id: 'cloud-demo', title: 'Cloud Demo Item', price: 799, image: 'https://picsum.photos/seed/cloud/200/300', qty:1 })}>Add Demo Item</button>
        </div>

        <div style={{ marginTop: 12 }}>
          <h4>Activity Log</h4>
          <div style={{ maxHeight: 220, overflowY: 'auto' }}>
            {logs.map((l, i) => <div key={i} style={{ padding:8, borderBottom:'1px solid #eee' }}>{l}</div>)}
          </div>
        </div>
      </div>
    </div>
  );
}
