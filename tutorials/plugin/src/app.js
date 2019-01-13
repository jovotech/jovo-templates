'use strict';

// ------------------------------------------------------------------
// APP INITIALIZATION
// ------------------------------------------------------------------

const {App} = require('jovo-framework');
const {Alexa} = require('jovo-platform-alexa');
const {GoogleAssistant} = require('jovo-platform-googleassistant');
const {JovoDebugger} = require('jovo-plugin-debugger');
const {FileDb} = require('jovo-db-filedb');

const app = new App();


class CustomLogging {
    constructor() {
        this.output = '';
    }
    install(app) {
        app.middleware('platform.output').use(this.saveOutput.bind(this));
        app.middleware('platform.nlu').use(this.log.bind(this));
    }
    saveOutput(handleRequest) {
        if (handleRequest.jovo.constructor.name === 'GoogleAction') {
            let speech = handleRequest.jovo.$response.getSpeech().replace(/<\/?speak\/?>/g, '');
            let reprompt;
            if (handleRequest.jovo.$response.getReprompt()) {
                reprompt = handleRequest.jovo.$response.getReprompt().replace(/<\/?speak\/?>/g, '');
            }
            let state = handleRequest.jovo.getState() || '-';
            this.output = `\nspeech: ${speech} | reprompt: ${reprompt}\n`
            this.output += `\nState: ${state} | `;
        }
    }
    log(handleRequest) {
        if (handleRequest.jovo.constructor.name === 'GoogleAction') {
            let intentName = handleRequest.jovo.$request.getIntentName();
            if (intentName === 'Default Fallback Intent') {
                this.output += ` Raw Text: ${handleRequest.jovo.$request.toJSON().queryResult.queryText}\n`
                console.log(this.output);
                this.output = '';
            }
        }     
    }
}

app.use(
    new Alexa(),
    new GoogleAssistant(),
    new JovoDebugger(),
    new FileDb(),
    new CustomLogging()
);


// ------------------------------------------------------------------
// APP LOGIC
// ------------------------------------------------------------------

app.setHandler({
    LAUNCH() {
        return this.toIntent('HelloWorldIntent');
    },

    HelloWorldIntent() {
        this.ask('Hello World! What\'s your name?', 'Please tell me your name.');
    },
    MyNameIsIntent() {
        this.tell('Hey ' + this.$inputs.name.value + ', nice to meet you!');
    },
    Unhandled() {
        this.tell('Unhandled');
    },
    END() {
        this.tell('Done');
    }
});

module.exports.app = app;
