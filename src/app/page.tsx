'use client';

import { useAuth } from '@/components/auth/AuthProvider';
import { LoginButton } from '@/components/auth/LoginButton';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { BookOpen, Sparkles, Share2, Palette } from 'lucide-react';

export default function LandingPage() {
  const { user, loading, isConfigured } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/library');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50">
        <div className="animate-pulse text-amber-800 text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <nav className="flex items-center justify-between mb-16">
          <div className="flex items-center gap-2">
            <BookOpen className="w-8 h-8 text-amber-700" />
            <span className="text-2xl font-bold text-amber-900">Scrapbook</span>
          </div>
        </nav>

        {/* Hero */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-24">
          <div>
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Create Beautiful
              <span className="text-amber-600"> Memory Books</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Design stunning digital scrapbooks with photos, AI-generated images,
              stickers, and text. Share your memories with a beautiful flipbook viewer.
            </p>

            <div className="space-y-3 max-w-sm">
              {isConfigured ? (
                <>
                  <LoginButton provider="google" />
                  <LoginButton provider="apple" />
                </>
              ) : (
                <>
                  <button
                    onClick={() => router.push('/library')}
                    className="w-full px-6 py-3 bg-amber-600 text-white rounded-xl font-medium hover:bg-amber-700 transition-colors"
                  >
                    Try Demo Mode
                  </button>
                  <p className="text-sm text-gray-500 text-center">
                    Auth not configured — running in demo mode
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Hero illustration */}
          <div className="hidden lg:block">
            <div className="relative">
              <div className="w-80 h-96 mx-auto bg-white rounded-2xl shadow-2xl border border-amber-100 p-6 rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="w-full h-48 bg-gradient-to-br from-amber-200 to-rose-200 rounded-xl mb-4 flex items-center justify-center">
                  <span className="text-6xl">📸</span>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-amber-100 rounded w-3/4"></div>
                  <div className="h-3 bg-amber-50 rounded w-full"></div>
                  <div className="h-3 bg-amber-50 rounded w-5/6"></div>
                </div>
                <div className="flex gap-2 mt-4">
                  <span className="text-2xl">⭐</span>
                  <span className="text-2xl">🌸</span>
                  <span className="text-2xl">✨</span>
                </div>
              </div>
              <div className="absolute -top-4 -left-4 w-64 h-80 bg-white/60 rounded-2xl shadow-lg border border-amber-100 -rotate-6"></div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-24">
          {[
            {
              icon: <Palette className="w-8 h-8" />,
              title: 'Drag & Drop Editor',
              desc: 'Place photos, text, stickers, and shapes on a freeform canvas. Resize, rotate, and layer to your heart\'s content.',
            },
            {
              icon: <Sparkles className="w-8 h-8" />,
              title: 'AI Image Generation',
              desc: 'Describe what you want and let AI create unique images, decorations, and backgrounds for your pages.',
            },
            {
              icon: <Share2 className="w-8 h-8" />,
              title: 'Share & Export',
              desc: 'View your scrapbook as a realistic flipbook. Share a public link or export as a PDF to print.',
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-amber-100 hover:shadow-lg transition-shadow"
            >
              <div className="text-amber-600 mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <footer className="text-center text-gray-500 text-sm py-8 border-t border-amber-100">
          Built with Next.js, Fabric.js, and Supabase
        </footer>
      </div>
    </div>
  );
}
