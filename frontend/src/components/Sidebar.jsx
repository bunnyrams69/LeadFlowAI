import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Briefcase, Camera, Mail, Share2, MessageSquare, Zap, Phone } from 'lucide-react';

const Sidebar = () => {
  const docsCount = parseInt(localStorage.getItem('rag_docs_count') || '0');

  const navItems = [
    { section: 'MODULES', items: [
      { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/linkedin', label: 'LinkedIn Scraper', icon: Briefcase },
      { path: '/instagram', label: 'Instagram Scraper', icon: Camera },
      { path: '/email', label: 'Email Writer', icon: Mail },
      { path: '/post', label: 'Post Automation', icon: Share2 },
      { path: '/whatsapp', label: 'WhatsApp Bot', icon: Phone }
    ]}
  ];

  const aiItems = [
    { section: 'AI', items: [
      { path: '/chat', label: 'RAG Chatbot', icon: MessageSquare, hasDocs: docsCount > 0 }
    ]}
  ];

  const renderNavItems = (group, idx) => (
    <div key={idx} style={{ marginBottom: '20px' }}>
      <div style={{ padding: '0 20px', fontSize: '11px', color: '#6B7280', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '8px' }}>
        {group.section}
      </div>
      {group.items.map((item) => (
        <NavLink 
          key={item.path} 
          to={item.path}
          style={({ isActive }) => ({
            display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 20px',
            color: isActive ? 'white' : '#9CA3AF',
            backgroundColor: isActive ? 'rgba(37,99,235,0.1)' : 'transparent',
            borderLeft: isActive ? '4px solid var(--blue)' : '4px solid transparent',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: isActive ? 600 : 400,
            transition: 'background 0.15s ease'
          })}
          onMouseEnter={(e) => { if (e.currentTarget.style.backgroundColor === 'transparent') e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'; }}
          onMouseLeave={(e) => { if (e.currentTarget.style.backgroundColor === 'rgba(255, 255, 255, 0.05)' || e.currentTarget.style.backgroundColor === 'rgba(255,255,255,0.05)') e.currentTarget.style.backgroundColor = 'transparent'; }}
        >
          <item.icon size={18} /> 
          <span style={{ flex: 1 }}>{item.label}</span>
          {item.hasDocs && <span style={{ width: 8, height: 8, backgroundColor: 'var(--blue)', borderRadius: '50%' }}></span>}
        </NavLink>
      ))}
    </div>
  );

  return (
    <div style={{ width: '220px', backgroundColor: 'var(--navy)', color: 'white', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '20px' }}>
        <div style={{ fontSize: '20px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Zap size={24} color="#FBBF24" /> LeadFlow AI
        </div>
        <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '4px' }}>by Cognify AI</div>
      </div>
      
      <div style={{ flex: 1, padding: '10px 0' }}>
        {navItems.map(renderNavItems)}
        <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.1)', margin: '0 20px 20px' }}></div>
        {aiItems.map(renderNavItems)}
      </div>
    </div>
  );
};

export default Sidebar;
