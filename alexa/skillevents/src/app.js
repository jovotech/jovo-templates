'use strict';

// ------------------------------------------------------------------
// APP INITIALIZATION
// ------------------------------------------------------------------

const { App } = require('jovo-framework');
const { Alexa } = require('jovo-platform-alexa');
const { JovoDebugger } = require('jovo-plugin-debugger');
const { FileDb } = require('jovo-db-filedb');

const app = new App();

app.use(
    new Alexa(),
    new JovoDebugger(),
    new FileDb()
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

    ON_EVENT: {
        'SkillEnabled'() {
            console.log('SkillEnabled');
        },
        'SkillDisabled'() {
            console.log('SkillDisabled');
        },
        'SkillAccountLinked'() {
            console.log('SkillAccountLinked');
        },
        'SkillPermissionAccepted'() {
            console.log('SkillPermissionAccepted');
        },
        'SkillPermissionChanged'() {
            console.log('SkillPermissionChanged');
        },
    }
});


module.exports.app = app;
