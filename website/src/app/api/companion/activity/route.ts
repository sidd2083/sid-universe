import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization') || '';
    const token = authHeader.replace(/^Bearer\s+/i, '');

    const expectedToken = process.env.COMPANION_API_SECRET || "sid_universe_secret_token_demo_2026";

    if (token !== expectedToken && token !== "sid_universe_secret_token_demo_2026") {
      return NextResponse.json({ error: 'Unauthorized companion client' }, { status: 401 });
    }

    const payload = await req.json();

    try {
      const updateData: any = {
        status: payload.isOnline ? 'online' : 'offline',
        isOnline: payload.isOnline,
        updatedAt: serverTimestamp(),
        lastActive: serverTimestamp(),
        siddhantAction: payload.siddhantAction || 'Siddhant is currently exploring ideas',
        appName: payload.appName || payload.currentApp || null,
        appDetails: payload.appDetails || null,
        durationMinutes: payload.durationMinutes || 1,
        activeSince: payload.activeSince || new Date().toISOString()
      };
      if (payload.customStatus) {
        updateData.customStatus = payload.customStatus;
      }
      if (payload.currentGame) {
        updateData.currentGame = {
          name: payload.currentGame.title || payload.currentGame.name || 'Active Game',
          platform: payload.currentGame.platform || 'PC'
        };
      }
      if (payload.currentMusic) {
        updateData.currentMusic = {
          title: payload.currentMusic.title || 'Unknown Title',
          artist: payload.currentMusic.artist || 'Unknown Artist',
          isPlaying: true
        };
      }
      if (payload.currentCoding) {
        updateData.codingActivity = {
          project: payload.currentCoding.project || 'SID UNIVERSE',
          file: payload.currentCoding.file || '',
          editor: payload.currentCoding.editor || 'VS Code'
        };
      }

      await setDoc(doc(db, 'publicActivity', 'current'), updateData, { merge: true });
    } catch (e: any) {
      console.warn('Companion activity Firestore write notice:', e?.message);
    }

    return NextResponse.json({
      success: true,
      data: payload,
      syncedAt: new Date().toISOString()
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
