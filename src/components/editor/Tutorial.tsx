'use client';

import { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';

const STEPS = [
  {
    title: 'Welcome to the Editor!',
    description: 'This is where you create your scrapbook pages. Let\'s take a quick tour of the tools available.',
    position: 'center' as const,
  },
  {
    title: 'Toolbar',
    description: 'Use the left toolbar to add elements: text, images from your device, fun stickers, shapes, and AI-generated images.',
    position: 'left' as const,
    highlight: 'toolbar',
  },
  {
    title: 'Canvas',
    description: 'Click, drag, resize, and rotate elements on the canvas. Double-click text to edit it. Press Delete to remove selected items.',
    position: 'center' as const,
    highlight: 'canvas',
  },
  {
    title: 'Save & Preview',
    description: 'Use Ctrl+S to save your work. Click Preview to see your scrapbook as a beautiful flipbook with page-turning animations.',
    position: 'top' as const,
    highlight: 'topbar',
  },
  {
    title: 'Page Navigation',
    description: 'Add new pages with the + button, navigate between pages, and delete pages you don\'t need.',
    position: 'bottom' as const,
    highlight: 'pages',
  },
  {
    title: 'You\'re all set!',
    description: 'Start adding photos and decorations to create your memory book. Have fun!',
    position: 'center' as const,
  },
];

const STORAGE_KEY = 'scrapbook-tutorial-completed';

export function Tutorial() {
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const completed = localStorage.getItem(STORAGE_KEY);
    if (!completed) {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  const currentStep = STEPS[step];
  const isFirst = step === 0;
  const isLast = step === STEPS.length - 1;

  const handleClose = () => {
    setVisible(false);
    localStorage.setItem(STORAGE_KEY, 'true');
  };

  const handleNext = () => {
    if (isLast) {
      handleClose();
    } else {
      setStep(step + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirst) setStep(step - 1);
  };

  // Position classes for the tooltip
  const positionClasses: Record<string, string> = {
    center: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
    left: 'top-1/2 left-20 -translate-y-1/2',
    top: 'top-20 left-1/2 -translate-x-1/2',
    bottom: 'bottom-24 left-1/2 -translate-x-1/2',
  };

  // Highlight area styles
  const highlightStyles: Record<string, string> = {
    toolbar: 'left-0 top-14 w-16 bottom-0',
    canvas: 'left-16 top-14 right-0 bottom-16',
    topbar: 'left-0 top-0 right-0 h-14',
    pages: 'left-0 bottom-0 right-0 h-16',
  };

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Highlight cutout */}
      {currentStep.highlight && (
        <div
          className={`absolute ${highlightStyles[currentStep.highlight]} border-2 border-amber-400 bg-transparent z-[101] rounded-lg`}
          style={{ boxShadow: '0 0 0 9999px rgba(0,0,0,0.5)' }}
        />
      )}

      {/* Tooltip */}
      <div
        className={`absolute z-[102] ${positionClasses[currentStep.position]} w-80`}
      >
        <div className="bg-white rounded-2xl shadow-2xl p-6 border border-amber-100">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900">{currentStep.title}</h3>
            <button onClick={handleClose} className="p-1 rounded-lg hover:bg-gray-100 -mr-2 -mt-1">
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>

          <p className="text-sm text-gray-600 mb-5 leading-relaxed">{currentStep.description}</p>

          <div className="flex items-center justify-between">
            {/* Progress dots */}
            <div className="flex gap-1.5">
              {STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i === step ? 'bg-amber-500' : i < step ? 'bg-amber-300' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-2">
              {!isFirst && (
                <button
                  onClick={handlePrev}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-3 h-3" /> Back
                </button>
              )}
              <button
                onClick={handleNext}
                className="flex items-center gap-1 px-4 py-1.5 text-sm bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
              >
                {isLast ? 'Get Started' : 'Next'}
                {!isLast && <ChevronRight className="w-3 h-3" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
