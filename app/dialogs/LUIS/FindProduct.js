let restify = require('restify');
let builder = require('botbuilder');
let utils = require('../../helpers/utils');

// ba is not needed for a simple search for products
module.exports = function (name, bot, ba) {
    bot.dialog(`/${name}`, [
        function (session, args, next) {
            session.sendTyping();
            //If we are in here we are on the FindProduct Intent
            session.send('Welcome to the MercadoLibre finder! We are analyzing your message: \'%s\'', session.message.text);
            //see if we have the ProductType entity
            var productEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'ProductType')
            //if we have it
            if (productEntity) {
                session.dialogData.searchType = 'product';
                next({ response: productEntity.entity });
            } else {
                //Dont know what they are searching for. 
                builder.Prompts.text(session, 'What is the name of the item you are looking for?')
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
                    //session.send('I found %d products', products.length);

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

