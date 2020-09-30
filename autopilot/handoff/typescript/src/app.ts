import { App } from 'jovo-framework';
import { Autopilot } from 'jovo-platform-twilioautopilot';
import { JovoDebugger } from 'jovo-plugin-debugger';
import { FileDb } from 'jovo-db-filedb';

// ------------------------------------------------------------------
// APP INITIALIZATION
// ------------------------------------------------------------------

const app = new App();

// prettier-ignore
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
    const request = this.$request!.toJSON();

    if (request.Channel !== 'voice') {
      return this.tell('I am sorry, the handoff feature is only supported for voice channels.');
    } else {
      return this.$autopilotBot!.setActions([
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

export { app };
