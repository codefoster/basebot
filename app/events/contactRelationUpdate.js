let builder = require('botbuilder');

module.exports = function (name, bot, ba) {
    bot.on(name, function (message) {
        if (message.action === 'add') {
            var reply = new builder.Message()
                .address(message.address)
                .text("Hi. Thanks for adding me.");
            bot.send(reply);
        }
    })
};