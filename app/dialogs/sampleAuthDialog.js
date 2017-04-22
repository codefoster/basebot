let restify = require('restify');
let builder = require('botbuilder');

module.exports = function (name, bot) {
    bot.dialog(`/${name}`, [
        function (session, args, next) {
            //require authentication to continue
            if (session.privateConversationData.user) next()
            else session.beginDialog('/login');
        },
        function (session, result, next) {
            if (result) {
                //call an api using result.id and result.accessToken
                //these can be accessed from now on using...
                //  session.privateConversationData.user.id
                //  session.privateConversationData.user.accessToken
            }
            else
                //loop
                session.replaceDialog('/login');

        }
    ])
        .triggerAction({ matches: name })
        .cancelAction('cancelLogin', null, { matches: /^cancel/i });
};