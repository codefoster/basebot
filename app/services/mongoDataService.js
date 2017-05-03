let MongoClient = require('mongodb').MongoClient;

let url = 'mongodb://localhost:27017/basebot';

module.exports = {
    createWidget: w => {
        return new Promise(resolve => {
            MongoClient.connect(url, function (err, db) {
                let widgets = db.collection('widgets');
                let widget = widgets.findOne({id:w.id});
                if(!widget) resolve(db.collection('widgets').insert(w));
                else resolve(widget);
            });
        })
    },
    readWidget: id => {
        MongoClient.connect(url, function (err, db) {
            return db.collection('widgets').findOne({ id: id });
        });
    },
    updateWidget: w => {
        MongoClient.connect(url, function (err, db) {
            return db.collection('widgets').update({ id: w.id }, w);
        });
    },
    deleteWidget: id => {
        MongoClient.connect(url, function (err, db) {
            return db.collection('widgets').deleteOne({ id: id });
        });

    },
};