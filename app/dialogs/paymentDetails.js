let user;

module.exports = function (name, bot, ba) {
    bot.dialog(`/${name}`, ba.authenticate("mercadolibre").concat([
        function (session, args, next) {
            user = ba.profile(session, "mercadolibre");
            session.send(`you're in paymentDetails and you're ${user.first_name} ${user.last_name}`);
            //note: this is the buyer's flow
            //look in api for open orders
            //"I found the following open orders, which one are you referring to?"
            //figure out which order they're referring to
            //is the payment processing delayed?
            //if not delayed then relay the product details (including estimated date)
            //if delayed then start handoff to get agent to initiate legacy approval flow
            next();
        },
        function (session) {
            session.endDialog("second function")
        }
    ])).triggerAction({ matches: name })
};
