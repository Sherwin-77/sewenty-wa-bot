import { Client as BaseClient, LocalAuth, Message } from "whatsapp-web.js";
import qrcode from "qrcode-terminal";
import path from "path";
import fs from "fs";
import { Command } from "@/commands/command";

import config from "@/../config.json";

export class SewentyBot extends BaseClient {
    commands: Command[];
    mappedCommands: Map<string, Command>;
    ownerNumber: string
    botName: string;
    botVersion: string;
    prefix: string;

    constructor() {
        super({
            authStrategy: new LocalAuth(),
            puppeteer: {
                headless: true,
            }
        });
        this.commands = [];
        // TODO: Lookup by mapped commands
        this.mappedCommands = new Map();
        this.botName = config.botName;
        this.botVersion = config.botVersion;
        this.prefix = config.settings.prefix;
        this.ownerNumber = process.env.OWNER_NUMBER;
    }

    async helpCommand(msg: Message, args: string[]) {
        if (args.length > 1) {
            const command = this.commands.find(c => c.name === args[1]);
            if (command) {
                const helpMsg = [
                    `*${command.name}*`,
                    command.help,
                    `Usage: ${this.prefix}${command.cmd[0]}`,
                ];
                if (command.cmd.length > 1) {
                    helpMsg.push(`Aliases: ${command.cmd.slice(1).join(', ')}`);
                }
                if (command.usage) {
                    helpMsg.push(`Usage: ${this.prefix}${command.usage}`);
                }

                await this.replyMessage(msg, helpMsg.join('\n'));
            } else {
                await this.replyMessage(msg, `Command not found`);
            }
        } else {
            const categories: Record<string, string[]> = {};
            for(const command of this.commands) {
                if (command.isHidden) continue;
                if (!categories[command.category || '']) {
                    categories[command.category] = [];
                }
                categories[command.category].push(`${this.prefix}${command.cmd[0]} (${command.name}) - ${command.help}`);
            }
            const helpMsg = [
                `*_${this.botName}_*`,
                `For more information, type: ${this.prefix}help <command>`,
                ...Object.entries(categories).map(([category, commands]) => `\n*${category}*\n${commands.join('\n')}`),
            ];

            await this.replyMessage(msg, helpMsg.join('\n'));
        }
    }

    async handleMessage(msg: Message) {
        if (! msg.body.startsWith(this.prefix)) return;
        const args = msg.body.slice(this.prefix.length).trim().split(/ +/);
        if (args.length < 1) return;
        if (args[0] === 'help') {
            await this.helpCommand(msg, args);
            return;
        }
        const command = this.commands.find(c => c.cmd.includes(args[0]) && !c.isDisabled);
        if (command) {
            if (command.middlewares) {
                for (const middleware of command.middlewares) {
                    try {
                        if (! await middleware(this, msg)) {
                            return;
                        }
                    } catch (error) {
                        console.error("Middleware error: ", error);
                        return;
                    }
                }
            }

            try {
                await command.execute(this, msg, args.slice(1));
            } catch (error) {
                console.error(error);
                try {
                    await this.replyMessage(msg, "An error occurred while executing the command");
                } catch (error) {
                    console.error("While handling error, another error occurred: ", error);
                }
            }
        } else {
            msg.reply("Command not found");
        }
    }

    async loadCommands() {
        // TODO: Handle path
        const commandsDir = path.join(__dirname, '..', '..', 'commands');
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
        this.on("loading_screen", (percent) => {
            const progressBarLength = 20;
            const filledLength = Math.round((parseInt(percent) / 100) * progressBarLength);
            const progressBar = '█'.repeat(filledLength) + '-'.repeat(progressBarLength - filledLength);
            console.log(`[${progressBar}] ${percent}% loaded`);
        })

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

        this.on("ready", async () => {
            console.log("Bot is ready!");
            console.log("Whatsapp-Web version: ", await this.getWWebVersion())
            await this.loadCommands();
            console.log("Commands loaded");
        });

        this.on("disconnected", (reason) => {
            console.error("Client was logged out: ", reason);
        });

        this.on("message", async (msg) => {
            this.handleMessage(msg);
        });
    }

    async replyMessage(msg: Message, content: string) {
        content = content.replace(/^ +/gm, '').trim()
        if (content.length > 4096) {
            content = content.slice(0, 4093) + "...";
        }
        await msg.reply(content);
    } 
}