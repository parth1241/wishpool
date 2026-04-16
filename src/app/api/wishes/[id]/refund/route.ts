// src/app/api/wishes/[id]/refund/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Wish from '@/models/Wish';
import { processRefund } from '@/lib/stellar';
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
      return NextResponse.json({ error: 'Only the creator can trigger refunds' }, { status: 403 });
    }

    if (wish.status !== 'expired') {
      return NextResponse.json({ error: 'Only expired wishes can be refunded' }, { status: 400 });
    }

    if (wish.contributions.length === 0) {
      wish.status = 'refunded';
      await wish.save();
      return NextResponse.json({ message: 'Wish marked as refunded (no contributions)' });
    }

    console.log(`Starting bulk refunds for wish ${params.id}...`);
    
    // Process refunds
    const results = await Promise.all(
      wish.contributions.map(async (contribution: any) => {
        const refundResult = await processRefund(
          contribution.contributorAddress,
          contribution.amount.toString(),
          `Refund: ${wish.title}`
        );
        return { 
          address: contribution.contributorAddress, 
          hash: refundResult.hash,
          error: refundResult.error 
        };
      })
    );

    const successCount = results.filter(r => r.hash).length;
    
    if (successCount > 0) {
      wish.status = 'refunded';
      await wish.save();
    }

    cache.bust('wishes');
    cache.bust('wishes_expired');
    cache.bust('wishes_refunded');

    return NextResponse.json({
      message: `Successfully processed ${successCount} refunds.`,
      results
    });
  } catch (error: any) {
    console.error('Bulk refund error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
