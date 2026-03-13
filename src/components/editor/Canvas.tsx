'use client';

import { useEffect, useRef, useCallback, forwardRef, useImperativeHandle } from 'react';
import { useEditorStore } from '@/stores/editor-store';

export interface CanvasHandle {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getCanvas: () => any;
  toJSON: () => string;
  loadFromJSON: (json: string) => void;
  toDataURL: () => string;
  addImage: (url: string) => void;
  addText: (text: string) => void;
  addSticker: (emoji: string) => void;
  addShape: (shape: 'rect' | 'circle' | 'line') => void;
  deleteSelected: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let fabricModule: any = null;

const Canvas = forwardRef<CanvasHandle>(function Canvas(_, ref) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fabricRef = useRef<any>(null);
  const { pages, currentPageIndex, pushUndo, setDirty } = useEditorStore();
  const currentPage = pages[currentPageIndex];

  const saveState = useCallback(() => {
    if (!fabricRef.current || !currentPage) return;
    const json = JSON.stringify(fabricRef.current.toJSON());
    pushUndo({ pageId: currentPage.id, canvasJson: json });
    setDirty(true);
  }, [currentPage, pushUndo, setDirty]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let canvas: any = null;

    async function initCanvas() {
      if (!canvasRef.current) return;

      fabricModule = await import('fabric');
      const FabricCanvas = fabricModule.Canvas;

      canvas = new FabricCanvas(canvasRef.current, {
        width: 800,
        height: 600,
        backgroundColor: currentPage?.backgroundColor || '#FFFBF0',
        selection: true,
        preserveObjectStacking: true,
      });

      fabricRef.current = canvas;

      // Load existing canvas data
      if (currentPage?.canvasJson) {
        await canvas.loadFromJSON(currentPage.canvasJson);
        canvas.renderAll();
      }

      // Track modifications
      canvas.on('object:modified', saveState);
      canvas.on('object:added', () => setDirty(true));
      canvas.on('object:removed', () => setDirty(true));
    }

    initCanvas();

    return () => {
      if (canvas) {
        canvas.dispose();
        fabricRef.current = null;
      }
    };
  }, [currentPage?.id]);

  // Update background color when page changes
  useEffect(() => {
    if (fabricRef.current && currentPage) {
      fabricRef.current.backgroundColor = currentPage.backgroundColor;
      fabricRef.current.renderAll();
    }
  }, [currentPage?.backgroundColor]);

  useImperativeHandle(ref, () => ({
    getCanvas: () => fabricRef.current,
    toJSON: () => {
      if (!fabricRef.current) return '{}';
      return JSON.stringify(fabricRef.current.toJSON());
    },
    loadFromJSON: async (json: string) => {
      if (!fabricRef.current) return;
      await fabricRef.current.loadFromJSON(json);
      fabricRef.current.renderAll();
    },
    toDataURL: () => {
      if (!fabricRef.current) return '';
      return fabricRef.current.toDataURL({ format: 'png', quality: 0.8 });
    },
    addImage: async (url: string) => {
      if (!fabricRef.current || !fabricModule) return;
      try {
        const img = await fabricModule.FabricImage.fromURL(url, { crossOrigin: 'anonymous' });
        const maxW = 400;
        const maxH = 300;
        const scale = Math.min(maxW / (img.width || 400), maxH / (img.height || 300), 1);
        img.scale(scale);
        img.set({ left: 100, top: 100 });
        fabricRef.current.add(img);
        fabricRef.current.setActiveObject(img);
        fabricRef.current.renderAll();
        saveState();
      } catch (e) {
        console.error('Failed to load image:', e);
      }
    },
    addText: (text: string) => {
      if (!fabricRef.current || !fabricModule) return;
      const textObj = new fabricModule.IText(text, {
        left: 200,
        top: 200,
        fontSize: 28,
        fontFamily: 'Arial',
        fill: '#333333',
      });
      fabricRef.current.add(textObj);
      fabricRef.current.setActiveObject(textObj);
      fabricRef.current.renderAll();
      saveState();
    },
    addSticker: (emoji: string) => {
      if (!fabricRef.current || !fabricModule) return;
      const sticker = new fabricModule.IText(emoji, {
        left: 300,
        top: 300,
        fontSize: 64,
      });
      fabricRef.current.add(sticker);
      fabricRef.current.setActiveObject(sticker);
      fabricRef.current.renderAll();
      saveState();
    },
    addShape: (shape: 'rect' | 'circle' | 'line') => {
      if (!fabricRef.current || !fabricModule) return;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let obj: any;

      switch (shape) {
        case 'rect':
          obj = new fabricModule.Rect({
            left: 150, top: 150, width: 150, height: 100,
            fill: '#FFD700', stroke: '#DAA520', strokeWidth: 2, rx: 8, ry: 8,
          });
          break;
        case 'circle':
          obj = new fabricModule.Circle({
            left: 200, top: 200, radius: 60,
            fill: '#FF6B6B', stroke: '#EE5A5A', strokeWidth: 2,
          });
          break;
        case 'line':
          obj = new fabricModule.Line([50, 300, 350, 300], {
            stroke: '#333', strokeWidth: 3,
          });
          break;
      }

      if (obj) {
        fabricRef.current.add(obj);
        fabricRef.current.setActiveObject(obj);
        fabricRef.current.renderAll();
        saveState();
      }
    },
    deleteSelected: () => {
      if (!fabricRef.current) return;
      const active = fabricRef.current.getActiveObjects();
      if (active.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        active.forEach((obj: any) => fabricRef.current!.remove(obj));
        fabricRef.current.discardActiveObject();
        fabricRef.current.renderAll();
        saveState();
      }
    },
  }));

  return (
    <div className="flex items-center justify-center bg-gray-100 rounded-xl p-4 overflow-auto">
      <div className="shadow-2xl rounded-lg overflow-hidden">
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
});

export default Canvas;
