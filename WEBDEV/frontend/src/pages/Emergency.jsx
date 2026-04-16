import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, PhoneCall } from 'lucide-react';

const hotlines = [
  { name: "Universal Emergency", desc: "Police, fire, and ambulance — 36 states/UTs", number: "112", color: "#ef4444" },
  { name: "Emergency Response Service", desc: "Critical trauma and accident victims — 23+ states", number: "108", color: "#10b981" },
  { name: "National Highway Ambulance", desc: "Road accidents on national highways", number: "1033", color: "#f59e0b" },
  { name: "Medical Advice Helpline", desc: "Consultation, mental distress, nearby hospitals", number: "104", color: "#3b82f6" },
  { name: "Patient Transport (JSSK)", desc: "Free transport for pregnant women, infants, referrals", number: "102", color: "#a78bfa" },
];

export default function Emergency() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <div className="page-header">
        <h1 className="page-title" style={{ color: '#ef4444' }}>Emergency Response</h1>
        <p className="page-desc">Critical triage warnings and national emergency contacts.</p>
      </div>

      <div className="grid-2">
        <div className="card" style={{ border: '1px solid rgba(239,68,68,0.3)' }}>
          <div className="card-header" style={{ color: '#ef4444' }}>
            <AlertTriangle size={20} /> Critical Triage Warning
          </div>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '16px', fontSize: '0.9rem', lineHeight: '1.6' }}>
            If you or someone nearby is experiencing any of the following, <strong style={{ color: 'var(--text-primary)' }}>do not wait for AI diagnosis</strong>. Call emergency services immediately.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              "Severe, crushing chest pain",
              "Sudden numbness or facial drooping",
              "Difficulty breathing or gasping",
              "Uncontrolled bleeding or deep wounds",
              "Sudden confusion or inability to speak"
            ].map((item, i) => (
              <div key={i} className="info-block info-block-red" style={{ padding: '10px 14px', fontSize: '0.85rem' }}>
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <PhoneCall size={20} color="#10b981" /> National Emergency Hotlines
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {hotlines.map((h, i) => (
              <div key={i} style={{ padding: '14px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{h.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', maxWidth: '220px' }}>{h.desc}</div>
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: h.color, fontVariantNumeric: 'tabular-nums' }}>{h.number}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
