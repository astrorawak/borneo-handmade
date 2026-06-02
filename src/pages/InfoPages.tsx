export function AboutPage() {
  return (
    <div>
      <div style={{ background: 'var(--bg2)', borderBottom: '1px solid var(--border)', padding: '40px 0' }}>
        <div className="page-container">
          <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '10px', letterSpacing: '5px', color: 'var(--primary)', marginBottom: '8px' }}>// OUR STORY //</div>
          <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(40px, 6vw, 64px)', letterSpacing: '2px' }}>ABOUT US</h1>
        </div>
      </div>
      <div className="page-container" style={{ padding: '64px 16px' }}>
        <div style={{ maxWidth: '720px' }}>
          <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '36px', letterSpacing: '2px', color: 'var(--primary)', marginBottom: '16px' }}>BORNEO HANDMADE</h2>
          <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '16px', lineHeight: '1.8', color: 'var(--text2)', marginBottom: '20px' }}>
            We are dedicated to preserving and sharing the extraordinary artistic heritage of Borneo. Every piece in our collection is sourced directly from indigenous artisans across the island.
          </p>
          <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '16px', lineHeight: '1.8', color: 'var(--text2)', marginBottom: '20px' }}>
            Our mission is simple: connect the world to the soul of Borneo, while ensuring that the artisans who create these works are fairly compensated and their traditions are respected and preserved.
          </p>
          <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '16px', lineHeight: '1.8', color: 'var(--text2)', marginBottom: '40px' }}>
            Each piece comes with documentation of its origin, materials, and the tradition it represents. We never sell replicas or mass-produced copies. Every item is authentic and one-of-a-kind.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1px', background: 'var(--border)', marginBottom: '40px' }}>
            {[{ n: '100+', label: 'Artisan Partners' }, { n: '500+', label: 'Pieces Sold' }, { n: '30+', label: 'Countries Shipped' }, { n: '10+', label: 'Years Experience' }].map((s) => (
              <div key={s.n} style={{ background: 'var(--bg3)', padding: '28px', textAlign: 'center' }}>
                <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '48px', color: 'var(--primary)', lineHeight: 1 }}>{s.n}</div>
                <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '11px', letterSpacing: '2px', color: 'var(--muted)', marginTop: '6px', textTransform: 'uppercase' }}>{s.label}</div>
              </div>
            ))}
          </div>
          <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', padding: '24px' }}>
            <h3 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '22px', letterSpacing: '2px', color: 'var(--primary)', marginBottom: '12px' }}>CONTACT US</h3>
            <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '14px', color: 'var(--text2)', marginBottom: '6px' }}>Email: astrorawak@gmail.com</p>
            <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '14px', color: 'var(--text2)', marginBottom: '16px' }}>WhatsApp: +62 823 5840 2290</p>
            <a href="https://wa.me/082358402290" target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-block', background: '#25d366', color: '#fff', padding: '10px 24px', fontFamily: 'Space Grotesk, sans-serif', fontSize: '12px', letterSpacing: '2px', textDecoration: 'none', textTransform: 'uppercase' }}>
              CHAT ON WHATSAPP
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ShippingPage() {
  return (
    <div>
      <div style={{ background: 'var(--bg2)', borderBottom: '1px solid var(--border)', padding: '40px 0' }}>
        <div className="page-container">
          <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '10px', letterSpacing: '5px', color: 'var(--primary)', marginBottom: '8px' }}>// DELIVERY //</div>
          <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(40px, 6vw, 64px)', letterSpacing: '2px' }}>SHIPPING INFO</h1>
        </div>
      </div>
      <div className="page-container" style={{ padding: '64px 16px' }}>
        <div style={{ maxWidth: '720px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
          {[
            { title: 'DOMESTIC SHIPPING (INDONESIA)', content: 'We ship via JNE, J&T, SiCepat, and Anteraja. Standard delivery 2-5 business days. Express options available. All fragile antique items are packed with extra protective materials at no extra charge.' },
            { title: 'INTERNATIONAL SHIPPING', content: 'We ship worldwide via DHL Express and EMS. Estimated 7-21 business days. All international shipments include full insurance and tracking. Customs fees and import duties are the responsibility of the buyer.' },
            { title: 'PACKAGING', content: 'Every piece is professionally packaged to ensure safe delivery. Fragile items are wrapped in bubble wrap and cushioning foam, then packed in double-wall cardboard boxes.' },
            { title: 'TRACKING', content: 'Once shipped, you will receive a tracking number via WhatsApp or email. You can use this to track your order on the carrier website.' },
            { title: 'RETURNS', content: 'We accept returns within 7 days if the item was significantly misrepresented. Please contact us via WhatsApp immediately if you have any concerns with your order.' },
          ].map((item) => (
            <div key={item.title} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', padding: '24px' }}>
              <h3 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '20px', letterSpacing: '2px', color: 'var(--primary)', marginBottom: '12px' }}>{item.title}</h3>
              <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '14px', lineHeight: '1.8', color: 'var(--text2)' }}>{item.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function FAQPage() {
  const faqs = [
    { q: 'Are all items authentic and handmade?', a: 'Yes, absolutely. Every single piece in our collection is authentic and handmade by indigenous artisans. We never sell replicas, machine-made copies, or mass-produced items.' },
    { q: 'How do I know the origin of a piece?', a: 'Each product listing includes detailed information about the tribe or community, the region, and the materials used. For rare or high-value antiques, we can provide additional documentation upon request.' },
    { q: 'Do you ship internationally?', a: 'Yes, we ship to over 50 countries worldwide via DHL Express and EMS. Please note that customs duties and import taxes are the responsibility of the buyer.' },
    { q: 'What payment methods do you accept?', a: 'For Indonesian customers: Bank BRI transfer. For international customers: PayPal, USDT, Western Union, and Wire Transfer. Contact us via WhatsApp to arrange other methods.' },
    { q: 'Can I request a specific type of piece?', a: 'Yes! We work directly with artisans across Borneo and may be able to source specific items on request. Contact us via WhatsApp with your requirements.' },
    { q: 'How are fragile antiques packaged?', a: 'All fragile items are triple-wrapped in bubble wrap and foam, placed in a custom-fitted inner box, then packed in a heavy-duty outer carton.' },
    { q: 'What is your return policy?', a: 'We accept returns within 7 days if the item was significantly misrepresented in its listing. Please contact us immediately via WhatsApp.' },
  ];

  return (
    <div>
      <div style={{ background: 'var(--bg2)', borderBottom: '1px solid var(--border)', padding: '40px 0' }}>
        <div className="page-container">
          <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '10px', letterSpacing: '5px', color: 'var(--primary)', marginBottom: '8px' }}>// HELP //</div>
          <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(40px, 6vw, 64px)', letterSpacing: '2px' }}>FAQ</h1>
        </div>
      </div>
      <div className="page-container" style={{ padding: '64px 16px' }}>
        <div style={{ maxWidth: '720px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {faqs.map((faq, i) => (
            <details key={i} style={{ background: 'var(--bg2)', border: '1px solid var(--border)' }}>
              <summary style={{ padding: '18px 20px', fontFamily: 'Bebas Neue, sans-serif', fontSize: '18px', letterSpacing: '1px', cursor: 'pointer', color: '#fff', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {faq.q}<span style={{ color: 'var(--primary)', fontSize: '20px', flexShrink: 0, marginLeft: '8px' }}>+</span>
              </summary>
              <div style={{ padding: '0 20px 18px', fontFamily: 'Space Grotesk, sans-serif', fontSize: '14px', lineHeight: '1.8', color: 'var(--text2)', borderTop: '1px solid var(--border)' }}>
                <div style={{ paddingTop: '14px' }}>{faq.a}</div>
              </div>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
