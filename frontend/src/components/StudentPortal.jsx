import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Users, 
  QrCode, 
  Search, 
  Clock, 
  Ticket, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { api } from '../api';
import { getCategoryColorStyle } from '../utils/colors';

export default function StudentPortal({ user, onOpenBadge, onShowToast }) {
  const [activeTab, setActiveTab] = useState('agenda'); // 'agenda' | 'passes'
  const [events, setEvents] = useState([]);
  const [allRegistrations, setAllRegistrations] = useState([]);
  const [myPasses, setMyPasses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [registeringId, setRegisteringId] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [eventsData, allRegsData, myPassesData] = await Promise.all([
        api.events.getAll(),
        api.registrations.getAll(),
        api.registrations.getAll({ email: user.email }),
      ]);
      setEvents(eventsData || []);
      setAllRegistrations(allRegsData || []);
      setMyPasses(myPassesData || []);
    } catch (err) {
      console.error('Failed to load student portal data:', err);
      onShowToast?.({ type: 'error', message: 'Erreur lors du chargement des données.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user.email]);

  const handleRegister = async (event) => {
    setRegisteringId(event.id);
    try {
      const newBadge = await api.registrations.register(event.id, {
        fullName: user.fullName,
        email: user.email,
        role: user.studentId ? `Étudiant (${user.studentId})` : 'Master GLCC',
        studentId: user.studentId || 'GLCC-2026',
      });

      onShowToast?.({
        type: 'success',
        message: `Inscription confirmée pour "${event.title}" !`,
      });

      await loadData();
      onOpenBadge(newBadge);
    } catch (err) {
      console.error('Registration failed:', err);
      onShowToast?.({
        type: 'error',
        message: err.message || 'Impossible de compléter l\'inscription.',
      });
    } finally {
      setRegisteringId(null);
    }
  };

  // Categories list
  const categories = ['ALL', ...new Set(events.map((e) => e.category).filter(Boolean))];

  // Filter events
  const filteredEvents = events.filter((e) => {
    const matchesSearch =
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'ALL' || e.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex-1 max-w-7xl mx-auto px-6 sm:px-8 py-10 w-full">
      {/* Welcome Greeting Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between pb-7 border-b border-[#E5E7EB] mb-8 gap-5">
        <div>
          {/* User requested: "Bonjour, Mohammed !" with no badge next to it */}
          <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">
            Bonjour, {user.fullName ? user.fullName.split(' ')[0] : 'Mohammed'} !
          </h1>
          {/* User requested: remove "Faculté des Sciences de Kénitra" from the subtitle */}
          <p className="text-sm text-neutral-500 mt-1.5">
            Réservez vos conférences et téléchargez vos badges d'accès officiels.
          </p>
        </div>

        {/* Well-proportioned Toggle between Agenda and Mes Badges */}
        <div className="inline-flex items-center bg-[#EDEDEB] p-1.5 rounded-xl border border-[#E5E7EB] shrink-0">
          <button
            onClick={() => setActiveTab('agenda')}
            className={`text-xs font-semibold px-5 py-2.5 rounded-lg transition-all ${
              activeTab === 'agenda'
                ? 'bg-white text-neutral-900 shadow-sm'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Agenda des Conférences
          </button>
          <button
            onClick={() => setActiveTab('passes')}
            className={`text-xs font-semibold px-5 py-2.5 rounded-lg transition-all ${
              activeTab === 'passes'
                ? 'bg-white text-neutral-900 shadow-sm'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Mes Badges ({myPasses.length})
          </button>
        </div>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Agenda or Mes Badges Feed */}
        <div className="lg:col-span-8 space-y-6">
          {activeTab === 'agenda' && (
            <motion.div
              key="agenda-view"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.18 }}
              className="space-y-6"
            >
              {/* Revamped, Non-squished Search & Category Filter Toolbar */}
              <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-2xs space-y-4">
                {/* Search Bar */}
                <div className="relative w-full">
                  <Search className="w-4 h-4 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher une conférence par titre, lieu ou mot-clé..."
                    className="w-full pl-11 pr-4 py-2.5 text-sm bg-[#F7F7F5] border border-[#E5E7EB] rounded-xl text-neutral-900 focus:border-[#002B7F] focus:bg-white transition placeholder:text-neutral-400"
                  />
                </div>

                {/* Category Chips with generous proportions */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-xs font-semibold text-neutral-400 mr-1">Filtres :</span>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`text-xs font-medium px-3.5 py-1.5 rounded-lg transition-all ${
                        selectedCategory === cat
                          ? 'bg-[#002B7F] text-white shadow-2xs'
                          : 'bg-[#F7F7F5] border border-[#E5E7EB] text-neutral-700 hover:bg-neutral-200/70'
                      }`}
                    >
                      {cat === 'ALL' ? 'Tous les événements' : cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Editorial List */}
              <div className="bg-white border border-[#E5E7EB] rounded-2xl divide-y divide-[#E5E7EB] overflow-hidden shadow-2xs">
                {loading ? (
                  <div className="p-16 text-center text-xs text-neutral-400">
                    Chargement des conférences universitaires...
                  </div>
                ) : filteredEvents.length === 0 ? (
                  <div className="p-16 text-center text-xs text-neutral-400">
                    Aucun événement ne correspond à votre recherche.
                  </div>
                ) : (
                  filteredEvents.map((ev) => {
                    const myPass = myPasses.find((p) => p.event && p.event.id === ev.id);
                    const count = allRegistrations.filter(
                      (r) => r.event && r.event.id === ev.id
                    ).length;
                    const ratio = Math.min(Math.round((count / (ev.capacity || 100)) * 100), 100);
                    const isFull = count >= ev.capacity && !myPass;

                    const parts = (ev.date || '').split('•');
                    const datePart = parts[0] ? parts[0].trim() : ev.date;
                    const timePart = parts[1] ? parts[1].trim() : '';

                    return (
                      <div
                        key={ev.id}
                        className="p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:bg-[#F9F9F8] transition"
                      >
                        {/* Left: Date & Time Column */}
                        <div className="sm:w-40 shrink-0">
                          <div className="text-sm font-bold text-[#002B7F] tracking-tight">
                            {datePart}
                          </div>
                          {timePart && (
                            <div className="inline-flex items-center gap-1.5 text-xs text-neutral-500 mt-1">
                              <Clock className="w-3.5 h-3.5 text-neutral-400" />
                              <span>{timePart}</span>
                            </div>
                          )}
                        </div>

                        {/* Middle: Event details */}
                        <div className="flex-1">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded ${getCategoryColorStyle(ev.color)}`}>
                            {ev.category}
                          </span>
                          <h2 className="text-base font-bold text-neutral-900 mt-1.5 leading-snug">
                            {ev.title}
                          </h2>
                          <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-500 mt-2">
                            <span className="flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                              <span>{ev.location}</span>
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Users className="w-3.5 h-3.5 text-neutral-400" />
                              <span>
                                <strong>{count}</strong> / {ev.capacity} inscrits
                              </span>
                            </span>
                          </div>

                          {/* Capacity progress bar */}
                          <div className="mt-2.5 max-w-xs w-full bg-[#E5E7EB] h-1.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all duration-300 ${
                                ratio >= 90 ? 'bg-amber-600' : 'bg-[#002B7F]'
                              }`}
                              style={{ width: `${ratio}%` }}
                            />
                          </div>
                        </div>

                        {/* Right: Action Button (User requested: "S'inscrire" instead of "S'inscrire en 1 clic") */}
                        <div className="shrink-0 flex items-center">
                          {myPass ? (
                            <button
                              onClick={() => onOpenBadge(myPass)}
                              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#111827] hover:bg-neutral-800 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition shadow-2xs"
                            >
                              <QrCode className="w-3.5 h-3.5" />
                              <span>Voir mon badge QR</span>
                            </button>
                          ) : isFull ? (
                            <span className="text-xs font-semibold text-neutral-400 bg-neutral-100 px-4 py-2.5 rounded-xl">
                              Complet
                            </span>
                          ) : (
                            <button
                              onClick={() => handleRegister(ev)}
                              disabled={registeringId === ev.id}
                              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#002B7F] hover:bg-[#001F5C] active:bg-[#001642] text-white text-xs font-semibold px-6 py-2.5 rounded-xl transition shadow-2xs disabled:opacity-50"
                            >
                              <span>{registeringId === ev.id ? 'Inscription...' : "S'inscrire"}</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'passes' && (
            <motion.div
              key="passes-view"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.18 }}
              className="space-y-4"
            >
              {myPasses.length === 0 ? (
                <div className="bg-white border border-[#E5E7EB] rounded-2xl p-16 text-center">
                  <Ticket className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                  <h3 className="text-base font-bold text-neutral-900">
                    Vous n'avez aucun badge pour le moment
                  </h3>
                  <p className="text-xs text-neutral-500 max-w-sm mx-auto mt-1 mb-5">
                    Consultez le calendrier des séminaires pour vous inscrire en un clic et générer vos badges QR.
                  </p>
                  <button
                    onClick={() => setActiveTab('agenda')}
                    className="inline-flex items-center gap-2 bg-[#002B7F] hover:bg-[#001F5C] text-white text-xs font-medium px-5 py-2.5 rounded-xl transition"
                  >
                    <span>Voir l'agenda</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {myPasses.map((p) => (
                    <div
                      key={p.id}
                      className="bg-white border border-[#E5E7EB] rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-neutral-300 transition shadow-2xs"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="font-mono text-xs font-bold text-[#002B7F] bg-[#EBF1FD] px-2.5 py-0.5 rounded">
                            {p.badgeCode}
                          </span>
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded ${
                              p.checkedIn
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-neutral-100 text-neutral-600'
                            }`}
                          >
                            {p.checkedIn ? '✓ Présence Validée' : 'Badge Prêt pour scan'}
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-neutral-900">
                          {p.event ? p.event.title : 'Conférence UIT'}
                        </h3>

                        <p className="text-xs text-neutral-500 mt-1">
                          {p.event ? `${p.event.date} • ${p.event.location}` : ''}
                        </p>
                      </div>

                      <div className="shrink-0 flex items-center gap-2">
                        <button
                          onClick={() => onOpenBadge(p)}
                          className="inline-flex items-center gap-2 bg-[#002B7F] hover:bg-[#001F5C] text-white text-xs font-medium px-4 py-2.5 rounded-xl transition"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                          <span>Afficher le QR & Badge</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* Right Side: User requested - Soonest upcoming events already registered in */}
        <div className="lg:col-span-4 sticky top-28 space-y-4">
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-2xs">
            <div className="flex items-center justify-between pb-4 border-b border-[#E5E7EB] mb-4">
              <div className="flex items-center gap-2">
                <Ticket className="w-4 h-4 text-[#002B7F]" />
                <h3 className="text-sm font-bold text-neutral-900 tracking-tight">
                  Mes Prochains Événements
                </h3>
              </div>
              <span className="text-xs font-bold text-[#002B7F] bg-[#EBF1FD] px-2.5 py-0.5 rounded-full">
                {myPasses.length}
              </span>
            </div>

            {myPasses.length === 0 ? (
              <div className="py-8 text-center text-xs text-neutral-400">
                <p className="font-medium text-neutral-600 mb-1">Aucune inscription active</p>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  Inscrivez-vous aux conférences de l'agenda pour voir vos prochains rendez-vous ici.
                </p>
              </div>
            ) : (
              <div className="space-y-3.5">
                {myPasses.slice(0, 4).map((pass) => (
                  <div
                    key={pass.id}
                    className="p-4 rounded-xl bg-[#F7F7F5] border border-[#E5E7EB] hover:border-neutral-300 transition"
                  >
                    <div className="flex items-center justify-between text-[11px] mb-1.5">
                      <span className="font-bold text-[#002B7F]">
                        {pass.event ? pass.event.date.split('•')[0].trim() : 'Date'}
                      </span>
                      <span className="font-mono text-[10px] font-semibold text-neutral-600 bg-white px-2 py-0.5 rounded border border-[#E5E7EB]">
                        {pass.badgeCode}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-neutral-900 line-clamp-2 leading-snug">
                      {pass.event ? pass.event.title : 'Conférence UIT'}
                    </h4>

                    <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 mt-1.5">
                      <MapPin className="w-3 h-3 text-neutral-400 shrink-0" />
                      <span className="truncate">{pass.event ? pass.event.location : ''}</span>
                    </div>

                    <div className="mt-3 pt-3 border-t border-neutral-200/60 flex items-center justify-between">
                      <span className="text-[10px] font-medium text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Place confirmée</span>
                      </span>

                      <button
                        onClick={() => onOpenBadge(pass)}
                        className="text-[11px] font-bold text-[#002B7F] hover:underline flex items-center gap-1"
                      >
                        <span>Voir Badge</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
