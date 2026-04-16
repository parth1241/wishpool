import { Horizon, TransactionBuilder, Networks, Asset, Memo, Operation, Keypair } from '@stellar/stellar-sdk';

export const server = new Horizon.Server('https://horizon-testnet.stellar.org');

export async function processPayout(
  toAddress: string,
  amount: string,
  memo: string
): Promise<{ success: boolean; hash?: string; error?: string }> {
  try {
    const secret = process.env.STELLAR_ESCROW_SECRET;
    if (!secret) {
      console.error('[Payout] CRITICAL: STELLAR_ESCROW_SECRET is not set in environment.');
      return { success: false, error: 'Escrow secret key not configured on server.' };
    }

    // Basic format validation
    if (!secret.startsWith('S') || secret.length !== 56) {
      console.error('[Payout] CRITICAL: STELLAR_ESCROW_SECRET is not a valid Stellar secret key format.');
      return { success: false, error: 'Invalid Stellar secret key format in server environment (must start with "S" and be 56 chars).' };
    }

    const sourceKeypair = Keypair.fromSecret(secret);
    const sourcePublicKey = sourceKeypair.publicKey();
    console.log(`[Payout] Initializing payout from Escrow: ${sourcePublicKey} to Creator: ${toAddress}`);

    // Check Escrow Balance
    const account = await server.loadAccount(sourcePublicKey);
    const nativeBalance = account.balances.find(b => b.asset_type === 'native')?.balance || '0';
    console.log(`[Payout] Escrow Balance: ${nativeBalance} XLM. Required: ${amount} XLM + fees.`);

    if (parseFloat(nativeBalance) < parseFloat(amount)) {
      const err = `Escrow account has insufficient funds (${nativeBalance} XLM) to pay ${amount} XLM.`;
      console.error(`[Payout] FAILED: ${err}`);
      return { success: false, error: err };
    }

    // Check Destination and choose operation
    let operation;
    try {
      await server.loadAccount(toAddress);
      console.log(`[Payout] Destination account ${toAddress} exists. Using payment operation.`);
      operation = Operation.payment({
        destination: toAddress,
        asset: Asset.native(),
        amount: amount,
      });
    } catch (e) {
      console.warn(`[Payout] Destination account ${toAddress} does not exist. Using createAccount operation.`);
      operation = Operation.createAccount({
        destination: toAddress,
        startingBalance: amount,
      });
    }

    console.log(`[Payout] Building Transaction with memo: ${memo}...`);
    const transaction = new TransactionBuilder(account, {
      fee: '1000',
      networkPassphrase: Networks.TESTNET,
    })
      .addOperation(operation)
      .addMemo(Memo.text(memo))
      .setTimeout(60)
      .build();

    transaction.sign(sourceKeypair);
    console.log(`[Payout] Broadcasting Transaction...`);
    
    const result = await server.submitTransaction(transaction);
    console.log(`[Payout] SUCCESS! Transaction Hash: ${result.hash}`);
    return { success: true, hash: result.hash };
  } catch (error: any) {
    console.error('[Payout] FAILED with Error:');
    
    // Extract specific Stellar error codes if available
    const resultCodes = error.response?.data?.extras?.result_codes;
    let errorMsg = error.message;

    if (resultCodes) {
      errorMsg = `Stellar Error: ${JSON.stringify(resultCodes)}`;
      console.error(`[Payout] Stellar Result Codes: ${errorMsg}`);
    } else {
      console.error(`[Payout] Error Message: ${error.message}`);
    }
    
    return { success: false, error: errorMsg };
  }
}

export async function processRefund(
  toAddress: string,
  amount: string,
  memo: string
): Promise<{ success: boolean; hash?: string; error?: string }> {
  // Re-uses the payout logic as it's a payment from the same escrow account
  return processPayout(toAddress, amount, memo);
}

export async function verifyTransaction(txHash: string): Promise<boolean> {
  try {
    const tx = await server.transactions().transaction(txHash).call();
    return tx.successful;
  } catch (error) {
    console.error('Error verifying transaction:', error);
    return false;
  }
}

export async function getAccountBalance(address: string): Promise<string> {
  try {
    const account = await server.loadAccount(address);
    const nativeBalance = account.balances.find((b) => b.asset_type === 'native');
    return nativeBalance ? nativeBalance.balance : '0';
  } catch (error) {
    console.error('Error getting account balance:', error);
    return '0';
  }
}

export async function buildPaymentXDR(
  from: string,
  to: string,
  amount: string,
  memo: string
): Promise<string> {
  try {
    const account = await server.loadAccount(from);
    const transaction = new TransactionBuilder(account, {
      fee: '1000',
      networkPassphrase: Networks.TESTNET,
    })
      .addOperation(
        Operation.payment({
          destination: to,
          asset: Asset.native(),
          amount: amount,
        })
      )
      .addMemo(Memo.text(memo))
      .setTimeout(30)
      .build();

    return transaction.toXDR();
  } catch (error) {
    console.error('Error building payment XDR:', error);
    throw error;
  }
}
