var params = BotChat.queryParams(location.search);

window['botchatDebug'] = params['debug'] && params['debug'] === "true";

var botConnection = new BotChat.DirectLine({
    secret: params['s'],
    token: params['t'],
    domain: params['domain'],
    webSocket: params['webSocket'] && params['webSocket'] === "true" // defaults to true
});

BotChat.App({
    botConnection: botConnection,
    user: { id: params['userid'] || 'userid', name: params["username"] || 'username' },
    bot: { id: params['botid'] || 'botid', name: params["botname"] || 'botname' }
}, document.getElementById("bot"));

//handle events sent from the bot
botConnection.activity$
    .filter(a => a.type === "event")
    .subscribe(e => console.log(`event received with value of ${e.value}`));

//send event to the bot
document.getElementById('backchannelButton').onclick = e => {
    console.log('firing event...');
    botConnection
        .postActivity({ type: "event", value: "12345678", from: { id: "me" }, name: "authToken" })
        .subscribe(id => console.log("success!"));
}