import { Horizon, TransactionBuilder, Networks, Asset, Memo, Operation, Keypair } from '@stellar/stellar-sdk';

export const server = new Horizon.Server('https://horizon-testnet.stellar.org');

export async function processPayout(
  toAddress: string,
  amount: string,
  memo: string
): Promise<string | null> {
  const secret = process.env.STELLAR_ESCROW_SECRET;
  if (!secret) {
    console.error('STELLAR_ESCROW_SECRET is not set');
    return null;
  }

  try {
    const sourceKeypair = Keypair.fromSecret(secret);
    const sourcePublicKey = sourceKeypair.publicKey();

    const account = await server.loadAccount(sourcePublicKey);
    const transaction = new TransactionBuilder(account, {
      fee: '1000',
      networkPassphrase: Networks.TESTNET,
    })
      .addOperation(
        Operation.payment({
          destination: toAddress,
          asset: Asset.native(),
          amount: amount,
        })
      )
      .addMemo(Memo.text(memo))
      .setTimeout(30)
      .build();

    transaction.sign(sourceKeypair);
    const result = await server.submitTransaction(transaction);
    return result.hash;
  } catch (error) {
    console.error('Error processing payout:', error);
    return null;
  }
}

export async function processRefund(
  toAddress: string,
  amount: string,
  memo: string
): Promise<string | null> {
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
