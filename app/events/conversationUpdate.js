let builder = require('botbuilder');

module.exports = function (name, bot) {
    bot.on(name, message => {
        message.membersAdded
            .filter(m => m.id == message.address.bot.id)
            .forEach(m => {
                var msg = new builder.Message()
                    .address(message.address)
                    .text('conversation_update');
                bot.send(msg);
            });
    })
};