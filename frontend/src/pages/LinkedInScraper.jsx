import React, { useState, useContext, useEffect } from 'react';
import TopBar from '../components/TopBar';
import LeadsTable from '../components/LeadsTable';
import { scrapeLinkedIn } from '../api/client';
import { AppContext } from '../context/AppContext';
import { useToast } from '../hooks/useToast';
import { Loader2, X } from 'lucide-react';

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
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <button className="btn-blue" onClick={handleScrape} disabled={isLoading}>
              {isLoading && <Loader2 size={16} className="animate-spin" />}
              {isLoading ? 'Scraping...' : 'Scrape Leads'}
            </button>
            {isLoading && <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '4px' }}>Scraping leads... ~15s</div>}
          </div>
        </div>
        <LeadsTable leads={results} loading={false} />
      </div>
    </div>
  );
};

export default LinkedInScraper;
