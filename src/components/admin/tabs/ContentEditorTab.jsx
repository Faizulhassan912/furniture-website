import { useState, useEffect } from 'react';
import { Layers, ChevronDown, ChevronUp, Trash2, Plus, UploadCloud, CheckCircle, Image as ImageIcon, Link, FileText, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function ContentEditorTab() {
  const [activePage, setActivePage] = useState('home');
  const [activeAccordion, setActiveAccordion] = useState('hero'); // For sectional UI
  const [showToast, setShowToast] = useState(false);

  const toggleAccordion = (section) => {
    setActiveAccordion(activeAccordion === section ? null : section);
  };

  // Reusable Accordion Wrapper
  const AccordionSection = ({ id, title, children }) => {
    const isOpen = activeAccordion === id;
    return (
      <div className={`border rounded-2xl overflow-hidden transition-colors duration-300 ${isOpen ? 'border-primary shadow-sm bg-bg-alt/30' : 'border-border bg-bg-card hover:border-primary/50'}`}>
        <button 
          onClick={() => toggleAccordion(id)} 
          className="w-full px-6 py-4 flex justify-between items-center focus:outline-none bg-bg-card"
        >
          <h3 className={`font-bold text-lg ${isOpen ? 'text-primary' : 'text-text'}`}>{title}</h3>
          <span className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary' : 'text-text-light'}`}>
            <ChevronDown size={20} />
          </span>
        </button>
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }} 
              animate={{ height: 'auto', opacity: 1 }} 
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-border"
            >
              <div className="p-6">
                {children}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  // ===================== HOME PAGE STATE =====================
  const [homeData, setHomeData] = useState({
    // Dynamic Layout Engine
    layout: [
      { id: 'hero', name: '1. Hero Section', visible: true },
      { id: 'banners', name: '2. Promo Banners', visible: true },
      { id: 'categories', name: '3. Categories Showcase', visible: true },
      { id: 'howItWorks', name: '4. How It Works', visible: true },
      { id: 'why', name: '5. Why Choose Us', visible: true },
      { id: 'featured', name: '6. Featured Catalog', visible: true },
      { id: 'testimonials', name: '7. Testimonials (Global)', visible: true },
      { id: 'faq', name: '8. FAQ (Global)', visible: true },
      { id: 'cta', name: '9. CTA Section', visible: true }
    ],
    // Section Data
    heroTitle: 'Magical Furniture for Little Dreamers',
    heroSubtitle: "Custom-crafted, safe, and beautifully designed furniture for your child's perfect room.",
    heroImage1: null, heroImage2: null, heroImage3: null,
    
    // Multi-Banners
    banners: [
      { id: 1, title: "Summer Special: 15% Off All Custom Beds", buttonText: "Claim Offer", image: null }
    ],

    categoriesTitle: 'Explore by Category',
    categoriesSubtitle: 'From magical car beds to functional study desks...',
    categories: [
      { id: 1, name: 'Beds', desc: 'Bunk beds, car beds...', image: null },
      { id: 2, name: 'Desks', desc: 'Ergonomic study desks...', image: null },
    ],

    howItWorksTitle: 'How It Works',
    howItWorksSubtitle: 'Getting your dream furniture is easier than you think',
    howItWorks: [
      { id: 1, step: '01', icon: 'Palette', title: 'Browse or Design', desc: "Explore our collection or upload your own design idea for a fully custom piece." },
      { id: 2, step: '02', icon: 'MessageCircle', title: 'Discuss & Customize', desc: "We'll work with you on dimensions, colors, materials, and every little detail." },
      { id: 3, step: '03', icon: 'Truck', title: 'We Build & Deliver', desc: 'Your custom furniture is handcrafted with care and delivered to your door.' },
    ],

    whyChooseUsTitle: 'Why Parents Choose Us',
    whyChooseUsSubtitle: 'We don\'t just build furniture; we build safe, magical spaces...',
    whyChooseUs: [
      { id: 1, title: 'Premium Materials', desc: 'High-quality, solid wood...', icon: 'ShieldCheck' },
    ],

    ctaTitle: 'Have a Unique Idea?',
    ctaSubtitle: 'Send us your design or reference picture, and we\'ll bring it to life with premium craftsmanship. Every piece is custom-made just for you.',
    ctaButton: 'Request Custom Build'
  });

  // Reorder Layout Handler
  const moveSection = (index, direction) => {
    const newLayout = [...homeData.layout];
    if (direction === 'up' && index > 0) {
      [newLayout[index - 1], newLayout[index]] = [newLayout[index], newLayout[index - 1]];
    } else if (direction === 'down' && index < newLayout.length - 1) {
      [newLayout[index + 1], newLayout[index]] = [newLayout[index], newLayout[index + 1]];
    }
    setHomeData({ ...homeData, layout: newLayout });
  };

  // ===================== COLLECTION PAGE STATE =====================
  const [collectionData, setCollectionData] = useState({
    heroBadge: 'Explore The Magic',
    heroTitle: 'Discover Our Dream Collection',
    heroSubtitle: 'Browse our carefully crafted kids furniture...',
    sliderImage1: null, sliderImage2: null, sliderImage3: null, sliderImage4: null, sliderImage5: null
  });

  // ===================== ABOUT PAGE STATE =====================
  const [aboutData, setAboutData] = useState({
    title: 'Crafting Joy For Little Dreamers',
    subtitle: 'Where safety meets imagination...',
    story: 'S&S Kids was born from a simple idea...',
    image1: null, image2: null, image3: null
  });

  // ===================== TESTIMONIALS STATE =====================
  const [testimonialsData, setTestimonialsData] = useState([
    { id: 1, name: 'Sarah Ahmed', role: 'Mother of two', rating: 5, content: 'The custom bunk bed is absolutely magical!' }
  ]);

  // ===================== CONTACT PAGE STATE =====================
  const [contactData, setContactData] = useState({
    heroBadge: 'Get In Touch',
    heroTitle: 'Let\'s Build Something',
    heroAccent: 'Amazing',
    heroSubtitle: 'Tell us about your dream furniture...',
    floatingTitle: 'We\'re Online!',
    floatingTime: 'Response time: ~15 mins',
    methods: [
      { id: 1, title: 'Call Us', detail: '+92 300 1234567', sub: 'Mon-Sat, 9am-7pm', icon: 'Phone' },
      { id: 2, title: 'WhatsApp', detail: '+92 300 1234567', sub: 'Quick response guaranteed', icon: 'MessageCircle' },
      { id: 3, title: 'Email', detail: 'info@sskids.com', sub: 'We\'ll reply within 24hrs', icon: 'Mail' }
    ]
  });

  // ===================== FAQ PAGE STATE =====================
  const [faqData, setFaqData] = useState({
    mainTitle: 'Frequently Asked Questions',
    mainSubtitle: 'Everything you need to know about our custom order process.',
    faqs: [
      { id: 1, question: 'Do you deliver outside Lahore?', answer: 'Yes, we deliver nationwide...' }
    ]
  });

  useEffect(() => {
    fetchContent();
  }, [activePage]);

  const fetchContent = async () => {
    try {
      const res = await fetch(`/api/content/${activePage}`);
      if (res.ok) {
        const data = await res.json();
        if (data && Object.keys(data).length > 0) {
          if (activePage === 'home') setHomeData(data);
          else if (activePage === 'collection') setCollectionData(data);
          else if (activePage === 'about') setAboutData(data);
          else if (activePage === 'testimonials') setTestimonialsData(data);
          else if (activePage === 'contact') setContactData(data);
          else if (activePage === 'faq') setFaqData(data);
        }
      }
    } catch (error) {
      console.error('Error fetching content:', error);
    }
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    const token = localStorage.getItem('adminToken');
    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    });
    if (res.ok) {
      const data = await res.json();
      return data.url;
    }
    return null;
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      let payload = {};
      if (activePage === 'home') payload = homeData;
      else if (activePage === 'collection') payload = collectionData;
      else if (activePage === 'about') payload = aboutData;
      else if (activePage === 'testimonials') payload = testimonialsData;
      else if (activePage === 'contact') payload = contactData;
      else if (activePage === 'faq') payload = faqData;

      const res = await fetch(`/api/content/${activePage}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ data: payload })
      });
      if (res.ok) {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }
    } catch (error) {
      console.error('Error saving content:', error);
    }
  };

  const pages = [
    { id: 'home', label: 'Home Page' },
    { id: 'collection', label: 'Collection Page' },
    { id: 'about', label: 'About Us' },
    { id: 'contact', label: 'Contact Us' },
    { id: 'faq', label: 'FAQs Page' },
    { id: 'testimonials', label: 'Testimonials (Global)' },
    { id: 'privacy', label: 'Privacy Policy' },
    { id: 'terms', label: 'Terms & Cond.' }
  ];

  return (
    <div className="space-y-6 relative">
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="absolute top-0 right-0 z-50 bg-green-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg flex items-center gap-2"
          >
            <CheckCircle size={20} /> Content saved successfully!
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-bg-card p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-sm border border-border flex flex-col md:h-[85vh]">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 md:mb-6 pb-4 border-b border-border gap-4">
          <h2 className="text-lg md:text-xl font-bold text-text">Content Editor</h2>
          <button onClick={handleSave} className="w-full sm:w-auto px-6 py-2.5 md:py-2 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-colors cursor-pointer shadow-sm text-center">
            Save Changes
          </button>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 md:gap-8 flex-1 min-h-0 overflow-y-auto md:overflow-hidden">
          {/* Menu - Horizontal scroll on mobile, Vertical list on desktop */}
          <div className="md:w-56 flex md:flex-col gap-2 md:border-r border-border md:pr-6 overflow-x-auto md:overflow-y-auto shrink-0 pb-2 md:pb-0 custom-scrollbar hide-scrollbar-mobile whitespace-nowrap md:whitespace-normal">
            {pages.map(page => (
              <button
                key={page.id}
                onClick={() => {
                  setActivePage(page.id);
                  setActiveAccordion('none'); // reset accordion on page change
                }}
                className={`text-left px-4 py-2.5 md:py-3 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer inline-block md:block ${
                  activePage === page.id ? 'bg-primary text-white shadow-md' : 'text-text hover:bg-bg-alt'
                }`}
              >
                {page.label}
              </button>
            ))}
          </div>

          {/* Editor Area (Sectional UI) */}
          <div className="flex-1 overflow-y-auto pr-4 pb-12 custom-scrollbar space-y-4">
            
            {/* ===================== HOME PAGE ===================== */}
            {activePage === 'home' && (
              <div className="space-y-4 max-w-4xl">
                
                {/* 🚀 DYNAMIC LAYOUT BUILDER */}
                <div className="bg-primary/5 p-6 rounded-2xl border-2 border-primary/20 mb-8">
                  <h3 className="font-bold text-lg text-primary mb-2 flex items-center gap-2">
                    <Layers size={20} /> Page Structure Builder
                  </h3>
                  <p className="text-sm text-text-light mb-4">Reorder sections using arrows, or toggle visibility to hide them from the website.</p>
                  
                  <div className="space-y-2">
                    {homeData.layout.map((section, index) => (
                      <div key={section.id} className="flex items-center justify-between bg-bg-card p-3 rounded-xl border border-border shadow-sm">
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => setHomeData({...homeData, layout: homeData.layout.map(s => s.id === section.id ? {...s, visible: !s.visible} : s)})}
                            className={`w-12 h-6 rounded-full relative transition-colors ${section.visible ? 'bg-green-500' : 'bg-border'}`}
                          >
                            <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${section.visible ? 'left-6' : 'left-0.5'}`}></div>
                          </button>
                          <span className={`font-bold text-sm ${section.visible ? 'text-text' : 'text-text-light line-through'}`}>{section.name}</span>
                        </div>
                        <div className="flex gap-1">
                          <button onClick={() => moveSection(index, 'up')} disabled={index === 0} className="w-8 h-8 rounded bg-bg-alt flex items-center justify-center hover:bg-border disabled:opacity-30 disabled:cursor-not-allowed text-sm"><ChevronUp size={16} /></button>
                          <button onClick={() => moveSection(index, 'down')} disabled={index === homeData.layout.length - 1} className="w-8 h-8 rounded bg-bg-alt flex items-center justify-center hover:bg-border disabled:opacity-30 disabled:cursor-not-allowed text-sm"><ChevronDown size={16} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* The sections in mapped layout order */}
                {homeData.layout.map((section) => (
                  <div key={`edit-${section.id}`} className={!section.visible ? 'opacity-50' : ''}>
                    
                    {section.id === 'hero' && (
                      <AccordionSection id="hero" title={section.name}>
                        <div className="space-y-4">
                          <input type="text" placeholder="Hero Title" value={homeData.heroTitle} onChange={e => setHomeData({...homeData, heroTitle: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-bg-alt border border-border outline-none focus:border-primary font-bold text-lg" />
                          <textarea rows="2" placeholder="Hero Subtitle" value={homeData.heroSubtitle} onChange={e => setHomeData({...homeData, heroSubtitle: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-bg-alt border border-border outline-none focus:border-primary resize-none"></textarea>
                          <label className="block text-sm font-bold text-text-light mt-4 mb-2">Slider Images (3)</label>
                          <div className="grid grid-cols-3 gap-4">
                            {[1, 2, 3].map((num) => (
                              <div key={num} className="h-32 border-2 border-dashed border-border rounded-xl flex items-center justify-center relative hover:border-primary bg-bg-alt overflow-hidden cursor-pointer transition-colors">
                                {homeData[`heroImage${num}`] ? <img src={homeData[`heroImage${num}`]} className="w-full h-full object-cover" alt={`Hero ${num}`} /> : <span className="text-sm font-bold text-text-light">Upload Img {num}</span>}
                                <input type="file" accept="image/*" onChange={async (e) => { if(e.target.files[0]) { const url = await uploadImage(e.target.files[0]); if(url) setHomeData({...homeData, [`heroImage${num}`]: url}); } }} className="absolute inset-0 opacity-0 cursor-pointer" />
                              </div>
                            ))}
                          </div>
                        </div>
                      </AccordionSection>
                    )}

                    {section.id === 'banners' && (
                      <AccordionSection id="banners" title={section.name}>
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-sm text-text-light font-bold">{homeData.banners.length} Active Banner(s)</span>
                          <button onClick={() => setHomeData({...homeData, banners: [...homeData.banners, { id: Date.now(), title: '', buttonText: '', image: null }]})} className="text-sm font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-lg hover:bg-primary/20 flex items-center gap-1"><Plus size={16}/> Add New Banner</button>
                        </div>
                        <div className="space-y-4">
                          {homeData.banners.map((b, idx) => (
                            <div key={b.id} className="bg-bg-card border border-border rounded-xl p-4 relative group">
                              <button onClick={() => setHomeData({...homeData, banners: homeData.banners.filter(x => x.id !== b.id)})} className="absolute top-4 right-4 text-red-500 opacity-0 group-hover:opacity-100 w-8 h-8 rounded bg-red-50 flex items-center justify-center transition-opacity"><Trash2 size={16} /></button>
                              <div className="grid grid-cols-2 gap-4 pr-10">
                                <input type="text" placeholder="Banner Title" value={b.title} onChange={e => setHomeData({...homeData, banners: homeData.banners.map(x => x.id === b.id ? {...x, title: e.target.value} : x)})} className="col-span-2 px-4 py-2 rounded-xl bg-bg-alt border border-border outline-none focus:border-primary font-bold" />
                                <input type="text" placeholder="Button Text" value={b.buttonText} onChange={e => setHomeData({...homeData, banners: homeData.banners.map(x => x.id === b.id ? {...x, buttonText: e.target.value} : x)})} className="px-4 py-2 rounded-xl bg-bg-alt border border-border outline-none focus:border-primary" />
                                <div className="border border-border rounded-xl flex items-center px-4 bg-bg-alt relative overflow-hidden text-sm cursor-pointer hover:border-primary">
                                  {b.image ? "Image Uploaded ✅" : "Upload Banner Image..."}
                                  <input type="file" onChange={async (e) => { if(e.target.files[0]) { const url = await uploadImage(e.target.files[0]); if(url) setHomeData({...homeData, banners: homeData.banners.map(x => x.id === b.id ? {...x, image: url} : x)}); } }} className="absolute inset-0 opacity-0 cursor-pointer" />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </AccordionSection>
                    )}

                    {section.id === 'categories' && (
                      <AccordionSection id="categories" title={section.name}>
                        <input type="text" placeholder="Section Title" value={homeData.categoriesTitle} onChange={e => setHomeData({...homeData, categoriesTitle: e.target.value})} className="w-full px-4 py-2 mb-3 rounded-xl bg-bg-alt border border-border outline-none focus:border-primary font-bold" />
                        <textarea rows="2" placeholder="Section Subtitle" value={homeData.categoriesSubtitle} onChange={e => setHomeData({...homeData, categoriesSubtitle: e.target.value})} className="w-full px-4 py-2 mb-4 rounded-xl bg-bg-alt border border-border outline-none focus:border-primary resize-none"></textarea>
                        <div className="space-y-4 border-t border-border pt-4">
                          {homeData.categories.map(cat => (
                            <div key={cat.id} className="flex gap-4 items-center bg-bg-card p-3 rounded-xl border border-border">
                              <div className="w-16 h-16 border-2 border-dashed border-border rounded-lg relative flex items-center justify-center overflow-hidden hover:border-primary">
                                {cat.image ? <img src={cat.image} className="w-full h-full object-cover" alt="cat" /> : <span className="text-xs">Img</span>}
                                <input type="file" onChange={async (e) => { if(e.target.files[0]) { const url = await uploadImage(e.target.files[0]); if(url) setHomeData({...homeData, categories: homeData.categories.map(c => c.id === cat.id ? {...c, image: url} : c)}); } }} className="absolute inset-0 opacity-0 cursor-pointer" />
                              </div>
                              <div className="flex-1">
                                <input type="text" placeholder="Category Name" value={cat.name} onChange={e => setHomeData({...homeData, categories: homeData.categories.map(c => c.id === cat.id ? {...c, name: e.target.value} : c)})} className="w-full px-2 py-1.5 bg-bg-alt rounded-lg mb-1.5 text-sm font-bold border border-border outline-none focus:border-primary" />
                                <input type="text" placeholder="Description" value={cat.desc} onChange={e => setHomeData({...homeData, categories: homeData.categories.map(c => c.id === cat.id ? {...c, desc: e.target.value} : c)})} className="w-full px-2 py-1.5 bg-bg-alt rounded-lg text-sm border border-border outline-none focus:border-primary" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </AccordionSection>
                    )}

                    {section.id === 'howItWorks' && (
                      <AccordionSection id="howItWorks" title={section.name}>
                        <input type="text" placeholder="Section Title" value={homeData.howItWorksTitle} onChange={e => setHomeData({...homeData, howItWorksTitle: e.target.value})} className="w-full px-4 py-2 mb-3 rounded-xl bg-bg-alt border border-border outline-none font-bold" />
                        <textarea rows="2" placeholder="Section Subtitle" value={homeData.howItWorksSubtitle} onChange={e => setHomeData({...homeData, howItWorksSubtitle: e.target.value})} className="w-full px-4 py-2 mb-4 rounded-xl bg-bg-alt border border-border outline-none resize-none"></textarea>
                        <div className="space-y-3">
                          {homeData.howItWorks.map(step => (
                            <div key={step.id} className="flex gap-3 bg-bg-card p-3 rounded-xl border border-border items-start">
                              <input type="text" value={step.icon} onChange={e => setHomeData({...homeData, howItWorks: homeData.howItWorks.map(x => x.id === step.id ? {...x, icon: e.target.value} : x)})} className="w-12 h-12 text-center bg-bg-alt rounded-xl text-xs font-bold border border-border outline-none" title="Lucide Icon Name" />
                              <div className="flex-1">
                                <div className="flex gap-2 mb-2">
                                  <input type="text" placeholder="Step (e.g. 01)" value={step.step} onChange={e => setHomeData({...homeData, howItWorks: homeData.howItWorks.map(x => x.id === step.id ? {...x, step: e.target.value} : x)})} className="w-16 px-2 py-1.5 bg-bg-alt rounded-lg text-sm font-bold border border-border outline-none text-primary" />
                                  <input type="text" placeholder="Point Title" value={step.title} onChange={e => setHomeData({...homeData, howItWorks: homeData.howItWorks.map(x => x.id === step.id ? {...x, title: e.target.value} : x)})} className="flex-1 px-2 py-1.5 bg-bg-alt rounded-lg text-sm font-bold border border-border outline-none" />
                                </div>
                                <input type="text" placeholder="Point Description" value={step.desc} onChange={e => setHomeData({...homeData, howItWorks: homeData.howItWorks.map(x => x.id === step.id ? {...x, desc: e.target.value} : x)})} className="w-full px-2 py-1.5 bg-bg-alt rounded-lg text-sm border border-border outline-none" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </AccordionSection>
                    )}

                    {section.id === 'why' && (
                      <AccordionSection id="why" title={section.name}>
                        <input type="text" placeholder="Section Title" value={homeData.whyChooseUsTitle} onChange={e => setHomeData({...homeData, whyChooseUsTitle: e.target.value})} className="w-full px-4 py-2 mb-3 rounded-xl bg-bg-alt border border-border outline-none font-bold" />
                        <textarea rows="2" placeholder="Section Subtitle" value={homeData.whyChooseUsSubtitle} onChange={e => setHomeData({...homeData, whyChooseUsSubtitle: e.target.value})} className="w-full px-4 py-2 mb-4 rounded-xl bg-bg-alt border border-border outline-none resize-none"></textarea>
                        <div className="flex justify-end mb-4">
                          <button onClick={() => setHomeData({...homeData, whyChooseUs: [...homeData.whyChooseUs, { id: Date.now(), title: 'New Point', desc: '', icon: 'Sparkles' }]})} className="text-sm font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-lg hover:bg-primary/20 transition-colors flex items-center gap-1"><Plus size={16}/> Add Point</button>
                        </div>
                        <div className="space-y-3">
                          {homeData.whyChooseUs.map(p => (
                            <div key={p.id} className="bg-bg-card p-3 rounded-xl border border-border flex gap-3 items-start relative group">
                              <button onClick={() => setHomeData({...homeData, whyChooseUs: homeData.whyChooseUs.filter(x => x.id !== p.id)})} className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16} /></button>
                              <input type="text" value={p.icon} onChange={e => setHomeData({...homeData, whyChooseUs: homeData.whyChooseUs.map(x => x.id === p.id ? {...x, icon: e.target.value} : x)})} className="w-12 h-12 text-center bg-bg-alt rounded-xl text-xs font-bold border border-border outline-none" title="Lucide Icon Name" />
                              <div className="flex-1">
                                <input type="text" placeholder="Title" value={p.title} onChange={e => setHomeData({...homeData, whyChooseUs: homeData.whyChooseUs.map(x => x.id === p.id ? {...x, title: e.target.value} : x)})} className="w-full px-2 py-1 bg-bg-alt rounded-lg mb-1.5 text-sm font-bold border border-border outline-none" />
                                <input type="text" placeholder="Point Description" value={p.desc} onChange={e => setHomeData({...homeData, whyChooseUs: homeData.whyChooseUs.map(x => x.id === p.id ? {...x, desc: e.target.value} : x)})} className="w-full px-2 py-1.5 bg-bg-alt rounded-lg text-sm border border-border outline-none" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </AccordionSection>
                    )}

                    {section.id === 'featured' && (
                      <AccordionSection id="featured" title={section.name}>
                        <div className="bg-bg-alt/50 p-4 rounded-xl border border-border text-center">
                          <p className="text-sm text-text-light">This section automatically pulls products marked as "Featured" from the Products Database.</p>
                          <p className="text-sm text-text-light font-bold mt-2">To manage these items, please go to the "Products" tab.</p>
                        </div>
                      </AccordionSection>
                    )}

                    {section.id === 'testimonials' && (
                      <AccordionSection id="testimonials_home" title={section.name}>
                        <div className="bg-bg-alt/50 p-4 rounded-xl border border-border text-center">
                          <p className="text-sm text-text-light">Testimonials are managed globally.</p>
                          <p className="text-sm text-text-light font-bold mt-2">To edit them, please use the "Testimonials (Global)" page from the left menu.</p>
                        </div>
                      </AccordionSection>
                    )}

                    {section.id === 'faq' && (
                      <AccordionSection id="faq_home" title={section.name}>
                        <div className="bg-bg-alt/50 p-4 rounded-xl border border-border text-center">
                          <p className="text-sm text-text-light">FAQs are managed globally.</p>
                          <p className="text-sm text-text-light font-bold mt-2">To edit them, please use the "FAQs Page" from the left menu.</p>
                        </div>
                      </AccordionSection>
                    )}

                    {section.id === 'cta' && (
                      <AccordionSection id="cta" title={section.name}>
                        <div className="space-y-4">
                          <input type="text" placeholder="CTA Title" value={homeData.ctaTitle} onChange={e => setHomeData({...homeData, ctaTitle: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-bg-alt border border-border outline-none focus:border-primary font-bold text-lg" />
                          <textarea rows="3" placeholder="CTA Subtitle" value={homeData.ctaSubtitle} onChange={e => setHomeData({...homeData, ctaSubtitle: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-bg-alt border border-border outline-none focus:border-primary resize-none"></textarea>
                          <input type="text" placeholder="Button Text" value={homeData.ctaButton} onChange={e => setHomeData({...homeData, ctaButton: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-bg-alt border border-border outline-none focus:border-primary" />
                        </div>
                      </AccordionSection>
                    )}

                  </div>
                ))}

              </div>
            )}

            {/* ===================== COLLECTION PAGE ===================== */}
            {activePage === 'collection' && (
              <div className="space-y-4 max-w-4xl">
                <AccordionSection id="collectionHero" title="Hero Section & Slider">
                  <div className="space-y-4">
                    <input type="text" placeholder="Hero Badge (e.g. Explore The Magic)" value={collectionData.heroBadge} onChange={e => setCollectionData({...collectionData, heroBadge: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-bg-alt border border-border outline-none focus:border-primary text-sm font-bold uppercase tracking-wider text-primary" />
                    <input type="text" placeholder="Hero Title" value={collectionData.heroTitle} onChange={e => setCollectionData({...collectionData, heroTitle: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-bg-alt border border-border outline-none focus:border-primary font-bold text-xl" />
                    <textarea rows="3" placeholder="Hero Subtitle" value={collectionData.heroSubtitle} onChange={e => setCollectionData({...collectionData, heroSubtitle: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-bg-alt border border-border outline-none resize-none"></textarea>
                  </div>
                  <div className="mt-6 border-t border-border pt-4">
                    <label className="block text-sm font-bold text-text-light mb-3">Slider Images (Max 5)</label>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <div key={num} className="h-28 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center relative hover:border-primary bg-bg-alt overflow-hidden cursor-pointer transition-colors group">
                          {collectionData[`sliderImage${num}`] ? (
                            <img src={collectionData[`sliderImage${num}`]} className="w-full h-full object-cover" alt="slider" />
                          ) : (
                            <>
                              <ImageIcon size={24} className="text-text-light mb-1 group-hover:scale-110 transition-transform" />
                              <span className="text-xs text-text-light font-bold">Img {num}</span>
                            </>
                          )}
                          <input type="file" accept="image/*" onChange={async (e) => { if(e.target.files[0]) { const url = await uploadImage(e.target.files[0]); if(url) setCollectionData({...collectionData, [`sliderImage${num}`]: url}); } }} className="absolute inset-0 opacity-0 cursor-pointer" />
                        </div>
                      ))}
                    </div>
                  </div>
                </AccordionSection>
              </div>
            )}

            {/* ===================== ABOUT PAGE ===================== */}
            {activePage === 'about' && (
              <div className="space-y-4 max-w-4xl">
                <AccordionSection id="aboutHero" title="Hero & Story">
                  <div className="space-y-4">
                    <input type="text" placeholder="Title" value={aboutData.title} onChange={e => setAboutData({...aboutData, title: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-bg-alt border border-border font-bold outline-none focus:border-primary" />
                    <input type="text" placeholder="Subtitle" value={aboutData.subtitle} onChange={e => setAboutData({...aboutData, subtitle: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-bg-alt border border-border outline-none focus:border-primary" />
                    <textarea rows="4" placeholder="Our Story" value={aboutData.story} onChange={e => setAboutData({...aboutData, story: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-bg-alt border border-border resize-none outline-none focus:border-primary"></textarea>
                  </div>
                </AccordionSection>

                <AccordionSection id="aboutImages" title="Image Gallery (3 Sections)">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {[1, 2, 3].map((num) => (
                      <div key={num} className="h-40 border-2 border-dashed border-border rounded-xl flex items-center justify-center relative hover:border-primary bg-bg-alt overflow-hidden cursor-pointer transition-colors group">
                        {aboutData[`image${num}`] ? (
                          <img src={aboutData[`image${num}`]} className="w-full h-full object-cover" alt={`Img ${num}`} />
                        ) : (
                          <span className="text-sm font-bold text-text-light group-hover:text-primary transition-colors">Upload Image {num}</span>
                        )}
                        <input type="file" onChange={async (e) => { if(e.target.files[0]) { const url = await uploadImage(e.target.files[0]); if(url) setAboutData({...aboutData, [`image${num}`]: url}); } }} className="absolute inset-0 opacity-0 cursor-pointer" />
                      </div>
                    ))}
                  </div>
                </AccordionSection>
              </div>
            )}

            {/* ===================== CONTACT PAGE ===================== */}
            {activePage === 'contact' && (
              <div className="space-y-4 max-w-4xl">
                <AccordionSection id="contactHero" title="1. Hero Section & Notice">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input type="text" placeholder="Hero Badge" value={contactData.heroBadge} onChange={e => setContactData({...contactData, heroBadge: e.target.value})} className="px-4 py-2 rounded-xl bg-bg-alt border border-border outline-none text-sm font-bold uppercase text-primary focus:border-primary" />
                    <input type="text" placeholder="Hero Accent Word (e.g. Amazing)" value={contactData.heroAccent} onChange={e => setContactData({...contactData, heroAccent: e.target.value})} className="px-4 py-2 rounded-xl bg-bg-alt border border-border outline-none text-sm font-bold text-accent focus:border-primary" />
                    <input type="text" placeholder="Hero Title" value={contactData.heroTitle} onChange={e => setContactData({...contactData, heroTitle: e.target.value})} className="sm:col-span-2 px-4 py-3 rounded-xl bg-bg-alt border border-border outline-none font-bold text-lg focus:border-primary" />
                    <textarea rows="2" placeholder="Hero Subtitle" value={contactData.heroSubtitle} onChange={e => setContactData({...contactData, heroSubtitle: e.target.value})} className="sm:col-span-2 px-4 py-2 rounded-xl bg-bg-alt border border-border outline-none resize-none focus:border-primary"></textarea>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-6 border-t border-border">
                    <div className="sm:col-span-2 mb-2"><h4 className="font-bold text-text-light text-sm">Floating Status Card</h4></div>
                    <input type="text" placeholder="Floating Card Title" value={contactData.floatingTitle} onChange={e => setContactData({...contactData, floatingTitle: e.target.value})} className="px-4 py-2 rounded-xl bg-bg-alt border border-border outline-none font-bold focus:border-primary" />
                    <input type="text" placeholder="Response Time" value={contactData.floatingTime} onChange={e => setContactData({...contactData, floatingTime: e.target.value})} className="px-4 py-2 rounded-xl bg-bg-alt border border-border outline-none text-sm focus:border-primary" />
                  </div>
                </AccordionSection>

                <AccordionSection id="contactMethods" title="2. Support Methods (Cards)">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {contactData.methods.map(m => (
                      <div key={m.id} className="bg-bg-card p-4 rounded-xl border border-border hover:border-primary transition-colors">
                        <input type="text" value={m.icon} onChange={e => setContactData({...contactData, methods: contactData.methods.map(x => x.id === m.id ? {...x, icon: e.target.value} : x)})} className="w-12 h-12 text-center bg-bg-alt rounded-xl text-xs font-bold mb-4 border border-border outline-none" title="Lucide Icon Name" />
                        <input type="text" placeholder="Title" value={m.title} onChange={e => setContactData({...contactData, methods: contactData.methods.map(x => x.id === m.id ? {...x, title: e.target.value} : x)})} className="w-full font-bold text-sm bg-bg-alt px-3 py-2 rounded-lg mb-2 border border-border outline-none" />
                        <input type="text" placeholder="Detail (Phone/Email)" value={m.detail} onChange={e => setContactData({...contactData, methods: contactData.methods.map(x => x.id === m.id ? {...x, detail: e.target.value} : x)})} className="w-full text-sm text-primary font-bold bg-bg-alt px-3 py-2 rounded-lg mb-2 border border-border outline-none" />
                        <input type="text" placeholder="Subtext" value={m.sub} onChange={e => setContactData({...contactData, methods: contactData.methods.map(x => x.id === m.id ? {...x, sub: e.target.value} : x)})} className="w-full text-xs text-text-light bg-bg-alt px-3 py-2 rounded-lg border border-border outline-none" />
                      </div>
                    ))}
                  </div>
                </AccordionSection>
              </div>
            )}

            {/* ===================== FAQ PAGE ===================== */}
            {activePage === 'faq' && (
              <div className="space-y-4 max-w-4xl">
                <AccordionSection id="faqHeader" title="Page Header">
                  <div className="space-y-4">
                    <input type="text" value={faqData.mainTitle} onChange={e => setFaqData({...faqData, mainTitle: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-bg-alt border border-border outline-none font-bold text-lg focus:border-primary" />
                    <textarea rows="2" value={faqData.mainSubtitle} onChange={e => setFaqData({...faqData, mainSubtitle: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-bg-alt border border-border outline-none resize-none focus:border-primary"></textarea>
                  </div>
                </AccordionSection>

                <AccordionSection id="faqQuestions" title="Questions & Answers">
                  <div className="flex justify-end mb-4">
                    <button onClick={() => setFaqData({...faqData, faqs: [...faqData.faqs, { id: Date.now(), question: '', answer: '' }]})} className="text-primary font-bold text-sm bg-primary/10 px-4 py-1.5 rounded-lg hover:bg-primary/20 transition-colors flex items-center gap-1"><Plus size={16}/> Add FAQ</button>
                  </div>
                  <div className="space-y-4">
                    {faqData.faqs.map((faq, index) => (
                      <div key={faq.id} className="bg-bg-card p-4 rounded-xl border border-border relative group">
                        <button onClick={() => setFaqData({...faqData, faqs: faqData.faqs.filter(f => f.id !== faq.id)})} className="absolute top-4 right-4 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16} /></button>
                        <input type="text" placeholder={`Question ${index + 1}`} value={faq.question} onChange={e => setFaqData({...faqData, faqs: faqData.faqs.map(f => f.id === faq.id ? { ...f, question: e.target.value } : f)})} className="w-full px-4 py-2.5 rounded-lg bg-bg-alt border border-border outline-none focus:border-primary font-bold mb-3 text-sm pr-10" />
                        <textarea rows="3" placeholder="Answer..." value={faq.answer} onChange={e => setFaqData({...faqData, faqs: faqData.faqs.map(f => f.id === faq.id ? { ...f, answer: e.target.value } : f)})} className="w-full px-4 py-2.5 rounded-lg bg-bg-alt border border-border outline-none focus:border-primary resize-none text-sm"></textarea>
                      </div>
                    ))}
                  </div>
                </AccordionSection>
              </div>
            )}

            {/* ===================== TESTIMONIALS ===================== */}
            {activePage === 'testimonials' && (
              <div className="max-w-4xl">
                <AccordionSection id="testimonialsList" title="Manage Reviews">
                  <div className="flex justify-end mb-4">
                    <button onClick={() => setTestimonialsData([...testimonialsData, { id: Date.now(), name: '', role: '', rating: 5, content: '' }])} className="text-primary font-bold text-sm bg-primary/10 px-4 py-1.5 rounded-lg hover:bg-primary/20 transition-colors flex items-center gap-1"><Plus size={16}/> Add Testimonial</button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {testimonialsData.map((t) => (
                      <div key={t.id} className="bg-bg-card p-4 rounded-xl border border-border relative group">
                        <button onClick={() => setTestimonialsData(testimonialsData.filter(item => item.id !== t.id))} className="absolute top-4 right-4 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity bg-red-50 w-8 h-8 rounded-full flex items-center justify-center"><Trash2 size={16} /></button>
                        <div className="flex gap-3 mb-3 pr-10">
                          <div className="flex-1">
                            <input type="text" placeholder="Name" value={t.name} onChange={e => setTestimonialsData(testimonialsData.map(item => item.id === t.id ? {...item, name: e.target.value} : item))} className="w-full px-3 py-2 bg-bg-alt rounded-lg mb-2 text-sm font-bold border border-border outline-none focus:border-primary" />
                            <input type="text" placeholder="Role (e.g. Mother of two)" value={t.role} onChange={e => setTestimonialsData(testimonialsData.map(item => item.id === t.id ? {...item, role: e.target.value} : item))} className="w-full px-3 py-2 bg-bg-alt rounded-lg text-sm border border-border outline-none focus:border-primary" />
                          </div>
                        </div>
                        <textarea rows="3" placeholder="Review Content" value={t.content} onChange={e => setTestimonialsData(testimonialsData.map(item => item.id === t.id ? {...item, content: e.target.value} : item))} className="w-full px-3 py-2 bg-bg-alt rounded-lg text-sm resize-none border border-border outline-none focus:border-primary"></textarea>
                      </div>
                    ))}
                  </div>
                </AccordionSection>
              </div>
            )}

            {/* ===================== PRIVACY / TERMS ===================== */}
            {(activePage === 'privacy' || activePage === 'terms') && (
              <div className="max-w-4xl h-full flex flex-col">
                <AccordionSection id="legalEditor" title={`Edit ${pages.find(p => p.id === activePage)?.label}`}>
                  <div className="border border-border rounded-xl bg-bg-card overflow-hidden flex flex-col h-[500px]">
                    <div className="bg-bg-alt border-b border-border p-2 flex gap-2 flex-wrap items-center shadow-sm">
                      <select className="px-3 py-1.5 rounded-lg border border-border bg-bg-card text-sm font-bold outline-none cursor-pointer hover:border-primary">
                        <option>Heading 1</option>
                        <option>Heading 2</option>
                        <option>Paragraph</option>
                      </select>
                      <div className="w-px h-6 bg-border mx-1"></div>
                      <button className="w-8 h-8 font-bold hover:bg-border rounded text-text transition-colors">B</button>
                      <button className="w-8 h-8 italic font-serif hover:bg-border rounded text-text transition-colors">I</button>
                      <button className="w-8 h-8 underline hover:bg-border rounded text-text transition-colors">U</button>
                      <div className="w-px h-6 bg-border mx-1"></div>
                      <button className="w-8 h-8 flex items-center justify-center hover:bg-border rounded text-text transition-colors"><Link size={16} /></button>
                      <button className="w-8 h-8 flex items-center justify-center hover:bg-border rounded text-text transition-colors"><FileText size={16} /></button>
                    </div>
                    <textarea 
                      className="flex-1 w-full p-6 text-text outline-none resize-none leading-relaxed"
                      defaultValue={`Welcome to our ${pages.find(p => p.id === activePage)?.label}.\n\nWrite your rich text content here...`}
                      key={activePage}
                    ></textarea>
                  </div>
                </AccordionSection>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

export default ContentEditorTab;
