let restify = require('restify');
let builder = require('botbuilder');
let utils = require('../helpers/utils');

// ba is not needed for a simple search for products
module.exports = function (name, bot, ba) {
    bot.dialog(`/${name}`, [
        function (session, args, next) {



            //buyer asks "I'm looking for [cheap] shoes [for my dad]"
            //productSearch dialog is triggered
            //turn entities into filters
            //search via the api
            //if result count is small, show results
            //if result count is large, show some and prompt to add filters
            //filters: gender, price, location, brand, color, condition, size, style
            //results are displayed as image, title, short description, price
            //result cards are clickable and go to meli website








            session.sendTyping();
            session.send('welcome-finder', session.message.text);
            //see if we have the ProductType entity
            var productEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'ProductType')
            //if we have it
            if (productEntity) {
                session.dialogData.searchType = 'product';
                next({ response: productEntity.entity });
            } else {
                //Dont know what they are searching for. 
                builder.Prompts.text(session, 'what-item')
            }
        },
        function (session, results) {
            var product = results.response;
            //call mercadolibre and get something 
            var client = restify.createJsonClient({
                url: 'https://api.mercadolibre.com',
                accept: 'application/json',
            });
            var mercadoLibreUrl = '/sites/MLU/search?q=' + product + '&limit=5';
            client.get(mercadoLibreUrl, (err, req, res, obj) => {
                if (!err) {
                    session.send(`I found ${obj.results.length} products`);

                    console.log(obj);
                    var msg = new builder.Message()
                        .attachmentLayout(builder.AttachmentLayout.carousel)
                        .attachments(obj.results.map(utils.productAsAttachment));
                    session.endDialog(msg);
                } else {
                    console.log(err);
                    session.endDialog("error getting profile, typing 'logout' to try again");
                }
            });
        }
    ]).triggerAction({ matches: name })
};

