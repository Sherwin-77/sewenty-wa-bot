import type { SewentyBot } from "@/lib/whatsapp/client";
import { Message } from "whatsapp-web.js";

const throttleCommand = async (bot: SewentyBot, msg: Message) => {
    const command = bot.getCommand(msg.body.slice(bot.prefix.length).trim().split(/ +/)[0])

    if (!command) return true;

    let cooldown = bot.cooldowns.get(command.cmd[0]);
    if (!cooldown) {
        bot.cooldowns.set(command.cmd[0], new Set());
        cooldown = bot.cooldowns.get(command.cmd[0])!;
    }

    if (cooldown.has(msg.from)) {
        await msg.reply("You are on cooldown, please wait a few seconds before using this command again.");
        return false;
    }

    cooldown.add(msg.from);
    setTimeout(() => {
        cooldown.delete(msg.from);
    }, (command.cooldownSeconds ?? 5) * 1000);

    return true;
}

export default throttleCommand