//this dialog uses onFindAction and a "hasRunVersion" variable in conversationData
//to be sure this dialog only runs once per conversation

let melibotdb = require('../services/melibotdb');

const MATCH = 1.1;
const NOMATCH = 0.0;

module.exports = function (name, bot, ba) {
    bot.dialog(`/${name}`, [
        function (session) {
            session.send("(first run for this conversation)");
            session.privateConversationData.hasRun = true;

            //save the address in mongo
            melibotdb.saveAddress(session.message.address);
            
            session.endDialog();
        }
    ])
        .triggerAction({
            onFindAction: function (context, callback) {
            callback(null, (!context.privateConversationData.hasRun ? MATCH : NOMATCH));
            }
        })
};