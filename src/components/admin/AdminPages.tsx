import { useState, useCallback, useRef } from 'react';
import { useAdminStore } from '../../store/adminStore';
import { slugify } from '../../lib/utils';
import { formatRupiah, formatUSD } from '../../lib/utils';
import type { Product, Category, BlogPost, Order, StoreSettings, ShippingOption } from '../../types';

type ToastType = 'success' | 'error' | 'info';
interface ToastItem { id: number; type: ToastType; message: string; }

function Toast({ toasts, onRemove }: { toasts: ToastItem[]; onRemove: (id: number) => void }) {
  return (
    <div style={{ position: 'fixed', bottom: '20px', right: '16px', zIndex: 1000, display: 'flex', flexDirection: 'column', gap: '8px', pointerEvents: 'none', maxWidth: '320px' }}>
      {toasts.map((t) => (
        <div key={t.id} className="animate-toast" style={{ pointerEvents: 'auto', display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', borderRadius: '4px', background: t.type === 'success' ? '#16a34a' : t.type === 'error' ? '#dc2626' : '#374151', color: '#fff', fontSize: '13px', fontWeight: 600, fontFamily: 'Space Grotesk, sans-serif' }}>
          <span>{t.type === 'success' ? '✅' : t.type === 'error' ? '❌' : 'ℹ️'}</span>
          <span style={{ flex: 1 }}>{t.message}</span>
          <button onClick={() => onRemove(t.id)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '18px' }}>×</button>
        </div>
      ))}
    </div>
  );
}

function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const show = useCallback((message: string, type: ToastType = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);
  const remove = useCallback((id: number) => setToasts((prev) => prev.filter((t) => t.id !== id)), []);
  return { toasts, show, remove };
}

function ImageUploader({ value, onChange, onToast, label = 'Image' }: { value: string; onChange: (url: string) => void; onToast: (msg: string, type: ToastType) => void; label?: string; }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { onToast('File must be an image', 'error'); return; }
    if (file.size > 3 * 1024 * 1024) { onToast('Image too large. Max 3MB.', 'error'); return; }
    setUploading(true);
    const reader = new FileReader();
    reader.onload = (ev) => { onChange(ev.target?.result as string); setUploading(false); onToast(label + ' uploaded!', 'success'); };
    reader.onerror = () => { setUploading(false); onToast('Failed to read file.', 'error'); };
    reader.readAsDataURL(file);
    e.target.value = '';
  };
  return (
    <div>
      <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '10px', letterSpacing: '2px', color: 'var(--muted)', marginBottom: '6px', textTransform: 'uppercase' }}>{label}</div>
      <div onClick={() => !uploading && fileRef.current?.click()} style={{ border: '2px dashed ' + (value ? 'var(--primary)' : 'var(--border2)'), borderRadius: '4px', cursor: 'pointer', overflow: 'hidden', background: 'var(--bg3)' }}>
        {value ? (
          <div style={{ position: 'relative' }}>
            <img src={value} alt="preview" style={{ width: '100%', height: '140px', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s' }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.opacity = '1')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.opacity = '0')}>
              <span style={{ color: '#fff', fontSize: '12px', fontFamily: 'Space Grotesk, sans-serif' }}>CHANGE IMAGE</span>
            </div>
          </div>
        ) : (
          <div style={{ padding: '32px', textAlign: 'center' }}>
            {uploading
              ? <p style={{ fontSize: '12px', color: 'var(--primary)', fontFamily: 'Space Grotesk, sans-serif' }}>Processing...</p>
              : <><div style={{ fontSize: '28px', marginBottom: '8px' }}>📷</div><p style={{ fontSize: '11px', color: 'var(--muted)', fontFamily: 'Space Grotesk, sans-serif' }}>Tap to upload - JPG, PNG, WebP - Max 3MB</p></>
            }
          </div>
        )}
      </div>
      <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
      {value && <button type="button" onClick={() => onChange('')} style={{ fontSize: '10px', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', marginTop: '6px', fontFamily: 'Space Grotesk, sans-serif' }}>REMOVE IMAGE</button>}
    </div>
  );
}

function Modal({ onClose, title, children }: { onClose: () => void; title: string; children: React.ReactNode }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', overflowY: 'auto', padding: '16px' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', width: '100%', maxWidth: '600px', marginTop: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, background: 'var(--bg2)', zIndex: 1 }}>
          <h3 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '20px', letterSpacing: '2px', color: 'var(--primary)', margin: 0 }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: '24px' }}>×</button>
        </div>
        <div style={{ padding: '20px' }}>{children}</div>
      </div>
    </div>
  );
}

const inp = { width: '100%', background: 'var(--bg3)', border: '1px solid var(--border2)', color: '#fff', padding: '10px 14px', fontFamily: 'Space Grotesk, sans-serif', fontSize: '14px', outline: 'none', marginBottom: '14px' };
const lbl = { fontFamily: 'Space Grotesk, sans-serif', fontSize: '10px', letterSpacing: '2px', color: 'var(--muted)', marginBottom: '6px', display: 'block', textTransform: 'uppercase' as const };

export function AdminDashboard() {
  const { products, categories, blogPosts, orders } = useAdminStore();
  const lowStock = products.filter((p) => p.isActive && p.stock <= 2);
  const pendingOrders = orders.filter((o) => o.status === 'pending');
  return (
    <div>
      <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '32px', letterSpacing: '2px', color: 'var(--primary)', marginBottom: '24px' }}>DASHBOARD</h2>
      <div className="stats-grid" style={{ marginBottom: '32px' }}>
        {[
          { label: 'PRODUCTS', value: products.length, icon: '📦', sub: products.filter((p) => p.isActive).length + ' active' },
          { label: 'CATEGORIES', value: categories.length, icon: '🗂️', sub: '' },
          { label: 'BLOG POSTS', value: blogPosts.filter((b) => b.isPublished).length, icon: '📝', sub: 'published' },
          { label: 'ORDERS', value: orders.length, icon: '🛒', sub: pendingOrders.length + ' pending' },
        ].map((s) => (
          <div key={s.label} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', padding: '20px 16px' }}>
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>{s.icon}</div>
            <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '36px', color: 'var(--primary)', lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '10px', letterSpacing: '2px', color: 'var(--muted)', marginTop: '4px', textTransform: 'uppercase' }}>{s.label}</div>
            {s.sub ? <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '11px', color: 'var(--text2)', marginTop: '2px' }}>{s.sub}</div> : null}
          </div>
        ))}
      </div>
      {lowStock.length > 0 && (
        <div style={{ background: 'rgba(255,68,34,0.1)', border: '1px solid rgba(255,68,34,0.3)', padding: '16px 20px', marginBottom: '20px' }}>
          <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '16px', letterSpacing: '2px', color: 'var(--primary)', marginBottom: '10px' }}>LOW STOCK ALERT</div>
          {lowStock.map((p) => <div key={p.id} style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '13px', color: 'var(--text2)', marginBottom: '4px' }}>{p.name} - {p.stock} left</div>)}
        </div>
      )}
      {pendingOrders.length > 0 && (
        <div style={{ background: 'rgba(255,200,0,0.08)', border: '1px solid rgba(255,200,0,0.2)', padding: '16px 20px' }}>
          <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '16px', letterSpacing: '2px', color: '#ffd700', marginBottom: '10px' }}>PENDING ORDERS ({pendingOrders.length})</div>
          {pendingOrders.slice(0, 5).map((o) => <div key={o.id} style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '13px', color: 'var(--text2)', marginBottom: '4px' }}>#{o.orderNumber} - {o.buyerName} - {o.currency === 'IDR' ? formatRupiah(o.totalAmount) : formatUSD(o.totalAmount)}</div>)}
        </div>
      )}
    </div>
  );
}

export function AdminProducts() {
  const { products, categories, addProduct, updateProduct, deleteProduct } = useAdminStore();
  const { toasts, show: toast, remove } = useToast();
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const emptyForm: Omit<Product, 'id'> = { name: '', slug: '', price: 0, priceUSD: 0, category: '', categorySlug: '', description: '', shortDesc: '', image: '', stock: 0, isActive: true, origin: '', badge: '', material: '' };
  const [form, setForm] = useState<Omit<Product, 'id'>>(emptyForm);
  const filtered = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
  const openAdd = () => { setEditing(null); setForm(emptyForm); setModal(true); };
  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({ name: p.name, slug: p.slug, price: p.price, priceUSD: p.priceUSD, category: p.category, categorySlug: p.categorySlug, description: p.description, shortDesc: p.shortDesc, image: p.image, stock: p.stock, isActive: p.isActive, origin: p.origin, badge: p.badge || '', material: p.material || '' });
    setModal(true);
  };
  const handleSave = () => {
    if (!form.name || !form.price) { toast('Name and price required', 'error'); return; }
    const slug = form.slug || slugify(form.name);
    if (editing) { updateProduct({ ...editing, ...form, slug }); toast('Product updated!', 'success'); }
    else { addProduct({ ...form, slug, id: Date.now() }); toast('Product added!', 'success'); }
    setModal(false);
  };
  const setCategory = (name: string) => {
    const cat = categories.find((c) => c.name === name);
    setForm({ ...form, category: name, categorySlug: cat ? cat.slug : slugify(name) });
  };
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '32px', letterSpacing: '2px', color: 'var(--primary)' }}>PRODUCTS</h2>
        <button onClick={openAdd} style={{ background: 'var(--primary)', color: '#fff', border: 'none', padding: '10px 24px', fontFamily: 'Space Grotesk, sans-serif', fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer' }}>+ ADD PRODUCT</button>
      </div>
      <input placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ ...inp, marginBottom: '20px' }} />
      <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '11px', color: 'var(--muted)', marginBottom: '12px', letterSpacing: '1px' }}>{filtered.length} PRODUCTS</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filtered.map((p) => (
          <div key={p.id} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '4px', padding: '14px 16px' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div style={{ width: '56px', height: '56px', background: 'var(--bg4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', flexShrink: 0, border: '1px solid var(--border)' }}>
                {p.image.startsWith('data:') || p.image.startsWith('http') ? <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span>{p.image}</span>}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '18px', letterSpacing: '1px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '11px', color: 'var(--primary)', marginTop: '2px' }}>{formatRupiah(p.price)} / {formatUSD(p.priceUSD)}</div>
                <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '11px', color: 'var(--muted)', marginTop: '2px' }}>
                  {p.category} - Stock: {p.stock} - {p.isActive ? <span style={{ color: '#4ade80' }}>Active</span> : <span style={{ color: 'var(--primary)' }}>Inactive</span>}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
              <button onClick={() => openEdit(p)} style={{ flex: 1, background: 'var(--bg4)', border: '1px solid var(--border2)', color: 'var(--text2)', padding: '8px', fontFamily: 'Space Grotesk, sans-serif', fontSize: '11px', letterSpacing: '1px', cursor: 'pointer' }}>EDIT</button>
              <button onClick={() => setConfirmDelete(p.id)} style={{ flex: 1, background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)', color: '#f87171', padding: '8px', fontFamily: 'Space Grotesk, sans-serif', fontSize: '11px', letterSpacing: '1px', cursor: 'pointer' }}>DELETE</button>
            </div>
          </div>
        ))}
      </div>
      {modal && (
        <Modal onClose={() => setModal(false)} title={editing ? 'EDIT PRODUCT' : 'ADD PRODUCT'}>
          <ImageUploader value={form.image} onChange={(v) => setForm({ ...form, image: v })} onToast={toast} label="Product Image" />
          <div style={{ height: '14px' }} />
          <label style={lbl}>Product Name *</label><input style={inp} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <label style={lbl}>Short Description</label><input style={inp} value={form.shortDesc} onChange={(e) => setForm({ ...form, shortDesc: e.target.value })} />
          <label style={lbl}>Full Description</label><textarea style={{ ...inp, minHeight: '100px', resize: 'vertical' }} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div><label style={lbl}>Price IDR (Rp) *</label><input style={inp} type="text" inputMode="numeric" value={form.price === 0 ? '' : String(form.price)} onChange={(e) => { const v = e.target.value.replace(/\D/g, ''); setForm({ ...form, price: v ? parseInt(v) : 0 }); }} placeholder="e.g. 4800000" /></div>
            <div><label style={lbl}>Price USD ($) *</label><input style={inp} type="text" inputMode="decimal" value={form.priceUSD === 0 ? '' : String(form.priceUSD)} onChange={(e) => { const v = e.target.value.replace(/[^\d.]/g, ''); setForm({ ...form, priceUSD: v ? parseFloat(v) : 0 }); }} placeholder="e.g. 295" /></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div><label style={lbl}>Stock</label><input style={inp} type="text" inputMode="numeric" value={form.stock === 0 ? '' : String(form.stock)} onChange={(e) => { const v = e.target.value.replace(/\D/g, ''); setForm({ ...form, stock: v ? parseInt(v) : 0 }); }} placeholder="e.g. 5" /></div>
            <div><label style={lbl}>Badge (optional)</label><input style={inp} value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} placeholder="Rare, New, etc" /></div>
          </div>
          <label style={lbl}>Category</label>
          <select style={{ ...inp }} value={form.category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">Select category</option>
            {useAdminStore.getState().categories.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
          </select>
          <label style={lbl}>Origin / Provenance</label><input style={inp} value={form.origin} onChange={(e) => setForm({ ...form, origin: e.target.value })} placeholder="e.g. Dayak Kenyah, East Kalimantan" />
          <label style={lbl}>Material</label><input style={inp} value={form.material} onChange={(e) => setForm({ ...form, material: e.target.value })} placeholder="e.g. Iron, bone, hornbill feathers" />
          <label style={lbl}>Custom Slug (optional)</label><input style={inp} value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="auto-generated from name" />
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <input type="checkbox" id="isActive" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
            <label htmlFor="isActive" style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '13px', color: 'var(--text2)', cursor: 'pointer' }}>Active (visible in shop)</label>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={handleSave} style={{ flex: 1, background: 'var(--primary)', color: '#fff', border: 'none', padding: '12px', fontFamily: 'Space Grotesk, sans-serif', fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer' }}>SAVE</button>
            <button onClick={() => setModal(false)} style={{ flex: 1, background: 'var(--bg4)', color: 'var(--muted)', border: '1px solid var(--border2)', padding: '12px', fontFamily: 'Space Grotesk, sans-serif', fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer' }}>CANCEL</button>
          </div>
        </Modal>
      )}
      {confirmDelete !== null && (
        <Modal onClose={() => setConfirmDelete(null)} title="CONFIRM DELETE">
          <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '14px', color: 'var(--text2)', marginBottom: '20px' }}>Delete this product? This cannot be undone.</p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => { deleteProduct(confirmDelete); setConfirmDelete(null); toast('Product deleted', 'info'); }} style={{ flex: 1, background: '#dc2626', color: '#fff', border: 'none', padding: '12px', fontFamily: 'Space Grotesk, sans-serif', fontSize: '12px', letterSpacing: '2px', cursor: 'pointer' }}>DELETE</button>
            <button onClick={() => setConfirmDelete(null)} style={{ flex: 1, background: 'var(--bg4)', color: 'var(--muted)', border: '1px solid var(--border2)', padding: '12px', fontFamily: 'Space Grotesk, sans-serif', fontSize: '12px', letterSpacing: '2px', cursor: 'pointer' }}>CANCEL</button>
          </div>
        </Modal>
      )}
      <Toast toasts={toasts} onRemove={remove} />
    </div>
  );
}

export function AdminOrders() {
  const { orders, updateOrder } = useAdminStore();
  const { toasts, show: toast, remove } = useToast();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [trackingInput, setTrackingInput] = useState('');
  const sorted = [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const statusColors: Record<string, string> = { pending: '#ffd700', confirmed: '#60a5fa', shipped: '#a78bfa', delivered: '#4ade80', cancelled: '#f87171' };
  const handleStatus = (order: Order, status: Order['status']) => {
    updateOrder({ ...order, status, updatedAt: new Date().toISOString() });
    toast('Order ' + order.orderNumber + ' updated to ' + status, 'success');
  };
  const handleTracking = (order: Order) => {
    if (!trackingInput.trim()) { toast('Enter tracking number', 'error'); return; }
    updateOrder({ ...order, trackingNumber: trackingInput, status: 'shipped', updatedAt: new Date().toISOString() });
    toast('Tracking number saved!', 'success');
    setTrackingInput('');
  };
  return (
    <div>
      <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '32px', letterSpacing: '2px', color: 'var(--primary)', marginBottom: '24px' }}>ORDERS ({orders.length})</h2>
      {sorted.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--muted)', fontFamily: 'Bebas Neue, sans-serif', fontSize: '24px', letterSpacing: '2px' }}>NO ORDERS YET</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {sorted.map((order) => (
            <div key={order.id} style={{ background: 'var(--bg3)', border: '1px solid ' + (expanded === order.id ? 'var(--primary)' : 'var(--border)'), borderRadius: '4px' }}>
              <div onClick={() => setExpanded(expanded === order.id ? null : order.id)} style={{ padding: '14px 16px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '18px', letterSpacing: '1px' }}>#{order.orderNumber}</div>
                  <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '12px', color: 'var(--muted)' }}>{order.buyerName} - {new Date(order.createdAt).toLocaleDateString()}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '15px', fontWeight: 700, color: 'var(--primary)' }}>{order.currency === 'IDR' ? formatRupiah(order.totalAmount) : formatUSD(order.totalAmount)}</span>
                  <span style={{ background: 'transparent', border: '1px solid ' + statusColors[order.status], color: statusColors[order.status], padding: '3px 10px', fontFamily: 'Space Grotesk, sans-serif', fontSize: '10px', letterSpacing: '1px', textTransform: 'uppercase' }}>{order.status}</span>
                  <span style={{ color: 'var(--muted)', fontSize: '16px' }}>{expanded === order.id ? '▲' : '▼'}</span>
                </div>
              </div>
              {expanded === order.id && (
                <div style={{ padding: '0 16px 16px', borderTop: '1px solid var(--border)' }}>
                  <div style={{ paddingTop: '16px', marginBottom: '16px', fontFamily: 'Space Grotesk, sans-serif', fontSize: '12px', color: 'var(--text2)', lineHeight: '1.8' }}>
                    <div><span style={{ color: 'var(--muted)' }}>Buyer:</span> {order.buyerName}</div>
                    {order.buyerEmail && <div><span style={{ color: 'var(--muted)' }}>Email:</span> {order.buyerEmail}</div>}
                    <div><span style={{ color: 'var(--muted)' }}>Phone:</span> {order.buyerPhone}</div>
                    <div><span style={{ color: 'var(--muted)' }}>Address:</span> {order.buyerAddress}, {order.buyerCity}, {order.buyerCountry}</div>
                    <div><span style={{ color: 'var(--muted)' }}>Shipping:</span> {order.shippingMethod}</div>
                    <div><span style={{ color: 'var(--muted)' }}>Payment:</span> {order.paymentMethod}</div>
                    {order.trackingNumber && <div><span style={{ color: 'var(--muted)' }}>Tracking:</span> <strong style={{ color: '#4ade80' }}>{order.trackingNumber}</strong></div>}
                    <div style={{ marginTop: '12px' }}>
                      {order.items.map((item) => (
                        <div key={item.product.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span>{item.product.name} x{item.quantity}</span>
                          <span style={{ color: 'var(--primary)' }}>{order.currency === 'IDR' ? formatRupiah(item.product.price * item.quantity) : formatUSD(item.product.priceUSD * item.quantity)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  {order.status !== 'delivered' && order.status !== 'cancelled' && (
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                      <input placeholder="Enter tracking number..." value={trackingInput} onChange={(e) => setTrackingInput(e.target.value)}
                        style={{ flex: 1, background: 'var(--bg4)', border: '1px solid var(--border2)', color: '#fff', padding: '8px 12px', fontFamily: 'Space Grotesk, sans-serif', fontSize: '13px', outline: 'none', minWidth: '180px' }} />
                      <button onClick={() => handleTracking(order)} style={{ background: 'var(--primary)', color: '#fff', border: 'none', padding: '8px 16px', fontFamily: 'Space Grotesk, sans-serif', fontSize: '11px', letterSpacing: '1px', cursor: 'pointer', whiteSpace: 'nowrap' }}>SAVE + SHIP</button>
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {order.status === 'pending' && <button onClick={() => handleStatus(order, 'confirmed')} style={{ flex: 1, background: 'rgba(96,165,250,0.15)', border: '1px solid #60a5fa', color: '#60a5fa', padding: '8px', fontFamily: 'Space Grotesk, sans-serif', fontSize: '11px', cursor: 'pointer', whiteSpace: 'nowrap' }}>CONFIRM</button>}
                    {(order.status === 'pending' || order.status === 'confirmed') && <button onClick={() => handleStatus(order, 'cancelled')} style={{ flex: 1, background: 'rgba(248,113,113,0.1)', border: '1px solid #f87171', color: '#f87171', padding: '8px', fontFamily: 'Space Grotesk, sans-serif', fontSize: '11px', cursor: 'pointer' }}>CANCEL</button>}
                    {order.status === 'shipped' && <button onClick={() => handleStatus(order, 'delivered')} style={{ flex: 1, background: 'rgba(74,222,128,0.1)', border: '1px solid #4ade80', color: '#4ade80', padding: '8px', fontFamily: 'Space Grotesk, sans-serif', fontSize: '11px', cursor: 'pointer' }}>DELIVERED</button>}
                    <a href={'https://wa.me/' + order.buyerPhone} target="_blank" rel="noopener noreferrer"
                      style={{ flex: 1, background: 'rgba(37,211,102,0.1)', border: '1px solid #25d366', color: '#25d366', padding: '8px', fontFamily: 'Space Grotesk, sans-serif', fontSize: '11px', textDecoration: 'none', textAlign: 'center', whiteSpace: 'nowrap' }}>WHATSAPP</a>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      <Toast toasts={toasts} onRemove={remove} />
    </div>
  );
}

export function AdminBlog() {
  const { blogPosts, addBlogPost, updateBlogPost, deleteBlogPost } = useAdminStore();
  const { toasts, show: toast, remove } = useToast();
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const emptyForm = { title: '', slug: '', excerpt: '', content: '', image: '', author: 'Borneo Handmade Team', isPublished: false, publishedAt: new Date().toISOString().split('T')[0], createdAt: new Date().toISOString(), tags: [] as string[], tagsStr: '' };
  const [form, setForm] = useState(emptyForm);
  const openEdit = (p: BlogPost) => { setEditing(p); setForm({ ...p, tagsStr: p.tags.join(', ') }); setModal(true); };
  const handleSave = () => {
    if (!form.title) { toast('Title required', 'error'); return; }
    const slug = form.slug || slugify(form.title);
    const tags = form.tagsStr.split(',').map((t) => t.trim()).filter(Boolean);
    if (editing) { updateBlogPost({ ...editing, ...form, slug, tags }); toast('Post updated!', 'success'); }
    else { addBlogPost({ ...form, slug, tags, id: Date.now() }); toast('Post added!', 'success'); }
    setModal(false);
  };
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '32px', letterSpacing: '2px', color: 'var(--primary)' }}>BLOG</h2>
        <button onClick={() => { setEditing(null); setForm(emptyForm); setModal(true); }} style={{ background: 'var(--primary)', color: '#fff', border: 'none', padding: '10px 24px', fontFamily: 'Space Grotesk, sans-serif', fontSize: '12px', letterSpacing: '2px', cursor: 'pointer' }}>+ ADD POST</button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {blogPosts.map((p) => (
          <div key={p.id} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '4px', padding: '14px 16px' }}>
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '18px', letterSpacing: '1px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</div>
              <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '11px', color: 'var(--muted)', marginTop: '4px' }}>
                {p.publishedAt} - {p.isPublished ? <span style={{ color: '#4ade80' }}>Published</span> : <span style={{ color: '#ffd700' }}>Draft</span>}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
              <button onClick={() => openEdit(p)} style={{ flex: 1, background: 'var(--bg4)', border: '1px solid var(--border2)', color: 'var(--text2)', padding: '8px', fontFamily: 'Space Grotesk, sans-serif', fontSize: '11px', letterSpacing: '1px', cursor: 'pointer' }}>EDIT</button>
              <button onClick={() => setConfirmDelete(p.id)} style={{ flex: 1, background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)', color: '#f87171', padding: '8px', fontFamily: 'Space Grotesk, sans-serif', fontSize: '11px', letterSpacing: '1px', cursor: 'pointer' }}>DELETE</button>
            </div>
          </div>
        ))}
      </div>
      {modal && (
        <Modal onClose={() => setModal(false)} title={editing ? 'EDIT POST' : 'NEW POST'}>
          <ImageUploader value={form.image} onChange={(v) => setForm({ ...form, image: v })} onToast={toast} label="Cover Image" />
          <div style={{ height: '14px' }} />
          <label style={lbl}>Title *</label><input style={inp} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <label style={lbl}>Excerpt</label><textarea style={{ ...inp, minHeight: '60px', resize: 'vertical' }} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />
          <label style={lbl}>Content (Markdown: ## H2, ### H3, **bold**, - list)</label>
          <textarea style={{ ...inp, minHeight: '200px', resize: 'vertical', fontFamily: 'monospace', fontSize: '13px' }} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
          <label style={lbl}>Author</label><input style={inp} value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />
          <label style={lbl}>Tags (comma separated)</label><input style={inp} value={form.tagsStr} onChange={(e) => setForm({ ...form, tagsStr: e.target.value })} placeholder="borneo, antique, craft" />
          <label style={lbl}>Publish Date</label><input style={inp} type="date" value={form.publishedAt} onChange={(e) => setForm({ ...form, publishedAt: e.target.value })} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <input type="checkbox" id="isPub" checked={form.isPublished} onChange={(e) => setForm({ ...form, isPublished: e.target.checked })} />
            <label htmlFor="isPub" style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '13px', color: 'var(--text2)', cursor: 'pointer' }}>Published (visible on blog)</label>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={handleSave} style={{ flex: 1, background: 'var(--primary)', color: '#fff', border: 'none', padding: '12px', fontFamily: 'Space Grotesk, sans-serif', fontSize: '12px', letterSpacing: '2px', cursor: 'pointer' }}>SAVE</button>
            <button onClick={() => setModal(false)} style={{ flex: 1, background: 'var(--bg4)', color: 'var(--muted)', border: '1px solid var(--border2)', padding: '12px', fontFamily: 'Space Grotesk, sans-serif', fontSize: '12px', letterSpacing: '2px', cursor: 'pointer' }}>CANCEL</button>
          </div>
        </Modal>
      )}
      {confirmDelete !== null && (
        <Modal onClose={() => setConfirmDelete(null)} title="CONFIRM DELETE">
          <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '14px', color: 'var(--text2)', marginBottom: '20px' }}>Delete this post permanently?</p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => { deleteBlogPost(confirmDelete); setConfirmDelete(null); toast('Post deleted', 'info'); }} style={{ flex: 1, background: '#dc2626', color: '#fff', border: 'none', padding: '12px', fontFamily: 'Space Grotesk, sans-serif', fontSize: '12px', letterSpacing: '2px', cursor: 'pointer' }}>DELETE</button>
            <button onClick={() => setConfirmDelete(null)} style={{ flex: 1, background: 'var(--bg4)', color: 'var(--muted)', border: '1px solid var(--border2)', padding: '12px', fontFamily: 'Space Grotesk, sans-serif', fontSize: '12px', letterSpacing: '2px', cursor: 'pointer' }}>CANCEL</button>
          </div>
        </Modal>
      )}
      <Toast toasts={toasts} onRemove={remove} />
    </div>
  );
}

export function AdminCategories() {
  const { categories, addCategory, updateCategory, deleteCategory } = useAdminStore();
  const { toasts, show: toast, remove } = useToast();
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const emptyForm = { name: '', slug: '', description: '', icon: '📦' };
  const [form, setForm] = useState(emptyForm);
  const EMOJIS = ['📦', '🛡️', '🎭', '🧵', '🪵', '🏺', '💎', '🌿', '🔮', '🪬', '🏹', '🎨', '🧿', '⚔️', '🪆'];
  const openEdit = (c: Category) => { setEditing(c); setForm({ name: c.name, slug: c.slug, description: c.description, icon: c.icon }); setModal(true); };
  const handleSave = () => {
    if (!form.name) { toast('Name required', 'error'); return; }
    const slug = form.slug || slugify(form.name);
    if (editing) { updateCategory({ ...editing, ...form, slug }); toast('Category updated!', 'success'); }
    else { addCategory({ ...form, slug, id: Date.now() }); toast('Category added!', 'success'); }
    setModal(false);
  };
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '32px', letterSpacing: '2px', color: 'var(--primary)' }}>CATEGORIES</h2>
        <button onClick={() => { setEditing(null); setForm(emptyForm); setModal(true); }} style={{ background: 'var(--primary)', color: '#fff', border: 'none', padding: '10px 24px', fontFamily: 'Space Grotesk, sans-serif', fontSize: '12px', letterSpacing: '2px', cursor: 'pointer' }}>+ ADD</button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {categories.map((c) => (
          <div key={c.id} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '4px', padding: '14px 16px' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '28px' }}>{c.icon}</span>
              <div>
                <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '18px', letterSpacing: '1px' }}>{c.name}</div>
                <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '11px', color: 'var(--muted)' }}>{c.description}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
              <button onClick={() => openEdit(c)} style={{ flex: 1, background: 'var(--bg4)', border: '1px solid var(--border2)', color: 'var(--text2)', padding: '8px', fontFamily: 'Space Grotesk, sans-serif', fontSize: '11px', letterSpacing: '1px', cursor: 'pointer' }}>EDIT</button>
              <button onClick={() => { deleteCategory(c.id); toast('Category deleted', 'info'); }} style={{ flex: 1, background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)', color: '#f87171', padding: '8px', fontFamily: 'Space Grotesk, sans-serif', fontSize: '11px', letterSpacing: '1px', cursor: 'pointer' }}>DELETE</button>
            </div>
          </div>
        ))}
      </div>
      {modal && (
        <Modal onClose={() => setModal(false)} title={editing ? 'EDIT CATEGORY' : 'ADD CATEGORY'}>
          <label style={lbl}>Name *</label><input style={inp} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <label style={lbl}>Description</label><input style={inp} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <label style={lbl}>Icon (emoji)</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
            {EMOJIS.map((em) => (
              <button key={em} onClick={() => setForm({ ...form, icon: em })} style={{ width: '40px', height: '40px', background: form.icon === em ? 'var(--primary)' : 'var(--bg3)', border: '1px solid ' + (form.icon === em ? 'var(--primary)' : 'var(--border2)'), fontSize: '20px', cursor: 'pointer' }}>{em}</button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={handleSave} style={{ flex: 1, background: 'var(--primary)', color: '#fff', border: 'none', padding: '12px', fontFamily: 'Space Grotesk, sans-serif', fontSize: '12px', letterSpacing: '2px', cursor: 'pointer' }}>SAVE</button>
            <button onClick={() => setModal(false)} style={{ flex: 1, background: 'var(--bg4)', color: 'var(--muted)', border: '1px solid var(--border2)', padding: '12px', fontFamily: 'Space Grotesk, sans-serif', fontSize: '12px', letterSpacing: '2px', cursor: 'pointer' }}>CANCEL</button>
          </div>
        </Modal>
      )}
      <Toast toasts={toasts} onRemove={remove} />
    </div>
  );
}

export function AdminSettings() {
  const { settings, updateSettings } = useAdminStore();
  const { toasts, show: toast, remove } = useToast();
  const [form, setForm] = useState<StoreSettings>({ ...settings });
  const [shippingModal, setShippingModal] = useState(false);
  const [editingShipping, setEditingShipping] = useState<ShippingOption | null>(null);
  const emptyShipping: ShippingOption = { id: '', label: '', estimatedDays: '', costIDR: 0, costUSD: 0, isActive: true };
  const [shippingForm, setShippingForm] = useState<ShippingOption>(emptyShipping);

  const handleSave = () => { updateSettings(form); toast('Settings saved!', 'success'); };

  const openAddShipping = () => { setEditingShipping(null); setShippingForm(emptyShipping); setShippingModal(true); };
  const openEditShipping = (s: ShippingOption) => { setEditingShipping(s); setShippingForm({ ...s }); setShippingModal(true); };

  const handleSaveShipping = () => {
    if (!shippingForm.label.trim()) { toast('Label required', 'error'); return; }
    if (!shippingForm.estimatedDays.trim()) { toast('Estimated days required', 'error'); return; }
    const id = shippingForm.id || slugify(shippingForm.label);
    const opts = form.shippingOptions || [];
    if (editingShipping) {
      setForm({ ...form, shippingOptions: opts.map((s) => s.id === editingShipping.id ? { ...shippingForm, id } : s) });
    } else {
      setForm({ ...form, shippingOptions: [...opts, { ...shippingForm, id }] });
    }
    setShippingModal(false);
    toast('Saved! Click SAVE ALL SETTINGS to apply.', 'info');
  };

  const deleteShipping = (id: string) => {
    setForm({ ...form, shippingOptions: (form.shippingOptions || []).filter((s) => s.id !== id) });
  };

  const toggleShipping = (id: string) => {
    setForm({ ...form, shippingOptions: (form.shippingOptions || []).map((s) => s.id === id ? { ...s, isActive: !s.isActive } : s) });
  };

  const field = (labelText: string, key: keyof StoreSettings, placeholder = '') => (
    <div>
      <label style={lbl}>{labelText}</label>
      <input style={inp} value={String(form[key])} onChange={(e) => setForm({ ...form, [key]: e.target.value })} placeholder={placeholder} />
    </div>
  );

  return (
    <div>
      <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '32px', letterSpacing: '2px', color: 'var(--primary)', marginBottom: '24px' }}>SETTINGS</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
        <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', padding: '20px' }}>
          <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '18px', letterSpacing: '2px', color: 'var(--primary)', marginBottom: '16px' }}>STORE INFO</div>
          {field('Store Name', 'storeName')}
          {field('Store Email', 'storeEmail')}
          {field('WhatsApp Number', 'whatsapp', 'e.g. 082358402290')}
        </div>
        <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '18px', letterSpacing: '2px', color: 'var(--primary)' }}>SHIPPING METHODS</div>
            <button onClick={openAddShipping} style={{ background: 'var(--primary)', color: '#fff', border: 'none', padding: '8px 16px', fontFamily: 'Space Grotesk, sans-serif', fontSize: '11px', letterSpacing: '1px', cursor: 'pointer', textTransform: 'uppercase' }}>+ ADD</button>
          </div>
          <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '12px', color: 'var(--muted)', marginBottom: '12px', lineHeight: '1.5' }}>
            Configure carriers shown at checkout. Enable/disable, set prices, add DHL, FedEx, EMS, JNE etc.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {(form.shippingOptions || []).map((s) => (
              <div key={s.id} style={{ background: 'var(--bg4)', border: '1px solid var(--border)', borderRadius: '4px', padding: '10px 12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '13px', fontWeight: 600, color: s.isActive ? '#fff' : 'var(--muted)' }}>{s.label}</div>
                    <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '11px', color: 'var(--muted)', marginTop: '2px' }}>
                      {s.estimatedDays} | Rp {s.costIDR.toLocaleString('id-ID')} / ${s.costUSD}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                    <button onClick={() => toggleShipping(s.id)} style={{ background: s.isActive ? 'rgba(74,222,128,0.15)' : 'var(--bg3)', border: '1px solid ' + (s.isActive ? '#4ade80' : 'var(--border2)'), color: s.isActive ? '#4ade80' : 'var(--muted)', padding: '4px 8px', fontFamily: 'Space Grotesk, sans-serif', fontSize: '10px', cursor: 'pointer' }}>
                      {s.isActive ? 'ON' : 'OFF'}
                    </button>
                    <button onClick={() => openEditShipping(s)} style={{ background: 'var(--bg3)', border: '1px solid var(--border2)', color: 'var(--text2)', padding: '4px 8px', fontFamily: 'Space Grotesk, sans-serif', fontSize: '10px', cursor: 'pointer' }}>EDIT</button>
                    <button onClick={() => deleteShipping(s.id)} style={{ background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)', color: '#f87171', padding: '4px 8px', fontFamily: 'Space Grotesk, sans-serif', fontSize: '10px', cursor: 'pointer' }}>DEL</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', padding: '20px' }}>
          <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '18px', letterSpacing: '2px', color: 'var(--primary)', marginBottom: '16px' }}>PAYMENT METHODS</div>
          {field('Bank Name', 'bankName', 'e.g. BRI')}
          {field('Bank Account Number', 'bankAccountNumber')}
          {field('Bank Account Name', 'bankAccountName')}
          {field('PayPal Email', 'paypalEmail')}
          {field('USDT Address', 'usdtAddress')}
          {field('USDT Network', 'usdtNetwork', 'e.g. TRC20, ERC20')}
          {field('Western Union Name', 'westernUnionName')}
          {field('Western Union Country', 'westernUnionCountry')}
        </div>
        <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', padding: '20px' }}>
          <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '18px', letterSpacing: '2px', color: 'var(--primary)', marginBottom: '16px' }}>SOCIAL MEDIA</div>
          {field('Instagram Username', 'instagram', 'e.g. borneohandmade')}
          {field('TikTok Username', 'tiktok')}
          {field('Facebook Page', 'facebook')}
          {field('YouTube Channel', 'youtube')}
        </div>
        <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', padding: '20px' }}>
          <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '18px', letterSpacing: '2px', color: 'var(--primary)', marginBottom: '16px' }}>ANNOUNCEMENT BAR</div>
          {field('Announcement Text', 'announcementText')}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <input type="checkbox" id="annActive" checked={form.announcementActive} onChange={(e) => setForm({ ...form, announcementActive: e.target.checked })} />
            <label htmlFor="annActive" style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '13px', color: 'var(--text2)', cursor: 'pointer' }}>Show announcement bar</label>
          </div>
        </div>
        <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', padding: '20px' }}>
          <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '18px', letterSpacing: '2px', color: 'var(--primary)', marginBottom: '16px' }}>SHIPPING NOTE</div>
          <label style={lbl}>Info text (shown on Shipping page)</label>
          <textarea style={{ ...inp, minHeight: '80px', resize: 'vertical' }} value={form.shippingNote} onChange={(e) => setForm({ ...form, shippingNote: e.target.value })} />
        </div>
      </div>
      <button onClick={handleSave} style={{ marginTop: '24px', background: 'var(--primary)', color: '#fff', border: 'none', padding: '16px 40px', fontFamily: 'Space Grotesk, sans-serif', fontSize: '14px', letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer', fontWeight: 700, width: '100%' }}>
        SAVE ALL SETTINGS
      </button>
      {shippingModal && (
        <Modal onClose={() => setShippingModal(false)} title={editingShipping ? 'EDIT SHIPPING' : 'ADD SHIPPING METHOD'}>
          <label style={lbl}>Carrier / Label *</label>
          <input style={inp} value={shippingForm.label} onChange={(e) => setShippingForm({ ...shippingForm, label: e.target.value })} placeholder="e.g. DHL Express, JNE Regular, FedEx" />
          <label style={lbl}>Estimated Delivery Time *</label>
          <input style={inp} value={shippingForm.estimatedDays} onChange={(e) => setShippingForm({ ...shippingForm, estimatedDays: e.target.value })} placeholder="e.g. 3-5 days, 2-4 hari" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={lbl}>Cost IDR (Rp)</label>
              <input style={inp} type="text" inputMode="numeric" value={shippingForm.costIDR === 0 ? '' : String(shippingForm.costIDR)} onChange={(e) => { const v = e.target.value.replace(/\D/g, ''); setShippingForm({ ...shippingForm, costIDR: v ? parseInt(v) : 0 }); }} placeholder="e.g. 35000" />
            </div>
            <div>
              <label style={lbl}>Cost USD ($)</label>
              <input style={inp} type="text" inputMode="decimal" value={shippingForm.costUSD === 0 ? '' : String(shippingForm.costUSD)} onChange={(e) => { const v = e.target.value.replace(/[^\d.]/g, ''); setShippingForm({ ...shippingForm, costUSD: v ? parseFloat(v) : 0 }); }} placeholder="e.g. 25" />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <input type="checkbox" id="shpActive" checked={shippingForm.isActive} onChange={(e) => setShippingForm({ ...shippingForm, isActive: e.target.checked })} />
            <label htmlFor="shpActive" style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '13px', color: 'var(--text2)', cursor: 'pointer' }}>Active at checkout</label>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={handleSaveShipping} style={{ flex: 1, background: 'var(--primary)', color: '#fff', border: 'none', padding: '12px', fontFamily: 'Space Grotesk, sans-serif', fontSize: '12px', letterSpacing: '2px', cursor: 'pointer' }}>SAVE</button>
            <button onClick={() => setShippingModal(false)} style={{ flex: 1, background: 'var(--bg4)', color: 'var(--muted)', border: '1px solid var(--border2)', padding: '12px', fontFamily: 'Space Grotesk, sans-serif', fontSize: '12px', letterSpacing: '2px', cursor: 'pointer' }}>CANCEL</button>
          </div>
        </Modal>
      )}
      <Toast toasts={toasts} onRemove={remove} />
    </div>
  );
}
