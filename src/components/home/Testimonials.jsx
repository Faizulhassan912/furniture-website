import { useState, useEffect } from 'react';

function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const getInitialLimit = () => window.innerWidth < 768 ? 3 : 6;
  const [limit, setLimit] = useState(getInitialLimit());

  useEffect(() => {
    const handleResize = () => setLimit(getInitialLimit());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchReviews = async (pageNum, currentReviews = []) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/reviews?page=${pageNum}&limit=${limit}`);
      if (res.ok) {
        const data = await res.json();
        if (pageNum === 1) {
          setTestimonials(data.reviews || []);
        } else {
          setTestimonials([...currentReviews, ...(data.reviews || [])]);
        }
        setTotalPages(data.totalPages || 1);
      }
    } catch (err) {
      console.error('Error fetching testimonials:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchReviews(1, []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limit]); // Re-fetch from page 1 if limit changes

  const handleLoadMore = () => {
    if (page < totalPages) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchReviews(nextPage, testimonials);
    }
  };

  if (testimonials.length === 0 && !loading) return null; // Don't show section if no reviews

  return (
    <section className="py-24 bg-bg-alt overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-bold text-text mb-4">Loved by Parents & Kids</h2>
          <p className="text-lg text-text-light">
            Don't just take our word for it. Here is what our happy customers have to say about their custom furniture.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div key={testimonial._id || testimonial.id} className="bg-bg-card p-6 sm:p-8 rounded-3xl shadow-sm border border-border/40 hover:shadow-lg transition-shadow duration-300 w-full">
              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-text-light mb-6 italic leading-relaxed">
                "{testimonial.comment || testimonial.text || testimonial.content}"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-xl uppercase">
                  {(testimonial.customer || testimonial.name || 'U').charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-text text-base">{testimonial.customer || testimonial.name}</h3>
                  <p className="text-sm text-text-light">{testimonial.product ? `Bought: ${testimonial.product}` : 'Verified Buyer'}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {page < totalPages && (
          <div className="mt-12 flex justify-center">
            <button 
              onClick={handleLoadMore}
              disabled={loading}
              className="px-8 py-3 bg-bg-card border-2 border-primary text-primary font-bold rounded-full hover:bg-primary hover:text-white transition-all duration-300 disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Load More Reviews'}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default Testimonials;
