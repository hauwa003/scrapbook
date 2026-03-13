'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { EditorPage } from '@/types/editor';
import { getScrapbookBySlug, getPages } from '@/lib/data';
import { BookOpen } from 'lucide-react';

const FlipbookViewer = dynamic(
  () => import('@/components/flipbook/FlipbookViewer').then((m) => ({ default: m.FlipbookViewer })),
  { ssr: false }
);

export default function PublicBookPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [pages, setPages] = useState<EditorPage[]>([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function load() {
      const book = await getScrapbookBySlug(slug);
      if (!book) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setTitle(book.title);
      const loadedPages = await getPages(book.id);
      setPages(loadedPages);
      setLoading(false);
    }
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-100">
        <div className="animate-pulse text-gray-500">Loading book...</div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-100">
        <div className="text-center">
          <p className="text-6xl mb-4">📖</p>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Book Not Found</h1>
          <p className="text-gray-500">This scrapbook doesn&apos;t exist or isn&apos;t public.</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{
        background: 'radial-gradient(ellipse at center, #d4c5a9 0%, #b8a88a 40%, #9c8b6e 100%)',
      }}
    >
      <header className="bg-stone-900/80 backdrop-blur-md border-b border-stone-700/50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-amber-400" />
          <h1 className="text-lg font-semibold text-stone-100">{title}</h1>
        </div>
      </header>

      <main className="flex items-center justify-center py-16 px-4 min-h-[calc(100vh-56px)]">
        {pages.length > 0 ? (
          <FlipbookViewer pages={pages} title={title} />
        ) : (
          <p className="text-stone-600 bg-white/30 backdrop-blur-sm rounded-xl px-8 py-6">
            This scrapbook has no pages yet.
          </p>
        )}
      </main>
    </div>
  );
}
