'use client';

import { Scrapbook } from '@/types/database';
import { BOOK_COVERS } from '@/types/editor';
import { useRouter } from 'next/navigation';
import { BookOpen, Eye, Share2, Trash2, MoreVertical, Globe } from 'lucide-react';
import { useState } from 'react';

interface ScrapbookCardProps {
  scrapbook: Scrapbook;
  onDelete: (id: string) => void;
}

export function ScrapbookCard({ scrapbook, onDelete }: ScrapbookCardProps) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const coverDef = BOOK_COVERS.find((c) => c.id === scrapbook.cover_style) || BOOK_COVERS[0];
  const isDark = true; // cover backgrounds are always dark-ish

  return (
    <div className="group relative">
      <div
        onClick={() => router.push(`/editor/${scrapbook.id}`)}
        className="cursor-pointer rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
        style={{ background: coverDef.preview }}
      >
        {/* Book spine effect */}
        <div className="absolute left-0 top-0 bottom-0 w-3 bg-black/20 rounded-l-2xl" />

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
