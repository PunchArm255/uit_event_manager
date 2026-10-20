import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Printer, ShieldCheck } from 'lucide-react';
import QRCode from 'qrcode';
import html2canvas from 'html2canvas';

import { getCategoryColorStyle } from '../utils/colors';

export default function BadgeModal({ badge, isOpen, onClose }) {
  const canvasRef = useRef(null);
  const badgeCardRef = useRef(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!isOpen || !badge || !canvasRef.current) return;

    // Generate cryptographic QR code payload
    const qrPayload = JSON.stringify({
      code: badge.badgeCode,
      holder: badge.fullName,
      id: badge.studentId,
      event: badge.event ? badge.event.title : 'UIT Event',
      issuedBy: 'Université Ibn Tofaïl',
      sig: `SIG-${badge.badgeCode}-${badge.id || '0'}`
    });

    QRCode.toCanvas(
      canvasRef.current,
      qrPayload,
      {
        width: 170,
        margin: 1,
        color: {
          dark: '#002B7F',
          light: '#FFFFFF',
        },
        errorCorrectionLevel: 'M',
      },
      (error) => {
        if (error) console.error('QR code generation failed:', error);
      }
    );
  }, [isOpen, badge]);

  if (!isOpen || !badge) return null;

  const eventTitle = badge.event ? badge.event.title : "Conférence Académique UIT";
  const eventCategory = badge.event ? badge.event.category : "UNIVERSITÉ IBN TOFAÏL";
  const eventDate = badge.event ? badge.event.date : "Date à confirmer";
  const eventLocation = badge.event ? badge.event.location : "Faculté des Sciences, Kénitra";

  const handleDownload = async () => {
    if (!badgeCardRef.current) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(badgeCardRef.current, {
        scale: 2.5,
        backgroundColor: '#FFFFFF',
        useCORS: true,
      });
      const link = document.createElement('a');
      link.download = `Badge-${badge.badgeCode}-${badge.fullName.replace(/\s+/g, '_')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Failed to download badge:', err);
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
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

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className="relative z-10 flex flex-col items-center max-w-sm w-full"
        >
          {/* Printable Notion Badge */}
          <div
            ref={badgeCardRef}
            id="printableBadge"
            className="w-full bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-xl text-neutral-900"
          >
            {/* Solid UIT Royal Blue Header */}
            <div className="bg-[#002B7F] px-6 py-5 text-white">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-blue-100">
                  Université Ibn Tofaïl
                </span>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                    badge.checkedIn
                      ? 'bg-emerald-500 text-white'
                      : 'bg-white/20 text-white'
                  }`}
                >
                  {badge.checkedIn ? 'PRÉSENCE VALIDÉE' : 'BADGE VALIDE'}
                </span>
              </div>
              <h2 className="text-base font-bold tracking-tight">Badge d'Accès Officiel</h2>
              <div className="text-[11px] text-blue-200">
                Faculté des Sciences • Campus Kénitra
              </div>
            </div>

            {/* Badge Body */}
            <div className="p-6">
              {/* Event Info */}
              <div className="mb-4">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded ${getCategoryColorStyle(badge.event?.color)}`}>
                  {eventCategory}
                </span>
                <h3 className="text-sm font-bold text-neutral-900 mt-2 leading-snug">
                  {eventTitle}
                </h3>
                <p className="text-xs text-neutral-500 mt-1">
                  {eventDate} • {eventLocation}
                </p>
              </div>

              {/* Perforated Divider */}
              <div className="relative my-5">
                <div className="border-t border-dashed border-[#E5E7EB]" />
                <div className="absolute -left-8 -top-2 w-4 h-4 bg-[#F7F7F5] rounded-full border-r border-[#E5E7EB]" />
                <div className="absolute -right-8 -top-2 w-4 h-4 bg-[#F7F7F5] rounded-full border-l border-[#E5E7EB]" />
              </div>

              {/* Participant Details */}
              <div className="mb-5">
                <div className="text-[10px] uppercase font-semibold tracking-wider text-neutral-400">
                  Participant Titulaire
                </div>
                <div className="text-base font-bold text-neutral-900 mt-0.5">
                  {badge.fullName}
                </div>
                <div className="text-xs text-neutral-500 mt-0.5">
                  {badge.studentId ? `${badge.studentId} • ` : ''}
                  {badge.email}
                </div>
              </div>

              {/* QR Code Container */}
              <div className="bg-[#F7F7F5] border border-[#E5E7EB] rounded-xl p-4 flex flex-col items-center justify-center">
                <canvas ref={canvasRef} className="rounded-lg shadow-2xs" />
                <div className="flex items-center gap-1.5 mt-3">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#002B7F]" />
                  <span className="text-xs font-mono font-bold tracking-wider text-neutral-900">
                    {badge.badgeCode}
                  </span>
                </div>
                <div className="text-[10px] text-neutral-400 mt-0.5">
                  Scan cryptographique aux portes d'accès
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 mt-4 w-full">
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[#002B7F] hover:bg-[#001F5C] active:bg-[#001845] text-white text-xs font-medium py-2.5 px-4 rounded-lg transition disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{downloading ? 'Génération...' : 'Télécharger PNG'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center justify-center gap-1.5 bg-white hover:bg-neutral-100 text-neutral-700 border border-[#E5E7EB] text-xs font-medium py-2.5 px-3 rounded-lg transition"
              title="Imprimer"
            >
              <Printer className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onClose}
              className="inline-flex items-center justify-center bg-white hover:bg-neutral-100 text-neutral-700 border border-[#E5E7EB] text-xs font-medium py-2.5 px-4 rounded-lg transition"
            >
              Fermer
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
