import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import { scrapeLinkedIn } from '../api/client';
import { AppContext } from '../context/AppContext';
import { useToast } from '../hooks/useToast';
import { Loader2, X, Download, Mail, Inbox } from 'lucide-react';

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
            const sourceClass = (lead.source || 'linkedin').toLowerCase();
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

const LinkedInScraper = () => {
  const [query, setQuery] = useState('');
  const [maxResults, setMaxResults] = useState(10);
  const [results, setResults] = useState([]);
  const [showBanner, setShowBanner] = useState(true);
  const { allLeads, setAllLeads, isLoading, setIsLoading } = useContext(AppContext);
  const { showToast } = useToast();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('linkedin_leads') || '[]');
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
    const res = await scrapeLinkedIn(query, maxResults);
    setIsLoading(false);
    
    if (res.error) {
       showToast(`Scrape failed: ${res.error}`, 'error');
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

  const handleExportCSV = () => {
    if (!results || results.length === 0) {
      showToast('No leads to export', 'error');
      return;
    }

    const headers = ['Name', 'Title', 'Company', 'Email', 'Source', 'Profile URL', 'Bio'];

    const escapeCSV = (val) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = results.map(lead => [
      escapeCSV(lead.name || ''),
      escapeCSV(lead.title || ''),
      escapeCSV(lead.company || ''),
      escapeCSV(lead.email || ''),
      escapeCSV(lead.source || ''),
      escapeCSV(lead.profile_url || ''),
      escapeCSV(lead.bio || '')
    ].join(','));

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'leadflow_leads.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast(`Exported ${results.length} leads to CSV!`, 'success');
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <TopBar title="LinkedIn Scraper" subtitle="Find B2B leads by searching profiles and companies" badge="Live Demo" />
      {showBanner && (
         <div style={{ backgroundColor: '#FEF3C7', color: '#92400E', padding: '12px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #FDE68A' }}>
           <div style={{ fontSize: '14px', fontWeight: 500 }}>⚡ Running in demo mode — live scraping requires credentials. Contact us for the full version.</div>
           <X size={18} style={{ cursor: 'pointer' }} onClick={handleDismiss} />
         </div>
      )}
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
          <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <button className="btn-blue" onClick={handleScrape} disabled={isLoading}>
                {isLoading && <Loader2 size={16} className="animate-spin" />}
                {isLoading ? 'Scraping...' : 'Scrape Leads'}
              </button>
              {isLoading && <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '4px' }}>Scraping leads... ~15s</div>}
            </div>
            <button 
              className="btn-demo"
              onClick={handleExportCSV}
              disabled={!results || results.length === 0}
              title="Export leads to CSV"
            >
              <Download size={16} /> Export CSV
            </button>
          </div>
        </div>
        <ScraperLeadsTable leads={results} loading={false} />
      </div>
    </div>
  );
};

export default LinkedInScraper;
