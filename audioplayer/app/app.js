'use strict';

// =================================================================================
// App Configuration
// =================================================================================

const {App} = require('jovo-framework');

const config = {
    logging: true,
    intentMap: {
        'AMAZON.PauseIntent': 'PauseIntent',
        'AMAZON.ResumeIntent': 'ResumeIntent'
    }
};

const app = new App(config);

// =================================================================================
// App Logic
// =================================================================================

app.setHandler({
    'NEW_SESSION': function() {
        let audioPlayer = this.alexaSkill().audioPlayer();
        this.toIntent('PlayIntent');
    },

    'PlayIntent': function() {
        audioPlayer.setOffsetInMilliseconds(0)
            .play('url', 'token')
            .tell('Hello World!');
    },

    'PauseIntent': function() {
        audioPlayer.stop();

        // Save offset to database
        this.user().data.offset = audioPlayer.getOffsetInMilliseconds();

        this.tell('Paused!');
    },

    'ResumeIntent': function() {
        audioPlayer.setOffsetInMilliseconds(this.user().data.offset)
            .play('url', 'token')
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
            audioPlayer.stop();
            this.endSession();
        },

        'AudioPlayer.PlaybackStopped': function() {
            console.log('AudioPlayer.PlaybackStopped');
            this.endSession();
        },

    },
});

module.exports.app = app;