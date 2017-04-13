let builder = require("botbuilder");

module.exports = function(name, bot, ba){
    bot.dialog(`/${name}`, session => {
        delete session.userData
        session.endDialog('Everything has been wiped out')
    })
        .triggerAction({
            matches: /delete all/i,
            confirmPrompt: "This will wipe everything out. Are you sure?"
        })
}