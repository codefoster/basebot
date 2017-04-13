let restify = require('restify');
let builder = require('botbuilder');

module.exports = function (name, bot, ba) {
    bot.dialog(`/${name}`, [].concat(
        ba.authenticate("mercadolibre"),
        function (session, results) {
            //get the mercadolibre profile
            var user = ba.profile(session, "mercadolibre");
            //call mercadolibre and get something using user.accessToken
            var client = restify.createJsonClient({
                url: 'https://api.mercadolibre.com',
                accept: 'application/json',
            });
            var mercadoLibreUrl = '/users/'+ user.id + '?access_token=' + user.accessToken;
            client.get(mercadoLibreUrl, (err, req, res, obj) => {
                if (!err) {
                    console.log(obj);
                    var msg = new builder.Message()
                        .attachments([
                            new builder.HeroCard(session)
                                .text(user.first_name + ' ' + user.last_name)
/*                                .images([
                                    new builder.CardImage(session).url(obj.data.image['60x60'].url)
                                ]
                                )*/
                        ]
                        );
                    session.endDialog(msg);
                } else {
                    console.log(err);
                    session.endDialog("error getting profile, typing 'logout' to try again");
                }
            });
        }
    )).triggerAction({ matches: name })
};