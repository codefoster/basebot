module.exports = {
    receive: function (event, next) {
        logMessage(event.address.user.name, event.text);
        next();
    },
    send: function (event, next) {
        logMessage(event.address.user.name, event.text);
        next();
    }
}

function logMessage(user, msg) {
    console.log(`message: ${msg}, user: ${user}`);
}
