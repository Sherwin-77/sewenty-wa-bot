import { SewentyBot } from "./lib/whatsapp/client";
import 'dotenv/config';

const client = new SewentyBot();

client.bindEvents();
console.log("Starting...")
client.initialize();

// TODO: Subclass?
// client.on("message", async msg => {
//     if (msg.body == "!ping") {
//         await msg.reply('pong');
//     } else if (msg.body.startsWith("!echo")) {
//         if(msg.body.length <= 6) await msg.reply("Message required")
//         else await msg.reply(msg.body.slice(6));
//     } else if (msg.body === '!groupinfo') {
//         const chat = await msg.getChat() as GroupChat
//         if (chat.isGroup) {
//             await msg.reply(`
//             *Group Details*
//             Name: ${chat.name}
//             Description: ${chat.description}
//             Created At: ${chat.createdAt.toString()}
//             Created By: ${chat.owner.user}
//             Participant count: ${chat.participants.length}
//             `);
            
//         } else {
//             await msg.reply("This command can only be used in a group!");
//         }
//     } else if (msg.body === "!mediainfo" && msg.hasMedia) {
//         const attachmentData = await msg.downloadMedia();
//         await msg.reply(`
//         *Media info*
//         MimeType: ${attachmentData.mimetype}
//         Filename: ${attachmentData.filename}
//         Data (length): ${attachmentData.data.length}
//         `.replace(/^ +/gm, ''));
//     } else if (msg.body === "!resendmedia" && msg.hasQuotedMsg) {
//         const quotedMsg = await msg.getQuotedMessage();
//         if (quotedMsg.hasMedia) {
//             const attachmentData = await quotedMsg.downloadMedia();
//             await client.sendMessage(msg.from, attachmentData, { caption: "Here's your requested media" });
//         }
//         if (quotedMsg.hasMedia && quotedMsg.type === "audio") {
//             const audio = await quotedMsg.downloadMedia();
//             await client.sendMessage(msg.from, audio, { sendAudioAsVoice: true });
//         }
//     } else if (msg.body === "!sticker") {
//         if (msg.type == "image" || msg.type == "video") {
//             const toDownload = await msg.downloadMedia();
//             await client.sendMessage(msg.from, toDownload, { sendMediaAsSticker: true, stickerName: "Sticker", stickerAuthor: "SewentySewenBOT" })
//         } else {
//             const quotedMsg = await msg.getQuotedMessage();
//             if (!(quotedMsg.type == "image" || quotedMsg.type == "video")) return;
//             const toDownload = await quotedMsg.downloadMedia()
//             await client.sendMessage(msg.from, toDownload, { sendMediaAsSticker: true, stickerName: "Sticker", stickerAuthor: "SewentySewenBOT" })
//         }
//         // TODO: Better help command
//     } else if(msg.body === "!help") {
//         await msg.reply(`
//         Hello! I am SewentySewen
//         ~Use "s!help [command] for more info on a command~ (Not supported yet)
//         *Random*
//         ➥ ping, echo, mediainfo, resendmedia
//         *Sticker*
//         ➥ sticker
//         `.replace(/^ +/gm, ''))
//     }
// });

// client.on("disconnected", (reason) => {
//     console.log(`Disconnected: ${reason}`)
// })

// console.log("Starting")
// client.initialize()
