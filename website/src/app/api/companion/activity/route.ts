import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

export async function GET() {
  try {
    const snap = await getDoc(doc(db, 'publicActivity', 'current')).catch(() => null);
    if (snap && snap.exists()) {
      return NextResponse.json(snap.data(), {
        headers: { 'Access-Control-Allow-Origin': '*' }
      });
    }
  } catch (e) {}
  return NextResponse.json({ status: 'online' });
}

export async function POST(req: Request) {
  try {
    const payload = await req.json();

    const updateData: any = {
      status: payload.isOnline ? 'online' : 'offline',
      isOnline: payload.isOnline !== undefined ? payload.isOnline : true,
      lastHeartbeat: new Date().toISOString(),
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
    if (payload.game || payload.currentGame) {
      const g = payload.game || payload.currentGame;
      updateData.currentGame = {
        title: g.title || g.name || 'Active Game',
        platform: g.platform || 'PC'
      };
    }
    if (payload.music || payload.currentMusic) {
      const m = payload.music || payload.currentMusic;
      updateData.currentMusic = {
        title: m.title || 'Unknown Title',
        artist: m.artist || 'Unknown Artist',
        source: m.source || 'Spotify',
        isPlaying: true
      };
    }
    if (payload.coding || payload.currentCoding) {
      const c = payload.coding || payload.currentCoding;
      updateData.codingActivity = {
        project: c.project || 'StudentHub Nepal',
        file: c.file || '',
        editor: c.editor || 'VS Code'
      };
    }

    try {
      await setDoc(doc(db, 'publicActivity', 'current'), updateData, { merge: true });
    } catch (e: any) {
      console.warn('Companion activity Firestore write notice:', e?.message);
    }

    // Also forward to /api/activity internally if possible
    return NextResponse.json({
      success: true,
      data: updateData,
      syncedAt: new Date().toISOString()
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
}
