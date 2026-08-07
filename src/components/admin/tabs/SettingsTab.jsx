import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Image as ImageIcon, Shield, Eye, EyeOff, User, KeyRound } from 'lucide-react';

function SettingsTab() {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('Settings saved successfully!');
  const [isError, setIsError] = useState(false);
  const [logo, setLogo] = useState(null);
  const [passwords, setPasswords] = useState({ current: '', new: '' });
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  
  // Username change state
  const [usernameData, setUsernameData] = useState({ password: '', newUsername: '' });
  const [showUsernamePw, setShowUsernamePw] = useState(false);
  
  // Gatekeeper change state
  const [gatekeeperData, setGatekeeperData] = useState({ password: '', newPasscode: '' });
  const [showGatekeeperPw, setShowGatekeeperPw] = useState(false);
  const [showGatekeeperPasscode, setShowGatekeeperPasscode] = useState(false);
  
  // Loading states
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isUpdatingUsername, setIsUpdatingUsername] = useState(false);
  const [isUpdatingGatekeeper, setIsUpdatingGatekeeper] = useState(false);
  

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

  const showNotification = (message, error = false) => {
    setToastMessage(message);
    setIsError(error);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
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
        showNotification('Settings saved successfully!');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const handleUpdatePassword = async () => {
    if (!passwords.current || !passwords.new) {
      showNotification('Please enter both passwords.', true);
      return;
    }

    setIsUpdatingPassword(true);
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
        showNotification('Password updated successfully!');
        setPasswords({ current: '', new: '' });
      } else {
        showNotification(data.message || 'Error updating password', true);
      }
    } catch (error) {
      showNotification('Server error', true);
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleUpdateUsername = async () => {
    if (!usernameData.password || !usernameData.newUsername) {
      showNotification('Please enter password and new username.', true);
      return;
    }

    setIsUpdatingUsername(true);
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch('/api/auth/update-username', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: usernameData.password,
          newUsername: usernameData.newUsername
        })
      });

      const data = await res.json();
      if (res.ok) {
        showNotification('Username updated successfully!');
        setUsernameData({ password: '', newUsername: '' });
      } else {
        showNotification(data.message || 'Error updating username', true);
      }
    } catch (error) {
      showNotification('Server error', true);
    } finally {
      setIsUpdatingUsername(false);
    }
  };

  const handleUpdateGatekeeper = async () => {
    if (!gatekeeperData.password || !gatekeeperData.newPasscode) {
      showNotification('Please enter password and new passcode.', true);
      return;
    }

    setIsUpdatingGatekeeper(true);
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch('/api/auth/update-gatekeeper', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: gatekeeperData.password,
          newPasscode: gatekeeperData.newPasscode
        })
      });

      const data = await res.json();
      if (res.ok) {
        showNotification('Gatekeeper passcode updated successfully!');
        setGatekeeperData({ password: '', newPasscode: '' });
      } else {
        showNotification(data.message || 'Error updating passcode', true);
      }
    } catch (error) {
      showNotification('Server error', true);
    } finally {
      setIsUpdatingGatekeeper(false);
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
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Update Password */}
              <div className="bg-bg-alt p-6 rounded-2xl border border-border">
                <div className="flex items-center gap-2 mb-4">
                  <Shield size={18} className="text-red-500" />
                  <h4 className="text-sm font-bold text-text">Change Password</h4>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-text-light mb-1">Current Password</label>
                    <div className="relative">
                      <input 
                        type={showCurrentPw ? 'text' : 'password'}
                        value={passwords.current} 
                        onChange={e => setPasswords({...passwords, current: e.target.value})} 
                        className="w-full px-4 py-2 pr-10 rounded-xl bg-bg-card border border-border outline-none focus:border-red-500 transition-colors" 
                        placeholder="Enter current password"
                      />
                      <button type="button" onClick={() => setShowCurrentPw(!showCurrentPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-light hover:text-primary transition-colors cursor-pointer">
                        {showCurrentPw ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-light mb-1">New Password</label>
                    <div className="relative">
                      <input 
                        type={showNewPw ? 'text' : 'password'}
                        value={passwords.new} 
                        onChange={e => setPasswords({...passwords, new: e.target.value})} 
                        className="w-full px-4 py-2 pr-10 rounded-xl bg-bg-card border border-border outline-none focus:border-red-500 transition-colors" 
                        placeholder="Enter new password"
                      />
                      <button type="button" onClick={() => setShowNewPw(!showNewPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-light hover:text-primary transition-colors cursor-pointer">
                        {showNewPw ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <button 
                    onClick={handleUpdatePassword}
                    disabled={isUpdatingPassword} 
                    className={`px-5 py-2 bg-red-600 text-white font-bold rounded-xl transition-colors shadow-sm w-full text-sm flex items-center justify-center gap-2 ${isUpdatingPassword ? 'opacity-70 cursor-wait' : 'hover:bg-red-700 cursor-pointer'}`}
                  >
                    {isUpdatingPassword ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Updating...
                      </>
                    ) : 'Update Password'}
                  </button>
                </div>
              </div>

              {/* Update Username */}
              <div className="bg-bg-alt p-6 rounded-2xl border border-border">
                <div className="flex items-center gap-2 mb-4">
                  <User size={18} className="text-blue-500" />
                  <h4 className="text-sm font-bold text-text">Change Username</h4>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-text-light mb-1">Current Password</label>
                    <div className="relative">
                      <input 
                        type={showUsernamePw ? 'text' : 'password'}
                        value={usernameData.password} 
                        onChange={e => setUsernameData({...usernameData, password: e.target.value})} 
                        className="w-full px-4 py-2 pr-10 rounded-xl bg-bg-card border border-border outline-none focus:border-blue-500 transition-colors" 
                        placeholder="Enter current password"
                      />
                      <button type="button" onClick={() => setShowUsernamePw(!showUsernamePw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-light hover:text-primary transition-colors cursor-pointer">
                        {showUsernamePw ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-light mb-1">New Username</label>
                    <input 
                      type="text"
                      value={usernameData.newUsername} 
                      onChange={e => setUsernameData({...usernameData, newUsername: e.target.value})} 
                      className="w-full px-4 py-2 rounded-xl bg-bg-card border border-border outline-none focus:border-blue-500 transition-colors" 
                      placeholder="Enter new username"
                    />
                  </div>
                  <button 
                    onClick={handleUpdateUsername}
                    disabled={isUpdatingUsername} 
                    className={`px-5 py-2 bg-blue-600 text-white font-bold rounded-xl transition-colors shadow-sm w-full text-sm flex items-center justify-center gap-2 ${isUpdatingUsername ? 'opacity-70 cursor-wait' : 'hover:bg-blue-700 cursor-pointer'}`}
                  >
                    {isUpdatingUsername ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Updating...
                      </>
                    ) : 'Update Username'}
                  </button>
                </div>
              </div>

              {/* Update Gatekeeper Passcode */}
              <div className="bg-bg-alt p-6 rounded-2xl border border-border">
                <div className="flex items-center gap-2 mb-4">
                  <KeyRound size={18} className="text-amber-500" />
                  <h4 className="text-sm font-bold text-text">Gatekeeper Passcode</h4>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-text-light mb-1">Current Password</label>
                    <div className="relative">
                      <input 
                        type={showGatekeeperPw ? 'text' : 'password'}
                        value={gatekeeperData.password} 
                        onChange={e => setGatekeeperData({...gatekeeperData, password: e.target.value})} 
                        className="w-full px-4 py-2 pr-10 rounded-xl bg-bg-card border border-border outline-none focus:border-amber-500 transition-colors" 
                        placeholder="Enter current password"
                      />
                      <button type="button" onClick={() => setShowGatekeeperPw(!showGatekeeperPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-light hover:text-primary transition-colors cursor-pointer">
                        {showGatekeeperPw ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-light mb-1">New Passcode</label>
                    <div className="relative">
                      <input 
                        type={showGatekeeperPasscode ? 'text' : 'password'}
                        value={gatekeeperData.newPasscode} 
                        onChange={e => setGatekeeperData({...gatekeeperData, newPasscode: e.target.value})} 
                        className="w-full px-4 py-2 pr-10 rounded-xl bg-bg-card border border-border outline-none focus:border-amber-500 transition-colors" 
                        placeholder="Enter new passcode"
                      />
                      <button type="button" onClick={() => setShowGatekeeperPasscode(!showGatekeeperPasscode)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-light hover:text-primary transition-colors cursor-pointer">
                        {showGatekeeperPasscode ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <button 
                    onClick={handleUpdateGatekeeper}
                    disabled={isUpdatingGatekeeper} 
                    className={`px-5 py-2 bg-amber-600 text-white font-bold rounded-xl transition-colors shadow-sm w-full text-sm flex items-center justify-center gap-2 ${isUpdatingGatekeeper ? 'opacity-70 cursor-wait' : 'hover:bg-amber-700 cursor-pointer'}`}
                  >
                    {isUpdatingGatekeeper ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Updating...
                      </>
                    ) : 'Update Passcode'}
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

