let restify = require("restify");
let builder = require('botbuilder');
let utils = require('../helpers/utils');
let user;


module.exports = function (name, bot, auth) {
    bot.dialog(`/${name}`, ba.authenticate("mercadolibre").concat([
        function (session, args, next) {
            session.sendTyping();
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

            //note: this is the buyer's flow
            //look in api for open orders
            //"I found the following open orders, which one are you referring to?"
            //figure out which order they're referring to
            //figure out when the payment was made
            //we think we can trust the user just telling us the payment date
            //is the payment processing delayed?
            //if not delayed then relay the product details (including estimated date) to buyer
            //if delayed then start handoff to get agent to initiate legacy approval flow
            //  get receipt (attachment, email, etc.)
            //tell the buyer the process has been expedited

        }
    ])).triggerAction({ matches: name })
};
