module.exports = function (name, bot, ba) {
    bot.dialog(`/${name}`, [
        function (session, args, next) {
            session.endDialog("greeting");
        }
    ]).triggerAction({ matches: name })
};