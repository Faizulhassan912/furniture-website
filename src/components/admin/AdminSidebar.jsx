import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, ShoppingCart, MessageSquare, Package, FolderTree, Star, Image as ImageIcon, PenTool, Settings, LogOut, X } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

const tabs = [
  { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'orders', label: 'Orders', icon: ShoppingCart },
  { id: 'inquiries', label: 'Inquiries', icon: MessageSquare },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'categories', label: 'Categories', icon: FolderTree },
  { id: 'reviews', label: 'Reviews', icon: Star },
  { id: 'banners', label: 'Banners & Offers', icon: ImageIcon },
  { id: 'content', label: 'Content Editor', icon: PenTool },
  { id: 'settings', label: 'Settings', icon: Settings },
];

function AdminSidebar({ activeTab, setActiveTab, isOpen, onClose }) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { settings } = useSettings();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      <aside className={`w-64 bg-bg-card border-r border-border min-h-screen flex flex-col fixed left-0 top-0 z-50 transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 transition-transform duration-300 ease-in-out`}>
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold font-heading text-primary">Admin Panel</h2>
            <p className="text-xs text-text-light mt-1">{settings?.settings?.siteName || 'S&S Kids Furniture'}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-text-light hover:bg-bg-alt hover:text-primary md:hidden"
            aria-label="Close Sidebar"
          >
            <X size={20} />
          </button>
        </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              if (onClose) onClose();
            }}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 cursor-pointer relative overflow-hidden group ${
              activeTab === tab.id 
                ? 'bg-primary/10 text-primary font-bold' 
                : 'text-text hover:bg-bg-alt hover:text-primary'
            }`}
          >
            {/* Background highlight animation */}
            {activeTab === tab.id && (
              <motion.div 
                layoutId="activeTabBg" 
                className="absolute inset-0 bg-primary/10 rounded-xl"
                initial={false}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            
            <div className="flex items-center gap-3 relative z-10">
              <tab.icon size={20} className={activeTab === tab.id ? 'text-primary' : 'text-text-light group-hover:text-primary'} />
              <span>{tab.label}</span>
            </div>

            {tab.badge && (
              <span className={`relative z-10 px-2 py-0.5 rounded-full text-xs font-bold ${
                activeTab === tab.id ? 'bg-primary text-white' : 'bg-red-500 text-white'
              }`}>
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-border">
        <button 
          onClick={() => setShowLogoutModal(true)}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-50 text-red-600 font-bold hover:bg-red-100 transition-colors cursor-pointer"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>

      </aside>

      {/* Logout Confirmation Modal - Rendered outside aside to prevent transform cropping */}
      <AnimatePresence>
        {showLogoutModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowLogoutModal(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-bg-card p-6 rounded-2xl shadow-xl w-full max-w-sm border border-border z-10"
            >
              <h3 className="text-xl font-bold text-text mb-2">Confirm Logout</h3>
              <p className="text-text-light mb-6">Are you sure you want to log out of the admin panel?</p>
              
              <div className="flex items-center gap-3 justify-end">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="px-4 py-2 font-bold text-text hover:bg-bg-alt rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    localStorage.removeItem('adminToken');
                    window.location.href = '/'; // Redirect to customer panel on logout
                  }}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors cursor-pointer"
                >
                  Yes, Logout
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

export default AdminSidebar;
