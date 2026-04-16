// src/app/api/wishes/[id]/payout/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Wish from '@/models/Wish';
import { processPayout } from '@/lib/stellar';
import cache from '@/lib/cache';

export async function POST(
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

    // Security & Logic checks
    if (wish.creatorAddress !== userAddress) {
      return NextResponse.json({ error: 'Only the creator can trigger payouts' }, { status: 403 });
    }

    if (wish.status !== 'funded') {
      return NextResponse.json({ error: 'Only funded wishes can be paid out' }, { status: 400 });
    }

    if (wish.payoutHash) {
      return NextResponse.json({ 
        error: 'Payout already exists', 
        hash: wish.payoutHash 
      }, { status: 400 });
    }

    console.log(`[Manual Payout] Request received for wish ${params.id} from creator ${userAddress}`);
    
    const payoutHash = await processPayout(
      wish.creatorAddress,
      wish.raisedAmount.toString(),
      `WishPool Payout: ${wish.title}`
    );

    if (payoutHash) {
      console.log(`[Manual Payout] Success for wish ${params.id}! Hash: ${payoutHash}`);
      wish.payoutHash = payoutHash;
      await wish.save();
      
      cache.bust('wishes');
      cache.bust('wishes_funded');

      return NextResponse.json({
        message: 'Payout successful',
        hash: payoutHash
      });
    } else {
      console.error(`[Manual Payout] FAILED for wish ${params.id}. Check logs for Stellar result codes.`);
      return NextResponse.json({ error: 'Payout failed on Stellar network' }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Manual payout error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
