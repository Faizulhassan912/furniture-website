import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import SectionHeading from '../components/ui/SectionHeading';
import Button from '../components/ui/Button';
import SEO from '../components/SEO';
import PageTransition from '../components/layout/PageTransition';
import { useSettings } from '../context/SettingsContext';
import { Hand, Paperclip, Phone, MessageCircle, Mail, ClipboardList } from 'lucide-react';
import AlertModal from '../components/ui/AlertModal';

function ContactPage() {
  const [searchParams] = useSearchParams();
  const prefilledProduct = searchParams.get('product') || '';
  const [formData, setFormData] = useState({
    name: '', phone: '', city: '', length: '', width: '', height: '',
    color: '', material: '', childName: '', notes: ''
  });
  const [alertModal, setAlertModal] = useState({ isOpen: false, title: '', message: '', type: 'info' });
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const handleNextStep = () => {
    if (currentStep === 1 && (!formData.name || !formData.phone || !formData.city)) {
      setAlertModal({ isOpen: true, title: 'Missing Info', message: 'Please fill in your Name, Phone, and City.', type: 'error' });
      return;
    }
    setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  };

  const handlePrevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { settings } = useSettings();
  
  const siteSettings = settings?.settings || {};
  const whatsappNumber = siteSettings.whatsapp || '+92 300 1234567';
  const emailAddress = siteSettings.email || 'info@sskids.com';
  const phoneNumber = siteSettings.phone || whatsappNumber;

  const [contactData, setContactData] = useState(null);

  useEffect(() => {
    const fetchContactData = async () => {
      try {
        const res = await fetch('/api/content/contact');
        if (res.ok) {
          const data = await res.json();
          setContactData(data);
        }
      } catch (err) {
        console.error('Error fetching contact content:', err);
      }
    };
    fetchContactData();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.city) {
      setAlertModal({ isOpen: true, title: 'Missing Info', message: 'Please fill in your Name, Phone, and City.', type: 'error' });
      setCurrentStep(1);
      return;
    }
    setIsSubmitting(true);
    
    try {
      let fullMessage = `City: ${formData.city}\n`;
      if (prefilledProduct) fullMessage += `Inquiring about: ${prefilledProduct}\n`;
      if (formData.length || formData.width || formData.height) {
        fullMessage += `Dimensions: ${formData.length}L x ${formData.width}W x ${formData.height}H\n`;
      }
      if (formData.color) fullMessage += `Color: ${formData.color}\n`;
      if (formData.material) fullMessage += `Material: ${formData.material}\n`;
      if (formData.childName) fullMessage += `Child's Name: ${formData.childName}\n`;
      if (formData.notes) fullMessage += `Notes: ${formData.notes}\n`;

      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          subject: prefilledProduct ? `Order Inquiry: ${prefilledProduct}` : 'Custom Order Inquiry',
          message: fullMessage
        })
      });

      if (res.ok) {
        setIsSubmitted(true);
        setFormData({ name: '', phone: '', city: '', length: '', width: '', height: '', color: '', material: '', childName: '', notes: '' });
        setTimeout(() => setIsSubmitted(false), 5000);
      } else {
        setAlertModal({ isOpen: true, title: 'Error', message: 'Failed to send message, please try again.', type: 'error' });
      }
    } catch (error) {
      console.error(error);
      setAlertModal({ isOpen: true, title: 'Error', message: 'An error occurred. Please contact us via WhatsApp directly.', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses =
    'w-full px-4 py-3 rounded-xl border border-border bg-bg text-text placeholder:text-text-light/50 focus:border-border-focus focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-200';

  return (
    <PageTransition>
      <SEO title="Contact Us" description="Get in touch to order your custom kids furniture." />
      {/* Innovative Split Header */}
      <section className="bg-bg py-16 lg:py-24 border-b border-border overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            {/* Left Content */}
            <div className="w-full lg:w-1/2 text-center lg:text-left z-10">
              <span className="inline-block px-5 py-2 rounded-full bg-primary/10 text-primary text-sm font-bold tracking-wider uppercase mb-6 shadow-sm border border-transparent">
                {contactData?.heroBadge || 'Get In Touch'}
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-text font-heading mb-6 drop-shadow-sm leading-tight">
                {contactData?.heroTitle || "Let's Build Something"} <br/>
                <span className="text-accent">{contactData?.heroAccent || 'Amazing'}</span>
              </h1>
              <p className="text-lg text-text-light leading-relaxed max-w-lg mx-auto lg:mx-0">
                {contactData?.heroSubtitle || "Tell us about your dream furniture. Fill in the details below and our expert designers will get back to you within 24 hours."}
              </p>
            </div>
            
            {/* Right Content - Floating Glass Card */}
            <div className="w-full lg:w-1/2 relative flex justify-center lg:justify-end">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-accent/20 rounded-full blur-3xl -z-10"></div>
              
              <div className="bg-bg-card/80 backdrop-blur-xl border border-border/50 rounded-3xl p-8 shadow-xl w-full max-w-md transform hover:-translate-y-2 transition-transform duration-500">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Hand className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-text text-xl">{contactData?.floatingTitle || "We're Online!"}</h3>
                    <p className="text-text-light text-sm">{contactData?.floatingTime || "Response time: ~15 mins"}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-text">
                    <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                    <span className="font-medium">{phoneNumber}</span>
                  </div>
                  <div className="flex items-center gap-3 text-text">
                    <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    <span className="font-medium">{emailAddress}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="bg-bg py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-bg-card rounded-3xl shadow-sm border border-border/50 p-8 md:p-12">
            {isSubmitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                <div className="w-20 h-20 bg-primary/20 text-primary rounded-full flex items-center justify-center mb-4">
                  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-3xl font-bold text-text">Request Sent!</h3>
                <p className="text-text-light text-lg">
                  Thank you for reaching out. We will get back to you shortly via WhatsApp or email.
                </p>
                <button 
                  className="mt-6 border-2 border-primary text-primary px-8 py-3 rounded-full font-bold hover:bg-primary/5 transition-colors"
                  onClick={() => setIsSubmitted(false)}
                >
                  Submit Another Request
                </button>
              </div>
            ) : (
              <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                {/* Progress Bar with Glowing Edges */}
                <div className="relative mb-16 max-w-md mx-auto px-2">
                  {/* Background Edge */}
                  <div className="absolute top-1/2 left-8 right-8 h-1.5 bg-border/60 -translate-y-1/2 rounded-full z-0"></div>
                  
                  {/* Glowing Light passing through edge */}
                  <div className="absolute top-1/2 left-8 h-1.5 bg-primary -translate-y-1/2 transition-all duration-1000 ease-in-out rounded-full z-0 shadow-[0_0_20px_var(--theme-primary)]" style={{ width: `calc(${(currentStep - 1) * 50}% - ${currentStep === 1 ? 0 : 32}px)` }}></div>
                  
                  <div className="flex items-center justify-between relative z-10">
                    {[1, 2, 3].map(step => (
                      <div key={step} className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-xl transition-all duration-500 shadow-xl border-4 ${currentStep === step ? 'bg-primary text-white scale-125 border-primary shadow-[0_0_20px_var(--theme-primary)]' : currentStep > step ? 'bg-primary text-white border-primary scale-100' : 'bg-bg-card border-border text-text-light scale-100'}`}>
                        {currentStep > step ? (
                          <svg className="w-8 h-8 animate-fade-in text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                        ) : (
                          step
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* ===== SECTION 1: Contact Info ===== */}
                <div className={`transition-all duration-500 ${currentStep === 1 ? 'block animate-fade-in' : 'hidden'}`}>
                  <h3 className="text-2xl font-bold text-text font-heading mb-6 text-center">Your Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text mb-1.5">
                      Full Name <span className="text-accent">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={inputClasses}
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text mb-1.5">
                      Contact Number <span className="text-accent">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={inputClasses}
                      placeholder="+92 300 1234567"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-text mb-1.5">
                    Delivery City <span className="text-accent">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className={inputClasses}
                    placeholder="e.g. Lahore, Karachi, Islamabad"
                  />
                </div>
                </div>

                {/* ===== SECTION 2: Furniture Details ===== */}
                <div className={`transition-all duration-500 ${currentStep === 2 ? 'block animate-fade-in' : 'hidden'}`}>
                  <h3 className="text-2xl font-bold text-text font-heading mb-6 text-center">Furniture Details</h3>

                {/* Pre-filled product notice */}
                {prefilledProduct && (
                  <div className="mb-5 p-4 bg-accent-light rounded-xl border border-accent/20">
                    <p className="text-sm text-text">
                      <ClipboardList className="inline-block w-4 h-4 mr-1 text-accent -mt-0.5" /> Inquiring about:{' '}
                      <span className="font-bold">{prefilledProduct}</span>
                    </p>
                  </div>
                )}

                {/* Dimensions */}
                <label className="block text-sm font-medium text-text mb-1.5">
                  Dimensions (inches)
                </label>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <input
                      type="number"
                      name="length"
                      value={formData.length}
                      onChange={handleInputChange}
                      className={inputClasses}
                      placeholder="Length"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      name="width"
                      value={formData.width}
                      onChange={handleInputChange}
                      className={inputClasses}
                      placeholder="Width"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      name="height"
                      value={formData.height}
                      onChange={handleInputChange}
                      className={inputClasses}
                      placeholder="Height"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text mb-1.5">
                      Color Choice
                    </label>
                    <input
                      type="text"
                      name="color"
                      value={formData.color}
                      onChange={handleInputChange}
                      className={inputClasses}
                      placeholder="e.g. White, Sky Blue, Natural Wood"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text mb-1.5">
                      Wood / Material Type
                    </label>
                    <select 
                      name="material"
                      value={formData.material}
                      onChange={handleInputChange}
                      className={inputClasses}
                    >
                      <option value="">Select material</option>
                      <option value="pine">Pine Wood</option>
                      <option value="oak">Oak Wood</option>
                      <option value="birch">Birch Plywood</option>
                      <option value="mdf">MDF Board</option>
                      <option value="plywood">Plywood</option>
                      <option value="other">Other (specify in notes)</option>
                    </select>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-text mb-1.5">
                    Child's Name{' '}
                    <span className="text-text-light font-normal">
                      (for optional engraving)
                    </span>
                  </label>
                  <input
                    type="text"
                    name="childName"
                    value={formData.childName}
                    onChange={handleInputChange}
                    className={inputClasses}
                    placeholder="Leave blank if not needed"
                  />
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-text mb-1.5">
                    Special Requests / Notes
                  </label>
                  <textarea
                    rows="4"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    className={`${inputClasses} resize-none`}
                    placeholder="Any specific requirements, design preferences, questions, or reference links..."
                  />
                </div>
                </div>

                {/* ===== SECTION 3: Image Upload ===== */}
                <div className={`transition-all duration-500 ${currentStep === 3 ? 'block animate-fade-in' : 'hidden'}`}>
                  <h3 className="text-2xl font-bold text-text font-heading mb-6 text-center">Reference Design</h3>
                  
                  <div className="border-2 border-dashed border-border rounded-2xl p-10 text-center hover:border-primary/40 transition-colors duration-300 cursor-pointer group bg-bg-card">
                    <div className="mb-4 flex justify-center group-hover:scale-110 transition-transform duration-300">
                      <Paperclip className="w-10 h-10 text-primary opacity-60" />
                    </div>
                    <p className="font-medium text-text">
                      Click to upload or drag & drop
                    </p>
                    <p className="text-sm text-text-light mt-1">
                      PNG, JPG up to 10MB (max 5 files)
                    </p>
                  </div>
                </div>

                {/* ===== WIZARD NAVIGATION ===== */}
                <div className="flex items-center justify-between pt-8 mt-8 border-t border-border">
                  {currentStep > 1 ? (
                    <button type="button" onClick={handlePrevStep} className="px-6 py-3 rounded-full border border-border text-text font-bold hover:bg-bg-alt transition-colors">
                      Back
                    </button>
                  ) : (
                    <div></div>
                  )}
                  
                  {currentStep < 3 ? (
                    <button type="button" onClick={handleNextStep} className="px-8 py-3 rounded-full bg-primary text-white font-bold hover:bg-primary-dark transition-colors shadow-sm ml-auto">
                      Next Step
                    </button>
                  ) : (
                    <div className="flex flex-col items-end">
                      <button type="submit" disabled={isSubmitting} className="px-8 py-3 rounded-full bg-accent text-white font-bold hover:opacity-90 transition-colors shadow-sm disabled:opacity-50 ml-auto">
                        {isSubmitting ? 'Sending...' : 'Submit Request'}
                      </button>
                      <p className="text-xs text-text-light mt-3 hidden sm:block">
                        We'll contact you within 24 hours.
                      </p>
                    </div>
                  )}
                </div>
              </form>
            )}
          </div>

          {/* Direct Contact Info */}
          <div className="mt-12 flex overflow-x-auto gap-6 sm:grid sm:grid-cols-3 pb-8 pt-4 snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden -mx-4 px-4 sm:mx-0 sm:px-0">
            {[
              {
                icon: <Phone className="w-8 h-8 text-primary mx-auto mb-3" />,
                title: 'Call Us',
                detail: phoneNumber,
                sub: 'Mon-Sat, 9am-7pm',
              },
              {
                icon: <MessageCircle className="w-8 h-8 text-primary mx-auto mb-3" />,
                title: 'WhatsApp',
                detail: whatsappNumber,
                sub: 'Quick response guaranteed',
              },
              {
                icon: <Mail className="w-8 h-8 text-primary mx-auto mb-3" />,
                title: 'Email',
                detail: emailAddress,
                sub: "We'll reply within 24hrs",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="flex-none w-[80vw] sm:w-auto snap-center bg-bg-card rounded-2xl p-6 text-center shadow-sm border border-border/50 hover:shadow-md transition-all duration-300"
              >
                {item.icon}
                <h4 className="font-bold text-text font-heading">
                  {item.title}
                </h4>
                <p className="text-primary font-medium text-sm mt-1">
                  {item.detail}
                </p>
                <p className="text-text-light text-xs mt-0.5">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <AlertModal
        isOpen={alertModal.isOpen}
        onClose={() => setAlertModal({ ...alertModal, isOpen: false })}
        title={alertModal.title}
        message={alertModal.message}
        type={alertModal.type}
      />
    </PageTransition>
  );
}

export default ContactPage;
