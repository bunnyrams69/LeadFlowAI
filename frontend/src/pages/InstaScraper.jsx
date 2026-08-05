import React, { useState, useContext, useEffect } from 'react';
import TopBar from '../components/TopBar';
import LeadsTable from '../components/LeadsTable';
import { scrapeInstagram } from '../api/client';
import { AppContext } from '../context/AppContext';
import { useToast } from '../hooks/useToast';
import { Loader2, X } from 'lucide-react';

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
        <LeadsTable leads={results} loading={false} />
      </div>
    </div>
  );
};

export default InstaScraper;
