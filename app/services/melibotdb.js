let uuid = require('uuid/v4');
let MongoClient = require('mongodb').MongoClient;

// Connection URL
let url = 'mongodb://localhost:27017/melibot';

module.exports = {
    saveAddress: function (address) {
        address.timestamp = new Date();
        address.uuid = uuid();

        // Use connect method to connect to the server
        MongoClient.connect(url, function (err, db) {

            let addresses = db.collection('addresses');

            addresses.insert(address, (err, result) => {
                console.log(JSON.stringify(result));
            })

            db.close();
        });

    },
    getAddressByConversationId: function (id, callback) {
        MongoClient.connect(url, function (err, db) {
            let addresses = db.collection('addresses');
            addresses.find({ "conversation.id": id }).toArray((err,docs) => {
                callback(docs);
                db.close();
            });
        });
    }
}