//this dialog uses onFindAction and a "hasRun" variable in conversationData
//to be sure this dialog only runs once per conversation

const MATCH = 1.0;
const NOMATCH = 0.0;

module.exports = function (name, bot, auth) {
    bot.dialog(`/${name}`, [
        function (session) {
            session.send("(first run for this conversation)");
            session.privateConversationData.hasRun = true;

            //save the address for proactive use later
            //session.message.address;

            session.endDialog();
        }
    ])
        .triggerAction({
            onFindAction: function (context, callback) {
                callback(null, (!context.privateConversationData.hasRun ? MATCH : NOMATCH));
            }
        })
};