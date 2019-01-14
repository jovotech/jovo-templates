'use strict';

console.log('This template uses an outdated version of the Jovo Framework. Please update your Jovo CLI to the latest version. Learn more here: https://www.jovo.tech/docs/installation/v1-migration');

// =================================================================================
// App Configuration
// =================================================================================

const {App} = require('jovo-framework');

const config = {
    logging: true,
};

const app = new App(config);


// =================================================================================
// App Logic
// =================================================================================

app.setHandler({
    'LAUNCH': function() {
        this.toIntent('HelloWorldIntent');
    },

    'HelloWorldIntent': function() {
        if (this.isGoogleAction()) {
            this.googleAction().showSuggestionChips(['Elliot', 'J.D', 'Turk']);
        }
        this.ask('Hello World! What\'s your name?', 'Please tell me your name.');
    },

    'MyNameIsIntent': function(name) {
        this.tell('Hey ' + name.value + ', nice to meet you!');
    },
});

module.exports.app = app;
