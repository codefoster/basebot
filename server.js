"use strict";
//the BotBuilder SDK
let builder = require("botbuilder");
//Restify used to serve the bot
let restify = require('restify');
let botauth = require('botauth');
let utils = require('./app/helpers/utils');

//this loads the environment variables from the .env file
require('dotenv').config()

const passport = require("passport");
const MercadoLibreStrategy = require("passport-mercadolibre").Strategy;
const WEBSITE_HOSTNAME = process.env.WEB_HOSTNAME;
//oauth details for Mercado Libre
const MERCADOLIBRE_APP_ID = process.env.MERCADOLIBRE_APP_ID;
const MERCADOLIBRE_SECRET_KEY = process.env.MERCADOLIBRE_SECRET_KEY;

//encryption key for saved state
const BOTAUTH_SECRET = process.env.BOTAUTH_SECRET;

console.log(process.env.MICROSOFT_APP_PASSWORD);

let connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD,
    userWelcomeMessage: "Hello... Welcome to the group."
});

let bot = new builder.UniversalBot(connector, function (session) {
    //You can either set your preferred Locale like this (default is en if you dont do anything)
    session.preferredLocale("en");
    //if you want them to select their locale then call this
    /*    if (!session.userData['BotBuilder.Data.PreferredLocale']) {
            session.beginDialog('/localePicker');
        } */
    //session.beginDialog('/profile',{});
});

//serve the bot
let server = restify.createServer();
server.post('/api/messages', connector.listen());
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});
server.use(restify.bodyParser());
server.use(restify.queryParser());

// Initialize with the strategies we want to use
var ba = new botauth.BotAuthenticator(server, bot, { baseUrl: "https://" + WEBSITE_HOSTNAME, secret: BOTAUTH_SECRET })
    .provider("mercadolibre", (options) => {
        return new MercadoLibreStrategy({
            clientID: MERCADOLIBRE_APP_ID,
            clientSecret: MERCADOLIBRE_SECRET_KEY,
            scope: ['read_public', 'read_relationships'],
            callbackURL: options.callbackURL
        }, (accessToken, refreshToken, profile, done) => {
            profile = profile || {};
            profile.accessToken = accessToken;
            profile.refreshToken = refreshToken;
            return done(null, profile);
        });
    });

//events
//this dynamically configures events for the bot by enumerating the files in ./app/events, requiring each (as fx), and then calling that fx passing in the bot
utils.getFiles('./app/events')
    .map(file => Object.assign(file, { fx: require(file.path) }))
    .forEach(event => event.fx(event.name, bot));

//recognizers
//this dynamically configures recognizers for the bot by enumerating the files in ./app/recognizers, requiring each, and then calling bot.recognizer for each
utils.getFiles('./app/recognizers')
    .map(file => Object.assign(file, { recognizer: require(file.path) }))
    .forEach(r => bot.recognizer(r.recognizer));

//dialogs
//this dynamically configures dialogs for the bot by enumerating the files in ./app/dialogs, requiring each (as fx), and then calling that fx passing in the bot
utils.getFiles('./app/dialogs')
    .map(file => Object.assign(file, { fx: require(file.path) }))
    .forEach(dialog => dialog.fx(dialog.name, bot, ba));

//middleware
//this dynamically configures middleware modules for the bot by enumerating the files in ./app/middleware, requiring each, and then calling bot.use on each
utils.getFiles('./app/middleware')
    .map(file => require(file.path))
    .forEach(mw => bot.use(mw));

//libraries
utils.getFiles('./app/libraries')
    .map(file => require(file.path))
    .forEach(library => bot.library(library.createLibrary()));

//actions
bot.endConversationAction('goodbye', 'Goodbye :)', { matches: /^goodbye/i });



