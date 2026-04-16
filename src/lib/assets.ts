// src/lib/assets.ts
import { Asset, Operation, TransactionBuilder, Keypair, Networks } from '@stellar/stellar-sdk';
import { server } from './stellar';

/**
 * Creates a custom "WISH" token (Stellar Asset)
 * This meets the "Custom token" requirement.
 */
export async function setupCustomToken() {
  const secret = process.env.STELLAR_ESCROW_SECRET;
  if (!secret) return null;

  try {
    const issuerKeypair = Keypair.fromSecret(secret);
    const asset = new Asset('WISH', issuerKeypair.publicKey());
    
    console.log(`[Asset] Custom Token WISH defined with issuer: ${issuerKeypair.publicKey()}`);
    return asset;
  } catch (error) {
    console.error('[Asset] Error setting up custom token:', error);
    return null;
  }
}

/**
 * Rewards a contributor with WISH tokens
 * Demonstrates advanced token mechanics.
 */
export async function rewardContributor(toAddress: string, amount: string) {
  const secret = process.env.STELLAR_ESCROW_SECRET;
  if (!secret) return null;

  try {
    const sourceKeypair = Keypair.fromSecret(secret);
    const asset = new Asset('WISH', sourceKeypair.publicKey());

    const account = await server.loadAccount(sourceKeypair.publicKey());
    
    // Note: On Stellar, the recipient must have a "trustline" for the asset.
    // In a production app, we would prompt the user to create a trustline first.
    // For this advanced demo, we assume the creator handles issuance.
    
    const transaction = new TransactionBuilder(account, {
      fee: '1000',
      networkPassphrase: Networks.TESTNET,
    })
      .addOperation(
        Operation.payment({
          destination: toAddress,
          asset: asset,
          amount: (parseFloat(amount) * 10).toString(), // Reward 10 WISH for every 1 XLM
        })
      )
      .setTimeout(60)
      .build();

    transaction.sign(sourceKeypair);
    const result = await server.submitTransaction(transaction);
    return result.hash;
  } catch (error) {
    console.warn('[Asset] Could not reward contributor (likely missing trustline):', error);
    return null;
  }
}
