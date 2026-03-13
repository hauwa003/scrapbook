'use client';

import { useState, useRef } from 'react';
import { useEditorStore } from '@/stores/editor-store';
import { StickerPicker } from './StickerPicker';
import { AIImageDialog } from './AIImageDialog';
import type { CanvasHandle } from './Canvas';
import {
  MousePointer2,
  Type,
  Image,
  Smile,
  Square,
  Circle,
  Minus,
  Sparkles,
  Trash2,
} from 'lucide-react';

interface ToolbarProps {
  canvasRef: React.RefObject<CanvasHandle | null>;
}

export function Toolbar({ canvasRef }: ToolbarProps) {
  const { activeTool, setActiveTool } = useEditorStore();
  const [stickerOpen, setStickerOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [shapesOpen, setShapesOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const tools = [
    { id: 'select' as const, icon: MousePointer2, label: 'Select' },
    { id: 'text' as const, icon: Type, label: 'Text' },
    { id: 'image' as const, icon: Image, label: 'Image' },
    { id: 'sticker' as const, icon: Smile, label: 'Stickers' },
    { id: 'shape' as const, icon: Square, label: 'Shapes' },
    { id: 'ai_image' as const, icon: Sparkles, label: 'AI Image' },
  ];

  const handleToolClick = (toolId: typeof tools[number]['id']) => {
    setActiveTool(toolId);

    switch (toolId) {
      case 'text':
        canvasRef.current?.addText('Double-click to edit');
        setActiveTool('select');
        break;
      case 'image':
        fileInputRef.current?.click();
        break;
      case 'sticker':
        setStickerOpen(true);
        break;
      case 'shape':
        setShapesOpen(!shapesOpen);
        break;
      case 'ai_image':
        setAiOpen(true);
        break;
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    canvasRef.current?.addImage(url);
    setActiveTool('select');
    e.target.value = '';
  };

  return (
    <div className="w-14 bg-white rounded-xl shadow-md border border-gray-100 flex flex-col items-center py-2 gap-1">
      {tools.map((tool) => (
        <div key={tool.id} className="relative">
          <button
            onClick={() => handleToolClick(tool.id)}
            title={tool.label}
            className={`p-2.5 rounded-lg transition-colors ${
              activeTool === tool.id
                ? 'bg-amber-100 text-amber-700'
                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
            }`}
          >
            <tool.icon className="w-5 h-5" />
          </button>

          {/* Sticker picker popup */}
          {tool.id === 'sticker' && (
            <StickerPicker
              open={stickerOpen}
              onClose={() => {
                setStickerOpen(false);
                setActiveTool('select');
              }}
              onSelect={(emoji) => {
                canvasRef.current?.addSticker(emoji);
                setActiveTool('select');
              }}
            />
          )}

          {/* Shapes popup */}
          {tool.id === 'shape' && shapesOpen && (
            <div className="absolute left-full ml-2 top-0 bg-white rounded-xl shadow-lg border border-gray-200 p-2 w-36 z-50">
              <button
                onClick={() => {
                  canvasRef.current?.addShape('rect');
                  setShapesOpen(false);
                  setActiveTool('select');
                }}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                <Square className="w-4 h-4" /> Rectangle
              </button>
              <button
                onClick={() => {
                  canvasRef.current?.addShape('circle');
                  setShapesOpen(false);
                  setActiveTool('select');
                }}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                <Circle className="w-4 h-4" /> Circle
              </button>
              <button
                onClick={() => {
                  canvasRef.current?.addShape('line');
                  setShapesOpen(false);
                  setActiveTool('select');
                }}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                <Minus className="w-4 h-4" /> Line
              </button>
            </div>
          )}
        </div>
      ))}

      <div className="w-8 h-px bg-gray-200 my-1" />

      <button
        onClick={() => canvasRef.current?.deleteSelected()}
        title="Delete selected"
        className="p-2.5 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors"
      >
        <Trash2 className="w-5 h-5" />
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      <AIImageDialog
        open={aiOpen}
        onClose={() => {
          setAiOpen(false);
          setActiveTool('select');
        }}
        onGenerated={(url) => {
          canvasRef.current?.addImage(url);
          setActiveTool('select');
        }}
      />
    </div>
  );
}
