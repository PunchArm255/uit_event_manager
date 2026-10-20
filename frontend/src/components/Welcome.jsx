import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, AlertCircle } from 'lucide-react';

export default function Welcome({ onNavigate, onOpenAbout }) {
  return (
    <div className="flex-1 flex flex-col justify-between min-h-screen">
      {/* Main Hero (No extra features or events below buttons) */}
      <main className="flex-1 flex flex-col items-center justify-center max-w-3xl mx-auto px-6 py-16 text-center">
        {/* UIT Logo Front & Center above hero text */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="flex justify-center mb-6"
        >
          <img
            src="/uit-logo.png"
            alt="Université Ibn Tofaïl Kénitra"
            className="h-20 sm:h-24 w-auto object-contain"
          />
        </motion.div>

        {/* Banner Label: Faculté des Sciences • Département Informatique */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.05 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EBF1FD] text-[#002B7F] text-xs font-semibold mb-6 shadow-2xs"
        >
          <span>Faculté des Sciences</span>
          <span className="text-[#002B7F]/40 font-bold text-sm leading-none">•</span>
          <span>Département Informatique</span>
        </motion.div>

        {/* Hero Title */}
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.1 }}
          className="text-3xl sm:text-5xl font-bold tracking-tight text-neutral-900 leading-[1.15] max-w-2xl mx-auto mb-6"
        >
          Portail des conférences et badges d'accès universitaires.
        </motion.h1>

        {/* Hero Description */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.15 }}
          className="text-base sm:text-lg text-neutral-600 max-w-xl mx-auto leading-relaxed mb-10"
        >
          Consultez les séminaires académiques, réservez votre place en un clic et récupérez votre badge d'accès officiel avec QR code sécurisé.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          <button
            onClick={() => onNavigate('auth')}
            className="inline-flex items-center gap-2 bg-[#002B7F] hover:bg-[#001F5C] active:bg-[#001642] text-white text-sm font-medium px-7 py-3.5 rounded-lg shadow-sm transition"
          >
            <span>Accéder à la plateforme</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onOpenAbout}
            className="inline-flex items-center gap-2 bg-white hover:bg-neutral-50 active:bg-neutral-100 text-neutral-800 border border-[#E5E7EB] text-sm font-medium px-6 py-3.5 rounded-lg transition"
          >
            <AlertCircle className="w-4 h-4 text-[#002B7F]" />
            <span>À propos du projet</span>
          </button>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-4xl mx-auto px-6 py-8 border-t border-[#E5E7EB] flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-3">
        <span>Université Ibn Tofaïl — Faculté des Sciences Kénitra</span>
        <span>
          Réalisé par{' '}
          <strong className="text-neutral-900 font-semibold">
            Mohammed NASSIRI (Master GLCC)
          </strong>
        </span>
      </footer>
    </div>
  );
}
