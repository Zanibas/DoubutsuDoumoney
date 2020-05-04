const Discord = require('discord.js');
const client = new Discord.Client();
const { prefix, token } = require('./config.json');

client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', message => {
  if (message.content === `${prefix}welcome`) {
    // send back "Pong." to the channel the message was sent in
	    message.channel.send('...come');
  } else if (message.content === `${prefix}help`) {
    // retrieve the help documents
    message.channel.send('```!welcome - Timmy will say hello!```')
  }
});

client.login(token);
