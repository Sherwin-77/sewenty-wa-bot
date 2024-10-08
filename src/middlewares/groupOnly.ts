import type { SewentyBot } from "@/lib/whatsapp/client";
import { Message } from "whatsapp-web.js";

const groupOnly = async (bot: SewentyBot, msg: Message) => {
    const chat = await msg.getChat();

    if (chat.isGroup) return true;
    await msg.reply("This command can only be used in a group!");
    return false;
};

export default groupOnly;