module.exports = {
    receive: function (event, next) {
        // log messages from user
        
        next();
    },
    send: function (event, next) {
        // log messages from bot

        next();
    }
}