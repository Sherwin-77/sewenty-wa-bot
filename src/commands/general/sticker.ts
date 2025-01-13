import type { SewentyBot } from "@/lib/whatsapp/client";
import { Command } from "../command";
import { Message } from "whatsapp-web.js";
import throttleCommand from "@/middlewares/throttleCommand";

const command: Command = {
    name: "Sticker",
    category: "General",
    help: "Get information about sticker",
    cmd: ["sticker"],
    cooldownSeconds: 15,
    middlewares: [throttleCommand],
    async execute(bot: SewentyBot, msg: Message, args: string[]) {
        const chat = await msg.getChat();
        chat.sendStateTyping();
        if (msg.type == "image" || msg.type == "video") {
            const toDownload = await msg.downloadMedia();
            if (! toDownload) {
                await bot.sendMessage(msg.from, "Failed to download media")
                return
            }
            await bot.sendMessage(msg.from, toDownload, { sendMediaAsSticker: true, stickerName: bot.stickerName, stickerAuthor: bot.stickerAuthor });
        } else {
            const quotedMsg = await msg.getQuotedMessage();
            if (!quotedMsg) {
                await bot.sendMessage(msg.from, "Please use command with image/video");
                return
            }
            if (!(quotedMsg.type == "image" || quotedMsg.type == "video")) return;
            const toDownload = await quotedMsg.downloadMedia();
            if (! toDownload) {
                await bot.sendMessage(msg.from, "Failed to download media")
                return
            }
            await bot.sendMessage(msg.from, toDownload, { sendMediaAsSticker: true, stickerName: bot.stickerName, stickerAuthor: bot.stickerAuthor });
        }
    }   
}

export default command