let auth = require('../services/authenticationService');

module.exports = function (name, bot) {
    bot.dialog(`/${name}`, auth.requireAuthentication([
        function (session) {
            session.send(`hi ${session.privateConversationData.user.displayName}`);
        }
    ])).triggerAction({ matches: name });
};