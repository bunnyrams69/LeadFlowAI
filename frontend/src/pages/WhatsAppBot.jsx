import React, { useState, useEffect, useRef } from 'react';
import TopBar from '../components/TopBar';
import { MessageCircle, Send, Phone, CheckCheck, Bot, User, Sparkles } from 'lucide-react';
import { useToast } from '../hooks/useToast';

const WhatsAppBot = () => {
  const { showToast } = useToast();
  const chatEndRef = useRef(null);

  const [businessName, setBusinessName] = useState('Cognify AI');
  const [questions, setQuestions] = useState(
    'What is your budget?\nWhat is your timeline?\nWhat services are you interested in?'
  );
  const [personality, setPersonality] = useState('Professional');
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [leadScore, setLeadScore] = useState(null);

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: "Hello! 👋 Welcome to Cognify AI. I'm your AI assistant. How can we help scale your lead generation today?",
      time: '10:40 AM',
    },
    {
      id: 2,
      sender: 'lead',
      text: "Hi! I'm interested in automating our B2B outreach and lead qualification.",
      time: '10:41 AM',
    },
    {
      id: 3,
      sender: 'bot',
      text: 'Great! To recommend the best solution, what is your estimated monthly budget for lead generation?',
      time: '10:41 AM',
    },
    {
      id: 4,
      sender: 'lead',
      text: 'Our monthly budget is around $3,000 - $5,000.',
      time: '10:42 AM',
    },
    {
      id: 5,
      sender: 'bot',
      text: 'Got it. What is your expected timeline to launch outreach campaigns?',
      time: '10:42 AM',
    },
    {
      id: 6,
      sender: 'lead',
      text: 'We are looking to get started within the next 2 weeks.',
      time: '10:43 AM',
    },
    {
      id: 7,
      sender: 'bot',
      text: 'Awesome! 🎯 You qualify for our Growth Plan. Would you like to schedule a 15-minute live demo with our team?',
      time: '10:43 AM',
    },
  ]);

  // Auto-scroll phone chat to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSave = () => {
    if (showToast) {
      showToast(`WhatsApp Bot configuration for "${businessName}" saved successfully!`, 'success');
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userText = inputMessage.trim();
    const newMsg = {
      id: Date.now(),
      sender: 'lead',
      text: userText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputMessage('');
    setIsTyping(true);

    // Smart Bot AI Response Generator
    setTimeout(() => {
      let botReply = `Thanks for your message! A representative from ${businessName} will follow up shortly.`;
      const lower = userText.toLowerCase();

      if (lower.includes('yes') || lower.includes('sure') || lower.includes('book') || lower.includes('demo') || lower.includes('schedule')) {
        botReply = `Perfect! 📅 I've reserved a slot for you. A calendar invite has been sent to your email. We look forward to meeting you!`;
        setLeadScore({ score: 96, label: 'HIGHLY QUALIFIED LEAD 🟢' });
      } else if (lower.includes('budget') || lower.includes('$') || lower.includes('k') || lower.includes('cost') || lower.includes('price')) {
        botReply = `Got it! That fits perfectly within our Growth Package. What is your target launch timeline?`;
      } else if (lower.includes('week') || lower.includes('now') || lower.includes('month') || lower.includes('today') || lower.includes('soon')) {
        botReply = `Great timeline! ⚡ Should I go ahead and book a 15-minute onboarding call with ${businessName}'s founder?`;
      } else if (lower.includes('hi') || lower.includes('hello') || lower.includes('hey')) {
        botReply = `Hello! 👋 How can ${businessName} assist you with lead generation today?`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: botReply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setIsTyping(false);
    }, 900);
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
      <TopBar
        title="WhatsApp Bot"
        subtitle="Automate lead qualification via WhatsApp"
        badge="Live Demo"
      />

      <div style={{ padding: '32px', display: 'flex', gap: '32px', flex: 1, overflowY: 'auto' }}>
        {/* LEFT SIDE: WhatsApp Phone Mockup */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
          <div
            style={{
              width: '380px',
              height: '620px',
              borderRadius: '36px',
              border: '10px solid #1E293B',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: '#ECE5DD',
              position: 'relative',
            }}
          >
            {/* Phone Top Notch / Speaker */}
            <div
              style={{
                height: '24px',
                backgroundColor: '#1E293B',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <div style={{ width: '40px', height: '4px', backgroundColor: '#374151', borderRadius: '2px' }}></div>
              <div style={{ width: '8px', height: '8px', backgroundColor: '#374151', borderRadius: '50%' }}></div>
            </div>

            {/* WhatsApp Header */}
            <div
              style={{
                backgroundColor: '#075E54',
                padding: '10px 14px',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: '#25D366',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    color: 'white',
                    position: 'relative',
                  }}
                >
                  <Bot size={20} />
                  <span
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      width: '10px',
                      height: '10px',
                      backgroundColor: '#22C55E',
                      border: '2px solid #075E54',
                      borderRadius: '50%',
                    }}
                  ></span>
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '14px', lineHeight: 1.2 }}>
                    {businessName || 'Cognify AI'} Assistant
                  </div>
                  <div style={{ fontSize: '11px', color: '#A7F3D0' }}>Online • Automated Bot</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Phone size={18} style={{ cursor: 'pointer', opacity: 0.9 }} />
                <MessageCircle size={18} style={{ cursor: 'pointer', opacity: 0.9 }} />
              </div>
            </div>

            {/* Chat Conversation Area */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                backgroundColor: '#ECE5DD',
              }}
            >
              {/* Date Badge */}
              <div style={{ textAlign: 'center', margin: '4px 0' }}>
                <span
                  style={{
                    backgroundColor: '#E1F5FE',
                    color: '#0288D1',
                    fontSize: '10px',
                    fontWeight: 600,
                    padding: '3px 10px',
                    borderRadius: '10px',
                  }}
                >
                  TODAY
                </span>
              </div>

              {messages.map((msg) => {
                const isBot = msg.sender === 'bot';
                return (
                  <div
                    key={msg.id}
                    style={{
                      alignSelf: isBot ? 'flex-start' : 'flex-end',
                      maxWidth: '82%',
                      backgroundColor: isBot ? '#FFFFFF' : '#D9FDD3',
                      borderRadius: isBot ? '0px 12px 12px 12px' : '12px 0px 12px 12px',
                      padding: '8px 12px',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.12)',
                      fontSize: '13px',
                      lineHeight: '1.45',
                      color: '#111827',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
                      {isBot ? (
                        <span style={{ fontSize: '10px', fontWeight: 600, color: '#075E54', display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <Bot size={11} /> Bot
                        </span>
                      ) : (
                        <span style={{ fontSize: '10px', fontWeight: 600, color: '#166534', display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <User size={11} /> Lead
                        </span>
                      )}
                    </div>
                    <div>{msg.text}</div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        gap: '4px',
                        marginTop: '4px',
                        fontSize: '10px',
                        color: '#667781',
                      }}
                    >
                      <span>{msg.time}</span>
                      {!isBot && <CheckCheck size={14} color="#53BDEB" />}
                    </div>
                  </div>
                );
              })}

              {isTyping && (
                <div
                  style={{
                    alignSelf: 'flex-start',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '0px 12px 12px 12px',
                    padding: '8px 14px',
                    fontSize: '11px',
                    color: '#075E54',
                    fontWeight: 600,
                    boxShadow: '0 1px 2px rgba(0,0,0,0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Bot size={12} /> WhatsApp Bot is typing...
                </div>
              )}

              {leadScore && (
                <div style={{ textAlign: 'center', margin: '8px 0' }}>
                  <span
                    style={{
                      backgroundColor: '#DCFCE7',
                      color: '#166534',
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '5px 12px',
                      borderRadius: '12px',
                      border: '1px solid #86EFAC',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <Sparkles size={12} /> {leadScore.label} ({leadScore.score}/100)
                  </span>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Input Bar */}
            <form
              onSubmit={handleSendMessage}
              style={{
                padding: '8px 10px',
                backgroundColor: '#F0F0F0',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                borderTop: '1px solid #E0E0E0',
              }}
            >
              <input
                type="text"
                placeholder="Type a message..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                style={{
                  flex: 1,
                  padding: '8px 14px',
                  borderRadius: '20px',
                  border: '1px solid #E0E0E0',
                  outline: 'none',
                  fontSize: '13px',
                  backgroundColor: '#FFFFFF',
                }}
              />
              <button
                type="submit"
                style={{
                  backgroundColor: '#25D366',
                  border: 'none',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'white',
                  flexShrink: 0,
                }}
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT SIDE: Bot Configuration & Performance Stats */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Card 1: Bot Configuration */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#166534' }}>
                <Bot size={20} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>Bot Configuration</h3>
                <p style={{ margin: 0, fontSize: '13px', color: '#6B7280' }}>Customize lead qualification workflow</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>Business Name</label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Enter Business Name"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>Qualification Questions</label>
              <textarea
                value={questions}
                onChange={(e) => setQuestions(e.target.value)}
                rows={4}
                placeholder="Enter qualification questions (one per line)..."
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>Bot Personality</label>
              <select
                value={personality}
                onChange={(e) => setPersonality(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                  fontSize: '14px',
                  backgroundColor: 'white',
                  boxSizing: 'border-box',
                  cursor: 'pointer',
                }}
              >
                <option value="Professional">Professional</option>
                <option value="Friendly">Friendly</option>
                <option value="Casual">Casual</option>
              </select>
            </div>

            <button className="btn-blue" style={{ marginTop: '8px', width: '100%' }} onClick={handleSave}>
              Save Configuration
            </button>
          </div>

          {/* Card 2: Performance Stats */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>Performance Overview</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              <div
                style={{
                  backgroundColor: 'var(--bg-gray)',
                  padding: '16px',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '24px', fontWeight: 700, color: '#2563EB', marginBottom: '4px' }}>47</div>
                <div style={{ fontSize: '12px', color: '#6B7280', fontWeight: 500 }}>Leads Qualified</div>
              </div>

              <div
                style={{
                  backgroundColor: 'var(--bg-gray)',
                  padding: '16px',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '24px', fontWeight: 700, color: '#059669', marginBottom: '4px' }}>2.3s</div>
                <div style={{ fontSize: '12px', color: '#6B7280', fontWeight: 500 }}>Avg Response Time</div>
              </div>

              <div
                style={{
                  backgroundColor: 'var(--bg-gray)',
                  padding: '16px',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '24px', fontWeight: 700, color: '#D97706', marginBottom: '4px' }}>34%</div>
                <div style={{ fontSize: '12px', color: '#6B7280', fontWeight: 500 }}>Conversion Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppBot;
