import { useState } from 'react';
import { AdminDashboard, AdminProducts, AdminOrders, AdminBlog, AdminCategories, AdminSettings } from '../components/admin/AdminPages';

const ADMIN_PASS = 'borneo2024';
type AdminSection = 'dashboard' | 'products' | 'orders' | 'blog' | 'categories' | 'settings';

const navItems: { id: AdminSection; label: string; icon: string }[] = [
  { id: 'dashboard', label: 'DASHBOARD', icon: '📊' },
  { id: 'products', label: 'PRODUCTS', icon: '📦' },
  { id: 'orders', label: 'ORDERS', icon: '🛒' },
  { id: 'blog', label: 'BLOG', icon: '📝' },
  { id: 'categories', label: 'CATEGORIES', icon: '🗂️' },
  { id: 'settings', label: 'SETTINGS', icon: '⚙️' },
];

export default function AdminPage() {
  const [auth, setAuth] = useState(() => sessionStorage.getItem('bh-admin') === '1');
  const [pass, setPass] = useState('');
  const [passErr, setPassErr] = useState(false);
  const [section, setSection] = useState<AdminSection>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function handleLogin() {
    if (pass === ADMIN_PASS) { sessionStorage.setItem('bh-admin', '1'); setAuth(true); }
    else { setPassErr(true); setPass(''); }
  }
  function handleLogout() { sessionStorage.removeItem('bh-admin'); setAuth(false); }

  if (!auth) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', padding: '16px' }}>
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', padding: '40px 32px', width: '100%', maxWidth: '360px', textAlign: 'center' }}>
          <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '32px', letterSpacing: '4px', marginBottom: '4px' }}>BORNEO<span style={{ color: 'var(--primary)' }}>HM</span></div>
          <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '10px', letterSpacing: '4px', color: 'var(--muted)', marginBottom: '32px' }}>ADMIN PANEL</div>
          <input type="password" placeholder="Enter password" value={pass}
            onChange={(e) => { setPass(e.target.value); setPassErr(false); }}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            style={{ width: '100%', background: 'var(--bg3)', border: `1px solid ${passErr ? 'var(--primary)' : 'var(--border2)'}`, color: '#fff', padding: '12px 16px', fontFamily: 'Space Grotesk, sans-serif', fontSize: '14px', outline: 'none', marginBottom: '12px', textAlign: 'center' }} />
          {passErr && <div style={{ color: 'var(--primary)', fontFamily: 'Space Grotesk, sans-serif', fontSize: '12px', marginBottom: '12px' }}>Incorrect password</div>}
          <button onClick={handleLogin} style={{ width: '100%', background: 'var(--primary)', color: '#fff', border: 'none', padding: '12px', fontFamily: 'Space Grotesk, sans-serif', fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer' }}>LOGIN</button>
        </div>
      </div>
    );
  }

  const renderSection = () => {
    switch (section) {
      case 'dashboard': return <AdminDashboard />;
      case 'products': return <AdminProducts />;
      case 'orders': return <AdminOrders />;
      case 'blog': return <AdminBlog />;
      case 'categories': return <AdminCategories />;
      case 'settings': return <AdminSettings />;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)', position: 'relative' }}>
      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 79 }} />}
      <div className={`admin-sidebar${sidebarOpen ? ' open' : ''}`} style={{ background: 'var(--bg2)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px 16px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
          <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '20px', letterSpacing: '3px' }}>BORNEO<span style={{ color: 'var(--primary)' }}>HM</span></div>
          <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '9px', letterSpacing: '3px', color: 'var(--muted)', marginTop: '2px' }}>ADMIN PANEL</div>
        </div>
        <nav style={{ flex: 1, padding: '12px 0' }}>
          {navItems.map((item) => (
            <button key={item.id} onClick={() => { setSection(item.id); setSidebarOpen(false); }}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '13px 20px', background: section === item.id ? 'rgba(255,68,34,0.12)' : 'transparent', border: 'none', borderLeft: `3px solid ${section === item.id ? 'var(--primary)' : 'transparent'}`, color: section === item.id ? '#fff' : 'var(--muted)', cursor: 'pointer', textAlign: 'left', fontFamily: 'Space Grotesk, sans-serif', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', transition: 'all 0.15s' }}>
              <span style={{ fontSize: '16px' }}>{item.icon}</span>{item.label}
            </button>
          ))}
        </nav>
        <div style={{ padding: '16px', borderTop: '1px solid var(--border)', flexShrink: 0 }}>
          <button onClick={handleLogout} style={{ width: '100%', background: 'transparent', border: '1px solid var(--border2)', color: 'var(--muted)', padding: '10px', fontFamily: 'Space Grotesk, sans-serif', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer' }}>LOGOUT</button>
        </div>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <div style={{ background: 'var(--bg2)', borderBottom: '1px solid var(--border)', padding: '0 16px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="nav-hamburger" style={{ background: 'none', border: 'none', color: '#fff', fontSize: '22px', cursor: 'pointer', padding: '4px' }}>☰</button>
            <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '18px', letterSpacing: '2px', color: 'var(--primary)' }}>{navItems.find((n) => n.id === section)?.label}</div>
          </div>
          <a href="/borneo-handmade/" target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '11px', color: 'var(--muted)', textDecoration: 'none', letterSpacing: '1px', border: '1px solid var(--border2)', padding: '6px 14px', whiteSpace: 'nowrap' }}>VIEW SITE ↗</a>
        </div>
        <div style={{ flex: 1, padding: '24px 16px', overflowX: 'hidden' }}>{renderSection()}</div>
      </div>
    </div>
  );
}
