//you can have multiple luis models you just need to point to seperate enpoints
//in a different recognizer files
let builder = require("botbuilder");

module.exports = new builder.LuisRecognizer(process.env.LUIS_ENDPOINT_EN);