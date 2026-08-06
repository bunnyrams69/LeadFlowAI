import React from 'react';
import { Mail, Inbox } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LeadsTable = ({ leads, loading }) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="card">
        <div style={{ textAlign: 'center', padding: '40px', color: '#6B7280' }}>Loading leads...</div>
      </div>
    );
  }

  if (!leads || leads.length === 0) {
    return (
      <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', gap: '16px' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Inbox size={32} color="#9CA3AF" />
        </div>
        <h3 style={{ margin: 0, fontSize: '18px' }}>No leads yet</h3>
        <div style={{ fontSize: '14px', color: '#6B7280' }}>Run a scrape to get started</div>
        <button className="btn-blue" onClick={() => navigate('/linkedin')}>Go to LinkedIn Scraper</button>
      </div>
    );
  }

  return (
    <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
      <table>
        <thead style={{ backgroundColor: '#F9FAFB' }}>
          <tr>
            <th style={{ fontSize: '12px', color: '#6B7280', textTransform: 'uppercase' }}>Name</th>
            <th style={{ fontSize: '12px', color: '#6B7280', textTransform: 'uppercase' }}>Source</th>
            <th style={{ fontSize: '12px', color: '#6B7280', textTransform: 'uppercase' }}>Company</th>
            <th style={{ fontSize: '12px', color: '#6B7280', textTransform: 'uppercase' }}>Role</th>
            <th style={{ fontSize: '12px', color: '#6B7280', textTransform: 'uppercase' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead, i) => (
            <tr key={i}>
              <td style={{ fontWeight: 500 }}>{lead.name}</td>
              <td>
                {lead.profile_url ? (
                  <a href={lead.profile_url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }} title="View Profile">
                    <span className={`tag tag-${lead.source.toLowerCase()}`} style={{ cursor: 'pointer' }}>{lead.source}</span>
                  </a>
                ) : (
                  <span className={`tag tag-${lead.source.toLowerCase()}`}>{lead.source}</span>
                )}
              </td>
              <td>{lead.company}</td>
              <td style={{ color: '#6B7280' }}>{lead.title}</td>
              <td>
                <button className="btn-blue" style={{ fontSize: '12px', padding: '6px 12px' }} onClick={() => navigate('/email', { state: { lead } })}>
                  <Mail size={14} /> Write Email
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeadsTable;
