import AdminSidebar from './AdminSidebar';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { Moon, Sun, User, Menu, Settings, LogOut, ChevronDown } from 'lucide-react';

function AdminLayout({ activeTab, setActiveTab, children }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.removeAttribute('data-theme');
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
      setIsDarkMode(false);
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
      setIsDarkMode(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-bg-main flex">
      {/* Sidebar - Fixed width */}
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      {/* Main Content Area - Scrollable */}
      <div className="flex-1 md:ml-64 min-h-screen overflow-x-hidden w-full">
        {/* Top Header */}
        <header className="bg-bg-card/80 backdrop-blur-md border-b border-border sticky top-0 z-30 px-4 md:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 text-text-light hover:text-primary transition-colors cursor-pointer rounded-lg hover:bg-bg-alt md:hidden"
              aria-label="Open Sidebar"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-lg md:text-xl font-bold text-text capitalize">
              {activeTab.replace('-', ' ')}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={toggleTheme}
              className="p-2 text-text-light hover:text-primary transition-colors cursor-pointer rounded-full hover:bg-bg-alt"
              aria-label="Toggle Theme"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* User Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className="flex items-center gap-2 pl-3 md:pl-4 border-l border-border cursor-pointer hover:opacity-80 transition-opacity"
              >
                <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                  <User size={18} />
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-bold text-text leading-tight">Admin</p>
                  <p className="text-xs text-text-light leading-tight">Super Admin</p>
                </div>
                <ChevronDown size={16} className={`hidden md:block text-text-light transition-transform duration-200 ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isUserDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-52 bg-bg-card border border-border rounded-xl shadow-xl overflow-hidden z-50"
                  >
                    <div className="p-3 border-b border-border">
                      <p className="text-sm font-bold text-text">Admin User</p>
                      <p className="text-xs text-text-light">Super Admin</p>
                    </div>
                    <div className="p-1">
                      <button
                        onClick={() => { setActiveTab('settings'); setIsUserDropdownOpen(false); }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-text hover:bg-bg-alt rounded-lg transition-colors cursor-pointer"
                      >
                        <Settings size={16} className="text-text-light" />
                        Settings
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="p-4 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
