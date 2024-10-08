import type { SewentyBot } from "@/lib/whatsapp/client";
import type { Message } from "whatsapp-web.js";
import { Command } from "../command";

const command: Command = {
    name: "Bitcoin",
    category: "General",
    help: "Get information current bitcoin price",
    cmd: ["btc"],
    async execute(bot: SewentyBot, msg: Message, args: string[]) {
        const res = await fetch("https://api.coindesk.com/v1/bpi/currentprice.json");
        const data = await res.json();
        await bot.replyMessage(msg, `
            *Bitcoin*
            Price: ${data.bpi.USD.rate_float} USD
            Updated At: ${data.time.updated}
        `);
    }
}

export default command;