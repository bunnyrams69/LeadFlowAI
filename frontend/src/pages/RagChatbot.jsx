import React from 'react';
import TopBar from '../components/TopBar';
import ChatWidget from '../components/ChatWidget';
import { useToast } from '../hooks/useToast';

const RagChatbot = () => {
  const { showToast } = useToast();

  const handleChipClick = (text) => {
     // We will dispatch a custom event to the ChatWidget to handle this smoothly
     const event = new CustomEvent('suggested-question', { detail: text });
     window.dispatchEvent(event);
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
      <TopBar title="RAG Chatbot" subtitle="Interactive AI assistant loaded with your knowledge base" badge="Live Demo" />
      <div style={{ padding: '32px', flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ marginBottom: '24px', display: 'flex', gap: '12px' }}>
          <button onClick={() => handleChipClick('What services do I offer?')} className="tag" style={{ backgroundColor: 'white', border: '1px solid var(--border)', cursor: 'pointer' }}>"What services do I offer?"</button>
          <button onClick={() => handleChipClick('Who are my top leads?')} className="tag" style={{ backgroundColor: 'white', border: '1px solid var(--border)', cursor: 'pointer' }}>"Who are my top leads?"</button>
          <button onClick={() => handleChipClick('Draft a follow-up for Arjun Mehta')} className="tag" style={{ backgroundColor: 'white', border: '1px solid var(--border)', cursor: 'pointer' }}>"Draft a follow-up for Arjun Mehta"</button>
        </div>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <ChatWidget />
        </div>
      </div>
    </div>
  );
};

export default RagChatbot;
