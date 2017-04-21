module.exports = function (name, bot, auth) {
    bot.dialog(`/${name}`, [
        function (session, args, next) {
            session.endDialog("greeting");
        }
    ]).triggerAction({ matches: name })
};