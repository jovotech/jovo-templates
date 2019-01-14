'use strict';

console.log('This template uses an outdated version of the Jovo Framework. Please update your Jovo CLI to the latest version. Learn more here: https://www.jovo.tech/docs/installation/v1-migration');

// =================================================================================
// App Configuration
// =================================================================================

const {App, Plugin} = require('jovo-framework');

const config = {
    // logging: true,
};

const app = new App(config);


// =================================================================================
// Plugin
// =================================================================================

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

app.register(new CustomLogging());


// =================================================================================
// App Logic
// =================================================================================

app.setHandler({
    'LAUNCH': function() {
        this.toIntent('HelloWorldIntent');
    },

    'HelloWorldIntent': function() {
        this.followUpState('TEST_STATE').ask('Hello World! What\'s your name?', 'Please tell me your name.');
    },

    'TEST_STATE': {
        'MyNameIsIntent': function(name) {
            this.tell('Hey ' + name.value + ', nice to meet you!');
        },

        'Unhandled': function() {
            this.ask('Are you sure?');
        },
    },
});

module.exports.app = app;
