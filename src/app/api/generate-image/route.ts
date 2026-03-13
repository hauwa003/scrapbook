import { NextResponse } from 'next/server';
import { getOpenAIClient } from '@/lib/openai';

export async function POST(request: Request) {
  const { prompt } = await request.json();

  if (!prompt) {
    return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
  }

  const openai = getOpenAIClient();
  if (!openai) {
    return NextResponse.json(
      { error: 'OpenAI API key is not configured. Add OPENAI_API_KEY to .env.local' },
      { status: 503 }
    );
  }

  try {
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: `Scrapbook decoration: ${prompt}. Style: colorful, playful, suitable for a scrapbook page.`,
      n: 1,
      size: '1024x1024',
    });

    const url = response.data?.[0]?.url;
    if (!url) {
      return NextResponse.json({ error: 'No image generated' }, { status: 500 });
    }

    return NextResponse.json({ url });
  } catch (error) {
    console.error('Image generation error:', error);
    return NextResponse.json({ error: 'Failed to generate image' }, { status: 500 });
  }
}
