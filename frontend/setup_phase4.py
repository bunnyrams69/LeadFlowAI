import os

base = r"e:\lead flow\frontend"

dirs = [
    "src/context",
    "src/hooks",
    "src/components",
    "src/pages"
]

for d in dirs:
    os.makedirs(os.path.join(base, d), exist_ok=True)

files = {}

# src/context/AppContext.jsx
files["src/context/AppContext.jsx"] = '''import React, { createContext, useState } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [allLeads, setAllLeads] = useState([]);
  const [emailsSent, setEmailsSent] = useState(parseInt(localStorage.getItem('emails_sent_count') || '0'));
  const [postsPublished, setPostsPublished] = useState(0);

  const incrementEmailsSent = () => {
    const newCount = emailsSent + 1;
    setEmailsSent(newCount);
    localStorage.setItem('emails_sent_count', newCount);
  };

  const incrementPostsPublished = () => {
    setPostsPublished(postsPublished + 1);
  };

  return (
    <AppContext.Provider value={{
      allLeads, setAllLeads,
      emailsSent, incrementEmailsSent,
      postsPublished, incrementPostsPublished
    }}>
      {children}
    </AppContext.Provider>
  );
};
'''

# src/hooks/useToast.js
files["src/hooks/useToast.js"] = '''import React, { createContext, useState, useContext, useCallback } from 'react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, toasts, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
'''

# src/components/Toast.jsx
files["src/components/Toast.jsx"] = '''import React from 'react';
import { useToast } from '../hooks/useToast';

const Toast = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      zIndex: 9999
    }}>
      {toasts.map(toast => {
        let bgColor = '#22C55E'; // success
        if (toast.type === 'error') bgColor = '#EF4444';
        if (toast.type === 'warning') bgColor = '#F59E0B';

        return (
          <div key={toast.id} style={{
            backgroundColor: bgColor,
            color: 'white',
            padding: '12px 16px',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            minWidth: '250px',
            fontSize: '14px',
            fontWeight: 500
          }}>
            <span>{toast.message}</span>
            <button 
              onClick={() => removeToast(toast.id)}
              style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}
            >
              &times;
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Toast;
'''

# src/App.jsx
files["src/App.jsx"] = '''import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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

function App() {
  return (
    <ToastProvider>
      <AppProvider>
        <Router>
          <div style={{ display: 'flex', height: '100vh', width: '100vw' }}>
            <Sidebar />
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/linkedin" element={<LinkedInScraper />} />
                <Route path="/instagram" element={<InstaScraper />} />
                <Route path="/email" element={<EmailWriter />} />
                <Route path="/post" element={<PostAutomation />} />
                <Route path="/chat" element={<RagChatbot />} />
              </Routes>
            </div>
          </div>
        </Router>
        <Toast />
      </AppProvider>
    </ToastProvider>
  );
}

export default App;
'''

# src/pages/Dashboard.jsx
files["src/pages/Dashboard.jsx"] = '''import React, { useState, useEffect, useContext } from 'react';
import TopBar from '../components/TopBar';
import MetricCard from '../components/MetricCard';
import PipelineFlow from '../components/PipelineFlow';
import LeadsTable from '../components/LeadsTable';
import { Search, Mail, Share2, Target, X } from 'lucide-react';
import { getLinkedInLeads, getInstagramLeads, runPipeline } from '../api/client';
import { AppContext } from '../context/AppContext';
import { useToast } from '../hooks/useToast';

const Dashboard = () => {
  const { allLeads, setAllLeads, emailsSent, postsPublished } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [pipelineActive, setPipelineActive] = useState(-1);
  const [showModal, setShowModal] = useState(false);
  const { showToast } = useToast();

  const [pipeForm, setPipeForm] = useState({
    query: '',
    source: 'linkedin',
    productDescription: '',
    senderName: '',
    autoPost: false
  });

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    const liRes = await getLinkedInLeads();
    const igRes = await getInstagramLeads();
    let combined = [];
    if (liRes.data) combined = [...combined, ...liRes.data];
    if (igRes.data) combined = [...combined, ...igRes.data];
    
    // Also read from local storage if API is empty (due to stateless backend)
    if (combined.length === 0) {
       const li = JSON.parse(localStorage.getItem('linkedin_leads') || '[]');
       const ig = JSON.parse(localStorage.getItem('insta_leads') || '[]');
       combined = [...li, ...ig];
    }
    
    setAllLeads(combined);
    setLoading(false);
  };

  const submitPipeline = async () => {
    if (!pipeForm.query || !pipeForm.productDescription || !pipeForm.senderName) {
      showToast('Please fill all required fields', 'error');
      return;
    }
    setShowModal(false);
    setPipelineActive(0);
    setTimeout(() => setPipelineActive(1), 1000);
    setTimeout(() => setPipelineActive(2), 2000);
    
    const res = await runPipeline(pipeForm.query, pipeForm.source, pipeForm.productDescription, pipeForm.senderName, pipeForm.autoPost);
    
    if (res.error) {
       showToast('Pipeline failed: ' + res.error, 'error');
       setPipelineActive(-1);
       return;
    }
    
    setPipelineActive(3);
    setTimeout(() => {
      setPipelineActive(-1);
      fetchLeads();
      showToast('Pipeline completed successfully!', 'success');
    }, 1500);
  };

  const replyRate = emailsSent === 0 ? '0%' : '12%';

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-gray)' }}>
      <TopBar title="Dashboard" subtitle="Overview of your lead generation pipeline" badge="Live Demo" actionLabel="Run Pipeline" onAction={() => setShowModal(true)} />
      
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div className="card" style={{ width: '400px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <h3 style={{ margin: 0 }}>Run Pipeline</h3>
              <X size={20} style={{ cursor: 'pointer' }} onClick={() => setShowModal(false)} />
            </div>
            <input placeholder="Scrape Query (e.g. real estate)" value={pipeForm.query} onChange={e => setPipeForm({...pipeForm, query: e.target.value})} style={{ padding: '8px', border: '1px solid var(--border)', borderRadius: '4px' }} />
            <div style={{ display: 'flex', gap: '12px' }}>
               <label><input type="radio" name="source" checked={pipeForm.source === 'linkedin'} onChange={() => setPipeForm({...pipeForm, source: 'linkedin'})} /> LinkedIn</label>
               <label><input type="radio" name="source" checked={pipeForm.source === 'instagram'} onChange={() => setPipeForm({...pipeForm, source: 'instagram'})} /> Instagram</label>
            </div>
            <textarea placeholder="Your Product Description" value={pipeForm.productDescription} onChange={e => setPipeForm({...pipeForm, productDescription: e.target.value})} style={{ padding: '8px', border: '1px solid var(--border)', borderRadius: '4px', resize: 'vertical' }} />
            <input placeholder="Your Name" value={pipeForm.senderName} onChange={e => setPipeForm({...pipeForm, senderName: e.target.value})} style={{ padding: '8px', border: '1px solid var(--border)', borderRadius: '4px' }} />
            <label style={{ display: 'flex', gap: '8px' }}>
               <input type="checkbox" checked={pipeForm.autoPost} onChange={e => setPipeForm({...pipeForm, autoPost: e.target.checked})} />
               Auto-post to LinkedIn
            </label>
            <button className="btn-blue" onClick={submitPipeline}>Run Now</button>
          </div>
        </div>
      )}

      <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '32px', overflowY: 'auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
          <MetricCard label="Total Leads" value={allLeads.length} icon={Search} color="#2563EB" />
          <MetricCard label="Emails Sent" value={emailsSent} icon={Mail} color="#16A34A" />
          <MetricCard label="Posts Published" value={postsPublished} icon={Share2} color="#9333EA" />
          <MetricCard label="Reply Rate" value={replyRate} icon={Target} color="#EA580C" />
        </div>
        
        <div>
          <h3 style={{ margin: '0 0 16px', fontSize: '18px' }}>Pipeline Status</h3>
          <div className="card">
            <PipelineFlow activeStep={pipelineActive} />
          </div>
        </div>

        <div>
          <h3 style={{ margin: '0 0 16px', fontSize: '18px' }}>Recent Leads</h3>
          <LeadsTable leads={allLeads.slice(0, 5)} loading={loading} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
'''

# src/pages/LinkedInScraper.jsx
files["src/pages/LinkedInScraper.jsx"] = '''import React, { useState, useContext, useEffect } from 'react';
import TopBar from '../components/TopBar';
import LeadsTable from '../components/LeadsTable';
import { scrapeLinkedIn } from '../api/client';
import { AppContext } from '../context/AppContext';
import { useToast } from '../hooks/useToast';

const LinkedInScraper = () => {
  const [query, setQuery] = useState('');
  const [maxResults, setMaxResults] = useState(10);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const { allLeads, setAllLeads } = useContext(AppContext);
  const { showToast } = useToast();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('linkedin_leads') || '[]');
    setResults(saved);
  }, []);

  const handleScrape = async () => {
    if (!query) return;
    setLoading(true);
    const res = await scrapeLinkedIn(query, maxResults);
    setLoading(false);
    
    if (res.error) {
       showToast('Scrape failed — check your LinkedIn credentials in .env', 'error');
       return;
    }
    
    if (res.data) {
       setResults(res.data);
       localStorage.setItem('linkedin_leads', JSON.stringify(res.data));
       
       const igLeads = JSON.parse(localStorage.getItem('insta_leads') || '[]');
       setAllLeads([...res.data, ...igLeads]);
       showToast(`Successfully scraped ${res.data.length} leads!`, 'success');
    }
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <TopBar title="LinkedIn Scraper" subtitle="Find B2B leads by searching profiles and companies" badge="Live Demo" />
      <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div className="card" style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <input 
            type="text" 
            value={query} 
            onChange={e => setQuery(e.target.value)} 
            placeholder="e.g. Real estate agency Hyderabad" 
            style={{ flex: 1, padding: '12px 16px', border: '1px solid var(--border)', borderRadius: '8px' }}
          />
          <input 
            type="range" min="5" max="50" value={maxResults} onChange={e => setMaxResults(parseInt(e.target.value))}
            style={{ width: '100px' }} title={`Max Results: ${maxResults}`}
          />
          <span style={{ fontSize: '12px', color: '#6B7280' }}>{maxResults} results</span>
          <button className="btn-blue" onClick={handleScrape} disabled={loading}>{loading ? 'Scraping...' : 'Scrape Leads'}</button>
        </div>
        <LeadsTable leads={results} loading={loading} />
      </div>
    </div>
  );
};

export default LinkedInScraper;
'''

# src/pages/InstaScraper.jsx
files["src/pages/InstaScraper.jsx"] = '''import React, { useState, useContext, useEffect } from 'react';
import TopBar from '../components/TopBar';
import LeadsTable from '../components/LeadsTable';
import { scrapeInstagram } from '../api/client';
import { AppContext } from '../context/AppContext';
import { useToast } from '../hooks/useToast';

const InstaScraper = () => {
  const [tab, setTab] = useState('username');
  const [query, setQuery] = useState('');
  const [maxPosts, setMaxPosts] = useState(10);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const { allLeads, setAllLeads } = useContext(AppContext);
  const { showToast } = useToast();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('insta_leads') || '[]');
    setResults(saved);
  }, []);

  const handleScrape = async () => {
    if (!query) return;
    setLoading(true);
    const searchQ = tab === 'hashtag' ? (query.startsWith('#') ? query : `#${query}`) : query;
    const res = await scrapeInstagram(searchQ, maxPosts);
    setLoading(false);
    
    if (res.error) {
       showToast('Scrape failed — check your Instagram credentials in .env', 'error');
       return;
    }
    
    if (res.data) {
       setResults(res.data);
       localStorage.setItem('insta_leads', JSON.stringify(res.data));
       
       const liLeads = JSON.parse(localStorage.getItem('linkedin_leads') || '[]');
       setAllLeads([...liLeads, ...res.data]);
       showToast(`Successfully scraped ${res.data.length} profiles!`, 'success');
    }
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <TopBar title="Instagram Scraper" subtitle="Extract business profiles by username or hashtag" badge="Live Demo" />
      <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
             <button style={{ background: 'none', border: 'none', fontWeight: tab === 'username' ? 600 : 400, color: tab === 'username' ? 'var(--blue)' : '#6B7280', cursor: 'pointer' }} onClick={() => setTab('username')}>By Username</button>
             <button style={{ background: 'none', border: 'none', fontWeight: tab === 'hashtag' ? 600 : 400, color: tab === 'hashtag' ? 'var(--blue)' : '#6B7280', cursor: 'pointer' }} onClick={() => setTab('hashtag')}>By Hashtag</button>
          </div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <input 
              type="text" 
              value={query} 
              onChange={e => setQuery(e.target.value)} 
              placeholder={tab === 'hashtag' ? "e.g. digitalagency" : "e.g. zuck"} 
              style={{ flex: 1, padding: '12px 16px', border: '1px solid var(--border)', borderRadius: '8px' }}
            />
            <input 
              type="number" min="1" max="50" value={maxPosts} onChange={e => setMaxPosts(parseInt(e.target.value))}
              style={{ width: '80px', padding: '12px', border: '1px solid var(--border)', borderRadius: '8px' }} title="Max Posts"
            />
            <button className="btn-blue" onClick={handleScrape} disabled={loading}>{loading ? 'Scraping...' : 'Scrape Profiles'}</button>
          </div>
        </div>
        <LeadsTable leads={results} loading={loading} />
      </div>
    </div>
  );
};

export default InstaScraper;
'''

# src/pages/EmailWriter.jsx
files["src/pages/EmailWriter.jsx"] = '''import React, { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import TopBar from '../components/TopBar';
import { writeEmail, writeBulkEmails } from '../api/client';
import { AppContext } from '../context/AppContext';
import { useToast } from '../hooks/useToast';

const EmailWriter = () => {
  const location = useLocation();
  const initialLead = location.state?.lead || null;

  const [savedLeads, setSavedLeads] = useState([]);
  const [selectedLeadIndex, setSelectedLeadIndex] = useState(-1);
  
  const [leadName, setLeadName] = useState(initialLead ? initialLead.name : '');
  const [leadCompany, setLeadCompany] = useState(initialLead ? initialLead.company : '');
  const [productDesc, setProductDesc] = useState('');
  const [senderName, setSenderName] = useState('');
  
  const [result, setResult] = useState(null);
  const [bulkResults, setBulkResults] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const { incrementEmailsSent } = useContext(AppContext);
  const { showToast } = useToast();

  useEffect(() => {
    const li = JSON.parse(localStorage.getItem('linkedin_leads') || '[]');
    const ig = JSON.parse(localStorage.getItem('insta_leads') || '[]');
    const combined = [...li, ...ig];
    setSavedLeads(combined);
    
    if (initialLead) {
       const idx = combined.findIndex(l => l.name === initialLead.name);
       if (idx !== -1) setSelectedLeadIndex(idx);
    }
  }, [initialLead]);

  const handleSelectLead = (e) => {
    const idx = parseInt(e.target.value);
    setSelectedLeadIndex(idx);
    if (idx >= 0) {
       setLeadName(savedLeads[idx].name);
       setLeadCompany(savedLeads[idx].company);
    } else {
       setLeadName('');
       setLeadCompany('');
    }
  };

  const handleWrite = async () => {
    setLoading(true);
    setBulkResults([]);
    const lead = { name: leadName, company: leadCompany, title: 'Professional', source: 'Manual', profile_url: '', scraped_at: '' };
    const res = await writeEmail(lead, productDesc, senderName);
    setLoading(false);
    if (res.error) {
       showToast(res.error, 'error');
    } else if (res.data) {
       setResult(res.data);
       showToast('Email generated successfully', 'success');
    }
  };
  
  const handleWriteBulk = async () => {
     if (savedLeads.length === 0) {
        showToast('No leads available for bulk writing', 'warning');
        return;
     }
     setLoading(true);
     setResult(null);
     const res = await writeBulkEmails(savedLeads, productDesc, senderName);
     setLoading(false);
     if (res.error) {
        showToast(res.error, 'error');
     } else if (res.data) {
        setBulkResults(res.data);
        showToast(`Generated ${res.data.length} emails`, 'success');
     }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    incrementEmailsSent();
    showToast('Copied!', 'success');
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <TopBar title="Email Writer" subtitle="Generate hyper-personalized cold outreach emails" badge="Live Demo" />
      <div style={{ padding: '32px', display: 'flex', gap: '24px', flex: 1 }}>
        <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ margin: 0 }}>Input Context</h3>
          <select value={selectedLeadIndex} onChange={handleSelectLead} style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--border)' }}>
             <option value="-1">-- Custom Lead --</option>
             {savedLeads.map((l, i) => (
                <option key={i} value={i}>{l.name} ({l.company})</option>
             ))}
          </select>
          <input placeholder="Lead Name" value={leadName} onChange={e => setLeadName(e.target.value)} style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--border)' }} />
          <input placeholder="Lead Company" value={leadCompany} onChange={e => setLeadCompany(e.target.value)} style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--border)' }} />
          <textarea placeholder="Your Product Description" value={productDesc} onChange={e => setProductDesc(e.target.value)} rows={4} style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--border)' }} />
          <input placeholder="Your Name" value={senderName} onChange={e => setSenderName(e.target.value)} style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--border)' }} />
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn-blue" style={{ flex: 1 }} onClick={handleWrite} disabled={loading}>{loading ? 'Writing...' : 'Write Email'}</button>
            <button className="btn-blue" style={{ flex: 1, backgroundColor: '#10B981' }} onClick={handleWriteBulk} disabled={loading}>{loading ? 'Writing...' : 'Write for All Leads'}</button>
          </div>
        </div>
        
        <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', maxHeight: 'calc(100vh - 150px)' }}>
          <h3 style={{ margin: '0 0 16px' }}>Generated Email(s)</h3>
          
          {result && (
            <div style={{ border: '1px solid var(--border)', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
              <div style={{ fontWeight: 600, marginBottom: '16px' }}>Subject: {result.subject}</div>
              <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6, marginBottom: '16px' }}>{result.body}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <span style={{ fontSize: '12px', color: '#6B7280' }}>{result.body.length} chars</span>
                 <button className="btn-blue" onClick={() => handleCopy(`Subject: ${result.subject}\\n\\n${result.body}`)}>Copy</button>
              </div>
            </div>
          )}
          
          {bulkResults.length > 0 && bulkResults.map((r, i) => (
             <div key={i} style={{ border: '1px solid var(--border)', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
              <div style={{ fontWeight: 600, marginBottom: '16px' }}>Subject: {r.subject}</div>
              <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6, marginBottom: '16px' }}>{r.body}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <span style={{ fontSize: '12px', color: '#6B7280' }}>{r.body.length} chars | Lead: {r.lead_name}</span>
                 <button className="btn-blue" onClick={() => handleCopy(`Subject: ${r.subject}\\n\\n${r.body}`)}>Copy</button>
              </div>
            </div>
          ))}
          
          {!result && bulkResults.length === 0 && (
            <div style={{ color: '#9CA3AF', fontStyle: 'italic', textAlign: 'center', marginTop: '40px' }}>Fill the form and click Write Email</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailWriter;
'''

# src/pages/PostAutomation.jsx
files["src/pages/PostAutomation.jsx"] = '''import React, { useState, useEffect, useContext } from 'react';
import TopBar from '../components/TopBar';
import { publishPost, getPostHistory } from '../api/client';
import { AppContext } from '../context/AppContext';
import { useToast } from '../hooks/useToast';

const PostAutomation = () => {
  const [content, setContent] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  
  const { incrementPostsPublished } = useContext(AppContext);
  const { showToast } = useToast();

  useEffect(() => {
    const savedKey = localStorage.getItem('openrouter_api_key') || '';
    setApiKey(savedKey);
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
     const res = await getPostHistory();
     if (res.data) setHistory(res.data);
  };

  const handleKeyChange = (e) => {
     setApiKey(e.target.value);
     localStorage.setItem('openrouter_api_key', e.target.value);
  };

  const handleGeneratePost = async () => {
     if (!apiKey) {
        showToast('Please enter your OpenRouter API Key first', 'warning');
        return;
     }
     
     setLoading(true);
     try {
         const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
               'Authorization': `Bearer ${apiKey}`,
               'Content-Type': 'application/json',
               'HTTP-Referer': 'http://localhost:5173',
               'X-Title': 'LeadFlow AI'
            },
            body: JSON.stringify({
               model: 'anthropic/claude-sonnet-4-5',
               messages: [
                  {
                     role: 'user',
                     content: 'Write a LinkedIn post for a solo AI automation founder named [senderName] from Cognify AI Hyderabad. The post should showcase their AI services: RAG chatbots, WhatsApp bots, and lead automation systems. Use a hook opening line, include 2-3 specific results, end with a CTA. Under 300 words. No hashtag spam.'
                  }
               ],
               max_tokens: 500
            })
         });
         
         const data = await res.json();
         if (data.error) {
            showToast(data.error.message || 'LLM API Error', 'error');
         } else {
            setContent(data.choices[0].message.content);
            showToast('Post generated successfully', 'success');
         }
     } catch (err) {
         showToast(err.message, 'error');
     }
     setLoading(false);
  };

  const handlePublish = async () => {
    if (!content) return;
    setLoading(true);
    const res = await publishPost(content);
    setLoading(false);
    
    if (res.error) {
       showToast(res.error, 'error');
    } else if (res.data) {
       showToast('Post published to LinkedIn successfully!', 'success');
       incrementPostsPublished();
       fetchHistory();
       setContent('');
    }
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <TopBar title="Post Automation" subtitle="Write and schedule LinkedIn posts" badge="Live Demo" />
      <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
           <div style={{ fontWeight: 500 }}>OpenRouter API Key:</div>
           <input 
              type="password" 
              placeholder="sk-or-..." 
              value={apiKey} 
              onChange={handleKeyChange} 
              style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid var(--border)' }} 
           />
        </div>
        
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
             <h3 style={{ margin: 0 }}>Draft Post</h3>
             <button className="btn-blue" style={{ backgroundColor: '#10B981' }} onClick={handleGeneratePost} disabled={loading}>
                {loading ? 'Generating...' : 'Generate Post with AI'}
             </button>
          </div>
          
          <textarea 
            placeholder="Write your LinkedIn post here..." 
            value={content} 
            onChange={e => setContent(e.target.value)} 
            rows={8} 
            style={{ padding: '16px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '14px', resize: 'vertical' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '12px', color: '#6B7280' }}>{content.length} / 3000 chars</div>
            <button className="btn-blue" onClick={handlePublish} disabled={loading || !content}>{loading ? 'Publishing...' : 'Publish to LinkedIn'}</button>
          </div>
        </div>
        
        <div>
           <h3 style={{ margin: '0 0 16px', fontSize: '18px' }}>Post History</h3>
           {history.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', color: '#6B7280', padding: '30px' }}>No posts published yet</div>
           ) : (
              <div className="card" style={{ padding: 0 }}>
                 <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ backgroundColor: '#F9FAFB' }}>
                       <tr>
                          <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid var(--border)', fontSize: '12px', color: '#6B7280' }}>ID</th>
                          <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid var(--border)', fontSize: '12px', color: '#6B7280' }}>Status</th>
                          <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid var(--border)', fontSize: '12px', color: '#6B7280' }}>Message</th>
                       </tr>
                    </thead>
                    <tbody>
                       {history.map((h, i) => (
                          <tr key={i}>
                             <td style={{ padding: '12px', borderBottom: '1px solid var(--border)' }}>{h.post_id}</td>
                             <td style={{ padding: '12px', borderBottom: '1px solid var(--border)' }}>
                                <span className="tag tag-sent">{h.status}</span>
                             </td>
                             <td style={{ padding: '12px', borderBottom: '1px solid var(--border)' }}>{h.message}</td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           )}
        </div>
        
      </div>
    </div>
  );
};

export default PostAutomation;
'''

# src/pages/RagChatbot.jsx
files["src/pages/RagChatbot.jsx"] = '''import React from 'react';
import TopBar from '../components/TopBar';
import ChatWidget from '../components/ChatWidget';
import { useToast } from '../hooks/useToast';

const RagChatbot = () => {
  const { showToast } = useToast();

  const handleChipClick = (text) => {
     // We will dispatch a custom event to the ChatWidget to handle this smoothly
     const event = new CustomEvent('suggested-question', { detail: text });
     window.dispatchEvent(event);
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
      <TopBar title="RAG Chatbot" subtitle="Interactive AI assistant loaded with your knowledge base" badge="Live Demo" />
      <div style={{ padding: '32px', flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ marginBottom: '24px', display: 'flex', gap: '12px' }}>
          <button onClick={() => handleChipClick('What services do I offer?')} className="tag" style={{ backgroundColor: 'white', border: '1px solid var(--border)', cursor: 'pointer' }}>"What services do I offer?"</button>
          <button onClick={() => handleChipClick('Who are my top leads?')} className="tag" style={{ backgroundColor: 'white', border: '1px solid var(--border)', cursor: 'pointer' }}>"Who are my top leads?"</button>
          <button onClick={() => handleChipClick('Draft a follow-up for Arjun Mehta')} className="tag" style={{ backgroundColor: 'white', border: '1px solid var(--border)', cursor: 'pointer' }}>"Draft a follow-up for Arjun Mehta"</button>
        </div>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <ChatWidget />
        </div>
      </div>
    </div>
  );
};

export default RagChatbot;
'''

# Update ChatWidget.jsx to listen to the custom event
files["src/components/ChatWidget.jsx"] = '''import React, { useState, useEffect, useRef } from 'react';
import { Send, Paperclip, Bot, User } from 'lucide-react';
import { sendChatMessage, uploadChatDocument } from '../api/client';
import { useToast } from '../hooks/useToast';

const ChatWidget = () => {
  const [messages, setMessages] = useState([{ role: 'bot', content: 'Hi! I am the RAG Chatbot. Ask me about our services or leads.' }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);
  const { showToast } = useToast();

  useEffect(() => {
     endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
     const handleSuggested = (e) => {
        setInput(e.detail);
     };
     window.addEventListener('suggested-question', handleSuggested);
     return () => window.removeEventListener('suggested-question', handleSuggested);
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    const newHistory = [...messages, { role: 'user', content: userMsg }];
    setMessages(newHistory);
    setInput('');
    setLoading(true);

    const res = await sendChatMessage(userMsg, messages); // send previous history
    setLoading(false);
    
    if (res.error) {
      showToast(res.error, 'error');
      setMessages([...newHistory, { role: 'bot', content: 'Sorry, I encountered an error communicating with the backend.' }]);
    } else if (res.data) {
      setMessages([...newHistory, { role: 'bot', content: res.data.reply }]);
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const res = await uploadChatDocument(file);
    if (res.error) {
       showToast(res.error, 'error');
    } else {
       showToast('Document uploaded to knowledge base!', 'success');
    }
  };

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: 0 }}>
      <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
            {m.role === 'bot' && <div style={{ backgroundColor: '#F3F4F6', padding: '8px', borderRadius: '50%' }}><Bot size={18} /></div>}
            <div style={{ 
              backgroundColor: m.role === 'user' ? 'var(--blue)' : '#F3F4F6', 
              color: m.role === 'user' ? 'white' : '#111827',
              padding: '12px 16px', borderRadius: '12px', fontSize: '14px', lineHeight: '1.5'
            }}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && <div style={{ color: '#6B7280', fontSize: '12px', paddingLeft: '40px', display: 'flex', gap: '4px' }}>
           <span>•</span><span>•</span><span>•</span>
        </div>}
        <div ref={endRef} />
      </div>
      <div style={{ borderTop: '1px solid var(--border)', padding: '16px', display: 'flex', gap: '12px' }}>
        <label style={{ cursor: 'pointer', padding: '10px', backgroundColor: '#F3F4F6', borderRadius: '8px' }}>
          <input type="file" style={{ display: 'none' }} onChange={handleUpload} />
          <Paperclip size={20} color="#6B7280" />
        </label>
        <input 
          type="text" 
          value={input} 
          onChange={e => setInput(e.target.value)} 
          onKeyPress={e => e.key === 'Enter' && handleSend()}
          placeholder="Ask a question..." 
          style={{ flex: 1, border: '1px solid var(--border)', borderRadius: '8px', padding: '0 16px', outline: 'none' }} 
        />
        <button className="btn-blue" style={{ padding: '10px 16px' }} onClick={handleSend}><Send size={18} /></button>
      </div>
    </div>
  );
};

export default ChatWidget;
'''

for path, content in files.items():
    full_path = os.path.join(base, path)
    with open(full_path, "w", encoding="utf-8") as f:
        f.write(content)

print("Phase 4 Frontend code successfully updated.")
