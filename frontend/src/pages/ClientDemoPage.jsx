import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Bot, Send, Phone, MapPin, Star, ShieldCheck, Sparkles, Calendar, CheckCircle2, MessageSquare } from 'lucide-react';

const ClientDemoPage = () => {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();

  // Format business details from slug (e.g. "shree-properties-vadodara")
  const rawTitle = slug ? slug.replace(/-/g, ' ') : 'Premier Business Solutions';
  const words = rawTitle.split(' ');
  const capitalizedTitle = words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  const [businessName, setBusinessName] = useState(capitalizedTitle);
  const [city, setCity] = useState(searchParams.get('city') || 'Vadodara');
  const [category, setCategory] = useState(searchParams.get('category') || 'Services');
  const [phone, setPhone] = useState(searchParams.get('phone') || '+91 98201 92831');

  useEffect(() => {
    // Check if lead data exists in localStorage
    try {
      const saved = JSON.parse(localStorage.getItem('leadhunter_leads') || '[]');
      const match = saved.find(l => (l.name || '').toLowerCase().replace(/[^a-z0-9]/g, '-') === slug || (l.demoUrl || '').includes(slug));
      if (match) {
        setBusinessName(match.name);
        setCity(match.city || 'Vadodara');
        setCategory(match.category || 'Services');
        setPhone(match.phone || '+91 98201 92831');
      }
    } catch (e) {
      console.log(e);
    }
  }, [slug]);

  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'bot',
      text: `Hello! 👋 Welcome to ${businessName}. I'm your 24/7 AI Assistant. How can I assist you with ${category} today?`
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = (e) => {
    e?.preventDefault();
    if (!inputMessage.trim()) return;

    const userText = inputMessage;
    setChatMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      let botReply = `Thank you for your message! Our team at ${businessName} has received your inquiry. We will contact you at ${phone} within 10 minutes.`;
      if (userText.toLowerCase().includes('book') || userText.toLowerCase().includes('appointment') || userText.toLowerCase().includes('call')) {
        botReply = `I'd love to schedule that! Would tomorrow at 11:00 AM or 4:00 PM work best for you? 📅`;
      } else if (userText.toLowerCase().includes('price') || userText.toLowerCase().includes('cost') || userText.toLowerCase().includes('quote')) {
        botReply = `Our pricing packages for ${category} are tailored to your needs. I can send an instant quote directly on WhatsApp at ${phone}!`;
      }

      setChatMessages(prev => [...prev, { sender: 'bot', text: botReply }]);
      setIsTyping(false);
    }, 700);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC', color: '#0F172A', fontFamily: "'Plus Jakarta Sans', sans-serif", display: 'flex', flexDirection: 'column' }}>
      {/* Top Prototype Notification Banner */}
      <div style={{
        backgroundColor: '#312E81',
        color: '#E0E7FF',
        padding: '12px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '13px',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={16} color="#A5B4FC" />
          <span><strong>Live Client Prototype:</strong> Prepared specifically for <strong>{businessName}</strong>. 24/7 AI Booking & Lead Capture System.</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12px', color: '#C7D2FE' }}>Built by LeadFlow AI / Cognify AI</span>
        </div>
      </div>

      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #0B0F19 0%, #1E1B4B 50%, #312E81 100%)',
        color: 'white',
        padding: '60px 24px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: 'rgba(99, 102, 241, 0.2)',
            border: '1px solid rgba(129, 140, 248, 0.3)',
            padding: '5px 16px',
            borderRadius: '20px',
            fontSize: '12px',
            color: '#A5B4FC',
            fontWeight: 700,
            marginBottom: '20px'
          }}>
            <ShieldCheck size={14} /> Official 24/7 Smart Digital Portal
          </div>

          <h1 style={{ fontSize: '38px', fontWeight: 800, margin: '0 0 16px', letterSpacing: '-0.03em', lineHeight: 1.2 }}>
            {businessName}
          </h1>
          <p style={{ fontSize: '18px', color: '#94A3B8', margin: '0 auto 28px', lineHeight: 1.5, maxWidth: '640px' }}>
            Top-rated {category} in {city}. Capture inquiries and schedule appointments automatically 24/7 with our WhatsApp-integrated AI Assistant.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(255,255,255,0.1)', padding: '8px 16px', borderRadius: '10px', fontSize: '13.5px' }}>
              <Phone size={15} color="#38BDF8" /> {phone}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(255,255,255,0.1)', padding: '8px 16px', borderRadius: '10px', fontSize: '13.5px' }}>
              <MapPin size={15} color="#F472B6" /> {city}, India
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(255,255,255,0.1)', padding: '8px 16px', borderRadius: '10px', fontSize: '13.5px' }}>
              <Star size={15} color="#FBBF24" fill="#FBBF24" /> 4.9 (35+ Verified Reviews)
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive Demo & Chatbot Body */}
      <div style={{ maxWidth: '1050px', margin: '0 auto', padding: '40px 24px', flex: 1, width: '100%', boxSizing: 'border-box' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
          
          {/* Left Column: Why This System Wins Clients */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Why {businessName} Needs This 24/7 AI System
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '18px', display: 'flex', gap: '14px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366F1', flexShrink: 0 }}>
                  <Bot size={22} />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '15px', color: '#0F172A' }}>24/7 WhatsApp Lead Capture</div>
                  <div style={{ fontSize: '13px', color: '#64748B', marginTop: '3px' }}>Answers client inquiries instantly on WhatsApp, even at 2:00 AM after business hours.</div>
                </div>
              </div>

              <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '18px', display: 'flex', gap: '14px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981', flexShrink: 0 }}>
                  <Calendar size={22} />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '15px', color: '#0F172A' }}>Automated Booking Sync</div>
                  <div style={{ fontSize: '13px', color: '#64748B', marginTop: '3px' }}>Directly schedules appointments into the business calendar without back-and-forth calls.</div>
                </div>
              </div>

              <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '18px', display: 'flex', gap: '14px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D97706', flexShrink: 0 }}>
                  <Sparkles size={22} />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '15px', color: '#0F172A' }}>Zero Missed Calls & Lost Deals</div>
                  <div style={{ fontSize: '13px', color: '#64748B', marginTop: '3px' }}>Automatically sends a WhatsApp callback link whenever a customer call is missed.</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Live Working AI Chatbot Widget */}
          <div style={{ backgroundColor: '#FFFFFF', border: '1.5px solid #CBD5E1', borderRadius: '16px', display: 'flex', flexDirection: 'column', height: '440px', overflow: 'hidden', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)' }}>
            {/* Header */}
            <div style={{ backgroundColor: '#0F172A', color: 'white', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#22C55E', boxShadow: '0 0 8px #22C55E' }}></div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '14px' }}>{businessName} AI Assistant</div>
                <div style={{ fontSize: '11.5px', color: '#94A3B8' }}>Online • Ready to answer inquiries</div>
              </div>
            </div>

            {/* Chat Body */}
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
                  boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                  lineHeight: 1.4,
                  border: msg.sender === 'user' ? 'none' : '1px solid #E2E8F0'
                }}>
                  {msg.text}
                </div>
              ))}
              {isTyping && (
                <div style={{ alignSelf: 'flex-start', backgroundColor: '#FFFFFF', padding: '8px 14px', borderRadius: '12px', fontSize: '12px', color: '#64748B', fontStyle: 'italic', border: '1px solid #E2E8F0' }}>
                  {businessName} AI is typing...
                </div>
              )}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSendMessage} style={{ padding: '12px 16px', backgroundColor: '#FFFFFF', borderTop: '1px solid #E2E8F0', display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Test the AI (e.g. 'Can I book an appointment?')..."
                style={{
                  flex: 1,
                  padding: '10px 14px',
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
                  padding: '0 16px',
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

      {/* Footer */}
      <footer style={{ backgroundColor: '#0F172A', color: '#94A3B8', padding: '24px', textAlign: 'center', fontSize: '13px', marginTop: 'auto' }}>
        <p style={{ margin: 0 }}>© 2026 {businessName}. Powered by LeadFlow AI Lead Automation.</p>
      </footer>
    </div>
  );
};

export default ClientDemoPage;
