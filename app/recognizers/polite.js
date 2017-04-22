//this recognizer will never interrupt dialogs
//if there's a dialog stack it will be disabled

let recognizer = new builder.RecognizerFilter(new builder.LuisRecognizer(process.env.LUIS_ENDPOINT_3))
    .onEnabled(function (context, callback) {
        let stack = context.dialogStack();
        let inDialog = stack && stack.length > 0;
        callback(null, !inDialog);
    });
bot.recognizer(recognizer);
