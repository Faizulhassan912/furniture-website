import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import SectionHeading from '../components/ui/SectionHeading';
import SEO from '../components/SEO';
import PageTransition from '../components/layout/PageTransition';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../context/CartContext';

import CategoriesShowcase from '../components/home/CategoriesShowcase';
import PromoBanner from '../components/home/PromoBanner';
import WhyChooseUs from '../components/home/WhyChooseUs';
import Testimonials from '../components/home/Testimonials';
import FAQSection from '../components/home/FAQSection';

import { ShoppingBag, MessageCircle, ZoomIn, Sparkles, X } from 'lucide-react';
import DynamicIcon from '../components/ui/DynamicIcon';
import OptimizedImage from '../components/ui/OptimizedImage';
// ==========================================
// 1. Extracted Inline Components
// ==========================================

const HeroSection = ({ data }) => {
  const heroImages = [];
  if (data?.heroImage1) heroImages.push(data.heroImage1);
  if (data?.heroImage2) heroImages.push(data.heroImage2);
  if (data?.heroImage3) heroImages.push(data.heroImage3);

  if (heroImages.length === 0) {
    heroImages.push('/images/single-bed-2.webp', '/images/bunk-bed-1.webp', '/images/almary-1.webp');
  }

  const [currentHeroImage, setCurrentHeroImage] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentHeroImage((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(intervalId);
  }, [heroImages.length]);

  return (
    <section className="relative flex items-center justify-center bg-bg-alt overflow-x-hidden min-h-[calc(100vh-5rem)] lg:min-h-[calc(100vh-5.5rem)] py-2 sm:py-4 lg:py-6">
      {/* Mobile Background Image Slider (hidden on md and up) */}
      <div className="absolute inset-0 z-0 md:hidden">
        {heroImages.map((img, index) => (
          <div key={img} className={`absolute inset-0 transition-opacity duration-1000 ${index === currentHeroImage ? 'opacity-100' : 'opacity-0'}`}>
            <OptimizedImage 
              src={img} 
              alt="Background" 
              className="w-full h-full object-cover" 
              width={1200} 
              loading={index === 0 ? "eager" : "lazy"} 
              fetchPriority={index === 0 ? "high" : "low"}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-white/35 to-white/65 dark:from-bg/80 dark:via-bg/60 dark:to-bg/90" />
          </div>
        ))}
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 relative z-10 w-full flex flex-col md:flex-row items-center justify-between gap-8 lg:gap-12 xl:gap-16 my-auto">
        {/* Text Content */}
        <div className="w-full md:w-1/2 xl:w-5/12 text-center md:text-left flex flex-col items-center md:items-start justify-center py-4 px-3 sm:p-6 md:p-0 rounded-3xl md:rounded-none bg-white/40 md:bg-transparent dark:bg-bg/40 dark:md:bg-transparent backdrop-blur-[2px] md:backdrop-blur-none border border-white/60 md:border-none shadow-sm md:shadow-none">
          <span className="inline-block px-4 sm:px-5 py-1.5 sm:py-2 bg-primary/15 text-primary-dark dark:text-primary-light border border-primary/30 text-xs sm:text-sm md:text-base font-bold rounded-full mb-4 sm:mb-6 backdrop-blur-md shadow-sm">
            ✨ Custom-Made for Your Little One
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-[#1e293b] dark:text-white leading-[1.12] tracking-tight font-heading max-w-2xl mx-auto md:mx-0">
            {data?.heroTitle || (
              <>Magical Furniture for <span className="text-primary dark:text-primary-light">Little Dreamers</span></>
            )}
          </h1>
          <p className="mt-4 sm:mt-6 text-base sm:text-lg lg:text-xl text-[#334155] dark:text-[#cbd5e1] max-w-xl mx-auto md:mx-0 leading-relaxed">
            {data?.heroSubtitle || "Custom-crafted, safe, and beautifully designed furniture for your child's perfect room."}
          </p>
          <div className="mt-7 sm:mt-9 flex flex-col w-full sm:max-w-xl mx-auto md:mx-0">
            <div className="flex flex-row gap-3 sm:gap-5 w-full justify-center md:justify-start items-center">
              <Link to="/collection" className="flex-1 sm:flex-none inline-flex items-center justify-center font-bold rounded-full transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl hover:-translate-y-0.5 bg-bg-card text-text border-2 border-border hover:border-primary text-sm sm:text-base lg:text-lg px-6 py-3.5 sm:px-8 sm:py-4 lg:px-9 lg:py-4">
                <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                All Products
              </Link>
              <Link to="/contact" className="flex-1 sm:flex-none inline-flex items-center justify-center font-bold rounded-full transition-all duration-300 cursor-pointer shadow-md hover:shadow-lg hover:-translate-y-0.5 text-sm sm:text-base lg:text-lg px-6 py-3.5 sm:px-8 sm:py-4 lg:px-9 lg:py-4 bg-transparent border-2 border-primary/30 text-primary hover:bg-primary/5">
                <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                Custom Order
              </Link>
            </div>
          </div>
        </div>
        
        {/* Desktop Image Frame - Tilted Card Layout */}
        <div className="hidden md:flex w-full md:w-1/2 xl:w-7/12 relative min-h-[440px] lg:min-h-[520px] xl:min-h-[580px] items-center justify-center pl-0 lg:pl-6">
          
          {/* Main Tilted Image Container */}
          <div 
            className="relative w-full max-w-[560px] lg:max-w-[640px] xl:max-w-[700px] aspect-[4/3] rounded-3xl lg:rounded-[2.5rem] overflow-hidden shadow-2xl z-10 border-[6px] lg:border-[8px] border-bg-card/70 dark:border-border/50 group cursor-pointer transform -rotate-1 hover:rotate-0 transition-all duration-500 hover:scale-[1.03] animate-[float_6s_ease-in-out_infinite]"
            onClick={() => setIsZoomOpen(true)}
          >
            <div className="w-full h-full relative bg-bg-alt">
              {heroImages.map((img, index) => (
                <div key={img} className={`absolute inset-0 transition-opacity duration-1000 ${index === currentHeroImage ? 'opacity-100' : 'opacity-0'}`}>
                  <OptimizedImage 
                    src={img} 
                    alt="Kids Furniture" 
                    className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110" 
                    width={1200} 
                    loading={index === 0 ? "eager" : "lazy"} 
                    fetchPriority={index === 0 ? "high" : "low"}
                  />
                </div>
              ))}
            </div>
            
            {/* Zoom Icon overlay on hover */}
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
              <div className="bg-white/90 text-primary p-4 rounded-full transform scale-50 group-hover:scale-100 transition-transform duration-300 shadow-xl">
                <ZoomIn className="w-8 h-8" />
              </div>
            </div>
          </div>

          {/* Decorative Spark Icon */}
          <div className="absolute bottom-8 right-2 z-20 text-primary/30 dark:text-white/20 pointer-events-none animate-pulse">
            <Sparkles className="w-12 h-12" />
          </div>

          {/* Subtle Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] bg-primary/15 rounded-full blur-[120px] z-0 pointer-events-none"></div>
        </div>

      </div>

      {/* Full Screen Image Zoom Modal */}
      {isZoomOpen && (
        <div 
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 lg:p-8" 
          onClick={() => setIsZoomOpen(false)}
        >
          <button 
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors bg-black/50 hover:bg-black/80 p-3 rounded-full shadow-lg z-50 cursor-pointer"
            onClick={(e) => { e.stopPropagation(); setIsZoomOpen(false); }}
            aria-label="Close zoom preview"
          >
            <X className="w-8 h-8" />
          </button>
          <img 
            src={heroImages[currentHeroImage]} 
            alt="Zoomed Furniture" 
            className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl animate-[fadeIn_0.3s_ease-out]"
            onClick={(e) => e.stopPropagation()} 
          />
        </div>
      )}
    </section>
  );
};


const HowItWorks = ({ data }) => {
  const steps = data?.howItWorks || [
    { id: 1, step: '01', icon: 'Palette', title: 'Browse or Design', desc: "Explore our collection or upload your own design idea for a fully custom piece." },
    { id: 2, step: '02', icon: 'MessageCircle', title: 'Discuss & Customize', desc: "We'll work with you on dimensions, colors, materials, and every little detail." },
    { id: 3, step: '03', icon: 'Truck', title: 'We Build & Deliver', desc: 'Your custom furniture is handcrafted with care and delivered to your door.' },
  ];

  const renderIcon = (iconName) => {
    return <DynamicIcon name={iconName} className="w-8 h-8 text-primary mx-auto" />;
  };

  return (
    <section className="bg-bg-alt py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading title={data?.howItWorksTitle || "How It Works"} subtitle={data?.howItWorksSubtitle || "Getting your dream furniture is easier than you think"} />
        <div className="flex overflow-x-auto gap-4 md:grid md:grid-cols-3 md:gap-8 pb-4 snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden -mx-4 px-4 md:mx-0 md:px-0">
          {steps.map((item) => (
            <div key={item.step} className="relative bg-bg border border-border/50 rounded-2xl p-8 text-center shadow-md hover:shadow-lg hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 flex-none w-[85vw] sm:w-[60vw] md:w-auto snap-center sm:snap-start">
              <span className="absolute top-4 right-4 text-5xl font-extrabold text-text/5 font-heading pointer-events-none">{item.step}</span>
              <div className="mb-4 bg-primary/10 w-16 h-16 mx-auto rounded-2xl flex items-center justify-center">
                {renderIcon(item.icon)}
              </div>
              <h3 className="text-xl font-bold text-text mb-2 font-heading">{item.title}</h3>
              <p className="text-text-light">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FeaturedCatalog = () => {
  const { products } = useProducts();
  const { addToCart } = useCart();
  const featuredProducts = products ? products.filter((p) => p.featured).slice(0, 4) : [];
  return (
    <section className="bg-bg py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading title="Featured Designs" subtitle="Some of our most loved creations" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {featuredProducts.map((product) => (
            <div
              key={product._id || product.id}
              className="bg-bg-card rounded-xl sm:rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group flex flex-col h-full border border-border hover:-translate-y-1"
            >
              <Link to={`/collection/${product.slug}`} className="shrink-0">
                <div className="w-full aspect-[4/3] bg-bg-alt flex items-center justify-center overflow-hidden group-hover:opacity-90 transition-opacity">
                    <OptimizedImage
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal group-hover:scale-105 transition-transform duration-500"
                    width={600}
                  />
                </div>
              </Link>
              <div className="p-2.5 sm:p-4 flex flex-col flex-1">
                <span className="text-[9px] sm:text-xs font-semibold text-accent uppercase tracking-wider line-clamp-1">
                  {product.category}
                </span>
                <Link to={`/collection/${product.slug}`}>
                  <h3 className="font-bold text-text text-xs sm:text-lg mt-0.5 sm:mt-1 hover:text-accent transition-colors line-clamp-2 leading-tight">
                    {product.name}
                  </h3>
                </Link>

                {/* Reserved space for price so layout doesn't shift */}
                <div className="mt-1 sm:mt-1.5 h-4 sm:h-6 flex items-center">
                  {product.price > 0 && (
                    <span className="text-xs sm:text-base font-bold text-primary">
                      Rs {product.price.toLocaleString()}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-1 mt-2 mb-3">
                  {product.colors && product.colors.slice(0, 3).map((color) => (
                    <span
                      key={color}
                      className="text-[10px] px-2 py-0.5 bg-bg-alt rounded-full text-text-light border border-border"
                    >
                      {color}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between gap-1.5 sm:gap-2 pt-2 sm:pt-4 border-t border-border mt-auto">
                  <Link
                    to={`/collection/${product.slug}`}
                    className="flex-1 bg-bg-alt text-text text-[10px] sm:text-sm font-bold py-2 sm:py-3 px-1 sm:px-4 rounded-lg sm:rounded-xl text-center hover:bg-accent hover:text-bg-card transition-colors shadow-sm border border-border whitespace-nowrap"
                  >
                    View Details
                  </Link>

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      addToCart(product);
                    }}
                    className="inline-flex items-center justify-center w-8 h-8 sm:w-12 sm:h-12 shrink-0 rounded-lg sm:rounded-xl bg-primary text-white hover:bg-primary-dark transition-all duration-300 shadow-sm cursor-pointer"
                    title="Add to Cart"
                    aria-label={`Add ${product.name} to Cart`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CTASection = ({ data }) => (
  <section className="bg-primary py-20">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h2 className="text-3xl md:text-4xl font-bold text-text-on-primary font-heading">{data?.ctaTitle || 'Have a Unique Idea?'}</h2>
      <p className="mt-4 text-lg text-text-on-primary/80 max-w-2xl mx-auto">
        {data?.ctaSubtitle || "Send us your design or reference picture, and we'll bring it to life with premium craftsmanship. Every piece is custom-made just for you."}
      </p>
      <div className="mt-8">
        <Button href="/contact" variant="secondary" size="lg">{data?.ctaButton || 'Request Custom Build'}</Button>
      </div>
    </div>
  </section>
);

// ==========================================
// 2. Dynamic Page Builder Engine
// ==========================================

const componentMap = {
  hero: HeroSection,
  banners: PromoBanner,
  categories: CategoriesShowcase,
  howItWorks: HowItWorks,
  why: WhyChooseUs,
  featured: FeaturedCatalog,
  testimonials: Testimonials,
  faq: FAQSection,
  cta: CTASection
};

const fallbackLayout = [
  { id: 'hero', visible: true },
  { id: 'banners', visible: true },
  { id: 'categories', visible: true },
  { id: 'howItWorks', visible: true },
  { id: 'why', visible: true },
  { id: 'featured', visible: true },
  { id: 'testimonials', visible: true },
  { id: 'faq', visible: true },
  { id: 'cta', visible: true }
];

function HomePage() {
  const [homeData, setHomeData] = useState(null);
  const [layout, setLayout] = useState(fallbackLayout);
  const [bannersData, setBannersData] = useState(null);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const res = await fetch('/api/content/home');
        if (res.ok) {
          const data = await res.json();
          setHomeData(data);
          if (data.layout) {
            setLayout(data.layout);
          }
        }
      } catch (err) {
        console.error('Error fetching home data:', err);
      }
    };
    fetchHomeData();
  }, []);

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

  return (
    <PageTransition>
      <SEO 
        title="Custom Kids Furniture" 
        description="Premium handcrafted custom furniture for kids. Explore our range of durable, beautiful, and safe beds, desks, and storage." 
      />
      
      {/* 🚀 Dynamic Rendering Loop */}
      {layout
        .filter(section => section.visible)
        .map((section, idx) => {
          const SectionComponent = componentMap[section.id];
          if (!SectionComponent) return null;

          if (section.id === 'banners') {
            return <SectionComponent key={`${section.id}-${idx}`} bannersData={bannersData} />;
          }
          if (section.id === 'categories') {
             return <SectionComponent key={`${section.id}-${idx}`} title={homeData?.categoriesTitle} subtitle={homeData?.categoriesSubtitle} />;
          }
          if (section.id === 'why') {
             return <SectionComponent key={`${section.id}-${idx}`} title={homeData?.whyChooseUsTitle} subtitle={homeData?.whyChooseUsSubtitle} featuresData={homeData?.whyChooseUs} />;
          }

          return <SectionComponent key={`${section.id}-${idx}`} data={homeData} />;
        })}

    </PageTransition>
  );
}

export default HomePage;
