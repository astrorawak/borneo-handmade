import { Link } from 'react-router-dom';
import { useAdminStore } from '../store/adminStore';

export default function Footer() {
  const { settings } = useAdminStore();
  return (
    <footer style={{ background: 'var(--bg2)', borderTop: '1px solid var(--border)', marginTop: 'auto' }}>
      <div className="page-container" style={{ padding: '48px 16px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px', marginBottom: '40px' }}>
          <div>
            <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '24px', letterSpacing: '4px', marginBottom: '12px' }}>
              BORNEO<span style={{ color: 'var(--primary)' }}>HM</span>
            </div>
            <p style={{ color: 'var(--muted)', fontSize: '13px', lineHeight: '1.7', marginBottom: '16px' }}>
              Authentic antique and handmade art from the heart of Borneo. Every piece tells a story.
            </p>
            <a href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-block', background: '#25d366', color: '#fff', padding: '8px 16px', fontSize: '12px', textDecoration: 'none', letterSpacing: '1px' }}>
              WHATSAPP
            </a>
          </div>
          <div>
            <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '16px', letterSpacing: '3px', color: 'var(--primary)', marginBottom: '16px' }}>SHOP</div>
            {['Antique Weaponry', 'Ritual Masks', 'Traditional Textiles', 'Wood Carvings', 'Pottery & Ceramics'].map((c) => (
              <div key={c} style={{ marginBottom: '8px' }}>
                <Link to="/shop" style={{ color: 'var(--muted)', textDecoration: 'none', fontSize: '13px' }}>{c}</Link>
              </div>
            ))}
          </div>
          <div>
            <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '16px', letterSpacing: '3px', color: 'var(--primary)', marginBottom: '16px' }}>INFO</div>
            {[
              { to: '/about', label: 'About Us' },
              { to: '/shipping', label: 'Shipping Info' },
              { to: '/faq', label: 'FAQ' },
              { to: '/blog', label: 'Blog' },
            ].map((l) => (
              <div key={l.to} style={{ marginBottom: '8px' }}>
                <Link to={l.to} style={{ color: 'var(--muted)', textDecoration: 'none', fontSize: '13px' }}>{l.label}</Link>
              </div>
            ))}
          </div>
          <div>
            <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '16px', letterSpacing: '3px', color: 'var(--primary)', marginBottom: '16px' }}>CONTACT</div>
            <p style={{ color: 'var(--muted)', fontSize: '13px', marginBottom: '8px' }}>{settings.storeEmail}</p>
            <p style={{ color: 'var(--muted)', fontSize: '13px', marginBottom: '16px' }}>WA: {settings.whatsapp}</p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {settings.instagram && <a href={`https://instagram.com/${settings.instagram}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--muted)', fontSize: '12px', border: '1px solid var(--border2)', padding: '4px 10px', textDecoration: 'none' }}>IG</a>}
              {settings.tiktok && <a href={`https://tiktok.com/@${settings.tiktok}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--muted)', fontSize: '12px', border: '1px solid var(--border2)', padding: '4px 10px', textDecoration: 'none' }}>TT</a>}
              {settings.facebook && <a href={`https://facebook.com/${settings.facebook}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--muted)', fontSize: '12px', border: '1px solid var(--border2)', padding: '4px 10px', textDecoration: 'none' }}>FB</a>}
            </div>
          </div>
        </div>
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <p style={{ color: 'var(--muted)', fontSize: '11px', letterSpacing: '1px' }}>2024 BORNEO HANDMADE. ALL RIGHTS RESERVED.</p>
          <p style={{ color: 'var(--muted)', fontSize: '11px', letterSpacing: '1px' }}>AUTHENTIC BORNEO CRAFT</p>
        </div>
      </div>
    </footer>
  );
}
