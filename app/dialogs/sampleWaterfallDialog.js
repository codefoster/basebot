let builder = require('botbuilder');

module.exports = function (name, bot) {
    bot.dialog(`/${name}`, [
        // should have customer id
        // prompt for future order id
        function (session, args, next) {
            builder.Prompts.choice(session, `Which order?`, "111|222|333", {
                listStyle: builder.ListStyle.button
            });
        },
        function (session, args, next) {
            let futureOrderID = args.response.entity;
            session.endDialog(`edit ${futureOrderID}`);
        }
    ])
        .triggerAction({matches:name})
};