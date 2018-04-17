'use strict';

// =================================================================================
// App Configuration
// =================================================================================

const {App} = require('jovo-framework');

const config = {
    logging: true,
    intentMap: {
        'AMAZON.PauseIntent': 'PauseIntent',
        'AMAZON.ResumeIntent': 'ResumeIntent',
    },
};

const app = new App(config);

const song = 'https://s3.amazonaws.com/jovo-songs/song1.mp3';

// =================================================================================
// App Logic
// =================================================================================

app.setHandler({
    'LAUNCH': function() {
        this.toIntent('PlayIntent');
    },

    'PlayIntent': function() {
        this.alexaSkill().audioPlayer().setOffsetInMilliseconds(0)
            .play(song, 'token')
            .tell('Hello World!');
    },

    'PauseIntent': function() {
        this.alexaSkill().audioPlayer().stop();

        // Save offset to database
        this.user().data.offset = this.alexaSkill().audioPlayer().getOffsetInMilliseconds();

        this.tell('Paused!');
    },

    'ResumeIntent': function() {
        this.alexaSkill().audioPlayer().setOffsetInMilliseconds(this.user().data.offset)
            .play(song, 'token')
            .tell('Resuming!');
    },


    'AUDIOPLAYER': {
        'AudioPlayer.PlaybackStarted': function() {
            console.log('AudioPlayer.PlaybackStarted');
            this.endSession();
        },

        'AudioPlayer.PlaybackNearlyFinished': function() {
            console.log('AudioPlayer.PlaybackNearlyFinished');
            this.endSession();
        },

        'AudioPlayer.PlaybackFinished': function() {
            console.log('AudioPlayer.PlaybackFinished');
            this.alexaSkill().audioPlayer().stop();
            this.endSession();
        },

        'AudioPlayer.PlaybackStopped': function() {
            console.log('AudioPlayer.PlaybackStopped');
            this.endSession();
        },

    },
});

module.exports.app = app;
