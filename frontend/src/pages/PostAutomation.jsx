import React, { useState, useEffect, useContext } from 'react';
import TopBar from '../components/TopBar';
import { publishPost, getPostHistory } from '../api/client';
import { AppContext } from '../context/AppContext';
import { useToast } from '../hooks/useToast';
import { Loader2, FileText } from 'lucide-react';

const PostAutomation = () => {
  const [content, setContent] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [history, setHistory] = useState([]);
  
  const { incrementPostsPublished, isLoading, setIsLoading } = useContext(AppContext);
  const { showToast } = useToast();

  useEffect(() => {
    setApiKey(localStorage.getItem('openrouter_api_key') || '');
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
     const res = await getPostHistory();
     if (res.data) setHistory(res.data);
  };

  const handleKeyChange = (e) => {
     setApiKey(e.target.value);
     localStorage.setItem('openrouter_api_key', e.target.value);
  };

  const handleGeneratePost = async () => {
     if (!apiKey) { showToast('Please enter your OpenRouter API Key first', 'warning'); return; }
     setIsLoading(true);
     try {
         const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
               'Authorization': `Bearer ${apiKey}`,
               'Content-Type': 'application/json',
               'HTTP-Referer': 'http://localhost:5173',
               'X-Title': 'LeadFlow AI'
            },
            body: JSON.stringify({
               model: 'mistralai/mistral-7b-instruct:free',
               messages: [{ role: 'user', content: 'Write a LinkedIn post for a solo AI automation founder from Cognify AI Hyderabad. The post should showcase their AI services (RAG chatbots, WhatsApp bots, lead automation). MUST USE EXACTLY THIS FORMAT:\n1. A short, punchy, controversial hook (e.g. "Stop doing [bad thing]. It is killing your [result] 🔥")\n2. A bold "The truth is..." statement.\n3. A metric or personal experience ("After building 50+ bots this year...")\n4. The core insight.\n5. Exactly 3 numbered "hacks" or lessons, each with a bold title and short description.\n6. A concluding thought ("Most people treat AI like...").\n7. An engaging question ("Which of these are you trying first? Drop a comment 👇").\n8. A "PS:" promoting a live masterclass this Saturday in Koramangala.\nKeep it highly structured and readable.' }],
               max_tokens: 500
            })
         });
         const data = await res.json();
         if (data.error) showToast(data.error.message || 'LLM API Error', 'error');
         else {
            setContent(data.choices[0].message.content);
            showToast('Post generated successfully', 'success');
         }
     } catch (err) {
         showToast(err.message, 'error');
     }
     setIsLoading(false);
  };

  const handlePublish = async () => {
    if (!content) return;
    setIsLoading(true);
    const res = await publishPost(content);
    setIsLoading(false);
    
    if (res.error) showToast(res.error, 'error');
    else if (res.data) {
       showToast('Post published to LinkedIn successfully!', 'success');
       incrementPostsPublished();
       fetchHistory();
       setContent('');
    }
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <TopBar title="Post Automation" subtitle="Write and schedule LinkedIn posts" badge="Live Demo" />
      <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
           <div style={{ fontWeight: 500 }}>OpenRouter API Key:</div>
           <input type="password" placeholder="sk-or-..." value={apiKey} onChange={handleKeyChange} style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid var(--border)' }} />
        </div>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
             <h3 style={{ margin: 0 }}>Draft Post</h3>
             <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
               <button className="btn-blue" style={{ backgroundColor: '#10B981' }} onClick={handleGeneratePost} disabled={isLoading}>
                  {isLoading && <Loader2 size={16} className="animate-spin" />} {isLoading ? 'Generating...' : 'Generate Post with AI'}
               </button>
               {isLoading && <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '4px' }}>Generating post... ~5s</div>}
             </div>
          </div>
          <textarea value={content} onChange={e => setContent(e.target.value)} rows={8} placeholder="Write your LinkedIn post here..." style={{ padding: '16px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '14px', resize: 'vertical' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '12px', color: '#6B7280' }}>{content.length} / 3000 chars</div>
            <button className="btn-blue" onClick={handlePublish} disabled={isLoading || !content}>
              Publish to LinkedIn
            </button>
          </div>
        </div>
        <div>
           <h3 style={{ margin: '0 0 16px', fontSize: '18px' }}>Post History</h3>
           {history.length === 0 ? (
              <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', gap: '16px' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FileText size={32} color="#9CA3AF" /></div>
                <h3 style={{ margin: 0, fontSize: '18px', color: '#374151' }}>No posts yet</h3>
                <div style={{ fontSize: '14px', color: '#6B7280' }}>Generate your first post above</div>
              </div>
           ) : (
              <div className="card" style={{ padding: 0 }}>
                 <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ backgroundColor: '#F9FAFB' }}><tr><th style={{ padding: '12px' }}>ID</th><th style={{ padding: '12px' }}>Status</th><th style={{ padding: '12px' }}>Message</th></tr></thead>
                    <tbody>
                       {history.map((h, i) => (
                          <tr key={i}><td style={{ padding: '12px' }}>{h.post_id}</td><td style={{ padding: '12px' }}><span className="tag tag-published">{h.status}</span></td><td style={{ padding: '12px' }}>{h.message}</td></tr>
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
export default PostAutomation;
