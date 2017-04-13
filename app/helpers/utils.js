let S = require('string');
let builder = require('botbuilder');

module.exports = {
    formatTitle: s => {
        return S(s)
            .decodeHTMLEntities() // &amp;
            .stripTags() // <p></p>
            .s;
    },
    formatDescription: s => {
        return S(s)
            .decodeHTMLEntities() // &amp;
            .stripTags() // <p></p>
            .truncate(240, '...')
            .s;
    },
    productAsAttachment(product) {
        return new builder.HeroCard()
            .title(product.title)
            //.subtitle(' price %d quantity %d mode. $%d .', product.price, product.available_quantity, product.buying_mode)
            .images([new builder.CardImage().url(product.thumbnail)])
            .buttons([
                new builder.CardAction()
                    .title('More details')
                    .type('openUrl')
                    .value(encodeURIComponent(product.permalink))
            ]);
    }
}