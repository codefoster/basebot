let builder = require('botbuilder');
let auth = require('../services/authenticationService');

module.exports = function (name, bot) {
    bot.dialog(`/${name}`, [
        (session, args, next) => {
            builder.Prompts.confirm(session, "log_out_confirm");
        }, (session, args) => {
            if (args.response) {
                auth.logout(session);
                session.endDialog("log_out_confirmed");
            } 
        }
    ]).triggerAction({ matches: name })
};
