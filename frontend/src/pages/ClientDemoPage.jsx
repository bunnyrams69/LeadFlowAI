import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { 
  Bot, Send, Phone, MapPin, Star, ShieldCheck, Sparkles, Calendar, 
  CheckCircle2, MessageSquare, Clock, ArrowRight, Check, ChevronDown, 
  HelpCircle, User, Award, Zap, PhoneCall
} from 'lucide-react';

const ClientDemoPage = () => {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();

  // Format business details from slug (e.g. "shree-properties-vadodara")
  const rawTitle = slug ? slug.replace(/-/g, ' ') : 'Premier Business Solutions';
  const words = rawTitle.split(' ');
  const capitalizedTitle = words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  const [businessName, setBusinessName] = useState(capitalizedTitle);
  const [city, setCity] = useState(searchParams.get('city') || 'Vadodara');
  const [category, setCategory] = useState(searchParams.get('category') || 'Real Estate & Commercial');
  const [phone, setPhone] = useState(searchParams.get('phone') || '+91 98201 92831');

  // Booking Modal State
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingName, setBookingName] = useState('');
  const [bookingPhone, setBookingPhone] = useState('');
  const [bookingDate, setBookingDate] = useState('2026-08-21');
  const [bookingTime, setBookingTime] = useState('11:00 AM');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState(0);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('leadhunter_leads') || '[]');
      const match = saved.find(l => (l.name || '').toLowerCase().replace(/[^a-z0-9]/g, '-') === slug || (l.demoUrl || '').includes(slug));
      if (match) {
        setBusinessName(match.name);
        setCity(match.city || 'Vadodara');
        setCategory(match.category || 'Real Estate & Commercial');
        setPhone(match.phone || '+91 98201 92831');
      }
    } catch (e) {
      console.log(e);
    }
  }, [slug]);

  // Chat State
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'bot',
      text: `Hello! 👋 Welcome to ${businessName}. I'm your 24/7 AI Lead Assistant. How can I help you with ${category} today?`
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const quickPrompts = [
    '📅 Book an appointment',
    '💰 Pricing & packages',
    '📍 Office location & hours',
    '📞 Talk to an expert'
  ];

  const handleSendMessage = (textToSend) => {
    const query = typeof textToSend === 'string' ? textToSend : inputMessage;
    if (!query.trim()) return;

    setChatMessages(prev => [...prev, { sender: 'user', text: query }]);
    setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      let botReply = `Thank you for your message! Our team at ${businessName} has received your inquiry. We will contact you at ${phone} within 10 minutes.`;
      
      const lower = query.toLowerCase();
      if (lower.includes('book') || lower.includes('appointment') || lower.includes('schedule')) {
        botReply = `I'd love to schedule your appointment with our senior consultant! Click the 'Book Appointment' button on this page or reply with your preferred date and time. 📅`;
      } else if (lower.includes('price') || lower.includes('cost') || lower.includes('package')) {
        botReply = `Our pricing packages for ${category} start from budget-friendly options to premium turnkey solutions. I can send an instant quotation directly to your WhatsApp at ${phone}! 💬`;
      } else if (lower.includes('location') || lower.includes('hours') || lower.includes('where')) {
        botReply = `We are located in ${city}, India. Our offices are open Mon-Sat 9:30 AM to 7:00 PM, and our 24/7 AI portal is always online! 📍`;
      } else if (lower.includes('talk') || lower.includes('expert') || lower.includes('call')) {
        botReply = `You can reach our direct line immediately at ${phone} or leave your number here and we will call you right now! 📞`;
      }

      setChatMessages(prev => [...prev, { sender: 'bot', text: botReply }]);
      setIsTyping(false);
    }, 600);
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    setBookingSuccess(true);
    setTimeout(() => {
      setShowBookingModal(false);
      setBookingSuccess(false);
      setChatMessages(prev => [
        ...prev,
        {
          sender: 'bot',
          text: `🎉 Appointment confirmed for ${bookingName} on ${bookingDate} at ${bookingTime}! A confirmation has been sent to ${bookingPhone}.`
        }
      ]);
    }, 1200);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC', color: '#0F172A', fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", overflowY: 'auto' }}>
      
      {/* Top Client Prototype Notice Banner */}
      <div style={{
        backgroundColor: '#1E1B4B',
        color: '#E0E7FF',
        padding: '12px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '13px',
        flexWrap: 'wrap',
        gap: '10px',
        borderBottom: '1px solid #3730A3',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={16} color="#A5B4FC" />
          <span><strong>Live Interactive Demo:</strong> Prepared for <strong>{businessName}</strong> ({city}).</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <a href={`tel:${phone.replace(/[^0-9+]/g, '')}`} style={{ color: '#38BDF8', textDecoration: 'none', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Phone size={13} /> Call {phone}
          </a>
          <button
            onClick={() => setShowBookingModal(true)}
            style={{
              backgroundColor: '#4F46E5',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              padding: '5px 14px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Calendar size={13} /> Book Consultation
          </button>
        </div>
      </div>

      {/* Hero Header */}
      <header style={{
        background: 'radial-gradient(circle at top, #1E1B4B 0%, #0F172A 70%)',
        color: 'white',
        padding: '70px 24px 60px',
        textAlign: 'center',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '840px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: 'rgba(99, 102, 241, 0.2)',
            border: '1px solid rgba(129, 140, 248, 0.3)',
            padding: '6px 18px',
            borderRadius: '24px',
            fontSize: '12.5px',
            color: '#A5B4FC',
            fontWeight: 700,
            marginBottom: '24px'
          }}>
            <ShieldCheck size={15} /> Verified {category} Provider in {city}
          </div>

          <h1 style={{ fontSize: '42px', fontWeight: 800, margin: '0 0 16px', letterSpacing: '-0.03em', lineHeight: 1.15 }}>
            {businessName}
          </h1>
          <p style={{ fontSize: '18px', color: '#94A3B8', margin: '0 auto 32px', lineHeight: 1.6, maxWidth: '680px' }}>
            Experience the future of client services in {city}. Automated 24/7 lead inquiries, instant WhatsApp scheduling, and premier customer support.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '32px' }}>
            <button
              onClick={() => setShowBookingModal(true)}
              style={{
                backgroundColor: '#4F46E5',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                padding: '14px 28px',
                fontSize: '15px',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 10px 20px -5px rgba(79, 70, 229, 0.5)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Calendar size={18} /> Schedule Appointment <ArrowRight size={16} />
            </button>
            <a
              href={`https://wa.me/91${phone.replace(/[^0-9]/g, '').slice(-10)}?text=${encodeURIComponent(`Hi ${businessName}! I am interested in your ${category} services.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'none' }}
            >
              <button
                style={{
                  backgroundColor: '#22C55E',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '14px 24px',
                  fontSize: '15px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <MessageSquare size={18} /> Chat on WhatsApp
              </button>
            </a>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(255,255,255,0.08)', padding: '8px 16px', borderRadius: '10px', fontSize: '13px', color: '#CBD5E1' }}>
              <Phone size={14} color="#38BDF8" /> {phone}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(255,255,255,0.08)', padding: '8px 16px', borderRadius: '10px', fontSize: '13px', color: '#CBD5E1' }}>
              <MapPin size={14} color="#F472B6" /> {city}, India
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(255,255,255,0.08)', padding: '8px 16px', borderRadius: '10px', fontSize: '13px', color: '#CBD5E1' }}>
              <Star size={14} color="#FBBF24" fill="#FBBF24" /> 4.9 Rating (48+ Reviews)
            </div>
          </div>
        </div>
      </header>

      {/* Main Interactive Container */}
      <main style={{ maxWidth: '1140px', margin: '0 auto', padding: '50px 24px', display: 'flex', flexDirection: 'column', gap: '60px' }}>
        
        {/* Section 1: Interactive Chatbot & Value Props */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '36px', alignItems: 'start' }}>
          
          {/* Left: Why Choose Us */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <span style={{ fontSize: '12px', fontWeight: 800, color: '#4F46E5', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Automated 24/7 Client Experience
              </span>
              <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#0F172A', margin: '8px 0 12px', letterSpacing: '-0.02em' }}>
                Why Clients Choose {businessName}
              </h2>
              <p style={{ fontSize: '15px', color: '#64748B', lineHeight: 1.6, margin: 0 }}>
                We combine industry-leading {category} expertise with instant digital automation, ensuring you get transparent quotes, quick answers, and priority bookings.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '20px', display: 'flex', gap: '16px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4F46E5', flexShrink: 0 }}>
                  <Zap size={22} />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '16px', color: '#0F172A' }}>Instant Response in Under 60 Seconds</div>
                  <div style={{ fontSize: '13.5px', color: '#64748B', marginTop: '4px', lineHeight: 1.5 }}>
                    No more waiting for callbacks. Our 24/7 AI handles property inquiries, schedules tours, and answers FAQs on the spot.
                  </div>
                </div>
              </div>

              <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '20px', display: 'flex', gap: '16px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981', flexShrink: 0 }}>
                  <Award size={22} />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '16px', color: '#0F172A' }}>Verified Expertise in {city}</div>
                  <div style={{ fontSize: '13.5px', color: '#64748B', marginTop: '4px', lineHeight: 1.5 }}>
                    Over a decade of trusted client satisfaction with 100% verified documentation and honest consultation.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Live Interactive AI Chatbot Widget */}
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1.5px solid #CBD5E1',
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 20px 40px -10px rgba(0,0,0,0.08)',
            display: 'flex',
            flexDirection: 'column',
            height: '480px'
          }}>
            {/* Chatbot Header */}
            <div style={{ backgroundColor: '#0F172A', color: 'white', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#22C55E', boxShadow: '0 0 8px #22C55E' }}></div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '14.5px' }}>{businessName} AI Assistant</div>
                  <div style={{ fontSize: '11.5px', color: '#94A3B8' }}>24/7 Smart Booking & Query Desk</div>
                </div>
              </div>
              <button
                onClick={() => setChatMessages([{ sender: 'bot', text: `Hello! I'm your assistant for ${businessName}. How may I help you?` }])}
                style={{ background: 'transparent', border: 'none', color: '#94A3B8', fontSize: '11px', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Clear
              </button>
            </div>

            {/* Chat Messages */}
            <div style={{ flex: 1, padding: '18px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', backgroundColor: '#F8FAFC' }}>
              {chatMessages.map((msg, i) => (
                <div key={i} style={{
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  backgroundColor: msg.sender === 'user' ? '#4F46E5' : '#FFFFFF',
                  color: msg.sender === 'user' ? '#FFFFFF' : '#0F172A',
                  padding: '11px 16px',
                  borderRadius: msg.sender === 'user' ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                  fontSize: '13.5px',
                  maxWidth: '85%',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                  lineHeight: 1.45,
                  border: msg.sender === 'user' ? 'none' : '1px solid #E2E8F0'
                }}>
                  {msg.text}
                </div>
              ))}
              {isTyping && (
                <div style={{ alignSelf: 'flex-start', backgroundColor: '#FFFFFF', padding: '9px 16px', borderRadius: '14px', fontSize: '12.5px', color: '#64748B', fontStyle: 'italic', border: '1px solid #E2E8F0' }}>
                  {businessName} AI is preparing reply...
                </div>
              )}
            </div>

            {/* Quick Prompt Chips */}
            <div style={{ padding: '8px 16px', backgroundColor: '#FFFFFF', borderTop: '1px solid #F1F5F9', display: 'flex', gap: '6px', overflowX: 'auto' }}>
              {quickPrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(p)}
                  style={{
                    backgroundColor: '#EEF2FF',
                    color: '#4F46E5',
                    border: '1px solid #C7D2FE',
                    borderRadius: '16px',
                    padding: '4px 10px',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} style={{ padding: '12px 16px', backgroundColor: '#FFFFFF', borderTop: '1px solid #E2E8F0', display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask about properties, pricing, or bookings..."
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  border: '1px solid #CBD5E1',
                  borderRadius: '10px',
                  fontSize: '13.5px',
                  outline: 'none'
                }}
              />
              <button
                type="submit"
                style={{
                  backgroundColor: '#4F46E5',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '0 18px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Send size={16} />
              </button>
            </form>
          </div>

        </section>

        {/* Section 2: Services / Offerings Grid */}
        <section>
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#4F46E5', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Our Specialized Offerings
            </span>
            <h2 style={{ fontSize: '30px', fontWeight: 800, color: '#0F172A', margin: '8px 0 0', letterSpacing: '-0.02em' }}>
              Services Provided by {businessName}
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {[
              {
                title: `Premium ${category} Consultation`,
                desc: `Comprehensive strategic consultation tailored to clients in ${city} with complete transparency.`,
                icon: <Building2Icon />
              },
              {
                title: 'VIP Client Representation',
                desc: 'Dedicated account manager handling legal verification, negotiations, and priority closings.',
                icon: <User size={24} color="#10B981" />
              },
              {
                title: '24/7 Digital Portfolio & Inquiries',
                desc: 'Browse available listings and receive automated document summaries instantly on WhatsApp.',
                icon: <Sparkles size={24} color="#F59E0B" />
              }
            ].map((s, idx) => (
              <div key={idx} style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '16px',
                padding: '28px 24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)'
              }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {s.icon}
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: '4px 0 0' }}>{s.title}</h3>
                <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.5, margin: 0 }}>{s.desc}</p>
                <button
                  onClick={() => setShowBookingModal(true)}
                  style={{
                    marginTop: 'auto',
                    padding: '8px 0',
                    background: 'none',
                    border: 'none',
                    color: '#4F46E5',
                    fontWeight: 700,
                    fontSize: '13.5px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  Inquire Now <ArrowRight size={14} />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Frequently Asked Questions (Interactive Accordion) */}
        <section style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2 style={{ fontSize: '26px', fontWeight: 800, color: '#0F172A', margin: 0 }}>Frequently Asked Questions</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              {
                q: `How do I schedule an appointment with ${businessName}?`,
                a: `You can schedule an appointment in 1 click using our 'Book Consultation' button on this page, or simply ask our 24/7 AI Assistant above!`
              },
              {
                q: `Where is your office located in ${city}?`,
                a: `We are conveniently located in the prime commercial hub of ${city}, India. Walk-ins and scheduled appointments are both welcome.`
              },
              {
                q: `Can I receive project brochures directly on WhatsApp?`,
                a: `Yes! Our automated system sends PDF brochures and pricing sheets directly to your WhatsApp number within seconds.`
              }
            ].map((faq, index) => (
              <div
                key={index}
                onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '14px',
                  padding: '18px 20px',
                  cursor: 'pointer',
                  userSelect: 'none'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontWeight: 800, fontSize: '15px', color: '#0F172A' }}>{faq.q}</div>
                  <ChevronDown size={18} color="#64748B" style={{ transform: openFaq === index ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                </div>
                {openFaq === index && (
                  <div style={{ fontSize: '14px', color: '#64748B', marginTop: '12px', lineHeight: 1.5, borderTop: '1px solid #F1F5F9', paddingTop: '12px' }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* Booking Modal Popup */}
      {showBookingModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.7)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            maxWidth: '480px',
            width: '100%',
            padding: '28px',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
            border: '1px solid #E2E8F0'
          }}>
            {bookingSuccess ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <CheckCircle2 size={54} color="#10B981" style={{ margin: '0 auto 16px' }} />
                <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A', margin: '0 0 8px' }}>Appointment Scheduled!</h3>
                <p style={{ fontSize: '14px', color: '#64748B', margin: 0 }}>
                  We look forward to meeting you on {bookingDate} at {bookingTime}.
                </p>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <div>
                    <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: 0 }}>Book Consultation</h3>
                    <p style={{ fontSize: '12.5px', color: '#64748B', margin: '4px 0 0' }}>With {businessName} ({city})</p>
                  </div>
                  <button onClick={() => setShowBookingModal(false)} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
                    ✕
                  </button>
                </div>

                <form onSubmit={handleBookingSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>YOUR NAME</label>
                    <input
                      type="text"
                      required
                      value={bookingName}
                      onChange={(e) => setBookingName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13.5px', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>PHONE / WHATSAPP</label>
                    <input
                      type="tel"
                      required
                      value={bookingPhone}
                      onChange={(e) => setBookingPhone(e.target.value)}
                      placeholder="e.g. +91 98201 92831"
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13.5px', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>DATE</label>
                      <input
                        type="date"
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>TIME</label>
                      <select
                        value={bookingTime}
                        onChange={(e) => setBookingTime(e.target.value)}
                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px', boxSizing: 'border-box' }}
                      >
                        <option>10:00 AM</option>
                        <option>11:30 AM</option>
                        <option>2:00 PM</option>
                        <option>4:30 PM</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    style={{
                      backgroundColor: '#4F46E5',
                      color: 'white',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '12px',
                      fontSize: '14px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      marginTop: '8px'
                    }}
                  >
                    Confirm Booking
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer style={{ backgroundColor: '#0F172A', color: '#94A3B8', padding: '36px 24px', textAlign: 'center', fontSize: '13.5px', borderTop: '1px solid #1E293B' }}>
        <p style={{ margin: 0 }}>© 2026 {businessName} • All rights reserved. Automated by LeadFlow AI Lead Engine.</p>
      </footer>
    </div>
  );
};

const Building2Icon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/>
    <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/>
    <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/>
    <path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/>
  </svg>
);

export default ClientDemoPage;
