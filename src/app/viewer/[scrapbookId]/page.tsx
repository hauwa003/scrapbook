'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { EditorPage } from '@/types/editor';
import { ArrowLeft, Edit3, Download, Share2 } from 'lucide-react';

const FlipbookViewer = dynamic(
  () => import('@/components/flipbook/FlipbookViewer').then((m) => ({ default: m.FlipbookViewer })),
  { ssr: false }
);

export default function ViewerPage() {
  const params = useParams();
  const router = useRouter();
  const scrapbookId = params.scrapbookId as string;
  const [pages, setPages] = useState<EditorPage[]>([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load from localStorage (demo mode)
    const savedPages = localStorage.getItem(`pages-${scrapbookId}`);
    if (savedPages) {
      setPages(JSON.parse(savedPages));
    }

    const saved = localStorage.getItem('scrapbooks');
    if (saved) {
      const books = JSON.parse(saved);
      const book = books.find((b: { id: string }) => b.id === scrapbookId);
      if (book) setTitle(book.title);
    }

    setLoading(false);
  }, [scrapbookId]);

  const handleExportPDF = async () => {
    try {
      const res = await fetch('/api/export-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pages }),
      });

      if (!res.ok) {
        // Fallback: client-side PDF
        const { default: jsPDF } = await import('jspdf');
        const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [800, 600] });
        pdf.text('Scrapbook pages will render here with canvas data', 100, 100);
        pdf.save(`${title || 'scrapbook'}.pdf`);
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title || 'scrapbook'}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert('PDF export failed. Try again later.');
    }
  };

  const handleShare = () => {
    const saved = localStorage.getItem('scrapbooks');
    if (saved) {
      const books = JSON.parse(saved);
      const book = books.find((b: { id: string }) => b.id === scrapbookId);
      if (book) {
        const url = `${window.location.origin}/book/${book.slug}`;
        navigator.clipboard.writeText(url);
        alert('Share link copied to clipboard!');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/library')}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <ArrowLeft className="w-5 h-5 text-gray-500" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">{title || 'Scrapbook'}</h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push(`/editor/${scrapbookId}`)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Edit3 className="w-4 h-4" /> Edit
            </button>
            <button
              onClick={handleExportPDF}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" /> Export PDF
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
            >
              <Share2 className="w-4 h-4" /> Share
            </button>
          </div>
        </div>
      </header>

      {/* Flipbook */}
      <main className="flex items-center justify-center py-12 px-4">
        {pages.length > 0 ? (
          <FlipbookViewer pages={pages} />
        ) : (
          <div className="text-center py-20">
            <p className="text-6xl mb-4">📖</p>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">No pages yet</h2>
            <p className="text-gray-500 mb-6">Add some content in the editor first!</p>
            <button
              onClick={() => router.push(`/editor/${scrapbookId}`)}
              className="px-6 py-3 bg-amber-600 text-white rounded-xl font-medium hover:bg-amber-700 transition-colors"
            >
              Open Editor
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
