let builder = require('botbuilder');

module.exports = function(name, bot, ba){
    bot.dialog(`/${name}`, [
        function (session, args, next) {
            session.send(args.intent.answer);
        }
    ])
        .triggerAction({ matches: name })
};