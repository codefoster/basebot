/*-----------------------------------------------------------------------------
Basic pattern for exposing a library. The create() function should be
called once at startup and then the library exposes wrapper methods for 
invoking its various prompts.

The primary roll of a library is to move all of the libraries dialogs into a
seperate namespace that won't collide with the bots dialogs.  That means there
is an extra step that on the library side of things you need to include your
libraries namespace when calling session.beginDialog(). You technically only 
need to do this when you're being called into from a different namespace but
it doesn't hurt to allways include the namespace.
-----------------------------------------------------------------------------*/

var builder = require('botbuilder');
var request = require('request');

//=========================================================
// Library creation
//=========================================================

var lib = new builder.Library('localeTools');

exports.createLibrary = function () {
    return lib;
}

//=========================================================
// Locale Picker Prompt
//=========================================================

let locales = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'pt-br', name: 'Português' }
];

exports.chooseLocale = function (session, options) {
    // Start dialog in libraries namespace
    session.beginDialog('localeTools:chooseLocale', options || {});
}

lib.dialog('chooseLocale', [
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
                    body: { documents: [{ id: 'message', text: event.text }] },
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

