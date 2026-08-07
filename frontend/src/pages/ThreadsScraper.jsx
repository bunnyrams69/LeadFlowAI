import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import { scrapeThreads } from '../api/client';
import { AppContext } from '../context/AppContext';
import { useToast } from '../hooks/useToast';
import { Loader2, Inbox, Mail, AtSign, ExternalLink, Download, Search } from 'lucide-react';

const renderScoreBadge = (score) => {
  let bg = '#FEF3C7';
  let color = '#92400E';
  if (score >= 90) {
    bg = '#DCFCE7'; color = '#166534';
  } else if (score >= 80) {
    bg = '#DBEAFE'; color = '#1E40AF';
  }

  return (
    <span style={{ backgroundColor: bg, color: color, padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
      {score}
    </span>
  );
};

const ThreadsScraper = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { setLeads: setGlobalLeads } = useContext(AppContext);

  const [query, setQuery] = useState('AI Automations');
  const [maxPosts, setMaxPosts] = useState(10);
  const [loading, setLoading] = useState(false);
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('threads_leads');
    if (saved) {
      try { setLeads(JSON.parse(saved)); } catch (e) {}
    }
  }, []);

  const handleScrape = async (e) => {
    e?.preventDefault();
    if (!query) {
      showToast('Please enter a creator niche or topic', 'warning');
      return;
    }

    setLoading(true);
    showToast(`Scraping Threads creators for "${query}"...`, 'info');

    try {
      const res = await scrapeThreads(query, parseInt(maxPosts, 10));
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        setLeads(res.data);
        localStorage.setItem('threads_leads', JSON.stringify(res.data));
        setGlobalLeads(prev => [...res.data, ...prev]);
        showToast(`Successfully extracted ${res.data.length} Threads Creator Leads!`, 'success');
      } else {
        showToast('No Threads creators found for this query', 'warning');
      }
    } catch (err) {
      console.error(err);
      showToast('Error scraping Threads leads', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDraftEmail = (lead) => {
    navigate('/email', { state: { lead } });
  };

  const handleExportCSV = () => {
    if (!leads.length) return;
    const headers = ['Name', 'Handle', 'Title', 'Company', 'Email', 'Score', 'Profile URL', 'Bio'];
    const rows = leads.map(l => [
      `"${l.name || ''}"`, `"${l.handle || ''}"`, `"${l.title || ''}"`, `"${l.company || ''}"`,
      `"${l.email || ''}"`, l.score || 0, `"${l.profile_url || ''}"`, `"${(l.bio || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `threads_leads_${query.toLowerCase().replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Downloaded Threads Leads CSV!', 'success');
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <TopBar 
        title="Threads Creator Scraper" 
        subtitle="Extract Meta Threads solopreneurs, AI builders, and high-engagement creator profiles" 
        badge="Threads Leads"
      />

      <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px', flex: 1 }}>
        
        {/* SCRAPER INPUT FORM */}
        <form onSubmit={handleScrape} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#000000', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
              <AtSign size={20} color="#FFFFFF" />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '16px', color: '#0F172A', fontFamily: 'var(--font-display)' }}>Threads Creator & Solopreneur Search</div>
              <div style={{ fontSize: '12px', color: '#64748B' }}>Discover active tech builders, agency owners, and niche content creators</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '12px', color: '#6B7280', fontWeight: 600, marginBottom: '6px', display: 'block' }}>Creator Niche / Keyword</label>
              <div style={{ position: 'relative' }}>
                <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  type="text" 
                  value={query} 
                  onChange={e => setQuery(e.target.value)} 
                  placeholder="e.g. AI Automations, SaaS, Tech Founders..." 
                  style={{ width: '100%', padding: '10px 14px 10px 36px', border: '1px solid var(--border)', borderRadius: '8px', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '12px', color: '#6B7280', fontWeight: 600, marginBottom: '6px', display: 'block' }}>Max Leads to Extract</label>
              <select 
                value={maxPosts} 
                onChange={e => setMaxPosts(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border)', borderRadius: '8px', boxSizing: 'border-box', backgroundColor: 'white' }}
              >
                <option value={5}>5 Verified Creators</option>
                <option value={10}>10 Verified Creators</option>
                <option value={20}>20 Verified Creators</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
            <button className="btn-blue" type="submit" disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#000000' }}>
              {loading ? <Loader2 size={16} className="animate-spin" /> : <AtSign size={16} />}
              {loading ? 'Scraping Threads Creators...' : 'Scrape Threads Leads'}
            </button>

            {leads.length > 0 && (
              <button className="btn-demo" type="button" onClick={handleExportCSV} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Download size={14} /> Export CSV ({leads.length})
              </button>
            )}
          </div>
        </form>

        {/* RESULTS TABLE */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {loading ? (
            <div className="card" style={{ padding: '60px', textAlign: 'center' }}>
              <Loader2 size={36} color="#000000" className="animate-spin" style={{ margin: '0 auto 16px' }} />
              <div style={{ fontWeight: 700, fontSize: '16px', color: '#0F172A' }}>Scraping Threads Creators for "{query}"...</div>
              <div style={{ fontSize: '13px', color: '#64748B', marginTop: '4px' }}>Extracting creator handles, bio insights, and target emails via Apify</div>
            </div>
          ) : leads.length === 0 ? (
            <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', gap: '16px' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Inbox size={32} color="#000000" />
              </div>
              <h3 style={{ margin: 0, fontSize: '18px', color: '#0F172A' }}>No Threads Leads Extracted Yet</h3>
              <div style={{ fontSize: '14px', color: '#64748B' }}>Enter a creator niche above to start scraping active Threads profiles</div>
            </div>
          ) : (
            <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid var(--border)' }}>
                  <tr>
                    <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '11px', color: '#64748B', fontWeight: 800, letterSpacing: '0.05em' }}>CREATOR / HANDLE</th>
                    <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '11px', color: '#64748B', fontWeight: 800, letterSpacing: '0.05em' }}>TARGET EMAIL</th>
                    <th style={{ padding: '14px 20px', textAlign: 'center', fontSize: '11px', color: '#64748B', fontWeight: 800, letterSpacing: '0.05em' }}>SCORE</th>
                    <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '11px', color: '#64748B', fontWeight: 800, letterSpacing: '0.05em' }}>BIO SNIPPET</th>
                    <th style={{ padding: '14px 20px', textAlign: 'right', fontSize: '11px', color: '#64748B', fontWeight: 800, letterSpacing: '0.05em' }}>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid var(--border)', transition: 'background-color 0.15s' }}>
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ fontWeight: 700, fontSize: '14px', color: '#0F172A' }}>{lead.name}</div>
                        <div style={{ fontSize: '12px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                          <span style={{ backgroundColor: '#F1F5F9', color: '#0F172A', padding: '1px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{lead.handle}</span>
                          {lead.profile_url && (
                            <a href={lead.profile_url} target="_blank" rel="noreferrer" style={{ color: '#000000', display: 'flex', alignItems: 'center', gap: '2px', textDecoration: 'none', fontWeight: 600 }}>
                              Profile <ExternalLink size={10} />
                            </a>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: '16px 20px', fontFamily: 'var(--font-mono)', fontSize: '13px', color: '#334155' }}>
                        {lead.email}
                      </td>
                      <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                        {renderScoreBadge(lead.score)}
                      </td>
                      <td style={{ padding: '16px 20px', fontSize: '13px', color: '#64748B', maxWidth: '300px' }}>
                        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{lead.bio}</div>
                      </td>
                      <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                        <button 
                          className="btn-demo" 
                          onClick={() => handleDraftEmail(lead)}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', fontSize: '12px' }}
                        >
                          <Mail size={14} color="#000000" /> Draft Cold Email
                        </button>
                      </td>
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

export default ThreadsScraper;
