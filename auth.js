let botauth = require('botauth');
let authStrategy = require(`passport-${process.env.AUTH_PROVIDER_NAME}`).Strategy;

module.exports = function (server, bot) {
    new botauth.BotAuthenticator(server, bot, { baseUrl: `https://${process.env.WEBSITE_HOSTNAME}`, secret: process.env.BOTAUTH_SECRET })
        .provider(process.env.AUTH_PROVIDER_NAME, (options) => {
            return new authStrategy({
                clientID: process.env.AUTH_PROVIDER_APP_ID,
                clientSecret: process.env.AUTH_PROVIDER_APP_SECRET,
                scope: ['read_public', 'read_relationships'],
                callbackURL: options.callbackURL
            }, (accessToken, refreshToken, profile, done) => {
                profile = profile || {};
                profile.accessToken = accessToken;
                profile.refreshToken = refreshToken;
                return done(null, profile);
            });
        })
};