module.exports = function (name, bot) {
    bot.dialog(`/${name}`, [
        function (session, args, next) {
            session.endDialog("sample_dialog_response");
        }
    ]).triggerAction({ matches: name })
};
