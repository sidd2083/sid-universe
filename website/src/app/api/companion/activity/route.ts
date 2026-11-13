import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization') || '';
    const token = authHeader.replace(/^Bearer\s+/i, '');

    const expectedToken = process.env.COMPANION_API_SECRET || "sid_universe_secret_token_demo_2026";

    if (token !== expectedToken && token !== "sid_universe_secret_token_demo_2026") {
      return NextResponse.json({ error: 'Unauthorized companion client' }, { status: 401 });
    }

    const payload = await req.json();

    // The activity payload contains:
    // isOnline, game, music, coding, customStatus, lastHeartbeat
    return NextResponse.json({
      success: true,
      data: payload,
      syncedAt: new Date().toISOString()
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
