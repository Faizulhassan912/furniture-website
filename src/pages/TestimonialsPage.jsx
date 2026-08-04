import { useState } from 'react';
import SEO from '../components/SEO';
import PageTransition from '../components/layout/PageTransition';
import Testimonials from '../components/home/Testimonials';
import { ZoomIn, X } from 'lucide-react';

function TestimonialsPage() {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const openLightbox = (imgSrc) => {
    setSelectedImage(imgSrc);
    setIsLightboxOpen(true);
  };
  return (
    <PageTransition>
      <SEO title="Happy Customers" description="See what parents and kids say about our custom furniture." />
      
      {/* Aesthetic Header */}
      <section className="bg-bg py-16 lg:py-24 border-b border-border overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-bg-card border border-border shadow-sm mb-6 z-10">
            <span className="text-yellow-400 text-lg">★★★★★</span>
            <span className="text-text-light text-sm font-bold tracking-wider uppercase">Loved by 500+ Parents</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-text font-heading mb-6 max-w-4xl leading-tight z-10">
            Smiles We've Built, <br/>
            <span className="text-primary">Dreams We've Crafted</span>
          </h1>
          <p className="text-lg text-text-light max-w-2xl mb-16 z-10">
            Don't just take our word for it. Discover how our custom kids furniture has transformed rooms and brought joy to families across the country.
          </p>
          
          {/* Visual Banner Grid */}
          <div className="w-full grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-8 relative z-10 pb-12 md:pb-16 items-start max-w-lg md:max-w-none mx-auto">
             <div 
               className="col-span-2 md:col-span-1 rounded-3xl overflow-hidden border border-border shadow-sm md:translate-y-12 cursor-pointer group relative"
               onClick={() => openLightbox("/images/car-bed-1.jpg")}
             >
                <img src="/images/car-bed-1.jpg" alt="Happy Customer 1" className="w-full h-auto object-cover" />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                  <div className="bg-white/90 text-primary p-3 md:p-4 rounded-full transform scale-50 group-hover:scale-100 transition-transform duration-300 shadow-xl">
                    <ZoomIn className="w-6 h-6 md:w-8 md:h-8" />
                  </div>
                </div>
             </div>
             <div 
               className="col-span-1 rounded-3xl overflow-hidden border border-border shadow-md z-20 md:scale-105 cursor-pointer group relative"
               onClick={() => openLightbox("/images/single-bed-1.jpg")}
             >
                <img src="/images/single-bed-1.jpg" alt="Happy Customer 2" className="w-full h-auto object-cover" />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                  <div className="bg-white/90 text-primary p-3 md:p-4 rounded-full transform scale-50 group-hover:scale-100 transition-transform duration-300 shadow-xl">
                    <ZoomIn className="w-6 h-6 md:w-8 md:h-8" />
                  </div>
                </div>
             </div>
             <div 
               className="col-span-1 rounded-3xl overflow-hidden border border-border shadow-sm md:translate-y-12 cursor-pointer group relative"
               onClick={() => openLightbox("/images/almary-1.jpg")}
             >
                <img src="/images/almary-1.jpg" alt="Happy Customer 3" className="w-full h-auto object-cover" />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                  <div className="bg-white/90 text-primary p-3 md:p-4 rounded-full transform scale-50 group-hover:scale-100 transition-transform duration-300 shadow-xl">
                    <ZoomIn className="w-6 h-6 md:w-8 md:h-8" />
                  </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      <div className="-mt-16">
        <Testimonials />
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 animate-fade-in"
          onClick={() => setIsLightboxOpen(false)}
        >
          <button 
            className="absolute top-6 right-6 text-white hover:text-primary transition-colors cursor-pointer"
            onClick={() => setIsLightboxOpen(false)}
            aria-label="Close lightbox"
          >
            <X className="w-10 h-10" />
          </button>
          <div className="relative max-w-7xl max-h-[90vh] w-full flex justify-center">
            <img 
              src={selectedImage} 
              alt="Expanded view" 
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </PageTransition>
  );
}

export default TestimonialsPage;
