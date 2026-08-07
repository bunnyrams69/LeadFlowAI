import React from 'react';

const TopBar = ({ title, subtitle, actionLabel, onAction, badge }) => {
  return (
    <div className="glass" style={{ background: 'rgba(255, 255, 255, 0.95)', borderBottom: '1px solid var(--border)', padding: '20px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10, boxSizing: 'border-box', width: '100%' }}>
      <div style={{ flex: 1, minWidth: 0, paddingRight: '16px' }}>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 800, fontFamily: 'var(--font-display)', color: '#0F172A', letterSpacing: '-0.03em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</h1>
        {subtitle && <p style={{ margin: '4px 0 0', color: '#64748B', fontSize: '13.5px', fontFamily: 'var(--font-body)', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{subtitle}</p>}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
        {badge && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#F0FDF4', color: '#15803D', border: '1px solid #BBF7D0', padding: '5px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 700, fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' }}>
            <span style={{ width: '8px', height: '8px', backgroundColor: '#22C55E', borderRadius: '50%', boxShadow: '0 0 8px #22C55E' }}></span>
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
