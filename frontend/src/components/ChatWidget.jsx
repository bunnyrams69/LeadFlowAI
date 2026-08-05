import React, { useState, useEffect, useRef, useContext } from 'react';
import { Send, Paperclip, Bot, MessageCircle, Loader2 } from 'lucide-react';
import { sendChatMessage, uploadChatDocument } from '../api/client';
import { useToast } from '../hooks/useToast';
import { AppContext } from '../context/AppContext';

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
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <MessageCircle size={32} color="#9CA3AF" />
            </div>
            <h3 style={{ margin: 0, fontSize: '18px', color: '#374151' }}>Ask me anything</h3>
            <div style={{ fontSize: '14px' }}>Try one of the suggested questions above.</div>
         </div>
      ) : (
         <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
           {messages.map((m, i) => (
             <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
               {m.role === 'bot' && <div style={{ backgroundColor: '#F3F4F6', padding: '8px', borderRadius: '50%' }}><Bot size={18} /></div>}
               <div style={{ backgroundColor: m.role === 'user' ? 'var(--blue)' : '#F3F4F6', color: m.role === 'user' ? 'white' : '#111827', padding: '12px 16px', borderRadius: '12px', fontSize: '14px', lineHeight: '1.5' }}>
                 {m.content}
               </div>
             </div>
           ))}
           {isLoading && <div style={{ color: '#6B7280', fontSize: '12px', paddingLeft: '40px', display: 'flex', gap: '4px' }}>Thinking... ~3s</div>}
           <div ref={endRef} />
         </div>
      )}
      <div style={{ borderTop: '1px solid var(--border)', padding: '16px', display: 'flex', gap: '12px' }}>
        <label style={{ cursor: 'pointer', padding: '10px', backgroundColor: '#F3F4F6', borderRadius: '8px' }}>
          <input type="file" style={{ display: 'none' }} onChange={handleUpload} />
          <Paperclip size={20} color="#6B7280" />
        </label>
        <input 
          type="text" value={input} onChange={e => setInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSend()}
          placeholder="Ask a question..." style={{ flex: 1, border: '1px solid var(--border)', borderRadius: '8px', padding: '0 16px', outline: 'none' }} 
        />
        <button className="btn-blue" style={{ padding: '10px 16px' }} onClick={() => handleSend()} disabled={isLoading}>
           {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
        </button>
      </div>
    </div>
  );
};
export default ChatWidget;
