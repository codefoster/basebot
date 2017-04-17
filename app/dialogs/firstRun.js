const MATCH = 1.1;
const NOMATCH = 0.0;
const currentVersion = 1.0;
let localeTools = require('./localeTools');

module.exports = function(name, bot, ba){
    bot.dialog(`/${name}`, [
        function (session, args, next) {
            //happens once per user (until we increment currentVersion)

            session.userData.version = currentVersion;

            localeTools.chooseLocale(session);

            session.endDialog();
        }
    ])
        .triggerAction({
            onFindAction: function (context, callback) {
                let version = context.userData.version || 0;
                callback(null, (version < currentVersion ? MATCH : NOMATCH));
            }
        })

};