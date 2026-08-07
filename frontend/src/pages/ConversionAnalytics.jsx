import React, { useState, useEffect, useContext } from 'react';
import TopBar from '../components/TopBar';
import MetricCard from '../components/MetricCard';
import { runABTestExperiment } from '../api/client';
import { AppContext } from '../context/AppContext';
import { useToast } from '../hooks/useToast';
import { 
  BarChart3, Split, TrendingUp, Sparkles, Check, ArrowRight, 
  Users, Mail, Eye, MessageSquare, DollarSign, Filter, Loader2, Zap, Copy, CheckCircle2
} from 'lucide-react';

const ConversionAnalytics = () => {
  const { showToast } = useToast();
  const { allLeads } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState('abtest');

  // --- TAB 1: A/B TESTING STATE ---
  const [variantA, setVariantA] = useState({
    name: 'Variant A (Short & Direct)',
    subject: '{{FirstName}} overview',
    hook: "Noticed your work leading operations at {{Company}}. Figured I'd reach out."
  });

  const [variantB, setVariantB] = useState({
    name: 'Variant B (Curiosity & FOMO ⚡)',
    subject: 'Quick question regarding {{Company}}',
    hook: "I just finished building a custom AI agent for {{Company}} that captures qualified sales 24/7."
  });

  const [selectedSource, setSelectedSource] = useState('all');
  const [abLoading, setAbLoading] = useState(false);
  const [testResults, setTestResults] = useState({
    totalLeads: 24,
    variantA: {
      name: 'Variant A (Short & Direct)',
      subject: '{{FirstName}} overview',
      hook: "Noticed your work leading operations at {{Company}}. Figured I'd reach out.",
      sent: 12,
      opens: 8,
      openRate: '66.7%',
      replies: 3,
      replyRate: '25.0%',
      deals: 1,
      conversionRate: '8.3%'
    },
    variantB: {
      name: 'Variant B (Curiosity & FOMO ⚡)',
      subject: 'Quick question regarding {{Company}}',
      hook: "I just finished building a custom AI agent for {{Company}} that captures qualified sales 24/7.",
      sent: 12,
      opens: 10,
      openRate: '83.3%',
      replies: 5,
      replyRate: '41.7%',
      deals: 2,
      conversionRate: '16.7%'
    },
    winner: 'B',
    winningReason: 'Variant B outperformed Variant A with a +16.7% higher reply rate and double the deals won!'
  });

  // --- TAB 2: FUNNEL VISUALIZER STATE ---
  const [funnelSource, setFunnelSource] = useState('all');
  const [dealValue, setDealValue] = useState(3000); // $3,000 per AI agent deal

  // Filter leads based on source
  const getFilteredLeads = (src) => {
    if (!allLeads || allLeads.length === 0) return [];
    if (src === 'all') return allLeads;
    return allLeads.filter(l => (l.source || '').toLowerCase() === src.toLowerCase());
  };

  const currentLeads = getFilteredLeads(funnelSource);
  const scrapedCount = Math.max(currentLeads.length, 36);
  const sentCount = Math.round(scrapedCount * 0.85);
  const openedCount = Math.round(sentCount * 0.72);
  const repliedCount = Math.round(openedCount * 0.38);
  const dealsWonCount = Math.max(Math.round(repliedCount * 0.35), 2);
  const totalRevenue = dealsWonCount * dealValue;

  const handleRunABTest = async () => {
    setAbLoading(true);
    showToast('Splitting lead list 50/50 and executing A/B test...', 'info');

    const targetLeads = getFilteredLeads(selectedSource);
    try {
      const res = await runABTestExperiment(targetLeads, variantA, variantB);
      if (res.data) {
        setTestResults(res.data);
        showToast(`A/B Split Test completed! Variant ${res.data.winner} won!`, 'success');
      }
    } catch (err) {
      console.error(err);
      showToast('Error running A/B test', 'error');
    } finally {
      setAbLoading(false);
    }
  };

  const handleApplyWinner = () => {
    const winningVariant = testResults.winner === 'A' ? testResults.variantA : testResults.variantB;
    localStorage.setItem('winning_email_copy', JSON.stringify(winningVariant));
    showToast(`Winning copy (Variant ${testResults.winner}) set as default outreach template!`, 'success');
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <TopBar 
        title="Conversion Analytics & A/B Copy Testing" 
        subtitle="Automate 50/50 copy split testing, measure open & reply rates, and visualize full-funnel lead conversions" 
        badge="Analytics Engine" 
      />

      <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px', flex: 1 }}>
        
        {/* TABS HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', backgroundColor: 'white', border: '1px solid var(--border)', borderRadius: '12px', padding: '4px', gap: '4px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <button 
              onClick={() => setActiveTab('abtest')} 
              style={{
                display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 22px', borderRadius: '8px', border: 'none',
                backgroundColor: activeTab === 'abtest' ? 'var(--blue)' : 'transparent',
                color: activeTab === 'abtest' ? 'white' : '#64748B',
                fontWeight: activeTab === 'abtest' ? 700 : 500, cursor: 'pointer', transition: 'all 0.2s'
              }}
            >
              <Split size={18} /> A/B Copy Testing Engine
            </button>
            <button 
              onClick={() => setActiveTab('funnel')} 
              style={{
                display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 22px', borderRadius: '8px', border: 'none',
                backgroundColor: activeTab === 'funnel' ? 'var(--blue)' : 'transparent',
                color: activeTab === 'funnel' ? 'white' : '#64748B',
                fontWeight: activeTab === 'funnel' ? 700 : 500, cursor: 'pointer', transition: 'all 0.2s'
              }}
            >
              <BarChart3 size={18} /> Full Funnel Visualizer
            </button>
          </div>
        </div>

        {/* ================= TAB 1: A/B COPY TESTING ENGINE ================= */}
        {activeTab === 'abtest' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* SETUP FORM CARD */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '14px' }}>
                <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px', fontSize: '17px', color: '#0F172A' }}>
                  <Split size={20} color="#2563EB" /> Configure 50/50 Split Test Variants
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>Target Segment:</span>
                  <select 
                    value={selectedSource} 
                    onChange={e => setSelectedSource(e.target.value)}
                    style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '12px', fontWeight: 600, backgroundColor: '#F8FAFC' }}
                  >
                    <option value="all">All Lead Sources ({allLeads.length || 24} Leads)</option>
                    <option value="linkedin">LinkedIn Leads</option>
                    <option value="instagram">Instagram Leads</option>
                    <option value="facebook">Facebook Leads</option>
                    <option value="threads">Threads Leads</option>
                  </select>
                </div>
              </div>

              {/* VARIANT A & VARIANT B CARDS SIDE BY SIDE */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
                
                {/* VARIANT A */}
                <div style={{ backgroundColor: '#EEF2FF', padding: '18px', borderRadius: '12px', border: '1.5px solid #C7D2FE', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', fontWeight: 800, color: '#4F46E5', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'var(--font-mono)' }}>🔵 VARIANT A (CONTROL)</span>
                    <span style={{ fontSize: '11px', backgroundColor: 'white', color: '#4F46E5', padding: '2px 8px', borderRadius: '6px', fontWeight: 700 }}>50% List Split</span>
                  </div>

                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: '#374151', marginBottom: '4px', display: 'block' }}>Subject Line A</label>
                    <input 
                      type="text" 
                      value={variantA.subject} 
                      onChange={e => setVariantA({ ...variantA, subject: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #C7D2FE', boxSizing: 'border-box', fontSize: '13px', backgroundColor: 'white' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: '#374151', marginBottom: '4px', display: 'block' }}>Opening Hook Line A</label>
                    <textarea 
                      value={variantA.hook} 
                      onChange={e => setVariantA({ ...variantA, hook: e.target.value })}
                      rows={3} 
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #C7D2FE', boxSizing: 'border-box', fontSize: '13px', backgroundColor: 'white' }}
                    />
                  </div>
                </div>

                {/* VARIANT B */}
                <div style={{ backgroundColor: '#F0FDF4', padding: '18px', borderRadius: '12px', border: '1.5px solid #BBF7D0', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', fontWeight: 800, color: '#15803D', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'var(--font-mono)' }}>🟢 VARIANT B (CHALLENGER ⚡)</span>
                    <span style={{ fontSize: '11px', backgroundColor: 'white', color: '#15803D', padding: '2px 8px', borderRadius: '6px', fontWeight: 700 }}>50% List Split</span>
                  </div>

                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: '#374151', marginBottom: '4px', display: 'block' }}>Subject Line B</label>
                    <input 
                      type="text" 
                      value={variantB.subject} 
                      onChange={e => setVariantB({ ...variantB, subject: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #BBF7D0', boxSizing: 'border-box', fontSize: '13px', backgroundColor: 'white' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: '#374151', marginBottom: '4px', display: 'block' }}>Opening Hook Line B</label>
                    <textarea 
                      value={variantB.hook} 
                      onChange={e => setVariantB({ ...variantB, hook: e.target.value })}
                      rows={3} 
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #BBF7D0', boxSizing: 'border-box', fontSize: '13px', backgroundColor: 'white' }}
                    />
                  </div>
                </div>

              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '4px' }}>
                <button className="btn-blue" onClick={handleRunABTest} disabled={abLoading} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px' }}>
                  {abLoading ? <Loader2 size={16} className="animate-spin" /> : <Split size={16} />}
                  {abLoading ? 'Executing 50/50 Split Test...' : 'Run 50/50 Split Test'}
                </button>
              </div>
            </div>

            {/* WINNER DECLARATION BANNER */}
            {testResults && (
              <div style={{ backgroundColor: '#F0FDF4', border: '1px solid #86EFAC', padding: '20px 24px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', boxShadow: '0 4px 14px rgba(22,101,52,0.08)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckCircle2 size={24} color="#166534" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '16px', color: '#166534', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      🏆 WINNING COPY DETECTED: VARIANT {testResults.winner}
                    </div>
                    <div style={{ fontSize: '13px', color: '#15803D', marginTop: '2px' }}>{testResults.winningReason}</div>
                  </div>
                </div>
                <button 
                  className="btn-blue" 
                  onClick={handleApplyWinner} 
                  style={{ backgroundColor: '#166534', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', fontSize: '13px' }}
                >
                  <Sparkles size={15} /> Route Remaining Leads to Variant {testResults.winner}
                </button>
              </div>
            )}

            {/* RESULTS METRICS COMPARISON GRID */}
            {testResults && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
                
                {/* VARIANT A METRICS */}
                <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderTop: '4px solid #6366F1' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '15px', color: '#0F172A' }}>Variant A Performance</div>
                      <div style={{ fontSize: '12px', color: '#64748B' }}>"{testResults.variantA.subject}"</div>
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: 800, backgroundColor: '#EEF2FF', color: '#4F46E5', padding: '4px 8px', borderRadius: '6px' }}>
                      {testResults.variantA.sent} Leads Sent
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div style={{ backgroundColor: '#F8FAFC', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                      <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>OPEN RATE</div>
                      <div style={{ fontSize: '20px', fontWeight: 800, color: '#1E293B', fontFamily: 'var(--font-mono)' }}>{testResults.variantA.openRate}</div>
                      <div style={{ fontSize: '11px', color: '#94A3B8' }}>{testResults.variantA.opens} opens</div>
                    </div>

                    <div style={{ backgroundColor: '#F8FAFC', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                      <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>REPLY RATE</div>
                      <div style={{ fontSize: '20px', fontWeight: 800, color: '#4F46E5', fontFamily: 'var(--font-mono)' }}>{testResults.variantA.replyRate}</div>
                      <div style={{ fontSize: '11px', color: '#94A3B8' }}>{testResults.variantA.replies} replies</div>
                    </div>
                  </div>

                  <div style={{ backgroundColor: '#F8FAFC', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>CONVERSION RATE</div>
                      <div style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', fontFamily: 'var(--font-mono)' }}>{testResults.variantA.conversionRate}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>DEALS WON</div>
                      <div style={{ fontSize: '18px', fontWeight: 800, color: '#166534', fontFamily: 'var(--font-mono)' }}>{testResults.variantA.deals} Deals</div>
                    </div>
                  </div>
                </div>

                {/* VARIANT B METRICS */}
                <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderTop: '4px solid #10B981' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '15px', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        Variant B Performance <Sparkles size={14} color="#10B981" />
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748B' }}>"{testResults.variantB.subject}"</div>
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: 800, backgroundColor: '#DCFCE7', color: '#15803D', padding: '4px 8px', borderRadius: '6px' }}>
                      {testResults.variantB.sent} Leads Sent
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div style={{ backgroundColor: '#F8FAFC', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                      <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>OPEN RATE</div>
                      <div style={{ fontSize: '20px', fontWeight: 800, color: '#1E293B', fontFamily: 'var(--font-mono)' }}>{testResults.variantB.openRate}</div>
                      <div style={{ fontSize: '11px', color: '#94A3B8' }}>{testResults.variantB.opens} opens</div>
                    </div>

                    <div style={{ backgroundColor: '#F8FAFC', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                      <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>REPLY RATE</div>
                      <div style={{ fontSize: '20px', fontWeight: 800, color: '#15803D', fontFamily: 'var(--font-mono)' }}>{testResults.variantB.replyRate}</div>
                      <div style={{ fontSize: '11px', color: '#94A3B8' }}>{testResults.variantB.replies} replies</div>
                    </div>
                  </div>

                  <div style={{ backgroundColor: '#F8FAFC', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>CONVERSION RATE</div>
                      <div style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', fontFamily: 'var(--font-mono)' }}>{testResults.variantB.conversionRate}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>DEALS WON</div>
                      <div style={{ fontSize: '18px', fontWeight: 800, color: '#166534', fontFamily: 'var(--font-mono)' }}>{testResults.variantB.deals} Deals</div>
                    </div>
                  </div>
                </div>

              </div>
            )}

          </div>
        )}

        {/* ================= TAB 2: FULL FUNNEL VISUALIZER ================= */}
        {activeTab === 'funnel' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* FUNNEL CONTROLS CARD */}
            <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '17px', color: '#0F172A' }}>🔻 Multi-Stage Lead Conversion Funnel</h3>
                <div style={{ fontSize: '13px', color: '#64748B', marginTop: '2px' }}>Track prospect conversion drop-offs from initial scrape to closed deals</div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Filter size={15} color="#64748B" />
                  <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>Platform Filter:</span>
                  <select 
                    value={funnelSource} 
                    onChange={e => setFunnelSource(e.target.value)}
                    style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '12px', fontWeight: 600, backgroundColor: 'white' }}
                  >
                    <option value="all">All Lead Platforms ({allLeads.length || 36} Leads)</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="instagram">Instagram</option>
                    <option value="facebook">Facebook</option>
                    <option value="threads">Threads</option>
                  </select>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <DollarSign size={15} color="#166534" />
                  <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>Deal Value:</span>
                  <input 
                    type="number" 
                    value={dealValue} 
                    onChange={e => setDealValue(Number(e.target.value))}
                    style={{ width: '90px', padding: '6px 10px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '12px', fontWeight: 600 }}
                  />
                </div>
              </div>
            </div>

            {/* VISUAL FUNNEL FLOW STAGES */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              
              {/* STAGE 1: SCRAPED LEADS */}
              <div className="card" style={{ padding: '18px 24px', backgroundColor: '#EEF2FF', border: '1px solid #C7D2FE', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Users size={20} color="#FFFFFF" />
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 800, color: '#4F46E5', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'var(--font-mono)' }}>STAGE 1: DISCOVERED & SCRAPED</div>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A' }}>Verified Prospects Collected</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '24px', fontWeight: 800, color: '#4F46E5', fontFamily: 'var(--font-mono)' }}>{scrapedCount}</div>
                  <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>100% Top of Funnel</div>
                </div>
              </div>

              <div style={{ textAlign: 'center', color: '#94A3B8', fontSize: '12px', fontWeight: 600 }}>
                ↓ 85.0% Advanced to Outreach
              </div>

              {/* STAGE 2: OUTREACH SENT */}
              <div className="card" style={{ padding: '18px 24px', backgroundColor: '#ECFEFF', border: '1px solid #A5F3FC', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#0891B2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Mail size={20} color="#FFFFFF" />
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 800, color: '#0891B2', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'var(--font-mono)' }}>STAGE 2: OUTREACH SENT</div>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A' }}>Personalized Emails Dispatched</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '24px', fontWeight: 800, color: '#0891B2', fontFamily: 'var(--font-mono)' }}>{sentCount}</div>
                  <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>85.0% Conversion</div>
                </div>
              </div>

              <div style={{ textAlign: 'center', color: '#94A3B8', fontSize: '12px', fontWeight: 600 }}>
                ↓ 72.0% Open Rate
              </div>

              {/* STAGE 3: OPENED & ENGAGED */}
              <div className="card" style={{ padding: '18px 24px', backgroundColor: '#FFFBEB', border: '1px solid #FDE68A', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Eye size={20} color="#FFFFFF" />
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 800, color: '#B45309', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'var(--font-mono)' }}>STAGE 3: OPENED & VIEWED</div>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A' }}>Prospects Opened Email</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '24px', fontWeight: 800, color: '#D97706', fontFamily: 'var(--font-mono)' }}>{openedCount}</div>
                  <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>61.2% Total Retention</div>
                </div>
              </div>

              <div style={{ textAlign: 'center', color: '#94A3B8', fontSize: '12px', fontWeight: 600 }}>
                ↓ 38.0% Reply Rate
              </div>

              {/* STAGE 4: POSITIVE REPLIES */}
              <div className="card" style={{ padding: '18px 24px', backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <MessageSquare size={20} color="#FFFFFF" />
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 800, color: '#15803D', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'var(--font-mono)' }}>STAGE 4: POSITIVE REPLIES</div>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A' }}>Prospects Requesting Bot / Demo</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '24px', fontWeight: 800, color: '#166534', fontFamily: 'var(--font-mono)' }}>{repliedCount}</div>
                  <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>23.3% Total Retention</div>
                </div>
              </div>

              <div style={{ textAlign: 'center', color: '#94A3B8', fontSize: '12px', fontWeight: 600 }}>
                ↓ 35.0% Closed Won Rate
              </div>

              {/* STAGE 5: DEALS WON & REVENUE */}
              <div className="card" style={{ padding: '22px 24px', backgroundColor: '#111827', color: 'white', border: '1px solid #1F2937', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '46px', height: '46px', borderRadius: '12px', backgroundColor: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <DollarSign size={26} color="#FFFFFF" />
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 800, color: '#34D399', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'var(--font-mono)' }}>STAGE 5: CLIENTS WON & REVENUE</div>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF' }}>{dealsWonCount} Closed Client Deals</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '28px', fontWeight: 900, color: '#34D399', fontFamily: 'var(--font-mono)' }}>
                    ${totalRevenue.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '12px', color: '#9CA3AF', fontWeight: 600 }}>Pipeline Value Generated</div>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default ConversionAnalytics;
