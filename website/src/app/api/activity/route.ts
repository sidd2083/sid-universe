import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

// In-memory live activity cache shared across requests
let currentLiveActivity: any = {
  isOnline: true,
  lastHeartbeat: new Date().toISOString(),
  siddhantAction: 'Siddhant is currently exploring ideas',
  appName: 'Visual Studio Code',
  appDetails: 'StudentHub Nepal',
  durationMinutes: 15,
  activeSince: new Date(Date.now() - 15 * 60000).toISOString()
};

export async function GET() {
  try {
    const snap = await getDoc(doc(db, 'publicActivity', 'current')).catch(() => null);
    if (snap && snap.exists()) {
      const data = snap.data();
      return NextResponse.json({
        ...currentLiveActivity,
        ...data,
        isOnline: data.isOnline !== undefined ? data.isOnline : currentLiveActivity.isOnline
      }, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'no-store, max-age=0'
        }
      });
    }
  } catch (e) {}

  return NextResponse.json(currentLiveActivity, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-store, max-age=0'
    }
  });
}

export async function POST(req: Request) {
  try {
    const payload = await req.json();

    currentLiveActivity = {
      ...currentLiveActivity,
      ...payload,
      isOnline: payload.isOnline !== undefined ? payload.isOnline : true,
      lastHeartbeat: new Date().toISOString(),
      siddhantAction: payload.siddhantAction || currentLiveActivity.siddhantAction,
      appName: payload.appName !== undefined ? payload.appName : currentLiveActivity.appName,
      appDetails: payload.appDetails !== undefined ? payload.appDetails : currentLiveActivity.appDetails,
      durationMinutes: payload.durationMinutes || currentLiveActivity.durationMinutes || 1,
      activeSince: payload.activeSince || currentLiveActivity.activeSince || new Date().toISOString()
    };

    // Attempt Firestore persistence in background
    try {
      setDoc(doc(db, 'publicActivity', 'current'), {
        ...currentLiveActivity,
        updatedAt: serverTimestamp(),
        lastActive: serverTimestamp()
      }, { merge: true }).catch(() => {});
    } catch (e) {}

    return NextResponse.json({
      success: true,
      data: currentLiveActivity,
      syncedAt: new Date().toISOString()
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
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
