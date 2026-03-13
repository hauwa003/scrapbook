export interface EditorPage {
  id: string;
  pageNumber: number;
  backgroundColor: string;
  canvasJson: string | null;
  thumbnailUrl: string | null;
}

export interface HistoryEntry {
  pageId: string;
  canvasJson: string;
}

export type ToolType =
  | 'select'
  | 'text'
  | 'image'
  | 'sticker'
  | 'shape'
  | 'ai_image';

export interface StickerItem {
  id: string;
  emoji: string;
  label: string;
}

export const STICKERS: StickerItem[] = [
  { id: 'heart', emoji: '❤️', label: 'Heart' },
  { id: 'star', emoji: '⭐', label: 'Star' },
  { id: 'sparkles', emoji: '✨', label: 'Sparkles' },
  { id: 'rainbow', emoji: '🌈', label: 'Rainbow' },
  { id: 'sun', emoji: '☀️', label: 'Sun' },
  { id: 'moon', emoji: '🌙', label: 'Moon' },
  { id: 'flower', emoji: '🌸', label: 'Flower' },
  { id: 'butterfly', emoji: '🦋', label: 'Butterfly' },
  { id: 'camera', emoji: '📷', label: 'Camera' },
  { id: 'gift', emoji: '🎁', label: 'Gift' },
  { id: 'balloon', emoji: '🎈', label: 'Balloon' },
  { id: 'confetti', emoji: '🎉', label: 'Party' },
  { id: 'music', emoji: '🎵', label: 'Music' },
  { id: 'plane', emoji: '✈️', label: 'Plane' },
  { id: 'palm', emoji: '🌴', label: 'Palm' },
  { id: 'cake', emoji: '🎂', label: 'Cake' },
  { id: 'ribbon', emoji: '🎀', label: 'Ribbon' },
  { id: 'crown', emoji: '👑', label: 'Crown' },
  { id: 'gem', emoji: '💎', label: 'Gem' },
  { id: 'fire', emoji: '🔥', label: 'Fire' },
];

export const PAGE_THEMES = [
  { id: 'classic', label: 'Classic', color: '#FFFBF0' },
  { id: 'modern', label: 'Modern', color: '#FFFFFF' },
  { id: 'pastel', label: 'Pastel', color: '#FFF0F5' },
  { id: 'dark', label: 'Dark', color: '#1a1a2e' },
  { id: 'nature', label: 'Nature', color: '#F0FFF0' },
  { id: 'ocean', label: 'Ocean', color: '#F0F8FF' },
];

export interface BookCoverStyle {
  id: string;
  label: string;
  preview: string; // CSS gradient for preview swatch
  cover: {
    background: string;
    textColor: string;
    accentColor: string;
    borderColor: string;
  };
}

export const BOOK_COVERS: BookCoverStyle[] = [
  {
    id: 'leather',
    label: 'Classic Leather',
    preview: 'linear-gradient(135deg, #8B4513, #A0522D)',
    cover: {
      background: 'linear-gradient(135deg, #8B4513 0%, #A0522D 30%, #8B4513 50%, #6B3410 100%)',
      textColor: '#D4A94C',
      accentColor: 'rgba(212, 169, 76, 0.4)',
      borderColor: 'rgba(212, 169, 76, 0.3)',
    },
  },
  {
    id: 'navy',
    label: 'Navy Blue',
    preview: 'linear-gradient(135deg, #1a2744, #2c3e6b)',
    cover: {
      background: 'linear-gradient(135deg, #1a2744 0%, #2c3e6b 30%, #1e2f50 50%, #141e33 100%)',
      textColor: '#C0D4F0',
      accentColor: 'rgba(192, 212, 240, 0.3)',
      borderColor: 'rgba(192, 212, 240, 0.25)',
    },
  },
  {
    id: 'burgundy',
    label: 'Burgundy',
    preview: 'linear-gradient(135deg, #6B1D2A, #8B2E3E)',
    cover: {
      background: 'linear-gradient(135deg, #6B1D2A 0%, #8B2E3E 30%, #6B1D2A 50%, #4A1420 100%)',
      textColor: '#F0C0A0',
      accentColor: 'rgba(240, 192, 160, 0.35)',
      borderColor: 'rgba(240, 192, 160, 0.25)',
    },
  },
  {
    id: 'forest',
    label: 'Forest Green',
    preview: 'linear-gradient(135deg, #2D4A2D, #3D6B3D)',
    cover: {
      background: 'linear-gradient(135deg, #2D4A2D 0%, #3D6B3D 30%, #2D4A2D 50%, #1E331E 100%)',
      textColor: '#C8E0B4',
      accentColor: 'rgba(200, 224, 180, 0.35)',
      borderColor: 'rgba(200, 224, 180, 0.25)',
    },
  },
  {
    id: 'blush',
    label: 'Blush Pink',
    preview: 'linear-gradient(135deg, #C4868B, #D4A0A5)',
    cover: {
      background: 'linear-gradient(135deg, #C4868B 0%, #D4A0A5 30%, #C4868B 50%, #A06670 100%)',
      textColor: '#FFF5F0',
      accentColor: 'rgba(255, 245, 240, 0.4)',
      borderColor: 'rgba(255, 245, 240, 0.3)',
    },
  },
  {
    id: 'black',
    label: 'Midnight',
    preview: 'linear-gradient(135deg, #1a1a1a, #333333)',
    cover: {
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 30%, #1a1a1a 50%, #0f0f0f 100%)',
      textColor: '#E8E8E8',
      accentColor: 'rgba(232, 232, 232, 0.2)',
      borderColor: 'rgba(232, 232, 232, 0.15)',
    },
  },
];
