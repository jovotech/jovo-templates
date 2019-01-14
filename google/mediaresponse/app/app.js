'use strict';

console.log('This template uses an outdated version of the Jovo Framework. Please update your Jovo CLI to the latest version. Learn more here: https://www.jovo.tech/docs/installation/v1-migration');

// =================================================================================
// App Configuration
// =================================================================================

const {App} = require('jovo-framework');

const config = {
    logging: true,
};

const app = new App(config);

const song = 'https://s3.amazonaws.com/jovo-songs/song1.mp3';

// =================================================================================
// App Logic
// =================================================================================

app.setHandler({
    'LAUNCH': function() {
        this.googleAction().audioPlayer().play(song, 'First song');
        this.googleAction().showSuggestionChips(['Stop', 'Pause']);
        this.ask('How do you like my new song?');
    },
    'AUDIOPLAYER': {
        /**
         * Gets triggered, if the session is still active (audio started with ask() instead of tell()) and the song is finished
         */
        'GoogleAction.Finished': function() {
            this.tell('The end');
        },
    },
});

module.exports.app = app;
