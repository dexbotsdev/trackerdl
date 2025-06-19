import { LockEvents } from "./LockEvents";

// --- Apify API Info ---
const APIFY_TOKEN = "apify_api_CydE3y3Iz0e9Uk1dr3vxmGZZS0xVf93cn8mN";
const APIFY_TASK_ID = "plio-sol~gmgn-kol-monitor-scraper-task";

// --- API Endpoints ---
const KOL_DATA_ENDPOINT = `https://api.apify.com/v2/actor-tasks/${APIFY_TASK_ID}/runs/last/dataset/items?token=${APIFY_TOKEN}&status=SUCCEEDED`;
const KOL_RUN_META_ENDPOINT = `https://api.apify.com/v2/actor-tasks/${APIFY_TASK_ID}/runs/last?token=${APIFY_TOKEN}&status=SUCCEEDED`;

// For Node.js v18+, you can use the built-in fetch. For older versions, uncomment the next line:
// const fetch = require('node-fetch');

async function testApifyEndpoints() {
    try {
        // Fetch dataset items
        const dataRes = await fetch(KOL_DATA_ENDPOINT);
        const data = await dataRes.json();
        //console.log('KOL Data:', data);

        // Fetch run metadata
        const metaRes = await fetch(KOL_RUN_META_ENDPOINT);
        const meta = await metaRes.json();
         console.log('Run Metadata:', meta);
    } catch (error) {
        console.error('Error:', error);
    }
}

const trac = new LockEvents();
trac.trackNewLocks();

