let builder = require('botbuilder');

module.exports = function(name, bot){
    bot.on(name, function (message) {
        if (message.action === 'add') {
            var name = message.user ? message.user.name : null;
            var reply = new builder.Message()
                .address(message.address)
                .text("Hi. Thanks for adding me. Say 'hello' to see what I can do.");
            bot.send(reply);
        } else {
            // delete their data
        }
    })
};