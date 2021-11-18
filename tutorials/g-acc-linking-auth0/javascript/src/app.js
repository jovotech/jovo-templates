'use strict';

// ------------------------------------------------------------------
// APP INITIALIZATION
// ------------------------------------------------------------------

const { App } = require('jovo-framework');
const { GoogleAssistant } = require('jovo-platform-googleassistant');
const { JovoDebugger } = require('jovo-plugin-debugger');
const { FileDb } = require('jovo-db-filedb');
const rp = require('request-promise');

console.log('This template uses an outdated version of the Jovo Framework. We strongly recommend upgrading to Jovo v4. Learn more here: https://www.jovo.tech/docs/migration-from-v3');

const app = new App();

app.use(
    new GoogleAssistant(),
    new JovoDebugger(),
    new FileDb()
);


// ------------------------------------------------------------------
// APP LOGIC
// ------------------------------------------------------------------

app.setHandler({
    async LAUNCH() {
        if (!this.$request.getAccessToken()) {
            this.showAccountLinkingCard();
        } else {
            this.tell('You are already logged in!');
        }
    },
    async ON_SIGN_IN() {
        if (this.$googleAction.getSignInStatus() === 'OK') {
            let token = this.$request.getAccessToken();
            let options = {
                method: 'GET',
                uri: 'https://jovo-blog.auth0.com/userinfo', // You can find your URL on Client --> Settings --> 
                // Advanced Settings --> Endpoints --> OAuth User Info URL
                headers: {
                    authorization: 'Bearer ' + token,
                }
            };

            await rp(options).then((body) => {
                let data = JSON.parse(body);
                /*
                To see how the user data was stored,
                go to Auth -> Users -> Click on the user you authenticated earlier -> Raw JSON
                */
                this.tell(data.name + ', ' + data.email); // Output: Kaan Kilic, email@jovo.tech
            });
        } else {
            this.tell('There was an error. We could not sign in you in.');
        }
    }
});


module.exports.app = app;
