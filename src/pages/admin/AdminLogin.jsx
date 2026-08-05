import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, User, ArrowRight, ShieldCheck, XCircle } from 'lucide-react';
import Logo from '../../components/ui/Logo';

// The secret gatekeeper code (Don't forget this!)
const SECRET_PASSCODE = 'admin2026';

function AdminLogin() {
  const [passcode, setPasscode] = useState('');
  const [hasPassedGatekeeper, setHasPassedGatekeeper] = useState(false);
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  // Handle the Gatekeeper Check
  const handleGatekeeper = (e) => {
    e.preventDefault();
    if (passcode === SECRET_PASSCODE) {
      setHasPassedGatekeeper(true);
      setError('');
    } else {
      // If wrong, instantly redirect to home page to confuse bots/hackers
      navigate('/');
    }
  };

  // Handle Actual Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        localStorage.setItem('adminToken', data.token);
        navigate('/admin/dashboard');
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('Connection error, please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-main relative overflow-hidden flex items-center justify-center">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent/20 blur-[100px] pointer-events-none" />

      <AnimatePresence mode="wait">
        {!hasPassedGatekeeper ? (
          // ==========================================
          // STEP 1: THE GATEKEEPER SCREEN (Minimalist)
          // ==========================================
          <motion.div 
            key="gatekeeper"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
            transition={{ duration: 0.3 }}
            className="z-10 w-full max-w-sm px-4"
          >
            <div className="bg-bg-card/40 backdrop-blur-xl border border-border/50 p-8 rounded-3xl shadow-2xl flex flex-col items-center">
              <div className="w-16 h-16 bg-bg-alt rounded-full flex items-center justify-center mb-6 shadow-inner text-text-light">
                <Lock size={28} />
              </div>
              <h2 className="text-xl font-bold text-text mb-2 text-center">System Access</h2>
              <p className="text-xs text-text-light text-center mb-8">
                Restricted area. Enter authorization key to proceed.
              </p>
              
              <form onSubmit={handleGatekeeper} className="w-full">
                <div className="relative mb-4">
                  <input 
                    type="password"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    placeholder="Enter key..."
                    className="w-full px-4 py-3 pl-10 rounded-xl bg-bg-main/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm font-mono text-center tracking-widest"
                    autoComplete="off"
                  />
                  <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light" size={16} />
                </div>
                <button
                  type="submit"
                  className="w-full bg-text hover:bg-text-light text-bg font-bold py-3 px-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 text-sm"
                >
                  Verify <ArrowRight size={16} />
                </button>
              </form>
            </div>
          </motion.div>
        ) : (
          // ==========================================
          // STEP 2: PREMIUM SPLIT-SCREEN LOGIN
          // ==========================================
          <motion.div 
            key="login"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 120 }}
            className="z-10 w-full max-w-5xl h-[600px] flex rounded-3xl shadow-2xl overflow-hidden bg-bg-card border border-border mx-4"
          >
            {/* Left Side: Image Banner */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-primary/10 overflow-hidden items-center justify-center">
              {/* Abstract decorative background for premium feel */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/30 z-0" />
              <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(0,0,0,0.05) 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
              
              <div className="relative z-10 flex flex-col items-center justify-center text-center p-12">
                <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl shadow-xl border border-white/20 mb-8">
                  <Logo className="h-16 w-auto text-primary" text="S&S Kids" />
                </div>
                <h1 className="text-3xl font-extrabold text-text font-heading mb-4">
                  Welcome to Command Center
                </h1>
                <p className="text-text-light max-w-sm">
                  Manage your inventory, process orders, and oversee your entire S&S Kids store from one secure portal.
                </p>
              </div>
            </div>

            {/* Right Side: Glassmorphism Login Form */}
            <div className="w-full lg:w-1/2 relative flex items-center justify-center p-8 sm:p-12 bg-bg-card">
              <div className="w-full max-w-sm">
                
                {/* Mobile Logo */}
                <div className="lg:hidden flex justify-center mb-10">
                  <Logo className="h-12 w-auto text-primary" text="S&S Kids" />
                </div>

                <div className="mb-10 text-center lg:text-left">
                  <h2 className="text-2xl font-bold font-heading text-text mb-2">Admin Login</h2>
                  <p className="text-sm text-text-light">Enter your credentials to access the dashboard.</p>
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-xl mb-6 text-sm flex items-center gap-2"
                    >
                      <XCircle size={16} /> {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleLogin} className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-text-light uppercase tracking-wider mb-2">Username</label>
                    <div className="relative">
                      <input 
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-4 py-3 pl-11 rounded-xl bg-bg-alt border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-text"
                        placeholder="admin"
                        required
                      />
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-text-light" size={18} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-text-light uppercase tracking-wider mb-2">Password</label>
                    <div className="relative">
                      <input 
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 pl-11 rounded-xl bg-bg-alt border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-text"
                        placeholder="••••••••"
                        required
                      />
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-light" size={18} />
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-[0_8px_30px_rgb(20,184,166,0.3)] hover:shadow-[0_8px_30px_rgb(20,184,166,0.5)] disabled:opacity-70 disabled:cursor-not-allowed mt-4 relative overflow-hidden group"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        'Secure Login'
                      )}
                    </span>
                    <div className="absolute inset-0 h-full w-0 bg-white/20 transition-all duration-300 ease-out group-hover:w-full z-0" />
                  </button>
                </form>
                
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AdminLogin;
