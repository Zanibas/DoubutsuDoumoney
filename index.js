const Discord = require('discord.js');
const client = new Discord.Client();
const { token } = require('./config.json');
const { _addPrefix, _codeStyle } = require('./util.js');

client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', message => {
	if (message.content === _addPrefix('welcome')) {
		// send back "Pong." to the channel the message was sent in
		message.channel.send('...come');
	} else if (message.content === _addPrefix('help')) {
		// retrieve the help documents
		message.channel.send(_codeStyle('!welcome - Timmy will say hello!'));
	}
});

client.login(token);
