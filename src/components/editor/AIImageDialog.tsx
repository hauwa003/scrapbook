'use client';

import { useState } from 'react';
import { X, Sparkles, Loader2 } from 'lucide-react';

interface AIImageDialogProps {
  open: boolean;
  onClose: () => void;
  onGenerated: (url: string) => void;
}

export function AIImageDialog({ open, onClose, onGenerated }: AIImageDialogProps) {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!open) return null;

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to generate image');
        return;
      }

      onGenerated(data.url);
      setPrompt('');
      onClose();
    } catch {
      setError('Failed to generate image. Check your API key configuration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <h2 className="text-lg font-semibold text-gray-900">Generate AI Image</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the image you want to create... e.g., 'A watercolor flower border with roses and lavender'"
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none resize-none h-28"
          disabled={loading}
        />

        {error && (
          <p className="text-sm text-red-500 mt-2">{error}</p>
        )}

        <button
          onClick={handleGenerate}
          disabled={!prompt.trim() || loading}
          className="w-full mt-4 py-2.5 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Generate Image
            </>
          )}
        </button>
      </div>
    </div>
  );
}
