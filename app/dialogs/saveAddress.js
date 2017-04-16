let melibotdb = require('../services/melibotdb');

module.exports = function (name, bot, ba) {
    bot.dialog(`/${name}`, [
        function (session) {
            //this should be the first time running this (for this conversation)
            //so mark it as dirty
            session.privateConversationData.dirty = true;

            //save the address in mongo
            melibotdb.saveAddress(session.message.address);
            
            session.endDialog();
        }
    ])
        .triggerAction({
            onFindAction: function (context, callback) {
                //only trigger this dialog the first time for this conversation
                callback(null, (context.privateConversationData.dirty ? 0.0 : 1.1));
            }
        })
};