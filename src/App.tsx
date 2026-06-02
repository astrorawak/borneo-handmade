import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import { BlogPage, BlogPostPage } from './pages/BlogPages';
import { AboutPage, ShippingPage, FAQPage } from './pages/InfoPages';
import AdminPage from './pages/AdminPage';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flex: 1 }}>{children}</main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter basename="/borneo-handmade">
      <Routes>
        <Route path="/" element={<Layout><HomePage /></Layout>} />
        <Route path="/shop" element={<Layout><ShopPage /></Layout>} />
        <Route path="/product/:slug" element={<Layout><ProductDetailPage /></Layout>} />
        <Route path="/cart" element={<Layout><CartPage /></Layout>} />
        <Route path="/checkout" element={<Layout><CheckoutPage /></Layout>} />
        <Route path="/order-success" element={<Layout><OrderSuccessPage /></Layout>} />
        <Route path="/blog" element={<Layout><BlogPage /></Layout>} />
        <Route path="/blog/:slug" element={<Layout><BlogPostPage /></Layout>} />
        <Route path="/about" element={<Layout><AboutPage /></Layout>} />
        <Route path="/shipping" element={<Layout><ShippingPage /></Layout>} />
        <Route path="/faq" element={<Layout><FAQPage /></Layout>} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<Layout><div style={{ textAlign: 'center', padding: '100px 16px', color: 'var(--muted)' }}><div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '80px', color: 'var(--primary)' }}>404</div><p style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Page not found</p></div></Layout>} />
      </Routes>
    </BrowserRouter>
  );
}
