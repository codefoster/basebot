let MongoClient = require('mongodb').MongoClient;

let widgets;
let isConnected = false;

if(process.env.MONGODB_URL) {
    MongoClient.connect(process.env.MONGODB_URL, (err, db) => {
        isConnected = !err;
        if(isConnected) widgets = db.collection('widgets');
    });
}

module.exports = {
    get isConnected() { return isConnected; },
    createWidget: newWidget => widgets.findOne({ id: newWidget.id }).then(w => (w ? w : widgets.insert(newWidget))),
    readWidget: id => widgets.findOne({ id: id }),
    updateWidget: w => widgets.update({ id: w.id }, w),
    deleteWidget: id => widgets.deleteOne({ id: id }),
};