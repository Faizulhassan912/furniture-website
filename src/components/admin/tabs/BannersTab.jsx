import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image, Megaphone, UploadCloud } from 'lucide-react';

function BannersTab() {
  const [showToast, setShowToast] = useState(false);
  const [activeBuilder, setActiveBuilder] = useState('pre-designed'); // 'pre-designed' or 'custom'
  const [promoText, setPromoText] = useState('Summer Sale: Get 20% off all Bunk Beds! Use code SUMMER20');
  const [previewImage, setPreviewImage] = useState(null);
  const [products, setProducts] = useState([]);
  
  const [customBanner, setCustomBanner] = useState({
    title: 'Premium Storage Collection',
    subtitle: 'Organize in style with our new arrivals',
    buttonText: 'Shop Now',
    buttonLink: '/collection/velvet-kingdom-bunk-bed',
    layout: 'text-left',
    bgImage: null
  });

  useEffect(() => {
    fetchBannersData();
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        // The API returns either an array (if no pagination) or an object with a 'products' array
        setProducts(Array.isArray(data) ? data : data.products || []);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchBannersData = async () => {
    try {
      const res = await fetch('/api/content/banners');
      if (res.ok) {
        const data = await res.json();
        if (data && Object.keys(data).length > 0) {
          if (data.activeBuilder) setActiveBuilder(data.activeBuilder);
          if (data.promoText) setPromoText(data.promoText);
          if (data.previewImage) setPreviewImage(data.previewImage);
          if (data.customBanner) setCustomBanner(data.customBanner);
        }
      }
    } catch (error) {
      console.error('Error fetching banners:', error);
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
      const payload = { activeBuilder, promoText, previewImage, customBanner };
      const res = await fetch('/api/content/banners', {
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
      console.error('Error saving banners:', error);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = await uploadImage(file);
      if (url) setPreviewImage(url);
    }
  };

  const handleCustomBgChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Show immediate local preview
      const tempUrl = URL.createObjectURL(file);
      setCustomBanner(prev => ({ ...prev, bgImage: tempUrl }));
      
      const url = await uploadImage(file);
      if (url) {
        setCustomBanner(prev => ({ ...prev, bgImage: url }));
      }
    }
  };

  return (
    <div className="space-y-6 relative">
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-0 right-0 z-50 bg-green-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg flex items-center gap-2"
          >
            <span className="text-green-500 mr-2">✓</span> Banners saved successfully!
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-bg-card p-6 rounded-3xl shadow-sm border border-border">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b border-border pb-4 gap-4">
          <h2 className="text-lg md:text-xl font-bold text-text">Promo & Banners</h2>
          <button onClick={handleSave} className="w-full sm:w-auto px-6 py-2.5 md:py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-colors cursor-pointer shadow-sm text-center">
            Save All Changes
          </button>
        </div>
        
        <div className="space-y-10">
          
          {/* Top Promo Bar */}
          <div>
            <h3 className="text-sm font-bold text-text-light uppercase tracking-wider mb-3 flex items-center gap-2"><Megaphone className="w-5 h-5 text-primary" /> Top Promo Bar</h3>
            <div className="flex gap-4">
              <input 
                type="text" 
                value={promoText}
                onChange={e => setPromoText(e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl bg-bg-alt border border-border outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          {/* Home Slider & Banners */}
          <div>
            <div className="flex justify-between items-end mb-4">
              <h3 className="text-sm font-bold text-text-light uppercase tracking-wider flex items-center gap-2"><Image className="w-5 h-5 text-primary" /> Home Banners</h3>
              <div className="bg-bg-alt p-1 rounded-xl flex gap-1 border border-border">
                <button 
                  onClick={() => setActiveBuilder('pre-designed')}
                  className={`px-4 py-1.5 text-sm font-bold rounded-lg transition-colors cursor-pointer ${activeBuilder === 'pre-designed' ? 'bg-bg-card shadow text-primary' : 'text-text-light hover:text-text'}`}
                >
                  Pre-Designed Image
                </button>
                <button 
                  onClick={() => setActiveBuilder('custom')}
                  className={`px-4 py-1.5 text-sm font-bold rounded-lg transition-colors cursor-pointer ${activeBuilder === 'custom' ? 'bg-bg-card shadow text-primary' : 'text-text-light hover:text-text'}`}
                >
                  Custom Builder
                </button>
              </div>
            </div>

            {activeBuilder === 'pre-designed' ? (
              <div className="bg-bg-alt p-6 rounded-2xl border border-border">
                <p className="text-sm text-text-light mb-4">Upload a complete pre-designed banner image (e.g. from Canva or Photoshop).</p>
                <div className="relative w-full h-64 border-2 border-dashed border-border rounded-xl flex items-center justify-center bg-bg-card hover:border-primary transition-colors cursor-pointer overflow-hidden group">
                  {previewImage ? (
                    <img src={previewImage} alt="Banner Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center">
                      <UploadCloud className="w-10 h-10 group-hover:scale-110 transition-transform block mb-2 text-primary mx-auto" />
                      <span className="text-sm font-bold text-text">Click to upload banner image</span>
                    </div>
                  )}
                  <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
              </div>
            ) : (
              <div className="bg-bg-alt p-6 rounded-2xl border border-border grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Form Fields */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-text mb-1">Banner Title</label>
                    <input type="text" value={customBanner.title} onChange={e => setCustomBanner({...customBanner, title: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-bg-alt border border-border outline-none focus:border-primary transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-text mb-1">Subtitle / Description</label>
                    <textarea rows="2" value={customBanner.subtitle} onChange={e => setCustomBanner({...customBanner, subtitle: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-bg-alt border border-border outline-none focus:border-primary transition-colors resize-none"></textarea>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-text mb-1">Button Text</label>
                      <input type="text" value={customBanner.buttonText} onChange={e => setCustomBanner({...customBanner, buttonText: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-bg-alt border border-border outline-none focus:border-primary transition-colors" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-text mb-1">Button Link (Select Product)</label>
                      <select 
                        value={customBanner.buttonLink} 
                        onChange={e => setCustomBanner({...customBanner, buttonLink: e.target.value})} 
                        className="w-full px-4 py-2 rounded-xl bg-bg-alt border border-border outline-none focus:border-primary transition-colors"
                      >
                        <option value="/collection">All Collection (/collection)</option>
                        {products.map(product => (
                          <option key={product._id} value={`/collection/${product.slug}`}>
                            {product.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-text mb-1">Layout Style</label>
                    <select value={customBanner.layout} onChange={e => setCustomBanner({...customBanner, layout: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-bg-alt border border-border outline-none focus:border-primary transition-colors">
                      <option value="text-left">Text on Left, Image on Right</option>
                      <option value="text-right">Text on Right, Image on Left</option>
                      <option value="text-center">Text Centered</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-text mb-1">Background Image (Optional)</label>
                    <input type="file" accept="image/*" onChange={handleCustomBgChange} className="block w-full text-sm text-text-light file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer" />
                  </div>
                </div>

                {/* Live Preview */}
                <div>
                  <label className="block text-sm font-bold text-text mb-2 uppercase tracking-wider text-primary">Live Preview</label>
                  <div className={`w-full aspect-[2/1] rounded-2xl overflow-hidden shadow-sm relative flex ${customBanner.layout === 'text-right' ? 'flex-row-reverse' : customBanner.layout === 'text-center' ? 'flex-col' : 'flex-row'} bg-pink text-white`}>
                    
                    <div className={`p-6 relative z-10 flex flex-col justify-center ${customBanner.layout === 'text-center' ? 'w-full text-center items-center' : 'w-1/2'}`}>
                      <div className="mb-2">
                        <span className="inline-block px-2 py-1 bg-black/10 text-xs font-bold rounded-full uppercase tracking-wider">✨ New Arrival</span>
                      </div>
                      <h2 className="font-bold font-heading mb-2 text-2xl drop-shadow-sm leading-tight">{customBanner.title}</h2>
                      <p className="text-xs mb-4 opacity-90 drop-shadow-sm">{customBanner.subtitle}</p>
                      {customBanner.buttonText && (
                        <div>
                          <span className="bg-white text-pink px-4 py-1.5 rounded-xl font-bold text-xs shadow-md inline-block">{customBanner.buttonText}</span>
                        </div>
                      )}
                    </div>

                    {customBanner.layout !== 'text-center' && (
                      <div className="w-1/2 relative flex items-center justify-center p-2">
                        {customBanner.bgImage ? (
                          <img src={customBanner.bgImage} className="w-full h-full object-contain" alt="preview" />
                        ) : (
                          <div className="w-full h-full border-2 border-dashed border-white/40 rounded-xl flex items-center justify-center text-white/60 text-xs text-center p-2">
                            Upload an image to see it here
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default BannersTab;
