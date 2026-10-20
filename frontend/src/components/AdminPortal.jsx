import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Trash2, 
  Plus, 
  Search, 
  CheckCircle2, 
  ShieldCheck, 
  QrCode, 
  MapPin, 
  Calendar, 
  RotateCcw 
} from 'lucide-react';
import { api } from '../api';
import CreateEventModal from './CreateEventModal';
import { getCategoryColorStyle } from '../utils/colors';

export default function AdminPortal({ onOpenBadge, onShowToast }) {
  const [activeTab, setActiveTab] = useState('events'); // 'events' | 'guests'
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [selectedEventFilter, setSelectedEventFilter] = useState(null);
  const [searchGuest, setSearchGuest] = useState('');
  const [loading, setLoading] = useState(true);

  // Modal create event
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [evData, regData] = await Promise.all([
        api.events.getAll(),
        api.registrations.getAll(),
      ]);
      setEvents(evData || []);
      setRegistrations(regData || []);
    } catch (err) {
      console.error('Failed to load admin data:', err);
      onShowToast?.({ type: 'error', message: 'Erreur de chargement des données.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDeleteEvent = async (eventId, title) => {
    if (!window.confirm(`Supprimer l'événement "${title}" et toutes ses inscriptions associées ?`)) {
      return;
    }
    try {
      await api.events.delete(eventId);
      onShowToast?.({
        type: 'success',
        message: `Événement "${title}" supprimé avec succès.`,
      });
      await loadData();
    } catch (err) {
      console.error('Delete event failed:', err);
      onShowToast?.({ type: 'error', message: 'Impossible de supprimer l\'événement.' });
    }
  };

  // Invalidate presence by registration ID
  const handleInvalidateRegistration = async (id, name) => {
    try {
      await api.registrations.invalidate(id);
      onShowToast?.({
        type: 'info',
        message: `Présence invalidée pour ${name}.`,
      });
      await loadData();
    } catch (err) {
      console.error('Invalidate failed:', err);
      onShowToast?.({ type: 'error', message: 'Erreur lors de l\'invalidation.' });
    }
  };

  // Check in presence by registration ID
  const handleCheckinRegistration = async (id, name) => {
    try {
      await api.registrations.checkin(id);
      onShowToast?.({
        type: 'success',
        message: `Présence validée pour ${name}.`,
      });
      await loadData();
    } catch (err) {
      console.error('Checkin failed:', err);
      onShowToast?.({ type: 'error', message: 'Erreur lors de la validation.' });
    }
  };

  // Filter attendees
  const filteredGuests = registrations.filter((reg) => {
    const matchesEvent = selectedEventFilter
      ? reg.event && reg.event.id === selectedEventFilter
      : true;
    const matchesSearch =
      reg.fullName.toLowerCase().includes(searchGuest.toLowerCase()) ||
      reg.email.toLowerCase().includes(searchGuest.toLowerCase()) ||
      reg.badgeCode.toLowerCase().includes(searchGuest.toLowerCase());
    return matchesEvent && matchesSearch;
  });

  return (
    <div className="flex-1 max-w-7xl mx-auto px-6 sm:px-8 py-10 w-full">
      {/* Top Banner & Tab Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between pb-7 border-b border-[#E5E7EB] mb-8 gap-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">
              Console d'Administration
            </h1>
            <span className="text-xs font-semibold bg-[#EBF1FD] text-[#002B7F] px-3 py-1 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Espace Officiel
            </span>
          </div>
          <p className="text-sm text-neutral-500 mt-1.5">
            Gérez les séminaires universitaires et suivez les présences des participants.
          </p>
        </div>

        {/* Clean, Roomy Tab switcher (2 streamlined tabs) */}
        <div className="inline-flex items-center bg-[#EDEDEB] p-1.5 rounded-xl border border-[#E5E7EB] shrink-0">
          <button
            onClick={() => setActiveTab('events')}
            className={`text-xs font-semibold px-4 py-2.5 rounded-lg transition-all ${
              activeTab === 'events'
                ? 'bg-white text-neutral-900 shadow-sm'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Événements ({events.length})
          </button>
          <button
            onClick={() => setActiveTab('guests')}
            className={`text-xs font-semibold px-4 py-2.5 rounded-lg transition-all ${
              activeTab === 'guests'
                ? 'bg-white text-neutral-900 shadow-sm'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Participants ({registrations.length})
          </button>
        </div>
      </div>

      {/* TAB 1: Events Management */}
      {activeTab === 'events' && (
        <motion.div
          key="tab-events"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18 }}
          className="space-y-4"
        >
          {/* Events Toolbar with correctly placed "Ajouter" button */}
          <div className="flex items-center justify-between pb-1">
            <div>
              <h2 className="text-sm font-bold text-neutral-900">
                Catalogue des Séminaires ({events.length})
              </h2>
              <p className="text-xs text-neutral-500">
                Événements académiques programmés à la Faculté des Sciences
              </p>
            </div>

            {/* Button saying "Ajouter" with plus icon */}
            <button
              onClick={() => setIsCreateOpen(true)}
              className="inline-flex items-center gap-2 bg-[#002B7F] hover:bg-[#001F5C] active:bg-[#001642] text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition shadow-2xs"
            >
              <Plus className="w-4 h-4" />
              <span>Ajouter</span>
            </button>
          </div>

          <div className="bg-white border border-[#E5E7EB] rounded-2xl divide-y divide-[#E5E7EB] overflow-hidden shadow-2xs">
            {loading ? (
              <div className="p-16 text-center text-xs text-neutral-400">
                Chargement des événements...
              </div>
            ) : events.length === 0 ? (
              <div className="p-16 text-center text-xs text-neutral-400">
                Aucun événement publié pour le moment. Cliquez sur "Ajouter" pour en créer un.
              </div>
            ) : (
              events.map((ev) => {
                const count = registrations.filter(
                  (r) => r.event && r.event.id === ev.id
                ).length;
                const ratio = Math.min(Math.round((count / (ev.capacity || 100)) * 100), 100);

                return (
                  <div
                    key={ev.id}
                    className="p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:bg-[#F9F9F8] transition"
                  >
                    <div className="flex-1">
                      {/* Category Box with Selected Dynamic Color */}
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded ${getCategoryColorStyle(ev.color)}`}>
                        {ev.category}
                      </span>
                      <h2 className="text-base font-bold text-neutral-900 mt-1.5">
                        {ev.title}
                      </h2>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-500 mt-2">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                          <span>{ev.date}</span>
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                          <span>{ev.location}</span>
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-neutral-400" />
                          <span>
                            <strong>{count}</strong> / {ev.capacity} inscrits ({ratio}%)
                          </span>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                      <button
                        onClick={() => {
                          setSelectedEventFilter(ev.id);
                          setActiveTab('guests');
                        }}
                        className="inline-flex items-center gap-1.5 bg-[#F7F7F5] hover:bg-neutral-200/80 text-neutral-800 text-xs font-semibold px-4 py-2.5 rounded-xl transition border border-[#E5E7EB]"
                      >
                        <Users className="w-3.5 h-3.5 text-neutral-500" />
                        <span>Inscrits ({count})</span>
                      </button>

                      <button
                        onClick={() => handleDeleteEvent(ev.id, ev.title)}
                        className="p-2.5 text-red-600 hover:bg-red-50 rounded-xl transition border border-red-100"
                        title="Supprimer l'événement"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </motion.div>
      )}

      {/* TAB 2: Attendees Database View */}
      {activeTab === 'guests' && (
        <motion.div
          key="tab-guests"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18 }}
          className="space-y-4"
        >
          {/* Well-proportioned Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-[#E5E7EB] rounded-2xl p-4 shadow-2xs">
            <div className="relative w-full sm:w-96">
              <Search className="w-4 h-4 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchGuest}
                onChange={(e) => setSearchGuest(e.target.value)}
                placeholder="Rechercher par nom, email ou code badge..."
                className="w-full bg-[#F7F7F5] border border-[#E5E7EB] rounded-xl pl-11 pr-4 py-2.5 text-xs text-neutral-900 focus:bg-white focus:border-[#002B7F] transition placeholder:text-neutral-400"
              />
            </div>

            {/* Event Filter Dropdown */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-neutral-500 font-medium whitespace-nowrap hidden sm:inline">
                Filtrer par séminaire :
              </span>
              <select
                value={selectedEventFilter || ''}
                onChange={(e) => setSelectedEventFilter(e.target.value ? Number(e.target.value) : null)}
                className="w-full sm:w-auto text-xs bg-[#F7F7F5] border border-[#E5E7EB] rounded-xl px-3.5 py-2.5 text-neutral-800 font-medium focus:border-[#002B7F]"
              >
                <option value="">Tous les événements ({registrations.length})</option>
                {events.map((ev) => (
                  <option key={ev.id} value={ev.id}>
                    {ev.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Attendees List with Invalidate / Validate Functionality */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl divide-y divide-[#E5E7EB] overflow-hidden shadow-2xs">
            {filteredGuests.length === 0 ? (
              <div className="p-16 text-center text-xs text-neutral-400">
                Aucun participant ne correspond aux critères de recherche.
              </div>
            ) : (
              filteredGuests.map((reg) => (
                <div
                  key={reg.id}
                  className="p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#F9F9F8] transition"
                >
                  <div className="flex items-center gap-4">
                    {/* Status Dot */}
                    <div
                      className={`w-3 h-3 rounded-full shrink-0 ${
                        reg.checkedIn ? 'bg-emerald-500' : 'bg-neutral-300'
                      }`}
                      title={reg.checkedIn ? 'Présence validée' : 'Non émargé'}
                    />

                    <div>
                      <div className="flex items-center gap-2.5">
                        <span className="text-sm font-bold text-neutral-900">
                          {reg.fullName}
                        </span>
                        <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-neutral-100 text-neutral-700 border border-neutral-200">
                          {reg.badgeCode}
                        </span>
                        {reg.checkedIn ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Présent</span>
                          </span>
                        ) : (
                          <span className="text-[11px] font-medium text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-full">
                            Non émargé
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500 mt-1">
                        <span>{reg.email}</span>
                        <span>•</span>
                        <span className="font-medium text-neutral-700">
                          {reg.studentId || 'GLCC-2026'}
                        </span>
                        <span>•</span>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${getCategoryColorStyle(reg.event?.color)}`}>
                          {reg.event ? reg.event.title : 'Événement'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions: Validate, Invalidate, Preview Badge */}
                  <div className="shrink-0 flex items-center gap-2">
                    {reg.checkedIn ? (
                      <button
                        onClick={() => handleInvalidateRegistration(reg.id, reg.fullName)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3 py-2 rounded-xl transition"
                        title="Invalider la présence pour ce participant"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
                        <span>Invalider</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleCheckinRegistration(reg.id, reg.fullName)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-2 rounded-xl transition"
                        title="Valider manuellement la présence"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Valider</span>
                      </button>
                    )}

                    <button
                      onClick={() => onOpenBadge(reg)}
                      className="inline-flex items-center gap-1.5 bg-[#002B7F] hover:bg-[#001F5C] text-white text-xs font-medium px-4 py-2 rounded-xl transition"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>Badge QR</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      )}

      {/* Modal to Create Event */}
      <CreateEventModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreated={(newEvent) => {
          onShowToast?.({
            type: 'success',
            message: `Événement "${newEvent.title}" publié avec succès !`,
          });
          loadData();
        }}
      />
    </div>
  );
}
