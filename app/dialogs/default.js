module.exports = function (name, bot) {
    bot.dialog(`/${name}`, [
        function (session, args, next) {
            session.endDialog("greeting");
        }
    ])
};