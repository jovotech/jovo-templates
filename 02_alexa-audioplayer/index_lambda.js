'use strict';

// =================================================================================
// App Configuration
// =================================================================================

const app = require('jovo-framework').Jovo;

let audioPlayer;

app.setConfig({
    requestLogging: true;
    intentMap: {
        'AMAZON.PauseIntent': 'PauseIntent',
        'AMAZON.ResumeIntent': 'ResumeIntent',
    },
    db: {
        type: 'dynamodb',
        tableName: 'AudioPlayerTable',
    }
});

exports.handler = function(event, context, callback) {
    app.handleRequest(event, callback, handlers);
    audioPlayer = app.alexaSkill().audioPlayer();
    app.execute();
};


// =================================================================================
// App Logic
// =================================================================================

const handlers = {

    'LAUNCH': function() {
        app.toIntent('PlayIntent');
    },

    'PlayIntent': function() {
        audioPlayer.setOffsetInMilliseconds(0)
            .play('url', 'token')
            .tell('Hello World!');
    },

    'PauseIntent': function() {
        audioPlayer.stop();

        // Save offset to database
        app.user().data.offset = audioPlayer.getOffsetInMilliseconds();

        app.tell('Paused!');
    },

    'ResumeIntent': function() {
        audioPlayer.setOffsetInMilliseconds(app.user().data.offset)
            .play('url', 'token')
            .tell('Resuming!');
    },


    'AUDIOPLAYER': {
        'AudioPlayer.PlaybackStarted': function() {
            console.log('AudioPlayer.PlaybackStarted');
            app.endSession();
        },

        'AudioPlayer.PlaybackNearlyFinished': function() {
            console.log('AudioPlayer.PlaybackNearlyFinished');
            app.endSession();
        },

        'AudioPlayer.PlaybackFinished': function() {
            console.log('AudioPlayer.PlaybackFinished');
            audioPlayer.stop();
            app.endSession();
        },

        'AudioPlayer.PlaybackStopped': function() {
            console.log('AudioPlayer.PlaybackStopped');
            app.endSession();
        },

    },
};
