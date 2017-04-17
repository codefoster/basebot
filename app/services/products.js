var Promise = require('bluebird');

module.exports = {
    searchProducts: function (product) {
        return new Promise(function (resolve) {
            //Below will work with sample data
            // Filling the products results manually just for demo purposes
            var products = [];
            for (var i = 1; i <= 5; i++) {
                products.push({
                    name: product + ' product ' + i,
                    location: product,
                    rating: Math.ceil(Math.random() * 5),
                    numberOfReviews: Math.floor(Math.random() * 5000) + 1,
                    priceStarting: Math.floor(Math.random() * 450) + 80,
                    image: 'https://placeholdit.imgix.net/~text?txtsize=35&txt=' + product + '+' + i + '&w=500&h=260'
                });
            }

            products.sort(function (a, b) { return a.priceStarting - b.priceStarting; });

            // complete promise with a timer to simulate async response
            setTimeout(function () { resolve(products); }, 1000);
        });
    },

};