// src/app/api/wishes/[id]/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Wish from '@/models/Wish';
import cache from '@/lib/cache';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const wish = await Wish.findById(params.id);
    if (!wish) {
      return NextResponse.json({ error: 'Wish not found' }, { status: 404 });
    }
    return NextResponse.json(wish);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const userAddress = request.headers.get('x-user-address');
    const { title, description } = await request.json();

    if (!userAddress) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const wish = await Wish.findById(params.id);
    if (!wish) {
      return NextResponse.json({ error: 'Wish not found' }, { status: 404 });
    }

    if (wish.creatorAddress !== userAddress) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (wish.status !== 'active') {
      return NextResponse.json({ error: 'Only active wishes can be edited' }, { status: 400 });
    }

    const updatedWish = await Wish.findByIdAndUpdate(
      params.id,
      { $set: { title, description } },
      { new: true }
    );

    cache.bust('wishes');
    cache.bust('wishes_active');

    return NextResponse.json(updatedWish);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const userAddress = request.headers.get('x-user-address');

    if (!userAddress) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const wish = await Wish.findById(params.id);
    if (!wish) {
      return NextResponse.json({ error: 'Wish not found' }, { status: 404 });
    }

    if (wish.creatorAddress !== userAddress) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await Wish.findByIdAndDelete(params.id);
    cache.bust('wishes');
    cache.bust(`wishes_${wish.status}`);

    return NextResponse.json({ message: 'Wish deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
