'use client';

import { STICKERS } from '@/types/editor';

interface StickerPickerProps {
  open: boolean;
  onClose: () => void;
  onSelect: (emoji: string) => void;
}

export function StickerPicker({ open, onClose, onSelect }: StickerPickerProps) {
  if (!open) return null;

  return (
    <div className="absolute left-full ml-2 top-0 bg-white rounded-xl shadow-lg border border-gray-200 p-3 w-56 z-50">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">Stickers</span>
        <button onClick={onClose} className="text-xs text-gray-400 hover:text-gray-600">
          Close
        </button>
      </div>
      <div className="grid grid-cols-5 gap-1">
        {STICKERS.map((s) => (
          <button
            key={s.id}
            onClick={() => {
              onSelect(s.emoji);
              onClose();
            }}
            title={s.label}
            className="p-2 text-2xl hover:bg-amber-50 rounded-lg transition-colors"
          >
            {s.emoji}
          </button>
        ))}
      </div>
    </div>
  );
}
