import type { Message } from "whatsapp-web.js";
import type { SewentyBot } from "@/lib/whatsapp/client";

const ownerOnly = async (bot: SewentyBot, msg: Message) => {
    if (msg.from === `${process.env.OWNER_NUMBER}@c.us`) return true;
    await msg.reply("This command is only for the owner!");
    return false;
};

export default ownerOnly;
