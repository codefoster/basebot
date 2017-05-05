//this dialog let's your user know what they can say

let builder = require("botbuilder");
let commandsRecognizer = require("../recognizers/commands");

module.exports = function (name, bot) {
    bot.dialog(`/${name}`, [
        function (session, args, next) {
            session.send("things_i_can_say");
            session.send(commandsRecognizer.commands.map(c => c.text).join(', '));
        }
    ]).triggerAction({ matches: name })
}