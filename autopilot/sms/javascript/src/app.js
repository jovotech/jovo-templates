'use strict';

// ------------------------------------------------------------------
// APP INITIALIZATION
// ------------------------------------------------------------------

const { App } = require('jovo-framework');
const { Autopilot } = require('jovo-platform-twilioautopilot');
const { JovoDebugger } = require('jovo-plugin-debugger');
const { FileDb } = require('jovo-db-filedb');

const app = new App();

app.use(
    new Autopilot(),
    new JovoDebugger(),
    new FileDb(),
);

const twilio = require('twilio');
const twilioClient = new twilio('<your-account-sid>', '<your-auth-token>');

// ------------------------------------------------------------------
// APP LOGIC
// ------------------------------------------------------------------

app.setHandler({
    LAUNCH() {
        return this.ask('Do you want me to send you the details with a SMS?');
    },

    YesIntent() {
        const request = this.$request.toJSON();

        if (request.Channel === 'voice' || request.Channel === 'sms') {
            twilioClient.studio.v1.flows('<your-flow-id>')
                .executions.create(
                    {
                        to: this.$request.getUserId(),
                        from: '<your-twilio-phone-number>',
                    }
                ).then(function (execution) {
                    console.log(execution);
                }).catch((error) => {
                    console.log(error);
                });

            return this.tell('done');
        } else {
            return this.tell('I am sorry, I need your phone number to send a SMS which I can only access on the voice or sms channel.');
        }
    },

    NoIntent() {
        return this.tell('Ok, maybe next time');
    },
});

module.exports.app = app;
