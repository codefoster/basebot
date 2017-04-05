module.exports = function (name, bot) {
    bot.dialog(`/${name}`, [
        function (session, args, next) {
            session.endDialog(['Hello!', 'Hi there!', 'Hi!']);
        }
    ]).triggerAction({matches:name})
};