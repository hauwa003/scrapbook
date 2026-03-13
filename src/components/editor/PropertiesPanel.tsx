'use client';

import { useState, useEffect, useCallback } from 'react';
import type { CanvasHandle } from './Canvas';
import { AlignLeft, AlignCenter, AlignRight, Bold, Italic, Underline, Layers, ArrowUp, ArrowDown } from 'lucide-react';

interface PropertiesPanelProps {
  canvasRef: React.RefObject<CanvasHandle | null>;
}

interface SelectedProps {
  type: string;
  fill: string;
  stroke: string;
  opacity: number;
  fontSize: number;
  fontFamily: string;
  fontWeight: string;
  fontStyle: string;
  underline: boolean;
  textAlign: string;
  angle: number;
  width: number;
  height: number;
}

const FONT_FAMILIES = [
  'Arial',
  'Georgia',
  'Times New Roman',
  'Courier New',
  'Verdana',
  'Comic Sans MS',
  'Impact',
  'Trebuchet MS',
];

const DEFAULT_PROPS: SelectedProps = {
  type: '',
  fill: '#000000',
  stroke: '',
  opacity: 1,
  fontSize: 28,
  fontFamily: 'Arial',
  fontWeight: 'normal',
  fontStyle: 'normal',
  underline: false,
  textAlign: 'left',
  angle: 0,
  width: 0,
  height: 0,
};

export function PropertiesPanel({ canvasRef }: PropertiesPanelProps) {
  const [props, setProps] = useState<SelectedProps>(DEFAULT_PROPS);
  const [hasSelection, setHasSelection] = useState(false);

  const readSelection = useCallback(() => {
    const canvas = canvasRef.current?.getCanvas();
    if (!canvas) return;

    const active = canvas.getActiveObject();
    if (!active) {
      setHasSelection(false);
      return;
    }

    setHasSelection(true);
    setProps({
      type: active.type || '',
      fill: (active.fill as string) || '#000000',
      stroke: (active.stroke as string) || '',
      opacity: active.opacity ?? 1,
      fontSize: active.fontSize || 28,
      fontFamily: active.fontFamily || 'Arial',
      fontWeight: active.fontWeight || 'normal',
      fontStyle: active.fontStyle || 'normal',
      underline: active.underline || false,
      textAlign: active.textAlign || 'left',
      angle: Math.round(active.angle || 0),
      width: Math.round(active.getScaledWidth?.() || active.width || 0),
      height: Math.round(active.getScaledHeight?.() || active.height || 0),
    });
  }, [canvasRef]);

  useEffect(() => {
    const interval = setInterval(readSelection, 300);
    return () => clearInterval(interval);
  }, [readSelection]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateProp = (key: string, value: any) => {
    const canvas = canvasRef.current?.getCanvas();
    if (!canvas) return;
    const active = canvas.getActiveObject();
    if (!active) return;

    active.set(key, value);
    canvas.renderAll();
    readSelection();
  };

  const bringForward = () => {
    const canvas = canvasRef.current?.getCanvas();
    if (!canvas) return;
    const active = canvas.getActiveObject();
    if (active) {
      canvas.bringObjectForward(active);
      canvas.renderAll();
    }
  };

  const sendBackward = () => {
    const canvas = canvasRef.current?.getCanvas();
    if (!canvas) return;
    const active = canvas.getActiveObject();
    if (active) {
      canvas.sendObjectBackwards(active);
      canvas.renderAll();
    }
  };

  const isText = props.type === 'i-text' || props.type === 'textbox' || props.type === 'text';

  if (!hasSelection) {
    return (
      <div className="w-56 bg-white border-l border-gray-200 p-4 shrink-0 hidden lg:block">
        <p className="text-sm text-gray-400 text-center mt-8">
          Select an element to edit its properties
        </p>
      </div>
    );
  }

  return (
    <div className="w-56 bg-white border-l border-gray-200 p-4 shrink-0 hidden lg:block overflow-y-auto">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
        Properties
      </h3>

      {/* Fill Color */}
      <div className="mb-4">
        <label className="text-xs font-medium text-gray-600 mb-1 block">Fill Color</label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={props.fill || '#000000'}
            onChange={(e) => updateProp('fill', e.target.value)}
            className="w-8 h-8 rounded border border-gray-200 cursor-pointer"
          />
          <input
            type="text"
            value={props.fill || ''}
            onChange={(e) => updateProp('fill', e.target.value)}
            className="flex-1 px-2 py-1 text-xs border border-gray-200 rounded"
          />
        </div>
      </div>

      {/* Stroke Color */}
      <div className="mb-4">
        <label className="text-xs font-medium text-gray-600 mb-1 block">Stroke</label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={props.stroke || '#000000'}
            onChange={(e) => updateProp('stroke', e.target.value)}
            className="w-8 h-8 rounded border border-gray-200 cursor-pointer"
          />
          <input
            type="text"
            value={props.stroke || ''}
            onChange={(e) => updateProp('stroke', e.target.value)}
            className="flex-1 px-2 py-1 text-xs border border-gray-200 rounded"
          />
        </div>
      </div>

      {/* Opacity */}
      <div className="mb-4">
        <label className="text-xs font-medium text-gray-600 mb-1 block">
          Opacity: {Math.round(props.opacity * 100)}%
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={props.opacity}
          onChange={(e) => updateProp('opacity', parseFloat(e.target.value))}
          className="w-full accent-amber-600"
        />
      </div>

      {/* Rotation */}
      <div className="mb-4">
        <label className="text-xs font-medium text-gray-600 mb-1 block">Rotation</label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={props.angle}
            onChange={(e) => updateProp('angle', parseInt(e.target.value) || 0)}
            className="w-full px-2 py-1 text-xs border border-gray-200 rounded"
          />
          <span className="text-xs text-gray-400">deg</span>
        </div>
      </div>

      {/* Text-specific properties */}
      {isText && (
        <>
          <div className="w-full h-px bg-gray-100 my-4" />
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Text
          </h3>

          {/* Font Family */}
          <div className="mb-3">
            <label className="text-xs font-medium text-gray-600 mb-1 block">Font</label>
            <select
              value={props.fontFamily}
              onChange={(e) => updateProp('fontFamily', e.target.value)}
              className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded"
            >
              {FONT_FAMILIES.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>

          {/* Font Size */}
          <div className="mb-3">
            <label className="text-xs font-medium text-gray-600 mb-1 block">Size</label>
            <input
              type="number"
              value={props.fontSize}
              min={8}
              max={200}
              onChange={(e) => updateProp('fontSize', parseInt(e.target.value) || 28)}
              className="w-full px-2 py-1 text-xs border border-gray-200 rounded"
            />
          </div>

          {/* Bold, Italic, Underline */}
          <div className="flex gap-1 mb-3">
            <button
              onClick={() => updateProp('fontWeight', props.fontWeight === 'bold' ? 'normal' : 'bold')}
              className={`p-1.5 rounded ${props.fontWeight === 'bold' ? 'bg-amber-100 text-amber-700' : 'hover:bg-gray-100 text-gray-500'}`}
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              onClick={() => updateProp('fontStyle', props.fontStyle === 'italic' ? 'normal' : 'italic')}
              className={`p-1.5 rounded ${props.fontStyle === 'italic' ? 'bg-amber-100 text-amber-700' : 'hover:bg-gray-100 text-gray-500'}`}
            >
              <Italic className="w-4 h-4" />
            </button>
            <button
              onClick={() => updateProp('underline', !props.underline)}
              className={`p-1.5 rounded ${props.underline ? 'bg-amber-100 text-amber-700' : 'hover:bg-gray-100 text-gray-500'}`}
            >
              <Underline className="w-4 h-4" />
            </button>
          </div>

          {/* Text Alignment */}
          <div className="flex gap-1 mb-3">
            {(['left', 'center', 'right'] as const).map((align) => {
              const Icon = align === 'left' ? AlignLeft : align === 'center' ? AlignCenter : AlignRight;
              return (
                <button
                  key={align}
                  onClick={() => updateProp('textAlign', align)}
                  className={`p-1.5 rounded ${props.textAlign === align ? 'bg-amber-100 text-amber-700' : 'hover:bg-gray-100 text-gray-500'}`}
                >
                  <Icon className="w-4 h-4" />
                </button>
              );
            })}
          </div>
        </>
      )}

      {/* Z-Index controls */}
      <div className="w-full h-px bg-gray-100 my-4" />
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
        <Layers className="w-3 h-3 inline mr-1" /> Layer
      </h3>
      <div className="flex gap-2">
        <button
          onClick={bringForward}
          className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-xs border border-gray-200 rounded hover:bg-gray-50"
        >
          <ArrowUp className="w-3 h-3" /> Forward
        </button>
        <button
          onClick={sendBackward}
          className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-xs border border-gray-200 rounded hover:bg-gray-50"
        >
          <ArrowDown className="w-3 h-3" /> Back
        </button>
      </div>
    </div>
  );
}
