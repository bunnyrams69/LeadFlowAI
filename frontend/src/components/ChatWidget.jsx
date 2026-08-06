import React, { useState, useEffect, useRef, useContext } from 'react';
import { Send, Paperclip, Bot, MessageCircle, Loader2 } from 'lucide-react';
import { sendChatMessage, uploadChatDocument } from '../api/client';
import { useToast } from '../hooks/useToast';
import { AppContext } from '../context/AppContext';

const renderFormattedContent = (content) => {
  if (!content) return null;
  const lines = String(content).split('\n');

  return lines.map((line, lineIdx) => {
    // Split by markdown bold syntax **bold text**
    const parts = line.split(/(\*\*.*?\*\*)/g);
    const lineElements = parts.map((part, pIdx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={pIdx} style={{ fontWeight: 700, color: '#0F172A' }}>
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });

    return (
      <div key={lineIdx} style={{ minHeight: line.trim() === '' ? '8px' : 'auto', marginBottom: '2px' }}>
        {lineElements}
      </div>
    );
  });
};

const ChatWidget = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const endRef = useRef(null);
  const { showToast } = useToast();
  const { isLoading, setIsLoading } = useContext(AppContext);

  useEffect(() => {
     endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
     const handleSuggested = (e) => {
        const txt = e.detail;
        handleSend(txt);
     };
     window.addEventListener('suggested-question', handleSuggested);
     return () => window.removeEventListener('suggested-question', handleSuggested);
  }, [messages]);

  const handleSend = async (forcedText = null) => {
    const textToSend = forcedText || input;
    if (!textToSend.trim()) return;
    
    const newHistory = [...messages, { role: 'user', content: textToSend }];
    setMessages(newHistory);
    setInput('');
    setIsLoading(true);

    const res = await sendChatMessage(textToSend, messages);
    setIsLoading(false);
    
    if (res.error) {
      showToast(res.error, 'error');
      setMessages([...newHistory, { role: 'bot', content: 'Sorry, I encountered an error communicating with the backend.' }]);
    } else if (res.data) {
      setMessages([...newHistory, { role: 'bot', content: res.data.reply }]);
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const res = await uploadChatDocument(file);
    if (res.error) showToast(res.error, 'error');
    else {
       localStorage.setItem('rag_docs_count', '1');
       showToast('Document uploaded to knowledge base!', 'success');
    }
  };

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: 0 }}>
      {messages.length === 0 ? (
         <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF', gap: '12px' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <MessageCircle size={32} color="#2563EB" />
            </div>
            <h3 style={{ margin: 0, fontSize: '18px', color: '#1E293B' }}>Ask RAG Assistant Anything</h3>
            <div style={{ fontSize: '14px', color: '#64748B' }}>Query your database of scraped leads, write emails, or ask about services.</div>
         </div>
      ) : (
         <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
           {messages.map((m, i) => (
             <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
               {m.role === 'bot' && (
                 <div style={{ backgroundColor: '#2563EB', color: 'white', padding: '8px', borderRadius: '50%', boxShadow: '0 2px 6px rgba(37,99,235,0.3)' }}>
                   <Bot size={18} />
                 </div>
               )}
               <div style={{
                 backgroundColor: m.role === 'user' ? 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)' : '#FFFFFF',
                 background: m.role === 'user' ? 'var(--blue)' : '#FFFFFF',
                 color: m.role === 'user' ? 'white' : '#1E293B',
                 padding: '14px 18px',
                 borderRadius: m.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                 fontSize: '14px',
                 lineHeight: '1.6',
                 border: m.role === 'user' ? 'none' : '1px solid #E2E8F0',
                 boxShadow: m.role === 'user' ? '0 4px 12px rgba(37,99,235,0.2)' : '0 2px 8px rgba(0,0,0,0.04)'
               }}>
                 {m.role === 'bot' && (
                   <div style={{ fontSize: '11px', fontWeight: 700, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                     🤖 Cognify RAG Assistant
                   </div>
                 )}
                 {m.role === 'user' ? m.content : renderFormattedContent(m.content)}
               </div>
             </div>
           ))}
           {isLoading && (
             <div style={{ color: '#2563EB', fontSize: '13px', paddingLeft: '44px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }}>
               <Loader2 size={16} className="animate-spin" /> RAG Engine Analyzing Database Context...
             </div>
           )}
           <div ref={endRef} />
         </div>
      )}
      <div style={{ borderTop: '1px solid var(--border)', padding: '16px', display: 'flex', gap: '12px', backgroundColor: '#FAFAFA' }}>
        <label style={{ cursor: 'pointer', padding: '10px', backgroundColor: 'white', borderRadius: '8px', border: '1px solid var(--border)' }} title="Upload Knowledge Base Doc">
          <input type="file" style={{ display: 'none' }} onChange={handleUpload} />
          <Paperclip size={20} color="#6B7280" />
        </label>
        <input 
          type="text" value={input} onChange={e => setInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSend()}
          placeholder="Ask about your leads or services..." style={{ flex: 1, border: '1px solid var(--border)', borderRadius: '8px', padding: '0 16px', outline: 'none', backgroundColor: 'white' }} 
        />
        <button className="btn-blue" style={{ padding: '10px 20px' }} onClick={() => handleSend()} disabled={isLoading}>
           {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
        </button>
      </div>
    </div>
  );
};
export default ChatWidget;
