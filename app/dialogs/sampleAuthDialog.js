let restify = require('restify');
let builder = require('botbuilder');

let user;

module.exports = function (name, bot, auth) {
    bot.dialog(`/${name}`, auth.authenticate(process.env.AUTH_PROVIDER_NAME).concat([
        function (session, args, next) {
            user = auth.profile(session, process.env.AUTH_PROVIDER_NAME);
            let userId = user.id;
            let token = user.accessToken;

        }
    ])).triggerAction({ matches: name });
};