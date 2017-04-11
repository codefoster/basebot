//you can have multiple luis models you just need to point to seperate enpoints
//in a different recognizer files
let builder = require("botbuilder");
const envx = require("envx");

module.exports = new builder.LuisRecognizer(envx("LUIS_ENDPOINT_ES"));