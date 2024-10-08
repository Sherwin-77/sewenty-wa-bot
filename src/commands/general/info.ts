import type { SewentyBot } from "@/lib/whatsapp/client";
import type { Message } from "whatsapp-web.js";
import { Command } from "../command";

const command: Command = {
    name: "Info",
    help: "Get information about the bot",
    cmd: ["info", "about"],
    async execute(bot: SewentyBot, msg: Message, args: string[]) {
        msg.reply(`
        *Bot Info*
        Name: SewentySewen
        Version: 1.0.0
        `)
    }
}

export default command;