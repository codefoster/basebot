module.exports = function (name, bot, ba) {
    bot.on(name, function (message) {
        let session = bot.loadSession(message.address);
        session.beginDialog("/delete");
    })
};