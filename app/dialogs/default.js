module.exports = function (name, bot) {
    bot.dialog(`/${name}`, [
        function (session, args, next) {
            session.endDialog('Sorry, I didn\'t understand you or maybe just lost track of our conversation');
        }
    ])
};