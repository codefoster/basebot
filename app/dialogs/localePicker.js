let builder = require("botbuilder")
module.exports = function(name, bot){
    bot.dialog(`/${name}`, [
     function (session) {
        // Prompt the user to select their preferred locale
        builder.Prompts.choice(session, "locale_prompt", 'English|Español');
    },
        function (session, results) {
        // Update preferred locale
        var locale;
        switch (results.response.entity) {
            case 'English':
                locale = 'en';
                break;
            case 'Español':
                locale = 'es';
                break;
        }
        session.preferredLocale(locale, function (err) {
            if (!err) {
                // Locale files loaded
                session.endDialog("locale_updated", results.response.entity);
            } else {
                // Problem loading the selected locale
                session.error(err);
            }
        });
    }
    ])
};
