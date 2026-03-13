import { NextResponse } from 'next/server';

export async function POST() {
  // PDF export requires canvas rendering which is browser-only.
  // This route serves as a placeholder. Client-side export via jsPDF is the primary method.
  return NextResponse.json(
    { error: 'Server-side PDF export not available. Use client-side export.' },
    { status: 501 }
  );
}
