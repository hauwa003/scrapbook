'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { ScrapbookCard } from '@/components/library/ScrapbookCard';
import { CreateDialog } from '@/components/library/CreateDialog';
import { DEMO_SCRAPBOOKS } from '@/lib/mock-data';
import { Scrapbook } from '@/types/database';
import { createClient } from '@/lib/supabase/client';
import { Plus, BookOpen, LogOut } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

export default function LibraryPage() {
  const { user, isConfigured, signOut } = useAuth();
  const [scrapbooks, setScrapbooks] = useState<Scrapbook[]>([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadScrapbooks();
  }, []);

  async function loadScrapbooks() {
    const supabase = createClient();
    if (supabase && user) {
      const { data } = await supabase
        .from('scrapbooks')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });
      if (data) {
        setScrapbooks(data);
        setLoading(false);
        return;
      }
    }
    // Demo mode
    const saved = localStorage.getItem('scrapbooks');
    if (saved) {
      setScrapbooks(JSON.parse(saved));
    } else {
      setScrapbooks(DEMO_SCRAPBOOKS);
      localStorage.setItem('scrapbooks', JSON.stringify(DEMO_SCRAPBOOKS));
    }
    setLoading(false);
  }

  function handleCreate(title: string, theme: string) {
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newBook: Scrapbook = {
      id: uuidv4(),
      user_id: user?.id || 'demo-user',
      title,
      slug: `${slug}-${Date.now()}`,
      cover_url: null,
      theme,
      is_public: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const supabase = createClient();
    if (supabase && user) {
      supabase.from('scrapbooks').insert(newBook).then(() => {
        setScrapbooks((prev) => [newBook, ...prev]);
      });
    } else {
      const updated = [newBook, ...scrapbooks];
      setScrapbooks(updated);
      localStorage.setItem('scrapbooks', JSON.stringify(updated));
    }
  }

  function handleDelete(id: string) {
    const supabase = createClient();
    if (supabase && user) {
      supabase.from('scrapbooks').delete().eq('id', id).then(() => {
        setScrapbooks((prev) => prev.filter((s) => s.id !== id));
      });
    } else {
      const updated = scrapbooks.filter((s) => s.id !== id);
      setScrapbooks(updated);
      localStorage.setItem('scrapbooks', JSON.stringify(updated));
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-amber-100">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-amber-700" />
            <span className="text-xl font-bold text-amber-900">Scrapbook</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCreateOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-xl text-sm font-medium hover:bg-amber-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Book
            </button>
            {isConfigured && user && (
              <button
                onClick={signOut}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
              >
                <LogOut className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Library</h1>
        <p className="text-gray-500 mb-8">
          {scrapbooks.length} {scrapbooks.length === 1 ? 'book' : 'books'}
          {!isConfigured && (
            <span className="ml-2 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full">
              Demo Mode
            </span>
          )}
        </p>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-52 bg-white/50 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : scrapbooks.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📖</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No scrapbooks yet</h2>
            <p className="text-gray-500 mb-6">Create your first memory book to get started!</p>
            <button
              onClick={() => setCreateOpen(true)}
              className="px-6 py-3 bg-amber-600 text-white rounded-xl font-medium hover:bg-amber-700 transition-colors"
            >
              Create Scrapbook
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {scrapbooks.map((book) => (
              <ScrapbookCard key={book.id} scrapbook={book} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </main>

      <CreateDialog open={createOpen} onClose={() => setCreateOpen(false)} onCreate={handleCreate} />
    </div>
  );
}
