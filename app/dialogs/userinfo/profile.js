let app = require('../../../server');
module.exports = function (name, bot) {
    bot.dialog(`/${name}`, [].concat(
        app.botAuth.authenticate("mercadolibre"),
        function (session, results) {
            //get the facebook profile
            var user = app.botAuth.profile(session, "mercadolibre");

            //todo: get interesting info on a card and not just dump user info in chat
            session.endDialog(`your user info is ${JSON.stringify(user)}`);
        }
    )).triggerAction({matches:name});
};