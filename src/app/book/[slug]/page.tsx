'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { EditorPage } from '@/types/editor';
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
    // In demo mode, look up by slug in localStorage
    const saved = localStorage.getItem('scrapbooks');
    if (saved) {
      const books = JSON.parse(saved);
      const book = books.find((b: { slug: string; is_public: boolean }) => b.slug === slug);
      if (book) {
        setTitle(book.title);
        const savedPages = localStorage.getItem(`pages-${book.id}`);
        if (savedPages) {
          setPages(JSON.parse(savedPages));
        }
      } else {
        setNotFound(true);
      }
    } else {
      setNotFound(true);
    }
    setLoading(false);
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-6xl mb-4">📖</p>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Book Not Found</h1>
          <p className="text-gray-500">This scrapbook doesn&apos;t exist or isn&apos;t public.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-amber-700" />
          <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
        </div>
      </header>

      <main className="flex items-center justify-center py-12 px-4">
        {pages.length > 0 ? (
          <FlipbookViewer pages={pages} />
        ) : (
          <p className="text-gray-500">This scrapbook has no pages yet.</p>
        )}
      </main>
    </div>
  );
}
