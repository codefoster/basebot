//We use this to capture the user address for later use

module.exports = {
    receive: function (event, next) {
        logUserAddress(event);
        next();
    },
    send: function (event, next) {
        logUserAddress(event);
        next();
    }
}

function logUserAddress(event) {
    var savedAddress;
    savedAddress = event.address;
    console.log('save address for user: ' + event.address.user.name + ' to database here');
}