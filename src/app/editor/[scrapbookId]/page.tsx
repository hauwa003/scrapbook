'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useEditorStore } from '@/stores/editor-store';
import { Toolbar } from '@/components/editor/Toolbar';
import type { CanvasHandle } from '@/components/editor/Canvas';
import { EditorPage } from '@/types/editor';
import { v4 as uuidv4 } from 'uuid';
import {
  ArrowLeft,
  Undo2,
  Redo2,
  Save,
  Eye,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Loader2,
} from 'lucide-react';

const Canvas = dynamic(() => import('@/components/editor/Canvas'), { ssr: false });

export default function EditorPage_() {
  const params = useParams();
  const router = useRouter();
  const canvasRef = useRef<CanvasHandle>(null);
  const scrapbookId = params.scrapbookId as string;

  const {
    pages,
    currentPageIndex,
    isDirty,
    isSaving,
    setScrapbookId,
    setPages,
    setCurrentPage,
    setDirty,
    setSaving,
    updatePageCanvas,
    addPage,
    deletePage,
    undo,
    redo,
  } = useEditorStore();

  const [title, setTitle] = useState('');

  // Initialize editor
  useEffect(() => {
    setScrapbookId(scrapbookId);

    // Load scrapbook data
    const saved = localStorage.getItem('scrapbooks');
    if (saved) {
      const books = JSON.parse(saved);
      const book = books.find((b: { id: string }) => b.id === scrapbookId);
      if (book) setTitle(book.title);
    }

    // Load pages
    const savedPages = localStorage.getItem(`pages-${scrapbookId}`);
    if (savedPages) {
      setPages(JSON.parse(savedPages));
    } else {
      const defaultPages: EditorPage[] = [
        {
          id: uuidv4(),
          pageNumber: 1,
          backgroundColor: '#FFFBF0',
          canvasJson: null,
          thumbnailUrl: null,
        },
        {
          id: uuidv4(),
          pageNumber: 2,
          backgroundColor: '#FFFBF0',
          canvasJson: null,
          thumbnailUrl: null,
        },
      ];
      setPages(defaultPages);
      localStorage.setItem(`pages-${scrapbookId}`, JSON.stringify(defaultPages));
    }
  }, [scrapbookId]);

  // Save before navigating pages
  const saveCurrentPage = () => {
    if (!canvasRef.current || pages.length === 0) return;
    const json = canvasRef.current.toJSON();
    const currentPage = pages[currentPageIndex];
    if (currentPage) {
      updatePageCanvas(currentPage.id, json);
    }
  };

  const handleSave = () => {
    saveCurrentPage();
    setSaving(true);

    // Save to localStorage in demo mode
    setTimeout(() => {
      const { pages: latestPages } = useEditorStore.getState();
      localStorage.setItem(`pages-${scrapbookId}`, JSON.stringify(latestPages));
      setDirty(false);
      setSaving(false);
    }, 300);
  };

  const handlePageChange = (newIndex: number) => {
    saveCurrentPage();
    setTimeout(() => {
      setCurrentPage(newIndex);
    }, 50);
  };

  const handleUndo = () => {
    const entry = undo();
    if (entry && canvasRef.current) {
      canvasRef.current.loadFromJSON(entry.canvasJson);
    }
  };

  const handleRedo = () => {
    const entry = redo();
    if (entry && canvasRef.current) {
      canvasRef.current.loadFromJSON(entry.canvasJson);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        if (e.key === 'z') {
          e.preventDefault();
          if (e.shiftKey) handleRedo();
          else handleUndo();
        } else if (e.key === 's') {
          e.preventDefault();
          handleSave();
        }
      }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        const target = e.target as HTMLElement;
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
          canvasRef.current?.deleteSelected();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Top toolbar */}
      <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (isDirty) handleSave();
              router.push('/library');
            }}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900 truncate max-w-[200px]">
            {title || 'Untitled'}
          </h1>
        </div>

        <div className="flex items-center gap-1">
          <button onClick={handleUndo} title="Undo (Ctrl+Z)" className="p-2 rounded-lg hover:bg-gray-100 text-gray-500">
            <Undo2 className="w-4 h-4" />
          </button>
          <button onClick={handleRedo} title="Redo (Ctrl+Shift+Z)" className="p-2 rounded-lg hover:bg-gray-100 text-gray-500">
            <Redo2 className="w-4 h-4" />
          </button>
          <div className="w-px h-6 bg-gray-200 mx-2" />
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 disabled:opacity-50 transition-colors"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isDirty ? 'Save' : 'Saved'}
          </button>
          <button
            onClick={() => {
              handleSave();
              router.push(`/viewer/${scrapbookId}`);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <Eye className="w-4 h-4" /> Preview
          </button>
        </div>
      </header>

      {/* Main area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left toolbar */}
        <div className="p-2 shrink-0">
          <Toolbar canvasRef={canvasRef} />
        </div>

        {/* Canvas area */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 flex items-center justify-center p-4">
            <Canvas ref={canvasRef} />
          </div>

          {/* Page navigation */}
          <div className="h-16 bg-white border-t border-gray-200 flex items-center justify-center gap-4 px-4 shrink-0">
            <button
              onClick={() => handlePageChange(Math.max(0, currentPageIndex - 1))}
              disabled={currentPageIndex === 0}
              className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              {pages.map((page, i) => (
                <button
                  key={page.id}
                  onClick={() => handlePageChange(i)}
                  className={`w-10 h-12 rounded-lg border-2 text-xs font-medium transition-all ${
                    i === currentPageIndex
                      ? 'border-amber-500 bg-amber-50 text-amber-700 shadow-sm'
                      : 'border-gray-200 hover:border-gray-300 text-gray-500'
                  }`}
                >
                  {page.pageNumber}
                </button>
              ))}
              <button
                onClick={addPage}
                className="w-10 h-12 rounded-lg border-2 border-dashed border-gray-300 hover:border-amber-400 hover:bg-amber-50 flex items-center justify-center transition-colors"
              >
                <Plus className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            <button
              onClick={() => handlePageChange(Math.min(pages.length - 1, currentPageIndex + 1))}
              disabled={currentPageIndex === pages.length - 1}
              className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {pages.length > 1 && (
              <>
                <div className="w-px h-6 bg-gray-200" />
                <button
                  onClick={() => deletePage(currentPageIndex)}
                  title="Delete current page"
                  className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
