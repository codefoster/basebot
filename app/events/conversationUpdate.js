let builder = require('botbuilder');

module.exports = function (name, bot) {
    bot.on(name, message => {
        message.membersAdded
            .filter(m => m.id == message.address.bot.id)
            .forEach(m => {
                var msg = new builder.Message()
                    .address(message.address)
                    .text("Hey, there. I'm basebot. I not really good for anything except to be a good starting point for whatever awesome bot you're looking to build.");
                bot.send(msg);
            });
    })
};