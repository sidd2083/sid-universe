import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const message = body.message;

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message content is required.' }, { status: 400 });
    }

    const trimmed = message.trim();
    if (trimmed.length === 0) {
      return NextResponse.json({ error: 'Message cannot be empty.' }, { status: 400 });
    }

    if (trimmed.length > 2000) {
      return NextResponse.json({ error: 'Message exceeds maximum length of 2000 characters.' }, { status: 400 });
    }

    // In a live Firebase environment, we would do:
    // await adminDb.collection('anonymousMessages').add({ message: trimmed, createdAt: new Date().toISOString(), isRead: false, isPublished: false });
    
    return NextResponse.json({
      success: true,
      id: `msg-${Date.now()}`,
      createdAt: new Date().toISOString()
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
