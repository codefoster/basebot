// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { config } from 'dotenv';
import * as path from 'path';
import * as restify from 'restify';
import { BotServices } from './services/botservices';

// Import required bot services. See https://aka.ms/bot-services to learn more about the different parts of a bot.
import { BotFrameworkAdapter } from 'botbuilder';

import { BasicBot } from './bot';

// Read botFilePath and botFileSecret from .env file
// Note: Ensure you have a .env file and include botFilePath and botFileSecret.
const ENV_FILE = path.join(__dirname, '..', '.env');
const loadFromEnv = config({ path: ENV_FILE });

//Services Object to host all services used by the bot
const botServices = new BotServices();

// Create adapter.
// See https://aka.ms/about-bot-adapter to learn more about .bot file its use and bot configuration .
const adapter = new BotFrameworkAdapter({
    appId: botServices.getEnvironmentVariable("MicrosoftAppID",false),
    appPassword:  botServices.getEnvironmentVariable("MicrosoftAppPassword",false),
});

// Catch-all for errors.
adapter.onTurnError = async (context, error) => {
    // This check writes out errors to console log
    // NOTE: In production environment, you should consider logging this to Azure
    //       application insights.
    console.error(`\n [onTurnError]: ${ error }`);
    // Send a message to the user
    context.sendActivity(`Oops. Something went wrong!`);
    // Clear out state
    await botServices.conversationState.delete(context);
};

// Create the bot instance.
let bot;
try {
    bot = new BasicBot(botServices);
} catch (err) {
    console.error(`[botInitializationError]: ${err}`);
    process.exit();
}

// Create HTTP server
const server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, () => {
    console.log(`\n${server.name} listening to ${server.url}`);
    console.log(`\nGet Bot Framework Emulator: https://aka.ms/botframework-emulator`);
    console.log(`\nTo talk to your bot, open basebot.bot file in the Emulator`);
});

// Listen for incoming activities and route them to your bot main dialog.
server.post('/api/messages', (req, res) => {
    // Route received a request to adapter for processing
    adapter.processActivity(req, res, async (turnContext) => {
        // route to bot activity handler.
        await bot.onTurn(turnContext);
    });
});
