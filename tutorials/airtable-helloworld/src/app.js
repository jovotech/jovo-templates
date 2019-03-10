'use strict';

console.log('Don\'t forget to update the `apiKey` and `baseId` in the config.js file! You can delete this prompt at the top of the app.js file after you\'re done');

// ------------------------------------------------------------------
// APP INITIALIZATION
// ------------------------------------------------------------------

const { App } = require('jovo-framework');
const { Alexa } = require('jovo-platform-alexa');
const { GoogleAssistant } = require('jovo-platform-googleassistant');
const { JovoDebugger } = require('jovo-plugin-debugger');
const { FileDb } = require('jovo-db-filedb');
const { AirtableCMS } = require('jovo-cms-airtable');

const app = new App();

app.use(
    new Alexa(),
    new GoogleAssistant(),
    new JovoDebugger(),
    new FileDb(),
    new AirtableCMS()
);


// ------------------------------------------------------------------
// APP LOGIC
// ------------------------------------------------------------------

app.setHandler({
    LAUNCH() {
        return this.toIntent('HelloWorldIntent');
    },

    HelloWorldIntent() {
        this.ask(this.t('welcome.speech'), this.t('welcome.reprompt'));
    },

    MyNameIsIntent() {
        this.tell(this.t('greeting.speech', { name: this.$inputs.name.value }));
    },
});

module.exports.app = app;
