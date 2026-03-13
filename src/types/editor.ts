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
