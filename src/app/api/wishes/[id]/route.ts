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
    const { amount, contributorAddress, txHash } = await request.json();
    
    const wish = await Wish.findById(params.id);
    if (!wish) {
      return NextResponse.json({ error: 'Wish not found' }, { status: 404 });
    }

    const newRaisedAmount = wish.raisedAmount + amount;
    const newStatus = newRaisedAmount >= wish.targetAmount ? 'funded' : wish.status;

    const updatedWish = await Wish.findByIdAndUpdate(
      params.id,
      {
        $inc: { raisedAmount: amount },
        $push: { 
          contributions: { 
            contributorAddress, 
            amount, 
            txHash, 
            timestamp: new Date() 
          } 
        },
        $set: { status: newStatus }
      },
      { new: true }
    );

    cache.bust('wishes');
    cache.bust(`wishes_active`);
    cache.bust(`wishes_funded`);

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
