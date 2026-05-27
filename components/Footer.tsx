'use client';
import { Clock, MapPin, Phone } from 'lucide-react';
import Logo from './Logo';

const footerHeading: React.CSSProperties = { fontFamily: "'Barlow Condensed',sans-serif", color: '#0D5C3A', fontSize: 13, fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', marginBottom: 18 };
const footerLink: React.CSSProperties = { fontFamily: "'Barlow Condensed',sans-serif", color: 'rgba(255,255,255,0.75)', fontSize: 15, fontWeight: 500, letterSpacing: '0.06em', textDecoration: 'none', transition: 'color 180ms' };
const footerInfo: React.CSSProperties = { display: 'flex', gap: 10, alignItems: 'flex-start', fontFamily: 'Inter,sans-serif', fontSize: 14, color: 'rgba(255,255,255,0.75)', lineHeight: 1.55 };

export default function Footer() {
  return (
    <footer style={{ background: '#1E1E1E', color: '#FFFFFF', padding: 'clamp(48px,7vw,80px) clamp(24px,5vw,80px) 24px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
      <div style={{ maxWidth: 1320, margin: '0 auto' }}>
        <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1.2fr', gap: 48, paddingBottom: 36, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div>
            <Logo variant="dark" size="md" />
            <p style={{ fontFamily: "'Playfair Display',serif", fontStyle: 'italic', color: 'rgba(255,255,255,0.6)', fontSize: 17, marginTop: 24, maxWidth: 320, lineHeight: 1.55 }}>"Fair pricing, honest mechanics, friendly service — that's the Triple Crown Automotive promise."</p>
          </div>
          <div>
            <div style={footerHeading}>Quick Links</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[['home','Home'],['services','Services'],['about','About'],['reviews','Reviews'],['contact','Contact']].map(([id,label]) => (
                <li key={id}><a href={`#${id}`} onClick={e => { e.preventDefault(); const el = document.getElementById(id); if (el) window.scrollTo({ top: el.offsetTop - 64, behavior: 'smooth' }); }} style={footerLink}
                  onMouseEnter={e => e.currentTarget.style.color='#D4AF37'}
                  onMouseLeave={e => e.currentTarget.style.color='rgba(255,255,255,0.75)'}>{label}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <div style={footerHeading}>Visit</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={footerInfo}><MapPin size={14} style={{ color: '#D4AF37', flexShrink: 0, marginTop: 3 }} /><span>320 Kentucky Ave, Woodland, CA 95695</span></div>
              <div style={footerInfo}><Phone size={14} style={{ color: '#D4AF37', flexShrink: 0, marginTop: 3 }} /><a href="tel:5306626995" style={{ color: 'rgba(255,255,255,0.75)', textDecoration: 'none' }}>(530) 662-6995</a></div>
              <div style={footerInfo}><Clock size={14} style={{ color: '#D4AF37', flexShrink: 0, marginTop: 3 }} /><span>Mon–Fri: 8:00 AM – 5:30 PM<br /><span>Sat &amp; Sun: Closed</span></span></div>
            </div>
          </div>
        </div>
        <div style={{ paddingTop: 22, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 12, fontFamily: "'Barlow Condensed',sans-serif", fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)' }}>
          <div>© 2026 Triple Crown Automotive · Woodland, CA</div>
          <div>320 Kentucky Ave · (530) 662-6995</div>
        </div>
      </div>
      <style>{`@media(max-width:767px){.footer-grid{grid-template-columns:1fr!important;gap:32px!important}}`}</style>
    </footer>
  );
}
