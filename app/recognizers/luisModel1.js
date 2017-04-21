let builder = require("botbuilder");

module.exports = new builder.LuisRecognizer(process.env.LUIS_ENDPOINT_1);