import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import LinkedInScraper from './pages/LinkedInScraper';
import InstaScraper from './pages/InstaScraper';
import EmailWriter from './pages/EmailWriter';
import PostAutomation from './pages/PostAutomation';
import RagChatbot from './pages/RagChatbot';
import { AppProvider } from './context/AppContext';
import { ToastProvider } from './hooks/useToast';
import Toast from './components/Toast';
import GlobalProgressBar from './components/GlobalProgressBar';

const PageTransition = ({ children }) => {
  const location = useLocation();
  return (
    <div key={location.pathname} className="page-transition" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
      {children}
    </div>
  );
};

function App() {
  return (
    <ToastProvider>
      <AppProvider>
        <Router>
          <GlobalProgressBar />
          <div style={{ display: 'flex', height: '100vh', width: '100vw' }}>
            <Sidebar />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-gray)' }}>
              <PageTransition>
                <Routes>
                  <Route path="/" element={<Navigate to="/dashboard" />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/linkedin" element={<LinkedInScraper />} />
                  <Route path="/instagram" element={<InstaScraper />} />
                  <Route path="/email" element={<EmailWriter />} />
                  <Route path="/post" element={<PostAutomation />} />
                  <Route path="/chat" element={<RagChatbot />} />
                </Routes>
              </PageTransition>
            </div>
          </div>
        </Router>
        <Toast />
      </AppProvider>
    </ToastProvider>
  );
}

export default App;
