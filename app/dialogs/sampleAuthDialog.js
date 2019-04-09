let auth = require('../services/authenticationService');

module.exports = function (name, bot) {
    if (!bot.auth)
        return console.warn('[warning] authentication dialog not initialized. Define AUTH_PROVIDER properties in .env file.');
    bot.dialog(`/${name}`, auth.requireAuthentication([
        function (session) {
            session.send(`hi ${session.privateConversationData.user.displayName}`);
        }
    ])).triggerAction({ matches: name });
};