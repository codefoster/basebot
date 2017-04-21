let builder = require('botbuilder');

//this will handle events coming in through the backchannel
module.exports = function (name, bot) {
    bot.on(name, function (event) {
        bot.send(new builder.Message()
            .address(event.address)
            .textLocale("en-us")
            .text(`event received (event name: '${event.name}')`)
        );
    })
};