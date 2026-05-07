import { useState } from 'react';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { API_BASE_URL } from '../config';

export default function ReportAnalyzer() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const analyzeReport = async () => {
    if (!file) {
      setError('Please select a file first.');
      return;
    }
    
    setLoading(true);
    setError('');
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`${API_BASE_URL}/analyze_report`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Analysis failed');

      const data = await res.json();
      setResult(data.analysis);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">AI Medical Report Analyzer</h1>
        <p className="page-desc">Upload blood reports, X-rays, MRI summaries, or ECG PDFs for AI analysis.</p>
      </div>

      <div className="grid-2">
        <div className="card">
          <h2 className="card-header"><Upload size={20} className="text-primary" /> Upload Report</h2>
          
          <div style={{ marginBottom: '20px' }}>
            <input 
              type="file" 
              accept=".pdf,.png,.jpg,.jpeg" 
              onChange={handleFileChange}
              className="input-field"
              style={{ padding: '12px', background: 'rgba(0,0,0,0.2)' }}
            />
            {file && <div style={{ marginTop: '10px', fontSize: '0.9rem', color: 'var(--accent-light)' }}>Selected: {file.name}</div>}
          </div>

          <button 
            className="btn-primary" 
            onClick={analyzeReport} 
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center' }}
          >
            {loading ? 'Analyzing...' : 'Analyze Report'}
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
          <h2 className="card-header"><FileText size={20} className="text-primary" /> Analysis Results</h2>
          <div style={{ minHeight: '200px', background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '8px' }}>
            {loading ? (
              <div style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '40px' }}>
                <div className="spinner"></div>
                Processing with Gemini AI...
              </div>
            ) : result ? (
              <div style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>
                <ReactMarkdown>{result}</ReactMarkdown>
              </div>
            ) : (
              <div style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '80px' }}>
                Upload a report to see the analysis here.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
