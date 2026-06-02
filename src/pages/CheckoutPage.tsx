import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { useAdminStore } from '../store/adminStore';
import { formatRupiah, formatUSD, generateOrderNumber, generateId } from '../lib/utils';
import type { Order } from '../types';

export default function CheckoutPage() {
  const { items, currency, language, getTotalIDR, getTotalUSD, clearCart } = useCartStore();
  const { settings, addOrder } = useAdminStore();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '', email: '', phone: '', country: 'Indonesia',
    address: '', city: '', postalCode: ''
  });
  const [shipping, setShipping] = useState('');
  const [payment, setPayment] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const shippingOptions = settings.shippingOptions
    ? settings.shippingOptions.filter((s) => s.isActive)
    : [];

  const selectedShipping = shippingOptions.find((s) => s.id === shipping);
  const subtotal = currency === 'IDR' ? getTotalIDR() : getTotalUSD();
  const shippingCost = selectedShipping
    ? (currency === 'IDR' ? selectedShipping.costIDR : selectedShipping.costUSD)
    : 0;
  const total = subtotal + shippingCost;

  const paymentMethods = currency === 'IDR'
    ? [
        { id: 'bri', label: 'Bank ' + settings.bankName + (settings.bankAccountNumber ? ' — ' + settings.bankAccountNumber : ' (hubungi admin untuk rekening)') },
        { id: 'whatsapp', label: 'Koordinasi via WhatsApp' },
      ]
    : [
        { id: 'paypal', label: 'PayPal' + (settings.paypalEmail ? ' — ' + settings.paypalEmail : ' (contact admin)') },
        { id: 'usdt', label: 'USDT ' + settings.usdtNetwork + (settings.usdtAddress ? ' — ' + settings.usdtAddress : ' (contact admin)') },
        { id: 'wu', label: 'Western Union' + (settings.westernUnionName ? ' — ' + settings.westernUnionName : ' (contact admin)') },
        { id: 'whatsapp', label: 'Contact via WhatsApp' },
      ];

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Required';
    if (!form.phone.trim()) e.phone = 'Required';
    if (!form.address.trim()) e.address = 'Required';
    if (!form.city.trim()) e.city = 'Required';
    if (!shipping) e.shipping = 'Please select a shipping method';
    if (!payment) e.payment = 'Please select a payment method';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const orderNumber = generateOrderNumber();
    const order: Order = {
      id: generateId(),
      orderNumber,
      items: [...items],
      buyerName: form.name,
      buyerEmail: form.email,
      buyerPhone: form.phone,
      buyerCountry: form.country,
      buyerAddress: form.address,
      buyerCity: form.city,
      buyerPostalCode: form.postalCode,
      shippingMethod: selectedShipping
        ? selectedShipping.label + ' (' + selectedShipping.estimatedDays + ')'
        : '',
      shippingCost,
      paymentMethod: payment,
      currency,
      totalAmount: total,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    addOrder(order);
    clearCart();
    navigate('/order-success?order=' + orderNumber + '&payment=' + payment + '&currency=' + currency);
  };

  const inputStyle = (field: string) => ({
    width: '100%',
    background: 'var(--bg3)',
    border: '1px solid ' + (errors[field] ? 'var(--primary)' : 'var(--border2)'),
    color: '#fff',
    padding: '10px 14px',
    fontFamily: 'Space Grotesk, sans-serif',
    fontSize: '14px',
    outline: 'none',
  });

  const lbl = (text: string) => (
    <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '10px', letterSpacing: '2px', color: 'var(--muted)', marginBottom: '6px', textTransform: 'uppercase' as const }}>{text}</div>
  );

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

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
            {Object.keys(errors).length > 0 && (
              <div style={{ background: 'rgba(255,68,34,0.1)', border: '1px solid var(--primary)', padding: '12px 16px', marginBottom: '20px', fontFamily: 'Space Grotesk, sans-serif', fontSize: '13px', color: 'var(--primary)' }}>
                ⚠️ Please fill in all required fields before placing order
              </div>
            )}
            <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '20px', letterSpacing: '2px', marginBottom: '20px', color: 'var(--primary)' }}>01. SHIPPING DETAILS</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '32px' }}>
              <div>{lbl('Full Name *')}<input style={inputStyle('name')} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your full name" />{errors.name && <div style={{ color: 'var(--primary)', fontSize: '11px', marginTop: '4px' }}>{errors.name}</div>}</div>
              <div>{lbl('Email')}<input style={inputStyle('email')} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="your@email.com" /></div>
              <div>{lbl('WhatsApp / Phone *')}<input style={inputStyle('phone')} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+62 or local number" />{errors.phone && <div style={{ color: 'var(--primary)', fontSize: '11px', marginTop: '4px' }}>{errors.phone}</div>}</div>
              <div>{lbl('Country')}<input style={inputStyle('country')} value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} /></div>
              <div>{lbl('Full Address *')}<textarea style={{ ...inputStyle('address'), resize: 'vertical', minHeight: '80px' }} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Street address" />{errors.address && <div style={{ color: 'var(--primary)', fontSize: '11px', marginTop: '4px' }}>{errors.address}</div>}</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>{lbl('City *')}<input style={inputStyle('city')} value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />{errors.city && <div style={{ color: 'var(--primary)', fontSize: '11px', marginTop: '4px' }}>{errors.city}</div>}</div>
                <div>{lbl('Postal Code')}<input style={inputStyle('postalCode')} value={form.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} /></div>
              </div>
            </div>
            <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '20px', letterSpacing: '2px', marginBottom: '16px', color: 'var(--primary)' }}>02. SHIPPING METHOD</div>
            {errors.shipping && <div style={{ color: 'var(--primary)', fontSize: '12px', marginBottom: '8px' }}>⚠️ {errors.shipping}</div>}
            {shippingOptions.length === 0 ? (
              <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', padding: '16px', fontFamily: 'Space Grotesk, sans-serif', fontSize: '13px', color: 'var(--muted)', marginBottom: '32px' }}>
                No shipping methods configured. Please contact us via WhatsApp.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '32px' }}>
                {shippingOptions.map((opt) => (
                  <div key={opt.id} onClick={() => setShipping(opt.id)}
                    style={{ background: shipping === opt.id ? 'var(--bg4)' : 'var(--bg3)', border: '1px solid ' + (shipping === opt.id ? 'var(--primary)' : 'var(--border2)'), padding: '12px 16px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                    <div>
                      <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '13px', color: shipping === opt.id ? '#fff' : 'var(--text2)', fontWeight: 600 }}>{opt.label}</div>
                      <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '11px', color: 'var(--muted)', marginTop: '2px' }}>Est. {opt.estimatedDays}</div>
                    </div>
                    <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '14px', fontWeight: 700, color: shipping === opt.id ? 'var(--primary)' : 'var(--muted)', whiteSpace: 'nowrap' }}>
                      {currency === 'IDR' ? formatRupiah(opt.costIDR) : formatUSD(opt.costUSD)}
                    </span>
                  </div>
                ))}
              </div>
            )}
            <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '20px', letterSpacing: '2px', marginBottom: '16px', color: 'var(--primary)' }}>03. PAYMENT METHOD</div>
            {errors.payment && <div style={{ color: 'var(--primary)', fontSize: '12px', marginBottom: '8px' }}>⚠️ {errors.payment}</div>}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '32px' }}>
              {paymentMethods.map((opt) => (
                <div key={opt.id} onClick={() => setPayment(opt.id)}
                  style={{ background: payment === opt.id ? 'var(--bg4)' : 'var(--bg3)', border: '1px solid ' + (payment === opt.id ? 'var(--primary)' : 'var(--border2)'), padding: '12px 16px', cursor: 'pointer' }}>
                  <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '13px', color: payment === opt.id ? '#fff' : 'var(--muted)' }}>{opt.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', padding: '24px', position: 'sticky', top: '80px' }}>
            <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '20px', letterSpacing: '2px', marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>ORDER SUMMARY</div>
            {items.map((item) => (
              <div key={item.product.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontFamily: 'Space Grotesk, sans-serif', fontSize: '13px' }}>
                <span style={{ color: 'var(--text2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '160px' }}>{item.product.name} x{item.quantity}</span>
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
            <button onClick={handleSubmit} style={{ background: 'var(--primary)', color: '#fff', border: 'none', padding: '16px', width: '100%', fontFamily: 'Space Grotesk, sans-serif', fontSize: '14px', letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer', fontWeight: 700 }}>
              PLACE ORDER
            </button>
            {Object.keys(errors).length > 0 && (
              <div style={{ marginTop: '10px', fontFamily: 'Space Grotesk, sans-serif', fontSize: '11px', color: 'var(--primary)', textAlign: 'center' }}>
                Fill in all required fields above first
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
