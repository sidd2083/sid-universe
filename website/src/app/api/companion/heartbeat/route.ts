import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization') || '';
    const token = authHeader.replace(/^Bearer\s+/i, '');

    // Validate token against expected token (or demo secret)
    const expectedToken = process.env.COMPANION_API_SECRET || "sid_universe_secret_token_demo_2026";

    if (token !== expectedToken && token !== "sid_universe_secret_token_demo_2026") {
      return NextResponse.json({ error: 'Unauthorized companion client' }, { status: 401 });
    }

    try {
      await setDoc(
        doc(db, 'publicActivity', 'current'),
        {
          status: 'online',
          lastActive: serverTimestamp(),
          updatedAt: serverTimestamp()
        },
        { merge: true }
      );
    } catch (e: any) {
      console.warn('Companion heartbeat Firestore write notice:', e?.message);
    }

    return NextResponse.json({
      success: true,
      status: 'online',
      receivedAt: new Date().toISOString()
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
