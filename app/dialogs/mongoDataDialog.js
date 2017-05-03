let builder = require('botbuilder');
let mongoDataService = require('../services/mongoDataService');

let c = 0;
let hasSeenDialogHelp = false;

module.exports = function (name, bot) {
    bot.dialog(`/${name}`, [
        function (session, args, next) {
            if(!hasSeenDialogHelp) {
                session.send('This sample dialog will only create a single widget, but it shows the basics of using mongo for data persistence. Type \"cancel\" to escape this dialog.');
                hasSeenDialogHelp = true;
            }
            builder.Prompts.choice(session, 'What do you want to do?', 'create|read|update|delete');
        },
        function (session, result, next) {
            let choice = result.response.entity;
            session.sendTyping();
            switch (choice) {
                case 'create':
                    mongoDataService.createWidget({ id: 1, name: 'widget 1' })
                        .then(r => {
                            session.send('done');
                            next();
                        });
                    break;
                case 'read':
                    mongoDataService.readWidget(1)
                        .then(w => {
                            session.send(w ? w.name : 'no widget');
                            next();
                        });
                    break;
                case 'update':
                    mongoDataService.updateWidget({ id: 1, name: `widget 1 (${++c})` })
                        .then(w => {
                            session.send('done');
                            next();
                        });
                    break;
                case 'delete':
                    mongoDataService.deleteWidget(1).then(w => {
                        session.send('done');
                        next();
                    });
                    break;
            }
        },
        function (session) {
            session.replaceDialog(`/${name}`);
        }

    ])
        .triggerAction({ matches: name })
        .cancelAction('cancelMongo', 'mongo menu cancelled', {
            matches: /^cancel/i,
        })
};
