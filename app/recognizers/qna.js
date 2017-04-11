//this recognizer requires a modified version of the botbuilder-cognitiveservices module
//currently living at http://github.com/codefoster/botbuilder-cognitiveservices
//clone repo  - git clone http://github.com/codefoster/botbuilder-cognitiveservices
//In a command window navigate to the NODE folder in that repo and run :    npm link
//In a command window navigate to this project (botstarter) run npm link botbuilder-cognitiveservices

//You will also need to add your keys from QnAMaker

//you can have multiple QnA makers you just need to have seperate files 
//and different intent names (intentName:"qna2")
const envx = require("envx");
let builder = require("botbuilder");
var bbcs = require('botbuilder-cognitiveservices');

module.exports = new bbcs.QnAMakerRecognizer({
    knowledgeBaseId: envx("QNA_ID"), 
    subscriptionKey: envx("QNA_KEY"),
    intentName: "qna"
});