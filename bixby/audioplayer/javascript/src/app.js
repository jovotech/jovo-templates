'use strict';

const { App } = require('jovo-framework');
const { Alexa } = require('jovo-platform-alexa');
const { GoogleAssistant } = require('jovo-platform-googleassistant');
const { Bixby } = require('jovo-platform-bixby');
const { JovoDebugger } = require('jovo-plugin-debugger');
const { FileDb } = require('jovo-db-filedb');

console.log('This template uses an outdated version of the Jovo Framework. We strongly recommend upgrading to Jovo v4. Learn more here: https://www.jovo.tech/docs/migration-from-v3');

// ------------------------------------------------------------------
// APP INITIALIZATION
// ------------------------------------------------------------------

const app = new App();

app.use(
  new Alexa(),
  new GoogleAssistant(),
  new Bixby(),
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

  PlayAudioIntent() {
    this.$bixbyCapsule.$audioPlayer.play({
      title: 'Example Audio',
      stream: { url: 'https://s3.amazonaws.com/jovo-songs/song1.mp3' },
    });
  },

  AUDIOPLAYER: {
    'BixbyCapsule.AudioPlaying'() {
      console.log('BixbyCapsule.AudioPlaying');

      this.tell('Playing audio.');
    },
  },
});

module.exports = { app };
