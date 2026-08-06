import React, { useState } from 'react';
import TopBar from '../components/TopBar';
import { 
  HelpCircle, ChevronDown, ChevronUp, Zap, Sparkles, 
  Target, Mail, Share2, Clapperboard, MessageSquare, 
  ShieldCheck, Download, ExternalLink, CheckCircle2
} from 'lucide-react';
import { useToast } from '../hooks/useToast';

const HackathonFaq = () => {
  const { showToast } = useToast();
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: "What is LeadFlow AI by Cognify AI?",
      a: "LeadFlow AI is an end-to-end B2B Client Acquisition & Content Intelligence Platform built by Ganesh (Cognify AI, Hyderabad). It empowers AI agency owners, developers, and solopreneurs to scrape verified leads from LinkedIn & Instagram, write stalker-level cold emails, generate viral 1%-CTR thumbnails, analyze competitor reel strategies, and automate LinkedIn post publishing."
    },
    {
      q: "How does real-time location-specific lead scraping work?",
      a: "Using frontend-orchestrated Apify scrapers, LeadFlow AI queries public Google indexing and profile data using targeted keywords (e.g. 'site:linkedin.com/in \"Dental Clinic\" \"Hyderabad\"'). It retrieves verified decision-maker names, roles, company domains, location details, and corporate email addresses in real time."
    },
    {
      q: "What makes the Cold Email Writer 'stalker-level' personalized?",
      a: "Our cold email generator strictly enforces a high-converting cold outreach framework: under 100 words, no 'My name is...' intro, mysterious subject lines, personalized icebreakers observing the prospect's exact role, company, location, or bio, ending with the bridge phrase 'Figured I'd reach out.', offering a done-for-you custom AI agent, and a low-friction single question CTA."
    },
    {
      q: "How does the Content & Thumbnail Studio generate 1%-CTR thumbnails?",
      a: "The Content Studio takes a video topic (e.g. 'How I build $5K AI agents') and available branding assets, then uses AI to generate 20 high-CTR thumbnail specs: Headline Text Overlay with highlighted Accent Words, Visual Composition, Facial Expressions, Industry Giant Logos, and Contrast Environment/VFX guides."
    },
    {
      q: "How does the Reels Intelligence analyzer work?",
      a: "Enter any Instagram handle (e.g. @kavyaeventshyd or @cognify_ai). LeadFlow AI uses Apify to scrape indexed Instagram posts/reels for that account, then passes the real captions to OpenRouter AI to extract scroll-stopping Hooks, Call to Actions (CTAs), strategy summaries, and hashtag clusters."
    },
    {
      q: "What AI models are supported and how does multi-model fallback work?",
      a: "LeadFlow AI is connected to OpenRouter API supporting top models (Mistral 7B, Llama 3.1 8B, Gemma 2 9B, Claude). If an OpenRouter endpoint is offline or experiences rate limits, LeadFlow AI automatically rotates models and falls back to a smart local context engine."
    },
    {
      q: "Is user API token data secure?",
      a: "Yes! All API keys (Apify & OpenRouter) are stored exclusively in your local browser storage (localStorage). Zero server logging is conducted, keeping your API credits and data 100% private."
    },
    {
      q: "Can I export leads and content strategy reports?",
      a: "Yes! All scraped leads can be exported as `.csv` spreadsheets with 1 click. Social media strategy reports from the Content Studio can be exported as downloadable Markdown `.md` reports."
    }
  ];

  const tracks = [
    { title: "Track 1: Real-Time B2B Lead Discovery", icon: Target, desc: "Location-specific search across LinkedIn & Instagram profiles with corporate email generation." },
    { title: "Track 2: Stalker AI Cold Outreach", icon: Mail, desc: "Hyper-personalized cold email copywriting with 1-click Direct Gmail Web Composer integration." },
    { title: "Track 3: Content & Thumbnail Studio", icon: Clapperboard, desc: "1%-CTR Thumbnail Generator, Reels Intelligence Scraper, and Viral Script Engine." },
    { title: "Track 4: RAG Knowledge Assistant", icon: MessageSquare, desc: "Document knowledge base vector context injection with multi-model fallback." }
  ];

  const toggleFaq = (idx) => {
    setOpenIndex(openIndex === idx ? -1 : idx);
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <TopBar 
        title="Hackathon Hub & FAQ" 
        subtitle="Complete platform documentation, challenge tracks alignment, and frequently asked questions" 
        badge="Aurora '26 Aligned" 
      />

      <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '32px', flex: 1 }}>
        
        {/* HERO BANNER */}
        <div className="card" style={{ background: 'linear-gradient(135deg, #0B0F19 0%, #151D2A 100%)', color: 'white', border: '1px solid rgba(99,102,241,0.3)', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(99,102,241,0.2)', color: '#818CF8', padding: '4px 12px', borderRadius: '12px', fontSize: '11px', fontWeight: 700, fontFamily: 'var(--font-mono)', marginBottom: '12px' }}>
                <Zap size={14} /> COGNIFY AI • HYDERABAD
              </div>
              <h2 style={{ margin: 0, fontSize: '28px', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'white' }}>
                LeadFlow AI — <span className="text-gradient-indigo">AI for B2B Client Acquisition</span>
              </h2>
              <p style={{ margin: '8px 0 0', color: '#94A3B8', fontSize: '14.5px', maxWidth: '680px', lineHeight: 1.6 }}>
                Built for AI agency owners, developers, and solopreneurs selling AI automations, chatbots, and agents to business clients.
              </p>
            </div>
            <button className="btn-blue" onClick={() => { showToast('60-Second Auto Demo Mode triggered on Dashboard!', 'success'); window.location.href = '/dashboard'; }}>
              <Sparkles size={16} /> Run 60s Live Pitch Demo
            </button>
          </div>
        </div>

        {/* 4 CHALLENGE TRACKS ALIGNMENT */}
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '16px', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={20} color="#6366F1" /> Platform Modules & Challenge Tracks
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            {tracks.map((t, idx) => (
              <div key={idx} className="card" style={{ borderTop: '4px solid var(--indigo)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: 'rgba(99,102,241,0.1)', color: '#6366F1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <t.icon size={20} />
                </div>
                <h4 style={{ margin: 0, fontSize: '15px', color: '#0F172A' }}>{t.title}</h4>
                <p style={{ margin: 0, fontSize: '13px', color: '#64748B', lineHeight: 1.5 }}>{t.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ ACCORDION SECTION */}
        <div>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#6366F1', letterSpacing: '1.2px', textTransform: 'uppercase', marginBottom: '4px', fontFamily: 'var(--font-mono)' }}>
              COMMON QUESTIONS
            </div>
            <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Got <span className="text-gradient-indigo">Questions?</span>
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '840px', margin: '0 auto' }}>
            {faqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div 
                  key={idx} 
                  className="card"
                  style={{ 
                    padding: '0', 
                    overflow: 'hidden', 
                    borderColor: isOpen ? '#818CF8' : 'var(--border)',
                    boxShadow: isOpen ? '0 8px 24px -4px rgba(99,102,241,0.12)' : 'var(--glow-card)',
                    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                >
                  <button 
                    onClick={() => toggleFaq(idx)}
                    style={{
                      width: '100%',
                      padding: '18px 24px',
                      background: isOpen ? 'linear-gradient(90deg, #F8FAFC 0%, #EEF2FF 100%)' : 'white',
                      border: 'none',
                      display: 'flex',
                      justify: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontFamily: 'var(--font-display)',
                      fontSize: '15px',
                      fontWeight: 700,
                      color: isOpen ? '#4F46E5' : '#0F172A',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <HelpCircle size={18} color={isOpen ? '#6366F1' : '#94A3B8'} />
                      {faq.q}
                    </span>
                    {isOpen ? <ChevronUp size={18} color="#6366F1" /> : <ChevronDown size={18} color="#94A3B8" />}
                  </button>

                  {isOpen && (
                    <div style={{ padding: '0 24px 20px', color: '#475569', fontSize: '14px', lineHeight: 1.65, borderTop: '1px solid #EEF2FF', backgroundColor: 'white' }}>
                      <div style={{ paddingTop: '16px' }}>
                        {faq.a}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};

export default HackathonFaq;
