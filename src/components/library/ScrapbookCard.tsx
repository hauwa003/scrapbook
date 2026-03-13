'use client';

import { Scrapbook } from '@/types/database';
import { useRouter } from 'next/navigation';
import { BookOpen, Eye, Share2, Trash2, MoreVertical, Globe } from 'lucide-react';
import { useState } from 'react';

interface ScrapbookCardProps {
  scrapbook: Scrapbook;
  onDelete: (id: string) => void;
}

const THEME_COLORS: Record<string, string> = {
  classic: 'from-amber-100 to-orange-100',
  modern: 'from-gray-100 to-slate-100',
  pastel: 'from-pink-100 to-purple-100',
  dark: 'from-gray-700 to-gray-900',
  nature: 'from-green-100 to-emerald-100',
  ocean: 'from-blue-100 to-cyan-100',
};

export function ScrapbookCard({ scrapbook, onDelete }: ScrapbookCardProps) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const gradient = THEME_COLORS[scrapbook.theme] || THEME_COLORS.classic;
  const isDark = scrapbook.theme === 'dark';

  return (
    <div className="group relative">
      <div
        onClick={() => router.push(`/editor/${scrapbook.id}`)}
        className={`cursor-pointer bg-gradient-to-br ${gradient} rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-white/50`}
      >
        {/* Book spine effect */}
        <div className="absolute left-0 top-0 bottom-0 w-3 bg-black/10 rounded-l-2xl" />

        {/* Cover */}
        <div className="p-6 pl-8 min-h-[200px] flex flex-col justify-between">
          <div>
            <h3 className={`text-lg font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {scrapbook.title}
            </h3>
            <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
              {new Date(scrapbook.updated_at).toLocaleDateString()}
            </p>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-1.5">
              <BookOpen className={`w-4 h-4 ${isDark ? 'text-gray-300' : 'text-gray-400'}`} />
              {scrapbook.is_public && (
                <Globe className={`w-4 h-4 ${isDark ? 'text-gray-300' : 'text-gray-400'}`} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="absolute top-3 right-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen(!menuOpen);
          }}
          className="p-1.5 rounded-lg bg-white/80 hover:bg-white shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <MoreVertical className="w-4 h-4 text-gray-600" />
        </button>

        {menuOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
            <div className="absolute right-0 top-10 z-20 bg-white rounded-xl shadow-lg border border-gray-100 py-1 w-44">
              <button
                onClick={() => {
                  router.push(`/viewer/${scrapbook.id}`);
                  setMenuOpen(false);
                }}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <Eye className="w-4 h-4" /> View Flipbook
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${window.location.origin}/book/${scrapbook.slug}`
                  );
                  setMenuOpen(false);
                }}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <Share2 className="w-4 h-4" /> Copy Share Link
              </button>
              <button
                onClick={() => {
                  onDelete(scrapbook.id);
                  setMenuOpen(false);
                }}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
