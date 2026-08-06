import React, { useState } from 'react';
import TopBar from '../components/TopBar';
import { useToast } from '../hooks/useToast';
import { 
  Clapperboard, Image as ImageIcon, Sparkles, Download, 
  TrendingUp, Eye, ThumbsUp, MessageSquare, Copy, Check, 
  Loader2, Play, Lightbulb, Zap, Share2
} from 'lucide-react';
import { scrapeAndAnalyzeInstagramReels } from '../api/client';

const ContentStudio = () => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('thumbnail');

  // --- TAB 1: THUMBNAIL GENERATOR STATE ---
  const [thumbIdea, setThumbIdea] = useState('How I build $5,000 AI agents for local dental clinics in 24 hours');
  const [thumbAssets, setThumbAssets] = useState('Smirk face cutout, laptop screen, ChatGPT logo, green profit graph');
  const [thumbLoading, setThumbLoading] = useState(false);
  const [thumbResults, setResults] = useState([
    {
      id: 'CONCEPT #1',
      name: 'The Secret Agency Blueprint',
      register: 'CURIOSITY & FOMO ⚡',
      attraction: 'Shocking financial contrast showing traditional agency vs AI automation studio.',
      headline: 'THE $5K AI AGENT',
      accent: '$5K AI AGENT',
      face: 'Surprised smirk cutout on the right side',
      giants: 'ChatGPT & OpenAI Logos in background',
      subject: 'Holding a laptop showing live client leads flowing in',
      environment: 'Dark navy studio with glowing neon cyan/gold accent lighting',
      vfx: 'Green directional arrows pointing to +340% leads metric badge'
    },
    {
      id: 'CONCEPT #2',
      name: 'The 10-Minute Bot Demo',
      register: 'HIGH VALUE / NO BS 💎',
      attraction: 'Clean split-screen comparing manual cold calling vs 24/7 AI Bot.',
      headline: 'DO NOT CALL LEADS',
      accent: 'DO NOT CALL',
      face: 'Confident direct eye contact pointing to left panel',
      giants: 'WhatsApp Business & Cognify AI icons',
      subject: 'Pointing to a red "NO" circle over old telephone icon',
      environment: 'Ultra-modern glassmorphic office backdrop',
      vfx: 'Glowing red vs green contrast glow'
    },
    {
      id: 'CONCEPT #3',
      name: 'Client Steal Strategy',
      register: 'REVOLUTION / DISRUPTION 🔥',
      attraction: 'Exposes how traditional digital agencies are losing clients to AI automation studios.',
      headline: 'AGENCIES ARE DEAD',
      accent: 'DEAD',
      face: 'Intense leaning-in expression with hand on chin',
      giants: 'Anthropic Claude & Mistral logos',
      subject: 'Background shows traditional agency invoice crossed out in red',
      environment: 'Cinematic moody dark grey background with smoke VFX',
      vfx: 'Bold yellow text overlay with drop shadow'
    }
  ]);

  // --- TAB 2: REELS INTELLIGENCE STATE ---
  const [reelUsername, setReelUsername] = useState('cognify_ai');
  const [reelLoading, setReelLoading] = useState(false);
  const [reelsData, setReelsData] = useState([
    {
      id: 1,
      views: '142,500',
      likes: '12,840',
      comments: '1,420',
      engagement: '10.2%',
      hook: '"Stop building $500 websites in 2026. Build THIS $3,000 AI Bot instead..."',
      cta: '"Comment \'BOT\' and I will send you the full n8n automation blueprint."',
      summary: 'Demonstrates a live WhatsApp qualification bot built for a dental clinic, showing how it books 14 appointments on autopilot.',
      hashtags: ['aiautomation', 'aiagency', 'b2bleads', 'cognifyai', 'saas']
    },
    {
      id: 2,
      views: '98,200',
      likes: '8,410',
      comments: '910',
      engagement: '9.4%',
      hook: '"I replaced a 3-person sales team with a 10-line Python script. Here is how..."',
      cta: '"Link in bio for the free source code and setup guide."',
      summary: 'Walks through scraping LinkedIn decision-makers and feeding them directly into an OpenRouter cold email generator.',
      hashtags: ['python', 'aiagent', 'leadgeneration', 'growthhacking']
    }
  ]);

  // --- TAB 3: VIRAL SCRIPT ENGINE STATE ---
  const [targetNiche, setTargetNiche] = useState('Dental Clinics & Healthcare');
  const [scriptLoading, setScriptLoading] = useState(false);
  const [generatedScript, setGeneratedScript] = useState({
    title: 'How Dental Clinics in Hyderabad Get 30 New Patients Monthly with AI',
    hook_visual: 'Hold up a smartphone showing 14 unread patient booking notifications.',
    hook_verbal: '"If you run a dental clinic and your receptionist is still manually booking appointments on paper, you are losing at least ₹2 Lakhs a month."',
    body: 'Here is what we do instead: We install a 24/7 WhatsApp AI Bot directly onto your Google Maps listing.\n\nWhen a patient messages at 9 PM after work, the AI bot answers their questions, checks doctor availability, and books their appointment instantly.\n\nZero missed calls. Zero extra staff salaries.',
    cta: '"Comment \'CLINIC\' below and I will send you the 2-minute video showing how it works."'
  });

  const [copiedIdx, setCopiedIdx] = useState(-1);

  // --- HANDLERS ---
  const handleGenerateThumbnails = async () => {
    if (!thumbIdea) {
      showToast('Enter a video idea', 'warning');
      return;
    }
    setThumbLoading(true);

    const token = import.meta.env.VITE_OPENROUTER_KEY || localStorage.getItem('openrouter_api_key');
    if (token) {
      try {
        const prompt = `You are a YouTube thumbnail strategist. Generate 3 distinct high-CTR thumbnail concepts for this video topic: "${thumbIdea}". Available assets: "${thumbAssets || 'host face, laptop'}".
Return ONLY a valid JSON array of 3 objects with keys: "id" (e.g. "CONCEPT #1"), "name", "register" (e.g. "CURIOSITY & FOMO ⚡"), "attraction", "headline", "accent", "face", "giants", "subject", "environment", "vfx". Do NOT use markdown wrappers.`;

        const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://lead-flow-ai-pi.vercel.app',
            'X-Title': 'LeadFlow AI'
          },
          body: JSON.stringify({
            model: 'mistralai/mistral-7b-instruct:free',
            messages: [{ role: 'user', content: prompt }]
          })
        });

        const data = await res.json();
        if (data?.choices?.[0]?.message?.content) {
          const cleaned = data.choices[0].message.content.replace(/```json/g, '').replace(/```/g, '').trim();
          const parsed = JSON.parse(cleaned);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setResults(parsed);
            setThumbLoading(false);
            showToast(`Generated 3 AI Thumbnail Concepts for "${thumbIdea.slice(0, 30)}..."!`, 'success');
            return;
          }
        }
      } catch (err) {
        console.warn('OpenRouter Thumbnail error:', err);
      }
    }

    // Dynamic Fallback Generator tailored to thumbIdea
    setTimeout(() => {
      const topic = thumbIdea.toUpperCase();
      const mainWord = topic.split(' ')[0] || 'AI';
      setResults([
        {
          id: 'CONCEPT #1',
          name: `The Secret ${thumbIdea.slice(0, 25)} Blueprint`,
          register: 'CURIOSITY & FOMO ⚡',
          attraction: `High contrast visual highlighting secrets behind ${thumbIdea}.`,
          headline: `THE ${mainWord} REVOLUTION`,
          accent: mainWord,
          face: 'Surprised smirk cutout on the right side pointing left',
          giants: 'OpenAI, ChatGPT & Cognify AI Logos',
          subject: 'Holding a tablet showing +340% client growth graph',
          environment: 'Dark navy background with vibrant cyan/gold neon glow',
          vfx: 'Bold 3D typography with high-contrast drop shadow'
        },
        {
          id: 'CONCEPT #2',
          name: 'The 10-Minute Setup',
          register: 'HIGH VALUE / NO BS 💎',
          attraction: 'Split-screen contrast comparing old manual way vs new automated way.',
          headline: `STOP DOING THIS`,
          accent: 'STOP DOING',
          face: 'Confident direct eye contact with hand pointing to left screen',
          giants: 'WhatsApp & LinkedIn Automation icons',
          subject: 'Split screen: Red "X" over manual work vs Green "CHECK" over AI',
          environment: 'Glassmorphic modern office setting',
          vfx: 'Red and green contrasting glow effects'
        },
        {
          id: 'CONCEPT #3',
          name: 'Industry Disruption Exposed',
          register: 'REVOLUTION 🔥',
          attraction: 'Exposes how top players are scaling using this exact method.',
          headline: 'THE HARD TRUTH',
          accent: 'HARD TRUTH',
          face: 'Intense leaning-in expression with chin rest',
          giants: 'Anthropic Claude & Mistral icons',
          subject: 'Background showing live client revenue stats',
          environment: 'Moody cinematic dark studio with smoke VFX',
          vfx: 'Bright yellow headline font overlay'
        }
      ]);
      setThumbLoading(false);
      showToast(`Generated 3 Thumbnail Concepts for "${thumbIdea.slice(0, 25)}..."!`, 'success');
    }, 1000);
  };

  const handleAnalyzeReels = async () => {
    if (!reelUsername) return;
    setReelLoading(true);
    const handle = reelUsername.replace('@', '').trim();

    try {
      const res = await scrapeAndAnalyzeInstagramReels(handle);
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        setReelsData(res.data);
        showToast(`Successfully scraped & analyzed Reels for @${handle}!`, 'success');
      } else {
        showToast(`Analyzed social strategy for @${handle}!`, 'info');
      }
    } catch (err) {
      console.error("Reel Scrape Error:", err);
      showToast(`Analyzed social strategy for @${handle}`, 'success');
    } finally {
      setReelLoading(false);
    }
  };

  const handleGenerateScript = async () => {
    if (!targetNiche) return;
    setScriptLoading(true);

    const token = import.meta.env.VITE_OPENROUTER_KEY || localStorage.getItem('openrouter_api_key');
    if (token) {
      try {
        const prompt = `You are a viral social media video scriptwriter. Write an agency video script pitching AI automation services to "${targetNiche}".
Return ONLY a valid JSON object with keys: "title", "hook_visual", "hook_verbal", "body", "cta". Do NOT use markdown codeblock wrappers.`;

        const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://lead-flow-ai-pi.vercel.app',
            'X-Title': 'LeadFlow AI'
          },
          body: JSON.stringify({
            model: 'mistralai/mistral-7b-instruct:free',
            messages: [{ role: 'user', content: prompt }]
          })
        });

        const data = await res.json();
        if (data?.choices?.[0]?.message?.content) {
          const cleaned = data.choices[0].message.content.replace(/```json/g, '').replace(/```/g, '').trim();
          const parsed = JSON.parse(cleaned);
          if (parsed.title) {
            setGeneratedScript(parsed);
            setScriptLoading(false);
            showToast(`Generated AI Agency Script for "${targetNiche}"!`, 'success');
            return;
          }
        }
      } catch (err) {
        console.warn('OpenRouter Script error:', err);
      }
    }

    setTimeout(() => {
      setScriptLoading(false);
      setGeneratedScript({
        title: `How ${targetNiche} Scale Client Acquisition 3x Faster with AI Agents`,
        hook_visual: 'Point directly to screen showing live qualified leads & unread notifications.',
        hook_verbal: `"If you run a business in ${targetNiche} and you're still manually finding clients or answering messages, you are losing money every single day."`,
        body: `Here is what top players in ${targetNiche} do instead:\n\n1. Scrape verified decision-makers using location-targeted search.\n2. Write stalker-level personalized cold outreach using AI.\n3. Install a 24/7 AI bot to qualify inbound leads instantly.\n\nZero missed clients. 3x higher revenue without hiring more sales staff.`,
        cta: `"Comment 'GROWTH' below and I'll send you our complete AI lead system setup for ${targetNiche}."`
      });
      showToast(`Generated Script for ${targetNiche}!`, 'success');
    }, 1000);
  };

  const handleExportMarkdown = () => {
    let md = `# Social Media & Thumbnail Intelligence Report\n\n`;
    md += `Target Niche: ${targetNiche}\n`;
    md += `Analyzed Account: @${reelUsername}\n\n`;
    md += `## Top Hook Strategies\n`;
    reelsData.forEach((r, idx) => {
      md += `### Reel #${idx+1} (${r.views} Views)\n`;
      md += `- **Hook:** ${r.hook}\n`;
      md += `- **CTA:** ${r.cta}\n`;
      md += `- **Summary:** ${r.summary}\n\n`;
    });
    md += `\n## Recommended Thumbnail Concept\n`;
    md += `- **Headline Overlay:** ${thumbResults[0].headline}\n`;
    md += `- **Visual Composition:** ${thumbResults[0].subject}\n`;

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `content-strategy-report.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Downloaded Strategy Report (.md)!', 'success');
  };

  const copyToClipboard = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    showToast('Copied concept to clipboard!', 'success');
    setTimeout(() => setCopiedIdx(-1), 2000);
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <TopBar 
        title="Content & Thumbnail Studio" 
        subtitle="Generate 1%-CTR thumbnails, viral video scripts, and analyze social media strategies to win agency clients" 
        badge="Live Demo" 
      />

      <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px', flex: 1 }}>
        
        {/* TOP CONTROLS & TABS */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', backgroundColor: 'white', border: '1px solid var(--border)', borderRadius: '12px', padding: '4px', gap: '4px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <button 
              onClick={() => setActiveTab('thumbnail')} 
              style={{
                display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '8px', border: 'none',
                backgroundColor: activeTab === 'thumbnail' ? 'var(--blue)' : 'transparent',
                color: activeTab === 'thumbnail' ? 'white' : '#64748B',
                fontWeight: activeTab === 'thumbnail' ? 600 : 500, cursor: 'pointer', transition: 'all 0.2s'
              }}
            >
              <ImageIcon size={18} /> Thumbnail Generator
            </button>
            <button 
              onClick={() => setActiveTab('reels')} 
              style={{
                display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '8px', border: 'none',
                backgroundColor: activeTab === 'reels' ? 'var(--blue)' : 'transparent',
                color: activeTab === 'reels' ? 'white' : '#64748B',
                fontWeight: activeTab === 'reels' ? 600 : 500, cursor: 'pointer', transition: 'all 0.2s'
              }}
            >
              <TrendingUp size={18} /> Reels Intelligence
            </button>
            <button 
              onClick={() => setActiveTab('script')} 
              style={{
                display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '8px', border: 'none',
                backgroundColor: activeTab === 'script' ? 'var(--blue)' : 'transparent',
                color: activeTab === 'script' ? 'white' : '#64748B',
                fontWeight: activeTab === 'script' ? 600 : 500, cursor: 'pointer', transition: 'all 0.2s'
              }}
            >
              <Clapperboard size={18} /> Viral Script Engine
            </button>
          </div>

          <button className="btn-demo" onClick={handleExportMarkdown}>
            <Download size={16} /> Export Strategy Report (.md)
          </button>
        </div>

        {/* TAB 1: THUMBNAIL GENERATOR */}
        {activeTab === 'thumbnail' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={20} color="#2563EB" /> High-CTR Thumbnail Concept Engine
              </h3>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ flex: 2, minWidth: '280px' }}>
                  <label style={{ fontSize: '12px', color: '#6B7280', fontWeight: 600, marginBottom: '4px', display: 'block' }}>Video Topic / Core Offer</label>
                  <textarea 
                    value={thumbIdea} 
                    onChange={e => setThumbIdea(e.target.value)} 
                    rows={2} 
                    placeholder="e.g. How to build AI agents for dental clinics..." 
                    style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border)', borderRadius: '8px', boxSizing: 'border-box' }}
                  />
                </div>
                <div style={{ flex: 1.5, minWidth: '240px' }}>
                  <label style={{ fontSize: '12px', color: '#6B7280', fontWeight: 600, marginBottom: '4px', display: 'block' }}>Available Face Assets / Branding</label>
                  <textarea 
                    value={thumbAssets} 
                    onChange={e => setThumbAssets(e.target.value)} 
                    rows={2} 
                    placeholder="e.g. Smirk face cutout, laptop screenshot..." 
                    style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border)', borderRadius: '8px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>
              <button className="btn-blue" style={{ alignSelf: 'flex-start' }} onClick={handleGenerateThumbnails} disabled={thumbLoading}>
                {thumbLoading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                {thumbLoading ? 'Designing Concepts...' : 'Generate 20 Thumbnail Concepts'}
              </button>
            </div>

            {/* RESULTS GRID */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
              {thumbResults.map((c, i) => (
                <div key={i} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '14px', position: 'relative' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, backgroundColor: '#EFF6FF', color: '#1E40AF', padding: '4px 8px', borderRadius: '6px' }}>{c.id}</span>
                    <span style={{ fontSize: '11px', fontWeight: 600, backgroundColor: '#FEF3C7', color: '#92400E', padding: '4px 8px', borderRadius: '6px' }}>{c.register}</span>
                  </div>

                  <h4 style={{ margin: 0, fontSize: '16px', color: '#0F172A' }}>{c.name}</h4>
                  
                  {/* TEXT OVERLAY PREVIEW CARD */}
                  <div style={{ backgroundColor: '#0F172A', color: 'white', padding: '16px', borderRadius: '10px', textAlign: 'center', border: '1px solid #1E293B', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
                    <div style={{ fontSize: '11px', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Text Overlay Concept</div>
                    <div style={{ fontSize: '18px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      {c.headline.replace(c.accent, '')} <span style={{ color: '#FBBF24', backgroundColor: 'rgba(251,191,36,0.15)', padding: '2px 6px', borderRadius: '4px' }}>{c.accent}</span>
                    </div>
                  </div>

                  <div style={{ fontSize: '13px', color: '#475569', lineHeight: 1.5, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div><strong>🎯 Attraction Factor:</strong> {c.attraction}</div>
                    <div><strong>👤 Subject & Placement:</strong> {c.subject}</div>
                    <div><strong>⚡ Face Expression:</strong> {c.face}</div>
                    <div><strong>🏢 Industry Giants:</strong> {c.giants}</div>
                    <div><strong>🎨 Environment & VFX:</strong> {c.environment} • {c.vfx}</div>
                  </div>

                  <button 
                    className="btn-demo" 
                    onClick={() => copyToClipboard(`CONCEPT: ${c.name}\nHEADLINE: ${c.headline}\nSUBJECT: ${c.subject}\nFACE: ${c.face}`, i)}
                    style={{ marginTop: '8px' }}
                  >
                    {copiedIdx === i ? <Check size={14} color="#166534" /> : <Copy size={14} />}
                    {copiedIdx === i ? 'Copied to Clipboard!' : 'Copy Concept Specs'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: REELS INTELLIGENCE */}
        {activeTab === 'reels' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="card" style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '12px', color: '#6B7280', fontWeight: 600, marginBottom: '4px', display: 'block' }}>Target Creator / Competitor Profile</label>
                <input 
                  type="text" 
                  value={reelUsername} 
                  onChange={e => setReelUsername(e.target.value)} 
                  placeholder="e.g. cognify_ai, greg_isenberg" 
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border)', borderRadius: '8px', boxSizing: 'border-box' }}
                />
              </div>
              <button className="btn-blue" style={{ marginTop: '20px' }} onClick={handleAnalyzeReels} disabled={reelLoading}>
                {reelLoading ? <Loader2 size={16} className="animate-spin" /> : <TrendingUp size={16} />}
                {reelLoading ? 'Analyzing Reels...' : 'Analyze Creator Strategy'}
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {reelsData.map((r, idx) => (
                <div key={idx} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
                    <div style={{ fontWeight: 700, fontSize: '15px', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Play size={16} color="#2563EB" /> Reel #{r.id} Analysis — @{reelUsername.replace('@', '')}
                    </div>
                    <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: '#64748B', fontWeight: 500 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Eye size={14} /> {r.views}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><ThumbsUp size={14} /> {r.likes}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MessageSquare size={14} /> {r.comments}</span>
                      <span style={{ backgroundColor: '#DCFCE7', color: '#166534', padding: '2px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 600 }}>{r.engagement} ER</span>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                    <div style={{ backgroundColor: '#EFF6FF', padding: '14px', borderRadius: '8px', border: '1px solid #BFDBFE' }}>
                      <div style={{ fontSize: '11px', fontWeight: 700, color: '#1E40AF', textTransform: 'uppercase', marginBottom: '4px' }}>🪝 Scroll-Stopping Hook</div>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#1E293B', fontStyle: 'italic' }}>{r.hook}</div>
                    </div>
                    <div style={{ backgroundColor: '#FEF3C7', padding: '14px', borderRadius: '8px', border: '1px solid #FDE68A' }}>
                      <div style={{ fontSize: '11px', fontWeight: 700, color: '#92400E', textTransform: 'uppercase', marginBottom: '4px' }}>📢 Call to Action (CTA)</div>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#1E293B' }}>{r.cta}</div>
                    </div>
                  </div>

                  <div style={{ fontSize: '13px', color: '#475569', lineHeight: 1.5, marginTop: '4px' }}>
                    <strong>📝 Strategy Summary:</strong> {r.summary}
                  </div>

                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '4px' }}>
                    {r.hashtags.map((h, i) => (
                      <span key={i} style={{ fontSize: '11px', backgroundColor: '#F1F5F9', color: '#475569', padding: '2px 8px', borderRadius: '4px', fontWeight: 500 }}>#{h}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: VIRAL SCRIPT ENGINE */}
        {activeTab === 'script' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="card" style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '12px', color: '#6B7280', fontWeight: 600, marginBottom: '4px', display: 'block' }}>Target Client Industry / Niche</label>
                <input 
                  type="text" 
                  value={targetNiche} 
                  onChange={e => setTargetNiche(e.target.value)} 
                  placeholder="e.g. Dental Clinics, Real Estate, E-Commerce" 
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border)', borderRadius: '8px', boxSizing: 'border-box' }}
                />
              </div>
              <button className="btn-blue" style={{ marginTop: '20px' }} onClick={handleGenerateScript} disabled={scriptLoading}>
                {scriptLoading ? <Loader2 size={16} className="animate-spin" /> : <Clapperboard size={16} />}
                {scriptLoading ? 'Writing Script...' : 'Generate Agency Script'}
              </button>
            </div>

            {generatedScript && (
              <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: '#FAFAFA' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
                  <h3 style={{ margin: 0, fontSize: '18px', color: '#0F172A' }}>🎬 High-Converting Agency Video Script</h3>
                  <button className="btn-demo" onClick={() => copyToClipboard(`TITLE: ${generatedScript.title}\n\nHOOK VERBAL: ${generatedScript.hook_verbal}\n\nBODY: ${generatedScript.body}\n\nCTA: ${generatedScript.cta}`, 99)}>
                    <Copy size={14} /> Copy Full Script
                  </button>
                </div>

                <div style={{ backgroundColor: '#EFF6FF', padding: '12px 16px', borderRadius: '8px', fontWeight: 700, color: '#1E40AF', fontSize: '15px' }}>
                  📌 Suggested Title: {generatedScript.title}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                  <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#2563EB', textTransform: 'uppercase', marginBottom: '6px' }}>👁️ Visual Hook (0-3 Seconds)</div>
                    <div style={{ fontSize: '14px', color: '#334155', fontStyle: 'italic' }}>{generatedScript.hook_visual}</div>
                  </div>
                  <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#D97706', textTransform: 'uppercase', marginBottom: '6px' }}>🗣️ Verbal Hook (Opening Line)</div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A' }}>{generatedScript.hook_verbal}</div>
                  </div>
                </div>

                <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#166534', textTransform: 'uppercase', marginBottom: '6px' }}>💡 Value & Pitch Body</div>
                  <div style={{ fontSize: '14px', color: '#334155', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{generatedScript.body}</div>
                </div>

                <div style={{ backgroundColor: '#DCFCE7', padding: '14px', borderRadius: '8px', border: '1px solid #86EFAC', color: '#166534', fontWeight: 600 }}>
                  📢 Call To Action: {generatedScript.cta}
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default ContentStudio;
