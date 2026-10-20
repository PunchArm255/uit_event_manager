import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Lock, Mail, User as UserIcon, GraduationCap, ShieldCheck, ArrowRight } from 'lucide-react';
import { api } from '../api';

export default function Auth({ onLoginSuccess, onBackToWelcome }) {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [email, setEmail] = useState('mohammed.nassiri@uit.ac.ma');
  const [password, setPassword] = useState('student123');
  const [fullName, setFullName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let user;
      if (mode === 'login') {
        user = await api.auth.login(email.trim(), password);
      } else {
        if (!fullName.trim()) {
          setError('Veuillez renseigner votre nom complet.');
          setLoading(false);
          return;
        }
        user = await api.auth.signup({
          fullName: fullName.trim(),
          email: email.trim(),
          password,
          studentId: studentId.trim() || 'GLCC-2026',
        });
      }

      onLoginSuccess(user);
    } catch (err) {
      if (mode === 'login') {
        setError('Identifiants incorrects ou compte inexistant.');
      } else {
        if (err.status === 409 || err.message?.includes('déjà') || err.message?.toLowerCase().includes('bad request')) {
          setError('Cet email est déjà associé à un compte étudiant. Veuillez vous connecter.');
        } else {
          setError(err.message || 'Erreur lors de la création du compte.');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
    setLoading(true);
    try {
      const user = await api.auth.login(demoEmail, demoPassword);
      onLoginSuccess(user);
    } catch {
      setError('Erreur de connexion avec le compte démo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center px-4 py-12 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-sm"
      >
        {/* Logo & Header */}
        <div className="flex flex-col items-center mb-8 text-center">
          <button
            onClick={onBackToWelcome}
            className="mb-5 transition hover:opacity-80"
          >
            <img
              src="/uit-logo.png"
              alt="Université Ibn Tofaïl"
              className="h-14 w-auto object-contain"
            />
          </button>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">
            {mode === 'login' ? 'Espace Authentification' : 'Créer un compte étudiant'}
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            {mode === 'login'
              ? 'Accédez à votre compte Université Ibn Tofaïl'
              : 'Inscrivez-vous avec votre email académique'}
          </p>
        </div>

        {/* Notion / Linear Style Card */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-7 shadow-sm">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                    Nom complet
                  </label>
                  <div className="relative flex items-center">
                    <UserIcon className="w-4 h-4 text-neutral-400 absolute left-3.5 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Nom et Prénom"
                      className="w-full bg-white border border-[#E5E7EB] rounded-lg pl-10 pr-3.5 py-2.5 text-sm text-neutral-900 focus:border-[#002B7F] transition placeholder:text-neutral-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                    Filière
                  </label>
                  <div className="relative flex items-center">
                    <GraduationCap className="w-4 h-4 text-neutral-400 absolute left-3.5 pointer-events-none" />
                    <input
                      type="text"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      placeholder="GLCC, ISI, etc..."
                      className="w-full bg-white border border-[#E5E7EB] rounded-lg pl-10 pr-3.5 py-2.5 text-sm text-neutral-900 focus:border-[#002B7F] transition placeholder:text-neutral-400"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Adresse email UIT
              </label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nom.prenom@uit.ac.ma"
                  className="w-full bg-white border border-[#E5E7EB] rounded-lg pl-10 pr-3.5 py-2.5 text-sm text-neutral-900 focus:border-[#002B7F] transition placeholder:text-neutral-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Mot de passe
              </label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white border border-[#E5E7EB] rounded-lg pl-10 pr-3.5 py-2.5 text-sm text-neutral-900 focus:border-[#002B7F] transition placeholder:text-neutral-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#002B7F] hover:bg-[#001F5C] active:bg-[#001642] text-white font-medium text-sm py-2.5 rounded-lg transition disabled:opacity-50 mt-2 flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Connexion en cours...' : mode === 'login' ? 'Continuer' : "S'inscrire"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Toggle Login / Signup */}
          <div className="mt-5 pt-5 border-t border-[#E5E7EB] text-center">
            <button
              type="button"
              onClick={() => {
                setMode(mode === 'login' ? 'signup' : 'login');
                setError('');
              }}
              className="text-xs font-semibold text-[#002B7F] hover:underline"
            >
              {mode === 'login'
                ? 'Pas encore de compte ? Créer un compte étudiant'
                : 'Déjà inscrit ? Se connecter'}
            </button>
          </div>
        </div>

        {/* 1-Click Subtle Demo Switcher for Presentation */}
        <div className="mt-6 bg-white border border-[#E5E7EB] rounded-xl p-3.5">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-2 text-center">
            Comptes démo
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('mohammed.nassiri@uit.ac.ma', 'student123')}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-[#E5E7EB] hover:bg-neutral-50 active:bg-neutral-100 text-xs font-medium text-neutral-800 transition"
            >
              <UserIcon className="w-3.5 h-3.5 text-[#002B7F]" />
              <span>Étudiant</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('admin@uit.ac.ma', 'admin123')}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-[#E5E7EB] hover:bg-neutral-50 active:bg-neutral-100 text-xs font-medium text-neutral-800 transition"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#002B7F]" />
              <span>Administrateur</span>
            </button>
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-4 text-center">
          <button
            onClick={onBackToWelcome}
            className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-neutral-700 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Retour à l'accueil</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
