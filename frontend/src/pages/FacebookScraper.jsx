import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import { scrapeFacebook } from '../api/client';
import { AppContext } from '../context/AppContext';
import { useToast } from '../hooks/useToast';
import { Loader2, Inbox, Mail, Users, Phone, ExternalLink, Download, Search, MapPin } from 'lucide-react';

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

const FacebookScraper = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { setLeads: setGlobalLeads } = useContext(AppContext);

  const [query, setQuery] = useState('Dental Clinics');
  const [location, setLocation] = useState('Hyderabad');
  const [maxPosts, setMaxPosts] = useState(10);
  const [loading, setLoading] = useState(false);
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('fb_leads');
    if (saved) {
      try { setLeads(JSON.parse(saved)); } catch (e) {}
    }
  }, []);

  const handleScrape = async (e) => {
    e?.preventDefault();
    if (!query) {
      showToast('Please enter a target business keyword or niche', 'warning');
      return;
    }

    setLoading(true);
    showToast(`Scraping Facebook Pages for "${query}" in ${location || 'Global'}...`, 'info');

    try {
      const res = await scrapeFacebook(query, location, parseInt(maxPosts, 10));
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        setLeads(res.data);
        localStorage.setItem('fb_leads', JSON.stringify(res.data));
        setGlobalLeads(prev => [...res.data, ...prev]);
        showToast(`Successfully extracted ${res.data.length} Facebook Business Leads!`, 'success');
      } else {
        showToast('No Facebook leads found for this query', 'warning');
      }
    } catch (err) {
      console.error(err);
      showToast('Error scraping Facebook leads', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDraftEmail = (lead) => {
    navigate('/email', { state: { lead } });
  };

  const handleExportCSV = () => {
    if (!leads.length) return;
    const headers = ['Name', 'Title', 'Company', 'Location', 'Email', 'Phone', 'Category', 'Score', 'Profile URL', 'Bio'];
    const rows = leads.map(l => [
      `"${l.name || ''}"`, `"${l.title || ''}"`, `"${l.company || ''}"`, `"${l.location || ''}"`,
      `"${l.email || ''}"`, `"${l.phone || ''}"`, `"${l.category || ''}"`, l.score || 0,
      `"${l.profile_url || ''}"`, `"${(l.bio || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `facebook_leads_${query.toLowerCase().replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Downloaded Facebook Leads CSV!', 'success');
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <TopBar 
        title="Facebook Business Scraper" 
        subtitle="Extract verified business pages, owner contacts, phone numbers & location leads from Facebook" 
        badge="Meta Leads"
      />

      <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px', flex: 1 }}>
        
        {/* SCRAPER INPUT FORM */}
        <form onSubmit={handleScrape} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#1877F2', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(24,119,242,0.3)' }}>
              <Users size={20} color="#FFFFFF" />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '16px', color: '#0F172A', fontFamily: 'var(--font-display)' }}>Facebook Local Business Search</div>
              <div style={{ fontSize: '12px', color: '#64748B' }}>Target high-intent B2B businesses, healthcare clinics, and local services</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '12px', color: '#6B7280', fontWeight: 600, marginBottom: '6px', display: 'block' }}>Target Niche / Service</label>
              <div style={{ position: 'relative' }}>
                <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  type="text" 
                  value={query} 
                  onChange={e => setQuery(e.target.value)} 
                  placeholder="e.g. Dental Clinics, Real Estate, Law Firms..." 
                  style={{ width: '100%', padding: '10px 14px 10px 36px', border: '1px solid var(--border)', borderRadius: '8px', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '12px', color: '#6B7280', fontWeight: 600, marginBottom: '6px', display: 'block' }}>City / Location Filter</label>
              <div style={{ position: 'relative' }}>
                <MapPin size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  type="text" 
                  value={location} 
                  onChange={e => setLocation(e.target.value)} 
                  placeholder="e.g. Hyderabad, Mumbai, Bangalore..." 
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
                <option value={5}>5 Verified Leads</option>
                <option value={10}>10 Verified Leads</option>
                <option value={20}>20 Verified Leads</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
            <button className="btn-blue" type="submit" disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#1877F2' }}>
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Users size={16} />}
              {loading ? 'Scraping Facebook Pages...' : 'Scrape Facebook Leads'}
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
              <Loader2 size={36} color="#1877F2" className="animate-spin" style={{ margin: '0 auto 16px' }} />
              <div style={{ fontWeight: 700, fontSize: '16px', color: '#0F172A' }}>Scraping Facebook Pages for "{query}"...</div>
              <div style={{ fontSize: '13px', color: '#64748B', marginTop: '4px' }}>Extracting owner contacts, emails, and phone numbers via Apify</div>
            </div>
          ) : leads.length === 0 ? (
            <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', gap: '16px' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Inbox size={32} color="#1877F2" />
              </div>
              <h3 style={{ margin: 0, fontSize: '18px', color: '#0F172A' }}>No Facebook Leads Extracted Yet</h3>
              <div style={{ fontSize: '14px', color: '#64748B' }}>Enter a business category and city above to start scraping local Facebook leads</div>
            </div>
          ) : (
            <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid var(--border)' }}>
                  <tr>
                    <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '11px', color: '#64748B', fontWeight: 800, letterSpacing: '0.05em' }}>PAGE / NAME</th>
                    <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '11px', color: '#64748B', fontWeight: 800, letterSpacing: '0.05em' }}>TARGET EMAIL</th>
                    <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '11px', color: '#64748B', fontWeight: 800, letterSpacing: '0.05em' }}>PHONE</th>
                    <th style={{ padding: '14px 20px', textAlign: 'center', fontSize: '11px', color: '#64748B', fontWeight: 800, letterSpacing: '0.05em' }}>SCORE</th>
                    <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '11px', color: '#64748B', fontWeight: 800, letterSpacing: '0.05em' }}>LOCATION</th>
                    <th style={{ padding: '14px 20px', textAlign: 'right', fontSize: '11px', color: '#64748B', fontWeight: 800, letterSpacing: '0.05em' }}>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid var(--border)', transition: 'background-color 0.15s' }}>
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ fontWeight: 700, fontSize: '14px', color: '#0F172A' }}>{lead.name}</div>
                        <div style={{ fontSize: '12px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                          <span style={{ backgroundColor: '#EFF6FF', color: '#1D4ED8', padding: '1px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 700 }}>{lead.source}</span>
                          {lead.profile_url && (
                            <a href={lead.profile_url} target="_blank" rel="noreferrer" style={{ color: '#1877F2', display: 'flex', alignItems: 'center', gap: '2px', textDecoration: 'none' }}>
                              View Page <ExternalLink size={10} />
                            </a>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: '16px 20px', fontFamily: 'var(--font-mono)', fontSize: '13px', color: '#334155' }}>
                        {lead.email}
                      </td>
                      <td style={{ padding: '16px 20px', fontFamily: 'var(--font-mono)', fontSize: '13px', color: '#334155' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <Phone size={13} color="#166534" /> {lead.phone}
                        </span>
                      </td>
                      <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                        {renderScoreBadge(lead.score)}
                      </td>
                      <td style={{ padding: '16px 20px', fontSize: '13px', color: '#64748B' }}>
                        {lead.location}
                      </td>
                      <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                        <button 
                          className="btn-demo" 
                          onClick={() => handleDraftEmail(lead)}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', fontSize: '12px' }}
                        >
                          <Mail size={14} color="#1877F2" /> Draft Cold Email
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

export default FacebookScraper;
