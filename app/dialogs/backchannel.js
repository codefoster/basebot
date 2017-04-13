let builder = require("botbuilder");

module.exports = function (name, bot, ba) {
    bot.dialog(`/${name}`, session => {
        var msg = new builder.Message().address(session.message.address);
        msg.data.type = "event";
        msg.data.name = "backchannel message from bot";
        msg.data.value = session.message.text;
        session.endDialog(msg);
    })
        .triggerAction({ matches: /backchannel/i })
}