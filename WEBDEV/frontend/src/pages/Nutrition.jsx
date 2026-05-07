import { useState } from 'react';
import { Apple, Upload, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function Nutrition() {
  const [conditions, setConditions] = useState('');
  const [allergies, setAllergies] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const generatePlan = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    const formData = new FormData();
    formData.append('conditions', conditions);
    formData.append('allergies', allergies);
    if (file) {
      formData.append('file', file);
    }

    try {
      const res = await fetch('http://localhost:8000/api/diet_plan', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Failed to generate diet plan');

      const data = await res.json();
      setResult(data.plan);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">AI Diet Planner</h1>
        <p className="page-desc">Generate personalized meal plans based on your conditions. Upload a meal photo to estimate calories.</p>
      </div>

      <div className="grid-2">
        <div className="card">
          <h2 className="card-header"><Apple size={20} className="text-primary" /> Patient Profile</h2>
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Conditions (e.g., Diabetes, High BP, Weight Loss)</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="Enter conditions..."
              value={conditions}
              onChange={(e) => setConditions(e.target.value)}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Allergies</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="Enter allergies (e.g., Peanuts, Gluten)..."
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Upload Meal Photo (Optional - for calorie estimation)</label>
            <input 
              type="file" 
              accept=".png,.jpg,.jpeg" 
              onChange={handleFileChange}
              className="input-field"
              style={{ padding: '12px', background: 'rgba(0,0,0,0.2)' }}
            />
            {file && <div style={{ marginTop: '10px', fontSize: '0.9rem', color: 'var(--accent-light)' }}>Selected: {file.name}</div>}
          </div>

          <button 
            className="btn-success" 
            onClick={generatePlan} 
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center' }}
          >
            {loading ? 'Generating Plan...' : 'Generate Diet Plan'}
          </button>
          
          {error && (
            <div className="info-block info-block-red" style={{ marginTop: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--danger)', fontWeight: 600 }}>
                <AlertCircle size={18} /> Error
              </div>
              <p style={{ marginTop: '8px', fontSize: '0.9rem' }}>{error}</p>
            </div>
          )}
        </div>

        <div className="card">
          <h2 className="card-header"><Apple size={20} className="text-primary" /> Diet Plan & Calorie Estimate</h2>
          <div style={{ minHeight: '300px', background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '8px', overflowY: 'auto' }}>
            {loading ? (
              <div style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '40px' }}>
                <div className="spinner"></div>
                Analyzing with Gemini AI...
              </div>
            ) : result ? (
              <div style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>
                <ReactMarkdown>{result}</ReactMarkdown>
              </div>
            ) : (
              <div style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '80px' }}>
                Fill out your profile to generate a customized diet plan.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
