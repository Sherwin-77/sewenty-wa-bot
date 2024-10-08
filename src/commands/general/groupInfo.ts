import type { SewentyBot } from "@/lib/whatsapp/client";
import type { GroupChat, Message } from "whatsapp-web.js";
import { Command } from "../command";
import groupOnly from "@/middlewares/groupOnly";

const command: Command = {
    name: "Group Info",
    category: "General",
    help: "Get information about group",
    middlewares: [groupOnly],
    cmd: ["groupinfo"],
    async execute(bot: SewentyBot, msg: Message, args: string[]) {
        const chat = await msg.getChat() as GroupChat

        await bot.replyMessage(msg, `
            *Group Details*
            Name: ${chat.name}
            Description: ${chat.description}
            Created At: ${chat.createdAt.toString()}
            Created By: ${chat.owner.user}
            Participant count: ${chat.participants.length}
        `);
    }
}

export default command;