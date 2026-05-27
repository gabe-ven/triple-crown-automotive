'use client';

const CREDENTIALS = [
  { num: '01', title: 'State Licensed', desc: 'Fully licensed by the State of California Bureau of Automotive Repair.' },
  { num: '02', title: 'Expert Diagnostics', desc: 'Meeting the highest standards of diagnostic precision and troubleshooting.' },
  { num: '03', title: 'Locally Owned', desc: 'Proudly serving Woodland since 1993 with honest, reliable auto care.' },
];

export default function AboutSection() {
  return (
    <section id="about">

      {/* Dark intro strip */}
      <div style={{ background: '#0F0F0F', padding: 'clamp(22px,3vw,36px) clamp(24px,5vw,80px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 32, flexWrap: 'wrap', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ fontFamily: "'Barlow Condensed',sans-serif", color: '#D4AF37', fontSize: 11, fontWeight: 700, letterSpacing: '0.36em', textTransform: 'uppercase', flexShrink: 0 }}>Our Story</div>
        <p style={{ fontFamily: "'Playfair Display',serif", fontStyle: 'italic', color: 'rgba(255,255,255,0.7)', fontSize: 'clamp(15px,1.5vw,19px)', margin: 0, flex: 1, textAlign: 'center' }}>
          "Serving Woodland families with honest work, fair pricing, and friendly service — every time."
        </p>
        <div style={{ fontFamily: "'Barlow Condensed',sans-serif", color: 'rgba(255,255,255,0.25)', fontSize: 11, fontWeight: 600, letterSpacing: '0.3em', textTransform: 'uppercase', flexShrink: 0 }}>Woodland, CA</div>
      </div>

      {/* Main content */}
      <div style={{ background: '#FFFFFF' }}>
        <div style={{ maxWidth: 1320, margin: '0 auto', padding: 'clamp(52px,8vw,108px) clamp(24px,5vw,80px)' }}>
          <div className="about-main-grid" style={{ display: 'grid', gridTemplateColumns: '55fr 45fr', gap: 'clamp(40px,7vw,96px)', alignItems: 'center' }}>

            {/* Left — text */}
            <div className="reveal-left">
              <div style={{ fontFamily: "'Barlow Condensed',sans-serif", color: '#D4AF37', fontSize: 11, fontWeight: 700, letterSpacing: '0.36em', textTransform: 'uppercase', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ display: 'block', width: 28, height: 1.5, background: '#D4AF37' }} />
                Welcome to Triple Crown Automotive
              </div>
              <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 'clamp(52px,7vw,96px)', color: '#111111', margin: '0 0 24px', lineHeight: 0.9, letterSpacing: '0.01em' }}>
                AUTO REPAIR<br />
                <span style={{ color: '#0D5C3A' }}>DONE RIGHT.</span>
              </h2>

              <div style={{ fontFamily: 'Inter,sans-serif', fontSize: 16, lineHeight: 1.82, color: '#555555', display: 'flex', flexDirection: 'column', gap: 18, marginBottom: 32 }}>
                <p style={{ margin: 0 }}>At Triple Crown Automotive, we work hard to be your trusted, local one-stop shop for complete auto repair and maintenance. Woodland families have relied on our expertise since 1993, and we take deep pride in offering honest diagnostics, fair pricing, and superior customer service to every person who walks through our doors.</p>
                <p style={{ margin: 0 }}>Our owner, Todd H., graduated from Woodland High School and attended Universal Technical School in 1987. After working at various dealerships and independent shops, he decided to open his own repair business to offer genuine car care without the dealer premium. He started in a small garage setup and built our state-of-the-art 5-lift facility in 2000 to better serve the growing needs of our community.</p>
              </div>

              <blockquote style={{ margin: 0, padding: '0 0 0 20px', borderLeft: '3px solid #0D5C3A', fontFamily: "'Playfair Display',serif", fontStyle: 'italic', fontSize: 17, color: '#1A1A1A', lineHeight: 1.65 }}>
                Known for honest mechanics, fair pricing, and a trustworthy owner who gets it right the first time.
              </blockquote>
            </div>

            {/* Right — single photo */}
            <div className="reveal-right">
              <div style={{ borderRadius: 10, overflow: 'hidden', aspectRatio: '4/3', boxShadow: '0 12px 36px rgba(0,0,0,0.08)' }}>
                <img src="/assets/SHOP_SMALL.jpg" alt="Triple Crown Automotive shop exterior" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Credentials strip */}
      <div style={{ background: '#F8F8F8', borderTop: '1px solid #EBEBEB', borderBottom: '1px solid #EBEBEB' }}>
        <div style={{ maxWidth: 1320, margin: '0 auto', padding: '0 clamp(24px,5vw,80px)' }}>
          <div className="credentials-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)' }}>
            {CREDENTIALS.map((c, i) => (
               <div
                key={i}
                className={`cred-cell reveal-up delay-${i + 1}`}
                style={{
                  padding: 'clamp(28px,4vw,52px) clamp(16px,2.5vw,32px)',
                  borderRight: i < 2 ? '1px solid #EBEBEB' : 'none',
                  borderTop: '3px solid transparent',
                  transition: 'border-color 220ms, background 220ms',
                  cursor: 'default',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderTopColor = '#D4AF37'; e.currentTarget.style.background = '#FFFFFF'; }}
                onMouseLeave={e => { e.currentTarget.style.borderTopColor = 'transparent'; e.currentTarget.style.background = 'transparent'; }}
              >
                <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 56, color: '#D4AF37', lineHeight: 1, marginBottom: 10, opacity: 0.22 }}>{c.num}</div>
                <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 'clamp(20px,2.2vw,28px)', color: '#111111', letterSpacing: '0.02em', marginBottom: 10 }}>{c.title}</div>
                <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 14, color: '#777777', margin: 0, lineHeight: 1.68 }}>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media(max-width:1023px){
          .about-main-grid{grid-template-columns:1fr!important}
          .credentials-grid{grid-template-columns:1fr!important}
          .cred-cell{border-right:none!important;border-bottom:1px solid #EBEBEB}
          .cred-cell:last-child{border-bottom:none}
        }
      `}</style>
    </section>
  );
}
