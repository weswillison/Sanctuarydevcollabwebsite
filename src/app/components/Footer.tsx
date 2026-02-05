import { Link } from 'react-router-dom';
import logo from 'figma:asset/09b8b157a83f2224eaabf71c940c167e8fa1a2f2.png';

export function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center text-primary mb-3">
              <img src={logo} alt="Sanctuary Development Collaborative" className="h-12 w-auto" />
            </div>
            <p className="text-sm text-muted-foreground">
              Empowering churches through strategic real estate development consultation.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-accent transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/our-work" className="text-muted-foreground hover:text-accent transition-colors">
                  Our Work
                </Link>
              </li>
              <li>
                <Link to="/faqs" className="text-muted-foreground hover:text-accent transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="/resources" className="text-muted-foreground hover:text-accent transition-colors">
                  Resources
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-3">Get in Touch</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Email: info@sanctuarydevcollaborative.org</li>
              <li>Phone: (555) 123-4567</li>
              <li>
                <Link to="/contact" className="text-accent hover:text-primary transition-colors">
                  Contact Form →
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Sanctuary Development Collaborative. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}