import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Archive, Calendar, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function PatientHistory() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('patientHistory');
    if (saved) {
      try { setHistory(JSON.parse(saved)); } catch (e) {}
    }
  }, []);

  const generatePDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.setTextColor(40, 40, 40);
    doc.text("MedAI Diagnostic Suite", 14, 20);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Official Clinical Record", 14, 27);
    doc.text("Generated: " + new Date().toLocaleString(), 14, 33);

    doc.setDrawColor(200);
    doc.line(14, 37, 196, 37);

    const tableColumn = ["Date", "Diagnosis", "Confidence", "Duration"];
    const tableRows = history.map(r => [
      r.date,
      r.condition,
      r.probability + "%",
      r.days + (r.days === 1 ? " Day" : " Days")
    ]);

    autoTable(doc, {
      startY: 42,
      head: [tableColumn],
      body: tableRows,
      theme: "grid",
      headStyles: { fillColor: [37, 99, 235], textColor: [255, 255, 255], fontSize: 10 },
      alternateRowStyles: { fillColor: [245, 245, 250] },
      styles: { font: "helvetica", fontSize: 9 }
    });

    const finalY = (doc).lastAutoTable?.finalY || 80;
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text("This report is AI-generated and should be validated by a licensed medical practitioner.", 14, finalY + 12);

    doc.save("MedAI_Clinical_Record.pdf");
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '32px' }}>
        <div className="page-header" style={{ marginBottom: 0 }}>
          <h1 className="page-title">Patient History</h1>
          <p className="page-desc">Locally persisted diagnostic evaluation records.</p>
        </div>
        {history.length > 0 && (
          <button className="btn-success" onClick={generatePDF}>
            <Download size={16} /> Export PDF
          </button>
        )}
      </div>

      {history.length > 0 ? (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Primary Diagnosis</th>
                <th>Confidence</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              {history.map((record) => (
                <tr key={record.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Calendar size={14} color="#64748b" />
                      {record.date}
                    </div>
                  </td>
                  <td style={{ fontWeight: 500 }}>{record.condition}</td>
                  <td><span className="badge badge-blue">{record.probability}%</span></td>
                  <td style={{ color: 'var(--text-secondary)' }}>{record.days} {record.days === 1 ? 'Day' : 'Days'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '48px 24px', borderStyle: 'dashed' }}>
          <Archive size={40} opacity={0.3} style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '1.1rem', marginBottom: '6px', color: 'var(--text-secondary)' }}>No Records Yet</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Run a diagnosis to start building your history.</p>
        </div>
      )}
    </motion.div>
  );
}
