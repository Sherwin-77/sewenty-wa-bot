export interface Command {
    name: string;
    help: string;
    cmd: string[];
    execute(bot: any, msg: any, args: string[]): void;
}