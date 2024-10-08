import { Client as BaseClient, LocalAuth, Message } from "whatsapp-web.js";
import qrcode from "qrcode-terminal";
import path from "path";
import fs from "fs";
import { Command } from "@/commands/command";

export class SewentyBot extends BaseClient {
    commands: Command[];
    prefix: string;

    constructor() {
        super({
            authStrategy: new LocalAuth(),
            puppeteer: {
                headless: true,
            }
        });
        this.commands = [];
        this.prefix = "!";
    }

    async handleMessage(msg: Message) {

    }

    async loadCommands() {
        const commandsDir = path.join(__dirname, 'commands');
        const commands: Command[] = [];
    
        async function readCommands(dir: string) {
            const files = await fs.promises.readdir(dir, { withFileTypes: true });
    
            for (const file of files) {
                const fullPath = path.join(dir, file.name);
    
                if (file.isDirectory()) {
                    await readCommands(fullPath);
                } else if (file.isFile() && (file.name.endsWith('.js') || file.name.endsWith('.ts'))) {
                    const command = await import(fullPath);
                    commands.push(command.default);
                }
            }
        }
    
        await readCommands(commandsDir);
        this.commands = commands;
    }

    bindEvents() {
        this.on("qr", (qr) => {
            // Generate and scan this code with your phone
            qrcode.generate(qr, {small: true}, (code: string) => {
                console.log(code)
            });
        });

        this.on("authenticated", () => {
            console.log("AUTHENTICATED");
        });

        this.on("auth_failure", (reason) => {
            console.error("AUTHENTICATION FAILURE: ", reason);
        });

        this.on("ready", () => {
            console.log("Bot is ready!");
            console.log("Whatsapp-Web version: ", this.getWWebVersion())
        });

        this.on("disconnected", (reason) => {
            console.error("Client was logged out: ", reason);
        });

        this.on("message", async (msg) => {
            this.handleMessage(msg);
        });
    }
}