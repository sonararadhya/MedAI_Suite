import { API_BASE_URL } from "../config";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Search, X, AlertCircle, ShieldCheck, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Diagnosis() {
  const [availableSymptoms, setAvailableSymptoms] = useState([]);
  const [symptoms, setSymptoms] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [days, setDays] = useState(1);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/symptoms`)
      .then(res => setAvailableSymptoms(res.data.symptoms))
      .catch(err => console.error(err));
  }, []);

  const addSymptom = (symp) => {
    if (!symptoms.includes(symp)) setSymptoms([...symptoms, symp]);
    setSearchTerm('');
  };

  const removeSymptom = (symp) => {
    setSymptoms(symptoms.filter(s => s !== symp));
  };

  const filteredSymptoms = searchTerm.length > 1
    ? availableSymptoms.filter(s => s.toLowerCase().includes(searchTerm.toLowerCase()) && !symptoms.includes(s)).slice(0, 8)
    : [];

  const handleDiagnose = async () => {
    if (symptoms.length === 0) return;
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/diagnose`, {
        symptoms,
        days: parseInt(days)
      });
      const preds = res.data.predictions;
      setResults(preds);
      if (preds && preds.length > 0 && preds[0].probability > 0) {
        const newRecord = {
          id: Date.now(),
          date: new Date().toISOString().split('T')[0],
          condition: preds[0].disease,
          probability: preds[0].probability,
          days: parseInt(days),
          symptoms: [...symptoms]
        };
        const prev = JSON.parse(localStorage.getItem('patientHistory') || '[]');
        localStorage.setItem('patientHistory', JSON.stringify([newRecord, ...prev]));
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const getBarColor = (prob) => {
    if (prob >= 70) return '#2563eb';
    if (prob >= 40) return '#3b82f6';
    return '#64748b';
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <div className="page-header">
        <h1 className="page-title">Diagnostic Portal</h1>
        <p className="page-desc">Enter symptoms to receive a ranked prognostic evaluation powered by TF-IDF clinical matching.</p>
      </div>

      <div className="grid-2">
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <div className="card-header"><Search size={18} /> Symptom Input</div>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="input-field"
                placeholder="Type a symptom... (e.g. headache, cough)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && filteredSymptoms.length > 0) {
                    addSymptom(filteredSymptoms[0]);
                  }
                }}
              />
              {filteredSymptoms.length > 0 && (
                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'var(--bg-secondary)', zIndex: 10, borderRadius: '8px', marginTop: '4px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                  {filteredSymptoms.map((s, idx) => (
                    <div key={idx} onClick={() => addSymptom(s)} className="dropdown-item">
                      {s.replace(/_/g, ' ')}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="symptoms-container">
              <AnimatePresence>
                {symptoms.map(s => (
                  <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0 }} key={s} className="symptom-tag" onClick={() => removeSymptom(s)}>
                    {s.replace(/_/g, ' ')} <X size={14} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500, fontSize: '0.9rem' }}>Duration (days)</label>
            <input type="number" min="1" className="input-field" value={days} onChange={e => setDays(e.target.value)} />
          </div>

          <button className="btn-primary" onClick={handleDiagnose} disabled={loading || symptoms.length === 0} style={{ width: '100%', marginTop: 'auto', justifyContent: 'center' }}>
            {loading ? 'Analyzing...' : 'Run Diagnosis'}
          </button>
        </div>

        <div>
          {results ? (
            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="card" style={{ height: '100%' }}>
              <div className="card-header"><FileText size={18} /> Analysis Results</div>

              <div style={{ height: '220px', width: '100%', marginBottom: '20px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={results} layout="vertical" margin={{ left: 10, right: 50 }}>
                    <XAxis type="number" domain={[0, 100]} hide />
                    <YAxis dataKey="disease" type="category" width={130} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                      itemStyle={{ color: '#f1f5f9' }}
                      labelStyle={{ color: '#94a3b8' }}
                      formatter={(val) => [`${val}%`, 'Confidence']}
                    />
                    <Bar dataKey="probability" radius={[0, 4, 4, 0]} label={{ position: 'right', fill: '#94a3b8', fontSize: 12, formatter: (v) => `${v}%` }}>
                      {results.map((entry, idx) => (
                        <Cell key={idx} fill={getBarColor(entry.probability)} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {results[0].description && (
                <div className="info-block info-block-blue" style={{ marginBottom: '16px' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{results[0].disease}</span>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '4px' }}>{results[0].description}</p>
                </div>
              )}

              {results[0].precautions.length > 0 && (
                <div className="info-block info-block-green">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent)', marginBottom: '8px', fontWeight: 600, fontSize: '0.85rem' }}>
                    <ShieldCheck size={16} /> Precautionary Measures
                  </div>
                  <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {results[0].precautions.map((p, i) => (
                      <li key={i} style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{p}</li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          ) : (
            <div className="card" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: 'var(--text-muted)', gap: '12px', borderStyle: 'dashed' }}>
              <AlertCircle size={40} opacity={0.4} />
              <p style={{ fontSize: '0.9rem' }}>Select symptoms and run diagnosis.</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
