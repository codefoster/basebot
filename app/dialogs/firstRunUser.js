//this dialog uses onFindAction and a "hasRunVersion" variable in userData
//to be sure this dialog only runs once per user
//use "delete all" command to reset user data and test
//increment currentVersion to cause this dialog to run again for all users

const MATCH = 1.0;
const NOMATCH = 0.0;
const currentVersion = 1.0;

module.exports = function (name, bot) {
    bot.dialog(`/${name}`, [
        function (session, args, next) {
            console.log("Executing user level first run...");

            //store the user's message
            session.dialogData.message = session.message; 
            
            //do first run stuff
            //choose locale
            session.beginDialog("localeTools:/chooseLocale");

            session.userData.hasRunVersion = currentVersion;
        },
        function(session, bot) {
            //recover the user's message
            let message = session.dialogData.message; 

            //clear the dialog stack, and save the session
            session.clearDialogStack().save().sendBatch(err => {
                if(err) console.log(err);
                
                //simulate the bot receiving the message
                bot.receive(message); 
            });
        }
    ]).triggerAction({
        onFindAction: function (context, callback) {
            let hasRunVersion = context.userData.hasRunVersion || 0;
            callback(null, (hasRunVersion < currentVersion ? MATCH : NOMATCH));
        }
    })

};