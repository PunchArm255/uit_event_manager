import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, MapPin, Users, Tag, PlusCircle, Check } from 'lucide-react';
import { api } from '../api';
import { CATEGORY_COLORS, getCategoryColorStyle, PRESET_CATEGORIES } from '../utils/colors';

export default function CreateEventModal({ isOpen, onClose, onCreated }) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState(PRESET_CATEGORIES[0]);
  const [color, setColor] = useState('blue');
  const [location, setLocation] = useState('');
  const [capacity, setCapacity] = useState(100);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !date.trim() || !location.trim()) {
      setError('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const created = await api.events.create({
        title: title.trim(),
        date: date.trim(),
        category,
        color,
        location: location.trim(),
        capacity: Number(capacity) || 50,
      });

      onCreated(created);
      onClose();
      // Reset form
      setTitle('');
      setDate('');
      setLocation('');
      setColor('blue');
      setCapacity(100);
    } catch (err) {
      setError(err.message || 'Erreur lors de la création de l\'événement.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 bg-black/40"
          onClick={onClose}
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 8 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className="relative w-full max-w-lg bg-white border border-[#E5E7EB] rounded-2xl shadow-xl p-7 z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#E5E7EB] mb-5">
            <div>
              <h2 className="text-lg font-bold text-neutral-900 tracking-tight">
                Publier un nouvel événement
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Séminaire, conférence ou atelier pour la Faculté des Sciences
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Titre de l'événement <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="ex: Séminaire Architecture Microservices & Kubernetes"
                className="w-full bg-white border border-[#E5E7EB] rounded-lg px-3.5 py-2.5 text-sm text-neutral-900 focus:border-[#002B7F] transition placeholder:text-neutral-400"
              />
            </div>

            {/* Date & Category in 2 columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Date & Horaire <span className="text-red-500">*</span></span>
                </label>
                <input
                  type="text"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  placeholder="28 Nov 2026 • 10:00"
                  className="w-full bg-white border border-[#E5E7EB] rounded-lg px-3.5 py-2.5 text-sm text-neutral-900 focus:border-[#002B7F] transition placeholder:text-neutral-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Catégorie</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-white border border-[#E5E7EB] rounded-lg px-3.5 py-2.5 text-sm text-neutral-900 focus:border-[#002B7F] transition"
                >
                  {PRESET_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Category Color Selection (6 Options) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold text-neutral-700">
                  Couleur du badge catégorie
                </label>
                {/* Live preview */}
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded ${getCategoryColorStyle(color)}`}>
                  Aperçu : {category}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                {CATEGORY_COLORS.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setColor(c.id)}
                    className={`relative w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      color === c.id
                        ? 'ring-2 ring-offset-2 ring-neutral-900 scale-105'
                        : 'hover:scale-105 opacity-85 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.label}
                  >
                    {color === c.id && (
                      <Check className="w-4 h-4 text-white drop-shadow-sm" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Location & Capacity */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Lieu sur le campus <span className="text-red-500">*</span></span>
                </label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Amphi Central — FS Kénitra"
                  className="w-full bg-white border border-[#E5E7EB] rounded-lg px-3.5 py-2.5 text-sm text-neutral-900 focus:border-[#002B7F] transition placeholder:text-neutral-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Capacité</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  required
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  className="w-full bg-white border border-[#E5E7EB] rounded-lg px-3.5 py-2.5 text-sm text-neutral-900 focus:border-[#002B7F] transition"
                />
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-4 border-t border-[#E5E7EB] flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-lg border border-[#E5E7EB] text-xs font-medium text-neutral-700 hover:bg-neutral-50 transition"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-1.5 bg-[#002B7F] hover:bg-[#001F5C] active:bg-[#001642] text-white text-xs font-medium px-5 py-2.5 rounded-lg transition disabled:opacity-50"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>{loading ? 'Publication...' : 'Publier l\'événement'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
