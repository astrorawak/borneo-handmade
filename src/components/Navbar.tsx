import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { useAdminStore } from '../store/adminStore';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { getCount, currency, setCurrency, language, setLanguage } = useCartStore();
  const { settings } = useAdminStore();
  const navigate = useNavigate();
  const count = getCount();

  const navLinks = language === 'en'
    ? [{ to: '/shop', label: 'SHOP' }, { to: '/blog', label: 'BLOG' }, { to: '/about', label: 'ABOUT' }, { to: '/shipping', label: 'SHIPPING' }]
    : [{ to: '/shop', label: 'TOKO' }, { to: '/blog', label: 'BLOG' }, { to: '/about', label: 'TENTANG' }, { to: '/shipping', label: 'PENGIRIMAN' }];

  return (
    <>
      {settings.announcementActive && settings.announcementText && (
        <div className="announcement-bar">{settings.announcementText}</div>
      )}
      <nav style={{ background: 'var(--bg)', borderBottom: '2px solid var(--primary)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div className="page-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
          <Link to="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
            <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '22px', letterSpacing: '4px', color: '#fff' }}>
              BORNEO<span style={{ color: 'var(--primary)' }}>HM</span>
            </span>
          </Link>
          <div className="nav-desktop-links" style={{ gap: '28px', alignItems: 'center' }}>
            {navLinks.map((l) => (
              <Link key={l.to} to={l.to} style={{ color: 'var(--muted)', textDecoration: 'none', fontSize: '12px', letterSpacing: '2px', transition: 'color 0.2s' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--primary)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--muted)')}>
                {l.label}
              </Link>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button onClick={() => setLanguage(language === 'en' ? 'id' : 'en')}
              style={{ background: 'var(--bg3)', border: '1px solid var(--border2)', color: 'var(--muted)', padding: '4px 10px', fontSize: '11px', letterSpacing: '1px', cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif' }}>
              {language === 'en' ? 'ID' : 'EN'}
            </button>
            <button onClick={() => setCurrency(currency === 'IDR' ? 'USD' : 'IDR')}
              style={{ background: 'var(--bg3)', border: '1px solid var(--border2)', color: 'var(--muted)', padding: '4px 10px', fontSize: '11px', letterSpacing: '1px', cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif' }}>
              {currency}
            </button>
            <button onClick={() => navigate('/cart')}
              style={{ background: 'var(--primary)', border: 'none', color: '#fff', padding: '8px 16px', fontSize: '12px', letterSpacing: '1px', cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif', whiteSpace: 'nowrap' }}>
              CART {count > 0 && `(${count})`}
            </button>
            <button className="nav-hamburger" onClick={() => setMenuOpen(!menuOpen)}
              style={{ background: 'none', border: 'none', color: '#fff', fontSize: '22px', cursor: 'pointer', padding: '4px' }}>
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
        {menuOpen && (
          <div style={{ background: 'var(--bg2)', borderTop: '1px solid var(--border)', padding: '8px 0' }}>
            {navLinks.map((l) => (
              <Link key={l.to} to={l.to} onClick={() => setMenuOpen(false)}
                style={{ display: 'block', padding: '14px 24px', color: 'var(--text2)', textDecoration: 'none', fontSize: '13px', letterSpacing: '2px', borderBottom: '1px solid var(--border)' }}>
                {l.label}
              </Link>
            ))}
          </div>
        )}
      </nav>
    </>
  );
}
