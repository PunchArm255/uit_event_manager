/**
 * Category Color Options & Tailwind Mappings
 * Notion-inspired minimalist flat color tags
 */

export const PRESET_CATEGORIES = [
  'Cloud & DevOps',
  'Intelligence Artificielle',
  'Cybersécurité',
  'Workshop & Atelier',
  'Conférence & Recherche',
  'Forum & Carrière',
];

export const CATEGORY_COLORS = [
  { id: 'blue', label: 'Bleu UIT', hex: '#002B7F', bg: 'bg-[#EBF1FD]', text: 'text-[#002B7F]', border: 'border-[#C7D7F8]' },
  { id: 'emerald', label: 'Émeraude', hex: '#0D7A57', bg: 'bg-[#E6F8F0]', text: 'text-[#0D7A57]', border: 'border-[#B4E8D2]' },
  { id: 'amber', label: 'Ambre', hex: '#D97706', bg: 'bg-[#FEF3C7]', text: 'text-[#B45309]', border: 'border-[#FDE68A]' },
  { id: 'purple', label: 'Violet', hex: '#7E22CE', bg: 'bg-[#F3E8FF]', text: 'text-[#6B21A8]', border: 'border-[#E9D5FF]' },
  { id: 'rose', label: 'Rose', hex: '#E11D48', bg: 'bg-[#FFE4E6]', text: 'text-[#BE123C]', border: 'border-[#FECDD3]' },
  { id: 'slate', label: 'Gris Neutre', hex: '#475569', bg: 'bg-[#F1F5F9]', text: 'text-[#334155]', border: 'border-[#CBD5E1]' },
];

export function getCategoryColorStyle(colorId) {
  const found = CATEGORY_COLORS.find(c => c.id === colorId);
  if (found) {
    return `${found.bg} ${found.text} ${found.border}`;
  }
  // Default fallback is UIT Blue
  return 'bg-[#EBF1FD] text-[#002B7F] border-[#C7D7F8]';
}
