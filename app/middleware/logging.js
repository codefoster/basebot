module.exports = {
    receive: function (event, next) {
        logUserConversation(event);
        next();
    },
    send: function (event, next) {
        logUserConversation(event);
        next();
    }
}


function logUserConversation(event) {
    console.log('message: ' + event.text + ', user: ' + event.address.user.name);
}
