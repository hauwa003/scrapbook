'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { EditorPage } from '@/types/editor';
import { getPages, getScrapbook } from '@/lib/data';
import { useAuth } from '@/components/auth/AuthProvider';
import { ArrowLeft, Edit3, Download, Share2 } from 'lucide-react';

const FlipbookViewer = dynamic(
  () => import('@/components/flipbook/FlipbookViewer').then((m) => ({ default: m.FlipbookViewer })),
  { ssr: false }
);

export default function ViewerPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const scrapbookId = params.scrapbookId as string;
  const [pages, setPages] = useState<EditorPage[]>([]);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const book = await getScrapbook(scrapbookId, user?.id);
      if (book) {
        setTitle(book.title);
        setSlug(book.slug);
      }

      const loadedPages = await getPages(scrapbookId);
      setPages(loadedPages);
      setLoading(false);
    }
    load();
  }, [scrapbookId, user]);

  const handleExportPDF = async () => {
    try {
      const { default: jsPDF } = await import('jspdf');
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [800, 600] });

      for (let i = 0; i < pages.length; i++) {
        if (i > 0) pdf.addPage();
        const page = pages[i];
        // Set background color
        pdf.setFillColor(page.backgroundColor || '#FFFBF0');
        pdf.rect(0, 0, 800, 600, 'F');
        pdf.setFontSize(14);
        pdf.setTextColor(150);
        pdf.text(`Page ${i + 1}`, 380, 300);
      }

      pdf.save(`${title || 'scrapbook'}.pdf`);
    } catch {
      alert('PDF export failed. Try again later.');
    }
  };

  const handleShare = () => {
    if (slug) {
      const url = `${window.location.origin}/book/${slug}`;
      navigator.clipboard.writeText(url);
      alert('Share link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-100">
        <div className="animate-pulse text-gray-500">Loading your book...</div>
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
      {/* Header */}
      <header className="bg-stone-900/80 backdrop-blur-md border-b border-stone-700/50 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/library')}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-stone-300" />
            </button>
            <h1 className="text-lg font-semibold text-stone-100">{title || 'Scrapbook'}</h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push(`/editor/${scrapbookId}`)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-stone-300 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Edit3 className="w-4 h-4" /> Edit
            </button>
            <button
              onClick={handleExportPDF}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-stone-300 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" /> PDF
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-amber-700 text-amber-50 rounded-lg hover:bg-amber-600 transition-colors"
            >
              <Share2 className="w-4 h-4" /> Share
            </button>
          </div>
        </div>
      </header>

      {/* Flipbook */}
      <main className="flex items-center justify-center py-16 px-4 min-h-[calc(100vh-56px)]">
        {pages.length > 0 ? (
          <FlipbookViewer pages={pages} title={title} />
        ) : (
          <div className="text-center py-20 bg-white/30 backdrop-blur-sm rounded-2xl px-12">
            <p className="text-6xl mb-4">📖</p>
            <h2 className="text-xl font-semibold text-stone-800 mb-2">No pages yet</h2>
            <p className="text-stone-600 mb-6">Add some content in the editor first!</p>
            <button
              onClick={() => router.push(`/editor/${scrapbookId}`)}
              className="px-6 py-3 bg-amber-700 text-white rounded-xl font-medium hover:bg-amber-600 transition-colors"
            >
              Open Editor
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
