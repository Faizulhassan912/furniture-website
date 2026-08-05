import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, User, ArrowRight, ShieldCheck, XCircle, Eye, EyeOff, Fingerprint } from 'lucide-react';
import Logo from '../../components/ui/Logo';

function AdminLogin() {
  const [passcode, setPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [hasPassedGatekeeper, setHasPassedGatekeeper] = useState(false);
  const [gatekeeperLoading, setGatekeeperLoading] = useState(false);
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  
  const navigate = useNavigate();

  // Handle the Gatekeeper Check (via backend)
  const handleGatekeeper = async (e) => {
    e.preventDefault();
    setGatekeeperLoading(true);
    
    try {
      const res = await fetch('/api/auth/verify-gatekeeper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode })
      });
      
      if (res.ok) {
        setHasPassedGatekeeper(true);
        setError('');
      } else {
        // Wrong passcode — redirect to home silently
        navigate('/');
      }
    } catch (err) {
      // On error, also redirect
      navigate('/');
    } finally {
      setGatekeeperLoading(false);
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
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        
        if (newAttempts >= 3) {
          // After 3 failed attempts, redirect to home
          navigate('/');
        } else {
          setError(`Invalid credentials. ${3 - newAttempts} attempt(s) remaining.`);
        }
      }
    } catch (err) {
      setError('Connection error, please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-main relative overflow-hidden flex items-center justify-center">
      
      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/15 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-accent/15 blur-[120px]" />
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      </div>

      <AnimatePresence mode="wait">
        {!hasPassedGatekeeper ? (
          // ==========================================
          // STEP 1: THE GATEKEEPER SCREEN (Premium)
          // ==========================================
          <motion.div 
            key="gatekeeper"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, filter: 'blur(12px)' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="z-10 w-full max-w-md px-4"
          >
            <div className="bg-bg-card/60 backdrop-blur-2xl border border-border/50 rounded-3xl shadow-2xl overflow-hidden">
              {/* Top accent bar */}
              <div className="h-1 w-full bg-gradient-to-r from-primary via-accent to-primary" />
              
              <div className="p-8 sm:p-10 flex flex-col items-center">
                {/* Icon with animated ring */}
                <div className="relative mb-8">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-[-8px] rounded-full border-2 border-dashed border-primary/20"
                  />
                  <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center shadow-inner">
                    <Fingerprint size={36} className="text-primary" />
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-text mb-2 text-center font-heading">System Access</h2>
                <p className="text-sm text-text-light text-center mb-8 max-w-xs">
                  This is a restricted area. Enter your authorization key to continue.
                </p>
                
                <form onSubmit={handleGatekeeper} className="w-full space-y-4">
                  <div className="relative">
                    <input 
                      type={showPasscode ? 'text' : 'password'}
                      value={passcode}
                      onChange={(e) => setPasscode(e.target.value)}
                      placeholder="Enter authorization key..."
                      className="w-full px-4 py-3.5 pl-12 pr-12 rounded-xl bg-bg-alt/80 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm font-mono tracking-wider text-text"
                      autoComplete="off"
                      required
                    />
                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-text-light" size={18} />
                    <button
                      type="button"
                      onClick={() => setShowPasscode(!showPasscode)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-text-light hover:text-primary transition-colors cursor-pointer"
                    >
                      {showPasscode ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <button
                    type="submit"
                    disabled={gatekeeperLoading}
                    className="w-full bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-[0_8px_30px_rgb(20,184,166,0.3)] hover:shadow-[0_8px_30px_rgb(20,184,166,0.5)] flex items-center justify-center gap-2 text-sm disabled:opacity-60"
                  >
                    {gatekeeperLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>Verify Access <ArrowRight size={16} /></>
                    )}
                  </button>
                </form>
                
                <p className="text-[10px] text-text-light/50 mt-6 text-center">
                  Unauthorized access attempts are logged and monitored.
                </p>
              </div>
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
            className="z-10 w-full max-w-5xl flex rounded-3xl shadow-2xl overflow-hidden bg-bg-card border border-border mx-4"
            style={{ maxHeight: '640px' }}
          >
            {/* Left Side: Brand Banner */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--color-bg-alt) 0%, var(--color-bg-main) 100%)' }}>
              {/* Dot pattern */}
              <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '24px 24px' }} />
              {/* Gradient orbs */}
              <div className="absolute top-10 left-10 w-48 h-48 bg-primary/20 rounded-full blur-[80px]" />
              <div className="absolute bottom-10 right-10 w-48 h-48 bg-accent/20 rounded-full blur-[80px]" />
              
              <div className="relative z-10 flex flex-col items-center justify-center text-center p-12">
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="bg-bg-card/60 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-border/50 mb-8"
                >
                  <Logo className="h-16 w-auto text-primary" text="S&S Kids" />
                </motion.div>
                <motion.h1 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl font-extrabold text-text font-heading mb-4"
                >
                  Welcome Back
                </motion.h1>
                <motion.p 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-text-light max-w-sm"
                >
                  Manage your inventory, process orders, and oversee your entire S&S Kids store from one secure portal.
                </motion.p>
              </div>
            </div>

            {/* Right Side: Login Form */}
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
                      initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                      animate={{ opacity: 1, height: 'auto', marginBottom: 20 }}
                      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                      className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-xl text-sm flex items-center gap-2"
                    >
                      <XCircle size={16} className="flex-shrink-0" /> {error}
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
                        placeholder="Enter username"
                        required
                      />
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-text-light" size={18} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-text-light uppercase tracking-wider mb-2">Password</label>
                    <div className="relative">
                      <input 
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 pl-11 pr-11 rounded-xl bg-bg-alt border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-text"
                        placeholder="••••••••"
                        required
                      />
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-light" size={18} />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-text-light hover:text-primary transition-colors cursor-pointer"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
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
