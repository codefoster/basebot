module.exports = function (name, bot, ba) {
    bot.on(name, function (message) {
        bot.loadSession(message.address, function(err, session) {
            session.beginDialog("/delete");
        });
    })
};