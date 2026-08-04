import { useParams, Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import Button from '../components/ui/Button';
import SEO from '../components/SEO';
import PageTransition from '../components/layout/PageTransition';
import { useCart } from '../context/CartContext';
import { useProducts } from '../hooks/useProducts';
import { useSettings } from '../context/SettingsContext';
import { MessageSquareOff, ZoomIn, X, Frown, CheckCircle2 } from 'lucide-react';
import OptimizedImage from '../components/ui/OptimizedImage';
import AlertModal from '../components/ui/AlertModal';

function ProductDetailPage() {
  const { slug } = useParams();
  const { products, loading } = useProducts();
  const product = products ? products.find((p) => p.slug === slug) : null;
  const [categories, setCategories] = useState([]);
  const { addToCart } = useCart();
  const { settings } = useSettings();
  
  const [alertModal, setAlertModal] = useState({ isOpen: false, title: '', message: '', type: 'info' });
  
  const whatsappNumber = settings?.settings?.whatsapp?.replace(/\D/g, '') || '923000000000';

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories');
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
        }
      } catch(e) {}
    };
    fetchCategories();
  }, []);

  const getPrefix = (name) => name?.split(' ').slice(0, 2).join(' ').toLowerCase();
  
  const sameCategoryProducts = products ? products.filter(p => 
    p.category === product?.category && 
    (p._id || p.id) !== (product?._id || product?.id) &&
    getPrefix(p.name) === getPrefix(product?.name)
  ) : [];
  
  // Gallery uses product's own images if multiple exist, otherwise fallback to strictly similar products
  let galleryImages = product?.images?.length > 1 
    ? product.images 
    : [
        ...(product?.image ? [product.image] : []),
        ...sameCategoryProducts.map(p => p.image).filter(Boolean)
      ].slice(0, 4); // Limit to 4 images max for gallery
  
  const [selectedImage, setSelectedImage] = useState(galleryImages[0] || product?.image);

  const sliderRef = useRef(null);

  const scrollSlider = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = sliderRef.current.clientWidth * 0.8;
      sliderRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  // Update selectedImage if galleryImages changes (e.g. data loaded)
  useEffect(() => {
    if (galleryImages.length > 0 && !galleryImages.includes(selectedImage)) {
      setSelectedImage(galleryImages[0]);
    }
  }, [product, products]);

  // Reviews State
  const [reviews, setReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ name: '', rating: 5, title: '', text: '' });
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: product.name,
          text: `Check out this amazing custom furniture: ${product.name}`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setAlertModal({ isOpen: true, title: 'Success', message: 'Link copied to clipboard!', type: 'success' });
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newReview.name || !newReview.text) return;
    
    try {
      const reviewPayload = {
        customer: newReview.name,
        product: product.name,
        rating: newReview.rating,
        comment: newReview.text,
        title: newReview.title || 'Review'
      };

      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewPayload)
      });
      
      if (res.ok) {
        setAlertModal({ isOpen: true, title: 'Thank you!', message: 'Your review has been submitted for approval.', type: 'success' });
        setShowReviewForm(false);
        setNewReview({ name: '', rating: 5, title: '', text: '' });
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  // Fetch approved reviews for this product
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch('/api/reviews?all=false');
        if (res.ok) {
          const data = await res.json();
          const reviewList = Array.isArray(data) ? data : (data.reviews || []);
          const productReviews = reviewList.filter(r => r.product === product?.name);
          setReviews(productReviews);
        }
      } catch (err) {
        console.error('Error fetching reviews:', err);
      }
    };
    if (product?.name) fetchReviews();
  }, [product?.name]);

  // Reset selected image when product changes (navigating between products)
  useEffect(() => {
    setSelectedImage(galleryImages[0]);
  }, [product?.slug]);

  // Auto-slide gallery images
  useEffect(() => {
    if (galleryImages.length <= 1) return;
    const intervalId = setInterval(() => {
      setSelectedImage((prevImage) => {
        const currentIndex = galleryImages.indexOf(prevImage);
        const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % galleryImages.length;
        return galleryImages[nextIndex];
      });
    }, 4000); // Change image every 4 seconds
    return () => clearInterval(intervalId);
  }, [galleryImages]);

  // Product not found state
  if (loading) {
    return (
      <section className="bg-bg py-32 flex justify-center items-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
      </section>
    );
  }

  if (!product) {
    return (
      <section className="bg-bg py-32">
        <div className="max-w-xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-4"><Frown className="w-16 h-16 text-text-light/50" /></div>
          <h1 className="text-3xl font-bold text-text font-heading">
            Product Not Found
          </h1>
          <p className="mt-4 text-text-light">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <div className="mt-6">
            <Button href="/collection" variant="primary">
              Back to Collection
            </Button>
          </div>
        </div>
      </section>
    );
  }

  const currentCategoryObj = categories.find(c => c.name === product?.category);
  const productParent = currentCategoryObj?.parent === 'None' || !currentCategoryObj?.parent ? currentCategoryObj?.name : currentCategoryObj?.parent;
  
  const relatedCategoryNames = categories
    .filter(c => c.name === productParent || c.parent === productParent)
    .map(c => c.name);

  const others = (products || []).filter(p => (p._id || p.id) !== (product?._id || product?.id));
  
  // They only want DIFFERENT subcategories, meaning same parent but DIFFERENT subcategory
  const sameParentDiffSub = others.filter(p => relatedCategoryNames.includes(p.category) && p.category !== product?.category);
  
  // Maximize variety by picking one from each subcategory first
  const uniqueSubCategories = [];
  const relatedList = [];
  
  for (const p of sameParentDiffSub) {
    if (!uniqueSubCategories.includes(p.category)) {
      uniqueSubCategories.push(p.category);
      relatedList.push(p);
    }
  }
  
  // Fill the rest up to 12 if we need more
  for (const p of sameParentDiffSub) {
    if (relatedList.length >= 12) break;
    if (!relatedList.some(r => (r._id || r.id) === (p._id || p.id))) {
      relatedList.push(p);
    }
  }

  // Fallback 1: If we have less than 4 related products, fill with products from the SAME subcategory
  if (relatedList.length < 4) {
    const sameParentSameSub = others.filter(p => relatedCategoryNames.includes(p.category) && !relatedList.some(r => (r._id || r.id) === (p._id || p.id)));
    for (const p of sameParentSameSub) {
      if (relatedList.length >= 12) break;
      relatedList.push(p);
    }
  }

  // Fallback 2: If STILL less than 4, fill with ANY other products in the store
  if (relatedList.length < 4) {
    for (const p of others) {
      if (relatedList.length >= 12) break;
      if (!relatedList.some(r => (r._id || r.id) === (p._id || p.id))) {
        relatedList.push(p);
      }
    }
  }

  return (
    <PageTransition>
      <SEO title={product.name} description={product.description} />
      <section className="bg-bg py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-text-light">
          <Link to="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <span className="mx-2 text-border">/</span>
          <Link
            to="/collection"
            className="hover:text-primary transition-colors"
          >
            Collection
          </Link>
          <span className="mx-2 text-border">/</span>
          <span className="text-text font-medium">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <button 
              onClick={() => {
                setIsLightboxOpen(true);
                setZoomedImage(selectedImage);
              }}
              className="w-full bg-bg-alt rounded-3xl aspect-[4/3] flex items-center justify-center overflow-hidden shadow-sm border border-border/50 relative group cursor-pointer"
              aria-label="View full size image"
            >
              <OptimizedImage 
                src={selectedImage} 
                alt={product.name} 
                className="w-full h-full object-contain cursor-pointer transition-transform duration-500 hover:scale-105"
                onClick={() => setZoomedImage(selectedImage)}
                width={800}
                loading="eager"
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                <div className="bg-white/90 text-primary p-4 rounded-full transform scale-50 group-hover:scale-100 transition-transform duration-300 shadow-xl">
                  <ZoomIn className="w-8 h-8" />
                </div>
              </div>
            </button>
            {/* Thumbnail Strip */}
            {galleryImages.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`bg-bg-alt rounded-2xl aspect-square flex items-center justify-center shadow-sm cursor-pointer border-2 transition-all duration-300 overflow-hidden ${
                      selectedImage === img ? 'border-primary shadow-md' : 'border-transparent hover:border-primary/50'
                    }`}
                  >
                    <OptimizedImage 
                      src={img} 
                      alt={`Gallery thumbnail ${idx + 1}`} 
                      className={`w-full h-full object-cover transition-opacity duration-300 ${
                        selectedImage === img ? 'opacity-100' : 'opacity-60 hover:opacity-100'
                      }`}
                      width={150}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <span className="text-sm font-semibold text-accent uppercase tracking-wider">
              {product.category}
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-text mt-2 font-heading">
              {product.name}
            </h1>
            
            {product.price > 0 && (
              <div className="mt-4 text-3xl font-bold text-primary font-heading">
                Rs {product.price.toLocaleString()}
              </div>
            )}

            <p className="mt-4 text-text-light leading-relaxed">
              {product.description}
            </p>


            {/* Specifications */}
            <div className="mt-6 md:mt-8 border-t border-border pt-5 md:pt-6">
              <h3 className="font-bold text-text text-base md:text-lg font-heading mb-3 md:mb-4">
                Specifications
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 text-sm">
                <div className="bg-bg-alt rounded-xl sm:rounded-2xl p-3.5 sm:p-4 border border-border/40">
                  <span className="text-text-light text-[10px] sm:text-xs uppercase tracking-wider block font-semibold">
                    Dimensions
                  </span>
                  <p className="font-semibold text-text mt-1 text-xs sm:text-sm break-words">
                    {product.dimensions?.length 
                      ? (product.dimensions?.height 
                          ? `${product.dimensions.length} Ft × ${product.dimensions.width} Ft × ${product.dimensions.height} Ft` 
                          : `${product.dimensions.length} Ft × ${product.dimensions.width} Ft`)
                      : 'Custom Dimensions Available'}
                  </p>
                </div>
                <div className="bg-bg-alt rounded-xl sm:rounded-2xl p-3.5 sm:p-4 border border-border/40">
                  <span className="text-text-light text-[10px] sm:text-xs uppercase tracking-wider block font-semibold">
                    Material
                  </span>
                  <p className="font-semibold text-text mt-1 text-xs sm:text-sm break-words">
                    {product.material || 'Lamination Board'}
                  </p>
                </div>
                <div className="bg-bg-alt rounded-xl sm:rounded-2xl p-3.5 sm:p-4 border border-border/40">
                  <span className="text-text-light text-[10px] sm:text-xs uppercase tracking-wider block font-semibold">
                    Finish
                  </span>
                  <p className="font-semibold text-text mt-1 text-xs sm:text-sm break-words">
                    {product.finish || 'Non-toxic Paint'}
                  </p>
                </div>
                <div className="bg-bg-alt rounded-xl sm:rounded-2xl p-3.5 sm:p-4 border border-border/40">
                  <span className="text-text-light text-[10px] sm:text-xs uppercase tracking-wider block font-semibold">
                    Age Group
                  </span>
                  <p className="font-semibold text-text mt-1 text-xs sm:text-sm break-words">
                    {product.ageGroup || 'Kids'}
                  </p>
                </div>
              </div>

              {/* Key Highlights / Features */}
              {product.features && product.features.length > 0 && (
                <div className="mt-5 sm:mt-6">
                  <span className="text-text-light text-[10px] sm:text-xs uppercase tracking-wider block mb-2.5 sm:mb-3 font-semibold">
                    Key Features & Highlights
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    {product.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start sm:items-center gap-2.5 bg-bg-alt/60 px-3 py-2.5 rounded-xl border border-border/40 transition-all hover:bg-bg-alt">
                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5 sm:mt-0" />
                        <span className="text-text font-medium text-xs sm:text-sm leading-tight">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row flex-wrap gap-4">
              <button
                onClick={() => addToCart({ ...product })}
                className="flex-1 w-full sm:w-auto sm:min-w-[200px] bg-primary text-white px-8 py-4 rounded-xl font-bold hover:bg-primary-dark transition-colors shadow-sm hover:shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>Add to Cart</span>
              </button>
              
              <a
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hi, I'm interested in ordering: ${product.name}\nLink: ${window.location.origin}/collection/${product.slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 w-full sm:w-auto sm:min-w-[200px] bg-accent text-text-on-accent px-8 py-4 rounded-xl font-bold hover:bg-accent-dark transition-colors shadow-sm hover:shadow-md text-center flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
                </svg>
                <span>Order Now</span>
              </a>
              <button
                onClick={handleShare}
                className="flex-1 sm:flex-none w-full sm:w-auto sm:min-w-[120px] bg-bg-card border-2 border-border text-text px-6 py-4 rounded-xl font-bold hover:bg-bg-alt hover:border-primary hover:text-primary transition-all text-center shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                title="Share this product"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-20 pt-16 border-t border-border">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <h2 className="text-2xl md:text-3xl font-bold text-text font-heading">Customer Reviews</h2>
            <button 
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="bg-primary text-white font-bold px-6 py-2.5 rounded-full hover:bg-primary-dark transition-colors shadow-sm cursor-pointer"
            >
              {showReviewForm ? 'Cancel Review' : 'Write a Review'}
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Form Column with Animation */}
            <div 
              className={`w-full lg:w-1/3 overflow-hidden transition-all duration-500 ease-in-out ${
                showReviewForm ? 'max-h-[800px] opacity-100 scale-100' : 'max-h-0 opacity-0 scale-95 lg:max-w-0'
              }`}
            >
              <div className="bg-bg-card p-6 rounded-2xl shadow-sm border border-border">
                <h3 className="text-xl font-bold text-text mb-4 font-heading">Write Your Review</h3>
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text mb-1.5">Your Name</label>
                    <input 
                      type="text" 
                      required
                      value={newReview.name}
                      onChange={(e) => setNewReview({...newReview, name: e.target.value})}
                      className="w-full px-4 py-2 text-sm bg-bg-alt border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-text placeholder:text-text/50"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text mb-1.5">Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewReview({...newReview, rating: star})}
                          className={`text-2xl transition-transform hover:scale-110 focus:outline-none ${
                            star <= newReview.rating ? 'text-accent drop-shadow-sm' : 'text-text-light/30'
                          }`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text mb-1.5">Review Title (Optional)</label>
                    <input 
                      type="text" 
                      value={newReview.title}
                      onChange={(e) => setNewReview({...newReview, title: e.target.value})}
                      className="w-full px-4 py-2 text-sm bg-bg-alt border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-text placeholder:text-text/50"
                      placeholder="E.g., Excellent quality!"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text mb-1.5">Your Review</label>
                    <textarea 
                      required
                      rows="4"
                      value={newReview.text}
                      onChange={(e) => setNewReview({...newReview, text: e.target.value})}
                      className="w-full px-4 py-2 text-sm bg-bg-alt border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-text placeholder:text-text/50 resize-none"
                      placeholder="Tell us what you think..."
                    ></textarea>
                  </div>
                  <div className="pt-2">
                    <button type="submit" className="w-full bg-primary text-white text-sm font-bold px-6 py-3 rounded-xl hover:bg-primary-light transition-colors cursor-pointer shadow-sm">
                      Submit Review
                    </button>
                    <p className="text-xs text-text-light mt-3 text-center">Your review will be submitted for approval.</p>
                  </div>
                </form>
              </div>
            </div>

            {/* Reviews List Column */}
            <div className={`w-full transition-all duration-500 ${showReviewForm ? 'lg:w-2/3' : 'lg:w-full'}`}>
              {reviews.length === 0 ? (
                <div className="bg-bg-alt/50 p-8 rounded-2xl border border-border text-center flex flex-col items-center justify-center">
                  <MessageSquareOff className="w-16 h-16 mb-4 text-primary opacity-50 stroke-1" />
                  <h4 className="font-bold text-text text-xl mb-2">No reviews yet</h4>
                  <p className="text-text-light mb-2">Be the first to share your experience with the {product.name}!</p>
                </div>
              ) : (
                <div className={`grid grid-cols-1 ${showReviewForm ? 'md:grid-cols-2' : 'md:grid-cols-2 lg:grid-cols-3'} gap-6`}>
                  {reviews.map((review) => (
                    <div key={review._id || review.id} className="bg-bg-card p-6 rounded-2xl border border-border shadow-sm flex flex-col hover:-translate-y-1 transition-transform">
                      <div className="flex text-accent mb-3 text-lg drop-shadow-sm">
                        {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                      </div>
                      <h4 className="font-bold text-text mb-2">{review.title || 'Review'}</h4>
                      <p className="text-text-light text-sm mb-4 leading-relaxed flex-1">
                        "{review.comment || review.text}"
                      </p>
                      <div className="flex items-center gap-3 mt-auto pt-4 border-t border-border">
                        <div className="w-10 h-10 rounded-full bg-bg-alt flex items-center justify-center text-text font-bold uppercase">
                          {(review.customer || review.name || 'U').charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-text">{review.customer || review.name}</p>
                          <p className="text-xs text-text-light opacity-80">Verified Buyer</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {products && products.filter(p => (p._id || p.id) !== (product?._id || product?.id)).length > 0 && (
          <div className="mt-20 pt-16 border-t border-border">
            <h2 className="text-2xl md:text-3xl font-bold text-text font-heading mb-8">You May Also Like</h2>
            
            <div className="relative group/slider">
              {/* Slider Navigation Arrows (Overlay) */}
              <button 
                onClick={() => scrollSlider('left')}
                className="absolute -left-4 sm:-left-6 top-1/2 -translate-y-1/2 z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-bg-card border-2 border-border shadow-lg flex items-center justify-center text-text hover:text-primary hover:border-primary transition-all duration-300 opacity-100 sm:opacity-0 sm:group-hover/slider:opacity-100 cursor-pointer"
                aria-label="Scroll left"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button 
                onClick={() => scrollSlider('right')}
                className="absolute -right-4 sm:-right-6 top-1/2 -translate-y-1/2 z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-bg-card border-2 border-border shadow-lg flex items-center justify-center text-text hover:text-primary hover:border-primary transition-all duration-300 opacity-100 sm:opacity-0 sm:group-hover/slider:opacity-100 cursor-pointer"
                aria-label="Scroll right"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <div 
                ref={sliderRef}
                className="flex overflow-x-auto gap-6 pb-8 pt-4 snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth"
              >
              {relatedList.map((related) => (
                <div
                  key={related._id || related.id}
                  className="flex-none w-[60vw] sm:w-[16rem] snap-center sm:snap-start bg-bg-card rounded-xl sm:rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group flex flex-col border border-border hover:-translate-y-1"
                >
                  <Link to={`/collection/${related.slug}`} className="shrink-0">
                    <div className="w-full aspect-[4/3] bg-bg-alt flex items-center justify-center overflow-hidden group-hover:opacity-90 transition-opacity">
                      <OptimizedImage
                        src={related.image}
                        alt={related.name}
                        className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal group-hover:scale-105 transition-transform duration-500"
                        width={400}
                      />
                    </div>
                  </Link>
                  <div className="p-2.5 sm:p-4 flex flex-col flex-1">
                    <span className="text-[11px] sm:text-xs font-semibold text-accent uppercase tracking-wider line-clamp-1">
                      {related.category}
                    </span>
                    <Link to={`/collection/${related.slug}`}>
                      <h3 className="font-bold text-text text-base sm:text-lg mt-0.5 sm:mt-1 hover:text-accent transition-colors line-clamp-2 leading-tight">
                        {related.name}
                      </h3>
                    </Link>

                    <div className="flex items-center justify-between gap-1.5 sm:gap-2 pt-2 sm:pt-4 border-t border-border mt-auto">
                      <Link
                        to={`/collection/${related.slug}`}
                        className="flex-1 bg-bg-alt text-text text-xs sm:text-sm font-bold py-2 sm:py-3 px-1 sm:px-4 rounded-lg sm:rounded-xl text-center hover:bg-accent hover:text-bg-card transition-colors shadow-sm border border-border whitespace-nowrap"
                      >
                        View Details
                      </Link>

                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          addToCart(related);
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
            </div>
          </div>
        )}
      </div>
    </section>
    
    {/* Full Screen Image Lightbox */}
    {isLightboxOpen && (
      <div 
        className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in duration-300"
        onClick={() => setIsLightboxOpen(false)}
      >
        <button 
          onClick={() => setIsLightboxOpen(false)}
          className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Close Lightbox"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div 
          className="w-full h-full max-w-7xl max-h-[90vh] p-4 sm:p-12 flex items-center justify-center"
          onClick={(e) => e.stopPropagation()} // prevent click from closing when clicking image
        >
          <OptimizedImage 
            src={zoomedImage} 
            alt="Zoomed Product" 
            className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl animate-[fadeIn_0.3s_ease-out]"
            onClick={(e) => e.stopPropagation()} 
            width={1200}
          />
        </div>
      </div>
    )}

    </PageTransition>
  );
}

export default ProductDetailPage;
