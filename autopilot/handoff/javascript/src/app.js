'use strict';

const { App } = require('jovo-framework');
const { Autopilot } = require('jovo-platform-twilioautopilot');
const { JovoDebugger } = require('jovo-plugin-debugger');
const { FileDb } = require('jovo-db-filedb');

console.log('This template uses an outdated version of the Jovo Framework. We strongly recommend upgrading to Jovo v4. Learn more here: https://www.jovo.tech/docs/migration-from-v3');

// ------------------------------------------------------------------
// APP INITIALIZATION
// ------------------------------------------------------------------

const app = new App();

app.use(
  new Autopilot(),
  new JovoDebugger(),
  new FileDb(),
);

// ------------------------------------------------------------------
// APP LOGIC
// ------------------------------------------------------------------

app.setHandler({
  LAUNCH() {
    return this.ask('Do you want me to hand over the conversation to a human?');
  },

  YesIntent() {
    const request = this.$request.toJSON();

    if (request.Channel !== 'voice') {
      return this.tell('I am sorry, the handoff feature is only supported for voice channels.');
    } else {
      return this.$autopilotBot.setActions([
        {
          handoff: {
            channel: 'voice',
            uri: 'taskrouter://<your-workflow-id>', // ToDo: Add your Workflow ID here.
          },
        },
      ]);
    }
  },

  NoIntent() {
    return this.tell('Ok, maybe next time');
  },
});

module.exports = { app };
