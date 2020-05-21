const Discord = require('discord.js');
const client = new Discord.Client();
const crypto = require('crypto');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const { _addPrefix, _codeStyle } = require('./util.js');
let lastTweet;

const app = express();

app.set('port', process.env.PORT || 3000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(session({
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: true,
}));

app.get('/', (_, res) => {
	getTestChannel((channel) => channel.send('main page accessed.'));
	res.status(200);
	res.send('Home Page');
});

app.get('/webhook/twitter', (req, res) => {
	getTestChannel(channel => channel.send('CRC Challenge Issued'));
	const crcToken = req.query.crc_token;
	if (crcToken) {
		const hash = crypto.createHmac('sha256', process.env.TWITTER_CONSUMER_API_SECRET).update(crcToken).digest('base64');
		res.status(200);
		res.send({
			response_token: 'sha256=' + hash,
		});
	} else {
		res.status(400);
		res.send('Error: crc_token missing from request.');
	}
});

app.post('/webhook/twitter', async (req, res) => {
	console.log('POST /webhook/twitter accessed');
	setLastTweet(req).then(client.channels.fetch(process.env.DISCORD_TESTING_CHANNEL_ID)).then((channel) => channel.send(lastTweet));
	getTestChannel((channel) => channel.send('tweet received.'));
	res.send('200 OK');
});

app.listen(app.get('port'), () => console.log(`App listening at http://localhost:${app.get('port')}`));

function getTestChannel(callback) {
	client.channels.fetch(process.env.DISCORD_TESTING_CHANNEL_ID).then(callback);
}

function setLastTweet(tweet) {
	return new Promise((resolve, reject) => {
		try {
			lastTweet = tweet;
			resolve();
		} catch {
			reject(Error('Unable to set tweet.'));
		}
	});
}

client.once('ready', () => {
	console.log('Discord connection established.');

	getTestChannel(channel => channel.send('Timmy is Online at Heroku!!'));
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

client.login(process.env.DISCORD_TOKEN);
