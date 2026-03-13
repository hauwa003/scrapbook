'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { PAGE_THEMES, BOOK_COVERS } from '@/types/editor';

interface CreateDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate: (title: string, theme: string, coverStyle: string) => void;
}

export function CreateDialog({ open, onClose, onCreate }: CreateDialogProps) {
  const [title, setTitle] = useState('');
  const [theme, setTheme] = useState('classic');
  const [coverStyle, setCoverStyle] = useState('leather');

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onCreate(title.trim(), theme, coverStyle);
    setTitle('');
    setTheme('classic');
    setCoverStyle('leather');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">New Scrapbook</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="My Scrapbook"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
              autoFocus
            />
          </div>

          {/* Book Cover Style */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Book Cover</label>
            <div className="grid grid-cols-3 gap-2">
              {BOOK_COVERS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCoverStyle(c.id)}
                  className={`relative flex flex-col items-center gap-1.5 p-2 rounded-xl border-2 transition-all ${
                    coverStyle === c.id
                      ? 'border-amber-500 shadow-md scale-[1.02]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {/* Mini book preview */}
                  <div
                    className="w-full aspect-[3/4] rounded-md shadow-sm relative overflow-hidden"
                    style={{ background: c.preview }}
                  >
                    {/* Spine line */}
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-black/20" />
                    {/* Title line */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div
                        className="w-8 h-[2px] rounded-full"
                        style={{ backgroundColor: c.cover.accentColor }}
                      />
                    </div>
                  </div>
                  <span className="text-[11px] text-gray-600 font-medium">{c.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Page Theme */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Page Background</label>
            <div className="grid grid-cols-3 gap-2">
              {PAGE_THEMES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTheme(t.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-colors ${
                    theme === t.id
                      ? 'border-amber-500 bg-amber-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div
                    className="w-4 h-4 rounded-full border border-gray-200 shrink-0"
                    style={{ backgroundColor: t.color }}
                  />
                  <span className="text-xs">{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={!title.trim()}
            className="w-full py-2.5 bg-amber-600 text-white rounded-xl font-medium hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Create Scrapbook
          </button>
        </form>
      </div>
    </div>
  );
}
