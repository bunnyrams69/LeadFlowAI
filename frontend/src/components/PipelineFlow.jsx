import React from 'react';
import { Search, Mail, Share2, MessageSquare, ArrowRight } from 'lucide-react';

const PipelineFlow = ({ activeStep = -1 }) => {
  const steps = [
    { id: 0, label: 'Scrape', sub: 'LinkedIn/Insta', icon: Search },
    { id: 1, label: 'Personalize', sub: 'Email Writer', icon: Mail },
    { id: 2, label: 'Automate', sub: 'Post Publishing', icon: Share2 },
    { id: 3, label: 'Engage', sub: 'RAG Chatbot', icon: MessageSquare }
  ];

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '30px 20px' }}>
      {steps.map((step, idx) => (
        <React.Fragment key={step.id}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', opacity: activeStep === -1 || activeStep >= step.id ? 1 : 0.4 }}>
            <div className={activeStep === step.id ? 'pulse-active' : ''} style={{ 
              width: '60px', height: '60px', borderRadius: '50%', 
              backgroundColor: activeStep === step.id ? 'var(--blue)' : 'white',
              border: '2px solid var(--border)',
              borderColor: activeStep > step.id ? 'var(--blue)' : 'var(--border)',
              display: 'flex', justifyContent: 'center', alignItems: 'center',
              color: activeStep === step.id ? 'white' : (activeStep > step.id ? 'var(--blue)' : '#6B7280'),
              transition: 'all 0.3s'
            }}>
              <step.icon size={24} />
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: 600, fontSize: '14px' }}>{step.label}</div>
              <div style={{ fontSize: '12px', color: '#6B7280' }}>{step.sub}</div>
            </div>
          </div>
          {idx < steps.length - 1 && (
            <div style={{ flex: 1, height: '2px', backgroundColor: activeStep > idx ? 'var(--blue)' : 'var(--border)', margin: '0 20px', marginBottom: '40px', position: 'relative' }}>
               {activeStep === idx && <div className="travel-dot"></div>}
               <ArrowRight size={16} color={activeStep > idx ? 'var(--blue)' : '#9CA3AF'} style={{ position: 'absolute', right: '-8px', top: '-7px' }} />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default PipelineFlow;
