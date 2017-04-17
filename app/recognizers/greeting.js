const greetings = ['hi', 'hi there', 'hey', 'hey there', 'hello', 'hello hello', 'hello there', 'what up', 'what\'s up', 'whatup', 'salute', 'morning', 'good morning', 'how are you', 'how r u'];

module.exports = {
    recognize: function (context, callback) {
        const text = context.message.text.replace(/[!?,.\/\\\[\]\{\}\(\)]/g, '').toLowerCase();

        let isGreeting = greetings.some(g => text === g);

        let recognized = {
            entities: [],
            intent: (isGreeting ? 'greeting' : null),
            matched: undefined,
            expression: undefined,
            intents: [],
            score: (isGreeting ? 1 : 0)
        }

        callback.call(null, null, recognized);
    }
};