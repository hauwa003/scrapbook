'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { EditorPage } from '@/types/editor';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import React from 'react';

interface FlipbookViewerProps {
  pages: EditorPage[];
}

const PageContent = React.forwardRef<HTMLDivElement, { page: EditorPage; pageIndex: number }>(
  function PageContent({ page, pageIndex }, ref) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
      if (!page.canvasJson || !canvasRef.current) return;

      async function renderPage() {
        const fabric = await import('fabric');

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const staticCanvas = new (fabric as any).StaticCanvas(canvasRef.current!, {
          width: 400,
          height: 300,
        });

        await staticCanvas.loadFromJSON(page.canvasJson!);
        const scale = 400 / 800;
        staticCanvas.setZoom(scale);
        staticCanvas.setDimensions({ width: 400, height: 300 });
        staticCanvas.renderAll();

        return () => staticCanvas.dispose();
      }

      renderPage();
    }, [page.canvasJson]);

    return (
      <div ref={ref} className="w-full h-full" style={{ backgroundColor: page.backgroundColor }}>
        <div className="w-full h-full flex flex-col items-center justify-center p-8">
          {page.canvasJson ? (
            <canvas ref={canvasRef} className="max-w-full max-h-full" />
          ) : (
            <div className="text-gray-300 text-center">
              <p className="text-lg font-medium">Page {pageIndex + 1}</p>
              <p className="text-sm mt-1">Empty page</p>
            </div>
          )}
          <div className="absolute bottom-4 text-xs text-gray-400">
            {pageIndex + 1}
          </div>
        </div>
      </div>
    );
  }
);

export function FlipbookViewer({ pages }: FlipbookViewerProps) {
  const bookRef = useRef<typeof HTMLFlipBook>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = pages.length;

  const handlePrev = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (bookRef.current as any)?.pageFlip()?.flipPrev();
  }, []);

  const handleNext = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (bookRef.current as any)?.pageFlip()?.flipNext();
  }, []);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="shadow-2xl">
        <HTMLFlipBook
          ref={bookRef}
          width={400}
          height={500}
          size="stretch"
          minWidth={300}
          maxWidth={500}
          minHeight={400}
          maxHeight={600}
          showCover={true}
          maxShadowOpacity={0.5}
          mobileScrollSupport={true}
          onFlip={(e: { data: number }) => setCurrentPage(e.data)}
          className="flipbook"
          style={{}}
          startPage={0}
          drawShadow={true}
          flippingTime={800}
          usePortrait={true}
          startZIndex={0}
          autoSize={true}
          clickEventForward={true}
          useMouseEvents={true}
          swipeDistance={30}
          showPageCorners={true}
          disableFlipByClick={false}
        >
          {pages.map((page, i) => (
            <PageContent key={page.id} page={page} pageIndex={i} />
          ))}
        </HTMLFlipBook>
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-4">
        <button
          onClick={handlePrev}
          disabled={currentPage === 0}
          className="p-2 rounded-full bg-white shadow-md hover:shadow-lg disabled:opacity-30 transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="text-sm text-gray-500 min-w-[80px] text-center">
          Page {currentPage + 1} of {totalPages}
        </span>
        <button
          onClick={handleNext}
          disabled={currentPage >= totalPages - 1}
          className="p-2 rounded-full bg-white shadow-md hover:shadow-lg disabled:opacity-30 transition-all"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
