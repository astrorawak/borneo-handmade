import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAdminStore } from '../store/adminStore';
import { useCartStore } from '../store/cartStore';
import { formatRupiah, formatUSD } from '../lib/utils';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const { products } = useAdminStore();
  const { currency, language, addItem } = useCartStore();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const product = products.find((p) => p.slug === slug && p.isActive);
  const related = products.filter((p) => p.isActive && p.categorySlug === product?.categorySlug && p.id !== product?.id).slice(0, 3);

  if (!product) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0', color: 'var(--muted)' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>❌</div>
        <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '32px', letterSpacing: '2px', marginBottom: '16px' }}>PRODUCT NOT FOUND</h2>
        <Link to="/shop" style={{ color: 'var(--primary)', textDecoration: 'none', fontFamily: 'Space Grotesk, sans-serif', fontSize: '13px', letterSpacing: '2px', border: '1px solid var(--primary)', padding: '10px 24px', display: 'inline-block' }}>BACK TO SHOP</Link>
      </div>
    );
  }

  const handleAdd = () => { addItem(product, qty); setAdded(true); setTimeout(() => setAdded(false), 2000); };
  const handleBuy = () => { addItem(product, qty); navigate('/cart'); };

  return (
    <div>
      <div style={{ background: 'var(--bg2)', borderBottom: '1px solid var(--border)', padding: '14px 0' }}>
        <div className="page-container">
          <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '11px', color: 'var(--muted)', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <Link to="/" style={{ color: 'var(--muted)', textDecoration: 'none' }}>HOME</Link>
            <span>/</span>
            <Link to="/shop" style={{ color: 'var(--muted)', textDecoration: 'none' }}>SHOP</Link>
            <span>/</span>
            <span style={{ color: 'var(--primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>{product.name.toUpperCase()}</span>
          </div>
        </div>
      </div>
      <div className="page-container" style={{ padding: '48px 16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '48px', marginBottom: '64px' }}>
          <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '120px', position: 'relative' }}>
            {product.image.startsWith('data:') || product.image.startsWith('http') ? <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} /> : <span>{product.image}</span>}
            {product.badge && <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--primary)', color: '#fff', fontFamily: 'Space Grotesk, sans-serif', fontSize: '10px', letterSpacing: '1px', padding: '8px 16px', textTransform: 'uppercase' }}>{product.badge}</div>}
          </div>
          <div>
            <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '10px', letterSpacing: '4px', color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '8px' }}>{product.category}</div>
            <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(32px, 5vw, 52px)', letterSpacing: '2px', marginBottom: '8px', lineHeight: 1.1 }}>{product.name}</h1>
            <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '13px', color: 'var(--muted)', marginBottom: '20px' }}>📍 {product.origin}</div>
            {product.material && <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '12px', color: 'var(--muted)', marginBottom: '20px' }}><span style={{ color: 'var(--text2)' }}>Material:</span> {product.material}</div>}
            <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '28px', fontWeight: 700, color: 'var(--primary)', marginBottom: '8px' }}>
              {currency === 'IDR' ? formatRupiah(product.price) : formatUSD(product.priceUSD)}
            </div>
            <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '13px', color: 'var(--muted)', marginBottom: '24px' }}>
              ≈ {currency === 'IDR' ? formatUSD(product.priceUSD) : formatRupiah(product.price)}
            </div>
            <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '12px', marginBottom: '24px' }}>
              <span style={{ color: product.stock > 0 ? '#4ade80' : 'var(--primary)' }}>
                {product.stock > 0 ? `● IN STOCK (${product.stock} available)` : '● OUT OF STOCK'}
              </span>
            </div>
            {product.stock > 0 && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                  <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '12px', color: 'var(--muted)', letterSpacing: '1px' }}>QTY:</div>
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border2)' }}>
                    <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ background: 'none', border: 'none', color: '#fff', width: '36px', height: '36px', cursor: 'pointer', fontSize: '20px', lineHeight: 1 }}>−</button>
                    <span style={{ padding: '0 16px', fontFamily: 'Space Grotesk, sans-serif', fontSize: '15px', minWidth: '40px', textAlign: 'center' }}>{qty}</span>
                    <button onClick={() => setQty(Math.min(product.stock, qty + 1))} style={{ background: 'none', border: 'none', color: '#fff', width: '36px', height: '36px', cursor: 'pointer', fontSize: '20px', lineHeight: 1 }}>+</button>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '24px' }}>
                  <button onClick={handleBuy} style={{ background: 'var(--primary)', color: '#fff', border: 'none', padding: '14px 28px', fontFamily: 'Space Grotesk, sans-serif', fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer', flex: 1, minWidth: '140px', whiteSpace: 'nowrap' }}>
                    {language === 'en' ? 'BUY NOW' : 'BELI SEKARANG'}
                  </button>
                  <button onClick={handleAdd} style={{ background: added ? 'var(--bg4)' : 'transparent', color: added ? '#4ade80' : '#fff', border: '1px solid ' + (added ? '#4ade80' : 'var(--border2)'), padding: '13px 28px', fontFamily: 'Space Grotesk, sans-serif', fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer', flex: 1, minWidth: '140px', whiteSpace: 'nowrap' }}>
                    {added ? '✓ ADDED' : (language === 'en' ? 'ADD TO CART' : 'TAMBAH KE KERANJANG')}
                  </button>
                </div>
              </>
            )}
            <a href={`https://wa.me/082358402290?text=Hi, I am interested in: ${product.name}`} target="_blank" rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg3)', border: '1px solid var(--border2)', padding: '12px 20px', textDecoration: 'none', color: 'var(--muted)', fontFamily: 'Space Grotesk, sans-serif', fontSize: '12px', letterSpacing: '1px', marginBottom: '24px' }}>
              💬 {language === 'en' ? 'Ask on WhatsApp' : 'Tanya via WhatsApp'}
            </a>
            <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '14px', lineHeight: '1.8', color: 'var(--text2)' }}>{product.description}</div>
          </div>
        </div>
        {related.length > 0 && (
          <div>
            <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '10px', letterSpacing: '5px', color: 'var(--primary)', marginBottom: '8px' }}>MORE LIKE THIS</div>
            <h3 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '32px', letterSpacing: '2px', marginBottom: '24px' }}>RELATED PIECES</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1px', background: 'var(--border)' }}>
              {related.map((p) => (
                <div key={p.id} style={{ background: 'var(--bg3)' }}>
                  <Link to={`/product/${p.slug}`} style={{ textDecoration: 'none' }}>
                    <div style={{ height: '200px', background: 'var(--bg4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '56px', borderBottom: '1px solid var(--border)' }}>
                      {p.image.startsWith('data:') || p.image.startsWith('http') ? <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span>{p.image}</span>}
                    </div>
                    <div style={{ padding: '16px' }}>
                      <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '18px', color: '#fff', letterSpacing: '1px', marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                      <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '15px', fontWeight: 700, color: 'var(--primary)' }}>{currency === 'IDR' ? formatRupiah(p.price) : formatUSD(p.priceUSD)}</div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
