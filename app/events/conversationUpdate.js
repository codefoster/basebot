let builder = require('botbuilder');

module.exports = function (name, bot, ba) {

    bot.on(name, function (message) {
        if (message.membersAdded) {
            message.membersAdded.forEach(function (identity) {
                if (identity.id === message.address.bot.id) {
                    var reply = new builder.Message()
                        .address(message.address)
                        .text('Hi! I am Mercado Libre Bot. I can find you  products. Try saying show me cameras.');
                    bot.send(reply);
                }
            });
        }
    })
};