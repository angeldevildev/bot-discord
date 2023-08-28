const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, PermissionsBitField } = require('discord.js');
const { Client, IntentsBitField } = require('discord.js');
const prefix = '>';
require('dotenv').config();


const client = new Client({
    intents: [
       IntentsBitField.Flags.Guilds,
       IntentsBitField.Flags.GuildMessages,
       IntentsBitField.Flags.MessageContent,
       IntentsBitField.Flags.GuildMembers,
     ] 
   });
 
 client.on("ready", (c) => {
     console.log(`✅ ${c.user.tag} is online.`);
     client.user.setActivity('Activity');
 });
 
 client.on('interactionCreate', (interaction) => {
   if (interaction.isChatInputCommand()) return;
 })

 client.on("messageCreate", (message) => {
    if (!message.content.startsWith(prefix) ||  message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    //message Array

    const messageArray = message.content.split(" ");
    const argument = messageArray.slice(1);
    const cmd = messageArray[0];


    //COMMANDS

    if (command === 'test'){

        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) return message.channel.send("You don't have permission to use this command!");
    
        message.channel.send("Bot is working!");
    }
 })