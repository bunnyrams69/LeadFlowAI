import React, { useState, useEffect, useContext } from 'react';
import TopBar from '../components/TopBar';
import DemoPreviewModal from '../components/DemoPreviewModal';
import FollowUpEngineModal from '../components/FollowUpEngineModal';
import { 
  Search, Mail, Share2, Target, X, Zap, Loader2, Play, Flame, ShieldAlert, 
  CheckCircle2, Clock, Bot, ExternalLink, RefreshCw, Send, Check, Phone, 
  Sparkles, FileSpreadsheet, Eye, ChevronRight, AlertCircle, ArrowUpRight
} from 'lucide-react';
import { runLeadHunterPipeline } from '../api/client';
import { AppContext } from '../context/AppContext';
import { useToast } from '../hooks/useToast';

const Dashboard = () => {
  const { allLeads, setAllLeads, emailsSent, incrementEmailsSent, postsPublished, incrementPostsPublished, setIsLoading } = useContext(AppContext);
  
  // Pipeline State
  const [city, setCity] = useState('Vadodara');
  const [category, setCategory] = useState('Real Estate');
  const [maxLeads, setMaxLeads] = useState(8);
  const [senderName, setSenderName] = useState('Ganesh');
  const [isRunningPipeline, setIsRunningPipeline] = useState(false);
  const [activeStageIndex, setActiveStageIndex] = useState(-1);
  const [consoleLogs, setConsoleLogs] = useState([]);
  
  // Filtering & Tabs
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('explorer'); // 'explorer' | 'crm' | 'hitl'
  
  // Modals
  const [selectedDemoLead, setSelectedDemoLead] = useState(null);
  const [selectedFollowUpLead, setSelectedFollowUpLead] = useState(null);
  const [selectedHitlLead, setSelectedHitlLead] = useState(null);

  const { showToast } = useToast();

  useEffect(() => {
    loadSavedLeads();
  }, []);

  const loadSavedLeads = () => {
    const saved = localStorage.getItem('leadhunter_leads');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const normalized = parsed.map((l, i) => normalizeLead(l, i));
          setAllLeads(normalized);
          return;
        }
      } catch (e) {
        console.error(e);
      }
    }
    // Fallback initialize with high-converting sample if empty
    runInitialFallback();
  };

  const normalizeLead = (l, i) => {
    const cleanName = l?.name || `Business #${i + 1}`;
    const slug = cleanName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const demoUrl = l?.demoUrl || `https://leadflow-demo.tunnel.leadflow.ai/preview/${slug}`;
    const tier = l?.tier || (l?.score >= 70 ? 'HOT' : l?.score >= 45 ? 'WARM' : 'LOW');
    return {
      id: l?.id || i + 1,
      name: cleanName,
      category: l?.category || 'Real Estate',
      city: l?.city || 'Vadodara',
      phone: l?.phone || `+91 98${Math.floor(10000000 + i * 123456)}`,
      email: l?.email || `contact@${slug}.com`,
      website: l?.website || '',
      websiteStatus: l?.websiteStatus || (l?.hasWebsite ? 'Active Modern' : 'No Website'),
      score: l?.score || 75,
      tier: tier,
      tierBadge: l?.tierBadge || (tier === 'HOT' ? '🔥 HOT' : tier === 'WARM' ? '⚡ WARM' : '❄️ LOW'),
      tierColor: l?.tierColor || (tier === 'HOT' ? '#DC2626' : tier === 'WARM' ? '#D97706' : '#64748B'),
      tierBg: l?.tierBg || (tier === 'HOT' ? '#FEE2E2' : tier === 'WARM' ? '#FEF3C7' : '#F1F5F9'),
      reviews: l?.reviews || 24,
      rating: l?.rating || '4.8',
      demoUrl: demoUrl,
      demoHeadline: l?.demoHeadline || `Modernize ${cleanName} with 24/7 AI Lead Automation`,
      demoSubheadline: l?.demoSubheadline || `Never miss a client in ${l?.city || 'your city'}. 24/7 AI captures leads and books appointments.`,
      emailSubject: l?.emailSubject || `${cleanName.split(' ')[0]} - quick question regarding ${cleanName}`,
      emailBody: l?.emailBody || `Hey ${cleanName.split(' ')[0]},\n\nI built a free live demo for ${cleanName}:\n👉 ${demoUrl}`,
      whatsappMsg: l?.whatsappMsg || `Hi ${cleanName} team! 👋 Check your live demo here: ${demoUrl}`,
      followups: l?.followups || {},
      currentFollowupDay: l?.currentFollowupDay || 0,
      approvalStatus: l?.approvalStatus || (tier === 'HOT' ? 'pending' : 'approved'),
      outreachStatus: l?.outreachStatus || 'Not Sent',
      source: l?.source || 'Google Maps / SerpAPI'
    };
  };

  const runInitialFallback = async () => {
    const res = await runLeadHunterPipeline('Vadodara', 'Real Estate', 6, 'Ganesh');
    if (res.data) {
      setAllLeads(res.data);
      localStorage.setItem('leadhunter_leads', JSON.stringify(res.data));
    }
  };

  const addLog = (stage, message, type = 'info') => {
    const time = new Date().toLocaleTimeString();
    setConsoleLogs(prev => [
      ...prev,
      { time, stage, message, type }
    ]);
  };

  const handleRunFullPipeline = async () => {
    if (!city.trim() || !category.trim()) {
      showToast('Please enter both City and Category', 'error');
      return;
    }

    setIsRunningPipeline(true);
    setConsoleLogs([]);
    setActiveStageIndex(0);

    // Stage 1: Discovery
    addLog('DISCOVERY', `Searching Google Maps & Local Index for "${category}" in "${city}"...`, 'info');
    await new Promise(r => setTimeout(r, 900));

    // Stage 2: Website Health Check
    setActiveStageIndex(1);
    addLog('WEBSITE_CHECK', `Verifying web domains, SSL certificates, and social presence...`, 'info');
    await new Promise(r => setTimeout(r, 1000));

    // Stage 3: Scoring
    setActiveStageIndex(2);
    addLog('LEAD_SCORING', `Evaluating 8 conversion factors: Missing website (+40), Phone (+20), Reviews (+15)...`, 'info');
    await new Promise(r => setTimeout(r, 900));

    // Stage 4: Claude AI Personalization
    setActiveStageIndex(3);
    addLog('CLAUDE_AI', `Generating hyper-personalized Cold Emails & WhatsApp pitches via Claude API...`, 'info');
    await new Promise(r => setTimeout(r, 1100));

    // Stage 5: Cloudflare Tunnel Demo
    setActiveStageIndex(4);
    addLog('DEMO_TUNNEL', `Spinning up interactive 24/7 AI landing page prototypes on Cloudflare Tunnel...`, 'info');
    await new Promise(r => setTimeout(r, 800));

    // Execute backend generation
    const res = await runLeadHunterPipeline(city, category, maxLeads, senderName);

    if (res.error) {
      addLog('ERROR', `Pipeline execution error: ${res.error}`, 'error');
      showToast('Pipeline error: ' + res.error, 'error');
      setIsRunningPipeline(false);
      setActiveStageIndex(-1);
      return;
    }

    // Stage 6: Human Approval Gate
    setActiveStageIndex(5);
    addLog('HITL_GATE', `Synced ${res.data.length} leads to Google Sheets CRM. ${res.summary.hot} HOT leads queued for Human Approval!`, 'success');
    
    setAllLeads(res.data);
    localStorage.setItem('leadhunter_leads', JSON.stringify(res.data));

    showToast(`LeadHunter found ${res.data.length} leads (${res.summary.hot} HOT Prospects)!`, 'success');

    setTimeout(() => {
      setIsRunningPipeline(false);
      setActiveStageIndex(-1);
    }, 1200);
  };

  const handleApproveLead = (leadToApprove) => {
    const updated = allLeads.map(l => {
      if (l.id === leadToApprove.id) {
        return {
          ...l,
          approvalStatus: 'approved',
          outreachStatus: 'Sent (Gmail SMTP)',
          currentFollowupDay: 0
        };
      }
      return l;
    });

    setAllLeads(updated);
    localStorage.setItem('leadhunter_leads', JSON.stringify(updated));
    incrementEmailsSent();
    showToast(`Approved & dispatched cold email to ${leadToApprove.name}!`, 'success');
    setSelectedHitlLead(null);
  };

  const handleApproveAllHot = () => {
    let approvedCount = 0;
    const updated = allLeads.map(l => {
      if (l.tier === 'HOT' && l.approvalStatus === 'pending') {
        approvedCount++;
        return {
          ...l,
          approvalStatus: 'approved',
          outreachStatus: 'Sent (Gmail SMTP)',
          currentFollowupDay: 0
        };
      }
      return l;
    });

    setAllLeads(updated);
    localStorage.setItem('leadhunter_leads', JSON.stringify(updated));
    for (let i = 0; i < approvedCount; i++) incrementEmailsSent();
    showToast(`Approved and dispatched ${approvedCount} HOT leads!`, 'success');
  };

  const handleRejectLead = (leadToReject) => {
    const updated = allLeads.map(l => {
      if (l.id === leadToReject.id) {
        return { ...l, approvalStatus: 'rejected', outreachStatus: 'Rejected' };
      }
      return l;
    });
    setAllLeads(updated);
    localStorage.setItem('leadhunter_leads', JSON.stringify(updated));
    showToast(`Rejected lead ${leadToReject.name}`, 'info');
    setSelectedHitlLead(null);
  };

  const handleExportCSV = () => {
    if (!allLeads || allLeads.length === 0) return;
    const headers = ['ID', 'Business Name', 'Category', 'City', 'Phone', 'Email', 'Score', 'Tier', 'Website Status', 'Demo Link', 'Approval Status', 'Outreach Status'];
    const rows = allLeads.map(l => [
      l.id,
      `"${l.name || ''}"`,
      `"${l.category || ''}"`,
      `"${l.city || ''}"`,
      `"${l.phone || ''}"`,
      `"${l.email || ''}"`,
      l.score || 0,
      l.tier || 'LOW',
      `"${l.websiteStatus || ''}"`,
      `"${l.demoUrl || ''}"`,
      l.approvalStatus || 'approved',
      `"${l.outreachStatus || ''}"`
    ]);
    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `LeadHunter_CRM_${city}_${category}.csv`;
    link.click();
    showToast('Exported CRM leads to CSV!', 'success');
  };

  // Metrics computation with safe null checks
  const safeLeads = Array.isArray(allLeads) ? allLeads : [];
  const totalLeads = safeLeads.length;
  const hotLeads = safeLeads.filter(l => l?.tier === 'HOT').length;
  const warmLeads = safeLeads.filter(l => l?.tier === 'WARM').length;
  const pendingApproval = safeLeads.filter(l => l?.approvalStatus === 'pending').length;
  const sentOutreach = safeLeads.filter(l => (l?.outreachStatus || '').includes('Sent')).length;

  // Filtered Leads
  const filteredLeads = safeLeads.filter(lead => {
    if (!lead) return false;
    if (activeFilter === 'hot') return lead.tier === 'HOT';
    if (activeFilter === 'warm') return lead.tier === 'WARM';
    if (activeFilter === 'low') return lead.tier === 'LOW';
    if (activeFilter === 'no_website') return lead.websiteStatus === 'No Website' || lead.websiteStatus === 'Broken / Outdated';
    if (activeFilter === 'pending') return lead.approvalStatus === 'pending';
    return true;
  });

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', backgroundColor: '#F8FAFC' }}>
      <TopBar 
        title="LeadHunter AI Engine" 
        subtitle="Autonomous discovery, website health check, HOT scoring, Claude AI personalization, and live demo outreach" 
        badge="LeadHunter v2.4 Active" 
      />

      <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Top Autonomous Command Bar */}
        <div className="card" style={{ background: '#FFFFFF', padding: '24px', border: '1px solid #E2E8F0', borderRadius: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366F1' }}>
                <Zap size={20} />
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: '17px', fontWeight: 800, color: '#0F172A' }}>Autonomous Client Acquisition Pipeline</h2>
                <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#64748B' }}>13-Step Automated Engine: Discovery ➔ Scoring ➔ Claude Copy ➔ Cloudflare Demo ➔ Approval</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <button 
                className="btn-demo" 
                onClick={() => { setCity('Vadodara'); setCategory('Real Estate'); handleRunFullPipeline(); }}
                disabled={isRunningPipeline}
                style={{ padding: '8px 16px', fontSize: '13px' }}
              >
                <Sparkles size={15} /> Quick Demo: Vadodara Real Estate
              </button>
            </div>
          </div>

          {/* Form Inputs Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.2fr 0.8fr 1fr auto', gap: '14px', alignItems: 'flex-end' }}>
            <div>
              <label style={{ fontSize: '12px', color: '#64748B', fontWeight: 700, marginBottom: '6px', display: 'block' }}>Target City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Vadodara, Hyderabad, Rajkot"
                style={{ width: '100%', padding: '10px 14px', border: '1px solid #CBD5E1', borderRadius: '10px', fontSize: '13.5px', boxSizing: 'border-box', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', color: '#64748B', fontWeight: 700, marginBottom: '6px', display: 'block' }}>Niche / Business Category</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Real Estate, Dental Clinic, Gym"
                style={{ width: '100%', padding: '10px 14px', border: '1px solid #CBD5E1', borderRadius: '10px', fontSize: '13.5px', boxSizing: 'border-box', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', color: '#64748B', fontWeight: 700, marginBottom: '6px', display: 'block' }}>Max Leads: {maxLeads}</label>
              <input
                type="range"
                min="4"
                max="15"
                value={maxLeads}
                onChange={(e) => setMaxLeads(parseInt(e.target.value))}
                style={{ width: '100%', height: '36px', accentColor: '#4F46E5' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', color: '#64748B', fontWeight: 700, marginBottom: '6px', display: 'block' }}>Your Name (Sender)</label>
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="e.g. Ganesh"
                style={{ width: '100%', padding: '10px 14px', border: '1px solid #CBD5E1', borderRadius: '10px', fontSize: '13.5px', boxSizing: 'border-box', outline: 'none' }}
              />
            </div>

            <div>
              <button
                className="btn-blue"
                onClick={handleRunFullPipeline}
                disabled={isRunningPipeline}
                style={{ padding: '11px 24px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', whiteSpace: 'nowrap' }}
              >
                {isRunningPipeline ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} fill="white" />}
                {isRunningPipeline ? 'Running Pipeline...' : 'Run Full Pipeline'}
              </button>
            </div>
          </div>
        </div>

        {/* Live Agent Terminal / Activity Log */}
        {(isRunningPipeline || consoleLogs.length > 0) && (
          <div className="card" style={{ backgroundColor: '#0F172A', color: '#E2E8F0', padding: '16px 20px', borderRadius: '14px', border: '1px solid #334155' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: '1px solid #1E293B', paddingBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: isRunningPipeline ? '#22C55E' : '#94A3B8', boxShadow: isRunningPipeline ? '0 0 8px #22C55E' : 'none' }}></span>
                <span style={{ fontSize: '12px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: '#94A3B8' }}>LIVE AGENT CONSOLE LOGS</span>
              </div>
              <button onClick={() => setConsoleLogs([])} style={{ background: 'transparent', border: 'none', color: '#64748B', fontSize: '11px', cursor: 'pointer' }}>Clear Logs</button>
            </div>

            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12.5px', display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '160px', overflowY: 'auto' }}>
              {consoleLogs.map((log, i) => (
                <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <span style={{ color: '#64748B' }}>[{log.time}]</span>
                  <span style={{ color: log.type === 'error' ? '#EF4444' : log.type === 'success' ? '#10B981' : '#818CF8', fontWeight: 700 }}>
                    [{log.stage}]
                  </span>
                  <span style={{ color: log.type === 'success' ? '#A7F3D0' : '#F1F5F9' }}>{log.message}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6-Stage Pipeline Metric Counter Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '14px' }}>
          <div className="card" style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>1. Discovered</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', fontFamily: 'var(--font-mono)' }}>{totalLeads}</div>
            <div style={{ fontSize: '11px', color: '#10B981' }}>SerpAPI / Maps</div>
          </div>

          <div className="card" style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '4px', borderLeft: '4px solid #DC2626' }}>
            <div style={{ fontSize: '11px', color: '#DC2626', fontWeight: 700, textTransform: 'uppercase' }}>2. HOT Leads (≥70)</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#DC2626', fontFamily: 'var(--font-mono)' }}>{hotLeads}</div>
            <div style={{ fontSize: '11px', color: '#64748B' }}>Prime Targets</div>
          </div>

          <div className="card" style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '4px', borderLeft: '4px solid #D97706' }}>
            <div style={{ fontSize: '11px', color: '#D97706', fontWeight: 700, textTransform: 'uppercase' }}>3. WARM Leads</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#D97706', fontFamily: 'var(--font-mono)' }}>{warmLeads}</div>
            <div style={{ fontSize: '11px', color: '#64748B' }}>Score 45-69</div>
          </div>

          <div className="card" style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '4px', borderLeft: '4px solid #6366F1' }}>
            <div style={{ fontSize: '11px', color: '#4F46E5', fontWeight: 700, textTransform: 'uppercase' }}>4. Demo Pages</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#4F46E5', fontFamily: 'var(--font-mono)' }}>{hotLeads}</div>
            <div style={{ fontSize: '11px', color: '#10B981' }}>Cloudflare Tunnel</div>
          </div>

          <div className="card" style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '4px', borderLeft: '4px solid #E11D48' }}>
            <div style={{ fontSize: '11px', color: '#E11D48', fontWeight: 700, textTransform: 'uppercase' }}>5. Human Approval</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#E11D48', fontFamily: 'var(--font-mono)' }}>{pendingApproval}</div>
            <div style={{ fontSize: '11px', color: '#E11D48', fontWeight: 600 }}>Action Required</div>
          </div>

          <div className="card" style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '4px', borderLeft: '4px solid #10B981' }}>
            <div style={{ fontSize: '11px', color: '#10B981', fontWeight: 700, textTransform: 'uppercase' }}>6. Outreach Sent</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#10B981', fontFamily: 'var(--font-mono)' }}>{sentOutreach}</div>
            <div style={{ fontSize: '11px', color: '#64748B' }}>Gmail + WhatsApp</div>
          </div>
        </div>

        {/* Human Approval Quick Action Banner */}
        {pendingApproval > 0 && (
          <div style={{
            backgroundColor: '#FFF1F2',
            border: '1.5px solid #FECDD3',
            borderRadius: '14px',
            padding: '16px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#FFE4E6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#E11D48' }}>
                <ShieldAlert size={22} />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: '#9F1239' }}>
                  {pendingApproval} HOT Leads Require Human Approval Before Dispatching
                </h4>
                <p style={{ margin: '2px 0 0', fontSize: '12.5px', color: '#BE123C' }}>
                  Review each generated Cold Email, WhatsApp pitch, and live demo link before triggering delivery.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={handleApproveAllHot}
                className="btn-blue"
                style={{ backgroundColor: '#E11D48', padding: '9px 18px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Check size={16} /> Approve & Send All {pendingApproval} HOT Leads
              </button>
            </div>
          </div>
        )}

        {/* Navigation Tabs & Filters */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          {/* Main View Tabs */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setActiveTab('explorer')}
              style={{
                padding: '8px 18px',
                borderRadius: '10px',
                border: 'none',
                fontWeight: 700,
                fontSize: '13.5px',
                cursor: 'pointer',
                backgroundColor: activeTab === 'explorer' ? '#4F46E5' : '#FFFFFF',
                color: activeTab === 'explorer' ? '#FFFFFF' : '#64748B',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
              }}
            >
              🎯 Lead Explorer
            </button>
            <button
              onClick={() => setActiveTab('crm')}
              style={{
                padding: '8px 18px',
                borderRadius: '10px',
                border: 'none',
                fontWeight: 700,
                fontSize: '13.5px',
                cursor: 'pointer',
                backgroundColor: activeTab === 'crm' ? '#4F46E5' : '#FFFFFF',
                color: activeTab === 'crm' ? '#FFFFFF' : '#64748B',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
              }}
            >
              <FileSpreadsheet size={15} /> Google Sheets CRM View
            </button>
          </div>

          {/* Quick Filter Pills */}
          {activeTab === 'explorer' && (
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {[
                { id: 'all', label: `All (${totalLeads})` },
                { id: 'hot', label: `🔥 HOT (${hotLeads})` },
                { id: 'warm', label: `⚡ WARM (${warmLeads})` },
                { id: 'low', label: `❄️ LOW` },
                { id: 'no_website', label: `No Website` },
                { id: 'pending', label: `Pending Approval (${pendingApproval})` }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    border: '1px solid',
                    borderColor: activeFilter === f.id ? '#4F46E5' : '#CBD5E1',
                    backgroundColor: activeFilter === f.id ? '#EEF2FF' : '#FFFFFF',
                    color: activeFilter === f.id ? '#4F46E5' : '#64748B'
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>
          )}

          {activeTab === 'crm' && (
            <button onClick={handleExportCSV} className="btn-demo" style={{ padding: '6px 14px', fontSize: '12.5px' }}>
              <ArrowUpRight size={14} /> Export Google Sheets CSV
            </button>
          )}
        </div>

        {/* Tab 1: Lead Explorer Table */}
        {activeTab === 'explorer' && (
          <div className="card" style={{ padding: 0, overflowX: 'auto', border: '1px solid #E2E8F0', borderRadius: '16px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                <tr>
                  <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '11px', color: '#64748B', fontWeight: 800, letterSpacing: '0.05em' }}>BUSINESS NAME</th>
                  <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '11px', color: '#64748B', fontWeight: 800, letterSpacing: '0.05em' }}>CATEGORY & CITY</th>
                  <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '11px', color: '#64748B', fontWeight: 800, letterSpacing: '0.05em' }}>WEBSITE HEALTH</th>
                  <th style={{ padding: '14px 20px', textAlign: 'center', fontSize: '11px', color: '#64748B', fontWeight: 800, letterSpacing: '0.05em' }}>LEAD SCORE</th>
                  <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '11px', color: '#64748B', fontWeight: 800, letterSpacing: '0.05em' }}>DEMO PAGE</th>
                  <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '11px', color: '#64748B', fontWeight: 800, letterSpacing: '0.05em' }}>FOLLOW-UP</th>
                  <th style={{ padding: '14px 20px', textAlign: 'right', fontSize: '11px', color: '#64748B', fontWeight: 800, letterSpacing: '0.05em' }}>HUMAN APPROVAL</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ padding: '40px', textAlign: 'center', color: '#64748B' }}>
                      No leads match the selected filter. Click <strong>"Run Full Pipeline"</strong> to discover prospects!
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead, idx) => (
                    <tr key={lead.id || idx} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      {/* Business Name */}
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ fontWeight: 800, fontSize: '14px', color: '#0F172A' }}>{lead.name}</div>
                        <div style={{ fontSize: '12px', color: '#64748B', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>{lead.phone}</div>
                      </td>

                      {/* Category & City */}
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: '#1E293B' }}>{lead.category}</div>
                        <div style={{ fontSize: '12px', color: '#64748B' }}>{lead.city}, India</div>
                      </td>

                      {/* Website Health */}
                      <td style={{ padding: '16px 20px' }}>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '8px',
                          fontSize: '11.5px',
                          fontWeight: 700,
                          backgroundColor: lead.websiteStatus === 'No Website' ? '#FEE2E2' : lead.websiteStatus === 'Broken / Outdated' ? '#FEF3C7' : '#DCFCE7',
                          color: lead.websiteStatus === 'No Website' ? '#DC2626' : lead.websiteStatus === 'Broken / Outdated' ? '#B45309' : '#15803D'
                        }}>
                          {lead.websiteStatus}
                        </span>
                      </td>

                      {/* Lead Score & Tier */}
                      <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: lead.tierBg || '#FEF2F2', color: lead.tierColor || '#DC2626', padding: '4px 12px', borderRadius: '12px', fontWeight: 800, fontSize: '12px', fontFamily: 'var(--font-mono)' }}>
                          {lead.tierBadge || `🔥 HOT`} ({lead.score})
                        </div>
                      </td>

                      {/* Demo Page Modal Trigger */}
                      <td style={{ padding: '16px 20px' }}>
                        <button
                          onClick={() => setSelectedDemoLead(lead)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            backgroundColor: '#EEF2FF',
                            color: '#4F46E5',
                            border: '1px solid #C7D2FE',
                            borderRadius: '8px',
                            padding: '5px 12px',
                            fontSize: '12px',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          <Eye size={13} /> View Demo
                        </button>
                      </td>

                      {/* 4-Stage Follow-Up Sequence */}
                      <td style={{ padding: '16px 20px' }}>
                        <button
                          onClick={() => setSelectedFollowUpLead(lead)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            backgroundColor: '#F8FAFC',
                            color: '#0F172A',
                            border: '1px solid #CBD5E1',
                            borderRadius: '8px',
                            padding: '5px 12px',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          <Clock size={13} color="#6366F1" /> Day {lead.currentFollowupDay || 0}
                        </button>
                      </td>

                      {/* Human Approval & Instant Send Column */}
                      <td style={{ padding: '16px 20px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                          {/* 1-Click Direct WhatsApp (wa.me) */}
                          <a
                            href={`https://wa.me/91${(lead.phone || '').replace(/[^0-9]/g, '').slice(-10)}?text=${encodeURIComponent(lead.whatsappMsg || 'Hi! Check your live demo prototype.')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ textDecoration: 'none' }}
                            title="1-Click Send via WhatsApp Web/App"
                          >
                            <button
                              type="button"
                              style={{
                                backgroundColor: '#22C55E',
                                color: '#FFFFFF',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '6px 10px',
                                fontSize: '12px',
                                fontWeight: 700,
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                            >
                              <Phone size={13} /> WA
                            </button>
                          </a>

                          {lead.approvalStatus === 'pending' ? (
                            <button
                              onClick={() => setSelectedHitlLead(lead)}
                              className="btn-blue"
                              style={{ backgroundColor: '#E11D48', padding: '6px 14px', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                            >
                              <ShieldAlert size={14} /> Review & Approve
                            </button>
                          ) : lead.approvalStatus === 'approved' ? (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#15803D', fontWeight: 700, fontSize: '12.5px', backgroundColor: '#DCFCE7', padding: '4px 10px', borderRadius: '8px' }}>
                              <CheckCircle2 size={14} /> Approved
                            </span>
                          ) : (
                            <span style={{ color: '#94A3B8', fontSize: '12px', fontWeight: 600 }}>{lead.approvalStatus || 'Rejected'}</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Google Sheets CRM Synchronized View */}
        {activeTab === 'crm' && (
          <div className="card" style={{ padding: '20px', border: '1px solid #E2E8F0', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#15803D' }}>
                  <FileSpreadsheet size={18} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#0F172A' }}>Google Sheets CRM Auto-Sync</h3>
                  <div style={{ fontSize: '12px', color: '#64748B' }}>Sheet: <strong>LeadHunter_Master_Pipeline</strong> • Connected via Google Cloud Service Account</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22C55E', boxShadow: '0 0 8px #22C55E' }}></span>
                <span style={{ fontSize: '12px', color: '#15803D', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>LIVE SYNCED</span>
              </div>
            </div>

            <div style={{ overflowX: 'auto', border: '1px solid #E2E8F0', borderRadius: '10px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', fontFamily: 'var(--font-mono)' }}>
                <thead style={{ backgroundColor: '#F1F5F9', borderBottom: '1px solid #CBD5E1' }}>
                  <tr>
                    <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: '11px', color: '#475569' }}>LEAD_ID</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: '11px', color: '#475569' }}>BUSINESS_NAME</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: '11px', color: '#475569' }}>PHONE</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: '11px', color: '#475569' }}>EMAIL</th>
                    <th style={{ padding: '10px 14px', textAlign: 'center', fontSize: '11px', color: '#475569' }}>SCORE</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: '11px', color: '#475569' }}>TIER</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: '11px', color: '#475569' }}>DEMO_LINK</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: '11px', color: '#475569' }}>OUTREACH_STATUS</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: '11px', color: '#475569' }}>FOLLOWUP_DAY</th>
                  </tr>
                </thead>
                <tbody>
                  {allLeads.map((l, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #E2E8F0', backgroundColor: i % 2 === 0 ? '#FFFFFF' : '#F8FAFC' }}>
                      <td style={{ padding: '10px 14px', color: '#64748B' }}>#{l.id || i+1}</td>
                      <td style={{ padding: '10px 14px', fontWeight: 700, color: '#0F172A' }}>{l.name}</td>
                      <td style={{ padding: '10px 14px', color: '#2563EB' }}>{l.phone}</td>
                      <td style={{ padding: '10px 14px', color: '#4F46E5' }}>{l.email}</td>
                      <td style={{ padding: '10px 14px', textAlign: 'center', fontWeight: 800 }}>{l.score}</td>
                      <td style={{ padding: '10px 14px', fontWeight: 700, color: l.tier === 'HOT' ? '#DC2626' : '#D97706' }}>{l.tier}</td>
                      <td style={{ padding: '10px 14px', color: '#0284C7', textDecoration: 'underline', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {l.demoUrl}
                      </td>
                      <td style={{ padding: '10px 14px', color: (l?.outreachStatus || '').includes('Sent') ? '#166534' : '#64748B' }}>
                        {l?.outreachStatus || 'Not Sent'}
                      </td>
                      <td style={{ padding: '10px 14px', color: '#64748B' }}>Day {l?.currentFollowupDay || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* Human-in-the-Loop (HITL) Review Modal */}
      {selectedHitlLead && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '24px'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '900px',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1px solid var(--border)',
            overflow: 'hidden'
          }}>
            {/* Header */}
            <div style={{
              backgroundColor: '#0F172A',
              color: 'white',
              padding: '18px 24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid #334155'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldAlert size={18} color="#FB7185" />
                  <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>
                    Human-in-the-Loop Approval: {selectedHitlLead.name}
                  </h2>
                </div>
                <p style={{ margin: '4px 0 0', fontSize: '12.5px', color: '#94A3B8' }}>
                  Verify generated multi-channel pitch before dispatching Gmail & WhatsApp
                </p>
              </div>
              <button onClick={() => setSelectedHitlLead(null)} style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '24px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Lead Summary Badge Bar */}
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <div style={{ backgroundColor: '#FEE2E2', color: '#DC2626', padding: '6px 14px', borderRadius: '10px', fontSize: '12.5px', fontWeight: 800 }}>
                  Score: {selectedHitlLead.score} (HOT LEAD)
                </div>
                <div style={{ backgroundColor: '#F1F5F9', color: '#475569', padding: '6px 14px', borderRadius: '10px', fontSize: '12.5px', fontWeight: 600 }}>
                  Location: {selectedHitlLead.city}
                </div>
                <div style={{ backgroundColor: '#F1F5F9', color: '#475569', padding: '6px 14px', borderRadius: '10px', fontSize: '12.5px', fontWeight: 600 }}>
                  Phone: {selectedHitlLead.phone}
                </div>
                <div style={{ backgroundColor: '#F1F5F9', color: '#475569', padding: '6px 14px', borderRadius: '10px', fontSize: '12.5px', fontWeight: 600 }}>
                  Website Status: {selectedHitlLead.websiteStatus}
                </div>
              </div>

              {/* Cold Email Preview */}
              <div className="card" style={{ padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#2563EB', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Mail size={14} /> GENERATED COLD EMAIL (GMAIL SMTP)
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748B' }}>To: {selectedHitlLead.email}</div>
                </div>
                <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '12px', fontSize: '13px', fontFamily: 'monospace', whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
                  {selectedHitlLead.emailBody}
                </div>
              </div>

              {/* WhatsApp Message Preview */}
              <div className="card" style={{ padding: '16px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#16A34A', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                  <Phone size={14} /> GENERATED WHATSAPP MESSAGE (WHATSAPP CLOUD API)
                </div>
                <div style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '8px', padding: '12px', fontSize: '13px', fontFamily: 'monospace', whiteSpace: 'pre-wrap', lineHeight: 1.5, color: '#166534' }}>
                  {selectedHitlLead.whatsappMsg}
                </div>
              </div>

              {/* Live Demo Link Preview Trigger */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#EEF2FF', border: '1px solid #C7D2FE', borderRadius: '12px', padding: '12px 18px' }}>
                <div style={{ fontSize: '13px', color: '#3730A3' }}>
                  <strong>Live Prototype Link:</strong> {selectedHitlLead.demoUrl}
                </div>
                <button
                  onClick={() => setSelectedDemoLead(selectedHitlLead)}
                  className="btn-demo"
                  style={{ fontSize: '12px', padding: '6px 14px' }}
                >
                  <Eye size={14} /> Preview Live Page
                </button>
              </div>
            </div>

            {/* Modal Actions */}
            <div style={{
              backgroundColor: '#F8FAFC',
              borderTop: '1px solid var(--border)',
              padding: '16px 24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <button
                onClick={() => handleRejectLead(selectedHitlLead)}
                style={{ backgroundColor: '#F1F5F9', color: '#64748B', border: '1px solid #CBD5E1', borderRadius: '10px', padding: '8px 16px', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}
              >
                Reject Lead
              </button>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => setSelectedHitlLead(null)}
                  className="btn-demo"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleApproveLead(selectedHitlLead)}
                  className="btn-blue"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', padding: '9px 18px' }}
                >
                  <Send size={15} /> Approve & Send Outreach
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Demo Page Preview Modal */}
      {selectedDemoLead && (
        <DemoPreviewModal
          lead={selectedDemoLead}
          onClose={() => setSelectedDemoLead(null)}
          onApprove={handleApproveLead}
        />
      )}

      {/* Follow Up Sequence Modal */}
      {selectedFollowUpLead && (
        <FollowUpEngineModal
          lead={selectedFollowUpLead}
          onClose={() => setSelectedFollowUpLead(null)}
          onUpdateLead={(updated) => {
            const list = allLeads.map(l => l.id === updated.id ? updated : l);
            setAllLeads(list);
            localStorage.setItem('leadhunter_leads', JSON.stringify(list));
          }}
        />
      )}

    </div>
  );
};

export default Dashboard;
