const S = require('string');

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
            .truncate(240,'...')
            .s;
    }
}