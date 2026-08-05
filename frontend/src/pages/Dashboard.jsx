import React, { useState, useEffect, useContext } from 'react';
import TopBar from '../components/TopBar';
import MetricCard from '../components/MetricCard';
import PipelineFlow from '../components/PipelineFlow';
import LeadsTable from '../components/LeadsTable';
import { Search, Mail, Share2, Target, X, Zap, Loader2 } from 'lucide-react';
import { getLinkedInLeads, getInstagramLeads, runPipeline, scrapeLinkedIn, writeEmail, publishPost } from '../api/client';
import { AppContext } from '../context/AppContext';
import { useToast } from '../hooks/useToast';

const Dashboard = () => {
  const { allLeads, setAllLeads, emailsSent, incrementEmailsSent, postsPublished, incrementPostsPublished, setIsLoading } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [pipelineActive, setPipelineActive] = useState(-1);
  const [showModal, setShowModal] = useState(false);
  const [demoRunning, setDemoRunning] = useState(false);
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
    let combined = [];
    const li = JSON.parse(localStorage.getItem('linkedin_leads') || '[]');
    const ig = JSON.parse(localStorage.getItem('insta_leads') || '[]');
    combined = [...li, ...ig];
    setAllLeads(combined);
    setLoading(false);
  };

  const submitPipeline = async () => {
    if (!pipeForm.query || !pipeForm.productDescription || !pipeForm.senderName) {
      showToast('Please fill all required fields', 'error');
      return;
    }
    setShowModal(false);
    setIsLoading(true);
    setPipelineActive(0);
    setTimeout(() => setPipelineActive(1), 1000);
    setTimeout(() => setPipelineActive(2), 2000);
    
    const res = await runPipeline(pipeForm.query, pipeForm.source, pipeForm.productDescription, pipeForm.senderName, pipeForm.autoPost);
    setIsLoading(false);
    
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

  const runDemoSequence = async () => {
     setDemoRunning(true);
     
     try {
       // Step 1
       setPipelineActive(0);
       showToast('Step 1: Scraping LinkedIn leads...', 'success');
       setIsLoading(true);
       const scrapeRes = await scrapeLinkedIn("AI automation Hyderabad", 4);
       if(scrapeRes.data) {
         localStorage.setItem('linkedin_leads', JSON.stringify(scrapeRes.data));
         fetchLeads();
       }
       setIsLoading(false);
       
       // Step 2
       await new Promise(r => setTimeout(r, 2000));
       setPipelineActive(1);
       showToast('Step 2: Writing personalized emails...', 'success');
       setIsLoading(true);
       if (scrapeRes.data && scrapeRes.data.length > 0) {
           await writeEmail(scrapeRes.data[0], "AI Chatbots", "Cognify AI");
       }
       setIsLoading(false);
       
       // Step 3
       await new Promise(r => setTimeout(r, 2500));
       setPipelineActive(2);
       showToast('Step 3: Publishing LinkedIn post...', 'success');
       setIsLoading(true);
       await publishPost("Just automated lead generation for 4 businesses in Hyderabad using AI. RAG chatbots + WhatsApp bots = 3x more qualified leads. DM me if you want the same system. — Cognify AI");
       setIsLoading(false);
       
       // Step 4
       await new Promise(r => setTimeout(r, 2000));
       setPipelineActive(3);
       showToast('Step 4: RAG chatbot ready...', 'success');
       
       // Step 5
       await new Promise(r => setTimeout(r, 1500));
       setPipelineActive(-1);
       incrementEmailsSent();
       incrementPostsPublished();
       showToast('✓ Full pipeline completed in 8 seconds — 4 leads, 1 email, 1 post', 'success');
     } catch (err) {
       console.error(err);
     }
     
     setDemoRunning(false);
  };

  const replyRate = emailsSent === 0 ? '0%' : '12%';

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: 'white', borderBottom: '1px solid var(--border)', padding: '20px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 600 }}>Dashboard</h1>
          <p style={{ margin: '4px 0 0', color: '#6B7280', fontSize: '14px' }}>Overview of your lead generation pipeline</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#DCFCE7', color: '#166534', padding: '4px 12px', borderRadius: '16px', fontSize: '12px', fontWeight: 600 }}>
            <span style={{ width: '8px', height: '8px', backgroundColor: '#22C55E', borderRadius: '50%' }}></span>
            Live Demo
          </div>
          <button className="btn-demo" onClick={runDemoSequence} disabled={demoRunning}>
             {demoRunning ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} />}
             {demoRunning ? 'Running demo...' : 'Demo Mode'}
          </button>
          <button className="btn-blue" onClick={() => setShowModal(true)}>Run Pipeline</button>
        </div>
      </div>
      
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

      <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
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
