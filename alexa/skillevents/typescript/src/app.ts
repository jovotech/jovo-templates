import { App } from 'jovo-framework';
import { Alexa } from 'jovo-platform-alexa';
import { JovoDebugger } from 'jovo-plugin-debugger';
import { FileDb } from 'jovo-db-filedb';

// ------------------------------------------------------------------
// APP INITIALIZATION
// ------------------------------------------------------------------

const app = new App();

app.use(
  new Alexa(),
  new JovoDebugger(),
  new FileDb(),
);

// ------------------------------------------------------------------
// APP LOGIC
// ------------------------------------------------------------------

app.setHandler({
  LAUNCH() {
    return this.toIntent('HelloWorldIntent');
  },

  HelloWorldIntent() {
    this.ask("Hello World! What's your name?", 'Please tell me your name.');
  },

  MyNameIsIntent() {
    this.tell('Hey ' + this.$inputs.name.value + ', nice to meet you!');
  },

  ON_EVENT: {
    SkillEnabled() {
      console.log('SkillEnabled');
    },
    SkillDisabled() {
      console.log('SkillDisabled');
    },
    SkillAccountLinked() {
      console.log('SkillAccountLinked');
    },
    SkillPermissionAccepted() {
      console.log('SkillPermissionAccepted');
    },
    SkillPermissionChanged() {
      console.log('SkillPermissionChanged');
    },
  },
});

export { app };
