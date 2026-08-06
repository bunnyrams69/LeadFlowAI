import React, { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import TopBar from '../components/TopBar';
import { writeEmail, writeBulkEmails } from '../api/client';
import { AppContext } from '../context/AppContext';
import { useToast } from '../hooks/useToast';
import { Loader2, Mail } from 'lucide-react';

const EmailWriter = () => {
  const location = useLocation();
  const initialLead = location.state?.lead || null;

  const [savedLeads, setSavedLeads] = useState([]);
  const [selectedLeadIndex, setSelectedLeadIndex] = useState(-1);
  const [leadName, setLeadName] = useState('');
  const [leadCompany, setLeadCompany] = useState('');
  const [productDesc, setProductDesc] = useState('');
  const [senderName, setSenderName] = useState('');
  const [result, setResult] = useState(null);
  
  const { incrementEmailsSent, isLoading, setIsLoading } = useContext(AppContext);
  const { showToast } = useToast();

  useEffect(() => {
    const li = JSON.parse(localStorage.getItem('linkedin_leads') || '[]');
    const ig = JSON.parse(localStorage.getItem('insta_leads') || '[]');
    const combined = [...li, ...ig];
    setSavedLeads(combined);
    
    if (initialLead) {
       const idx = combined.findIndex(l => l.name === initialLead.name);
       if (idx !== -1) {
         setSelectedLeadIndex(idx);
         setLeadName(combined[idx].name);
         setLeadCompany(combined[idx].company);
       }
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
    if(!leadName) { showToast('Select a lead', 'warning'); return; }
    setIsLoading(true);
    let lead = { name: leadName, company: leadCompany, title: 'Professional', source: 'Manual', profile_url: '', scraped_at: '', bio: '' };
    if (selectedLeadIndex >= 0) {
      lead = savedLeads[selectedLeadIndex];
    }
    const res = await writeEmail(lead, productDesc, senderName);
    setIsLoading(false);
    if (res.error) showToast(res.error, 'error');
    else if (res.data) {
       setResult(res.data);
       showToast('Email generated successfully', 'success');
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
             {savedLeads.map((l, i) => <option key={i} value={i}>{l.name} ({l.company})</option>)}
          </select>
          <input placeholder="Lead Name" value={leadName} onChange={e => setLeadName(e.target.value)} style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--border)' }} />
          <input placeholder="Lead Company" value={leadCompany} onChange={e => setLeadCompany(e.target.value)} style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--border)' }} />
          <textarea placeholder="Your Product Description" value={productDesc} onChange={e => setProductDesc(e.target.value)} rows={4} style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--border)' }} />
          <input placeholder="Your Name" value={senderName} onChange={e => setSenderName(e.target.value)} style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--border)' }} />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <button className="btn-blue" style={{ width: '100%' }} onClick={handleWrite} disabled={isLoading}>
              {isLoading && <Loader2 size={16} className="animate-spin" />}
              {isLoading ? 'Writing...' : 'Write Email'}
            </button>
            {isLoading && <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '4px' }}>Writing email... ~5s</div>}
          </div>
        </div>
        
        <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ margin: '0 0 16px' }}>Generated Email</h3>
          {result ? (
            <div style={{ border: '1px solid var(--border)', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
              <div style={{ fontWeight: 600, marginBottom: '16px' }}>Subject: {result.subject}</div>
              <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6, marginBottom: '16px' }}>{result.body}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <span style={{ fontSize: '12px', color: '#6B7280' }}>{result.body.length} chars</span>
                 <button className="btn-blue" onClick={() => handleCopy(`Subject: ${result.subject}\n\n${result.body}`)}>Copy</button>
              </div>
            </div>
          ) : (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF', gap: '12px' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Mail size={32} color="#9CA3AF" />
              </div>
              <h3 style={{ margin: 0, fontSize: '18px', color: '#374151' }}>Your email will appear here</h3>
              <div style={{ fontSize: '14px' }}>Select a lead and click Write Email</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailWriter;
