let MongoClient = require('mongodb').MongoClient;

let widgets;

MongoClient.connect(process.env.MONGODB_URL, (err, db) => {
    widgets = db.collection('widgets');
});

module.exports = {
    createWidget: newWidget => widgets.findOne({ id: newWidget.id }).then(w => (w ? w : widgets.insert(newWidget))),
    readWidget: id => widgets.findOne({ id: id }),
    updateWidget: w => widgets.update({ id: w.id }, w),
    deleteWidget: id => widgets.deleteOne({ id: id }),
};