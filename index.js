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


    //MODERATION COMMANDS

    if (command === 'test'){

        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) return message.channel.send("You don't have permission to use this command!");
    
        message.channel.send("Bot is working!");
    }

    // BAN COMMAND

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

  //TIMEOUT COMMAND

  if(command === 'timeout'){

    const timeUser = message.mentions.members.first() || message.guild.members.cache.get(argument[0]) || message.guild.members.cache.find(x => x.user.username.toLowerCase() === argument.slice(0).join(" " || x.user.username === argument[0]));
    const duration = argument[1];

    if (!message.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) return message.channel.send("You don't have permissions to time people out this server!");
    if (!timeUser) return message.channel.send("Please specify a member to timeout.");
    if (message.member === timeUser) return message.channel.send("You cannot time yourself out!");
    if (!duration) return message.channel.send("Please specify a duration in which you want the member to be timed out for.");
    if (duration > 604800) return message.channel.send("Please specify a duration between 1 & 604800 (one week) seconds.");

    if (isNaN(duration)) {
        return message.channel.send("Please specify a valid number in the duration section.");
    }

    let reason = argument.slice(2).join(" ") || 'No reason given.';

    const embed = new EmbedBuilder()
    .setColor("Blue")
    .setDescription(`:white_check_mark: ${timeUser.user} has been **timed out** for ${duration} seconds | ${reason}`)

    const dmEmbed = new EmbedBuilder()
    .setColor("Blue")
    .setDescription(`:white_check_mark: You have been **timed out** in ${message.guild.name} for ${duration} seconds | ${reason}`)

    timeUser.timeout(duration * 1000, reason);

    message.channel.send({ embeds: [embed] });

    timeUser.send({ embeds: [dmEmbed] }).catch(err => {
        return;
    });
}

//untimeout command

if (command === 'untimeout') {
  const timeUser = message.mentions.members.first() || message.guild.members.cache.get(argument[0]) || message.guild.members.find(x => x.user.username.toLowerCase() === argument.slice(0).join(" " || x.user.username === argument[0]));

  if (!message.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) return message.channel.send("You don't have permission to untimeout peopele out this server.");
  if (!timeUser) return message.channel.send("Please specify a member to untimeout");
  if (message.member === timeUser) return message.channel.send("You cannot untime yourself out.");
  if (!timeUser.kickable) return message.channel.send("You cannot time this person out.");

  let reason = argument.slice(1).join(" ") || 'No reason given.';

  const embed = new EmbedBuilder()
  .setColor("Blue")
  .setDescription(`:white_check_mark: ${timeUser.user} has been **untimed out** | ${reason}`)

  const dmEmbed = new EmbedBuilder()
  .setColor("Blue")
  .setDescription(`:white_check_mark: You have been **untimed out** in ${message.guild.name} | ${reason}`)

  timeUser.timeout(null, reason);

  message.channel.send({ embeds: [embed] });

  timeUser.send({ embeds: [dmEmbed] }).catch(err => {
      return;
  });
}

if (command === 'unban') {

  if (!message.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) return message.channel.send("You don't have permission to untimeout peopele out this server.");

  const member = args[0];

  let reason = argument.slice(1).join(" ") || 'No reason given.';

  const embed = new EmbedBuilder()
  .setColor("Blue")
  .setDescription(`:white_check_mark: <@${member}> has been **unbanned** | ${reason}`)

  message.guild.bans.fetch()
      .then(async bans => {
          if (bans.size == 0) return message.channel.send(`There is no one banned from this server.`);

          let bannedID = bans.find(ban => ban.user.id == member);
          if (!bannedID) return await message.channel.send(`The ID stated is not banned from this server.`);

          await message.guild.bans.remove(member, reason).catch(err => {
              return message.channel("There was an error unbanning this member");
          }) 

          await message.channel.send({ embeds: [embed] });
      })
}

  if (command === 'kick') {
    const member = message.mentions.members.first() || message.guild.members.cache.get(argument[0]) || message.guild.members.cache.find(x => x.user.username.toLowerCase() === argument.slice(0).join(" ") || x.user.username === argument[0]);

    if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers)) return message.channel.send("You don't have permission to kick people in this server!");
    if (!member) return message.channel.send("You must specify someone in this command!");
    if (message.member === member) return message.channel.send("You cannot kick yourself");
    if (!member.kickable) return message.channel.send("You cannot kick this person!");

    let reason = argument.slice(1).join(" ") || "No reason given.";

    const embed = new EmbedBuilder()
        .setColor("Orange")
        .setDescription(`:boot: ${member.user} has been **kicked** | ${reason}`);

    const dmEmbed = new EmbedBuilder()
        .setColor("Orange")
        .setDescription(`:boot: You were **kicked** from ${message.guild.name} | ${reason}`);

    member.send({ embeds: [dmEmbed] }).catch(err => {
        console.log(`${member.user.tag} has their DMs off and cannot receive the kick message.`);
    });

    member.kick(reason).catch(err => {
        message.channel.send("There was an error kicking this member");
    });

    message.channel.send({ embeds: [embed] });
  }

  if (command === 'clear') {
    const numToDelete = parseInt(argument[0]);
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
        return message.channel.send("You don't have permission to manage messages.");
    }
    if (isNaN(numToDelete) || numToDelete <= 0) {
        return message.channel.send("Please provide a valid number of messages to delete.");
    }
    message.channel.bulkDelete(numToDelete + 1)
        .then(() => {
            message.channel.send(`Cleared ${numToDelete} messages.`)
                .then(msg => {
                    setTimeout(() => msg.delete(), 5000);
                });
        })
        .catch(error => {
            console.error('Error clearing messages:', error);
            message.channel.send("An error occurred while clearing messages.");
        });
  }

  //COMMANDS

  if (command === 'ping') {
    const executePing = async () => {
        const startTime = Date.now();
        const pingMessage = await message.channel.send("Pinging...");
  
        const endTime = Date.now();
        const ping = endTime - startTime;
  
        const apiLatency = Math.round(message.client.ws.ping);
  
        const embed = new EmbedBuilder()
            .setColor("Green")
            .setTitle(":signal_strength: **Bot Ping**")
            .setDescription(`**API Latency:** ${apiLatency}ms | **Bot Latency:** ${ping}ms`);
  
        await pingMessage.edit({ embeds: [embed] });
    };
  
    executePing();
  }

  





})