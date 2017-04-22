let builder = require('botbuilder');

module.exports = function (name, bot) {
    bot.dialog(`/${name}`, bot.auth.authenticate(process.env.AUTH_PROVIDER_NAME).concat([
        function (session, args, next) {
            session.privateConversationData.user = bot.auth.profile(session, process.env.AUTH_PROVIDER_NAME);
            session.endDialogWithResult({ success: true });
        }
    ])).triggerAction({ matches: name });
};