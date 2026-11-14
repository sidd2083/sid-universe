import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, query, orderBy, limit, serverTimestamp, doc, updateDoc } from 'firebase/firestore';

// In-memory fallback cache so touches work even with transient Firestore latency
interface TouchEvent {
  id: string;
  emoji: string;
  senderName: string;
  message?: string;
  timestamp: string;
  isRead: boolean;
}

let inMemoryTouches: TouchEvent[] = [];

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const emoji = body.emoji || '👋';
    const senderName = (body.senderName || 'A visitor').trim().slice(0, 50);
    const message = (body.message || '').trim().slice(0, 200);

    const newTouch: TouchEvent = {
      id: `touch-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      emoji,
      senderName,
      message,
      timestamp: new Date().toISOString(),
      isRead: false
    };

    inMemoryTouches.unshift(newTouch);
    if (inMemoryTouches.length > 50) {
      inMemoryTouches = inMemoryTouches.slice(0, 50);
    }

    // Persist to Firestore collection 'touches'
    try {
      await addDoc(collection(db, 'touches'), {
        emoji,
        senderName,
        message,
        timestamp: serverTimestamp(),
        isRead: false,
        createdAt: new Date().toISOString()
      });
    } catch (fsErr: any) {
      console.warn('Firestore write notice in /api/touch:', fsErr?.message);
    }

    return NextResponse.json({
      success: true,
      message: 'Touch delivered to Sid!',
      touch: newTouch
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const unreadOnly = searchParams.get('unread') === 'true';
  const markRead = searchParams.get('markRead') === 'true';

  let results: TouchEvent[] = [...inMemoryTouches];

  // Try fetching latest from Firestore
  try {
    const q = query(collection(db, 'touches'), orderBy('timestamp', 'desc'), limit(20));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const fsTouches: TouchEvent[] = [];
      snap.forEach((d) => {
        const data = d.data();
        fsTouches.push({
          id: d.id,
          emoji: data.emoji || '👋',
          senderName: data.senderName || 'A visitor',
          message: data.message || '',
          timestamp: data.createdAt || new Date().toISOString(),
          isRead: !!data.isRead
        });
      });
      if (fsTouches.length > 0) {
        results = fsTouches;
      }
    }
  } catch (err: any) {
    // Fall back to memory touches
  }

  if (unreadOnly) {
    results = results.filter(t => !t.isRead);
  }

  if (markRead) {
    inMemoryTouches.forEach(t => { t.isRead = true; });
  }

  return NextResponse.json({
    success: true,
    touches: results,
    unreadCount: inMemoryTouches.filter(t => !t.isRead).length
  }, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}
