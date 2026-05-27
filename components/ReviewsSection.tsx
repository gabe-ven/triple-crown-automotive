'use client';
import { ArrowUpRight, BadgeCheck } from 'lucide-react';

function Stars({ count }: { count: number }) {
  return <div style={{ display: 'inline-flex', gap: 2, fontSize: 16, letterSpacing: 1 }}>{[1,2,3,4,5].map(i => <span key={i} style={{ color: i <= count ? '#F59E0B' : '#E5E5E5' }}>★</span>)}</div>;
}

const REVIEWS = [
  { initials: 'MR', name: 'Maria R.', stars: 5, source: 'Google Review', text: "Brought my car in for AC issues and they fixed it same day at a very fair price. Super friendly staff, no runaround. Best shop in Woodland by far." },
  { initials: 'DL', name: 'Derek L.', stars: 5, source: 'Google Review', text: "These guys are the real deal. Honest mechanics who tell you exactly what's wrong and don't try to upsell you. I've been coming here for all my cars." },
  { initials: 'AP', name: 'Ana P.', stars: 5, source: 'Yelp Review', text: "I was nervous about going to a new shop but Triple Crown Automotive made it so easy. Clear estimate, quick turnaround, and prices way better than the dealer. Highly recommend!" },
];

export default function ReviewsSection() {
  return (
    <section id="reviews" style={{ background: '#1E1E1E', padding: 'clamp(64px,9vw,120px) clamp(24px,5vw,80px)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.012) 0px, rgba(255,255,255,0.012) 1px, transparent 1px, transparent 40px)', pointerEvents: 'none' }} />
      <div style={{ maxWidth: 1320, margin: '0 auto', position: 'relative' }}>
        <div className="reveal-up" style={{ textAlign: 'center', marginBottom: 'clamp(40px,6vw,64px)' }}>
          <div style={{ fontFamily: "'Barlow Condensed',sans-serif", color: '#D4AF37', fontSize: 13, fontWeight: 600, letterSpacing: '0.28em', textTransform: 'uppercase', marginBottom: 12 }}>· Reviews ·</div>
          <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 'clamp(40px,6vw,80px)', color: '#FFFFFF', margin: 0, lineHeight: 0.95 }}>What Our Customers <span style={{ color: '#D4AF37' }}>Say</span></h2>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 20, marginTop: 18, color: 'rgba(255,255,255,0.7)', fontFamily: "'Barlow Condensed',sans-serif", fontSize: 14, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
            <span><Stars count={5} /> <span style={{ marginLeft: 6 }}>Google · 4.9</span></span>
            <span style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.2)' }} />
            <span><Stars count={5} /> <span style={{ marginLeft: 6 }}>Yelp · 4.8</span></span>
          </div>
        </div>
        <div className="reviews-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 22 }}>
          {REVIEWS.map((r, i) => (
            <div key={i} className={`reveal-up delay-${i + 1}`} style={{ background: '#FFFFFF', borderRadius: 8, padding: '28px 26px 24px', boxShadow: '0 12px 36px rgba(0,0,0,0.4)', display: 'flex', flexDirection: 'column', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 18, right: 22, fontFamily: "'Playfair Display',serif", fontSize: 64, lineHeight: 1, color: '#D4AF37', opacity: 0.12 }}>"</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                <div style={{ width: 46, height: 46, borderRadius: '50%', background: '#0D5C3A', color: '#FFFFFF', fontFamily: "'Barlow Condensed',sans-serif", fontSize: 17, fontWeight: 700, letterSpacing: '0.06em', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{r.initials}</div>
                <div><div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 18, color: '#111111' }}>{r.name}</div><div style={{ marginTop: 2 }}><Stars count={r.stars} /></div></div>
              </div>
              <p style={{ fontFamily: 'Inter,sans-serif', fontStyle: 'italic', fontSize: 14.5, lineHeight: 1.65, color: '#555555', margin: 0, flex: 1 }}>{r.text}</p>
              <div style={{ marginTop: 18, paddingTop: 14, borderTop: '1px solid #E5E5E5', fontFamily: "'Barlow Condensed',sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#0D5C3A', display: 'flex', alignItems: 'center', gap: 6 }}>
                <BadgeCheck size={13} />{r.source}
              </div>
            </div>
          ))}
        </div>
        <div className="reveal-up" style={{ textAlign: 'center', marginTop: 'clamp(28px,4vw,44px)' }}>
          <a href="https://www.google.com/search?q=triple+crown+automotive+woodland+ca" target="_blank" rel="noopener" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'transparent', color: '#D4AF37', border: '1.5px solid #D4AF37', padding: '14px 28px', borderRadius: 3, fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: '0.18em', textTransform: 'uppercase', textDecoration: 'none', transition: 'background 220ms, color 220ms' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#D4AF37'; e.currentTarget.style.color = '#ffffff'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#D4AF37'; }}>
            See all reviews on Google<ArrowUpRight size={14} />
          </a>
        </div>
      </div>
      <style>{`@media(max-width:1023px){.reviews-grid{grid-template-columns:1fr!important}}`}</style>
    </section>
  );
}
