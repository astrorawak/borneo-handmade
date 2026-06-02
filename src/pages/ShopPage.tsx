import { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAdminStore } from '../store/adminStore';
import { useCartStore } from '../store/cartStore';
import { formatRupiah, formatUSD } from '../lib/utils';

export default function ShopPage() {
  const { products, categories } = useAdminStore();
  const { currency, language, addItem } = useCartStore();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'all');
  const [sort, setSort] = useState('default');
  const [added, setAdded] = useState<number | null>(null);

  const filtered = useMemo(() => {
    let list = products.filter((p) => p.isActive);
    if (activeCategory !== 'all') list = list.filter((p) => p.categorySlug === activeCategory);
    if (search) list = list.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase()));
    if (sort === 'price-asc') list = [...list].sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') list = [...list].sort((a, b) => b.price - a.price);
    if (sort === 'name') list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [products, activeCategory, search, sort]);

  const handleAdd = (p: any) => { addItem(p); setAdded(p.id); setTimeout(() => setAdded(null), 1500); };

  return (
    <div style={{ minHeight: '80vh' }}>
      <div style={{ background: 'var(--bg2)', borderBottom: '1px solid var(--border)', padding: '40px 0' }}>
        <div className="page-container">
          <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '10px', letterSpacing: '5px', color: 'var(--primary)', marginBottom: '8px' }}>// THE SHOP //</div>
          <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(40px, 6vw, 64px)', letterSpacing: '2px' }}>
            {language === 'en' ? 'ALL PIECES' : 'SEMUA PRODUK'}
          </h1>
        </div>
      </div>
      <div className="page-container" style={{ padding: '32px 16px' }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '24px', alignItems: 'center' }}>
          <input type="text" placeholder={language === 'en' ? 'Search...' : 'Cari...'} value={search} onChange={(e) => setSearch(e.target.value)}
            style={{ background: 'var(--bg3)', border: '1px solid var(--border2)', color: '#fff', padding: '10px 16px', fontFamily: 'Space Grotesk, sans-serif', fontSize: '13px', outline: 'none', flex: '1', minWidth: '200px' }} />
          <select value={sort} onChange={(e) => setSort(e.target.value)}
            style={{ background: 'var(--bg3)', border: '1px solid var(--border2)', color: 'var(--muted)', padding: '10px 16px', fontFamily: 'Space Grotesk, sans-serif', fontSize: '13px', cursor: 'pointer' }}>
            <option value="default">Sort: Default</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name">Name A-Z</option>
          </select>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '32px' }}>
          <button onClick={() => setActiveCategory('all')}
            style={{ background: activeCategory === 'all' ? 'var(--primary)' : 'var(--bg3)', border: '1px solid ' + (activeCategory === 'all' ? 'var(--primary)' : 'var(--border2)'), color: activeCategory === 'all' ? '#fff' : 'var(--muted)', padding: '6px 16px', fontFamily: 'Space Grotesk, sans-serif', fontSize: '11px', letterSpacing: '1px', cursor: 'pointer', textTransform: 'uppercase' }}>
            ALL
          </button>
          {categories.map((cat) => (
            <button key={cat.id} onClick={() => setActiveCategory(cat.slug)}
              style={{ background: activeCategory === cat.slug ? 'var(--primary)' : 'var(--bg3)', border: '1px solid ' + (activeCategory === cat.slug ? 'var(--primary)' : 'var(--border2)'), color: activeCategory === cat.slug ? '#fff' : 'var(--muted)', padding: '6px 16px', fontFamily: 'Space Grotesk, sans-serif', fontSize: '11px', letterSpacing: '1px', cursor: 'pointer', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>
        <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '12px', color: 'var(--muted)', marginBottom: '20px', letterSpacing: '1px' }}>
          {filtered.length} {language === 'en' ? 'PIECES FOUND' : 'PRODUK DITEMUKAN'}
        </div>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--muted)' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
            <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '24px', letterSpacing: '2px' }}>NO PIECES FOUND</p>
          </div>
        ) : (
          <div style={{ background: 'var(--border)' }}>
            <div className="product-grid">
              {filtered.map((p) => (
                <div key={p.id} className="product-card" style={{ background: 'var(--bg3)' }}>
                  <Link to={`/product/${p.slug}`} style={{ textDecoration: 'none' }}>
                    <div style={{ height: '240px', background: 'var(--bg4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '64px', position: 'relative', borderBottom: '1px solid var(--border)' }}>
                      {p.image.startsWith('data:') || p.image.startsWith('http') ? <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span>{p.image}</span>}
                      {p.badge && <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--primary)', color: '#fff', fontFamily: 'Space Grotesk, sans-serif', fontSize: '9px', letterSpacing: '1px', padding: '6px 12px', textTransform: 'uppercase' }}>{p.badge}</div>}
                    </div>
                  </Link>
                  <div style={{ padding: '16px' }}>
                    <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '9px', letterSpacing: '3px', color: 'var(--primary)', marginBottom: '6px', textTransform: 'uppercase' }}>{p.category}</div>
                    <Link to={`/product/${p.slug}`} style={{ textDecoration: 'none' }}>
                      <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '22px', color: '#fff', letterSpacing: '1px', marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                    </Link>
                    <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '11px', color: 'var(--muted)', marginBottom: '14px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.origin}</div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '16px', fontWeight: 700, color: 'var(--primary)' }}>
                        {currency === 'IDR' ? formatRupiah(p.price) : formatUSD(p.priceUSD)}
                      </div>
                      <button onClick={() => handleAdd(p)}
                        style={{ background: added === p.id ? 'var(--primary)' : 'transparent', border: '1px solid ' + (added === p.id ? 'var(--primary)' : 'var(--border2)'), color: added === p.id ? '#fff' : 'var(--muted)', padding: '7px 14px', fontSize: '10px', fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '1px', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap' }}>
                        {added === p.id ? '✓' : '+ ADD'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
