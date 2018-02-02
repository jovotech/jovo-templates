'use strict';

// =================================================================================
// App Configuration
// =================================================================================

const app = require('jovo-framework').Jovo;
const webhook = require('jovo-framework').WebhookVerified;

app.setConfig({
    requestLogging: true,
});

// Listen for post requests
webhook.listen(process.env.PORT || 3000, function() {
    console.log('Local development server listening on port ' + process.env.PORT + '.');
});

webhook.post('/webhook', function(req, res) {
    app.handleRequest(req, res, handlers);
    app.execute();
});


// =================================================================================
// App Logic
// =================================================================================

const handlers = {

    'LAUNCH': function() {
        app.toIntent('HelloWorldIntent');
    },

    'HelloWorldIntent': function() {
        app.tell('Hello World!');
    },
};
