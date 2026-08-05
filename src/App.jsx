import { lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Layout from './components/layout/Layout';
import { SettingsProvider } from './context/SettingsContext';
import { CartProvider } from './context/CartContext';

// ======================================================
// PERFORMANCE: Lazy-load pages so only the current page's
// code is downloaded. Other pages load on-demand when
// the user navigates to them.
// ======================================================
const HomePage = lazy(() => import('./pages/HomePage'));
const CollectionPage = lazy(() => import('./pages/CollectionPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const FAQPage = lazy(() => import('./pages/FAQPage'));
const TestimonialsPage = lazy(() => import('./pages/TestimonialsPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const TermsAndConditionsPage = lazy(() => import('./pages/TermsAndConditionsPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));

// These are lightweight UI elements, keep them eager-loaded
import WhatsAppButton from './components/ui/WhatsAppButton';
import BackToTop from './components/ui/BackToTop';
import CookieBanner from './components/ui/CookieBanner';
import CartSidebar from './components/cart/CartSidebar';

// Minimal loading spinner shown while a page chunk downloads
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-bg">
    <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
  </div>
);

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/portal');

  return (
    <SettingsProvider>
      <CartProvider>
      <Suspense fallback={<PageLoader />}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Admin Routes (No Header/Footer) */}
          <Route path="/portal" element={<AdminLogin />} />
          <Route path="/portal/dashboard" element={<AdminDashboard />} />

          {/* Public Routes with Header/Footer */}
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="collection" element={<CollectionPage />} />
            <Route path="collection/:slug" element={<ProductDetailPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="faq" element={<FAQPage />} />
            <Route path="testimonials" element={<TestimonialsPage />} />
            <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="terms" element={<TermsAndConditionsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </AnimatePresence>
      </Suspense>
      {!isAdminRoute && (
        <>
          <WhatsAppButton />
          <BackToTop />
          <CookieBanner />
          <CartSidebar />
        </>
      )}
      </CartProvider>
    </SettingsProvider>
  );
}

export default App;
