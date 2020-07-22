const Discord = require('discord.js');
const client = new Discord.Client();
const crypto = require('crypto');
const express = require('express');
const bodyParser = require('body-parser');
const { _addPrefix, _codeStyle } = require('./util.js');
let lastTweet = 'this was unmodified';

const app = express();

app.set('port', process.env.PORT || 3000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Root directory is just a test for now.
app.get('/', (_, res) => {
	getTestChannel((channel) => channel.send('main page accessed.'));
	res.status(200);
	res.send('Home Page');
});

// In order to ensure our webhook stays active from Twitter, the app must accept requests from this route every 24 hours and respond to a CRC Challenge.
// https://developer.twitter.com/en/docs/accounts-and-users/subscribe-account-activity/guides/securing-webhooks
app.get('/webhook/twitter', (req, res) => {
	// Alerts us in the discord testing channel that the CRC Challenge was received.
	getTestChannel(channel => channel.send('CRC Challenge Issued'));

	// The actual code to secure the webhooks, courtesy of Twitter's example app:
	// https://github.com/twitterdev/account-activity-dashboard/blob/master/helpers/security.js
	// https://github.com/twitterdev/account-activity-dashboard/blob/master/app.js#L41
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

// Route that actually listens to the webhook. Twitter sends us updates whenever a Tweet is posted from https://twitter.com/crossingfarm
app.post('/webhook/twitter', (req, res) => {
	// Only listen for events that are a result of tweeting. Currently Account Activity webhooks send ALL account activity with no way to config.
	// https://developer.twitter.com/en/products/accounts-and-users/account-activity-api
	if ('tweet_create_events' in req.body && req.body.tweet_create_events.length > 0) {
		// We only need the id of the tweet in order to link to the tweet itself. Discord does a great job at creating rich previews just from this.
		req.body.tweet_create_events.forEach((tweet) => {
			lastTweet = `https://twitter.com/CrossingFarm/status/${tweet.id_str}`;
			getScreenshotsChannel((channel) => channel.send(lastTweet));
		});
	}
	res.send('200 OK');
});

// Begins the port connection for express.
app.listen(app.get('port'), () => console.log(`App listening at http://localhost:${app.get('port')}`));


// Two function helpers to retrieve the current testing and screenshot channels from Discord.
function getTestChannel(callback) {
	client.channels.fetch(process.env.DISCORD_TESTING_CHANNEL_ID).then(callback);
}

function getScreenshotsChannel(callback) {
	client.channels.fetch(process.env.DISCORD_SCREENSHOTS_CHANNEL_ID).then(callback);
}

client.once('ready', () => {
	console.log('Discord connection established.');

	getTestChannel(channel => channel.send('Timmy is Online at Heroku!!'));
});

// Basic chat functionality for TimmyBot on Discord.
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
