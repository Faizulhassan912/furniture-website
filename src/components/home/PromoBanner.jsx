import { Link } from 'react-router-dom';

function PromoBanner({ bannersData }) {
  if (bannersData === null) return null; // Prevent flash while loading
  // Use customBanner or fallback
  const customBanner = bannersData?.customBanner || {
    title: 'Premium Storage Collection',
    subtitle: 'Keep the playroom perfectly organized with our new range of spacious, safe, and beautifully designed wardrobes and toy chests.',
    buttonText: 'Explore Wardrobe',
    buttonLink: '/collection/storage',
    layout: 'text-left',
    bgImage: null
  };

  const bannerImage = customBanner.bgImage || '/images/almary-1.jpg';

  if (bannersData?.activeBuilder === 'pre-designed' && bannersData?.previewImage) {
    return (
      <section className="py-8 bg-bg px-4 sm:px-6 lg:px-8">
        <Link to="/collection" className="block max-w-7xl mx-auto rounded-[2.5rem] overflow-hidden shadow-lg group hover:shadow-xl transition-shadow border border-border/50">
          <img src={bannersData.previewImage} alt="Promo Banner" className="w-full h-auto object-cover transition-transform duration-1000 group-hover:scale-105" />
        </Link>
      </section>
    );
  }

  // Custom Builder Render
  return (
    <section className="py-8 bg-bg px-4 sm:px-6 lg:px-8">
      <Link to={customBanner.buttonLink || '/collection'} className="block max-w-7xl mx-auto rounded-3xl sm:rounded-[2.5rem] overflow-hidden bg-pink text-text-on-primary border border-border/50 shadow-lg group hover:shadow-xl transition-shadow relative min-h-[350px] sm:min-h-0 flex flex-col">
        
        {/* Mobile Background Image (hidden on desktop) */}
        <div className="absolute inset-0 z-0 md:hidden">
          <img src={bannerImage} alt="Background" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-pink/30 backdrop-blur-[1px] bg-gradient-to-t from-pink/70 to-transparent" />
        </div>

        <div className={`relative z-10 flex flex-col flex-1 ${customBanner.layout === 'text-right' ? 'md:flex-row-reverse' : customBanner.layout === 'text-center' ? 'md:flex-col text-center items-center' : 'md:flex-row'}`}>
          {/* Text Content */}
          <div className={`p-6 sm:p-10 md:p-12 w-full ${customBanner.layout === 'text-center' ? 'md:w-full max-w-2xl' : 'md:w-1/2 lg:w-5/12'} flex flex-col justify-center text-center md:text-left min-h-[400px] md:min-h-0`}>
            <div className="mb-3 sm:mb-4">
              <span className="inline-block px-3 py-1.5 sm:px-4 sm:py-1.5 bg-bg-card/30 text-text-on-primary text-xs sm:text-sm font-bold rounded-full uppercase tracking-wider shadow-sm backdrop-blur-sm">
                ✨ New Arrival
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-2 sm:mb-4 font-heading leading-tight drop-shadow-md md:drop-shadow-none">
              {customBanner.title}
            </h2>
            <p className="text-sm sm:text-base opacity-90 mb-6 sm:mb-8 max-w-lg leading-relaxed drop-shadow-md md:drop-shadow-none mx-auto md:mx-0">
              {customBanner.subtitle}
            </p>
            <div className="mt-2">
              <span 
                className="inline-flex items-center justify-center px-6 py-3 sm:px-8 sm:py-4 text-sm sm:text-base bg-bg-card text-text rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl group-hover:-translate-y-1 w-full sm:w-auto"
              >
                {customBanner.buttonText}
              </span>
            </div>
          </div>

          {/* Image Content (Desktop only) */}
          {customBanner.layout !== 'text-center' && (
            <div className="hidden md:flex w-full md:w-1/2 lg:w-7/12 shrink-0 relative items-center justify-center overflow-hidden">
              <img 
                src={bannerImage} 
                alt="Promo Banner" 
                className="w-full h-full object-contain transition-transform duration-1000 group-hover:scale-105"
              />
            </div>
          )}
        </div>
      </Link>
    </section>
  );
}

export default PromoBanner;
