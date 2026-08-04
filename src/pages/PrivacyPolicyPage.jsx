import { useState, useEffect } from 'react';
import SEO from '../components/SEO';
import PageTransition from '../components/layout/PageTransition';

function PrivacyPolicyPage() {
  const [privacyData, setPrivacyData] = useState(null);

  useEffect(() => {
    const fetchPrivacy = async () => {
      try {
        const res = await fetch('/api/content/privacy');
        if (res.ok) {
          const data = await res.json();
          setPrivacyData(data);
        }
      } catch (err) {
        console.error('Error fetching privacy content:', err);
      }
    };
    fetchPrivacy();
  }, []);

  return (
    <PageTransition>
      <SEO title="Privacy Policy" description="Our privacy policy and data practices." />
      
      {/* Visual Header */}
      <section className="relative py-24 border-b border-border">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0 overflow-hidden">
           <img src="/images/bunk-bed-2.jpg" alt="Background" className="w-full h-full object-cover opacity-80" />
           <div className="absolute inset-0 bg-bg/90 backdrop-blur-sm"></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="inline-block px-4 py-1.5 bg-bg-card rounded-full text-primary font-bold tracking-widest uppercase text-xs mb-4 shadow-sm border border-border">
            {privacyData?.badge || 'Legal Info'}
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-text font-heading mb-4">
            {privacyData?.title || 'Privacy Policy'}
          </h1>
          <p className="text-text-light text-base">
            {privacyData?.subtitle || `Last updated: ${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-bg">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          <div className="bg-bg-card p-8 md:p-12 rounded-3xl border border-border shadow-sm prose prose-sm sm:prose-base prose-p:text-text-light prose-headings:text-text prose-a:text-primary max-w-none">
            {privacyData?.content ? (
              <div dangerouslySetInnerHTML={{ __html: privacyData.content }} />
            ) : (
              <>
                <h2 className="text-2xl font-bold text-text mt-2 mb-4">1. Information We Collect</h2>
                <p className="text-text-light leading-relaxed mb-8">
                  We collect information that you provide directly to us when you request a custom quote, place an order, or contact us for support. This may include your name, email address, phone number, delivery address, and any specific details you share about your furniture requirements.
                </p>
                
                <h2 className="text-2xl font-bold text-text mt-8 mb-4">2. How We Use Your Information</h2>
                <p className="text-text-light leading-relaxed mb-8">
                  We use the information we collect to fulfill your orders, communicate with you about your custom designs, provide customer support, and improve our services. We do not sell or rent your personal information to third parties.
                </p>
                
                <h2 className="text-2xl font-bold text-text mt-8 mb-4">3. Data Security</h2>
                <p className="text-text-light leading-relaxed mb-8">
                  We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access. However, no security system is impenetrable, and we cannot guarantee the security of our databases.
                </p>
                
                <h2 className="text-2xl font-bold text-text mt-8 mb-4">4. Contact Us</h2>
                <p className="text-text-light leading-relaxed mb-2">
                  If you have any questions about this Privacy Policy, please contact us at <strong className="text-text">info@sskids.com</strong> or via WhatsApp at <strong className="text-text">+92 300 1234567</strong>.
                </p>
              </>
            )}
          </div>
        </div>
      </section>
    </PageTransition>
  );
}

export default PrivacyPolicyPage;
