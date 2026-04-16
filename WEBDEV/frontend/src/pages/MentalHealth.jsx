import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, ArrowRight, AlertCircle, RefreshCw } from 'lucide-react';

const questions = [
  "Little interest or pleasure in doing things",
  "Feeling down, depressed, or hopeless",
  "Trouble falling or staying asleep, or sleeping too much",
  "Feeling tired or having little energy",
  "Poor appetite or overeating",
  "Feeling bad about yourself — or that you are a failure",
  "Trouble concentrating on things",
  "Moving or speaking noticeably slowly, or being very fidgety/restless",
  "Thoughts that you would be better off dead or of hurting yourself",
];

const scoringOpts = [
  { label: "Not at all", score: 0 },
  { label: "Several days", score: 1 },
  { label: "More than half the days", score: 2 },
  { label: "Nearly every day", score: 3 }
];

export default function MentalHealth() {
  const [answers, setAnswers] = useState(Array(9).fill(null));
  const [submitted, setSubmitted] = useState(false);

  const totalScore = answers.reduce((a, b) => a + (b || 0), 0);
  const isComplete = answers.every(a => a !== null);

  const handleSelect = (idx, score) => {
    const fresh = [...answers];
    fresh[idx] = score;
    setAnswers(fresh);
  };

  const getResult = () => {
    if (totalScore <= 4) return { label: "Minimal depression", desc: "Wellness maintenance recommended.", color: "#10b981", urgent: false };
    if (totalScore <= 9) return { label: "Mild depression", desc: "Monitor symptoms. Consider self-guided behavioral steps.", color: "#f59e0b", urgent: false };
    if (totalScore <= 14) return { label: "Moderate depression", desc: "Clinical consultation is recommended.", color: "#f87171", urgent: false };
    if (totalScore <= 19) return { label: "Moderately severe", desc: "Active treatment with a professional is indicated.", color: "#ef4444", urgent: true };
    return { label: "Severe depression", desc: "Immediate clinical intervention and therapy required.", color: "#b91c1c", urgent: true };
  };

  const result = submitted ? getResult() : null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <div className="page-header">
        <h1 className="page-title" style={{ color: '#a78bfa' }}>Mental Wellness Protocol</h1>
        <p className="page-desc">PHQ-9 Clinical Assessment — standardized depressive symptom evaluation.</p>
      </div>

      {!submitted ? (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', background: 'rgba(0,0,0,0.2)' }}>
            <div className="card-header" style={{ marginBottom: 0 }}>
              <Brain size={20} color="#a78bfa" /> Over the last 2 weeks, how often have you been bothered by:
            </div>
          </div>

          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', maxHeight: '55vh', overflowY: 'auto' }}>
            {questions.map((q, qi) => (
              <div key={qi} style={{ padding: '16px', background: 'rgba(0,0,0,0.15)', borderRadius: '8px', borderLeft: '3px solid #a78bfa' }}>
                <p style={{ fontWeight: 500, marginBottom: '12px', fontSize: '0.9rem' }}>{qi + 1}. {q}</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
                  {scoringOpts.map(opt => (
                    <button
                      key={opt.score}
                      onClick={() => handleSelect(qi, opt.score)}
                      style={{
                        textAlign: 'left',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        fontSize: '0.85rem',
                        background: answers[qi] === opt.score ? 'rgba(167, 139, 250, 0.2)' : 'rgba(0,0,0,0.2)',
                        border: answers[qi] === opt.score ? '1px solid #a78bfa' : '1px solid var(--border)',
                        color: answers[qi] === opt.score ? '#e2e8f0' : 'var(--text-muted)',
                        cursor: 'pointer',
                        transition: 'all 0.15s'
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{answers.filter(a => a !== null).length} / 9 answered</span>
            <button className="btn-primary" disabled={!isComplete} onClick={() => setSubmitted(true)} style={{ background: isComplete ? '#a78bfa' : undefined }}>
              Generate Analysis <ArrowRight size={16} />
            </button>
          </div>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid-2">
          <div className="card" style={{ textAlign: 'center', padding: '48px 24px', border: `1px solid ${result.color}` }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>PHQ-9 Severity Index</p>
            <div style={{ fontSize: '3.5rem', fontWeight: 700, color: result.color }}>{totalScore}<span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 400 }}> / 27</span></div>
            <div style={{ fontSize: '1.1rem', color: result.color, fontWeight: 600, marginTop: '8px' }}>{result.label}</div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '8px', maxWidth: '300px', margin: '8px auto 24px' }}>{result.desc}</p>
            <button className="btn-outline" onClick={() => { setAnswers(Array(9).fill(null)); setSubmitted(false); }}>
              <RefreshCw size={16} /> Retake Assessment
            </button>
          </div>

          <div className="card">
            <div className="card-header"><Brain size={18} color="#a78bfa" /> Wellness Guidance</div>

            {result.urgent && (
              <div className="info-block info-block-red" style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', fontWeight: 600, fontSize: '0.85rem', marginBottom: '4px', color: 'var(--danger)' }}>
                  <AlertCircle size={16} /> Urgent Care Recommended
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  Your score indicates significant clinical distress. Please contact the Medical Advice Helpline (104) or visit the Emergency tab immediately.
                </p>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div className="info-block info-block-blue">
                <strong style={{ fontSize: '0.85rem' }}>Sleep Routine:</strong>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginLeft: '6px' }}>Fix wake-up and bedtime to regulate circadian rhythm.</span>
              </div>
              <div className="info-block info-block-blue">
                <strong style={{ fontSize: '0.85rem' }}>Social Connection:</strong>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginLeft: '6px' }}>Low-barrier daily interactions — a message, a brief walk.</span>
              </div>
              <div className="info-block info-block-yellow">
                <strong style={{ fontSize: '0.85rem' }}>Professional Help:</strong>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginLeft: '6px' }}>If symptoms persist, consult a licensed therapist.</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
