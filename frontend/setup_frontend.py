import os

base = r"e:\lead flow\frontend"

dirs = [
    "src/api",
    "src/components",
    "src/pages"
]

for d in dirs:
    os.makedirs(os.path.join(base, d), exist_ok=True)

files = {}

# index.html
files["index.html"] = '''<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>LeadFlow AI</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
      body {
        margin: 0;
        font-family: 'Inter', sans-serif;
        background-color: #F3F4F6;
        color: #111827;
      }
      * {
        box-sizing: border-box;
      }
      a {
        text-decoration: none;
      }
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
'''

# vite.config.js
files["vite.config.js"] = '''import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:8000'
    }
  }
})
'''

# src/main.jsx
files["src/main.jsx"] = '''import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
'''

# src/index.css
files["src/index.css"] = '''
:root {
  --navy: #0F1629;
  --navy-light: #1E293B;
  --blue: #2563EB;
  --blue-hover: #1D4ED8;
  --bg-gray: #F9FAFB;
  --border: #E5E7EB;
}

body {
  margin: 0;
  background-color: var(--bg-gray);
  height: 100vh;
  overflow: hidden;
}

.card {
  background: white;
  border: 1px solid var(--border);
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  padding: 20px;
}

.btn-blue {
  background: var(--blue);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s;
}

.btn-blue:hover {
  background: var(--blue-hover);
}

.tag {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.tag-sent { background: #DCFCE7; color: #166534; }
.tag-pending { background: #FEF3C7; color: #92400E; }
.tag-linkedin { background: #DBEAFE; color: #1E40AF; }
.tag-instagram { background: #F3E8FF; color: #6B21A8; }

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid var(--border);
}

tr:hover td {
  background-color: var(--bg-gray);
}
'''

# src/api/client.js
files["src/api/client.js"] = '''import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000'
});

const handleRequest = async (request) => {
  try {
    const response = await request;
    return { data: response.data, error: null };
  } catch (err) {
    return { data: null, error: err.message || 'API request failed' };
  }
};

export const healthCheck = () => handleRequest(api.get('/health'));
export const scrapeLinkedIn = (query, maxResults = 10) => handleRequest(api.post('/api/linkedin/scrape', { query, max_results: maxResults }));
export const getLinkedInLeads = () => handleRequest(api.get('/api/linkedin/leads'));
export const scrapeInstagram = (query, maxPosts = 10) => handleRequest(api.post('/api/instagram/scrape', { query, max_posts: maxPosts }));
export const getInstagramLeads = () => handleRequest(api.get('/api/instagram/leads'));
export const writeEmail = (lead, productDesc, senderName) => handleRequest(api.post('/api/email/write', { lead, product_description: productDesc, sender_name: senderName }));
export const writeBulkEmails = (leads, productDesc, senderName) => handleRequest(api.post('/api/email/write-bulk', leads.map(l => ({ lead: l, product_description: productDesc, sender_name: senderName }))));
export const publishPost = (content, scheduleTime = null) => handleRequest(api.post('/api/post/publish', { content, schedule_time: scheduleTime }));
export const getPostHistory = () => handleRequest(api.get('/api/post/history'));
export const sendChatMessage = (message, history = []) => handleRequest(api.post('/api/chat', { message, conversation_history: history }));
export const uploadChatDocument = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return handleRequest(api.post('/api/chat/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } }));
};
export const runPipeline = (query, source, productDesc, senderName, autoPost = false) => 
  handleRequest(api.post('/api/pipeline/run', { query, source, product_description: productDesc, sender_name: senderName, auto_post: autoPost }));
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

function App() {
  return (
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
  );
}

export default App;
'''

# src/components/Sidebar.jsx
files["src/components/Sidebar.jsx"] = '''import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Linkedin, Instagram, Mail, Share2, MessageSquare, Zap } from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { section: 'MODULES', items: [
      { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/linkedin', label: 'LinkedIn Scraper', icon: Linkedin },
      { path: '/instagram', label: 'Instagram Scraper', icon: Instagram },
      { path: '/email', label: 'Email Writer', icon: Mail },
      { path: '/post', label: 'Post Automation', icon: Share2 }
    ]},
    { section: 'AI', items: [
      { path: '/chat', label: 'RAG Chatbot', icon: MessageSquare }
    ]}
  ];

  return (
    <div style={{ width: '220px', backgroundColor: 'var(--navy)', color: 'white', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '20px' }}>
        <div style={{ fontSize: '20px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Zap size={24} color="#FBBF24" /> LeadFlow AI
        </div>
        <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '4px' }}>by Cognify AI</div>
      </div>
      
      <div style={{ flex: 1, padding: '10px 0' }}>
        {navItems.map((group, idx) => (
          <div key={idx} style={{ marginBottom: '20px' }}>
            <div style={{ padding: '0 20px', fontSize: '11px', color: '#6B7280', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '8px' }}>
              {group.section}
            </div>
            {group.items.map((item) => (
              <NavLink 
                key={item.path} 
                to={item.path}
                style={({ isActive }) => ({
                  display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 20px',
                  color: isActive ? 'white' : '#9CA3AF',
                  backgroundColor: isActive ? 'rgba(37,99,235,0.1)' : 'transparent',
                  borderLeft: isActive ? '4px solid var(--blue)' : '4px solid transparent',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: isActive ? 600 : 400
                })}
              >
                <item.icon size={18} /> {item.label}
              </NavLink>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
'''

# src/components/TopBar.jsx
files["src/components/TopBar.jsx"] = '''import React from 'react';

const TopBar = ({ title, subtitle, actionLabel, onAction, badge }) => {
  return (
    <div style={{ background: 'white', borderBottom: '1px solid var(--border)', padding: '20px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 600 }}>{title}</h1>
        {subtitle && <p style={{ margin: '4px 0 0', color: '#6B7280', fontSize: '14px' }}>{subtitle}</p>}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {badge && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#DCFCE7', color: '#166534', padding: '4px 12px', borderRadius: '16px', fontSize: '12px', fontWeight: 600 }}>
            <span style={{ width: '8px', height: '8px', backgroundColor: '#22C55E', borderRadius: '50%' }}></span>
            {badge}
          </div>
        )}
        {actionLabel && (
          <button className="btn-blue" onClick={onAction}>{actionLabel}</button>
        )}
      </div>
    </div>
  );
};

export default TopBar;
'''

# src/components/MetricCard.jsx
files["src/components/MetricCard.jsx"] = '''import React from 'react';

const MetricCard = ({ label, value, icon: Icon, color }) => {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ fontSize: '32px', fontWeight: 700, color: '#111827' }}>{value}</div>
        <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: `${color}15`, color: color }}>
          <Icon size={20} />
        </div>
      </div>
      <div style={{ color: '#6B7280', fontSize: '14px', fontWeight: 500 }}>{label}</div>
    </div>
  );
};

export default MetricCard;
'''

# src/components/PipelineFlow.jsx
files["src/components/PipelineFlow.jsx"] = '''import React from 'react';
import { Search, Mail, Share2, MessageSquare, ArrowRight } from 'lucide-react';

const PipelineFlow = ({ activeStep = -1 }) => {
  const steps = [
    { id: 0, label: 'Scrape', sub: 'LinkedIn/Insta', icon: Search },
    { id: 1, label: 'Personalize', sub: 'Email Writer', icon: Mail },
    { id: 2, label: 'Automate', sub: 'Post Publishing', icon: Share2 },
    { id: 3, label: 'Engage', sub: 'RAG Chatbot', icon: MessageSquare }
  ];

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '30px 20px' }}>
      {steps.map((step, idx) => (
        <React.Fragment key={step.id}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', opacity: activeStep >= step.id ? 1 : 0.4 }}>
            <div style={{ 
              width: '60px', height: '60px', borderRadius: '50%', 
              backgroundColor: activeStep === step.id ? 'var(--blue)' : 'white',
              border: activeStep === step.id ? 'none' : '2px solid var(--border)',
              display: 'flex', justifyContent: 'center', alignItems: 'center',
              color: activeStep === step.id ? 'white' : '#6B7280',
              boxShadow: activeStep === step.id ? '0 0 15px rgba(37,99,235,0.4)' : 'none',
              transition: 'all 0.3s'
            }}>
              <step.icon size={24} />
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: 600, fontSize: '14px' }}>{step.label}</div>
              <div style={{ fontSize: '12px', color: '#6B7280' }}>{step.sub}</div>
            </div>
          </div>
          {idx < steps.length - 1 && (
            <div style={{ flex: 1, height: '2px', backgroundColor: activeStep > idx ? 'var(--blue)' : 'var(--border)', margin: '0 20px', marginBottom: '40px', position: 'relative' }}>
               <ArrowRight size={16} color={activeStep > idx ? 'var(--blue)' : '#9CA3AF'} style={{ position: 'absolute', right: '-8px', top: '-7px' }} />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default PipelineFlow;
'''

# src/components/LeadsTable.jsx
files["src/components/LeadsTable.jsx"] = '''import React from 'react';
import { Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LeadsTable = ({ leads, loading }) => {
  const navigate = useNavigate();

  const handleWriteEmail = (lead) => {
    navigate('/email', { state: { lead } });
  };

  if (loading) {
    return (
      <div className="card">
        <div style={{ textAlign: 'center', padding: '40px', color: '#6B7280' }}>Loading leads...</div>
      </div>
    );
  }

  if (!leads || leads.length === 0) {
    return (
      <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', gap: '16px' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Mail size={32} color="#9CA3AF" />
        </div>
        <div style={{ fontSize: '16px', fontWeight: 500, color: '#374151' }}>No leads yet — run a scrape to get started</div>
      </div>
    );
  }

  return (
    <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
      <table>
        <thead style={{ backgroundColor: '#F9FAFB' }}>
          <tr>
            <th style={{ fontSize: '12px', color: '#6B7280', textTransform: 'uppercase' }}>Name</th>
            <th style={{ fontSize: '12px', color: '#6B7280', textTransform: 'uppercase' }}>Source</th>
            <th style={{ fontSize: '12px', color: '#6B7280', textTransform: 'uppercase' }}>Company</th>
            <th style={{ fontSize: '12px', color: '#6B7280', textTransform: 'uppercase' }}>Role</th>
            <th style={{ fontSize: '12px', color: '#6B7280', textTransform: 'uppercase' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead, i) => (
            <tr key={i}>
              <td style={{ fontWeight: 500 }}>{lead.name}</td>
              <td>
                <span className={`tag tag-${lead.source.toLowerCase()}`}>{lead.source}</span>
              </td>
              <td>{lead.company}</td>
              <td style={{ color: '#6B7280' }}>{lead.title}</td>
              <td>
                <button className="btn-blue" style={{ fontSize: '12px', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px' }} onClick={() => handleWriteEmail(lead)}>
                  <Mail size={14} /> Write Email
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeadsTable;
'''

# src/components/ChatWidget.jsx
files["src/components/ChatWidget.jsx"] = '''import React, { useState } from 'react';
import { Send, Paperclip, Bot, User } from 'lucide-react';
import { sendChatMessage, uploadChatDocument } from '../api/client';

const ChatWidget = () => {
  const [messages, setMessages] = useState([{ role: 'bot', content: 'Hi! I am the RAG Chatbot. Ask me about our services or leads.' }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    const newHistory = [...messages, { role: 'user', content: userMsg }];
    setMessages(newHistory);
    setInput('');
    setLoading(true);

    const res = await sendChatMessage(userMsg, newHistory);
    setLoading(false);
    if (res.data) {
      setMessages([...newHistory, { role: 'bot', content: res.data.reply }]);
    } else {
      setMessages([...newHistory, { role: 'bot', content: 'Sorry, I encountered an error.' }]);
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    await uploadChatDocument(file);
    alert('Document uploaded to knowledge base!');
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
        {loading && <div style={{ color: '#6B7280', fontSize: '12px', paddingLeft: '40px' }}>Bot is typing...</div>}
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

# src/pages/Dashboard.jsx
files["src/pages/Dashboard.jsx"] = '''import React, { useState, useEffect } from 'react';
import TopBar from '../components/TopBar';
import MetricCard from '../components/MetricCard';
import PipelineFlow from '../components/PipelineFlow';
import LeadsTable from '../components/LeadsTable';
import { Search, Mail, Share2, Target } from 'lucide-react';
import { getLinkedInLeads, getInstagramLeads, runPipeline } from '../api/client';

const Dashboard = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pipelineActive, setPipelineActive] = useState(-1);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    const liRes = await getLinkedInLeads();
    const igRes = await getInstagramLeads();
    let all = [];
    if (liRes.data) all = [...all, ...liRes.data];
    if (igRes.data) all = [...all, ...igRes.data];
    setLeads(all);
    setLoading(false);
  };

  const handleRunPipeline = async () => {
    const query = prompt("Enter scrape query:");
    if (!query) return;
    setPipelineActive(0);
    setTimeout(() => setPipelineActive(1), 1000);
    setTimeout(() => setPipelineActive(2), 2000);
    const res = await runPipeline(query, "linkedin", "AI solutions", "Cognify AI", true);
    setPipelineActive(3);
    setTimeout(() => {
      setPipelineActive(-1);
      fetchLeads();
      alert("Pipeline completed successfully!");
    }, 1000);
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-gray)' }}>
      <TopBar title="Dashboard" subtitle="Overview of your lead generation pipeline" badge="Live Demo" actionLabel="Run Pipeline" onAction={handleRunPipeline} />
      <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '32px', overflowY: 'auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
          <MetricCard label="Total Leads" value={leads.length} icon={Search} color="#2563EB" />
          <MetricCard label="Emails Sent" value="0" icon={Mail} color="#16A34A" />
          <MetricCard label="Posts Published" value="0" icon={Share2} color="#9333EA" />
          <MetricCard label="Reply Rate" value="0%" icon={Target} color="#EA580C" />
        </div>
        
        <div>
          <h3 style={{ margin: '0 0 16px', fontSize: '18px' }}>Pipeline Status</h3>
          <div className="card">
            <PipelineFlow activeStep={pipelineActive} />
          </div>
        </div>

        <div>
          <h3 style={{ margin: '0 0 16px', fontSize: '18px' }}>Recent Leads</h3>
          <LeadsTable leads={leads.slice(0, 5)} loading={loading} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
'''

# src/pages/LinkedInScraper.jsx
files["src/pages/LinkedInScraper.jsx"] = '''import React, { useState } from 'react';
import TopBar from '../components/TopBar';
import LeadsTable from '../components/LeadsTable';
import { scrapeLinkedIn } from '../api/client';

const LinkedInScraper = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleScrape = async () => {
    if (!query) return;
    setLoading(true);
    const res = await scrapeLinkedIn(query);
    setLoading(false);
    if (res.data) setResults(res.data);
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <TopBar title="LinkedIn Scraper" subtitle="Find B2B leads by searching profiles and companies" badge="Live Demo" />
      <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div className="card" style={{ display: 'flex', gap: '16px' }}>
          <input 
            type="text" 
            value={query} 
            onChange={e => setQuery(e.target.value)} 
            placeholder="e.g. Real estate agency Hyderabad" 
            style={{ flex: 1, padding: '12px 16px', border: '1px solid var(--border)', borderRadius: '8px' }}
          />
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
files["src/pages/InstaScraper.jsx"] = '''import React, { useState } from 'react';
import TopBar from '../components/TopBar';
import LeadsTable from '../components/LeadsTable';
import { scrapeInstagram } from '../api/client';

const InstaScraper = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleScrape = async () => {
    if (!query) return;
    setLoading(true);
    const res = await scrapeInstagram(query);
    setLoading(false);
    if (res.data) setResults(res.data);
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <TopBar title="Instagram Scraper" subtitle="Extract business profiles by username or hashtag" badge="Live Demo" />
      <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div className="card" style={{ display: 'flex', gap: '16px' }}>
          <input 
            type="text" 
            value={query} 
            onChange={e => setQuery(e.target.value)} 
            placeholder="e.g. #digitalagency" 
            style={{ flex: 1, padding: '12px 16px', border: '1px solid var(--border)', borderRadius: '8px' }}
          />
          <button className="btn-blue" onClick={handleScrape} disabled={loading}>{loading ? 'Scraping...' : 'Scrape Profiles'}</button>
        </div>
        <LeadsTable leads={results} loading={loading} />
      </div>
    </div>
  );
};

export default InstaScraper;
'''

# src/pages/EmailWriter.jsx
files["src/pages/EmailWriter.jsx"] = '''import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import TopBar from '../components/TopBar';
import { writeEmail } from '../api/client';

const EmailWriter = () => {
  const location = useLocation();
  const initialLead = location.state?.lead || null;

  const [leadName, setLeadName] = useState(initialLead ? initialLead.name : '');
  const [leadCompany, setLeadCompany] = useState(initialLead ? initialLead.company : '');
  const [productDesc, setProductDesc] = useState('');
  const [senderName, setSenderName] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleWrite = async () => {
    setLoading(true);
    const lead = { name: leadName, company: leadCompany, title: 'Professional', source: 'Manual', profile_url: '', scraped_at: '' };
    const res = await writeEmail(lead, productDesc, senderName);
    setLoading(false);
    if (res.data) setResult(res.data);
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <TopBar title="Email Writer" subtitle="Generate hyper-personalized cold outreach emails" badge="Live Demo" />
      <div style={{ padding: '32px', display: 'flex', gap: '24px', flex: 1 }}>
        <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ margin: 0 }}>Input Context</h3>
          <input placeholder="Lead Name" value={leadName} onChange={e => setLeadName(e.target.value)} style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--border)' }} />
          <input placeholder="Lead Company" value={leadCompany} onChange={e => setLeadCompany(e.target.value)} style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--border)' }} />
          <textarea placeholder="Your Product Description" value={productDesc} onChange={e => setProductDesc(e.target.value)} rows={4} style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--border)' }} />
          <input placeholder="Your Name" value={senderName} onChange={e => setSenderName(e.target.value)} style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--border)' }} />
          <button className="btn-blue" onClick={handleWrite} disabled={loading}>{loading ? 'Writing...' : 'Write Email'}</button>
        </div>
        <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ margin: '0 0 16px' }}>Generated Email</h3>
          {result ? (
            <div>
              <div style={{ fontWeight: 600, marginBottom: '16px' }}>Subject: {result.subject}</div>
              <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{result.body}</div>
            </div>
          ) : (
            <div style={{ color: '#9CA3AF', fontStyle: 'italic' }}>Fill the form and click Write Email</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailWriter;
'''

# src/pages/PostAutomation.jsx
files["src/pages/PostAutomation.jsx"] = '''import React, { useState } from 'react';
import TopBar from '../components/TopBar';
import { publishPost, getPostHistory } from '../api/client';

const PostAutomation = () => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  const handlePublish = async () => {
    setLoading(true);
    const res = await publishPost(content);
    setLoading(false);
    if (res.data) setStatus('Post published successfully!');
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <TopBar title="Post Automation" subtitle="Write and schedule LinkedIn posts" badge="Live Demo" />
      <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <textarea 
            placeholder="Write your LinkedIn post here..." 
            value={content} 
            onChange={e => setContent(e.target.value)} 
            rows={8} 
            style={{ padding: '16px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '14px', resize: 'vertical' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '12px', color: '#6B7280' }}>{content.length} / 3000 chars</div>
            <button className="btn-blue" onClick={handlePublish} disabled={loading}>{loading ? 'Publishing...' : 'Publish to LinkedIn'}</button>
          </div>
          {status && <div style={{ color: 'green', fontSize: '14px', fontWeight: 500 }}>{status}</div>}
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

const RagChatbot = () => {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
      <TopBar title="RAG Chatbot" subtitle="Interactive AI assistant loaded with your knowledge base" badge="Live Demo" />
      <div style={{ padding: '32px', flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ marginBottom: '24px', display: 'flex', gap: '12px' }}>
          <span className="tag" style={{ backgroundColor: 'white', border: '1px solid var(--border)', cursor: 'pointer' }}>"What services do I offer?"</span>
          <span className="tag" style={{ backgroundColor: 'white', border: '1px solid var(--border)', cursor: 'pointer' }}>"Who are my top leads?"</span>
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

for path, content in files.items():
    full_path = os.path.join(base, path)
    with open(full_path, "w", encoding="utf-8") as f:
        f.write(content)

print("Frontend files generated successfully.")
