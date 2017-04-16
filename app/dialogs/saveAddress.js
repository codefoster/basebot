let melibotdb = require('../services/melibotdb');

module.exports = function (name, bot, ba) {
    bot.dialog(`/${name}`, [
        function (session) {
            melibotdb.getAddressByConversationId(session.message.address.conversation.id, docs => {
                if(docs.length == 0)
                    melibotdb.saveAddress(session.message.address);
            });
            session.endDialog();
        }
    ])
        .triggerAction({
            onFindAction: function (context, callback) {
                let call = 1.1; //1.1 to call, 0.0 to not
                callback(null, call);
            }
        })
};