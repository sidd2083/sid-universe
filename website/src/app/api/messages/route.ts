import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  query,
  orderBy,
  limit,
  serverTimestamp
} from 'firebase/firestore';

// In-memory cache fallback for instant response
let inMemoryMessages: any[] = [];
let inMemoryQA: any[] = [];

export async function GET() {
  try {
    let messages: any[] = [];
    let publishedQA: any[] = [];

    // 1. Fetch anonymous messages
    try {
      const q = query(collection(db, 'anonymousMessages'), orderBy('createdAt', 'desc'), limit(100));
      const snap = await getDocs(q);
      if (!snap.empty) {
        snap.forEach((d) => {
          const data = d.data();
          messages.push({
            id: d.id,
            message: data.content || data.message || '',
            content: data.content || data.message || '',
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : (data.createdAt || new Date().toISOString()),
            isRead: !!data.isRead,
            isPublished: !!data.isPublished,
            reply: data.reply || null,
            senderName: data.senderName || 'Anonymous'
          });
        });
      }
    } catch (fsErr: any) {
      console.warn('Firestore read in /api/messages (messages):', fsErr?.message);
    }

    if (messages.length === 0 && inMemoryMessages.length > 0) {
      messages = inMemoryMessages;
    }

    // 2. Fetch published Q&A
    try {
      const qaQuery = query(collection(db, 'publishedQA'), orderBy('publishedAt', 'desc'), limit(100));
      const qaSnap = await getDocs(qaQuery);
      if (!qaSnap.empty) {
        qaSnap.forEach((d) => {
          const data = d.data();
          publishedQA.push({
            id: d.id,
            messageId: data.messageId || d.id,
            question: data.question || data.message || '',
            reply: data.reply || '',
            publishedAt: data.publishedAt || new Date().toISOString(),
            category: data.category || 'General'
          });
        });
      }
    } catch (fsErr: any) {
      console.warn('Firestore read in /api/messages (publishedQA):', fsErr?.message);
    }

    if (publishedQA.length === 0 && inMemoryQA.length > 0) {
      publishedQA = inMemoryQA;
    }

    return NextResponse.json({
      success: true,
      messages,
      publishedQA
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Cache-Control': 'no-store, max-age=0'
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const message = body.message || body.content;

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message content is required.' }, { status: 400 });
    }

    const trimmed = message.trim();
    if (trimmed.length === 0) {
      return NextResponse.json({ error: 'Message cannot be empty.' }, { status: 400 });
    }

    if (trimmed.length > 3000) {
      return NextResponse.json({ error: 'Message exceeds maximum length of 3000 characters.' }, { status: 400 });
    }

    let docId = `msg-${Date.now()}`;
    const newMsg = {
      id: docId,
      message: trimmed,
      content: trimmed,
      createdAt: new Date().toISOString(),
      isRead: false,
      isPublished: false,
      senderName: body.senderName || 'Anonymous'
    };

    inMemoryMessages.unshift(newMsg);

    try {
      const docRef = await addDoc(collection(db, 'anonymousMessages'), {
        content: trimmed,
        createdAt: serverTimestamp(),
        isRead: false,
        isPublished: false,
        isArchived: false,
        senderName: body.senderName || 'Anonymous'
      });
      docId = docRef.id;
      newMsg.id = docId;
    } catch (fsErr: any) {
      console.warn('Firestore write notice in /api/messages:', fsErr?.message);
    }

    return NextResponse.json({
      success: true,
      id: docId,
      createdAt: new Date().toISOString()
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Reply to an anonymous message and publish it to Public Q&A
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, reply, question, isPublished = true } = body;

    if (!id || !reply) {
      return NextResponse.json({ error: 'Message ID and reply are required.' }, { status: 400 });
    }

    const trimmedReply = reply.trim();

    // Update in-memory message
    const memMsg = inMemoryMessages.find((m) => m.id === id);
    if (memMsg) {
      memMsg.reply = trimmedReply;
      memMsg.isRead = true;
      memMsg.isPublished = isPublished;
    }

    const effectiveQuestion = question || memMsg?.message || memMsg?.content || 'Question from visitor';

    const newQAEntry = {
      id: `qa-${Date.now()}`,
      messageId: id,
      question: effectiveQuestion,
      reply: trimmedReply,
      publishedAt: new Date().toISOString(),
      category: body.category || 'General'
    };

    inMemoryQA.unshift(newQAEntry);

    // Update in Firestore
    try {
      const msgRef = doc(db, 'anonymousMessages', id);
      await updateDoc(msgRef, {
        reply: trimmedReply,
        isRead: true,
        isPublished: isPublished,
        repliedAt: serverTimestamp()
      });

      // Publish to publishedQA collection
      if (isPublished) {
        await addDoc(collection(db, 'publishedQA'), {
          messageId: id,
          question: effectiveQuestion,
          reply: trimmedReply,
          publishedAt: new Date().toISOString(),
          category: body.category || 'General',
          updatedAt: serverTimestamp()
        });
      }
    } catch (fsErr: any) {
      console.warn('Firestore reply notice in /api/messages:', fsErr?.message);
    }

    return NextResponse.json({
      success: true,
      message: 'Reply saved and published to website Q&A!',
      qa: newQAEntry
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
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
      'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}
