import { EventEmitter } from 'events';
import { getFullTokenReportFromMint } from './transactions';

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

export class DexPaidEvents extends EventEmitter {

    constructor() {
        super();
    }

  trackNewDexpaid() {
   
     console.log('🔁 DEX Paid Watcher started.');

     setInterval(async () => {
    try {
      const res = await fetch('https://api.dexscreener.com/token-profiles/latest/v1');
      const data = await res.json();

      const tokens: Token[] = data as Token[];

      if (!Array.isArray(tokens) || tokens.length === 0) {
        console.warn('⚠️ Invalid or missing token data in response.');
        return;
      }

      // Filter Solana tokens containing "pump" in their address
      const solanaTokens = tokens.filter(
        (token) => token.chainId === 'solana' && token.tokenAddress.toLowerCase().includes('pump')
      );

      for (const token of solanaTokens) {
        const mint = token.tokenAddress;
        
        // Skip if already processed or mint address is invalid
        if (!mint || detected.has(mint)) continue;

       // console.log(`🟢 New possible DEX-paid token: ${mint}`);
        detected.add(mint);

        try {
          // Ensure mint address is correct
          const fullReport = await getFullTokenReportFromMint(mint);

          if (fullReport.success && fullReport.report) {
            this.emit('newToken',fullReport.report)
           // console.log(`✅ Alert sent for: ${mint}`);
          } else {
            console.warn(`⚠️ Failed to fetch full report for: ${mint}. Response: ${JSON.stringify(fullReport)}`);
          }
        } catch (err) {
          console.error(`❌ Error fetching full report for token ${mint}:`, err);
        }
      }
    } catch (error) {
      console.error('❌ Error fetching Dexscreener token profiles:', error);
    }
  }, 10000);
    // 
  }
}

 