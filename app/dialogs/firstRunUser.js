//this dialog uses onFindAction and a "hasRunVersion" variable in userData
//to be sure this dialog only runs once per user
//use "delete all" command to reset user data and test
//increment currentVersion to cause this dialog to run again for all users

const MATCH = 1.0;
const NOMATCH = 0.0;
const currentVersion = 1.0;

module.exports = function (name, bot, ba) {
    bot.dialog(`/${name}`, [
        function (session, args, next) {
            session.send("(first run for this user)");
            session.userData.hasRunVersion = currentVersion;
            session.beginDialog("/chooseLocale");
        }
    ]).triggerAction({
        onFindAction: function (context, callback) {
            let hasRunVersion = context.userData.hasRunVersion || 0;
            callback(null, (hasRunVersion < currentVersion ? MATCH : NOMATCH));
        }
    })

};