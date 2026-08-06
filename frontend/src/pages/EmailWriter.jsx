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
  const [leadName, setLeadName] = useState(initialLead?.name || '');
  const [leadCompany, setLeadCompany] = useState(initialLead?.company || '');
  const [leadEmail, setLeadEmail] = useState(initialLead?.email || '');
  const [productDesc, setProductDesc] = useState('Cognify AI is an intelligent B2B lead generation platform that automates prospecting and hyper-personalized outreach. We help businesses scale their client acquisition 3x faster using AI.');
  const [senderName, setSenderName] = useState('Ganesh');
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
         setLeadEmail(combined[idx].email || `${combined[idx].name.split(' ')[0].toLowerCase()}@company.com`);
       }
    }
  }, [initialLead]);

  const handleSelectLead = (e) => {
    const idx = parseInt(e.target.value);
    setSelectedLeadIndex(idx);
    if (idx >= 0) {
       setLeadName(savedLeads[idx].name);
       setLeadCompany(savedLeads[idx].company);
       setLeadEmail(savedLeads[idx].email || `${savedLeads[idx].name.split(' ')[0].toLowerCase()}@company.com`);
    } else {
       setLeadName('');
       setLeadCompany('');
       setLeadEmail('');
    }
  };

  const handleWrite = async () => {
    if(!leadName) { showToast('Select a lead or enter name', 'warning'); return; }
    setIsLoading(true);
    let lead = { name: leadName, company: leadCompany, email: leadEmail, title: 'Owner / Executive', source: 'Manual', profile_url: '', scraped_at: '', bio: '' };
    if (selectedLeadIndex >= 0) {
      lead = { ...savedLeads[selectedLeadIndex], email: leadEmail || savedLeads[selectedLeadIndex].email };
    }
    const res = await writeEmail(lead, productDesc, senderName);
    setIsLoading(false);
    if (res.error) showToast(res.error, 'error');
    else if (res.data) {
       setResult({ ...res.data, to_email: leadEmail || res.data.lead_email });
       showToast('Stalker-level personalized email generated!', 'success');
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    incrementEmailsSent();
    showToast('Copied to clipboard!', 'success');
  };

  const handleSendEmail = () => {
    incrementEmailsSent();
    showToast(`Email successfully sent to ${leadEmail || 'recipient'}!`, 'success');
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <TopBar title="AI Email Writer" subtitle="Generate hyper-personalized cold outreach with target emails & stalker-level research" badge="Live Demo" />
      <div style={{ padding: '32px', display: 'flex', gap: '24px', flex: 1, flexWrap: 'wrap' }}>
        <div className="card" style={{ flex: 1, minWidth: '320px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ margin: 0 }}>Input Context & Lead Selection</h3>
          <div>
            <label style={{ fontSize: '12px', color: '#6B7280', fontWeight: 600, marginBottom: '4px', display: 'block' }}>Select Scraped Lead</label>
            <select value={selectedLeadIndex} onChange={handleSelectLead} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)' }}>
               <option value="-1">-- Custom / Manual Lead --</option>
               {savedLeads.map((l, i) => <option key={i} value={i}>{l.name} ({l.company}) — {l.email || 'email@company.com'}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: '12px', color: '#6B7280', fontWeight: 600, marginBottom: '4px', display: 'block' }}>Lead Name</label>
            <input placeholder="Lead Name" value={leadName} onChange={e => setLeadName(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ fontSize: '12px', color: '#2563EB', fontWeight: 600, marginBottom: '4px', display: 'block' }}>Recipient Email Address (Target)</label>
            <input placeholder="e.g. arjun.m@techscale.com" value={leadEmail} onChange={e => setLeadEmail(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #2563EB', backgroundColor: '#F0F6FF', fontWeight: 500, boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ fontSize: '12px', color: '#6B7280', fontWeight: 600, marginBottom: '4px', display: 'block' }}>Lead Company</label>
            <input placeholder="Lead Company" value={leadCompany} onChange={e => setLeadCompany(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ fontSize: '12px', color: '#6B7280', fontWeight: 600, marginBottom: '4px', display: 'block' }}>Product / Pitch Offer</label>
            <textarea placeholder="Your Product Description" value={productDesc} onChange={e => setProductDesc(e.target.value)} rows={3} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ fontSize: '12px', color: '#6B7280', fontWeight: 600, marginBottom: '4px', display: 'block' }}>Sender Name</label>
            <input placeholder="Your Name" value={senderName} onChange={e => setSenderName(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)', boxSizing: 'border-box' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '8px' }}>
            <button className="btn-blue" style={{ width: '100%' }} onClick={handleWrite} disabled={isLoading}>
              {isLoading && <Loader2 size={16} className="animate-spin" />}
              {isLoading ? 'Researching & Writing...' : 'Write Personalization Email'}
            </button>
            {isLoading && <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '4px' }}>Stalker AI analyzing bio & background... ~4s</div>}
          </div>
        </div>
        
        <div className="card" style={{ flex: 1, minWidth: '320px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ margin: '0 0 16px' }}>Generated Outreach Email</h3>
          {result ? (
            <div style={{ border: '1px solid var(--border)', padding: '20px', borderRadius: '10px', backgroundColor: '#FAFAFA', marginBottom: '16px' }}>
              <div style={{ padding: '8px 12px', backgroundColor: '#EFF6FF', borderRadius: '6px', color: '#1E40AF', fontSize: '13px', fontWeight: 600, marginBottom: '12px', border: '1px solid #BFDBFE' }}>
                ✉️ Target Recipient: <span style={{ fontFamily: 'monospace' }}>{leadEmail || result.to_email || 'target@company.com'}</span>
              </div>
              <div style={{ fontWeight: 700, fontSize: '15px', color: '#111827', marginBottom: '16px', borderBottom: '1px solid #E5E7EB', paddingBottom: '12px' }}>
                Subject: {result.subject}
              </div>
              <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6, color: '#374151', fontSize: '14px', marginBottom: '20px' }}>{result.body}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #E5E7EB', paddingTop: '16px' }}>
                 <span style={{ fontSize: '12px', color: '#6B7280' }}>{result.body.length} chars • Stalker Mode Active</span>
                 <div style={{ display: 'flex', gap: '8px' }}>
                   <button className="btn-demo" onClick={() => handleCopy(`To: ${leadEmail}\nSubject: ${result.subject}\n\n${result.body}`)}>Copy Email</button>
                   <button className="btn-blue" onClick={handleSendEmail} style={{ backgroundColor: '#10B981' }}>
                     <Mail size={14} /> Send Email Now
                   </button>
                 </div>
              </div>
            </div>
          ) : (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF', gap: '12px', padding: '40px 0' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Mail size={32} color="#9CA3AF" />
              </div>
              <h3 style={{ margin: 0, fontSize: '18px', color: '#374151' }}>Your email preview will appear here</h3>
              <div style={{ fontSize: '14px', textAlign: 'center', maxWidth: '280px' }}>Select a lead to see their target email address and generate a personalized pitch.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailWriter;
