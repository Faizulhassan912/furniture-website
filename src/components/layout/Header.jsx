import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import Logo from '../ui/Logo';
import { useCart } from '../../context/CartContext';
import { useSettings } from '../../context/SettingsContext';

import { Sun, Moon, ShoppingCart, ChevronRight, MessageSquare, Home, LayoutGrid, Info, Circle } from 'lucide-react';
import { iconMap } from '../ui/DynamicIcon';

const navLinks = [
  { to: '/', label: 'Home', icon: 'Home' },
  { to: '/collection', label: 'Shop', icon: 'LayoutGrid' },
  { to: '/about', label: 'About', icon: 'Info' },
  { to: '/contact', label: 'Contact', icon: 'MessageSquare' },
];

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [bannersData, setBannersData] = useState(null);
  const { cartItems, setIsCartOpen } = useCart();
  const { settings } = useSettings();

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch('/api/content/banners');
        if (res.ok) {
          const data = await res.json();
          setBannersData(data);
        }
      } catch (err) {
        console.error('Error fetching banners:', err);
      }
    };
    fetchBanners();
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  useEffect(() => {
    const preventScroll = (e) => {
      // Allow scrolling inside the menu if needed, but generally block it
      const target = e.target;
      if (!target.closest('.mobile-menu-scrollable')) {
        e.preventDefault();
      }
    };
    
    if (mobileMenuOpen) {
      document.addEventListener('touchmove', preventScroll, { passive: false });
      document.addEventListener('wheel', preventScroll, { passive: false });
    }
    
    return () => {
      document.removeEventListener('touchmove', preventScroll);
      document.removeEventListener('wheel', preventScroll);
    };
  }, [mobileMenuOpen]);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
      setIsDarkMode(false);
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
      setIsDarkMode(true);
    }
  };

  return (
    <>
      {/* Top Promo Bar (Sticky on its own) */}
      {bannersData?.promoText && (
        <div className="sticky top-0 z-[60] bg-primary text-text-on-primary text-center py-2 text-sm font-bold tracking-wide w-full shadow-md">
          {bannersData.promoText}
        </div>
      )}
      
      <header className="relative z-50 bg-bg-card/90 backdrop-blur-md shadow-sm border-b border-border transition-all duration-300">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <div className="flex shrink-0 items-center">
            <Link
              to="/"
              className="flex items-center gap-2 hover:opacity-90 transition-opacity"
            >
              <Logo className="h-10 w-auto text-primary" text={settings?.settings?.siteName || "S&S Kids"} logoUrl={settings?.logo || null} />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `relative text-sm font-medium transition-colors duration-300 py-1 ${
                    isActive
                      ? 'text-primary'
                      : 'text-text-light hover:text-primary'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {link.label}
                    <span
                      className={`absolute -bottom-1 left-0 h-0.5 bg-primary rounded-full transition-all duration-300 ${
                        isActive ? 'w-full' : 'w-0 group-hover:w-full'
                      }`}
                    />
                  </>
                )}
              </NavLink>
            ))}

            {/* CTA Button, Cart & Theme Toggle */}
            <div className="flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full bg-bg-alt text-text hover:bg-primary hover:text-white transition-colors border border-border shadow-sm cursor-pointer"
                aria-label={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {isDarkMode ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
              
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 rounded-full bg-bg-alt text-text hover:bg-accent hover:text-white transition-colors border border-border shadow-sm cursor-pointer"
                aria-label="Open Cart"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {cartItems?.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-primary text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-bg-card">
                    {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </button>

              <Link
                to="/collection"
                className="bg-accent hover:bg-accent-dark text-text-on-accent text-sm font-semibold px-5 py-2.5 rounded-full transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
              >
                Shop Now
              </Link>
            </div>
          </div>

          {/* Mobile Theme, Cart & Hamburger */}
          <div className="flex items-center gap-3 md:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-bg-alt text-text transition-colors border border-border shadow-sm"
              aria-label={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-full bg-bg-alt text-text hover:bg-accent hover:text-white transition-colors border border-border shadow-sm cursor-pointer"
              aria-label="Open Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartItems?.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-primary text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-bg-card shadow-sm">
                  {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-text bg-bg-alt hover:bg-primary hover:text-white transition-colors cursor-pointer border border-border shadow-sm z-[110]"
              aria-label="Toggle navigation menu"
            >
              <div className="w-6 h-5 relative flex flex-col justify-between">
                <span className={`w-full h-0.5 bg-current rounded-full transition-all duration-300 origin-center ${mobileMenuOpen ? 'rotate-45 translate-y-[9px]' : ''}`} />
                <span className={`w-full h-0.5 bg-current rounded-full transition-all duration-300 ${mobileMenuOpen ? 'opacity-0 scale-0' : ''}`} />
                <span className={`w-full h-0.5 bg-current rounded-full transition-all duration-300 origin-center ${mobileMenuOpen ? '-rotate-45 -translate-y-[9px]' : ''}`} />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Full-Page Backdrop & Dropdown Menu */}
      <div 
        className={`md:hidden absolute top-full left-0 right-0 h-[100dvh] z-[100] ${
          mobileMenuOpen ? 'pointer-events-auto' : 'pointer-events-none delay-500'
        }`}
      >
        {/* Dark Shadow Backdrop covering the page */}
        <div 
          className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-all duration-500 ease-in-out ${
            mobileMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setMobileMenuOpen(false)}
        />
        
        {/* Dropdown Menu Container */}
        <div 
          className={`absolute top-2 right-2 left-2 bg-bg border border-border shadow-2xl rounded-2xl overflow-hidden transition-all duration-500 origin-top-right mobile-menu-scrollable ${
            mobileMenuOpen ? 'scale-100 opacity-100 visible' : 'scale-0 opacity-0 invisible'
          }`}
        >
          <div className="flex flex-col py-2 px-2 gap-1">
            {navLinks.map((link, index) => {
              const Icon = iconMap[link.icon] || Circle;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 ${
                      isActive 
                        ? 'bg-primary/10 text-primary' 
                        : 'text-text hover:bg-bg-alt'
                    }`
                  }
                  style={{ transitionDelay: mobileMenuOpen ? `${index * 50}ms` : '0ms' }}
                >
                  {({ isActive }) => (
                    <>
                      <div className={`p-2 rounded-xl transition-colors ${isActive ? 'bg-primary text-white' : 'bg-bg-card text-primary shadow-sm'}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="font-semibold text-lg">{link.label}</span>
                      <ChevronRight className={`w-4 h-4 ml-auto transition-transform ${isActive ? 'text-primary' : 'text-text-light group-hover:translate-x-1'}`} />
                    </>
                  )}
                </NavLink>
              );
            })}
            
            <div className="mt-4 pt-4 border-t border-border/50">
              <Link
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center w-full gap-2 bg-primary hover:bg-primary-dark text-white font-semibold py-4 rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
              >
                <MessageSquare className="w-5 h-5" />
                Get a Custom Quote
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
    </>
  );
}

export default Header;
