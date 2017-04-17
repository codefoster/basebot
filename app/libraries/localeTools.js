var builder = require('../../core/');
var request = require('request');

var lib = new builder.Library('localeTools');

exports.createLibrary = function () {
    return lib;
}

exports.chooseLocale = function (session, options) {
    session.beginDialog('localeTools:chooseLocale', options || {});
}

let locales = [
    {code:'en', name:'English'},
    {code:'es', name:'Español'},
    {code:'pt-br', name:'Portuguese (Brazil)'} //TODO: translate to portuguese (br)
];

lib.dialog('chooseLocale', [
    function (session) {
        builder.Prompts.choice(session, "locale_prompt", locales.map(l => l.name).join('|'));
    },
    function (session, results) {
        let chosenLocale = locales.find(l => l.name == results.response.entity);
        if(chosenLocale)
            session.preferredLocale(chosenLocale.code, err => {
                if (!err) session.endDialog('locale_updated');
                else session.error(err);
            });
        else
            session.error('invalid locale');
    }
]);


//=========================================================
// Language Detection Middleware
//=========================================================

exports.languageDetection = function (apiKey) {
    if (!apiKey) {
        console.warn('No API Key passed to localeTools.languageDetection().');
    }
    return {
        receive: function (event, next) {
            if (apiKey && event.text && !event.textLocale) {
                var options = {
                    method: 'POST',
                    url: 'https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/languages?numberOfLanguagesToDetect=1',
                    body: { documents: [{ id: 'message', text: event.text }]},
                    json: true,
                    headers: {
                        'Ocp-Apim-Subscription-Key': apiKey
                    }
                };
                request(options, function (error, response, body) {
                    if (!error) {
                        if (body && body.documents && body.documents.length > 0) {
                            var languages = body.documents[0].detectedLanguages;
                            if (languages && languages.length > 0) {
                                event.textLocale = languages[0].iso6391Name;
                            }
                        }
                    }
                    next();
                });
            } else {
                next();
            }
        }
    };
}

