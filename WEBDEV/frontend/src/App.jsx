import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { Activity, History, MessageSquare, Apple, AlertTriangle, Brain, HeartPulse } from 'lucide-react';
import Diagnosis from './pages/Diagnosis';
import ChatBot from './pages/ChatBot';
import PatientHistory from './pages/PatientHistory';
import Nutrition from './pages/Nutrition';
import Emergency from './pages/Emergency';
import MentalHealth from './pages/MentalHealth';

function App() {
  return (
    <Router>
      <nav className="sidebar">
        <div className="sidebar-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
             <HeartPulse size={28} color="#2563eb" />
             <div>
               <div className="sidebar-title">MedAI Suite</div>
               <div className="sidebar-subtitle">Clinical Platform</div>
             </div>
          </div>
        </div>
        <div className="nav-links">
          <NavLink to="/" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Activity size={18} />
            Diagnosis
          </NavLink>
          <NavLink to="/history" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <History size={18} />
            History
          </NavLink>
          <NavLink to="/nutrition" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Apple size={18} />
            Nutrition
          </NavLink>
          <NavLink to="/mind" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Brain size={18} />
            Wellness
          </NavLink>
          <NavLink to="/chat" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <MessageSquare size={18} />
            AI Advisor
          </NavLink>
          <NavLink to="/emergency" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <AlertTriangle size={18} />
            Emergency
          </NavLink>
        </div>
      </nav>
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Diagnosis />} />
          <Route path="/history" element={<PatientHistory />} />
          <Route path="/nutrition" element={<Nutrition />} />
          <Route path="/mind" element={<MentalHealth />} />
          <Route path="/emergency" element={<Emergency />} />
          <Route path="/chat" element={<ChatBot />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
