let restify = require('restify');
let builder = require('botbuilder');
let user;

module.exports = function (name, bot, ba) {
    bot.dialog(`/${name}`, ba.authenticate("mercadolibre").concat([
        function (session, args, next) {
            //get the mercadolibre profile
            user = ba.profile(session, "mercadolibre");
            //call mercadolibre and get something using user.accessToken
            let client = restify.createJsonClient({
                url: 'https://api.mercadolibre.com',
                accept: 'application/json',
            });
            let mercadoLibreUrl = `/users/${user.id}?access_token=${user.accessToken}`;
            client.get(mercadoLibreUrl, (err, req, res, obj) => {
                if (!err) {
                    console.log(obj);
                    let msg = new builder.Message()
                        .attachments([
                            new builder.HeroCard(session)
                                .text(user.first_name + ' ' + user.last_name)
                        ]);
                    session.endDialog(msg);
                } else {
                    console.log(err);
                    session.endDialog("error getting profile, typing 'logout' to try again");
                }
            });
        }
    ])).triggerAction({ matches: name });
};