module.exports = function (name, bot) {
    bot.on(name, function (event) {
        bot.send(new builder.Message()
            .address(event.address)
            .textLocale("en-us")
            .text(`event received (event name: '${event.name}')`)
        );
    })
};