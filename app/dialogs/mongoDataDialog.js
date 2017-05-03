let builder = require('botbuilder');
let mongoDataService = require('../services/mongoDataService');

module.exports = function (name, bot, auth) {
    bot.dialog(`/${name}`, [
        function (session, args, next) {
            builder.Prompts.choice(session, 'What do you want to do?', 'create|read|update|delete');
        },
        function (session, result, next) {
            let choice = result.response.entity;
            session.sendTyping();
            switch (choice) {
                case 'create':
                    mongoDataService.createWidget({ id: 1, name: 'widget 1' }).then(r => {
                        session.send('widget 1 created');
                    })
                    break;
                case 'read':
                    break;
                case 'update':
                    break;
                case 'delete':
                    break;
                default:
                    session.replaceDialog(`/${name}`);
            }
        }
    ])
        .triggerAction({ matches: name })
        .replace
};
