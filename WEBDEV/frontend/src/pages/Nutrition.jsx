import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Apple, PlusCircle, Activity, Info } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';

export default function Nutrition() {
  const [lastDiagnosis, setLastDiagnosis] = useState(null);
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('male');
  const [bmi, setBmi] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('patientHistory');
    if (saved) {
      try {
        const history = JSON.parse(saved);
        if (history.length > 0) setLastDiagnosis(history[0].condition);
      } catch (e) {}
    }
  }, []);

  const calculateBMI = () => {
    if (weight && height) {
      const h_m = parseFloat(height) / 100;
      const b = parseFloat(weight) / (h_m * h_m);
      setBmi(b.toFixed(1));
    }
  };

  const getBMIStatus = (bmiValue) => {
    const v = parseFloat(bmiValue);
    if (v < 18.5) return { label: 'Underweight', color: '#60a5fa' };
    if (v <= 24.9) return { label: 'Healthy Weight', color: '#10b981' };
    if (v <= 29.9) return { label: 'Overweight', color: '#f59e0b' };
    return { label: 'Obese', color: '#ef4444' };
  };

  const currentStatus = bmi ? getBMIStatus(bmi) : null;

  const bmiRangesData = [
    { name: 'Underweight', range: 18.5, fill: '#60a5fa' },
    { name: 'Healthy', range: 24.9, fill: '#10b981' },
    { name: 'Overweight', range: 29.9, fill: '#f59e0b' },
    { name: 'Obese', range: 40, fill: '#ef4444' },
  ];

  const getAgeNutrition = () => {
    const a = parseInt(age);
    if (!a) return null;
    if (a < 18) return { text: "Children & Teens (0-17): Prioritize Calcium, Iron, and Protein for growth. Include dairy, leafy greens, and lean meats.", macros: "25% Protein, 45% Carbs, 30% Fats" };
    if (a <= 50) return { text: "Adults (18-50): Focus on lean proteins, complex carbs, and omega-3 fatty acids. Balance iron intake (critical for women).", macros: "30% Protein, 40% Carbs, 30% Fats" };
    return { text: "Seniors (50+): Lower caloric needs but higher Calcium, Vitamin D, and Fiber requirements. Stay well-hydrated.", macros: "20% Protein, 50% Carbs, 30% Fats" };
  };

  const ageInfo = getAgeNutrition();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <div className="page-header">
        <h1 className="page-title">Nutrition & BMI Center</h1>
        <p className="page-desc">Body Mass Index calculator and age-based dietary guidelines.</p>
      </div>

      <div className="grid-2" style={{ marginBottom: '24px' }}>
        <div className="card">
          <div className="card-header"><Activity size={18} color="#2563eb" /> BMI Calculator</div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '4px', color: 'var(--text-muted)' }}>Age</label>
              <input type="number" className="input-field" value={age} onChange={e => setAge(e.target.value)} placeholder="28" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '4px', color: 'var(--text-muted)' }}>Gender</label>
              <select className="input-field" value={gender} onChange={e => setGender(e.target.value)}>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '4px', color: 'var(--text-muted)' }}>Weight (kg)</label>
              <input type="number" className="input-field" value={weight} onChange={e => setWeight(e.target.value)} placeholder="70" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '4px', color: 'var(--text-muted)' }}>Height (cm)</label>
              <input type="number" className="input-field" value={height} onChange={e => setHeight(e.target.value)} placeholder="175" />
            </div>
          </div>
          <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={calculateBMI} disabled={!height || !weight}>
            Calculate
          </button>
          {bmi && (
            <div style={{ marginTop: '16px', padding: '16px', borderRadius: '8px', textAlign: 'center', border: `1px solid ${currentStatus.color}`, background: 'rgba(0,0,0,0.2)' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 700, color: currentStatus.color }}>{bmi}</div>
              <div style={{ fontSize: '0.9rem', color: currentStatus.color, fontWeight: 500 }}>{currentStatus.label}</div>
            </div>
          )}
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="card-header"><Info size={18} color="#2563eb" /> BMI Reference Ranges</div>
          <div style={{ flex: 1, minHeight: '200px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bmiRangesData} layout="vertical" margin={{ top: 0, right: 20, left: -10, bottom: 0 }}>
                <XAxis type="number" domain={[0, 40]} hide />
                <YAxis dataKey="name" type="category" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                  itemStyle={{ color: '#f1f5f9' }}
                  labelStyle={{ color: '#94a3b8' }}
                />
                <Bar dataKey="range" radius={[0, 4, 4, 0]}>
                  {bmiRangesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
                {bmi && <ReferenceLine x={parseFloat(bmi)} stroke="#fff" strokeWidth={2} strokeDasharray="3 3" label={{ position: 'top', value: 'You', fill: '#fff', fontSize: 11 }} />}
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '8px' }}>
            Standard BMI chart. Optimal body fat % differs by gender.
          </p>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-header">Age-Based Nutrition</div>
          {ageInfo ? (
            <>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '16px', fontSize: '0.9rem', lineHeight: '1.6' }}>{ageInfo.text}</p>
              <div className="info-block info-block-blue">
                <strong style={{ fontSize: '0.85rem' }}>Macros Target:</strong>
                <span style={{ color: 'var(--text-secondary)', marginLeft: '8px', fontSize: '0.85rem' }}>{ageInfo.macros}</span>
              </div>
            </>
          ) : (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Enter your age in the BMI calculator to see age-specific nutritional guidance.</p>
          )}
        </div>

        <div className="card">
          {lastDiagnosis ? (
            <>
              <div className="card-header"><Apple size={18} color="#10b981" /> Diet for: {lastDiagnosis}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div className="info-block info-block-green"><strong>Hydration:</strong> 3+ liters of water and clear broths daily.</div>
                <div className="info-block info-block-green"><strong>Vitamins:</strong> Vitamin C-rich fruits — oranges, kiwis, lemons.</div>
                <div className="info-block info-block-red"><strong>Avoid:</strong> Processed foods, refined sugars, deep-fried items.</div>
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '24px' }}>
              <PlusCircle size={36} opacity={0.3} style={{ margin: '0 auto 12px' }} />
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Run a diagnosis to unlock condition-specific diet advice.</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
