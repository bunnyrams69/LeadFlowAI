import React from 'react';

const MetricCard = ({ label, value, icon: Icon, color }) => {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderTop: `4px solid ${color || 'var(--indigo)'}`, position: 'relative', overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '32px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#0F172A', letterSpacing: '-0.02em' }}>{value}</div>
        <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: `radial-gradient(circle, ${color}25 0%, transparent 80%)`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: color }}>
          <Icon size={22} />
        </div>
      </div>
      <div style={{ color: '#64748B', fontSize: '13px', fontWeight: 600, fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
    </div>
  );
};

export default MetricCard;
