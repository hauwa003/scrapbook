import { create } from 'zustand';
import { EditorPage, ToolType, HistoryEntry } from '@/types/editor';
import { v4 as uuidv4 } from 'uuid';

interface EditorState {
  scrapbookId: string | null;
  pages: EditorPage[];
  currentPageIndex: number;
  activeTool: ToolType;
  isDirty: boolean;
  isSaving: boolean;
  undoStack: HistoryEntry[];
  redoStack: HistoryEntry[];

  // Actions
  setScrapbookId: (id: string) => void;
  setPages: (pages: EditorPage[]) => void;
  setCurrentPage: (index: number) => void;
  setActiveTool: (tool: ToolType) => void;
  setDirty: (dirty: boolean) => void;
  setSaving: (saving: boolean) => void;

  addPage: () => void;
  deletePage: (index: number) => void;
  updatePageCanvas: (pageId: string, canvasJson: string) => void;
  updatePageThumbnail: (pageId: string, thumbnailUrl: string) => void;

  pushUndo: (entry: HistoryEntry) => void;
  undo: () => HistoryEntry | null;
  redo: () => HistoryEntry | null;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  scrapbookId: null,
  pages: [],
  currentPageIndex: 0,
  activeTool: 'select',
  isDirty: false,
  isSaving: false,
  undoStack: [],
  redoStack: [],

  setScrapbookId: (id) => set({ scrapbookId: id }),
  setPages: (pages) => set({ pages }),
  setCurrentPage: (index) => set({ currentPageIndex: index }),
  setActiveTool: (tool) => set({ activeTool: tool }),
  setDirty: (dirty) => set({ isDirty: dirty }),
  setSaving: (saving) => set({ isSaving: saving }),

  addPage: () => {
    const { pages } = get();
    const newPage: EditorPage = {
      id: uuidv4(),
      pageNumber: pages.length + 1,
      backgroundColor: '#FFFBF0',
      canvasJson: null,
      thumbnailUrl: null,
    };
    set({ pages: [...pages, newPage], isDirty: true });
  },

  deletePage: (index) => {
    const { pages, currentPageIndex } = get();
    if (pages.length <= 1) return;
    const newPages = pages.filter((_, i) => i !== index).map((p, i) => ({
      ...p,
      pageNumber: i + 1,
    }));
    const newIndex = currentPageIndex >= newPages.length
      ? newPages.length - 1
      : currentPageIndex;
    set({ pages: newPages, currentPageIndex: newIndex, isDirty: true });
  },

  updatePageCanvas: (pageId, canvasJson) => {
    const { pages } = get();
    set({
      pages: pages.map((p) =>
        p.id === pageId ? { ...p, canvasJson } : p
      ),
      isDirty: true,
    });
  },

  updatePageThumbnail: (pageId, thumbnailUrl) => {
    const { pages } = get();
    set({
      pages: pages.map((p) =>
        p.id === pageId ? { ...p, thumbnailUrl } : p
      ),
    });
  },

  pushUndo: (entry) => {
    const { undoStack } = get();
    set({
      undoStack: [...undoStack.slice(-49), entry],
      redoStack: [],
    });
  },

  undo: () => {
    const { undoStack, redoStack } = get();
    if (undoStack.length === 0) return null;
    const entry = undoStack[undoStack.length - 1];
    set({
      undoStack: undoStack.slice(0, -1),
      redoStack: [...redoStack, entry],
    });
    return entry;
  },

  redo: () => {
    const { redoStack, undoStack } = get();
    if (redoStack.length === 0) return null;
    const entry = redoStack[redoStack.length - 1];
    set({
      redoStack: redoStack.slice(0, -1),
      undoStack: [...undoStack, entry],
    });
    return entry;
  },
}));
