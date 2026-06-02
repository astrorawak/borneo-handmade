import { Link } from 'react-router-dom';
import { useAdminStore } from '../store/adminStore';
import { useCartStore } from '../store/cartStore';
import { formatRupiah, formatUSD } from '../lib/utils';

export default function HomePage() {
  const { products, categories, blogPosts } = useAdminStore();
  const { currency, language, addItem } = useCartStore();
  const featured = products.filter((p) => p.isActive).slice(0, 6);
  const recentBlogs = blogPosts.filter((b) => b.isPublished).slice(0, 3);

  const t = {
    hero1: language === 'en' ? 'RAW.' : 'NYATA.',
    hero2: language === 'en' ? 'REAL.' : 'ASLI.',
    hero3: 'BORNEO.',
    heroDesc: language === 'en'
      ? 'No factories. No machines. Only human hands and ancient knowledge. Every piece is one-of-a-kind, forged in the heart of Borneo.'
      : 'Tanpa pabrik. Tanpa mesin. Hanya tangan manusia dan pengetahuan kuno. Setiap karya unik, lahir dari jantung Borneo.',
    shopNow: language === 'en' ? 'SHOP NOW' : 'BELI SEKARANG',
    learnMore: language === 'en' ? 'LEARN MORE' : 'PELAJARI LEBIH',
    featured: language === 'en' ? 'FEATURED PIECES' : 'PRODUK UNGGULAN',
    collection: language === 'en' ? 'THE COLLECTION' : 'KOLEKSI',
    viewAll: language === 'en' ? 'VIEW ALL' : 'LIHAT SEMUA',
    addCart: language === 'en' ? 'ADD' : 'TAMBAH',
    categories: language === 'en' ? 'BROWSE BY CATEGORY' : 'KATEGORI',
    latestBlog: language === 'en' ? 'LATEST ARTICLES' : 'ARTIKEL TERBARU',
    readMore: language === 'en' ? 'READ MORE' : 'BACA SELENGKAPNYA',
    whyUs: language === 'en' ? 'WHY BORNEO HANDMADE' : 'MENGAPA BORNEO HANDMADE',
  };

  return (
    <div>
      {/* HERO */}
      <section style={{ background: 'var(--bg2)', minHeight: '580px', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden', borderBottom: '1px solid var(--border)' }}>
        <div style={{ position: 'absolute', right: '-40px', bottom: '-60px', fontFamily: 'Bebas Neue, sans-serif', fontSize: '280px', color: 'rgba(255,68,34,0.04)', pointerEvents: 'none', lineHeight: 1, whiteSpace: 'nowrap', userSelect: 'none' }}>BORNEO</div>
        <div className="page-container" style={{ padding: '80px 16px', position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: '600px' }}>
            <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '10px', letterSpacing: '5px', textTransform: 'uppercase', color: 'var(--primary)', marginBottom: '16px' }}>// Authentic Borneo Art //</div>
            <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(72px, 12vw, 120px)', lineHeight: 0.9, letterSpacing: '2px', marginBottom: '24px' }}>
              <span style={{ display: 'block' }}>{t.hero1}</span>
              <span style={{ display: 'block' }}>{t.hero2}</span>
              <span style={{ display: 'block', color: 'var(--primary)' }}>{t.hero3}</span>
            </h1>
            <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '15px', lineHeight: '1.7', color: 'var(--muted)', marginBottom: '36px', maxWidth: '480px' }}>{t.heroDesc}</p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Link to="/shop" style={{ background: 'var(--primary)', color: '#fff', padding: '14px 32px', fontFamily: 'Space Grotesk, sans-serif', fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', textDecoration: 'none', display: 'inline-block', whiteSpace: 'nowrap' }}>{t.shopNow}</Link>
              <Link to="/about" style={{ background: 'transparent', color: '#fff', border: '1px solid var(--border2)', padding: '13px 32px', fontFamily: 'Space Grotesk, sans-serif', fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', textDecoration: 'none', display: 'inline-block', whiteSpace: 'nowrap' }}>{t.learnMore}</Link>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section style={{ padding: '64px 0', background: 'var(--bg)' }}>
        <div className="page-container">
          <div style={{ marginBottom: '32px' }}>
            <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '10px', letterSpacing: '5px', color: 'var(--primary)', marginBottom: '6px' }}>{t.categories}</div>
            <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '40px', letterSpacing: '2px' }}>EXPLORE</h2>
          </div>
          <div className="category-grid">
            {categories.map((cat) => (
              <Link key={cat.id} to={`/shop?category=${cat.slug}`} style={{ textDecoration: 'none' }}>
                <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', padding: '24px 16px', textAlign: 'center', transition: 'border-color 0.2s, background 0.2s', cursor: 'pointer' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--primary)'; (e.currentTarget as HTMLDivElement).style.background = 'var(--bg4)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLDivElement).style.background = 'var(--bg3)'; }}>
                  <div style={{ fontSize: '36px', marginBottom: '12px' }}>{cat.icon}</div>
                  <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '12px', letterSpacing: '1px', color: 'var(--text2)' }}>{cat.name}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section style={{ padding: '64px 0', background: 'var(--bg2)' }}>
        <div className="page-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '10px', letterSpacing: '5px', color: 'var(--primary)', marginBottom: '6px' }}>{t.featured}</div>
              <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '40px', letterSpacing: '2px' }}>{t.collection}</h2>
            </div>
            <Link to="/shop" style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '11px', letterSpacing: '2px', color: 'var(--primary)', textDecoration: 'none', border: '1px solid var(--primary)', padding: '8px 20px', whiteSpace: 'nowrap' }}>{t.viewAll} \u2192</Link>
          </div>
          <div style={{ background: 'var(--border)' }}>
            <div className="product-grid">
              {featured.map((p) => (
                <div key={p.id} className="product-card" style={{ background: 'var(--bg3)' }}>
                  <Link to={`/product/${p.slug}`} style={{ textDecoration: 'none' }}>
                    <div style={{ height: '240px', background: 'var(--bg4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '64px', position: 'relative', borderBottom: '1px solid var(--border)' }}>
                      {p.image.startsWith('data:') || p.image.startsWith('http') ? <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span>{p.image}</span>}
                      {p.badge && <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--primary)', color: '#fff', fontFamily: 'Space Grotesk, sans-serif', fontSize: '9px', letterSpacing: '1px', padding: '6px 12px', textTransform: 'uppercase' }}>{p.badge}</div>}
                    </div>
                  </Link>
                  <div style={{ padding: '16px' }}>
                    <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '9px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--primary)', marginBottom: '6px' }}>{p.category}</div>
                    <Link to={`/product/${p.slug}`} style={{ textDecoration: 'none' }}>
                      <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '22px', color: '#fff', letterSpacing: '1px', marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                    </Link>
                    <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '11px', color: 'var(--muted)', marginBottom: '14px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.origin}</div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '16px', fontWeight: 700, color: 'var(--primary)' }}>{currency === 'IDR' ? formatRupiah(p.price) : formatUSD(p.priceUSD)}</div>
                      <button onClick={() => addItem(p)} style={{ background: 'transparent', border: '1px solid var(--border2)', color: 'var(--muted)', padding: '7px 14px', fontSize: '10px', fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '1px', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap' }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--primary)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--primary)'; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border2)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--muted)'; }}>
                        + {t.addCart}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section style={{ padding: '64px 0', background: 'var(--bg)' }}>
        <div className="page-container">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '10px', letterSpacing: '5px', color: 'var(--primary)', marginBottom: '8px' }}>{t.whyUs}</div>
            <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '40px', letterSpacing: '2px' }}>OUR PROMISE</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1px', background: 'var(--border)' }}>
            {[
              { icon: '\u270b', title: '100% HANDMADE', desc: 'Every piece crafted entirely by hand using traditional techniques passed down through generations.' },
              { icon: '\ud83c\udf3f', title: 'AUTHENTIC ORIGIN', desc: 'Sourced directly from indigenous artisans across Borneo. Verified authentic, never replicated.' },
              { icon: '\ud83d\udce6', title: 'WORLDWIDE SHIPPING', desc: 'Careful packaging with full insurance. We ship to 50+ countries with tracking.' },
              { icon: '\ud83e\udd1d', title: 'DIRECT FROM MAKER', desc: 'We work directly with artisans, ensuring fair payment and preserving cultural heritage.' },
            ].map((item) => (
              <div key={item.title} style={{ background: 'var(--bg2)', padding: '32px 24px', textAlign: 'center' }}>
                <div style={{ fontSize: '36px', marginBottom: '16px' }}>{item.icon}</div>
                <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '18px', letterSpacing: '2px', color: 'var(--primary)', marginBottom: '10px' }}>{item.title}</div>
                <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '13px', color: 'var(--muted)', lineHeight: '1.6' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BLOG */}
      {recentBlogs.length > 0 && (
        <section style={{ padding: '64px 0', background: 'var(--bg2)' }}>
          <div className="page-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '10px', letterSpacing: '5px', color: 'var(--primary)', marginBottom: '6px' }}>{t.latestBlog}</div>
                <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '40px', letterSpacing: '2px' }}>STORIES</h2>
              </div>
              <Link to="/blog" style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '11px', letterSpacing: '2px', color: 'var(--primary)', textDecoration: 'none', border: '1px solid var(--primary)', padding: '8px 20px', whiteSpace: 'nowrap' }}>{t.viewAll} \u2192</Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1px', background: 'var(--border)' }}>
              {recentBlogs.map((post) => (
                <div key={post.id} style={{ background: 'var(--bg3)' }}>
                  <div style={{ height: '180px', background: 'var(--bg4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px', borderBottom: '1px solid var(--border)' }}>
                    {post.image.startsWith('data:') || post.image.startsWith('http') ? <img src={post.image} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span>{post.image}</span>}
                  </div>
                  <div style={{ padding: '20px' }}>
                    <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '9px', letterSpacing: '2px', color: 'var(--primary)', marginBottom: '8px', textTransform: 'uppercase' }}>{post.publishedAt}</div>
                    <Link to={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
                      <h3 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '20px', color: '#fff', letterSpacing: '1px', marginBottom: '8px', lineHeight: '1.2' }}>{post.title}</h3>
                    </Link>
                    <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '13px', color: 'var(--muted)', lineHeight: '1.6', marginBottom: '16px' }}>{post.excerpt.slice(0, 100)}...</p>
                    <Link to={`/blog/${post.slug}`} style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '11px', letterSpacing: '1px', color: 'var(--primary)', textDecoration: 'none', textTransform: 'uppercase' }}>{t.readMore} \u2192</Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* WHATSAPP CTA */}
      <section style={{ padding: '64px 0', background: 'var(--bg)', textAlign: 'center' }}>
        <div className="page-container">
          <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '10px', letterSpacing: '5px', color: 'var(--primary)', marginBottom: '12px' }}>CONTACT US</div>
          <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(32px, 5vw, 56px)', letterSpacing: '2px', marginBottom: '16px' }}>HAVE A QUESTION?</h2>
          <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '15px', color: 'var(--muted)', marginBottom: '28px', maxWidth: '500px', margin: '0 auto 28px' }}>
            Contact us directly on WhatsApp for custom orders, inquiries, or to verify authenticity.
          </p>
          <a href="https://wa.me/082358402290" target="_blank" rel="noopener noreferrer"
            style={{ background: '#25d366', color: '#fff', padding: '14px 36px', fontFamily: 'Space Grotesk, sans-serif', fontSize: '13px', letterSpacing: '2px', textTransform: 'uppercase', textDecoration: 'none', display: 'inline-block' }}>
            CHAT ON WHATSAPP
          </a>
        </div>
      </section>
    </div>
  );
}
