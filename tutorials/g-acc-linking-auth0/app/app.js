'use strict';

// =================================================================================
// App Configuration
// =================================================================================

const { App } = require('jovo-framework');
const request = require('request');

const config = {
    logging: true,
};

const app = new App(config);


// =================================================================================
// App Logic
// =================================================================================

app.setHandler({
    'LAUNCH': function () {
        this.toIntent('HelloWorldIntent');
    },

    'HelloWorldIntent': function () {
        this.ask('Hello World! What\'s your name?', 'Please tell me your name.');
    },

    'MyNameIsIntent': function (name) {
        if (!this.getAccessToken()) {
            this.googleAction().showAccountLinkingCard();
        } else {
            this.tell(`Hey ${name.value}`)
        }
    },
    'ON_SIGN_IN': function() {
        if (this.googleAction().getSignInStatus() === 'OK') {
            let token = this.getAccessToken();
            let options = {
                method: 'GET',
                url: 'https://jovo-test.auth0.com/userinfo', // You can find your URL on Client --> Settings --> 
                // Advanced Settings --> Endpoints --> OAuth User Info URL
                headers: {
                    authorization: 'Bearer ' + token,
                }
            };

            // API request
            request(options, (error, response, body) => {
                if (!error && response.statusCode === 200) {
                    var data = JSON.parse(body); // Store the data we got from the API request
                    console.log(data);
                    /*
                    To see how the user data was stored,
                    go to Auth -> Users -> Click on the user you authenticated earlier -> Raw JSON
                    */
                    this.tell('Hi, ' + data.given_name);
                } else {
                    this.tell('Error');
                }
            });
        }
    }
});

module.exports.app = app;
