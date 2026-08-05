import React from 'react';

const MetricCard = ({ label, value, icon: Icon, color }) => {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ fontSize: '32px', fontWeight: 700, color: '#111827' }}>{value}</div>
        <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: `${color}15`, color: color }}>
          <Icon size={20} />
        </div>
      </div>
      <div style={{ color: '#6B7280', fontSize: '14px', fontWeight: 500 }}>{label}</div>
    </div>
  );
};

export default MetricCard;
