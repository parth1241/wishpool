// src/app/api/contribute/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Wish from '@/models/Wish';
import { verifyTransaction, processPayout } from '@/lib/stellar';
import cache from '@/lib/cache';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { wishId, contributorAddress, amount, txHash } = await request.json();

    const isValid = await verifyTransaction(txHash);
    
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid transaction' }, { status: 400 });
    }

    const wish = await Wish.findById(wishId);
    if (!wish) {
      return NextResponse.json({ error: 'Wish not found' }, { status: 404 });
    }

    // Check if txHash already exists
    const alreadyProcessed = wish.contributions.some((c: any) => c.txHash === txHash);
    if (alreadyProcessed) {
      return NextResponse.json({ error: 'Transaction already processed' }, { status: 400 });
    }

    const newRaisedAmount = wish.raisedAmount + Number(amount);
    const becameFunded = wish.status !== 'funded' && newRaisedAmount >= wish.targetAmount;
    const newStatus = newRaisedAmount >= wish.targetAmount ? 'funded' : wish.status;

    const updatedWish = await Wish.findByIdAndUpdate(
      wishId,
      {
        $inc: { raisedAmount: Number(amount) },
        $push: { 
          contributions: { 
            contributorAddress, 
            amount: Number(amount), 
            txHash, 
            timestamp: new Date() 
          } 
        },
        $set: { status: newStatus }
      },
      { new: true }
    );

    const needsPayout = newRaisedAmount >= wish.targetAmount && !wish.payoutHash;

    // If it needs payout, trigger the process from escrow to creator
    if (needsPayout) {
      console.log(`[Trigger] Wish ${wishId} is funded and needs payout! (Raised: ${newRaisedAmount}, Target: ${wish.targetAmount})`);
      const payoutHash = await processPayout(
        wish.creatorAddress,
        newRaisedAmount.toString(),
        `WishPool Payout: ${wish.title}`
      );
      
      if (payoutHash) {
        console.log(`[Trigger] Payout successful for ${wishId}! Recording hash: ${payoutHash}`);
        await Wish.findByIdAndUpdate(wishId, { $set: { payoutHash } });
      } else {
        console.error(`[Trigger] Payout call returned null for wish ${wishId}. Check Stellar logs above.`);
      }
    } else {
      console.log(`[Trigger] Wish ${wishId} contribution processed. Needs payout: ${needsPayout} (Funded: ${newRaisedAmount >= wish.targetAmount}, Hash exists: ${!!wish.payoutHash})`);
    }

    cache.bust('wishes');
    cache.bust(`wishes_active`);
    cache.bust(`wishes_funded`);

    return NextResponse.json(updatedWish);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
