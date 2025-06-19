export const config = { 
  polling: {
    intervalMs: 60 * 1000, // 60 seconds
    verboseLogs: true,
  },
  dexScreener: {
    dexPaidApi: "https://dd.dexscreener.com/ds-data/ads/active/v5",
    recentPumpFunApi: "https://frontend-api-v3.pump.fun/coins/recent",
  },
  settings: {
    retryOnFail: true,
    maxRetries: 3,
    delayBetweenRetriesMs: 2000,

    // ✅ Add this block:
    mint_report: {
      request_timeout: 10000, // in milliseconds (adjust if needed)
    },
  },
};