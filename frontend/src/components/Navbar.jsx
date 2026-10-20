import React from 'react';
import { LogOut, ExternalLink, ShieldCheck } from 'lucide-react';

export default function Navbar({ user, onOpenAbout, onLogout }) {
  if (!user) return null; // No navbar on welcome or auth screens per requirements

  // Helper to ensure links to Swagger and H2 Console work seamlessly
  // whether accessed from Vite dev server (:5173) or Spring Boot production (:8080)
  const getBackendUrl = (path) => {
    if (typeof window !== 'undefined' && window.location.port && window.location.port !== '8080') {
      return `http://${window.location.hostname}:8080${path}`;
    }
    return path;
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 border-b border-[#E5E7EB] backdrop-blur-xs">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 h-20 flex items-center justify-between">
        {/* Brand / Logo - Clicking opens A Propos modal per requirements */}
        <div className="flex items-center gap-4">
          <button
            onClick={onOpenAbout}
            className="flex items-center gap-3 transition hover:opacity-80 text-left cursor-pointer group"
            title="À propos du projet"
          >
            <img
              src="/uit-logo.png"
              alt="Université Ibn Tofaïl"
              className="h-10 w-auto object-contain transition-transform group-hover:scale-[1.02]"
            />
          </button>

          <div className="hidden sm:block h-6 w-[1px] bg-[#E5E7EB]" />

          {/* User requested: "Gestion des Evenements" instead of "UIT Kenitra / Espace Etudiant" */}
          <div className="hidden sm:flex items-center">
            <span className="text-sm font-semibold text-neutral-900 tracking-tight">
              Gestion des Événements
            </span>
          </div>
        </div>

        {/* Navigation Actions */}
        <div className="flex items-center gap-4">

          {/* Admin quick links */}
          {user.role === 'ADMIN' && (
            <div className="hidden md:flex items-center gap-2 pr-3 border-r border-[#E5E7EB]">
              <a
                href={getBackendUrl('/swagger-ui/index.html')}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs font-medium text-neutral-500 hover:text-neutral-900 px-2.5 py-1.5 rounded-lg hover:bg-neutral-100 transition"
                title="Documentation interactive OpenAPI / Swagger"
              >
                <span>Swagger API</span>
                <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
              </a>
              <a
                href={getBackendUrl('/h2-console')}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs font-medium text-neutral-500 hover:text-neutral-900 px-2.5 py-1.5 rounded-lg hover:bg-neutral-100 transition"
                title="Console Base de données H2 (JDBC: jdbc:h2:file:./data/eventdb;AUTO_SERVER=TRUE)"
              >
                <span>Base H2</span>
                <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
              </a>
            </div>
          )}

          {/* Logged in Profile Badge (Legible, beautiful, well-proportioned) */}
          <div className="flex items-center gap-3 bg-white border border-[#E5E7EB] rounded-xl px-3.5 py-2 shadow-2xs">
            <div className="w-8 h-8 rounded-full bg-[#EBF1FD] text-[#002B7F] flex items-center justify-center font-bold text-xs shrink-0">
              {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="text-left hidden sm:block pr-1">
              <div className="text-xs font-bold text-neutral-900 leading-tight">
                {user.fullName}
              </div>
              <div className="text-[11px] text-neutral-500 flex items-center gap-1 mt-0.5">
                {user.role === 'ADMIN' ? (
                  <span className="font-semibold text-[#002B7F] flex items-center gap-0.5">
                    <ShieldCheck className="w-3 h-3" /> Administrateur
                  </span>
                ) : (
                  <span>{user.studentId || 'GLCC-2026'}</span>
                )}
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-neutral-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition border border-[#E5E7EB]"
            title="Déconnexion"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Déconnexion</span>
          </button>
        </div>
      </div>
    </header>
  );
}
