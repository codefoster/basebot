let util = require('./util');
const builder = require('botbuilder');

module.exports = (session, productResults) => {
    session.sendTyping();

    // Only return the top 10 results in a carousel
    var numCards;    
    if(productResults.length > 10) {
        numCards = 10;
    } else if (productResults.length < 1) {
        return false;
    } else {
        numCards = productResults.length;
    }

    var cards = [];
    for(var i = 0; i < numCards; i++){
        var product = productResults[i];
        var price = (product.price/100).toFixed(2);

        const card = new builder.HeroCard(session)
            .title(util.formatTitle(product.title))
            .subtitle('$' + price)
            .text(util.formatDescription(product.description))
            .images([builder.CardImage.create(session, product.imgUrl)])
            .buttons([
                builder.CardAction.openUrl(session, product.url, 'More Details')
            ]);

        cards.push(card);
    }

    session.send(new builder.Message(session).attachmentLayout('carousel').attachments(cards));
    return true;
}
