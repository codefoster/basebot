//This is an intent dialog. its trigger
//fires when an intent matches name (which corresponds to the file name)
module.exports = function(name, bot, ba){
    bot.dialog(`/${name}`, [
        function (session, args, next) {
            session.endDialog(`${name} reached`);
        }
    ]).triggerAction({matches:name})//triggered if action matches "name"
};
