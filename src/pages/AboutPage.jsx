import { useState, useEffect } from 'react';
import SectionHeading from '../components/ui/SectionHeading';
import Button from '../components/ui/Button';
import SEO from '../components/SEO';
import PageTransition from '../components/layout/PageTransition';
import { ShieldCheck, Gem, Palette, Hammer, Home, X, ZoomIn } from 'lucide-react';

function AboutPage() {
  const [aboutData, setAboutData] = useState(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const openLightbox = (imgSrc) => {
    setSelectedImage(imgSrc);
    setIsLightboxOpen(true);
  };

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await fetch('/api/content/about');
        if (res.ok) {
          const data = await res.json();
          setAboutData(data);
        }
      } catch (err) {
        console.error('Error fetching about data:', err);
      }
    };
    fetchAbout();
  }, []);

  return (
    <PageTransition>
      <SEO title="About Us" description="Learn about S&S Kids Furniture and our mission to create magical, safe spaces." />
      
      {/* Innovative Split Header */}
      <section className="bg-bg py-16 lg:py-24 overflow-hidden border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20 min-h-[60vh]">
            {/* Left Content */}
            <div className="w-full lg:w-1/2 text-center lg:text-left z-10">
              <span className="inline-block px-5 py-2 rounded-full bg-[var(--color-purple)] text-white text-sm font-bold tracking-wider uppercase mb-6 shadow-sm border border-transparent">
                Our Story
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-text font-heading mb-6 drop-shadow-sm leading-tight">
                {aboutData?.title || (
                  <>Crafting <span className="text-primary relative inline-block">Joy<svg className="absolute w-full h-3 -bottom-1 left-0 text-accent/30" viewBox="0 0 100 20" preserveAspectRatio="none"><path d="M0 20 Q 50 0 100 20" fill="currentColor"/></svg></span> For <br/>Little Dreamers</>
                )}
              </h1>
              <p className="text-lg md:text-xl text-text-light leading-relaxed mb-10 max-w-xl mx-auto lg:mx-0">
                {aboutData?.subtitle || "We believe every child deserves a space that sparks joy, creativity, and comfort. Discover the passion behind our custom kids furniture."}
              </p>
              
              <div className="flex items-center justify-center lg:justify-start gap-8 mt-8 border-t border-border/50 pt-8">
                <div className="flex flex-col items-center lg:items-start gap-1">
                  <span className="text-3xl lg:text-4xl font-black text-primary font-heading tracking-tight">1000+</span>
                  <span className="text-sm font-medium text-text-light uppercase tracking-wider">Happy Kids</span>
                </div>
                <div className="w-px h-12 bg-border"></div>
                <div className="flex flex-col items-center lg:items-start gap-1">
                  <span className="text-3xl lg:text-4xl font-black text-accent font-heading tracking-tight">100%</span>
                  <span className="text-sm font-medium text-text-light uppercase tracking-wider">Safe Materials</span>
                </div>
              </div>
            </div>
            
            {/* Right Content - Desktop Overlapping Image Gallery */}
            <div className="hidden lg:flex w-full lg:w-1/2 relative h-[500px] xl:h-[600px] items-center justify-center">
              <div className="absolute top-10 right-0 w-72 h-72 bg-accent/20 rounded-full blur-3xl -z-10"></div>
              <div className="absolute bottom-0 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl -z-10"></div>
              
              <div className="relative w-full max-w-lg xl:max-w-xl h-full mx-auto">
                {/* Image 1 (Back left) */}
                <div 
                  className="absolute top-4 left-0 w-[65%] aspect-[4/5] rounded-3xl overflow-hidden border-[6px] border-bg-card shadow-xl transform -rotate-6 hover:rotate-0 hover:z-30 transition-all duration-500 origin-bottom-left group cursor-pointer bg-bg-alt"
                  onClick={() => openLightbox(aboutData?.image1 || "/images/bunk-bed-1.jpg")}
                >
                  <img src={aboutData?.image1 || "/images/bunk-bed-1.jpg"} alt="Kids Room" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                    <div className="bg-white/90 text-primary p-4 rounded-full transform scale-50 group-hover:scale-100 transition-transform duration-300 shadow-xl">
                      <ZoomIn className="w-8 h-8" />
                    </div>
                  </div>
                </div>
                {/* Image 2 (Front right) */}
                <div 
                  className="absolute top-24 right-0 w-[65%] aspect-[4/5] rounded-3xl overflow-hidden border-[6px] border-bg-card shadow-xl transform rotate-3 hover:rotate-0 hover:z-30 transition-all duration-500 origin-bottom-right z-10 group cursor-pointer bg-bg-alt"
                  onClick={() => openLightbox(aboutData?.image2 || "/images/single-bed-2.jpg")}
                >
                  <img src={aboutData?.image2 || "/images/single-bed-2.jpg"} alt="Crafting" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                    <div className="bg-white/90 text-primary p-4 rounded-full transform scale-50 group-hover:scale-100 transition-transform duration-300 shadow-xl">
                      <ZoomIn className="w-8 h-8" />
                    </div>
                  </div>
                </div>
                {/* Optional Image 3 */}
                {aboutData?.image3 && (
                  <div 
                    className="absolute bottom-4 left-[20%] w-[55%] aspect-[4/5] rounded-3xl overflow-hidden border-[6px] border-bg-card shadow-xl transform rotate-8 hover:rotate-0 hover:z-40 transition-all duration-500 origin-bottom-right z-20 group cursor-pointer bg-bg-alt"
                    onClick={() => openLightbox(aboutData.image3)}
                  >
                    <img src={aboutData.image3} alt="Workshop" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                      <div className="bg-white/90 text-primary p-4 rounded-full transform scale-50 group-hover:scale-100 transition-transform duration-300 shadow-xl">
                        <ZoomIn className="w-8 h-8" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Content - Mobile Staggered Grid */}
            <div className="lg:hidden w-full flex flex-col gap-4 mt-8 relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/20 rounded-full blur-3xl -z-10"></div>
              
              <div 
                className="w-full h-64 sm:h-80 rounded-3xl overflow-hidden shadow-lg border-4 border-bg-card bg-bg-alt cursor-pointer relative group"
                onClick={() => openLightbox(aboutData?.image1 || "/images/bunk-bed-1.jpg")}
              >
                <img src={aboutData?.image1 || "/images/bunk-bed-1.jpg"} alt="Kids Room" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                  <div className="bg-white/90 text-primary p-3 rounded-full transform scale-50 group-hover:scale-100 transition-transform duration-300 shadow-xl">
                    <ZoomIn className="w-6 h-6" />
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4 h-48 sm:h-60">
                <div 
                  className={`${aboutData?.image3 ? 'w-1/2' : 'w-full'} rounded-3xl overflow-hidden shadow-lg border-4 border-bg-card bg-bg-alt cursor-pointer relative group`}
                  onClick={() => openLightbox(aboutData?.image2 || "/images/single-bed-2.jpg")}
                >
                  <img src={aboutData?.image2 || "/images/single-bed-2.jpg"} alt="Crafting" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                    <div className="bg-white/90 text-primary p-3 rounded-full transform scale-50 group-hover:scale-100 transition-transform duration-300 shadow-xl">
                      <ZoomIn className="w-6 h-6" />
                    </div>
                  </div>
                </div>
                {aboutData?.image3 && (
                  <div 
                    className="w-1/2 rounded-3xl overflow-hidden shadow-lg border-4 border-bg-card bg-bg-alt cursor-pointer relative group"
                    onClick={() => openLightbox(aboutData.image3)}
                  >
                    <img src={aboutData.image3} alt="Workshop" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                      <div className="bg-white/90 text-primary p-3 rounded-full transform scale-50 group-hover:scale-100 transition-transform duration-300 shadow-xl">
                        <ZoomIn className="w-6 h-6" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

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

      {/* Our Story */}
      <section className="bg-bg py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-text font-heading mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-text-light leading-relaxed whitespace-pre-line">
                {aboutData?.story || (
                  <>
                    <p>
                      S&S Kids was born from a simple idea: children's furniture
                      should be as imaginative as the kids who use it. We saw a gap
                      in the market — parents wanted unique, safe, and beautiful
                      furniture but couldn't find it off the shelf.
                    </p>
                    <p>
                      Every piece we create is custom-built with premium materials,
                      non-toxic finishes, and designs that grow with your child. We
                      don't hold stock — every item is made to order, ensuring you
                      get exactly what your family needs.
                    </p>
                    <p>
                      From dreamy castle beds to creative study desks, each creation
                      starts with your vision. Our team of skilled craftsmen brings
                      it to life with precision and love.
                    </p>
                  </>
                )}
              </div>
            </div>
            <div className="bg-bg-card rounded-2xl h-64 lg:h-80 flex items-center justify-center shadow-sm border border-border/50 overflow-hidden">
              {aboutData?.image3 ? (
                <img src={aboutData.image3} alt="Our Workshop" className="w-full h-full object-cover" />
              ) : (
                <Home className="w-24 h-24 text-text-light opacity-20" />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="bg-bg-alt py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading title="What We Stand For" />
          <div className="flex overflow-x-auto gap-6 md:grid md:grid-cols-3 pb-8 pt-4 snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden -mx-4 px-4 sm:mx-0 sm:px-0">
            {[
              {
                icon: <ShieldCheck className="w-12 h-12 text-primary mx-auto" />,
                title: 'Safety First',
                desc: 'Non-toxic paints, rounded edges, and child-safe materials in every single piece we build.',
              },
              {
                icon: <Gem className="w-12 h-12 text-primary mx-auto" />,
                title: 'Premium Quality',
                desc: 'Handcrafted with the finest materials to last through years of play, growth, and imagination.',
              },
              {
                icon: <Palette className="w-12 h-12 text-primary mx-auto" />,
                title: 'Custom Designs',
                desc: "Your vision, our craftsmanship. We build exactly what you imagine — no compromises.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="flex-none w-[80vw] sm:w-[60vw] md:w-auto snap-center bg-bg-card rounded-2xl p-8 text-center shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 border border-border"
              >
                <div className="mb-6">{item.icon}</div>
                <h3 className="text-xl font-bold text-text mb-3 font-heading">
                  {item.title}
                </h3>
                <p className="text-text-light">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Custom */}
      <section className="bg-bg py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="bg-bg-card rounded-2xl h-64 lg:h-72 flex items-center justify-center shadow-sm border border-border/50 order-2 lg:order-1">
              <Hammer className="w-24 h-24 text-text-light opacity-20" />
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl font-bold text-text font-heading mb-6">
                Why Custom?
              </h2>
              <div className="space-y-4">
                {[
                  {
                    title: 'Perfect Fit',
                    desc: 'Furniture sized exactly for your room, not one-size-fits-all.',
                  },
                  {
                    title: 'Your Design',
                    desc: 'Choose colors, materials, and even add your child\'s name engraving.',
                  },
                  {
                    title: 'Built to Last',
                    desc: 'Solid construction that withstands years of active play.',
                  },
                  {
                    title: 'Direct from Maker',
                    desc: 'No middlemen. You work directly with the people who build it.',
                  },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-primary" />
                    </span>
                    <div>
                      <h4 className="font-semibold text-text">{item.title}</h4>
                      <p className="text-text-light text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-text-on-primary font-heading">
            Ready to Create Something Special?
          </h2>
          <p className="mt-4 text-text-on-primary/80">
            Let's design the perfect furniture for your little one.
          </p>
          <div className="mt-8">
            <Button href="/contact" variant="secondary" size="lg">
              Start Your Custom Order
            </Button>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}

export default AboutPage;
