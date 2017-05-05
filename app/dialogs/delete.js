//this dialog will delete all user data

let builder = require("botbuilder");

module.exports = function (name, bot) {
    bot.dialog(`/${name}`, [
        function (session, args, next) {
            builder.Prompts.confirm(session, "confirm_data_delete");
        },
        function (session, args, next) {
            if(args.response) {
                session.userData = {};
                session.endDialog('data_deleted');
            }
        }
    ]).triggerAction({ matches: name })
}