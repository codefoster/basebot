let builder = require('botbuilder');
let mongoDataService = require('../services/mongoDataService');

let c = 0;
let hasSeenDialogHelp = false;

module.exports = function (name, bot) {
    bot.dialog(`/${name}`, [
        function (session, args, next) {
            if(!mongoDataService.isConnected)
                session.endDialog('no_mongo');
            else {
                if(!hasSeenDialogHelp) {
                    session.send("mongo_dialog_intro");
                    hasSeenDialogHelp = true;
                }
                builder.Prompts.choice(session, "mongo_action_prompt", 'create|read|update|delete');
            }
        },
        function (session, result, next) {
            let choice = result.response.entity;
            session.sendTyping();
            switch (choice) {
                case 'create':
                    mongoDataService.createWidget({ id: 1, name: 'widget 1' })
                        .then(r => {
                            session.send("mongo_widget_added");
                            next();
                        });
                    break;
                case 'read':
                    mongoDataService.readWidget(1)
                        .then(w => {
                            session.send(w ? w.name : "mongo_no_widgets");
                            next();
                        });
                    break;
                case 'update':
                    mongoDataService.updateWidget({ id: 1, name: `widget 1 (${++c})` })
                        .then(w => {
                            session.send("mongo_widget_updated");
                            next();
                        });
                    break;
                case 'delete':
                    mongoDataService.deleteWidget(1).then(w => {
                        session.send("Alright, it's gone");
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
