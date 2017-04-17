let localeTools = require('./localeTools');

module.exports = function (name, bot) {
    bot.dialog(`/${name}`, [
        function (session, args, next) {
            localeTools.chooseLocale(session);
            session.endDialog();
        }
    ]).triggerAction({ matches: name })
};
