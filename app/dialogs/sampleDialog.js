module.exports = function (name, bot) {
    bot.dialog(`/${name}`, [
        function (session, args, next) {
            session.endDialog(`${name} reached`);
        }
    ]).triggerAction({ matches: name })
};
