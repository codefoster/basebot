require('dotenv').config();
import { ChatConnector, UniversalBot } from 'botbuilder';
import * as restify from "restify";
// let authenticationService = require('./app/services/authenticationService');
import * as authenticationService from './app/services/authenticationService';
let utils = require('./app/helpers/utils');

let connector = new ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

let bot = new UniversalBot(connector, session => session.endDialog("default_dialog"));

//serve the bot
let server = restify.createServer();
server.post('/api/messages', connector.listen());
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});
server.use(restify.bodyParser());
server.use(restify.queryParser());

//authentication
if (process.env.AUTH_PROVIDER_NAME)
    (<any>bot).auth = authenticationService.initialize(server, bot);

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
    .forEach(event => event.fx(event.name, bot));

//middleware
utils.getFiles('./app/middleware')
    .map(file => require(file.path))
    .forEach(mw => bot.use(mw));

//libraries
utils.getFiles('./app/libraries')
    .map(file => require(file.path))
    .forEach(library => bot.library(library.createLibrary()));
