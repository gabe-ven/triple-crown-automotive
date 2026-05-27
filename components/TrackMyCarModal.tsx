'use client';

import React, { useState, useEffect } from 'react';
import { ArrowRight, Car, Check, Loader2, MapPin, Navigation, Phone } from 'lucide-react';
import DynamicIcon from './DynamicIcon';
import ModalShell, { ModalHeader } from './ModalShell';
import { btnFilledGold, btnOutlineNavy, inputStyle, wizardLead, modalBodyStyle, modalFooterStyle, Field } from './_shared';

type Flow = 'choose' | 'oil-lookup' | 'oil-active' | 'oil-ready' | 'repair-lookup' | 'repair-loading' | 'repair-status' | 'repair-notfound';

interface RepairResult {
  ticket_number: string;
  status: string;
  notes?: string;
}

const STATUS_MAP: Record<string, { label: string; icon: string }> = {
  new:       { label: "Received — we'll be in touch soon",            icon: 'inbox' },
  reviewing: { label: "Under Review — our mechanic is looking at it", icon: 'clipboard-list' },
  in_repair: { label: "In Progress — your car is being worked on",    icon: 'wrench' },
  ready:     { label: "Ready for Pickup!",                            icon: 'badge-check' },
  completed: { label: "Completed",                                    icon: 'check-circle' },
};

export default function TrackMyCarModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [flow, setFlow] = useState<Flow>('choose');
  const [oilLookup, setOilLookup] = useState({ plate: '', phone: '' });
  const [repairLookup, setRepairLookup] = useState({ ticket: '', phone: '' });
  const [repairResult, setRepairResult] = useState<RepairResult | null>(null);
  const [remaining, setRemaining] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(45 * 60);
  const [adjustmentMins, setAdjustmentMins] = useState(0);
  const [loading, setLoading] = useState(false);
  const [lookupError, setLookupError] = useState('');
  const [repairError, setRepairError] = useState('');

  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => {
        setFlow('choose');
        setOilLookup({ plate: '', phone: '' });
        setRepairLookup({ ticket: '', phone: '' });
        setRepairResult(null);
        setRemaining(0);
        setTotalSeconds(45 * 60);
        setAdjustmentMins(0);
        setLoading(false);
        setLookupError('');
        setRepairError('');
      }, 250);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    if (flow !== 'oil-active') return;
    const id = setInterval(() => setRemaining(r => Math.max(0, r - 1)), 1000);
    return () => clearInterval(id);
  }, [flow]);

  const goBack = () => {
    if (flow === 'oil-lookup' || flow === 'repair-lookup') setFlow('choose');
    else if (flow === 'oil-active' || flow === 'oil-ready') setFlow('oil-lookup');
    else if (flow === 'repair-status' || flow === 'repair-notfound') setFlow('repair-lookup');
    else if (flow === 'repair-loading') setFlow('repair-lookup');
  };

  const handleOilLookup = async () => {
    if (!oilLookup.plate.trim() || !oilLookup.phone.trim()) return;
    setLoading(true);
    setLookupError('');
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_DASHBOARD_API_URL}/api/oil-changes/track`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            shop_id:       process.env.NEXT_PUBLIC_SHOP_ID,
            license_plate: oilLookup.plate,
            phone:         oilLookup.phone,
          }),
        }
      );
      const json = await res.json();
      if (!res.ok) {
        setLookupError('No active oil change found for that plate and phone.');
        return;
      }
      const record = json.data ?? json;
      if (record.status === 'ready') {
        setFlow('oil-ready');
        return;
      }
      const eta   = new Date(record.started_at).getTime()
                  + (record.estimated_minutes + record.adjustment_minutes) * 60000;
      const secs  = Math.max(0, Math.floor((eta - Date.now()) / 1000));
      const total = (record.estimated_minutes + record.adjustment_minutes) * 60;
      setRemaining(secs);
      setTotalSeconds(total > 0 ? total : 45 * 60);
      setAdjustmentMins(record.adjustment_minutes ?? 0);
      setFlow('oil-active');
    } catch {
      setLookupError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRepairLookup = async () => {
    if (!repairLookup.ticket.trim() || !repairLookup.phone.trim()) return;
    setFlow('repair-loading');
    setRepairError('');
    try {
      const params = new URLSearchParams({
        ticket_number: repairLookup.ticket,
        phone:         repairLookup.phone,
        shop_id:       process.env.NEXT_PUBLIC_SHOP_ID ?? 'triple-crown-automotive',
      });
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_DASHBOARD_API_URL}/api/tickets/status?${params}`
      );
      const json = await res.json();
      if (!res.ok) {
        setFlow('repair-notfound');
        return;
      }
      setRepairResult(json.data ?? json);
      setFlow('repair-status');
    } catch {
      setRepairError('Something went wrong. Please try again.');
      setFlow('repair-notfound');
    }
  };

  const titles: Record<Flow, { eyebrow: string; title: string }> = {
    'choose':          { eyebrow: 'Track My Car',    title: 'How can we help?' },
    'oil-lookup':      { eyebrow: 'Oil Change',      title: 'Find your service' },
    'oil-active':      { eyebrow: 'Oil Change',      title: 'In progress' },
    'oil-ready':       { eyebrow: 'Oil Change',      title: 'Ready for pickup' },
    'repair-lookup':   { eyebrow: 'Service Repair',  title: 'Find your ticket' },
    'repair-loading':  { eyebrow: 'Service Repair',  title: 'Looking up...' },
    'repair-status':   { eyebrow: 'Service Repair',  title: 'Status' },
    'repair-notfound': { eyebrow: 'Service Repair',  title: 'Not found' },
  };

  return (
    <ModalShell open={open} onClose={onClose} maxWidth={720}>
      <ModalHeader
        eyebrow={titles[flow].eyebrow}
        title={titles[flow].title}
        onClose={onClose}
        onBack={flow !== 'choose' ? goBack : null}
      />

      {/* CHOOSE */}
      {flow === 'choose' && (
        <div style={modalBodyStyle}>
          <p style={{ ...wizardLead, marginBottom: 22 }}>What are you tracking today?</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {([
              { id: 'oil-lookup' as Flow,    icon: 'droplets', title: 'Oil Change',     sub: 'Quick service · countdown timer' },
              { id: 'repair-lookup' as Flow,  icon: 'wrench',   title: 'Service Repair', sub: 'Full repair · status tracker' },
            ]).map(c => (
              <button key={c.id} onClick={() => setFlow(c.id)} style={{
                background: '#FFFFFF', border: '1.5px solid #E5E5E5', borderRadius: 8,
                padding: '28px 22px', textAlign: 'left', cursor: 'pointer',
                transition: 'border-color 220ms, background 220ms',
                display: 'flex', flexDirection: 'column', gap: 10,
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#D4AF37'; e.currentTarget.style.background = '#FFFDF0'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#E5E5E5'; e.currentTarget.style.background = '#FFFFFF'; }}>
                <div style={{ width: 48, height: 48, borderRadius: 8, background: '#111111', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                  <DynamicIcon name={c.icon} size={22} style={{ color: '#0D5C3A' }} />
                </div>
                <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 26, lineHeight: 1, color: '#111111', letterSpacing: '0.01em', marginTop: 6 }}>{c.title}</div>
                <div style={{ fontFamily: 'Inter,sans-serif', fontSize: 13.5, color: '#666666', lineHeight: 1.5 }}>{c.sub}</div>
                <div style={{ marginTop: 'auto', display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 12, color: '#0D5C3A', letterSpacing: '0.22em', textTransform: 'uppercase', paddingTop: 10 }}>
                  Track <ArrowRight size={13} />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* OIL LOOKUP */}
      {flow === 'oil-lookup' && (
        <>
          <div style={modalBodyStyle}>
            <p style={wizardLead}>Enter your plate and phone — we'll pull up your oil change.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 18 }}>
              <Field label="License Plate" full>
                <input type="text" placeholder="e.g. 7ABC123"
                  value={oilLookup.plate}
                  onChange={e => setOilLookup({ ...oilLookup, plate: e.target.value.toUpperCase() })}
                  style={{ ...inputStyle, letterSpacing: '0.15em', fontFamily: 'ui-monospace,monospace', fontWeight: 600 }} />
              </Field>
              <Field label="Phone (for verification)" full>
                <input type="tel" placeholder="(530) 555-0100"
                  value={oilLookup.phone}
                  onChange={e => setOilLookup({ ...oilLookup, phone: e.target.value })}
                  style={inputStyle} />
              </Field>
            </div>
            {lookupError && (
              <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 13, color: '#B23A3A', marginTop: 12 }}>{lookupError}</p>
            )}
          </div>
          <div style={modalFooterStyle}>
            <span />
            <button
              onClick={handleOilLookup}
              disabled={loading || !oilLookup.plate.trim() || !oilLookup.phone.trim()}
              style={{ ...btnFilledGold, padding: '12px 22px', fontSize: 13, opacity: (loading || !oilLookup.plate.trim() || !oilLookup.phone.trim()) ? 0.6 : 1, cursor: (loading || !oilLookup.plate.trim() || !oilLookup.phone.trim()) ? 'not-allowed' : 'pointer' }}>
              {loading ? 'Looking up…' : <>Find My Car <ArrowRight size={14} style={{ marginLeft: 8, verticalAlign: '-2px' }} /></>}
            </button>
          </div>
        </>
      )}

      {/* OIL ACTIVE */}
      {flow === 'oil-active' && (
        <>
          <div style={{ ...modalBodyStyle, padding: '28px 26px' }}>
            <div style={{ padding: '14px 16px', background: '#F5F5F5', border: '1px solid #E5E5E5', borderRadius: 6, display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <Car size={22} style={{ color: '#0D5C3A' }} />
              <div>
                <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 11, fontWeight: 600, color: '#0D5C3A', letterSpacing: '0.22em', textTransform: 'uppercase' }}>Your Vehicle</div>
                <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 17, color: '#111111', marginTop: 2 }}>
                  {oilLookup.plate ? `Plate: ` : ''}
                  <span style={{ fontFamily: 'ui-monospace,monospace', fontWeight: 600 }}>{oilLookup.plate || '—'}</span>
                </div>
              </div>
            </div>

            <CountdownRing seconds={remaining} totalSeconds={totalSeconds} />

            <div style={{ textAlign: 'center', marginTop: 22, fontFamily: "'Barlow Condensed',sans-serif", fontSize: 16, fontWeight: 600, color: '#111111', letterSpacing: '0.16em', textTransform: 'uppercase' }}>
              <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#0D5C3A', marginRight: 10, verticalAlign: '2px', animation: 'pulse-dot 1.6s infinite' }} />
              Your car is being serviced
            </div>

            {adjustmentMins < 0 && <div style={adjustmentNote('#1F7A47')}>⏱ Your car will be ready {Math.abs(adjustmentMins)} mins early.</div>}
            {adjustmentMins > 0 && <div style={adjustmentNote('#B23A3A')}>⚠️ Delayed by {adjustmentMins} mins — we'll text you when ready.</div>}

            <ShopCard />
          </div>
        </>
      )}

      {/* OIL READY */}
      {flow === 'oil-ready' && (
        <div style={{ ...modalBodyStyle, textAlign: 'center', padding: '40px 28px' }}>
          <div style={{ width: 110, height: 110, borderRadius: '50%', background: '#1F7A47', boxShadow: '0 0 0 14px rgba(31,122,71,0.16)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', animation: 'pop-check 480ms cubic-bezier(0.16,1,0.3,1) forwards' }}>
            <Check size={60} style={{ color: '#FFFFFF', strokeWidth: 3 }} />
          </div>
          <h3 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 44, color: '#111111', margin: '26px 0 10px', lineHeight: 1, letterSpacing: '0.01em' }}>Your car is ready for pickup!</h3>
          <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 15, color: '#666666', maxWidth: 460, margin: '0 auto', lineHeight: 1.6 }}>Head over to Triple Crown Automotive at 320 Kentucky Ave, Woodland. See you soon!</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap', marginTop: 26 }}>
            <a href="https://maps.google.com/?q=320+Kentucky+Ave+Woodland+CA+95695" target="_blank" rel="noopener" style={{ ...btnFilledGold, padding: '14px 22px', fontSize: 13, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <Navigation size={14} />Get Directions
            </a>
            <a href="tel:5306626995" style={{ ...btnOutlineNavy, padding: '14px 22px', fontSize: 13, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <Phone size={14} />Call the Shop
            </a>
          </div>
        </div>
      )}

      {/* REPAIR LOOKUP */}
      {flow === 'repair-lookup' && (
        <>
          <div style={modalBodyStyle}>
            <p style={wizardLead}>Enter your ticket number and phone to pull up your repair status.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 18 }}>
              <Field label="Ticket Number" full>
                <input type="text" placeholder="e.g. TCA-1748000000000"
                  value={repairLookup.ticket}
                  onChange={e => setRepairLookup({ ...repairLookup, ticket: e.target.value.toUpperCase() })}
                  style={{ ...inputStyle, letterSpacing: '0.08em', fontFamily: 'ui-monospace,monospace', fontWeight: 600 }} />
              </Field>
              <Field label="Phone (for verification)" full>
                <input type="tel" placeholder="(530) 555-0100"
                  value={repairLookup.phone}
                  onChange={e => setRepairLookup({ ...repairLookup, phone: e.target.value })}
                  style={inputStyle} />
              </Field>
            </div>
            {repairError && (
              <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 13, color: '#B23A3A', marginTop: 12 }}>{repairError}</p>
            )}
            <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 12.5, color: '#666666', marginTop: 14, lineHeight: 1.5 }}>
              Your ticket number was emailed when you booked. Contact us at <a href="tel:5306626995" style={{ color: '#0D5C3A' }}>(530) 662-6995</a> if you need help finding it.
            </p>
          </div>
          <div style={modalFooterStyle}>
            <span />
            <button
              onClick={handleRepairLookup}
              disabled={!repairLookup.ticket.trim() || !repairLookup.phone.trim()}
              style={{ ...btnFilledGold, padding: '12px 22px', fontSize: 13, opacity: (!repairLookup.ticket.trim() || !repairLookup.phone.trim()) ? 0.5 : 1, cursor: (!repairLookup.ticket.trim() || !repairLookup.phone.trim()) ? 'not-allowed' : 'pointer' }}>
              Find My Ticket <ArrowRight size={14} style={{ marginLeft: 8, verticalAlign: '-2px' }} />
            </button>
          </div>
        </>
      )}

      {/* REPAIR LOADING */}
      {flow === 'repair-loading' && (
        <div style={{ ...modalBodyStyle, textAlign: 'center', padding: '60px 28px' }}>
          <Loader2 size={40} style={{ color: '#0D5C3A', animation: 'spin 1s linear infinite', margin: '0 auto' }} />
          <p style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 16, color: '#666666', letterSpacing: '0.16em', textTransform: 'uppercase', marginTop: 16 }}>Looking up your ticket…</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {/* REPAIR NOT FOUND */}
      {flow === 'repair-notfound' && (
        <div style={{ ...modalBodyStyle, textAlign: 'center', padding: '40px 28px' }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#F5F5F5', border: '2px solid #E5E5E5', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
            <DynamicIcon name="search-x" size={34} style={{ color: '#AAAAAA' }} />
          </div>
          <h3 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 36, color: '#111111', margin: '0 0 10px', lineHeight: 1 }}>Ticket not found</h3>
          <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 15, color: '#666666', maxWidth: 420, margin: '0 auto 24px', lineHeight: 1.6 }}>
            We couldn't find a ticket matching that number and phone. Double-check your confirmation email or give us a call.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
            <button onClick={() => setFlow('repair-lookup')} style={{ ...btnFilledGold, padding: '12px 20px', fontSize: 13 }}>Try Again</button>
            <a href="tel:5306626995" style={{ ...btnOutlineNavy, padding: '12px 20px', fontSize: 13, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <Phone size={14} />Call Us
            </a>
          </div>
        </div>
      )}

      {/* REPAIR STATUS */}
      {flow === 'repair-status' && repairResult && (
        <LiveRepairStatus ticket={repairResult} />
      )}
    </ModalShell>
  );
}

function LiveRepairStatus({ ticket }: { ticket: RepairResult }) {
  const mapped = STATUS_MAP[ticket.status] ?? { label: ticket.status, icon: 'wrench' };

  return (
    <div style={modalBodyStyle}>
      {/* Ticket header */}
      <div style={{ padding: '14px 16px', background: '#F5F5F5', border: '1px solid #E5E5E5', borderRadius: 6, display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22 }}>
        <Car size={22} style={{ color: '#0D5C3A' }} />
        <div>
          <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 11, fontWeight: 600, color: '#0D5C3A', letterSpacing: '0.22em', textTransform: 'uppercase' }}>Ticket</div>
          <div style={{ fontFamily: 'ui-monospace,monospace', fontWeight: 700, fontSize: 16, color: '#111111', marginTop: 2, letterSpacing: '0.06em' }}>
            {ticket.ticket_number}
          </div>
        </div>
      </div>

      {/* Status card */}
      <div style={{ background: '#111111', color: '#F5F5F5', borderRadius: 8, padding: '20px 22px', display: 'flex', gap: 14, alignItems: 'flex-start', borderLeft: '4px solid #D4AF37' }}>
        <DynamicIcon name={mapped.icon} size={22} style={{ color: '#D4AF37', flexShrink: 0, marginTop: 2 }} />
        <div>
          <div style={{ fontFamily: "'Barlow Condensed',sans-serif", color: '#D4AF37', fontSize: 11, fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', marginBottom: 6 }}>Status</div>
          <div style={{ fontFamily: 'Inter,sans-serif', fontSize: 15, lineHeight: 1.55, color: '#F5F5F5' }}>{mapped.label}</div>
        </div>
      </div>

      {/* Shop note */}
      {ticket.notes && (
        <div style={{ marginTop: 14, padding: '14px 16px', background: '#FFFDF0', border: '1px solid #D4AF37', borderLeft: '4px solid #D4AF37', borderRadius: 6 }}>
          <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#A07820', marginBottom: 6 }}>Note from the shop</div>
          <div style={{ fontFamily: 'Inter,sans-serif', fontSize: 14, color: '#3A3020', lineHeight: 1.55 }}>{ticket.notes}</div>
        </div>
      )}

      <ShopCard />
    </div>
  );
}

function CountdownRing({ seconds, totalSeconds }: { seconds: number; totalSeconds: number }) {
  const pct = Math.max(0, Math.min(1, 1 - seconds / totalSeconds));
  const size = 240;
  const stroke = 14;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = c * pct;

  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  return (
    <div style={{ width: size, height: size, margin: '0 auto', position: 'relative' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#E5E5E5" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#0D5C3A" strokeWidth={stroke}
          strokeLinecap="round" strokeDasharray={`${dash} ${c - dash}`}
          style={{ transition: 'stroke-dasharray 600ms ease' }} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontFamily: "'Barlow Condensed',sans-serif", color: '#0D5C3A', fontSize: 11, fontWeight: 700, letterSpacing: '0.32em', textTransform: 'uppercase' }}>Time Remaining</div>
        <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 56, lineHeight: 1, color: '#111111', letterSpacing: '0.02em', marginTop: 6, display: 'flex', alignItems: 'baseline', gap: 4 }}>
          <span>{String(h).padStart(2, '0')}</span>
          <span style={{ color: '#0D5C3A', fontSize: 38 }}>:</span>
          <span>{String(m).padStart(2, '0')}</span>
          <span style={{ color: '#0D5C3A', fontSize: 38 }}>:</span>
          <span>{String(s).padStart(2, '0')}</span>
        </div>
        <div style={{ fontFamily: "'Barlow Condensed',sans-serif", color: '#666666', fontSize: 11, fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', marginTop: 4 }}>HH : MM : SS</div>
      </div>
    </div>
  );
}

function ShopCard() {
  return (
    <div style={{ marginTop: 22, padding: '14px 16px', background: '#F5F5F5', border: '1px solid #E5E5E5', borderRadius: 6, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
      <MapPin size={16} style={{ color: '#0D5C3A', flexShrink: 0, marginTop: 3 }} />
      <div>
        <div style={{ fontFamily: 'Inter,sans-serif', fontSize: 14, color: '#1A1A1A', fontWeight: 500 }}>320 Kentucky Ave, Woodland, CA 95695</div>
        <a href="tel:5306626995" style={{ fontFamily: 'Inter,sans-serif', fontSize: 13, color: '#666666', textDecoration: 'none' }}>(530) 662-6995</a>
      </div>
    </div>
  );
}

const adjustmentNote = (color: string): React.CSSProperties => ({
  marginTop: 14, padding: '10px 14px', background: '#FFFFFF',
  border: `1px solid ${color}`, borderLeft: `4px solid ${color}`,
  borderRadius: 4, fontFamily: "'Playfair Display',serif", fontStyle: 'italic',
  fontSize: 14, color, textAlign: 'center',
});
