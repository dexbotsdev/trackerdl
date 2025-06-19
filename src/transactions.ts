import axios from "axios";
import { config } from "./config";
import {
  DexOrderReponseArray,
  FullTokenReportResponse,
  PumpFunCoinCreatedResponseArray,
  PumpFunGlobalDataReponse,
  PumpFunKothToken,
  RugCheckReportResponse,
} from "./types";
import { formatDistanceToNow, formatDuration, getUnixTime, intervalToDuration } from "date-fns";
 
/**
 *  Function to Fetch the metadata, onchain data and creator information
 */
export async function getFullTokenReport(pumpCoin: PumpFunKothToken): Promise<FullTokenReportResponse> {
  try {
    const mintCa = pumpCoin.mint;
    const mintName = pumpCoin.name || "Unknown";
    const mintSymbol = pumpCoin.symbol || "Unknown";
    const mintDescription = pumpCoin.description || "";
    const mintImage = pumpCoin.image_uri || "";
    const mintSocialTwitter = pumpCoin.twitter || "";
    const mintSocialTelegram = pumpCoin.telegram || "";
    const mintSocialWebsite = pumpCoin.website || "";
    const mintCreator = pumpCoin.creator || "";
    const mintCreated = pumpCoin.created_timestamp || null;
    const mintReplies = pumpCoin.reply_count || 0;
    const mintMarketCap = pumpCoin.usd_market_cap || 0;
    const mintVirtualTokenReserves = pumpCoin.virtual_token_reserves;

    let mintCreatedTime = "";
    if (mintCreated) {
      const parsedDate = new Date(mintCreated);
      if (!isNaN(parsedDate.getTime())) {
        mintCreatedTime = formatDistanceToNow(parsedDate, { addSuffix: true });
      }
    }

    let mintFilledPerc = "Unknown";
     
    let creatorCoinsCreated = 0;
    let creatorCoinsMigrated = 0;
    let creatorCoinsMigratedPerc = "";
    let creatorCoinsAvgReplies = "";
    let includeCreator = false;

    if (mintCreator) {
      const pumpFrontEndCreatedApi = "https://frontend-api-v3.pump.fun/coins/user-created-coins/{:creator:}?offset=0&limit=1000&includeNsfw=true";
      const pumpCoinCreatedUrl = pumpFrontEndCreatedApi.replace("{:creator:}", mintCreator);

      const responseCreator = await axios.get<any>(pumpCoinCreatedUrl, {
        headers: { "Content-Type": "application/json" },
        timeout: config.settings.mint_report.request_timeout,
      });

 

      if (responseCreator.data) {
        includeCreator = true;
        const pumpCreator: PumpFunCoinCreatedResponseArray = responseCreator.data.coins;

        creatorCoinsCreated = pumpCreator.length;
        creatorCoinsMigrated = pumpCreator.filter((item) => item.raydium_pool !== null).length;
        creatorCoinsMigratedPerc = (creatorCoinsMigrated / creatorCoinsCreated).toFixed(2);

        const totalReplies = pumpCreator.reduce((sum, item) => sum + item.reply_count, 0);
        creatorCoinsAvgReplies = pumpCreator.length > 0 ? (totalReplies / pumpCreator.length).toFixed(2) : "0";
      }
    }

    const dexOrdersApi = process.env.DEX_ORDERS_HTTPS || "https://api.dexscreener.com/orders/v1/solana/";
    const responseOrders = await axios.get<any>(`${dexOrdersApi}${mintCa}`, {
      headers: { "Content-Type": "application/json" },
      timeout: config.settings.mint_report.request_timeout,
    });

    let dexOrders: DexOrderReponseArray = [];
    if (responseOrders.data) {
      dexOrders = responseOrders.data;

 

    }

    const rugcheckApi = "https://api.rugcheck.xyz/v1";
 
    let rugCheckHoldersPct = "Unknown";
    try {
      const responseRugCheck = await axios.get<any>(`${rugcheckApi}/tokens/${mintCa}/report/summary`, {
        headers: { "Content-Type": "application/json" },
        timeout: config.settings.mint_report.request_timeout,
      });

                 
      if (responseRugCheck.data) {


        const rugCheckReport: RugCheckReportResponse = responseRugCheck.data;
        const rugCheckHolders = rugCheckReport.topHolders;
        if (rugCheckHolders && rugCheckHolders.length !== 0) {
          rugCheckHolders.shift();
          const totalPct = rugCheckHolders.reduce((sum, holder) => sum + holder.pct, 0);
          if (!isNaN(totalPct)) rugCheckHoldersPct = totalPct.toFixed(5);
        }
      }
    } catch (error) {
      
      console.warn("🚫 Rugcheck failed:", error);
    }

    return {
      mint: mintCa,
      success: true,
      msg: "success",
      report: {
        mint: mintCa,
        name: mintName,
        symbol: mintSymbol,
        imageUri: mintImage,
        description: mintDescription,
        website: mintSocialWebsite,
        twitter: mintSocialTwitter,
        telegram: mintSocialTelegram,
        creator: mintCreator,
        createdTimestamp: mintCreated,
        createdTime: mintCreatedTime,
        mintFilledPerc: mintFilledPerc,
        replyCount: mintReplies,
        usdMarketCap: mintMarketCap,
        creatorIncluded: includeCreator,
        creatorTokensCreated: creatorCoinsCreated,
        creatorTokensMigrated: creatorCoinsMigrated,
        creatorTokensMigratedPerc: creatorCoinsMigratedPerc,
        creatorTokensAvgReplies: creatorCoinsAvgReplies,
        rugCheckHoldersPct: rugCheckHoldersPct,
        dexOrders: dexOrders,
      },
    };
  } catch (error) {
    //console.log(error);
    return {
      mint: undefined,
      success: false,
      msg: "🚫 Failed to build token report: " + error,
      report: null,
    };
  }
}

/**
 * Get report from mint string (used in DexPaid watcher)
 */
export async function getFullTokenReportFromMint(mint: string): Promise<FullTokenReportResponse> {
  try {
    const response = await fetch(`https://frontend-api-v3.pump.fun/coins/${mint}`);
    const tokenData = await response.json();
    return await getFullTokenReport(tokenData);
  } catch (error) {

   // console.log(error);
    return {
      success: false,
      msg: `Failed to fetch token info for ${mint}`,
      mint,
      report: null,
    };
  }
}