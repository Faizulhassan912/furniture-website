import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Heart } from 'lucide-react';
import Logo from '../ui/Logo';
import { useSettings } from '../../context/SettingsContext';
import { ChevronDown } from 'lucide-react';

const quickLinks = [
  { to: '/', label: 'Home' },
  { to: '/collection', label: 'Collection' },
  { to: '/about', label: 'About Us' },
  { to: '/contact', label: 'Custom Order' },
];

function Footer() {
  const currentYear = new Date().getFullYear();
  const { settings } = useSettings();
  const siteSettings = settings?.settings || {};
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const ChevronIcon = ({ isOpen }) => (
    <ChevronDown className={`w-4 h-4 transition-transform duration-300 md:hidden ${isOpen ? 'rotate-180' : ''}`} />
  );

  return (
    <footer className="bg-bg-footer text-text border-t border-border">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-8">
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-2 lg:col-span-2 text-center md:text-left pr-0 lg:pr-10 mb-4 md:mb-0">
            <Link to="/" className="inline-block hover:opacity-90 transition-opacity">
              <Logo className="h-12 w-auto text-primary mx-auto md:mx-0" text={siteSettings.siteName || "S. Kids"} logoUrl={settings?.logo || null} />
            </Link>
            <p className="mt-4 sm:mt-6 text-text-light text-sm leading-relaxed max-w-sm mx-auto md:mx-0">
              Premium, safe, and beautifully crafted custom furniture designed especially for kids' rooms. Every piece is built with love.
            </p>
          </div>

          {/* Quick Links Column */}
          <div className="border-b border-border/50 md:border-none pb-4 md:pb-0">
            <button 
              className="w-full flex items-center justify-between md:cursor-default" 
              onClick={() => toggleSection('links')}
            >
              <h4 className="text-sm font-bold uppercase tracking-wider text-text md:mb-5">
                Quick Links
              </h4>
              <ChevronIcon isOpen={openSection === 'links'} />
            </button>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out md:!max-h-none md:!opacity-100 md:mt-0 ${openSection === 'links' ? 'max-h-[300px] opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-sm text-text-light hover:text-primary transition-colors duration-300 block py-1 md:py-0"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Support & Legal Column */}
          <div className="border-b border-border/50 md:border-none pb-4 md:pb-0">
            <button 
              className="w-full flex items-center justify-between md:cursor-default" 
              onClick={() => toggleSection('support')}
            >
              <h4 className="text-sm font-bold uppercase tracking-wider text-text md:mb-5">
                Support & Legal
              </h4>
              <ChevronIcon isOpen={openSection === 'support'} />
            </button>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out md:!max-h-none md:!opacity-100 md:mt-0 ${openSection === 'support' ? 'max-h-[300px] opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
              <ul className="space-y-3">
                {[
                  { to: '/faq', label: 'FAQs' },
                  { to: '/testimonials', label: 'Testimonials' },
                  { to: '/privacy-policy', label: 'Privacy Policy' },
                  { to: '/terms', label: 'Terms & Conditions' },
                ].map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-sm text-text-light hover:text-primary transition-colors duration-300 block py-1 md:py-0"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact Info Column */}
          <div className="border-b border-border/50 md:border-none pb-4 md:pb-0">
            <button 
              className="w-full flex items-center justify-between md:cursor-default" 
              onClick={() => toggleSection('contact')}
            >
              <h4 className="text-sm font-bold uppercase tracking-wider text-text md:mb-5">
                Contact Us
              </h4>
              <ChevronIcon isOpen={openSection === 'contact'} />
            </button>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out md:!max-h-none md:!opacity-100 md:mt-0 ${openSection === 'contact' ? 'max-h-[300px] opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
              <ul className="space-y-3 text-sm text-text-light">
                <li className="flex items-start gap-3 py-1 md:py-0">
                  <MapPin className="w-5 h-5 text-primary shrink-0" />
                  <span>{siteSettings.address || 'Lahore, Pakistan'}</span>
                </li>
                <li className="flex items-start gap-3 py-1 md:py-0">
                  <Phone className="w-5 h-5 text-primary shrink-0" />
                  <span>{siteSettings.phone || '+92 300 1234567'}</span>
                </li>
                <li className="flex items-start gap-3 py-1 md:py-0">
                  <Mail className="w-5 h-5 text-primary shrink-0" />
                  <span>{siteSettings.email || 'info@sskids.com'}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Social & CTA Column */}
          <div className="mt-4 md:mt-0 text-center md:text-left md:col-span-2 lg:col-span-5 lg:mt-4 flex flex-col lg:flex-row items-center justify-between pt-6 border-t border-border">
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider mb-4 text-text hidden lg:block">
                Follow Us
              </h4>
              <div className="flex gap-3 mb-6 lg:mb-0 justify-center md:justify-start">
                {[
                  { 
                    label: 'Facebook', 
                    icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" /></svg>, 
                    url: siteSettings.facebook || 'https://facebook.com' 
                  },
                  { 
                    label: 'Instagram', 
                    icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" /></svg>, 
                    url: siteSettings.instagram || 'https://instagram.com' 
                  },
                  { 
                    label: 'WhatsApp', 
                    icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 16 16"><path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/></svg>, 
                    url: `https://wa.me/${(siteSettings.whatsapp || '923001234567').replace(/\D/g, '')}`
                  },
                ].map((social) => (
                  <a
                    key={social.label}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-bg-alt hover:bg-primary flex items-center justify-center transition-all duration-300 hover:scale-110 hover:text-white border border-border shadow-sm text-text"
                    aria-label={`Follow us on ${social.label}`}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
            <Link
              to="/contact"
              className="inline-block bg-primary hover:bg-primary-dark text-white text-sm font-semibold px-6 py-2.5 rounded-full transition-all duration-300 hover:shadow-lg"
            >
              Request a Quote
            </Link>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-text-light">
          <p>&copy; {currentYear} {siteSettings.siteName || 'S&S Kids Furniture'}. All rights reserved.</p>
          <p className="flex items-center justify-center sm:justify-start gap-1">Crafted with <Heart className="w-4 h-4 text-red-500 fill-current mx-1" /> for little dreamers</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
