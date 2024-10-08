import type { SewentyBot } from "@/lib/whatsapp/client";
import type { Message } from "whatsapp-web.js";
import { Command } from "../command";

const command: Command = {
    name: "Info",
    category: "General",
    help: "Get information about the bot",
    cmd: ["info", "about"],
    async execute(bot: SewentyBot, msg: Message, args: string[]) {
        await bot.replyMessage(msg, `
            *Bot Info*
            Name: ${bot.botName}
            Version: ${bot.botVersion}
        `);
    }
}

export default command;