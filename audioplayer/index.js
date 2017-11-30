'use strict';

// =================================================================================
// App Configuration
// =================================================================================

const app = require('jovo-framework').Jovo;
const webhook = require('jovo-framework').Webhook;

let audioPlayer;

app.setConfig({
    requestLogging: true;
    intentMap: {
        'AMAZON.PauseIntent': 'PauseIntent',
        'AMAZON.ResumeIntent': 'ResumeIntent',
    }
});

// Listen for post requests
webhook.listen(3000, function() {
    console.log('Local development server listening on port 3000.');
});

webhook.post('/webhook', function(req, res) {
    app.handleRequest(req, res, handlers);
    audioPlayer = app.alexaSkill().audioPlayer();
    app.execute();
});


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
