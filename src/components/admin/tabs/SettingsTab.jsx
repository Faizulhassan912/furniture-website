import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Image as ImageIcon, Shield } from 'lucide-react';

function SettingsTab() {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('Settings saved successfully!');
  const [isError, setIsError] = useState(false);
  const [logo, setLogo] = useState(null);
  const [passwords, setPasswords] = useState({ current: '', new: '' });
  const [settings, setSettings] = useState({
    siteName: 'S&S Kids Furniture',
    primaryColor: '#e4658a',
    accentColor: '#65b2e4',
    metaTitle: 'Custom Kids Furniture | S&S',
    metaDesc: 'Premium handcrafted custom furniture for kids in Pakistan.',
    metaKeywords: 'kids furniture, custom beds, lahore, pakistan',
    whatsapp: '+92 300 1234567',
    phone: '+92 300 1234567',
    email: 'info@sskids.com',
    instagram: 'https://instagram.com',
    facebook: 'https://facebook.com',
    address: '123 Furniture Market, DHA Phase 5, Lahore, Pakistan',
    currency: 'Rs',
    hours: 'Mon - Sat: 9 AM - 8 PM'
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/content/settings');
      if (res.ok) {
        const data = await res.json();
        if (data && Object.keys(data).length > 0) {
          if (data.logo) setLogo(data.logo);
          if (data.settings) setSettings(data.settings);
        }
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
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
      const payload = { logo, settings };
      const res = await fetch('/api/content/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ data: payload })
      });
      if (res.ok) {
        setToastMessage('Settings saved successfully!');
        setIsError(false);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const handleUpdatePassword = async () => {
    if (!passwords.current || !passwords.new) {
      setToastMessage('Please enter both passwords.');
      setIsError(true);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch('/api/auth/update-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwords.current,
          newPassword: passwords.new
        })
      });

      const data = await res.json();
      if (res.ok) {
        setToastMessage('Password updated successfully!');
        setIsError(false);
        setPasswords({ current: '', new: '' });
      } else {
        setToastMessage(data.message || 'Error updating password');
        setIsError(true);
      }
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      console.error('Error updating password:', error);
      setToastMessage('Server error');
      setIsError(true);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const handleLogoUpload = async (e) => {
    if(e.target.files[0]) {
      const url = await uploadImage(e.target.files[0]);
      if (url) setLogo(url);
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
            className={`absolute top-0 right-0 z-50 ${isError ? 'bg-red-500' : 'bg-green-500'} text-white px-6 py-3 rounded-xl font-bold shadow-lg flex items-center gap-2`}
          >
            {isError ? null : <CheckCircle size={20} />} {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-bg-card p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-sm border border-border">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 md:mb-6 pb-4 border-b border-border gap-4">
          <h2 className="text-lg md:text-xl font-bold text-text">Site Settings</h2>
          <button onClick={handleSave} className="w-full sm:w-auto px-6 py-2.5 md:py-2 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-colors cursor-pointer shadow-sm text-center">
            Save Settings
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
          
          {/* General Info */}
          <div className="space-y-6">
            <h3 className="text-xs font-bold text-text-light uppercase tracking-wider border-b border-border pb-2">Branding & Identity</h3>
            
            <div>
              <label className="block text-sm font-bold text-text mb-2">Website Logo</label>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-bg-alt border border-border rounded-xl flex items-center justify-center overflow-hidden">
                  {logo ? <img src={logo} alt="Logo" className="w-full h-full object-contain p-2" /> : <ImageIcon size={32} className="text-text-light" />}
                </div>
                <div>
                  <input type="file" id="logo-upload" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                  <label htmlFor="logo-upload" className="px-4 py-2 bg-bg-alt border border-border rounded-lg text-sm font-bold cursor-pointer hover:bg-border transition-colors">
                    Upload New Logo
                  </label>
                  <p className="text-xs text-text-light mt-2">Recommended: 200x50px PNG</p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-text mb-2">Website Favicon</label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-bg-alt border border-border rounded-xl flex items-center justify-center overflow-hidden">
                  {settings.favicon ? <img src={settings.favicon} alt="Favicon" className="w-full h-full object-contain p-2" /> : <ImageIcon size={24} className="text-text-light" />}
                </div>
                <div>
                  <input type="file" id="favicon-upload" className="hidden" accept="image/*" onChange={async (e) => {
                    if(e.target.files[0]) {
                      const url = await uploadImage(e.target.files[0]);
                      if (url) setSettings({...settings, favicon: url});
                    }
                  }} />
                  <label htmlFor="favicon-upload" className="px-4 py-2 bg-bg-alt border border-border rounded-lg text-sm font-bold cursor-pointer hover:bg-border transition-colors">
                    Upload Favicon
                  </label>
                  <p className="text-xs text-text-light mt-2">Recommended: 32x32px PNG/ICO</p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-text mb-1">Website Name</label>
              <input type="text" value={settings.siteName} onChange={e => setSettings({...settings, siteName: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-bg-alt border border-border outline-none focus:border-primary transition-colors font-bold" />
            </div>
            
            
          </div>

          {/* SEO & Meta */}
          <div className="space-y-6">
            <h3 className="text-xs font-bold text-text-light uppercase tracking-wider border-b border-border pb-2">SEO Settings</h3>
            <div>
              <label className="block text-sm font-bold text-text mb-1">Global Meta Title</label>
              <input type="text" value={settings.metaTitle} onChange={e => setSettings({...settings, metaTitle: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-bg-alt border border-border outline-none focus:border-primary transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-bold text-text mb-1">Global Meta Description</label>
              <textarea rows="3" value={settings.metaDesc} onChange={e => setSettings({...settings, metaDesc: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-bg-alt border border-border outline-none focus:border-primary transition-colors resize-none"></textarea>
            </div>
            <div>
              <label className="block text-sm font-bold text-text mb-1">Meta Keywords</label>
              <input type="text" value={settings.metaKeywords} onChange={e => setSettings({...settings, metaKeywords: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-bg-alt border border-border outline-none focus:border-primary transition-colors" />
            </div>
          </div>

          {/* Contact & Social */}
          <div className="space-y-6">
            <h3 className="text-xs font-bold text-text-light uppercase tracking-wider border-b border-border pb-2">Contact & Social Links</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-text mb-1">WhatsApp Number</label>
                <input type="text" value={settings.whatsapp} onChange={e => setSettings({...settings, whatsapp: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-bg-alt border border-border outline-none focus:border-primary transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-bold text-text mb-1">Phone Number (Call)</label>
                <input type="text" value={settings.phone} onChange={e => setSettings({...settings, phone: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-bg-alt border border-border outline-none focus:border-primary transition-colors" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-text mb-1">Contact Email</label>
              <input type="email" value={settings.email} onChange={e => setSettings({...settings, email: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-bg-alt border border-border outline-none focus:border-primary transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-bold text-text mb-1">Instagram Link</label>
              <input type="url" value={settings.instagram} onChange={e => setSettings({...settings, instagram: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-bg-alt border border-border outline-none focus:border-primary transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-bold text-text mb-1">Facebook Link</label>
              <input type="url" value={settings.facebook} onChange={e => setSettings({...settings, facebook: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-bg-alt border border-border outline-none focus:border-primary transition-colors" />
            </div>
          </div>

          {/* Store Operations */}
          <div className="space-y-6">
            <h3 className="text-xs font-bold text-text-light uppercase tracking-wider border-b border-border pb-2">Store Operations</h3>
            <div>
              <label className="block text-sm font-bold text-text mb-1">Store Address</label>
              <textarea rows="2" value={settings.address} onChange={e => setSettings({...settings, address: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-bg-alt border border-border outline-none focus:border-primary transition-colors resize-none"></textarea>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-text mb-1">Currency Symbol</label>
                <input type="text" value={settings.currency} onChange={e => setSettings({...settings, currency: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-bg-alt border border-border outline-none focus:border-primary transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-bold text-text mb-1">Business Hours</label>
                <input type="text" value={settings.hours} onChange={e => setSettings({...settings, hours: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-bg-alt border border-border outline-none focus:border-primary transition-colors" />
              </div>
            </div>
          </div>

          {/* Account Security */}
          <div className="space-y-6 md:col-span-2 border-t border-border pt-8 mt-4">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="text-red-500" size={24} />
              <h3 className="text-lg font-bold text-text">Account Security</h3>
            </div>
            
            <div className="bg-bg-alt p-6 rounded-2xl border border-border max-w-xl">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-text mb-1">Current Password</label>
                  <input 
                    type="password" 
                    value={passwords.current} 
                    onChange={e => setPasswords({...passwords, current: e.target.value})} 
                    className="w-full px-4 py-2 rounded-xl bg-bg-card border border-border outline-none focus:border-red-500 transition-colors" 
                    placeholder="Enter current password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-text mb-1">New Password</label>
                  <input 
                    type="password" 
                    value={passwords.new} 
                    onChange={e => setPasswords({...passwords, new: e.target.value})} 
                    className="w-full px-4 py-2 rounded-xl bg-bg-card border border-border outline-none focus:border-red-500 transition-colors" 
                    placeholder="Enter new password"
                  />
                </div>
                <div className="pt-2">
                  <button 
                    onClick={handleUpdatePassword} 
                    className="px-6 py-2 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors cursor-pointer shadow-sm w-full sm:w-auto"
                  >
                    Update Password
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default SettingsTab;
