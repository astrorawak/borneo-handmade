import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { formatRupiah, formatUSD } from '../lib/utils';

export default function CartPage() {
  const { items, currency, language, removeItem, updateQuantity, getTotalIDR, getTotalUSD } = useCartStore();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0', color: 'var(--muted)' }}>
        <div style={{ fontSize: '64px', marginBottom: '20px' }}>🛒</div>
        <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '36px', letterSpacing: '2px', marginBottom: '12px' }}>
          {language === 'en' ? 'YOUR CART IS EMPTY' : 'KERANJANG KOSONG'}
        </h2>
        <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '14px', color: 'var(--muted)', marginBottom: '28px' }}>
          {language === 'en' ? 'Discover our collection of authentic Borneo pieces' : 'Temukan koleksi karya asli Borneo kami'}
        </p>
        <Link to="/shop" style={{ background: 'var(--primary)', color: '#fff', padding: '13px 32px', fontFamily: 'Space Grotesk, sans-serif', fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', textDecoration: 'none', display: 'inline-block' }}>
          {language === 'en' ? 'BROWSE SHOP' : 'LIHAT TOKO'}
        </Link>
      </div>
    );
  }

  const total = currency === 'IDR' ? getTotalIDR() : getTotalUSD();

  return (
    <div>
      <div style={{ background: 'var(--bg2)', borderBottom: '1px solid var(--border)', padding: '40px 0' }}>
        <div className="page-container">
          <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '10px', letterSpacing: '5px', color: 'var(--primary)', marginBottom: '8px' }}>// YOUR CART //</div>
          <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(36px, 5vw, 56px)', letterSpacing: '2px' }}>
            {language === 'en' ? 'SHOPPING CART' : 'KERANJANG BELANJA'}
          </h1>
        </div>
      </div>
      <div className="page-container" style={{ padding: '40px 16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px', alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {items.map((item) => (
              <div key={item.product.id} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', display: 'flex', gap: '16px', padding: '16px' }}>
                <div style={{ width: '80px', height: '80px', background: 'var(--bg4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', flexShrink: 0, border: '1px solid var(--border)' }}>
                  {item.product.image.startsWith('data:') || item.product.image.startsWith('http') ? (
                    <img src={item.product.image} alt={item.product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : <span>{item.product.image}</span>}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '9px', letterSpacing: '2px', color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '4px' }}>{item.product.category}</div>
                  <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '18px', color: '#fff', letterSpacing: '1px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: '8px' }}>{item.product.name}</div>
                  <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '15px', fontWeight: 700, color: 'var(--primary)', marginBottom: '12px' }}>
                    {currency === 'IDR' ? formatRupiah(item.product.price * item.quantity) : formatUSD(item.product.priceUSD * item.quantity)}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border2)' }}>
                      <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} style={{ background: 'none', border: 'none', color: '#fff', width: '32px', height: '32px', cursor: 'pointer', fontSize: '20px', lineHeight: 1 }}>−</button>
                      <span style={{ padding: '0 12px', fontFamily: 'Space Grotesk, sans-serif', fontSize: '14px', minWidth: '32px', textAlign: 'center' }}>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} style={{ background: 'none', border: 'none', color: '#fff', width: '32px', height: '32px', cursor: 'pointer', fontSize: '20px', lineHeight: 1 }}>+</button>
                    </div>
                    <button onClick={() => removeItem(item.product.id)} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif', fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase' }}>REMOVE</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', padding: '24px', position: 'sticky', top: '80px' }}>
            <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '22px', letterSpacing: '2px', marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>ORDER SUMMARY</div>
            {items.map((item) => (
              <div key={item.product.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontFamily: 'Space Grotesk, sans-serif', fontSize: '13px' }}>
                <span style={{ color: 'var(--text2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '180px' }}>{item.product.name} x{item.quantity}</span>
                <span style={{ color: 'var(--text2)', flexShrink: 0, marginLeft: '8px' }}>
                  {currency === 'IDR' ? formatRupiah(item.product.price * item.quantity) : formatUSD(item.product.priceUSD * item.quantity)}
                </span>
              </div>
            ))}
            <div style={{ borderTop: '1px solid var(--border)', marginTop: '16px', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', fontFamily: 'Space Grotesk, sans-serif', fontSize: '16px', fontWeight: 700, marginBottom: '20px' }}>
              <span>TOTAL</span>
              <span style={{ color: 'var(--primary)' }}>{currency === 'IDR' ? formatRupiah(total) : formatUSD(total)}</span>
            </div>
            <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '11px', color: 'var(--muted)', marginBottom: '20px', lineHeight: '1.6' }}>
              Shipping calculated at checkout. International shipping available.
            </p>
            <button onClick={() => navigate('/checkout')}
              style={{ background: 'var(--primary)', color: '#fff', border: 'none', padding: '14px', width: '100%', fontFamily: 'Space Grotesk, sans-serif', fontSize: '13px', letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer', marginBottom: '12px' }}>
              {language === 'en' ? 'PROCEED TO CHECKOUT' : 'LANJUT CHECKOUT'}
            </button>
            <Link to="/shop" style={{ display: 'block', textAlign: 'center', fontFamily: 'Space Grotesk, sans-serif', fontSize: '12px', color: 'var(--muted)', textDecoration: 'none', letterSpacing: '1px' }}>
              ← {language === 'en' ? 'CONTINUE SHOPPING' : 'LANJUT BELANJA'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
