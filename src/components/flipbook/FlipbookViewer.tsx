'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { EditorPage } from '@/types/editor';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import React from 'react';

interface FlipbookViewerProps {
  pages: EditorPage[];
  title?: string;
}

// Cover page
const CoverPage = React.forwardRef<HTMLDivElement, { title: string }>(
  function CoverPage({ title }, ref) {
    return (
      <div ref={ref} className="page-content cover-page">
        <div
          className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #8B4513 0%, #A0522D 30%, #8B4513 50%, #6B3410 100%)',
          }}
        >
          {/* Leather texture overlay */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(255,255,255,0.05) 0%, transparent 40%)`,
            }}
          />

          {/* Gold border frame */}
          <div className="absolute inset-4 border-2 border-amber-400/40 rounded-sm" />
          <div className="absolute inset-6 border border-amber-400/20 rounded-sm" />

          {/* Spine shadow */}
          <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-black/30 to-transparent" />

          {/* Title area */}
          <div className="relative z-10 text-center px-12">
            <div className="w-16 h-0.5 bg-amber-400/60 mx-auto mb-6" />
            <h1
              className="text-2xl font-serif font-bold tracking-wide leading-tight"
              style={{
                color: '#D4A94C',
                textShadow: '0 1px 3px rgba(0,0,0,0.5)',
              }}
            >
              {title}
            </h1>
            <div className="w-16 h-0.5 bg-amber-400/60 mx-auto mt-6" />
          </div>

          {/* Decorative corner ornaments */}
          <div className="absolute top-8 left-8 w-8 h-8 border-t-2 border-l-2 border-amber-400/30 rounded-tl-sm" />
          <div className="absolute top-8 right-8 w-8 h-8 border-t-2 border-r-2 border-amber-400/30 rounded-tr-sm" />
          <div className="absolute bottom-8 left-8 w-8 h-8 border-b-2 border-l-2 border-amber-400/30 rounded-bl-sm" />
          <div className="absolute bottom-8 right-8 w-8 h-8 border-b-2 border-r-2 border-amber-400/30 rounded-br-sm" />
        </div>
      </div>
    );
  }
);

// Inner page
const PageContent = React.forwardRef<HTMLDivElement, { page: EditorPage; pageIndex: number; totalPages: number }>(
  function PageContent({ page, pageIndex, totalPages }, ref) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
      if (!page.canvasJson || !canvasRef.current) return;

      let disposed = false;

      async function renderPage() {
        const fabric = await import('fabric');
        if (disposed || !canvasRef.current) return;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const staticCanvas = new (fabric as any).StaticCanvas(canvasRef.current, {
          width: 800,
          height: 600,
        });

        await staticCanvas.loadFromJSON(page.canvasJson!);
        staticCanvas.renderAll();

        return () => {
          disposed = true;
          staticCanvas.dispose();
        };
      }

      renderPage();

      return () => { disposed = true; };
    }, [page.canvasJson]);

    const isEvenPage = pageIndex % 2 === 0;

    return (
      <div ref={ref} className="page-content">
        <div
          className="w-full h-full relative overflow-hidden"
          style={{ backgroundColor: page.backgroundColor || '#FFFBF0' }}
        >
          {/* Paper texture */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.03]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
            }}
          />

          {/* Gutter shadow (inner edge of page) */}
          {isEvenPage ? (
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black/[0.06] to-transparent pointer-events-none" />
          ) : (
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-black/[0.06] to-transparent pointer-events-none" />
          )}

          {/* Canvas content */}
          <div className="w-full h-full flex items-center justify-center p-2">
            {page.canvasJson ? (
              <canvas
                ref={canvasRef}
                width={800}
                height={600}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="text-gray-300/60 text-center select-none">
                <p className="text-sm italic">Empty page</p>
              </div>
            )}
          </div>

          {/* Page number */}
          <div
            className={`absolute bottom-3 text-[11px] text-gray-400/70 select-none ${
              isEvenPage ? 'left-5' : 'right-5'
            }`}
          >
            {pageIndex + 1} / {totalPages}
          </div>
        </div>
      </div>
    );
  }
);

// Back cover
const BackCover = React.forwardRef<HTMLDivElement>(
  function BackCover(_, ref) {
    return (
      <div ref={ref} className="page-content cover-page">
        <div
          className="w-full h-full relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #8B4513 0%, #A0522D 30%, #8B4513 50%, #6B3410 100%)',
          }}
        >
          <div className="absolute inset-4 border border-amber-400/20 rounded-sm" />
          <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-black/30 to-transparent" />
        </div>
      </div>
    );
  }
);

export function FlipbookViewer({ pages, title = 'My Scrapbook' }: FlipbookViewerProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bookRef = useRef<any>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const totalItems = pages.length + 2; // +cover +back

  const handlePrev = useCallback(() => {
    bookRef.current?.pageFlip()?.flipPrev();
  }, []);

  const handleNext = useCallback(() => {
    bookRef.current?.pageFlip()?.flipNext();
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handlePrev, handleNext]);

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Book container with realistic shadow */}
      <div className="book-container">
        <HTMLFlipBook
          ref={bookRef}
          width={500}
          height={650}
          size="stretch"
          minWidth={350}
          maxWidth={600}
          minHeight={450}
          maxHeight={780}
          showCover={true}
          maxShadowOpacity={0.6}
          mobileScrollSupport={true}
          onFlip={(e: { data: number }) => setCurrentPage(e.data)}
          className="flipbook-book"
          style={{}}
          startPage={0}
          drawShadow={true}
          flippingTime={1000}
          usePortrait={true}
          startZIndex={0}
          autoSize={true}
          clickEventForward={true}
          useMouseEvents={true}
          swipeDistance={30}
          showPageCorners={true}
          disableFlipByClick={false}
        >
          {/* Cover */}
          <CoverPage title={title} />

          {/* Inner pages */}
          {pages.map((page, i) => (
            <PageContent
              key={page.id}
              page={page}
              pageIndex={i}
              totalPages={pages.length}
            />
          ))}

          {/* Back cover */}
          <BackCover />
        </HTMLFlipBook>
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-6">
        <button
          onClick={handlePrev}
          disabled={currentPage === 0}
          className="p-3 rounded-full bg-white/90 shadow-lg hover:shadow-xl disabled:opacity-20 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95 border border-gray-100"
        >
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </button>

        <div className="flex items-center gap-3">
          {/* Page indicator dots */}
          <div className="flex gap-1.5">
            {Array.from({ length: totalItems }).map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === currentPage
                    ? 'w-6 bg-amber-600'
                    : 'w-1.5 bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        <button
          onClick={handleNext}
          disabled={currentPage >= totalItems - 1}
          className="p-3 rounded-full bg-white/90 shadow-lg hover:shadow-xl disabled:opacity-20 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95 border border-gray-100"
        >
          <ChevronRight className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      <p className="text-xs text-gray-400">
        Click page edges or use arrow keys to flip
      </p>
    </div>
  );
}
