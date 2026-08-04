import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

function AlertModal({ isOpen, onClose, title, message, type = "info", buttonText = "OK" }) {
  if (!isOpen) return null;

  const icons = {
    success: <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />,
    error: <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />,
    info: <Info className="w-12 h-12 text-primary mx-auto mb-4" />
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-sm bg-bg-card border border-border rounded-2xl shadow-2xl overflow-hidden z-10"
        >
          <div className="p-6 text-center">
            {icons[type]}
            <h3 className="text-xl font-bold font-heading text-text mb-2">
              {title}
            </h3>
            <p className="text-sm text-text-light mb-6">
              {message}
            </p>
            
            <button
              onClick={onClose}
              className="w-full px-4 py-2.5 rounded-xl font-medium text-sm text-white bg-primary hover:bg-primary/90 shadow-md shadow-primary/20 transition-colors"
            >
              {buttonText}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default AlertModal;
