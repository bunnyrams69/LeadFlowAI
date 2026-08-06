import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import { scrapeInstagram } from '../api/client';
import { AppContext } from '../context/AppContext';
import { useToast } from '../hooks/useToast';
import { Loader2, X, Mail, Inbox } from 'lucide-react';

const calculateScore = (lead) => {
  if (lead && lead.score !== undefined) return lead.score;
  let score = 70;
  if (lead?.bio && String(lead.bio).trim() !== '') score += 10;
  if (lead?.email && String(lead.email).trim() !== '') score += 5;
  if (lead?.profile_url && String(lead.profile_url).trim() !== '') score += 5;

  const seedStr = (lead?.name || '') + (lead?.profile_url || '') + (lead?.company || '') + (lead?.email || '');
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) {
    hash = (hash * 31 + seedStr.charCodeAt(i)) % 10;
  }
  score += Math.abs(hash);

  return Math.min(Math.max(score, 60), 99);
};

const renderScoreBadge = (score) => {
  let bg = '#E5E7EB';
  let color = '#374151';

  if (score >= 90) {
    bg = '#DCFCE7';
    color = '#166534';
  } else if (score >= 80) {
    bg = '#DBEAFE';
    color = '#1E40AF';
  } else if (score >= 70) {
    bg = '#FEF3C7';
    color = '#92400E';
  }

  return (
    <span
      style={{
        backgroundColor: bg,
        color: color,
        padding: '4px 10px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: 600,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: '36px'
      }}
    >
      {score}
    </span>
  );
};

const ScraperLeadsTable = ({ leads, loading }) => {
  const navigate = useNavigate();

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
          <Inbox size={32} color="#9CA3AF" />
        </div>
        <h3 style={{ margin: 0, fontSize: '18px' }}>No leads yet</h3>
        <div style={{ fontSize: '14px', color: '#6B7280' }}>Run a scrape to get started</div>
      </div>
    );
  }

  return (
    <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
      <table>
        <thead style={{ backgroundColor: '#F9FAFB' }}>
          <tr>
            <th style={{ fontSize: '12px', color: '#6B7280', textTransform: 'uppercase' }}>Name</th>
            <th style={{ fontSize: '12px', color: '#6B7280', textTransform: 'uppercase' }}>Score</th>
            <th style={{ fontSize: '12px', color: '#6B7280', textTransform: 'uppercase' }}>Source</th>
            <th style={{ fontSize: '12px', color: '#6B7280', textTransform: 'uppercase' }}>Company</th>
            <th style={{ fontSize: '12px', color: '#6B7280', textTransform: 'uppercase' }}>Role</th>
            <th style={{ fontSize: '12px', color: '#6B7280', textTransform: 'uppercase' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead, i) => {
            const score = calculateScore(lead);
            const sourceClass = (lead.source || 'instagram').toLowerCase();
            return (
              <tr key={i}>
                <td style={{ fontWeight: 500 }}>{lead.name}</td>
                <td>{renderScoreBadge(score)}</td>
                <td>
                  {lead.profile_url ? (
                    <a href={lead.profile_url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }} title="View Profile">
                      <span className={`tag tag-${sourceClass}`} style={{ cursor: 'pointer' }}>{lead.source}</span>
                    </a>
                  ) : (
                    <span className={`tag tag-${sourceClass}`}>{lead.source}</span>
                  )}
                </td>
                <td>{lead.company}</td>
                <td style={{ color: '#6B7280' }}>{lead.title}</td>
                <td>
                  <button className="btn-blue" style={{ fontSize: '12px', padding: '6px 12px' }} onClick={() => navigate('/email', { state: { lead } })}>
                    <Mail size={14} /> Write Email
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const InstaScraper = () => {
  const [tab, setTab] = useState('username');
  const [query, setQuery] = useState('');
  const [maxPosts, setMaxPosts] = useState(10);
  const [results, setResults] = useState([]);
  const [showBanner, setShowBanner] = useState(true);
  const { allLeads, setAllLeads, isLoading, setIsLoading } = useContext(AppContext);
  const { showToast } = useToast();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('insta_leads') || '[]');
    setResults(saved);
    if (localStorage.getItem('scraper_banner_dismissed')) {
       setShowBanner(false);
    }
  }, []);

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('scraper_banner_dismissed', 'true');
  };

  const handleScrape = async () => {
    if (!query) return;
    setIsLoading(true);
    const searchQ = tab === 'hashtag' ? (query.startsWith('#') ? query : `#${query}`) : query;
    const res = await scrapeInstagram(searchQ, maxPosts);
    setIsLoading(false);
    
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
      {showBanner && (
         <div style={{ backgroundColor: '#FEF3C7', color: '#92400E', padding: '12px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #FDE68A' }}>
           <div style={{ fontSize: '14px', fontWeight: 500 }}>⚡ Running in demo mode — live scraping requires credentials. Contact us for the full version.</div>
           <X size={18} style={{ cursor: 'pointer' }} onClick={handleDismiss} />
         </div>
      )}
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
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <button className="btn-blue" onClick={handleScrape} disabled={isLoading}>
                {isLoading && <Loader2 size={16} className="animate-spin" />}
                {isLoading ? 'Scraping...' : 'Scrape Profiles'}
              </button>
              {isLoading && <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '4px' }}>Scraping leads... ~15s</div>}
            </div>
          </div>
        </div>
        <ScraperLeadsTable leads={results} loading={false} />
      </div>
    </div>
  );
};

export default InstaScraper;
