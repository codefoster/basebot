let builder = require("botbuilder");
let sampleService = require('../services/sampleService')
//using lodash to seach in list
let _ = require('lodash');

module.exports = function (name, bot) {
    bot.dialog(`/${name}`, [
        function (session, args, next) {
            session.userData.version = 1.0;
            builder.Prompts.text(session, 'What\'s your ID?');
        },
        function (session, results) {
            session.send('Got it. Thanks.');
            session.userData.ID = results.response;
            //Sample of how you would use this.  customersService does not exist in this project
            //let customer = _.find(sampleService.customers, c => c.phone == results.response);
            let customer = sampleService.findCustomer(session.userData.ID)
            if(customer) {
                session.send('Hey, I recognize you. You\'re ' + JSON.stringify(customer));
            }
            else {
                session.send('You appear to be new around here.');
            }

            session.endDialog();
        }
    ])
        .triggerAction({ //should this dialog be triggered?
            onFindAction: function (context, callback) {
                let version = context.userData.version || 0;
                callback(null, (version < 1.0 ? 1.1 : 0.0));// 1.1 and 0.0 is confidence in the match 1.1 is strong
            }
        })

};

//purpose of trigger action is to determine if this dialog gets triggered when and action fires
//in case of matches its simple, because if the action that fires matches name then it triggers
//as long as its the highest in the stack

//you can pass in onFindAction that allows you to define a fuction that determins if this is a 
//match or not.

