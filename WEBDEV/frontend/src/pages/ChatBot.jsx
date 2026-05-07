import { API_BASE_URL } from "../config";
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Send, Bot, User } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ChatBot() {
  const [messages, setMessages] = useState([
    { role: 'bot', content: 'Hello. I am your MedAI advisor. Describe your symptoms or ask any health-related question.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    const newChat = [...messages, { role: 'user', content: userMsg }];
    setMessages(newChat);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE_URL}/chat`, {
        message: userMsg,
        history: messages.filter(m => m.role !== 'system')
      });
      setMessages([...newChat, res.data]);
    } catch (e) {
      setMessages([...newChat, { role: 'bot', content: 'Unable to reach medical server. Please ensure the backend is running and try again.' }]);
    }
    setLoading(false);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="page-header">
        <h1 className="page-title">AI Medical Advisor</h1>
        <p className="page-desc">Conversational medical guidance powered by Google Gemini.</p>
      </div>

      <div className="card chat-container" style={{ flex: 1 }}>
        <div className="chat-messages" ref={scrollRef}>
          {messages.map((m, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              key={idx}
              className={`chat-bubble ${m.role}`}
              style={{ display: 'flex', gap: '10px' }}
            >
              {m.role === 'bot' && <Bot size={20} style={{ marginTop: '2px', opacity: 0.6, flexShrink: 0 }} />}
              <div style={{ flex: 1, whiteSpace: 'pre-wrap' }}>{m.content}</div>
              {m.role === 'user' && <User size={20} style={{ marginTop: '2px', opacity: 0.6, flexShrink: 0 }} />}
            </motion.div>
          ))}
          {loading && (
            <div className="chat-bubble bot" style={{ display: 'flex', gap: '10px' }}>
              <Bot size={20} opacity={0.6} />
              <div style={{ color: 'var(--text-muted)' }}>Thinking...</div>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <input
            type="text"
            className="input-field"
            placeholder="Describe symptoms or ask a health question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            style={{ flex: 1 }}
          />
          <button className="btn-primary" onClick={handleSend} disabled={loading || !input.trim()}>
            <Send size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
