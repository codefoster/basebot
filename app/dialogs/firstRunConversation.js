//this dialog uses onFindAction and a "hasRun" variable in conversationData
//to be sure this dialog only runs once per conversation
//this dialog saves and then replays the user's message to avoid making them repeat themselves

const MATCH = 1.0;
const NOMATCH = 0.0;

module.exports = function (name, bot) {
    bot.dialog(`/${name}`, [
        function (session, args, next) {
            //set hasRun so this dialog will not be triggered again for this conversation
            session.privateConversationData.hasRun = true;

            //store the user's message
            session.dialogData.message = session.message;

            //do first run stuff
            //this is a good place to save session.message.address for proactive use later
            session.send('firstRunConversation ran');

            next();
        },
        function (session, args, next) {
            //recover the user's message
            let message = session.dialogData.message;

            //clear the dialog stack, and save the session
            session.clearDialogStack().save().sendBatch(err => {
                if(err) console.log(err);

                //simulate the bot receiving the message
                bot.receive(message);
            });

        }
    ])
        .triggerAction({
            onFindAction: function (context, callback) {
                callback(null, (!context.privateConversationData.hasRun ? MATCH : NOMATCH));
            }
        })
};