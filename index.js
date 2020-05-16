const Discord = require('discord.js');
const crypto = require('crypto');
const express = require('express');
const app = express();
const port = 3000;
const client = new Discord.Client();
const {
	discordToken,
	twitterConsumerApiSecretKey,
	discordScreenshotsChannelId,
} = require('./config.json');
const { _addPrefix, _codeStyle } = require('./util.js');

client.once('ready', () => {
	console.log('Discord connection established.');
	client.channels.fetch(discordScreenshotsChannelId).then(channel => channel.send('Timmy is Online!'));
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

client.login(discordToken);

// app.get('/webhook/twitter', (req, res) => {
// 	const crcToken = req.query.crc_token;
// 	if (crcToken) {
// 		const hash = crypto.createHmac('sha256', twitterConsumerApiSecretKey).update(crcToken).digest('base64');
// 		res.status(200);
// 		res.send({
// 			response_token: 'sha256' + hash,
// 		});
// 	} else {
// 		res.status(400);
// 		res.send('Error: crc_token missing from request.');
// 	}
// });
//
// app.post('/webhook/twitter', (req, res) => {
// 	console.log(req.body);
// 	console.log(req, res);
// });
//
// app.listen(port, () => console.log(`App listening at http://localhost:${port}`));
