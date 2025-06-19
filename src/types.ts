/**
 *  Interface type for response from Pump.fun king of the hill
 */
export interface PumpFunKothToken {
  mint: string;
  name: string;
  symbol: string;
  description: string;
  image_uri: string;
  video_uri: string | null;
  metadata_uri: string;
  twitter: string;
  telegram: string;
  bonding_curve: string;
  associated_bonding_curve: string;
  creator: string;
  created_timestamp: number;
  raydium_pool: string | null;
  complete: boolean;
  virtual_sol_reserves: number;
  virtual_token_reserves: number;
  total_supply: number;
  website: string;
  show_name: boolean;
  king_of_the_hill_timestamp: number;
  market_cap: number;
  reply_count: number;
  nsfw: boolean;
  market_id: string | null;
  inverted: boolean | null;
  is_currently_live: boolean;
  username: string | null;
  profile_image: string | null;
  usd_market_cap: number;
}
export interface kothTokenReponse {
  mint?: string;
  success: boolean;
  msg: string;
  report: PumpFunKothToken | null;
}

/**
 *  Interface for Mint report return including all checks and information
 */
export interface tokenReport {
  mint: string;
  name: string;
  symbol: string;
  imageUri: string;
  description: string;
  website: string;
  twitter: string;
  telegram: string;
  creator: string;
  createdTimestamp: number | null;
  createdTime: string;
  mintFilledPerc: string;
  replyCount: number;
  usdMarketCap: number;
  creatorIncluded: boolean;
  creatorTokensCreated: number;
  creatorTokensMigrated: number;
  creatorTokensMigratedPerc: string;
  creatorTokensAvgReplies: string;
  rugCheckHoldersPct: string;
  dexOrders: DexOrderReponseArray;

  // ✅ Make KOTH fields optional
  KothTimestamp?: number | null;
  KothTime?: string;
  KothTimeSince?: string;
  kothTimeUntil?: string;
}


export interface FullTokenReportResponse {
  mint?: string;
  success: boolean;
  msg: string;
  report: tokenReport | null;
}

/**
 *  Interface for the creators information for the pump.fun coin in the full token report
 */
interface PumpFunCoinCreatedResponse {
  mint: string;
  name: string;
  symbol: string;
  description: string;
  image_uri: string;
  video_uri: string | null;
  metadata_uri: string;
  twitter: string | null;
  telegram: string | null;
  bonding_curve: string;
  associated_bonding_curve: string;
  creator: string;
  created_timestamp: number;
  raydium_pool: string | null;
  complete: boolean;
  virtual_sol_reserves: number;
  virtual_token_reserves: number;
  total_supply: number;
  website: string | null;
  show_name: boolean;
  king_of_the_hill_timestamp: number;
  market_cap: number;
  reply_count: number;
  last_reply: number;
  nsfw: boolean;
  market_id: string | null;
  inverted: boolean;
  is_currently_live: boolean;
  username: string | null;
  profile_image: string | null;
  usd_market_cap: number;
}

/**
 *  Interface for Dexscreener orders information in the full token report
 */
interface DexOrderReponse {
  type: string;
  status: string; // Add other status options if applicable
  paymentTimestamp: number; // Unix timestamp in milliseconds
}

/**
 *  Interface for Rugcheck information in the full token report
 */
export interface RugCheckReportResponse {
  mint: string;
  tokenProgram: string;
  creator: string;
  token: {
    mintAuthority: string | null;
    supply: number;
    decimals: number;
    isInitialized: boolean;
    freezeAuthority: string | null;
  };
  token_extensions: any | null;
  tokenMeta: {
    name: string;
    symbol: string;
    uri: string;
    mutable: boolean;
    updateAuthority: string;
  };
  topHolders: {
    address: string;
    amount: number;
    decimals: number;
    pct: number;
    uiAmount: number;
    uiAmountString: string;
    owner: string;
    insider: boolean;
  }[];
  freezeAuthority: string | null;
  mintAuthority: string | null;
  risks: any[];
  score: number;
  fileMeta: {
    description: string;
    name: string;
    symbol: string;
    image: string;
  };
  lockerOwners: Record<string, any>;
  lockers: Record<string, any>;
  markets: {
    pubkey: string;
    marketType: string;
    mintA: string;
    mintB: string;
    mintLP: string;
    liquidityA: string;
    liquidityB: string;
    mintAAccount: {
      mintAuthority: string | null;
      supply: number;
      decimals: number;
      isInitialized: boolean;
      freezeAuthority: string | null;
    };
    mintBAccount: {
      mintAuthority: string | null;
      supply: number;
      decimals: number;
      isInitialized: boolean;
      freezeAuthority: string | null;
    };
    mintLPAccount: {
      mintAuthority: string | null;
      supply: number;
      decimals: number;
      isInitialized: boolean;
      freezeAuthority: string | null;
    };
    liquidityAAccount: {
      mint: string;
      owner: string;
      amount: number;
      delegate: string | null;
      state: number;
      delegatedAmount: number;
      closeAuthority: string | null;
    };
    liquidityBAccount: {
      mint: string;
      owner: string;
      amount: number;
      delegate: string | null;
      state: number;
      delegatedAmount: number;
      closeAuthority: string | null;
    };
    lp: {
      baseMint: string;
      quoteMint: string;
      lpMint: string;
      quotePrice: number;
      basePrice: number;
      base: number;
      quote: number;
      reserveSupply: number;
      currentSupply: number;
      quoteUSD: number;
      baseUSD: number;
      pctReserve: number;
      pctSupply: number;
      holders: any | null;
      totalTokensUnlocked: number;
      tokenSupply: number;
      lpLocked: number;
      lpUnlocked: number;
      lpLockedPct: number;
      lpLockedUSD: number;
      lpMaxSupply: number;
      lpCurrentSupply: number;
      lpTotalSupply: number;
    };
  }[];
  totalMarketLiquidity: number;
  totalLPProviders: number;
  rugged: boolean;
  tokenType: string;
  transferFee: {
    pct: number;
    maxAmount: number;
    authority: string;
  };
  knownAccounts: Record<string, { name: string; type: string }>;
  events: any[];
  verification: any | null;
  graphInsidersDetected: number;
  graphInsiderReport: any | null;
  detectedAt: string;
}

/**
 *  Interface for pump.fun global data
 */
export interface PumpFunGlobalDataReponse {
  slot: number;
  signature: string;
  initial_virtual_token_reserves: number;
  initial_virtual_sol_reserves: number;
  initial_real_token_reserves: number;
  token_total_supply: number;
  fee_basis_points: number;
  timestamp: number;
}

export type PumpFunCoinCreatedResponseArray = PumpFunCoinCreatedResponse[];
export type DexOrderReponseArray = DexOrderReponse[];