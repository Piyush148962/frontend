// src/components/kiosk/VoiceAssistant.js
import React, { useEffect, useRef, useState } from 'react';

export default function VoiceAssistant({ onResult, onTranscript }) {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      recognitionRef.current = null;
      return;
    }
    const r = new SpeechRecognition();
    r.lang = 'en-IN';
    r.interimResults = false;
    r.maxAlternatives = 1;
    r.continuous = true;

    r.onresult = (ev) => {
      const text = Array.from(ev.results).map(r => r[0].transcript).join(' ');
      onResult && onResult(text);
      onTranscript && onTranscript(text);
    };
    r.onerror = (e) => console.error('Speech recog error', e);
    recognitionRef.current = r;
    // eslint-disable-next-line
  }, []);

  function start() {
    if (!recognitionRef.current) return alert('Speech Recognition not supported in this browser.');
    recognitionRef.current.start();
    setListening(true);
  }
  function stop() {
    if (!recognitionRef.current) return;
    recognitionRef.current.stop();
    setListening(false);
  }

  function speak(text) {
    if (!window.speechSynthesis) return;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'en-IN';
    utter.rate = 1;
    window.speechSynthesis.speak(utter);
  }

  return (
    <div style={{ display:'flex', gap:8, alignItems:'center' }}>
      <button onClick={listening ? stop : start} className="btn-ghost" style={{ padding: '8px 12px' }}>
        {listening ? 'Stop Listening' : 'Start Voice'}
      </button>
      <button onClick={() => speak('Hello, how can I help you today?')} className="btn-primary" style={{ padding: '8px 12px' }}>
        Speak (Test)
      </button>
    </div>
  );
}
