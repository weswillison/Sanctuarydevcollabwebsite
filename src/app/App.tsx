import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigation } from '@/app/components/Navigation';
import { Footer } from '@/app/components/Footer';
import { Home } from '@/app/pages/Home';
import { About } from '@/app/pages/About';
import { OurWork } from '@/app/pages/OurWork';
import { FAQs } from '@/app/pages/FAQs';
import { Resources } from '@/app/pages/Resources';
import { Contact } from '@/app/pages/Contact';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col relative">
        {/* Global Background Map */}
        <div
          className="fixed inset-0 opacity-[0.065] bg-center pointer-events-none z-[-1]"
          style={{
            backgroundImage: `url(https://cdn6.picryl.com/photo/1881/01/01/city-of-philadelphia-937f8f-1024.jpg)`,
            backgroundSize: "125%",
            filter: "grayscale(100%) contrast(1.4)",
          }}
        />
        
        <Navigation />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/our-work" element={<OurWork />} />
            <Route path="/faqs" element={<FAQs />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}