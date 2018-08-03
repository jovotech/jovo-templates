'use strict';

const {Webhook} = require('jovo-framework');
const {app} = require('./app/app.js');
const {VueStorefrontApi, Authentication, inMemoryAuthenticationPersistence} = require('voicecommerce');

// =================================================================================
// Server Configuration
// =================================================================================

if (app.isWebhook()) {
    const port = process.env.PORT || 3000;
    Webhook.listen(port, () => {
        console.log(`Example server listening on port ${port}!`);
    });

    const api = new VueStorefrontApi({ endpoint: 'https://demo.vuestorefront.io' });
    const authentication = new Authentication(inMemoryAuthenticationPersistence);

    // Fill in the client secrets from Account Linking config in Alexa/Assistant console
    const oauthConfig = {
        clients: [{
            clientId: 'XXXXXX',
            clientSecret: 'XXXXXX',
            redirectUris: ['XXXXX']
        }]
    };

    Webhook.use('/oauth', authentication.oauthHandler(api, oauthConfig));

    Webhook.post('/webhook', (req, res) => {
        app.handleWebhook(req, res);
    });
}

exports.handler = (event, context, callback) => {
    app.handleLambda(event, context, callback);
};

