import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

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

    let docId = `msg-${Date.now()}`;
    try {
      const docRef = await addDoc(collection(db, 'anonymousMessages'), {
        content: trimmed,
        createdAt: serverTimestamp(),
        isRead: false,
        isPublished: false,
        isArchived: false
      });
      docId = docRef.id;
    } catch (fsErr: any) {
      console.warn('Firestore write notice in /api/messages:', fsErr?.message);
    }

    return NextResponse.json({
      success: true,
      id: docId,
      createdAt: new Date().toISOString()
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
