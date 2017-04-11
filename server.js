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
//envx confirms the existence of a environment variable and if it
//doesnt exist it will show a friendly error message
const envx = require("envx");
const passport = require("passport");
const MercadoLibreStrategy = require("passport-mercadolibre").Strategy;
const WEBSITE_HOSTNAME = envx("WEB_HOSTNAME");
//oauth details for Mercado Libre
const MERCADOLIBRE_APP_ID = envx("MERCADOLIBRE_APP_ID");
const MERCADOLIBRE_SECRET_KEY = envx("MERCADOLIBRE_SECRET_KEY");

//encryption key for saved state
const BOTAUTH_SECRET = envx("BOTAUTH_SECRET");


let connector = new builder.ChatConnector({
    appId: envx("MICROSOFT_APP_ID"),
    appPassword: envx("MICROSOFT_APP_PASSWORD"),
    userWelcomeMessage: "Hello... Welcome to the group."
});

let bot = new builder.UniversalBot(connector, function (session) {
    //You can either set your preferred Locale like this (default is en if you dont do anything)
    session.preferredLocale("en");
    //if you want them to select their locale then call this
    /*    if (!session.userData['BotBuilder.Data.PreferredLocale']) {
            session.beginDialog('/localePicker');
        } */
    session.beginDialog('/profile',{});
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

module.exports = {
    botAuth: ba
}

//events
getFileNames('./app/events')
    .map(file => Object.assign(file, { fx: require(file.path) }))
    //for each one, execute the function (what ever the module returns becomes function (fx))
    .forEach(event => event.fx(event.name, bot));

// // recognizers
getFileNames('./app/recognizers')
    .map(file => Object.assign(file, { recognizer: require(file.path) }))
    .forEach(r => bot.recognizer(r.recognizer));
//dialogs
getFileNames('./app/dialogs')
    .map(file => Object.assign(file, { fx: require(file.path) }))
    .forEach(dialog => dialog.fx(dialog.name, bot));

// middleware
bot.use(builder.Middleware.dialogVersion({ version: 1.0, resetCommand: /^reset/i }));

//actions
bot.endConversationAction('goodbye', 'Goodbye :)', { matches: /^goodbye/i });



//Takes a directory and using fs to loop through the files in the directory
//this is how we get the names of our dialogs. By looking at the file names in the dialogs folder
//it is used the same way for recognizers, actions, etc.
//filter by .js files 
function getFileNames(dir) {
    return readdir.sync(dir, { deep: true })
        .map(item => `.${path.posix.sep}${path.posix.join(dir, path.posix.format(path.parse(item)))}`) //normalize paths
        .filter(item => !fs.statSync(item).isDirectory() && /.js$/.test(item)) //filter out directories
        .map(file => ({ name: path.basename(file, '.js'), path: file }))
}

