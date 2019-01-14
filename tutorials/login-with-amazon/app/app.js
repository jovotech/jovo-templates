'use strict';

console.log('This template uses an outdated version of the Jovo Framework. Please update your Jovo CLI to the latest version. Learn more here: https://www.jovo.tech/docs/installation/v1-migration');

// =================================================================================
// App Configuration
// =================================================================================

const {App} = require('jovo-framework');
const request = require('request');

const config = {
    logging: true,
};

const app = new App(config);


// =================================================================================
// App Logic
// =================================================================================

app.setHandler({
    'LAUNCH': function() {
        this.toIntent('HelloWorldIntent');
    },

    'HelloWorldIntent': function() {
        this.ask('Hello World! What\'s your name?', 'Please tell me your name.');
    },

    'MyNameIsIntent': function(name) {
        if (!this.getAccessToken()) {
            this.alexaSkill().showAccountLinkingCard();
            this.tell('Please your link your Account');
        }
        else {
            let url = 'https://api.amazon.com/user/profile?access_token=' + this.getAccessToken();
            request(url, (error, response, body) => {
                if (!error && response.statusCode === 200){
                              
                    let data = JSON.parse(body); // Store the data we got from the API request
                    /*
                    * Depending on your scope you have access to the following data:
                    * data.user_id : "amzn1.account.XXXXYYYYZZZ"
                    * data.email : "email@jovo.tech"
                    * data.name : "Kaan Kilic"
                    * data.postal_code : "12345"
                    */
                    this.tell(data.name + ', ' + data.email); // Output: Kaan Kilic, email@jovo.tech
                }
            });
        }    
    },
});

module.exports.app = app;
