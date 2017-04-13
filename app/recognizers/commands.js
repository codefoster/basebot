//if the command is typed to the bot, the corresponding intent
//will be triggered by the recognizer
let commands = [
    { text: 'profile', intent: 'profile' },
    { text: 'logout', intent: 'logout' },
    { text: 'delete all', intent: 'delete' }
];

module.exports = {
    recognize: function (context, callback) {
        let text = context.message.text.toLowerCase();
        let match = commands.find(m => m.text == text);
        let result = {
            entities: [],
            intent: (match ? match.intent : null),
            matched: undefined,
            expression: undefined,
            intents: [],
            score: (match ? 1 : 0)
        };
        callback.call(null, null, result);
    }
};