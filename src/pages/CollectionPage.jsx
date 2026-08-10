import { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import SEO from '../components/SEO';
import PageTransition from '../components/layout/PageTransition';
import SkeletonCard from '../components/ui/SkeletonCard';
import { useCart } from '../context/CartContext';
import { useProducts } from '../hooks/useProducts';
import { Search, X, SearchX, Sparkles } from 'lucide-react';
import OptimizedImage from '../components/ui/OptimizedImage';

function CollectionPage() {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  const { addToCart } = useCart();

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const [zoomedImage, setZoomedImage] = useState(null);
  const [categories, setCategories] = useState(['All']);

  // Real-time live search debounce (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const [page, setPage] = useState(1);
  const [isDesktop, setIsDesktop] = useState(() => {
    return typeof window !== 'undefined' ? window.innerWidth >= 1024 : true;
  });

  useEffect(() => {
    setIsDesktop(typeof window !== 'undefined' && window.innerWidth >= 1024);
  }, []);

  const { products, loading: productsLoading, hasMore } = useProducts({
    category: activeCategory,
    search: debouncedSearch,
    minPrice,
    maxPrice,
    page,
    limit: isDesktop ? 48 : 24
  });

  const [isPaginating, setIsPaginating] = useState(false);

  useEffect(() => {
    setPage(1);
  }, [activeCategory, debouncedSearch, minPrice, maxPrice]);

  const handleLoadMore = () => {
    setIsPaginating(true);
    setPage(prev => prev + 1);
    setTimeout(() => setIsPaginating(false), 500);
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [rawCategories, setRawCategories] = useState([]);
  const [expandedCats, setExpandedCats] = useState({});

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories');
        if (res.ok) {
          const data = await res.json();
          const activeData = data.filter(c => c.status === 'Active');
          setRawCategories(activeData);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);

  const sliderRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  // Auto-scroll logic
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    let animationId;

    const scrollStep = () => {
      if (!isHovered && !isDragging) {
        slider.scrollLeft += 1;
        if (slider.scrollLeft >= slider.scrollWidth / 2) {
          slider.scrollLeft = 0;
        }
      }
      animationId = requestAnimationFrame(scrollStep);
    };

    animationId = requestAnimationFrame(scrollStep);
    return () => cancelAnimationFrame(animationId);
  }, [isHovered, isDragging]);

  // Manual drag handlers
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setScrollLeftState(sliderRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    setIsHovered(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    sliderRef.current.scrollLeft = scrollLeftState - walk;
  };

  const [sortBy, setSortBy] = useState('featured');
  const [isLoading, setIsLoading] = useState(true);

  const [collectionData, setCollectionData] = useState(null);

  useEffect(() => {
    const fetchCollectionData = async () => {
      try {
        const res = await fetch('/api/content/collection');
        if (res.ok) {
          const data = await res.json();
          setCollectionData(data);
        }
      } catch (err) {
        console.error('Error fetching collection content:', err);
      }
    };
    fetchCollectionData();
  }, []);

  const defaultSliderImages = [
    '/images/bunk-bed-1.jpg',
    '/images/almary-1.jpg',
    '/images/single-bed-1.jpg',
    '/images/car-bed-1.jpg',
    '/images/bunk-bed-2.jpg'
  ];

  const sliderImages = [];
  if (collectionData) {
    if (collectionData.sliderImage1) sliderImages.push(collectionData.sliderImage1);
    if (collectionData.sliderImage2) sliderImages.push(collectionData.sliderImage2);
    if (collectionData.sliderImage3) sliderImages.push(collectionData.sliderImage3);
    if (collectionData.sliderImage4) sliderImages.push(collectionData.sliderImage4);
    if (collectionData.sliderImage5) sliderImages.push(collectionData.sliderImage5);
  }
  if (sliderImages.length === 0) {
    sliderImages.push(...defaultSliderImages);
  }

  // Update active category if URL changes
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setActiveCategory(cat);
  }, [searchParams]);

  // Handle loading state naturally without artificial delay
  useEffect(() => {
    if (!productsLoading) {
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }
  }, [productsLoading]);

  // Backend returns filtered products, we just need to sort them client-side if needed
  let filteredProducts = products ? [...products] : [];

  // Sort products
  if (sortBy === 'name-asc') {
    filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy === 'name-desc') {
    filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
  } else if (sortBy === 'featured') {
    filteredProducts.sort((a, b) => (b.featured === a.featured ? 0 : b.featured ? 1 : -1));
  }

  return (
    <PageTransition>
      <SEO title="Our Collection" description="Browse our beautiful custom kids furniture designs." />

      {/* Innovative Split Header & Infinite Slider */}
      <section className="bg-bg py-8 lg:py-12 border-b border-border overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center min-h-[40vh]">
          <div className="flex flex-col lg:flex-row items-center justify-center gap-4 sm:gap-6 lg:gap-12 w-full">

            {/* Left Side: Text Content */}
            <div className="w-full lg:w-1/2 xl:w-5/12 text-center lg:text-left z-10 flex flex-col justify-center order-1">
              <span className="inline-flex items-center justify-center w-fit mx-auto lg:mx-0 px-4 py-1.5 sm:px-5 sm:py-2 rounded-full bg-primary/20 text-primary-light md:text-primary text-[10px] sm:text-xs md:text-sm font-bold tracking-wider uppercase mb-4 sm:mb-6 shadow-sm border border-primary/30">
                <Sparkles className="inline-block w-3 h-3 sm:w-4 sm:h-4 mr-1.5 -mt-0.5" /> {collectionData?.heroBadge || 'Explore The Magic'}
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-text font-heading mb-4 sm:mb-6 drop-shadow-sm leading-tight">
                {collectionData?.heroTitle || (
                  <>Discover Our <br /><span className="text-primary">Dream Collection</span></>
                )}
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-text-light leading-relaxed mb-4 sm:mb-8 max-w-lg mx-auto lg:mx-0">
                {collectionData?.heroSubtitle || "Browse our carefully crafted kids furniture. From magical bunk beds to creative study desks, find the perfect piece for your little one's room."}
              </p>

              {/* Button for Desktop */}
              <div className="hidden lg:flex items-center justify-start gap-4">
                <button
                  onClick={() => document.getElementById('products-section').scrollIntoView({ behavior: 'smooth' })}
                  className="bg-accent text-white px-8 py-4 rounded-xl font-bold hover:bg-accent-dark transition-all shadow-sm hover:shadow-md"
                >
                  Start Exploring
                </button>
              </div>
            </div>

            {/* Right Content - Unified Image Slider */}
            <div className="w-full lg:w-1/2 xl:w-7/12 relative flex flex-col gap-6 animate-[float_6s_ease-in-out_infinite] lg:pl-12 order-2">

              {/* Fade masks for smooth edges */}
              <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-bg to-transparent z-10 pointer-events-none"></div>
              <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-bg to-transparent z-10 pointer-events-none"></div>

              {/* Single Unified Slider (Auto + Manual Drag) */}
              <div
                ref={sliderRef}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={handleMouseLeave}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                className="overflow-x-auto flex gap-3 sm:gap-6 pb-2 sm:pb-4 pt-1 sm:pt-2 px-2 sm:px-8 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden select-none cursor-grab active:cursor-grabbing"
              >
                {[...sliderImages, ...sliderImages, ...sliderImages].map((src, index) => (
                  <div
                    key={`unified-${index}`}
                    className="relative flex-none w-48 sm:w-64 md:w-72 lg:w-80 aspect-[4/3] rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm hover:shadow-md border border-border/50 bg-bg-alt transition-transform duration-300 group cursor-pointer"
                    style={{ transform: isDragging ? 'scale(0.98)' : 'scale(1)' }}
                    onClick={() => { if (!isDragging) setZoomedImage(src); }}
                  >
                    <OptimizedImage
                      src={src}
                      alt={`Furniture design ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105 pointer-events-none"
                      width={800}
                    />
                    {/* Zoom Icon overlay on hover */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                      <div className="bg-white/90 text-primary p-3 rounded-full transform scale-50 group-hover:scale-100 transition-transform duration-300 shadow-xl">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Button for Mobile (Below Slider) */}
            <div className="flex lg:hidden items-center justify-center w-full order-3 mt-2">
              <button
                onClick={() => document.getElementById('products-section').scrollIntoView({ behavior: 'smooth' })}
                className="bg-accent text-white px-6 py-3 rounded-full font-bold hover:bg-accent-dark transition-all shadow-sm hover:shadow-md text-sm"
              >
                Start Exploring
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* Main Content Layout - Sidebar + Grid */}
      <section id="products-section" className="bg-bg py-16 min-h-[600px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Top Controls: Search Bar & Filter Toggle */}
          <div className="mb-8 flex flex-row items-center gap-2 sm:gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="flex items-center justify-center gap-2 w-12 h-12 sm:w-auto sm:h-auto sm:px-5 sm:py-3.5 bg-bg-card border border-border rounded-xl text-text font-semibold hover:bg-bg-alt hover:border-primary transition-colors shadow-sm shrink-0"
              title={isSidebarOpen ? "Hide Filters" : "Show Filters"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <span className="hidden sm:inline">{isSidebarOpen ? "Hide Filters" : "Show Filters"}</span>
            </button>
            {/* Live Real-time Search Bar */}
            <div className="relative flex-1 sm:flex-none sm:w-[360px] focus-within:sm:w-[460px] transition-all duration-300 ease-out">
              <div className="relative flex items-center bg-white dark:bg-bg-card rounded-xl p-1.5 border border-border focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 shadow-sm transition-all duration-300">
                <div className="flex items-center justify-center w-9 h-9 text-text-light ml-1 shrink-0">
                  <Search className="w-4 h-4 text-primary" />
                </div>
                <input
                  type="text"
                  placeholder="Search products, beds, wardrobes, categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none px-3 text-text placeholder:text-text/50 text-sm focus:ring-0"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    className="p-1.5 text-text-light hover:text-text hover:bg-bg-alt rounded-lg transition-colors mr-1 shrink-0"
                    title="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className={`flex flex-col lg:flex-row ${isSidebarOpen ? 'gap-8' : 'gap-0'} items-start relative transition-all duration-500`}>

            {/* Mobile Filter Overlay Background */}
            {isSidebarOpen && (
              <div 
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity" 
                onClick={() => setIsSidebarOpen(false)}
              ></div>
            )}

            {/* Left Sidebar Filters (Drawer on Mobile, Sticky on Desktop) */}
            <div className={`
              fixed inset-y-0 left-0 z-50 w-[280px] sm:w-[320px] bg-bg-card shadow-2xl h-full overflow-y-auto transform transition-all duration-500 ease-in-out
              ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
              lg:translate-x-0 lg:bg-transparent lg:shadow-none lg:z-auto lg:h-auto lg:overflow-visible
              lg:origin-left lg:shrink-0
              ${isSidebarOpen ? 'lg:w-1/4 lg:opacity-100 lg:scale-100 lg:mb-0 lg:sticky lg:top-32' : 'lg:w-0 lg:opacity-0 lg:scale-95 lg:h-0 lg:overflow-hidden lg:m-0 lg:p-0 border-none'}
            `}>
              <div className={`p-6 lg:bg-bg-card lg:rounded-2xl lg:shadow-sm lg:border lg:border-border w-full min-h-full lg:min-h-0 flex flex-col transition-all duration-500 lg:max-h-[calc(100vh-9rem)] lg:overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${!isSidebarOpen && 'lg:opacity-0 lg:invisible'}`}>
                
                {/* Mobile Drawer Header */}
                <div className="flex items-center justify-between mb-6 lg:hidden pb-4 border-b border-border">
                  <h2 className="text-xl font-bold text-text font-heading">Filters</h2>
                  <button 
                    onClick={() => setIsSidebarOpen(false)}
                    className="p-2 bg-bg-alt text-text rounded-full hover:bg-accent hover:text-white transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>

                {/* Category Filters */}
                <div className="mb-8">
                  <h3 className="text-sm uppercase tracking-wider font-bold text-text-light mb-4">Categories</h3>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => { setActiveCategory('All'); setExpandedCats({}); }}
                      className={`text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center justify-between ${activeCategory === 'All'
                        ? 'bg-accent text-bg-card shadow-md'
                        : 'bg-bg-alt text-text hover:bg-accent/20 hover:text-accent'
                        }`}
                    >
                      All
                      {activeCategory === 'All' && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>

                    {(() => {
                      const parents = rawCategories.filter(c => c.parent === 'None' || !c.parent);
                      return parents.map((cat) => {
                        const children = rawCategories.filter(c => c.parent === cat.name);
                        const hasChildren = children.length > 0;
                        const isExpanded = expandedCats[cat.name];

                        return (
                          <div key={cat.name} className="flex flex-col gap-1">
                            <button
                              onClick={() => {
                                setActiveCategory(cat.name);
                                if (hasChildren) {
                                  setExpandedCats(prev => ({ ...prev, [cat.name]: !prev[cat.name] }));
                                }
                              }}
                              className={`text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center justify-between ${activeCategory === cat.name
                                ? 'bg-accent text-bg-card shadow-md'
                                : 'bg-bg-alt text-text hover:bg-accent/20 hover:text-accent'
                                }`}
                            >
                              <span>{cat.name}</span>
                              <div className="flex items-center gap-2">
                                {activeCategory === cat.name && !hasChildren && (
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                                {hasChildren && (
                                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''} ${activeCategory === cat.name ? 'text-bg-card' : 'text-text-light'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                  </svg>
                                )}
                              </div>
                            </button>

                            {/* Render Children */}
                            {isExpanded && children.map(child => (
                              <button
                                key={child.name}
                                onClick={() => setActiveCategory(child.name)}
                                className={`text-left ml-4 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center justify-between ${activeCategory === child.name
                                  ? 'bg-accent/10 text-accent shadow-sm border border-accent/20'
                                  : 'bg-transparent text-text-light hover:bg-bg-alt hover:text-text'
                                  }`}
                              >
                                <div className="flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-border"></div>
                                  {child.name}
                                </div>
                                {activeCategory === child.name && (
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                              </button>
                            ))}
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>

                {/* Sort By Filter */}
                <div className="mb-8">
                  <h3 className="text-sm uppercase tracking-wider font-bold text-text-light mb-4">Sort By</h3>
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full px-4 py-3 bg-bg-alt rounded-xl border-none focus:ring-2 focus:ring-accent outline-none text-text text-sm cursor-pointer shadow-sm appearance-none font-medium"
                    >
                      <option value="featured">Featured First</option>
                      <option value="name-asc">Alphabetical: A to Z</option>
                      <option value="name-desc">Alphabetical: Z to A</option>
                    </select>
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-text/50">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Price Range Filter */}
                <div>
                  <h3 className="text-sm uppercase tracking-wider font-bold text-text-light mb-4">Price Range</h3>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <span className="absolute inset-y-0 left-3 flex items-center text-text-light text-sm pointer-events-none">Rs</span>
                      <input
                        type="number"
                        placeholder="Min"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="w-full pl-8 pr-3 py-2.5 bg-bg-alt border border-border rounded-xl focus:ring-2 focus:ring-accent outline-none text-sm shadow-sm"
                      />
                    </div>
                    <div className="relative flex-1">
                      <span className="absolute inset-y-0 left-3 flex items-center text-text-light text-sm pointer-events-none">Rs</span>
                      <input
                        type="number"
                        placeholder="Max"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="w-full pl-8 pr-3 py-2.5 bg-bg-alt border border-border rounded-xl focus:ring-2 focus:ring-accent outline-none text-sm shadow-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Grid (Right Side) */}
            <div className={`transition-all duration-500 w-full ${isSidebarOpen ? 'lg:w-3/4' : 'lg:w-full'}`}>
              {(productsLoading && page === 1) ? (
                <div className={`grid grid-cols-2 sm:grid-cols-2 gap-3 sm:gap-6 ${isSidebarOpen ? 'xl:grid-cols-3' : 'lg:grid-cols-3 xl:grid-cols-4'}`}>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <SkeletonCard key={i} />
                  ))}
                </div>
              ) : (products?.length || 0) === 0 ? (
                <div className="text-center py-20 bg-bg-card rounded-3xl border border-border shadow-sm flex flex-col items-center justify-center">
                  <SearchX className="w-16 h-16 mb-6 text-primary opacity-50 stroke-1" />
                  <h3 className="text-2xl font-bold text-text mb-2 font-heading">No products found</h3>
                  <p className="text-text-light text-lg max-w-sm mx-auto">
                    Try adjusting your search or filter to find what you're looking for.
                  </p>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setActiveCategory('All');
                      setMinPrice('');
                      setMaxPrice('');
                    }}
                    className="mt-6 bg-accent text-bg-card px-6 py-2.5 rounded-full font-bold hover:opacity-90 transition-all shadow-sm cursor-pointer"
                  >
                    Clear All Filters
                  </button>
                </div>
              ) : (
                <>
                  <div className={`grid grid-cols-2 sm:grid-cols-2 gap-3 sm:gap-6 ${isSidebarOpen ? 'xl:grid-cols-3' : 'lg:grid-cols-3 xl:grid-cols-4'}`}>
                    {products.map((product) => (
                      <div
                        key={product._id || product.id}
                        className="bg-bg-card rounded-xl sm:rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group flex flex-col h-full border border-border"
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
                            {product.colors.slice(0, 3).map((color) => (
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
                  {hasMore && (
                    <div className="mt-16 flex justify-center w-full">
                      <button
                        onClick={handleLoadMore}
                        disabled={isPaginating || productsLoading}
                        className="group relative overflow-hidden px-6 py-3 sm:px-10 sm:py-4 bg-transparent border-2 border-primary text-primary font-bold rounded-full hover:text-white transition-all duration-300 shadow-sm hover:shadow-primary/30 active:scale-95 disabled:opacity-70 disabled:active:scale-100"
                      >
                        <span className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0"></span>
                        <span className="relative z-10 flex items-center justify-center gap-2 tracking-wide uppercase text-xs sm:text-sm">
                          {isPaginating || (productsLoading && page > 1) ? (
                            <>
                              <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Loading...
                            </>
                          ) : (
                            "Load More Products"
                          )}
                        </span>
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* Full Screen Image Zoom Modal for Collection Hero */}
      {zoomedImage && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 lg:p-8"
          onClick={() => setZoomedImage(null)}
        >
          <button
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors bg-black/50 hover:bg-black/80 p-3 rounded-full shadow-lg z-50 cursor-pointer"
            onClick={(e) => { e.stopPropagation(); setZoomedImage(null); }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <img
            src={zoomedImage}
            alt="Zoomed Furniture"
            className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl animate-[fadeIn_0.3s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </PageTransition>
  );
}

export default CollectionPage;
