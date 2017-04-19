let restify = require("restify");
let builder = require('botbuilder');
let utils = require('../helpers/utils');
let user;
let orders = require('../../samples/sampleBuyerOrders.json');


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
            let mercadoLibreUrl = `orders/search?buyer=${user.id}&access_token=${user.accessToken}&order.status=payment_in_process`;
            client.get(mercadoLibreUrl, (err, req, res, obj) => {
                if (!err) {
                   
                    if (obj.results.length > 0) {

                        session.send(`I found ${obj.results.length} orders, which one are you refering to?`)
                        let msg = new builder.Message()
                            .attachmentLayout(builder.AttachmentLayout.carousel)
                            .attachments(obj.results.map(utils.productAsAttachment));

                            ////If you wanted to send just one card you can do it this way
                            // .attachments([
                            //     new builder.HeroCard(session)
                            //         .text(user.first_name + ' ' + user.last_name)
                            //         .images([
                            //             new builder.CardImage(session).url(obj.data.image['60x60'].url)
                            //         ])
                            // ]
                            // );
                        session.endDialog(msg);
                    } else {
                        console.log(err);
                        session.endDialog("error getting profile, typing 'logout' to try again");
                    }
                } else {
                    sesion.endDialog('we did not find any orders');
                }
            });
        }
    ])).triggerAction({ matches: name })
};
