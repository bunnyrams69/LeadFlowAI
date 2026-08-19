import React, { useState } from 'react';
import { X, ExternalLink, Copy, Check, Bot, Send, Sparkles, Phone, Mail, MapPin, Calendar, Star, ShieldCheck } from 'lucide-react';

const DemoPreviewModal = ({ lead, onClose, onApprove }) => {
  const [copied, setCopied] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'bot',
      text: `Hello! 👋 Welcome to ${lead?.name || 'our business'}. I'm your 24/7 AI Assistant. How can I help you today?`
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  if (!lead) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(lead.demoUrl || window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendMessage = (e) => {
    e?.preventDefault();
    if (!inputMessage.trim()) return;

    const userText = inputMessage;
    setChatMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      let botReply = `Thank you for your message! As an automated 24/7 assistant for ${lead.name}, I have logged your request. Our team in ${lead.city || 'your area'} will contact you at ${lead.phone || 'your phone number'} within 10 minutes.`;
      if (userText.toLowerCase().includes('book') || userText.toLowerCase().includes('appointment') || userText.toLowerCase().includes('call')) {
        botReply = `I'd be happy to schedule that for you! Would tomorrow morning at 10:30 AM or afternoon at 3:00 PM work better for your schedule? 📅`;
      } else if (userText.toLowerCase().includes('price') || userText.toLowerCase().includes('cost')) {
        botReply = `Our pricing packages for ${lead.category || 'services'} are customized based on requirements. I can arrange an instant quote directly on WhatsApp at ${lead.phone || 'our direct line'}!`;
      }

      setChatMessages(prev => [...prev, { sender: 'bot', text: botReply }]);
      setIsTyping(false);
    }, 700);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '24px'
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '20px',
        width: '100%',
        maxWidth: '1050px',
        height: '90vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        border: '1px solid var(--border)',
        overflow: 'hidden'
      }}>
        {/* Modal Top Bar */}
        <div style={{
          backgroundColor: '#0F172A',
          color: 'white',
          padding: '12px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #334155'
        }}>
          {/* Browser controls & URL Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', gap: '6px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#EF4444' }}></div>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#F59E0B' }}></div>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10B981' }}></div>
            </div>

            {/* Cloudflare Tunnel URL Simulation */}
            <div style={{
              backgroundColor: '#1E293B',
              padding: '6px 14px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '12px',
              color: '#94A3B8',
              fontFamily: 'var(--font-mono)',
              flex: 1,
              maxWidth: '520px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#10B981', boxShadow: '0 0 8px #10B981' }}></span>
              <span style={{ color: '#E2E8F0', fontWeight: 600 }}>cloudflare-tunnel://</span>
              <span>{lead.demoUrl || `https://leadflow-demo.tunnel.leadflow.ai/preview/${lead.name.toLowerCase().replace(/\s+/g, '-')}`}</span>
            </div>

            <button
              onClick={handleCopy}
              className="btn-demo"
              style={{ padding: '4px 10px', fontSize: '11px', height: '28px', backgroundColor: '#334155', color: '#E2E8F0', border: 'none' }}
              title="Copy Public Demo Link"
            >
              {copied ? <Check size={12} color="#10B981" /> : <Copy size={12} />}
              {copied ? 'Copied' : 'Copy Link'}
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={onClose}
              style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer', display: 'flex', padding: '4px' }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Demo Pitch Notification Banner */}
        <div style={{
          backgroundColor: '#EEF2FF',
          borderBottom: '1px solid #C7D2FE',
          padding: '10px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '13px',
          color: '#3730A3'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={16} color="#6366F1" />
            <span><strong>Live Client Prototype:</strong> This interactive 24/7 AI Demo Landing Page is customized for <strong>{lead.name}</strong> ({lead.category}, {lead.city}).</span>
          </div>
          {onApprove && (
            <button
              onClick={() => { onApprove(lead); onClose(); }}
              className="btn-blue"
              style={{ fontSize: '12px', padding: '6px 14px' }}
            >
              Approve & Send Pitch
            </button>
          )}
        </div>

        {/* Live Interactive Page Body */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          {/* Hero Section */}
          <div style={{
            background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 60%, #312E81 100%)',
            color: 'white',
            padding: '50px 40px',
            textAlign: 'center',
            position: 'relative'
          }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(99, 102, 241, 0.2)',
              border: '1px solid rgba(129, 140, 248, 0.4)',
              padding: '4px 14px',
              borderRadius: '20px',
              fontSize: '12px',
              color: '#A5B4FC',
              fontWeight: 600,
              marginBottom: '16px'
            }}>
              <ShieldCheck size={14} /> Official 24/7 Digital Assistant & Modern Portal
            </div>

            <h1 style={{ fontSize: '36px', fontWeight: 800, margin: '0 0 12px', letterSpacing: '-0.03em' }}>
              {lead.name}
            </h1>
            <p style={{ fontSize: '17px', color: '#94A3B8', maxWidth: '640px', margin: '0 auto 24px', lineHeight: 1.5 }}>
              Top-rated {lead.category} services in {lead.city}. Never miss a client inquiry again with our instant 24/7 WhatsApp AI booking assistant.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(255,255,255,0.1)', padding: '6px 14px', borderRadius: '10px', fontSize: '13px' }}>
                <Phone size={14} color="#38BDF8" /> {lead.phone}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(255,255,255,0.1)', padding: '6px 14px', borderRadius: '10px', fontSize: '13px' }}>
                <MapPin size={14} color="#F472B6" /> {lead.city}, India
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(255,255,255,0.1)', padding: '6px 14px', borderRadius: '10px', fontSize: '13px' }}>
                <Star size={14} color="#FBBF24" fill="#FBBF24" /> {lead.rating || '4.8'} ({lead.reviews || '28'}+ Reviews)
              </div>
            </div>
          </div>

          {/* Interactive Feature & Chatbot Demo Grid */}
          <div style={{ padding: '36px 40px', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '32px', flex: 1, backgroundColor: '#F8FAFC' }}>
            {/* Left Column: Why This Demo Wins Clients */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                Why Local Businesses in {lead.city} Need This AI Portal
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div className="card" style={{ padding: '16px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366F1', flexShrink: 0 }}>
                    <Bot size={20} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '14px', color: '#0F172A' }}>24/7 Instant WhatsApp Lead Capture</div>
                    <div style={{ fontSize: '12.5px', color: '#64748B', marginTop: '2px' }}>Answers inquiries, qualifies budget, and logs client appointments even after business hours.</div>
                  </div>
                </div>

                <div className="card" style={{ padding: '16px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981', flexShrink: 0 }}>
                    <Calendar size={20} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '14px', color: '#0F172A' }}>Direct Calendar & Booking Sync</div>
                    <div style={{ fontSize: '12.5px', color: '#64748B', marginTop: '2px' }}>Clients book consultations directly onto the business owner's Google Calendar.</div>
                  </div>
                </div>

                <div className="card" style={{ padding: '16px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D97706', flexShrink: 0 }}>
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '14px', color: '#0F172A' }}>Zero Missed Calls & Lost Revenue</div>
                    <div style={{ fontSize: '12.5px', color: '#64748B', marginTop: '2px' }}>Auto-responds to missed calls with an instant SMS/WhatsApp booking link.</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Working Live AI Chatbot Widget */}
            <div className="card" style={{ padding: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', height: '420px', border: '1.5px solid #CBD5E1' }}>
              {/* Chat Header */}
              <div style={{ backgroundColor: '#0F172A', color: 'white', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#22C55E', boxShadow: '0 0 8px #22C55E' }}></div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '13.5px' }}>{lead.name} AI Assistant</div>
                  <div style={{ fontSize: '11px', color: '#94A3B8' }}>Active now • Instant responses</div>
                </div>
              </div>

              {/* Chat Messages */}
              <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', backgroundColor: '#F8FAFC' }}>
                {chatMessages.map((msg, i) => (
                  <div key={i} style={{
                    alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                    backgroundColor: msg.sender === 'user' ? '#4F46E5' : '#FFFFFF',
                    color: msg.sender === 'user' ? '#FFFFFF' : '#0F172A',
                    padding: '10px 14px',
                    borderRadius: msg.sender === 'user' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                    fontSize: '13px',
                    maxWidth: '85%',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                    lineHeight: 1.4,
                    border: msg.sender === 'user' ? 'none' : '1px solid #E2E8F0'
                  }}>
                    {msg.text}
                  </div>
                ))}
                {isTyping && (
                  <div style={{ alignSelf: 'flex-start', backgroundColor: '#FFFFFF', padding: '8px 14px', borderRadius: '12px', fontSize: '12px', color: '#64748B', fontStyle: 'italic', border: '1px solid #E2E8F0' }}>
                    {lead.name} AI is typing...
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} style={{ padding: '10px 14px', backgroundColor: '#FFFFFF', borderTop: '1px solid #E2E8F0', display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Test the AI bot (e.g. 'Can I book an appointment?')..."
                  style={{
                    flex: 1,
                    padding: '9px 12px',
                    border: '1px solid #CBD5E1',
                    borderRadius: '8px',
                    fontSize: '13px',
                    outline: 'none'
                  }}
                />
                <button
                  type="submit"
                  style={{
                    backgroundColor: '#4F46E5',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0 14px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Send size={15} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoPreviewModal;
