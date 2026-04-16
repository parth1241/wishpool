// src/app/api/wishes/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Wish from '@/models/Wish';
import cache from '@/lib/cache';
import { nanoid } from 'nanoid';

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const cacheKey = status ? `wishes_${status}` : 'wishes';
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return NextResponse.json(cachedData);
    }

    const query = status ? { status } : {};
    const wishes = await Wish.find(query).sort({ createdAt: -1 });
    
    cache.set(cacheKey, wishes, 30);
    
    return NextResponse.json(wishes);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    
    const stellarMemo = nanoid(8);
    const newWish = await Wish.create({
      ...body,
      stellarMemo,
      status: 'active',
      raisedAmount: 0,
      contributions: []
    });

    cache.bust('wishes');
    const status = body.status || 'active';
    cache.bust(`wishes_${status}`);

    return NextResponse.json(newWish, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
