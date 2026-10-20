import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  const isSuccess = toast.type === 'success' || !toast.type;
  const isError = toast.type === 'error';

  return (
    <AnimatePresence>
      <div className="fixed bottom-6 right-6 z-50">
        <motion.div
          initial={{ opacity: 0, y: 12, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.95 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className="flex items-center gap-3 bg-white border border-[#E5E7EB] rounded-xl px-4 py-3 shadow-lg max-w-sm text-xs"
        >
          {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
          {isError && <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />}
          {!isSuccess && !isError && <Info className="w-4 h-4 text-[#002B7F] shrink-0" />}

          <div className="flex-1 text-neutral-800 font-medium">
            {toast.message}
          </div>

          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-neutral-700 rounded transition"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
