import { EventEmitter } from 'events';
import { getFullTokenReportFromMint } from './transactions';
import { Connection, PublicKey } from '@solana/web3.js';
import { parseSolanaTransaction } from './parser/index.js';

export interface Token {
  url: string;
  chainId: string;
  tokenAddress: string;
  icon: string;
  header: string;
  openGraph: string;
  description: string;
  links: any[];
}

const detected = new Set<string>();

export class LockEvents extends EventEmitter {

  constructor() {
    super();
  }

  trackNewLocks() {

    console.log('🔁 Lock Watcher started.');

    const connection = new Connection(process.env.SOLANA_CONNECTION ?? 'https://api.mainnet-beta.solana.com', 'confirmed');


    const id = connection.onLogs(new PublicKey('strmRqUCoQUgGUan5YhzUZa6KqdzwX5L6FpUxfmKg5m'), async (log) => {
      //  console.log('Log received:', log);

      const signature = log.signature;
      if (!signature) {
        console.warn('⚠️ No signature found in log.');
        return;
      }

      const report = await parseSolanaTransaction(signature, null, false);

      if (report.type == "create") {

        const fullReport = await getFullTokenReportFromMint(report.mint);

        if (fullReport.success && fullReport.report) {
          this.emit('newLock', fullReport.report)
          // console.log(`✅ Alert sent for: ${mint}`);
        } else {
          console.warn(`⚠️ Failed to fetch full report for: ${report.mint}. Response: ${JSON.stringify(fullReport)}`);
        }


      }

      else {
        console.log('🔍 Not a lock transaction:', report);
      }


    });

    console.log(`Subscription ID: ${id}`);

    // 
  }
}

