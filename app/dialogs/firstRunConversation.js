//this dialog uses onFindAction and a "hasRun" variable in conversationData
//to be sure this dialog only runs once per conversation

const MATCH = 1.0;
const NOMATCH = 0.0;

module.exports = function (name, bot, auth) {
    bot.dialog(`/${name}`, [
        function (session) {
            session.send("(first run for this conversation)");
            //store the user's message
            session.dialogData.message = session.message; 

            //do first run stuff
            //this is a good place to save session.message.address for proactive use later

            session.privateConversationData.hasRun = true;
        },
        function(session,args,next) {
            //recover the user's message
            let message = session.dialogData.message; 
        }
    ])
        .triggerAction({
            onFindAction: function (context, callback) {
                callback(null, (!context.privateConversationData.hasRun ? MATCH : NOMATCH));
            }
        })
};