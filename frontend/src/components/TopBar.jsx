import React from 'react';

const TopBar = ({ title, subtitle, actionLabel, onAction, badge }) => {
  return (
    <div style={{ background: 'white', borderBottom: '1px solid var(--border)', padding: '20px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 600 }}>{title}</h1>
        {subtitle && <p style={{ margin: '4px 0 0', color: '#6B7280', fontSize: '14px' }}>{subtitle}</p>}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {badge && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#DCFCE7', color: '#166534', padding: '4px 12px', borderRadius: '16px', fontSize: '12px', fontWeight: 600 }}>
            <span style={{ width: '8px', height: '8px', backgroundColor: '#22C55E', borderRadius: '50%' }}></span>
            {badge}
          </div>
        )}
        {actionLabel && (
          <button className="btn-blue" onClick={onAction}>{actionLabel}</button>
        )}
      </div>
    </div>
  );
};

export default TopBar;
