'use strict';

// ------------------------------------------------------------------
// PLUGIN
// ------------------------------------------------------------------

class CustomLogging extends Plugin {
    constructor(options) {
        super(options);
    }
    init() {
        let output = '';
        this.app.on('request', (jovo) => {
            if (jovo.getIntentName() === 'Default Fallback Intent') {
                output += `\nState: ${jovo.getState()} | Raw Text: ${jovo.platform.getRawText()}\n`
                console.log(output);
                output = '';
            }
        });
        this.app.on('ask', (jovo, speech, repromptSpeech) => {
            output += `\nspeech: ${speech} | reprompt: ${repromptSpeech}\n`;
        });
    }
}




// ------------------------------------------------------------------
// APP INITIALIZATION
// ------------------------------------------------------------------

const {App} = require('jovo-framework');
const {Plugin} = require('jovo-core');
const {Alexa} = require('jovo-platform-alexa');
const {GoogleAssistant} = require('jovo-platform-googleassistant');
const {JovoDebugger} = require('jovo-plugin-debugger');
const {FileDb} = require('jovo-db-filedb');

const app = new App();


class CustomLogging implements Plugin {
    constructor(options) {
        super(options);
    }
    init() {
        let output = '';
        this.app.on('request', (jovo) => {
            if (jovo.getIntentName() === 'Default Fallback Intent') {
                output += `\nState: ${jovo.getState()} | Raw Text: ${jovo.platform.getRawText()}\n`
                console.log(output);
                output = '';
            }
        });
        this.app.on('ask', (jovo, speech, repromptSpeech) => {
            output += `\nspeech: ${speech} | reprompt: ${repromptSpeech}\n`;
        });
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
        this.toIntent('HelloWorldIntent');
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
