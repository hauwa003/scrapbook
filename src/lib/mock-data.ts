import { Scrapbook, Page } from '@/types/database';
import { v4 as uuidv4 } from 'uuid';

const DEMO_SCRAPBOOK_ID = 'demo-scrapbook-1';
const DEMO_SCRAPBOOK_2_ID = 'demo-scrapbook-2';

export const DEMO_SCRAPBOOKS: Scrapbook[] = [
  {
    id: DEMO_SCRAPBOOK_ID,
    user_id: 'demo-user',
    title: 'Summer Memories 2024',
    slug: 'summer-memories-2024',
    cover_url: null,
    theme: 'classic',
    cover_style: 'leather',
    is_public: false,
    created_at: '2024-08-15T10:00:00Z',
    updated_at: '2024-08-20T14:30:00Z',
  },
  {
    id: DEMO_SCRAPBOOK_2_ID,
    user_id: 'demo-user',
    title: 'Birthday Bash',
    slug: 'birthday-bash',
    cover_url: null,
    theme: 'pastel',
    cover_style: 'blush',
    is_public: true,
    created_at: '2024-09-01T08:00:00Z',
    updated_at: '2024-09-05T12:00:00Z',
  },
];

export function createDemoPage(scrapbookId: string, pageNumber: number): Page {
  return {
    id: uuidv4(),
    scrapbook_id: scrapbookId,
    page_number: pageNumber,
    background_color: '#FFFBF0',
    canvas_json: null,
    thumbnail_url: null,
    created_at: new Date().toISOString(),
  };
}

export function getDemoPages(scrapbookId: string): Page[] {
  return [
    createDemoPage(scrapbookId, 1),
    createDemoPage(scrapbookId, 2),
  ];
}
