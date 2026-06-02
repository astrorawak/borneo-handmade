import { Link } from 'react-router-dom';
import { useAdminStore } from '../store/adminStore';

export function BlogPage() {
  const { blogPosts } = useAdminStore();
  const published = blogPosts.filter((b) => b.isPublished);
  return (
    <div>
      <div style={{ background: 'var(--bg2)', borderBottom: '1px solid var(--border)', padding: '40px 0' }}>
        <div className="page-container">
          <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '10px', letterSpacing: '5px', color: 'var(--primary)', marginBottom: '8px' }}>// STORIES //</div>
          <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(40px, 6vw, 64px)', letterSpacing: '2px' }}>THE BLOG</h1>
        </div>
      </div>
      <div className="page-container" style={{ padding: '48px 16px' }}>
        {published.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--muted)', fontFamily: 'Bebas Neue, sans-serif', fontSize: '24px', letterSpacing: '2px' }}>NO ARTICLES YET</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1px', background: 'var(--border)' }}>
            {published.map((post) => (
              <div key={post.id} style={{ background: 'var(--bg3)' }}>
                <div style={{ height: '200px', background: 'var(--bg4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '64px', borderBottom: '1px solid var(--border)' }}>
                  {post.image.startsWith('data:') || post.image.startsWith('http') ? <img src={post.image} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span>{post.image}</span>}
                </div>
                <div style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
                    {post.tags.slice(0, 3).map((tag) => (
                      <span key={tag} style={{ background: 'var(--bg4)', border: '1px solid var(--border2)', fontFamily: 'Space Grotesk, sans-serif', fontSize: '9px', letterSpacing: '1px', color: 'var(--muted)', padding: '3px 8px', textTransform: 'uppercase' }}>{tag}</span>
                    ))}
                  </div>
                  <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '10px', letterSpacing: '2px', color: 'var(--primary)', marginBottom: '8px' }}>{post.publishedAt}</div>
                  <Link to={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
                    <h3 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '22px', color: '#fff', letterSpacing: '1px', marginBottom: '10px', lineHeight: '1.2' }}>{post.title}</h3>
                  </Link>
                  <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '13px', color: 'var(--muted)', lineHeight: '1.6', marginBottom: '16px' }}>{post.excerpt.slice(0, 120)}...</p>
                  <Link to={`/blog/${post.slug}`} style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '11px', letterSpacing: '2px', color: 'var(--primary)', textDecoration: 'none', textTransform: 'uppercase' }}>READ MORE \u2192</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function BlogPostPage() {
  const { blogPosts } = useAdminStore();
  const slug = window.location.pathname.split('/').pop();
  const post = blogPosts.find((b) => b.slug === slug && b.isPublished);

  if (!post) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0', color: 'var(--muted)' }}>
        <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '32px', letterSpacing: '2px', marginBottom: '16px' }}>ARTICLE NOT FOUND</h2>
        <Link to="/blog" style={{ color: 'var(--primary)', textDecoration: 'none', fontFamily: 'Space Grotesk, sans-serif', fontSize: '13px', letterSpacing: '2px', border: '1px solid var(--primary)', padding: '10px 24px', display: 'inline-block' }}>BACK TO BLOG</Link>
      </div>
    );
  }

  const handleShare = async () => {
    if (navigator.share) { await navigator.share({ title: post.title, url: window.location.href }); }
    else { navigator.clipboard.writeText(window.location.href); alert('Link copied!'); }
  };

  const renderContent = (content: string) => content.split('\n').map((line, i) => {
    const imgMatch = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (imgMatch) return <img key={i} src={imgMatch[2]} alt={imgMatch[1]} style={{ width: '100%', borderRadius: '4px', margin: '16px 0', objectFit: 'cover', maxHeight: '400px' }} />;
    if (line.startsWith('## ')) return <h2 key={i} style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '28px', letterSpacing: '2px', color: 'var(--primary)', marginTop: '32px', marginBottom: '12px' }}>{line.slice(3)}</h2>;
    if (line.startsWith('### ')) return <h3 key={i} style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '22px', letterSpacing: '2px', marginTop: '24px', marginBottom: '8px' }}>{line.slice(4)}</h3>;
    if (line.startsWith('- ')) return <li key={i} style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '15px', lineHeight: '1.8', color: 'var(--text2)', marginLeft: '20px', marginBottom: '4px' }}>{line.slice(2)}</li>;
    if (line.includes('**')) {
      const parts = line.split(/\*\*(.+?)\*\*/g);
      return <p key={i} style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '15px', lineHeight: '1.8', color: 'var(--text2)', marginBottom: '12px' }}>{parts.map((p, j) => j % 2 === 1 ? <strong key={j} style={{ color: '#fff' }}>{p}</strong> : p)}</p>;
    }
    if (line.trim()) return <p key={i} style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '15px', lineHeight: '1.8', color: 'var(--text2)', marginBottom: '12px' }}>{line}</p>;
    return <br key={i} />;
  });

  return (
    <div>
      <div style={{ background: 'var(--bg2)', borderBottom: '1px solid var(--border)', padding: '40px 0' }}>
        <div className="page-container">
          <Link to="/blog" style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '11px', letterSpacing: '2px', color: 'var(--primary)', textDecoration: 'none', display: 'inline-block', marginBottom: '16px' }}>\u2190 BLOG</Link>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
            {post.tags.slice(0, 3).map((tag) => (
              <span key={tag} style={{ background: 'var(--bg3)', border: '1px solid var(--border2)', fontFamily: 'Space Grotesk, sans-serif', fontSize: '9px', letterSpacing: '1px', color: 'var(--muted)', padding: '3px 8px', textTransform: 'uppercase' }}>{tag}</span>
            ))}
          </div>
          <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(32px, 5vw, 60px)', letterSpacing: '2px', lineHeight: '1.1', maxWidth: '800px', marginBottom: '16px' }}>{post.title}</h1>
          <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '12px', color: 'var(--muted)' }}>{post.author} \u00b7 {post.publishedAt}</div>
        </div>
      </div>
      <div style={{ background: 'var(--bg3)', borderBottom: '1px solid var(--border)', padding: '12px 0' }}>
        <div className="page-container" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button onClick={handleShare} style={{ background: 'var(--primary)', color: '#fff', border: 'none', padding: '8px 18px', fontFamily: 'Space Grotesk, sans-serif', fontSize: '11px', letterSpacing: '1px', cursor: 'pointer' }}>SHARE</button>
          <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent(post.title + ' ' + window.location.href)}`} target="_blank" rel="noopener noreferrer"
            style={{ background: '#25d366', color: '#fff', padding: '8px 18px', fontFamily: 'Space Grotesk, sans-serif', fontSize: '11px', letterSpacing: '1px', textDecoration: 'none' }}>WHATSAPP</a>
        </div>
      </div>
      <div className="page-container" style={{ padding: '48px 16px' }}>
        <div style={{ maxWidth: '720px' }}>
          <div style={{ height: '360px', background: 'var(--bg3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '80px', marginBottom: '40px', border: '1px solid var(--border)' }}>
            {post.image.startsWith('data:') || post.image.startsWith('http') ? <img src={post.image} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span>{post.image}</span>}
          </div>
          <div>{renderContent(post.content)}</div>
          <div style={{ marginTop: '40px', paddingTop: '24px', borderTop: '1px solid var(--border)', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button onClick={handleShare} style={{ background: 'var(--primary)', color: '#fff', border: 'none', padding: '10px 20px', fontFamily: 'Space Grotesk, sans-serif', fontSize: '11px', letterSpacing: '1px', cursor: 'pointer' }}>SHARE THIS ARTICLE</button>
            <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent(post.title + ' ' + window.location.href)}`} target="_blank" rel="noopener noreferrer"
              style={{ background: '#25d366', color: '#fff', padding: '10px 20px', fontFamily: 'Space Grotesk, sans-serif', fontSize: '11px', letterSpacing: '1px', textDecoration: 'none' }}>WHATSAPP</a>
          </div>
        </div>
      </div>
    </div>
  );
}
