module.exports = function (name, bot, auth) {
    bot.on(name, function (message) {
        bot.loadSession(message.address, function(err, session) {
            session.beginDialog("/delete");
        });
    })
};