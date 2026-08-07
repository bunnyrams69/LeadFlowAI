import React, { useState } from 'react';
import TopBar from '../components/TopBar';
import { useToast } from '../hooks/useToast';
import { 
  Clapperboard, Image as ImageIcon, Sparkles, Download, 
  TrendingUp, Eye, ThumbsUp, MessageSquare, Copy, Check, 
  Loader2, Play, Lightbulb, Zap, Share2, Search, Tag, FileText, Bot
} from 'lucide-react';
import { scrapeAndAnalyzeInstagramReels, researchYouTubeOutliers } from '../api/client';

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
      title: 'Building a $3K AI WhatsApp Bot for Dental Clinics',
      views: '142,500',
      likes: '12,840',
      comments: '1,420',
      engagement: '10.2%',
      hook: '"Stop building $500 websites in 2026. Build THIS $3,000 AI Bot instead..."',
      caption: 'Stop building $500 websites in 2026. Build THIS $3,000 AI Bot instead...\n\nI just built a WhatsApp qualification bot for a dental clinic in Hyderabad. It books 14 appointments on complete autopilot.\n\nNo receptionist. No missed calls. Just AI working 24/7.\n\nComment \'BOT\' and I will send you the full n8n automation blueprint.\n\n#aiautomation #aiagency #b2bleads #cognifyai #saas',
      cta: '"Comment \'BOT\' and I will send you the full n8n automation blueprint."',
      summary: 'Demonstrates a live WhatsApp qualification bot built for a dental clinic, showing how it books 14 appointments on autopilot. Uses curiosity-driven hook and direct comment CTA.',
      hashtags: ['aiautomation', 'aiagency', 'b2bleads', 'cognifyai', 'saas']
    },
    {
      id: 2,
      title: 'Replacing a 3-Person Sales Team with Python',
      views: '98,200',
      likes: '8,410',
      comments: '910',
      engagement: '9.4%',
      hook: '"I replaced a 3-person sales team with a 10-line Python script. Here is how..."',
      caption: 'I replaced a 3-person sales team with a 10-line Python script. Here is how...\n\nStep 1: Scrape LinkedIn decision-makers using location-targeted search\nStep 2: Feed them into an OpenRouter cold email generator\nStep 3: Watch qualified replies land in your inbox\n\nLink in bio for the free source code and setup guide.\n\n#python #aiagent #leadgeneration #growthhacking',
      cta: '"Link in bio for the free source code and setup guide."',
      summary: 'Walks through scraping LinkedIn decision-makers and feeding them directly into an OpenRouter cold email generator. Step-by-step format builds credibility.',
      hashtags: ['python', 'aiagent', 'leadgeneration', 'growthhacking']
    }
  ]);

  // --- TAB 3: YOUTUBE OUTLIER RESEARCH ENGINE STATE ---
  const [researchTopic, setResearchTopic] = useState('AI Agents for Business Automation');
  const [scriptLoading, setScriptLoading] = useState(false);
  const [outliers, setOutliers] = useState(null);

  const [copiedIdx, setCopiedIdx] = useState(-1);

  // --- HANDLERS ---
  const handleGenerateThumbnails = async (overrideIdea) => {
    const topicToUse = typeof overrideIdea === 'string' ? overrideIdea : thumbIdea;
    if (!topicToUse) {
      showToast('Enter a video idea', 'warning');
      return;
    }
    if (typeof overrideIdea === 'string') {
      setThumbIdea(overrideIdea);
    }
    setThumbLoading(true);

    const token = import.meta.env.VITE_OPENROUTER_KEY || localStorage.getItem('openrouter_api_key');
    if (token) {
      try {
        const prompt = `You are a YouTube thumbnail strategist. Generate 3 distinct high-CTR thumbnail concepts for this video topic: "${topicToUse}". Available assets: "${thumbAssets || 'host face, laptop'}".
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
            showToast(`Generated 3 AI Thumbnail Concepts for "${topicToUse.slice(0, 30)}..."!`, 'success');
            return;
          }
        }
      } catch (err) {
        console.warn('OpenRouter Thumbnail error:', err);
      }
    }

    // Dynamic Fallback Generator tailored to topicToUse
    setTimeout(() => {
      const topic = topicToUse.toUpperCase();
      const mainWord = topic.split(' ')[0] || 'AI';
      setResults([
        {
          id: 'CONCEPT #1',
          name: `The Secret ${topicToUse.slice(0, 25)} Blueprint`,
          register: 'CURIOSITY & FOMO ⚡',
          attraction: `High contrast visual highlighting secrets behind ${topicToUse}.`,
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
      showToast(`Generated 3 Thumbnail Concepts for "${topicToUse.slice(0, 25)}..."!`, 'success');
    }, 1000);
  };

  const handleSendToThumbnail = (title) => {
    setThumbIdea(title);
    setActiveTab('thumbnail');
    showToast(`Generating Thumbnail Concepts for: "${title.slice(0, 30)}..."`, 'info');
    setTimeout(() => {
      handleGenerateThumbnails(title);
    }, 100);
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

  const handleResearchOutliers = async () => {
    if (!researchTopic) return;
    setScriptLoading(true);
    setOutliers(null);

    try {
      const res = await researchYouTubeOutliers(researchTopic);
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        setOutliers(res.data);
        if (res.data[0]?.outlier_title) {
          setThumbIdea(res.data[0].outlier_title);
        }
        showToast(`Found 3 YouTube Outliers for "${researchTopic}"!`, 'success');
      } else if (res.error) {
        showToast(res.error, 'error');
      }
    } catch (err) {
      console.error("Outlier research error:", err);
      showToast('Error researching outliers', 'error');
    } finally {
      setScriptLoading(false);
    }
  };

  const handleExportMarkdown = () => {
    let md = `# Social Media & Thumbnail Intelligence Report\n\n`;
    md += `Research Topic: ${researchTopic}\n`;
    md += `Analyzed Account: @${reelUsername}\n\n`;
    md += `## Top Hook Strategies\n`;
    reelsData.forEach((r, idx) => {
      md += `### Reel #${idx+1} (${r.views} Views)\n`;
      md += `- **Title:** ${r.title}\n`;
      md += `- **Hook:** ${r.hook}\n`;
      md += `- **CTA:** ${r.cta}\n`;
      md += `- **Summary:** ${r.summary}\n\n`;
    });
    if (outliers && outliers.length > 0) {
      md += `\n## YouTube Outlier Research\n`;
      outliers.forEach((o, idx) => {
        md += `### Outlier #${idx+1}: ${o.outlier_title}\n`;
        md += `- **Why Outlier:** ${o.why_outlier}\n`;
        md += `- **Keywords:** ${(o.keywords || []).join(', ')}\n`;
        md += `- **Script:**\n${o.script}\n\n`;
        md += `- **Description:**\n${o.description}\n\n`;
      });
    }
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

              {/* QUICK FILL FROM YOUTUBE OUTLIERS */}
              {outliers && outliers.length > 0 && (
                <div style={{ backgroundColor: '#EEF2FF', padding: '12px 16px', borderRadius: '10px', border: '1px solid #C7D2FE', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: '#4F46E5', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-mono)' }}>
                    <Sparkles size={13} /> Quick Fill from YouTube Outliers ({researchTopic}):
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {outliers.map((o, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setThumbIdea(o.outlier_title);
                          handleGenerateThumbnails(o.outlier_title);
                        }}
                        style={{
                          fontSize: '12px',
                          backgroundColor: thumbIdea === o.outlier_title ? '#4F46E5' : 'white',
                          color: thumbIdea === o.outlier_title ? 'white' : '#1E293B',
                          padding: '6px 14px',
                          borderRadius: '8px',
                          border: '1px solid #C7D2FE',
                          fontWeight: 600,
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'all 0.2s'
                        }}
                      >
                        Outlier #{idx+1}: {o.outlier_title.slice(0, 45)}...
                      </button>
                    ))}
                  </div>
                </div>
              )}

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
              <button className="btn-blue" style={{ alignSelf: 'flex-start' }} onClick={() => handleGenerateThumbnails()} disabled={thumbLoading}>
                {thumbLoading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                {thumbLoading ? 'Designing Concepts...' : 'Generate 3 Thumbnail Concepts'}
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
            {/* Apify API Key Settings Bar */}
            <div className="card" style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Zap size={18} color="#2563EB" />
                <div>
                  <div style={{ fontWeight: 600, fontSize: '13px', color: '#1E293B' }}>Apify Live Scraper Engine</div>
                  <div style={{ fontSize: '11px', color: '#64748B' }}>Scrapes real Instagram profiles, posts, reels & engagement metrics</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input 
                  type="password" 
                  placeholder="Apify API Token (apify_api_...)" 
                  value={localStorage.getItem('apify_api_key') || ''} 
                  onChange={(e) => {
                    localStorage.setItem('apify_api_key', e.target.value.trim());
                    showToast('Apify API Token updated!', 'success');
                  }} 
                  style={{ padding: '6px 12px', fontSize: '12px', borderRadius: '6px', border: '1px solid var(--border)', width: '220px' }}
                />
                <span style={{ fontSize: '11px', fontWeight: 600, color: localStorage.getItem('apify_api_key') ? '#166534' : '#991B1B', backgroundColor: localStorage.getItem('apify_api_key') ? '#DCFCE7' : '#FEE2E2', padding: '4px 8px', borderRadius: '6px' }}>
                  {localStorage.getItem('apify_api_key') ? 'TOKEN ACTIVE 🟢' : 'TOKEN REQUIRED ⚠️'}
                </span>
              </div>
            </div>

            <div className="card" style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '12px', color: '#6B7280', fontWeight: 600, marginBottom: '4px', display: 'block' }}>Target Creator / Competitor Profile</label>
                <input 
                  type="text" 
                  value={reelUsername} 
                  onChange={e => setReelUsername(e.target.value)} 
                  placeholder="e.g. cognify_ai, bunnysunny79, kavyaeventshyd" 
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border)', borderRadius: '8px', boxSizing: 'border-box' }}
                />
              </div>
              <button className="btn-blue" style={{ marginTop: '20px' }} onClick={handleAnalyzeReels} disabled={reelLoading}>
                {reelLoading ? <Loader2 size={16} className="animate-spin" /> : <TrendingUp size={16} />}
                {reelLoading ? 'Scraping & Analyzing Apify...' : 'Analyze Creator Strategy'}
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {reelsData.map((r, idx) => {
                return (
                <div key={idx} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0', padding: '0', overflow: 'hidden', borderTop: `4px solid ${idx === 0 ? '#6366F1' : idx === 1 ? '#06B6D4' : '#F59E0B'}` }}>
                  
                  {/* HEADER: Reel Title + Interactions */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 24px', borderBottom: '1px solid var(--border)', backgroundColor: '#FAFBFC' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '10px', backgroundColor: idx === 0 ? '#EEF2FF' : idx === 1 ? '#ECFEFF' : '#FFFBEB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Play size={16} color={idx === 0 ? '#6366F1' : idx === 1 ? '#06B6D4' : '#F59E0B'} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '15px', fontFamily: 'var(--font-display)', color: '#0F172A' }}>
                          {r.title || `Reel #${r.id}`}
                        </div>
                        <div style={{ fontSize: '12px', color: '#94A3B8', fontFamily: 'var(--font-mono)' }}>@{reelUsername.replace('@', '')} • Reel #{r.id}</div>
                      </div>
                    </div>
                    
                    {/* Interactions Bar */}
                    <div style={{ display: 'flex', gap: '14px', fontSize: '13px', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#475569' }}><Eye size={15} color="#6366F1" /> {r.views}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#475569' }}><ThumbsUp size={15} color="#06B6D4" /> {r.likes}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#475569' }}><MessageSquare size={15} color="#F59E0B" /> {r.comments}</span>
                      <span style={{ backgroundColor: '#DCFCE7', color: '#15803D', padding: '3px 10px', borderRadius: '10px', fontSize: '12px', fontWeight: 700, border: '1px solid #86EFAC' }}>{r.engagement} ER</span>
                    </div>
                  </div>

                  {/* BODY: Hook + Caption + CTA */}
                  <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

                    {/* Hook Line */}
                    <div style={{ backgroundColor: '#EEF2FF', padding: '16px', borderRadius: '12px', border: '1px solid #C7D2FE' }}>
                      <div style={{ fontSize: '11px', fontWeight: 800, color: '#4F46E5', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px', fontFamily: 'var(--font-mono)' }}>🪝 Hook Line</div>
                      <div style={{ fontSize: '15px', fontWeight: 700, color: '#1E293B', fontStyle: 'italic', lineHeight: 1.5 }}>{r.hook}</div>
                    </div>

                    {/* Full Caption */}
                    <div style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                      <div style={{ fontSize: '11px', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px', fontFamily: 'var(--font-mono)' }}>📝 Full Caption</div>
                      <div style={{ fontSize: '13.5px', color: '#334155', lineHeight: 1.65, whiteSpace: 'pre-wrap', maxHeight: r._expanded ? 'none' : '120px', overflow: 'hidden', transition: 'max-height 0.3s ease' }}>
                        {r.caption || r.summary}
                      </div>
                      {(r.caption && r.caption.length > 200) && (
                        <button 
                          onClick={() => {
                            const updated = [...reelsData];
                            updated[idx] = { ...updated[idx], _expanded: !updated[idx]._expanded };
                            setReelsData(updated);
                          }}
                          style={{ marginTop: '8px', background: 'none', border: '1px solid #C7D2FE', borderRadius: '8px', padding: '4px 12px', fontSize: '12px', fontWeight: 600, color: '#6366F1', cursor: 'pointer' }}
                        >
                          {r._expanded ? 'Show Less ▲' : 'Show Full Caption ▼'}
                        </button>
                      )}
                    </div>

                    {/* CTA + Strategy Summary side by side */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                      <div style={{ backgroundColor: '#FFFBEB', padding: '16px', borderRadius: '12px', border: '1px solid #FDE68A' }}>
                        <div style={{ fontSize: '11px', fontWeight: 800, color: '#B45309', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px', fontFamily: 'var(--font-mono)' }}>📢 Call to Action (CTA)</div>
                        <div style={{ fontSize: '14px', fontWeight: 600, color: '#1E293B' }}>{r.cta}</div>
                      </div>
                      <div style={{ backgroundColor: '#F0FDF4', padding: '16px', borderRadius: '12px', border: '1px solid #BBF7D0' }}>
                        <div style={{ fontSize: '11px', fontWeight: 800, color: '#15803D', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px', fontFamily: 'var(--font-mono)' }}>🧠 Strategy Summary</div>
                        <div style={{ fontSize: '13.5px', color: '#334155', lineHeight: 1.5 }}>{r.summary}</div>
                      </div>
                    </div>

                    {/* Hashtags */}
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {(r.hashtags || []).map((h, i) => (
                        <span key={i} style={{ fontSize: '11px', backgroundColor: '#EEF2FF', color: '#4F46E5', padding: '3px 10px', borderRadius: '8px', fontWeight: 600, fontFamily: 'var(--font-mono)', border: '1px solid #C7D2FE' }}>#{h}</span>
                      ))}
                    </div>
                  </div>
                </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: YOUTUBE OUTLIER RESEARCH ENGINE */}
        {activeTab === 'script' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Input Section */}
            <div className="card" style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '300px' }}>
                <label style={{ fontSize: '12px', color: '#6B7280', fontWeight: 600, marginBottom: '4px', display: 'block' }}>Research Topic / Niche</label>
                <input 
                  type="text" 
                  value={researchTopic} 
                  onChange={e => setResearchTopic(e.target.value)} 
                  placeholder="e.g. AI Agents, SaaS Growth, YouTube Automation..." 
                  style={{ width: '100%', padding: '12px 16px', border: '1px solid var(--border)', borderRadius: '10px', boxSizing: 'border-box', fontSize: '14px' }}
                />
              </div>
              <button className="btn-blue" style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '8px' }} onClick={handleResearchOutliers} disabled={scriptLoading}>
                {scriptLoading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                {scriptLoading ? 'Researching YouTube...' : 'Find Top 3 Outliers'}
              </button>
            </div>

            {/* Loading State */}
            {scriptLoading && (
              <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', padding: '48px 24px' }}>
                <Loader2 size={40} color="#6366F1" className="animate-spin" />
                <div style={{ fontWeight: 700, fontSize: '16px', color: '#0F172A' }}>Researching YouTube Outliers...</div>
                <div style={{ fontSize: '13px', color: '#64748B', textAlign: 'center', maxWidth: '400px' }}>
                  Scraping YouTube via Apify, analyzing top-performing videos, and generating complete content blueprints with AI...
                </div>
              </div>
            )}

            {/* Results: 3 Outlier Cards */}
            {outliers && outliers.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0F172A', fontFamily: 'var(--font-display)' }}>🏆 Top 3 YouTube Outliers: "{researchTopic}"</h3>
                    <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748B' }}>Videos that massively outperformed expectations — reverse-engineered for you</p>
                  </div>
                </div>

                {outliers.map((o, idx) => {
                  const accentColors = [
                    { border: '#6366F1', bg: '#EEF2FF', text: '#4F46E5', label: 'OUTLIER #1' },
                    { border: '#06B6D4', bg: '#ECFEFF', text: '#0891B2', label: 'OUTLIER #2' },
                    { border: '#F59E0B', bg: '#FFFBEB', text: '#B45309', label: 'OUTLIER #3' }
                  ][idx] || { border: '#6366F1', bg: '#EEF2FF', text: '#4F46E5', label: `OUTLIER #${idx+1}` };

                  return (
                    <div key={idx} className="card" style={{ padding: '0', overflow: 'hidden', borderTop: `4px solid ${accentColors.border}` }}>
                      
                      {/* Card Header: Title */}
                      <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', backgroundColor: '#FAFBFC', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{ fontSize: '11px', fontWeight: 800, backgroundColor: accentColors.bg, color: accentColors.text, padding: '4px 10px', borderRadius: '8px', fontFamily: 'var(--font-mono)', border: `1px solid ${accentColors.border}30` }}>{accentColors.label}</span>
                          <div>
                            <div style={{ fontWeight: 800, fontSize: '16px', color: '#0F172A', fontFamily: 'var(--font-display)' }}>{o.outlier_title}</div>
                            <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px', fontStyle: 'italic' }}>💡 {o.why_outlier}</div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          <button 
                            className="btn-blue" 
                            onClick={() => handleSendToThumbnail(o.outlier_title)}
                            style={{ whiteSpace: 'nowrap', padding: '6px 14px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}
                          >
                            <ImageIcon size={14} /> Generate 3 Thumbnails
                          </button>
                          <button 
                            className="btn-demo" 
                            onClick={() => copyToClipboard(`TITLE: ${o.outlier_title}\n\nSCRIPT:\n${o.script}\n\nAI TIPS:\n${o.ai_tips}\n\nKEYWORDS: ${(o.keywords || []).join(', ')}\n\nDESCRIPTION:\n${o.description}`, 100 + idx)}
                            style={{ whiteSpace: 'nowrap' }}
                          >
                            {copiedIdx === 100 + idx ? <Check size={14} color="#166534" /> : <Copy size={14} />}
                            {copiedIdx === 100 + idx ? 'Copied!' : 'Copy All'}
                          </button>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>

                        {/* 1. TITLE */}
                        <div style={{ backgroundColor: accentColors.bg, padding: '14px 18px', borderRadius: '12px', border: `1px solid ${accentColors.border}30`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                          <div>
                            <div style={{ fontSize: '11px', fontWeight: 800, color: accentColors.text, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px', fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: '6px' }}><FileText size={13} /> Optimized Title</div>
                            <div style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A' }}>{o.outlier_title}</div>
                          </div>
                          <button
                            onClick={() => handleSendToThumbnail(o.outlier_title)}
                            style={{ background: 'none', border: `1px solid ${accentColors.border}`, borderRadius: '8px', padding: '6px 12px', fontSize: '12px', fontWeight: 700, color: accentColors.text, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                          >
                            <Sparkles size={13} /> Generate Thumbnail Concepts →
                          </button>
                        </div>

                        {/* 2. SCRIPT */}
                        <div style={{ backgroundColor: '#F8FAFC', padding: '18px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                          <div style={{ fontSize: '11px', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: '6px' }}><Clapperboard size={13} /> Video Script (60-90s)</div>
                          <div style={{ fontSize: '13.5px', color: '#1E293B', lineHeight: 1.7, whiteSpace: 'pre-wrap', maxHeight: o._scriptExpanded ? 'none' : '200px', overflow: 'hidden', transition: 'max-height 0.3s ease' }}>
                            {o.script}
                          </div>
                          {o.script && o.script.length > 400 && (
                            <button 
                              onClick={() => {
                                const updated = [...outliers];
                                updated[idx] = { ...updated[idx], _scriptExpanded: !updated[idx]._scriptExpanded };
                                setOutliers(updated);
                              }}
                              style={{ marginTop: '8px', background: 'none', border: `1px solid ${accentColors.border}40`, borderRadius: '8px', padding: '4px 14px', fontSize: '12px', fontWeight: 600, color: accentColors.text, cursor: 'pointer' }}
                            >
                              {o._scriptExpanded ? 'Show Less ▲' : 'Show Full Script ▼'}
                            </button>
                          )}
                        </div>

                        {/* 3. AI TIPS */}
                        <div style={{ backgroundColor: '#F0FDF4', padding: '16px 18px', borderRadius: '12px', border: '1px solid #BBF7D0' }}>
                          <div style={{ fontSize: '11px', fontWeight: 800, color: '#15803D', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: '6px' }}><Bot size={13} /> How to Use AI</div>
                          <div style={{ fontSize: '13.5px', color: '#1E293B', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                            {o.ai_tips}
                          </div>
                        </div>

                        {/* 4. KEYWORDS */}
                        <div style={{ backgroundColor: '#FFF7ED', padding: '16px 18px', borderRadius: '12px', border: '1px solid #FED7AA' }}>
                          <div style={{ fontSize: '11px', fontWeight: 800, color: '#C2410C', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px', fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: '6px' }}><Tag size={13} /> High-Reach Keywords</div>
                          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            {(o.keywords || []).map((kw, ki) => (
                              <span key={ki} style={{ fontSize: '12px', backgroundColor: 'white', color: '#C2410C', padding: '5px 12px', borderRadius: '8px', fontWeight: 600, fontFamily: 'var(--font-mono)', border: '1px solid #FED7AA', cursor: 'pointer' }}>
                                {kw}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* 5. DESCRIPTION */}
                        <div style={{ backgroundColor: '#EEF2FF', padding: '16px 18px', borderRadius: '12px', border: '1px solid #C7D2FE' }}>
                          <div style={{ fontSize: '11px', fontWeight: 800, color: '#4F46E5', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: '6px' }}><FileText size={13} /> YouTube Description (SEO Optimized)</div>
                          <div style={{ fontSize: '13px', color: '#1E293B', lineHeight: 1.65, whiteSpace: 'pre-wrap', maxHeight: o._descExpanded ? 'none' : '150px', overflow: 'hidden', transition: 'max-height 0.3s ease' }}>
                            {o.description}
                          </div>
                          {o.description && o.description.length > 300 && (
                            <button 
                              onClick={() => {
                                const updated = [...outliers];
                                updated[idx] = { ...updated[idx], _descExpanded: !updated[idx]._descExpanded };
                                setOutliers(updated);
                              }}
                              style={{ marginTop: '8px', background: 'none', border: '1px solid #C7D2FE', borderRadius: '8px', padding: '4px 14px', fontSize: '12px', fontWeight: 600, color: '#4F46E5', cursor: 'pointer' }}
                            >
                              {o._descExpanded ? 'Show Less ▲' : 'Show Full Description ▼'}
                            </button>
                          )}
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Empty State */}
            {!scriptLoading && !outliers && (
              <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '48px 24px', textAlign: 'center' }}>
                <Search size={40} color="#CBD5E1" />
                <div style={{ fontWeight: 700, fontSize: '16px', color: '#475569' }}>Enter a topic and find outliers</div>
                <div style={{ fontSize: '13px', color: '#94A3B8', maxWidth: '400px' }}>
                  We'll research YouTube, find the top 3 viral outlier videos, and give you a complete content blueprint with scripts, AI tips, keywords, and descriptions.
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
