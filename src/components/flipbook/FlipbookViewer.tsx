'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { EditorPage, BOOK_COVERS, BookCoverStyle } from '@/types/editor';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import React from 'react';

interface FlipbookViewerProps {
  pages: EditorPage[];
  title?: string;
  coverStyleId?: string;
}

function getCoverStyle(id?: string): BookCoverStyle {
  return BOOK_COVERS.find((c) => c.id === id) || BOOK_COVERS[0];
}

// ─── Cover Page ───
const CoverPage = React.forwardRef<HTMLDivElement, { title: string; coverStyle: BookCoverStyle }>(
  function CoverPage({ title, coverStyle }, ref) {
    const { cover } = coverStyle;
    return (
      <div ref={ref} className="page-content cover-page">
        <div
          className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden"
          style={{ background: cover.background }}
        >
          {/* Subtle sheen */}
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage: `radial-gradient(ellipse at 30% 30%, rgba(255,255,255,0.3) 0%, transparent 60%)`,
            }}
          />

          {/* Double border frame */}
          <div className="absolute inset-5 border-2 rounded-sm" style={{ borderColor: cover.accentColor }} />
          <div className="absolute inset-7 border rounded-sm" style={{ borderColor: cover.borderColor }} />

          {/* Spine shadow */}
          <div className="absolute left-0 top-0 bottom-0 w-5 bg-gradient-to-r from-black/30 to-transparent" />

          {/* Title */}
          <div className="relative z-10 text-center px-14">
            <div className="w-20 h-[2px] mx-auto mb-8 rounded-full" style={{ backgroundColor: cover.accentColor }} />
            <h1
              className="text-[22px] font-serif font-bold tracking-wider leading-snug"
              style={{ color: cover.textColor, textShadow: '0 2px 4px rgba(0,0,0,0.4)' }}
            >
              {title}
            </h1>
            <div className="w-20 h-[2px] mx-auto mt-8 rounded-full" style={{ backgroundColor: cover.accentColor }} />
          </div>

          {/* Corner ornaments */}
          {['top-9 left-9', 'top-9 right-9', 'bottom-9 left-9', 'bottom-9 right-9'].map((pos, i) => {
            const isTop = i < 2;
            const isLeft = i % 2 === 0;
            return (
              <div
                key={pos}
                className={`absolute ${pos} w-6 h-6`}
                style={{
                  borderTop: isTop ? `2px solid ${cover.borderColor}` : 'none',
                  borderBottom: !isTop ? `2px solid ${cover.borderColor}` : 'none',
                  borderLeft: isLeft ? `2px solid ${cover.borderColor}` : 'none',
                  borderRight: !isLeft ? `2px solid ${cover.borderColor}` : 'none',
                }}
              />
            );
          })}
        </div>
      </div>
    );
  }
);

// ─── Inner Page ───
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
      }

      renderPage();
      return () => { disposed = true; };
    }, [page.canvasJson]);

    const isLeftPage = pageIndex % 2 === 0;

    return (
      <div ref={ref} className="page-content inner-page">
        <div
          className="w-full h-full relative overflow-hidden"
          style={{ backgroundColor: page.backgroundColor || '#FFFBF0' }}
        >
          {/* Subtle paper grain */}
          <div className="absolute inset-0 pointer-events-none paper-grain" />

          {/* Gutter shadow */}
          {isLeftPage ? (
            <div className="absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-black/[0.05] via-black/[0.02] to-transparent pointer-events-none" />
          ) : (
            <div className="absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-black/[0.05] via-black/[0.02] to-transparent pointer-events-none" />
          )}

          {/* Top/bottom subtle edge */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-b from-black/[0.03] to-transparent pointer-events-none" />

          {/* Content */}
          <div className="w-full h-full flex items-center justify-center">
            {page.canvasJson ? (
              <canvas
                ref={canvasRef}
                width={800}
                height={600}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="text-gray-300/50 text-center select-none">
                <p className="text-xs italic font-serif">This page is blank</p>
              </div>
            )}
          </div>

          {/* Page number */}
          <div
            className={`absolute bottom-3 text-[10px] font-serif select-none ${
              isLeftPage ? 'left-5 text-gray-400/50' : 'right-5 text-gray-400/50'
            }`}
          >
            {pageIndex + 1} of {totalPages}
          </div>
        </div>
      </div>
    );
  }
);

// ─── Back Cover ───
const BackCover = React.forwardRef<HTMLDivElement, { coverStyle: BookCoverStyle }>(
  function BackCover({ coverStyle }, ref) {
    return (
      <div ref={ref} className="page-content cover-page">
        <div
          className="w-full h-full relative overflow-hidden"
          style={{ background: coverStyle.cover.background }}
        >
          <div className="absolute inset-5 border rounded-sm" style={{ borderColor: coverStyle.cover.borderColor }} />
          <div className="absolute right-0 top-0 bottom-0 w-5 bg-gradient-to-l from-black/30 to-transparent" />

          {/* Small "Scrapbook" text at bottom center */}
          <div className="absolute bottom-8 left-0 right-0 text-center">
            <p className="text-[10px] tracking-[0.3em] uppercase opacity-40" style={{ color: coverStyle.cover.textColor }}>
              Scrapbook
            </p>
          </div>
        </div>
      </div>
    );
  }
);

// ─── Main Component ───
export function FlipbookViewer({ pages, title = 'My Scrapbook', coverStyleId }: FlipbookViewerProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bookRef = useRef<any>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const coverStyle = getCoverStyle(coverStyleId);
  const totalItems = pages.length + 2;

  const handlePrev = useCallback(() => {
    bookRef.current?.pageFlip()?.flipPrev();
  }, []);

  const handleNext = useCallback(() => {
    bookRef.current?.pageFlip()?.flipNext();
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handlePrev, handleNext]);

  return (
    <div className="flex flex-col items-center gap-10">
      {/* Book with shadow */}
      <div className="book-container">
        <HTMLFlipBook
          ref={bookRef}
          width={480}
          height={640}
          size="stretch"
          minWidth={320}
          maxWidth={560}
          minHeight={420}
          maxHeight={740}
          showCover={true}
          maxShadowOpacity={0.5}
          mobileScrollSupport={true}
          onFlip={(e: { data: number }) => setCurrentPage(e.data)}
          className="flipbook-book"
          style={{}}
          startPage={0}
          drawShadow={true}
          flippingTime={1200}
          usePortrait={true}
          startZIndex={0}
          autoSize={true}
          clickEventForward={true}
          useMouseEvents={true}
          swipeDistance={20}
          showPageCorners={true}
          disableFlipByClick={false}
        >
          <CoverPage title={title} coverStyle={coverStyle} />
          {pages.map((page, i) => (
            <PageContent key={page.id} page={page} pageIndex={i} totalPages={pages.length} />
          ))}
          <BackCover coverStyle={coverStyle} />
        </HTMLFlipBook>
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-8">
        <button
          onClick={handlePrev}
          disabled={currentPage === 0}
          className="p-3 rounded-full bg-white/80 shadow-lg backdrop-blur-sm hover:shadow-xl hover:bg-white disabled:opacity-0 disabled:pointer-events-none transition-all duration-300 hover:scale-110 active:scale-95 border border-white/50"
        >
          <ChevronLeft className="w-5 h-5 text-stone-600" />
        </button>

        <div className="flex gap-1.5 items-center">
          {Array.from({ length: totalItems }).map((_, i) => (
            <div
              key={i}
              className={`rounded-full transition-all duration-500 ${
                i === currentPage
                  ? 'w-7 h-2 bg-amber-700'
                  : 'w-2 h-2 bg-stone-400/40'
              }`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={currentPage >= totalItems - 1}
          className="p-3 rounded-full bg-white/80 shadow-lg backdrop-blur-sm hover:shadow-xl hover:bg-white disabled:opacity-0 disabled:pointer-events-none transition-all duration-300 hover:scale-110 active:scale-95 border border-white/50"
        >
          <ChevronRight className="w-5 h-5 text-stone-600" />
        </button>
      </div>

      <p className="text-[11px] text-stone-500/60 tracking-wide">
        Click page corners or use arrow keys to turn pages
      </p>
    </div>
  );
}
