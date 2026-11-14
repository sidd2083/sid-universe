import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  serverTimestamp
} from 'firebase/firestore';

const ALLOWED_COLLECTIONS = [
  'games',
  'songs',
  'watchlist',
  'projects',
  'learningTopics',
  'siteSettings'
];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const colName = searchParams.get('collection');

  if (!colName || !ALLOWED_COLLECTIONS.includes(colName)) {
    return NextResponse.json({ error: 'Invalid collection' }, { status: 400 });
  }

  try {
    if (colName === 'siteSettings') {
      const snap = await getDocs(collection(db, colName));
      let settingsData = null;
      snap.forEach((d) => {
        if (d.id === 'general') settingsData = d.data();
      });
      return NextResponse.json({ success: true, data: settingsData });
    }

    const snap = await getDocs(collection(db, colName));
    const items: any[] = [];
    snap.forEach((d) => {
      items.push({ id: d.id, ...d.data() });
    });

    return NextResponse.json({
      success: true,
      collection: colName,
      items
    }, {
      headers: { 'Cache-Control': 'no-store, max-age=0' }
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { collection: colName, id, data, items } = body;

    if (!colName || !ALLOWED_COLLECTIONS.includes(colName)) {
      return NextResponse.json({ error: 'Invalid collection' }, { status: 400 });
    }

    if (items && Array.isArray(items)) {
      for (const item of items) {
        if (item && item.id) {
          const docRef = doc(db, colName, item.id);
          const cleanData = JSON.parse(JSON.stringify(item));
          await setDoc(docRef, { ...cleanData, updatedAt: serverTimestamp() }, { merge: true });
        }
      }
      return NextResponse.json({ success: true, count: items.length });
    }

    if (id && data) {
      const docRef = doc(db, colName, id);
      const cleanData = JSON.parse(JSON.stringify(data));
      await setDoc(docRef, { ...cleanData, updatedAt: serverTimestamp() }, { merge: true });
      return NextResponse.json({ success: true, id });
    }

    return NextResponse.json({ error: 'Missing id/data or items' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const colName = searchParams.get('collection');
    const id = searchParams.get('id');

    if (!colName || !id || !ALLOWED_COLLECTIONS.includes(colName)) {
      return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
    }

    await deleteDoc(doc(db, colName, id));
    return NextResponse.json({ success: true, deleted: id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
