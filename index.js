"use strict";
let builder = require("botbuilder");
let restify = require('restify');
let dotenv = require('dotenv');
let auth = require('./auth');

//load environment variables
dotenv.config();

let connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

let bot = new builder.UniversalBot(connector, session => session.endDialog("default_dialog"));
bot.auth = auth;

//serve the bot
let server = restify.createServer();
server.post('/api/messages', connector.listen());
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});
server.use(restify.bodyParser());
server.use(restify.queryParser());


//recognizers
utils.getFiles('./app/recognizers')
    .map(file => Object.assign(file, { recognizer: require(file.path) }))
    .forEach(r => bot.recognizer(r.recognizer));

//dialogs
utils.getFiles('./app/dialogs')
    .map(file => Object.assign(file, { fx: require(file.path) }))
    .forEach(dialog => dialog.fx(dialog.name, bot));

//events
utils.getFiles('./app/events')
    .map(file => Object.assign(file, { fx: require(file.path) }))
    .forEach(event => event.fx(event.name));

//middleware
utils.getFiles('./app/middleware')
    .map(file => require(file.path))
    .forEach(mw => bot.use(mw));

//libraries
utils.getFiles('./app/libraries')
    .map(file => require(file.path))
    .forEach(library => bot.library(library.createLibrary()));
