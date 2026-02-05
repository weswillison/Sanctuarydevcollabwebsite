import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { Navigation } from '@/app/components/Navigation';
import { Footer } from '@/app/components/Footer';
import { ErrorBoundary } from '@/app/components/ErrorBoundary';

// External URL for background - CDN blocks automated downloads but serves to browsers
const BACKGROUND_IMAGE_URL = 'https://cdn6.picryl.com/photo/1881/01/01/city-of-philadelphia-937f8f-1024.jpg';

// Lazy load page components for code-splitting
const Home = lazy(() => import('@/app/pages/Home').then(m => ({ default: m.Home })));
const About = lazy(() => import('@/app/pages/About').then(m => ({ default: m.About })));
const OurWork = lazy(() => import('@/app/pages/OurWork').then(m => ({ default: m.OurWork })));
const FAQs = lazy(() => import('@/app/pages/FAQs').then(m => ({ default: m.FAQs })));
const Resources = lazy(() => import('@/app/pages/Resources').then(m => ({ default: m.Resources })));
const Contact = lazy(() => import('@/app/pages/Contact').then(m => ({ default: m.Contact })));

// Loading fallback component
function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
    <Router>
      <div className="min-h-screen flex flex-col relative">
        {/* Global Background Map */}
        <div
          className="fixed inset-0 opacity-[0.065] bg-center pointer-events-none z-[-1]"
          style={{
            backgroundImage: `url(${BACKGROUND_IMAGE_URL})`,
            backgroundSize: "125%",
            filter: "grayscale(100%) contrast(1.4)",
          }}
        />

        <Navigation />
        <main className="flex-1">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/our-work" element={<OurWork />} />
              <Route path="/faqs" element={<FAQs />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </Router>
    </ErrorBoundary>
  );
}
