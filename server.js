"use strict";
//the BotBuilder SDK
let builder = require("botbuilder");
//Restify used to serve the bot
let restify = require('restify');
//Library for list management
let _ = require('lodash');
let fs = require('fs');
let path = require('path');
let readdir = require('readdir-enhanced');
let botauth = require('botauth');
let util = require('util');

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
getFileNames('./app/events')
    .map(file => Object.assign(file, { fx: require(file.path) }))
    .forEach(event => event.fx(event.name, bot));

//recognizers
//this dynamically configures recognizers for the bot by enumerating the files in ./app/recognizers, requiring each, and then calling bot.recognizer for each
getFileNames('./app/recognizers')
    .map(file => Object.assign(file, { recognizer: require(file.path) }))
    .forEach(r => bot.recognizer(r.recognizer));

//dialogs
//this dynamically configures dialogs for the bot by enumerating the files in ./app/dialogs, requiring each (as fx), and then calling that fx passing in the bot
getFileNames('./app/dialogs')
    .map(file => Object.assign(file, { fx: require(file.path) }))
    .forEach(dialog => dialog.fx(dialog.name, bot, ba));

//middleware
//this dynamically configures middleware modules for the bot by enumerating the files in ./app/middleware, requiring each, and then calling bot.use on each
getFileNames('./app/middleware')
    .map(file => require(file.path))
    .forEach(mw => bot.use(mw));

//actions
bot.endConversationAction('goodbye', 'Goodbye :)', { matches: /^goodbye/i });

/*//Sends greeting message when the bot is first added to a conversation
bot.on('conversationUpdate', function (message) {
    if (message.membersAdded) {
        message.membersAdded.forEach(function (identity) {
            if (identity.id === message.address.bot.id) {

                fs.readFile('./app/images/MercadoLibre_logo.PNG', function (err, data) {
                    var contentType = 'image/png';
                    var base64 = Buffer.from(data).toString('base64');
                    var msg = new builder.Message()
                        .address(message.address)
                        .addAttachment({
                            contentUrl: util.format('data:%s;base64,%s', contentType, base64),
                            contentType: contentType,
                            name: 'MercadoLibreLogo.png'
                        })
                    bot.send(msg);
                });
                var reply = new builder.Message()
                    .address(message.address)
                    .text('Hi! I am Mercado Libre Bot. I can find you  products. Try saying show me cameras.');
                bot.send(reply);
            }
        });
    }
});


//takes a directory and using fs to loop through the files in the directory
//this is how we get the names of our dialogs, recognizers, etc. By looking at the file names in the dialogs folder
=======

//filter by .js files 
function getFileNames(dir) {
    return readdir.sync(dir, { deep: true })
        .map(item => `.${path.posix.sep}${path.posix.join(dir, path.posix.format(path.parse(item)))}`) //normalize paths
        .filter(item => !fs.statSync(item).isDirectory() && /.js$/.test(item)) //filter out directories
        .map(file => ({ name: path.basename(file, '.js'), path: file }))
}

