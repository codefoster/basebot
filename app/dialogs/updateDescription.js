let restify = require('restify');
let builder = require('botbuilder');
let user;

module.exports = function (name, bot, auth) {
    bot.dialog(`/${name}`, ba.authenticate("mercadolibre").concat([
        function (session, args, next) {
            //get the mercadolibre profile
            user = ba.profile(session, "mercadolibre");
            //call mercadolibre and get something using user.accessToken
            let client = restify.createJsonClient({
                url: 'https://api.mercadolibre.com',
                accept: 'application/json',
            });
            let mercadoLibreUrl = `/items/${item_id}/description?access_token=${user.accessToken}`;
            client.get(mercadoLibreUrl, (err, req, res, obj) => {
                if (!err) {

                    console.log('%d -> %j', res.statusCode, res.headers);
                    console.log('%j', obj);
                    session.endDialog('finished updating description');
                } else {
                    console.log(err);
                    session.endDialog("error updating description");
                }
            });
        }
    ])).triggerAction({ matches: name });
};
