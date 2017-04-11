module.exports = function(name, bot){
    bot.dialog(`/${name}`, [
        (session, args, next) => {
            builder.Prompts.confirm(session, "are you sure you want to logout");
        }, (session, args) => {
            if (args.response) {
                ba.logout(session, "mercadolibre");
                session.endDialog("you've been logged out.");
            } else {
                session.endDialog("you're still logged in");
            }
        }
    ])
};
