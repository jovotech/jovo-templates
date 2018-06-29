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
        /*
        Checks if there is an access token. 
        No access token -> Ask the user to sign in
        If there is one -> API call to access user data 
        */
        if (!this.getAccessToken()) {
            this.alexaSkill().showAccountLinkingCard();
            this.tell(`Hey ${name.value}, please link your account`);
        } else {
            let token = this.getAccessToken();
            console.log(token);
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
    },
});

module.exports.app = app;
