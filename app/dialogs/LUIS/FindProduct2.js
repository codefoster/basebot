let builder = require('botbuilder');
let Products = require('../../services/products')
//let search = require('../../services/search');
//let displayProducts = require('../../helpers/displayProducts');

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
                builder.Prompts.text(session, 'Please enter what you are searching for')
            }

            //session.endDialog(`${name}`);
        },
        function (session, results) {
            var product = results.response;

            var message = 'Looking for %s...';
            session.send(message, product);

            // Async search
            Products
                .searchProducts(product)
                .then(function (products) {
                    // args
                    session.send('I found %d products:', products.length);

                    var message = new builder.Message()
                        .attachmentLayout(builder.AttachmentLayout.carousel)
                        .attachments(products.map(productAsAttachment));

                    session.send(message);

                    // End
                    session.endDialog();
                });
        }
    ]).triggerAction({ matches: name })
};

// Helpers
function productAsAttachment(product) {
    return new builder.HeroCard()
        .title(product.name)
        .subtitle('%d stars. %d reviews. $%d .', product.rating, product.numberOfReviews, product.priceStarting)
        .images([new builder.CardImage().url(product.image)])
        .buttons([
            new builder.CardAction()
                .title('More details')
                .type('openUrl')
                .value('https://www.bing.com/search?q=products+in+' + encodeURIComponent(product.location))
        ]);
}