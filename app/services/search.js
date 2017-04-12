const _ = require('lodash');
const request = require('request-promise-native');
const entityTypes = require('../../luis/entityModels');
let sampleProducts = require('../../samples/sample-products.json');

const searchApp = process.env.SEARCH_APP_NAME;

const indexes = {
    products: `https://www.${searchApp}.com/products`
};

const search = (index, query) => {
    return request({
        url: `${indexes[index]}/${query}.json`
    }).then((result) => {
        const obj = JSON.parse(result);
        return obj;
    });    
}

const searchProducts = (query) => search('products', query);

const concatenateQuery = (session) => {
    var query = '';
    
    // TODO: Concatenate the entities in a more meaningful way to hit product search API    
    entityTypes.forEach(e => {
        var temp = session.userData[e.type];
        if(temp) {
            query += session.userData[e.type] + ' '
        }
    }); 

    return query; 
}

module.exports = {
    getSampleData: () => sampleProducts,

    findProducts: function(query) {
        return searchProducts(query);
    },
    
    createQuery:  function(session) {
        return concatenateQuery(session);     
    }
};