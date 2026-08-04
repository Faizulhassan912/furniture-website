import { useState, useEffect } from 'react';
import SEO from '../components/SEO';
import PageTransition from '../components/layout/PageTransition';

function TermsAndConditionsPage() {
  const [termsData, setTermsData] = useState(null);

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const res = await fetch('/api/content/terms');
        if (res.ok) {
          const data = await res.json();
          setTermsData(data);
        }
      } catch (err) {
        console.error('Error fetching terms content:', err);
      }
    };
    fetchTerms();
  }, []);

  return (
    <PageTransition>
      <SEO title="Terms & Conditions" description="Our terms and conditions for custom furniture orders." />
      
      {/* Visual Header */}
      <section className="relative py-24 border-b border-border">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0 overflow-hidden">
           <img src="/images/single-bed-1.jpg" alt="Background" className="w-full h-full object-cover opacity-80" />
           <div className="absolute inset-0 bg-bg/90 backdrop-blur-sm"></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="inline-block px-4 py-1.5 bg-bg-card rounded-full text-primary font-bold tracking-widest uppercase text-xs mb-4 shadow-sm border border-border">
            {termsData?.badge || 'Legal Info'}
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-text font-heading mb-4">
            {termsData?.title || 'Terms & Conditions'}
          </h1>
          <p className="text-text-light text-base">
            {termsData?.subtitle || `Last updated: ${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-bg">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          <div className="bg-bg-card p-8 md:p-12 rounded-3xl border border-border shadow-sm prose prose-sm sm:prose-base prose-p:text-text-light prose-headings:text-text prose-a:text-primary max-w-none">
            {termsData?.content ? (
              <div dangerouslySetInnerHTML={{ __html: termsData.content }} />
            ) : (
              <>
                <h2 className="text-2xl font-bold text-text mt-2 mb-4">1. Custom Orders</h2>
                <p className="text-text-light leading-relaxed mb-8">
                  All our furniture is custom-made to order. Once a design, dimensions, and materials are agreed upon, we require a 50% advance payment to begin production. The remaining 50% is due upon delivery or before dispatch for out-of-city orders.
                </p>
                
                <h2 className="text-2xl font-bold text-text mt-8 mb-4">2. Modifications and Cancellations</h2>
                <p className="text-text-light leading-relaxed mb-8">
                  Because items are custom-built to your specifications, modifications can only be requested within 48 hours of placing the order. After this period, changes may incur additional costs. Orders cannot be canceled once production has started.
                </p>
                
                <h2 className="text-2xl font-bold text-text mt-8 mb-4">3. Delivery and Installation</h2>
                <p className="text-text-light leading-relaxed mb-8">
                  Delivery times are estimated and may vary based on order complexity and volume. We offer delivery and installation services within Lahore. For other cities, items are dispatched via reliable courier services, and the customer is responsible for assembly.
                </p>
                
                <h2 className="text-2xl font-bold text-text mt-8 mb-4">4. Warranty and Returns</h2>
                <p className="text-text-light leading-relaxed mb-8">
                  We take pride in our craftsmanship. If there is a manufacturing defect, please contact us within 3 days of delivery. As all items are custom-made, we do not accept returns or offer refunds for change of mind.
                </p>
                
                <h2 className="text-2xl font-bold text-text mt-8 mb-4">5. Contact Us</h2>
                <p className="text-text-light leading-relaxed mb-2">
                  For any queries regarding these terms, please reach out to us at <strong className="text-text">info@sskids.com</strong> or via WhatsApp at <strong className="text-text">+92 300 1234567</strong>.
                </p>
              </>
            )}
          </div>
        </div>
      </section>
    </PageTransition>
  );
}

export default TermsAndConditionsPage;
