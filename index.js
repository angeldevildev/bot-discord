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

    if (command === 'ban') {
      const member = message.mentions.members.first() || message.guild.members.cache.get(argument[0]) || message.guild.members.cache.find(x => x.user.username.toLowerCase() === argument.slice(0).join(" " || x.user.username === argument[0]));
  
      if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) return message.channel.send("You don't have permission to ban people in this server!");
      if (!member) return message.channel.send("You must specify someone in this command!");
      if (message.member === member) return message.channel.send("You cannot ban yourself");
      if (!member.kickable) return message.channel.send("You cannot ban this person!");
  
  
      let reason = argument.slice(1).join(" ") || "No reason given."
  
      const embed = new EmbedBuilder()
      .setColor("Blue")
      .setDescription(`:white_check_mark: ${member.user} has been **banned** | ${reason}`)
  
      const dmEmbed = new EmbedBuilder()
      .setColor("Blue")
      .setDescription(`:white_check_mark: You were **banned** from ${message.guild.name} | ${reason}`)
  
      member.send({ embeds: [dmEmbed]}).catch(err => {
          console.log(`${member.user} has their DMs off and cannot receive the ban message.`);
      })
  
      member.ban().catch(err => {
          message.channel.send("There was an error banning this member");
      })
  
      message.channel.send({ embeds: [embed] });
  }
 })