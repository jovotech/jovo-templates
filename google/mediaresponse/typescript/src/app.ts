import { App } from 'jovo-framework';
import { JovoDebugger } from 'jovo-plugin-debugger';
import { FileDb } from 'jovo-db-filedb';
import { GoogleAssistant } from 'jovo-platform-googleassistant';

console.log('This template uses an outdated version of the Jovo Framework. We strongly recommend upgrading to Jovo v4. Learn more here: https://www.jovo.tech/docs/migration-from-v3');

// ------------------------------------------------------------------
// APP INITIALIZATION
// ------------------------------------------------------------------

const app = new App();

// prettier-ignore
app.use(
  new GoogleAssistant(),
  new JovoDebugger(),
  new FileDb(),
);

// ------------------------------------------------------------------
// APP LOGIC
// ------------------------------------------------------------------

const song = 'https://s3.amazonaws.com/jovo-songs/song1.mp3';

app.setHandler({
  LAUNCH() {
    if (this.$googleAction) {
      this.$googleAction.showSuggestionChips(['Stop', 'Pause']);
      if (this.$googleAction && this.$googleAction.$mediaResponse) {
        this.$googleAction.$mediaResponse.play(song, 'First song');
      }
      this.ask('How do you like my new song?');
    }
  },
  AUDIOPLAYER: {
    /**
     * Gets triggered if the session is still active (audio started with ask() instead of tell()) and the song is finished
     */
    'GoogleAction.Finished'() {
      this.tell('The end');
    },
  },
});

export { app };
