import type { SewentyBot } from "@/lib/whatsapp/client";
import type { Message } from "whatsapp-web.js";
import { Command } from "../command";

const command: Command = {
    name: "Asset",
    category: "Misc",
    help: "Get information about asset price",
    cmd: ["asset"],
    usage: "asset <symbol>",
    async execute(bot: SewentyBot, msg: Message, [asset, ...args]: string[]) {
        if (!asset) {
            await bot.replyMessage(msg, "Please provide an asset symbol");
            return;
        }
        let assetInfo;
        try {
            const assetsQuery = await fetch(`https://api.coincap.io/v2/assets?search=${asset}&limit=1`);
            const assets = await assetsQuery.json();
            if (assets.data.length < 1) {
                await bot.replyMessage(msg, "Asset not found");
                return;
            }
    
            const assetData = assets.data[0];
            const assetId = assetData.id;
            const assetQuery = await fetch(`https://api.coincap.io/v2/assets/${assetId}`);
            assetInfo = await assetQuery.json();
        } catch (error) {
            console.error("Error fetching asset data: ", error);
            await bot.replyMessage(msg, "Error fetching asset data");
            return;
        }

        if (!assetInfo?.data) {
            await bot.replyMessage(msg, "Asset not found");
            return;
        }

        await bot.replyMessage(msg, `
            *${assetInfo.data.name} (${assetInfo.data.symbol})*
            Price: $${parseFloat(assetInfo.data.priceUsd).toFixed(3)}
            Rank: ${assetInfo.data.rank}
            Change 24h: ${parseFloat(assetInfo.data.changePercent24Hr).toFixed(2)}%
        `);
    }
}

export default command;