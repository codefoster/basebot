let builder = require('botbuilder');

module.exports = function (name, bot, auth) {

    bot.on(name, function (message) {
        if (message.membersAdded) {
            message.membersAdded.forEach(function (identity) {
                if (identity.id === message.address.bot.id) {
                    var reply = new builder.Message()
                        .address(message.address)
                        .text('conversation_update');
                    bot.send(reply);
                }
            });
        }
    })
};