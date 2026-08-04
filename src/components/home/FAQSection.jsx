import { useState, useEffect } from 'react';

const fallbackFaqs = [
  {
    question: "Do you hold stock or is everything made to order?",
    answer: "Everything is custom made-to-order! We do not hold stock. You can choose a design from our catalog or provide your own reference picture, and we will build it from scratch just for you."
  },
  {
    question: "How long does it take to deliver a custom order?",
    answer: "Typically, it takes 2 to 3 weeks to manufacture and deliver your custom furniture, depending on the complexity of the design and our current order volume."
  },
  {
    question: "Can I customize the colors and dimensions?",
    answer: "Absolutely! Since every piece is made to order, you have full control over the dimensions, colors, and materials. We will discuss these details with you before starting production."
  },
  {
    question: "Do you deliver out of city?",
    answer: "Yes, we offer delivery services. Delivery charges vary based on your location and the size of the order. Please contact us on WhatsApp with your location for an exact quote."
  }
];

function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);
  const [faqData, setFaqData] = useState({ faqs: fallbackFaqs, mainTitle: 'Frequently Asked Questions', mainSubtitle: 'Everything you need to know about our custom order process.' });

  useEffect(() => {
    const fetchFaq = async () => {
      try {
        const res = await fetch('/api/content/faq');
        if (res.ok) {
          const data = await res.json();
          if (data && data.faqs) setFaqData(data);
        }
      } catch (err) {
        console.error('Error fetching FAQs:', err);
      }
    };
    fetchFaq();
  }, []);

  return (
    <section className="py-24 bg-bg">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-text mb-4">{faqData.mainTitle}</h2>
          <p className="text-lg text-text-light">
            {faqData.mainSubtitle}
          </p>
        </div>

        <div className="space-y-4">
          {faqData.faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`border border-border/50 rounded-2xl overflow-hidden transition-colors duration-300 ${
                openIndex === index ? 'bg-bg-alt border-primary/30' : 'bg-bg-card hover:border-primary/30'
              }`}
            >
              <button
                className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none"
                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
              >
                <span className="font-bold text-text text-lg">{faq.question}</span>
                <span className={`text-primary transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`}>
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <p className="px-6 pb-6 text-text-light leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FAQSection;
