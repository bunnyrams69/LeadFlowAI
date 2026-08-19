import React, { useState } from 'react';
import { X, Calendar, Clock, Mail, CheckCircle2, ArrowRight, MessageSquare, Send, ShieldAlert, Sparkles } from 'lucide-react';

const FollowUpEngineModal = ({ lead, onClose, onUpdateLead }) => {
  const [selectedDay, setSelectedDay] = useState(0);
  const [currentLead, setCurrentLead] = useState(lead);

  if (!lead) return null;

  const followups = currentLead.followups || {
    day0: { day: 0, label: 'Initial Outreach', subject: currentLead.emailSubject, body: currentLead.emailBody, status: 'Completed / Sent' },
    day3: { day: 3, label: 'Follow-Up #1 (Demo Check)', subject: `Re: ${currentLead.name} - did you see the demo?`, body: `Hey,\n\nJust checking if you saw the live demo I built for ${currentLead.name}...\n\n👉 ${currentLead.demoUrl}`, status: 'Scheduled (Day 3)' },
    day7: { day: 7, label: 'Follow-Up #2 (Client Proof)', subject: `Case study for ${currentLead.name}`, body: `Hey,\n\nWanted to share how similar businesses in ${currentLead.city} saw 3x bookings with this AI bot...\n\nDemo: ${currentLead.demoUrl}`, status: 'Scheduled (Day 7)' },
    day10: { day: 10, label: 'Final Break-Up Email', subject: `Closing file on ${currentLead.name}`, body: `Hey,\n\nAssuming you're all set, I won't follow up again. Your demo remains archived here:\n\n${currentLead.demoUrl}`, status: 'Scheduled (Day 10)' }
  };

  const stages = [
    { key: 'day0', day: 0, title: 'Day 0: Initial Pitch', desc: 'Personalized cold email + live demo link', data: followups.day0 },
    { key: 'day3', day: 3, title: 'Day 3: Demo Reminder', desc: 'Friendly reminder to review live prototype', data: followups.day3 },
    { key: 'day7', day: 7, title: 'Day 7: Case Study', desc: 'ROI proof + urgency hook', data: followups.day7 },
    { key: 'day10', day: 10, title: 'Day 10: Break-Up', desc: 'Final close-out; auto-marks as Cold if no reply', data: followups.day10 }
  ];

  const handleAdvanceSequence = (targetDay) => {
    const updated = { ...currentLead, currentFollowupDay: targetDay };
    setCurrentLead(updated);
    setSelectedDay(targetDay);
    if (onUpdateLead) onUpdateLead(updated);
  };

  const activeStage = stages.find(s => s.day === selectedDay) || stages[0];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '24px'
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '20px',
        width: '100%',
        maxWidth: '900px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        border: '1px solid var(--border)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          backgroundColor: '#0F172A',
          color: 'white',
          padding: '18px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #334155'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={18} color="#818CF8" />
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800, letterSpacing: '-0.02em' }}>
                4-Stage Follow-Up Sequence: {currentLead.name}
              </h2>
            </div>
            <p style={{ margin: '4px 0 0', fontSize: '12.5px', color: '#94A3B8' }}>
              Automated cadence: Day 0 ➔ Day 3 ➔ Day 7 ➔ Day 10 (auto-stops upon client reply)
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Timeline Progression Bar */}
        <div style={{ backgroundColor: '#F8FAFC', padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
            {stages.map((stage, idx) => {
              const isSelected = selectedDay === stage.day;
              const isCurrentOrPassed = currentLead.currentFollowupDay >= stage.day;
              return (
                <div
                  key={idx}
                  onClick={() => setSelectedDay(stage.day)}
                  style={{
                    backgroundColor: isSelected ? '#EEF2FF' : '#FFFFFF',
                    border: `1.5px solid ${isSelected ? '#6366F1' : isCurrentOrPassed ? '#BBF7D0' : '#E2E8F0'}`,
                    borderRadius: '12px',
                    padding: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 800,
                      color: isSelected ? '#4F46E5' : '#64748B',
                      fontFamily: 'var(--font-mono)'
                    }}>
                      DAY {stage.day}
                    </span>
                    {isCurrentOrPassed ? (
                      <CheckCircle2 size={14} color="#10B981" />
                    ) : (
                      <Clock size={14} color="#94A3B8" />
                    )}
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>{stage.title.split(':')[1]}</div>
                  <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>{stage.desc}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Active Stage Body */}
        <div style={{ padding: '24px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#4F46E5', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Stage Details (Day {activeStage.day})
              </span>
              <h3 style={{ margin: '2px 0 0', fontSize: '16px', fontWeight: 800, color: '#0F172A' }}>
                {activeStage.data.subject || `Follow-up on ${currentLead.name}`}
              </h3>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              {currentLead.currentFollowupDay !== activeStage.day && (
                <button
                  onClick={() => handleAdvanceSequence(activeStage.day)}
                  className="btn-demo"
                  style={{ fontSize: '12px', padding: '6px 12px' }}
                >
                  Set Active Stage to Day {activeStage.day}
                </button>
              )}
            </div>
          </div>

          {/* Email Draft Box */}
          <div className="card" style={{ padding: '16px', backgroundColor: '#FFFFFF' }}>
            <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 600, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Mail size={14} color="#2563EB" /> Cold Email Content:
            </div>
            <div style={{
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '8px',
              padding: '14px',
              fontSize: '13.5px',
              fontFamily: 'monospace',
              whiteSpace: 'pre-wrap',
              lineHeight: 1.5,
              color: '#1E293B'
            }}>
              {activeStage.data.body}
            </div>
          </div>

          {/* Rule Card */}
          <div style={{
            backgroundColor: activeStage.day === 10 ? '#FEF2F2' : '#F0FDF4',
            border: `1px solid ${activeStage.day === 10 ? '#FECACA' : '#BBF7D0'}`,
            borderRadius: '12px',
            padding: '14px',
            fontSize: '12.5px',
            color: activeStage.day === 10 ? '#991B1B' : '#166534',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            {activeStage.day === 10 ? <ShieldAlert size={18} /> : <Sparkles size={18} />}
            <div>
              {activeStage.day === 10 ? (
                <span><strong>Auto-Archive Trigger:</strong> If no response is received by Day 10, LeadHunter AI will automatically mark <strong>{currentLead.name}</strong> as <em>COLD</em> and archive the lead.</span>
              ) : (
                <span><strong>Smart Pause Logic:</strong> As soon as the prospect replies or clicks the demo link, the follow-up loop immediately pauses and alerts you to book the strategy call!</span>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          backgroundColor: '#F8FAFC',
          borderTop: '1px solid var(--border)',
          padding: '14px 24px',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '12px'
        }}>
          <button onClick={onClose} className="btn-demo">Close</button>
        </div>
      </div>
    </div>
  );
};

export default FollowUpEngineModal;
