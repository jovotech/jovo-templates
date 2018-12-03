
const { App, Util } = require('jovo-framework');
const { GoogleAssistant } = require('jovo-platform-googleassistant');
const { Alexa } = require('jovo-platform-alexa');
const { JovoDebugger } = require('jovo-plugin-debugger');
const { FileDb } = require('jovo-db-filedb');

const app = new App();
Util.consoleLog();

app.use(
    new GoogleAssistant(),
    new Alexa(),
    new JovoDebugger(),
    new FileDb(),
);

const song = 'https://s3.amazonaws.com/jovo-songs/song1.mp3';

app.setHandler({
    LAUNCH() {
        this.$googleAction.showSuggestionChips(['Stop', 'Pause']);
        this.$googleAction.audioPlayer().play(song, 'First song');
        this.ask('How do you like my new song?');
    },
    AUDIOPLAYER: {
        /**
         * Gets triggered, if the session is still active (audio started with ask() instead of tell()) and the song is finished
         */
        'GoogleAction.Finished'() {
            this.tell('The end');
        },
    },
});


module.exports.app = app;