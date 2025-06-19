import dotenv from "dotenv";
dotenv.config();

import { Telegraf } from 'telegraf';

const bot = new Telegraf(process.env.TELEGRAM_TOKEN as string);
const channelId = process.env.TELEGRAM_CHANNEL_ID as string;
import { DexPaidEvents } from './DexpaidEvents';
import { tokenReport } from "./types";
import { LockEvents } from "./LockEvents";


class TelegramBot {
    private dexPaidEvents: DexPaidEvents;
    private lockEvents: LockEvents; // Assuming you have a LockEvents class similar to DexPaidEvents

    constructor() {
        this.dexPaidEvents = new DexPaidEvents();
        this.dexPaidEvents.trackNewDexpaid();
        this.lockEvents = new LockEvents();
        this.lockEvents.trackNewLocks();


        this.lockEvents.on('newLock', async (lockReport: any) => {
            const report = lockReport;
            const message = `
<b>🔒 New Lock Detected!</b>
<b>🔗 Token:</b> <b>${report.name}</b> (<code>${report.symbol}</code>)
<b>🆔 Mint:</b> <code>${report.mint}</code>
`;
            try {
                if (report.imageUri) {
                    // If the token has an image, send it as a photo
                    await bot.telegram.sendPhoto(-1002850551717, report.imageUri, { caption: message, parse_mode: 'HTML', disable_notification: true, disable_web_page_preview: true });
                } else {
                    // If no image, send as a text message
                    await bot.telegram.sendMessage(-1002850551717, message, { parse_mode: 'HTML', disable_notification: true, disable_web_page_preview: true });
                }
            } catch (error) {
                console.error('Error sending lock message:', error);
            }
        });



        this.dexPaidEvents.on('newToken', async (tokenReport: tokenReport) => {
            const report = tokenReport;

            const message = `
<b>🟢 New DexPaid Detected!</b> 

<b>🪙 Token:</b> <b>${report.name}</b> (<code>${report.symbol}</code>)
<b>🆔 Mint:</b> <code>${report.mint}</code> 
<b>💰 Market Cap:</b> <b>$${report.usdMarketCap ? report.usdMarketCap.toLocaleString(undefined, { maximumFractionDigits: 2 }) : 'N/A'}</b>
<b>💬 Replies:</b> ${report.replyCount}
<b>⏰ Created:</b> ${report.createdTime}
<b>👤 Creator:</b> <code>${report.creator}</code> 
${report.website ? `<b>🌐 Website:</b> <a href="${report.website}">${report.website}</a>\n` : ''}
${report.twitter ? `<b>🐦 Twitter:</b> <a href="${report.twitter}">${report.twitter}</a>\n` : ''}
${report.telegram ? `<b>✈️ Telegram:</b> <a href="${report.telegram}">${report.telegram}</a>\n` : ''} 
${report.description ? `<b>📝 Description:</b> ${report.description}\n` : ''} 
<b>👨‍💻 Creator Stats:</b>
• 🆕 Tokens Created: <b>${report.creatorTokensCreated}</b>
• 🔄 Tokens Migrated: <b>${report.creatorTokensMigrated}</b> (${report.creatorTokensMigratedPerc}%)
• 📈 Avg Replies: <b>${report.creatorTokensAvgReplies}</b>

#DexPaid #NewToken
`;

            try {

                if (report.imageUri) {
                    // If the token has an image, send it as a photo
                    await bot.telegram.sendPhoto(-1002850551717, report.imageUri, { caption: message, parse_mode: 'HTML', disable_notification: true, disable_web_page_preview: true });
                } else {
                    // If no image, send as a text message
                    await bot.telegram.sendMessage(-1002850551717, message, { parse_mode: 'HTML', disable_notification: true, disable_web_page_preview: true });
                }
            } catch (error) {

            }

        });

        bot.start((ctx) => {

            ctx.reply('Welcome to the DEX Paid Watcher Bot!');
            console.log(`Received message: ${ctx.message.text}`);

            console.log(ctx.message)

        });

        bot.on('text', (ctx) => {
            ctx.reply('I am currently monitoring for new DEX-paid tokens. Please wait for updates.');

            console.log(`Received message: ${ctx.message.text}`);

            console.log(ctx.message)
        });


        bot.help((ctx) => ctx.reply('Use /start to begin watching for new DEX-paid tokens.'));


        bot.launch().then(() => {
            console.log('✅ Telegram bot is running.');
        })


    }
}


new TelegramBot();
