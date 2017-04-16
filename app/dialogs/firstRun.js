module.exports = function (name, bot, ba) {
    bot.dialog(`/${name}`, [
        function (session) {
            session.userData.version = 1.0;
            //this will only happen once for a user

            session.endDialog();
        }
    ])
        .triggerAction({
            onFindAction: function (context, callback) {
                let version = context.userData.version || 0;
                callback(null, (version < 1.0 ? 1.1 : 0.0));
            }
        })
};