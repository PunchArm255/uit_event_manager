import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, GraduationCap, Award, Server, Database, Code2, Globe } from 'lucide-react';

function GithubIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

function LinkedinIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.25c-.97 0-1.75.79-1.75 1.76s.78 1.75 1.75 1.75 1.75-.78 1.75-1.75-.78-1.76-1.75-1.76z" />
    </svg>
  );
}

export default function AboutModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 bg-black/40 backdrop-blur-none"
          onClick={onClose}
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 8 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="relative w-full max-w-md bg-white border border-[#E5E7EB] rounded-2xl shadow-xl p-8 z-10 text-center"
        >
          {/* Close button X */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Profile Picture */}
          <div className="relative mx-auto w-24 h-24 mb-4">
            <img
              src="/profile.jpg"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/profile.png';
              }}
              alt="Mohammed NASSIRI"
              className="w-24 h-24 rounded-full object-cover border-2 border-[#E5E7EB] shadow-sm bg-neutral-100"
            />
            <span className="absolute bottom-0 right-0 w-6 h-6 bg-[#002B7F] rounded-full flex items-center justify-center text-white text-[11px] font-bold border-2 border-white shadow-sm">
              ✓
            </span>
          </div>

          {/* Title & Author */}
          <h2 className="text-xl font-bold text-neutral-900 tracking-tight">Mohammed NASSIRI</h2>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF1FD] text-[#002B7F] text-xs font-semibold mt-1.5">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Master GLCC</span>
          </div>

          <div className="border-t border-[#E5E7EB] my-5" />

          {/* Academic Project Context */}
          <div className="text-left bg-[#F7F7F5] border border-[#E5E7EB] rounded-xl p-4 mb-5">
            <div className="flex items-center gap-2 text-xs font-semibold text-neutral-900 mb-1">
              <Award className="w-4 h-4 text-[#002B7F]" />
              <span>Cadre Académique</span>
            </div>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Projet d'application d'entreprise conçu dans le cadre du module <strong>J2E</strong> à l'<strong>Université Ibn Tofaïl</strong>.
            </p>
          </div>

          {/* Stack pills */}
          <div className="text-left">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-2">
              Architecture & Technologies
            </div>
            <div className="flex flex-wrap gap-1.5 text-[11px]">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-[#E5E7EB] rounded-md text-neutral-700 font-medium">
                <Server className="w-3 h-3 text-[#002B7F]" /> Spring Boot 3
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-[#E5E7EB] rounded-md text-neutral-700 font-medium">
                <Code2 className="w-3 h-3 text-[#002B7F]" /> Java 21
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-[#E5E7EB] rounded-md text-neutral-700 font-medium">
                <Database className="w-3 h-3 text-[#002B7F]" /> Spring Data JPA & H2
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-[#E5E7EB] rounded-md text-neutral-700 font-medium">
                <Globe className="w-3 h-3 text-[#002B7F]" /> React 19 & Framer Motion
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-[#E5E7EB] rounded-md text-neutral-700 font-medium">
                QR Cryptographique
              </span>
            </div>
          </div>

          {/* Socials Section */}
          <div className="text-left mt-5 pt-4 border-t border-[#E5E7EB]">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-2">
              Réseaux Professionnels
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <a
                href="https://github.com/puncharm255"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-3.5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold transition shadow-2xs"
              >
                <GithubIcon className="w-4 h-4" />
                <span>GitHub</span>
              </a>
              <a
                href="https://linkedin.com/in/simonassiri"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-3.5 py-2.5 bg-[#0077B5] hover:bg-[#006097] text-white rounded-xl text-xs font-semibold transition shadow-2xs"
              >
                <LinkedinIcon className="w-4 h-4" />
                <span>LinkedIn</span>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
