let builder = require('botbuilder');

module.exports = builder.Middleware.dialogVersion({ version: 1.0, resetCommand: /^reset/i })