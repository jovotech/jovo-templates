'use strict';

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
        this.ask('Hello World! What\'s your name?', 'Please tell me your name.');
    },

    'MyNameIsIntent': function(name) {
        this.tell('Hey ' + name.value + ', nice to meet you!');
    },
    'ON_EVENT': {
        'AlexaSkillEvent.SkillEnabled': function() {
            console.log('AlexaSkillEvent.SkillEnabled');
        },
        'AlexaSkillEvent.SkillDisabled': function() {
            console.log('AlexaSkillEvent.SkillDisabled');
        },
        'AlexaSkillEvent.SkillAccountLinked': function() {
            console.log('AlexaSkillEvent.SkillAccountLinked');
        },
        'AlexaSkillEvent.SkillPermissionAccepted': function() {
            console.log('AlexaSkillEvent.SkillPermissionAccepted');
        },
        'AlexaSkillEvent.SkillPermissionChanged': function() {
            console.log('AlexaSkillEvent.SkillPermissionChanged');
        },
    }
});

module.exports.app = app;
