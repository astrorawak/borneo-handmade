import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { useAdminStore } from '../store/adminStore';
import { formatRupiah, formatUSD, generateOrderNumber, generateId } from '../lib/utils';
import type { Order } from '../types';

const SHIPPING_IDR = [
  { id: 'jne-reg', label: 'JNE Regular (3-5 days)', cost: 35000 },
  { id: 'jne-yes', label: 'JNE YES (1-2 days)', cost: 65000 },
  { id: 'jt-reg', label: 'J&T Regular (2-4 days)', cost: 32000 },
  { id: 'sicepat', label: 'SiCepat (2-3 days)', cost: 28000 },
  { id: 'intl', label: 'International DHL (7-21 days)', cost: 350000 },
];
const SHIPPING_USD = [
  { id: 'intl-std', label: 'Standard International (14-21 days)', cost: 25 },
  { id: 'intl-exp', label: 'Express International (7-10 days)', cost: 45 },
  { id: 'intl-dhl', label: 'DHL Express (3-5 days)', cost: 80 },
];

export default function CheckoutPage() {
  const { items, currency, language, getTotalIDR, getTotalUSD, clearCart } = useCartStore();
  const { settings, addOrder } = useAdminStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', country: 'Indonesia', address: '', city: '', postalCode: '' });
  const [shipping, setShipping] = useState('');
  const [payment, setPayment] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const shippingOptions = currency === 'IDR' ? SHIPPING_IDR : SHIPPING_USD;
  const selectedShipping = shippingOptions.find((s) => s.id === shipping);
  const subtotal = currency === 'IDR' ? getTotalIDR() : getTotalUSD();
  const shippingCost = selectedShipping ? selectedShipping.cost : 0;
  const total = subtotal + shippingCost;

  const paymentMethods = currency === 'IDR'
    ? [{ id: 'bri', label: `Bank BRI \u2014 ${settings.bankAccountNumber || 'Hubungi Admin'}` }, { id: 'whatsapp', label: 'Bayar via WhatsApp' }]
    : [{ id: 'paypal', label: `PayPal \u2014 ${settings.paypalEmail || 'Contact Admin'}` }, { id: 'usdt', label: `USDT ${settings.usdtNetwork} \u2014 ${settings.usdtAddress || 'Contact Admin'}` }, { id: 'wu', label: `Western Union \u2014 ${settings.westernUnionName || 'Contact Admin'}` }, { id: 'whatsapp', label: 'Contact via WhatsApp' }];

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name) e.name = 'Required';
    if (!form.phone) e.phone = 'Required';
    if (!form.address) e.address = 'Required';
    if (!form.city) e.city = 'Required';
    if (!shipping) e.shipping = 'Select shipping';
    if (!payment) e.payment = 'Select payment';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const orderNumber = generateOrderNumber();
    const order: Order = {
      id: generateId(), orderNumber, items: [...items],
      buyerName: form.name, buyerEmail: form.email, buyerPhone: form.phone,
      buyerCountry: form.country, buyerAddress: form.address, buyerCity: form.city, buyerPostalCode: form.postalCode,
      shippingMethod: selectedShipping?.label || '', shippingCost,
      paymentMethod: payment, currency, totalAmount: total, status: 'pending',
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    };
    addOrder(order);
    clearCart();
    navigate(`/order-success?order=${orderNumber}&payment=${payment}&currency=${currency}`);
  };

  const inp = (field: string) => ({ width: '100%', background: 'var(--bg3)', border: `1px solid ${errors[field] ? 'var(--primary)' : 'var(--border2)'}`, color: '#fff', padding: '10px 14px', fontFamily: 'Space Grotesk, sans-serif', fontSize: '14px', outline: 'none' });
  const lbl = (text: string) => <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '10px', letterSpacing: '2px', color: 'var(--muted)', marginBottom: '6px', textTransform: 'uppercase' as const }}>{text}</div>;

  if (items.length === 0) { navigate('/cart'); return null; }

  return (
    <div>
      <div style={{ background: 'var(--bg2)', borderBottom: '1px solid var(--border)', padding: '40px 0' }}>
        <div className="page-container">
          <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '10px', letterSpacing: '5px', color: 'var(--primary)', marginBottom: '8px' }}>// CHECKOUT //</div>
          <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '48px', letterSpacing: '2px' }}>CHECKOUT</h1>
        </div>
      </div>
      <div className="page-container" style={{ padding: '40px 16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px', alignItems: 'start' }}>
          <div>
            <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '20px', letterSpacing: '2px', marginBottom: '20px', color: 'var(--primary)' }}>01. SHIPPING DETAILS</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '32px' }}>
              <div>{lbl('Full Name *')}<input style={inp('name')} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div>{lbl('Email')}<input style={inp('email')} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
              <div>{lbl('WhatsApp / Phone *')}<input style={inp('phone')} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
              <div>{lbl('Country')}<input style={inp('country')} value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} /></div>
              <div>{lbl('Full Address *')}<textarea style={{ ...inp('address'), resize: 'vertical', minHeight: '80px' }} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>{lbl('City *')}<input style={inp('city')} value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></div>
                <div>{lbl('Postal Code')}<input style={inp('postalCode')} value={form.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} /></div>
              </div>
            </div>
            <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '20px', letterSpacing: '2px', marginBottom: '16px', color: 'var(--primary)' }}>02. SHIPPING METHOD</div>
            {errors.shipping && <div style={{ color: 'var(--primary)', fontSize: '12px', marginBottom: '8px' }}>{errors.shipping}</div>}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '32px' }}>
              {shippingOptions.map((opt) => (
                <div key={opt.id} onClick={() => setShipping(opt.id)}
                  style={{ background: shipping === opt.id ? 'var(--bg4)' : 'var(--bg3)', border: `1px solid ${shipping === opt.id ? 'var(--primary)' : 'var(--border2)'}`, padding: '12px 16px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '13px', color: shipping === opt.id ? '#fff' : 'var(--muted)' }}>{opt.label}</span>
                  <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '13px', fontWeight: 700, color: shipping === opt.id ? 'var(--primary)' : 'var(--muted)', whiteSpace: 'nowrap', marginLeft: '8px' }}>
                    {currency === 'IDR' ? formatRupiah(opt.cost as number) : formatUSD(opt.cost as number)}
                  </span>
                </div>
              ))}
            </div>
            <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '20px', letterSpacing: '2px', marginBottom: '16px', color: 'var(--primary)' }}>03. PAYMENT METHOD</div>
            {errors.payment && <div style={{ color: 'var(--primary)', fontSize: '12px', marginBottom: '8px' }}>{errors.payment}</div>}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '32px' }}>
              {paymentMethods.map((opt) => (
                <div key={opt.id} onClick={() => setPayment(opt.id)}
                  style={{ background: payment === opt.id ? 'var(--bg4)' : 'var(--bg3)', border: `1px solid ${payment === opt.id ? 'var(--primary)' : 'var(--border2)'}`, padding: '12px 16px', cursor: 'pointer' }}>
                  <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '13px', color: payment === opt.id ? '#fff' : 'var(--muted)' }}>{opt.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', padding: '24px', position: 'sticky', top: '80px' }}>
            <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '20px', letterSpacing: '2px', marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>ORDER SUMMARY</div>
            {items.map((item) => (
              <div key={item.product.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontFamily: 'Space Grotesk, sans-serif', fontSize: '13px' }}>
                <span style={{ color: 'var(--text2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '170px' }}>{item.product.name} x{item.quantity}</span>
                <span style={{ color: 'var(--text2)', flexShrink: 0, marginLeft: '8px' }}>{currency === 'IDR' ? formatRupiah(item.product.price * item.quantity) : formatUSD(item.product.priceUSD * item.quantity)}</span>
              </div>
            ))}
            <div style={{ borderTop: '1px solid var(--border)', marginTop: '12px', paddingTop: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'Space Grotesk, sans-serif', fontSize: '13px', marginBottom: '8px' }}>
                <span style={{ color: 'var(--muted)' }}>Subtotal</span><span>{currency === 'IDR' ? formatRupiah(subtotal) : formatUSD(subtotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'Space Grotesk, sans-serif', fontSize: '13px', marginBottom: '16px' }}>
                <span style={{ color: 'var(--muted)' }}>Shipping</span><span>{shipping ? (currency === 'IDR' ? formatRupiah(shippingCost) : formatUSD(shippingCost)) : '-'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'Space Grotesk, sans-serif', fontSize: '18px', fontWeight: 700, marginBottom: '24px' }}>
                <span>TOTAL</span><span style={{ color: 'var(--primary)' }}>{currency === 'IDR' ? formatRupiah(total) : formatUSD(total)}</span>
              </div>
            </div>
            <button onClick={handleSubmit} style={{ background: 'var(--primary)', color: '#fff', border: 'none', padding: '14px', width: '100%', fontFamily: 'Space Grotesk, sans-serif', fontSize: '13px', letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer' }}>
              PLACE ORDER
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
