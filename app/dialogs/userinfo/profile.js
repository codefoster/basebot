module.exports = function (name, bot, ba) {
    bot.dialog(`/${name}`, [].concat(
        ba.authenticate("mercadolibre"),
        function (session, results) {
            //get the facebook profile
            var user = ba.profile(session, "mercadolibre");

            //todo: get interesting info on a card and not just dump user info in chat
            session.endDialog(`your user info is ${JSON.stringify(user)}`);
        }
    )).triggerAction({matches:name});
};