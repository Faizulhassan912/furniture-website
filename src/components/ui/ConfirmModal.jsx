import { motion, AnimatePresence } from 'framer-motion';

function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirm", cancelText = "Cancel", isDestructive = true }) {
  if (!isOpen) return null;

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
            <h3 className="text-xl font-bold font-heading text-text mb-2">
              {title}
            </h3>
            <p className="text-sm text-text-light mb-6">
              {message}
            </p>
            
            <div className="flex gap-3 justify-center">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2.5 rounded-xl font-medium text-sm text-text bg-bg-alt hover:bg-border transition-colors"
              >
                {cancelText}
              </button>
              <button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className={`flex-1 px-4 py-2.5 rounded-xl font-medium text-sm text-white transition-colors ${
                  isDestructive 
                    ? "bg-red-500 hover:bg-red-600 shadow-md shadow-red-500/20" 
                    : "bg-primary hover:bg-primary/90 shadow-md shadow-primary/20"
                }`}
              >
                {confirmText}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default ConfirmModal;
