let S = require('string');
let builder = require('botbuilder');
let fs = require('fs');
let readdir = require('readdir-enhanced');
let path = require('path');

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
    productAsAttachment: (product) => {
        return new builder.HeroCard()
            .title(product.title)
            //.subtitle(' price %d quantity %d mode. $%d .', product.price, product.available_quantity, product.buying_mode)
            .images([new builder.CardImage().url(product.thumbnail)])
            .buttons([
                new builder.CardAction()
                    .title('More details')
                    .type('openUrl')
                    .value(product.permalink)
            ]);
    },
    orderAsAttachment: (order) => {
        return new builder.HeroCard()
            .title(product.title)
            //.subtitle(' price %d quantity %d mode. $%d .', product.price, product.available_quantity, product.buying_mode)
            .images([new builder.CardImage().url(product.thumbnail)])
            .buttons([
                new builder.CardAction()
                    .title('More details')
                    .type('openUrl')
                    .value(product.permalink)
            ]);
    },

    //takes a directory and using fs to loop through the files in the directory
    //this is how we get the names of our dialogs, recognizers, etc. By looking at the file names in the dialogs folder
    //filter by .js files 
    getFiles: dir => {
        return readdir.sync(dir, { deep: true })
            .map(item => `.${path.posix.sep}${path.posix.join(dir, path.posix.format(path.parse(item)))}`) //normalize paths
            .filter(item => !fs.statSync(item).isDirectory() && /.js$/.test(item)) //filter out directories
            .map(file => ({ name: path.basename(file, '.js'), path: file }))
    }
}