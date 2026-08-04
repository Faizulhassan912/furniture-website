import { useState } from 'react';
import SEO from '../components/SEO';
import PageTransition from '../components/layout/PageTransition';
import FAQSection from '../components/home/FAQSection';
import { ZoomIn, X } from 'lucide-react';

function FAQPage() {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const openLightbox = (imgSrc) => {
    setSelectedImage(imgSrc);
    setIsLightboxOpen(true);
  };
  return (
    <PageTransition>
      <SEO title="FAQs" description="Frequently Asked Questions about our custom furniture." />
      
      {/* Aesthetic Header */}
      <section className="bg-bg py-16 lg:py-24 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="w-full lg:w-1/2 text-center lg:text-left z-10">
              <span className="inline-block px-4 py-1.5 rounded-full bg-bg-alt text-text-light text-sm font-bold tracking-widest uppercase mb-6 shadow-sm border border-border">
                Help Center
              </span>
              <h1 className="text-5xl md:text-6xl font-extrabold text-text font-heading mb-6">
                Got Questions? <br className="hidden sm:block"/> We've Got <span className="text-primary">Answers</span>
              </h1>
              <p className="text-lg text-text-light max-w-lg mx-auto lg:mx-0">
                Everything you need to know about our custom furniture, from ordering to delivery.
              </p>
            </div>
            
            {/* Right side image */}
            <div className="w-full lg:w-1/2 relative mt-8 lg:mt-0">
              <div className="absolute inset-0 bg-primary/20 rounded-3xl blur-3xl -z-10 translate-x-4 translate-y-4"></div>
              <div 
                className="rounded-3xl overflow-hidden border border-border shadow-sm group cursor-pointer relative"
                onClick={() => openLightbox("/images/bunk-bed-1.jpg")}
              >
                <img src="/images/bunk-bed-1.jpg" alt="Kids Furniture FAQ" className="w-full h-auto object-cover" />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                  <div className="bg-white/90 text-primary p-4 rounded-full transform scale-50 group-hover:scale-100 transition-transform duration-300 shadow-xl">
                    <ZoomIn className="w-8 h-8" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="-mt-12">
        <FAQSection />
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

export default FAQPage;
