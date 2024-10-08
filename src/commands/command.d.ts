import type { SewentyBot } from "@/lib/whatsapp/client";
import type { Message } from "whatsapp-web.js";

export interface Command {
    name: string;
    help: string;
    category: string;
    cmd: string[];
    middlewares?: ((bot: SewentyBot, msg: Message) => Promise<boolean>)[];
    isDisabled?: boolean;
    isHidden?: boolean;
    execute(bot: any, msg: any, args: string[]): void;
}