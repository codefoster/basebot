let builder = require("botbuilder")

let locales = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'pt-br', name: 'Português' }
];

module.exports = function (name, bot, auth) {
    bot.dialog(`/${name}`, [
        function (session) {
            builder.Prompts.choice(session, "locale_prompt", locales.map(l => l.name).join('|'));
        },
        function (session, results) {
            let chosenLocale = locales.find(l => l.name == results.response.entity);
            if (chosenLocale)
                session.preferredLocale(chosenLocale.code, err => {
                    if (!err) session.endDialog("locale_updated");
                    else session.error(err);
                });
            else
                session.error("invalid_locale");
        }
    ]).triggerAction({ matches: name })
};
