import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Welcome from './components/Welcome';
import Auth from './components/Auth';
import StudentPortal from './components/StudentPortal';
import AdminPortal from './components/AdminPortal';
import BadgeModal from './components/BadgeModal';
import AboutModal from './components/AboutModal';
import Toast from './components/Toast';

export default function App() {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('uit_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Navigation view: 'welcome' | 'auth' | 'student' | 'admin'
  const [view, setView] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    if (['welcome', 'auth', 'student', 'admin'].includes(hash)) {
      return hash;
    }
    const stored = localStorage.getItem('uit_user');
    if (stored) {
      try {
        const u = JSON.parse(stored);
        return u.role === 'ADMIN' ? 'admin' : 'student';
      } catch {
        return 'welcome';
      }
    }
    return 'welcome';
  });

  const [selectedBadge, setSelectedBadge] = useState(null);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Sync hash with view
  useEffect(() => {
    window.location.hash = view;
  }, [view]);

  // Sync back/forward browser buttons
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (['welcome', 'auth', 'student', 'admin'].includes(hash)) {
        setView(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Toast auto-dismiss
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  const handleLoginSuccess = (loggedInUser) => {
    setUser(loggedInUser);
    localStorage.setItem('uit_user', JSON.stringify(loggedInUser));
    setView(loggedInUser.role === 'ADMIN' ? 'admin' : 'student');
    setToast({
      type: 'success',
      message: `Bienvenue, ${loggedInUser.fullName} !`,
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('uit_user');
    setUser(null);
    setView('welcome');
    setToast({
      type: 'info',
      message: 'Vous êtes maintenant déconnecté.',
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F7F5] text-[#111827]">
      {/* Notion Workspace Topbar - Only shown when logged in on student or admin views */}
      {user && (view === 'student' || view === 'admin') && (
        <Navbar
          user={user}
          onNavigate={(newView) => setView(newView)}
          onOpenAbout={() => setIsAboutOpen(true)}
          onLogout={handleLogout}
        />
      )}

      {/* Main View Router with subtle Framer Motion Transition */}
      <div className="flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          {view === 'welcome' && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="flex-1 flex flex-col"
            >
              <Welcome
                onNavigate={(target) => setView(target)}
                onOpenAbout={() => setIsAboutOpen(true)}
              />
            </motion.div>
          )}

          {view === 'auth' && (
            <motion.div
              key="auth"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="flex-1 flex flex-col"
            >
              <Auth
                onLoginSuccess={handleLoginSuccess}
                onBackToWelcome={() => setView('welcome')}
              />
            </motion.div>
          )}

          {view === 'student' && (
            <motion.div
              key="student"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="flex-1 flex flex-col"
            >
              {user ? (
                <StudentPortal
                  user={user}
                  onOpenBadge={(badge) => setSelectedBadge(badge)}
                  onShowToast={(t) => setToast(t)}
                />
              ) : (
                <Auth
                  onLoginSuccess={handleLoginSuccess}
                  onBackToWelcome={() => setView('welcome')}
                />
              )}
            </motion.div>
          )}

          {view === 'admin' && (
            <motion.div
              key="admin"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="flex-1 flex flex-col"
            >
              {user && user.role === 'ADMIN' ? (
                <AdminPortal
                  user={user}
                  onOpenBadge={(badge) => setSelectedBadge(badge)}
                  onShowToast={(t) => setToast(t)}
                />
              ) : (
                <Auth
                  onLoginSuccess={handleLoginSuccess}
                  onBackToWelcome={() => setView('welcome')}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Cryptographic QR Badge Modal */}
      <BadgeModal
        badge={selectedBadge}
        isOpen={Boolean(selectedBadge)}
        onClose={() => setSelectedBadge(null)}
      />

      {/* About Project & Mohammed NASSIRI Modal */}
      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />

      {/* Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
