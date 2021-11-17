import { Twilio } from 'twilio';
import { App } from 'jovo-framework';
import { Autopilot } from 'jovo-platform-twilioautopilot';
import { JovoDebugger } from 'jovo-plugin-debugger';
import { FileDb } from 'jovo-db-filedb';

console.log('This template uses an outdated version of the Jovo Framework. We strongly recommend upgrading to Jovo v4. Learn more here: https://www.jovo.tech/docs/migration-from-v3');

// ------------------------------------------------------------------
// APP INITIALIZATION
// ------------------------------------------------------------------

const app = new App();

app.use(new Autopilot(), new JovoDebugger(), new FileDb());

const twilioClient = new Twilio('<your-account-sid>', '<your-auth-token>'); // ToDo: Add your own Account Data here.

// ------------------------------------------------------------------
// APP LOGIC
// ------------------------------------------------------------------

app.setHandler({
  LAUNCH() {
    return this.ask('Do you want me to send you the details with a SMS?');
  },

  YesIntent() {
    const request = this.$request!.toJSON();

    if (request.Channel === 'voice' || request.Channel === 'sms') {
      twilioClient.studio.v1
        .flows('<your-flow-id>') // ToDo: Add your own ID here.
        .executions.create({
          to: this.$request!.getUserId(),
          from: '<your-twilio-phone-number>', // ToDo: Add your own phone number here.
        })
        .then((execution: any) => {
          console.log(execution);
        })
        .catch((error: any) => {
          console.log(error);
        });

      return this.tell('Done!');
    } else {
      return this.tell(
        'I am sorry, I need your phone number to send a SMS which I can only access on the voice or sms channel.'
      );
    }
  },

  NoIntent() {
    return this.tell('Ok, maybe next time');
  },
});

export { app };
