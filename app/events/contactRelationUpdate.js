let builder = require('botbuilder');

module.exports = function (name, bot) {
    bot.on(name, function (message) {
        if (message.action === 'add') {
            var reply = new builder.Message()
                .address(message.address)
                .text("Thanks for adding me as a contact!");
            bot.send(reply);
        }
    })
};