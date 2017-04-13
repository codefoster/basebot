let builder = require('botbuilder');
let fs = require('fs');

module.exports = function(name, bot, ba){

    bot.on(name, function (message) {
        if (message.membersAdded) {
            message.membersAdded.forEach(function (identity) {
                if (identity.id === message.address.bot.id) {

/*                    fs.readFile('../images/MercadoLibre_logo.PNG', function (err, data) {
                        bot.send(err);
                        var contentType = 'image/png';
                        var base64 = Buffer.from(data).toString('base64');
                        var msg = new builder.Message()
                            .address(message.address)
                            .addAttachment({
                                contentUrl: util.format('data:%s;base64,%s', contentType, base64),
                                contentType: contentType,
                                name: 'MercadoLibreLogo.png'
                            })
                        bot.send(msg);
                    });*/
                    var reply = new builder.Message()
                        .address(message.address)
                        .text('Hi! I am Mercado Libre Bot. I can find you  products. Try saying show me cameras.');
                    bot.send(reply);
                }
            });
        }
    })
};