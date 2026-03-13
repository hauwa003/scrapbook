import { createClient } from '@/lib/supabase/client';
import { Scrapbook, Page } from '@/types/database';
import { EditorPage } from '@/types/editor';
import { DEMO_SCRAPBOOKS } from './mock-data';
import { v4 as uuidv4 } from 'uuid';

function isSupabaseConfigured(): boolean {
  return createClient() !== null;
}

// ─── Scrapbooks ───

export async function getScrapbooks(userId?: string): Promise<Scrapbook[]> {
  const supabase = createClient();
  if (supabase && userId) {
    const { data, error } = await supabase
      .from('scrapbooks')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });
    if (!error && data) return data;
  }

  // Demo mode: localStorage
  if (typeof window === 'undefined') return [];
  const saved = localStorage.getItem('scrapbooks');
  if (saved) return JSON.parse(saved);
  localStorage.setItem('scrapbooks', JSON.stringify(DEMO_SCRAPBOOKS));
  return DEMO_SCRAPBOOKS;
}

export async function getScrapbook(id: string, userId?: string): Promise<Scrapbook | null> {
  const supabase = createClient();
  if (supabase && userId) {
    const { data } = await supabase
      .from('scrapbooks')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();
    return data;
  }

  const books = await getScrapbooks();
  return books.find((b) => b.id === id) || null;
}

export async function getScrapbookBySlug(slug: string): Promise<Scrapbook | null> {
  const supabase = createClient();
  if (supabase) {
    const { data } = await supabase
      .from('scrapbooks')
      .select('*')
      .eq('slug', slug)
      .eq('is_public', true)
      .single();
    return data;
  }

  const books = await getScrapbooks();
  return books.find((b) => b.slug === slug) || null;
}

export async function createScrapbook(
  title: string,
  theme: string,
  userId: string
): Promise<Scrapbook> {
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const newBook: Scrapbook = {
    id: uuidv4(),
    user_id: userId,
    title,
    slug: `${slug}-${Date.now()}`,
    cover_url: null,
    theme,
    is_public: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const supabase = createClient();
  if (supabase && userId !== 'demo-user') {
    await supabase.from('scrapbooks').insert(newBook);
    // Create initial pages
    const pages = [
      { id: uuidv4(), scrapbook_id: newBook.id, page_number: 1, background_color: '#FFFBF0' },
      { id: uuidv4(), scrapbook_id: newBook.id, page_number: 2, background_color: '#FFFBF0' },
    ];
    await supabase.from('pages').insert(pages);
  } else {
    const books = await getScrapbooks();
    const updated = [newBook, ...books];
    localStorage.setItem('scrapbooks', JSON.stringify(updated));
  }

  return newBook;
}

export async function deleteScrapbook(id: string, userId?: string): Promise<void> {
  const supabase = createClient();
  if (supabase && userId) {
    await supabase.from('scrapbooks').delete().eq('id', id);
    return;
  }

  const books = await getScrapbooks();
  const updated = books.filter((b) => b.id !== id);
  localStorage.setItem('scrapbooks', JSON.stringify(updated));
  localStorage.removeItem(`pages-${id}`);
}

export async function updateScrapbook(
  id: string,
  updates: Partial<Scrapbook>,
  userId?: string
): Promise<void> {
  const supabase = createClient();
  if (supabase && userId) {
    await supabase
      .from('scrapbooks')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id);
    return;
  }

  const books = await getScrapbooks();
  const updated = books.map((b) =>
    b.id === id ? { ...b, ...updates, updated_at: new Date().toISOString() } : b
  );
  localStorage.setItem('scrapbooks', JSON.stringify(updated));
}

// ─── Pages ───

export async function getPages(scrapbookId: string): Promise<EditorPage[]> {
  const supabase = createClient();
  if (supabase && isSupabaseConfigured()) {
    const { data } = await supabase
      .from('pages')
      .select('*')
      .eq('scrapbook_id', scrapbookId)
      .order('page_number', { ascending: true });

    if (data && data.length > 0) {
      return data.map((p: Page) => ({
        id: p.id,
        pageNumber: p.page_number,
        backgroundColor: p.background_color,
        canvasJson: p.canvas_json ? JSON.stringify(p.canvas_json) : null,
        thumbnailUrl: p.thumbnail_url,
      }));
    }
  }

  // Demo mode
  if (typeof window === 'undefined') return [];
  const saved = localStorage.getItem(`pages-${scrapbookId}`);
  if (saved) return JSON.parse(saved);

  const defaultPages: EditorPage[] = [
    { id: uuidv4(), pageNumber: 1, backgroundColor: '#FFFBF0', canvasJson: null, thumbnailUrl: null },
    { id: uuidv4(), pageNumber: 2, backgroundColor: '#FFFBF0', canvasJson: null, thumbnailUrl: null },
  ];
  localStorage.setItem(`pages-${scrapbookId}`, JSON.stringify(defaultPages));
  return defaultPages;
}

export async function savePages(scrapbookId: string, pages: EditorPage[]): Promise<void> {
  const supabase = createClient();
  if (supabase && isSupabaseConfigured()) {
    // Upsert all pages
    const rows = pages.map((p) => ({
      id: p.id,
      scrapbook_id: scrapbookId,
      page_number: p.pageNumber,
      background_color: p.backgroundColor,
      canvas_json: p.canvasJson ? JSON.parse(p.canvasJson) : null,
      thumbnail_url: p.thumbnailUrl,
    }));

    await supabase.from('pages').upsert(rows, { onConflict: 'id' });

    // Update scrapbook timestamp
    await supabase
      .from('scrapbooks')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', scrapbookId);
    return;
  }

  localStorage.setItem(`pages-${scrapbookId}`, JSON.stringify(pages));
}
