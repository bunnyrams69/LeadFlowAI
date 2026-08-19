import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import LinkedInScraper from './pages/LinkedInScraper';
import InstaScraper from './pages/InstaScraper';
import FacebookScraper from './pages/FacebookScraper';
import ThreadsScraper from './pages/ThreadsScraper';
import EmailWriter from './pages/EmailWriter';
import PostAutomation from './pages/PostAutomation';
import RagChatbot from './pages/RagChatbot';
import ContentStudio from './pages/ContentStudio';
import ConversionAnalytics from './pages/ConversionAnalytics';
import HackathonFaq from './pages/HackathonFaq';
import ClientDemoPage from './pages/ClientDemoPage';
import { AppProvider } from './context/AppContext';
import { ToastProvider } from './hooks/useToast';
import Toast from './components/Toast';
import GlobalProgressBar from './components/GlobalProgressBar';

const AppLayout = ({ children }) => {
  const location = useLocation();
  const isPublicPreview = location.pathname.startsWith('/preview/') || location.pathname.startsWith('/demo/');

  if (isPublicPreview) {
    return (
      <div style={{ minHeight: '100vh', width: '100%', backgroundColor: '#F8FAFC', overflowY: 'auto' }}>
        {children}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-gray)', overflowY: 'auto' }}>
        <div key={location.pathname} className="page-transition" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {children}
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <ToastProvider>
      <AppProvider>
        <Router>
          <GlobalProgressBar />
          <AppLayout>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/linkedin" element={<LinkedInScraper />} />
              <Route path="/instagram" element={<InstaScraper />} />
              <Route path="/facebook" element={<FacebookScraper />} />
              <Route path="/threads" element={<ThreadsScraper />} />
              <Route path="/email" element={<EmailWriter />} />
              <Route path="/post" element={<PostAutomation />} />
              <Route path="/studio" element={<ContentStudio />} />
              <Route path="/analytics" element={<ConversionAnalytics />} />
              <Route path="/chat" element={<RagChatbot />} />
              <Route path="/faq" element={<HackathonFaq />} />
              
              {/* Public Live Client Demo Routes (Works on any phone/device!) */}
              <Route path="/preview/:slug" element={<ClientDemoPage />} />
              <Route path="/demo/:slug" element={<ClientDemoPage />} />
            </Routes>
          </AppLayout>
        </Router>
        <Toast />
      </AppProvider>
    </ToastProvider>
  );
}

export default App;

