import { useSearchParams, Link } from 'react-router-dom';
import { useAdminStore } from '../store/adminStore';

export default function OrderSuccessPage() {
  const [params] = useSearchParams();
  const { settings } = useAdminStore();
  const orderNumber = params.get('order') || '';
  const payment = params.get('payment') || '';
  const currency = params.get('currency') || 'IDR';
  const waMessage = encodeURIComponent(`Hi BORNEO HANDMADE, I have placed Order #${orderNumber} and selected payment: ${payment}. Please confirm my order.`);

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px' }}>
      <div style={{ maxWidth: '560px', width: '100%', textAlign: 'center' }}>
        <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '80px', color: 'var(--primary)', lineHeight: 1, marginBottom: '16px' }}>✓</div>
        <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '10px', letterSpacing: '5px', color: 'var(--primary)', marginBottom: '12px' }}>ORDER PLACED</div>
        <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '48px', letterSpacing: '2px', marginBottom: '12px' }}>THANK YOU!</h1>
        <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', padding: '20px', marginBottom: '28px' }}>
          <div style={{ fontSize: '12px', color: 'var(--muted)', letterSpacing: '2px', marginBottom: '6px', fontFamily: 'Space Grotesk, sans-serif' }}>ORDER NUMBER</div>
          <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--primary)', letterSpacing: '3px', fontFamily: 'Space Grotesk, sans-serif' }}>{orderNumber}</div>
        </div>
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', padding: '24px', marginBottom: '24px', textAlign: 'left' }}>
          <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '18px', letterSpacing: '2px', color: 'var(--primary)', marginBottom: '16px' }}>NEXT STEPS</div>
          {payment === 'bri' && (
            <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '14px', color: 'var(--text2)', lineHeight: '1.8' }}>
              <p style={{ marginBottom: '8px' }}>1. Transfer payment to:</p>
              <div style={{ background: 'var(--bg3)', padding: '12px 16px', marginBottom: '12px', border: '1px solid var(--border2)' }}>
                <div style={{ fontWeight: 700 }}>Bank BRI</div>
                <div style={{ color: 'var(--primary)', fontSize: '18px', letterSpacing: '2px' }}>{settings.bankAccountNumber || '(Set in Admin Settings)'}</div>
                <div style={{ color: 'var(--muted)' }}>{settings.bankAccountName}</div>
              </div>
              <p>2. Send proof of payment via WhatsApp</p>
              <p>3. Include your order number: {orderNumber}</p>
            </div>
          )}
          {(payment === 'paypal' || payment === 'usdt' || payment === 'wu' || payment === 'whatsapp') && (
            <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '14px', color: 'var(--text2)', lineHeight: '1.8' }}>
              <p>Contact us on WhatsApp to complete your order. Reference: <strong style={{ color: 'var(--primary)' }}>{orderNumber}</strong></p>
            </div>
          )}
        </div>
        <a href={`https://wa.me/${settings.whatsapp}?text=${waMessage}`} target="_blank" rel="noopener noreferrer"
          style={{ display: 'block', background: '#25d366', color: '#fff', padding: '14px 28px', fontFamily: 'Space Grotesk, sans-serif', fontSize: '13px', letterSpacing: '2px', textTransform: 'uppercase', textDecoration: 'none', marginBottom: '12px' }}>
          CONFIRM VIA WHATSAPP
        </a>
        <Link to="/" style={{ display: 'block', fontFamily: 'Space Grotesk, sans-serif', fontSize: '12px', color: 'var(--muted)', textDecoration: 'none', letterSpacing: '1px', padding: '12px' }}>
          ← BACK TO HOME
        </Link>
      </div>
    </div>
  );
}
