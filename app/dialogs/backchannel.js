let builder = require("botbuilder");

//this dialog provides an imperative means to send a backchannel message
//from the bot to the user
module.exports = function (name, bot) {
    bot.dialog(`/${name}`, session => {
        var msg = new builder.Message().address(session.message.address);
        msg.data.type = "event";
        msg.data.name = "backchannel message from bot";
        msg.data.value = session.message.text;
        session.endDialog(msg);
    }).triggerAction({ matches: name })
}