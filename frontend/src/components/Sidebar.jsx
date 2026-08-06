import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Briefcase, Camera, Mail, Share2, MessageSquare, Zap, Clapperboard } from 'lucide-react';

const Sidebar = () => {
  const docsCount = parseInt(localStorage.getItem('rag_docs_count') || '0');

  const navItems = [
    { section: 'MODULES', items: [
      { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/linkedin', label: 'LinkedIn Scraper', icon: Briefcase },
      { path: '/instagram', label: 'Instagram Scraper', icon: Camera },
      { path: '/email', label: 'Email Writer', icon: Mail },
      { path: '/post', label: 'Post Automation', icon: Share2 },
      { path: '/studio', label: 'Content Studio', icon: Clapperboard }
    ]}
  ];

  const aiItems = [
    { section: 'AI', items: [
      { path: '/chat', label: 'RAG Chatbot', icon: MessageSquare, hasDocs: docsCount > 0 }
    ]}
  ];

  const renderNavItems = (group, idx) => (
    <div key={idx} style={{ marginBottom: '22px' }}>
      <div style={{ padding: '0 20px', fontSize: '10px', color: '#64748B', fontWeight: 800, letterSpacing: '1.2px', textTransform: 'uppercase', marginBottom: '10px', fontFamily: 'var(--font-display)' }}>
        {group.section}
      </div>
      {group.items.map((item) => (
        <NavLink 
          key={item.path} 
          to={item.path}
          style={({ isActive }) => ({
            display: 'flex', alignItems: 'center', gap: '12px', padding: '11px 20px',
            color: isActive ? '#FFFFFF' : '#94A3B8',
            background: isActive ? 'linear-gradient(90deg, rgba(99,102,241,0.2) 0%, rgba(99,102,241,0.05) 100%)' : 'transparent',
            borderLeft: isActive ? '3.5px solid #818CF8' : '3.5px solid transparent',
            textDecoration: 'none',
            fontSize: '13.5px',
            fontFamily: 'var(--font-display)',
            fontWeight: isActive ? 700 : 500,
            boxShadow: isActive ? 'inset 0 1px 0 rgba(255,255,255,0.1)' : 'none',
            transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
          })}
          onMouseEnter={(e) => { if (!e.currentTarget.className.includes('active')) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'; }}
          onMouseLeave={(e) => { if (!e.currentTarget.className.includes('active')) e.currentTarget.style.backgroundColor = 'transparent'; }}
        >
          <item.icon size={18} color={item.path === window.location.pathname ? '#818CF8' : '#94A3B8'} /> 
          <span style={{ flex: 1 }}>{item.label}</span>
          {item.hasDocs && <span style={{ width: 7, height: 7, backgroundColor: '#38BDF8', borderRadius: '50%', boxShadow: '0 0 8px #38BDF8' }}></span>}
        </NavLink>
      ))}
    </div>
  );

  return (
    <div style={{ width: '230px', background: 'linear-gradient(180deg, #0B0F19 0%, #111827 100%)', color: 'white', display: 'flex', flexDirection: 'column', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ fontSize: '20px', fontWeight: 800, fontFamily: 'var(--font-display)', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(245,158,11,0.3)' }}>
            <Zap size={20} color="#FFFFFF" />
          </div>
          <span className="text-gradient-indigo">LeadFlow AI</span>
        </div>
        <div style={{ fontSize: '11px', color: '#64748B', marginTop: '6px', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>by Cognify AI • Hyderabad</div>
      </div>
      
      <div style={{ flex: 1, padding: '16px 0' }}>
        {navItems.map(renderNavItems)}
        <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.06)', margin: '0 20px 20px' }}></div>
        {aiItems.map(renderNavItems)}
      </div>
    </div>
  );
};

export default Sidebar;
