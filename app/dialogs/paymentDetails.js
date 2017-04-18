module.exports = function (name, bot, ba) {
    bot.dialog(`/${name}`, [
        function (session, args, next) {
            //note: this is the buyer's flow
            //"I found the following open orders, which one are you referring to?"
            //figure out which order they're referring to
            //is the payment processing delayed?
            //if not delayed then relay the product details (including estimated date)
            //if delayed then start handoff to get agent to initiate legacy approval flow
        }
    ]).triggerAction({ matches: name })
};
